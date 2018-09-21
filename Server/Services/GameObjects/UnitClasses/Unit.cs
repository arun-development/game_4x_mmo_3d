using System.Collections.Generic;
using System.Data;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Products;
using Server.Core.СompexPrimitive.Units;
using Server.DataLayer;
using Server.Services.AdvancedService;
using Server.Services.GameObjects.BuildModel.CollectionBuild;

namespace Server.Services.GameObjects.UnitClasses
{
    public interface IUnit
    {
        int CcUpgraded(IDbConnection connection, int userId, UnitType unitType, int count, object ownData);

        #region SetUnitTurn

        ItemProgress SetUnitTurn(IDbConnection connection, UnitType unitType, int count, int userId, int ownId);

        ItemProgress SetUnitTurn(IDbConnection connection, UnitType unitType, int count, object dataModel, OwnType ownType, UserPremiumWorkModel userPremium);

        ItemProgress SetMotherUnitTurn(IDbConnection connection, UnitType unitType, int count, UserMothershipDataModel mother, UserPremiumWorkModel userPremium);

        ItemProgress SetPlanetUnitTurn(IDbConnection connection, UnitType unitType, int count, GDetailPlanetDataModel planet, UserPremiumWorkModel userPremium);

        #endregion

        #region FixItemProgress

        ItemProgress FixItemProgress(IDbConnection connection, UnitType unitType, int userId, int planetId = 0);

        ItemProgress FixItemProgress(UnitType unitType, object modelData, OwnType ownType, UserPremiumWorkModel userPremium);

        ItemProgress FixPlanetItemProgress(UnitType unitType, GDetailPlanetDataModel planet,
            UserPremiumWorkModel userPremium);

        ItemProgress FixMotherItemProgress(UnitType unitType, UserMothershipDataModel mother,
            UserPremiumWorkModel userPremium);

        #endregion

        #region GetherHangarUnits

        Dictionary<UnitType, HangarUnitsOut> GetherHangarUnits(IDbConnection connection, int userId, int panetId = 0);

        Dictionary<UnitType, HangarUnitsOut> GetherHangarUnits(object own, UserPremiumWorkModel userPremium,
            OwnType ownType);

        #endregion
    }

    public partial class Unit : IUnit
    {
        private readonly IMothershipService _mother;
        private readonly IGDetailPlanetService _planet;
        private readonly IStorageResourcesService _storageResourcesService;
        private readonly IStoreService _storeService;
        //private readonly IUMotherJumpService _motherJumpService;


        public Unit(IMothershipService mother,
            IGDetailPlanetService planet,
            IStorageResourcesService storageResourcesService, IStoreService storeService)
        {
            
            _mother = mother;
            _planet = planet;
            _storageResourcesService = storageResourcesService;
            _storeService = storeService;
        }
    }
}