using System;

namespace Server.Core.Interfaces
{
    public interface IBattleStats<T>
    {
        T Attack { get; set; }
        T Hp { get; set; }
    }



    public interface IBattleStatsDouble: IBattleStats<double>
    {
        void ConvertPercentToMod();
    }
    public interface IBattleStatsInt : IBattleStats<int>
    {

    }
    public class BattleStatsDouble : IBattleStatsDouble
    {
        public double Attack { get; set; }
        public double Hp { get; set; }
        private bool _convertedToMod = false;
        public void ConvertPercentToMod()
        {
            if (_convertedToMod) return;
            if (Attack>0) Attack *= 0.01;
            if (Hp>0) Hp *= 0.01;
            _convertedToMod = true;
        }


        protected IBattleStatsInt _intStats;
        private bool _lockAdd;

        public BattleStatsDouble()
        {
        }
        public BattleStatsDouble(double attack, double hp)
        {
            Attack = attack;
            Hp = hp;
        }
        public BattleStatsDouble(int attack, int hp)
        {
            Attack = attack;
            Hp = hp;
        }

        public virtual IBattleStatsInt IntStats => (_intStats == null)? _intStats:_intStats = new BattleStatsInt(Attack, Hp);

        public virtual void Add(IBattleStatsDouble other, bool lockAdd)
        {
            if (_lockAdd)
            {
                throw new Exception("Calculated Finalized  and locked");
            }
            Attack += other.Attack;
            Hp += other.Hp;
            if (lockAdd)
            {
                _lockAdd = true;
            }
        }
    }
    public class BattleStatsInt : IBattleStatsInt
    {
        public int Attack { get; set; }
        public int Hp { get; set; }
        protected IBattleStatsDouble _doubleStats;
        public virtual IBattleStatsDouble DoubleStats => _doubleStats ?? (_doubleStats =new BattleStatsDouble(Attack, Hp));

        public BattleStatsInt()
        {
        }
        public BattleStatsInt(int attack, int hp)
        {
            Attack = attack;
            Hp = hp;
        }
        public BattleStatsInt(double attack, double hp)
        {
            Attack =(int) Math.Floor(attack);
            Hp = (int) Math.Floor(hp);
        }

    }
}
