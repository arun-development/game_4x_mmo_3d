using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Interfaces.World;
using Server.Core.StaticData;
using Server.DataLayer;
using Server.DataLayer.LocalStorageCaches;
using Server.DataLayer.Repositories;

namespace Server.Services.WorldService
{
    public class GGeometryPlanetService : IGGeometryPlanetService
    {
        #region Declare

        private readonly IGDetailPlanetLocalStorageCache _planetDetailCache;
        private readonly IGGeometryPlanetLocalStorageCache _planetGeometryCache;

        private readonly IGGeometryPlanetRepository _planetGeometryRepo;

        private readonly IGDetailSystemLocalStorageCache _systemDetailCache;

        public GGeometryPlanetService(IGGeometryPlanetRepository planetGeometryRepo,
            IGGeometryPlanetLocalStorageCache planetGeometryCache,
            IGDetailPlanetLocalStorageCache planetDetailCache, IGDetailSystemLocalStorageCache systemDetailCache)
        {
            _planetGeometryRepo = planetGeometryRepo;
            _planetGeometryCache = planetGeometryCache;

            _planetDetailCache = planetDetailCache;
            _systemDetailCache = systemDetailCache;
        }

        #endregion


        #region Sync

        public GGeometryPlanetDataModel GetGeometryPlanetById(IDbConnection connection, int planetId)
        {
            return _planetGeometryCache.GetById(connection,planetId, true);
        }

        public GGeometryPlanetDataModel GetUserPlanet(IDbConnection connection, int planetId, int userId)
        {
            var detailPlanet = _planetDetailCache.GetById(connection,planetId, true);
            return detailPlanet?.UserId != userId ? null : _planetGeometryCache.GetById(connection,planetId, true);
        }

        public string GetPlanetSystemName(IDbConnection connection, int planetId)
        {
            var planetGeometry = _planetGeometryCache.GetById(connection,planetId, true);
            var systemDetail = _systemDetailCache.GetById(connection,planetGeometry.SystemId, true);
            return systemDetail.Name;
        }

        public byte GetPlanetType(IDbConnection connection, int planetId)
        {
            var planet = _planetGeometryCache.GetById(connection,planetId, true);
            return planet.TypeId;
        }

        public IList<TResult> GetByStarId<TResult>(IDbConnection connection, int starId, Func<GGeometryPlanetDataModel, TResult> selector)
        {
            return _planetGeometryCache.LocalWhereSelect(connection,i => i.SystemId == starId, selector);
        }

        public IList<GGeometryPlanetDataModel> AddOrUpdateGeometryPlanets(IList<GGeometryPlanetDataModel> dataModel, IDbConnection connection)
        {
            var db = _planetGeometryRepo.AddOrUpdateAllModels(connection,dataModel);
            return _planetGeometryCache.UpdateLocalItems(connection,db);
        }


        public string Test(string message = "Ok")
        {
            return message;
        }


        public GGeometryPlanetDataModel AddOrUpdate(IDbConnection connection, GGeometryPlanetDataModel dataModel)
        {
            var db = _planetGeometryRepo.AddOrUpdateeModel(connection,dataModel);
            return _planetGeometryCache.UpdateLocalItem(connection,db);
        }

        public bool Delete(IDbConnection connection, int planetId)
        {
            var old = _planetGeometryCache.GetById(connection,planetId, true);
            if (old == null) return true;
            var sucsess = _planetGeometryRepo.Delete(connection, planetId);
            //_provider.Commit();
            if (sucsess) _planetGeometryCache.DeleteItem(planetId);
            else throw new NotImplementedException(Error.ErrorInUpdateDb);
            return sucsess;
        }


        public bool DeleteAll(IDbConnection connection)
        {
   

            var suc = false;
            if (!_planetGeometryRepo.HasItems(connection))
            {
                suc = true;
            }
            else
            {
                suc = _planetGeometryRepo.DeleteAllProcedure(connection);
                if (!suc) throw new NotImplementedException(Error.DbError);

            }
            _planetGeometryCache.ClearStorage();
            return suc;
        }


        public TResult GetUserPlanet<TResult>(IDbConnection connection, int planetId, int userId, Func<GGeometryPlanetDataModel, TResult> selector)
        {
            var planet = GetUserPlanet(connection, planetId, userId);
            if (planet == null) throw new ArgumentNullException(Error.PlanetNotExsist, nameof(GetUserPlanet));
            return selector(planet);
        }

        public IList<TResult> GetAll<TResult>(IDbConnection connection, Func<GGeometryPlanetDataModel, TResult> selector)
        {
            var items = _planetGeometryCache.LocalGetAll(connection);
            return items.Select(selector).ToList();
        }

        #endregion
    }
}