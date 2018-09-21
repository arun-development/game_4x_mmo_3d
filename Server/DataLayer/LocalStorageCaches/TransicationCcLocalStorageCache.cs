using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface ITransicationCcLocalStorageCache :
        ILocalStorageCache
        <transacation_cc, int, TransacationCcDataModel,
            TransicationCcLocalStorageItem>
    {
    }

    public class TransicationCcLocalStorageCache :
        BaseLocalStorageCache<transacation_cc, int, TransacationCcDataModel,
            TransicationCcLocalStorageItem>, ITransicationCcLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<TransicationCcLocalStorageItem>> __storage;
        private static bool __initialized;

        public TransicationCcLocalStorageCache(ITransacationCcRepository repository)
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

        protected override ConcurrentDictionary<int, Lazy<TransicationCcLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}