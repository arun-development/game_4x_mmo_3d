using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IProductStoreLocalStorageCache :
        ILocalStorageCache
        <product_store, short, ProductStoreDataModel,
            ProductStoreLocalStorageItem>
    {
    }

    public class ProductStoreLocalStorageCache :
        BaseLocalStorageCache<product_store, short, ProductStoreDataModel,
            ProductStoreLocalStorageItem>, IProductStoreLocalStorageCache
    {
        private static ConcurrentDictionary<short, Lazy<ProductStoreLocalStorageItem>> __storage;
        private static bool __initialized;

        public ProductStoreLocalStorageCache(IProductStoreRepository repository) : base(repository)
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

        protected override ConcurrentDictionary<short, Lazy<ProductStoreLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}