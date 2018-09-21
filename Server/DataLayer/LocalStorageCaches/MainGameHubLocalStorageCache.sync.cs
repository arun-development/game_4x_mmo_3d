using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.HubUserModels;
using Server.Extensions;

namespace Server.DataLayer.LocalStorageCaches
{
    public partial class MainGameHubLocalStorageCache
    {
        private IEnumerable<ConnectionUser> _getCollection()
        {
            try
            {
                return _users.Select(i => i.Value.Value);
            }
            catch (ArgumentNullException)
            {
                return default(IEnumerable<ConnectionUser>);
            }

        }

        private IEnumerable<ConnectionUser> _getFilteredCollection(IEnumerable<string> keys)
        {
            return _users.Where(i => keys.Contains(i.Key)).Select(i => i.Value.Value);
        }

        public IList<ConnectionUser> LocalWhereList(IDbConnection connection, Func<ConnectionUser, bool> predicateWhere)
        {
            return LocalWhere(connection,predicateWhere).ToList();
        }

        public ConnectionUser LocalFirstOrDefault(IDbConnection connection, Func<ConnectionUser, bool> predicateWhere)
        {
            var col = _getCollection();
            return col?.FirstOrDefault(predicateWhere);
        }

        public IEnumerable<ConnectionUser> LocalWhere(IDbConnection connection, Func<ConnectionUser, bool> predicateWhere)
        {
            var col = _getCollection();
            return col?.Where(predicateWhere);
        }

        public IList<TResult> LocalWhereSelect<TResult>(IDbConnection connection, Func<ConnectionUser, bool> predicateWhere, Func<ConnectionUser, TResult> @select)
        {
            var col = LocalWhere(connection,predicateWhere);
            return col?.Select(select).ToList();
        }

        public IList<TResult> LocalSelect<TResult>(IDbConnection connection, Func<ConnectionUser, TResult> @select)
        {
            return _getCollection().Select(select).ToList();
        }
        public void DeleteItem(string connectionId)
        {
            _users.TryRemoveLazy(connectionId, out _);
        }



        public ConnectionUser GetById(string connectionId)
        {
            _users.TryGetValueLazy(connectionId, out var connectionUser);
            return connectionUser;
        }




        public TResult LocalOperation<TResult>(IDbConnection connection, Func<IEnumerable<ConnectionUser>, TResult> enumOperation)
        {
            return enumOperation(_getCollection());
        }

        public IList<ConnectionUser> LocalFilterByKey(IDbConnection connection, Func<string, bool> filter)
        {
            return _users.Where(i => filter(i.Key)).Select(i => i.Value.Value).ToList();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="connection"> не нужен? может быть null</param>
        /// <param name="enumOperation"></param>
        /// <returns></returns>
        public IList<ConnectionUser> LocalFind(IDbConnection connection, Func<string, ConnectionUser, bool> enumOperation)
        {
          return  _users.Where(i => enumOperation(i.Key, i.Value.Value)).Select(i => i.Value.Value).ToList();
        }


        public IList<ConnectionUser> LocalGetAll(IDbConnection connection)
        {
            return _users.Select(i => i.Value.Value).ToList();
        }

        public IList<ConnectionUser> LocalFlilteredByKeys(IDbConnection connection, IEnumerable<string> keys)
        {
            return _getFilteredCollection(keys).ToList();
        }

        public bool ContainAny()
        {
            return GetCount() > 0;
        }
        public IList<string> GetLocalStorageKeys(IDbConnection connection, bool storageIsCheked = false)
        {
           return _users.GetKeys();
        }

        public IList<ConnectionUser> GetDataModelItems(IDbConnection connection, IList<string> keys, bool storageIsCheked = false)
        {
            return keys.Select(GetById).ToList();
        }



        public IList<ConnectionUser> UpdateLocalItems(IDbConnection connection, IList<ConnectionUser> newChekedData)
        {
            return newChekedData.Select(i => AddOrUpdateLocal(i, true)).ToList();
        }

        public ConnectionUser UpdateLocalItem(IDbConnection connection, ConnectionUser newChekedDataData)
        {
            return AddOrUpdateLocal(newChekedDataData, true);
        }

        public void DeleteItems(IList<string> keys)
        {
 
            foreach (var i in keys) DeleteItem(i);
        }
        public int GetCount(IDbConnection connection, bool fillIfNotInitialized)
        {
            return _users.GetCount();
        }
        public void ClearStorage()
        {
            if (_users != null && GetCount() != 0)
            {
                _users.Clear();
            }
        }
        public void RefreshCache(IDbConnection connection)
        {
            throw new NotImplementedException();
        }
        public ConnectionUser AddOrUpdateLocal(ConnectionUser dataModel, bool dataIsCheked)
        {
            if (!dataIsCheked && string.IsNullOrWhiteSpace(dataModel?.ConnectionId)) return null;
            return _users.AddOrUpdateLazy(dataModel.ConnectionId, key => dataModel, (key, oldValue) => dataModel);
        }

    }
}
