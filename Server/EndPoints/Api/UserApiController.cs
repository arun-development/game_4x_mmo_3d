using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.Core.СompexPrimitive.Products;
using Server.ServicesConnected.Auth.Static;

namespace Server.EndPoints.Api
{
    
    [Authorize(Roles = MainRoles.User)]
    [Route("api/user/[action]")]
    public class UserApiController : DefaultApiController
    {
        #region Declare

        private readonly IGameUserService _gameUserService;
        private readonly IStoreService _storeService;

        public UserApiController(IServiceProvider serviceProvider) : base(serviceProvider)
        {
            _gameUserService = serviceProvider.GetService<IGameUserService>();
            _storeService = serviceProvider.GetService<IStoreService>();
        }

        #endregion

        [HttpGet]
        // [ApiAntiForgeryValidate]
        public IActionResult GetUserChest()
        {
            var chest = _dbProvider.ContextAction(c =>
            {
                var user = _gameUserService.GetCurrentGameUser(c, User);
                return _storeService.GetChestUser(c, user.Id);
            });
            return Json(chest);
        }

        [HttpGet]
        //  [ApiAntiForgeryValidate]
        public IActionResult ActivateChestItem(int chestId)
        {
            var chestItem = _dbProvider.ContextAction(c =>
            {
                var user = _gameUserService.GetCurrentGameUser(c, User);
                return _storeService.ActivateChestItem(c, chestId, user.Id);
            });

            return Json(chestItem);
        }

        [HttpGet]
        //  [ApiAntiForgeryValidate]
        public IActionResult GetUserBalance(string id = null)
        {
            int gameId;
            var balanceCc = _dbProvider.ContextAction(c =>
            {
                if (id == null)
                {
                    var user = _gameUserService.GetCurrentGameUser(c, User);
                    gameId = user.Id;
                }
                else
                {
                    gameId = _gameUserService.GetGameUserId(c, id);
                }
                return _storeService.BalanceGetCc(c, gameId);
            });


            return Json(balanceCc);
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult IsAuthenticated() => Json(new
        {
            auth = User.Identity.IsAuthenticated
        });

        [HttpPost]
        public IActionResult BuyProduct(PaymentCcViewModel model)
        {
            Dictionary<int, UchNoActiveField> result = null;
            _dbProvider.Transaction(transaction =>
            {
                var user = _gameUserService.GetCurrentGameUser(transaction.Connection, User);
                result = _storeService.BuyProductForCc(transaction, model, user.Id);
            });

            return Json(result);
        }
    }
}