using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Server.Core.Interfaces;
using Server.Core.СompexPrimitive.Products;
using Server.DataLayer.LocalStorageCaches;
using Server.Extensions;
using Server.Infrastructure;
using Server.Modules.Localize;
using Server.ServicesConnected.Auth.Models;
using Server.ServicesConnected.Auth.Static;

namespace Server.EndPoints.Controllers
{
 
    public class HomeController : DefaultController
    {
        #region Declare



        private readonly IFileStorage _fs;
        private readonly IStoreService _storeService;
        private readonly IUserAuthToGameCache _userAuthToGameCache;
        private readonly IUserLocalStorageCache _userChache;

        public HomeController(IServiceProvider serviceProvider) : base(serviceProvider)
        {
     
            _fs = _svp.GetService<IFileStorage>();
            _storeService = _svp.GetService<IStoreService>();
            _userAuthToGameCache = _svp.GetService<IUserAuthToGameCache>();
            _userChache = _svp.GetService<IUserLocalStorageCache>();

        }

        #endregion

        //https://habrahabr.ru/post/168869/
        //todo  создать запрос для отдельной обработки пользователя, для полного кеширования страницы
        //[OutputCache(Location = OutputCacheLocation.Any, Duration = 31536000)]
        //[Route("testHome1")]
        //[Route("{culture}/[controller]/[action]")]
        //[Route("{culture}")]
        
        [Route("")]
        [Route("[controller]")]
        [Route("[controller]/[action]")]
        [Route("{lang}")]
        [Route("{lang}/[controller]")]
        [Route("{lang}/[controller]/[action]")]
        [IgnoreAntiforgeryToken]
        public IActionResult Index()
        {


            var path = _fs.GetHomeSliders();
            ViewData[PageKeyVal.ImagesKey] = new Pagination
            {
                PathInString = path
            };
            ViewData.Add(PageKeyVal.PageNameKey, PageKeyVal.HomePageVal);
            ViewData.Add(PageKeyVal.BodyCssKey, PageKeyVal.HomeBodyCssVal);
            ViewData[PageKeyVal.AngularAppKey] = PageKeyVal.AngularAppSite;
            ViewData[PageKeyVal.PageTitleKey] = "Home Page";
            return View();
        }

        [Authorize]
        [HttpPost]
        [Route("[controller]/[action]")]
        [Route("{lang}/[controller]/[action]")]
        public IActionResult GetMenuLoginView()
        {
            var responce = _dbProvider.ContextAction(connection =>
            {
                var userName = User.GetUserName();
                var userId = _userAuthToGameCache.GetOrAdd(connection,User.GetAuthUserId(), _userChache);
                var chest = _storeService.GetChestUser(connection,userId);
                var data = new Dictionary<string, object>
                {{PageKeyVal.UserName, userName},
                    {PageKeyVal.UserChestKey,chest}
                };
                var balanceData = (UchBalanceCcData)chest.ActivatedItemsView[ProductTypeIds.Cc].Data;

                ViewData[PageKeyVal.UserName] = userName;
                ViewData[PageKeyVal.UserBalnceCcKey] = balanceData.BalanceCc.Quantity;
                return new MvcJsonHtmlData(this, "~/Views/Shared/_site-personal-menu.cshtml", data);
         
            });
 
            return Json(responce);
        }



        [Authorize(Roles = MainRoles.RDD)]
        [HttpPost]
        [Route("[controller]/[action]")]
        [Route("{lang}/[controller]/[action]")]
        public async Task<IActionResult> Copy()
        {
            return Json(await Task.Factory.StartNew(() => _fs.CopyHomeSlider()));
        }

        [IgnoreAntiforgeryToken]
        public IActionResult Error()
        {
            if (_env.IsDevelopment())
            {
                return RedirectToAction("DevError", "Error");
            }
            return RedirectToAction("Default", "Error");
        }


        [Route("api/[controller]/[action]")]
        //[IgnoreAntiforgeryToken]
        [HttpGet]
        public IActionResult TestConvertToHtmlString() => Json(new
        {
            testHtmlString = this.ConvertViewToString("~/Views/Home/TestConvertToHtmlString.cshtml", "Hi My test data")
        });

    }
}