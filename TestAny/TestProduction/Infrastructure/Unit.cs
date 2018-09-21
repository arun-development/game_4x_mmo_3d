using System;
using System.Collections.Generic;
using System.Text;

namespace TestAny.TestProduction.Infrastructure
{
    internal class TestUnitPrice : TestPriceBase
    {

        public double UnitsInHour;
        private double ProductionEInHour = 100;

        public TestUnitPrice(double e, double ir, double dm) : base(e, ir, dm)
        {
            Cc = PriceInE / Proportion.Cc;
            TimeProductionInSecond = (PriceInE / ProductionEInHour) * 3600;
            TimeProductionInSecond = TimeProductionInSecond / 100;//defecit
            UnitsInHour = ProductionEInHour / PriceInE;//штуки
            SetOtherTimers();

        }



    }
    internal class TestUnit
    {
        public string UnitName { get; set; }
        public TestStats Stats { get; set; }
        public TestUnitPrice UnitPrice { get; set; }
        public double PriceToPower => UnitPrice.PriceInE / Stats.Power;
        public double ProductionPowerInHour => UnitPrice.UnitsInHour * Stats.Power;


        public TestUnit(string unitName, TestStats stats, TestUnitPrice unitPrice)
        {
            UnitName = unitName;
            Stats = stats;
            UnitPrice = unitPrice;
        }
    }
}
