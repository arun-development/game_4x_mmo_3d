using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IUserChestLocalStorageCache :
        ILocalStorageCache
        <user_chest, int, UserChestDataModel, UserChestLocalStorageItem>
    {
    }

    public class UserChestLocalStorageCache :
        BaseLocalStorageCache<user_chest, int, UserChestDataModel,
            UserChestLocalStorageItem>, IUserChestLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<UserChestLocalStorageItem>> __storage;
        private static bool __initialized;

        public UserChestLocalStorageCache(IUserChestRepository repository)
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

        protected override ConcurrentDictionary<int, Lazy<UserChestLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}