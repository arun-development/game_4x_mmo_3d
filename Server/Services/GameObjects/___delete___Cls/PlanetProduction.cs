//using System;
//using System.Collections;
//using System.Collections.Generic;
//using System.ComponentModel.DataAnnotations;
//using System.Linq;
//using System.Web;
//using api.skagry.Areas.skagry.Models;
//
//namespace api.skagry.Areas.skagry.Cls
//{
//    public class PlanetProduction
//    {
//        const int TYPE_STRUCTURE = 1;
//
//        const int TYPE_TECH = 2;
//
//        const int TYPE_UNIT = 3;
//
//        const double BUILD_LEVEL_UP = 2;
//
//        protected int PlanetId { private get; set; }
//
//        protected int EPrice { private get; set; }
//        protected int IrPrice { private get; set; }
//        protected int DmPrice { private get; set; }
//        protected int AmPrice { private get; set; }
//        protected int TimePrice { private get; set; }
//        protected int SgPrice { private get; set; }
//
//        protected int Level { private get; set; }
//
//        public string GetName()
//        {
//            return "";
//        }
//
//        public void Production(int planetId, int type)
//        {
//            var db = new skagryDataContext();
//
//            var tblPlanetStructure = db.GetTable<planet_structure>();
//
//            var tblUserCharacter = db.GetTable<user_character>();
//            var tblPlanetCharacter = db.GetTable<planet_character>();
//
//            var price =
//                from ps in tblPlanetStructure
//
//                where ps.planet_id == planetId
////                where ps.structure_name == GetName()
//                select new
//                {
//                    ps,
//                    pr
//                };
//
//            foreach (var row in price)
//            {
//                if (row.pr.e != null) EPrice = row.pr.e.Value;
//                if (row.pr.ir != null) IrPrice = row.pr.ir.Value;
//                if (row.pr.dm != null) DmPrice = row.pr.dm.Value;
//                if (row.pr.am != null) AmPrice = row.pr.am.Value;
//                if (row.pr.time != null) TimePrice = row.pr.time.Value;
//                if (row.pr.sg != null) SgPrice = row.pr.sg.Value;
//
//                Level = row.ps.level.Value;
//                PlanetId = row.ps.planet_id;
//            }
//
//
//            
//        }
//    }
//}
