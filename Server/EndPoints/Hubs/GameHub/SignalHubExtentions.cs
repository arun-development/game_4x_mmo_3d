using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Server.EndPoints.Hubs.GameHub
{
    internal static class SignalHubExtentions
    {
        public static Task InvokeAsync(this IClientProxy inst, string clientMethodName, params object[] arguments) => inst.SendCoreAsync(clientMethodName, arguments);



    }
}