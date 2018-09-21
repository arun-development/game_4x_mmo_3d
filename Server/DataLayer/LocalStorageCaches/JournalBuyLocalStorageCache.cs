using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IJournalBuyLocalStorageCache :
        ILocalStorageCache
        <journal_buy, int, JournalBuyDataModel, JournalBuyLocalStorageItem>
    {
    }

    public class JournalBuyLocalStorageCache :
        BaseLocalStorageCache<journal_buy, int, JournalBuyDataModel,
            JournalBuyLocalStorageItem>, IJournalBuyLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<JournalBuyLocalStorageItem>> __storage;
        private static bool __initialized;

        public JournalBuyLocalStorageCache(IJournalBuyRepository repository)
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

        protected override ConcurrentDictionary<int, Lazy<JournalBuyLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}