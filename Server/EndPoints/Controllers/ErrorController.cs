using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Server.Extensions;
using Server.ServicesConnected.Auth.Models;

namespace Server.EndPoints.Controllers
{
    public class ErrorController : Controller
    {
        // GET: Error
        [Route("[controller]")]
        [Route("{lang}/[controller]")]
        [Route("[controller]/[action]")]
        [Route("{lang}/[controller]/[action]")]
        public ActionResult Default()
        {
            ViewData._setTitle("Error");
            return View("Error");
        }



        [Route("Error/Error500")]
        [Route("{lang}/Error/Error500")]
        public ActionResult Error500()
        {
            ViewData._setTitle("Error500");
            return View("Error500");
        }

        [Route("Error/GameNotAvailable")]
        [Route("{lang}/Error/GameNotAvailable")]
        public ActionResult GameNotAvailable()
        {
            ViewData._setTitle("GameNotAvailable");
            return View("GameNotAvailable");
        }

        [Route("[controller]/[action]")]
        [Route("{lang}/[controller]/[action]")]
        public ActionResult ManageLogins() => RedirectToAction("Default");

        [Route("[controller]/[action]")]
        [Route("{lang}/[controller]/[action]")]
        public ActionResult VerifyPhoneNumber() => RedirectToAction("Default");

        [Route("[controller]/[action]")]
        [Route("{lang}/[controller]/[action]")]
        public ActionResult DevError(ErrorViewModel model = null)
        {
            ViewData._setTitle("DevError");

            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

    }
}