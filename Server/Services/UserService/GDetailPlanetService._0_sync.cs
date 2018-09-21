using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Infrastructure;
using Server.Core.Interfaces.UserServices;
using Server.Core.Interfaces.World;
using Server.Core.Map;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Resources;
using Server.DataLayer;
using Server.DataLayer.LocalStorageCaches;
using Server.DataLayer.Repositories;
using Server.Services.NpcArea;

namespace Server.Services.UserService
{
    public partial class GDetailPlanetService : IGDetailPlanetService {
        private readonly IGDetailPlanetLocalStorageCache _planetDetailCache;
        private readonly IGDetailPlanetRepository _planetDetailRepo;
        private readonly IGGeometryPlanetLocalStorageCache _planetGeometryCache;
        private readonly IPlanetNameToPlanetIdPkCache _planetNameSercheCache;

        private readonly ISystemService _systemService;

        //private readonly IGGeometryPlanetBaseDapperRepository _planetBaseDapperGeometryRepo;
        //private readonly IGDetailSystemLocalStorageCache _systemDetailCache;

        public GDetailPlanetService(IGDetailPlanetLocalStorageCache planetDetailCache,
            IGDetailPlanetRepository planetDetailRepo, IGGeometryPlanetLocalStorageCache planetGeometryCache,
            IPlanetNameToPlanetIdPkCache planetNameSercheCache,
            ISystemService systemService) {
            _planetDetailCache = planetDetailCache;
            _planetDetailRepo = planetDetailRepo;
            _planetGeometryCache = planetGeometryCache;

            _planetNameSercheCache = planetNameSercheCache;
            _systemService = systemService;
        }

        public GDetailPlanetDataModel GetUserPlanet(IDbConnection connection, int planetId, int userId, bool checkPlanet = true) {
            var detailPlanet = GetPlanet(connection, planetId, checkPlanet);
            if (detailPlanet.UserId != userId) {
                throw new Exception(Error.PlanetNotExsist);
            }
            return detailPlanet;
        }

        public GDetailPlanetDataModel GetPlanet(IDbConnection connection, int planetId, bool checkPlanet = true) {
            var detailPlanet = _planetDetailCache.GetById(connection,planetId, true);
            if (checkPlanet && detailPlanet == null) {
                throw new Exception(Error.PlanetNotExsist);
            }

            return detailPlanet;
        }

        public TResult GetUserPlanet<TResult>(IDbConnection connection, int planetId, int userId, Func<GDetailPlanetDataModel, TResult> selector, bool checkPlanet = true) {
            var planet = GetUserPlanet(connection, planetId, userId, checkPlanet);
            return selector(planet);
        }

        public GDetailPlanetDataModel GetPlanet(IDbConnection connection, string planetName) {
            var planetId = _planetNameSercheCache.TryGetValue(connection,planetName, _planetDetailCache);
            if (planetId == 0) {
                throw new Exception(Error.PlanetNameNotExsist);
            }
            return _planetDetailCache.GetById(connection,planetId, true);
        }

        public int GetPlanetId(IDbConnection connection, string planetName) {
            return _planetNameSercheCache.GetOrAdd(connection,planetName, _planetDetailCache);
        }


        public IList<GDetailPlanetDataModel> GetAllPlanet(IDbConnection connection) {
            return _planetDetailCache.LocalGetAll(connection);
        }

        public List<int> GetAllUsersPlanetIds(IDbConnection connection) {
            var pIds =
                _planetDetailCache.LocalWhereSelect(connection,i => i.UserId != Npc.SkagryGameUserId && i.UserId != Npc.ConfederationGameUserId,
                    i => new {i.Id, i.UserId});
            return pIds.OrderBy(i => i.UserId).Select(i => i.Id).ToList();
        }

        public IList<GDetailPlanetDataModel> GetAllUsersPlanets(IDbConnection connection) {
            return _planetDetailCache.LocalWhereSelect(connection,i => i.UserId != Npc.SkagryGameUserId && i.UserId != Npc.ConfederationGameUserId, i => i);
        }

        public IList<GDetailPlanetDataModel> GetUserPlanets(IDbConnection connection, int userId) {
            return _planetDetailCache.LocalWhereSelect(connection,i => i.UserId == userId, i => i);
        }

        public IList<int> GetUserPlanetIds(IDbConnection connection, int userId) {
            return _planetDetailCache.LocalWhereSelect(connection,i => i.UserId == userId, i => i.Id);
        }


        public IList<GDetailPlanetDataModel> GetAlliancePlanets(IDbConnection connection, int allianceId) {
            return _planetDetailCache.LocalWhereSelect(connection,i => i.AllianceId == allianceId, i => i);
        }

