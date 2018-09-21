using System.Data;
using Server.Core.Map;
using Server.Core.StaticData;
using Server.Utils.Map;

namespace Server.Services.AdvancedService
{
    public partial class MapDistanceHelper
    {
        private static double GetMod(bool hasPremium)
        {
            return (hasPremium) ? GameMathStats.PremiumNavigationMod : GameMathStats.BaseNavigationMod;
        }

        public static MapDistance CalculatePlanetTransferFleet(IDbConnection connection, int sourcePlanetId, string targetPlanetName, IMapAdressService mService, bool hasPremium)
        {
            var source = mService.GetPlanetAdress(connection, sourcePlanetId);
            var target = mService.GetPlanetAdress(connection, targetPlanetName);
            return _getResult(source, target, true, hasPremium);
        }

        public static MapDistance CalculatePlanetTransferFleet(IDbConnection connection, int sourcePlanetId, int targetPlanetId, IMapAdressService mService, bool hasPremium)
        {
            var source = mService.GetPlanetAdress(connection, sourcePlanetId);
            var target = mService.GetPlanetAdress(connection, targetPlanetId);
            return _getResult(source, target, true, hasPremium);
        }

        public static MapDistance CalculateMotherTransferFleet(IDbConnection connection, int sourceSystemId, string targetPlanetName, IMapAdressService mService, bool hasPremium)
        {
            var source = mService.GetSystemAdress(connection, sourceSystemId);
            var target = mService.GetPlanetAdress(connection, targetPlanetName);
            return _getResult(source, target, true, hasPremium);
        }

        public static MapDistance CalculateMotherTransferFleet(IDbConnection connection, int sourceSystemId, int targetPlanetId, IMapAdressService mService, bool hasPremium)
        {
            var source = mService.GetSystemAdress(connection, sourceSystemId);
            var target = mService.GetPlanetAdress(connection, targetPlanetId);
            return _getResult(source, target, true, hasPremium);
        }

        private static  MapDistance _getResult(MapAdress source, MapAdress target,bool calcMotherFleet, bool hasPremium)
        {
            var md = new MapDistance(source, target, calcMotherFleet);
            md.CalcAndSetSecond(GetMod(hasPremium)*0.1);
            return md;
        }
    }
}