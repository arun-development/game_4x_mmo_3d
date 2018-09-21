using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Threading.Tasks;
using Server.Core.Images;

namespace Server.ServicesConnected.AzureStorageServices.ImageService
{
    public interface IUserImageLoader
    {
        Task SaveToCdnAsync(Image image, string storageAbsUrl, ImageFormat toFormat);
        Task SaveToCdnAsync(Dictionary<string, Image> images, ImageFormat toFormat);
        Task CreateFromB64Async(string sourceBase64, IImageUrls urls, ImageFormat toFormat);
    }

    public class UserImageLoader : IUserImageLoader
    {
        public async Task SaveToCdnAsync(Image image, string storageAbsUrl, ImageFormat toFormat)
        {
            var provider = new StorageUserImagesProvider();
            using (var stream = ImageTypes.ImageToStream(image, toFormat))
            {
                await provider.UploadAsyncByAbsoluteUrlAsync(stream, storageAbsUrl);
                image.Dispose();
                stream.Close();
            }
 

        }

        public async Task SaveToCdnAsync(Dictionary<string, Image> images, ImageFormat toFormat)
        {

            var provider = new StorageUserImagesProvider();
            foreach (var i in images)
            {
                var img = i.Value;
                using (var stream = ImageTypes.ImageToStream(img, toFormat))
                {
                    await provider.UploadAsyncByAbsoluteUrlAsync(stream, i.Key);
               //     img.Dispose();
                 //   stream.Close();
                }
     
   
            }
        }

        public async Task CreateFromB64Async(string sourceBase64, IImageUrls urls, ImageFormat toFormat)
        {
            var map = await ImageTypes.ToMap(sourceBase64);
            var detail = await ImageResizer.ToSquare(map, 260);
            var icon = await ImageResizer.ToSquare(map, 107);

            await SaveToCdnAsync(new Dictionary<string, Image>
            {
                {urls.Source, map},
                {urls.Detail, detail},
                {urls.Icon, icon}
            }, toFormat);
        }

        public async Task CreateFromB64Async(string sourceBase64, string url, int squareSize, ImageFormat toFormat)
        {
            using (var map = await ImageTypes.ToMap(sourceBase64))
            {
                var img = await ImageResizer.ToSquare(map, squareSize);
                await SaveToCdnAsync(img, url, toFormat);
            }
        }

    }
}