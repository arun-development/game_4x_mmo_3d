using System;
using System.Collections.Concurrent;
using Server.Core.StaticData;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IChannelLocalStorageCache :
        ILocalStorageCache<channel, int, ChannelDataModel, ChannelLocalStorageItem>
    {
    }

    public class ChannelLocalStorageCache : BaseLocalStorageCache<channel, int, ChannelDataModel,
        ChannelLocalStorageItem>, IChannelLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<ChannelLocalStorageItem>> __storage;
        private static bool __initialized;

        public ChannelLocalStorageCache(IChannelRepository repository)
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

        protected override ConcurrentDictionary<int, Lazy<ChannelLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}