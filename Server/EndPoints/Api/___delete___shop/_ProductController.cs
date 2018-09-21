using System.Web.Http;
using site.Models.Shop;

namespace site.Api.shop
{
    public class ProductController : SiteApiController
    {
        public IHttpActionResult GetById(int id)
        {
       
        return Json(new Store().GetProductItemById(id));
        }
    }
}
