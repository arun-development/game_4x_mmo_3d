/*using System;
using System.Linq;
using api.skagry.Areas.skagry.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace api.skagry.Areas.skagry.Cls.Mods.Skills
{
    public abstract class AbstractSkill
    {
        protected string name;

        protected byte position;

        protected double value;


        public string GetName()
        {
            return name;
        }

        public byte GetPosition()
        {
            return position;
        }

        public double GetValue()
        {
            return value;
        }

        public int? GetLevel(int userId, int characterId)
        {
            var db = new skagryDataContext();

            var tblUserCharacter = db.GetTable<user_character>();

            var query =
                from uch in tblUserCharacter
                where uch.user_id == userId
                where uch.character_id == characterId
                select uch;

            foreach (var row in query)
            {
                var levels = JsonConvert.DeserializeObject(row.skils) as JObject;

                return (int)levels[GetName()];
            }

            return null;
        }
    }
}
*/