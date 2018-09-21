using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IGGeometryStarLocalStorageCache :
        ILocalStorageCache
        <g_geometry_star, int, GGeometryStarDataModel,
            GGeometryStarLocalStorageItem>
    {
    }

    public class GGeometryStarLocalStorageCache :
        BaseLocalStorageCache<g_geometry_star, int, GGeometryStarDataModel,
            GGeometryStarLocalStorageItem>, IGGeometryStarLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<GGeometryStarLocalStorageItem>> __storage;
        private static bool __initialized;

        public GGeometryStarLocalStorageCache(IGGeometryStarRepository repository)
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

        protected override ConcurrentDictionary<int, Lazy<GGeometryStarLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}