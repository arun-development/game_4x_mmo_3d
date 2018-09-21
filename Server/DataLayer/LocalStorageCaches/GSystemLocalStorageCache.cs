using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IGSystemLocalStorageCache :
        ILocalStorageCache
        <g_system, int, GSystemDataModel,
            GSystemLocalStorageItem>
    {
    }

    public class GSystemLocalStorageCache :
        BaseLocalStorageCache<g_system, int, GSystemDataModel,
            GSystemLocalStorageItem>, IGSystemLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<GSystemLocalStorageItem>> __storage;
        private static bool __initialized;

        public GSystemLocalStorageCache(IGSystemRepository repository) : base(repository)
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

        protected override ConcurrentDictionary<int, Lazy<GSystemLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}