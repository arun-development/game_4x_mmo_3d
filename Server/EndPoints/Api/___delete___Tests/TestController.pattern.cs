using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Http;
using app.Data.InitializeService;
using app.m_GameServise.Map;
using app.m_GameServise.Map.Distance;

namespace app.Api.Tests
{
    public partial class TestController
    {
        /// <summary>
        /// Todo  результаты ен сходятся
        /// </summary>
        /// <returns></returns>
        [HttpGet]  
        public IHttpActionResult IsUnicAllianceName(string name)
        {

            var cc1 = "123456"; // fail.
            var cc2 = "A123456"; // should succeed
            var cc3 = "qweQwe"; //  should succeed
            var cc4 = "qwe_Qwe"; //  should succeed
            var cc5 = "qwe-Qwe"; //  should succeed
            var cc6 = "qwe-Qwe-"; //  fail
            var cc7 = "qwe-Qwe_"; //  fail
            var cc8 = "qwe"; //  fail    short
            var cc9 = "qweqweqweqweqwe"; //  fail    long

            var pattern = @"^[A-Z]{1}[A-Z0-9_-]{3,9}[A-Z0-9]$";

            return Json(new
            {
                cc1match = Regex.IsMatch(cc1, pattern, RegexOptions.IgnoreCase) ,
                cc2match = Regex.IsMatch(cc2, pattern, RegexOptions.IgnoreCase)  ,
                cc3match = Regex.IsMatch(cc3, pattern, RegexOptions.IgnoreCase)  ,
                cc4match = Regex.IsMatch(cc4, pattern, RegexOptions.IgnoreCase)  ,
                cc5match = Regex.IsMatch(cc5, pattern, RegexOptions.IgnoreCase)  ,
                cc6match = Regex.IsMatch(cc6, pattern, RegexOptions.IgnoreCase)  ,
                cc7match = Regex.IsMatch(cc7, pattern, RegexOptions.IgnoreCase)  ,
                cc8match = Regex.IsMatch(cc8, pattern, RegexOptions.IgnoreCase)  ,
                cc9match = Regex.IsMatch(cc9, pattern, RegexOptions.IgnoreCase)  ,
                sendetName = Regex.IsMatch(name, pattern, RegexOptions.IgnoreCase),
            });
        }


    }
}