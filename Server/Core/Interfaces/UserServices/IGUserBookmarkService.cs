using System.Collections.Generic;
using System.Data;
using Server.DataLayer;

namespace Server.Core.Interfaces.UserServices
{
    public interface IGUserBookmarkService<TPrimaryKeyType, TDataModel> : IBaseService<TPrimaryKeyType, TDataModel>
        where TPrimaryKeyType : struct where TDataModel : class
    {
 

        #region Sync
        IList<TDataModel> GetUserBookmarks(IDbConnection connection, int userId);
        TDataModel GetUserBookmark(IDbConnection connection, int userId, int typeId, int objectId);
        TDataModel GetUserBookmark(IDbConnection connection, int userId, string typeName, int objectId);
        TDataModel GetUserBookmarkById(IDbConnection connection, int userId, int bookmarkId);


        #endregion

        //void AddBookmark(TDataModel newBookmark);
        //void DeleteBookmark(TDataModel bookmark);

    }


    public interface IGUserBookmarkService : IGUserBookmarkService<int, UserBookmarkDataModel>
    {
 
    }
}
