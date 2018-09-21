using System.Data;
using Server.DataLayer;

namespace Server.Services
{
    public partial class StoreService
    {
        #region JournalBuy

        public JournalBuyDataModel JournalBuyAddCcBuy(IDbConnection connection, int transactionId, IDbTransaction tran = null)
        {
            var r = _journalBuyRepository;
            var jb = _journalBuySetModel(transactionId);
            var db = r.ConvertToWorkModel(r.AddOrUpdate(connection, r.ConvertToEntity(jb), tran));
            return _journalBuyCache.UpdateLocalItem(connection,db);
        }


        private JournalBuyDataModel _journalBuySetModel(int transactionId)
        {
            return new JournalBuyDataModel
            {
                TransactionId = transactionId,
                TransactionType = false
            };
        }

        #endregion
    }
}