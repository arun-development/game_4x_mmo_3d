using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface ICurrencyLocalStorageCache :
        ILocalStorageCache
        <currency, int, CurrencyDataModel, CurrencyLocalStorageItem>
    {
    }

    public class CurrencyLocalStorageCache :
        BaseLocalStorageCache<currency, int, CurrencyDataModel,
            CurrencyLocalStorageItem>, ICurrencyLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<CurrencyLocalStorageItem>> __storage;
        private static bool __initialized;

        public CurrencyLocalStorageCache(ICurrencyRepository repository) : base(repository)
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

        protected override ConcurrentDictionary<int, Lazy<CurrencyLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}