        public StorageResources GetResources(IDbConnection connection, int planetId, int userId) {
            var planet = GetUserPlanet(connection, planetId, userId);
            return planet.Resources;
        }

        public bool UpdatePlanetName(IDbConnection connection, int planetId, string newPlanetName) {
            if (newPlanetName.Length < (int) MinLenghtConsts.PlaneetName) {
                throw new ArgumentException(Error.LessMin, nameof(newPlanetName));
            }
            if (newPlanetName.Length > (int) MaxLenghtConsts.UniqueName) {
                newPlanetName = newPlanetName.Substring(0, (int) MaxLenghtConsts.UniqueName);
            }

            var exist = GetPlanetId(connection, newPlanetName);
            if (exist != 0) {
                throw new NotImplementedException(Error.PlanetNameNotUnic);
            }

            var planet = _planetDetailRepo.GetModelById(connection,planetId);
            var oldName = planet.Name;
            planet.Name = newPlanetName;
            planet = _planetDetailRepo.AddOrUpdateeModel(connection,planet);
            //   _provider.Commit();
            return _planetNameSercheCache.TryUpdateKey(connection,planetId, oldName, newPlanetName, _planetDetailCache);
        }

        /// <summary>
        /// Извлекает планету и устанавливает новго владельца если  еще не был назначен, иначе ничего не делает
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="planetId"></param>
        /// <param name="newOwner"></param>
        /// <param name="allianceService"></param>
        public void UpdatePlanetOwner(IDbConnection connection, int planetId, int newOwner, IAllianceService allianceService) {
            var planet = GetPlanet(connection, planetId, false);
            if (planet.UserId!= newOwner)
            {
                UpdatePlanetOwner(connection, planet, newOwner, allianceService);
            }

        }

        
        /// <summary>
        ///  Не делает проверки планеты на текущее состояние.
        ///  Если планета уже имеет установленного владельца, проверку нужно делать перед методом
        /// В любом слае  отправляет запрос на обновление планеты, и извлечение альянса
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="planet"></param>
        /// <param name="newOwner"></param>
        /// <param name="allianceService"></param>
        public void UpdatePlanetOwner(IDbConnection connection, GDetailPlanetDataModel planet, int newOwner, IAllianceService allianceService) {
            var npc = NpcHelper.GetNpcByName(Npc.SkagyName);
            if (newOwner == npc.NpcUser.Id)
            {
                planet.AllianceId = npc.NpcAlliance.Id;
                planet.UserId = newOwner;
                AddOrUpdate(connection, planet);
                return;
            }

            var allianceUser = allianceService.GetAllianceUserByUserId(connection, newOwner);
            if (planet.AllianceId != allianceUser.AllianceId)
            {
                planet.AllianceId = allianceUser.AllianceId;
            }
            planet.UserId = newOwner;
            AddOrUpdate(connection, planet);
        }

        /// <summary>
        /// NotImplementedException
        /// извлекает планеты, если планеты существуют, устанавливает всем планетам у которых юзер ид не скагри владельца скагри
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="allianceService"></param>
        public void ResetAllPlanetsToNpc(IDbConnection connection, IAllianceService allianceService) {
            var planets = GetAllUsersPlanets(connection);
            if (planets == null) {
                return;
            }
            foreach (var planet in planets) {
                if (planet.UserId!= Npc.SkagryGameUserId)
                {
                    UpdatePlanetOwner(connection, planet, Npc.SkagryGameUserId, allianceService);
                }

            }

            //_gDetailPlanetRepository.UpdateListAndSave(planets, i => { i.owner = Npc.SkagyName; });
        }

        public bool PlanetsExist() {
            return _planetDetailCache.ContainAny();
        }

        public string Test(string message = "Ok") {
            return message;
        }

        public TResult GetPlanet<TResult>(IDbConnection connection, int planetId, Func<GDetailPlanetDataModel, TResult> selector) {
            return selector(GetPlanet(connection, planetId));
        }

        public TResult GetByPlanetName<TResult>(IDbConnection connection, string planetName, Func<GDetailPlanetDataModel, TResult> selector) {
            return selector(GetPlanet(connection, planetName));
        }


        public IList<string> GetPlanetNames(IDbConnection connection, Func<GDetailPlanetDataModel, bool> @where) {
            return _planetDetailCache.LocalWhereSelect(connection,where, i => i.Name);
        }


        public MapAdress GetAdress(IDbConnection connection, string planetName) {
            var planetId = GetPlanetId(connection, planetName);
            return GetAdress(connection, planetId);
        }

        public MapAdress GetAdress(IDbConnection connection, int planetId) {
            var planet = _planetGeometryCache.GetById(connection,planetId, true);
            var parentAdress = _systemService.GetAdress(connection, planet.SystemId);
            parentAdress.OwnId = planet.Id;
            parentAdress.PlanetPosition = new Vector3(planet.Orbit, null, null);
            return parentAdress;
        }

