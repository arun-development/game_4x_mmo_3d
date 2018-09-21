using System;
using System.Collections.Generic;
using System.Data;
using Server.Core.Map;
using Server.Core.СompexPrimitive.Resources;
using Server.DataLayer;

namespace Server.Core.Interfaces.UserServices
{
    public interface IGDetailPlanetService<TPrimaryKeyType, TDataModel> : IBaseService<TPrimaryKeyType, TDataModel>
        where TPrimaryKeyType : struct where TDataModel : class
    {
        #region Sync

        TDataModel GetUserPlanet(IDbConnection connection, TPrimaryKeyType planetId, int userId, bool checkPlanet = true);

        TResult GetUserPlanet<TResult>(IDbConnection connection, TPrimaryKeyType planetId, int userId, Func<TDataModel, TResult> selector, bool checkPlanet = true);

        TResult GetByPlanetName<TResult>(IDbConnection connection, string planetName, Func<TDataModel, TResult> selector);
        IList<string> GetPlanetNames(IDbConnection connection, Func<TDataModel, bool> @where);

        TResult GetPlanet<TResult>(IDbConnection connection, TPrimaryKeyType planetId, Func<TDataModel, TResult> selector);
        TDataModel GetPlanet(IDbConnection connection, TPrimaryKeyType planetId, bool checkPlanet = true);
        TDataModel GetPlanet(IDbConnection connection, string planetName);

        TPrimaryKeyType GetPlanetId(IDbConnection connection, string planetName);


        IList<TDataModel> GetAllPlanet(IDbConnection connection);
        List<TPrimaryKeyType> GetAllUsersPlanetIds(IDbConnection connection);


        IList<TDataModel> GetAllUsersPlanets(IDbConnection connection);
        IList<TDataModel> GetUserPlanets(IDbConnection connection, int userId);
        IList<TPrimaryKeyType> GetUserPlanetIds(IDbConnection connection, int userId);

        IList<TDataModel> GetAlliancePlanets(IDbConnection connection, int allianceId);

        StorageResources GetResources(IDbConnection connection, TPrimaryKeyType planetId, int userId);
        bool UpdatePlanetName(IDbConnection connection, TPrimaryKeyType planetId, string newPlanetName);

        void UpdatePlanetOwner(IDbConnection connection, TPrimaryKeyType planetId, int newOwner, IAllianceService allianceService);
        void UpdatePlanetOwner(IDbConnection connection, GDetailPlanetDataModel planet, int newOwner, IAllianceService allianceService);
        void ResetAllPlanetsToNpc(IDbConnection connection, IAllianceService allianceService);
        bool PlanetsExist();

        IList<TDataModel> AddOrUpdateDetailPlanetList(IDbConnection connection, IList<TDataModel> dataModel);

        #region Advanced

        EstateItemOut SetPlanetEstateItem(IDbConnection connection, string planetName, GGeometryPlanetDataModel geometry);
        IList<EstateItemOut> GetUserEstates(IDbConnection connection, int userId);
        IList<EstateItemOut> GetUserEstates(IDbConnection connection, IList<GDetailPlanetDataModel> planets);
        EstateItemOut GetUserEstate(IDbConnection connection, TPrimaryKeyType planetId, int userId);
        short GetPlanetCountInSystem(IDbConnection connection, int systemId);

        TDataModel SetNewResources(IDbConnection connection, TPrimaryKeyType planetId, int userId, StorageResources newResources);

        GDetailPlanetDataModel UpdateUserPlanet(IDbConnection connection, int planetId, int userId, Func<GDetailPlanetDataModel, GDetailPlanetDataModel> updateVals);

        GDetailPlanetDataModel SetNewResources(IDbConnection connection, int planetId, int userId, StorageResources newResources);

        #endregion

        #endregion



    }

    public interface IGDetailPlanetService : IGDetailPlanetService<int, GDetailPlanetDataModel>, IMapAdress
    {
        GDetailPlanetDataModel ResetProgress(ref GDetailPlanetDataModel planet);
    }

 
}