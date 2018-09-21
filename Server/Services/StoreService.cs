using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using Dapper;
using Server.Core.Interfaces;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Products;
using Server.DataLayer;
using Server.DataLayer.LocalStorageCaches;
using Server.DataLayer.Repositories;


namespace Server.Services
{
    public partial class StoreService : IStoreService
    {
        #region Currency

        public IList<CurrencyDataModel> GetCurrensies(IDbConnection connection)
        {
            return _currencyCache.LocalGetAll(connection);
        }

        #endregion

        #region Test

        public string Test(string message = "Ok")
        {
            return message;
        }

        #endregion

        #region Declare



        private readonly IUserBalanceCcLocalStorageCache _userBalanceCache;
        private readonly IUserBalanceCcRepository _userBalanceRepo;

        private readonly IJournalBuyLocalStorageCache _journalBuyCache;
        private readonly IJournalBuyRepository _journalBuyRepository;


        private readonly IProductStoreLocalStorageCache _psCache;
        private readonly IProductStoreRepository _psRepo;

        private readonly IProductTypeRepository _ptRepo;
        private readonly IProductTypeLocalStorageCache _ptCache;

        private readonly ITransacationCcRepository _tranCcRepo;

        private readonly IUserChestLocalStorageCache _userChestCache;
        private readonly IUserChestRepository _userChestRepo;

        private readonly IPremiumRepository _premiumRepo;
        private readonly IPremiumLocalStorageCache _premiumCache;
        private readonly ICurrencyLocalStorageCache _currencyCache;

        private readonly ICurrencyRepository _currencyRepo;
        //private readonly IPremiumService _premiumService;


        public StoreService(IProductStoreRepository psRepo,
            IProductStoreLocalStorageCache psCache,
            IProductTypeLocalStorageCache ptCache,

            ITransacationCcRepository tranCcRepo,
            IJournalBuyRepository journalBuyRepository,
            IUserChestLocalStorageCache userChestCache,
            IUserChestRepository userChestRepo,
            IJournalBuyLocalStorageCache journalBuyCache,
            IUserBalanceCcLocalStorageCache userBalanceCache,
            IUserBalanceCcRepository userBalanceRepo,
            IPremiumLocalStorageCache premiumCache,
            IPremiumRepository premiumRepo,
            IProductTypeRepository ptRepo, ICurrencyLocalStorageCache currencyCache, ICurrencyRepository currencyrepo)
        {
            _psRepo = psRepo;
            _psCache = psCache;
            _ptCache = ptCache;
            _tranCcRepo = tranCcRepo;
            _journalBuyRepository = journalBuyRepository;

            _userChestCache = userChestCache;
            _userChestRepo = userChestRepo;
            _journalBuyCache = journalBuyCache;
            _userBalanceCache = userBalanceCache;
            _userBalanceRepo = userBalanceRepo;
            _premiumCache = premiumCache;
            _premiumRepo = premiumRepo;
            _ptRepo = ptRepo;
            _currencyCache = currencyCache;
            _currencyRepo = currencyrepo;
        }


        private IList<StoreViewItem> ProductItems { get; set; }
        private IList<ProductType> RepoList { get; set; }

        #endregion

        #region Product type

        public IList<ProductType> GetProductTypesBaseAll(IDbConnection connection)
        {
            var types = _ptCache.LocalGetAll(connection);
            return types.Select(t => new ProductType
            {
                Id = (ProductTypeIds)t.Id,
                NativeName = t.Name,
                TranslateText = t.Property.TranslateText,
                // todo where ProductType properties??
                //Property = ,
                //ImgCollectionimg = 
            }).ToList();
        }


        public ProductStoreDataModel AddOrUpdateProductItem(IDbConnection connection, ProductStoreDataModel productStoreDataModel)
        {
            ProductItems = null;
            return _psCache.UpdateLocalItem(connection, _psRepo.AddOrUpdateeModel(connection, productStoreDataModel));
        }


        public ProductTypeDataModel GetProductTypeById(IDbConnection connection, byte typeId)
        {
            return _ptCache.GetById(connection, typeId, true);
        }

