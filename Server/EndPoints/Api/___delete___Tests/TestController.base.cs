using System;
using System.Collections.Generic;
using System.Web.Http;
using app.Data.AdvancedService;
using app.Data.Helper;
using app.Data.Infrastructure;
using app.Data.InitializeService;
using app.Data.UserService;
using app.m_GameServise.BuildModel.BuildItem;
using app.m_GameServise.BuildModel.CollectionBuild;
using app.m_GameServise.Demons;
using app.m_GameServise.Demons.Factory;
using CommonUtils;
using Ninject;
using Services.WorldService;

namespace app.Api.Tests
{
    [Authorize(Roles = MainRoles.Root + ", " + MainRoles.Developer)]
    public partial class TestController : AppApiController, ITest
    {
        private readonly IAllianceService _allianceService;


        private readonly IAuthUsersInitializer _authUsersInitializer;
        private readonly ICommandCenter _commandCenter;


        private readonly IGameUserService _gameUserService;

        private readonly IGDetailPlanetService _gDetailPlanetService;
        private readonly IGSectorsService _gSectorsService;
        private readonly IIndustrialComplex _industrialComplex;
        private readonly IMainInitializer _mainInitializer;


        private readonly IMapAdressService _mapAdressService;
        private readonly IMapGInitializer _mapGInitializer;
        private readonly IMotherFactory _motherFactory;
        private readonly IMothershipService _mothershipService;
        private readonly INpcInitializer _npcInitializer;

        private readonly IPlanetFactory _planetFactory;
        private readonly IShipyard _shipyard;
        private readonly IStorage _storage;

        private readonly IStorageResourcesService _storageResourcesService;
        private readonly ISynchronizer _synchronizer;
        private readonly ISystemService _systemService;


        private readonly Dictionary<string, string> _injectMessages = new Dictionary<string, string>();

