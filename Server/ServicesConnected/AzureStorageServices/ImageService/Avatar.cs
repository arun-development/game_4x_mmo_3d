using System.Drawing.Imaging;
using System.Threading.Tasks;
using Server.Core.Images;
using Server.Core.Interfaces.ImageService;
using Server.Core.СompexPrimitive;
using Server.Extensions;

namespace Server.ServicesConnected.AzureStorageServices.ImageService
{
    public class Avatar : UserImageModel, IAvatar

    {
        private static UserImageModel DefaultUserImages;
        static Avatar() { }

        public static void ConfigureAvatar(bool userAzureStorage) {
            var svg = ImageSuportedFormats.Svg;
            var df = UserImageCdnData.UserCdn + "default_";
            if (!userAzureStorage) {
                df = "/content/images/game/user/default_";
            }

            var img = new UserImageModel
            {
                Source = df + UserImageProperty.Source + svg,
                Detail = df + UserImageProperty.Detail + svg,
                Icon = df + UserImageProperty.Icon + svg
            };
            img.Source = img.Source.ToLower();
            img.Detail = img.Detail.ToLower();
            img.Icon = img.Icon.ToLower();
            DefaultUserImages = img;
        }

        public static UserImageModel CreateFileUrls(int id, string ext = ImageSuportedFormats.Jpg, int time = 0)
        {
            if (time == 0) time = UnixTime.UtcNow();
            return UserImageHelper.CreateFileUrls(AzureCdnType.UserCdn, id,
                UserImageHelper.CreateFileNames(time, ext));
        }

        public static UserImageModel GetNoLabel()
        {
            //todo  создать иконки для отображения  "нет аватара"
            return DefaultUserImages.Clone();
        }
        public static UserImageModel GetIconsAdd()
        {
            //todo  создать иконки для отображения "добавить аватар"
            return DefaultUserImages.Clone();
        }

        public static UserImageModel DefaultUrls()
        {
            return DefaultUserImages.Clone();
        }

        public static UserImageModel GetFileUrls(string dbImages)
        {
            return UserImageHelper.GetFileUrls(DefaultUrls, dbImages);
        }


        private static async Task CreateFromB64Async(string sourceBase64, IImageUrls urls, ImageFormat toFormat)
        {
            var cf = new UserImageLoader();
            await cf.CreateFromB64Async(sourceBase64, urls, toFormat);
        }

        public static async Task<UserImageModel> CreateFromB64Async(string sourceBase64, int id, string ext = ImageSuportedFormats.Jpg, int time = 0)
        {
            if (ext != ImageSuportedFormats.Jpg || ext != ImageSuportedFormats.Png) ext = ImageSuportedFormats.Jpg;

            var urls = CreateFileUrls(id, ext, time);
            await CreateFromB64Async(sourceBase64, urls, UserImageHelper.GetFormat(ext));
            return urls;
        }
        public static UserImageModel CreateFromB64(string sourceBase64, int id, string ext = ImageSuportedFormats.Jpg, int time = 0)
        {
          return CreateFromB64Async(sourceBase64, id, ext, time).MakeSync();
        }


        public UserImageModel GetDefaultUrls()
        {
            return DefaultUrls();
        }
    }
}
