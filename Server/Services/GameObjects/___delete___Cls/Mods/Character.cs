/*using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using api.skagry.Areas.skagry.Cls.Mods.Skills;
using api.skagry.Areas.skagry.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace api.skagry.Areas.skagry.Cls.Mods
{
    public class Character
    {
        private int UserId { get; set; }
        private int CharacterId { get; set; }
        private int JobId { get; set; }

        private JObject Skills { get; set; }

        public Character(int userId, int characterId)
        {
            UserId = userId;
            CharacterId = characterId;

            var db = new skagryDataContext();

            var tblUserCharacter = db.GetTable<user_character>();
            var tblCharacter = db.GetTable<character>();
            var tblJob = db.GetTable<job>();

            var query =
                from uch in tblUserCharacter
                where uch.user_id == userId
                where uch.character_id == characterId
                select uch;

            foreach (var row in query)
            {
                Skills = JsonConvert.DeserializeObject(row.skils) as JObject;
            }
        }

        /// <summary>
        /// Получает Объект скила по его имени из БД
        /// </summary>
        /// <param name="skillDictionary">Имя скила в БД, например, s1</param>
        /// <returns>Объект скила персоонажа</returns>
        public AbstractSkill GetSkill(string skillDictionary)
        {
            var skillClass = SkillHelper.GetSkillClass(skillDictionary);
            var type = Type.GetType(skillClass);

            if (type != null)
            {
                var skill = Activator.CreateInstance(type);

                return (AbstractSkill)skill;
            }

            return null;
        }

        public JObject GetSkillLevels()
        {
            return Skills;
        }

        /// <summary>
        /// Плоучает имя должности персоонажа
        /// </summary>
        /// <returns>string</returns>
        public string GetJob()
        {
            var db = new skagryDataContext();

            var tblJob = db.GetTable<job>();

            var query = from job in tblJob
                        where job.id == JobId
                        select job;

            foreach (var row in query)
            {
                return row.name;
            }

            return null;
        }

        /// <summary>
        /// Получает ИД планеты за которой закреплен персоонаж для получения бонусов, если возвращает Нулл  значит персоонаж находиться на мазере
        /// </summary>
        /// <returns>int|null</returns>
        public int? GetLocation()
        {
            var db = new skagryDataContext();

            var tblUserCharacter = db.GetTable<user_character>();
            var tblPlanetCharacter = db.GetTable<planet_character>();

            var query =
                from pch in tblPlanetCharacter
                join uch in tblUserCharacter on pch.user_character_id equals uch.id
                where uch.user_id == UserId
                where uch.character_id == CharacterId
                select pch;

            foreach (var row in query)
            {
                if (row.planet_id != null) return (int)row.planet_id;
            }

            return null;
        }
    }
}


*/