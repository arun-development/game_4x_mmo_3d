using System.Collections;
using System.Collections.Generic;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using app.Models;
using app.Models.Shop;
using app.Models.User.Chest;

namespace site.Api.user
{
    /// <summary>
    /// Контроллер для работы с предметами пользователя(сундук)
    /// </summary>
    [Authorize]
    public class UserChestController : ApiController

    {
        /// <summary>
        /// Константы для Каждого конкретного типа продукта
        /// </summary>
        protected const int MONEY_SG_TYPE = 1;
        protected const int PREMIUM_TYPE = 2;
        protected const int ACCOUNT_TYPE_SERVICE = 3;
        protected const int BOOSTER_TYPE = 4;
        protected const int SKIN_TYPE = 5;

        /// <summary>
        /// Получает все купленные неактивированные пользователем продуктов 
        /// </summary>
        /// <param name="active">Статус активациии таблице user_chest (Не активный)</param>
        /// <param name="lang">Локаль для перевода описания и имени продукта</param>
        /// <returns>Список не активированных продуктов</returns>
        public IHttpActionResult GetChestInactiveItems(bool active = false, string lang = "EN")
        {
            string userId = User.Identity.GetUserId();

            var result = new Dictionary<int, ChestFields>();

            UserChest userChest = _getModel();

            var chestItems = userChest.GetCountProductId(userId, active);

            foreach (ChestFields chestItem in chestItems)
            {
                var productId = chestItem.ProductId;
                var productCount = chestItem.Count;
                ChestFields productProperties = userChest.GetProductProperties(productId, productCount, lang.ToUpper());

                result.Add(productId, productProperties);
            }


//            result.Add("chestItems", _getModel().ChestInactiveItems(userId));
//            result.Add("chestItemCounts", chestItems);
//
//            var store = new Store();
//            var chestItemProperties = new ArrayList();
//
//            foreach (ChestFields chestItem in chestItems)
//            {
//               chestItemProperties.Add(store.GetPropertyById(chestItem.ProductId));
//            }
//            result.Add("chestItemDescriptions", chestItemProperties);

            return Json(result);
        }

        /// <summary>
        /// Получает список активированных продуктов для пользователя, в виде обекта с ключами по типу продукта (см константы)
        /// </summary>
        /// <param name="active">Статус активациии в таблице user_chest (Активный)</param>
        /// <param name="lang">Локаль для перевода описания и имени продукта</param>
        /// <returns>Типизированный Список активированных продуктов</returns>
        public IHttpActionResult GetChestActivatedItems(bool active = true, string lang = "EN")
        {
            string userId = User.Identity.GetUserId();
            var productTypes = _getModel().ChestActivateTypes(userId);

            var result = new Dictionary<int, dynamic>();
            var errors = new ArrayList();

            foreach (int productType in productTypes)
            {
                if (MONEY_SG_TYPE == productType)
                {
                    return Json("MONEY_SG_TYPE");
                }

                else if (PREMIUM_TYPE == productType)
                {
                    var premium = new Premium();

                    result.Add(PREMIUM_TYPE, premium.GetUserPremiumInfo(userId, productType));
                }

//                else if (ACCOUNT_TYPE_SERVICE == productType)
//                {
//                    return Json(productType);
//                }
                else if (BOOSTER_TYPE == productType)
                {
                    result.Add(BOOSTER_TYPE, Booster.GetUserBoosterInfo(userId));
                }
//                else if (SKIN_TYPE == productType)
//                {
//                    return Json(productType);
//                }
            }

            if (0 < errors.Count)
            {
                result.Add(-1, errors);
            }

            return Json(result);
        }

        /// <summary>
        /// Активирует продукты пользователя по запросу, втсавляет данные в  соответствующую таблицу исходя из типа продукта, и устанавливает типизированные свойства продукта
        /// </summary>
        /// <param name="data">Данные товара которые нужно активировать приходящие от пользователя</param>
        /// <returns>Ошибки если данные не записались в базу</returns>
        [HttpPost]
        public IHttpActionResult PostActivateProduct(ActivateUserProduct data)
        {
            //Todo  доабвить локаль для перевода


            string userId = User.Identity.GetUserId();

            Store store = new Store();
            StoreItem parameters = store.GetProductParametersByProductId(data.ProductId);

            int productType = parameters.product_typeId;
            Dictionary<string, dynamic> properties = System.Web.Helpers.Json.Decode(parameters.property);
       
            UserChest userChest = new UserChest();
            ChestFields chestItem = userChest.GetChestData(userId, data.ProductId, false);

            if (MONEY_SG_TYPE == productType)
            {
                return Json("MONEY_SG_TYPE");
            }
            else if (PREMIUM_TYPE == productType)
            {
                Premium premium = new Premium();
                premium.InitializePremium(userId, chestItem.Id, properties);
            }

//            else if (ACCOUNT_TYPE_SERVICE == productType)
//            {
//                return Json(productType);
//            }
            else if (BOOSTER_TYPE == productType)
            {

                Booster booster = new Booster();
                booster.InitializeBooster(userId, chestItem, parameters, data.ProductId);
            }
            //            else if (SKIN_TYPE == productType)
            //            {
            //                return Json(productType);
            //            }

            var chestItems = userChest.GetCountProductId(userId, false);
            var result = new Dictionary<int, ChestFields>();
            foreach (ChestFields chstItem in chestItems)
            {
                var productId = chstItem.ProductId;
                var productCount = chstItem.Count;
                ChestFields productProperties = userChest.GetProductProperties(productId, productCount, data.Lang.ToUpper());

                result.Add(productId, productProperties);
            }

            return Json(result);
        }

        /// <summary>
        /// модель для запросов к сундуку пользователя
        /// </summary>
        /// <returns>модель</returns>
        protected UserChest _getModel()
        {
            return new UserChest();
        }
    }
}

