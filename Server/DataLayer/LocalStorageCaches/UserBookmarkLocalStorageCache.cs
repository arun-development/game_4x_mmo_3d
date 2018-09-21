using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IUserBookmarkLocalStorageCache :
        ILocalStorageCache
        <user_bookmark, int, UserBookmarkDataModel,
            GUserBookmarkLocalStorageItem>
    {
    }

    public class UserBookmarkLocalStorageCache :
        BaseLocalStorageCache<user_bookmark, int, UserBookmarkDataModel,
            GUserBookmarkLocalStorageItem>, IUserBookmarkLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<GUserBookmarkLocalStorageItem>> __storage;
        private static bool __initialized;

        public UserBookmarkLocalStorageCache(IUserBookmarkRepository repository)
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

        protected override ConcurrentDictionary<int, Lazy<GUserBookmarkLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}