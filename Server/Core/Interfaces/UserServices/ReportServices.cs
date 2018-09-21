using System;
using System.Collections.Generic;
using System.Data;
using Server.DataLayer;
using Server.Services.OutModel.JournalOut;

namespace Server.Core.Interfaces.UserServices
{
    public interface IUReportService<TPrimaryKeyType, TDataModel> : IBaseService<TPrimaryKeyType, TDataModel>
        where TPrimaryKeyType : struct where TDataModel : class
    {
        #region Sync

        UserReportDataModel GetReportById(IDbConnection connection, int reportId);
        List<TResult> GetUserReports<TResult>(IDbConnection connection, int userId, Func<TDataModel, TResult> selector, int lastReportId = 0);
        TResult GetUserReportByTaskId<TResult>(IDbConnection connection, int userId, int taskId, Func<TDataModel, TResult> selector);
        void SetLoseAndWin(IDbConnection connection, int userId, Action<int> setWins, Action<int> setloses);
        int GetTotalUserReports(IDbConnection connection, int userId);

        #endregion
    }

    public interface IUReportService : IUReportService<int, UserReportDataModel>
    {
    }

    public interface IUSpyService<TPrimaryKeyType, TDataModel> : IBaseService<TPrimaryKeyType, TDataModel>
        where TPrimaryKeyType : struct where TDataModel : class
    {
        #region Sync

        List<TResult> GetSpyReports<TResult>(IDbConnection connection, int userId, Func<TDataModel, TResult> selector, int lastId = 0);
        TDataModel GetUserSpyItem(IDbConnection connection, int sourceUserId, TPrimaryKeyType spyId);
        int GetTotalUserSpyReports(IDbConnection connection, int userId);
        int GetSpyId(IDbConnection connection, int sourceUserId, int dataActivate);

        #endregion
    }

    public interface IUSpyService : IUSpyService<int, UserSpyDataModel>
    {
 
    }


    public interface IUTaskService<TPrimaryKeyType, TDataModel> : IBaseService<TPrimaryKeyType, TDataModel>
        where TPrimaryKeyType : struct where TDataModel : class
    {
        #region Sync

        IList<TDataModel> GetTasksBySourceUserId(IDbConnection connection, int userId);
        IList<TResult> GetActiveTask<TResult>(IDbConnection connection, int userId, Func<TDataModel, TResult> selector, List<int> userPlanetIds);
        IList<TResult> GetUserNotFinishedTasks<TResult>(IDbConnection connection, int userId, Func<TDataModel, TResult> selector);
        TDataModel GetDoneTaskById(IDbConnection connection, int taskId);
        IList<TResult> GetTask<TResult>(IDbConnection connection, Func<TDataModel, bool> @where, Func<TDataModel, TResult> selector);
        IList<int> GetAllUserIdsFromTasks(IDbConnection connection);
        TDataModel GetByTaskId(IDbConnection connection, int taskId, bool whidthEnded);
        int GetTaskId(IDbConnection connection, int sourceUserId, int dateActivate);
        void NotyfyTaskCreated(UserTaskDataModel createdTask, int targetUserId);
        void NotyfyTaskFinished(UserTaskDataModel finishedTask, UserReportDataModel report = null, int? newTotalWinnerUserCc = null);
        TabTaskOut SetTaskItem(UserTaskDataModel newTaskItem);

        #endregion
    }


    public interface IUTaskService : IUTaskService<int, UserTaskDataModel>
    {
        UserTaskDataModel SetUpdateInProgress(IDbConnection connection, UserTaskDataModel taskItem);
        void UnlockUpdateInProgress(IDbConnection connection, int taskId);
 
    }
}