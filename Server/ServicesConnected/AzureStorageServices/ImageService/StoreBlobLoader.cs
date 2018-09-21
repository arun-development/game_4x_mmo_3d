using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Threading.Tasks;
using Server.Core.Images;
using Server.Core.СompexPrimitive;

namespace Server.ServicesConnected.AzureStorageServices.ImageService
{
    public class StoreBlobLoader
    {
        public static string CdnUrl = StorageEternPlayPublicProvider.CdnUrl;
        public const string ProductsContainer = "products";
        public static string ProductsCdn = CdnUrl + ProductsContainer + "/";
        public const string FilseSeparator = UserImageHelper.FilseSeparator;

        public static string CreateFileName(string pruductId, string ext)
        {
            return pruductId + FilseSeparator + UnixTime.UtcNow() + ext;
        }
        public static string CreateFileUrl(string cdnContainerPath, string fileName)
        {
            if (string.IsNullOrWhiteSpace(fileName)) throw new ArgumentException("file name incorrect");
            if (!cdnContainerPath.EndsWith("/")) cdnContainerPath += "/";
            if (fileName.StartsWith("/")) fileName = fileName.Substring(1, fileName.Length);
            return cdnContainerPath + fileName;
        }

        public static string CreateProudctItemImageUrl(int productId, string ext)
        {
            return CreateFileUrl(ProductsCdn, CreateFileName(productId.ToString(), ext));
        }
        public static ImageFormat GetFormat(string ext)
        {
            return ext == ImageSuportedFormats.Png ? ImageFormat.Png : ImageFormat.Jpeg;
        }

        public async Task SaveFromB64Async(string sourceBase64, string targetFullUrl, ImageFormat toFormat)
        {
            using (var map = await ImageTypes.ToMap(sourceBase64))
            {
                await SaveToCdnAsync(map, targetFullUrl, toFormat);
            }
        }

        public async Task SaveToCdnAsync(Image preparedImage, string fullUrl, ImageFormat toFormat)
        {
            var provider = new StorageEternPlayPublicProvider();
            using (var stream = ImageTypes.ImageToStream(preparedImage, toFormat))
            {
                await provider.UploadAsyncByAbsoluteUrlAsync(stream, fullUrl);
                preparedImage.Dispose();
                stream.Close();
            }

        }


    }
}
