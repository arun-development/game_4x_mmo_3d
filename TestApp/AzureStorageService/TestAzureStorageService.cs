using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using Newtonsoft.Json;


namespace TestApp.AzureStorageService
{
    public static class TestAzureStorageService
    {
        private static CloudBlobClient _blob;

/// <summary>
/// crached becouse connection string was deleted, use custom azure storage connection string
/// </summary>
/// <returns></returns>
        private static CloudBlobClient GetBlob( )
        {
            if (_blob!= null)
            {
  
                return _blob;
            }
            var connectionString = "DefaultEndpointsProtocol=https;AccountName={{AccountName ex: - skagrylogerrors}};AccountKey={{AccountKey.value}};EndpointSuffix=core.windows.net";
            var storageAccount = CloudStorageAccount.Parse(connectionString);
            return _blob= storageAccount.CreateCloudBlobClient();
        }





        public static async Task<List<IListBlobItem>> TestUriList(bool useFlatListing = true)
        {
            var blob = GetBlob();
            var blobContainer = blob.GetContainerReference("demon");
            //List
            List<IListBlobItem> list = default(List<IListBlobItem>);
            BlobContinuationToken token = null;
            do
            {
                BlobResultSegment resultSegment = await blobContainer.ListBlobsSegmentedAsync("", useFlatListing, BlobListingDetails.None, null, token, null, null);
                token = resultSegment.ContinuationToken;

                list = resultSegment.Results.Select(i => i).ToList();

                foreach (IListBlobItem item in resultSegment.Results)
                {
         
                        list.Add(item);
                    Console.WriteLine(item.StorageUri);
                }
            } while (token != null);

            return list;
        }
 


        public static async Task TestSave()
        {

            var data = new
            {
                TestData = Guid.NewGuid().ToString(),
                Source = "TestAzureStorageService.TestSave"
            };
            var url = "https://skagrylogerrors._blob.core.windows.net/demon/SaveToAzure.json";
            var buffer = Encoding.ASCII.GetBytes(JsonConvert.SerializeObject(data));
            using (var stram = new MemoryStream(buffer))
            {
                var cloudBlockBlob = new CloudBlockBlob(new Uri(url), GetBlob().Credentials);
 
                await cloudBlockBlob.UploadFromStreamAsync(stram);
 
            }
        }
    }
}
