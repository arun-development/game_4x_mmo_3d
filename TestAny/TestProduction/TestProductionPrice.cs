using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using TestAny.TestProduction.Infrastructure;

namespace TestAny.TestProduction
{


    /// <summary>
    /// Это не тест как таковой. Цель собрать статисику по экономическим модулям. Данные  методов записываются в консоль для дальнейшего анализа
    /// </summary>
    [TestClass]
    public class TestProductionPrice
    {
        #region Helpers

        private List<int> _createLevels(int maxLevel)
        {
            var levels = new List<int>();

            for (int i = 0; i < maxLevel; i++)
            {
                levels.Add(i + 1);
            }
            return levels;
        }
        private void _logItem<V>(string name, List<int> levels, Func<int, bool, V> perItemAction)
        {

            Console.WriteLine("//=====NO PREMIUM=====\n{'" + name + "':[{");
            foreach (var level in levels)
            {

                var item = perItemAction(level, false);
                Console.WriteLine($@"'{level}':{JsonConvert.SerializeObject(item)}" + ",");
            }
            Console.WriteLine(@"},");
            Console.WriteLine("//=====PREMIUM=====\n{");

            foreach (var level in levels)
            {

                var item = perItemAction(level, true);
                Console.WriteLine($@"'{level}':{JsonConvert.SerializeObject(item)}" + ",");
            }
            Console.WriteLine(@"}]}");

        }


        private TestPriceBase _calcBuildPrice(TestPriceBase defaultPrice, int level, bool premium, double buildCostUpdateModifer = 1.17)
        {

            
            var timeMod = 1.0;
            var priceMod = 1.0;
            var multiplePrice = 1.0;
            var multipleTime = 1.0;
            var multipleCc = 1.0;
            var timeProductionMod = 1.0;
            if (premium)
            {
                priceMod = 1.0;
                timeMod = 0.5;
            }
            if (level<= 1)
            {
                var df = new TestPriceBase(defaultPrice);
                df.Cc = defaultPrice.Cc;
                df.TimeProductionInSecond *=timeMod;
                return df;
            }
            
            if (level > 1)
            {
                multiplePrice = level - (0.2 * level);
                multipleTime = level;
                multipleCc = level - (0.3 * level);
                timeProductionMod = Math.Pow(buildCostUpdateModifer, multipleTime);
            }
            
            var e = defaultPrice.E>0? Math.Floor(defaultPrice.E * Math.Pow(buildCostUpdateModifer, multiplePrice) * priceMod):0;
            var ir = defaultPrice.Ir > 0 ? Math.Floor(defaultPrice.Ir * Math.Pow(buildCostUpdateModifer, multiplePrice) * priceMod) : 0;
            var dm = defaultPrice.Dm > 0 ? Math.Floor(defaultPrice.Dm * Math.Pow(buildCostUpdateModifer, multiplePrice) * priceMod) : 0;
            var cc = defaultPrice.Cc > 0 ? Math.Floor(Math.Pow(buildCostUpdateModifer, multipleCc) * defaultPrice.Cc) : 0;
            var time = defaultPrice.TimeProductionInSecond>0?(int)Math.Ceiling(defaultPrice.TimeProductionInSecond * timeProductionMod * timeMod):0;
            var price = new TestPriceBase(e, ir, dm);
            price.Cc = cc;
            price.TimeProductionInSecond = time;
            return price;
        }
        #endregion

        #region Units

        private List<TestUnit> _createUnits()
        {

            return new List<TestUnit>
            {
                new TestUnit("Drone", new TestStats(75, 50), new TestUnitPrice(500, 1200, 400)),
                new TestUnit("Frigate", new TestStats(50, 160), new TestUnitPrice(500, 3000, 400)),
                new TestUnit("Battlecruiser", new TestStats(160, 150), new TestUnitPrice(1000, 2000, 3500)),
                new TestUnit("Battleship", new TestStats(320, 330), new TestUnitPrice(2000, 3000, 8000)),
                new TestUnit("Drednout", new TestStats(10000, 10000), new TestUnitPrice(40000, 50000,60000)),
            };
        }



