using System;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Server.Extensions;
using Server.Modules.Localize;

namespace TestApp.Contoller
{
    public class TestRequestHeaderController : TestBaseController
    {
        public TestRequestHeaderController()
        {
            ControllerContext = new ControllerContext {HttpContext = new DefaultHttpContext()};
        }

        public TestRequestHeaderController(string headerKey, string headerValue) : this()
        {
            ControllerContext.HttpContext.Request.Headers[headerKey] = headerValue;
        }

        public string Get([FromHeader(Name = "device-id")] string id)
        {
            return id;
        }
    }

    [TestClass]
    public class TestRequestHeaderTest
    {
        public TestRequestHeaderTest()
        {
            Assert.Fail();
        }
        [TestMethod]
        public void GetValueFromControllerTest()
        {
            var val = "27";
            var requestHeaderController = new TestRequestHeaderController("device-id", val);
            var result = requestHeaderController.Get(val);
            Assert.AreEqual(result, val);
        }


        [TestMethod]
        public void GetUserClientCultureHeaderValueTest()
        {
            var haeders = "ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4";
            var requestHeaderController = new TestRequestHeaderController(HeaderNames.AcceptLanguage, haeders);
            var headerValue =
                requestHeaderController.HttpContext._getRequestHeaderValue(HeaderNames.AcceptLanguage,
                    out var hasValue);
            Assert.IsTrue(hasValue);
            Console.WriteLine($"realHeaders: {headerValue}");

            var httpContext = requestHeaderController.HttpContext;
            var acceptLanguage = httpContext.Request.GetTypedHeaders().AcceptLanguage;
            Assert.IsTrue(acceptLanguage.Count > 0);


            var list = acceptLanguage.AsEnumerable()
                .OrderByDescending(h => h, StringWithQualityHeaderValueComparer.QualityComparer).Select(x => x.Value)
                .ToList();

            Assert.AreEqual(list[0].Buffer, haeders);
            Assert.AreEqual(list[0].Value, "ru-RU");

            var providerCultureResult = new ProviderCultureResult(list);
            var supCultures = L10N.SupportedCulture;
            var cultures = providerCultureResult.Cultures;
            var resultCulture =
                cultures.FirstOrDefault(i => i.HasValue && i.Length == 2 && supCultures.Contains(i.Value));
            Assert.AreEqual(resultCulture.Value, "ru");
        }

        [TestMethod]
        public void GetPriorityClientLangFromRequestHeadersHttpContextTest()
        {
            var requestHeaderController =
                new TestRequestHeaderController(HeaderNames.AcceptLanguage, "ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4");
            var result = requestHeaderController.HttpContext._getPriorityClientLangFromRequestHeaders(L10N.DefaultLang);
            Assert.AreEqual("ru", result);
        }
    }
}