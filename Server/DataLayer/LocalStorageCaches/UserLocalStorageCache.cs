using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IUserLocalStorageCache :
        ILocalStorageCache<user, int, UserDataModel, UserLocalStorageItem>
    {
    }

    public class UserLocalStorageCache :
        BaseLocalStorageCache<user, int, UserDataModel, UserLocalStorageItem>,
        IUserLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<UserLocalStorageItem>> __storage;
        private static bool __initialized;

        public UserLocalStorageCache(IUserRepository repository)
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

        protected override ConcurrentDictionary<int, Lazy<UserLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}