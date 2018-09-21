using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches

{
    public interface IAllianceFleetLocalStorageCache :
        ILocalStorageCache<alliance_fleet, int, AllianceFleetDataModel, AllianceFleetLocalStorageItem>
    {
    }

    public class AllianceFleetLocalStorageCache :
        BaseLocalStorageCache<alliance_fleet, int, AllianceFleetDataModel, AllianceFleetLocalStorageItem>,
        IAllianceFleetLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<AllianceFleetLocalStorageItem>> __storage;

        private static bool __initialized;

        public AllianceFleetLocalStorageCache(IAllianceFleetRepository repository) : base(repository)
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

        protected override ConcurrentDictionary<int, Lazy<AllianceFleetLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}