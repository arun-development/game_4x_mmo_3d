using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IGTextureTypeLocalStorageCache :
        ILocalStorageCache<g_texture_type, short, GTextureTypeDataModel, GTextureTypeLocalStorageItem>
    {
    }

    public class GTextureTypeLocalStorageCache :
        BaseLocalStorageCache<g_texture_type, short, GTextureTypeDataModel,
            GTextureTypeLocalStorageItem>, IGTextureTypeLocalStorageCache
    {
        private static ConcurrentDictionary<short, Lazy<GTextureTypeLocalStorageItem>> __storage;
        private static bool __initialized;

        public GTextureTypeLocalStorageCache(IGTextureTypeRepository repository)
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

        protected override ConcurrentDictionary<short, Lazy<GTextureTypeLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}