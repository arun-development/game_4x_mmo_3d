using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IPremiumLocalStorageCache :
        ILocalStorageCache<user_premium, int, UserPremiumDataModel, PremiumLocalStorageItem>
    {
    }

    public class PremiumLocalStorageCache :
        BaseLocalStorageCache<user_premium, int, UserPremiumDataModel,
            PremiumLocalStorageItem>, IPremiumLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<PremiumLocalStorageItem>> __storage;
        private static bool __initialized;

        public PremiumLocalStorageCache(IPremiumRepository repository)
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

        protected override ConcurrentDictionary<int, Lazy<PremiumLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}