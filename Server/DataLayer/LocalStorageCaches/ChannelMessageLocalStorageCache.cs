using System;
using System.Collections.Concurrent;
using Server.Core.StaticData;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IChannelMessageLocalStorageCache :
        ILocalStorageCache
        <channel_message, long, ChannelMessageDataModel, ChannelMessageLocalStorageItem>
    {
    }

    public class ChannelMessageLocalStorageCache :
        BaseLocalStorageCache<channel_message, long, ChannelMessageDataModel,
            ChannelMessageLocalStorageItem>, IChannelMessageLocalStorageCache
    {
        private static ConcurrentDictionary<long, Lazy<ChannelMessageLocalStorageItem>> __storage;
        private static bool __initialized;

        public ChannelMessageLocalStorageCache(IChannelMessageRepository repository)
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

        protected override ConcurrentDictionary<long, Lazy<ChannelMessageLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}