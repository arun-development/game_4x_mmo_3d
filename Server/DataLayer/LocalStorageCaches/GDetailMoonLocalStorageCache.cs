using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IGDetailMoonLocalStorageCache :
        ILocalStorageCache
        <g_detail_moon, int, GDetailMoonDataModel, GDetailMoonLocalStorageItem>
    {
    }

    public class GDetailMoonLocalStorageCache :
        BaseLocalStorageCache<g_detail_moon, int, GDetailMoonDataModel, GDetailMoonLocalStorageItem>,
        IGDetailMoonLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<GDetailMoonLocalStorageItem>> __storage;
        private static bool __initialized;

        public GDetailMoonLocalStorageCache(IGDetailMoonRepository repository)
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

        protected override ConcurrentDictionary<int, Lazy<GDetailMoonLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}