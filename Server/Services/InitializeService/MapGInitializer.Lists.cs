using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using Server.Core.Map.Structure;
using Server.DataLayer;
using Server.DataLayer.Repositories;
using Server.Extensions;

namespace Server.Services.InitializeService
{
    public partial class MapGInitializer
    {
        private IList<PlanetGeometry> _getPlanetCollection(IDbConnection connection)
        {
            var detailSystems =   _systemService.GetAllDetailSystems(connection, i => new { i.Name, i.Id });
            var planets =   _gGeometryPlanetService.GetAll(connection, _execPlanetItem());
            planets = planets.Select(p =>
            {
                p.NativeName = detailSystems.First(i => i.Id == p.SystemId).Name + "-" + p.SystemPosition;
                return p;
            }).ToList();
            return planets;

        }

        //g_geometry_planet
        private static Func<GGeometryPlanetDataModel, PlanetGeometry> _execPlanetItem()
        {
            return i => new PlanetGeometry
            {
                Id = i.Id,
                GalaxyId = i.GalaxyId,
                SectorId = i.SectorId,
                SystemId = i.SystemId,
                Parent = i.SystemId,
                Radius = i.Radius,
                GameTypeId = i.TypeId,
                NativeName = null,
                OrbitAngle = i.OrbitAngle,
                AxisAngle = i.AxisAngle,
                Orbit = i.Orbit,
                Rings = i.RingTypeId,
                SystemPosition = i.SystemPosition,
                Color = i.Color,
                TextureTypeId = i.TextureTypeId,
                OrbitPosition = i.OrbitPosition
            };
        }


        private IList<MoonGeometry> _getMoonCollection(IDbConnection connection, int starId)
        {
            var moons =   _moonService.GetGeometryMoonByStarId(connection, starId, i => new MoonGeometry
            {
                GalaxyId = i.GalaxyId,
                SectorId = i.SectorId,
                SystemId = i.SystemId,
                Parent = i.PlanetId,
                Id = i.Id,
                GameTypeId = i.TypeId,
                TextureTypeId = i.TextureTypeId,
                NativeName = "",
                OrbitAngle = i.OrbitAngle,
                AxisAngle = i.OrbitAngle,
                Orbit = i.Orbit,
                Radius = i.Radius,
                OrbitPosition = i.OrbitPosition
            });

            foreach (var moon in moons)
            {
                var detailMoon =  _moonService.GetDetailMoon(connection, moon.Id);
                moon.NativeName = detailMoon.Name;
            }

            return moons.OrderBy(i => i.Parent).ToList();
        }


        private IList<PlanetDetail> _getPlanetDetailCollection(IDbConnection connection)
        {
            var planets =   _gDetailPlanetService.GetAllPlanet(connection);
            return planets.Select(planet => new PlanetDetail
            {
                Id = planet.Id,
                MoonCount = planet.MoonCount
            }).ToList();
        }


        private IList<StarGeometry> _getStarCollection(IDbConnection connection)
        {
            var systemRepo = _resolver.GetService<IGSystemRepository>();
            var starGeometryRepo = _resolver.GetService<IGGeometryStarRepository>();
            var detailSystemRepo = _resolver.GetService<IGDetailSystemRepository>();


            var systems =   systemRepo.GetAllModels(connection);
            var stars =   starGeometryRepo.GetAllModels(connection);
            var detailSystems =   detailSystemRepo.GetAllModels(connection);


            var starGeometry = new List<StarGeometry>();
            foreach (var s in systems)
            {
                var starG = stars.First(i => i.Id == s.Id);
                var detailSystem = detailSystems.First(i => i.Id == s.Id);
                starGeometry.Add(new StarGeometry
                {

                    GalaxyId = s.GalaxyId,
                    SectorId = s.SectorId,
                    Id = s.Id,
                    Radius = starG.Radius,
                    TextureTypeId = starG.TextureTypeId,
                    GameTypeId = starG.TypeId,
                    Parent = s.SectorId,
                    NativeName = detailSystem.Name,
                    Coords = s.Position
                });
            }
            return starGeometry;
        }


        private IList<short> _getSectorIds(IDbConnection connection, byte galaxyNum)
        {
            var sectors =   _gSectorsService.GetSectorsByGalaxy(connection, galaxyNum, i => i.Id);
            return sectors.OrderBy(i => i).ToList();
        }


        private List<string> _getSystemNames(IDbConnection connection)
        {
            if (_systemNames != null) return _systemNames;
            var names =   _sysHelperRepository.GetModelById(connection,(int)SysTypeNames.SystemNames);
            if (names != null && !string.IsNullOrWhiteSpace(names.Value))
            {
                _systemNames = names.Value.ToSpecificModel<List<string>>();
                return _systemNames;
            }
            _generateSystemsNames(connection);
            return _systemNames;
        }
    }
}