using System;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Options;

namespace TestDbNoDepenceApp
{
    public class TestConnectionOptions
    {
        public string Test { get; set; }
    }
    public interface ITestDbProvider
    {
        void ContextAction(Action<IDbConnection> action, string connectionString = null);
        void Transaction(Action<IDbConnection, IDbTransaction> action, string connectionString = null);
    }
    public class TestDbProvider : ITestDbProvider
    {
        private readonly TestConnectionOptions _opts;
        public readonly string DefaultConnectionName;
        public TestDbProvider(IOptions<TestConnectionOptions> opts)
        {
            _opts = opts.Value;
            DefaultConnectionName = _opts.Test;
        }

        public void ContextAction(Action<IDbConnection> action, string connectionString = null)
        {
            using (IDbConnection db = new SqlConnection(_getConnectionString(connectionString)))
            {
                action(db);
            }
        }

        public void Transaction(Action<IDbConnection, IDbTransaction> action, string connectionString = null)
        {
            using (var conn = new SqlConnection(_getConnectionString(connectionString)))
            {
                conn.Open();

                // create the transaction
                // You could use `var` instead of `SqlTransaction`
                using (var tran = conn.BeginTransaction())
                {
                    try
                    {
                        //var sql = "update Widget set Quantity = @quantity where WidgetId = @id";
                        //var parameters = new { id = widgetId, quantity };
                        //// pass the transaction along to the Query, Execute, or the related Async methods.
                        //conn.Execute(sql, parameters, tran);
                        action(conn, tran);
                        // if it was successful, commit the transaction
                        tran.Commit();
                    }
                    catch (Exception e)
                    {
                        // roll the transaction back
                        tran.Rollback();
                        Console.WriteLine(e);
                        // handle the error however you need to.
                        throw;
                    }
                    finally
                    {
                        conn.Close();
                    }
                }
            }
        }

        private  string _getConnectionString(string connectionString = null)
        {
            return connectionString ?? DefaultConnectionName;
        }
    }
}