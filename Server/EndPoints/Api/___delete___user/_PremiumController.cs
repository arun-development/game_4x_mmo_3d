using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using app.Models.User.Chest;
using Microsoft.AspNet.Identity;
using SiteModel;
using SiteModel.Errors;

namespace app.Api.Controllers.user.Chest
{
    [Authorize]
    public class PremiumController : ApiController
    {
        private SiteDataContext _db = new SiteDataContext();

        public IHttpActionResult UserPremiumData()
        {
            var _controllerName = ControllerContext.ControllerDescriptor.ControllerName;
            Dictionary<string, dynamic> result = new Dictionary<string, dynamic>();

            if (TimingDelay.IsTimingDelay(_controllerName))
            {
      
                return Json(TimingDelay.CreateErrorMessage(_controllerName));
            }

            try
            {
                string userId = User.Identity.GetUserId();
                var Pf = new UserChestPremiumType();
                var q = _db.premium.Single(p => p.user_id == userId && p.endTime > DateTime.UtcNow);
                if (q != null)
                {
                    Pf.DateEndTime = q.endTime;
                    Pf.PremiumId = q.Id;
                    Pf.Activated = true;

                    result.Add("data", Pf);

                    return Json(result);
                }
                result.Add("error", Error.GetError("Premium is not exsist", ControllerContext.ControllerDescriptor.ControllerName));
                return Json(result);
            }

            catch (Exception)
            {
                result.Add("error", Error.GetError("Db Error", ControllerContext.ControllerDescriptor.ControllerName));
                return Json(result);
            }
        }
    }
}