        #region Core IBaseService

        public void UpdatePlanetOwner(IDbConnection connection, int planetId, int newOwner) {
            var planet = _planetDetailCache.GetById(connection,planetId, true);
            if (planet.UserId == newOwner) {
                return;
            }
            planet.UserId = newOwner;
            ResetProgress(ref planet);
            AddOrUpdate(connection,planet);
        }

        public GDetailPlanetDataModel AddOrUpdate(IDbConnection connection, GDetailPlanetDataModel dataModel) {
            var db = _planetDetailRepo.AddOrUpdateeModel(connection,dataModel);
            var planet = _planetDetailCache.UpdateLocalItem(connection,db);
            _planetNameSercheCache.AddOrUpdate(connection,planet.Name, planet.Id, _planetDetailCache);
            return planet;
        }

        public IList<GDetailPlanetDataModel> AddOrUpdateDetailPlanetList(IDbConnection connection, IList<GDetailPlanetDataModel> dataModel) {
            dataModel = _planetDetailRepo.AddOrUpdateAllModels(connection,dataModel);
            var planets = _planetDetailCache.UpdateLocalItems(connection,dataModel);
            foreach (var planet in planets) {
                _planetNameSercheCache.AddOrUpdate(connection,planet.Name, planet.Id, _planetDetailCache);
            }
            return planets;
        }

        public bool Delete(IDbConnection connection, int planetId)
        {
   
            var old = _planetDetailCache.GetById(connection,planetId, true);
            if (old == null) {
                return true;
            }
            var sucsess = _planetDetailRepo.Delete(connection,planetId);
            //   _provider.Commit();
            if (sucsess) {
                _planetDetailCache.DeleteItem(planetId);
                return true;
            }
            throw new NotImplementedException(Error.ErrorInUpdateDb);
        }

        public bool DeleteAll(IDbConnection connection) {
 
            if (_planetDetailRepo.HasItems(connection)) {
                var suc = _planetDetailRepo.DeleteAllProcedure(connection);
                if (!suc) {
                    throw new NotImplementedException(Error.DbError);
                }
                  
            }
            _planetDetailCache.ClearStorage();
            return true;
        }

        #endregion

        #region Advanced

        public IList<EstateItemOut> GetUserEstates(IDbConnection connection, int userId) {
            var planets = GetUserPlanets(connection, userId);
            return GetUserEstates(connection, planets);
        }

        public IList<EstateItemOut> GetUserEstates(IDbConnection connection, IList<GDetailPlanetDataModel> planets) {
            if (planets.Any()) {
                var planetIds = planets.Select(i => i.Id).ToList();
                var geometry = _planetGeometryCache.GetDataModelItems(connection,planetIds);
                return
                    planets.OrderBy(i => i.Id)
                        .Select(i => { return SetPlanetEstateItem(connection, i.Name, geometry.First(g => g.Id == i.Id)); })
                        .ToList();
            }
            return default(IList<EstateItemOut>);
        }


        public EstateItemOut GetUserEstate(IDbConnection connection, int planetId, int userId) {
            var planet = GetUserPlanet(connection, planetId, userId);
            return SetPlanetEstateItem(connection, planet.Name, _planetGeometryCache.GetById(connection,planet.Id, true));
        }

        public short GetPlanetCountInSystem(IDbConnection connection, int systemId) {
            return
                _planetGeometryCache.LocalOperation(connection,
                    col => { return (short) col.Count(i => i.SystemId == systemId); });
        }

        public GDetailPlanetDataModel SetNewResources(IDbConnection connection, int planetId, int userId, StorageResources newResources) {
            return UpdateUserPlanet(connection, planetId, userId, planet => {
                planet.Resources = newResources;
                return planet;
            });
        }


        public GDetailPlanetDataModel UpdateUserPlanet(IDbConnection connection, int planetId, int userId, Func<GDetailPlanetDataModel, GDetailPlanetDataModel> updateVals) {
            var planet = GetUserPlanet(connection, planetId, userId);
            return AddOrUpdate(connection,updateVals(planet));
        }

        public EstateItemOut SetPlanetEstateItem(IDbConnection connection, string planetName, GGeometryPlanetDataModel geometry) {
            return new EstateItemOut {
                Name = planetName,
                Type = true,
                System = geometry.SystemId,
                Sector = geometry.SectorId,
                Galaxy = geometry.GalaxyId,
                OwnId = geometry.Id,
                GameTypeId = geometry.TypeId,
                TextureTypeId = geometry.TextureTypeId
            };
        }

        #endregion
    }
}