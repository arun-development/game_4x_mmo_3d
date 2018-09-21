using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Net.Http.Headers;
using Server.Modules.Localize;

namespace Server.Extensions
{
    public static class HttpContextExtentions
    {
        private static RewriteContext _setResponceRuleResult(this RewriteContext context, RuleResult result)
        {
            context.Result = result;
            return context;
        }

        public static HttpContext _setStatusCode(this HttpContext context, int statusCode)
        {
            context.Response.StatusCode = statusCode;
            return context;
        }

        public static HttpContext _setHeaders(this HttpContext context, string headerKey, string headerValue)
        {
            context.Response.Headers[headerKey] = headerValue;
            return context;
        }

        public static HttpContext _addCookieToResponce(this HttpContext context, string key, string value)
        {
            context.Response.Cookies.Append(key, value);
            return context;
        }

        public static string _getRequestCookie(this HttpContext context, string key, out bool hasCookie)
        {
            hasCookie = context.Request.Cookies.TryGetValue(key, out var result);
            return result;
        }

        public static void _deleteCookie(this HttpContext context, string key)
        {
            context.Response.Cookies.Delete(key);
        }

        public static string _getRequestHeaderValue(this HttpContext context, string key, out bool hasValue)
        {
            hasValue = context.Request.Headers.TryGetValue(key, out var result);
            return result;
        }

        public static string _getPriorityClientLangFromRequestHeaders(this HttpContext context, string defaultCulture)
        {
            var val = context.Request.GetTypedHeaders().AcceptLanguage;
            if (val.Count == 0) return defaultCulture;
            var headerValue = val.AsEnumerable()
                .Where(i => i.Value.HasValue && L10N.SupportedCulture.Contains(i.Value.Value))
                .OrderByDescending(h => h, StringWithQualityHeaderValueComparer.QualityComparer).FirstOrDefault();

            if (headerValue == null || headerValue.Value == null || string.IsNullOrWhiteSpace(headerValue.Value.Value))
                return defaultCulture;
            return headerValue.Value.Value;
        }

 

    }
}