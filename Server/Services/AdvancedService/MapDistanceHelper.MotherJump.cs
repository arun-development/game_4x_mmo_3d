using System.Data;
using Server.Utils.Map;

namespace Server.Services.AdvancedService
{
    public partial class MapDistanceHelper
    {
        public static MapDistance CalculateJumpTime(IDbConnection connection, int sourceSystemId, int targetSystemId, IMapAdressService mService, bool hasPremium)
        {
            //var md = new MapDistance(mService.GetSystemAdress(sourceSystemId), mService.GetSystemAdress(targetSystemId),false);
            //md.CalcAndSetSecond(GetMod(hasPremium));
            //return md;
            return _getResult(mService.GetSystemAdress(connection, sourceSystemId), mService.GetSystemAdress(connection, targetSystemId), false,
                hasPremium);
        }
    }
}