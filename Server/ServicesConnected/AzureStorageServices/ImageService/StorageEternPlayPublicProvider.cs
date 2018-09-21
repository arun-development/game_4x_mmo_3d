using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage.Blob;
using Server.Core.Images;

namespace Server.ServicesConnected.AzureStorageServices.ImageService
{

    public interface IStorageEternPlayPublicProvider:IAzureStorageProvider{
    }

    public class StorageEternPlayPublicProvider: IStorageEternPlayPublicProvider
    {
        private static CloudBlobClient _blobClient;
        public static string CdnUrl = @"https://" + AzureStorageConnectionNames.EternPlayPublic + ".blob.core.windows.net/";

        public StorageEternPlayPublicProvider()
        {
            if (_blobClient != null) return;
            _blobClient = AzureStorageProviderHelper.CreateBlobClient(AzureStorageConnectionNames.EternPlayPublic);
        }

        public async Task<CloudBlobContainer> GetContainer(string blobContainerName)
        {
            return await AzureStorageProviderHelper.GetContainer(_blobClient, blobContainerName);
        }

        public async Task CheckBlobPermition(CloudBlockBlob abb)
        {
            await AzureStorageProviderHelper.CheckBlobPermition(abb);
        }


        public List<Uri> GetAllBlobs(CloudBlobContainer blobContainer)
        {
            return AzureStorageProviderHelper.GetAllBlobUrls(blobContainer);

        }

        public async Task UploadAsyncByAbsoluteUrlAsync(MemoryStream source, string fullUrl)
        {
            await AzureStorageProviderHelper.UploadAsyncByAbsoluteUrl(_blobClient, source, fullUrl);

        }

        public async Task DeleteItem(string fullUrl)
        {
            await AzureStorageProviderHelper.DeleteItem(_blobClient, fullUrl);
        }

        public async Task DeleteAll(CloudBlobContainer blobContainer)
        {
            await AzureStorageProviderHelper.DeleteAll(blobContainer);
        }
    }
}
