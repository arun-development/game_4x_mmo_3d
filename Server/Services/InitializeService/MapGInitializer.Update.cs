using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Map;
using Server.Core.Map.Structure;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.DataLayer;
using Server.Extensions;
using Server.Utils.Map;

namespace Server.Services.InitializeService
{
    public partial class MapGInitializer
    {
        public bool UpdateStarEnergyBonuses(IDbConnection connection)
        {
            //var starList = _systemService.GetAllDetailSystems(i => i);
            var starList = _systemService.GetAllDetailSystems(connection,i => i);
            var starBonus = new StarEnergyBonus().StarTypeCollection;

            var starTypes = _gameTypeService.GetGGameTypes(connection, MapTypes.Star.ToString());
            foreach (var s in starList)
            {
                var starSubTypeName = starTypes.First(i => i.Id == s.TypeId).SubType;
                var range = starBonus[starSubTypeName];
                var energyBonus = (double) Rand.Next(range.Min, range.Max) / 10;
                s.EnergyBonus = 1 + energyBonus;
            }

            starList.PagerAction(2000, stars => _systemService.AddOrUpdateDetailSystems(connection, stars));
            return true;
        }

        public bool UpdateSectorsToArchForm(IDbConnection connection)
        {
            var sectors = _gSectorsService.GetAllSectors(connection);
            double a = 500;
            var angle = Math.PI * 8;
            var angleStep = Math.PI / 10000;

            double lenghtStep = 1000;
            double totalLenght = 30000;

            for (var i = 0; i < sectors.Count(); i++)
                while (true)
                {
                    var lenght = (a / (4 * Math.PI)) *
                                 (angle * Math.Sqrt(1 + Math.Pow(angle, 2)) +
                                  Math.Log(angle + Math.Sqrt(1 + Math.Pow(angle, 2)), Math.E));

                    if (totalLenght <= lenght)
                    {
                        totalLenght = lenght + lenghtStep;

                        var x = a / Math.PI * Math.Sin(-angle) * (i + 25);
                        var z = a / Math.PI * Math.Cos(-angle) * (i + 25);

                        var sector = sectors[i];

                        var position = new Vector3
                        {
                            X = z,
                            Y = 0,
                            Z = x
                        };
                        sector.Position = position;
                        //sectors[i] = sector;
                        break;
                    }

                    angle += angleStep;
                }

            var suc = _gSectorsService.AddOrUpdateAllSectors(connection, sectors).Any();
       
            return suc;
        }


        private void _updateSectorsToLogarifmicForm(IDbConnection connection)
        {
            var sectors = _gSectorsService.GetAllSectors(connection);
            //==================
            var t = 1;

            double a = 1500;
            var b = 0.1;
            var r = 0;
            foreach (var sector in sectors)
            {
                var x = a * Math.Exp(b * t) * Math.Cos(t);
                var z = a * Math.Exp(b * t) * Math.Sin(t);
                //double y = 50;
                //var k = (t % 5 == 0) ? 1 : -1;
                var position = new Vector3
                {
                    X = z,
                    Y = 0,
                    Z = x
                };
                sector.Position = position;

                //_gSectorsService.Update(sector, i => { i.position = position; });

                r++;
                t++;
            }
            _gSectorsService.AddOrUpdateAllSectors(connection, sectors);
        }


        public string UpdatePlanetsRing(IDbConnection connection)
        {
            var planets = _gGeometryPlanetService.GetAll(connection, i => i);
            var secondRingCoef = 1;
            var parentId = 0;

            foreach (var planet in planets.OrderBy(i => i.SystemId))
            {
                if (parentId != planet.SystemId)
                {
                    secondRingCoef = 1;
                    parentId = planet.SystemId;
                }

                var hasRing = HasRings(planet.SystemPosition, ref secondRingCoef);

                if (hasRing == (planet.RingTypeId != null)) continue;
                if (hasRing)
                {
                    const byte ringType = (byte) RingTypes.Ring;
                    SavePlanetRingInGeometrySystem(connection, planet, ringType);
                    continue;
                }
                SavePlanetRingInGeometrySystem(connection, planet);
            }
            return "Sucsess";
        }


        public string UpdatePlanetsColor(IDbConnection connection)
        {
            //var planets = _gGeometryPlanetService.GetAll(i => i);
            var planets = _gGeometryPlanetService.GetAll(connection, i => i);
            var systems = (List<GGeometrySystemDataModel>) _systemService.GetGeometrySystems(connection);
            if (systems == null) throw new ArgumentNullException(Error.NoData, nameof(systems));

            foreach (var planet in planets)
            {
                var planetId = planet.Id;
                var sysIdx = systems.FindIndex(i => i.Id == planet.SystemId);

                planet.Color = PlanetColor3Generator.CreateColorByType(planet.TypeId);
                systems[sysIdx].Planetoids.Planets[planetId].Color = planet.Color;
            }
            _gGeometryPlanetService.AddOrUpdateGeometryPlanets(planets, connection);
            _systemService.AddOrUpdateGeometrySystems(connection, systems);
            return "Sucsess";
        }


        private void SavePlanetRingInGeometrySystem(IDbConnection connection, GGeometryPlanetDataModel planet, int? ringType = null)
        {
            var db = _gGeometryPlanetService.AddOrUpdate(connection,planet);
            var system = _systemService.GetGeometrySystem(connection, db.SystemId);
            system.Planetoids.Planets.Single(i => i.Value.Id == db.Id).Value.Rings = ringType;
            _systemService.AddOrUpdateGeometrySystem(connection, system);
        }
    }
}