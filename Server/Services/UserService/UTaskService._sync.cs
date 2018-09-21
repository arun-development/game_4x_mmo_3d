using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Server.Core.HubUserModels;
using Server.Core.Infrastructure;
using Server.Core.Interfaces.UserServices;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.DataLayer;
using Server.DataLayer.LocalStorageCaches;
using Server.DataLayer.Repositories;
using Server.EndPoints.Hubs.GameHub;
using Server.Extensions;
using Server.Modules.Localize;
using Server.Services.AdvancedService;
using Server.Services.OutModel.JournalOut;

namespace Server.Services.UserService
{
    public class UTaskService : IUTaskService
    {
        #region Declare

        private readonly IServiceProvider _svp;
        private readonly IUserTaskRepository _userTaskRepo;
        private readonly IUTaskLocalStorageCache _uTaskCache;
        private IHubContext<MainGameHub> __hub;
        private IMainGameHubLocalStorageCache __hubCache;
        private IJournalOutService __journalOut;

        public UTaskService(IUserTaskRepository userTaskRepo, IUTaskLocalStorageCache uTaskCache,
            IServiceProvider svp)
        {
            _userTaskRepo = userTaskRepo;
            _uTaskCache = uTaskCache;
            _svp = svp;
        }

        private IHubContext<MainGameHub> _hub
        {
            get
            {
                if (__hub != null)
                {
                    return __hub;
                }
                return __hub = _svp.GetService<IHubContext<MainGameHub>>();
                //return __hub = _resolver.Resolve<IConnectionManager>().GetHubContext("MainGameHub");
            }
        }

        private IMainGameHubLocalStorageCache _hubCache
        {
            get
            {
                if (__hubCache != null)
                {
                    return __hubCache;
                }
                return __hubCache = _svp.GetService<IMainGameHubLocalStorageCache>();
            }
        }

        private IJournalOutService _journalOut
        {
            get
            {
                if (__journalOut != null)
                {
                    return __journalOut;
                }
                return __journalOut = _svp.GetService<IJournalOutService>();
            }
        }

        #endregion

        #region Interface

        public IList<TResult> GetActiveTask<TResult>(IDbConnection connection, int userId, Func<UserTaskDataModel, TResult> selector, List<int> userPlanetIds)
        {
            var curTime = UnixTime.UtcNow();
            if (!userPlanetIds.Any())
            {
                return _localAction(connection, i => i.SourceUserId == userId && i.DateActivate + i.Duration > curTime,
                    col => col.Select(selector).ToList());
            }

            return _localAction(connection, i => i.DateActivate + i.Duration > curTime &&
                                                 (i.SourceUserId == userId || userPlanetIds.Contains(i.TargetPlanetId)),
                col => col.Select(selector).ToList());
        }

        public IList<TResult> GetUserNotFinishedTasks<TResult>(IDbConnection connection, int userId, Func<UserTaskDataModel, TResult> selector)
        {
            return _localAction(connection, i => !i.TaskEnd && i.SourceUserId == userId, col => col.Select(selector).ToList());
        }

        public IList<TResult> GetTask<TResult>(IDbConnection connection, Func<UserTaskDataModel, bool> @where, Func<UserTaskDataModel, TResult> selector)
        {
            return _localAction(connection, @where, col => col.Select(selector).ToList());
        }

        public UserTaskDataModel GetDoneTaskById(IDbConnection connection, int taskId)
        {
            var task = _uTaskCache.GetById(connection, taskId, true);
            if (task == null || !task.TaskEnd)
            {
                return null;
            }
            return task;
        }

        public IList<int> GetAllUserIdsFromTasks(IDbConnection connection)
        {
            return _localAction(connection, i => !i.TaskEnd,
                col => { return col.Select(i => i.SourceUserId).Distinct().ToList(); });
        }

        public UserTaskDataModel GetByTaskId(IDbConnection connection, int taskId, bool whidthEnded)
        {
            var task = _uTaskCache.GetById(connection, taskId, true);
            if (task == null)
            {
                return null;
            }
            if (whidthEnded)
            {
                return task;
            }
            return task.TaskEnd ? null : task;
        }

