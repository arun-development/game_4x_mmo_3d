using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Dapper;

namespace TestDbNoDepenceApp.DapperCore.Infrastructure
{
    public interface ITestDapperCoreRepository
    {
        
        bool ExecInsertMany(IDbConnection c, IList<test_dapper_core_item> items, IDbTransaction tran = null);

        IList<test_dapper_core_item> InsertAndGet(IDbConnection c, IList<test_dapper_core_item> items,IDbTransaction tran = null);

        test_dapper_core_item AddOrUpdate(IDbConnection c, test_dapper_core_item item, IDbTransaction tran = null);
        IList<test_dapper_core_item> AddOrUpdate(IDbConnection c, IList<test_dapper_core_item> items, IDbTransaction tran = null);
        bool Delete(IDbConnection c, int id, IDbTransaction tran = null);
        bool Delete(IDbConnection c, IList<int> ids, IDbTransaction tran = null);
        bool DeleteAll(IDbConnection c, IDbTransaction tran = null);
        IList<test_dapper_core_item> GetAll(IDbConnection c);
        test_dapper_core_item GetById(IDbConnection c, int id);
        bool Update(IDbConnection c, test_dapper_core_item item, IDbTransaction tran = null);

 

    }
    
    public class TestDapperCoreRepository : ITestDapperCoreRepository
    {
        #region Declare

        private readonly ITestDbProvider _provider;

        public TestDapperCoreRepository(ITestDbProvider provider)
        {
            _provider = provider;
            UpsertMapper = new TestUpsertCommandContainer(typeof(test_dapper_core_item));
            _tableName = UpsertMapper.ModelName;
            SchemeTableName = $"[dbo].{_tableName}";
            UpsertSingleItemTemplate = _createUpSertTemplateWhithOutput();
            UpdateSingleItemTemplate = _createUpdateItemByIdTemplate();
        }

        protected TestUpsertCommandContainer UpsertMapper { get; }
        protected string _tableName { get; }
        public string SchemeTableName { get; }
        public string UpsertSingleItemTemplate { get; }
        public string UpdateSingleItemTemplate { get; }

        #endregion

        protected string _testCreateTable() =>
            $@"CREATE TABLE [dbo].[test_dapper_core_item] ([Id] INT IDENTITY (1, 1) NOT NULL,[value_1] NVARCHAR (MAX) NULL,[value_2] NVARCHAR (MAX) NULL,PRIMARY KEY CLUSTERED ([Id] ASC))";

        protected string _createUpSertTemplateWhithOutput()
        {
            var m = UpsertMapper;

            var upsertSql =
                @"BEGIN TRAN add_or_update_item " +
                @"BEGIN TRY " +
                $@"IF (ISNULL (@Id,0)=0)  INSERT INTO {SchemeTableName} ({m.SqlKeyNames}) OUTPUT INSERTED.* values({m.SqlValueNames});" +
                $@"ELSE IF EXISTS(SELECT TOP 1 Id FROM {SchemeTableName} WHERE Id = @Id) UPDATE  {SchemeTableName} SET {m.SqlStringUpdateKeyValues} OUTPUT INSERTED.*  WHERE Id=@Id;" +
                $@"ELSE INSERT INTO {SchemeTableName}(Id,{m.SqlKeyNames}) OUTPUT INSERTED.* values(@Id,{m.SqlValueNames})" +
                @"COMMIT TRAN add_or_update_item;" +
                @"END TRY " +
                @"BEGIN CATCH " +
                @"ROLLBACK TRANSACTION add_or_update_item; " +
                @"THROW " +
                @"END CATCH ";
            return upsertSql;
        }
        protected string _createUpSertTemplateWithSelect()
        {
            var m = UpsertMapper;
            var upsertSql =
                $@"DECLARE @_id {m.PrimarySqlKeyTypeName};" +
                @"BEGIN TRAN add_or_update_item " +
                @"BEGIN TRY " +
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
                @"COMMIT TRAN add_or_update_item;" +
                @"END TRY " +
                @"BEGIN CATCH " +
                @"ROLLBACK TRANSACTION add_or_update_item; " +
                @"THROW " +
                @"END CATCH " + _getSelectItemWhereString(@"Id=@_id;");


            return upsertSql;
        }

        protected string _createUpdateItemByIdTemplate() =>
            _getUpdateString(UpsertMapper.SqlStringUpdateKeyValues, @"Id=@Id;");

        protected string _getUpdateString(string setKeyValues, string where) =>
            $"UPDATE {SchemeTableName} SET {setKeyValues} WHERE {where} ";

        protected string _getSelectItemWhereString(string whereBody) =>
            $" SELECT * FROM {SchemeTableName} WHERE {whereBody} ";


        #region CRUD
        public virtual test_dapper_core_item GetById(IDbConnection c, int id)
        {

            return c.Query<test_dapper_core_item>(_provider.SqlGetById(SchemeTableName), new { Id = id }).FirstOrDefault();
        }

        public virtual bool Update(IDbConnection c, test_dapper_core_item item, IDbTransaction tran = null)
        {

            var status = c.Execute(UpdateSingleItemTemplate, item);
            return status == 1;
        }

