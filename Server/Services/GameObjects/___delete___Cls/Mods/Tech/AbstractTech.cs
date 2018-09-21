/*using System;
using System.Collections;
using System.Linq;
using api.skagry.Areas.skagry.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace api.skagry.Areas.skagry.Cls.Mods.Tech
{
    public abstract class AbstractTech
    {
        protected int AmPrice;
        protected ArrayList depends;
        protected int DmPrice;
        protected int EPrice;
        protected int IrPrice;

        protected string name;
        protected byte position;
        protected int SgPrice;
        protected int TimePrice;
        protected double value;

        //price
        public int GetEPrice()
        {
            return EPrice;
        }

        public int GetIrPrice()
        {
            return IrPrice;
        }

        public int GetDmPrice()
        {
            return DmPrice;
        }

        public int GetAmPrice()
        {
            return AmPrice;
        }

        public int GetSgPrice()
        {
            return SgPrice;
        }

        public int GetTimePrice()
        {
            return TimePrice;
        }

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

        public int? GetLevel(int userId)
        {
            var db = new skagryDataContext();

            var tblUserTech = db.GetTable<user_tech>();

            var query =
                from ut in tblUserTech
                where ut.user_id == userId
                select ut;

            foreach (var row in query)
            {
                var levels = JsonConvert.DeserializeObject(row.techs) as JObject;

                return (int)levels[GetName()];
            }

            return null;
        }


        public void UpLevel()
        {
        }
    }
}
*/