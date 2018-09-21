using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Threading.Tasks;
using Server.Core.Interfaces.UserServices;
using Server.Core.StaticData;
using Microsoft.WindowsAzure.Storage.Blob;

namespace Server.Core.Images
{
    public interface IAzureStorageProvider
    {
        Task<CloudBlobContainer> GetContainer(string blobContainerName);
        Task CheckBlobPermition(CloudBlockBlob abb);
        List<Uri> GetAllBlobs(CloudBlobContainer blobContainer);
        Task UploadAsyncByAbsoluteUrlAsync(MemoryStream source, string fullUrl);
        Task DeleteItem(string fullUrl);
        Task DeleteAll(CloudBlobContainer blobContainer);
    }
    public interface IAzureLogProvider : IAzureStorageProvider
    {
        void ChangePermition(BlobContainerPublicAccessType newPermition);
        Task<T> GetDataAsync<T>(string fullUrl);
 
    }
    public enum UserImageProperty : byte
    {
        Source = 10,
        Icon = 11,
        Detail = 12,
        Medium = 13
    };

    public enum AzureCdnType : byte
    {
        UserCdn = 51,
        AllianceCdn = 52,
        ChannelCdn = 53,
        StoreCdn = 54,
        SkagryLogErrorsCdn = 55
    }

    public interface IImages<T>
    {
        T Source { get; set; }
        T Icon { get; set; }
        T Detail { get; set; }
    }

    public interface IImageUrls : IImages<string>
    {
    }

    public interface IImagesBlobsB64 : IImages<string>
    {
    }

    //public interface IImagesBlobs : IImages<Image>, IDisposable
    //{
    //}


    public class UserImageModel : IImageUrls
    {
        public const int DefaultMaxLength = (int)MaxLenghtConsts.UserImagesDbMax;
        public string Source { get; set; }
        public string Icon { get; set; }
        public string Detail { get; set; }

        public UserImageModel Clone()
        {
            return (UserImageModel)MemberwiseClone();
        }

 
    }

    public static class ImageSuportedFormats
    {
        public const string Jpg = ".jpg";
        public const string Png = ".png";
        public const string Svg = ".svg";
        public const string WebP = ".webp";
    }

    public static class UserImageCdnData
    {
        private const string CdnUrl = "https://skagryuserimages.blob.core.windows.net/";
        public const string UserContainer = "user";
        public const string AllianceContainer = "alliance";
        public const string ChannelContainer = "channel";
        public const string UserCdn = CdnUrl + UserContainer + "/";
        public const string AllianceCdn = CdnUrl + AllianceContainer + "/";
        public const string ChannelCdn = CdnUrl + ChannelContainer + "/";
    }

    public interface IUserImageService
    {
        Task<UserImageModel> ImageServiceLoadAndUpdateAsync(IDbConnection connection, string newBase64SourceImage, int sourceId, IChannelService channelService, string ext = null);
    }



}