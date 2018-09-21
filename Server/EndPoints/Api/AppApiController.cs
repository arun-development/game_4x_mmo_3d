using System;
using System.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Core.Infrastructure;
using Server.Core.Interfaces;
using Server.Infrastructure;
using Server.ServicesConnected.Auth.Static;

namespace Server.EndPoints.Api
{
    [Authorize]
    [Route("api")]
    public class AppApiController : DefaultApiController, ITest
    {
        #region Declare

        protected static readonly Random Rand = new Random();
        protected static readonly RandomNumbers RandNum = new RandomNumbers();

        public AppApiController(IServiceProvider serviceProvider) : base(serviceProvider)
        {
        }

        #endregion

        #region Interface

        [HttpGet]
        [AllowAnonymous]
        [Route("[controller]/[action]")]
        public virtual string Test(string message = "Ok")
        {
            
            return message;
        }

        #endregion

        [Authorize(Roles = MainRoles.RDD)]
        [HttpPost]
        [Route("[controller]/[action]")]
        //[DisableRequestSizeLimit]
        //[RequestSizeLimit(int.MaxValue)]
        public IActionResult PostSaveDataToFile(FileSaver model)
        {
            model.SaveToFile(_env);
            //var filePath = System.Web.HttpContext.Current.Server.MapPath("~") + "log/_"+ fName + UnixTime.UtcNow() + "_.json";       
            //File.WriteAllText(filePath, model.ToSerealizeString());    
            return Ok();
        }
    }
}