using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IGGeometryMoonLocalStorageCache :
        ILocalStorageCache
        <g_geometry_moon, int, GGeometryMoonDataModel,
            GGeometryMoonLocalStorageItem>
    {
    }

    public class GGeometryMoonLocalStorageCache :
        BaseLocalStorageCache<g_geometry_moon, int, GGeometryMoonDataModel,
            GGeometryMoonLocalStorageItem>, IGGeometryMoonLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<GGeometryMoonLocalStorageItem>> __storage;
        private static bool __initialized;

        public GGeometryMoonLocalStorageCache(IGGeometryMoonRepository repository) : base(repository)
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

        protected override ConcurrentDictionary<int, Lazy<GGeometryMoonLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}