using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.DataLayer;
using Server.Extensions;
using Server.Infrastructure;
using Server.Services;
using Server.ServicesConnected.Auth.Models;
using Server.ServicesConnected.Auth.Static;

namespace Server.EndPoints.Controllers
{
    [Authorize(Roles = MainRoles.User)]
    public class GameController : DefaultController
    {
        private readonly IGameRunner _gameRunner;
        private readonly IGameUserService _gameUserService;
        private readonly UserManager<ApplicationUser> _userManager;

        public GameController(IServiceProvider serviceProvider, IGameUserService gameUserService, UserManager<ApplicationUser> userManager) : base(serviceProvider)
        {
            _gameUserService = gameUserService;
            _userManager = userManager;
            _gameRunner = _svp.GetService<IGameRunner>();
        }
        
        [IgnoreAntiforgeryToken]
        [Route("[controller]")]
        [Route("{lang}/[controller]")]
        [Route("[controller]/[action]")]
        [Route("{lang}/[controller]/[action]")]
        public async Task<IActionResult> Index(string returnUrl, bool? type = null, int? id = null)
        {

            if (!_gameRunner.CahceInitialized)
            {
                if (User.IsInRole(MainRoles.Root))
                {
                    return RedirectToAction("Index", "AdminInitialize");
                }
                return RedirectToAction("GameNotAvailable", "Error");
            }
            var user = await _userManager.GetUserAsync(User);
            if (!user.EmailConfirmed)
            {
                
            }
 
                   //    var gameUser = _gameUserService.GetGameUser();

            var provider = _svp.GetService<IDbProvider>();
            var gamUserInitializer = _svp.GetService<IUserInitializer>();

            ViewData._setMetaDescription("Game Skagry");
            ViewData._setAngularAppName(PageKeyVal.AngularAppGame);
            return View();
        }


    }


}