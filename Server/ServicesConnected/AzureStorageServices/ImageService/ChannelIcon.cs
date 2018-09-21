using System.Threading.Tasks;
using Server.Core.Images;
using Server.Core.СompexPrimitive;
using Server.Extensions;

namespace Server.ServicesConnected.AzureStorageServices.ImageService
{
    public static class ChannelIcon

    {

        public const int IconSize = 90;
        public static string CreateFileUrl(int channelId, string ext = ImageSuportedFormats.Jpg, int time = 0)
        {
            if (time == 0) time = UnixTime.UtcNow();
            var fileName = UserImageHelper.CreateFileName(UserImageProperty.Icon, time, ext);
            return UserImageHelper.CreateFileUrl(UserImageCdnData.ChannelCdn, channelId, fileName);

        }
        public static async Task<string> CreateFromB64Async(string sourceBase64, int channelId, string ext = ImageSuportedFormats.Jpg, int time = 0, int iconSize = IconSize)
        {
            if (ext != ImageSuportedFormats.Jpg || ext != ImageSuportedFormats.Png) ext = ImageSuportedFormats.Jpg;

            var url = CreateFileUrl(channelId, ext, time);
            var cf = new UserImageLoader();
            await cf.CreateFromB64Async(sourceBase64, url, iconSize, UserImageHelper.GetFormat(ext));

            return url;
        }
        public static string CreateFromB64(string sourceBase64, int channelId, string ext = ImageSuportedFormats.Jpg, int time = 0, int iconSize = IconSize)
        {
            return CreateFromB64Async(sourceBase64, channelId, ext, time, iconSize).MakeSync();
        }

    }
}
