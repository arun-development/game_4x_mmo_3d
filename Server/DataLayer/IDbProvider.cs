using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Server.DataLayer.Repositories;

namespace Server.DataLayer
{
    public enum ConnectionNames : byte
    {
        HomeMain = 1,
        HomeDev = 21,
        HomeTest = 41,
        HomeAuth = 61,
        HomeAuthTest = 81,
        MaxHomeConnection = 99,

        AzureGameMain = 101,
        AzureGameDev = 121,

        AzureGameTest = 141,

        AzureAuthMain = 161,
        AzureAuthDev = 171,
        AzureAuthTest = 181,

        AzureGameDemo = 201,
        AzureAuthDemo = 202
    }
    public class DbConnectionOptions
    {
        public string HomeMain { get; set; }
        public string HomeDev { get; set; }
        public string HomeTest { get; set; }
        public string HomeAuth { get; set; }
        public string HomeAuthTest { get; set; }

        public string AzureGameMain { get; set; }
        public string AzureGameDev { get; set; }

        public string AzureGameTest { get; set; }

        public string AzureAuthMain { get; set; }
        public string AzureAuthDev { get; set; }
        public string AzureAuthTest { get; set; }

        public string AzureGameDemo { get; set; }
        public string AzureAuthDemo { get; set; }
    }

    public interface IDbProvider
    {

        T ContextAction<T>(Func<IDbConnection, T> action, ConnectionNames? connectionName = null);
        Task<T> ContextActionAsync<T>(Func<IDbConnection, Task<T>> action, ConnectionNames? connectionName = null);

        IDbProvider Transaction(Action<IDbTransaction> action, ConnectionNames? connectionName = null);
        Task<T> TransactionAsync<T>(Func<IDbTransaction, Task<T>> action, ConnectionNames? connectionName = null);
        void ThrowIfConnectionIsNull(IDbConnection connection);
        ConnectionNames ActiveConnection { get; }
    }

    public class DbProvider : IDbProvider
    {
        private readonly DbConnectionOptions _opts;
        private readonly ReadOnlyDictionary<ConnectionNames, string> _connections;

        public static ConnectionNames  AppConnectionName;
        public ConnectionNames _activeConnection = AppConnectionName;
        public DbProvider(IOptions<DbConnectionOptions> opts)
        {
            if (AppConnectionName == default(ConnectionNames))
            {
                throw new NotImplementedException("Не указан тип соединения. подробности смотреть в конструкторе класса StartAppRunner ");
            }
            _opts = opts.Value;
            _connections = _convertConnections(_opts);

        }
        /// <summary>
        /// Создает и Закрывает соединение возвращая результат, не может выполняться в транзакции
        /// </summary>
        /// <param name="action"></param>
        /// <param name="connectionName"></param>
        public T ContextAction<T>(Func<IDbConnection, T> action, ConnectionNames? connectionName = null)
        {
            using (IDbConnection db = new SqlConnection(_getConnectionString(connectionName)))
            {
                return action(db);
            }

        }

        public async Task<T> ContextActionAsync<T>(Func<IDbConnection, Task<T>> action, ConnectionNames? connectionName = null)
        {
            using (IDbConnection db = new SqlConnection(_getConnectionString(connectionName)))
            {
                return await action(db);
            }
        }

