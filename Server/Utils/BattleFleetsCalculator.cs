using System;
using System.Collections.Generic;
using System.Linq;
using Server.Core.Battle;
using Server.Core.Infrastructure.Unit;
using Server.Core.Interfaces;
using Server.Core.СompexPrimitive.Units;

namespace Server.Utils {
    //public enum BattleResult:byte
    //{
    //    AtackerWin =1,
    //    AtackerEscape =2,
    //    DefenderWin =3,
    //    DeadHeat=4
    //}

    public class BattleFleetsCalculator : BattleFleets {
        protected static readonly Random Rand = new Random();
        private bool _isLastRound;
        private Dictionary<UnitType, Dictionary<BattleStatTypes, IBattleStatsDouble>> _sourceMods;
        private Dictionary<UnitType, Dictionary<BattleStatTypes, IBattleStatsDouble>> _targetMods;

        public BattleFleetsCalculator(Dictionary<UnitType, int> sourceBefore, Dictionary<UnitType, int> targetBefore) {
            Source = new BattleFleets {
                Before = _cloneUnits(sourceBefore),
                After = new Dictionary<UnitType, int>(),
                Lose = new Dictionary<UnitType, int>()
            };
            Target = new BattleFleets {
                Before = _cloneUnits(targetBefore),
                After = new Dictionary<UnitType, int>(),
                Lose = new Dictionary<UnitType, int>()
            };
        }


        public void SetUnitMods(Dictionary<UnitType, Dictionary<BattleStatTypes, IBattleStatsDouble>> sourceMods,
            Dictionary<UnitType, Dictionary<BattleStatTypes, IBattleStatsDouble>> targetMods) {
            if (_sourceMods != null || _targetMods != null) {
                return;
            }
            _sourceMods = sourceMods;
            _targetMods = targetMods;
        }


        public List<Round> Battle(int defendorTurelsCount) {
            if (_sourceMods == null || _targetMods == null) {
                throw new NotImplementedException("SourceMods == null || TargetMods == null");
            }

            _isLastRound = false;
            var rounds = new List<Round>();
            var initiativeHistory = new List<bool>();

            var startSourceUnitCounts = _cloneUnits(Source.Before);
            var startTargetUnitCounts = _cloneUnits(Target.Before);

            //tmpMods needInject from outer

            var nextRoundUnitsAtaker = Source.Before; // init
            var nextRoundUnitsDefender = Target.Before; // init

            var currentRoundCount = 0;
            while (!_isLastRound) {
                var round = _calcCurrentRound(nextRoundUnitsAtaker, nextRoundUnitsDefender, ++currentRoundCount,
                    initiativeHistory);
                rounds.Add(round);
                initiativeHistory.Add(round.InitiativeIsAtacker);
                if (_isLastRound) {
                    break;
                }
                nextRoundUnitsAtaker = _cloneUnits(round.After.Ataker);
                nextRoundUnitsDefender = _cloneUnits(round.After.Defender);
            }
            //========================
            var lastRound = rounds.Last();
            Source.After = _cloneUnits(lastRound.After.Ataker);
            Target.After = _cloneUnits(lastRound.After.Defender);

            Source.Lose = _calcResulLeftMinusRight(startSourceUnitCounts, Source.After);
            Target.Lose = _calcResulLeftMinusRight(startTargetUnitCounts, Target.After);



            //========================

            return rounds;
        }

        private Round _calcCurrentRound(Dictionary<UnitType, int> atackerSide, Dictionary<UnitType, int> defenderSide,
            int roundNumber, IReadOnlyList<bool> initiativeHistory) {
            var before = new BattleSides {
                Ataker = _rebuildUnitsInCollection(atackerSide),
                Defender = _rebuildUnitsInCollection(defenderSide)
            };
            var firstPartAtaker = !initiativeHistory.Any()
                ? Rand.NextDouble() <= 0.5
                : !initiativeHistory[initiativeHistory.Count - 1];

            Dictionary<UnitType, int> sourceSide;
            Dictionary<UnitType, int> targetSide;
            Dictionary<UnitType, Dictionary<BattleStatTypes, IBattleStatsDouble>> sourceMods;
            Dictionary<UnitType, Dictionary<BattleStatTypes, IBattleStatsDouble>> targetMods;

            if (firstPartAtaker) {
                sourceSide = _cloneUnits(before.Ataker);
                targetSide = _cloneUnits(before.Defender);
                sourceMods = _sourceMods;
                targetMods = _targetMods;
            }
            else {
                sourceSide = _cloneUnits(before.Defender);
                targetSide = _cloneUnits(before.Ataker);
                sourceMods = _targetMods;
                targetMods = _sourceMods;
            }
            if (sourceSide.Count <= 0 || targetSide.Count <= 0) {
                return _finalizeRound(roundNumber, before, firstPartAtaker, sourceSide, targetSide);
            }
            else {
                var targetAfterUnits = _calcTargetAfterUnits(sourceSide, targetSide, sourceMods, targetMods);
                var sourceAfterUnits = _calcTargetAfterUnits(targetAfterUnits, sourceSide, targetMods, sourceMods);

                return _finalizeRound(roundNumber, before, firstPartAtaker, sourceAfterUnits, targetAfterUnits);
            }
        }


