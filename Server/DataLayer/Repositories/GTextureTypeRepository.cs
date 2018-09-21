using System.Collections.Generic;
using System.Data;

namespace Server.DataLayer.Repositories
{
    public interface
        IGTextureTypeRepository : IAdapterDapper<g_texture_type, GTextureTypeDataModel, short>,
            IDeleteAllProcedure
    {
        IEnumerable<g_texture_type> GetByGameTypeId(IDbConnection connection, int textureTypeId);

    }

    public class GTextureTypeRepository :
        AdapterDapperRepository<g_texture_type, GTextureTypeDataModel, short>,
        IGTextureTypeRepository
    {
        public GTextureTypeRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }


 

        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "g_texture_type_delete_all", false);
        }

        public IEnumerable<g_texture_type> GetByGameTypeId(IDbConnection connection, int textureTypeId)
        {
            var sql = $"SELECT * FROM {SchemeTableName} WHERE gameTypeId=@gameTypeId";
            var result =  _provider.Text<g_texture_type>(connection, sql, new
            {
                gameTypeId = textureTypeId
            });
            return result;
        }

        public override GTextureTypeDataModel ConvertToWorkModel(g_texture_type entity)
        {
            return _convertFromEntity(entity);
        }

        protected override void _setUpdatedData(g_texture_type oldData, GTextureTypeDataModel newData)
        {
            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.gameTypeId != newData.GameTypeId) oldData.Id = newData.Id;
        }

        private static GTextureTypeDataModel _convertFromEntity(IGTextureTypeDbItem data)
        {
            var result = new GTextureTypeDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.GameTypeId = data.gameTypeId;
            return result;
        }
    }
}