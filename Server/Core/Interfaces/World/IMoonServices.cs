using System;
using System.Collections.Generic;
using System.Data;
using Server.DataLayer;

namespace Server.Core.Interfaces.World
{
    public interface IGDetailMoonService<TPrimaryKeyType, TDataModel> where TPrimaryKeyType : struct
        where TDataModel : class
    {
        #region Sync

        TDataModel GetDetailMoon(IDbConnection connection, TPrimaryKeyType moonId);
        IList<TDataModel> GetAllDetailMoons(IDbConnection connection);
        TResult GetDetailMoon<TResult>(IDbConnection connection, TPrimaryKeyType moonId, Func<TDataModel, TResult> selector);

        TDataModel AddOrUpdateDetailMoon(IDbConnection connection, GDetailMoonDataModel detailMoon);

        IList<TDataModel> AddOrUpdateDetailMoonList(IDbConnection connection, IEnumerable<GDetailMoonDataModel> detailMoons);

        #endregion
    }

    public interface IGGeometryMoonService<TPrimaryKeyType, TDataModel> where TPrimaryKeyType : struct
        where TDataModel : class
    {
        #region Sync

        TDataModel GetGeometryMoon(IDbConnection connection, TPrimaryKeyType moonId);
        TResult GetGeometryMoon<TResult>(IDbConnection connection, TPrimaryKeyType moonId, Func<TDataModel, TResult> selector);
        IList<TDataModel> GetGeometryMoons(IDbConnection connection);

        IList<TResult> GetGeometryMoonByStarId<TResult>(IDbConnection connection, TPrimaryKeyType starId, Func<TDataModel, TResult> selector);

        TDataModel AddOrUpdateGeometryMoon(IDbConnection connection, TDataModel geometryMoon);

        IList<TDataModel> AddOrUpdateGeometryMoonList(IDbConnection connection, IList<TDataModel> geometryMoons);

        #endregion
    }

    public interface IMoonService : IGDetailMoonService<int, GDetailMoonDataModel>,
        IGGeometryMoonService<int, GGeometryMoonDataModel>, ITest
    {
    }
}