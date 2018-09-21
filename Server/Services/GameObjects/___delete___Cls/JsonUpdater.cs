/*using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Antlr.Runtime.Tree;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace api.skagry.Areas.skagry.Cls
{
    public class JsonUpdater
    {
        public static string UpdateProperty(string jsonString, string property, int value)
        {
//            var jObj = JsonConvert.DeserializeObject(jsonString) as JObject;
            var jObj = JObject.Parse(jsonString);

            if (jObj != null)
            {
                jObj[property] = value;

                return JsonConvert.SerializeObject(jObj);
            }

            return null;
        }
    }
}
*/