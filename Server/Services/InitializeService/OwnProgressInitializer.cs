using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Infrastructure.Unit;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Resources;
using Server.DataLayer;
using Server.Services.GameObjects.BuildModel.BuildItem;

namespace Server.Services.InitializeService
{
    /// <summary>
    ///     только для тестов
    /// </summary>
    public class OwnProgressInitializer : IOwnProgressInitializer
    {
        #region Declare

        private readonly IGDetailPlanetService _gDetailPlanetService;
        private readonly IMothershipService _mothershipService;
        private readonly IStoreService _storeService;

        public OwnProgressInitializer(IGDetailPlanetService gDetailPlanetService, IMothershipService mothershipService,
            IStoreService storeService)
        {
            _gDetailPlanetService = gDetailPlanetService;
            _mothershipService = mothershipService;
            _storeService = storeService;
        }

        #endregion

        #region Interface

        public void ResetAdminPlanets(IDbConnection connection)
        {
            var admin = MainUserRepository.GetAdminUser();

            if (admin.GameId == 0)
            {
                throw new ArgumentNullException(nameof(admin.GameId), "GameId not set in instance");
            }

            _updatePlanetList(connection, _gDetailPlanetService.GetUserPlanets(connection, admin.GameId),
                i => SetInitialPlanetBuilds(i, admin.GameId));

            ResetMotherResourceById(connection, admin.GameId);
        }

        #endregion


        private void _updatePlanetList(IDbConnection connection, IList<GDetailPlanetDataModel> col,
            Func<GDetailPlanetDataModel, GDetailPlanetDataModel> action)
        {
            foreach (var planet in col)
            {
                _updatePlanet(connection, planet, action);
            }
        }

        private void _updatePlanet(IDbConnection connection, GDetailPlanetDataModel planet,
            Func<GDetailPlanetDataModel, GDetailPlanetDataModel> action)
        {
            _gDetailPlanetService.AddOrUpdate(connection, action(planet));
        }

        #region Builds

        public void IntAllPlanetBuilds(IDbConnection connection)
        {
            _updatePlanetList(connection, _gDetailPlanetService.GetAllPlanet(connection), i => SetInitialPlanetBuilds(i));
        }

        public GDetailPlanetDataModel SetInitialPlanetBuilds(GDetailPlanetDataModel planet, int userId = 1)
        {
            var intiData = ItemProgress.InitBuildingProgress();
            var turel = ItemProgress.InitBuildingProgress();
            turel.Level = 0;

            planet.BuildEnergyConverter = intiData;
            planet.BuildExtractionModule = intiData;
            planet.BuildStorage = intiData;
            planet.BuildSpaceShipyard = intiData;
            planet.Turels = turel;
            planet.ExtractionProportin = MaterialResource.InitBaseOwnProportion();
            planet.UserId = userId;
            return planet;
        }

        // todo внести метод в инициализацию новой планеты когда такой появится
        public void SetAllInitialPlanetBuilds(IDbConnection connection, UserDataModel user, int planetId)
        {
            _updatePlanet(connection, _gDetailPlanetService.GetUserPlanet(connection, planetId, user.Id),
                i => SetInitialPlanetBuilds(i, user.Id));
        }

        public void ResetStorageBuild(IDbConnection connection)
        {
            var progress = ItemProgress.InitBuildingProgress();
            _updatePlanetList(connection, _gDetailPlanetService.GetAllPlanet(connection), i =>
            {
                i.BuildStorage = progress;
                return i;
            });
        }

        public void ResetAllTurels(IDbConnection connection)
        {
            var progress = ItemProgress.InitBuildingProgress();
            progress.Level = 0;
            _updatePlanetList(connection, _gDetailPlanetService.GetAllPlanet(connection), i =>
            {
                i.Turels = progress;
                return i;
            });
        }

        public void ResetAllEnergyConverters(IDbConnection connection)
        {
            var progress = ItemProgress.InitBuildingProgress();
            progress.Level = 0;
            _updatePlanetList(connection, _gDetailPlanetService.GetAllPlanet(connection), i =>
            {
                i.BuildEnergyConverter = progress;
                return i;
            });
        }

        #endregion

        #region Resource

        public void ResetAllMotherResources(IDbConnection connection)
        {
            var res = StorageResources.InitMotherResources();
            var mothers = _mothershipService.GetAllMothers(connection);
            foreach (var mother in mothers)
            {
                mother.Resources = res;
            }
            _mothershipService.AddOrUpdate(connection, mothers);
        }

        public void ResetMotherResourceById(IDbConnection connection, int userId)
        {
            var res = StorageResources.InitMotherResources();
            var mother = _mothershipService.GetMother(connection, userId);
            mother.Resources = res;
            _mothershipService.AddOrUpdate(connection, mother);
        }

        #endregion

        #region Hangar and resource

        public void ResetPlanetHangarAndResource(IDbConnection connection)
        {
            var progress = ItemProgress.InitBuildingProgress();
            progress.Level = 0;
            var prems = new List<UserPremiumDataModel>();
            var planets = _gDetailPlanetService.GetAllPlanet(connection);
            foreach (var planet in planets)
            {
                var prem = prems.FirstOrDefault(i => i.Id == planet.UserId);
                if (prem == null)
                {
                    prem = _storeService.GetUserPremium(connection, planet.UserId);
                    if (prem != null)
                    {
                        prems.Add(prem);
                    }
                }

                var finished = true;
                var hasPrem = prem != null;
                if (hasPrem)
                {
                    finished = prem.Finished;
                }


                _gDetailPlanetService.AddOrUpdate(connection,
                    SetInitialHangarAndResource(connection, planet, prem != null && !finished));
            }
        }

        public GDetailPlanetDataModel SetInitialHangarAndResource(IDbConnection connection,
            GDetailPlanetDataModel planet, bool premium = false)
        {
            planet.Hangar = UnitList.InitUnitsInOwn(true);

            planet.Resources = new StorageResources
            {
                Current = MaterialResource.InitStartResourses(),
                Max = Storage.MaxStorable(1, premium)
            };
            return planet;
        }

        public void ResetMotherHangar(IDbConnection connection)
        {
            var initHangar = UnitList.InitUnitsInOwn();
            var mothers = _mothershipService.GetAllMothers(connection);
            foreach (var mother in mothers)
            {
                mother.Hangar = initHangar;
            }
            _mothershipService.AddOrUpdate(connection, mothers);
        }

        #endregion
    }
}