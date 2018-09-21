/*
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using api.skagry.Areas.skagry.Models;

namespace api.skagry.Areas.skagry.Cls
{
    public class Creator
    {
        private const string USERS_DIR = "c:\\asp_skagry\\files\\users";

        public static void Users()
        {
            var db = new skagryDataContext();

            var tblUser = db.GetTable<user>();

            var query =
                from user in tblUser
                select user;

            foreach (var row in query)
            {
                var userId = row.id;
                var userDir = USERS_DIR + "\\" + userId;

                if (!Directory.Exists(userDir))
                {
                    Directory.CreateDirectory(userDir);
                }

                if (!Directory.Exists(userDir + "\\sistem"))
                {
                    Directory.CreateDirectory(userDir + "\\sistem");
                }

                if (!Directory.Exists(userDir + "\\user"))
                {
                    Directory.CreateDirectory(userDir + "\\user");

                    // delete after
                    File.WriteAllText(userDir + "\\user\\user_data.json", "{\"SolarSistems\":[{\"SsCoordX\":-128,\"SsCoordY\":128,\"SolarSistemBonus\":0.5,\"Planet\":{\"PlanetCoord\":0,\"PlanetCharacterId\":1,\"Structure\":{\"IndustrialComplex\":{\"Level\":1,\"Atributes\":{\"ERate\":1,\"IrRate\":1,\"DmRate\":1,\"AmRate\":1},\"Cost\":{\"EPrice\":1,\"IrPrice\":546,\"DmPrice\":78,\"AmPrice\":12,\"TimePrice\":600,\"SgPrice\":12},\"LevelMod\":2,\"EBaseValue\":1000},\"Strorage\":{\"Level\":1,\"Atributes\":{\"ECurrent\":1,\"IrCurrent\":1,\"DmCurrent\":1,\"AmCurrent\":1},\"Cost\":{\"EPrice\":1,\"IrPrice\":546,\"DmPrice\":78,\"AmPrice\":12,\"TimePrice\":600,\"SgPrice\":12},\"LevelMod\":2,\"BaseStorageValue\":1000}},\"Unit\":{\"a1\":1,\"a2\":1,\"f1\":1,\"f2\":1}},\"PlanetHelp\":[{\"Number\":1,\"Bonus\":0.95},{\"Number\":2,\"Bonus\":1.2},{\"Number\":3,\"Bonus\":0.05}],\"Mazer\":{}}],\"Mod\":{\"Tech\":{},\"Character\":{\"MainCharacterId\":1,\"Characters\":[{\"CharacterId\":1,\"JobId\":1,\"CurrentPoint\":1,\"CurrentCharLvl\":1,\"FreeLvl\":1,\"Skills\":{\"s11\":1,\"s12\":1,\"s20\":1}},{\"CharacterId\":2,\"JobId\":1,\"CurrentPoint\":1,\"CurrentCharLvl\":1,\"FreeLvl\":1,\"Skills\":{\"s11\":1,\"s12\":1,\"s20\":1}}]}},\"Fleet\":{}}");
                }
            }
        }
    }
}
*/