using System;

using System.Collections.Generic;
using System.Data;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using Server.DataLayer.LocalStorageCaches;
using Server.DataLayer.Repositories;

namespace Server.Services
{


    public interface IGameRunner
    {
        bool CahceInitialized { get; }
        int OnlineUserCount { get; }
        List<int> GetPlanetIds(IDbConnection connection);
        void OnConnected(string connectionId, int userId);
        void OnDisonnected(string connectionId, int userId);
        bool InitCaches(IDbConnection connection);
        bool ClearCaches();
        IServiceProvider ServiceProvider { get; }
    }


    public class GameRunner: IGameRunner
    {
        public GameRunner(IServiceProvider serviceProvider)
        {
            if (_svp == null)
            {
                _svp = serviceProvider;
            }
            else
            {
                throw new NotImplementedException("error in inject, class GameRunner must be singleton!");
            }

        }

        private readonly List<int> _planetIds = new List<int>();


        private static bool _cahceInitialized = false;
        private static bool _inProgress = false;

        private static readonly Dictionary<int, List<string>> _onlineUsers = new Dictionary<int, List<string>>();
        private static IServiceProvider _svp;


        public IServiceProvider ServiceProvider => _svp;


        public bool CahceInitialized => _cahceInitialized;
        public int OnlineUserCount => _onlineUsers.Count;

        public List<int> GetPlanetIds(IDbConnection connection)
        {
            var hasData = _planetIds.Any();
            if (CahceInitialized && hasData || !CahceInitialized && !hasData)
            {
                return _planetIds;
            }
            _planetIds.Clear();
            _planetIds.AddRange(ServiceProvider.GetService<IGDetailPlanetRepository>().GetAllIds(connection));
            return _planetIds;
        }

        public void OnConnected(string connectionId, int userId)
        {
            if (!_onlineUsers.ContainsKey(userId))
            {
                _onlineUsers.Add(userId, new List<string> { connectionId });
            }
            else
            {
                _onlineUsers[userId].Add(connectionId);
            }
        }

        public void OnDisonnected(string connectionId, int userId)
        {
            if (!_onlineUsers.ContainsKey(userId))
            {
                return;
            }
            List<string> users;
            _onlineUsers.TryGetValue(userId, out users);
            if (users == null || !users.Any() || !users.Contains(connectionId))
            {
                _onlineUsers.Remove(userId);
                return;
            }
            users.Remove(connectionId);
            if (!users.Any())
            {
                _onlineUsers.Remove(userId);
            }
        }


        public bool InitCaches(IDbConnection connection)
        {
            if (_inProgress)
            {
                return false;
            }
            if (_cahceInitialized)
            {
                return true;
            }
            _inProgress = true;
            _planetIds.Clear();
            ServiceProvider.GetService<IAllianceLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IAllianceFleetLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IAllianceRequestMessageLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IAllianceRoleLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IAllianceTechLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IAllianceUserLocalStorageCache>().Init(connection);
            //await di.Get<IChannelConnectionLocalStorageCache>().Init();
            //await di.Get<IChannelLocalStorageCache>().Init();
            //await di.Get<IChannelMessageLocalStorageCache>().Init();
            ServiceProvider.GetService<IGDetailMoonLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IGDetailPlanetLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IGDetailSystemLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IGGalaxyLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IGGameTypeLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IGGeometryMoonLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IGGeometryPlanetLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IGGeometryStarLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IGGeometrySystemLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IGSectorsLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IGTextureTypeLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<ICurrencyLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IProductStoreLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IProductTypeLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IUserBalanceCcLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IUserBookmarkLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IJournalBuyLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IPremiumLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<ITransicationCcLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IUMotherJumpLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IUReportLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IUserChestLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IUserLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IUserMothershipLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IUSpyLocalStorageCache>().Init(connection);
            ServiceProvider.GetService<IUTaskLocalStorageCache>().Init(connection);

            _cahceInitialized = true;
            _inProgress = false;
            return true;
        }

        public bool ClearCaches()
        {
            if (_inProgress)
            {
                return false;
            }
            if (!_cahceInitialized)
            {
                return true;
            }
            _inProgress = true;
            ServiceProvider.GetService<IAllianceLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IAllianceFleetLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IAllianceRequestMessageLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IAllianceRoleLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IAllianceTechLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IAllianceUserLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IGDetailMoonLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IGDetailPlanetLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IGDetailSystemLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IGGalaxyLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IGGameTypeLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IGGeometryMoonLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IGGeometryPlanetLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IGGeometryStarLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IGGeometrySystemLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IGSectorsLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IGSystemLocalStorageCache>().ClearStorage(); // почему то нет в ините
            ServiceProvider.GetService<IGTextureTypeLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<ICurrencyLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IProductStoreLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IProductTypeLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IUserBalanceCcLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IUserBookmarkLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IJournalBuyLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IPremiumLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<ITransicationCcLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IUMotherJumpLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IUReportLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IUserChestLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IUserLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IUserMothershipLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IUSpyLocalStorageCache>().ClearStorage();
            ServiceProvider.GetService<IUTaskLocalStorageCache>().ClearStorage();

            //advanced
 
            
            ServiceProvider.GetService<IMainGameHubLocalStorageCache>().ClearStorage(); //hub
            ServiceProvider.GetService<IUserAuthToGameCache>().ClearStorage();
            ServiceProvider.GetService<IUserNameSercherPkCache>().ClearStorage();
            ServiceProvider.GetService<IAlianceNameSercherPkCache>().ClearStorage();
            ServiceProvider.GetService<IPlanetNameToPlanetIdPkCache>().ClearStorage();
            ServiceProvider.GetService<ISystemNameSercherPkCache>().ClearStorage();
            TmpCache.ClearStorage();
            _planetIds.Clear();
            _onlineUsers.Clear();
            _cahceInitialized = false;
            _inProgress = false;
            return true;
        }
    }
}