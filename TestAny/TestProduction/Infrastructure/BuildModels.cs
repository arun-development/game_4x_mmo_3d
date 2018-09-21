using System;
using System.Collections.Generic;
using System.Numerics;
using System.Text;

namespace TestAny.TestProduction.Infrastructure
{
 
    internal class TestBuildBase : TestPriceBase
    {
        public int Level;
        public TestBuildBase(int level, TestPriceBase bp) : base(bp)
        {
            Level = level;
            SetOtherTimers();
        }
    }
    internal class TestExtraction : TestBuildBase
    {
        private int BasePower = 100;
        public double Power;

        public TestExtraction(int level, TestPriceBase bp) : base(level, bp)
        {

        }

        public void CalcPower(bool hasPremium, double bonusPerLevel)
        {
            var premProductionMod = 1.2;
            var mod = hasPremium ? premProductionMod : 1;
            var powerMod = Level == 1 ? 1 : Math.Pow(bonusPerLevel, Level - (0.01 * Level));
            var power = powerMod * BasePower * mod;
            Power = power;
        }
    }

    internal class TestShipyard : TestBuildBase
    {
        public double SpeedRate;

        public TestShipyard(int level, TestPriceBase price) : base(level, price)
        {

        }
        public void CalcSpeed(bool hasPremium, double bonusPerLevel)
        {
            var premProductionMod = 1.5;
            var mod = hasPremium ? premProductionMod : 1;
            var multiple = 1.0;
            if (Level >= 1)
            {
                multiple = Level - (0.02 * Level);
            }
            var levelBonus = bonusPerLevel;
            SpeedRate = Math.Pow(levelBonus, multiple) * mod;


        }


    }
 
    internal class TestEnergyConverter : TestBuildBase
    {
        public double ConvertLosesMod;
        public TestEnergyConverter(int level, TestPriceBase bp) : base(level, bp)
        {
        }
        public void CalcConvertLosesMod()
        {
            var maxLevel = 50.0f;
            var baseTransferLoses = 0.3;
            if (Level == 1)
            {
                ConvertLosesMod = baseTransferLoses;
                return;
            }
            if (Level >= maxLevel)
            {
                ConvertLosesMod = 1;
                return;
            }
            var lvl = Level / maxLevel;
            var startPoint = new Vector2(1, (float)baseTransferLoses);
            var shoulderPoint = new Vector2(maxLevel, (float)baseTransferLoses);
            var endPoint = new Vector2(maxLevel, 1);
            var startPointVector = Vector2.Multiply(startPoint, (float)Math.Pow(1 - lvl, 2));
            var shoulderPointVector = Vector2.Multiply(shoulderPoint, 2 * lvl * (1 - lvl));
            var endPointVector = Vector2.Multiply(endPoint, (float)Math.Pow(lvl, 2));
            var point = startPointVector + shoulderPointVector + endPointVector;
            var losesMod = point.Y;
            if (losesMod > 1)
            {
                losesMod = 1;
            }
            ConvertLosesMod = losesMod;


        }
    }
    internal class TestStorage : TestBuildBase
    {
        public double TransferLosesMod;
        public TestPriceBase MaxStorable;
        private TestPriceBase _defaultMaxStorable = new TestPriceBase(20000, 15000, 5000);

        public TestStorage(int level, TestPriceBase price) : base(level, price)
        {

        }
        public void CalcMaxStorable(bool hasPremium, double progressBonus)
        {
            var premProductionMod = 1.5;
            var mod = hasPremium ? premProductionMod : 1;
            var multiple = Level;

            if (Level == 1)
            {
                MaxStorable = new TestPriceBase(_defaultMaxStorable.E * mod, _defaultMaxStorable.Ir * mod, _defaultMaxStorable.Dm * mod);
                return;
            }
            MaxStorable = new TestPriceBase
            {
                E = _defaultMaxStorable.E * Math.Pow(progressBonus, multiple) * mod,
                Ir = _defaultMaxStorable.Ir * Math.Pow(progressBonus, multiple) * mod,
                Dm = _defaultMaxStorable.Dm * Math.Pow(progressBonus, multiple) * mod,

            };
            MaxStorable.E = Math.Floor(MaxStorable.E);
            MaxStorable.Ir = Math.Floor(MaxStorable.Ir);
            MaxStorable.Dm = Math.Floor(MaxStorable.Dm);

        }

        public void CalcTransferLoses(bool hasPremium)
        {
            var baseTransferLoses = 0.3f;
            var premiumMod = 1.2f;
            var maxLevel = 30.0f;
            if (Level == 1)
            {
                TransferLosesMod = baseTransferLoses;
                if (hasPremium)
                {
                    TransferLosesMod *= premiumMod;
                }
                return;
            }
            var level = Level / maxLevel;
            var p1 = new Vector2(1, baseTransferLoses);
            var p2 = new Vector2(maxLevel, baseTransferLoses);
            var p3 = new Vector2(maxLevel, 1);


            var p1t = Math.Pow(1 - level, 2);
            var p1v = Vector2.Multiply(p1, (float)p1t);
            var p2t = 2 * level * (1 - level);
            var p2v = Vector2.Multiply(p2, p2t);
            var p3v = Vector2.Multiply(p3, (float)Math.Pow(level, 2));
            var point = p1v + p2v + p3v;
            var loses = point.Y;
            if (hasPremium)
            {
                loses *= premiumMod;
            }
            if (loses > 1)
            {
                loses = 1;
            }
            TransferLosesMod = Math.Round(loses, 5);


        }


    }

 
}
