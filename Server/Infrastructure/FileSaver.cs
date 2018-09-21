using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Text;
using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json;
using Server.Core.СompexPrimitive;
using Server.Extensions;

namespace Server.Infrastructure
{
  //  [JsonObject]
    public class FileSaver
    {

        
        //[Required]
        public string FileData { get; set; }

        [JsonProperty]
        public string FileName { get; set; } = UnixTime.UtcNow().ToString();

        [JsonProperty]
        public string Catalog { get; set; } = "wwwroot/log";

        [JsonProperty]
        public bool SaveToCdn { get; set; }

        public string Ext { get; set; } = ".json";


        public void SaveToFile(IHostingEnvironment env)
        {

            SaveToFile(env.ContentRootPath);
        }
        public void SaveToFile(string rootPath)
        {
            var root = rootPath;
            if (!root.EndsWith("/"))
            {
                root += "/";
            }
            var catalog = Catalog;
            var directory = root + catalog + "/";
            directory = directory.Replace(@"\\", "/");
            directory = directory.Replace(@"//", "/");
            Directory.CreateDirectory(directory);
            var path = directory + FileName + Ext;
            File.WriteAllText(path, FileData, Encoding.UTF8);
        }


        public void GetFromFile(string catalogName, string ext, bool fromCdn = false)
        {
            // File.WriteAllText(_root + catalogName + "/" + fileName, this.ToSerealizeString());
        }
    }
}