using System;
using System.Data;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Mvc.ViewFeatures.Internal;
using Microsoft.Extensions.DependencyInjection;
using Server.Infrastructure;

namespace Server.Extensions
{
    public static class CtrlExtensions
    {
        public static string ConvertViewToString(this Controller ctrl, string partialViewPath, object data = null)
        {
            var partialView = ctrl.PartialView(partialViewPath, data);
            var actionContext = ctrl.ControllerContext;
            string result = "";
            using (var writer = new StringWriter())
            {
                var services = actionContext.HttpContext.RequestServices;
                var executor = services.GetRequiredService<PartialViewResultExecutor>();
                var view = executor.FindView(actionContext, partialView).View;
                var viewContext = new ViewContext(actionContext, view, partialView.ViewData, partialView.TempData,
                    writer, new HtmlHelperOptions());
                view.RenderAsync(viewContext).GetAwaiter().GetResult();
                result = writer.ToString().Replace("\r","").Replace("\n","");
            }
         
            return result;
        }

        public static void   AddGameVars(this Controller ctrl, IDbConnection connection, IServiceProvider svp)
        {
            var viewData = ctrl.ViewData;
            if (viewData == null) return;
            if (!viewData.ContainsKey(PageKeyVal.AppVars))
            {

                var data = svp.GetService<IAppVarsReader>().Create(connection).ToSerealizeString();
                viewData.Add(PageKeyVal.AppVars, data);
            }
        }
    }
}