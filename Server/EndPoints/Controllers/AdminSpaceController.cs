using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Server.Core.Interfaces.UserServices;
using Server.Core.Interfaces.World;
using Server.Core.Map;
using Server.Infrastructure;
using Server.ServicesConnected.Auth.Static;

namespace Server.EndPoints.Controllers
{
    [Authorize(Roles = MainRoles.RDD)]
    public class AdminSpaceController : DefaultController
    {
        #region Declare

        private readonly IGDetailPlanetService _detailPlanetService;
        private readonly IGGalaxyService _galaxyService;
        private readonly IMoonService _moonService;
        private readonly IGSectorsService _sectorsService;
        private readonly ISystemService _systemService;


        public AdminSpaceController(IServiceProvider serviceProvider) : base(serviceProvider)
        {
            _galaxyService = _svp.GetService<IGGalaxyService>();
            _sectorsService = _svp.GetService<IGSectorsService>();
            _systemService = _svp.GetService<ISystemService>();
            _detailPlanetService = _svp.GetService<IGDetailPlanetService>();
            _moonService = _svp.GetService<IMoonService>();
        }

        #endregion
        [Route("[controller]")]
        [Route("{lang}/[controller]")]
        [Route("[controller]/[action]")]
        [Route("{lang}/[controller]/[action]")]
        public IActionResult Index()
        {
            ViewData[PageKeyVal.NotShowHeaderKey] = true;
            ViewData[PageKeyVal.AngularAppKey] = PageKeyVal.AngularAppAdmin;

            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult GetSpaceItems(MapTypes mapType)
        {
            List<AdminSpaceModel> data = null;
            _dbProvider.ContextAction(connection =>
            {
                if (mapType == MapTypes.Galaxy)
                {
                    var galaxy = _galaxyService.GetAllGalxies(connection);
                    data = galaxy.Select(i => new AdminSpaceModel(i, mapType)).ToList();
                }
                else if (mapType == MapTypes.Sector)
                {
                    var sectores = _sectorsService.GetAllSectors(connection);
                    data = sectores.Select(i => new AdminSpaceModel(i, mapType)).ToList();
                }
                else if (mapType == MapTypes.Star)
                {
                    var stars = _systemService.GetAllDetailSystems(connection);
                    data = stars.Select(i => new AdminSpaceModel(i, mapType)).ToList();
                }
                else if (mapType == MapTypes.Planet)
                {
                    var planets = _detailPlanetService.GetAllPlanet(connection);
                    data = planets.Select(i => new AdminSpaceModel(i, mapType)).ToList();
                }
                else if (mapType == MapTypes.Satellite)
                {
                    var moons = _moonService.GetAllDetailMoons(connection);
                    data = moons.Select(i => new AdminSpaceModel(i, mapType)).ToList();
                }
                return true;
            });


            return Json(data);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult UpdateDescription(AdminSpaceModel spaceItem)
        {
            _dbProvider.ContextAction(connection =>
            {
                if (spaceItem.MapType == MapTypes.Galaxy)
                {
                    var galaxy = _galaxyService.GetGalaxyById(connection, (byte) spaceItem.Id, i => i);
                    galaxy.Translate = spaceItem.Translate;
                    _galaxyService.AddOrUpdate(connection, galaxy);
                }
                else if (spaceItem.MapType == MapTypes.Sector)
                {
                    var sector = _sectorsService.GetById(connection, (short) spaceItem.Id, i => i);
                    sector.Translate = spaceItem.Translate;
                    _sectorsService.AddOrUpdate(connection, sector);
                }
                else if (spaceItem.MapType == MapTypes.Star)
                {
                    var star = _systemService.GetDetailSystemBySystemId(connection, spaceItem.Id, i => i);
                    star.Description = spaceItem.Translate;
                    _systemService.AddOrUpdateDetailSystem(connection, star);
                }

                else if (spaceItem.MapType == MapTypes.Planet)
                {
                    var planet = _detailPlanetService.GetPlanet(connection, spaceItem.Id, i => i);
                    planet.Description = spaceItem.Translate;
                    _detailPlanetService.AddOrUpdate(connection, planet);
                }
                else if (spaceItem.MapType == MapTypes.Satellite)
                {
                    var moon = _moonService.GetDetailMoon(connection, spaceItem.Id);
                    moon.Description = spaceItem.Translate;
                    _moonService.AddOrUpdateDetailMoon(connection, moon);
                }
                return true;
            });


            return Json(true);
        }
    }
}