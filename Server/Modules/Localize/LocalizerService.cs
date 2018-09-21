using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Localization.Routing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Net.Http.Headers;
using Server.Extensions;

namespace Server.Modules.Localize
{
    #region Localize 1
    public interface ILocalizerService
    {
        void Configure(RequestLocalizationOptions options);
        string DefaultLang { get; }
        string CookieCurrentLangKey { get; }
        string CookieDefaultLangKey { get; }
        string CookieSuportedLangsKey { get; }
        IReadOnlyList<string> CookieSupportedCultureValues { get; }
        string CookieSupportedCultureValuesAsString { get; }
        List<CultureInfo> SupportedCultures { get; }

        bool Configured { get; }
        string GetReturnPathView(HttpContext context);
        string TranslationKey { get; }
    }

    public class LocalizerService : ILocalizerService
    {
        #region Declare
        private const string ROUTE_CONTAIN_ONLY_LANG_REGEXP = @"^\/\b(en|es|ru)\/?$";
        private const string ROUTE_CONTAIN_LANG_REGEXP = @"^\/\b(en|es|ru)";
        private const string ROUTE_CONTAIN_LANG_AND_PATH_REGEXP = @"(^\/\b(en|es|ru)\/).{1,}";
        private const string ROUTE_CONTAIN_WRONG_LANG_FORMAT_REGEXP = @"^\/(en|es|ru)-";
        private const string ROUTE_TO_IGNORE_LANG_REGEXP = @"^\/(MainGameHub|api\/|game|admininitialize).*$";
        public const string TRANSLATION_KEY = "TranslationKey";
        public const string IS_FILE = @"\.\w{2,7}$";
        public string TranslationKey => TRANSLATION_KEY;



        public string CookieCurrentLangKey => "_currLang";
        public string CookieDefaultLangKey => "_defaultLang";
        public string CookieSuportedLangsKey => "_langs";
        public string CookieRedirectLangKey => "_redirectLangKey";


        public static IReadOnlyList<string> SupportedCultureValues = new List<string>(3)
        {
            LangKeys.En.ToString().ToLower(),
            LangKeys.Ru.ToString().ToLower(),
            LangKeys.Es.ToString().ToLower()
        };

        public IReadOnlyList<string> CookieSupportedCultureValues => SupportedCultureValues;
        private string _cookieSupportedCultureValuesAsString;
        public string CookieSupportedCultureValuesAsString => _cookieSupportedCultureValuesAsString ?? (_cookieSupportedCultureValuesAsString = CookieSupportedCultureValues.ToSerealizeString());

        private static bool _configured = false;
        public bool Configured => _configured;

        public const string DefaultLang = "en";
        string ILocalizerService.DefaultLang => DefaultLang;

        private static List<CultureInfo> _supportedCultures;
        private static RequestCulture _defaultRequestCulture;

        private RequestCulture DefaultRequestCulture => _defaultRequestCulture ?? (_defaultRequestCulture = new RequestCulture(DefaultLang, DefaultLang));

        public List<CultureInfo> SupportedCultures => _supportedCultures ?? (_supportedCultures = new List<CultureInfo>
        {
            new CultureInfo(DefaultLang),
            new CultureInfo(LangKeys.Es.ToString().ToLower()),
            new CultureInfo(LangKeys.Ru.ToString().ToLower())
        });


        private ProviderCultureResult _getCurretnOtions
        {
            get
            {
                return new ProviderCultureResult(L10N.GetCurrentCulture());
            }
        }

        #endregion



