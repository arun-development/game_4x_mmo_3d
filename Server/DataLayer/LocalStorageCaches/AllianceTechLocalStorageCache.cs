using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IAllianceTechLocalStorageCache :
        ILocalStorageCache<alliance_tech, int, AllianceTechDataModel, AllianceTechLocalStorageItem>

    {
    }

    public class AllianceTechLocalStorageCache :
        BaseLocalStorageCache<alliance_tech, int, AllianceTechDataModel, AllianceTechLocalStorageItem>,
        IAllianceTechLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<AllianceTechLocalStorageItem>> __storage;
        private static bool __initialized;

        public AllianceTechLocalStorageCache(IAllianceTechRepository repository)
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

        protected override ConcurrentDictionary<int, Lazy<AllianceTechLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}