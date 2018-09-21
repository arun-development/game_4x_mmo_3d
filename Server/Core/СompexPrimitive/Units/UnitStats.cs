using Server.Core.Interfaces;
using Server.Modules.Localize.Game.Units;

//using Translate.Game.Units;

namespace Server.Core.СompexPrimitive.Units
{
    
    public class UnitStats : BattleStatsInt, ICreateNew<UnitStats>
    {
        public string AttackName =>    Resource.AttackName;
        public string HpName => Resource.HpName;

        protected UnitStats ()
        {
        }

        public UnitStats(int attack, int hp)
        {
            Attack = attack;
            Hp = hp;
        }
        private UnitStats(IBattleStats<int> other)
        {
            Attack = other.Attack;
            Hp = other.Hp;
     
        }
        
        public UnitStats CreateNew(UnitStats other)
        {
            return new UnitStats(other);
        }

        public UnitStats CreateNewFromThis()
        {
            return new UnitStats(Attack, Hp);
        }
    }
}