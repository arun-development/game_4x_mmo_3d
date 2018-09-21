using System;
using System.Data;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.Extensions;

namespace Server.DataLayer.Repositories
{
    public interface
        IGGeometryMoonRepository : IAdapterDapper<g_geometry_moon, GGeometryMoonDataModel, int>
    {
    }

    public class GGeometryMoonRepository :
        AdapterDapperRepository<g_geometry_moon, GGeometryMoonDataModel, int>, IGGeometryMoonRepository
    {
        public GGeometryMoonRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }

        public override GGeometryMoonDataModel ConvertToWorkModel(g_geometry_moon entity)
        {
            return _convertFromEntity(entity);
        }

 
        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "g_geometry_moon_delete_all",false, "g_geometry_moon",0);
        }


        protected override void _setUpdatedData(g_geometry_moon oldData, GGeometryMoonDataModel newData)
        {
            if (newData.OrbitAngle == null) throw new ArgumentNullException(Error.IsEmpty, nameof(newData.OrbitAngle));
            if (newData.AxisAngle == null) throw new ArgumentNullException(Error.IsEmpty, nameof(newData.AxisAngle));


            var orbitAngle = newData.OrbitAngle.ToSerealizeString();
            var axisAngle = newData.AxisAngle.ToSerealizeString();
            var color = newData.Color?.ToSerealizeString();


            if (oldData.Id != newData.Id&& newData.Id !=0) oldData.Id = newData.Id;

            if (oldData.typeId != newData.TypeId) oldData.typeId = newData.TypeId;
            if (oldData.textureTypeId != newData.TextureTypeId) oldData.textureTypeId = newData.TextureTypeId;


            if (oldData.galaxyId != newData.GalaxyId) oldData.galaxyId = newData.GalaxyId;
            if (oldData.sectorId != newData.SectorId) oldData.sectorId = newData.SectorId;
            if (oldData.systemId != newData.SystemId) oldData.systemId = newData.SystemId;
            if (oldData.planetId != newData.PlanetId) oldData.planetId = newData.PlanetId;


            if (Math.Abs(oldData.radius - newData.Radius) > 0) oldData.radius = newData.Radius;
            if (Math.Abs(oldData.orbit - newData.Orbit) > 0) oldData.orbit = newData.Orbit;
            if (oldData.orbitAngle != orbitAngle) oldData.orbitAngle = orbitAngle;
            if (oldData.axisAngle != axisAngle) oldData.axisAngle = axisAngle;
            if (oldData.color != color) oldData.color = color;


            if (oldData.orbitPosition != newData.OrbitPosition) oldData.orbitPosition = newData.OrbitPosition;
        }
 
        private static GGeometryMoonDataModel _convertFromEntity(IGGeometrMoonDbItem data)
        {
            var result = new GGeometryMoonDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.TypeId = data.typeId;
            result.TextureTypeId = data.textureTypeId;


            result.GalaxyId = data.galaxyId;
            result.SectorId = data.sectorId;
            result.SystemId = data.systemId;
            result.PlanetId = data.planetId;


            result.Radius = data.radius;
            result.Orbit = data.orbit;
            result.OrbitAngle = data.orbitAngle.ToSpecificModel<Vector3>();
            result.AxisAngle = data.axisAngle.ToSpecificModel<Vector3>();
            result.Color = data.color?.ToSpecificModel<Color3>();


            result.OrbitPosition = data.orbitPosition;
            return result;
        }
    }
}