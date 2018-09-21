using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IGGalaxyLocalStorageCache :
        ILocalStorageCache<g_galaxy, byte, GGalaxyDataModel, GGalaxyLocalStorageItem>
    {
    }

    public class GGalaxyLocalStorageCache :
        BaseLocalStorageCache<g_galaxy, byte, GGalaxyDataModel,
            GGalaxyLocalStorageItem>, IGGalaxyLocalStorageCache
    {
        private static ConcurrentDictionary<byte, Lazy<GGalaxyLocalStorageItem>> __storage;
        private static bool __initialized;

        public GGalaxyLocalStorageCache(IGGalaxyRepository repository)
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

        protected override ConcurrentDictionary<byte, Lazy<GGalaxyLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}