/*using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using api.skagry.Areas.skagry.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace api.skagry.Areas.skagry.Cls.Mods.Tech
{
    public class TechHelper
    {
        public static string GetSkillClass(string key)
        {
            var map = new Dictionary<string, string>();

            map.Add("t1", "api.skagry.Areas.skagry.Cls.Mods.Tech.AttackArmy");
            map.Add("t2", "api.skagry.Areas.skagry.Cls.Mods.Tech.HpArmy");
            map.Add("t3", "api.skagry.Areas.skagry.Cls.Mods.Tech.MultyTask");
            map.Add("t4", "api.skagry.Areas.skagry.Cls.Mods.Tech.Spy");
            map.Add("t5", "api.skagry.Areas.skagry.Cls.Mods.Tech.WarpDrive");
            map.Add("t6", "api.skagry.Areas.skagry.Cls.Mods.Tech.HangarMazer");
            map.Add("t7", "api.skagry.Areas.skagry.Cls.Mods.Tech.AttackFleet");
            map.Add("t8", "api.skagry.Areas.skagry.Cls.Mods.Tech.HpFleet");
            map.Add("t9", "api.skagry.Areas.skagry.Cls.Mods.Tech.DriveCllibration");
            map.Add("t10", "api.skagry.Areas.skagry.Cls.Mods.Tech.HyperDrive");

            if (map.ContainsKey(key))
            {
                return map[key];
            }

            return null;
        }

        public static JObject GetAllTech(int userId)
        {
            var db = new skagryDataContext();

            var tblUserTech = db.GetTable<user_tech>();

            var query =
                from ut in tblUserTech
                where ut.user_id == userId
                select ut;

            foreach (var row in query)
            {
                return JsonConvert.DeserializeObject(row.techs) as JObject;
            }

            return null;
        }
    }
}
*/

