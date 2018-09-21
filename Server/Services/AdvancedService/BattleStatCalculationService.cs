using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Battle;
using Server.Core.Interfaces;
using Server.Core.Interfaces.Confederation;
using Server.Core.Tech;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Products;
using Server.Core.СompexPrimitive.Units;
using Server.DataLayer;
using Server.DataLayer.LocalStorageCaches;
using Server.Services.NpcArea;

namespace Server.Services.AdvancedService
{
    public class BattleStatCalculationService
    {
        private const int _chacheTime = UnixTime.OneMinuteInSecond;


        /// <summary>
        ///     Предварительные данные должны быть синхронизированны
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="mother"></param>
        /// <param name="allianceTech"></param>
        /// <param name="confederationService"></param>
        /// <param name="storeService"></param>
        /// <returns></returns>
        public static Dictionary<UnitType, Dictionary<BattleStatTypes, IBattleStatsDouble>> GetUnitStatsAndMods(IDbConnection connection, UserMothershipDataModel mother, AllianceTechDataModel allianceTech, IConfederationService confederationService, IStoreService storeService)
        {
            var boosersMods = GetBoosterBonuses(connection, mother.Id, storeService);
            var officerBonus = confederationService.GetOfficerBonus(connection, allianceTech.Id);
            var userTechesService = new BattleTeches(mother.TechProgress);
            var allianceTechesService = new BattleTeches(allianceTech.Teches);
            return GetUnitStatsAndMods(mother.Id, userTechesService, allianceTechesService, officerBonus, boosersMods);
        }


        public static Dictionary<UnitType, Dictionary<BattleStatTypes, IBattleStatsDouble>> GetUnitStatsAndMods(
            int userId, BattleTeches userTechs, BattleTeches allianceTeches, IBattleStatsDouble officerBonus,
            IBattleStatsDouble boosertsSummaryMods)
        {
            var key = _stringGetKey(userId);
            var existData = TmpCache.Get(key);
            if (existData != null)
                return (Dictionary<UnitType, Dictionary<BattleStatTypes, IBattleStatsDouble>>) existData;
            boosertsSummaryMods.ConvertPercentToMod();
            var dic = new Dictionary<UnitType, Dictionary<BattleStatTypes, IBattleStatsDouble>>();
            var unitsStats = UnitHelper.CreateBaseUnitStats();
            var userBaseUnitStats = userTechs.GetBaseResultStats();
            var userProfileUnitStats = userTechs.GetProfileResultStats();
            var allianceBaseUnitStats = allianceTeches.GetBaseResultStats();
            var allianceProfileUnitStats = allianceTeches.GetProfileResultStats();
            foreach (var unitStats in unitsStats)
            {
                var unitTechType = BattleTeches.UnitTypeToTechType(unitStats.Key);
                var statTypes = new Dictionary<BattleStatTypes, IBattleStatsDouble>();
                var userUnitTechStat = userProfileUnitStats[unitTechType];
                var allianceUnitTechStat = allianceProfileUnitStats[unitTechType];

                var summaryMod = new BattleStatsDouble(0, 0);
                summaryMod.Add(userBaseUnitStats, false);
                summaryMod.Add(userUnitTechStat, false);
                summaryMod.Add(allianceBaseUnitStats, false);
                summaryMod.Add(allianceUnitTechStat, false);
                summaryMod.Add(officerBonus, false);
                summaryMod.Add(boosertsSummaryMods, true);

                statTypes.Add(BattleStatTypes.UnitStat, unitStats.Value.DoubleStats);
                statTypes.Add(BattleStatTypes.UserTechMod, userBaseUnitStats);
                statTypes.Add(BattleStatTypes.UserUnitProfileTechMod, userUnitTechStat);
                statTypes.Add(BattleStatTypes.AllianceTechMod, allianceBaseUnitStats);
                statTypes.Add(BattleStatTypes.AllianceUnitProfileTechMod, allianceUnitTechStat);
                statTypes.Add(BattleStatTypes.OfficerBonus, officerBonus);
                statTypes.Add(BattleStatTypes.BooserMod, boosertsSummaryMods);
                statTypes.Add(BattleStatTypes.SummaryMods, summaryMod);
                dic.Add(unitStats.Key, statTypes);
            }

            TmpCache.AddOrUpdate(key, dic, _chacheTime);
            return dic;
        }


