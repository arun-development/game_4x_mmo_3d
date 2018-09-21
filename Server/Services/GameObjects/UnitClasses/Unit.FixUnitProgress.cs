using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Products;
using Server.Core.СompexPrimitive.Units;
using Server.DataLayer;
using Server.Services.GameObjects.BuildModel.CollectionBuild;

namespace Server.Services.GameObjects.UnitClasses
{
    public partial class Unit
    {
        public ItemProgress FixItemProgress(IDbConnection connection, UnitType unitType, int userId, int planetId = 0)
        {
            var premium = _storeService.GetPremiumWorkModel(connection, userId);
            if (planetId == 0)
            {
                var mother = _mother.GetMother(connection, userId);
                return FixItemProgress(unitType, mother, OwnType.Mother, premium);
            }
            var planet = _planet.GetUserPlanet(connection, planetId, userId);
            return FixItemProgress(unitType, planet, OwnType.Planet, premium);
        }

        public ItemProgress FixItemProgress(UnitType unitType, object modelData, OwnType ownType, UserPremiumWorkModel userPremium)
        {
            switch (ownType)
            {
                case OwnType.Mother:
                    return FixMotherItemProgress(unitType, (UserMothershipDataModel) modelData, userPremium);
                case OwnType.Planet:
                    return FixPlanetItemProgress(unitType, (GDetailPlanetDataModel) modelData, userPremium);
                default:
                    throw new ArgumentOutOfRangeException(nameof(ownType), ownType, null);
            }
        }


        public ItemProgress FixPlanetItemProgress(UnitType unitType, GDetailPlanetDataModel planet,
            UserPremiumWorkModel userPremium)
        {
            return FixItemProgress(unitType, planet.Hangar, planet.UnitProgress, userPremium,
                planet.BuildSpaceShipyard);
        }

        public ItemProgress FixMotherItemProgress(UnitType unitType, UserMothershipDataModel mother,
            UserPremiumWorkModel userPremium)
        {
            return FixItemProgress(unitType, mother.Hangar, mother.UnitProgress, userPremium);
        }

        private static ItemProgress FixItemProgress(UnitType unitType, Dictionary<UnitType, int> hangarUnits,
            Dictionary<UnitType, TurnedUnit> progessUnits, UserPremiumWorkModel userPremium,
            ItemProgress buildSpaceShipyard = null)
        {
            if (!hangarUnits.ContainsKey(unitType)) throw new Exception(Error.UnitNameNotExist);

            var unitCount = hangarUnits[unitType];

            var hasProgress = progessUnits.Any();
            var unitExist = (hasProgress && progessUnits.ContainsKey(unitType));
            var unitInTurn = (unitExist && (progessUnits[unitType].TotalCount - progessUnits[unitType].ReadyUnits) > 0);
            var unitInProgress = (hasProgress && unitExist && unitInTurn);

            if (!unitInProgress)
                return new ItemProgress
                {
                    Level = unitCount,
                    IsProgress = false
                };

            var shipyardLevel = 1;
            if (buildSpaceShipyard != null && buildSpaceShipyard.Level != null && buildSpaceShipyard.Level != 0)
                shipyardLevel = (int) buildSpaceShipyard.Level;
            var timeProduction = UnitHelper.GetBaseUnit(unitType).BasePrice.TimeProduction;
            return CalculateUnitProgress(progessUnits[unitType], timeProduction, shipyardLevel, userPremium, unitCount);
        }
    }
}