using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IGGeometrySystemLocalStorageCache :
        ILocalStorageCache
        <g_geometry_system, int, GGeometrySystemDataModel,
            GGeometrySystemLocalStorageItem>
    {
    }

    public class GGeometrySystemLocalStorageCache :
        BaseLocalStorageCache<g_geometry_system, int, GGeometrySystemDataModel,
            GGeometrySystemLocalStorageItem>, IGGeometrySystemLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<GGeometrySystemLocalStorageItem>> __storage;
        private static bool __initialized;

        public GGeometrySystemLocalStorageCache(IGGeometrySystemRepository repository)
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

        protected override ConcurrentDictionary<int, Lazy<GGeometrySystemLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}