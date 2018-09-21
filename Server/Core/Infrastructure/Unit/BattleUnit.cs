using System;
using System.Collections.Generic;
using System.Linq;
using Server.Core.Battle;
using Server.Core.Interfaces;
using Server.Core.СompexPrimitive.Units;

namespace Server.Core.Infrastructure.Unit
{

    public class BattleUnit
    {
        private RandomNumbers _rand = new RandomNumbers();
        private double _attackUnit { get; set; }
        private double _hpUnit { get; set; }
        private UnitType _unitType { get; }
        private  Dictionary<UnitType, Dictionary<BattleStatTypes, IBattleStatsDouble>> _statAndMods { get; }
        private IBattleStatsDouble _summaryUnitMod { get; }
        private List<UnitType> _priorytyList { get; }
        private int _startCount { get; }
        private bool _isEmlpty { get; set; }


        private int _activeCount { get; set; }


        public double _loseCount { get; private set; }

        private double _stackAttack { get; set; }
        private double _stackHp { get; set; }


        public BattleUnit(UnitType unitType, int count, Dictionary<UnitType, Dictionary<BattleStatTypes, IBattleStatsDouble>> statAndMods)
        {
            _unitType = unitType;
            _startCount = count;
            _activeCount = count;
            _statAndMods = statAndMods;
            var baseStats = statAndMods[unitType][BattleStatTypes.UnitStat];
            _summaryUnitMod = _getSummaryUnitMod(_unitType,_statAndMods);

            _attackUnit = baseStats.Attack * _summaryUnitMod.Attack;
            _hpUnit = baseStats.Hp * _summaryUnitMod.Hp;
            _stackAttack = count * _attackUnit;
            _stackHp = count * _hpUnit;

            _priorytyList = _getPriorityList(_unitType);

        }



        public bool IsEmpty()
        {
            return _activeCount <= 0;
        }

        public int GetLoseCount()
        {
            return (int)Math.Floor(_loseCount);
        }

        public int GetStartCount()
        {
            return _startCount;
        }
        public int GetActiveCount()
        {
            return _activeCount;
        }


        private void _defence(double damage)
        {
            if (damage <= 0) return;
            if (_isEmlpty) return;
            _loseCount += damage / _hpUnit;

            if (_loseCount >= _startCount)
            {
                _loseCount = _startCount;
                _stackAttack = 0.0;
                _stackHp = 0.0;
                _activeCount = 0;
                _isEmlpty = true;

            }
            else
            {
                _stackHp -= damage;
                var lose = GetLoseCount();
                _activeCount = _startCount - lose;
                _stackAttack = _activeCount * _attackUnit;
            }



        }
        public void Atack(Dictionary<UnitType, BattleUnit> otherUnits)
        {
            if (_isEmlpty) return;
            if (!otherUnits.Any()) return;
            if (_unitType == UnitType.Drednout)
            {
                _splashAtack(otherUnits);
                return;
            }

            var defaultUnitType = default(UnitType);
            var targetUnitType = defaultUnitType;
            var targetUnitTypes = otherUnits.Where(i => !otherUnits[i.Key].IsEmpty()).Select(i => i.Key).ToList();

            foreach (var pUnit in _priorytyList)
            {
                var tUnit = targetUnitTypes.SingleOrDefault(i => i == pUnit);
                if (tUnit == defaultUnitType) continue;
                targetUnitType = tUnit;
                break;
            }
            if (targetUnitType == default(UnitType)) targetUnitType = _getRandomTargetUnit(otherUnits);
            if (targetUnitType == default(UnitType)) return;


            var rand = 1+ _rand.NextDouble(-0.1,0.1);
            var damage = _getAtkToTarget(targetUnitType) * rand;
            otherUnits[targetUnitType]._defence(damage);
        }

        private void _splashAtack(Dictionary<UnitType, BattleUnit> otherUnits)
        {
            foreach (var tUnit in otherUnits)
            {
                if (tUnit.Value.IsEmpty()) continue;
                var damage = _getAtkToTarget(tUnit.Key);
                tUnit.Value._defence(damage);
            }
        }

