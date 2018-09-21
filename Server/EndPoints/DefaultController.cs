using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Server.DataLayer;

namespace Server.EndPoints
{

    [ValidateAntiForgeryToken]
    public class DefaultController : Controller
    {
        #region Declare

        private IDbProvider __dbProvider;
        private IHostingEnvironment __env;
        protected readonly IServiceProvider _svp;

        public DefaultController(IServiceProvider serviceProvider)
        {
            _svp = serviceProvider;
        }

        protected IDbProvider _dbProvider => __dbProvider ?? (__dbProvider = _svp.GetService<IDbProvider>());

        protected IHostingEnvironment _env => __env ?? (__env = _svp.GetService<IHostingEnvironment>());

        #endregion
    }
}