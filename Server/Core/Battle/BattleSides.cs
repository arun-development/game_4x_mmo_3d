using System.Collections.Generic;
using Server.Core.СompexPrimitive.Units;

namespace Server.Core.Battle
{
    public class BattleSides
    {
        public Dictionary<UnitType, int> Ataker;
        public Dictionary<UnitType, int> Defender;
    }

}
