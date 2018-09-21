using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IGDetailSystemLocalStorageCache :
        ILocalStorageCache
        <g_detail_system, int, GDetailSystemDataModel,
            GDetailSystemLocalStorageItem>
    {
    }

    public class GDetailSystemLocalStorageCache :
        BaseLocalStorageCache<g_detail_system, int, GDetailSystemDataModel,
            GDetailSystemLocalStorageItem>, IGDetailSystemLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<GDetailSystemLocalStorageItem>> __storage;
        private static bool __initialized;

        public GDetailSystemLocalStorageCache(IGDetailSystemRepository repository) : base(
            repository)
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

        protected override ConcurrentDictionary<int, Lazy<GDetailSystemLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}