        public bool ExecInsertMany(IDbConnection c, IList<test_dapper_core_item> items, IDbTransaction tran = null)
        {
            var rowInserted = c.Execute($"INSERT INTO {SchemeTableName} VALUES ({UpsertMapper.SqlValueNames})", items);
            return rowInserted == items.Count;
        }

        /// <summary>
        ///  оставил дял примера
        /// </summary>
        /// <param name="items"></param>
        /// <returns></returns>
        private DataTable GetDataTableForProducts(List<test_dapper_core_item> items)
        {
            DataTable table = new DataTable();
            //using (var reader = ObjectReader.Create(items))
            //{
            //    table.Load(reader);
            //}

            //table.SetColumnsOrder(
            //    "Id",
            //    "Name",
            //    "Description",
            //    "Price",
            //    "Location",
            //    "Category",
            //    "Manufacturer",
            //    "Condition"
            //);

            return table;
        }

        /// <summary>
        /// Todo  не использвоать  - метод медленный
        /// </summary>
        /// <param name="c"></param>
        /// <param name="items"></param>
        /// <param name="tran"></param>
        /// <returns></returns>
        public IList<test_dapper_core_item> InsertAndGet(IDbConnection c, IList<test_dapper_core_item> items, IDbTransaction tran = null)
        {
            var sqlHead = $@"DECLARE @tablevar TABLE (Id {UpsertMapper.PrimarySqlKeyTypeName}) INSERT INTO  {SchemeTableName}({UpsertMapper.SqlKeyNames}) OUTPUT INSERTED.Id INTO @tablevar VALUES ";
            var sqlValues = "";//('qwe1'),('qwe2'),('qwe2')
            var stringTypeName = typeof(string).Name;
            var boolTypeName = typeof(bool).Name;
            foreach (var item in items)
            {
                var dic = item.GetType()
                    .GetProperties()
                    .Select(pi => new {pi.Name, Value = pi.GetValue(item, null)})
                    .Union(item.GetType().GetFields().Select(fi => new {fi.Name, Value = fi.GetValue(item)})
                    ).ToDictionary(ks => ks.Name, vs => vs.Value);

                //   var row = dic.Aggregate("(", (current, prop) => current + (prop.Value + ","));
                var row = "(";
                foreach (var dicItem in dic)
                {
                    if (dicItem.Key=="Id")
                    {
                        continue;
                    }
                    var val = dicItem.Value;
                    
                    if (val.GetType().Name == stringTypeName)
                    {
                        val = "'" + val + "'";
                    }
                    else if (val.GetType().Name == boolTypeName)
                    {
                        if ((bool) val)
                        {
                            val = 1;
                        }
                        else
                        {
                            val = 0;
                        }
                    }
                    row += val + ",";

                }
                row = row.Substring(0, row.Length - 1);
                row += ")";
                sqlValues += row +",";
            }
             sqlValues = sqlValues.Substring(0, sqlValues.Length - 1) +";";


            var sqlSelect = $@" SELECT s.* from {SchemeTableName} as s JOIN  @tablevar as t  ON t.Id =s.Id;";
            var sql = sqlHead + sqlValues + sqlSelect;
            var rowsInserted = c.Query<test_dapper_core_item>(sql, commandType:CommandType.Text).ToList();
            return rowsInserted;


        }

        public virtual test_dapper_core_item AddOrUpdate(IDbConnection c, test_dapper_core_item item, IDbTransaction tran = null)
        {
            return c.Query<test_dapper_core_item>(UpsertSingleItemTemplate, item, commandType: CommandType.Text, transaction: tran).SingleOrDefault();
        }

        public virtual IList<test_dapper_core_item> AddOrUpdate(IDbConnection c, IList<test_dapper_core_item> items, IDbTransaction tran = null)
        {
            return items.Select(item => AddOrUpdate(c, item, tran)).ToList();
        }



        public virtual bool Delete(IDbConnection c, int id, IDbTransaction tran = null)
        {
            c.Execute(_provider.SqlDelete(SchemeTableName), new { id }, tran);
            return true;
        }

        public virtual bool Delete(IDbConnection c, IList<int> ids, IDbTransaction tran = null)
        {
            var itemIds = ids.Aggregate("", (current, id) => current + (id.ToString() + ','));
            itemIds = itemIds.Substring(0, itemIds.Length - 1);
            var sql = $"DELETE FROM {SchemeTableName} WHERE Id in ({itemIds})";
            c.Execute(sql, commandType: CommandType.Text, transaction: tran);
            return true;
        }

        public virtual bool DeleteAll(IDbConnection c, IDbTransaction tran = null)
        {
            c.Execute(_provider.SqlDeleteAll(SchemeTableName), transaction: tran);
            return true;
        }

        public virtual IList<test_dapper_core_item> GetAll(IDbConnection c)
        {

            return c.Query<test_dapper_core_item>(_provider.SqlGetAll(SchemeTableName)).ToList();
        }

        #endregion

        #region Helpers

        #endregion
    }

    public static class DataTableExtensions
    {
        public static void SetColumnsOrder(
            this DataTable table,
            params String[] columnNames)
        {
            int columnIndex = 0;
            foreach (var columnName in columnNames)
            {
                table.Columns[columnName].SetOrdinal(columnIndex);
                columnIndex++;
            }
        }
    }
}