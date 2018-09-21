using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Infrastructure;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.Core.Tech;
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
    public class MotherRunner : IMotherRunner
    {
        private static int LAST_DEMON_RUNTIME = 0;
        private const int MIN_DEMON_DELAY_SECOND = UnixTime.OneMinuteInSecond * 30;
        private const int MIN_DELAY_TO_UPDATE = MIN_DEMON_DELAY_SECOND*2;
        public void PushDemon(IDbConnection connection, IMothershipService motherService, IUMotherJumpService motherJumpService, IStoreService storeService)
        {
            var curTime = UnixTime.UtcNow();
            if (curTime - LAST_DEMON_RUNTIME < MIN_DEMON_DELAY_SECOND)
            {
                return;
            }
   
            var minItemTime = curTime - MIN_DELAY_TO_UPDATE;
            LAST_DEMON_RUNTIME = curTime;
            var motherIds = motherService.GetAllMothers(connection).Where(i => i.Id > 1000 && i.LastUpgradeProductionTime< minItemTime).Select(i => i.Id).ToList();
            if (!motherIds.Any())
            {
                return;
            }
            foreach (var motherId in motherIds)
            {
         
                var mother = motherService.GetMother(connection, motherId);
                if (_needUpdate(mother)) {
                    var prem = storeService.GetPremiumWorkModel(connection, motherId);
                    RunUser(connection, mother, prem, motherService, motherJumpService);
                }
               
            }

            //Console.WriteLine("_mothershipService.SaveMother");
        }

        private static bool _needUpdate(UserMothershipDataModel mother)
        {
            if (!mother.Resources.AllFull())
            {
                return true;
            }
            if (mother.UnitProgress != null && mother.UnitProgress.Any())
            {
                return true;
            }
            if (mother.LaboratoryProgress.IsProgress != null && mother.LaboratoryProgress.IsProgress == true)
            {
                return true;
            }
            return mother.TechProgress.Any(techProgress => techProgress.Value.IsProgress == true);
        }



        public UserMothershipDataModel RunUser(IDbConnection connection, UserMothershipDataModel mother, UserPremiumWorkModel userPremium, IMothershipService motherService, IUMotherJumpService motherJump)
        {
            if (mother == null)
            {
                return null;
            }
            motherJump.SinchronizeByMotherId(connection, mother.Id);
            FixProgreses(mother, userPremium);
            return motherService.Update(connection, mother);
        }


        private static void FixProgreses(UserMothershipDataModel mother, UserPremiumWorkModel userPremium)
        {
            #region Premium

            var pt = userPremium.TimeLineStatus;

            #endregion

            #region CalcResource

            var lastUpgradeProductionTime = mother.LastUpgradeProductionTime;

            var beforeResource = mother.Resources.CloneDeep();

            var last = pt?.Status?.Last();
            var curPrem = (last != null && (bool)last);

          //  var motherExtatracionLevel = 1;
            var motherExtatracionLevel = 22;

            StorageResources.CalculateProductionResources(beforeResource,
                mother.ExtractionProportin, ref lastUpgradeProductionTime, motherExtatracionLevel,
                curPrem,
                ExtractionModule.BaseProportion.Ir,
                ExtractionModule.BaseProportion.Dm,
                ExtractionModule.GetPower,
                (res) => { StorageResourcesService.FixCurrentResources(res); }
            );

            if (!mother.Resources.Equals(beforeResource))
            {
                mother.Resources = beforeResource;
            }

            #region Laboratory

            if (mother.TechProgress.Select(i => i.Value).ToList().Any(i => i.IsProgress == true))
            {
                var techService = new BattleTeches(mother.TechProgress);
                if (techService.CalculateTechProgreses(techService.GetTeches(false), userPremium))
                {
                    mother.TechProgress = techService.ConvertToDbTeches();
                }
            }

            #endregion

            mother.LastUpgradeProductionTime = lastUpgradeProductionTime;

            #endregion


            if (mother.UnitProgress == null || !mother.UnitProgress.Any())
            {
                if (mother.UnitProgress == null) {
                    mother.UnitProgress = new Dictionary<UnitType, TurnedUnit>();
                }
                return;
            }

            #region Calc UnitProgress

            const int shipyardLevel = 1;
            var pureTurn = mother.UnitProgress;
            var hangarUnits = mother.Hangar;
            bool unitInProgress;


            TurnedUnit.CalculateUserUnits(pt, ref pureTurn, out unitInProgress, ref hangarUnits, shipyardLevel,
                Unit.CalculateTrickyUnitTimeProduction,
                (unitType) => UnitHelper.GetBaseUnit(unitType).BasePrice.TimeProduction, Unit.CalculateTimeProduction);


            mother.UnitProgress = unitInProgress ? pureTurn : new Dictionary<UnitType, TurnedUnit>();
            mother.Hangar = hangarUnits;

            #endregion
        }
    }
}