using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Interfaces.UserServices;
using Server.Core.StaticData;
using Server.Extensions;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IGetOrAddSerchCache<TKey, TVal, in TCahe>
    {
        TVal GetOrAdd(IDbConnection connection, TKey authId, TCahe cache);
    }

    public interface ISerchPkCache<TKey, TVal, in TCahe> : IClenableStorage, IRefreshCache, IGetCount, IIsInitialized
    {
        Dictionary<TKey, TVal> TryFind(IDbConnection connection, TKey partName, TCahe cache);
        List<TKey> GetAllKeys(IDbConnection connection, TCahe cache);
        TVal TryGetValue(IDbConnection connection, TKey key, TCahe cache);

        bool TryUpdateKey(IDbConnection connection, TVal pkId, TKey oldKeyName, TKey newKeyName, TCahe cache,
            bool updateParentCahce = true);

        TVal AddOrUpdate(IDbConnection connection, TKey key, TVal val, TCahe cache);
    }

    #region User

    public interface IUserAuthToGameCache : ISerchPkCache<string, int, IUserLocalStorageCache>,
        IGetOrAddSerchCache<string, int, IUserLocalStorageCache>
    {
        void Delete(string authId);
    }

    public class AuthToGameCache : IUserAuthToGameCache
    {
        #region Declare

        private static ConcurrentDictionary<string, int> _storage;
        private static IUserLocalStorageCache _cache;

        #endregion

        #region Interface

        public int GetOrAdd(IDbConnection connection, string authId, IUserLocalStorageCache cache)
        {
            _checkAndInit(connection, cache);
            int val;
            _storage.TryGetValue(authId, out val);
            if (val != 0)
            {
                return val;
            }
            var cacheUser = cache.LocalOperation(connection, col => col.FirstOrDefault(i => i.AuthId == authId));
            if (cacheUser != null && cacheUser.Id != 0)
            {
                return _storage.AddOrUpdateSimple(cacheUser.AuthId, cacheUser.Id);
            }
            var repo = cache.GetRepository();
            var tableName = repo.SchemeTableName;
            var sql = $"SELECT TOP(1) * FROM {tableName} WHERE authId=@authId";
            var user = repo.Provider.Text<user>(connection, sql, new { authId }).ToList();
            if (user.Any())
            {
                var u = user.First();
                cache.UpdateLocalItem(connection, repo.ConvertToWorkModel(u));
                return _storage.AddOrUpdateSimple(u.authId, u.Id);
            }
            return 0;
        }

        [Obsolete]
        public Dictionary<string, int>
            TryFind(IDbConnection connection, string partName, IUserLocalStorageCache cache) =>
            throw new NotImplementedException();

        public List<string> GetAllKeys(IDbConnection connection, IUserLocalStorageCache cache)
        {
            _checkAndInit(connection, cache);
            return _storage.GetKeys();
        }

        public int TryGetValue(IDbConnection connection, string authId, IUserLocalStorageCache cache)
        {
            _checkAndInit(connection, cache);
            int id;
            _storage.TryGetValue(authId, out id);
            return id;
        }
        [Obsolete]
        public bool TryUpdateKey(IDbConnection connection, int pkId, string oldKeyName, string newKeyName,
            IUserLocalStorageCache cache, bool updateParentCahce = true) => throw new NotImplementedException();

        public int AddOrUpdate(IDbConnection connection, string authId, int userId, IUserLocalStorageCache cache)
        {
            _checkAndInit(connection, cache);
            return _storage.AddOrUpdateSimple(authId, userId);
        }

        public bool IsInitialized() => _storage != null;


        public void ClearStorage()
        {
            _storage?.Clear();
        }
        public void Delete(string authId)
        {
            if (_storage == null)
            {
                return;
            }
            _storage.TryRemove(authId, out _);

        }


        public void RefreshCache(IDbConnection connection)
        {
            ClearStorage();
            if (_cache != null)
            {
                GetAllKeys(connection, _cache);
            }
        }

        public int GetCount()
        {
            if (_storage == null)
            {
                return 0;
            }
            return _storage.GetCount();
        }

        #endregion

        private void _checkAndInit(IDbConnection connection, IUserLocalStorageCache cache)
        {
            if (!Equals(_cache, cache))
            {
                _cache = cache;
            }
            if (_storage == null)
            {
                var users = cache.LocalGetAll(connection);
                if (users != null && users.Any())
                {
                    _storage = new ConcurrentDictionary<string, int>(users.ToDictionary(i => i.AuthId, i => i.Id));
                }
                else
                {
                    _storage = new ConcurrentDictionary<string, int>();
                }
            }
        }
    }

    public interface IUserNameSercherPkCache : ISerchPkCache<string, int, IUserLocalStorageCache>,
        IGetOrAddSerchCache<string, int, IUserLocalStorageCache>
    {
        void Delete(string userName);
    }

    public class UserNameSercherPkCache : IUserNameSercherPkCache
    {
        #region Declare

        private static ConcurrentDictionary<string, int> _storage;
        private static IUserLocalStorageCache _cache;

        #endregion

        #region Interface

        public List<string> GetAllKeys(IDbConnection connection, IUserLocalStorageCache cache)
        {
            _checkAndInit(connection, cache);
            return _storage.Select(i => i.Key).ToList();
        }

        public Dictionary<string, int> TryFind(IDbConnection connection, string partName, IUserLocalStorageCache cache)
        {
            if (string.IsNullOrWhiteSpace(partName))
            {
                throw new NullReferenceException(nameof(partName));
            }
            var keys = GetAllKeys(connection, cache);
            var contain = keys.Where(i => i.IndexOf(partName, StringComparison.OrdinalIgnoreCase) != -1).ToList();
            var result = new Dictionary<string, int>();
            foreach (var i in contain)
            {
                int id;
                _storage.TryGetValue(i, out id);
                result.Add(i, id);
            }
            return result;
        }


        public int TryGetValue(IDbConnection connection, string userName, IUserLocalStorageCache cache)
        {
            _checkAndInit(connection, cache);
            int id;
            _storage.TryGetValue(userName, out id);
            return id;
        }

        public bool TryUpdateKey(IDbConnection connection, int userId, string oldUserName, string newUserName,
            IUserLocalStorageCache cache, bool updateParentCahce = true)
        {
            _checkAndInit(connection, cache);
            int id;
            if (!_storage.TryUpdateKey(oldUserName, newUserName, out id))
            {
                return false;
            }
            if (!updateParentCahce)
            {
                return true;
            }
            var user = cache.GetById(connection, id, true);
            user.Nickname = newUserName;
            var result = cache.UpdateLocalItem(connection, user);
            return result.Nickname == newUserName;
        }


        public void ClearStorage()
        {
            _storage?.Clear();
        }


        public void RefreshCache(IDbConnection connection)
        {
            ClearStorage();
            if (_cache != null)
            {
                GetAllKeys(connection, _cache);
            }
        }

        public int GetOrAdd(IDbConnection connection, string userName, IUserLocalStorageCache cache)
        {
            _checkAndInit(connection, cache);
            int val;
            _storage.TryGetValue(userName, out val);
            if (val != 0)
            {
                return val;
            }
            var cacheUser = cache.LocalOperation(connection, col => col.FirstOrDefault(i => i.Nickname == userName));
            if (cacheUser != null && cacheUser.Id != 0)
            {
                return _storage.AddOrUpdateSimple(cacheUser.Nickname, cacheUser.Id);
            }
            var repo = cache.GetRepository();
            var tableName = repo.SchemeTableName;
            var sql = $"SELECT TOP(1) * FROM {tableName} WHERE nickname=@userName";
            var user = repo.Provider.Text<user>(connection, sql, new { userName }).Single();
            cache.UpdateLocalItem(connection, repo.ConvertToWorkModel(user));
            return _storage.AddOrUpdateSimple(user.authId, user.Id);
        }

        public void Delete(string userName)
        {
            if (_storage == null)
            {
                return;
            }
            _storage.TryRemove(userName, out _);

        }

        public int AddOrUpdate(IDbConnection connection, string authId, int userId, IUserLocalStorageCache cache)
        {
            _checkAndInit(connection, cache);
            return _storage.AddOrUpdateSimple(authId, userId);
        }

        public bool IsInitialized() => _storage != null;

        public int GetCount()
        {
            if (_storage == null)
            {
                return 0;
            }
            return _storage.GetCount();
        }

        #endregion

        private void _checkAndInit(IDbConnection connection, IUserLocalStorageCache cache)
        {
            if (!Equals(_cache, cache))
            {
                _cache = cache;
            }
            if (_storage == null)
            {
                var users = cache.LocalGetAll(connection);
                if (users != null && users.Any())
                {
                    _storage = new ConcurrentDictionary<string, int>(users.ToDictionary(i => i.Nickname, i => i.Id));
                }
                else
                {
                    _storage = new ConcurrentDictionary<string, int>();
                }
            }
        }
    }

    public class AllianceNameSerchItem : IAllianceNameSerchItem
    {
        #region Declare

        #region  Fields

        public int Id { get; set; }
        public string Name { get; set; }
        public bool Disbandet { get; set; }

        #endregion

        #endregion
    }

    public interface
        IAlianceNameSercherPkCache : ISerchPkCache<string, IAllianceNameSerchItem, IAllianceLocalStorageCache>
    {
        Dictionary<string, IAllianceNameSerchItem> GetAll(IDbConnection connection, IAllianceLocalStorageCache cache);
        bool RemoveItem(IDbConnection connection, string allianceName, IAllianceLocalStorageCache cache);
    }

    public class AlianceNameSercherPkCache : IAlianceNameSercherPkCache
    {
        #region Declare

        private static ConcurrentDictionary<string, IAllianceNameSerchItem> _storage;
        private static IAllianceLocalStorageCache _cache;

        #endregion

        #region Interface

        public Dictionary<string, IAllianceNameSerchItem> TryFind(IDbConnection connection, string partName,
            IAllianceLocalStorageCache cache)
        {
            if (string.IsNullOrWhiteSpace(partName))
            {
                throw new NullReferenceException(nameof(partName));
            }
            var keys = GetAllKeys(connection, cache);
            var contain = keys.Where(i => i.IndexOf(partName, StringComparison.OrdinalIgnoreCase) != -1).ToList();
            var result = new Dictionary<string, IAllianceNameSerchItem>();
            foreach (var i in contain)
            {
                IAllianceNameSerchItem val;
                _storage.TryGetValue(i, out val);
                result.Add(i, val);
            }
            return result;
        }

        public List<string> GetAllKeys(IDbConnection connection, IAllianceLocalStorageCache cache)
        {
            _checkAndInit(connection, cache);
            return _storage.Select(i => i.Key).ToList();
        }

        public IAllianceNameSerchItem TryGetValue(IDbConnection connection, string userName,
            IAllianceLocalStorageCache cache)
        {
            _checkAndInit(connection, cache);
            IAllianceNameSerchItem val;
            _storage.TryGetValue(userName, out val);
            return val;
        }

        public bool TryUpdateKey(IDbConnection connection, IAllianceNameSerchItem newVal, string oldKeyName,
            string newKeyName, IAllianceLocalStorageCache cache, bool updateParentCahce = true)
        {
            _checkAndInit(connection, cache);
            IAllianceNameSerchItem val;
            if (!_storage.TryUpdateKey(oldKeyName, newKeyName, out val))
            {
                return false;
            }
            if (!updateParentCahce)
            {
                return true;
            }
            var alliane = cache.GetById(connection, newVal.Id, true);
            alliane.Name = newKeyName;
            var result = cache.UpdateLocalItem(connection, alliane);
            return result.Name == newKeyName;
        }

        public IAllianceNameSerchItem AddOrUpdate(IDbConnection connection, string allianceName,
            IAllianceNameSerchItem val, IAllianceLocalStorageCache cache)
        {
            _checkAndInit(connection, cache);
            return _storage.AddOrUpdateSimple(allianceName, val);
        }

        public bool IsInitialized() => _storage != null;

        public Dictionary<string, IAllianceNameSerchItem> GetAll(IDbConnection connection,
            IAllianceLocalStorageCache cache)
        {
            _checkAndInit(connection, cache);
            return _storage.Select(i => new { i.Key, i.Value }).ToDictionary(i => i.Key, i => i.Value);
        }

        public bool RemoveItem(IDbConnection connection, string allianceName, IAllianceLocalStorageCache cache)
        {
            _checkAndInit(connection, cache);
            IAllianceNameSerchItem val;
            return _storage.TryRemove(allianceName, out val);
        }


        public void ClearStorage()
        {
            _storage?.Clear();
        }


        public void RefreshCache(IDbConnection connection)
        {
            ClearStorage();

            if (_cache != null)
            {
                _checkAndInit(connection, _cache);
            }
        }

        public int GetCount()
        {
            if (_storage == null)
            {
                return 0;
            }
            return _storage.GetCount();
        }

        #endregion

        private void _checkAndInit(IDbConnection connection, IAllianceLocalStorageCache cache)
        {
            if (!Equals(_cache, cache))
            {
                _cache = cache;
            }
            if (_storage == null)
            {
                var repo = cache.GetRepository();
                var alliances = repo.GetAllModels(connection).Select(i =>
                    new AllianceNameSerchItem { Id = i.Id, Name = i.Name, Disbandet = i.Disbandet }).ToList();
                if (alliances.Any())
                {
                    var dictionary =
                        alliances.ToDictionary<AllianceNameSerchItem, string, IAllianceNameSerchItem>(a => a.Name,
                            a => a);
                    _storage = new ConcurrentDictionary<string, IAllianceNameSerchItem>(dictionary);
                }
                else
                {
                    _storage = new ConcurrentDictionary<string, IAllianceNameSerchItem>();
                }
            }
        }
    }

    #endregion


    #region World

    public interface IPlanetNameToPlanetIdPkCache : ISerchPkCache<string, int, IGDetailPlanetLocalStorageCache>,
        IGetOrAddSerchCache<string, int, IGDetailPlanetLocalStorageCache>
    {
    }

    public class PlanetNameSercherPkCache : IPlanetNameToPlanetIdPkCache
    {
        #region Declare

        private static ConcurrentDictionary<string, int> _storage;
        private static IGDetailPlanetLocalStorageCache _cache;

        #endregion

        #region Interface

        public int TryGetValue(IDbConnection connection, string planetName, IGDetailPlanetLocalStorageCache cache)
        {
            _checkAndInit(connection, cache);
            int id;
            _storage.TryGetValue(planetName, out id);
            return id;
        }

        public List<string> GetAllKeys(IDbConnection connection, IGDetailPlanetLocalStorageCache cache)
        {
            _checkAndInit(connection, cache);
            return _storage.Select(i => i.Key).ToList();
        }

        /// <summary>
        ///     обновляет значения текущего кеша и базового при обновлении
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="planetId"></param>
        /// <param name="oldName"></param>
        /// <param name="newName"></param>
        /// <param name="cache"></param>
        /// <param name="updateParentCahce"></param>
        /// <returns></returns>
        public bool TryUpdateKey(IDbConnection connection, int planetId, string oldName, string newName,
            IGDetailPlanetLocalStorageCache cache, bool updateParentCahce = true)
        {
            _checkAndInit(connection, cache);
            int id;
            if (!_storage.TryUpdateKey(oldName, newName, out id))
            {
                return false;
            }
            if (!updateParentCahce)
            {
                return true;
            }
            var planet = cache.GetById(connection, id, true);
            planet.Name = newName;
            var result = cache.UpdateLocalItem(connection, planet);
            return result.Name == newName;
        }

        public int AddOrUpdate(IDbConnection connection, string planetName, int planetId,
            IGDetailPlanetLocalStorageCache cache)
        {
            _checkAndInit(connection, cache);
            return _storage.AddOrUpdateSimple(planetName, planetId);
        }

        public bool IsInitialized() => _storage != null;


        /// <summary>
        ///     не проверяет длиннн может вернуть всe результаты
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="partName"></param>
        /// <param name="cache"></param>
        /// <returns></returns>
        public Dictionary<string, int> TryFind(IDbConnection connection, string partName,
            IGDetailPlanetLocalStorageCache cache)
        {
            if (string.IsNullOrWhiteSpace(partName))
            {
                throw new ArgumentNullException(Error.IsEmpty, nameof(partName));
            }
            var keys = GetAllKeys(connection, cache);
            var contain = keys.Where(i => i.IndexOf(partName, StringComparison.OrdinalIgnoreCase) != -1).ToList();
            var result = new Dictionary<string, int>();
            foreach (var i in contain)
            {
                int id;
                _storage.TryGetValue(i, out id);
                result.Add(i, id);
            }
            return result;
        }

        public int GetOrAdd(IDbConnection connection, string planetName, IGDetailPlanetLocalStorageCache cache)
        {
            _checkAndInit(connection, cache);
            var val = TryGetValue(connection, planetName, cache);
            if (val != 0)
            {
                return val;
            }
            var cachePlanet = cache.LocalOperation(connection, col => col.FirstOrDefault(i => i.Name == planetName));
            if (cachePlanet != null && cachePlanet.Id != 0)
            {
                return _storage.AddOrUpdateSimple(cachePlanet.Name, cachePlanet.Id);
            }
            var repo = cache.GetRepository();
            var tableName = repo.SchemeTableName;
            var sql = $"SELECT TOP(1) * FROM {tableName} WHERE name=@planetName";
            var planet = repo.Provider.Text<g_detail_planet>(connection, sql, new { planetName }).Single();

            cache.UpdateLocalItem(connection, repo.ConvertToWorkModel(planet));
            return _storage.AddOrUpdateSimple(planet.name, planet.Id);
        }


        public void ClearStorage()
        {
            _storage?.Clear();
        }

        public void RefreshCache(IDbConnection connection)
        {
            ClearStorage();
            if (_cache != null)
            {
                _checkAndInit(connection, _cache);
            }
        }

        public int GetCount()
        {
            if (_storage == null)
            {
                return 0;
            }
            return _storage.GetCount();
        }

        #endregion

        private void _checkAndInit(IDbConnection connection, IGDetailPlanetLocalStorageCache cache)
        {
            if (!Equals(_cache, cache))
            {
                _cache = cache;
            }
            if (_storage == null)
            {
                var planets = cache.LocalGetAll(connection);
                if (planets != null && planets.Any())
                {
                    _storage = new ConcurrentDictionary<string, int>(planets.ToDictionary(i => i.Name, i => i.Id));
                }
                else
                {
                    _storage = new ConcurrentDictionary<string, int>();
                }
            }
        }
    }

    public interface ISystemNameSercherPkCache : ISerchPkCache<string, int, IGDetailSystemLocalStorageCache>,
        IGetOrAddSerchCache<string, int, IGDetailSystemLocalStorageCache>
    {
    }

    public class SystemNameSercherPkCache : ISystemNameSercherPkCache
    {
        #region Declare

        private static ConcurrentDictionary<string, int> _storage;
        private static IGDetailSystemLocalStorageCache _cache;

        #endregion

        #region Interface

        public int GetOrAdd(IDbConnection connection, string systemName, IGDetailSystemLocalStorageCache cache)
        {
            var val = TryGetValue(connection, systemName, cache);
            if (val != 0)
            {
                return val;
            }
            var cacheSystem = cache.LocalOperation(connection, col => col.FirstOrDefault(i => i.Name == systemName));
            if (cacheSystem != null && cacheSystem.Id != 0)
            {
                return _storage.AddOrUpdateSimple(cacheSystem.Name, cacheSystem.Id);
            }
            var repo = cache.GetRepository();
            var tableName = repo.SchemeTableName;
            var sql = $"SELECT TOP(1) * FROM {tableName} WHERE name=@systemName";
            var system = repo.Provider.Text<g_detail_system>(connection, sql, new { systemName }).Single();
            cache.UpdateLocalItem(connection, repo.ConvertToWorkModel(system));
            return _storage.AddOrUpdateSimple(system.name, system.Id);
        }


        public Dictionary<string, int> TryFind(IDbConnection connection, string partName,
            IGDetailSystemLocalStorageCache cache)
        {
            if (string.IsNullOrWhiteSpace(partName))
            {
                throw new ArgumentNullException(Error.IsEmpty, nameof(partName));
            }
            var keys = GetAllKeys(connection, cache);
            var contain = keys.Where(i => i.IndexOf(partName, StringComparison.OrdinalIgnoreCase) != -1).ToList();
            var result = new Dictionary<string, int>();
            foreach (var i in contain)
            {
                int id;
                _storage.TryGetValue(i, out id);
                result.Add(i, id);
            }
            return result;
        }

        public List<string> GetAllKeys(IDbConnection connection, IGDetailSystemLocalStorageCache cache)
        {
            _checkAndInit(connection, cache);
            return _storage.Select(i => i.Key).ToList();
        }

        public int TryGetValue(IDbConnection connection, string systemName, IGDetailSystemLocalStorageCache cache)
        {
            _checkAndInit(connection, cache);
            int id;
            _storage.TryGetValue(systemName, out id);
            return id;
        }

        public bool TryUpdateKey(IDbConnection connection, int systemId, string oldName, string newName,
            IGDetailSystemLocalStorageCache cache, bool updateParentCahce = true)
        {
            _checkAndInit(connection, cache);
            int id;
            if (!_storage.TryUpdateKey(oldName, newName, out id))
            {
                return false;
            }
            if (!updateParentCahce)
            {
                return true;
            }
            var user = cache.GetById(connection, id, true);
            user.Name = newName;
            var result = cache.UpdateLocalItem(connection, user);
            return result.Name == newName;
        }

        public int AddOrUpdate(IDbConnection connection, string systemName, int systemId,
            IGDetailSystemLocalStorageCache cache)
        {
            _checkAndInit(connection, cache);
            return _storage.AddOrUpdateSimple(systemName, systemId);
        }

        public bool IsInitialized() => _storage != null;


        public void RefreshCache(IDbConnection connection)
        {
            ClearStorage();
            if (_cache != null)
            {
                _checkAndInit(connection, _cache);
            }
        }


        public void ClearStorage()
        {
            _storage?.Clear();
        }

        public int GetCount()
        {
            if (_storage == null)
            {
                return 0;
            }
            return _storage.GetCount();
        }

        #endregion

        private void _checkAndInit(IDbConnection connection, IGDetailSystemLocalStorageCache cache)
        {
            if (!Equals(_cache, cache))
            {
                _cache = cache;
            }
            if (_storage == null)
            {
                var systems = cache.LocalGetAll(connection);
                if (systems != null && systems.Any())
                {
                    _storage = new ConcurrentDictionary<string, int>(systems.ToDictionary(i => i.Name, i => i.Id));
                }
                else
                {
                    _storage = new ConcurrentDictionary<string, int>();
                }
            }
        }

        public Dictionary<string, int> GetAll(IDbConnection connection, IGDetailSystemLocalStorageCache cache)
        {
            _checkAndInit(connection, cache);
            return _storage.Select(i => new { i.Key, i.Value }).ToDictionary(i => i.Key, i => i.Value);
        }
    }

    #endregion
}