using System;
using System.Collections.Generic;
using System.Linq;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Products;
using Server.Core.СompexPrimitive.Resources;
using Server.Core.СompexPrimitive.Units;
using Server.Services.GameObjects.BuildModel.BuildItem;

namespace Server.Services.GameObjects.UnitClasses
{
    public partial class Unit
    {
        public static double CalculateTimeProduction(int baseTimeProduction, bool premium, int buildLevel)
        {
            return baseTimeProduction / SpaceShipyard.UnitProductionResultMod(buildLevel, premium);
        }

        public static TurnedUnit CalculateTrickyUnitTimeProduction(TimeLineStatus premiumTimeLine,
            TurnedUnit turnedUnit,
            int currTime, int shipyardLevel)
        {
            var lastUpgrade = turnedUnit.DateLastUpgrade;

            var index = premiumTimeLine.Points.FindLastIndex(j => j <= lastUpgrade);
            var baseUnitProductionTime = UnitHelper.GetBaseUnit(turnedUnit.UnitType).BasePrice.TimeProduction;

            // 0-1 true
            // 1-2 false
            // 2-3 true


            for (var i = index; i < premiumTimeLine.Points.Count(); i++)
            {
                var statusPremiumIsActive = false;
                if (i != -1) statusPremiumIsActive = premiumTimeLine.Status[i];


                var oneUnitProductionSpeedPerSecond = CalculateTimeProduction(baseUnitProductionTime,
                    statusPremiumIsActive, shipyardLevel);
                int duration;

                var hasNextPoint = (premiumTimeLine.Points.Count() - 1 > i);

                if (hasNextPoint)
                {
                    var nextPoint = premiumTimeLine.Points[i + 1];

                    duration = nextPoint - lastUpgrade;
                    lastUpgrade = nextPoint;
                }
                else
                {
                    duration = currTime - lastUpgrade;
                    lastUpgrade = currTime;
                }

                if (duration > (turnedUnit.TotalCount - turnedUnit.ReadyUnits) * oneUnitProductionSpeedPerSecond)
                {
                    turnedUnit.ReadyUnits += (currTime - turnedUnit.DateLastUpgrade) / oneUnitProductionSpeedPerSecond;
                    if (turnedUnit.ReadyUnits >= turnedUnit.TotalCount) turnedUnit.ReadyUnits = turnedUnit.TotalCount;
                    lastUpgrade = currTime;
                    break;
                }
                turnedUnit.ReadyUnits += duration / oneUnitProductionSpeedPerSecond;
            }

            turnedUnit.DateLastUpgrade = lastUpgrade;

            return turnedUnit;
        }

        private static int CalculateMaxCount(MaterialResource bp, MaterialResource res)
        {
            var counts = new List<double>
            {
                res.E / ((bp.E == 0) ? 1 : bp.E),
                res.Ir / ((bp.Ir == 0) ? 1 : bp.Ir),
                res.Dm / ((bp.Dm == 0) ? 1 : bp.Dm)
            };
            return (int) Math.Floor(counts.Min());
        }

        private static int CalcUnitDurationRemainTime(TurnedUnit tu, int baseTimeProduction, int buildLevel,
            UserPremiumWorkModel userPremium, double? remainToComplete = null)
        {
            double rem;

            var modifedTime = CalculateTimeProduction(baseTimeProduction, userPremium.IsActive, buildLevel);


            if (remainToComplete == null) rem = tu.TotalCount - tu.ReadyUnits;
            else rem = (double) remainToComplete;


            if (!userPremium.IsActive)
            {
                if (buildLevel == 1) return (int) Math.Ceiling(baseTimeProduction * rem);

                return (int) Math.Ceiling(modifedTime * rem);
            }

            var premiumRemainDuration = userPremium.EndTime - tu.DateLastUpgrade;
            var premiumUnitCount = premiumRemainDuration / modifedTime;
            if (premiumUnitCount >= rem) return (int) Math.Ceiling(modifedTime * rem);
            var deltaUnit = rem - premiumUnitCount;
            return (int) Math.Ceiling((modifedTime * premiumUnitCount) + (deltaUnit * baseTimeProduction));
        }

        private static ItemProgress CalculateUnitProgress(TurnedUnit turnedUnit, int baseTimeProduction, int builLevel,
            UserPremiumWorkModel userPremium, int hangarCount)
        {
            var remainToComplete = turnedUnit.TotalCount - turnedUnit.ReadyUnits;

            int? duration = null;
            if (remainToComplete > 0)
                duration = CalcUnitDurationRemainTime(turnedUnit, baseTimeProduction, builLevel, userPremium,
                    remainToComplete);

            return new ItemProgress
            {
                Advanced = turnedUnit,
                StartTime = UnixTime.UtcNow(),
                Duration = duration,
                IsProgress = (duration != null),
                Level = hangarCount,
                RemainToComplete = remainToComplete
            };
        }
    }
}