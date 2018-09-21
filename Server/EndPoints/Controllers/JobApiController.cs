using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Server.EndPoints.Api;
using Server.Infrastructure;
using System;

namespace Server.EndPoints.Controllers
{
    [Route("api/Job/[action]")]

    public class JobApiController : DefaultApiController
    {

        public JobApiController(IServiceProvider serviceProvider) : base(serviceProvider) { }

        [HttpGet]
        //[AllowAnonymous]
        [IgnoreAntiforgeryToken]
        public IActionResult Push() {

            var appVars = (AppVarsReader) _svp.GetService<IAppVarsReader>();
            var hasCache = appVars.CacheInitialized;
            if (!hasCache)
            {
                return Json("NotInitialized");
            }
            else
            {
                //some work with sinchronisation heare
                return Json("Ok");

            }
          
        }
    }
}