        public TestController(IUserSessionService userSessionService, IKernel kernel) : base(userSessionService)
        {
            #region b1

            try
            {
                _commandCenter = kernel.Get<ICommandCenter>();
                _injectMessages.Add("ICommandCenter", _commandCenter.Test());
            }
            catch (Exception e)
            {
                _injectMessages.Add("exeption ICommandCenter", e.Message);
                throw new Exception(_injectMessages.ToSerealizeString());
            }

            try
            {
                _gameUserService = kernel.Get<IGameUserService>();
                _injectMessages.Add("IGameUserService", _gameUserService.Test());
            }
            catch (Exception e)
            {
                _injectMessages.Add("exeption IUserChestHelper", e.Message);

                throw new Exception(_injectMessages.ToSerealizeString());
            }

            #endregion

            #region b2

            try
            {
                _gDetailPlanetService = kernel.Get<IGDetailPlanetService>();
                _injectMessages.Add("IGDetailPlanetService", _gDetailPlanetService.Test());
            }
            catch (Exception e)
            {
                _injectMessages.Add("exeption IGDetailPlanetService", e.Message);

                throw new Exception(_injectMessages.ToSerealizeString());
            }
            try
            {
                _industrialComplex = kernel.Get<IIndustrialComplex>();
                _injectMessages.Add("IIndustrialComplex", _industrialComplex.Test());
            }
            catch (Exception e)
            {
                _injectMessages.Add("exeption IIndustrialComplex", e.Message);

                throw new Exception(_injectMessages.ToSerealizeString());
            }
            try
            {
                _motherFactory = kernel.Get<IMotherFactory>();
                _injectMessages.Add("IMotherFactory", _motherFactory.Test());
            }
            catch (Exception e)
            {
                _injectMessages.Add("exeption IMotherFactory", e.Message);

                throw new Exception(_injectMessages.ToSerealizeString());
            }
            try
            {
                _mothershipService = kernel.Get<IMothershipService>();
                _injectMessages.Add("IMothershipService", _mothershipService.Test());
            }
            catch (Exception e)
            {
                _injectMessages.Add("exeption IMothershipService", e.Message);

                throw new Exception(_injectMessages.ToSerealizeString());
            }

            #endregion

            #region b3

            try
            {
                _planetFactory = kernel.Get<IPlanetFactory>();
                _injectMessages.Add("IPlanetFactory", _planetFactory.Test());
            }
            catch (Exception e)
            {
                _injectMessages.Add("exeption IPlanetFactory", e.Message);

                throw new Exception(_injectMessages.ToSerealizeString());
            }

            try
            {
                _shipyard = kernel.Get<IShipyard>();
                _injectMessages.Add("IShipyard", _shipyard.Test());
            }
            catch (Exception e)
            {
                _injectMessages.Add("exeption IShipyard", e.Message);

                throw new Exception(_injectMessages.ToSerealizeString());
            }
            try
            {
                _storage = kernel.Get<IStorage>();
                _injectMessages.Add("IStorage", _storage.Test());
            }
            catch (Exception e)
            {
                _injectMessages.Add("exeption IStorage", e.Message);

                throw new Exception(_injectMessages.ToSerealizeString());
            }

            #endregion

            #region b4

            try
            {
                _storageResourcesService = kernel.Get<IStorageResourcesService>();
                _injectMessages.Add("IStorageResourcesService", _storageResourcesService.Test());
            }
            catch (Exception e)
            {
                _injectMessages.Add("exeption IStorageResourcesService", e.Message);

                throw new Exception(_injectMessages.ToSerealizeString());
            }
            try
            {
                _synchronizer = kernel.Get<ISynchronizer>();

                _injectMessages.Add("ISynchronizer", _synchronizer.Test());
            }
            catch (Exception e)
            {
                _injectMessages.Add("exeption ISynchronizer", e.Message);

                throw new Exception(_injectMessages.ToSerealizeString());
            }
            try
            {
                _gSectorsService = kernel.Get<IGSectorsService>();
                _injectMessages.Add("IGSectorsService", _gSectorsService.Test());
            }
            catch (Exception e)
            {
                _injectMessages.Add("exeption IGSectorsService", e.Message);

                throw new Exception(_injectMessages.ToSerealizeString());
            }
            try
            {
                _systemService = kernel.Get<ISystemService>();
                _injectMessages.Add("ISystemService", _systemService.Test());
            }
            catch (Exception e)
            {
                _injectMessages.Add("exeption ISystemService", e.Message);

                throw new Exception(_injectMessages.ToSerealizeString());
            }

            #endregion

            #region b5

            try
            {
                _mapAdressService = kernel.Get<IMapAdressService>();
                _injectMessages.Add("IMapAdressService", _mapAdressService.Test());
            }
            catch (Exception e)
            {
                _injectMessages.Add("exeption IMapAdressService", e.Message);

                throw new Exception(_injectMessages.ToSerealizeString());
            }

            #endregion

            #region b6


            try
            {
                _npcInitializer = kernel.Get<INpcInitializer>();
                _injectMessages.Add("INpcInitializer", _npcInitializer.Test());
            }
            catch (Exception e)
            {
                _injectMessages.Add("exeption INpcInitializer", e.Message);

                throw new Exception(_injectMessages.ToSerealizeString());
            }


            try
            {
                _mapGInitializer = kernel.Get<IMapGInitializer>();
                _injectMessages.Add("IMapGInitializer", _mapGInitializer.Test());
            }
            catch (Exception e)
            {
                _injectMessages.Add("exeption IMapGInitializer", e.Message);

                throw new Exception(_injectMessages.ToSerealizeString());
            }


            try
            {
                _mainInitializer = kernel.Get<IMainInitializer>();
                _injectMessages.Add("IMainInitializer", _mainInitializer.Test());
            }
            catch (Exception e)
            {
                _injectMessages.Add("exeption IMainInitializer", e.Message);

                throw new Exception(_injectMessages.ToSerealizeString());
            }

            #endregion

            #region b7

            try
            {
                _authUsersInitializer = kernel.Get<IAuthUsersInitializer>();
                _injectMessages.Add("IAuthUsersInitializer", _authUsersInitializer.Test());
            }
            catch (Exception e)
            {
                _injectMessages.Add("exeption IAuthUsersInitializer", e.Message);
                throw new Exception(_injectMessages.ToSerealizeString());
            }

            try
            {
                _allianceService = kernel.Get<IAllianceService>();
                _injectMessages.Add("IAllianceService", _allianceService.Test());
            }
            catch (Exception e)
            {
                _injectMessages.Add("exeption IAllianceService", e.Message);
                throw new Exception(_injectMessages.ToSerealizeString());
            }

            #endregion
        }


        [HttpGet]
        public string Test(string message = "Ok")
        {
            return message;
        }

        [HttpGet]
        public IHttpActionResult ShowBaseTest()
        {
            return Json(_injectMessages);
        }
    }
}