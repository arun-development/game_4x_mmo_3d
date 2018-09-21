using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Dapper;
 

namespace Server.DataLayer
{
    public interface IDapperRepository<TEntity, TKeyType>
        where TEntity : IDataModel<TKeyType> where TKeyType : struct
    {
        #region Declare

        string SchemeTableName { get; }

        #endregion

        bool Delete(IDbConnection c, TKeyType id, IDbTransaction tran = null);
        bool Delete(IDbConnection c, IList<TKeyType> ids, IDbTransaction tran = null);
        bool DeleteAll(IDbConnection c, IDbTransaction tran = null);

        TEntity GetById(IDbConnection c, TKeyType id);
        IList<TEntity> GetAll(IDbConnection c);

        bool Update(IDbConnection c, TEntity item, IDbTransaction tran = null);
        TEntity AddOrUpdate(IDbConnection c, TEntity item, IDbTransaction tran = null);
        IList<TEntity> AddOrUpdate(IDbConnection c, IList<TEntity> items, IDbTransaction tran = null);

        IDbProvider Provider { get; }
        bool ExecInsertMany(IDbConnection c, IList<TEntity> items, IDbTransaction tran = null);
    }

    public class UpsertCommandContainer
    {
        private static readonly Dictionary<string, string> NumericKeyTypeNameKeySqlKeyTypeNameValue = new Dictionary<string, string>
            {
                {typeof(byte).Name,"TINYINT"},
                {typeof(short).Name,"SMALLINT"},
                {typeof(int).Name,"INT"},
                {typeof(long).Name,"BIGINT"}
            };
        public Type TypeInfo { get; }
        /// <summary>
        /// Все имена полей кроме Id
        /// </summary>
        public IList<string> WorkPropertyNames { get; }

        /// <summary>
        /// имя типа ключа, используется для создания переменной sql  и указания ее типа, например с# byte=> Int16, SQL => TINYINT,
        ///  тут будет лежать преобразованное значение  те 'TINYINT'
        /// </summary>
        public string PrimarySqlKeyTypeName { get; }
        /// <summary>
        /// Собранная строка из имен полей для вставки в sql запрос ассоциированная с именами полей в таблице
        /// prop1,prop2 prop(n)
        /// </summary>
        public string SqlKeyNames { get; }
        /// <summary>
        /// Собранная строка  указываюшая на имя переменной в которой хранится значение 
        ///  @prop1,@prop2,@prop(n)
        /// </summary>
        public string SqlValueNames { get; }
        /// <summary>
        ///  строка для обновления пример prop1=@prop1,prop2=@prop2,prop(n)=@prop(n)
        /// </summary>
        public string SqlStringUpdateKeyValues { get; }
        /// <summary>
        /// должно совпадать с именем таблицы
        /// </summary>
        public string ModelName { get; }
 
        public UpsertCommandContainer(Type modelType)
        {
            TypeInfo = modelType;
            PrimarySqlKeyTypeName = GetSqlKeyTypeName();
            WorkPropertyNames = modelType.GetProperties().Where(i => i.Name != "Id").Select(i => i.Name).ToList();

            SqlKeyNames = "";
            SqlValueNames = "";
            SqlStringUpdateKeyValues = "";
            ModelName = TypeInfo.Name;


            foreach (var i in WorkPropertyNames)
            {
                var nameItem = i;
                var varItem = "@" + nameItem;
                var updateItem = nameItem + "=" + varItem;
                SqlKeyNames += nameItem + ",";
                SqlValueNames += varItem + ",";
                SqlStringUpdateKeyValues += updateItem + ",";
            }

            SqlKeyNames = _removeLastComa(SqlKeyNames);
            SqlValueNames = _removeLastComa(SqlValueNames);
            SqlStringUpdateKeyValues = _removeLastComa(SqlStringUpdateKeyValues);

        }
        private string _removeLastComa(string simbols)
        {
            return simbols.EndsWith(",") ? simbols.Substring(0, simbols.Length - 1) : simbols;
        }
        private string GetSqlKeyTypeName()
        {
            return NumericKeyTypeNameKeySqlKeyTypeNameValue[TypeInfo.GetProperty("Id")?.PropertyType.Name ?? throw new InvalidOperationException()];

        }
    }


