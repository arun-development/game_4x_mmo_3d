using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Extensions.DependencyInjection;
using Server.Core.Infrastructure;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.Core.Interfaces.World;
using Server.Core.StaticData;
using Server.DataLayer.LocalStorageCaches;
using Server.DataLayer.Repositories;

namespace Server.Services.InitializeService
{
    public partial class MapGInitializer : IMapGInitializer
    {
        private const byte Scale = 10;
        private const double FactorAngle = Math.PI / 16;
        private const double Factor = 1.61803398875;
        private const int Tes = 90;
        private const double TwoPi = Math.PI * 2;
        private const double OrbitStep = TwoPi / Tes;
        protected static readonly Random Rand = new Random();
        protected static readonly RandomNumbers RandNum = new RandomNumbers();
        private readonly IAllianceService _allianceService;
        private readonly IGameTypeService _gameTypeService;
        private readonly IGDetailPlanetService _gDetailPlanetService;

        private readonly IGGalaxyService _gGalaxyService;
        private readonly IGGeometryPlanetService _gGeometryPlanetService;
        private readonly IGSectorsService _gSectorsService;
        private readonly IOwnProgressInitializer _iOwnProgressInitializer;
        private readonly IMoonService _moonService;
        private readonly ISysHelperRepository _sysHelperRepository;
        private readonly ISystemService _systemService;
        private readonly IServiceProvider _resolver;

        private List<string> _systemNames;

        public MapGInitializer(IGGalaxyService gGalaxyService,
            IGDetailPlanetService gDetailPlanetService,
            IGGeometryPlanetService gGeometryPlanetService,
            IMoonService moonService, ISystemService systemService,
            IGSectorsService gSectorsService,
            IGameTypeService gameTypeService,
            IOwnProgressInitializer iOwnProgressInitializer, ISysHelperRepository sysHelperRepository,
            IAllianceService allianceService, IServiceProvider resolver)
        {
            _gGalaxyService = gGalaxyService;
            _gDetailPlanetService = gDetailPlanetService;
            _gGeometryPlanetService = gGeometryPlanetService;
            _moonService = moonService;
            _systemService = systemService;
            _gSectorsService = gSectorsService;
            _gameTypeService = gameTypeService;
            _iOwnProgressInitializer = iOwnProgressInitializer;
            _sysHelperRepository = sysHelperRepository;
            _allianceService = allianceService;

            _resolver = resolver;
        }


        public void UpdatePlanetOwner(IDbConnection connection, int planetId, int userId)
        {
            _gDetailPlanetService.UpdatePlanetOwner(connection, planetId, userId, _allianceService);
        }

        public void ResetAllPlanetsToNpc(IDbConnection connection)
        {
            _gDetailPlanetService.ResetAllPlanetsToNpc(connection, _allianceService);
        }


        public void Init(IDbConnection connection)
        {
            throw new NotImplementedException(Error.NotUsedServerMethod);
        }

        public void CreateAll(IDbConnection connection)
        {
            //init stores 


            _gGalaxyService.GetGalaxyIds(connection);
            _gSectorsService.GetById(connection, 1, i => i);
            _systemService.GetSystem(connection, 1, i => i);
            _systemService.GetGeometryStarById(connection, 1, i => i);
            _systemService.GetDetailSystemBySystemId(connection, 1, i => i);
            _gGeometryPlanetService.GetGeometryPlanetById(connection, 1);
            _gDetailPlanetService.GetPlanet(connection, 1, false);
            _moonService.GetGeometryMoon(connection, 1);
            _moonService.GetDetailMoon(connection, 1);

            var act = new List<Func<IDbConnection, bool>>() { CreateGalaxies,
                          CreateSectors,
                          CreateSystems,
                          CreateStars,
                          CreatePlanets,
                          CreatePlanetDetails,
                          CreateMoons,
                          CreateSystemGeometries,
                          UpdateStarEnergyBonuses,
                          UpdateSectorsToArchForm
        };

            var len = act.Count;
            for (int i = 0; i < len; i++)
            {
              var suc =  act[i](connection);
                if (!suc) {
                    throw new NotImplementedException("CreateAll failed, last metod:" + act[i].Method.Name);
                }
            }



        }

        public bool DataExist(IDbConnection connection)
        {
            return _gGalaxyService.GalaxyDataExist(connection);
        }

        public void DeleteAll(IDbConnection connection)
        {
            //if (!await DataExist()) return;
            try
            {
                //  await _gDetailPlanetService.ResetAllPlanetsToNpcAsync(_allianceService);
                _gGalaxyService.DeleteAll(connection);
                _gSectorsService.ResetSectorCahce();
            }

            finally
            {
                var planetIds = _resolver.GetService<IPlanetNameToPlanetIdPkCache>();
                planetIds.ClearStorage();
                var systemIds = _resolver.GetService<ISystemNameSercherPkCache>();
                systemIds.ClearStorage();

                _resolver.GetService<IGSystemLocalStorageCache>().ClearStorage();
                _resolver.GetService<IGDetailSystemLocalStorageCache>().ClearStorage();
                _resolver.GetService<IGGeometrySystemLocalStorageCache>().ClearStorage();
                _resolver.GetService<IGGeometrySystemLocalStorageCache>().ClearStorage();
                _resolver.GetService<IGGeometryPlanetLocalStorageCache>().ClearStorage();
                _resolver.GetService<IGGeometryMoonLocalStorageCache>().ClearStorage();
                _resolver.GetService<IGDetailSystemLocalStorageCache>().ClearStorage();
                _resolver.GetService<IGDetailPlanetLocalStorageCache>().ClearStorage();
                _resolver.GetService<IGDetailMoonLocalStorageCache>().ClearStorage();
            }
        }


        public string Test(string message = "Ok")
        {
            return message;
        }
    }
}