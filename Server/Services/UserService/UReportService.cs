using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Interfaces.UserServices;
using Server.Core.StaticData;
using Server.DataLayer;
using Server.DataLayer.LocalStorageCaches;
using Server.DataLayer.Repositories;

namespace Server.Services.UserService
{
    public class UReportService : IUReportService
    {
        #region Declare

        private readonly IUReportLocalStorageCache _uReportCache;
        private readonly IUserReportRepository _userReportRepo;

        public UReportService(IUserReportRepository userReportRepo,
            IUReportLocalStorageCache uReportCache)
        {
            _userReportRepo = userReportRepo;
            _uReportCache = uReportCache;
        }

        #endregion


        #region Sync

        public UserReportDataModel GetReportById(IDbConnection connection, int reportId)
        {
            return _uReportCache.GetById(connection,reportId, true);
        }

        public List<TResult> GetUserReports<TResult>(IDbConnection connection, int userId, Func<UserReportDataModel, TResult> selector, int lastReportId = 0)
        {

            bool  UserFilter(UserReportDataModel item)
            {
                var isUserItem = (!item.AtackerDeleteReport && item.AtackerUserId == userId) || (!item.DefenderDeleteReport && item.DefenderUserId == userId);
                return isUserItem;
            }

            bool IdFilter(UserReportDataModel item)
            {
                return item.Id < lastReportId && UserFilter(item);
            }

            Func<UserReportDataModel, bool> filter;
            if (lastReportId == 0)
            {
                filter = UserFilter;
            }
            else
            {
                filter = IdFilter;
            }

 



            var resultCollection = _localAction(connection, i => filter(i), col =>
            {
                return col.OrderByDescending(i => i.Id)
                    //.Take(AjaxPager.MaxItemInStack)
                    .Take(2)
                    .Select(selector)
                    .ToList();
            });


            return resultCollection;
        }

        public TResult GetUserReportByTaskId<TResult>(IDbConnection connection, int userId, int taskId, Func<UserReportDataModel, TResult> selector)
        {
            return _localAction(connection, i => i.TaskId == taskId, col => col.Select(selector).FirstOrDefault());
        }


        public void SetLoseAndWin(IDbConnection connection, int userId, Action<int> setWins, Action<int> setloses)
        {
            var statuses = _localAction(connection, i => i.AtackerUserId == userId || i.DefenderUserId == userId,
                col =>
                {
                    return col.Select(r => new
                    {
                        r.AtackerWin,
                        r.AtackerUserId,
                        r.DefenderUserId
                    }).ToList();
                });
            int wins;
            int loses;
            //_uReportRepo.RWhere(i => i.atackerUserId == userId || i.defenderUserId == userId).Select(i => new
            //{
            //    i.atackerWin,
            //    i.atackerUserId,
            //    i.defenderUserId
            //}).ToList();
            if (statuses.Any())
            {
                var total = statuses.Count();
                wins =
                    statuses.Count(
                        i => i.AtackerWin && i.AtackerUserId == userId || i.DefenderUserId == userId && !i.AtackerWin);
                loses = total - wins;
            }
            else
            {
                wins = 0;
                loses = 0;
            }
            setWins(wins);
            setloses(loses);
        }

        public int GetTotalUserReports(IDbConnection connection, int userId)
        {
            return _localAction(connection, i =>
                (!i.AtackerDeleteReport && i.AtackerUserId == userId) ||
                (!i.DefenderDeleteReport && i.DefenderUserId == userId), col => col.Count());
        }

        #region Core  IBaseService

        public UserReportDataModel AddOrUpdate(IDbConnection connection, UserReportDataModel dataModel)
        {
            var db = _userReportRepo.AddOrUpdateeModel(connection,dataModel);
            return _uReportCache.UpdateLocalItem(connection,db);
        }

        public bool Delete(IDbConnection connection, int reportId)
        {
            var old = _uReportCache.GetById(connection,reportId, true);
            if (old == null) return true;
            var sucsess = _userReportRepo.Delete(connection,reportId);
            //_provider.Commit();
            if (sucsess) _uReportCache.DeleteItem(reportId);
            else throw new NotImplementedException(Error.ErrorInUpdateDb);
            return sucsess;
        }


  
        public bool DeleteAll(IDbConnection connection)
        {
            var suc = _userReportRepo.DeleteAllProcedure(connection);
            if (!suc) throw new NotImplementedException(Error.DbError);
            _uReportCache.ClearStorage();
            return suc;
        }

        #endregion

        #endregion


        #region Helpers

        private TResult _localAction<TResult>(IDbConnection connection, Func<UserReportDataModel, bool> @where, Func<IEnumerable<UserReportDataModel>, TResult> @select)
        {
            return _uReportCache.LocalOperation(connection,col => @select(col.Where(@where)));
        }


        public string Test(string message = "Ok")
        {
            return message;
        }

        #endregion
    }
}