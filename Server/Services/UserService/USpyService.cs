using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Interfaces.UserServices;
using Server.Core.Pager;
using Server.Core.StaticData;
using Server.DataLayer;
using Server.DataLayer.LocalStorageCaches;
using Server.DataLayer.Repositories;

namespace Server.Services.UserService
{
    public class USpyService : IUSpyService
    {
        #region Declare

        private readonly IUserSpyRepository _userSpyRepo;

        private readonly IUSpyLocalStorageCache _uSpyCache;

        public USpyService(IUserSpyRepository userSpyRepo, IUSpyLocalStorageCache uSpyCache)
        {
            _userSpyRepo = userSpyRepo;
            _uSpyCache = uSpyCache;
        }

        #endregion

        #region Sync

        public List<TResult> GetSpyReports<TResult>(IDbConnection connection, int userId,
            Func<UserSpyDataModel, TResult> selector, int lastId = 0)
        {

            Func<UserSpyDataModel, bool> filter;
            if (lastId == 0)
            {
                filter = i => i.SourceUserId == userId;
              
               
            }
            else
            {
                filter = i => i.Id < lastId && i.SourceUserId == userId;
            }
            
            var reports = _localAction(connection, filter, col =>
            {

                var data = col
                    .OrderByDescending(i => i.Id)
                    .Take(PagerDefaults.MaxItemInStack)
                    .Select(selector);


                return data.ToList();
            });

            return reports;


        }

        public UserSpyDataModel GetUserSpyItem(IDbConnection connection, int sourceUserId, int spyId)
        {
            var spyItem = _uSpyCache.GetById(connection, spyId, true);
            if (spyItem.SourceUserId != sourceUserId)
            {
                throw new NotImplementedException();
            }
            return spyItem;
        }

        public int GetTotalUserSpyReports(IDbConnection connection, int userId)
        {
            return _localAction(connection, i => i.SourceUserId == userId, col => col.Count());
        }

        public int GetSpyId(IDbConnection connection, int sourceUserId, int dataActivate)
        {
            return _localAction(connection, i => i.SourceUserId == sourceUserId && i.DateActivate == dataActivate,
                col => col.Select(i => i.Id).FirstOrDefault());
        }


        public string Test(string message = "Ok") => message;

        private TResult _localAction<TResult>(IDbConnection connection, Func<UserSpyDataModel, bool> where,Func<IEnumerable<UserSpyDataModel>, TResult> select)
        {
            return _uSpyCache.LocalOperation(connection, col => select(col.Where(where)));
        }

        #region Core IBaseService

        public UserSpyDataModel AddOrUpdate(IDbConnection connection, UserSpyDataModel dataModel)
        {
            var db = _userSpyRepo.AddOrUpdateeModel(connection, dataModel);
            return _uSpyCache.UpdateLocalItem(connection, db);
        }

        public bool Delete(IDbConnection connection, int spyId)
        {
            var old = _uSpyCache.GetById(connection, spyId, true);
            if (old == null)
            {
                return true;
            }
            var sucsess = _userSpyRepo.Delete(connection, spyId);
            //_provider.Commit();
            if (sucsess)
            {
                _uSpyCache.DeleteItem(spyId);
            }
            else
            {
                throw new NotImplementedException(Error.ErrorInUpdateDb);
            }
            return sucsess;
        }


        public bool DeleteAll(IDbConnection c)
        {
            var result = false;
            try
            {
                result = _userSpyRepo.DeleteAllProcedure(c);
            }
            finally
            {
                _uSpyCache.ClearStorage();
            }
            return result;
        }

        #endregion

        #endregion
    }
}