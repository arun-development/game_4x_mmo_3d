using System;
using System.Data;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.Extensions;

namespace Server.DataLayer.Repositories
{
    public interface
        IGGeometryPlanetRepository : IAdapterDapper<g_geometry_planet, GGeometryPlanetDataModel, int>,
            IDeleteAllProcedure
    {
    }

    public class GGeometryPlanetRepository :
        AdapterDapperRepository<g_geometry_planet, GGeometryPlanetDataModel, int>,
        IGGeometryPlanetRepository
    {
        public GGeometryPlanetRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }


        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            _provider.ThrowIfConnectionIsNull(connection);
            var sucsess = _deleteAllProcedire(connection, "g_geometry_planet_delete_all", false, "g_geometry_planet", 0);

            // ReSharper disable once InvertIf
            if (sucsess)
            {
                _provider._help_reset_index(connection, "g_geometry_moon", 0);
 
            }
            if (!sucsess)
            {
                throw new NotImplementedException();
            }
            return sucsess;



        }



        public override GGeometryPlanetDataModel ConvertToWorkModel(g_geometry_planet entity)
        {
            return _convertFromEntity(entity);
        }


        protected override void _setUpdatedData(g_geometry_planet oldData, GGeometryPlanetDataModel newData)
        {
            if (newData.OrbitAngle == null) throw new ArgumentNullException(Error.IsEmpty, nameof(newData.OrbitAngle));
            if (newData.AxisAngle == null) throw new ArgumentNullException(Error.IsEmpty, nameof(newData.AxisAngle));


            var orbitAngle = newData.OrbitAngle.ToSerealizeString();
            var axisAngle = newData.AxisAngle.ToSerealizeString();
            var color = newData.Color?.ToSerealizeString();


            if (oldData.Id != newData.Id && newData.Id != 0) oldData.Id = newData.Id;
            if (oldData.typeId != newData.TypeId) oldData.typeId = newData.TypeId;
            if (oldData.textureTypeId != newData.TextureTypeId) oldData.textureTypeId = newData.TextureTypeId;


            if (oldData.galaxyId != newData.GalaxyId) oldData.galaxyId = newData.GalaxyId;
            if (oldData.sectorId != newData.SectorId) oldData.sectorId = newData.SectorId;
            if (oldData.systemId != newData.SystemId) oldData.systemId = newData.SystemId;


            if (Math.Abs(oldData.radius - newData.Radius) > 0) oldData.radius = newData.Radius;
            if (oldData.ringTypeId != newData.RingTypeId) oldData.ringTypeId = newData.RingTypeId;
            if (Math.Abs(oldData.orbit - newData.Orbit) > 0) oldData.orbit = newData.Orbit;

            if (oldData.orbitAngle != orbitAngle) oldData.orbitAngle = orbitAngle;
            if (oldData.axisAngle != axisAngle) oldData.axisAngle = axisAngle;
            if (oldData.systemPosition != newData.SystemPosition) oldData.systemPosition = newData.SystemPosition;
            if (oldData.color != color) oldData.color = color;


            if (oldData.orbitPosition != newData.OrbitPosition) oldData.orbitPosition = newData.OrbitPosition;
        }

        private  GGeometryPlanetDataModel _convertFromEntity(IGGeometryPlanetDbItem data)
        {
            var result = new GGeometryPlanetDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.TypeId = data.typeId;
            result.TextureTypeId = data.textureTypeId;


            result.GalaxyId = data.galaxyId;
            result.SectorId = data.sectorId;
            result.SystemId = data.systemId;


            result.Radius = data.radius;

            result.RingTypeId = data.ringTypeId;
            result.Orbit = data.orbit;

            result.OrbitAngle = data.orbitAngle.ToSpecificModel<Vector3>();
            result.AxisAngle = data.axisAngle.ToSpecificModel<Vector3>();
            result.SystemPosition = data.systemPosition;
            result.Color = data.color?.ToSpecificModel<Color3>();

            result.OrbitPosition = data.orbitPosition;
            return result;
        }
    }
}