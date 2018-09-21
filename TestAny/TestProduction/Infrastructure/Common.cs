using System;
using System.Collections.Generic;
using System.Reflection.Metadata.Ecma335;
using System.Text;

namespace TestAny.TestProduction.Infrastructure
{
    internal class TestPriceBase
    {
        public double E;
        public double Ir;
        public double Dm;
        public double TimeProductionInSecond;
        public double TimeProductionInMinutes;
        public double TimeProductionInHour;
        public double TimeProductionInDays;
        public double Cc;
        public double PriceInE;
        protected TestPriceBase Proportion;

        public TestPriceBase()
        {
        }
        public TestPriceBase(double e, double ir, double dm)
        {
            E = e;
            Ir = ir;
            Dm = dm;
            _setProportion();
            _setPriceInE();
        }

        private void _setProportion()
        {
            Proportion = new TestPriceBase
            {
                E = 1,
                Ir = 2,
                Dm = 5,
                Cc = 10
            };
        }
        private void _setPriceInE()
        {
            PriceInE = CalcPriceInE();
        }

        public TestPriceBase(TestPriceBase other)
        {
            E = other.E;
            Ir = other.Ir;
            Dm = other.Dm;
            Proportion = other.Proportion;
            Cc = other.Cc;
            TimeProductionInSecond = other.TimeProductionInSecond;
            PriceInE = other.PriceInE;
        }
        private double CalcPriceInE()
        {
            var e = E * Proportion.E;
            var ir = Ir * Proportion.Ir;
            var dm = Dm * Proportion.Dm;
            return e + ir + dm;
        }
        public void SetCcPrice()
        {
            Cc = PriceInE / 10;
        }

        protected void SetOtherTimers()
        {
            TimeProductionInMinutes = TimeProductionInSecond / 60;
            TimeProductionInHour = TimeProductionInSecond / 3600;
            TimeProductionInDays = TimeProductionInHour / 24;
        }
    }
    internal class TestStats
    {
        public double Attack;
        public double Hp;
        public double Power => Attack + Hp;

        public TestStats(double attack, double hp)
        {
            Attack = attack;
            Hp = hp;
        }
        public TestStats(TestStats other)
        {
            Attack = other.Attack;
            Hp = other.Hp;
        }

        public void Scale(double multiply)
        {
            Attack *= multiply;
            Hp *= multiply;
        }
        public void Scale(double multiplyAtack, double multiplyHp)
        {
            Attack *= multiplyAtack;
            Hp *= multiplyHp;
        }

    }
    internal class TestUnitBuildJsonLog
    {
        public List<TestUnit> Units;
        public Dictionary<string, List<TestExtraction>> Extraction;
        public Dictionary<string, List<TestShipyard>> Shipyard;
        public Dictionary<string, List<TestStorage>> Storage;
        public Dictionary<string, List<TestEnergyConverter>> EnergyConverter;
    }
}
