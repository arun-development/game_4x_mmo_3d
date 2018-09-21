using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Server.Core.Infrastructure;
using Server.Extensions;
using Server.ServicesConnected.Auth.Static;

namespace Server.EndPoints.AppTestController
{
 
    [Authorize(Roles = MainRoles.RDD)]
    [ValidateAntiForgeryToken]
    public class TestRequestController : DefaultController
    {
        public TestRequestController(IServiceProvider serviceProvider) : base(serviceProvider)
        {
        }
        // GET: TestVotingNotyfy
        [IgnoreAntiforgeryToken]
        public ActionResult Index()
        {
            return View();
        }

        [Route("api/TestVotingNotyfy/test")]
        [HttpGet]
 
        public IActionResult Test()
        {
            return Json("HttpGet");
        }
        
        [Route("api/TestVotingNotyfy/test")]
        [HttpPost]
        public IActionResult PostTest(NameIdInt model)
        {
            return Json(model);
        }

    }
}