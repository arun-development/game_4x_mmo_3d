using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Server.Core;
using Server.EndPoints.Hubs.GameHub;
using Server.EndPoints.Hubs.MyTestHub;
using Server.ServicesConnected.Auth.Static;

namespace Server.EndPoints.AppTestController
{
    [Authorize(Roles = MainRoles.RDD)]
    [Produces("application/json")]
    [Route("api/[controller]/[action]")] // обычный шаблон
    // [Route("api/[controller]")]// действия круд будут определяться в действиях с обязательным указанием [HttpGet("{ParamName}")]
    public class TApiController : DefaultController
    {
        #region Declare

        private readonly IHubContext<MyTestHub> _hub;

        private readonly ITestSrvice _myService;

        public TApiController(IServiceProvider serviceProvider) : base(serviceProvider)
        {

            _myService = _svp.GetService<ITestSrvice>();
            _hub = _svp.GetService<IHubContext<MyTestHub>>();
        }

        #endregion

        // GET: api/T
        [HttpGet]
        public IEnumerable<string> Get() => new[] { "value1", "value2" };

        public IActionResult GetTwoParams(int id, string val2)
        {
            var message = $"IActionResult Get(int {id}  string {val2})";
            return Json(message);
        }

        public IActionResult MyService()
        {
            var message = _myService.GetMessage("MyService testMessage");
            return Json(message);
        }

        public IActionResult CallHub()
        {
            _hub.Clients.All.InvokeAsync("TestServiceSended", new
            {
                CallHub = "CallHub"
            });
            return Json("ok");
        }

        public IActionResult CloseHub(string data)
        {
 
            return Json("ok");
        }
    }
}