using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.ServicesConnected.Auth.Static;

namespace Server.EndPoints.AppTestController
{
    [Authorize(Roles = MainRoles.RDD)]
    public class TestSignalController : DefaultController
    {
        #region Declare

        public TestSignalController(IServiceProvider serviceProvider) : base(serviceProvider)
        {
        }

        #endregion

        // GET: /<controller>/
        [IgnoreAntiforgeryToken]
        public IActionResult Index() => View();


    }
}