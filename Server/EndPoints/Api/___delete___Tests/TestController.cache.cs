using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using app.Data.AdvancedService;
using app.Data.Infrastructure;
using app.m_GameServise.BuildModel;
using app.m_GameServise.QueuesModel.Fields;
using app.m_Utilites;
using CommonUtils;
using CommonUtils.ImageService;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;

namespace app.Api.Tests
{
    [Authorize(Roles = MainRoles.Root + ", " + MainRoles.Developer)]
    public partial class TestController
    {
        #region not work REDIS IMAGE
        //[HttpGet]
        //public  IHttpActionResult RedisImage(int count =100)
        //{


        //    var startCount = count;
        //    var time = UnixTime.UtcNowMs();
        //    long firstTime =0;
        //    long medTimeStart=0;
        //    long medTimeEnd =0;
        //    UserImageModel Data = null;

        //    while (count>0)
        //    {

        //        var inst = new AllianceImages();
        //        var images = inst.GetFileUrls(1, _allianceService);
        //        if (count == startCount)
        //        {
        //            Data = images;
        //            firstTime = UnixTime.UtcNowMs();
        //        }
        //        //if (count == 51)
        //        //{
        //        //    medTimeStart = UnixTime.UtcNowMs();
        //        //}
        //        //if (count == 50)
        //        //{
        //        //    medTimeEnd = UnixTime.UtcNowMs();
        //        //}
        //        count--;

        //    }




        //    var deltaTime = UnixTime.UtcNowMs() - time;


        //    return Json(new
        //    {
        //        DeltaPerAction= deltaTime / startCount,
        //        FirstAction = firstTime - time,
        //        InMedium = medTimeEnd - medTimeStart,
        //        TotalTime = deltaTime,
        //        Data =Data
        //    });
        //}


        //[HttpGet]
        //public IHttpActionResult RedisImageSaveAll()
        //{


        //    var time = UnixTime.UtcNowMs();
        //    var inst = new AllianceImages();
        //    inst.LoadAllExisting(_allianceService);

        //    var deltaTime = UnixTime.UtcNowMs() - time;


        //    return Json(new
        //    {
        //        deltaTime
        //    });
        //}

        //[HttpGet]
        //public IHttpActionResult RedisImageGetAll()
        //{


        //    var time = UnixTime.UtcNowMs();
        //    var inst = new AllianceImages();
        //    var q = inst.GetAll(_allianceService);

        //    var deltaTime = UnixTime.UtcNowMs() - time;


        //    return Json(new
        //    {
        //        deltaTime,
        //        All = q

        //    });
        //}
        #endregion


        [HttpGet]
        public IHttpActionResult TestImagesFromDb()
        {

            var time = UnixTime.UtcNowMs();
            var imgs = new Dictionary<int, UserImageModel>();
            _allianceService.GetAllAlliancesAsync(i => new { i.images, i.Id }, false).ToList().ForEach(i =>
            {
                var item = i.images;
                UserImageModel val = item == null ? Label.DefaultUrls() : item.ToSpecificModel<UserImageModel>();
                imgs.Add(i.Id, val);
            });
            var deltaTime = UnixTime.UtcNowMs() - time;


            return Json(new
            {
                deltaTime,
                All = imgs

            });
        }

        [HttpGet]
        public IHttpActionResult TestImagesLocalStorage()
        {

            var time = UnixTime.UtcNowMs();

            var inst =new  AlliancesImageStorage(_allianceService);
            var all = inst.GetItem(1001);

            var deltaTime = UnixTime.UtcNowMs() - time;


            return Json(new
            {
                deltaTime,
                All = all

            });
        }
        [HttpGet]
        public IHttpActionResult TestImagesLocalStorageList()
        {

            var time = UnixTime.UtcNowMs();

            var inst = new AlliancesImageStorage(_allianceService);
            var all = inst.GetLoacls();

            var deltaTime = UnixTime.UtcNowMs() - time;


            return Json(new
            {
                deltaTime,
                All = all

            });
        }

    }

}