using System.Collections;
using System.Collections.Concurrent;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Server.Extensions;
using Server.ServicesConnected.AzureStorageServices.ImageService;

namespace Server.Infrastructure
{
    public interface IFileStorage
    {
        string GetHomeSliders();
        string CopyHomeSlider();
    }

    public class FileStorage : IFileStorage
    {
        private static readonly ConcurrentDictionary<string, ICollection> Files =
            new ConcurrentDictionary<string, ICollection>();

        private static readonly string _homeSlidesKey = "homeSlides";
        private static string _homeSlidesString;
        private readonly IHostingEnvironment _env;

        public FileStorage(IHostingEnvironment env)
        {
            _env = env;
        }

        public string GetHomeSliders()
        {
            if (_homeSlidesString != null) return _homeSlidesString;
            InitHomeSlides();
            return _homeSlidesString;
        }

        public string CopyHomeSlider()
        {
            var rootPath = MapPath("");
            var dir = rootPath + "Content/images/art/screens/jpg/";
            var originPath = dir + "original";
            var minPath = dir + "min";
            var normalPath = dir;

            //            string fileName = "/004_battlecruser";
            //            string fileExt = ".jpg";

            var origFileList = Directory.GetFiles(originPath);

            for (var i = 0; i < origFileList.Length; i++)
            {
                //                string origFile = originPath + fileName + fileExt;
                //                string newFileTest = originPath + "/test" + fileName + i + fileExt;
                //                string newFileMin = originPath + "/test/min" + fileName + i + fileExt;

                var origFile = origFileList[i];

                var fileName = Path.GetFileName(origFile);

                var normalFile = normalPath + "/" + fileName;
                var minFile = minPath + "/" + fileName;


                ImageResizer.ResizeImage(origFile, normalFile, ImageTypes.CaruselImage.Normal);
                ImageResizer.ResizeImage(origFile, minFile, ImageTypes.CaruselImage.Min);
            }


            return "Copied";
        }

        private void InitHomeSlides()
        {
    
            var relativePath = "art/screens/webp/";
            var homePath = "/Content/images/"+ relativePath;
            var cdnPath =  StorageEternPlayPublicProvider.CdnUrl+relativePath;
            var catalog = MapPath(homePath);
            var files = Directory.GetFiles(catalog).OrderBy(i => i).Select(i=> homePath+ Path.GetFileName(i)).ToList();//.Select(i => cdnPath  + Path.GetFileName(i)).ToList();
            Files.AddOrUpdateSimple(_homeSlidesKey, files);
            _homeSlidesString = files.Aggregate("", (current, f) => current + (f + ",")).RemoveLastSimbol();
 
        }

        private string MapPath(string path)
        {
            return _env.WebRootPath + path;

            //return HttpServerUtility.MapPath("~" + path);
        }
    }
}