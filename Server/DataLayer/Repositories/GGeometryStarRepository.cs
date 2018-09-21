using System;
using System.Data;

namespace Server.DataLayer.Repositories
{
    public interface
        IGGeometryStarRepository : IAdapterDapper<g_geometry_star, GGeometryStarDataModel, int>,
            IDeleteAllProcedure
    {
    }

    public class GGeometryStarRepository :
        AdapterDapperRepository<g_geometry_star, GGeometryStarDataModel, int>,
        IGGeometryStarRepository
    {
        public GGeometryStarRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }


 

        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "g_geometry_star_delete_all",false);
        }


        public override GGeometryStarDataModel ConvertToWorkModel(g_geometry_star entity)
        {
            return _convertFromEntity(entity);
        }


        protected override void _setUpdatedData(g_geometry_star oldData, GGeometryStarDataModel newData)
        {
            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.typeId != newData.TypeId) oldData.typeId = newData.TypeId;
            if (oldData.textureTypeId != newData.TextureTypeId) oldData.textureTypeId = newData.TextureTypeId;
            if (Math.Abs(oldData.radius - newData.Radius) > 0) oldData.radius = newData.Radius;
        }

        private static GGeometryStarDataModel _convertFromEntity(IGGeometryStarDbItem data)
        {
            var result = new GGeometryStarDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.TypeId = data.typeId;
            result.TextureTypeId = data.textureTypeId;

            result.Radius = data.radius;
            return result;
        }
    }
}