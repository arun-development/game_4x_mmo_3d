using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Infrastructure;
using Server.Core.Map;
using Server.Core.Map.Structure;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Units;
using Server.DataLayer;
using Server.Extensions;
using Server.Modules.Localize;
using Server.Services.Helper;
using Server.Services.NpcArea;
using Server.Utils.Map;

namespace Server.Services.InitializeService
{
    public partial class MapGInitializer
    {
        public bool CreateSectors(IDbConnection connection)
        {
            // short sectorCounts = 70;
            //todo delete after debug or put 70
            short sectorCounts = 3;

            //var sectorTypeNativeName = MapTypes.Sector.ToString();
            var types = _gameTypeService.GetGGameTypes(connection, MapTypes.Sector.ToString());
            var galaxies = _gGalaxyService.GetGalaxyIds(connection);

            var sectors = new List<GSectorsDataModel>();

            foreach (var galaxyId in galaxies)
                for (short s = 0; s < sectorCounts; s++)
                {
                    var type = types.Count == 1 ? types[0] : types[Rand.Next(0, types.Count)];

                    var typeId = type.Id;
                    var typeTranslate = type.Description;
                    var translate = new L10N();
                    translate.InitializeField();

                    var sectorNames = SectorNamesHelper.Names;


                    var sectorNumber = s;
                    sectorNumber += 1;
                    string sectorName;
                    if (s < sectorNames.Count)
                    {
                        sectorName = sectorNames[s];
                        translate.En.Name = "Sector " + sectorName;
                        translate.Es.Name = "Sector " + sectorName;
                        translate.Ru.Name = "Сектор " + sectorName;
                    }

                    else
                    {
                        sectorName = "Sector" + sectorNumber;
                        translate.En.Name = "Sector " + sectorNumber;
                        translate.Es.Name = "Sector " + sectorNumber;
                        translate.Ru.Name = "Сектор " + sectorNumber;
                    }

                    translate.En.Description = "Unique Description En " + sectorName + " " + " TypeDescription: " +
                                               typeTranslate.En.Description;
                    translate.Es.Description = "Unique Description Es " + sectorName + " " + " TypeDescription: " +
                                               typeTranslate.Es.Description;
                    translate.Ru.Description = "Unique Description Ru " + sectorName + " " + " TypeDescription: " +
                                               typeTranslate.Ru.Description;


                    var textures = _gameTypeService.GetTextures(connection, typeId);
                    sectors.Add(new GSectorsDataModel
                    {
                        Id = sectorNumber,
                        Opened = true,
                        TextureTypeId = _gameTypeService.GetRandTextureId(textures, Rand),
                        GalaxyId = galaxyId,
                        Translate = translate,
                        TypeId = typeId,
                        NativeName = sectorName,
                        Position = Vector3.Zero
                    });
                }

            var suc = _gSectorsService.AddOrUpdateAllSectors(connection, sectors).Any();
            return suc;
        }


        public bool CreateMoons(IDbConnection connection)
        {
            var moonType = PlanetoidSubTypes.Moon.ToString();

            var moonTextureTypes = _gameTypeService.GetTextures(connection, MapTypes.Satellite.ToString(), moonType);
            var moonTextIds = moonTextureTypes.Select(i => i.Id).ToList();
            var moonTextUsedIds = new List<short>();


            var planetGeomety = _getPlanetCollection(connection);
            var planetsDetail = _getPlanetDetailCollection(connection);


            var parentId = 0;
            double firstPlanetRadius = 0;
            var mincoef = 4;
            var planetCount = planetGeomety.Count;
            for (var i = 0; i < planetCount; i++)
            {
                var planet = planetGeomety[i];
                var detailPlanet = planetsDetail[i];

                if (parentId != planet.Parent)
                {
                    parentId = planet.Parent;
                    firstPlanetRadius = planet.Radius;
                }
                var parentRadius = planet.Radius;
                var minMoonRadius = firstPlanetRadius / mincoef;
                var minMoonOrbit = parentRadius + (1.5 * minMoonRadius);

                if (detailPlanet.MoonCount == 0) continue;

                for (var moonIndex = 0; moonIndex < detailPlanet.MoonCount; moonIndex++)
                {
                    var ki = Math.Pow(Factor, moonIndex + 1);

                    //"DT-CA-1-3"
                    var moonName = planet.NativeName + "-" + (moonIndex + 1);
                    var maxRadius = parentRadius / 4;
                    var moonRadius = RandNum.NextDouble(minMoonRadius, maxRadius); //13.72
                    var moonCurrOrbit = minMoonOrbit * ki;
                    var moonTextureId = GameTypeHalper.GetRandomTypeFromUsedTyps(moonTextIds, ref moonTextUsedIds);


                    var geometryMoon = _moonService.AddOrUpdateGeometryMoon(connection, new GGeometryMoonDataModel
                    {
                        GalaxyId = planet.GalaxyId,
                        SectorId = planet.SectorId,
                        SystemId = planet.SystemId,
                        PlanetId = planet.Id,
                        Radius = Math.Round(moonRadius, 4),
                        Orbit = Math.Round(moonCurrOrbit, 4),
                        OrbitPosition = (byte)Rand.Next(0, Tes),
                        TypeId = (byte)PlanetoidSubTypes.Moon,

                        AxisAngle = _getRandomAngle(FactorAngle),
                        OrbitAngle = _getRandomAngle(FactorAngle),
                        TextureTypeId = moonTextureId,
                    });

                    var detailMoon = _createMoonDetail(connection, geometryMoon.Id, moonName);
                    var dm = _moonService.AddOrUpdateDetailMoon(connection, detailMoon);
                    if (dm ==null || dm.Id ==0) {
                        throw new NotImplementedException("moon didn't created");
                    }
                }
            }
            return true;
        }

