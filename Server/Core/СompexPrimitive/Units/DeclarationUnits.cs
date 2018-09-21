using System;
using Server.Core.Images;
using Server.Core.СompexPrimitive.Resources;
using Server.Modules.Localize;
using Server.Modules.Localize.Game.Units;

//using Translate.Game.Units;

namespace Server.Core.СompexPrimitive.Units
{

    public class BaseUnit
    {
        public SpriteImages Images;
        public BasePrice UnitBasePrice;
        public UnitStats Stats;
        public const double  BASE_MATERIAL_RATE = 5; 
        private double _materialRate;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="timeInHour">Time to production resource by production in level 1</param>
        /// <param name="deficit">Coef proportion production resource to time production unit default=100</param>
        /// <returns></returns>
        public int HourToSecond(double timeInHour, double deficit = 100)
        {
            return (int)Math.Floor(timeInHour * UnixTime.OneHourInSecond / deficit);
        }


        public void _setMaterialresource(BasePrice price, double materialRate)
        {
            if (materialRate != BASE_MATERIAL_RATE) {
                _materialRate = materialRate;
                price.MultiplyBase(1 / _materialRate);
            }
            price.ConvertToInt();


            UnitBasePrice = price;

        }

        public double _getMaterialRate() {
            return _materialRate;
        }

    }

    public static class Drone
    {
        public static readonly UnitType UnitType = UnitType.Drone;
        public static readonly string NativeName = UnitType.ToString();
        private static BaseUnit _unit = new BaseUnit();
        public static SpriteImages Images()
        {
            return _unit.Images ?? (_unit.Images = new SpriteImages().UnitImages(NativeName));
        }
        public static BasePrice Price()
        {
            if (_unit.UnitBasePrice == null)
            {
                // _unit._setMaterialresource(new BasePrice(500, 1200, 400, 490, _unit.HourToSecond(49 / 5)));
                var sec = 49;
                _unit._setMaterialresource(new BasePrice(100, 50, 20, 490, sec),1);
            }
            return _unit.UnitBasePrice;
            // return _unitBasePrice ?? (_unitBasePrice = new BasePrice(null, 1, 1, 1, 40));
        }

        public static UnitStats Stats()
        {
            return _unit.Stats ?? (_unit.Stats = new UnitStats(75, 50));
        }

        public static LangField TranslateText()
        {
            return new LangField
            {
                Name = Resource.DroneName,
                Description = Resource.DroneDescription
            };
        }
    }

    public static class Frigate
    {
        public static readonly UnitType UnitType = UnitType.Frigate;
        public static readonly string NativeName = UnitType.ToString();
        private static BaseUnit _unit = new BaseUnit();


        public static SpriteImages Images()
        {
            return _unit.Images ?? (_unit.Images = new SpriteImages().UnitImages(NativeName));
        }


        public static BasePrice Price()
        {

            if (_unit.UnitBasePrice == null)
            {
                // _unit._setMaterialresource(new BasePrice(500, 3000, 400, 850, _unit.HourToSecond(85 / 5)));
                var sec = 85;
                _unit._setMaterialresource(new BasePrice(200, 150, 50, 850, sec),1);
            }
            return _unit.UnitBasePrice;
 
            //return _unitBasePrice ?? (_unitBasePrice = new BasePrice(null, 1, 1, 1, 10));
        }

        public static UnitStats Stats()
        {
            return _unit.Stats ?? (_unit.Stats = new UnitStats(50, 160));
        }

        public static LangField TranslateText()
        {

            return new LangField { Name = Resource.FrigateName, Description = Resource.FrigateDescription };
        }
    }

    public static class Battlecruiser
    {
        public static readonly UnitType UnitType = UnitType.Battlecruiser;
        public static readonly string NativeName = UnitType.ToString();
        private static BaseUnit _unit = new BaseUnit();

        public static SpriteImages Images()
        {
            return _unit.Images ?? (_unit.Images = new SpriteImages().UnitImages(NativeName));
        }



        public static BasePrice Price()
        {

            if (_unit.UnitBasePrice == null)
            {
                var sec = 225;
                _unit._setMaterialresource(new BasePrice(1000, 2000, 3500, 2250, sec),1);
            }
            return _unit.UnitBasePrice; 
            // return _unitBasePrice ?? (_unitBasePrice = new BasePrice(null, 1, 1, 1, 3));
        }

        public static UnitStats Stats()
        {
            return _unit.Stats ?? (_unit.Stats = new UnitStats(160, 150));
        }
    }

    public static class Battleship
    {
        public static readonly UnitType UnitType = UnitType.Battleship;
        public static readonly string NativeName = UnitType.ToString();

        private static BaseUnit _unit = new BaseUnit();

        public static SpriteImages Images()
        {
            return _unit.Images ?? (_unit.Images = new SpriteImages().UnitImages(NativeName));
        }



        public static BasePrice Price()
        {

            if (_unit.UnitBasePrice == null)
            {
                var sec = 480; //_unit.HourToSecond(480 / BaseUnit.BASE_MATERIAL_RATE);

                _unit._setMaterialresource(new BasePrice(2000, 3000, 8000, 4800, sec),1);
            }
            return _unit.UnitBasePrice;
 
        }


        public static UnitStats Stats()
        {
            return _unit.Stats ?? (_unit.Stats = new UnitStats(320, 330));
        }
    }

    public static class Drednout
    {
        public static readonly UnitType UnitType = UnitType.Drednout;
        public static readonly string NativeName = UnitType.ToString();
        private static BaseUnit _unit = new BaseUnit();

        public static SpriteImages Images()
        {
            return _unit.Images ?? (_unit.Images = new SpriteImages().UnitImages(NativeName));
        }

        public static BasePrice Price()
        {
            if (_unit.UnitBasePrice == null)
            {
                var sec = 4400; //_unit.HourToSecond(4400 / BaseUnit.BASE_MATERIAL_RATE);
                _unit._setMaterialresource(new BasePrice(40000, 50000, 60000, 44000, sec),1);
            }
            return _unit.UnitBasePrice; 
        }


        public static UnitStats Stats()
        {
            return _unit.Stats ?? (_unit.Stats = new UnitStats(10000, 10000));
        }
    }
}