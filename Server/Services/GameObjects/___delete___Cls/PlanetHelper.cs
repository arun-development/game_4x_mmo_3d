/*
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using api.skagry.Areas.skagry.Cls.Mods;
using api.skagry.Areas.skagry.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace api.skagry.Areas.skagry.Cls
{
    public class PlanetHelper
    {
        public static Character GetCharacter(int planetId)
        {
            var db = new skagryDataContext();

            var tblUserCharacter = db.GetTable<user_character>();
            var tblPlanetCharacter = db.GetTable<planet_character>();

            var query =
                from pch in tblPlanetCharacter
                join uch in tblUserCharacter on pch.user_character_id equals uch.id
                where pch.planet_id == planetId
                select uch;

            foreach (var row in query)
            {
                var userId = (int)row.user_id;
                var characterId = (int)row.character_id;

                return new Character(userId, characterId);
            }

            return null;
        }

        public static Character GetMainCharacter(int userId)
        {
            var db = new skagryDataContext();

            var tblUserCharacter = db.GetTable<user_character>();

            var query =
                from uch in tblUserCharacter
                where uch.user_id == userId
                where uch.job_id == 1 // id = 1 - comandor
                select uch;

            foreach (var row in query)
            {
                var characterId = (int)row.character_id;

                return new Character(userId, characterId);
            }

            return null;
        }

        public static JObject GetStructures(int planetId)
        {
            var db = new skagryDataContext();


            //            var tblUser = db.GetTable<user>();
            var tblsolSist = db.GetTable<star_sistem>();
            var tblPlanet = db.GetTable<planet>();
            var tblplanetStructure = db.GetTable<planet_structure>();



            var query =
                from ps in tblplanetStructure
                join p in tblPlanet on ps.planet_id equals p.id
                join ss in tblsolSist on p.star_system_id equals ss.id
                //                join u in tblUser on p.user_id equals u.id
                //                where u.id == 1
                where ps.planet_id == planetId
                select new
                {
                    ps,
                    p
                };

            foreach (var row in query)
            {
                return JsonConvert.DeserializeObject(row.ps.structures) as JObject;
            }

            return null;
        }

        public static JObject GetUnits(int planetId)
        {
            var db = new skagryDataContext();

            var tblPlanetUnit = db.GetTable<planet_unit>();

            var query =
                from pu in tblPlanetUnit
                where pu.planet_id == planetId
                select pu;

            foreach (var row in query)
            {
                return JsonConvert.DeserializeObject(row.units) as JObject;
            }

            return null;
        }


        public static void UpdateStructureLevel(int planetId, string structureName, int level)
        {
            var db = new skagryDataContext();

            var tblPlanetStructure = db.GetTable<planet_structure>();

            var query =
                from ps in tblPlanetStructure
                where ps.planet_id == planetId
                select ps;

            foreach (var row in query)
            {
                row.structures = JsonUpdater.UpdateProperty(row.structures, structureName, level);
                row.date = DateTime.UtcNow;

                db.SubmitChanges();
            }
        }
    }
}

*/