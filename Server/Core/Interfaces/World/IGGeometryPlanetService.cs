using System;
using System.Collections.Generic;
using System.Data;
using Server.DataLayer;

namespace Server.Core.Interfaces.World
{
    public interface IGGeometryPlanetService<TPrimaryKeyType, TDataModel> : IBaseService<TPrimaryKeyType, TDataModel>
        where TPrimaryKeyType : struct where TDataModel : class
    {
        #region Sync

        TDataModel GetUserPlanet(IDbConnection connection, int planetId, int userId);
        TDataModel GetGeometryPlanetById(IDbConnection connection, int planetId);
        string GetPlanetSystemName(IDbConnection connection, int planetId);
        byte GetPlanetType(IDbConnection connection, int planetId);

        TResult GetUserPlanet<TResult>(IDbConnection connection, int planetId, int userId, Func<TDataModel, TResult> selector);
        IList<TResult> GetAll<TResult>(IDbConnection connection, Func<TDataModel, TResult> selector);
        IList<TResult> GetByStarId<TResult>(IDbConnection connection, int starId, Func<TDataModel, TResult> selector);

        IList<TDataModel> AddOrUpdateGeometryPlanets(IList<TDataModel> dataModel, IDbConnection connection);

        #endregion
    }


    public interface IGGeometryPlanetService : IGGeometryPlanetService<int, GGeometryPlanetDataModel>
    {
 
    }
}