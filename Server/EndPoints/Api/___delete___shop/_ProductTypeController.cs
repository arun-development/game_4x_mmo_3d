using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using DbModels;
using Store.StoreViewModel;
using Error = app.Models.Error;
using TimingDelay = app.Models.TimingDelay;


namespace app.Api.Controllers.Shop
{
    [System.Web.Mvc.Authorize]
    public class ProductTypeController : SiteApiController
    {
   //        [HttpGet]
        public object All()
        {

            if (TimingDelay.IsTimingDelay())
            {
                throw new Exception(Error.TimeDelation);

            }

            IEnumerable<TypeProductField> query = DbS.product_type.Select(i => new TypeProductField
            {
                Id= i.Id,
                NativeName = i.Name,
                Property = 
                System.Web.Helpers.Json.Decode(i.property)
            });


           var data = query.ToDictionary<TypeProductField, int, TypeProductField>(item => item.Id, item => item);

            if (0 < data.Count)
            {

                return Json(data);
            }
            throw new Exception(Error.NoData);

        }

    }
}
