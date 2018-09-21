using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IProductTypeLocalStorageCache :
        ILocalStorageCache
        <product_type, byte, ProductTypeDataModel, ProductTypeLocalStorageItem>
    {
    }

    public class ProductTypeLocalStorageCache :
        BaseLocalStorageCache<product_type, byte, ProductTypeDataModel,
            ProductTypeLocalStorageItem>, IProductTypeLocalStorageCache
    {
        private static ConcurrentDictionary<byte, Lazy<ProductTypeLocalStorageItem>> __storage;

        private static bool __initialized;

        public ProductTypeLocalStorageCache(IProductTypeRepository repository)
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

        protected override ConcurrentDictionary<byte, Lazy<ProductTypeLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}