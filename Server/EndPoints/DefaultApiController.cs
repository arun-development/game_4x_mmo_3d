using System;
using Microsoft.AspNetCore.Mvc;

namespace Server.EndPoints
{
    [Route("api")]
    public class DefaultApiController : DefaultController
    {
        #region Declare

        public DefaultApiController(IServiceProvider serviceProvider) : base(serviceProvider)
        {
        }

        #endregion
    }
}