        public IList<ProductTypeDataModel> GetProductTypes(IDbConnection connection)
        {
            return _ptCache.LocalGetAll(connection);
        }

        public ProductTypeDataModel AddOrUpdateProductType(IDbConnection connection, ProductTypeDataModel dataModel)
        {
            var db = _ptRepo.AddOrUpdateeModel(connection, dataModel);
            return _ptCache.UpdateLocalItem(connection, db);
        }

        #endregion

        #region Store

        public IList<ProductStoreDataModel> GetAllProducts(IDbConnection connection)
        {
            return _psCache.LocalGetAll(connection);
        }



        public ProductStoreDataModel GetProductItem(IDbConnection connection, short productStoreId)
        {
            return _psCache.GetById(connection, productStoreId, true);
        }



        public List<ProductStoreDataModel> SelectProductItems(IDbConnection connection, IEnumerable<short> productIds)
        {
            return productIds.Select(productStoreId => GetProductItem(connection, productStoreId)).ToList();
        }

        public StoreView GetStoreItemsByType(IDbConnection connection, byte typeId)
        {
            return _setAndGetProductItems(connection, false, typeId);
        }

        public StoreView GetStoreAllView(IDbConnection connection)
        {
            return _setAndGetProductItems(connection);
        }

        public short GetMaxStoreId(IDbConnection connection)
        {
            var products = _psRepo.GetAllIds(connection);
            if (products == null || !products.Any())
                return 0;
            return products.Max(i => i);
        }


        private StoreView _setAndGetProductItems(IDbConnection connection, bool update = false, byte? typeId = null)
        {
            if (ProductItems == null || update)
            {
                var storeData = _psCache.LocalWhere(connection, i => i.Trash == false).ToList();
                var tTypes = _ptCache.LocalFlilteredByKeys(connection, storeData.Select(i => i.ProductTypeId));

                ProductItems = storeData.Select(s => new StoreViewItem
                {
                    Active = !s.Trash,
                    Date = s.Date,
                    ProductTypeId = s.ProductTypeId,
                    ProductStoreId = s.Id,
                    ProductCost = (double)s.Cost,
                    ProductCurrencyCode = s.CurrencyCode,
                    ProductItemProperty = s.Property,
                    TypeText = tTypes.First(i => i.Id == s.ProductTypeId).Property.TranslateText
                }).ToList();
            }

            if (RepoList == null || update) RepoList = GetProductTypesBaseAll(connection);
            var result = new StoreView
            {
                SelectList = RepoList.ToList()
            };

            if (typeId == null || typeId == 0)
            {
                result.StoreList = ProductItems.ToList();
                return result;
            }
            result.StoreList = ProductItems.Where(i => i.ProductTypeId == typeId).ToList();
            return result;
        }


        public bool AddProductList(IDbConnection connection, IList<ProductStoreDataModel> items)
        {
            var db = _psRepo.AddOrUpdateAllModels(connection, items);
            var cache = _psCache.UpdateLocalItems(connection, db);
            return cache != null && cache.Any();
        }


        public ProductStoreDataModel GetProductActiveForCcById(IDbConnection connection, short productId)
        {
            var item = _psCache.GetById(connection, productId, true);
            if (item.CurrencyCode != "CC" || item.Trash) return null;
            return item;
        }

        public bool DeleteProductItem(IDbConnection connection, short storeItemId)
        {
            _psRepo.Delete(connection, storeItemId);
            _psCache.DeleteItem(storeItemId);
            return true;
        }

        #endregion

        #region For transaction

