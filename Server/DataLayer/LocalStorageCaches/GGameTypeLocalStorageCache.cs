using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IGGameTypeLocalStorageCache :
        ILocalStorageCache
        <g_game_type, byte, GGameTypeDataModel,
            GGameTypeLocalStorageItem>
    {
    }

    public class GGameTypeLocalStorageCache :
        BaseLocalStorageCache<g_game_type, byte, GGameTypeDataModel,
            GGameTypeLocalStorageItem>, IGGameTypeLocalStorageCache
    {
        private static ConcurrentDictionary<byte, Lazy<GGameTypeLocalStorageItem>> __storage;
        private static bool __initialized;

        public GGameTypeLocalStorageCache(IGGameTypeRepository repository)
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

        protected override ConcurrentDictionary<byte, Lazy<GGameTypeLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}