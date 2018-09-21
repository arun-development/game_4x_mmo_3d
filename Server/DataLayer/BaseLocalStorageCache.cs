using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Server.Core.StaticData;
using Server.Extensions;

namespace Server.DataLayer
{
    public interface IClenableStorage
    {
        void ClearStorage();
    }
    public interface IGetCount
    {
        int GetCount();

    }


    public interface IRefreshCache
    {
        void RefreshCache(IDbConnection connection);
    }
    public interface IIsInitialized
    {
        /// <summary>
        /// Указывает состояние кеша и на возможность не передавтаь IDbConnection  в некоторых методах
        /// </summary>
        /// <returns></returns>
        bool IsInitialized();
    }



    public interface ILocalStorageFilter<TPrimaryKeyType, TDataModel> : IClenableStorage, IRefreshCache where TDataModel : new()
    {
        #region  sync
        IEnumerable<TDataModel> LocalWhere(IDbConnection connection, Func<TDataModel, bool> predicateWhere);
        IList<TDataModel> LocalWhereList(IDbConnection connection, Func<TDataModel, bool> predicateWhere);
        TDataModel LocalFirstOrDefault(IDbConnection connection, Func<TDataModel, bool> predicateWhere);

        IList<TResult> LocalWhereSelect<TResult>(IDbConnection connection, Func<TDataModel, bool> predicateWhere, Func<TDataModel, TResult> @select);

        IList<TResult> LocalSelect<TResult>(IDbConnection connection, Func<TDataModel, TResult> @select);
        TResult LocalOperation<TResult>(IDbConnection connection, Func<IEnumerable<TDataModel>, TResult> enumOperation);

        IList<TDataModel> LocalFilterByKey(IDbConnection connection, Func<TPrimaryKeyType, bool> filter);
        IList<TDataModel> LocalFind(IDbConnection connection, Func<TPrimaryKeyType, TDataModel, bool> enumOperation);
        IList<TDataModel> LocalGetAll(IDbConnection connection);
        IList<TDataModel> LocalFlilteredByKeys(IDbConnection connection, IEnumerable<TPrimaryKeyType> keys);
        bool ContainAny();
        #endregion

    }


    public interface ILocalStorageBaseAction<TPrimaryKeyType, TDataModel> : IIsInitialized where TDataModel : new()
    {
        #region  sync
        IList<TPrimaryKeyType> GetLocalStorageKeys(IDbConnection connection, bool storageIsCheked = false);
        IList<TDataModel> GetDataModelItems(IDbConnection connection, IList<TPrimaryKeyType> keys, bool storageIsCheked = false);

        IList<TDataModel> UpdateLocalItems(IDbConnection connection, IList<TDataModel> newChekedData);
        TDataModel UpdateLocalItem(IDbConnection connection, TDataModel newChekedDataData);
        //delete and  remove
        void DeleteItems(IList<TPrimaryKeyType> keys);
        void DeleteItem(TPrimaryKeyType key);
        int GetCount(IDbConnection connection, bool fillIfNotInitialized);
        #endregion
    }



    public interface ILocalStorageCache<TEntity, TPrimaryKeyType, TDataModel, TLocalStorageItem> :
        IGetCount, ILocalStorageFilter<TPrimaryKeyType, TDataModel>,
        ILocalStorageBaseAction<TPrimaryKeyType, TDataModel>
        where TEntity : class, IDataModel<TPrimaryKeyType>
        where TDataModel : class, IDataModel<TPrimaryKeyType>, new()
        where TLocalStorageItem : BaseLocalStorageItem<TDataModel, TPrimaryKeyType>, new()
        where TPrimaryKeyType : struct
    {
        #region Core
        #region  sync
        TDataModel GetById(IDbConnection connection, TPrimaryKeyType id, bool findInDbIfLoaclNull, bool storageIsCheked = false);
        TDataModel GetFromDbByIdAndSetToLocal(IDbConnection connection, TPrimaryKeyType id, bool storageIsCheked = false);

        #endregion



        IAdapterDapper<TEntity, TDataModel, TPrimaryKeyType> GetRepository();


        void Init(IDbConnection connection);


        #endregion
    }

