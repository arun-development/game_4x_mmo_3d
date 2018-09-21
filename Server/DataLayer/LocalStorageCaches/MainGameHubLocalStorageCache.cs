using System;
using System.Collections.Concurrent;
using Server.Core.HubUserModels;
using Server.Extensions;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IMainGameHubLocalStorageCache : ILocalStorageFilter<string, ConnectionUser>,
        ILocalStorageBaseAction<string, ConnectionUser>, IGetCount
    {
        ConnectionUser GetById(string connectionId);
        ConnectionUser AddOrUpdateLocal(ConnectionUser dataModel, bool dataIsCheked);
    }

    public partial class MainGameHubLocalStorageCache : IMainGameHubLocalStorageCache
    {
        private static readonly ConcurrentDictionary<string, Lazy<ConnectionUser>> _users =
            new ConcurrentDictionary<string, Lazy<ConnectionUser>>();

        public int GetCount()
        {
            if (_users == null)
            {
                return 0;
            }
            return _users.GetCount();

        }

        public bool IsInitialized()
        {
            return true;
        }
    }
}