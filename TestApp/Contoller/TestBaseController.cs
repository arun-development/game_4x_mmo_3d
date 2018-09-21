using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace TestApp.Contoller
{
    public class TestBaseController : Controller
    {
        public TestBaseController()
        {
            ControllerContext = new ControllerContext {HttpContext = new DefaultHttpContext()};
        }
    }
}