using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IUMotherJumpLocalStorageCache :
        ILocalStorageCache
        <user_mother_jump, int, UserMotherJumpDataModel, UMotherJumpLocalStorageItem>
    {
    }

    public class UMotherJumpLocalStorageCache :
        BaseLocalStorageCache<user_mother_jump, int, UserMotherJumpDataModel,
            UMotherJumpLocalStorageItem>, IUMotherJumpLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<UMotherJumpLocalStorageItem>> __storage;
        private static bool __initialized;

        public UMotherJumpLocalStorageCache(IUserMotherJumpRepository repository)
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

        protected override ConcurrentDictionary<int, Lazy<UMotherJumpLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}