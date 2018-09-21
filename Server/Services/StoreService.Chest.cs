using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Products;
using Server.DataLayer;

namespace Server.Services
{
    public partial class StoreService
    {
        #region Chest

        private IList<UserChestDataModel> _createListUserChestDataModel(int userId, short productId, byte productTypeId, int transactionCcId, int quantity, int time)
        {
            var list = new List<UserChestDataModel>();

            for (var i = 0; i < quantity; i++)
            {
                var item = new UserChestDataModel
                {

                    UserId = userId,
                    DateCreate = time,
                    ProductTypeId = productTypeId,
                    ProductStoreId = productId,
                    Finished = false,
                    Activated = false,
                    TransactionsgId = transactionCcId
                };
                list.Add(item);
            }
            return list;

        }

        public void SetChestItemFinished(IDbConnection connection, int chestId)
        {
            var chestItem = _userChestCache.GetById(connection,chestId, true);
            if (chestItem.Id == 0 || chestItem.Finished) return;
            chestItem.Finished = true;
            _userChestCache.UpdateLocalItem(connection,_userChestRepo.AddOrUpdateeModel(connection,chestItem));
        }

        public List<UserChestDataModel> GetChestNotFinished(IDbConnection connection, int userId)
        {
            var ci = _userChestRepo.GetChestItems(connection, userId).ToList();
            var chestItems = _userChestRepo.ConvertToWorkModel(ci);
            var finishedIds = chestItems.Where(i => i.Finished).Select(i => i.Id).ToList();
            _userChestCache.DeleteItems(finishedIds);
            return chestItems.Where(i => !i.Finished).ToList();
        }

        #endregion

        #region ChestHelper

        /// <summary>
        /// Собирает модель честа
        /// Примечание :
        /// Активные эллементы  которые стакаются по типу буерут описания и свойства из типа а не из продукта.
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public UchView GetChestUser(IDbConnection connection, int userId)
        {
            try
            {
                var result = new UchView
                {
                    All =   GetChestNotFinished(connection, userId),
                    ActivatedItemsView = new Dictionary<ProductTypeIds, UchActiveItemView>()

                };
                var premium = GetUserPremium(connection, userId);
                if (premium == null) throw new ArgumentNullException(Error.PremiumNotExsist);
                var balanceCc =  BalanceGet(connection, userId);
                if (balanceCc == null) throw new ArgumentNullException(Error.CcCountNotExsist);
                var store =   GetStoreAllView(connection);
                var timeNow = UnixTime.UtcNow();
                result.NoActivate = result.All.Where(i => !i.Activated).Select(ch =>
                {
                    var item = new UchNoActiveField(ch);
                    var storeItem = store.StoreList.First(i => i.ProductStoreId == item.ProductStoreId);
                    item.ProductItemProperty = new ProductItemProperty(storeItem.ProductItemProperty);
                    return item;
                }).ToList();

                var activatedItems = result.All.Where(i => i.Activated).ToList();

                var accountItems = activatedItems.Where(i => i.ProductTypeId == (byte)ProductTypeIds.Account).ToList();
                if (accountItems.Any())
                {
                    var acc = new UchActiveItemView(ProductTypeIds.Account);
                    // todo codo heare
                    result.ActivatedItemsView.Add(acc.ProductType, acc);

                }

                var premiumItems = activatedItems.Where(i => i.ProductTypeId == (byte)ProductTypeIds.Premium).ToList();
                var prem = new UchActiveItemView(ProductTypeIds.Premium)
                {
                    Data = new UchPremiumData
                    {
                        Premium = premium,
                        StoreIds = premiumItems.Select(i => i.ProductStoreId).ToList()
                    }
                };

                var premType =   _ptCache.GetById(connection,(byte)ProductTypeIds.Premium, false);
                var pProperty = premType.Property.GetPremiumProperties();
                pProperty.Duration = premium.EndTime - timeNow;
                prem.ProductItemProperty = new ProductItemProperty
                {
                    ImgCollectionImg = premType.Property.ImgCollectionImg,
                    Property = pProperty,
                    TranslateText = premType.Property.TranslateText
                };

                result.ActivatedItemsView.Add(prem.ProductType, prem);


                var boosterItems = activatedItems.Where(i => i.ProductTypeId == (byte)ProductTypeIds.Booster).ToList();

                if (boosterItems.Any())
                {
                    var bosters = new UchActiveItemView(ProductTypeIds.Booster);
                    // todo codo heare
                    result.ActivatedItemsView.Add(bosters.ProductType, bosters);
                }
                var skinitems = activatedItems.Where(i => i.ProductTypeId == (byte)ProductTypeIds.Skins).ToList();
                if (skinitems.Any())
                {
                    var skins = new UchActiveItemView(ProductTypeIds.Skins);
                    // todo codo heare
                    result.ActivatedItemsView.Add(skins.ProductType, skins);
                }

                var ccItems = activatedItems.Where(i => i.ProductTypeId == (byte)ProductTypeIds.Cc).ToList();

                var cc = new UchActiveItemView(ProductTypeIds.Cc)
                {
                    Data = new UchBalanceCcData
                    {
                        StoreIds = ccItems.Select(i => i.ProductStoreId).ToList(),
                        BalanceCc = balanceCc
                    }
                };
                // todo codo heare
                result.ActivatedItemsView.Add(cc.ProductType, cc);

                return result;
            }
            catch (Exception)
            {
                throw new Exception(Error.DbError);
            }
        }


