using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IUSpyLocalStorageCache :
        ILocalStorageCache<user_spy, int, UserSpyDataModel, USpyLocalStorageItem>
    {
    }

    public class USpyLocalStorageCache : BaseLocalStorageCache<user_spy, int, UserSpyDataModel,
        USpyLocalStorageItem>, IUSpyLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<USpyLocalStorageItem>> __storage;
        private static bool __initialized;

        public USpyLocalStorageCache(IUserSpyRepository repository)
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

        protected override ConcurrentDictionary<int, Lazy<USpyLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}