    public abstract class BaseLocalStorageCache<TEntity, TPrimaryKeyType, TDataModel, TLocalStorageItem> : ILocalStorageCache<TEntity, TPrimaryKeyType, TDataModel, TLocalStorageItem>
        where TEntity : class, IDataModel<TPrimaryKeyType>
        where TDataModel : class, IDataModel<TPrimaryKeyType>, new()
        where TLocalStorageItem : BaseLocalStorageItem<TDataModel, TPrimaryKeyType>, new()
        where TPrimaryKeyType : struct

    {

        protected const int _maxTryDelay = 10;
        protected abstract bool _initialized { get; set; }
        protected abstract bool _inProgressUpdate { get; set; }
        protected abstract ConcurrentDictionary<TPrimaryKeyType, Lazy<TLocalStorageItem>> _storage { get; set; }
        private static readonly object _locker = new object();


        #region Declare

        private readonly IAdapterDapper<TEntity, TDataModel, TPrimaryKeyType> _repository;


        protected BaseLocalStorageCache(IAdapterDapper<TEntity, TDataModel, TPrimaryKeyType> repository)
        {

            _repository = repository;

        }
        public IAdapterDapper<TEntity, TDataModel, TPrimaryKeyType> GetRepository()
        {
            return _repository;
        }

        #endregion


        #region Core sync
        public virtual TDataModel GetById(IDbConnection connection, TPrimaryKeyType id, bool findInDbIfLoaclNull, bool storageIsCheked = false)
        {
            if (!storageIsCheked)
            {
                _checkAndRunInit(connection);
                storageIsCheked = true;
            }
            var lsi = GetLocalItem(id);
            if (lsi != null)
            {
                if (lsi.InProgressUpdate)
                {
                    throw new NotImplementedException();
                }
                return lsi.ItemData;
            }
            // ReSharper disable once ConditionIsAlwaysTrueOrFalse
            if (findInDbIfLoaclNull) return GetFromDbByIdAndSetToLocal(connection, id, storageIsCheked);
            return null;
        }

        public TDataModel GetFromDbByIdAndSetToLocal(IDbConnection connection, TPrimaryKeyType id, bool storageIsCheked = false)
        {
            if (!storageIsCheked) _checkAndRunInit(connection);
            if (_checkIsDefaultKey(id)) return null;
            var data = _checkAndGetFromDb(connection, id);
            return data != null ? AddOrUpdateLocal(data, true) : null;
        }

        public IList<TDataModel> LocalFlilteredByKeys(IDbConnection connection, IEnumerable<TPrimaryKeyType> keys)
        {

            _checkAndRunInit(connection);
            return _getFilteredCollection(keys).ToList();
        }

        public bool ContainAny()
        {
            return GetCount() > 0;
        }

        public IEnumerable<TDataModel> LocalWhere(IDbConnection connection, Func<TDataModel, bool> predicateWhere)
        {
            _checkAndRunInit(connection);
            return _localWhere(predicateWhere);
        }

        public IList<TDataModel> LocalWhereList(IDbConnection connection, Func<TDataModel, bool> predicateWhere)
        {
            _checkAndRunInit(connection);
            return _localWhere(predicateWhere).ToList();
        }

        public TDataModel LocalFirstOrDefault(IDbConnection connection, Func<TDataModel, bool> predicateWhere)
        {
            _checkAndRunInit(connection);
            return _localFirstOrDefault(predicateWhere);
        }

        public IList<TResult> LocalWhereSelect<TResult>(IDbConnection connection, Func<TDataModel, bool> predicateWhere, Func<TDataModel, TResult> @select)
        {
            _checkAndRunInit(connection);
            var col = _localWhere(predicateWhere);
            return col?.Select(select).ToList();
        }

        public IList<TResult> LocalSelect<TResult>(IDbConnection connection, Func<TDataModel, TResult> @select)
        {
            _checkAndRunInit(connection);
            return _localSelect(select);
        }

        public TResult LocalOperation<TResult>(IDbConnection connection, Func<IEnumerable<TDataModel>, TResult> enumOperation)
        {
            _checkAndRunInit(connection);
            return enumOperation(_getCollection());
        }

        public IList<TDataModel> LocalFilterByKey(IDbConnection connection, Func<TPrimaryKeyType, bool> filter)
        {
            _checkAndRunInit(connection);
            return _storage.Where(_filterKey(filter)).Select(_selectModel()).ToList();
        }



        public IList<TDataModel> LocalFind(IDbConnection connection, Func<TPrimaryKeyType, TDataModel, bool> filter)
        {
            _checkAndRunInit(connection);
            return _storage.Where(_filterKeyValue(filter)).Select(_selectModel()).ToList();
        }

        public IList<TDataModel> LocalGetAll(IDbConnection connection)
        {
            _checkAndRunInit(connection);
            return _getCollection().ToList();
        }

        public IList<TPrimaryKeyType> GetLocalStorageKeys(IDbConnection connection, bool storageIsCheked = false)
        {
            _checkAndRunInit(connection);
            return _storage.GetKeys();
        }

        public IList<TDataModel> GetDataModelItems(IDbConnection connection, IList<TPrimaryKeyType> keys, bool storageIsCheked = false)
        {
            if (!storageIsCheked)
            {
                _checkAndRunInit(connection);
                storageIsCheked = true;
            }

            if (!keys.Any()) return default(List<TDataModel>);
            return keys.Select(i => GetById(connection, i, storageIsCheked)).ToList();

        }


        public IList<TDataModel> UpdateLocalItems(IDbConnection connection, IList<TDataModel> newChekedData)
        {
            _checkAndRunInit(connection);
            return newChekedData.Select(i => AddOrUpdateLocal(i, true)).ToList();
        }

        public TDataModel UpdateLocalItem(IDbConnection connection, TDataModel newChekedDataData)
        {
            _checkAndRunInit(connection);
            return AddOrUpdateLocal(newChekedDataData, true);
        }

        public void DeleteItems(IList<TPrimaryKeyType> keys)
        {
            if (_storage == null) return;
            foreach (var i in keys) DeleteItem(i);
        }

        public void DeleteItem(TPrimaryKeyType key)
        {
            if (Equals(key, default(TPrimaryKeyType))) return;
            if (_storage == null) return;
            TLocalStorageItem item;
            _storage.TryRemoveLazy(key, out item);
        }



        public int GetCount(IDbConnection connection, bool fillIfNotInitialized)
        {
            try
            {
                // ReSharper disable once InvertIf
                if (fillIfNotInitialized)
                {
                    _checkAndRunInit(connection);

                }
                return _storage == null ? 0 : _storage.GetCount();
            }
            catch (ArgumentNullException)
            {
                return 0;
            }
        }

        public int GetCount()
        {
            return GetCount(null, false);

        }

        public void ClearStorage()
        {

            if (!_isEmptyStorage())
            {
                _storage.Clear();

            }
            if (_initialized)
            {
                _initialized = false;
            }



        }

        protected bool _isEmptyStorage()
        {
            return _storage == null || _storage.GetCount() == 0;
        }

        public void RefreshCache(IDbConnection connection)
        {
            ClearStorage();
            _checkAndRunInit(connection);

        }


        public void Init(IDbConnection connection)
        {

            lock (_locker)
            {
                if (_inProgressUpdate)
                {
                    _wait(() => _inProgressUpdate);
                    return;
                }
                ClearStorage();
                _inProgressUpdate = true;
                try
                {
                    _init(connection);

                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
                finally
                {
                    _inProgressUpdate = false;
                    _initialized = true;
                }
            }

   



        }
        #endregion


        #region Protected and private only

        // ReSharper disable InconsistentNaming


        protected void _wait(Func<bool> condition,  int? limit = null)
        {
            if (limit == null)
            {
                limit = _maxTryDelay;
            }
            if ((int)limit < 1)
            {
                throw new Exception(Error.MaxLimitAwait);
            }

            if (condition())
            {
                return;
            }
            limit--;
            Task.Delay(200).GetAwaiter().GetResult();
            _wait(condition, limit);



        }

        protected virtual void _init(IDbConnection connection)
        {
  
            if (!_isEmptyStorage()) return;
            var col = _repository.GetAllModels(connection);
            if (col == null || !col.Any())
            {
                _storage = new ConcurrentDictionary<TPrimaryKeyType, Lazy<TLocalStorageItem>>();
            }
            else
            {
                _storage = new ConcurrentDictionary<TPrimaryKeyType, Lazy<TLocalStorageItem>>(
                    col.ToDictionary(i => i.Id, i => new Lazy<TLocalStorageItem>(() =>
                    {
                        var item = new TLocalStorageItem();
                        item.Init(i);
                        return item;
                    }, LazyThreadSafetyMode.PublicationOnly)));

            }
 
        }




        protected void _checkAndRunInit(IDbConnection connection)
        {
            if (!_initialized)
            {
                Init(connection);
            }

        }

        private TDataModel _checkAndGetFromDb(IDbConnection connection, TPrimaryKeyType id)
        {
            if (_checkIsDefaultKey(id)) return null;
            var data = _repository.GetModelById(connection, id);
            if (data == null || _checkIsDefaultKey(data.Id)) return null;
            return data;
        }

 
        /// <summary>
        ///     проверяет и добавляет существующий объект базы в локальное хранилище
        /// </summary>
        /// <param name="dataModel"></param>
        /// <param name="dataIsCheked"></param>
        /// <returns></returns>
        protected virtual TDataModel AddOrUpdateLocal(TDataModel dataModel, bool dataIsCheked)
        {
            lock (_locker)
            {
                if (!dataIsCheked && (dataModel == null || _checkIsDefaultKey(dataModel.Id))) return null;
                if (_storage == null) throw new NotImplementedException("Store not exist");
                return _storage.AddOrUpdateLazy(dataModel.Id, key =>
                {
                    //add value
                    var item = new TLocalStorageItem();
                    item.Init(dataModel);
                    return item;
                }, (key, oldValue) =>
                {
                    //update value
                    oldValue.Update(dataModel);
                    return oldValue;
                }).ItemData;

            }

        }

        /// <summary>
        ///     TryGetValue from local,
        /// </summary>
        /// <param name="id"></param>
        /// <returns>TLocalStorageItem</returns>
        /// can be null;
        protected TLocalStorageItem GetLocalItem(TPrimaryKeyType id)
        {
            TLocalStorageItem lsi;
            _storage.TryGetValueLazy(id, out lsi);
            return lsi;
        }

        #endregion

        #region Helper
        protected bool _checkIsDefaultKey(TPrimaryKeyType val)
        {
            return Equals(val, default(TPrimaryKeyType));
        }





        #region LocalCollection

        private IEnumerable<TDataModel> _getCollection()
        {
            try
            {
                return _storage.Select(_selectModel());
            }
            catch (ArgumentNullException)
            {
                return default(IEnumerable<TDataModel>);
            }

        }



        private IEnumerable<TDataModel> _getFilteredCollection(IEnumerable<TPrimaryKeyType> keys)
        {
            return _storage.Where(i => keys.Contains(i.Key)).Select(_selectModel());
        }

        private TDataModel _localFirstOrDefault(Func<TDataModel, bool> predicateWhere)
        {
            var col = _getCollection();
            return col?.FirstOrDefault(predicateWhere);
        }

        private IEnumerable<TDataModel> _localWhere(Func<TDataModel, bool> predicateWhere)
        {
            var col = _getCollection();
            return col?.Where(predicateWhere);
        }

        private IList<TResult> _localWhereSelect<TResult>(Func<TDataModel, bool> predicateWhere, Func<TDataModel, TResult> select)
        {
            var col = _localWhere(predicateWhere);
            return col?.Select(@select).ToList();
        }

        private IList<TResult> _localSelect<TResult>(Func<TDataModel, TResult> select)
        {
            return _getCollection().Select(select).ToList();
        }


        private static Func<KeyValuePair<TPrimaryKeyType, Lazy<TLocalStorageItem>>, bool> _filterKey(Func<TPrimaryKeyType, bool> filter)
        {
            return i => filter(i.Key);
        }
        private Func<KeyValuePair<TPrimaryKeyType, Lazy<TLocalStorageItem>>, TDataModel> _selectModel()
        {
            return i => i.Value.Value.ItemData;
        }
        private static Func<KeyValuePair<TPrimaryKeyType, Lazy<TLocalStorageItem>>, bool> _filterKeyValue(Func<TPrimaryKeyType, TDataModel, bool> filter)
        {
            return i => filter(i.Key, i.Value.Value.ItemData);
        }

        #endregion

        #region LocalDelete







        #endregion

        // ReSharper restore InconsistentNaming

        #endregion

        public bool IsInitialized()
        {
            return _storage != null;
        }
    }
}