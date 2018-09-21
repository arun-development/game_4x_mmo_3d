using System;
using System.Collections.Generic;
using System.Linq;
using Server.Core.Interfaces;
using Server.Core.СompexPrimitive.Units;
using Server.Extensions;

namespace Server.Core.Infrastructure.Unit
{
    public abstract class Units : INativeName
    {
        protected const int UnitCountInArray = 5;
        protected static readonly Random Rand = new Random();
        public int Count;
        public string TranslateName;
        public string NativeName { get; set; }
    }

    public class UnitList : Units
    {
        private static IReadOnlyList<UnitType> _unitsTypesList;

        private static Dictionary<UnitType, int> _protoUnits;

        public static IReadOnlyList<UnitType> UnitsTypesList =>
            _unitsTypesList ?? (_unitsTypesList = new List<UnitType> {
                UnitType.Drone,
                UnitType.Frigate,
                UnitType.Battlecruiser,
                UnitType.Battleship,
                UnitType.Drednout
            });

        public static IReadOnlyDictionary<UnitType, int> ProtoUnits
        {
            get
            {
                if (_protoUnits != null)
                {
                    return _protoUnits;
                }
                _protoUnits = UnitsTypesList.ToDictionary(i => i, i => 0);
                return _protoUnits;
            }
        }

        public static Dictionary<UnitType, int> InitUnitsInOwn(bool isPlanet = false)
        {

            return isPlanet ? _createPlanetUnitList() : _createMotherUnitList(); 
        }
        private static Dictionary<UnitType, int> _createPlanetUnitList()
        {
            var dic = new Dictionary<UnitType, int> {
                {UnitType.Drone, Rand.Next(1, 50)},
                {UnitType.Frigate, Rand.Next(0, 30)},
                {UnitType.Battlecruiser, Rand.Next(0, 10)},
                {UnitType.Battleship, 0},
                {UnitType.Drednout,0},
            };
            var hight = Rand.NextDouble() > 0.9;
            if (hight)
            {
                dic[UnitType.Battleship] = Rand.Next(0, 10);
                hight = Rand.NextDouble() > 0.9;
                if (hight)
                {
                    dic[UnitType.Drednout] = Rand.Next(0, 5);
                }

            }
            return dic;
        }
        private static Dictionary<UnitType, int> _createMotherUnitList()
        {
            var dic = new Dictionary<UnitType, int> {
                {UnitType.Drone,150},
                {UnitType.Frigate, 50},
                {UnitType.Battlecruiser, 20},
                {UnitType.Battleship, 0},
                {UnitType.Drednout,0},
            };
            return dic;
        }

        public static Dictionary<UnitType, int> PrepareHangarUnits(Dictionary<UnitType, int> inputData)
        {
            var protoUnits = ProtoUnits.ToDictionary(i => i.Key, i => i.Value);
            foreach (var unit in inputData)
            {
                if (unit.Value > 0)
                {
                    protoUnits[unit.Key] = unit.Value;
                }
            }
            return protoUnits;
        }

        public static Dictionary<UnitType, HangarUnitsOut> ConvertToHangar(string bdUnits)
        {
            return ConvertToHangar(bdUnits.ToSpecificModel<Dictionary<UnitType, int>>());
        }

        public static Dictionary<UnitType, HangarUnitsOut> ConvertToHangar(Dictionary<UnitType, int> units)
        {
            var hangar = HangarUnitsOut.EmptyHangar();
            var keys = units.Keys.ToList();
            foreach (var key in keys)
            {
                var conunt = units[key];
                hangar[key].Count = conunt;
            }
            return hangar;
        }


        public static Dictionary<UnitType, int> FixUnits(Dictionary<UnitType, int> sourceUnit, string dbUnits)
        {
            return FixUnits(sourceUnit, dbUnits.ToSpecificModel<Dictionary<UnitType, int>>());
        }

        public static Dictionary<UnitType, int> FixUnits(Dictionary<UnitType, int> sourceUnit, Dictionary<UnitType, int> dbUnits)
        {
            var protoUnits = ProtoUnits.ToDictionary(i => i.Key, i => i.Value);
            var keys = protoUnits.Keys.ToList();
            foreach (var key in keys)
            {
                if (sourceUnit[key] <= dbUnits[key])
                {
                    protoUnits[key] = sourceUnit[key];
                }
                else
                {
                    protoUnits[key] = dbUnits[key];
                }
            }

            return protoUnits;
        }

        public static Dictionary<UnitType, int> CalculateNewUnits(string source, string target, bool operation)
        {
            return CalculateNewUnits(source.ToSpecificModel<Dictionary<UnitType, int>>(), target.ToSpecificModel<Dictionary<UnitType, int>>(), operation);
        }

        public static Dictionary<UnitType, int> CalculateNewUnits(Dictionary<UnitType, int> source, Dictionary<UnitType, int> second, bool operation)
        {
            var result = ProtoUnits.ToDictionary(i => i.Key, i => i.Value);
            var keys = result.Keys.ToList();
            foreach (var key in keys)
            {
                if (!source.ContainsKey(key))
                {
                    source.Add(key, 0);
                }
                if (!second.ContainsKey(key))
                {
                    second.Add(key, 0);
                }

                result[key] = source[key] + (second[key] * (operation ? 1 : -1));
                if (result[key] < 1)
                {
                    result[key] = 0;
                }
            }
            return result;
        }
    }
}