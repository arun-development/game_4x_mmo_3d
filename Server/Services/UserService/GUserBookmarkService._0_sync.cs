using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Interfaces.UserServices;
using Server.Core.Interfaces.World;
using Server.Core.StaticData;
using Server.DataLayer;
using Server.DataLayer.LocalStorageCaches;
using Server.DataLayer.Repositories;

namespace Server.Services.UserService
{
    public partial class GUserBookmarkService : IGUserBookmarkService
    {
        private readonly IGameTypeService _gameTypeService;
        private readonly IUserBookmarkLocalStorageCache _userBookmarkCache;
        private readonly IUserBookmarkRepository _userBookmarkRepo;

        public GUserBookmarkService(IUserBookmarkRepository userBookmarkRepo,
            IUserBookmarkLocalStorageCache userBookmarkCache, IGameTypeService gameTypeService)
        {
            _userBookmarkRepo = userBookmarkRepo;
            _userBookmarkCache = userBookmarkCache;
            _gameTypeService = gameTypeService;
        }

        public IList<UserBookmarkDataModel> GetUserBookmarks(IDbConnection connection, int userId)
        {
            return _localAction(connection, userId, col => col.ToList());
        }

        public UserBookmarkDataModel GetUserBookmark(IDbConnection connection, int userId, int typeId, int objectId)
        {
            return _localAction(connection, userId,
                col => { return col.FirstOrDefault(i => i.ObjectId == objectId && i.TypeId == typeId); });
        }

        public UserBookmarkDataModel GetUserBookmark(IDbConnection connection, int userId, string typeName, int objectId)
        {
            var types = _gameTypeService.GetGGameTypes(connection, typeName);
            var items = GetUserBookmarks(connection, userId);
            var result =
                (from item in items
                    let type = types.First(i => i.Id == item.Id)
                    where typeName == type.Type
                    select item)
                .FirstOrDefault();
            if (result == null) throw new NotImplementedException();
            return result;
        }

        public UserBookmarkDataModel GetUserBookmarkById(IDbConnection connection, int userId, int bookmarkId)
        {
            var item = _userBookmarkCache.GetById(connection,bookmarkId, true);
            if (item == null || item.UserId != userId) throw new NotImplementedException();
            return item;
        }

        public string Test(string message = "Ok")
        {
            return message;
        }

        public UserBookmarkDataModel AddOrUpdate(IDbConnection connection, UserBookmarkDataModel dataModel)
        {
            var db = _userBookmarkRepo.AddOrUpdateeModel(connection,dataModel);
            return _userBookmarkCache.UpdateLocalItem(connection,db);
        }

        public bool Delete(IDbConnection connection, int bookmarkId)
        {
            var old = _userBookmarkCache.GetById(connection,bookmarkId, true);
            if (old == null) return true;
            var sucsess = _userBookmarkRepo.Delete(connection,bookmarkId);
            // _provider.Commit();
            if (sucsess) _userBookmarkCache.DeleteItem(bookmarkId);
            else throw new NotImplementedException(Error.ErrorInUpdateDb);
            return sucsess;
        }

        public bool DeleteAll(IDbConnection connection)
        {
 
            if (_userBookmarkRepo.HasItems(connection))
            {
                var suc = _userBookmarkRepo.DeleteAllProcedure(connection);
                if (!suc) throw new NotImplementedException(Error.DbError);
            }

            _userBookmarkCache.ClearStorage();
            return true;
        }


        private TResult _localAction<TResult>(IDbConnection connection, int userId, Func<IEnumerable<UserBookmarkDataModel>, TResult> operation)
        {
            return operation(_userBookmarkCache.LocalWhere(connection,i => i.UserId == userId));
        }
    }
}