        public UchActiveItemView ActivateChestItem(IDbConnection connection, int chestId, int userId)
        {
            var chestItem =   _userChestCache.GetById(connection,chestId, true);
            if (!_notActiveChestIsExist(connection, chestItem, userId)) throw new Exception(Error.NoData);

            try
            {
                return   _activateChestItem(connection, chestItem, userId);
            }
            catch (Exception)
            {
                throw new Exception(Error.DbError);
            }
        }


        private UchActiveItemView _activateChestItem(IDbConnection connection, UserChestDataModel chestItem, int userId)
        {
            UchActiveItemView result = null;
            if ((byte)ProductTypeIds.Account == chestItem.ProductTypeId)
            {
                // todo  реализовать
                return result;
            }

            if ((byte)ProductTypeIds.Premium == chestItem.ProductTypeId)
            {
                return   _activatePremiunItem(connection, chestItem, userId);
            }


            if ((byte)ProductTypeIds.Booster == chestItem.ProductTypeId)
            {
                // todo  реализовать
                return result;
            }

            if ((int)ProductTypeIds.Skins == chestItem.ProductTypeId)
            {
                // todo  реализовать
                return result;
            }
            return result;

        }

        private UchActiveItemView _activatePremiunItem(IDbConnection connection, UserChestDataModel chestItem, int userId)
        {



            var prod =   _psCache.GetById(connection,chestItem.ProductStoreId, false);
            if (prod.Property == null) throw new Exception(Error.InputDataIncorrect);

            var pm = prod.Property.CreatePremuiumProperties();
            if (pm.Duration == 0) throw new Exception(Error.PremiumDurationNotSet);

            var premium =   _premiumCache.GetById(connection,userId, true);
            if (premium == null) throw new Exception(Error.PremiumNotExsist);

            var duration = (int)pm.Duration;
            var chestId = chestItem.Id;
            var timeStampNow = UnixTime.UtcNow();
            var dateActivate = timeStampNow;
            var endTime = 0;

            if (premium.EndTime < timeStampNow) endTime = timeStampNow + duration;
            else endTime = premium.EndTime + duration;
            premium.Data.Add(chestId, new UserPremiumtHistory(duration, dateActivate));
            premium.EndTime = endTime;
            premium.Finished = false;
            premium =   _premiumCache.UpdateLocalItem(connection,_premiumRepo.AddOrUpdateeModel(connection,premium));


            //Запись в  таблицу user chest  об активации товара.



            var userChest =   _userChestCache.GetById(connection,chestId, true);
            if (userChest == null) throw new ArgumentNullException(Error.ChestNotExist, nameof(userChest));
            userChest.DateActivate = dateActivate;
            userChest.Activated = true;
              _userChestCache.UpdateLocalItem(connection,_userChestRepo.AddOrUpdateeModel(connection,userChest));

            //=============

            var userPrems =   _chestGetUserPremiums(connection, userId);
            var prem = new UchActiveItemView(ProductTypeIds.Premium)
            {
                Data = new UchPremiumData
                {
                    Premium = premium,
                    StoreIds = userPrems.Select(i => i.ProductStoreId).ToList()
                }
            };
            var premType =  _ptCache.GetById(connection,(byte)ProductTypeIds.Premium, false);
            var pProperty = premType.Property.GetPremiumProperties();
            pProperty.Duration = premium.EndTime - timeStampNow;
            if (pProperty.Duration < 0)
            {
                throw new NotImplementedException("pProperty.Duration<0");
            }

            prem.ProductItemProperty = new ProductItemProperty
            {
                ImgCollectionImg = premType.Property.ImgCollectionImg,
                Property = pProperty,
                TranslateText = premType.Property.TranslateText
            };
            return prem;


        }

        private bool _notActiveChestIsExist(IDbConnection connection, UserChestDataModel uch, int userId)
        {

            return uch != null && uch.UserId == userId
                   && uch.Activated == false
                   && uch.Finished == false;
        }


        public List<UserChestDataModel> GetActiveBosters(IDbConnection connection, int userId)
        {
            var productTypeId = (byte)ProductTypeIds.Booster;
            var boosers = _userChestCache.LocalOperation(connection,col =>
            {
                return col.Where(i => i.UserId == userId && i.Activated && !i.Finished && i.ProductTypeId == productTypeId);

            });
            return boosers.ToList();
        }

        private List<UserChestDataModel> _chestGetUserPremiums(IDbConnection connection, int userId)
        {
            var productTypeId = (byte)ProductTypeIds.Premium;
            var prems =   _userChestCache.LocalOperation(connection,col =>
            {
                return col.Where(i => i.UserId == userId && !i.Finished && i.ProductTypeId == productTypeId);

            });
            return prems.ToList();
        }

        #endregion
    }
}