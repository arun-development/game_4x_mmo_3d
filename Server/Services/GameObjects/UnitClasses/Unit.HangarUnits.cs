using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Infrastructure.Unit;
using Server.Core.СompexPrimitive.Products;
using Server.Core.СompexPrimitive.Units;
using Server.DataLayer;
using Server.Services.GameObjects.BuildModel.CollectionBuild;

namespace Server.Services.GameObjects.UnitClasses
{
    public partial class Unit
    {
        public Dictionary<UnitType, HangarUnitsOut> GetherHangarUnits(IDbConnection connection, int userId, int panetId = 0)
        {
            var userPremium = _storeService.GetPremiumWorkModel(connection, userId);
            if (panetId == 0)
            {
                var mother = _mother.GetMother(connection, userId);
                return GetherHangarUnits(mother, userPremium, OwnType.Mother);
            }
            var planet = _planet.GetUserPlanet(connection, panetId, userId);
            return GetherHangarUnits(planet, userPremium, OwnType.Planet);
        }

        public Dictionary<UnitType, HangarUnitsOut> GetherHangarUnits(object own, UserPremiumWorkModel userPremium,
            OwnType ownType)
        {
            switch (ownType)
            {
                case OwnType.Mother:
                    return GetherMotherUnits((UserMothershipDataModel) own, userPremium);
                case OwnType.Planet:
                    return GetherPlanetUnits((GDetailPlanetDataModel) own, userPremium);
                default:
                    throw new ArgumentOutOfRangeException(nameof(ownType), ownType, null);
            }
        }


        private static Dictionary<UnitType, HangarUnitsOut> GetherMotherUnits(UserMothershipDataModel mother,
            UserPremiumWorkModel userPremium)
        {
            var outUnits = UnitList.ConvertToHangar(mother.Hangar);
            if (mother.UnitProgress == null || !mother.UnitProgress.Any()) return outUnits;
            SetUnitUpgradeInHangarUnit(userPremium, 1, ref outUnits, mother.UnitProgress);
            return outUnits;
        }

        private static Dictionary<UnitType, HangarUnitsOut> GetherPlanetUnits(GDetailPlanetDataModel planet,
            UserPremiumWorkModel userPremium)
        {
            var shipyardlevel = 1;
            var shipyard = planet.BuildSpaceShipyard;
            if (shipyard?.Level != null) shipyardlevel = (int) shipyard.Level;
            var outUnits = UnitList.ConvertToHangar(planet.Hangar);
            if (planet.UnitProgress == null || !planet.UnitProgress.Any()) return outUnits;
            SetUnitUpgradeInHangarUnit(userPremium, shipyardlevel, ref outUnits, planet.UnitProgress);
            return outUnits;
        }

        private static void SetUnitUpgradeInHangarUnit(UserPremiumWorkModel userPremium, int shipyardlevel,
            ref Dictionary<UnitType, HangarUnitsOut> outUnits, Dictionary<UnitType, TurnedUnit> unitsProgress)
        {
            foreach (var i in unitsProgress)
                outUnits[i.Key].Progress = CalculateUnitProgress(i.Value,
                    UnitHelper.GetBaseUnit(i.Key).BasePrice.TimeProduction, shipyardlevel, userPremium,
                    outUnits[i.Key].Count ?? 0);
        }
    }
}