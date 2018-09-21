using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Server.Core.Interfaces;
using Server.Core.СompexPrimitive.Products; 
using Server.Extensions;
using Server.Infrastructure;
using Server.ServicesConnected.Auth.Static;

namespace Server.EndPoints.Controllers
{
    [Authorize(Roles = MainRoles.User)]
    public class StoreController : DefaultController
    {
        #region Declare

 
        private readonly IStoreService _storeService;

        public StoreController(IServiceProvider serviceProvider) : base(serviceProvider)
        {
            _storeService = _svp.GetService<IStoreService>();
        }

        #endregion

 
        //   [Compress]
        //[OutputCache(Location = OutputCacheLocation.Any, Duration = 2628000)]
        [IgnoreAntiforgeryToken]
        [Route("[controller]")]
        [Route("{lang}/[controller]")]
        [Route("[controller]/[action]")]
        [Route("{lang}/[controller]/[action]")]
        public IActionResult Index()
        {
            ViewData[PageKeyVal.PageNameKey] = PageKeyVal.StorePageVal;
            ViewData[PageKeyVal.BodyCssKey] = PageKeyVal.StoreBodyCssVal;


            ViewData[PageKeyVal.AngularAppKey] = PageKeyVal.AngularAppSite;
            _dbProvider.ContextAction(connection =>
            {
                var productes = _storeService.GetStoreAllView(connection);
                ViewData[StoreView.ViewKey] = productes;
                return true;
            });
            ViewData._setTitle("SKAGRY STORE");


            return View();
        }
        
        [HttpPost]
        public IActionResult GetTest() => Json("true");
    }
}