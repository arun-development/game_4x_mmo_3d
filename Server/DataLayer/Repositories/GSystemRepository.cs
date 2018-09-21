using System;
using System.ComponentModel.DataAnnotations;
using System.Data;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.Extensions;

namespace Server.DataLayer.Repositories
{
    public interface IGSystemRepository : IAdapterDapper<g_system, GSystemDataModel, int>,
        IDeleteAllProcedure
    {
    }

    public class GSystemRepository :
        AdapterDapperRepository<g_system, GSystemDataModel, int>,
        IGSystemRepository
    {
        public GSystemRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }

 
        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            ThrowIfConnectionIsNull(connection);
           var  result = _deleteAllProcedire(connection, "g_system_delete_all", false, "g_system", 0);
            _provider._help_reset_index(connection, "g_geometry_planet", 0);
            _provider._help_reset_index(connection, "g_geometry_moon", 0);
            return result;
        }

        public override GSystemDataModel ConvertToWorkModel(g_system entity)
        {
            return _convertFromEntity(entity);
        }


        protected override void _setUpdatedData(g_system oldData, GSystemDataModel newData)
        {
            if (newData.Position == null) throw new ArgumentNullException(Error.IsEmpty, nameof(newData.Position));
            var position = newData.Position.ToSerealizeString();
            if (position.Length > 100) throw new ValidationException(Error.OverMaxLength);

            if (oldData.Id != newData.Id) oldData.Id = newData.Id;

            if (oldData.galaxyId != newData.GalaxyId) oldData.galaxyId = newData.GalaxyId;
            if (oldData.sectorId != newData.SectorId) oldData.sectorId = newData.SectorId;
            if (oldData.position != position) oldData.position = position;
        }


        private static GSystemDataModel _convertFromEntity(IGSystemDbItem data)
        {
            var result = new GSystemDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.GalaxyId = data.galaxyId;
            result.SectorId = data.sectorId;
            result.Position = data.position.ToSpecificModel<Vector3>();
            return result;
        }
    }
}