        private static Dictionary<UnitType, int> _calcTargetAfterUnits(
            Dictionary<UnitType, int> atackerUnits,
            IReadOnlyDictionary<UnitType, int> defendorUnits,
            Dictionary<UnitType, Dictionary<BattleStatTypes, IBattleStatsDouble>> atakerMods,
            Dictionary<UnitType, Dictionary<BattleStatTypes, IBattleStatsDouble>> defendorMods) {
            if (!atackerUnits.Any()) {
                return defendorUnits.ToDictionary(i => i.Key, i => i.Value);
            }

            if (!defendorUnits.Any()) {
                return new Dictionary<UnitType, int>();
            }

            //tmp mods - need inject from outer data

            var atackUnits = atackerUnits.Where(i => i.Value > 0)
                .Select(i => new BattleUnit(i.Key, i.Value, atakerMods))
                .ToList();

            var defenceUnits = defendorUnits.Where(i => i.Value > 0)
                .ToDictionary(i => i.Key, i => new BattleUnit(i.Key, i.Value, defendorMods));

            foreach (var unit in atackUnits) {
                unit.Atack(defenceUnits);
            }

            return defenceUnits.ToDictionary(i => i.Key, i => i.Value.GetActiveCount());
        }


        private Round _finalizeRound(int roundCount, BattleSides before, bool firstPartAtaker,
            Dictionary<UnitType, int> sourceAfterUnits, Dictionary<UnitType, int> targetAfterUnits) {
            BattleSides after;
            if (firstPartAtaker) {
                after = new BattleSides {
                    Ataker = sourceAfterUnits,
                    Defender = targetAfterUnits
                };
            }
            else {
                after = new BattleSides {
                    Ataker = targetAfterUnits,
                    Defender = sourceAfterUnits
                };
            }
            var losts = new BattleSides {
                Ataker = _leftMinusRight(before.Ataker, after.Ataker),
                Defender = _leftMinusRight(before.Defender, after.Defender)
            };

            var atackerEmptyResult = _checkIsEmptySide(after.Ataker);
            var defenderEmptyResult = _checkIsEmptySide(after.Defender);

            if (atackerEmptyResult || defenderEmptyResult) {
                _isLastRound = true;
            }
            var battleResult = BattleResult.InProgress;
            if (_isLastRound) {
                if (!atackerEmptyResult && defenderEmptyResult) {
                    battleResult = BattleResult.AtackerWin;
                }
                else if (atackerEmptyResult && !defenderEmptyResult) {
                    battleResult = BattleResult.DefenderWin;
                }
            }

            return new Round {
                Before = before,
                Lost = losts,
                After = after,
                InitiativeIsAtacker = firstPartAtaker,
                RoundCount = roundCount,
                BattleResult = battleResult
            };
        }


        private static Dictionary<UnitType, int> _leftMinusRight(IReadOnlyDictionary<UnitType, int> left,
            IReadOnlyDictionary<UnitType, int> right) {
            var result = left.ToDictionary(i => i.Key, i => {
                var val = i.Value;
                if (!right.ContainsKey(i.Key)) {
                    if (i.Value < 0) {
                        val = 0;
                    }
                    return val;
                }
                val = i.Value - right[i.Key];
                if (val < 0) {
                    val = 0;
                }
                return val;
            });

            return result;
        }

        private static Dictionary<UnitType, int> _calcResulLeftMinusRight(Dictionary<UnitType, int> initBeforeLeft,
            IReadOnlyDictionary<UnitType, int> lastRoundRight) {
            var resultLoses = UnitList.ProtoUnits.ToDictionary(i => i.Key, i => i.Value);
            var keys = initBeforeLeft.Keys.ToList();

            foreach (var key in keys) {
                var beforeCount = initBeforeLeft.ContainsKey(key) ? initBeforeLeft[key] : 0;
                var afterCount = lastRoundRight.ContainsKey(key) ? lastRoundRight[key] : 0;
                var lose = beforeCount - afterCount;
                resultLoses[key] = lose;
            }

            return resultLoses;
        }

        private static bool _checkIsEmptySide(Dictionary<UnitType, int> units) {
            return units.ToList().TrueForAll(i => i.Value == 0);
        }

        private static Dictionary<UnitType, int> _rebuildUnitsInCollection(Dictionary<UnitType, int> unitList) {
            var keys = unitList.Keys.ToList();
            return keys.Where(key => unitList[key] > 0).ToDictionary(key => key, key => unitList[key]);
        }


        private static Dictionary<UnitType, int> _cloneUnits(Dictionary<UnitType, int> units) {
            return units.ToDictionary(i => i.Key, i => i.Value);
        }
    }

    public class FleetStats {
        public int Atack;
        public int Hp;

        public static FleetStats SetPowerFleet(Dictionary<UnitType, int> fleet) {
            var f = new FleetStats();
            var atack = 0;
            var hp = 0;
            var keys = fleet.Keys.ToList();

            foreach (var unitType in keys) {
                //if (!Enum.TryParse(keys[i], out unitType)) continue;
                var stat = UnitHelper.GetPowerStack(unitType, fleet[unitType]);

                atack += stat.Attack * fleet[unitType];
                hp += stat.Hp * fleet[unitType];
            }

            f.Atack = atack;
            f.Hp = hp;

            return f;
        }
    }
}