        public void Configure(RequestLocalizationOptions options)
        {

            if (Configured) return;

            var defaultLang = DefaultLang;
            var langCookieKey = CookieCurrentLangKey;
            // State what the default culture for your application is. This will be used if no specific culture
            // can be determined for a given request.
            options.DefaultRequestCulture = DefaultRequestCulture;

            // You must explicitly state which cultures your application supports.
            // These are the cultures the app supports for formatting numbers, dates, etc.
            options.SupportedCultures = SupportedCultures;
            // These are the cultures the app supports for UI strings, i.e. we have localized resources for.
            options.SupportedUICultures = SupportedCultures;


            // You can change which providers are configured to determine the culture for requests, or even add a custom
            // provider with your own logic. The providers will be asked in order to provide a culture for each request,
            // and the first to provide a non-null result that is in the configured supported cultures list will be used.
            // By default, the following built-in providers are configured:
            // - QueryStringRequestCultureProvider, sets culture via "culture" and "ui-culture" query string values, useful for testing
            // - CookieRequestCultureProvider, sets culture via "ASPNET_CULTURE" cookie
            // - AcceptLanguageHeaderRequestCultureProvider, sets culture via the "Accept-Language" request header

            options.RequestCultureProviders.Insert(0, new CustomRequestCultureProvider(async context =>
            {

                var request = context.Request;
                var path = request.Path;
                if (Regex.IsMatch(request.Path, IS_FILE))
                {
                    //todo something with file
                    return await Task.FromResult(_getCurretnOtions);

                }
                if (request.Path.StartsWithSegments("/hub"))
                {
                    //todo something with hub
                    return await Task.FromResult(_getCurretnOtions);
                }

                string cultureResult = null;
                var langsKey = CookieSuportedLangsKey;
                context._getRequestCookie(langsKey, out var hasLangsCookie);
                if (!hasLangsCookie)
                {
                    var spv = CookieSupportedCultureValuesAsString;
                    context._addCookieToResponce(langsKey, spv);
                }

                var redirectCookieKey = CookieRedirectLangKey;
                context._getRequestCookie(redirectCookieKey, out var isRedirect);
                if (isRedirect)
                {
                    cultureResult = context._getRequestCookie(langCookieKey, out var hasCookie);
                    context._deleteCookie(redirectCookieKey);
                }
                else
                {

                    if (path.Value == "/")
                    {
                        cultureResult = this._setAndGetLangToCookie(context, defaultLang, langCookieKey);
                        context._addCookieToResponce(redirectCookieKey, true.ToString());
                        context.Response.Redirect(this._getHomeIndexPath(cultureResult), false);
                    }
                    else if (Regex.IsMatch(request.Path, ROUTE_TO_IGNORE_LANG_REGEXP))
                    {
                        cultureResult = this._setAndGetLangToCookie(context, defaultLang, langCookieKey);
                        SetCulture(cultureResult);
                    }
                    else if (Regex.IsMatch(request.Path, ROUTE_CONTAIN_ONLY_LANG_REGEXP) || Regex.IsMatch(request.Path, ROUTE_CONTAIN_LANG_AND_PATH_REGEXP))
                    {
                        cultureResult = this._getLangFromPath(context);
                        var cookieValue = context._getRequestCookie(langCookieKey, out var hasCookie);

                        if (!string.Equals(cultureResult, cookieValue, StringComparison.InvariantCultureIgnoreCase))
                        {
                            context._addCookieToResponce(langCookieKey, cultureResult);

                            string pathValue;
                            if (Regex.IsMatch(request.Path, ROUTE_CONTAIN_ONLY_LANG_REGEXP))
                            {
                                pathValue = this._getHomeIndexPath(cultureResult);
                            }
                            else
                            {
                                var cr = cultureResult.ToCharArray();
                                var pw = path.Value.ToCharArray();
                                pw[1] = cr[0];
                                pw[2] = cr[1];
                                pathValue = new string(pw);
                            }


                            context._addCookieToResponce(redirectCookieKey, true.ToString());
                            context.Response.Redirect(pathValue, false);
                        }

                    }
                    else if (Regex.IsMatch(request.Path, ROUTE_CONTAIN_WRONG_LANG_FORMAT_REGEXP))
                    {
                        cultureResult = this._getLangFromPath(context);
                        context._addCookieToResponce(langCookieKey, cultureResult);
                        string redirectPath;
                        if (path.Value.Length <= 6)
                        {
                            redirectPath = this._getHomeIndexPath(cultureResult);
                        }
                        else if (path.Value.Substring(1, 6).EndsWith(@"/"))
                        {
                            var returnPath = path.Value.Substring(7) + request.QueryString;
                            redirectPath = $@"/{cultureResult}/{returnPath}/";
                        }
                        else
                        {
                            var returnPath = path.Value.Substring(4);
                            redirectPath = $@"/{cultureResult}/{returnPath}/";
                        }
                        context._addCookieToResponce(redirectCookieKey, true.ToString());
                        context.Response.Redirect(redirectPath, false);

                    }
                    else
                    {
                        cultureResult = this._setAndGetLangToCookie(context, defaultLang, langCookieKey);
                    }

                }

                return await Task.FromResult(new ProviderCultureResult(cultureResult));

            }));
            _configured = true;


        }

        public static string GetCurrentCulture()
        {
            var result = CultureInfo.CurrentCulture.ToString();
            return result.ToLower().Substring(0, 2);
        }
        public static void SetCulture(string langKey)
        {
            var currentCulture = GetCurrentCulture();
            langKey = langKey.ToLower();
            if (langKey == currentCulture) return;

            var ci = new CultureInfo(langKey);
            Thread.CurrentThread.CurrentUICulture = ci;
            Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(ci.Name);
            CultureInfo.DefaultThreadCurrentCulture = CultureInfo.CreateSpecificCulture(ci.Name);
            CultureInfo.DefaultThreadCurrentUICulture = CultureInfo.CreateSpecificCulture(ci.Name);
        }
        public static void SetCulture(LangKeys langKey)
        {
            SetCulture(langKey.ToString());
        }