    /// <summary>
    /// Выполняет  CRUD операции
    /// </summary>
    /// <typeparam name="TEntity">Имя типа модели обязано соответствовать имени таблицы, открытые свойства в модели обязанны соответствовать именам  в таблице. с учетом регистра</typeparam>
    /// <typeparam name="TKeyType">Допускаются только нумерик тайпы ключей</typeparam>
    public abstract class DapperRepository<TEntity, TKeyType> : IDapperRepository<TEntity, TKeyType>
        where TEntity : IDataModel<TKeyType> where TKeyType : struct

    {
        #region Declare

        protected UpsertCommandContainer UpsertMapper { get; }
        protected string UpsertSingleItemTemplate;
        protected string UpdateSingleItemTemplate;
        protected DapperRepository(IDbProvider provider, string schemeName = null)
        {
            //string schemeName = null
            _provider = provider;
            if (schemeName == null)
            {
                schemeName = DefaultScheme;
            }

            UpsertMapper = new UpsertCommandContainer(typeof(TEntity));
            _tableName = UpsertMapper.ModelName;
            SchemeTableName = _provider.GetTableName(_tableName, schemeName);
            UpsertSingleItemTemplate = _createUpSertTemplateWhithOutput();
            UpdateSingleItemTemplate = _createUpdateItemByIdTemplate();

        }

        protected string _tableName { get; }
        public string SchemeTableName { get; }
        public string DefaultScheme { get; } = DbProviderHelper.DefaultScheme;

        #endregion

        #region Interface

        #endregion

        public virtual void ThrowIfConnectionIsNull(IDbConnection connection) => _provider.ThrowIfConnectionIsNull(connection);

        // ReSharper disable  InconsistentNaming
        protected readonly IDbProvider _provider;
 
        // ReSharper restore  InconsistentNaming
 
        #region WhithConnection 

        public virtual bool Delete(IDbConnection c, TKeyType id, IDbTransaction tran = null)
        {
            ThrowIfConnectionIsNull(c);
            c.Execute(_provider.SqlDelete(SchemeTableName), new {id}, tran);
            return true;
        }

        public virtual bool Delete(IDbConnection c, IList<TKeyType> ids, IDbTransaction tran = null)
        {
            ThrowIfConnectionIsNull(c);
            var itemIds = ids.Aggregate("", (current, id) => current + (id.ToString() + ','));
            itemIds = itemIds.Substring(0, itemIds.Length - 1);
            var sql = $"DELETE FROM {SchemeTableName} WHERE Id in ({itemIds})";
            c.Execute(sql, commandType: CommandType.Text, transaction: tran);
            return true;
        }

        public virtual bool DeleteAll(IDbConnection c, IDbTransaction tran = null)
        {
            ThrowIfConnectionIsNull(c);
            c.Execute(_provider.SqlDeleteAll(SchemeTableName), transaction: tran);
            return true;
        }

        public virtual TEntity GetById(IDbConnection c, TKeyType id)
        {
            ThrowIfConnectionIsNull(c);
            return c.Query<TEntity>(_provider.SqlGetById(SchemeTableName), new {Id= id }).FirstOrDefault();
        }

        public virtual IList<TEntity> GetAll(IDbConnection c)
        {
            ThrowIfConnectionIsNull(c);
            return c.Query<TEntity>(_provider.SqlGetAll(SchemeTableName)).ToList();
        }
 

        public virtual bool Update(IDbConnection c, TEntity item, IDbTransaction tran = null)
        {
            ThrowIfConnectionIsNull(c);
            var status = _provider.Exec(c, UpdateSingleItemTemplate, item);
            return status == 1;
        }
        
        public virtual TEntity AddOrUpdate(IDbConnection c, TEntity item, IDbTransaction tran = null)
        {
            ThrowIfConnectionIsNull(c);
            var newItem = _provider.Text<TEntity>(c, UpsertSingleItemTemplate, item).FirstOrDefault();
            return newItem;

        }


        public bool ExecInsertMany(IDbConnection c, IList<TEntity> items, IDbTransaction tran = null)
        {
            var rowInserted = c.Execute($"INSERT INTO {SchemeTableName}({UpsertMapper.SqlKeyNames}) VALUES ({UpsertMapper.SqlValueNames})", items);
            return rowInserted == items.Count;
        }
        public virtual IList<TEntity> AddOrUpdate(IDbConnection c, IList<TEntity> items, IDbTransaction tran = null)
        {
            return items.Select(item => AddOrUpdate(c, item, tran)).ToList();
        }

        public IDbProvider Provider => _provider;

        #endregion


        #region string builder
        

        protected string _createUpSertTemplateWhithOutput()
        {
            var m = UpsertMapper;

            var upsertSql =
                //@"BEGIN TRAN add_or_update_item " +
                //@"BEGIN TRY " +
                $@"IF (ISNULL (@Id,0)=0)  INSERT INTO {SchemeTableName} ({m.SqlKeyNames}) OUTPUT INSERTED.* values({
                        m.SqlValueNames
                    });" +
                $@"ELSE IF EXISTS(SELECT TOP 1 Id FROM {SchemeTableName} WHERE Id = @Id) UPDATE  {SchemeTableName} SET {
                        m.SqlStringUpdateKeyValues
                    } OUTPUT INSERTED.*  WHERE Id=@Id;" +
                $@"ELSE INSERT INTO {SchemeTableName}(Id,{
                        m.SqlKeyNames
                    }) OUTPUT INSERTED.* values(@Id,{m.SqlValueNames}) ";// +
                //@"COMMIT TRAN add_or_update_item;" +
                //@"END TRY " +
                //@"BEGIN CATCH " +
                //@"ROLLBACK TRANSACTION add_or_update_item; " +
                //@"THROW " +
                //@"END CATCH ";
            return upsertSql;
        }
        protected string _createUpSertTemplateWithSelect()
        {
            var m = UpsertMapper;
            var upsertSql =
                $@"DECLARE @_id {m.PrimarySqlKeyTypeName};" +
                //@"BEGIN TRAN add_or_update_item " +
                //@"BEGIN TRY " +
                @"IF (ISNULL (@Id,0)=0)" +
                @"BEGIN " +
                $"INSERT INTO {SchemeTableName} ({m.SqlKeyNames}) OUTPUT INSERTED.* values ({m.SqlValueNames});" +
                @"SET @_id = SCOPE_IDENTITY();" +
                @"END " +
                @"ELSE " +
                @"BEGIN " +
                $"{_getUpdateString(m.SqlStringUpdateKeyValues, @"Id=@Id;")}" +
                @"IF (@@ROWCOUNT = 0) " +
                @"BEGIN " +
                $"INSERT INTO {SchemeTableName} (Id,{m.SqlKeyNames}) VALUES (@Id,{m.SqlValueNames});" +
                @"END " +
                @"SET @_id =@Id;" +
                @"END " +
                //@"COMMIT TRAN add_or_update_item;" +
                //@"END TRY " +
                //@"BEGIN CATCH " +
                //@"ROLLBACK TRANSACTION add_or_update_item; " +
                //@"THROW " +
                //@"END CATCH " 
                _getSelectItemWhereString(@"Id=@_id;");


            return upsertSql;
        }



        protected string _createUpdateItemByIdTemplate()
        {
           return _getUpdateString(UpsertMapper.SqlStringUpdateKeyValues, @"Id=@Id;");
 
        }

        protected string _getUpdateString(string setKeyValues, string where)
        {
            return $"UPDATE {SchemeTableName} SET {setKeyValues} WHERE {where} ";
        }

        protected string _getSelectItemWhereString(string whereBody)
        {
          return $" SELECT * FROM {SchemeTableName} WHERE {whereBody} ";
        }



        #endregion
    }
}