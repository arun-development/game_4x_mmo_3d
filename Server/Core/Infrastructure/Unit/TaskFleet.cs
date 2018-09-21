using System.Collections.Generic;
using Server.Core.СompexPrimitive.Units;

namespace Server.Core.Infrastructure.Unit
{
    public class TaskFleet
    {
        public int SourceId { get; set; }
        public string TargetName { get; set; }
        public bool IsTransfer { get; set; }
        public Dictionary<UnitType, int> Units { get; set; }


        //for task query check item
        public bool TimeOver { get; set; }

        public int FlyDuration { get; set; }
        public int StartTime { get; set; }

        public bool IsWin { get; set; }
        public string BattleResult { get; set; }

        public void FixUnitCount(Dictionary<UnitType, int> units)
        {
            Units = UnitList.FixUnits(Units, units);
        }
    }
}