        public Dictionary<int, UchNoActiveField> TransactionBuyItemCc(IDbTransaction transaction, TransacationCcDataModel preparedCheckedItem, StoreViewItem storeViewItem)
        {
            IList<UserChestDataModel> newChestItems = null;
            JournalBuyDataModel jBData = null;
            UserBalanceCcDataModel newUserBalanceCc = null;
            var p = _tranCcRepo.Provider;
            var c = transaction.Connection;
            var etTranItem = _tranCcRepo.ConvertToEntity(preparedCheckedItem);
            etTranItem = _tranCcRepo.AddOrUpdate(c, etTranItem);
            var transactionId = etTranItem.Id;

            if (transactionId == 0) throw new NotImplementedException();
            var chestItems = _createListUserChestDataModel(preparedCheckedItem.UserId,
                storeViewItem.ProductStoreId,
                storeViewItem.ProductTypeId,
                transactionId,
                preparedCheckedItem.Quantity,
                UnixTime.ToTimestamp(preparedCheckedItem.DateCreate));


            var insertedChestItems = _userChestRepo.AddOrUpdate(c, _userChestRepo.ConvertToEntities(chestItems), transaction);
            newChestItems = insertedChestItems.Select(i => _userChestRepo.ConvertToWorkModel(i)).ToList();

            jBData = _journalBuySetModel(transactionId);
            var jbEnt = _journalBuyRepository.ConvertToEntity(jBData);
            jbEnt = _journalBuyRepository.AddOrUpdate(c, jbEnt, transaction);
            jBData.Id = jbEnt.Id;

            var balanceTbName = p.GetTableName(nameof(user_balance_cc));
            var balance = c.QuerySingleOrDefault<user_balance_cc>(p.SqlGetById(balanceTbName));
            if (balance == null) throw new NullReferenceException();
            balance.quantity -= (int)preparedCheckedItem.TotalCost;

            var suc = _userBalanceRepo.Update(transaction.Connection, balance, transaction);
            if (!suc)
            {
                throw new NotImplementedException();
            }

            newUserBalanceCc = _userBalanceRepo.ConvertToWorkModel(balance);

            if (newChestItems == null || !newChestItems.Any() || jBData == null || newUserBalanceCc == null)
                throw new NullReferenceException();

            var updatesChestItems = _userChestCache.UpdateLocalItems(c, newChestItems);
            _journalBuyCache.UpdateLocalItem(c, jBData);
            _userBalanceCache.UpdateLocalItem(c, newUserBalanceCc);

            var resultData = updatesChestItems.ToDictionary(i => i.Id, i => new UchNoActiveField
            {
                Id = i.Id,
                Activated = i.Activated,
                DateActivate = i.DateActivate,
                DateCreate = i.DateCreate,
                ProductTypeId = i.ProductTypeId,
                ProductItemProperty = storeViewItem.ProductItemProperty,
                ProductStoreId = i.ProductStoreId
            });

            return resultData;
        }

        public Dictionary<int, UchNoActiveField> BuyProductForCc(IDbTransaction transaction, PaymentCcViewModel model, int currentUserId)
        {
            var random = new Random();
            var quantity = model.Quantity;

            var ps = GetStoreItemsByType(transaction.Connection, model.ProductType);
            var storeItem = ps.StoreList.First(i => i.ProductStoreId == model.ProductStoreId);
            if (storeItem == null) throw new ArgumentNullException(Error.InputDataIncorrect, nameof(storeItem));
            var totalCost = (int)Math.Ceiling(storeItem.ProductCost * quantity);
            if ((int)Math.Floor(Math.Abs(model.TotalCost - totalCost)) > 0)
                throw new ValidationException(Error.InputDataIncorrect);

            var canBuy = false;
            BalanceEnoughCc(transaction.Connection, currentUserId, totalCost, b => { canBuy = b; });
            if (!canBuy) throw new ValidationException(Error.NotEnoughCc);


            var transactionItem = new TransacationCcDataModel
            {
                UserId = currentUserId,
                ProductStoreId = storeItem.ProductStoreId,
                Quantity = quantity,
                TotalCost = totalCost,
                Source = (sbyte)SourceCcChange.BuyStoreItem,
                Token = DateTime.UtcNow.ToString("yyMMddHHmmssffffff") + random.Next(1000, 9999),
                FormToken = model.__RequestVerificationToken,
                DateCreate = DateTime.UtcNow
            };
            return TransactionBuyItemCc(transaction, transactionItem, storeItem);
        }

        #endregion
    }
}