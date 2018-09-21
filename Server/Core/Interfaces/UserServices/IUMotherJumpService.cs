using System;
using System.Data;
using Server.Core.Interfaces.ForModel;
using Server.DataLayer;

namespace Server.Core.Interfaces.UserServices
{
    public interface IUMotherJumpService<TPrimaryKeyType, TDataModel> : IBaseService<TPrimaryKeyType, TDataModel>where TPrimaryKeyType : struct where TDataModel : class
    {


        #region Get

        TResult GetActive<TResult>(IDbConnection connection, int motherId, Func<TDataModel, TResult> selector);
        TResult GetById<TResult>(IDbConnection connection, TPrimaryKeyType jumpId, int motherId, Func<TDataModel, TResult> selector);
        TResult GetById<TResult>(IDbConnection connection, TPrimaryKeyType jumpId, Func<TDataModel, TResult> selector);
        IMotherJumpOut GetJumpTaskModel(IDbConnection connection, int motherId);
        IMotherJumpOut GetJumpTaskModel(IDbConnection connection, UserMotherJumpDataModel task);

        #endregion

        #region Actions

        int SetCompleteJumpAndGetTimeToEnd(IDbConnection connection, int motherId);
        int MotherJumpTimeDone(IDbConnection connection, int motherId, Action<int> targetSysten);


        int InstMotherJump(IDbConnection connection, TPrimaryKeyType jumpId, int motherId);
        void CancelByMotherId(IDbConnection connection, int motherId);
        void Cancel(IDbConnection connection, int jumpId, int motherId);
        //void Add(T jumpItem);
        //void Delete(T jumpItem);
        //void Delete(int motherId);
        void SinchronizeAll(IDbConnection connection);
        void SinchronizeByMotherId(IDbConnection connection, int motherId);

        #endregion
    }

    public interface IUMotherJumpService : IUMotherJumpService<int, UserMotherJumpDataModel>
    {
    
    }
}