using System.Data;

namespace Server.DataLayer.Repositories
{
    public interface
        ITransacationCcRepository : IAdapterDapper<transacation_cc, TransacationCcDataModel, int>,
            IDeleteAllProcedure
    {
    }

    public class TransacationCcRepository :
        AdapterDapperRepository<transacation_cc, TransacationCcDataModel, int>,
        ITransacationCcRepository
    {
        public TransacationCcRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }


        public override TransacationCcDataModel ConvertToWorkModel(transacation_cc entity)
        {
            return _convertFromProcedure(entity);
        }


 
        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "transacation_cc_delete_all", false, "transacation_cc", 1);
        }

        protected override void _setUpdatedData(transacation_cc oldData, TransacationCcDataModel newData)
        {
            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.userId != newData.UserId) oldData.userId = newData.UserId;
            if (oldData.productStoreId != newData.ProductStoreId) oldData.productStoreId = newData.ProductStoreId;
            if (oldData.quantity != newData.Quantity) oldData.quantity = newData.Quantity;

            if (oldData.source != newData.Source) oldData.source = newData.Source;
            if (oldData.totalCost != newData.TotalCost) oldData.totalCost = newData.TotalCost;
            if (oldData.token != newData.Token) oldData.token = newData.Token;
            if (oldData.formToken != newData.FormToken) oldData.formToken = newData.FormToken;
            if (oldData.dateCreate != newData.DateCreate) oldData.dateCreate = newData.DateCreate;
        }

        private static TransacationCcDataModel _convertFromProcedure(ITransacationCcDbItem data)
        {
            var result = new TransacationCcDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.UserId = data.userId;
            result.ProductStoreId = data.productStoreId;
            result.Quantity = data.quantity;
            result.Source = (sbyte) data.source;
            result.TotalCost = data.totalCost;
            result.Token = data.token;
            result.FormToken = data.formToken;
            result.DateCreate = data.dateCreate;
            return result;
        }
    }
}