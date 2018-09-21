using System.Web.Http;
using site.Models.Shop;

namespace site.Api.shop
{
    public class PaymentController : SiteApiController
    {
        public  IHttpActionResult GetCurrencyRate(string code)
        {
            var model = new Currency();
            var  result = model.GetRate(code);

            return Json(result);
        }
     
        public IHttpActionResult GetCurrencyList()
        {
            var currency = new Currency();

            return Json(currency.GetCurrencyList());
        }

        public IHttpActionResult GetPaymentSystemList()
        {
            var paymentSystem = new PaymentSystem();

            return Json(paymentSystem.GetPaymentSystemList());
        }
    }
}
