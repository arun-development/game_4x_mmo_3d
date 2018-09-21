using System.Data;

namespace Server.DataLayer.Repositories
{
    public interface ICurrencyRepository : IAdapterDapper<currency, CurrencyDataModel, int>
    {
    }

    public class CurrencyRepository :
        AdapterDapperRepository<currency, CurrencyDataModel, int>, ICurrencyRepository
    {
        public CurrencyRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }

        public override CurrencyDataModel ConvertToWorkModel(currency entity)
        {
            return _convertFromEntity(entity);
        }

        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "currency_delete_all", false, "currency",1);
        }
 

        protected override void _setUpdatedData(currency oldData, CurrencyDataModel newData)
        {
            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.code != newData.Code) oldData.code = newData.Code;
            if (oldData.course != newData.Course) oldData.course = newData.Course;
        }

        private static CurrencyDataModel _convertFromEntity(ICurrencyDbItem data)
        {
            var result = new CurrencyDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.Code = data.code;
            result.Course = data.course;
            return result;
        }
    }
}