        public int GetTaskId(IDbConnection connection, int sourceUserId, int dateActivate)
        {
            return _localAction(connection, i => i.SourceUserId == sourceUserId && i.DateActivate == dateActivate,
                col => col.Select(i => i.Id).FirstOrDefault());
        }


        public void NotyfyTaskCreated(UserTaskDataModel createdTask, int targetUserId)
        {
            IDbConnection connection = null; // коннекшен для этого метода не нужен, это часть интерфейса
            IList<ConnectionUser> hubUsers;
            object data = null;
            if (createdTask.IsTransfer)
            {
                hubUsers = _hubCache.LocalFind(connection, (key, val) => val.UserId == createdTask.SourceUserId);
                if (hubUsers == null || hubUsers.Count != 1 && !hubUsers[0].Connected)
                {
                    return;
                }
                L10N.SetCulture(hubUsers[0].Lang);
                data = SetTaskItem(createdTask);
                _hub.Clients.Client(hubUsers[0].ConnectionId).InvokeAsync("journalOnTaskCreated", data);
                return;
            }
            if (createdTask.SourceUserId == targetUserId)
            {
                throw new NotImplementedException("createdTask.SourceUserId == targetUserId");
            }
            if (createdTask.SourceUserId == Npc.SkagryGameUserId)
            {
                hubUsers = _hubCache.LocalFind(connection, (key, val) => val.UserId == targetUserId);
                if (hubUsers == null || hubUsers.Count != 1 || !hubUsers[0].Connected)
                {
                    return;
                }
                data = SetTaskItem(createdTask);
                _hub.Clients.Client(hubUsers[0].ConnectionId).InvokeAsync("journalOnTaskCreated", data);
                return;
            }
            hubUsers = _hubCache.LocalFind(connection, (key, val) =>
                 val.UserId == createdTask.SourceUserId || val.UserId == targetUserId);

            if (hubUsers == null || !hubUsers.Any() || hubUsers.All(i => !i.Connected))
            {
                return;
            }
            var atakerUsers = hubUsers.Where(i => i.UserId == createdTask.SourceUserId).ToList();
            var defendorUsers = hubUsers.Where(i => i.UserId == targetUserId).ToList();
            var connectionIds = new List<string>();
            if (atakerUsers.Any() && atakerUsers.Count == 1 && atakerUsers[0].Connected)
            {
                connectionIds.Add(atakerUsers[0].ConnectionId);
            }
            if (defendorUsers.Any() && defendorUsers.Count == 1 && defendorUsers[0].Connected)
            {
                connectionIds.Add(defendorUsers[0].ConnectionId);
            }
            if (connectionIds.Any())
            {
                data = SetTaskItem(createdTask);
                var clients = _hub.Clients;
                foreach (var cid in connectionIds)
                {
                    clients.Client(cid).InvokeAsync("journalOnTaskCreated", data);
                }
            }
        }

