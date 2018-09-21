using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Server.Core.Images;
using Server.Extensions;

namespace Server.ServicesConnected.AzureStorageServices.LogService
{
    public abstract class AzureLogItemBase
    {
        private readonly IAzureLogProvider _logger; // = ((IDiResolver) GlobalHost.DependencyResolver).Get<IAzureLogProvider>();
        protected string CatalogPath;
        public string Ext = ".json";
        protected string Id;
        protected string LogName;
        protected string ModelTypeName;

        protected AzureLogItemBase(IAzureLogProvider logger)
        {

            _logger = logger;
        }

        protected void _create(string catalogPath, string modelTypeName, string logName, string id)
        {
            ModelTypeName = modelTypeName;
            LogName = logName;
            CatalogPath = catalogPath;
            Id = id;
        }

        public string Url => _fullPath;
        private string _fullPath => $"{CatalogPath}{ModelTypeName}.{LogName}.__{Id}__{Ext}";

        public virtual async Task SaveAsync(object data)
        {
            var buffer = Encoding.ASCII.GetBytes(data.ToSerealizeString());
            using (var stram = new MemoryStream(buffer))
            {
                await _logger.UploadAsyncByAbsoluteUrlAsync(stram, _fullPath);
            }
        }

        public void Save(object data)
        {
            SaveAsync(data).MakeSync();
        }

        public virtual async Task<T> GetBlobDataAsync<T>()
        {
            return await _logger.GetDataAsync<T>(Url);
        }

        public virtual T GetBlobData<T>()
        {
            var data = GetBlobDataAsync<T>().GetAwaiter().GetResult();
            return data;
        }
    }

    public interface IDemonAzureLogItem
    {
        void Init(string modelTypeName, string logName);
        void Init(string modelTypeName, string logName, int id);
        void CrateAndSave(string modelTypeName, string logName, object data, int id = 0);
       
        
    }

    public class DemonAzureLogItem : AzureLogItemBase, IDemonAzureLogItem
    {
 

        public DemonAzureLogItem(IAzureLogProvider logger) : base(logger)
        {

        }

        public void Init(string modelTypeName, string logName)
        {
            _create(AzureLogCdnData.DemonCdn, modelTypeName, logName, Guid.NewGuid().ToString());
            //var item = id == 0?  _create(modelTypeName, logName): _create(id, modelTypeName, logName);
            //    ? new DemonAzureLogItem(modelTypeName, logName)
            //    : new DemonAzureLogItem(id, modelTypeName, logName);
            //item.Save(data);
        }

        public void Init(string modelTypeName, string logName, int id)
        {
            _create(AzureLogCdnData.DemonCdn, modelTypeName, logName, id.ToString());
            //var item = id == 0?  _create(modelTypeName, logName): _create(id, modelTypeName, logName);
            //    ? new DemonAzureLogItem(modelTypeName, logName)
            //    : new DemonAzureLogItem(id, modelTypeName, logName);
            //item.Save(data);
        }

 

        public void CrateAndSave(string modelTypeName, string logName, object data, int id = 0)
        {
            if (id ==0)
            {
                Init(modelTypeName, logName);
            }
            else
            {
                Init(modelTypeName, logName, id);
            }
            Save(data);
        }
    }
}