        /// <summary>
        /// Транзакция не работает
        /// </summary>
        /// <param name="action"></param>
        /// <param name="connectionName"></param>
        /// <returns></returns>
        public IDbProvider Transaction(Action<IDbTransaction> action, ConnectionNames? connectionName = null)
        {
            using (var conn = new SqlConnection(_getConnectionString(connectionName)))
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
                        action(tran);
                        // if it was successful, commit the transaction
                        tran.Commit();
                    }
                    catch (Exception ex)
                    {
                        // roll the transaction back
                        tran.Rollback();
                        Console.WriteLine(ex);
                        // handle the error however you need to.
                        throw;
                    }
                    finally
                    {
                        conn.Close();

                    }
                }
            }
            return this;
        }
        public async Task<T> TransactionAsync<T>(Func<IDbTransaction, Task<T>> action, ConnectionNames? connectionName = null)
        {
            T result = default(T);
            using (var conn = new SqlConnection(_getConnectionString(connectionName)))
            {
                conn.Open();

                // create the transaction
                // You could use `var` instead of `SqlTransaction`
                using (var tran = conn.BeginTransaction())
                {
                    try
                    {
                        await action(tran);
                        tran.Commit();
                    }
                    catch (Exception ex)
                    {
                        tran.Rollback();
                        Console.WriteLine(ex);
                        throw;
                    }
                    finally
                    {
                        conn.Close();
                    }
                }
            }
            return result;
        }

        private string _getConnectionString(ConnectionNames? connectionName = null)
        {
            _activeConnection = connectionName ?? AppConnectionName;
            return _connections[_activeConnection];

        }

        private ReadOnlyDictionary<ConnectionNames, string> _convertConnections(DbConnectionOptions o)
        {
            if (_connections != null) return _connections;

            var con = new ReadOnlyDictionary<ConnectionNames, string>(new Dictionary<ConnectionNames, string>
            {
                {ConnectionNames.HomeMain, o.HomeMain},
                {ConnectionNames.HomeDev, o.HomeDev},
                {ConnectionNames.HomeTest, o.HomeTest},
                {ConnectionNames.HomeAuth, o.HomeAuth},
                {ConnectionNames.HomeAuthTest, o.HomeAuthTest},
                
                {ConnectionNames.AzureGameMain, o.AzureGameMain},
                {ConnectionNames.AzureGameDev, o.AzureGameDev},
                {ConnectionNames.AzureGameTest, o.AzureGameTest},
                
                {ConnectionNames.AzureAuthMain, o.AzureAuthMain},
                {ConnectionNames.AzureAuthDev, o.AzureAuthDev},
                {ConnectionNames.AzureAuthTest, o.AzureAuthTest},
                
                {ConnectionNames.AzureGameDemo, o.AzureGameDemo},
                {ConnectionNames.AzureAuthDemo, o.AzureAuthDemo}

            });
            return con;
        }
        public virtual void ThrowIfConnectionIsNull(IDbConnection connection)
        {
            if (connection == null)
            {
                throw new NullReferenceException(nameof(connection));
            }
        }

        public ConnectionNames ActiveConnection => _activeConnection;
    }

    public static class DbProviderHelper
    {
        #region Sql

        public const string DefaultScheme = "dbo";
        public static string SqlDelete(this IDbProvider provider, string tableName) => $"DELETE FROM {tableName} WHERE Id=@id";
        public static string SqlDeleteAll(this IDbProvider provider, string tableName) => $"DELETE FROM {tableName}";
        public static string SqlGetById(this IDbProvider provider, string tableName) => $"SELECT TOP 1 * FROM {tableName} WHERE Id=@id";
        public static string SqlGetAll(this IDbProvider provider, string tableName) => $"SELECT * FROM {tableName}";
        public static string GetTableName(this IDbProvider provider, string tableName, string scheme = DefaultScheme) => $"[{scheme}].[{tableName}]";
        public static string GetProcedureName(this IDbProvider provider, string procedureName, string scheme = DefaultScheme) => provider.GetTableName(procedureName, scheme);

        public static void OpenIfClosed(this IDbConnection connection)
        {
            if (connection.State == ConnectionState.Closed)
            {
                connection.Open();
            }
        }
        public static void CloseIfOpened(this IDbConnection connection)
        {
            if (connection.State != ConnectionState.Closed)
            {
                connection.Close();
            }
        }

        #endregion

        #region Actions

        public static IEnumerable<T> Procedure<T>(this IDbProvider provider, IDbConnection connectrion,
            string procedureName, object param = null, IDbTransaction transaction = null,
            bool buffered = true, int? commandTimeout = null)
        {
           var result =  provider.EnumResult<T>(connectrion, procedureName, param, transaction, buffered, commandTimeout,CommandType.StoredProcedure);
            return result;
        }

        public static int ExecProcedure(this IDbProvider provider, IDbConnection connectrion, string procedureName,
            object param = null, IDbTransaction transaction = null,
            int? commandTimeout = null)
        {
            var exec = connectrion.Execute(provider.GetProcedureName(procedureName), param, transaction, commandTimeout, CommandType.StoredProcedure);
            return exec;
        }

        public static int Exec(this IDbProvider provider, IDbConnection connectrion, string sqlText, object param = null, IDbTransaction transaction = null, int? commandTimeout = null)
        {
            return connectrion.Execute(sqlText, param, transaction, commandTimeout, CommandType.Text);
        }
        public static IEnumerable<T> Text<T>(this IDbProvider provider, IDbConnection connectrion, string sqlText, object param = null, IDbTransaction transaction = null,
            bool buffered = true, int? commandTimeout = null)
        {
            return provider.EnumResult<T>(connectrion, sqlText, param, transaction, buffered, commandTimeout, CommandType.Text);
        }




        /// <summary>
        /// Выполняет действе в существующем соединении,соединение остается открытым
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="provider"></param>
        /// <param name="connectrion"></param>
        /// <param name="sql"></param>
        /// <param name="param"></param>
        /// <param name="transaction"></param>
        /// <param name="buffered"></param>
        /// <param name="commandTimeout"></param>
        /// <param name="commandType"></param>
        /// <returns></returns>
        private static IEnumerable<T> EnumResult<T>(this IDbProvider provider, IDbConnection connectrion, string sql, object param = null, IDbTransaction transaction = null, bool buffered = true, int? commandTimeout = null, CommandType? commandType = null)
        {
            var sqlAction = provider._sql(sql, commandType);
            var data = connectrion.Query<T>(sqlAction, param, transaction, buffered, commandTimeout, commandType);
            return data;
        }

        /// <summary>
        /// изменяет параметр sql  исходя из типа CommandType commandType
        /// commandType ==CommandType.TableDirect || null = > provider.GetTableName(sql)
        /// commandType ==CommandType.StoredProcedure =>provider.GetProcedureName(sql);
        /// commandType ==CommandType.Text =>sql;
        /// </summary>
        /// <param name="provider"></param>
        /// <param name="sql"></param>
        /// <param name="commandType"></param>
        /// <returns></returns>
        private static string _sql(this IDbProvider provider, string sql, CommandType? commandType = null)
        {
            string result = null;
            switch (commandType)
            {
                case null:
                case default(CommandType):
                case CommandType.TableDirect:
                    result = provider.GetTableName(sql);
                    break;
                case CommandType.StoredProcedure:
                    result = provider.GetProcedureName(sql);
                    break;
                case CommandType.Text:
                    result = sql;
                    break;
                default: break;
            }
            return result;
        }



        #endregion

        #region Registrate


        public static string GetConnectionString(this IConfiguration configuration, ConnectionNames connectionName) => configuration.GetSection($"{nameof(DbConnectionOptions)}:{ connectionName.ToString()}").Value;



        #endregion

    }
}