        [TestMethod]
        public void TestUnitStats()
        {
            var unitList = _createUnits();
            var d = new Dictionary<string, List<TestUnit>>
            {
                {  "Units",unitList}
            };
            Console.WriteLine(JsonConvert.SerializeObject(d));
        }

        #endregion
         
        #region Extraction

        [TestMethod]
        public void TestExtractionModulePrice()
        {
            var levels = _createLevels(50);
            var basePrice = new TestPriceBase(200, 200, 0);
            basePrice.TimeProductionInSecond = 900;//3600
            basePrice.SetCcPrice();//60
                 

            _logItem("Extraction", levels, (level, hasPremium) => _calcExtraction(basePrice, level, hasPremium));
            Assert.IsTrue(true);
        }

        private TestExtraction _calcExtraction(TestPriceBase defaultPrice, int level, bool premium)
        {
            var buildCostUpdateModifer = 1.17;
            var price = new TestExtraction(level, _calcBuildPrice(defaultPrice, level, premium)); ;
            price.CalcPower(premium, buildCostUpdateModifer);
            return price;
        }

        private List<TestExtraction> _createExtractionLevelList(int maxLevel, bool hasPremium)
        {
            var levels = _createLevels(maxLevel);
            var basePrice = new TestPriceBase(200, 200, 0);
            basePrice.TimeProductionInSecond = 900;
            basePrice.SetCcPrice();//60
            var result = levels.Select(level => _calcExtraction(basePrice, level, hasPremium)).ToList();
            return result;
        }



        #endregion

        #region Shipyard

        [TestMethod]
        public void TestCalcShipyardProduction()
        {
            var levels = _createLevels(20);
            var basePrice = new TestPriceBase(1000, 5000, 3000);
            basePrice.TimeProductionInSecond = 14400;
            basePrice.SetCcPrice();// 2600
            _logItem("Shipyard", levels, (level, hasPremium) => _calcShipyard(basePrice, level, hasPremium));
            Assert.IsTrue(true);
        }

        private List<TestShipyard> _createShipyardLevelList(int maxLevel, bool hasPremium)
        {
            var levels = _createLevels(maxLevel);
            var basePrice = new TestPriceBase(1000, 5000, 3000);
            basePrice.TimeProductionInSecond = 14400;
            basePrice.SetCcPrice();
            var result = levels.Select(level => _calcShipyard(basePrice, level, hasPremium)).ToList();
            return result;


        }

        private TestShipyard _calcShipyard(TestPriceBase defaultPrice, int level, bool premium)
        {
            var buildCostUpdateModifer = 1.05;
            var price = new TestShipyard(level, _calcBuildPrice(defaultPrice, level, premium)); ;
            price.CalcSpeed(premium, buildCostUpdateModifer);
            return price;
        }




        #endregion

        #region Storage
        [TestMethod]
        public void TestCalcStorage()
        {
            var levels = _createLevels(50);
            var basePrice = new TestPriceBase(100, 100, 50);
            basePrice.TimeProductionInSecond = 600;
            basePrice.SetCcPrice();//55
            _logItem("Storage", levels, (level, hasPremium) => _calcStorage(basePrice, level, hasPremium));
            Assert.IsTrue(true);
        }
        private TestStorage _calcStorage(TestPriceBase defaultPrice, int level, bool premium)
        {
            var buildCostUpdateModifer = 1.17;
            var storage = new TestStorage(level, _calcBuildPrice(defaultPrice, level, premium)); ;
            storage.CalcMaxStorable(premium, buildCostUpdateModifer);
            storage.CalcTransferLoses(premium);
            return storage;
        }

        private List<TestStorage> _createStoragedLevelList(int maxLevel, bool hasPremium)
        {
            var levels = _createLevels(maxLevel);
            var basePrice = new TestPriceBase(100, 200, 50);
            basePrice.TimeProductionInSecond = 600;
            basePrice.SetCcPrice();//55
            var result = levels.Select(level => _calcStorage(basePrice, level, hasPremium)).ToList();
            return result;

        }

