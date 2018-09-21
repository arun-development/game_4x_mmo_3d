using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches

{
    public interface IGDetailPlanetLocalStorageCache :
        ILocalStorageCache
        <g_detail_planet, int, GDetailPlanetDataModel,
            GDetailPlanetLocalStorageItem>
    {
    }

    public class GDetailPlanetLocalStorageCache :
        BaseLocalStorageCache<g_detail_planet, int, GDetailPlanetDataModel,
            GDetailPlanetLocalStorageItem>, IGDetailPlanetLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<GDetailPlanetLocalStorageItem>> __storage;
        private static bool __initialized;

        public GDetailPlanetLocalStorageCache(IGDetailPlanetRepository repository) : base(repository)
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

        protected override ConcurrentDictionary<int, Lazy<GDetailPlanetLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}