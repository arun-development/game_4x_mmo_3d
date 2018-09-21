using System;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace Server.EndPoints.Hubs.GameHub
{
    [AttributeUsage(AttributeTargets.Class, Inherited = false, AllowMultiple = false)]
    //net core https://docs.microsoft.com/en-us/aspnet/signalr/overview/security/hub-authorization
    public sealed class AuthorizeClaimsAttribute : AuthorizeAttribute
    {
        protected   bool UserAuthorized(System.Security.Principal.IPrincipal user)
        {
            if (user == null) throw new ArgumentNullException("user");

            var principal = (ClaimsPrincipal) user;
  
             var authenticated = principal.FindFirst(ClaimTypes.Authentication);
            return authenticated.Value == "true" ? true : false;
        }
    }
}