        [TestMethod]
        public void TestStorageLoses()
        {

            var levels = _createLevels(50);
            var premMod = 1.2;
            var min = 0.3f;
            var p1 = new Vector2(1, min);
            var p2 = new Vector2(50, min);
            var p3 = new Vector2(50, 1);
            Func<double, Vector2> b = level =>
            {
                var p1t = Math.Pow(1 - level, 2);
                var p1v = Vector2.Multiply(p1, (float)p1t);
                var p2t = 2 * level * (1 - level);
                var p2v = Vector2.Multiply(p2, (float)p2t);
                var p3v = Vector2.Multiply(p3, (float)Math.Pow(level, 2));
                return p1v + p2v + p3v;
            };


            var results = levels.Select(level => b((double)level / 50).Y).Select(i =>
            {
                var mod = i * premMod;
                if (mod > 1)
                {
                    mod = 1;
                }
                return mod;
            }).ToList();
            Console.WriteLine(JsonConvert.SerializeObject(results));
        }

        #endregion

        #region EnergyConverter
        [TestMethod]
        public void TestCalcEnergyConverter()
        {
            var levels = _createLevels(50);
            var basePrice = new TestPriceBase(4000, 1000, 2000);
            basePrice.TimeProductionInSecond = 320;//1200
            basePrice.SetCcPrice();
            _logItem("EnergyConverter", levels, (level, hasPremium) => _calcEnergyConverter(basePrice, level, hasPremium));
            Assert.IsTrue(true);
        }

        private TestEnergyConverter _calcEnergyConverter(TestPriceBase defaultPrice, int level, bool premium)
        {
            var ec = new TestEnergyConverter(level, _calcBuildPrice(defaultPrice, level, premium)); ;
            ec.CalcConvertLosesMod();

            return ec;
        }

        private List<TestEnergyConverter> _createEnergyConverterLevelList(int maxLevel, bool hasPremium)
        {
            var levels = _createLevels(maxLevel);
            var basePrice = new TestPriceBase(1000, 500, 2500);
            basePrice.TimeProductionInSecond = 320;
            basePrice.SetCcPrice();
            var result = levels.Select(level => _calcEnergyConverter(basePrice, level, hasPremium)).ToList();
            return result;
        }


        #endregion

        [TestMethod]
        public void CreateJsonLog()
        {
            var units = _createUnits();
            var hasPremiumKey = "HasPremium";
            var notHasPremiumKey = "NotHasPremium";


            var log = new TestUnitBuildJsonLog
            {
                Units = units,
                Extraction = new Dictionary<string, List<TestExtraction>> {
                    { hasPremiumKey, _createExtractionLevelList(50, true) },
                    { notHasPremiumKey, _createExtractionLevelList(50, false) } },
                Shipyard = new Dictionary<string, List<TestShipyard>> {
                    { hasPremiumKey, _createShipyardLevelList(50, true) },
                    { notHasPremiumKey, _createShipyardLevelList(50, false) } },
                Storage = new Dictionary<string, List<TestStorage>> {
                    { hasPremiumKey, _createStoragedLevelList(50, true) },
                    { notHasPremiumKey, _createStoragedLevelList(50, false) } },
                EnergyConverter = new Dictionary<string, List<TestEnergyConverter>> {
                    { hasPremiumKey, _createEnergyConverterLevelList(50, true) },
                    { notHasPremiumKey, _createEnergyConverterLevelList(50, false) } }
            };
            Console.WriteLine(JsonConvert.SerializeObject(log));

            Assert.IsTrue(true);
        }


        #region Teches
        private class TechFactoryParams
        {
            public TechFactoryParams()
            {
            }

