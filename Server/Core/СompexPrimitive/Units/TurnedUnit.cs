using System;
using System.Collections.Generic;
using System.Linq;
using Server.Core.СompexPrimitive.Products;

namespace Server.Core.СompexPrimitive.Units
{
    public class TurnedUnit
    {
        public UnitType UnitType;
        public int TotalCount;
        public double ReadyUnits;
        public int UnitToSave;
        public int DateCreate;
        public int DateLastUpgrade;


        public static bool CheckUnitIsDone(Dictionary<UnitType, TurnedUnit> units)
        {
            return (units.Count <= 0) || units.All(i => i.Value.TotalCount <= (int)Math.Floor(i.Value.ReadyUnits));
        }



        /// <summary>
        /// 
        /// </summary>
        /// <param name="premiumTimeline"></param>
        /// <param name="startUnitTurn"></param>
        /// <param name="upgradeInProgress"></param>
        /// <param name="dbHangarUnits"></param>
        /// <param name="shipyardLevel"></param>
        /// <param name="calculateTrickyTurnUnit">Unit.CalculateTrickyUnitTimeProduction(premiumTimeline, this, currTime,shipyardLevel)</param>
        /// <param name="getBaseTime">UnitHelper.GetBaseUnit(UnitType).BasePrice.TimeProduction</param>
        /// <param name="calculateTimeProduction"></param>
        public static void CalculateUserUnits(TimeLineStatus premiumTimeline,
            ref Dictionary<UnitType, TurnedUnit> startUnitTurn,out bool upgradeInProgress, 
            ref Dictionary<UnitType, int> dbHangarUnits,
            int shipyardLevel,
            Func<TimeLineStatus, TurnedUnit, int, int, TurnedUnit> calculateTrickyTurnUnit,
            Func<UnitType, double> getBaseTime,
            Func<int, bool, int, double> calculateTimeProduction
        )
        {

            var newTurnedUnits = new Dictionary<UnitType, TurnedUnit>();

            CalculateUnits(premiumTimeline, startUnitTurn, out upgradeInProgress, newTurnedUnits, shipyardLevel, calculateTrickyTurnUnit, getBaseTime, calculateTimeProduction);

            CalculateResultHangarAndTurn(ref dbHangarUnits, ref newTurnedUnits);
            startUnitTurn = newTurnedUnits;
        }

        private static void CalculateResultHangarAndTurn(ref Dictionary<UnitType, int> dbHangarUnits,
            ref Dictionary<UnitType, TurnedUnit> newTurnedUnits)
        {
            SetNewHangarUnits(ref dbHangarUnits, newTurnedUnits);
            ResetSavedUnit(ref newTurnedUnits);
            newTurnedUnits = (CheckUnitIsDone(newTurnedUnits) ? new Dictionary<UnitType, TurnedUnit>() : ClearDoneUnits(newTurnedUnits));
        }

