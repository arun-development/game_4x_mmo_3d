using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;

namespace Server.Extensions
{
   public static class ClaimsPrincipalExtensions
    {
 
        public static string GetAuthUserId(this ClaimsPrincipal user) { 
 
            return user.FindFirstValue(ClaimTypes.NameIdentifier);
        }
        public static string GetUserName(this ClaimsPrincipal user)
        {
            return user.FindFirstValue(ClaimTypes.Name);
        }
        public static string GetUserEmail(this ClaimsPrincipal user)
        {
            return user.FindFirstValue(ClaimTypes.Email);
        }
    }
}
