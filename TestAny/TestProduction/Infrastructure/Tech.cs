using System;
using System.Collections.Generic;
using System.Text;

namespace TestAny.TestProduction.Infrastructure
{

    internal class TestTechPrice: TestBuildBase
    {
  
        public TestTechPrice(int level, TestPriceBase bp):base(level, bp)
        {
 
        }
        
    }
    internal class TestTech
    {
        public string TechName { get; set; }
        public TestStats TechModsBase { get; set; }
        public TestStats TechMods { get; set; }
        public TestTechPrice TechPrice { get; set; }

        public TestTech(string techName, TestStats techModsBase, TestTechPrice techPrice)
        {
            TechName = techName;
            TechModsBase = techModsBase;
            TechPrice = techPrice;
            TechMods = new TestStats(TechModsBase);
            TechMods.Scale(techPrice.Level);
        }
    }
}
