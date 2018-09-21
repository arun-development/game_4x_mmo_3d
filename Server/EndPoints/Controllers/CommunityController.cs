using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Server.EndPoints.Controllers
{
  //  [Authorize]
    public class CommunityController : DefaultController
    {
        #region Declare

        public CommunityController(IServiceProvider serviceProvider) : base(serviceProvider)
        {
 
        }

        #endregion

        // GET: Community
        [Route("[controller]")]
        [Route("{lang}/[controller]")]
        [Route("[controller]/[action]")]
        [Route("{lang}/[controller]/[action]")]
        public IActionResult Index() => View();

        public IActionResult Skagry() => View();
    }
}