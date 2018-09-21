using System;
using System.Collections.Generic;
using System.Data;
using Server.Core.СompexPrimitive.Resources;
using Server.DataLayer;

namespace Server.Core.Interfaces.UserServices
{
    public interface IMothershipService<TPrimaryKeyType, TDataModel> : IBaseService<TPrimaryKeyType, TDataModel>
        where TPrimaryKeyType : struct where TDataModel : class
    {

        #region Sync
        IList<TDataModel> AddOrUpdate(IDbConnection connection, IList<TDataModel> dataModel);
        TDataModel Update(IDbConnection connection, TDataModel updatedData);
        TDataModel GetMother(IDbConnection connection, TPrimaryKeyType userId, bool checkData = true);
        TResult GetMother<TResult>(IDbConnection connection, TPrimaryKeyType userId, Func<TDataModel, TResult> selector);
        IList<TDataModel> GetAllMothers(IDbConnection connection);
        StorageResources GetMotherResources(IDbConnection connection, TPrimaryKeyType userId);
        TDataModel CreateMother(IDbConnection connection, TPrimaryKeyType userId, int startSystem = 1);

        bool MothersDataExist();
        int GetCurrentSystemId(IDbConnection connection, TPrimaryKeyType userId);
        TDataModel SetNewResources(IDbConnection connection, TPrimaryKeyType userId, StorageResources newResources);
        #endregion

        #region Npc
        void DeleteNpcMothers(IDbConnection connection);

        #endregion
    }


    public interface IMothershipService : IMothershipService<int, UserMothershipDataModel>
    {
 
    }
}