        private static string _stringGetKey(int userId)
        {
            return $"{nameof(BattleStatCalculationService)}_{userId}";
        }


        public static IBattleStatsDouble GetBoosterBonuses(IDbConnection connection, int userId, IStoreService storeService)
        {
            var boosters = storeService.GetActiveBosters(connection, userId);
            if (boosters == null || !boosters.Any())
                return new BattleStatsDouble(0, 0);

            var products = storeService.SelectProductItems(connection, boosters.Select(i => i.ProductStoreId));
            var props = products.Select(i => i.Property.GetBooserProperty()).ToList();
            var combineBoosters = props.Where(i => i.Attack > 0 && i.Hp > 0).ToList();
            if (combineBoosters.Any() && combineBoosters.Count == 1)
            {
                return combineBoosters[0];
            }
            if (combineBoosters.Count > 1)
            {
                var max = combineBoosters.Max(i => i.Attack);
                return combineBoosters[combineBoosters.FindIndex(i => i.Attack == max)];
            }
            var booster = new BattleStatsDouble(0, 0);

            var atkMax = props.Where(i => i.Hp < 1).Max(i => i.Attack);
            var hpMax = props.Where(i => i.Attack < 1).Max(i => i.Hp);
            if (atkMax > 0) booster.Attack = atkMax;
            if (hpMax > 0) booster.Hp = atkMax;
            return booster;
        }


        public static Dictionary<UnitType, Dictionary<BattleStatTypes, IBattleStatsDouble>> CreateSkagryMods(
            NpcModel npc)
        {
            // todo  нужно определить одинаковоые или разные  статы
            var dic = new Dictionary<UnitType, Dictionary<BattleStatTypes, IBattleStatsDouble>>();
            //todo  будут ли статы отличными. тут хорошее место для применения отличных статов от базы
            var unitsStats = UnitHelper.CreateBaseUnitStats();
            //todo  заполняем статы для нпс
            var npcTeches = new BattleTeches(npc.NpcMother.TechProgress);
            //todo  можно вести свзяь  с офицерами и элитными войсками скагри
            var officerBonus = new BattleStatsDouble(0, 0);
            // todo можно ввести связь с бустерами игрока, или ввести рандом на понижение сил скагрей
            var boosertsSummaryMods = new BattleStatsDouble(0, 0);

            var npcAllianceTeches = new BattleTeches(npc.NpcAllianceTeth.Teches);
            var userBaseUnitStats = npcTeches.GetBaseResultStats();
            var userProfileUnitStats = npcTeches.GetProfileResultStats();
            var allianceBaseUnitStats = npcAllianceTeches.GetBaseResultStats();
            var allianceProfileUnitStats = npcAllianceTeches.GetProfileResultStats();
            foreach (var unitStats in unitsStats)
            {
                var unitTechType = BattleTeches.UnitTypeToTechType(unitStats.Key);
                var statTypes = new Dictionary<BattleStatTypes, IBattleStatsDouble>();
                var userUnitTechStat = userProfileUnitStats[unitTechType];
                var allianceUnitTechStat = allianceProfileUnitStats[unitTechType];

                var summaryMod = new BattleStatsDouble(0, 0);
                summaryMod.Add(userBaseUnitStats, false);
                summaryMod.Add(userUnitTechStat, false);
                summaryMod.Add(allianceBaseUnitStats, false);
                summaryMod.Add(allianceUnitTechStat, false);
                summaryMod.Add(officerBonus, false);
                summaryMod.Add(boosertsSummaryMods, true);

                statTypes.Add(BattleStatTypes.UnitStat, unitStats.Value.DoubleStats);
                statTypes.Add(BattleStatTypes.UserTechMod, userBaseUnitStats);
                statTypes.Add(BattleStatTypes.UserUnitProfileTechMod, userUnitTechStat);
                statTypes.Add(BattleStatTypes.AllianceTechMod, allianceBaseUnitStats);
                statTypes.Add(BattleStatTypes.AllianceUnitProfileTechMod, allianceUnitTechStat);
                statTypes.Add(BattleStatTypes.OfficerBonus, officerBonus);
                statTypes.Add(BattleStatTypes.BooserMod, boosertsSummaryMods);
                statTypes.Add(BattleStatTypes.SummaryMods, summaryMod);
                dic.Add(unitStats.Key, statTypes);
            }
            return dic;
        }
    }
}