using System;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Server.Infrastructure;
using Server.Modules.Localize;

namespace Server.Extensions
{
    public static class ViewHtmlExtentions
    {
        public static HtmlString GenerateHrefLangs(this IHtmlHelper helper, Uri absolutePath)
        {

            var str = "";
            foreach (var langItem in L10N.SupportedCulture)
            {
                var uri = absolutePath.CreateLocalizedUri(langItem);
                str += $@"<link rel='alternate' hreflang='{langItem}' href='{uri.OriginalString}' />";
            }
            return new HtmlString(str);
        }

        public static bool _isAngularApp(this ViewDataDictionary viewData)
        {
            return viewData.ContainsKey(PageKeyVal.AngularAppKey);
        }
        public static string _getAppVars(this ViewDataDictionary viewData)
        {
            return viewData.ContainsKey(PageKeyVal.AppVars) ? (string)viewData[PageKeyVal.AppVars] : null;
        }
        public static string _getAngularAppKey(this ViewDataDictionary viewData)
        {
            return (string)viewData[PageKeyVal.AngularAppKey];
        }
        //showHeader
        public static bool _showHeader(this ViewDataDictionary viewData)
        {
            var showHeader = true;
            if (viewData.ContainsKey(PageKeyVal.NotShowHeaderKey))
            {
                showHeader = !(bool)viewData[PageKeyVal.NotShowHeaderKey];
            }
            return showHeader;
        }

        public static string _getPageCssClass(this ViewDataDictionary viewData)
        {
            var pageCssClass = "default-page";
            if (viewData.ContainsKey(PageKeyVal.BodyCssKey))
            {
                pageCssClass = viewData[PageKeyVal.BodyCssKey].ToString();

            }
            return pageCssClass;
        }

        public static bool _isHomePage(this ViewDataDictionary<dynamic> viewData)
        {
            return viewData.ContainsKey(PageKeyVal.PageNameKey) &&
                   viewData[PageKeyVal.PageNameKey].ToString() == PageKeyVal.HomePageVal;


        }
        public static string _getTitle(this ViewDataDictionary<dynamic> viewData)
        {
            if (viewData.ContainsKey(PageKeyVal.PageTitleKey))
            {
                return (string)viewData[PageKeyVal.PageTitleKey];
            }
            return "Game";
        }
        public static string _getMetaDescription(this ViewDataDictionary<dynamic> viewData)
        {
            if (viewData.ContainsKey(PageKeyVal.PageMetaDescriptionKey))
            {
                return (string)viewData[PageKeyVal.PageMetaDescriptionKey];
            }
            return "4X stratege Game";
        }
        public static void _setTitle(this ViewDataDictionary viewData, string title)
        {
            viewData[PageKeyVal.PageTitleKey] = title;
        }
        public static void _setMetaDescription(this ViewDataDictionary viewData, string metaDescription)
        {
            viewData[PageKeyVal.PageMetaDescriptionKey] = metaDescription;
        }
        public static void _setAngularAppName(this ViewDataDictionary viewData, string angularAppName)
        {

            viewData[PageKeyVal.AngularAppKey] = angularAppName;

        }

    }
}