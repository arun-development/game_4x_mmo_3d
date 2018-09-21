using System;
using System.Collections.Concurrent;
using Server.Core.StaticData;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IChannelConnectionLocalStorageCache :
        ILocalStorageCache<channel_connection, long, ChannelConnectionDataModel, ChannelConnectiontLocalStorageItem>
    {
    }

    public class ChannelConnectionLocalStorageCache :
        BaseLocalStorageCache<channel_connection, long, ChannelConnectionDataModel, ChannelConnectiontLocalStorageItem>,
        IChannelConnectionLocalStorageCache
    {
        private static ConcurrentDictionary<long, Lazy<ChannelConnectiontLocalStorageItem>> __storage;
        private static bool __initialized;


        public ChannelConnectionLocalStorageCache(IChannelConnectionRepository repository)
            : base(repository)
        {
            throw new NotImplementedException(Error.NotUsedServerMethod);
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

        protected override ConcurrentDictionary<long, Lazy<ChannelConnectiontLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}