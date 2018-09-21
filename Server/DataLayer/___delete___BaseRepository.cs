using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using Server.Core.StaticData;

namespace Server.DataLayer {
    public interface IRepository<T, TPrimaryKeyType, TDataModel> where T : class, IUniqueIdElement<TPrimaryKeyType>
        where TPrimaryKeyType : struct {
        #region Helper

        //TDataModel ConvertToWorkModel(T entitye);
        //IList<T> ConvertToEntities(IList<TDataModel> dataModel);
        //IList<TDataModel> ConvertToWorkModel(IList<T> entityes);

        #endregion

        #region Core Sinc

        TDataModel GetById(TPrimaryKeyType id);


        IList<TDataModel> GetAll();


        IList<T> InsertAllOnSubmit(IList<TDataModel> dataModels);
        T InsertOnSubmit(TDataModel newDataModel);

        void DeleteAllOnSubmit(IList<TDataModel> dataModels);


        IList<TDataModel> AddOrUpdateAll(IList<TDataModel> newDataModels);

        TDataModel AddOrUpdate(TDataModel newUpdatedData);


        IList<TDataModel> RWhereTake(Expression<Func<T, bool>> where, int count);
        IList<TDataModel> RWhere(Expression<Func<T, bool>> where);

        IList<TResult> RWhereSelect<TResult>(Expression<Func<T, bool>> where, Expression<Func<T, TResult>> selector);


        T RFirstOrDefaultEntity(Expression<Func<T, bool>> @where = null);

        #endregion

        #region Procedure Sinc

        TDataModel GetByIdProcedure(TPrimaryKeyType id);
        IList<TPrimaryKeyType> GetAllIdsProcedure();

        IList<TDataModel> GetAllProcedure();


        bool DeleteItemProcedure(TPrimaryKeyType id);
        bool DeleteAllProcedure();

        #endregion
    }

    public interface IDataContextRepository<TEntity, TPrimaryKeyType, TDataContext>
        where TEntity : class, IUniqueIdElement<TPrimaryKeyType>, new()
        where TPrimaryKeyType : struct
        where TDataContext : DataContext, IDisposableData, new() {
        ITable<TEntity> GetTable(TDataContext context);
        TEntity GetByIdEntity(TPrimaryKeyType id);
    }


    public interface IConvertToEntity<TEntity, TDataModel> {
        TEntity ConvertToEntity(TDataModel dataModel);
        TDataModel ConvertToWorkModel(TEntity dataModel);
        IList<TEntity> ConvertToEntities(IList<TDataModel> dataModels);
        IList<TDataModel> ConvertToWorkModel(IList<TEntity> entityes);
    }

