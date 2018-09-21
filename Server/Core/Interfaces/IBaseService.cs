using System.Data;

namespace Server.Core.Interfaces
{
    public interface IBaseService<TPrimaryKeyType, TDataModel> : ITest where TPrimaryKeyType : struct
        where TDataModel : class
    {
        TDataModel AddOrUpdate(IDbConnection connection, TDataModel dataModel);
        bool Delete(IDbConnection connection, TPrimaryKeyType id);
        bool DeleteAll(IDbConnection connection);
    }
}