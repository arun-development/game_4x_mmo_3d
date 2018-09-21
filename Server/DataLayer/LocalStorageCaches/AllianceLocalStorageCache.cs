using System;
using System.Collections.Concurrent;
using System.Data;
using System.Linq;
using System.Threading;
using Server.DataLayer.Repositories;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface
        IAllianceLocalStorageCache : ILocalStorageCache<alliance, int, AllianceDataModel, AllianceLocalStorageItem>
    {
    }

    public class AllianceLocalStorageCache :
        BaseLocalStorageCache<alliance, int, AllianceDataModel, AllianceLocalStorageItem>,
        IAllianceLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<AllianceLocalStorageItem>> __storage;
        private static bool __initialized;

        public AllianceLocalStorageCache(IAllianceRepository repository)
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

        protected override ConcurrentDictionary<int, Lazy<AllianceLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }

        protected override void _init(IDbConnection connection)
        {
            if (!_isEmptyStorage()) return;
            var repo = (AllianceRepository) GetRepository();
            var col = repo.GetAllActiveProcedure(connection);
            if (col == null || !col.Any())
            {
                _storage = new ConcurrentDictionary<int, Lazy<AllianceLocalStorageItem>>();
                return;
            }
            _storage = new ConcurrentDictionary<int, Lazy<AllianceLocalStorageItem>>(col.ToDictionary(i => i.Id,
                i => new Lazy<AllianceLocalStorageItem>(() =>
                {
                    var item = new AllianceLocalStorageItem();
                    item.Init(i);
                    return item;
                }, LazyThreadSafetyMode.PublicationOnly)));
        }
    }
}