        public bool CreateSystemGeometries(IDbConnection connection)
        {
            var systems = _systemService.GetAllSystemIds(connection);
            var newSystems = new List<GGeometrySystemDataModel>();

            var allPlanets = _getPlanetCollection(connection);

            foreach (var systemId in systems)
            {
                var star = _getStar(connection, systemId);
                var planets = allPlanets.Where(i => i.SystemId == systemId).OrderBy(i => i.SystemPosition).ToList();
                var moons = _getMoonCollection(connection, star.Id);
                moons = moons.OrderBy(i => i.OrbitPosition).ToList();

                var sysGeometry = new SystemGeometry();
                sysGeometry.AddStar(star);

                foreach (var planet in planets) sysGeometry.AddPlanet(planet);

                foreach (var moon in moons) sysGeometry.AddMoon(moon);


                newSystems.Add(new GGeometrySystemDataModel
                {
                    Id = systemId,
                    Planetoids = sysGeometry
                });
            }
            var suc = _systemService.AddOrUpdateGeometrySystems(connection, newSystems).Any();

            return suc;

        }

        private int _createRings(IDbConnection connection)
        {
            var textures = _gameTypeService.GetTextures(connection, RingTypes.Ring.ToString());
            return _gameTypeService.GetRandTextureId(textures, Rand);
        }


        private List<Vector3> CreateCubixForm()
        {
            var cubeLenght = 100 * Scale;
            // var offset = 5 * cubeLenght;
            var sectorDirection = new List<sbyte> { -1, 0, 1 };
            var coords = new List<Vector3>();

            for (byte y = 0; y < sectorDirection.Count; y++)
                for (byte z = 0; z < sectorDirection.Count; z++)
                    for (byte x = 0; x < sectorDirection.Count; x++)
                    {
                        var coordX = x * cubeLenght;
                        var coordY = y * cubeLenght;
                        var coordZ = sectorDirection[z] * cubeLenght;

                        if (0 == coordX && 0 == coordY && 0 == coordZ) continue;

                        coords.Add(new Vector3(coordX, coordY, coordZ));
                    }
            return coords;
        }

