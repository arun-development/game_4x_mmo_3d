using System;
using System.Reflection.Metadata.Ecma335;
using Server.Core.Interfaces;
using Server.Core.StaticData;

namespace Server.Core.СompexPrimitive.Resources
{
    public class BasePrice : GameResource, ICreateNew<BasePrice>
    {

        public BasePrice()
        {

        }

        /// <summary>
        ///     Стоимость ресурсов
        /// </summary>
        /// <param name="e"></param>
        /// <param name="ir"></param>
        /// <param name="dm"></param>
        /// <param name="cc"></param>
        /// <param name="timeProduction"></param>
        public BasePrice(double? e = null, double? ir = null, double? dm = null, double? cc = null,
            int? timeProduction = null) : base(e, ir, dm)
        {
            if (cc != null)
            {
                Cc = (double)cc;
            }
            if (timeProduction != null)
            {
                TimeProduction = (int)timeProduction;
            }
        }

        private BasePrice(GameResource other)
        {

            Cc = other.Cc;
            Dm = other.Dm;
            E = other.E;
            Ir = other.Ir;
            TimeProduction = other.TimeProduction;
        }



        public static BasePrice CalcBuildPrice(BasePrice defaultPrice, int level, bool premium, double buildCostUpdateModifer = GameMathStats.BuildCostUpdateModifer)
        {

            var timeMod = GameMathStats.BaseBuildingTimeMod;
            var priceMod = GameMathStats.BasePriceMod;
            var multiplePrice = 1.0;
            var multipleTime = 1.0;

            var timeProductionMod = 1.0;
            if (premium)
            {
                priceMod = GameMathStats.PremiumPriceMod;
                timeMod = GameMathStats.PremiumBuildingTimeMod;
            }
            if (level <= 1)
            {
                var df = new BasePrice(defaultPrice);
                df.TimeProduction =(int) Math.Floor(df.TimeProduction * timeMod);
                return df;
            }
            if (level > 1)
            {
                multiplePrice = level - (0.2 * level);
                multipleTime = level;
                timeProductionMod = Math.Pow(buildCostUpdateModifer, multipleTime);
            }

            var e = _calcPriceVal(defaultPrice.E, buildCostUpdateModifer, multiplePrice, priceMod); 
            var ir = _calcPriceVal(defaultPrice.Ir, buildCostUpdateModifer, multiplePrice, priceMod);
            var dm = _calcPriceVal(defaultPrice.Dm, buildCostUpdateModifer, multiplePrice, priceMod);        
            var cc = CalcCcBuildUpgradePrice((int)defaultPrice.Cc, level, buildCostUpdateModifer);
            var time = defaultPrice.TimeProduction > 0 ? (int)Math.Ceiling(defaultPrice.TimeProduction * timeProductionMod * timeMod) : 0;

            var price = new BasePrice
            {
                E = e,
                Ir = ir,
                Dm = dm,
                Cc = cc,
                TimeProduction = time
            };
            return price;
        }


        private static int _calcPriceVal(double baseVal, double buildCostUpdateModifer,double multiplePrice,double priceMod) {
            var val = baseVal > 0 ? Math.Floor(baseVal * Math.Pow(buildCostUpdateModifer, multiplePrice) * priceMod) : 0;
            return (int)val;
        }


        public static int CalcCcBuildUpgradePrice(int baseCcPrice, int level, double buildCostUpdateModifer = GameMathStats.BuildCostUpdateModifer)
        {
            if (baseCcPrice <= 0)
            {
                return 0;
            }

            var multiple = level == 1 ? 1 : level - (0.3 * level);
            var cc = level > 1 ? (int)Math.Floor(Math.Pow(buildCostUpdateModifer, multiple) * baseCcPrice) : baseCcPrice;
            return cc;
        }

        public BasePrice CreateNew(GameResource other)
        {
            return new BasePrice(other);

        }

        public BasePrice CreateNew(BasePrice other)
        {
            return new BasePrice(other);
        }

        public BasePrice CreateNewFromThis()
        {
            return new BasePrice(this);

        }
    }
}