using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Products;
using Server.DataLayer;

namespace Server.Services
{
    public partial class StoreService
    {
        #region Premium

        public UserPremiumDataModel GetUserPremium(IDbConnection connection, int userId)
        {
            var premium = _premiumCache.GetById(connection,userId, true);
            if (premium == null) return CreateUserPremium(connection, userId);
            return premium;
        }

        public IList<UserPremiumDataModel> GetPremiumList(IDbConnection connection, List<int> userIds)
        {
            return _premiumCache.GetDataModelItems(connection,userIds);
        }

        public IList<UserPremiumDataModel> GetAllPremiums(IDbConnection connection)
        {
            return _premiumCache.LocalGetAll(connection);
        }

        public UserPremiumDataModel AddOrUpdatePremium(IDbConnection connection, UserPremiumDataModel dataModel)
        {
            return _premiumCache.UpdateLocalItem(connection,_premiumRepo.AddOrUpdateeModel(connection,dataModel));
        }


        public UserPremiumDataModel CreateUserPremium(IDbConnection connection, int userId)
        {
            var addPremium = new UserPremiumDataModel
            {
                Id = userId,
                EndTime = UnixTime.UtcNow(),
                AutoPay = false,
                Finished = true,
                Data = new Dictionary<int, UserPremiumtHistory>()
            };
            addPremium= _premiumRepo.AddOrUpdateeModel(connection,addPremium);
            return _premiumCache.UpdateLocalItem(connection,addPremium);
        }


        public UserPremiumDataModel GetOrUpdatePremium(IDbConnection connection, int userId)
        {
            var premium = GetUserPremium(connection, userId);
            var time = UnixTime.UtcNow();
            if (!premium.Finished && premium.EndTime > time || premium.Finished && premium.EndTime <= time)
                return premium;

            premium.Finished = true;
            var endChestIds = premium.Data.Where(i => i.Value.DateEndTime >= time).Select(i => i.Key);
            foreach (var chestId in endChestIds)
                SetChestItemFinished(connection, chestId);
            return AddOrUpdatePremium(connection, premium);
        }

        public UserPremiumWorkModel GetPremiumWorkModel(IDbConnection connection, int userId)
        {
            var premium = GetOrUpdatePremium(connection, userId);
            return new UserPremiumWorkModel(premium);
        }

        #endregion
    }
}