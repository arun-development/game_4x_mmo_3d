using System.Data;

namespace Server.DataLayer.Repositories
{
    public interface IJournalBuyRepository : IAdapterDapper<journal_buy, JournalBuyDataModel, int>, IDeleteAllProcedure
    {
    }

    public class JournalBuyRepository :
        AdapterDapperRepository<journal_buy, JournalBuyDataModel, int>,
        IJournalBuyRepository
    {
        public JournalBuyRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }



        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "journal_buy_delete_all", false, "journal_buy",1);
        }
 

        public override JournalBuyDataModel ConvertToWorkModel(journal_buy entity)
        {
            return _convertFromProcedure(entity);
        }


        protected override void _setUpdatedData(journal_buy oldData, JournalBuyDataModel newData)
        {
            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.transactionType != newData.TransactionType) oldData.transactionType = newData.TransactionType;
            if (oldData.transactionId != newData.TransactionId) oldData.transactionId = newData.TransactionId;
        }


        private static JournalBuyDataModel _convertFromProcedure(IJournalBuyDbItem data)
        {
            var result = new JournalBuyDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.TransactionType = data.transactionType;
            result.TransactionId = data.transactionId;
            return result;
        }
    }
}