    public abstract class BaseRepository<TEntity, TPrimaryKeyType, TDataModel, TDataContext, TDbProvider> : IDataContextRepository<TEntity, TPrimaryKeyType, TDataContext>,
        IRepository<TEntity, TPrimaryKeyType, TDataModel>
        where TEntity : class, IUniqueIdElement<TPrimaryKeyType>, new()
        where TPrimaryKeyType : struct
        where TDataContext : DataContext, IDisposableData, new()
        where TDataModel : class, IUniqueIdElement<TPrimaryKeyType>
        where TDbProvider : DataContextProvider<TDataContext> {
        // ReSharper disable once InconsistentNaming
        protected readonly TDbProvider _provider;

        protected BaseRepository(TDbProvider provider) {
            _provider = provider;
        }

        #region Core

        public TDataModel GetById(TPrimaryKeyType id) {
            if (Equals(id, default(TPrimaryKeyType))) {
                throw new ArgumentException(Error.IsEmpty, nameof(id));
            }
            var data = GetByIdEntity(id);
            return data == null ? default(TDataModel) : ConvertToWorkModel(data);
        }


        public TEntity GetByIdEntity(TPrimaryKeyType id) {
            if (Equals(id, default(TPrimaryKeyType))) {
                throw new ArgumentException(Error.IsEmpty, nameof(id));
            }
            var data = (TEntity) null;
            _provider.ContextAction(c => { data = GetTable(c).FirstOrDefault(i => Equals(id, i.Id)); });
            return data;
        }

        public IList<TDataModel> GetAll() {
            var data = (IList<TEntity>) null;
            _provider.ContextAction(c => {
                data = GetAll(c).ToList();
                _provider.SaveInUsing(c);
            });

            return !data.Any() ? default(IList<TDataModel>) : ConvertToWorkModel(data);
            //IList<TEntity> data = null;

            //using (var c = Context)
            //{
            //    data = GetAll(c).ToList();
            //}
            //return !data.Any() ? default(IList<TDataModel>) : ConvertToWorkModel(data);
        }

        protected IEnumerable<TEntity> GetAll(TDataContext context) {
            return GetTable(context);
        }


        public IList<TEntity> InsertAllOnSubmit(IList<TDataModel> dataModel) {
            if (dataModel == null || dataModel.Count == 0) {
                throw new ArgumentException(Error.IsEmpty, nameof(dataModel));
            }

            var result = (IList<TEntity>) null;
            _provider.ContextAction(c => {
                result = _insertAllOnSubmit(ConvertToEntities(dataModel), c);
                _provider.SaveInUsing(c);
            });
            return result;
        }

        public TEntity InsertAllOnSubmit(TDataModel dataModel) {
            if (dataModel == null) {
                throw new ArgumentException(Error.IsEmpty, nameof(dataModel));
            }
            var result = (TEntity) null;
            _provider.ContextAction(c => {
                result = _insertOnSubmit(ConvertToEntity(dataModel), c);
                _provider.SaveInUsing(c);
            });
            return result;
        }

        protected IList<TEntity> _insertAllOnSubmit(IList<TEntity> entityes, TDataContext context) {
            if (entityes == null || entityes.Count == 0) {
                throw new ArgumentException(Error.IsEmpty, nameof(entityes));
            }
            context.GetTable<TEntity>().InsertAllOnSubmit(entityes);
            return entityes;
        }


        public void DeleteAllOnSubmit(IList<TDataModel> dataModel) {
            if (dataModel == null || dataModel.Count == 0) {
                throw new ArgumentException(Error.IsEmpty, nameof(dataModel));
            }
            _provider.ContextAction(c => {
                _deleteAllOnSubmit(ConvertToEntities(dataModel), c);
                _provider.SaveInUsing(c);
            });
        }

        protected void _deleteAllOnSubmit(IList<TEntity> entityes, TDataContext context) {
            if (entityes == null || entityes.Count == 0) {
                throw new ArgumentException(Error.IsEmpty, nameof(entityes));
            }
            context.GetTable<TEntity>().DeleteAllOnSubmit(entityes);
        }


        public TEntity InsertOnSubmit(TDataModel dataModel) {
            var result = (TEntity) null;
            _provider.ContextAction(c => {
                result = _insertOnSubmit(ConvertToEntity(dataModel), c);
                _provider.SaveInUsing(c);
            });
            return result;
        }

        protected TEntity _insertOnSubmit(TEntity entity, TDataContext context) {
            context.GetTable<TEntity>().InsertOnSubmit(entity);
            return entity;
        }


        /// <summary>
        ///     добавляет или обновляет, вызфывает метод сохранения контекта в случае успеха
        /// </summary>
        /// <param name="newDataModels"></param>
        /// <returns></returns>
        public IList<TDataModel> AddOrUpdateAll(IList<TDataModel> newDataModels) {
            if (newDataModels == null || newDataModels.Count == 0) {
                throw new ArgumentException(Error.IsEmpty, nameof(newDataModels));
            }
            IList<TDataModel> result = null;
            var existIds = newDataModels.Where(i => !Equals(i.Id, default(TPrimaryKeyType))).Select(j => j.Id).ToList();
            _provider.ContextAction(c => { _addOrUpdateAll(newDataModels, c, existIds, r => { result = r; }); });

            //using (var c = Context)
            //{


            //}
            // _provider.Commit();

            return result;
        }


        /// <summary>
        ///     добавляет или обновляет, вызывает метод сохранения контекта
        /// </summary>
        /// <param name="newData"></param>
        /// <returns></returns>
        public TDataModel AddOrUpdate(TDataModel newData) {
            if (newData == null) {
                throw new ArgumentNullException(Error.IsEmpty, nameof(newData));
            }
            TDataModel data = null;
            _provider.ContextAction(c => { data = AddOrUpdate(newData, c); });
            return data;
        }

        public IList<TDataModel> RWhereTake(Expression<Func<TEntity, bool>> where, int count) {
            if (count == 0) {
                throw new ArgumentException(Error.IsEmpty, nameof(count));
            }
            var result = (IList<TDataModel>) null;
            _provider.ContextAction((c) => {
                result = ConvertToWorkModel(GetTable(c).Where(where).Take(count).ToList());
            });
            return result;

            //using (var c = Context)
            //{
            //    return ConvertToWorkModel(GetTable(c).Where(where).Take(count).ToList());
            //}
        }

        public IList<TDataModel> RWhere(Expression<Func<TEntity, bool>> where) {
            var result = (IList<TDataModel>) null;
            _provider.ContextAction((c) => { result = ConvertToWorkModel(GetTable(c).Where(where).ToList()); });
            return result;
            //using (var c = Context)
            //{
            //    return ConvertToWorkModel(GetTable(c).Where(where).ToList());
            //}
        }

        public IList<TResult> RWhereSelect<TResult>(Expression<Func<TEntity, bool>> @where,
            Expression<Func<TEntity, TResult>> @selector) {
            var result = (IList<TResult>) null;
            _provider.ContextAction((c) => { result = GetTable(c).Where(where).Select(selector).ToList(); });
            return result;
            //using (var c = Context)
            //{
            //    return GetTable(c).Where(where).Select(selector).ToList();
            //}
        }


        public TEntity RFirstOrDefaultEntity(Expression<Func<TEntity, bool>> where = null) {
            var result = (TEntity) null;
            _provider.ContextAction((c) => {
                result = where == null ? GetTable(c).FirstOrDefault() : GetTable(c).FirstOrDefault(where);
            });
            return result;
        }


        //=======


        protected virtual void _addOrUpdateAll(IList<TDataModel> newDataModels, TDataContext c,
            List<TPrimaryKeyType> existIds, Action<IList<TDataModel>> setResult) {
            IList<TDataModel> result = null;
            if (!existIds.Any()) {
                var entities = ConvertToEntities(newDataModels);
                _insertAllOnSubmit(entities, c);
                _provider.SaveInUsing(c);
                result = ConvertToWorkModel(entities);
                setResult(result);
            }
            else {
                result = new List<TDataModel>();
                var oldData = GetTable(c).Where(i => existIds.Contains(i.Id)).ToList();
                if (!oldData.Any()) {
                    var entities = ConvertToEntities(newDataModels);
                    _insertAllOnSubmit(entities, c);
                    _provider.SaveInUsing(c);
                    result = ConvertToWorkModel(entities);
                    setResult(result);
                }
                else {
                    foreach (var newItem in newDataModels) {
                        var oldItem = oldData.FirstOrDefault(i => Equals(i.Id, newItem.Id));
                        if (oldItem != null) {
                            _setUpdatedData(oldItem, newItem);
                            _provider.SaveInUsing(c);
                            result.Add(ConvertToWorkModel(oldItem));
                        }
                        else {
                            var entity = ConvertToEntity(newItem);
                            _insertOnSubmit(entity, c);
                            _provider.SaveInUsing(c);
                            result.Add(ConvertToWorkModel(entity));
                        }
                    }
                    setResult(result);
                }
            }
        }


        protected virtual TDataModel AddOrUpdate(TDataModel newData, TDataContext context) {
            if (Equals(newData.Id, 0)) {
                var entyty = ConvertToEntity(newData);
                _insertOnSubmit(entyty, context);
                _provider.SaveInUsing(context);
                newData.Id = entyty.Id;
                return newData;
            }
            var oldData = GetTable(context).SingleOrDefault(i => Equals(i.Id, newData.Id));
            if (oldData == null || Equals(oldData.Id, 0)) {
                var entyty = ConvertToEntity(newData);
                _insertOnSubmit(entyty, context);
                _provider.SaveInUsing(context);
                newData.Id = entyty.Id;
                return newData;
            }
            else {
                _setUpdatedData(oldData, newData);
                _provider.SaveInUsing(context);
                return newData;
            }
        }

        #endregion

        #region Procedure

        public virtual TDataModel GetByIdProcedure(TPrimaryKeyType id) {
            if (Equals(id, default(TPrimaryKeyType))) {
                throw new ArgumentException(Error.IsEmpty, nameof(id));
            }
            return GetByIdProcedureChild(id);
        }

        public abstract IList<TPrimaryKeyType> GetAllIdsProcedure();
        public abstract IList<TDataModel> GetAllProcedure();

        protected abstract TDataModel GetByIdProcedureChild(TPrimaryKeyType id);

        protected virtual TDataModel GetByIdProcedure(Func<TDataContext, TDataModel> procedure) {
            var result = (TDataModel) null;
            _provider.ContextAction(c => { result = procedure(c); });
            return result;

            //using (var c = Context)
            //{
            //    _provider._openConnectionIfBeforeClosed(c);

            //    result = procedure(c);
            //}
            //return result;
        }


        protected virtual bool DeleteAllProcedure(Func<TDataContext, bool> procedure) {
            var result = false;
            _provider.ContextAction((c) => {
                result = procedure(c);
                _provider.SaveInUsing(c);
            });
            return result;
            //bool result;
            //using (var c = Context)
            //{
            //    _provider._openConnectionIfBeforeClosed(c);
            //    result = procedure(c);
            //    _provider.SaveInUsing(c);
            //}
            //return result;
        }

        public abstract bool DeleteAllProcedure();


        public virtual bool DeleteItemProcedure(TPrimaryKeyType id) {
            if (Equals(id, default(TPrimaryKeyType))) {
                throw new ArgumentException(Error.IsEmpty, nameof(id));
            }
            return DeleteItemProcedureChild(id);
        }

        protected virtual bool DeleteItemProcedure(Func<TDataContext, bool> procedure) {
            var result = false;
            _provider.ContextAction((c) => {
                result = procedure(c);
                _provider.SaveInUsing(c);
            });
            return result;


            //bool result;
            //using (var c = Context)
            //{
            //    _provider._openConnectionIfBeforeClosed(c);
            //    result = procedure(c);
            //    _provider.SaveInUsing(c);
            //}
            //return result;
        }

        protected abstract bool DeleteItemProcedureChild(TPrimaryKeyType id);


        protected abstract TDataModel CreateFromDataReader(SqlDataReader readItem);

        protected virtual IList<TDataModel> GetAllProcedure(string procedureName) {
            var data = new List<TDataModel>();
            using (var connection = new SqlConnection(_provider.GetActiveConnsectionString())) {
                connection.Open();
                //   connection.OpenAsync();
                var command = new SqlCommand(procedureName, connection);
                // указываем, что команда представляет хранимую процедуру
                command.CommandType = System.Data.CommandType.StoredProcedure;
                var reader = command.ExecuteReader();
                // var reader = command.ExecuteReaderAsync();


                if (reader.HasRows) {
                    while (reader.Read()) {
                        data.Add(CreateFromDataReader(reader));
                    }
                }
                reader.Close();
                connection.Close();
            }

            return data;
        }


        protected virtual IList<TPrimaryKeyType> GetAllIdsProcedure(
            Func<TDataContext, IList<TPrimaryKeyType>> procedure) {
            var result = (IList<TPrimaryKeyType>) null;
            _provider.ContextAction((c) => {
                result = procedure(c);
                _provider.SaveInUsing(c);
            });
            return result;
            //IList<TPrimaryKeyType> result;
            //using (var c = Context)
            //{
            //    _provider._openConnectionIfBeforeClosed(c);
            //    result = procedure(c);
            //}
            //return result;
        }

        #endregion

        #region Helper

        protected abstract void _setUpdatedData(TEntity oldData, TDataModel newData);

        public virtual TEntity ConvertToEntity(TDataModel dataModel) {
            var entity = new TEntity();
            _setUpdatedData(entity, dataModel);
            return entity;
        }

        public virtual IList<TEntity> ConvertToEntities(IList<TDataModel> dataModel) {
            return dataModel.Select(ConvertToEntity).ToList();
        }

        public abstract TDataModel ConvertToWorkModel(TEntity entity);

        public IList<TDataModel> ConvertToWorkModel(IList<TEntity> entityes) {
            return entityes.Select(ConvertToWorkModel).ToList();
        }


        public ITable<TEntity> GetTable(TDataContext context) {
            return context.GetTable<TEntity>();
        }

        #endregion
    }
}