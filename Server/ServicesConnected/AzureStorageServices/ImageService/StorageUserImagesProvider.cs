using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage.Blob;
using Server.Core.Images;

namespace Server.ServicesConnected.AzureStorageServices.ImageService
{
    //https://github.com/Azure/azure-storage-net/blob/master/Samples/GettingStarted/VisualStudioQuickStarts/DataBlobStorage/Program.cs
    //https://docs.microsoft.com/ru-ru/azure/storage/storage-dotnet-how-to-use-blobs
    //https://www.simple-talk.com/cloud/platform-as-a-service/azure-blob-storage-part-3-using-the-storage-client-library/
    //http://arcware.net/upload-and-download-files-with-web-api-and-azure-blob-storage/


    public interface IStorageUserImagesProvider: IAzureStorageProvider
    {
        
    }

    public class StorageUserImagesProvider : IStorageUserImagesProvider
    {
        private static CloudBlobClient _blobClient;

        public StorageUserImagesProvider()
        {
            if (_blobClient != null) return;
            _blobClient = AzureStorageProviderHelper.CreateBlobClient(AzureStorageConnectionNames.SkagryUserImages);
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