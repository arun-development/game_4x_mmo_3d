using System;
using System.Collections.Generic;
using System.Data;
using Server.Core.Map.Structure;
using Server.Core.StaticData;
using Server.DataLayer;

namespace Server.Services.WorldService
{
    public partial class SystemService
    {
        #region Sync

        public GGeometrySystemDataModel GetGeometrySystem(IDbConnection connection, int systemId)
        {
            return _geometrySystemCache.GetById(connection,systemId, true);
        }

        public Planetoids GetSystemGeometryViewData(IDbConnection connection, int systemId)
        {
            if (systemId == 0) throw new Exception(Error.NoData);
            //var system = _systemService.GetSystemGeometry(id);
            var system = GetGeometrySystem(connection, systemId);
            if (system == null) throw new ArgumentNullException(nameof(system), Error.NoData);
            if (system.Planetoids == null) throw new ArgumentNullException(nameof(system.Planetoids), Error.NoData);
            return system.Planetoids;
        }


        public IList<GGeometrySystemDataModel> GetGeometrySystems(IDbConnection connection)
        {
            return _geometrySystemCache.LocalGetAll(connection);
        }

        public GGeometrySystemDataModel AddOrUpdateGeometrySystem(IDbConnection connection, GGeometrySystemDataModel dataModel)
        {
            throw new NotImplementedException();
        }

        public IList<GGeometrySystemDataModel> AddOrUpdateGeometrySystems(IDbConnection connection, IList<GGeometrySystemDataModel> systems)
        {
            var db = _geometrySystemRepo.AddOrUpdateAllModels(connection,systems);
            return _geometrySystemCache.UpdateLocalItems(connection,db);
        }


        public void DeleteGeometrySystem(IDbConnection connection, int id)
        {
            throw new NotImplementedException();
        }

        public void DeleteAllGeometrySystem(IDbConnection connection)
        {
            throw new NotImplementedException();
        }

        #endregion
    }
}