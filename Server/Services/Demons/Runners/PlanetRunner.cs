using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Infrastructure;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Products;
using Server.Core.СompexPrimitive.Resources;
using Server.Core.СompexPrimitive.Units;
using Server.DataLayer;
using Server.Extensions;
using Server.Services.AdvancedService;
using Server.Services.GameObjects.BuildModel.BuildItem;
using Server.Services.GameObjects.UnitClasses;

namespace Server.Services.Demons.Runners
{
    public class PlanetRunner : IPlanetRunner
    {
        private static int LAST_DEMON_RUNTIME = 0;
        private const int MIN_DEMON_DELAY_SECOND = UnixTime.OneMinuteInSecond * 30;
        private const int MIN_DELAY_TO_UPDATE = MIN_DEMON_DELAY_SECOND * 2;
        public void PushDemon(IDbConnection connection, IGDetailPlanetService planetService, IStoreService storeService)
        {
  
            var curTime = UnixTime.UtcNow();
            if (curTime - LAST_DEMON_RUNTIME < MIN_DEMON_DELAY_SECOND)
            {
                return;
            }
            var unsortedPlanets = planetService.GetAllUsersPlanets(connection);
            if (!unsortedPlanets.Any())
            {
                return;
            }
            LAST_DEMON_RUNTIME = curTime;
            var minItemTime = curTime - MIN_DELAY_TO_UPDATE;
            var planets = unsortedPlanets.Where(i => i.LastUpgradeProductionTime < minItemTime).OrderBy(i => i.UserId);
            UserPremiumWorkModel userPremium = null;
            foreach (var planet in planets)
            {
                if (!_needUpdate(planet))
                {
                    continue;
                }
 
                if (userPremium == null) userPremium = storeService.GetPremiumWorkModel(connection, planet.UserId);
                if (userPremium.UserId != planet.UserId) userPremium = storeService.GetPremiumWorkModel(connection, planet.UserId);
                FixProgreses(planet, userPremium);
                planetService.AddOrUpdate(connection,planet);
            }
        }

        private static bool _needUpdate(GDetailPlanetDataModel planet)
        {
            if (!planet.Resources.AllFull())
            {
                return true;
            }
            if (planet.UnitProgress != null && planet.UnitProgress.Any())
            {
                return true;
            }
            if (planet.BuildSpaceShipyard.IsProgress != null && planet.BuildSpaceShipyard.IsProgress == true)
            {
                return true;
            }
            if (planet.BuildExtractionModule.IsProgress != null && planet.BuildExtractionModule.IsProgress == true)
            {
                return true;
            }
            if (planet.BuildEnergyConverter.IsProgress != null && planet.BuildEnergyConverter.IsProgress == true)
            {
                return true;
            }

            if (planet.BuildStorage.IsProgress != null && planet.BuildStorage.IsProgress == true)
            {
                return true;
            }
            if (planet.Turels.IsProgress != null && planet.Turels.IsProgress == true)
            {
                return true;
            }

            return false;
        }


        public GDetailPlanetDataModel RunSinglePlanet(IDbConnection connection, GDetailPlanetDataModel planet, UserPremiumWorkModel userPremium, IGDetailPlanetService planetService)
        {
            FixProgreses(planet, userPremium);
            return planetService.AddOrUpdate(connection,planet);
        }

        public IList<GDetailPlanetDataModel> RunPlanets(IDbConnection connection, IList<GDetailPlanetDataModel> planets, UserPremiumWorkModel userPremium, IGDetailPlanetService planetService)
        {
            var result = new List<GDetailPlanetDataModel>();
            foreach (var planet in planets)
            {
                var updatedPlanet = RunSinglePlanet(connection, planet, userPremium, planetService);
                result.Add(updatedPlanet);
            }
            return result;

        }


        private static void FixProgreses(GDetailPlanetDataModel planet, UserPremiumWorkModel userPremium)
        {
            #region  Calc BuildProgress

            var pt = userPremium.TimeLineStatus;

            if (planet.BuildEnergyConverter.CheckProgressIsDone())
                ItemProgress.ProgressUpdateComplite(planet.BuildEnergyConverter);
            if (planet.BuildExtractionModule.CheckProgressIsDone())
                ItemProgress.ProgressUpdateComplite(planet.BuildExtractionModule);
            if (planet.BuildSpaceShipyard.CheckProgressIsDone())
                ItemProgress.ProgressUpdateComplite(planet.BuildSpaceShipyard);
            if (planet.BuildStorage.CheckProgressIsDone()) ItemProgress.ProgressUpdateComplite(planet.BuildStorage);
            if (planet.Turels.CheckProgressIsDone()) ItemProgress.ProgressUpdateComplite(planet.Turels);

            var extractionLevel = 1;
            if (planet.BuildExtractionModule?.Level != null) extractionLevel = (int)planet.BuildExtractionModule.Level;

            #endregion

            #region CalcResource

            var lastUpgradeProductionTime = planet.LastUpgradeProductionTime;

            var beforeResource = planet.Resources.CloneDeep();

            var last = pt?.Status?.Last();
            var curPrem = (last != null && (bool)last);

            StorageResources.CalculateProductionResources(beforeResource,
                planet.ExtractionProportin, ref lastUpgradeProductionTime, extractionLevel,
                curPrem,
                ExtractionModule.BaseProportion.Ir,
                ExtractionModule.BaseProportion.Dm,
                ExtractionModule.GetPower, (res) => { StorageResourcesService.FixCurrentResources(res); });


            if (!planet.Resources.Equals(beforeResource)) planet.Resources = beforeResource;
            planet.LastUpgradeProductionTime = lastUpgradeProductionTime;

            #endregion

            if (planet.UnitProgress == null || !planet.UnitProgress.Any()) return;

            #region Calc UnitProgress

            var shipyardLevel = planet.BuildSpaceShipyard.Level ?? 1;
            var pureTurn = planet.UnitProgress;
            var hangarUnits = planet.Hangar;
            bool unitInProgress;


            TurnedUnit.CalculateUserUnits(pt, ref pureTurn, out unitInProgress, ref hangarUnits, shipyardLevel,
                Unit.CalculateTrickyUnitTimeProduction,
                (unitType) => UnitHelper.GetBaseUnit(unitType).BasePrice.TimeProduction, Unit.CalculateTimeProduction);


            planet.UnitProgress = unitInProgress ? pureTurn : new Dictionary<UnitType, TurnedUnit>();
            planet.Hangar = hangarUnits;

            #endregion
        }
    }
}