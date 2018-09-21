using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IUserBalanceCcLocalStorageCache :
        ILocalStorageCache
        <user_balance_cc, int, UserBalanceCcDataModel, BalanceCcLocalStorageItem>
    {
    }

    public class UserBalanceCcLocalStorageCache :
        BaseLocalStorageCache<user_balance_cc, int, UserBalanceCcDataModel,
            BalanceCcLocalStorageItem>, IUserBalanceCcLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<BalanceCcLocalStorageItem>> __storage;
        private static bool __initialized;

        public UserBalanceCcLocalStorageCache(IUserBalanceCcRepository repository)
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

        protected override ConcurrentDictionary<int, Lazy<BalanceCcLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}