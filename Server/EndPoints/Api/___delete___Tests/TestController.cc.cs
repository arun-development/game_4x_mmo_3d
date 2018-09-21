using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using app.Data.Infrastructure;
using app.Data.InitializeService;
using app.m_GameServise.Map;
using app.m_GameServise.Map.Distance;

namespace app.Api.Tests
{
    public partial class TestController
    {
        [HttpGet]
        public IHttpActionResult AddMyBalance(int count = 100000)
        {

            _balanceCcService.UpdateBalance(SessionUser.UserId, count, 1);
            return Json("ok");
        }

    }
}