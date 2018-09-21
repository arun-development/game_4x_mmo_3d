using System;
using System.Drawing.Imaging;
using Server.Core.Images;
using Server.Extensions;

namespace Server.ServicesConnected.AzureStorageServices.ImageService
{
    public static class UserImageHelper
    {
        public const string FilseSeparator = "--v--";


        public static UserImageModel CreateFileNames(int currentTime, string ext)
        {
            return new UserImageModel
            {
                Icon = CreateFileName(UserImageProperty.Icon, currentTime, ext),
                Detail = CreateFileName(UserImageProperty.Detail, currentTime, ext),
                Source = CreateFileName(UserImageProperty.Source, currentTime, ext)
            };
        }


        public static string CreateFileName(UserImageProperty type, int currentTime, string ext)
        {
            return type + FilseSeparator + currentTime + ext;
        }

        public static string CreateFileUrl(string cdnUrl, int id, string fileName)
        {
            if (string.IsNullOrWhiteSpace(cdnUrl)) throw new ArgumentException("cdn path incorrect");
            if (string.IsNullOrWhiteSpace(fileName)) throw new ArgumentException("file name incorrect");
            if (id == 0) throw new ArgumentException("id can not be 0 or null");
            if (!cdnUrl.EndsWith("/")) cdnUrl += "/";
            if (!fileName.StartsWith("/")) fileName = "/" + fileName;
            return cdnUrl + id + fileName;
        }

        public static UserImageModel CreateFileUrls(string cdnUrl, int id, UserImageModel fileNames)
        {
            var pathes = new UserImageModel
            {
                Icon = CreateFileUrl(cdnUrl, id, fileNames.Icon).ToLower(),
                Detail = CreateFileUrl(cdnUrl, id, fileNames.Detail).ToLower(),
                Source = CreateFileUrl(cdnUrl, id, fileNames.Source).ToLower()
            };
            return pathes;
        }

        public static UserImageModel CreateFileUrls(AzureCdnType cdnType, int id, UserImageModel fileNames)
        {
            string cdnUrl;
            switch (cdnType)
            {
                case AzureCdnType.UserCdn:
                    cdnUrl = UserImageCdnData.UserCdn;
                    break;
                case AzureCdnType.AllianceCdn:
                    cdnUrl = UserImageCdnData.AllianceCdn;
                    break;
                default:
                    throw new ArgumentException("cdn type incorrect");
            }

            return CreateFileUrls(cdnUrl, id, fileNames);
        }

        public static UserImageModel GetFileUrls(Func<UserImageModel> defaultUmages, string dbLabelImages = null)
        {
            if (dbLabelImages == null) return defaultUmages();
            var imgs = dbLabelImages.ToSpecificModel<UserImageModel>();
            return GetFileUrls(defaultUmages, imgs);
        }

        public static UserImageModel GetFileUrls(Func<UserImageModel> defaultUmages, UserImageModel imagePathes)
        {
            if (imagePathes.Icon == null || imagePathes.Detail == null || imagePathes.Source == null) return defaultUmages();
            return imagePathes;
        }

        public static ImageFormat GetFormat(string ext)
        {
            return ext == ImageSuportedFormats.Png ? ImageFormat.Png : ImageFormat.Jpeg;
        }
    };
}