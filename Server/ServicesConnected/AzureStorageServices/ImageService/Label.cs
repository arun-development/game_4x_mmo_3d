using System.Drawing.Imaging;
using System.Threading.Tasks;
using Server.Core.Images;
using Server.Core.СompexPrimitive;
using Server.Extensions;

namespace Server.ServicesConnected.AzureStorageServices.ImageService {
    public class Label : UserImageModel {
        private static  UserImageModel DefaultAllianceImages;


        static Label() { }
        public static void ConfigureLabel(bool userAzureStorage)
        {
            var svg = ImageSuportedFormats.Svg;
            var df = UserImageCdnData.AllianceCdn + "default_";
            if (!userAzureStorage) {
                df = "/content/images/game/alliance/default_";
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
            DefaultAllianceImages = img;
        }

        public static UserImageModel CreateFileUrls(int id, string ext = ImageSuportedFormats.Jpg, int time = 0) {
            if (time == 0) {
                time = UnixTime.UtcNow();
            }
            return UserImageHelper.CreateFileUrls(AzureCdnType.AllianceCdn, id,
                UserImageHelper.CreateFileNames(time, ext));
        }

        public static UserImageModel DefaultUrls() {
            return DefaultAllianceImages.Clone();
        }

        public static UserImageModel GetIconsAdd() {
            //todo  создать иконки для отображения добавить аватар
            return DefaultAllianceImages.Clone();
        }

        public static UserImageModel GetNoLabel() {
            //todo  создать иконки для отображения нет лейбла
            return DefaultAllianceImages.Clone();
        }

        public static UserImageModel GetFileUrls(string dbImages) {
            return UserImageHelper.GetFileUrls(DefaultUrls, dbImages);
        }

        private static async Task CreateFromB64Async(string sourceBase64, IImageUrls urls, ImageFormat toFormat) {
            var cf = new UserImageLoader();
            await cf.CreateFromB64Async(sourceBase64, urls, toFormat);
        }

        public static async Task<UserImageModel> CreateFromB64Async(string sourceBase64, int id,
            string ext = ImageSuportedFormats.Jpg, int time = 0) {
            if (ext != ImageSuportedFormats.Jpg || ext != ImageSuportedFormats.Png) {
                ext = ImageSuportedFormats.Jpg;
            }

            var urls = CreateFileUrls(id, ext, time);
            return await CreateFromB64Async(sourceBase64, urls, UserImageHelper.GetFormat(ext))
                .ContinueWith(task => urls);
        }

        public static UserImageModel CreateFromB64(string sourceBase64, int id, string ext = ImageSuportedFormats.Jpg,
            int time = 0) {
            return CreateFromB64Async(sourceBase64, id, ext, time).MakeSync();
        }
    }
}