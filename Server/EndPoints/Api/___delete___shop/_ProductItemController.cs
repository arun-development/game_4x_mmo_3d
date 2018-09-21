using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using DbModels;
using Newtonsoft.Json;
using Store;
using Store.StoreViewModel;
using Error = app.Models.Error;
using TimingDelay = app.Models.TimingDelay;

namespace app.Api.Controllers.Shop
{
    [System.Web.Mvc.Authorize]
    public class ProductItemController : SiteApiController
    {
        //        [HttpGet]
        public object All()
        {
            if (TimingDelay.IsTimingDelay())
            {
                throw new Exception(Error.TimeDelation);
            }

            IEnumerable<ProductItemField> query = DbS.product_item.Select(i => new ProductItemField
            {
                Id = i.Id,
                ProductTypeId = i.product_typeId,
                Property = System.Web.Helpers.Json.Decode(i.property)
                //System.Web.Helpers.Json.Decode(i.property)
            });

            var data = query.ToDictionary(item => item.Id, item => item);

            if (0 < data.Count)
            {
                return Json(data);
            }

            throw new Exception(Error.NoData);
        }
    }
}