        public void NotyfyTaskFinished(UserTaskDataModel finishedTask, UserReportDataModel report = null, int? newTotalWinnerUserCc = null)
        {
            IDbConnection connection = null; // коннекшен для этого метода не нужен, это часть интерфейса
            if (!finishedTask.TaskEnd)
            {
                throw new NotImplementedException("NotyfyTaskFinished: finishedTask.TaskEnd = false");
            }
            IList<ConnectionUser> hubUsers;
            if (finishedTask.IsTransfer)
            {
                hubUsers = _hubCache.LocalFind(connection, (key, val) => val.UserId == finishedTask.SourceUserId);
                if (hubUsers == null ||  hubUsers.Count != 1 || !hubUsers[0].Connected)
                {
                    return;
                }
                _hub.Clients.Client(hubUsers[0].ConnectionId).InvokeAsync("journalOnTaskFinished", new
                {
                    Task = finishedTask,
                    TabReportOut = 0
                });
                return;

            }
            if (report == null)
            {
                return;
            }

            hubUsers = _hubCache.LocalFind(connection, (key, val) =>
                val.UserId == report.AtackerUserId || val.UserId == report.DefenderUserId);
            if (hubUsers == null || hubUsers.All(i => !i.Connected))
            {
                return;
            }
            var atakerUsers = hubUsers.Where(i => i.UserId == report.AtackerUserId).ToList();
            var defendorUsers = hubUsers.Where(i => i.UserId == report.DefenderUserId).ToList();
            ConnectionUser ataker = null;
            ConnectionUser defendor = null;

            if (atakerUsers.Any() && atakerUsers.Count == 1 && atakerUsers[0].Connected)
            {
                ataker = atakerUsers[0];
            }
            if (defendorUsers.Any() && defendorUsers.Count == 1 && defendorUsers[0].Connected)
            {
                defendor = defendorUsers[0];
            }


            if (ataker != null)
            {
                var client = _hub.Clients.Client(ataker.ConnectionId);
                if (client != null)
                {
                    L10N.SetCulture(ataker.Lang);
                    var atakerReport =
                        _journalOut.SetReportItem(report.AtackerUserId, new List<UserTaskDataModel> { finishedTask })(
                            report.CloneDeep());
                    TabReportOut.InitComplexBtnItem(atakerReport);
                    client.InvokeAsync("journalOnTaskFinished", new
                    {
                        Task = finishedTask,
                        TabReportOut = atakerReport,
                        NewTotalWinnerUserCc = newTotalWinnerUserCc != null && !atakerReport.IsLose
                            ? newTotalWinnerUserCc
                            : null
                    });
                }
            }
            if (defendor != null)
            {
                var client = _hub.Clients.Client(defendor.ConnectionId);
                if (client != null)
                {
                    L10N.SetCulture(defendor.Lang);
                    var defendorReport = _journalOut.SetReportItem(report.DefenderUserId,
                        new List<UserTaskDataModel> { finishedTask })(report.CloneDeep());
                    TabReportOut.InitComplexBtnItem(defendorReport);

                    client.InvokeAsync("journalOnTaskFinished", new
                    {
                        Task = finishedTask,
                        TabReportOut = defendorReport,
                        NewTotalWinnerUserCc = newTotalWinnerUserCc != null && !defendorReport.IsLose
                            ? newTotalWinnerUserCc
                            : null
                    });
                }
            }
        }


        public IList<UserTaskDataModel> GetTasksBySourceUserId(IDbConnection connection, int userId)
        {
            return _localAction(connection, i => i.SourceUserId == userId, col => col.ToList());
        }


        public string Test(string message = "Ok")
        {
            return message;
        }


        public UserTaskDataModel AddOrUpdate(IDbConnection connection, UserTaskDataModel dataModel)
        {
            var db = _userTaskRepo.AddOrUpdateeModel(connection, dataModel);
            return _uTaskCache.UpdateLocalItem(connection, db);
        }

        public bool Delete(IDbConnection connection, int taskId)
        {
            var old = _uTaskCache.GetById(connection, taskId, true);
            if (old == null)
            {
                return true;
            }
            var sucsess = _userTaskRepo.Delete(connection, taskId);
            //_provider.Commit();
            if (sucsess)
            {
                _uTaskCache.DeleteItem(taskId);
            }
            else
            {
                throw new NotImplementedException(Error.ErrorInUpdateDb);
            }
            return sucsess;
        }


        public bool DeleteAll(IDbConnection connection)
        {
            var result = false;
            try
            {
                result = _userTaskRepo.DeleteAllProcedure(connection);
            }

            finally
            {
                _uTaskCache.ClearStorage();
            }
            return result;
        }

        public TabTaskOut SetTaskItem(UserTaskDataModel newTaskItem)
        {
            return _journalOut.SetTaskItem(newTaskItem);
        }

        public UserTaskDataModel SetUpdateInProgress(IDbConnection connection, UserTaskDataModel taskItem)
        {
            return _uTaskCache.SetUpdateInProgress(connection, taskItem);
        }

        public void UnlockUpdateInProgress(IDbConnection connection, int taskId)
        {
            _uTaskCache.UnlockUpdateInProgress(connection, taskId);
        }

        #endregion

        private TResult _localAction<TResult>(IDbConnection connection, Func<UserTaskDataModel, bool> @where, Func<IEnumerable<UserTaskDataModel>, TResult> @select)
        {
            return _uTaskCache.LocalOperation(connection, col => @select(col.Where(@where)));
        }
    }
}