using System;
using System.Data;
using System.Threading.Tasks;
using Server.Core.Images;
using Server.Core.Interfaces.UserServices;
using Server.ServicesConnected.AzureStorageServices.ImageService;

namespace Server.Services.UserService
{
    public partial class GameUserService
    {
        public async Task<UserImageModel> ImageServiceLoadAndUpdateAsync(IDbConnection connection, string newBase64SourceImage, int sourceId, IChannelService channelService, string ext = null)
        {
            return await Task.Factory.StartNew(() => ImageServiceLoadAndUpdate(connection,newBase64SourceImage, sourceId, channelService, ext));
        }

        public UserImageModel ImageServiceLoadAndUpdate(IDbConnection connection, string newBase64SourceImage, int sourceId,
            IChannelService channelService, string ext = null)
        {
            var userDataModel = GetPersonalInfo(connection, sourceId, true);
            if (userDataModel == null) throw new NullReferenceException(nameof(GetPersonalInfo));
            var newUrls = Avatar.CreateFromB64(newBase64SourceImage, sourceId, ext);
            userDataModel.Avatar = newUrls;
            var newPi = AddOrUpdateUserPersonalInfo(connection, userDataModel);

            var ms = (ChannelService) channelService;
            ms.UpdatePrivateChannelIcons(connection, newPi);
            return newPi.Avatar;
        }
    }
}