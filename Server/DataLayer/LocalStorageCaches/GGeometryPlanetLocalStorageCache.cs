using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IGGeometryPlanetLocalStorageCache :
        ILocalStorageCache
        <g_geometry_planet, int, GGeometryPlanetDataModel,
            GGeometryPlanetLocalStorageItem>
    {
    }

    public class GGeometryPlanetLocalStorageCache :
        BaseLocalStorageCache<g_geometry_planet, int, GGeometryPlanetDataModel,
            GGeometryPlanetLocalStorageItem>, IGGeometryPlanetLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<GGeometryPlanetLocalStorageItem>> __storage;
        private static bool __initialized;

        public GGeometryPlanetLocalStorageCache(IGGeometryPlanetRepository repository)
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

        protected override ConcurrentDictionary<int, Lazy<GGeometryPlanetLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}