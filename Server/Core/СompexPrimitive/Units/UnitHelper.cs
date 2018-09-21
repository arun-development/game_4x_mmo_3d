using System;
using System.Collections.Generic;
using Server.Modules.Localize;
using Server.Modules.Localize.Game.Units;

//using Translate.Game.Units;

namespace Server.Core.СompexPrimitive.Units
{
    public class UnitHelper
    {
        private static readonly UnitModel Drone;
        private static readonly UnitModel Frigate;
        private static readonly UnitModel Battlecruiser;
        private static readonly UnitModel Battleship;
        private static readonly UnitModel Drednout;

        static UnitHelper()
        {
            Drone = new UnitModel
            {
                Key = Units.Drone.NativeName,
                SpriteImages = Units.Drone.Images(),

                BasePrice = Units.Drone.Price(),
                UnitStats = Units.Drone.Stats()
            };

            Frigate = new UnitModel
            {
                Key = Units.Frigate.NativeName,
                SpriteImages = Units.Frigate.Images(),

                BasePrice = Units.Frigate.Price(),
                UnitStats = Units.Frigate.Stats()
            };


            Battlecruiser = new UnitModel
            {
                Key = Units.Battlecruiser.NativeName,
                SpriteImages = Units.Battlecruiser.Images(),

                BasePrice = Units.Battlecruiser.Price(),
                UnitStats = Units.Battlecruiser.Stats()
            };
            Battleship = new UnitModel
            {
                Key = Units.Battleship.NativeName,
                SpriteImages = Units.Battleship.Images(),

                BasePrice = Units.Battleship.Price(),
                UnitStats = Units.Battleship.Stats()
            };
            Drednout = new UnitModel
            {
                Key = Units.Drednout.NativeName,
                SpriteImages = Units.Drednout.Images(),

                BasePrice = Units.Drednout.Price(),
                UnitStats = Units.Drednout.Stats()
            };
        }


        public static LangField GetTranslate(UnitType unitType)
        {
            switch (unitType)
            {
                case UnitType.Drone:

                    return new LangField { Name = Resource.DroneName, Description = Resource.DroneDescription };

                case UnitType.Frigate:

                    return new LangField { Name = Resource.FrigateName, Description = Resource.FrigateDescription };
                case UnitType.Battlecruiser:

                    return new LangField { Name = Resource.BattleCruiserName, Description = Resource.BattleCruiserDescription };
                case UnitType.Battleship:
                    return new LangField { Name = Resource.BattleShipName, Description = Resource.BattleShipDescription };
                case UnitType.Drednout:

                    return new LangField { Name = Resource.DrednoutName, Description = Resource.DrednoutDescription };
            }
            throw new Exception("Unit name error");
        }


        public static UnitModel GetBaseUnit(UnitType unitType)
        {
            switch (unitType)
            {
                case UnitType.Drone:
                    return Drone.CreateNewFromThis();
                case UnitType.Frigate:
                    return Frigate.CreateNewFromThis();
                case UnitType.Battlecruiser:
                    return Battlecruiser.CreateNewFromThis();
                case UnitType.Battleship:
                    return Battleship.CreateNewFromThis();
                case UnitType.Drednout:
                    return Drednout.CreateNewFromThis();
                default:
                    throw new ArgumentOutOfRangeException(nameof(unitType), unitType, @"Unit name is error");
            }

        }


        public static UnitStats GetPowerStack(UnitType unitType, int count)
        {
            switch (unitType)
            {
                case UnitType.Drone:
                    return _unitStats(count, Drone.UnitStats);

                case UnitType.Frigate:
                    return _unitStats(count, Frigate.UnitStats);

                case UnitType.Battlecruiser:
                    return _unitStats(count, Battlecruiser.UnitStats);

                case UnitType.Battleship:
                    return _unitStats(count, Battleship.UnitStats);

                case UnitType.Drednout:
                    return _unitStats(count, Drednout.UnitStats);
                default:
                    throw new ArgumentOutOfRangeException(nameof(unitType), unitType, "UnitType Not Exist");
            }
        }

        public static UnitStats GetUnitStats(UnitType unitType)
        {
            switch (unitType)
            {
                case UnitType.Drone:
                    return Drone.UnitStats.CreateNewFromThis();

                case UnitType.Frigate:
                    return Frigate.UnitStats.CreateNewFromThis();

                case UnitType.Battlecruiser:
                    return Battlecruiser.UnitStats.CreateNewFromThis();

                case UnitType.Battleship:
                    return Battleship.UnitStats.CreateNewFromThis();

                case UnitType.Drednout:
                    return Drednout.UnitStats.CreateNewFromThis();

                default:
                    throw new ArgumentOutOfRangeException(nameof(unitType), unitType, "UnitType Not Exist");
            }
        }

        public static Dictionary<UnitType, UnitStats> CreateBaseUnitStats()
        {
            return new Dictionary<UnitType, UnitStats>
            {
                {  UnitType.Drone,Drone.UnitStats.CreateNewFromThis()},
                {  UnitType.Frigate,Frigate.UnitStats.CreateNewFromThis()},
                {  UnitType.Battlecruiser,Battlecruiser.UnitStats.CreateNewFromThis()},
                {  UnitType.Battleship,Battleship.UnitStats.CreateNewFromThis()},
                {  UnitType.Drednout,Drednout.UnitStats.CreateNewFromThis()}
            };
        }

        private static UnitStats _unitStats(int count, UnitStats us)
        {
            var unitStats = us.CreateNew(us);
            unitStats.Attack *= count;
            unitStats.Hp *= count;
            return unitStats;
        }
    }
}