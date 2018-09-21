using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Dapper;
using Z.Dapper.Plus;

namespace TestDbNoDepenceApp.DapperPlus.Infrastructure
{
    // _db.Execute("DROP DATABASE IF EXISTS `my_db`;");
    //_db.Execute("CREATE DATABASE `my_db`;");
    public interface ITestDapperPlusRepository<TEntity, in TKeyType> where TEntity : ITestDataModel<TKeyType> where TKeyType : struct
    {

        TEntity GetById(TKeyType id);
        IList<TEntity> GetAll();

        TEntity Add(TEntity item);
        IList<TEntity> Add(List<TEntity> items);
        TEntity Update(TEntity item);
        IList<TEntity> Update(IList<TEntity> items);
        TEntity AddOrUpdate(TEntity item);
        IList<TEntity> AddOrUpdate(IList<TEntity> items);


        bool Delete(TKeyType id);
        bool DeleteAll();



        IList<TResult> Where<TResult>(string sql);

        string SchemeTableName { get; }

        void ContextAction(Action<IDbConnection> command);
        void Transaction(Action<IDbConnection, IDbTransaction> command, string connectionName = null);


    }
    public abstract class TestDapperPlusRepository<TEntity, TKeyType> : ITestDapperPlusRepository<TEntity, TKeyType> where TEntity : class, ITestDataModel<TKeyType>, new() where TKeyType : struct

    {
        protected string _tableName { get; }
        // ReSharper disable  InconsistentNaming
        protected readonly ITestDbProvider _povider;
        protected DapperPlusEntityMapper<TEntity> _mapper;
        // ReSharper restore  InconsistentNaming
        public string SchemeTableName { get; }
        public string DefaultScheme { get; } = TestDbProviderHelper.DefaultScheme;


        protected TestDapperPlusRepository(ITestDbProvider provider, string tableName, string schemeName = null)
        {

            _povider = provider;
            _tableName = tableName;
            if (schemeName == null) schemeName = DefaultScheme;
            SchemeTableName = _povider.GetTableName(_tableName, schemeName);
            
            _mapper = DapperPlusManager.Entity<TEntity>().Table(_tableName).Identity(x => x.Id).BatchSize(100000);

        }



        public IList<TResult> Where<TResult>(string sql)
        {
            var result = default(List<TResult>);
            _povider.ContextAction(c =>
            {
                result = c.Query<TResult>(sql).ToList();
            });
            return result;

        }



        public void ContextAction(Action<IDbConnection> command)
        {
            _povider.ContextAction(command);
        }
        public void Transaction(Action<IDbConnection, IDbTransaction> command, string connectionName = null)
        {
            _povider.Transaction(command, connectionName);

        }

        public virtual TEntity AddOrUpdate(TEntity item)
        {

            var result = default(TEntity);
            _povider.ContextAction(c =>
            {
                result = c.BulkMerge(item).CurrentItem;
            });
            return result;

        }

        public IList<TEntity> AddOrUpdate(IList<TEntity> items)
        {
            var result = default(IList<TEntity>);
            _povider.ContextAction(c =>
            {
                result = c.BulkMerge(items).CurrentItem;
            });
            return result;
        }

        public virtual bool Delete(TKeyType id)
        {
            _povider.ContextAction(c =>
            {
                c.Execute(_povider.SqlDelete(SchemeTableName), new { id });
            });
            return true;
        }
        public virtual bool DeleteAll()
        {

            _povider.ContextAction(c =>
            {
                c.Execute(_povider.SqlDeleteAll(SchemeTableName));
            });
            return true;
        }

        public virtual TEntity GetById(TKeyType id)
        {
            var result = default(TEntity);
            _povider.ContextAction(c =>
            {
                result = c.Query<TEntity>(_povider.SqlGetById(SchemeTableName), new { id }).FirstOrDefault();
            });
            return result;
        }

        public virtual IList<TEntity> GetAll()
        {
            var result = default(IList<TEntity>);
            _povider.ContextAction(c =>
            {
                result = c.Query<TEntity>(_povider.SqlGetAll(SchemeTableName)).ToList();
            });
            return result;
        }


        public TEntity Add(TEntity item)
        {
            var result = default(TEntity);

            _povider.ContextAction(c =>
            {
                result = c.BulkInsert(item).CurrentItem;
            });
            return result;
        }

        public IList<TEntity> Add(List<TEntity> items)
        {
            var result = default(List<TEntity>);

            _povider.ContextAction(c =>
            {
                result = c.BulkInsert(items).CurrentItem;
            });
            return result;
        }

        public TEntity Update(TEntity item)
        {
            var result = default(TEntity);

            _povider.ContextAction(c =>
            {
                result = c.BulkUpdate(item).CurrentItem;
            });
            return result;

        }
        public IList<TEntity> Update(IList<TEntity> items)
        {
            var result = default(IList<TEntity>);
            _povider.ContextAction(c =>
            {
                result = c.BulkUpdate(items).CurrentItem;
            });
            return result;
        }



    }
}