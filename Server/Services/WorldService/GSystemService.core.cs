using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Interfaces.World;
using Server.Core.Map.Structure;
using Server.DataLayer;
using Server.DataLayer.LocalStorageCaches;
using Server.DataLayer.Repositories;

namespace Server.Services.WorldService
{
    public partial class SystemService : ISystemService
    {
        #region Declare

        private readonly IGDetailSystemLocalStorageCache _detailSystemCache;
        private readonly IGDetailSystemRepository _detailSystemRepo;

        private readonly IGGalaxyService _galaxyService;
        private readonly IGGeometryStarLocalStorageCache _geometryStarCache;


        private readonly IGGeometryStarRepository _geometryStarRepo;
        private readonly IGGeometrySystemLocalStorageCache _geometrySystemCache;
        private readonly IGGeometrySystemRepository _geometrySystemRepo;

        private readonly IGSectorsService _sectorsService;
        private readonly IGSystemLocalStorageCache _systemCache;
        private readonly ISystemNameSercherPkCache _systemNameSercherPkCache;

        private readonly IGSystemRepository _systemRepo;


        public SystemService(IGDetailSystemRepository detailSystemRepo,
            IGDetailSystemLocalStorageCache detailSystemCache, IGGeometryStarRepository geometryStarRepo,
            IGGeometryStarLocalStorageCache geometryStarCache, IGGeometrySystemRepository geometrySystemRepo,
            IGGeometrySystemLocalStorageCache geometrySystemCache, IGSystemRepository systemRepo,
            IGSystemLocalStorageCache systemCache, ISystemNameSercherPkCache systemNameSercherPkCache,
            IGGalaxyService galaxyService, IGSectorsService sectorsService)
        {
            _detailSystemRepo = detailSystemRepo;
            _detailSystemCache = detailSystemCache;
            _geometryStarRepo = geometryStarRepo;
            _geometryStarCache = geometryStarCache;
            _geometrySystemRepo = geometrySystemRepo;
            _geometrySystemCache = geometrySystemCache;
            _systemRepo = systemRepo;
            _systemCache = systemCache;
            _systemNameSercherPkCache = systemNameSercherPkCache;
            _galaxyService = galaxyService;
            _sectorsService = sectorsService;
        }

        #endregion


        #region Sync

        #region Core

        public GSystemDataModel AddOrUpdateSystem(IDbConnection connection, GSystemDataModel dataModel)
        {
            throw new NotImplementedException();
        }

        public IList<GSystemDataModel> AddOrUpdateSystems(IDbConnection connection, IList<GSystemDataModel> systems)
        {
            var db = _systemRepo.AddOrUpdateAllModels(connection,systems);
            return _systemCache.UpdateLocalItems(connection,db);
        }

        public void DeleteSystem(IDbConnection connection, int id)
        {
            throw new NotImplementedException();
        }

        public void DeleteAllSystems(IDbConnection connection)
        {
            throw new NotImplementedException();
        }

        #endregion

        public TResult GetSystem<TResult>(IDbConnection connection, int systemId, Func<GSystemDataModel, TResult> selector)
        {
            var sys = _systemCache.GetById(connection,systemId, true);
            return sys == null ? default(TResult) : selector(sys);
        }

        public IList<SystemsView> GetSystemViewsBySector(IDbConnection connection, int sectorId)
        {
            var systems = _systemCache.LocalWhere(connection,i => i.SectorId == sectorId);
            var sys = systems as IList<GSystemDataModel> ?? systems.ToList();

            var ids = sys.Select(i => i.Id).ToList();
            var detailSystems = _detailSystemCache.GetDataModelItems(connection,ids);

            //todo  почему у коллекции  GDetailSystemDataModel есть поле typeId  которео должно относится к модели GGeometryStarDataModel
            var stars = _geometryStarCache.GetDataModelItems(connection,ids);
            var r = sys.Join(detailSystems, (sysItem) => sysItem.Id,
                (detailItem) => detailItem.Id,
                (sysItem, detailItem) => new SystemsView
                {
                    Id = sysItem.Id,
                    GalaxyId = sysItem.GalaxyId,
                    SectorId = sysItem.SectorId,
                    Coords = sysItem.Position,
                    GameTypeId = detailItem.TypeId,
                    NativeName = detailItem.Name,
                    //TextureTypeId in stars 
                }).ToList();
            foreach (var s in r) s.TextureTypeId = stars.First(i => i.Id == s.Id).TextureTypeId;
            return r;
        }

        public IList<int> GetSystemIds(IDbConnection connection, int sectorId)
        {
            return _systemCache.LocalWhereSelect(connection,i => i.SectorId == sectorId, i => i.Id);
        }

        public IList<int> GetAllSystemIds(IDbConnection connection)
        {
            return _systemCache.GetLocalStorageKeys(connection);
        }

        public string Test(string message = "Ok")
        {
            return message;
        }

        #endregion
    }
}