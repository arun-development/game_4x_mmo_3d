using System.Data;

namespace Server.DataLayer.Repositories
{
    public enum SysTypeNames
    {
        SystemNames = 1
    }

    public interface ISysHelperRepository : IAdapterDapper<sys_helper, SysHelperDataModel, int>,
        IDeleteAllProcedure
    {
    }

    public class SysHelperRepository :
        AdapterDapperRepository<sys_helper, SysHelperDataModel, int>,
        ISysHelperRepository
    {
        public SysHelperRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }

 
        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "sys_helper_delete_all", false, "sys_helper", 1);
        }

        public override SysHelperDataModel ConvertToWorkModel(sys_helper entity)
        {
            return _convertFromEntity(entity);
        }


        protected override void _setUpdatedData(sys_helper oldData, SysHelperDataModel newData)
        {
            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.typeName != newData.TypeName) oldData.typeName = newData.TypeName;
            if (oldData.value != newData.Value) oldData.value = newData.Value;
        }

        private static SysHelperDataModel _convertFromEntity(ISysHelperDbItem data)
        {
            var result = new SysHelperDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.TypeName = data.typeName;
            result.Value = data.value;
            return result;
        }
    }
}