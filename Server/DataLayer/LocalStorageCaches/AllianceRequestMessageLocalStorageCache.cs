using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IAllianceRequestMessageLocalStorageCache :
        ILocalStorageCache
        <alliance_request_message, int, AllianceRequestMessageDataModel, AllianceRequestMessageLocalStorageItem>
    {
    }

    public class AllianceRequestMessageLocalStorageCache :
        BaseLocalStorageCache
        <alliance_request_message, int, AllianceRequestMessageDataModel, AllianceRequestMessageLocalStorageItem>,
        IAllianceRequestMessageLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<AllianceRequestMessageLocalStorageItem>> __storage;
        private static bool __initialized;

        public AllianceRequestMessageLocalStorageCache(IAllianceRequestMessageRepository repository) :
            base(repository)
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

        protected override ConcurrentDictionary<int, Lazy<AllianceRequestMessageLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}