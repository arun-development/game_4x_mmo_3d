using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage.Blob;
using Newtonsoft.Json;
using Server.Core.Images;

namespace Server.ServicesConnected.AzureStorageServices.LogService {
    public class AzureLogProvider :  IAzureLogProvider {
        private static CloudBlobClient _blobClient;
        private static BlobContainerPublicAccessType _permition = BlobContainerPublicAccessType.Off;

        public AzureLogProvider() {
            if (_blobClient == null) {
                _blobClient = AzureStorageProviderHelper.CreateBlobClient(AzureStorageConnectionNames.SkagryLogErrors);
            }
            
        }

        public async Task<CloudBlobContainer> GetContainer(string blobContainerName) {
            return await AzureStorageProviderHelper.GetContainer(_blobClient, blobContainerName, _permition);
        }

        public async Task CheckBlobPermition(CloudBlockBlob abb) {
            await AzureStorageProviderHelper.CheckBlobPermition(abb, _permition);
        }

        public List<Uri> GetAllBlobs(CloudBlobContainer blobContainer) {
            return AzureStorageProviderHelper.GetAllBlobUrls(blobContainer);
        }

        public async Task UploadAsyncByAbsoluteUrlAsync(MemoryStream source, string fullUrl) {
            await AzureStorageProviderHelper.UploadAsyncByAbsoluteUrl(_blobClient, source, fullUrl, _permition);
        }

        public async Task DeleteItem(string fullUrl) {
            await AzureStorageProviderHelper.DeleteItem(_blobClient, fullUrl, _permition);
        }

        public async Task DeleteAll(CloudBlobContainer blobContainer) {
            await AzureStorageProviderHelper.DeleteAll(blobContainer);
        }

        public async Task<T> GetDataAsync<T>(string fullUrl) {
           // await  _blobClient.GetBlobReferenceFromServerAsync(new Uri(fullUrl));
            var data = await AzureStorageProviderHelper.GetBlobData(_blobClient, fullUrl);
            return string.IsNullOrWhiteSpace(data) ? default(T) : JsonConvert.DeserializeObject<T>(data);
        }


        //GetBlobDataAsync

        public void ChangePermition(BlobContainerPublicAccessType newPermition) {
            if (!Equals(_permition, newPermition)) {
                _permition = newPermition;
            }
        }
    }
}