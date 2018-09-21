using System;
using System.Collections.Generic;
using System.Data;
using Server.Core.СompexPrimitive.Products;
using Server.DataLayer;

namespace Server.Core.Interfaces
{
    public interface IStoreService : IStorePremium<int, UserPremiumDataModel>,
        IStoreChest<int, UserChestDataModel>,
        IStoreJournalBuy<int, JournalBuyDataModel>,
        IStoreBalancecc<int, UserBalanceCcDataModel>
    {
 
        ProductStoreDataModel GetProductItem(IDbConnection connection, short productStoreId);
 
        List<ProductStoreDataModel> SelectProductItems(IDbConnection connection, IEnumerable<short> productIds);
        StoreView GetStoreItemsByType(IDbConnection connection, byte typeId);
        StoreView GetStoreAllView(IDbConnection connection);
        short GetMaxStoreId(IDbConnection connection);

        ProductStoreDataModel GetProductActiveForCcById(IDbConnection connection, short productId);

        bool AddProductList(IDbConnection connection, IList<ProductStoreDataModel> items);
        IList<ProductType> GetProductTypesBaseAll(IDbConnection connection);
        bool DeleteProductItem(IDbConnection connection, short storeItemId);
        ProductStoreDataModel AddOrUpdateProductItem(IDbConnection connection, ProductStoreDataModel productStoreDataModel);
        IList<ProductStoreDataModel> GetAllProducts(IDbConnection connection);

        #region Product Type

        ProductTypeDataModel GetProductTypeById(IDbConnection connection, byte typeId);
        IList<ProductTypeDataModel> GetProductTypes(IDbConnection connection);
        ProductTypeDataModel AddOrUpdateProductType(IDbConnection connection, ProductTypeDataModel dataModel);

        #endregion

        #region For transaction

        Dictionary<int, UchNoActiveField> TransactionBuyItemCc(IDbTransaction transaction, TransacationCcDataModel preparedCheckedItem, StoreViewItem storeViewItem);

        Dictionary<int, UchNoActiveField> BuyProductForCc(IDbTransaction transaction, PaymentCcViewModel model, int currentUserId);

        #endregion

        #region Currency

        IList<CurrencyDataModel> GetCurrensies(IDbConnection connection);

        #endregion
    }


    public interface IStoreBalancecc<TPrimaryKeyType, TDataModel>
    {
        #region Sync
        TDataModel BalanceGet(IDbConnection connection, TPrimaryKeyType userId);

        int BalanceGetCc(IDbConnection connection, TPrimaryKeyType userId);


        /// <summary>
        /// 
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="userBalanceModel"></param>
        /// <param name="value"></param>
        /// <exception cref="Exception">when balance cc -value less 0 Error.NotEnoughCc</exception>
        /// <returns></returns>
        TDataModel BalanceCalcResultCc(IDbConnection connection, TDataModel userBalanceModel, int value);

        /// <summary>
        ///     Проверяет баланс и возвращает новое значение. В базу значение не записывает
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="userId"></param>
        /// <param name="value"></param>
        /// <exception cref="Exception">when balance cc -value less 0 Error.NotEnoughCc</exception>
        /// <returns></returns>
        TDataModel BalanceCalcResultCc(IDbConnection connection, TPrimaryKeyType userId, int value);


        TDataModel BalanceEnoughCc(IDbConnection connection, TPrimaryKeyType userId, int cost, Action<bool> enoughCc, bool asNew = false);
        bool BalanceEnoughCc(IDbConnection connection, TDataModel dataModel, int cost);


        TDataModel BalanceCreateСсCount(IDbConnection connection, TPrimaryKeyType userId, int defaultBalance = 1000);

        /// <summary>
        ///     Добавляет или отнимает по оператору  к текущему балансу
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="userId"></param>
        /// <param name="value"></param>
        /// <param name="operation"></param>
        /// <returns type="int">BalanceCc.Id</returns>
        /// if success else 0
        TDataModel BalanceUpdate(IDbConnection connection, TPrimaryKeyType userId, int value, sbyte operation);

        TDataModel AddOrUpdateBalance(IDbConnection connection, TDataModel dataModel);
        #endregion
 
    }

    public interface IStoreChest<TPrimaryKeyType, TDataModel>
    {

        #region Sync
        #region Chest

        //chest
        void SetChestItemFinished(IDbConnection connection, TPrimaryKeyType chestId);
        List<TDataModel> GetChestNotFinished(IDbConnection connection, int userId);
        List<TDataModel> GetActiveBosters(IDbConnection connection, int userId);

        #endregion

        #region ChestHelper

        UchView GetChestUser(IDbConnection connection, int userId);
        UchActiveItemView ActivateChestItem(IDbConnection connection, int chestId, int userId);
        //void UpdateChest(product_item item, Action<product_item> action);

        #endregion



        #endregion

    }


    public interface IStoreJournalBuy<TPrimaryKeyType, TDataModel>
    {
        //sync
        TDataModel JournalBuyAddCcBuy(IDbConnection connection, int transactionId, IDbTransaction tran = null);
    }


    public interface IStorePremium<TPrimaryKeyType, TDataModel>
    {
        #region Premium sync

        TDataModel GetUserPremium(IDbConnection connection, TPrimaryKeyType userId);
        IList<TDataModel> GetPremiumList(IDbConnection connection, List<TPrimaryKeyType> userIds);
            IList<TDataModel> GetAllPremiums(IDbConnection connection);
        TDataModel AddOrUpdatePremium(IDbConnection connection, TDataModel dataModel);
        UserPremiumDataModel GetOrUpdatePremium(IDbConnection connection, int userId);
        UserPremiumWorkModel GetPremiumWorkModel(IDbConnection connection, int userId);

        #endregion
    }
}