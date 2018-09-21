using System;
using System.Data;
using Server.Core.Map.Structure;
using Server.Core.StaticData;
using Server.Extensions;

namespace Server.DataLayer.Repositories
{
    public interface
        IGGeometrySystemRepository : IAdapterDapper<g_geometry_system, GGeometrySystemDataModel, int>,
            IDeleteAllProcedure
    {
    }

    public class GGeometrySystemRepository :
        AdapterDapperRepository<g_geometry_system, GGeometrySystemDataModel, int>,
        IGGeometrySystemRepository
    {
        public GGeometrySystemRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }


        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "g_geometry_system_delete_all",false);
        }
 

        public override GGeometrySystemDataModel ConvertToWorkModel(g_geometry_system entity)
        {
            return _convertFromEntity(entity);
        }


        protected override void _setUpdatedData(g_geometry_system oldData, GGeometrySystemDataModel newData)
        {
            if (newData.Planetoids == null) throw new ArgumentNullException(Error.IsEmpty, nameof(newData.Planetoids));
            var planetoids = newData.Planetoids.ToSerealizeString();
            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.planetoids != planetoids) oldData.planetoids = planetoids;
        }

        private static GGeometrySystemDataModel _convertFromEntity(IGGeometrySystemDbItem data)
        {
            var result = new GGeometrySystemDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            if (string.IsNullOrWhiteSpace(data.planetoids)) return result;
            result.Planetoids = data.planetoids.ToSpecificModel<Planetoids>();
            return result;
        }
    }
}