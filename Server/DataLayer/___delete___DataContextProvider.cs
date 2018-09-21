using System;
using System.Data;
using Server.Core;

namespace Server.DataLayer.Data
{
    public interface IDataContextProvider<T> where T : DataContext
    {

        void SaveInUsing(T context);
        void BeginTransaction(Action<T> transactionBody);
        void ContextAction(Action<T> action);
    }

    public abstract class DataContextProvider<T> : Disposable, IDataContextProvider<T>where T : DataContext, IDisposableData, new()
    {
        protected ConnectionNames _connectionName;




        protected DataContextProvider(ConnectionNames name)
        {
            _connectionName = name;
        }

        protected abstract T GetContext();


        protected virtual T GetContext(ConnectionNames name)
        {
            return CreateContext(GetConnectionString());
        }

        protected T ChangeConnection(ConnectionNames name)
        {
            throw new NotImplementedException();
        }



        protected virtual T CreateContext(ConnectionNames name)
        {
            return CreateContext(GetConnectionString());
        }

        private void _openConnectionIfBeforeClosed(T context)
        {
            var openedAfterRun = false;
            _openConnectionIfBeforeClosed(context, ref openedAfterRun);
        }
        private void _closeConnectionIfBeforeOpened(T context)
        {
            if (context != null && !context.IsDisposed && context.Connection != null && context.Connection.State != ConnectionState.Closed)
            {
                context.Connection.Close();
            }
        }

        private void _openConnectionIfBeforeClosed(T context, ref bool wasOpenedHeare)
        {
            var state = context.Connection.State;
            //if (state == ConnectionState.Open)
            //{
            //   context.Connection.Close();
            //}
            if (state == ConnectionState.Closed)
            {
                context.Connection.Open();
                wasOpenedHeare = true;
            }
        }



        private void _beginTransaction(Action<T> transactionBody, T context)
        {
            var openedConnection = false;
            _openConnectionIfBeforeClosed(context, ref openedConnection);

            using (var transaction = context.Connection.BeginTransaction(System.Data.IsolationLevel.ReadCommitted))
            {
                try
                {
                    context.Transaction = transaction;
                    transactionBody(context);

                    transaction.Commit();
                    context.Connection.Close();
                }
                catch (Exception e)
                {
                    transaction.Rollback();
                    Console.WriteLine(e);
                    throw;
                }
                finally
                {
                    if (openedConnection)
                    {
                        context.Connection.Close();
                    }
                }

                //catch (TransactionAbortedException ex)
                //{

                //    Transaction.Current.Rollback();
                //    writer.WriteLine("TransactionAbortedException Message: {0}", ex.Message);
                //    throw;
                //}
                //catch (ApplicationException ex)
                //{
                //    Transaction.Current.Rollback();
                //    writer.WriteLine("ApplicationException Message: {0}", ex.Message);
                //    throw;
                //}
                //catch (Exception ex)
                //{
                //    Transaction.Current.Rollback();
                //    writer.WriteLine("ApplicationException Message: {0}", ex.Message);
                //    throw;
                //}
            }
        }

        protected abstract T CreateContext(string connectionString);

        private string GetConnectionString()
        {
            return GetConnectionString(_connectionName);
        }

        private string GetConnectionString(ConnectionNames connectionName)
        {
            switch (connectionName)
            {
                case ConnectionNames.HomeGame1:
                    return Settings.Default.HomeGame1ConnectionString;
                case ConnectionNames.HomeGameTmp2:
                    return Settings.Default.HomeGameTmp2ConnectionString;
                case ConnectionNames.HomeGameTmp3:
                    return Settings.Default.HomeGameTmp3ConnectionString;


                case ConnectionNames.AzureGameMain:
                case ConnectionNames.AzureGameDemo1:
                    return Settings.Default.AzureGameMainConnectionString;
                case ConnectionNames.AzureGameDev1:
                    return Settings.Default.AzureGameDev1ConnectionString;
                case ConnectionNames.AzureGameDev2:
                    return Settings.Default.AzureGameDev2ConnectionString;


                default:
                    throw new ArgumentException("ConnectionName is Wrong");
            }
        }


        #region Public
        public void BeginTransaction(Action<T> transactionBody)
        {
            using (var c = CreateContext(_connectionName))
            {
                _beginTransaction(transactionBody, c);
            }
        }


        public void ContextAction(Action<T> action)
        {
            using (var c = CreateContext(_connectionName))
            {
                _openConnectionIfBeforeClosed(c);
                action(c);
                _closeConnectionIfBeforeOpened(c);
            }
        }

        public void SaveInUsing(T context)
        {
            if (context == null)
            {
                throw new NullReferenceException();
            }
            if (context.IsDisposed)
            {
                //  return;
            }
            try
            {
                context.SubmitChanges();
            }
            catch (ObjectDisposedException e)
            {
                throw;
            }
            catch (ChangeConflictException)
            {
                //https://habrahabr.ru/post/86302/
                //https://habrahabr.ru/post/88394/
                context.ChangeConflicts.ResolveAll(RefreshMode.KeepChanges);
                try
                {
                    context.SubmitChanges();
                }
                catch (ChangeConflictException e)
                {
                    Console.WriteLine("Конфликт повторился, откатываемся.");
                    throw new ChangeConflictException("Конфликт повторился, откатываемся.", e);
                }

            }
            catch (DuplicateKeyException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw;
            }
        }
        public string GetActiveConnsectionString()
        {
            return GetConnectionString();
        }

        #endregion



    }

    public interface IGameDataContextProvider : IDataContextProvider<GameDataContext>
    {
        ConnectionNames ActiveConnectionName { get; }
        ConnectionNames DefaultConnectionName { get; }
    }

    public class GameDataContextProvider : DataContextProvider<GameDataContext>, IGameDataContextProvider
    {
        private const ConnectionNames ConnectionName = ConnectionNames.HomeGameTmp3;
     //   private const ConnectionNames ConnectionName = ConnectionNames.AzureGameDev2;


        public GameDataContextProvider() : base(ConnectionName) { }

        public GameDataContextProvider(ConnectionNames сonnectionName) : base(сonnectionName) { }
 

        public ConnectionNames ActiveConnectionName => _connectionName;
        public ConnectionNames DefaultConnectionName => ConnectionName;

        protected override GameDataContext GetContext()
        {
            return GetContext(ActiveConnectionName);
        }

        protected override GameDataContext CreateContext(string connectionString)
        {
            return new GameDataContext(connectionString);
        }
    }
}