using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Server.Extensions;

namespace Server.Infrastructure {
    public class MvcJsonHtmlData {
        public MvcJsonHtmlData() { }

        public MvcJsonHtmlData(Controller ctrl, string viewName, Dictionary<string, object> advancedData) {
            Html = ctrl.ConvertViewToString(viewName);
            Data = advancedData.ToSerealizeString();
        }

        public string Html { get; set; }
        public string Data { get; set; }
    }
}