        private bool CreateGalaxies(IDbConnection connection)
        {
            var galaxyNativeName = MapTypes.Galaxy.ToString();
            var spiraleNativeName = GalaxySubTypes.Spirale.ToString();
            var gTypes = _gameTypeService.GetGGameTypes(connection, galaxyNativeName, spiraleNativeName);
            var typeIds = gTypes.Select(i => i.Id).ToList();
            var typeUsed = new List<byte>();

            var translate = new L10N();
            translate.InitializeField();

            var galaxyIds = new List<byte> { 1 };
            const string baseName = "galaxy";
            var galaxies = new List<GGalaxyDataModel>();


            foreach (var galaxyId in galaxyIds)
            {
                translate.En.Name = "Galaxy " + galaxyId;
                translate.Es.Name = "Galaxia " + galaxyId;
                translate.Ru.Name = "Галактика " + galaxyId;

                var typeId = GameTypeHalper.GetRandomTypeFromUsedTyps(typeIds, ref typeUsed);
                var type = gTypes.Single(i => i.Id == typeId);
                var typeTranslate = type.Description;

                translate.En.Description = "Unique Description En " + translate.En.Name + " TypeDescription: " +
                                           typeTranslate.En.Description;
                translate.Es.Description = "Unique Description Es " + translate.Es.Name + " TypeDescription: " +
                                           typeTranslate.Es.Description;
                translate.Ru.Description = "Unique Description Ru " + translate.Ru.Name + " TypeDescription: " +
                                           typeTranslate.Ru.Description;

                var textures = _gameTypeService.GetTextures(connection, typeId);
                galaxies.Add(new GGalaxyDataModel
                {
                    Id = galaxyId,
                    Translate = translate,
                    NativeName = baseName + galaxyId,
                    Opened = true,
                    TypeId = type.Id,
                    Position = CreateGalaxyPosition(galaxyId),
                    TextureTypeId = _gameTypeService.GetRandTextureId(textures, Rand)
                });
            }

            foreach (var i in galaxies) _gGalaxyService.AddOrUpdate(connection, i);
            return true;
        }

        private bool CreateSystems(IDbConnection connection)
        {
            var galaxies = _gGalaxyService.GetGalaxyIds(connection);
            var systems = new List<GSystemDataModel>();

            //var sectorIds  = new List<short>();

            foreach (var galaxyId in galaxies)
            {
                //sectorIds.AddRange(gsectorIds);

                var sectorIds = _getSectorIds(connection, galaxyId);
                foreach (var sectorId in sectorIds)
                {
                    var systemCount = Rand.Next(70, 100);//40-50
                    for (var i = 0; i < systemCount; i++)
                        systems.Add(new GSystemDataModel
                        {
                            GalaxyId = galaxyId,
                            SectorId = sectorId,
                            Position = CreateSystemPosition()
                        });
                }
            }

            var suc = _systemService.AddOrUpdateSystems(connection, systems).Any();
            return suc;
        }

        private bool CreateStars(IDbConnection connection)
        {
            var starTypeName = MapTypes.Star.ToString();
            var gTypes = _gameTypeService.GetGGameTypes(connection, starTypeName);
            var gTIds = gTypes.Select(i => i.Id).ToList();
            var typeUsed = new List<byte>();
            var systemNames = _getSystemNames(connection);
            var textureTypes = _gameTypeService.GetTextures(connection, starTypeName);


            var stars = new List<GGeometryStarDataModel>();
            var parentIds = _systemService.GetAllSystemIds(connection);
            stars.AddRange(from t in parentIds
                           let typeId = GameTypeHalper.GetRandomTypeFromUsedTyps(gTIds, ref typeUsed)
                           select new GGeometryStarDataModel
                           {
                               Id = t,
                               TypeId = typeId,
                               TextureTypeId = textureTypes.First(i => i.GameTypeId == typeId).Id,
                               Radius = (double)Rand.Next(500, 1000) * Scale / (1000 * 20)
                           });


            stars = (List<GGeometryStarDataModel>)_systemService.AddOrUpdateGeometryStars(connection, stars);

            var systemDetails = stars.Select(star => CreateSystemDetail(connection, star.Id, star.TypeId, systemNames[star.Id])).ToList();
            var suc = _systemService.AddOrUpdateDetailSystems(connection, systemDetails).Any();

            return true;

        }

        private GDetailSystemDataModel CreateSystemDetail(IDbConnection connection, int id, byte typeId, string name)
        {
            var translate = new L10N();
            translate.InitializeField();
            var type = _gameTypeService.GetGGameType(connection, typeId);
            var typeTranslate = type.Description;
            translate.En.Description = "Unique Description En " + name + " " + " TypeDescription: " +
                                       typeTranslate.En.Description;
            translate.Es.Description = "Unique Description Es " + name + " " + " TypeDescription: " +
                                       typeTranslate.Es.Description;
            translate.Ru.Description = "Unique Description Ru " + name + " " + " TypeDescription: " +
                                       typeTranslate.Ru.Description;
            translate.En.Name = translate.Es.Name = translate.Ru.Name = name;

            return new GDetailSystemDataModel
            {
                Id = id,
                TypeId = typeId,
                AllianceId = 1,
                Name = name,
                UserName = Npc.SkagyName,
                Description = translate,
                EnergyBonus = 1
            };
        }

