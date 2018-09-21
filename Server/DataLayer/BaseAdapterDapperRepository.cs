using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using Dapper;
using Server.Extensions;

namespace Server.DataLayer
{
    public interface IConvertToEntity<TEntity, TDataModel>
    {
        TEntity ConvertToEntity(TDataModel dataModel);
        TDataModel ConvertToWorkModel(TEntity dataModel);
        IList<TEntity> ConvertToEntities(IList<TDataModel> dataModels);
        IList<TDataModel> ConvertToWorkModel(IList<TEntity> entityes);
    }

    public interface IBaseReposytory<TEntity, TDataModel, in TPrimaryKeyType>
    {
        #region Core Sinc

        TDataModel GetById(TPrimaryKeyType id);


        IList<TDataModel> GetAll();


        IList<TEntity> InsertAllOnSubmit(IList<TDataModel> dataModels);
        TEntity InsertOnSubmit(TDataModel newDataModel);

        void DeleteAllOnSubmit(IList<TDataModel> dataModels);


        IList<TDataModel> AddOrUpdateAll(IList<TDataModel> newDataModels);

        TDataModel AddOrUpdate(TDataModel newUpdatedData);


        IList<TDataModel> RWhereTake(Expression<Func<TEntity, bool>> where, int count);
        IList<TDataModel> RWhere(Expression<Func<TEntity, bool>> where);

        IList<TResult> RWhereSelect<TResult>(Expression<Func<TEntity, bool>> where,
            Expression<Func<TEntity, TResult>> selector);


        TEntity RFirstOrDefaultEntity(Expression<Func<TEntity, bool>> where = null);

        #endregion
    }

    public interface IAdapterDapper<TEntity, TDataModel, TPrimaryKeyType> :
        IConvertToEntity<TEntity, TDataModel>,
        IDapperRepository<TEntity, TPrimaryKeyType>
        where TPrimaryKeyType : struct where TEntity : IDataModel<TPrimaryKeyType>
    {
        #region Declare

   

        #endregion

        TDataModel GetModelById(IDbConnection connection, TPrimaryKeyType id);

        IList<TDataModel> AddOrUpdateAllModels(IDbConnection connection, IList<TDataModel> newDataModels);
        IList<TDataModel> GetAllModels(IDbConnection connection);

        TDataModel AddOrUpdateeModel(IDbConnection connection, TDataModel newUpdatedData);

        IList<TPrimaryKeyType> GetAllIds(IDbConnection connection);

        bool HasItems(IDbConnection connection);
    }


    public interface IDeleteAllProcedure
    {
        bool DeleteAllProcedure(IDbConnection connection);
    }

    public interface IDeleteItemProcedure<in TPrimaryKeyType>
    {

        bool DeleteItemProcedure(IDbConnection connection, TPrimaryKeyType id);
    }

    public interface IProcedureRepository<TDataModel, TPrimaryKeyType> : IDeleteAllProcedure,
        IDeleteItemProcedure<TPrimaryKeyType>
    {
        #region Procedure Sinc

        TDataModel GetByIdProcedure(TPrimaryKeyType id);
        IList<TPrimaryKeyType> GetAllIdsProcedure();

        IList<TDataModel> GetAllProcedure();

        #endregion
    }


    public abstract class AdapterDapperRepository<TEntity, TDataModel, TPrimaryKeyType> :
        DapperRepository<TEntity, TPrimaryKeyType>,
        IAdapterDapper<TEntity, TDataModel, TPrimaryKeyType>
        where TPrimaryKeyType : struct
        where TEntity : IDataModel<TPrimaryKeyType>, new()
        where TDataModel : class, IDataModel<TPrimaryKeyType> 
    {
        #region Declare

        protected AdapterDapperRepository(IDbProvider provider) : base(provider)
        {
            //string schemeName = null
        }


        #endregion

        #region Interface

        public bool HasItems(IDbConnection connection)
        {
   
            ThrowIfConnectionIsNull(connection);
            var result = false;
            var items = connection.Query($"SELECT TOP 1 Id FROM {SchemeTableName}");
            if (items != null && items.Any())
            {
                result = true;
            }
            return result;
        }

        public TDataModel GetModelById(IDbConnection connection, TPrimaryKeyType id)
        {
            ThrowIfConnectionIsNull(connection);
            var model = GetById(connection, id);
            return model == null ? null : ConvertToWorkModel(model);
        }

        public virtual IList<TDataModel> AddOrUpdateAllModels(IDbConnection connection, IList<TDataModel> newDataModels)
        {
            ThrowIfConnectionIsNull(connection);
            var models = AddOrUpdate(connection, ConvertToEntities(newDataModels));
            if (models == null || !models.Any())
            {
                return null;
            }
            return ConvertToWorkModel(models);
        }

        public IList<TDataModel> GetAllModels(IDbConnection connection)
        {
            ThrowIfConnectionIsNull(connection);
            var models = GetAll(connection);
            if (models == null || !models.Any())
            {
                return null;
            }
            return ConvertToWorkModel(GetAll(connection));
 
        }


        public TDataModel AddOrUpdateeModel(IDbConnection connection, TDataModel newUpdatedData)
        {
            ThrowIfConnectionIsNull(connection);
            var entity = ConvertToEntity(newUpdatedData);
            var upd = AddOrUpdate(connection,entity);
            if (upd == null)
            {
                return null;
            }
            var reult = ConvertToWorkModel(upd);
            return reult;
        }


        public virtual IList<TPrimaryKeyType> GetAllIds(IDbConnection connection)
        {
            ThrowIfConnectionIsNull(connection);
            return connection.Query<TPrimaryKeyType>($"SELECT Id FROM {SchemeTableName}").ToList();
        }

        #endregion

        #region Helper

        protected abstract void _setUpdatedData(TEntity oldData, TDataModel newData);

        public virtual TEntity ConvertToEntity(TDataModel dataModel)
        {
            var entity = new TEntity();
            _setUpdatedData(entity, dataModel);
            return entity;
        }

        public virtual IList<TEntity> ConvertToEntities(IList<TDataModel> dataModel) =>
            dataModel.Select(ConvertToEntity).ToList();

        public abstract TDataModel ConvertToWorkModel(TEntity entity);

        public virtual IList<TDataModel> ConvertToWorkModel(IList<TEntity> entityes) =>
            entityes.Select(ConvertToWorkModel).ToList();

        public abstract bool DeleteAllProcedure(IDbConnection connection);

        protected bool _deleteAllProcedire(IDbConnection connection, string procedureName, bool throwIfFalse = false,
            string tableNameForResetIndex = null, int restIndex = 0)
        {
            ThrowIfConnectionIsNull(connection);
            var result = _provider.Procedure<bool>(connection, procedureName).FirstOrDefault();
            if (result && tableNameForResetIndex != null)
            {
                _provider._help_reset_index(connection, tableNameForResetIndex, restIndex);
            }
            else if (!result && throwIfFalse)
            {
                throw new NotImplementedException(
                    $"{nameof(_deleteAllProcedire)} : {procedureName} : {tableNameForResetIndex}");
            }
            return result;
        }

        #endregion
    }

    public static class BaseAdapterDapperRepositoryProcedureHelper
    {
        public static IDbConnection _help_reset_index(this IDbProvider provider, IDbConnection connection,
            string tableName, int lastIndex = 0)
        {
            provider.ThrowIfConnectionIsNull(connection);
            provider.ExecProcedure(connection, "help_reset_index", new
            {
                dbName = tableName,
                lastIndex
            });
            return connection;
        }
    }
}