using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;

namespace TestApp.AzureStorageService
{
    [TestClass]
    internal class TestAzureStorageServiceTest
    {
        [TestMethod]
        public async Task TestAzureStorageServiceGetUriList()
        {
            Assert.Fail();
            var data = await TestAzureStorageService.TestUriList();
            Console.WriteLine(JsonConvert.SerializeObject(data.FirstOrDefault()));
        }
    }
}