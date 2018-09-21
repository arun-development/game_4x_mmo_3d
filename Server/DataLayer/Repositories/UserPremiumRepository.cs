using System.Collections.Generic;
using System.Data;
using Server.Core.СompexPrimitive.Products;
using Server.Extensions;

namespace Server.DataLayer.Repositories
{
    public interface IPremiumRepository : IAdapterDapper<user_premium, UserPremiumDataModel, int>,
        IDeleteAllProcedure
    {
         
    }

    public class UserPremiumRepository :
        AdapterDapperRepository<user_premium, UserPremiumDataModel, int>,
        IPremiumRepository
    {
        public UserPremiumRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }


        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "user_premium_delete_all", false);
        }

 

        public override UserPremiumDataModel ConvertToWorkModel(user_premium entity)
        {
            return _convertFromProcedure(entity);
        }


        protected override void _setUpdatedData(user_premium oldData, UserPremiumDataModel newData)
        {
            var data = newData.Data == null ? "{}" : newData.Data.ToSerealizeString();

            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.endTime != newData.EndTime) oldData.endTime = newData.EndTime;
            if (oldData.autopay != newData.AutoPay) oldData.autopay = newData.AutoPay;
            if (oldData.finished != newData.Finished) oldData.finished = newData.Finished;
            if (oldData.data != data) oldData.data = data;
        }

        private static UserPremiumDataModel _convertFromProcedure(IPremiumDbItem data)
        {
            var result = new UserPremiumDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.EndTime = data.endTime;
            result.AutoPay = data.autopay;
            result.Finished = data.finished;
            result.Data = data.data == null
                ? new Dictionary<int, UserPremiumtHistory>()
                : data.data.ToSpecificModel<Dictionary<int, UserPremiumtHistory>>();

            return result;
        }
    }
}