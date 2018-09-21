using System;
using System.Collections.Concurrent;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IUReportLocalStorageCache :
        ILocalStorageCache<user_report, int, UserReportDataModel, UReportLocalStorageItem>
    {
    }

    public class UReportLocalStorageCache :
        BaseLocalStorageCache<user_report, int, UserReportDataModel,
            UReportLocalStorageItem>, IUReportLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<UReportLocalStorageItem>> __storage;
        private static bool __initialized;

        public UReportLocalStorageCache(IUserReportRepository repository)
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

        protected override ConcurrentDictionary<int, Lazy<UReportLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }
    }
}