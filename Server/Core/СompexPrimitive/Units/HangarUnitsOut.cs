using System.Collections.Generic;
using Server.Core.Images;
using Server.Core.Interfaces;
using Server.Core.StaticData;

namespace Server.Core.СompexPrimitive.Units
{
    public class HangarUnitsOut : INativeName
    {
        public const string ViewKey = "HangarUnitsKey";
        //public const string ViewUnitItemTmpl = Directories.HtmltemplateDir + "icon/_hangarUnit.html";
        public const string ViewUnitItemTmpl = "icon-hangar-unit-item" + Directories.Tmpl;
        public string Name;
        public SpriteImages SpriteImages;
        public ItemProgress Progress;
        public int? Count;
        public string NativeName { get; set; }


        public static Dictionary<UnitType, HangarUnitsOut> EmptyHangar()
        {
            var unitList = new Dictionary<UnitType, HangarUnitsOut>();
            var drone = new HangarUnitsOut
            {
                Count = 0,
                SpriteImages = Drone.Images(),
                Name = UnitHelper.GetTranslate(UnitType.Drone).Name,
                NativeName = Drone.NativeName
            };
            var frigate = new HangarUnitsOut
            {
                Count = 0,
                SpriteImages = Frigate.Images(),
                Name = UnitHelper.GetTranslate(UnitType.Frigate).Name,
                NativeName = Frigate.NativeName
            };
            var battleCruiser = new HangarUnitsOut
            {
                Count = 0,
                SpriteImages = Battlecruiser.Images(),
                Name = UnitHelper.GetTranslate(UnitType.Battlecruiser).Name,
                NativeName = Battlecruiser.NativeName
            };
            var battleShip = new HangarUnitsOut
            {
                Count = 0,
                SpriteImages = Battleship.Images(),
                Name = UnitHelper.GetTranslate(UnitType.Battleship).Name,
                NativeName = Battleship.NativeName
            };
            var drednout = new HangarUnitsOut
            {
                Count = 0,
                SpriteImages = Drednout.Images(),
                Name = UnitHelper.GetTranslate(UnitType.Drednout).Name,
                NativeName = Drednout.NativeName
            };

            unitList.Add(UnitType.Drone, drone);
            unitList.Add(UnitType.Frigate, frigate);
            unitList.Add(UnitType.Battlecruiser, battleCruiser);
            unitList.Add(UnitType.Battleship, battleShip);
            unitList.Add(UnitType.Drednout, drednout);

            return unitList;
        }
    }
}