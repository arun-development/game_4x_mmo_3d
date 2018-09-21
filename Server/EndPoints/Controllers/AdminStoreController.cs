using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Server.Core.Images;
using Server.Core.Interfaces;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Products;
using Server.DataLayer;
using Server.Extensions;
using Server.Infrastructure;
using Server.ServicesConnected.Auth.Static;
using Server.ServicesConnected.AzureStorageServices.ImageService;

namespace Server.EndPoints.Controllers
{
    [Authorize(Roles = MainRoles.RDD)]
    public class AdminStoreController : DefaultController
    {
        #region Declare

 

        private readonly IStoreService _storeService;

        public AdminStoreController(IServiceProvider serviceProvider) : base(serviceProvider)
        {
            _storeService = _svp.GetService<IStoreService>();
        }

        #endregion

        // GET: AdminStore
        [Route("[controller]")]
        [Route("{lang}/[controller]")]
        [Route("[controller]/[action]")]
        [Route("{lang}/[controller]/[action]")]
        public IActionResult Index()
        {
            ViewData[PageKeyVal.PageNameKey] = PageKeyVal.AdminStorePageVal;
            ViewData[PageKeyVal.BodyCssKey] = PageKeyVal.AdminStoreBodyCssVal;

            var storeData = _dbProvider.ContextAction(_getStoreData);
            ViewData[PageKeyVal.AdminStoreDataKey] = storeData.ToSerealizeString();
            ViewData[PageKeyVal.NotShowHeaderKey] = true;
            ViewData[PageKeyVal.AngularAppKey] = PageKeyVal.AngularAppAdmin;


            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> CreateNewProductItem(AdminStoreItem newProductItem)
        {
            // newProductItem.DateCreate = UnixTime.UtcNow();
            var newAdminItem = await _dbProvider.ContextActionAsync(async connection =>
            {
                var maxId = _storeService.GetMaxStoreId(connection);
                maxId++;
                newProductItem.Id = maxId;
                var fullProductUrl = await _saveToCdnAndGetUrl(newProductItem);
                object props = new { };
                switch (newProductItem.ProductType.Id)
                {
                    case (byte) ProductTypeIds.Premium:
                        props = ProductPropertyHelper.CreatePremuiumProperties(
                            UnixTime.OneDayInSecond * newProductItem.Duration.Days);
                        break;
                    case (byte) ProductTypeIds.Booster:

                        var boosterProps = newProductItem.Properties
                            .ToSerealizeString()
                            .ToSpecificModel<List<string>>()[0]
                            .ToSpecificModel<BoosterProductProperty>();
                        boosterProps.Duration = UnixTime.OneDayInSecond * newProductItem.Duration.Days;
                        props = boosterProps;
                        break;
                }

                var newProductStoreDataModel = new ProductStoreDataModel
                {
                    Id = newProductItem.Id,
                    Property = new ProductItemProperty
                    {
                        ImgCollectionImg = new ImgCollectionField
                        {
                            Store = fullProductUrl,
                            Chest = fullProductUrl
                        },
                        TranslateText = newProductItem.L10N,
                        Property = props
                    },
                    ProductTypeId = (byte) newProductItem.ProductType.Id,
                    Trash = !newProductItem.Active,
                    Cost = (decimal) newProductItem.Price,
                    Date = DateTime.UtcNow,
                    CurrencyCode = newProductItem.Currency.Name
                };

                var newItem = _storeService.AddOrUpdateProductItem(connection, newProductStoreDataModel);
                return new AdminStoreItem(newItem, new AdminStoreData());
            });

            return Json(newAdminItem);
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> UpdateProductItem(AdminStoreItem productItem)
        {
            var newAdminItem = await _dbProvider.ContextActionAsync(async connection =>
            {
                var dbItem = _storeService.GetProductItem(connection, productItem.Id);
                dbItem.Trash = !productItem.Active;
                dbItem.Cost = (decimal) productItem.Price;
                dbItem.Property.TranslateText = productItem.L10N;
                if (productItem.Base64Images != null && productItem.Base64Images.Any() &&
                    !string.IsNullOrWhiteSpace(productItem.Base64Images[0]))
                {
                    var fullProductUrl = await _saveToCdnAndGetUrl(productItem);
                    dbItem.Property.ImgCollectionImg = new ImgCollectionField
                    {
                        Store = fullProductUrl,
                        Chest = fullProductUrl
                    };
                }
                if (productItem.Properties != null)
                {
                    switch (productItem.ProductType.Id)
                    {
                        case (byte) ProductTypeIds.Booster:

                            var boosterProps = productItem.Properties
                                .ToSerealizeString()
                                .ToSpecificModel<List<string>>()[0]
                                .ToSpecificModel<BoosterProductProperty>();

                            boosterProps.Duration = UnixTime.OneDayInSecond * productItem.Duration.Days;
                            dbItem.Property.Property = boosterProps;
                            break;
                    }
                }
                var updatedData = _storeService.AddOrUpdateProductItem(connection, dbItem);
                return new AdminStoreItem(updatedData, new AdminStoreData());
            });

            return Json(newAdminItem);
        }

        [HttpDelete]
        [ValidateAntiForgeryToken]
        public JsonResult DeleteProductItem(short productStoreId)
        {
            var r = _dbProvider.ContextAction(connection =>
                _storeService.DeleteProductItem(connection, productStoreId));
            return Json(r);
        }


        private async Task<string> _saveToCdnAndGetUrl(AdminStoreItem newProductItem)
        {
            var fullProductUrl = StoreBlobLoader.CreateProudctItemImageUrl(newProductItem.Id, ImageSuportedFormats.Jpg);
            var format = StoreBlobLoader.GetFormat(ImageSuportedFormats.Jpg);
            var sbl = new StoreBlobLoader();
            await sbl.SaveFromB64Async(newProductItem.Base64Images[0], fullProductUrl, format);
            return fullProductUrl;
        }

        private AdminStoreData _getStoreData(IDbConnection connection)
        {
            var storeData = new AdminStoreData();
            var products = _storeService.GetAllProducts(connection);
            storeData.ProductItems = products.OrderBy(i => i.Id).Select(i => new AdminStoreItem(i, storeData)).ToList();
            return storeData;
        }
    }
}