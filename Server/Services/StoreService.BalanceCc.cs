using System;
using System.Data;
using Server.Core.StaticData;
using Server.DataLayer;

namespace Server.Services
{


    public partial class StoreService
    {
        public const int DefaultBalance = 10000;

        //BalanceCc

        public UserBalanceCcDataModel BalanceGet(IDbConnection connection, int userId)
        {

            if (userId == 0) throw new ArgumentException(Error.IsEmpty, nameof(userId));
            var userBalanse = _userBalanceCache.GetById(connection, userId, true) ?? _getFromDbBalance(connection, userId);
            return userBalanse;
        }

        private UserBalanceCcDataModel _getFromDbBalance(IDbConnection connection, int userId)
        {

            var dbBalance = _userBalanceRepo.GetModelById(connection, userId);
            if (dbBalance == null) return BalanceCreateСсCount(connection, userId, DefaultBalance);
            if (dbBalance == null) throw new NotImplementedException();
            dbBalance = _userBalanceCache.UpdateLocalItem(connection, dbBalance);
            return dbBalance;
        }

        public int BalanceGetCc(IDbConnection connection, int userId)
        {
            var balance = BalanceGet(connection, userId);
            return balance?.Quantity ?? 0;
        }
        public UserBalanceCcDataModel BalanceCalcResultCc(IDbConnection connection, int userId, int value)
        {
            return BalanceCalcResultCc(connection, BalanceGet(connection, userId), value);
        }



        public UserBalanceCcDataModel BalanceCalcResultCc(IDbConnection connection, UserBalanceCcDataModel userBalanceModel, int value)
        {
            if (!BalanceEnoughCc(connection, userBalanceModel, value)) throw new Exception(Error.NotEnoughCc, new Exception(userBalanceModel.Quantity.ToString()));
            userBalanceModel.Quantity -= value;
            return userBalanceModel;
        }

        public UserBalanceCcDataModel BalanceEnoughCc(IDbConnection connection, int userId, int cost, Action<bool> enoughCc, bool asNew = false)
        {
            var balance = BalanceGet(connection, userId);
            enoughCc(balance.Quantity - cost >= 0);
            return balance;
        }
        public bool BalanceEnoughCc(IDbConnection connection, UserBalanceCcDataModel dataModel, int cost)
        {
            return dataModel.Quantity - cost >= 0;
        }


        public UserBalanceCcDataModel BalanceCreateСсCount(IDbConnection connection, int userId, int defaultBalance = 1000)
        {

            var balance = _userBalanceRepo.AddOrUpdateeModel(connection, new UserBalanceCcDataModel
            {
                Id = userId,
                Quantity = DefaultBalance,
                DateUpdate = DateTime.UtcNow
            });
            var newCacheVal = _userBalanceCache.UpdateLocalItem(connection, balance);
            return newCacheVal;
        }
        public UserBalanceCcDataModel BalanceUpdate(IDbConnection connection, int userId, int value, sbyte operation)
        {
            var item = BalanceGet(connection, userId).CreateNewFromThis();
            item.Quantity += value * operation;
            item.DateUpdate = DateTime.UtcNow;

            var suc = _userBalanceRepo.Update(connection, _userBalanceRepo.ConvertToEntity(item));
            if (!suc)
            {
                throw new NotImplementedException();
            }
            item = _userBalanceCache.UpdateLocalItem(connection, item);
            return item;
        }

        public UserBalanceCcDataModel AddOrUpdateBalance(IDbConnection connection, UserBalanceCcDataModel dataModel)
        {
            return _userBalanceCache.UpdateLocalItem(connection, _userBalanceRepo.AddOrUpdateeModel(connection, dataModel));
        }





    }
}