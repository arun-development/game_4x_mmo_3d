using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IUserMothershipLocalStorageCache :
        ILocalStorageCache
        <user_mothership, int, UserMothershipDataModel,
            UserMothershipLocalStorageItem>
    {
    }

    public class UserMothershipLocalStorageCache :
        BaseLocalStorageCache<user_mothership, int, UserMothershipDataModel,
            UserMothershipLocalStorageItem>, IUserMothershipLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<UserMothershipLocalStorageItem>> __storage;
        private static bool __initialized;

        public UserMothershipLocalStorageCache(IUserMothershipRepository repository)
            : base(repository)
        {
        }

        protected override bool _initialized
        {
            get => __initialized;
            set => __initialized = value;
        }

        private static bool __inProgressUpdate { get; set; }

        protected override bool _inProgressUpdate
        {
            get => __inProgressUpdate;
            set => __inProgressUpdate = value;
        }

        protected override ConcurrentDictionary<int, Lazy<UserMothershipLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}