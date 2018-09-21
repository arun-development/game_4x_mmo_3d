using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IAllianceUserLocalStorageCache :
        ILocalStorageCache
        <alliance_user, int, AllianceUserDataModel, AllianceUserLocalStorageItem
        >
    {
    }

    public class AllianceUserLocalStorageCache :
        BaseLocalStorageCache<alliance_user, int, AllianceUserDataModel, AllianceUserLocalStorageItem>,
        IAllianceUserLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<AllianceUserLocalStorageItem>> __storage;
        private static bool __initialized;

        public AllianceUserLocalStorageCache(IAllianceUserRepository repository) : base(repository)
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

        protected override ConcurrentDictionary<int, Lazy<AllianceUserLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}