        private bool CreatePlanets(IDbConnection connection)
        {
            var stars = _getStarCollection(connection);
            var pl = new PlanetGeometry();


            //            const double FactorAngle = Math.PI/16;

            //==================================================
            var planetTypeName = MapTypes.Planet.ToString();

            var gasGameTypes = new List<byte> { (byte)PlanetoidSubTypes.Gas, (byte)PlanetoidSubTypes.IceGas };
            var usedGasGameTypes = new List<byte>();


            var planetTextureTypes = _gameTypeService.GetTextures(connection, planetTypeName);

            var earthTextureTypes =
                planetTextureTypes.Where(i => i.GameTypeId == (byte)PlanetoidSubTypes.Earth).Select(i => i.Id)
                    .ToList();

            var gasTextureTypes =
                planetTextureTypes.Where(i => i.GameTypeId == (byte)PlanetoidSubTypes.Gas).Select(i => i.Id).ToList();
            var iceGasTypes = planetTextureTypes.Where(i => i.GameTypeId == (byte)PlanetoidSubTypes.IceGas)
                .Select(i => i.Id)
                .ToList();


            var earthTextureUsed = new List<short>();
            var gasTextureUsed = new List<short>();
            var iceGasTextureUsed = new List<short>();

            //==================================================


            var planets = new List<GGeometryPlanetDataModel>();
            foreach (var star in stars)
            {
                var planetCount = Rand.Next(6, 10);
                var starRadius = star.Radius;
                var basicPlanetOrbit = 1.2 * starRadius;

                var secondRingCoef = 1;

                for (var i = 0; i < planetCount; i++)
                {
                    pl.Atmosphere = true;
                    pl.Rings = null;

                    var currOrbit = basicPlanetOrbit * Math.Pow(Factor, i) / 4;
                    var q = currOrbit / 2;
                    currOrbit *= Scale;
                    currOrbit = Math.Round(currOrbit, 4);
                    var planetCurrRadius = Math.Round(q - (q * 0.1 * i), 4);


                    byte typeId;
                    short textureType;
                    if (i <= 4)
                    {
                        typeId = (byte)PlanetoidSubTypes.Earth;
                        textureType = GameTypeHalper.GetRandomTypeFromUsedTyps(earthTextureTypes, ref earthTextureUsed);
                    }
                    else
                    {
                        typeId = GameTypeHalper.GetRandomTypeFromUsedTyps(gasGameTypes, ref usedGasGameTypes);
                        textureType = (typeId == (byte)PlanetoidSubTypes.Gas)
                            ? GameTypeHalper.GetRandomTypeFromUsedTyps(gasTextureTypes, ref gasTextureUsed)
                            : GameTypeHalper.GetRandomTypeFromUsedTyps(iceGasTypes, ref iceGasTextureUsed);

                        var hasRing = HasRings(i, ref secondRingCoef);
                        if (hasRing) pl.Rings = _createRings(connection);
                    }


                    var orbitPosition = (byte)Rand.Next(0, Tes);
                    var orbitAngle = _getRandomAngle(FactorAngle);


                    planets.Add(new GGeometryPlanetDataModel
                    {
                        GalaxyId = star.GalaxyId,
                        SectorId = star.SectorId,
                        SystemId = star.Id,
                        TypeId = typeId,
                        Orbit = currOrbit,
                        AxisAngle = _getRandomAngle(FactorAngle),
                        OrbitAngle = orbitAngle,

                        RingTypeId = pl.Rings,
                        SystemPosition = (byte)(i + 1),
                        Radius = planetCurrRadius,
                        Color = PlanetColor3Generator.CreateColorByType(typeId),
                        TextureTypeId = textureType,

                        OrbitPosition = orbitPosition
                    });
                }
            }
            var suc = _gGeometryPlanetService.AddOrUpdateGeometryPlanets(planets, connection).Any();


            return suc;

        }


