using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IGSectorsLocalStorageCache : ILocalStorageCache
        <g_sectors, short, GSectorsDataModel, GSectorsLocalStorageItem>
    {
    }

    public class GSectorsLocalStorageCache :
        BaseLocalStorageCache<g_sectors, short, GSectorsDataModel,
            GSectorsLocalStorageItem>, IGSectorsLocalStorageCache
    {
        private static ConcurrentDictionary<short, Lazy<GSectorsLocalStorageItem>> __storage;
        private static bool __initialized;

        public GSectorsLocalStorageCache(IGSectorsRepository repository)
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

        protected override ConcurrentDictionary<short, Lazy<GSectorsLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}