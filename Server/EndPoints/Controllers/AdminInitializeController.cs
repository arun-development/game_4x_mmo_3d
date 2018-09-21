using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Server.DataLayer;
using Server.Extensions;
using Server.Infrastructure;
using Server.ServicesConnected.Auth.Static;

namespace Server.EndPoints.Controllers
{
    [Authorize(Roles = MainRoles.RDD)]
    public class AdminInitializeController : DefaultController
    {
        #region Declare

        public AdminInitializeController(IServiceProvider serviceProvider) : base(serviceProvider)
        {
        }

        #endregion

        // GET: Initialize

        [IgnoreAntiforgeryToken]
        [Route("[controller]")]
        [Route("{lang}/[controller]")]
        [Route("[controller]/[action]")]
        [Route("{lang}/[controller]/[action]")]

        public IActionResult Index()
        {
            ViewData[PageKeyVal.NotShowHeaderKey] = true;
            ViewData[PageKeyVal.AngularAppKey] = PageKeyVal.AngularAppAdmin;

            _svp.GetService<IDbProvider>().ContextAction(connection =>
            {
                this.AddGameVars(connection, _svp);
                return true;
            });
            ViewData._setTitle("Skagry AdminInitialize");

            

            return View();
        }
    }
}