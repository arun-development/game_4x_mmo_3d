/*using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.skagry.Areas.skagry.Cls.Structure
{
    public class StructureHelper
    {
        public static string GetStructureClass(string key)
        {
            var map = new Dictionary<string, string>();

            map.Add("ps1", "api.skagry.Areas.skagry.Cls.Structure.Economyc.IndustrialComplex");
            map.Add("ps2", "api.skagry.Areas.skagry.Cls.Structure.Economyc.Storage");
            map.Add("ps3", "api.skagry.Areas.skagry.Cls.Structure.Economyc.EnergyConvertr");
            map.Add("ps4", "api.skagry.Areas.skagry.Cls.Structure.Defence.CommandCentre");
            map.Add("ps5", "api.skagry.Areas.skagry.Cls.Structure.Defence.ExsoPulsar");
            map.Add("ps6", "api.skagry.Areas.skagry.Cls.Structure.Defence.ShieldUpgrade");
            map.Add("ps7", "api.skagry.Areas.skagry.Cls.Structure.Defence.Turel");
            map.Add("ps8", "api.skagry.Areas.skagry.Cls.Structure.Defence.PvoTurel");
            map.Add("ps9", "api.skagry.Areas.skagry.Cls.Structure.UnitProduction.Barracks");
            map.Add("ps10", "api.skagry.Areas.skagry.Cls.Structure.UnitProduction.Factory");
            map.Add("ps11", "api.skagry.Areas.skagry.Cls.Structure.UnitProduction.Shipyard");
            map.Add("ps12", "api.skagry.Areas.skagry.Cls.Structure.Laboratory");



            if (map.ContainsKey(key))
            {
                return map[key];
            }

            return null;
        }
    }
}
*/