        #region html Helpers

        public string GetReturnPathView(HttpContext context)
        {
            if (context?.Request == null || context.Request.Path == null || string.IsNullOrWhiteSpace(context.Request.Path.Value))
            {
                return this._getHomeIndexPath(DefaultLang).Substring(3);
            }
            else
            {
                var path = context.Request.Path.Value;
                if (Regex.IsMatch(context.Request.Path.Value, ROUTE_CONTAIN_LANG_REGEXP))
                {
                    if (path.Length <= 3)
                    {
                        return "/";
                    }
                    else
                    {
                        return path.Substring(3);
                    }
                }
                else
                {
                    return path;
                }
            }

        }


        #endregion





    }
    public static class LocalizerServiceExtension
    {
        public static string _getLangFromPath(this ILocalizerService service, HttpContext context)
        {

            var pathSegments = context.Request.Path.Value.Split('/').ToList();

            var path = context.Request.Path.Value;
            return path.Length >= 3 ? context.Request.Path.Value.Substring(1, 2) : service.DefaultLang;
        }
        public static string _setAndGetLangToCookie(this ILocalizerService service, HttpContext context, string defaultLang, string langCookieKey)
        {
            var langNameResult = defaultLang;
            var cookieValue = context._getRequestCookie(langCookieKey, out var hasCookieCulture);
            if (hasCookieCulture)
            {
                langNameResult = cookieValue;
            }
            else
            {
                context._getRequestHeaderValue(HeaderNames.AcceptLanguage, out var hasHeaderCulture1);
                if (hasHeaderCulture1)
                {
                    langNameResult = context._getPriorityClientLangFromRequestHeaders(defaultLang);
                }

            }
            if (!string.Equals(langNameResult, cookieValue, StringComparison.InvariantCultureIgnoreCase))
            {
                context._addCookieToResponce(langCookieKey, langNameResult);
            }

            return langNameResult;
        }

        public static string _getHomeIndexPath(this ILocalizerService service, string lang)
        {
            return $@"/{lang}/";
        }


        #region Localalize collection

        public static Dictionary<GameTranslateType, IReadOnlyDictionary<string, string>> GetGameTranslate(this ILocalizerService localizer)
        {
            var inst = new TranslateCollections();
            return new Dictionary<GameTranslateType, IReadOnlyDictionary<string, string>>
            {
                {GameTranslateType.alliance, inst.AllianceTranslates},
                {GameTranslateType.mapInfo, inst.MapTranslates},
                {GameTranslateType.confederation, inst.ConfederationTranslates},
                {GameTranslateType.journal, inst.JournalTranslates},
                {GameTranslateType.common, inst.CommonTranslates},
                {GameTranslateType.unit, inst.UnitTranslates}
            };
        }


        public static IReadOnlyDictionary<string, string> GetGameTranstaleGroup(this ILocalizerService localizer, GameTranslateType translateType)
        {
            var isnt = new TranslateCollections();

            switch (translateType)
            {
                case GameTranslateType.alliance:
                    return isnt.AllianceTranslates;
                case GameTranslateType.mapInfo:
                    return isnt.MapTranslates;
                case GameTranslateType.confederation:
                    return isnt.ConfederationTranslates;
                case GameTranslateType.journal:
                    return isnt.JournalTranslates;
                case GameTranslateType.common:
                    return isnt.CommonTranslates;
                case GameTranslateType.unit:
                    return isnt.UnitTranslates;
                default:
                    return null;
            }
        }

        public static string GetTranslateName(this ILocalizerService localizer, IReadOnlyDictionary<string, string> translateCollection, string key)
        {
            return translateCollection.ContainsKey(key) ? translateCollection[key] : "";
        }

        public static string GetGameTranslateName(this ILocalizerService localizer, GameTranslateType translateType, string key)
        {
            return localizer.GetTranslateName(localizer.GetGameTranstaleGroup(translateType), key);
        }

        public static string GetGameTranslateName(this ILocalizerService localizer, string translateType, string key)
        {
            GameTranslateType tType;
            return Enum.TryParse(translateType, true, out tType)
                ? localizer.GetTranslateName(localizer.GetGameTranstaleGroup(tType), key)
                : "";
        }

        #endregion



    }



    #endregion


}
