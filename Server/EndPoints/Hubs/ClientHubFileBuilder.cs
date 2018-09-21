using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using Server.EndPoints.Hubs.GameHub;
using Server.Extensions;

namespace Server.EndPoints.Hubs
{
    public static class ClientHubFileBuilder
    {
        public static void CreateTestCient()
        {
            _createHubClient(typeof(MyTestHub.MyTestHub));
        }
        public static void CreateMainGameHubCient()
        {
            _createHubClient(typeof(MainGameHub));
        }


        private static void _createHubClient(Type clietnHubClass)
        {
            var type = clietnHubClass;
            var hubName = type.Name;
            var data = type.GetMethods(BindingFlags.Instance | BindingFlags.DeclaredOnly | BindingFlags.Public).Select(
                i =>
                {
                    var list = new List<string> {i.Name};
                    list.AddRange(i.GetParameters().OrderBy(j => j.Position).Select(j => j.Name));
                    return list;
                }).ToList();
            const string br = "\n";
            var body = br;
            foreach (var method in data)
            {
                var args = "";
                if (method.Count > 1)
                {
                    var col = method.GetRange(1, method.Count - 1);
                    args = col.Aggregate(args, (current, t) => current + (t + ','));
                    if (args.Length > 1)
                        args = args.Remove(args.Length - 1);
                }
                var methodName = method[0];
                var lowerMethodName = methodName.FirstToLower();
            body +=
                    $@"hub.server['{lowerMethodName}'] = function({args}) {{return hub.invoke.apply(hub, $.merge(['{
                            methodName
                        }'], $.makeArray(arguments)));}};{br}";
            }

            var code = $"(function (signalR,$) {{{br}" +
                       $"signalR.create{hubName} = function (loglevel) {{{br}" +  
                       $"if (!loglevel) {{{br}" +
                       $"loglevel = signalR.LogLevel.Information;{br}" +
                       $"}}{br}" +       
                       $"var hub = new signalR.HubConnectionBuilder(){br}.withUrl('/hub/{hubName}'.toLowerCase()){br}.configureLogging(loglevel){br}.build();{br}" +
                       $"hub.server = {{}};{br}" +
                       $"hub.client = {{}};{br}" +
                       $"{body}return hub;{br}" +
                       $"}}}})(signalR,jQuery);" +
                       $"{br}";


            //replase that string for your path
            var tmpRoot = @"C:/Users/Arun/Source/Repos/skagry_pull/skagry_public/Server/EndPoints/Hubs/";
            var dir = tmpRoot + "client-dist/";
            var path = dir + $"{hubName.ToLower()}.js";
            File.WriteAllText(path, code);
        }
    }
}