        private bool CreatePlanetDetails(IDbConnection connection)
        {
            var planets = _getPlanetCollection(connection);
            var npc = NpcHelper.GetNpcByName(Npc.SkagyName);
            var detailPlanets = new List<GDetailPlanetDataModel>();
            foreach (var planet in planets)
            {
                var translate = new L10N();
                translate.InitializeField();

                var type = _gameTypeService.GetGGameType(connection, planet.GameTypeId);
                var typeTranslate = type.Description;
                translate.En.Description = "Unique Description En " + planet.NativeName + " " + " TypeDescription: " +
                                           typeTranslate.En.Description;

                translate.Es.Description = "Unique Description Es " + planet.NativeName + " " + " TypeDescription: " +
                                           typeTranslate.Es.Description;
                translate.Ru.Description = "Unique Description Ru " + planet.NativeName + " " + " TypeDescription: " +
                                           typeTranslate.Ru.Description;
                translate.En.Name = translate.Es.Name = translate.Ru.Name = planet.NativeName;


                var detailPlanet = new GDetailPlanetDataModel
                {
                    Id = planet.Id,
                    UserId = npc.NpcUser.Id,
                    AllianceId = npc.NpcAlliance.Id,
                    Name = planet.NativeName,
                    Description = translate,
                    DangerLevel = 1,
                    LastActive = DateTime.UtcNow,
                    MoonCount = GetMoonCount(planet.SystemPosition),
                    UnitProgress = new Dictionary<UnitType, TurnedUnit>()
                };

                _iOwnProgressInitializer.SetInitialPlanetBuilds(detailPlanet, npc.NpcUser.Id);
                _iOwnProgressInitializer.SetInitialHangarAndResource(connection, detailPlanet);

                detailPlanets.Add(detailPlanet);
            }

            #region for  Delete

            //for (int p = 0; p < planets.Count; p++)
            //{

            //    var planet = planets[p];
            //    var system = detailSystems.First(i => i.Id == planet.SystemId);
            //    var systemName = system.Name;
            //    //var planetName = systemName + "-"+ planet.SystemPosition;


            //    var translate = new L10N();
            //    translate.InitializeField();

            //    var type = await _gameTypeService.GetGGameTypeAsync(planet.GameTypeId);
            //    var typeTranslate = type.Description;
            //    translate.En.Description = "Unique Description En " + planet.NativeName + " " + " TypeDescription: " +
            //                               typeTranslate.En.Description;

            //    translate.Es.Description = "Unique Description Es " + planet.NativeName + " " + " TypeDescription: " +
            //                               typeTranslate.Es.Description;
            //    translate.Ru.Description = "Unique Description Ru " + planet.NativeName + " " + " TypeDescription: " +
            //                               typeTranslate.Ru.Description;
            //    translate.En.Name = translate.Es.Name = translate.Ru.Name = planet.NativeName;


            //    var detailPlanet = new GDetailPlanetDataModel
            //    {
            //        Id = planet.Id,
            //        UserId = npc.NpcUser.Id,
            //        AllianceId = npc.NpcAlliance.Id,
            //        Name = planet.NativeName,
            //        Description = translate,
            //        DangerLevel = (byte)Rand.Next(0, 10),
            //        LastActive = DateTime.UtcNow,
            //        MoonCount = GetMoonCount(planet.SystemPosition)

            //    };

            //    _iOwnProgressInitializer.SetInitialPlanetBuilds(detailPlanet, npc.NpcUser.Id);
            //    _iOwnProgressInitializer.SetInitialHangarAndResource(detailPlanet);

            //    detailPlanets.Add(detailPlanet);
            //}

            #endregion

            var suc = _gDetailPlanetService.AddOrUpdateDetailPlanetList(connection, detailPlanets).Any();
            return true;

        }

        private GDetailMoonDataModel _createMoonDetail(IDbConnection connection, int newMoonId, string name)
        {
            var translate = new L10N();
            translate.InitializeField();

            var type = _gameTypeService.GetGGameType(connection, (byte)PlanetoidSubTypes.Moon);
            var typeTranslate = type.Description;
            translate.En.Description = "Unique Description En " + name + " " + " TypeDescription: " +
                                       typeTranslate.En.Description;
            translate.Es.Description = "Unique Description Es " + name + " " + " TypeDescription: " +
                                       typeTranslate.Es.Description;
            translate.Ru.Description = "Unique Description Ru " + name + " " + " TypeDescription: " +
                                       typeTranslate.Ru.Description;
            translate.En.Name = translate.Es.Name = translate.Ru.Name = name;

            return new GDetailMoonDataModel
            {
                Id = newMoonId,
                Name = name,
                Description = translate
            };
        }
    }
}