        private UnitType _getRandomTargetUnit(Dictionary<UnitType, BattleUnit> otherUnits)
        {
            var units = otherUnits.Where(i => !i.Value.IsEmpty()).Select(i => i.Key).ToList();
            if (!units.Any())
            {
                return default(UnitType);
            }
            var randomizedUnitIdx = _rand.Next(0, units.Count);
            var targetUnitKey = units[randomizedUnitIdx];
            return targetUnitKey;

        }



        private static List<UnitType> _getPriorityList(UnitType unitType)
        {
            switch (unitType)
            {
                case UnitType.Drone:
                    return _getPriorityListDrone();
                case UnitType.Frigate:
                    return _getPriorityListFrigate();
                case UnitType.Battlecruiser:
                    return _getPriorityListBattlecruiser();
                case UnitType.Battleship:
                    return _getPriorityListBattleship();
                case UnitType.Drednout:
                    return null;
 
                default:
                    throw new ArgumentOutOfRangeException(nameof(unitType), unitType, null);
            }
        }

        private static List<UnitType> _getPriorityListDrone()
        {
            return new List<UnitType> { UnitType.Battlecruiser, UnitType.Drone };
        }

        private static List<UnitType> _getPriorityListFrigate()
        {
            return new List<UnitType> { UnitType.Drone, UnitType.Battlecruiser, UnitType.Frigate };
        }

        private static List<UnitType> _getPriorityListBattlecruiser()
        {
            return new List<UnitType> { UnitType.Frigate, UnitType.Battlecruiser, UnitType.Drone };
        }

        private static List<UnitType> _getPriorityListBattleship()
        {
            return new List<UnitType> { UnitType.Battlecruiser, UnitType.Battleship, UnitType.Drednout };
        }

        private double _getAtkToTarget(UnitType targetUnitType)
        {
            var profileMod = 1.5;
            switch (_unitType)
            {
                case UnitType.Drednout:
                    switch (targetUnitType)
                    {
                        case UnitType.Drone:
                            return _stackAttack * 0.1;
                        case UnitType.Frigate:
                            return _stackAttack * 0.3;
                        case UnitType.Battlecruiser:
                            return _stackAttack * 0.5;
                        case UnitType.Battleship:
                            return _stackAttack * 0.75;
                        case UnitType.Drednout:
                            return _stackAttack;
                        default:
                            throw new ArgumentOutOfRangeException(nameof(targetUnitType), targetUnitType, null);
                    }

                case UnitType.Drone:
                    if (targetUnitType == UnitType.Battlecruiser)
                    {
                        return _stackAttack * profileMod;
                    }
                    return _stackAttack;
                case UnitType.Frigate:
                    if (targetUnitType == UnitType.Drone)
                    {
                        return _stackAttack * profileMod;
                    }
                    return _stackAttack;


                case UnitType.Battlecruiser:
                    if (targetUnitType == UnitType.Frigate)
                    {
                        return _stackAttack * profileMod;
                    }
                    return _stackAttack;

                case UnitType.Battleship:
                    if (targetUnitType == UnitType.Battlecruiser)
                    {
                        return _stackAttack * profileMod;
                    }
                    return _stackAttack;
                default:
                    throw new ArgumentOutOfRangeException(nameof(_unitType), _unitType, null);
            }
        }


        private static IBattleStatsDouble _getSummaryUnitMod(UnitType unitType,IReadOnlyDictionary<UnitType, Dictionary<BattleStatTypes, IBattleStatsDouble>> data)
        {
            var result  = new BattleStatsDouble(1, 1);
            if (!data.ContainsKey(unitType) || data[unitType].ContainsKey(BattleStatTypes.SummaryMods)) return result;
            var unit = data[unitType][BattleStatTypes.SummaryMods];
            result.Attack += unit.Attack;
            result.Hp += unit.Hp;
            return result;
        }
    }
}