        private static Dictionary<UnitType, TurnedUnit> ClearDoneUnits(Dictionary<UnitType, TurnedUnit> units)
        {
            return units.Where(i => i.Value.TotalCount > i.Value.ReadyUnits).ToDictionary(i => i.Key, i => i.Value);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="currTime"></param>
        /// <param name="premiumTimeline"></param>
        /// <param name="newUnits"></param>
        /// <param name="shipyardLevel"></param>
        /// <param name="calculateTrickyTurnUnit"> Unit.CalculateTrickyUnitTimeProduction(premiumTimeline, this, currTime,shipyardLevel);</param>
        private void CalculateTrickyUnit(
            int currTime,
            TimeLineStatus premiumTimeline,
            IDictionary<UnitType, TurnedUnit> newUnits,
            int shipyardLevel,
            Func<TimeLineStatus, TurnedUnit, int, int, TurnedUnit> calculateTrickyTurnUnit)
        {
            var beforeReadyUnit = ReadyUnits;

            var calculatedTurnUnit = calculateTrickyTurnUnit(premiumTimeline, this, currTime, shipyardLevel);
            int unitsToSave = 0;

            var readyBeforeInt = Math.Floor(beforeReadyUnit);
            var readyAfterInt = Math.Floor(calculatedTurnUnit.ReadyUnits);
            if (readyAfterInt - readyBeforeInt > 0) unitsToSave = (int)(readyAfterInt - readyBeforeInt);
            calculatedTurnUnit.UnitToSave = unitsToSave;
            newUnits.Add(UnitType, calculatedTurnUnit);



            //==============

        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="currTime"></param>
        /// <param name="newUnits"></param>
        /// <param name="shipyardLevel"></param>
        /// <param name="getBaseTime">UnitHelper.GetBaseUnit(UnitType).BasePrice.TimeProduction</param>
        /// <param name="calculateTimeProduction">Unit.CalculateTimeProduction(int baseTimeProduction, bool premium, int buildLevel)</param>
        private void CalculateLinearUnit(int currTime, IDictionary<UnitType, TurnedUnit> newUnits,
            int shipyardLevel,
            Func<UnitType, double> getBaseTime,
            Func<int, bool, int, double> calculateTimeProduction)
        {
            //double baseTime = Unit.InitializeUnit(UnitName).BasePrice.TimeProduction.CloneDeep();
            double baseTime = getBaseTime(UnitType);
            double beforeReadyUnit = ReadyUnits;

            //double baseTime = Unit.CalculateTimeProduction(int baseTimeProduction, bool premium, int buildLevel);
            if (shipyardLevel > 1) baseTime = calculateTimeProduction((int)baseTime, false, shipyardLevel);

            // ReSharper disable once PossibleLossOfFraction
            var nowReadyUnits = beforeReadyUnit + ((currTime - DateLastUpgrade) / baseTime);
            if (nowReadyUnits >= TotalCount) nowReadyUnits = TotalCount;
            var unitsToSave = 0;
            var readyBeforeInt = Math.Floor(beforeReadyUnit);
            var readyAfterInt = Math.Floor(nowReadyUnits);


            if (readyAfterInt - readyBeforeInt > 0) unitsToSave = (int)(readyAfterInt - readyBeforeInt);


            DateLastUpgrade = (int)Math.Floor(DateCreate + (baseTime * nowReadyUnits));
            ReadyUnits = nowReadyUnits;
            UnitToSave = unitsToSave;

            newUnits.Add(UnitType, this);
        }


        private static void SetNewHangarUnits(ref Dictionary<UnitType, int> hangar,
            IReadOnlyDictionary<UnitType, TurnedUnit> newUnits)
        {
            foreach (var i in hangar.Keys.ToList())
            {
                if (!newUnits.ContainsKey(i)) continue;
                var saveUnit = newUnits[i].UnitToSave;
                if (saveUnit != 0) hangar[i] += saveUnit;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="premiumTimeline"></param>
        /// <param name="startUnitTurn"></param>
        /// <param name="upgradeInProgress"></param>
        /// <param name="newTurnedUnits"></param>
        /// <param name="shipyardLevel"></param>
        /// <param name="calculateTrickyTurnUnit">Unit.CalculateTrickyUnitTimeProduction(premiumTimeline, this, currTime,shipyardLevel)</param>
        /// <param name="getBaseTime">UnitHelper.GetBaseUnit(UnitType).BasePrice.TimeProduction</param>
        /// <param name="calculateTimeProduction"></param>
        private static void CalculateUnits(TimeLineStatus premiumTimeline, Dictionary<UnitType, TurnedUnit> startUnitTurn,
            out bool upgradeInProgress, IDictionary<UnitType, TurnedUnit> newTurnedUnits, int shipyardLevel,
            Func<TimeLineStatus, TurnedUnit, int, int, TurnedUnit> calculateTrickyTurnUnit,
            Func<UnitType, double> getBaseTime,
            Func<int, bool, int, double> calculateTimeProduction)
        {
            if (shipyardLevel == 0) shipyardLevel = 1;
            var currTime = UnixTime.UtcNow();
            if (premiumTimeline?.Points != null && premiumTimeline.Points.Count != 0 &&
                premiumTimeline.Status?.Count != 0)
                foreach (var i in startUnitTurn) i.Value.CalculateTrickyUnit(currTime, premiumTimeline, newTurnedUnits, shipyardLevel, calculateTrickyTurnUnit);

            else foreach (var i in startUnitTurn) i.Value.CalculateLinearUnit(currTime, newTurnedUnits, shipyardLevel, getBaseTime, calculateTimeProduction);
            upgradeInProgress = newTurnedUnits.Any(j => j.Value.ReadyUnits < j.Value.TotalCount);

        }

        private static void ResetSavedUnit(ref Dictionary<UnitType, TurnedUnit> newUnits)
        {
            foreach (var i in newUnits.Keys.ToList())
            {
                var q = newUnits[i];
                q.UnitToSave = 0;
                newUnits[i] = q;
            }
        }
    }
}