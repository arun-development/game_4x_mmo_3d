using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Server.Extensions;

namespace Server.ServicesConnected.AzureStorageServices
{
    internal static class AzureStorageProviderHelper
    {
        internal static CloudBlobClient CreateBlobClient(string storageConnectionName)
        {
            var connectionString = AzureStorageConnectionNames.GetConnectionString(storageConnectionName);
            var storageAccount = CloudStorageAccount.Parse(connectionString);
            return storageAccount.CreateCloudBlobClient();
        }


        internal static async Task<CloudBlobContainer> GetContainer(CloudBlobClient blobClient,string blobContainerName,BlobContainerPublicAccessType permition = BlobContainerPublicAccessType.Blob)
        {
            var blobContainer = blobClient.GetContainerReference(blobContainerName);
            await blobContainer.CreateIfNotExistsAsync();
            var permitions = await blobContainer.GetPermissionsAsync();
            if (permitions.PublicAccess != permition)
                await
                    blobContainer.SetPermissionsAsync(new BlobContainerPermissions
                    {
                        PublicAccess = permition
                    });
            return blobContainer;
        }


        internal static async Task CheckBlobPermition(CloudBlockBlob abb,
            BlobContainerPublicAccessType targetPermition = BlobContainerPublicAccessType.Blob)
        {
            var c = abb.Container;

            var permissions = await c.GetPermissionsAsync();
            //      permissions.PublicAccess = BlobContainerPublicAccessType.Blob;
            if (permissions.PublicAccess != targetPermition)
                //if (c.Properties.PublicAccess != BlobContainerPublicAccessType.Blob)
                await
                    c.SetPermissionsAsync(new BlobContainerPermissions
                    {
                        PublicAccess = targetPermition
                    });
        }


        private static async Task<List<AzureBlobItem>> _getBlobListAsync(CloudBlobContainer blobContainer, bool useFlatListing = true, BlobListingDetails blobListingDetails = BlobListingDetails.None)
        {


            //List
            List<AzureBlobItem> list = default(List<AzureBlobItem>);
            BlobContinuationToken token = null;
            do
            {
                BlobResultSegment resultSegment = await blobContainer.ListBlobsSegmentedAsync("", useFlatListing, blobListingDetails, null, token, null, null);
                token = resultSegment.ContinuationToken;
                list = resultSegment.Results.ToList().Select(i => new AzureBlobItem(i)).OrderBy(i => i.Folder).ThenBy(i => i.Name).ToList();
            } while (token != null);

            return list;
        }


        private static List<AzureBlobItem> _getAllBlobs(CloudBlobContainer blobContainer)
        {
            var items = _getBlobListAsync(blobContainer).MakeSync();
            return items;
        }

        internal static List<Uri> GetAllBlobUrls(CloudBlobContainer blobContainer)
        {
            return _getAllBlobs(blobContainer).Select(i => i.Item.Uri).ToList();
        }

        internal static async Task<string> GetBlobData(CloudBlobClient blobClient, string url)
        {
            var blob = await blobClient.GetBlobReferenceFromServerAsync(new Uri(url));
            string text;
            using (var memoryStream = new MemoryStream())
            {
                await blob.DownloadToStreamAsync(memoryStream);
                text = Encoding.UTF8.GetString(memoryStream.ToArray());
            }
            return text;
        }

        internal static async Task UploadAsyncByAbsoluteUrl(CloudBlobClient blobClient, MemoryStream source,
            string fullUrl, BlobContainerPublicAccessType targetPermition = BlobContainerPublicAccessType.Blob)
        {
            var cloudBlockBlob = new CloudBlockBlob(new Uri(fullUrl), blobClient.Credentials);
            await CheckBlobPermition(cloudBlockBlob, targetPermition);
            await cloudBlockBlob.UploadFromStreamAsync(source);
        }

        internal static async Task DeleteItem(CloudBlobClient blobClient, string fullUrl,
            BlobContainerPublicAccessType targetPermition = BlobContainerPublicAccessType.Blob)
        {
            var cloudBlockBlob = new CloudBlockBlob(new Uri(fullUrl), blobClient.Credentials);
            await CheckBlobPermition(cloudBlockBlob, targetPermition);
            await cloudBlockBlob.DeleteIfExistsAsync();
        }

        internal static async Task DeleteAll(CloudBlobContainer blobContainer)
        {

            var blobs = _getAllBlobs(blobContainer);
            foreach (var blob in blobs.Where(b => b.IsBlockBlob))
            {
                await ((CloudBlockBlob)blob.Item).DeleteIfExistsAsync();
            }
        }
    }
}