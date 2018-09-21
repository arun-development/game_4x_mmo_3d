using System.Data;

namespace Server.DataLayer.Repositories
{
    public interface
        IUserBalanceCcRepository : IAdapterDapper<user_balance_cc, UserBalanceCcDataModel, int>,
            IDeleteAllProcedure
    {
    }

    public class UserBalanceCcRepository :
        AdapterDapperRepository<user_balance_cc, UserBalanceCcDataModel, int>,
        IUserBalanceCcRepository
    {
        public UserBalanceCcRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }

 

        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "user_balance_cc_delete_all", false);
        }
        public override UserBalanceCcDataModel ConvertToWorkModel(user_balance_cc entity)
        {
            return _convertFromProcedure(entity);
        }

        protected override void _setUpdatedData(user_balance_cc oldData, UserBalanceCcDataModel newData)
        {
            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.quantity != newData.Quantity) oldData.quantity = newData.Quantity;
            if (oldData.dateUpdate != newData.DateUpdate) oldData.dateUpdate = newData.DateUpdate;
        }

        private static UserBalanceCcDataModel _convertFromProcedure(IBalanceCcDbItem data)
        {
            var result = new UserBalanceCcDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.Quantity = data.quantity;
            result.DateUpdate = data.dateUpdate;
            return result;
        }
    }
}