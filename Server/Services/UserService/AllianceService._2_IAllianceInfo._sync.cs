using System;
using System.Data;
using Server.Core.Images;
using Server.Core.Interfaces.UserServices;
using Server.DataLayer;
using Server.ServicesConnected.AzureStorageServices.ImageService;

namespace Server.Services.UserService
{
    public partial class AllianceService
    {
        public UserImageModel ImageServiceLoadAndUpdate(IDbConnection connection, string newBase64SourceImage, int sourceId, IChannelService channelService, string ext = null)
        {
            var ai = GetAllianceById(connection,sourceId, false);
            if (ai == null) throw new NullReferenceException(nameof(GetAllianceById));
            var newUrls = Label.CreateFromB64(newBase64SourceImage, sourceId, ext);
            ai.Images = newUrls;
            var newAi = _updateAllianceInfo(connection,ai);
            var ms = (ChannelService) channelService;
            ms.UpdateAllianceChannelIcon(connection,ai);
            return newAi.Images;
        }

        public AllianceDataModel UpdateDescription(IDbConnection connection, int allianceId, string newDescription)
        {
            var ai = GetAllianceById(connection,allianceId, false);
            ai.Description = newDescription;
            return _updateAllianceInfo(connection,ai);
        }

        public AllianceDataModel UpdateTax(IDbConnection connection, int allianceId, byte newTax)
        {
            var ai = GetAllianceById(connection,allianceId, false);
            ai.Tax = newTax;
            return _updateAllianceInfo(connection,ai);
        }
    }
}