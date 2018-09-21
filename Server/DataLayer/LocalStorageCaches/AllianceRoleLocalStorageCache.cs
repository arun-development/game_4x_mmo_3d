using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IAllianceRoleLocalStorageCache :
        ILocalStorageCache
        <alliance_role, byte, AllianceRoleDataModel, AllianceRoleLocalStorageItem>
    {
    }

    public class AllianceRoleLocalStorageCache :
        BaseLocalStorageCache
        <alliance_role, byte, AllianceRoleDataModel, AllianceRoleLocalStorageItem>, IAllianceRoleLocalStorageCache
    {
        private static ConcurrentDictionary<byte, Lazy<AllianceRoleLocalStorageItem>> __storage;
        private static bool __initialized;

        public AllianceRoleLocalStorageCache(IAllianceRoleRepository repository) : base(repository)
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

        protected override ConcurrentDictionary<byte, Lazy<AllianceRoleLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}