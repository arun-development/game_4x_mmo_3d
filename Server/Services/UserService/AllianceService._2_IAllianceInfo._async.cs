using System.Data;
using System.Threading.Tasks;
using Server.Core.Images;
using Server.Core.Interfaces.UserServices;
using Server.DataLayer;

namespace Server.Services.UserService
{
    public partial class AllianceService
    {
        public async Task<UserImageModel> ImageServiceLoadAndUpdateAsync(IDbConnection connection, string newBase64SourceImage, int sourceId, IChannelService channelService, string ext = null)
        {
            return await Task.Factory.StartNew(() =>ImageServiceLoadAndUpdate(connection, newBase64SourceImage, sourceId, channelService, ext));
        }

 
    }
}