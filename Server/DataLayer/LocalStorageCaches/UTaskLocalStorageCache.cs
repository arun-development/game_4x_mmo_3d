using System;
using System.Collections.Concurrent;
using System.Data;
using System.Threading.Tasks;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.DataLayer.Repositories;
using Server.Extensions;

namespace Server.DataLayer.LocalStorageCaches
{
    public interface IUTaskLocalStorageCache :
        ILocalStorageCache<user_task, int, UserTaskDataModel, UTaskLocalStorageItem>
    {
        UserTaskDataModel SetUpdateInProgress(IDbConnection connection, UserTaskDataModel taskItem);
        void UnlockUpdateInProgress(IDbConnection connection, int taskId);
    }

    public class UTaskLocalStorageCache :
        BaseLocalStorageCache<user_task, int, UserTaskDataModel,
            UTaskLocalStorageItem>, IUTaskLocalStorageCache
    {
        private static ConcurrentDictionary<int, Lazy<UTaskLocalStorageItem>> __storage;
        private static bool __initialized;

        public UTaskLocalStorageCache(IUserTaskRepository repository)
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

        protected override ConcurrentDictionary<int, Lazy<UTaskLocalStorageItem>> _storage
        {
            get => __storage;
            set => __storage = value;
        }


        
        private static readonly object _getByIdLocker  = new object();
        
        /// <summary>
        ///     Gets Data from cache if exists, of get from Db and add in cache if exists
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="id"></param>
        /// <param name="findInDbIfLoaclNull"></param>
        /// <param name="storageIsCheked"></param>
        /// <returns>TDataModel || null</returns>
        public override UserTaskDataModel GetById(IDbConnection connection, int id, bool findInDbIfLoaclNull, bool storageIsCheked = false)

        {
            if (!storageIsCheked)
            {
                _checkAndRunInit(connection);
                storageIsCheked = true;
            }
            var lsi = GetLocalItem(id);
            if (lsi != null)
            {
                if (!lsi.InProgressUpdate) return lsi.ItemData;
                lock (_getByIdLocker)
                {
                    for (var i = 0; i < 10; i++)
                    {
                        Task.Delay(100).MakeSync();
                        lsi = GetLocalItem(id);
                        if (!lsi.InProgressUpdate)return lsi.ItemData;

                        if (i < 9) continue;
                        lsi.InProgressUpdate = false;
                        lsi.LastUpgrade = UnixTime.UtcNowMs();
                        _addOrUpdateLocalStorageItem(lsi);
                        throw new Exception(Error.UserTaskMaxLimitAwait);
                    }
                }

            }
            // ReSharper disable once ConditionIsAlwaysTrueOrFalse
            if (findInDbIfLoaclNull) return GetFromDbByIdAndSetToLocal(connection,id, storageIsCheked);
            return null;
        }

        public UserTaskDataModel SetUpdateInProgress(IDbConnection connection, UserTaskDataModel taskItem)
        {
            var lsi = GetLocalItem(taskItem.Id);
            lsi.InProgressUpdate = true;
            lsi.ItemData = taskItem;
            return _addOrUpdateLocalStorageItem(lsi).ItemData;
        }

        public void UnlockUpdateInProgress(IDbConnection connection, int taskId)
        {
            var lsi = GetLocalItem(taskId);
            lsi.InProgressUpdate = false;
            _addOrUpdateLocalStorageItem(lsi);
        }


        private UTaskLocalStorageItem _addOrUpdateLocalStorageItem(UTaskLocalStorageItem other)
        {
            return _storage.AddOrUpdateLazy(other.Id, key => other, (key, oldValue) => other);
        }
    }
}