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
    [Authorize]
    public class StoreController : SiteApiController
    {
        public IHttpActionResult All()
        {
            if (TimingDelay.IsTimingDelay())
            {
                throw new Exception(Error.TimeDelation);
            }

            IEnumerable<LocalStorageProductItemField> data = DbS.product_store.Where(
                p => p.active == true && p.trash == false)
                .Select(ps => new LocalStorageProductItemField
                {
                    Id = ps.Id,
                    ProductItemId = ps.product_itemId,
                    ProductTypeId = ps.product_typeId,
                    Cost = ps.cost,
                    CurrencyCode = ps.currencyCode,
                    HotOffer = ps.hotOffer
                });

            var store = data.ToDictionary(item => item.Id, item => item);


            if (0 < store.Count)
            {
                return Json(store);
            }

            throw new Exception(Error.NoData);
        }
    }
}