            public TechFactoryParams(Dictionary<string, List<TestTech>> inst, List<int> levels, string techName, double timeProduction, TestStats baseStats, TestPriceBase basePrice)
            {
                Inst = inst;
                Levels = levels;
                TechName = techName;
                TimeProduction = timeProduction;
                BaseStats = baseStats;
                BasePrice = basePrice;
            }

            public Dictionary<string, List<TestTech>> Inst;
            public List<int> Levels;
            public string TechName;
            public double TimeProduction;
            public TestStats BaseStats;
            public TestPriceBase BasePrice;
        }
        [TestMethod]
        public void TestCreatePersonalTechesLog()
        {
            var level = _createLevels(35);
            var teches = _createPersonalTeches(level);
            Console.WriteLine(JsonConvert.SerializeObject(teches));
            Assert.IsTrue(true);
        }

        private Dictionary<string, List<TestTech>> _createPersonalTeches(List<int> levels)
        {

            var teches = new Dictionary<string, List<TestTech>>();

            _addTechesToInst(new TechFactoryParams
            {
                TimeProduction = 3600,
                BasePrice = new TestPriceBase(10000, 10000, 10000),
                BaseStats = new TestStats(0.01, 0),
                Inst = teches,
                Levels = levels,
                TechName = "WeaponUpgradeTech"
            });

            _addTechesToInst(new TechFactoryParams
            {
                TimeProduction = 3600,
                BasePrice = new TestPriceBase(10000, 10000, 10000),
                BaseStats = new TestStats(0.01, 0),
                Inst = teches,
                Levels = levels,
                TechName = "DamageControlTech"
            });

            _addTechesToInst(new TechFactoryParams
            {
                TimeProduction = 3600,
                BasePrice = new TestPriceBase(5000, 1000, 5000),
                BaseStats = new TestStats(0.02, 0.02),
                Inst = teches,
                Levels = levels,
                TechName = "Drone"
            });

            _addTechesToInst(new TechFactoryParams
            {
                TimeProduction = 3600,
                BasePrice = new TestPriceBase(5000, 5000, 5000),
                BaseStats = new TestStats(0.02, 0.02),
                Inst = teches,
                Levels = levels,
                TechName = "Frigate"
            });

            _addTechesToInst(new TechFactoryParams
            {
                TimeProduction = 7200,
                BasePrice = new TestPriceBase(7000, 1000, 7000),
                BaseStats = new TestStats(0.02, 0.02),
                Inst = teches,
                Levels = levels,
                TechName = "Battlecruiser"
            });
            _addTechesToInst(new TechFactoryParams
            {
                TimeProduction = 10800,
                BasePrice = new TestPriceBase(7000, 5000, 7000),
                BaseStats = new TestStats(0.02, 0.02),
                Inst = teches,
                Levels = levels,
                TechName = "Battleship"
            });
            _addTechesToInst(new TechFactoryParams
            {
                TimeProduction = 14400,
                BasePrice = new TestPriceBase(20000, 30000, 20000),
                BaseStats = new TestStats(0.02, 0.03),
                Inst = teches,
                Levels = levels,
                TechName = "Drednout"
            });

            return teches;
        }

        private List<TestTech> _createtechLevelList(List<int> levels, Func<int, TestTech> techFactory)
        {
            return levels.Select(techFactory).ToList();
        }
        private void _addTechesToInst(TechFactoryParams techFactoryParams)
        {
            techFactoryParams.Inst.Add(techFactoryParams.TechName, _createtechLevelList(techFactoryParams.Levels,
                level => new TestTech(techFactoryParams.TechName, techFactoryParams.BaseStats, _createTestTechPrice(techFactoryParams.TimeProduction, level, techFactoryParams.BasePrice))));

        }

        private TestTechPrice _createTestTechPrice(double timeProduction, int level, TestPriceBase basePrice)
        {
            basePrice.TimeProductionInSecond = timeProduction;
            basePrice.SetCcPrice();
            var price = _calcBuildPrice(basePrice, level, false,1.03);
            var techPrice = new TestTechPrice(level, price);
            return techPrice;
        }


        #endregion

    }
}
