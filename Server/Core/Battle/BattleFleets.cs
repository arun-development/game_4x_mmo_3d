using System.Collections.Generic;
using Server.Core.СompexPrimitive.Units;

namespace Server.Core.Battle
{
    public enum BattleResult : byte
    {
        InProgress =0,
        AtackerWin = 1,
        //AtackerEscape = 2,
        DefenderWin = 3,
        //DeadHeat = 4
    }

    public class BattleFleets
    {
        public Dictionary<UnitType, int> Before;
        public Dictionary<UnitType, int> After;
        public Dictionary<UnitType, int> Lose;

        public BattleFleets Source;
        public BattleFleets Target;

        public List<Round> Rounds;
    }
}