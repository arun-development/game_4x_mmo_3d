using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Server.Modules.Localize;

namespace Server.EndPoints.Api
{
    [Route("translate/[action]")]
    [IgnoreAntiforgeryToken]
    public class TranslateApiController : DefaultApiController

    {
        #region Declare

        private readonly ILocalizerService _ls;

        public TranslateApiController(IServiceProvider serviceProvider) : base(serviceProvider)
        {
            _ls = _svp.GetService<ILocalizerService>();
        }

        #endregion


        [HttpGet]

        public IActionResult GetGameTranslate() => Json(_ls.GetGameTranslate());

        [HttpGet]

        public IActionResult GetSupportedLangs()
        {
            var result = new Dictionary<string, dynamic>
            {
                {_ls.CookieSuportedLangsKey, _ls.CookieSupportedCultureValues},
                {_ls.CookieDefaultLangKey, _ls.DefaultLang}
            };
            return Json(result);
        }

        [IgnoreAntiforgeryToken]
        public IActionResult ChangeCulture(string culture, string returnPath)
        {
            var localurl = @"/" + culture + returnPath;
            return Redirect(localurl);
        }
    }
}