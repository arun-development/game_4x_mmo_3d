using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using Server.Core.Images;
using Server.Core.Infrastructure;
using Server.Core.Interfaces.ForModel;
using Server.Core.Interfaces.UserServices;
using Server.Core.Interfaces.World;
using Server.Core.Map;
using Server.Core.StaticData;
using Server.DataLayer;
using Server.Modules.Localize;
using Server.Modules.Localize.Game.Map;
using Server.Services.HtmlHelpers;
using Server.Services.NpcArea;
using Server.Services.OutModel;

namespace Server.Services.AdvancedService
{
    public interface IMapInfoService
    {
        #region Sync

        SectorInfoOut GetSectorOutData(IDbConnection connection, UserBookmarkDataModel item);
        StarInfoOut GetSystemOutData(IDbConnection connection, UserBookmarkDataModel item);
        PlanetInfoOut GetPlanetOutData(IDbConnection connection, UserBookmarkDataModel item, int currentUserId);

        //map info
        GalaxyInfoOut GetGalaxyInfo(IDbConnection connection, byte galaxyId);

        SectorInfoOut GetSectorInfo(IDbConnection connection, short sectorId);
        StarInfoOut GetStarInfo(IDbConnection connection, int starId);
        PlanetInfoOut GetPlanetInfo(IDbConnection connection, int planetId, int currentUserId);
        MoonInfoOut GetMoonInfo(IDbConnection connection, int moonId);


        PlanshetViewData SetPlanshetGalaxyInfo(IDbConnection connection, GalaxyInfoOut galaxy);
        PlanshetViewData SetPlanshetSectorInfo(IDbConnection connection, SectorInfoOut sector);
        PlanshetViewData SetPlanshetStarInfo(IDbConnection connection, StarInfoOut star);
        PlanshetViewData SetPlanshetPlanetInfo(IDbConnection connection, PlanetInfoOut planet);
        PlanshetViewData SetPlanshetMoonInfo(IDbConnection connection, MoonInfoOut moon);

        PlanshetViewData InitialTabs(object planstsData, object systemsData, object sectorsData);

        #endregion
    }

    public class MapInfoService : IMapInfoService
    {
        #region Declare

        private const string Ext = Directories.Tmpl;
        private const string Prefix = "map-";


        #region nonIntarface

        #region collections

        public static IReadOnlyList<IButtonsView> MapControllButtons(ILocalizerService localizer)
        {
            var list = new List<IButtonsView>();
            var cb = MapControlsActionsTranslate(localizer);
            for (byte i = 0; i < cb.Count; i++)
                list.Add(ButtonsView.MapControlBtns(i, cb[i]));
            return list;
        }


        public static IReadOnlyList<string> MapControlsActionsTranslate(ILocalizerService localizer)
        {
            var tr = localizer.GetGameTranstaleGroup(GameTranslateType.mapInfo);
            var list = new List<string>
            {
                tr["galaxyInfo"],
                tr["sectorInfo"],
                tr["planetInfo"],
                tr["starInfo"],
                tr["toSector"],
                tr["toPlanetoid"],
                tr["toMother"],
                tr["toGalaxy"],
                tr["toUserPlanet"],
                tr["bookmarks"]
            };
            return list;
        }

        public static IReadOnlyList<string> MapControlIds => new List<string>
        {
            "GalaxyInfo",
            "SectorInfo",
            "PlanetInfo",
            "StarInfo",
            "JumpToSector",
            "JumpToPlanetoid",
            "JumpToMother",
            "JumpToGalaxy",
            "JumpToUserPlanet",
            "OpenBookmarks"
        };

        public static IReadOnlyList<string> MapInfoTemplates => new List<string>
        {
            Prefix + "bookmark-planets" + Ext,
            Prefix + "bookmark-systems" + Ext,
            Prefix + "bookmark-sectors" + Ext,
            Prefix + "info-single-planshet-root" + Ext,
            Prefix + "info" + Ext,
            Prefix + "bookmark-planshet-root" + Ext
        };

        #endregion

        public MapInfoService(IGameTypeService gameTypeService, IGGalaxyService galaxyService,
            IAllianceService allianceService, IGGeometryPlanetService geometryPlanetService,
            IGameUserService gameUserService, ILocalizerService localizer)
        {
            _gameTypeService = gameTypeService;
            _galaxyService = galaxyService;
            _allianceService = allianceService;
            _geometryPlanetService = geometryPlanetService;
            _gameUserService = gameUserService;
            _localizer = localizer;
        }

        #region Bokmark Tabs

        public const string BookmarkCollectionId = "bookmark-collection";
        protected static readonly string PlanetDir = MapInfoTemplates[0];
        protected static readonly string SystemDir = MapInfoTemplates[1];
        protected static readonly string SectorDir = MapInfoTemplates[2];

        [MaxLength(3)] public static List<string> TabIds = new List<string>
        {
            "bookmark-planet",
            "bookmark-star",
            "bookmark-sector"
        };

        public PlanshetViewData InitialTabs(object planetsData, object systemsData, object sectorsData)
        {
            var tabsData = new List<IPlanshetBodyTemplate>
            {
                new PlanshetBodyTemplate
                {
                    LastId = 1,
                    TemplateData = planetsData,
                    TemplateUrl = PlanetDir
                },
                new PlanshetBodyTemplate
                {
                    LastId = 1,
                    TemplateData = systemsData,
                    TemplateUrl = SystemDir
                },
                new PlanshetBodyTemplate
                {
                    LastId = 1,
                    TemplateData = sectorsData,
                    TemplateUrl = SectorDir
                }
            };


            var tr = _localizer.GetGameTranstaleGroup(GameTranslateType.mapInfo);
            var listNames = new List<string>
            {
                tr["planet"],
                tr["system"],
                tr["sector"]
            };

            return PlanshetTabHelper.SetTabData(BookmarkCollectionId, tr["bookmarks"], listNames, tabsData,
                MapInfoTemplates[5], TabIds);
        }

        #endregion

        #endregion

        private readonly IGSectorsService _gSectorsService;
        private readonly IGDetailPlanetService _gDetailPlanetService;
        private readonly IMoonService _moonService;
        private readonly ISystemService _systemService;
        private readonly IGameTypeService _gameTypeService;
        private readonly IGGalaxyService _galaxyService;
        private readonly IAllianceService _allianceService;
        private readonly IGGeometryPlanetService _geometryPlanetService;
        private readonly IGameUserService _gameUserService;
        private readonly ILocalizerService _localizer;

        public MapInfoService(IGSectorsService gSectorsService, IMoonService moonService, ISystemService systemService,
            IGDetailPlanetService gDetailPlanetService, IGameTypeService gameTypeService, IGGalaxyService galaxyService,
            IAllianceService allianceService, IGGeometryPlanetService geometryPlanetService,
            IGameUserService gameUserService, ILocalizerService localizer)
        {
            _gSectorsService = gSectorsService;
            _moonService = moonService;
            _systemService = systemService;
            _gDetailPlanetService = gDetailPlanetService;
            _gameTypeService = gameTypeService;
            _galaxyService = galaxyService;
            _allianceService = allianceService;
            _geometryPlanetService = geometryPlanetService;
            _gameUserService = gameUserService;
            _localizer = localizer;
        }

        #endregion

        #region Map info from Bookmark

        public SectorInfoOut GetSectorOutData(IDbConnection connection, UserBookmarkDataModel item)
        {
            var outData = GetSectorInfo(connection, (short) item.ObjectId);
            if (outData == null) return null;
            outData.BookmarkId = item.Id;
            outData.IsBookmark = true;
            outData.SectorInfoButtons();
            return outData;
        }

        public StarInfoOut GetSystemOutData(IDbConnection connection, UserBookmarkDataModel item)
        {
            var outData = GetStarInfo(connection, item.ObjectId);
            if (outData == null) return null;
            outData.BookmarkId = item.Id;
            outData.IsBookmark = true;
            outData.SubtypeTranslateName = outData.TypeNativeName;
            outData.StarInfoButtons();
            return outData;
        }

        public PlanetInfoOut GetPlanetOutData(IDbConnection connection, UserBookmarkDataModel item, int currentUserId)
        {
            var outData = GetPlanetInfo(connection, item.ObjectId, currentUserId);

            if (outData == null) return null;
            outData.BookmarkId = item.Id;
            outData.IsBookmark = true;
            outData.PlanetInfoButtons();
            return outData;
        }

        #endregion

        #region For Map info From Map

        public GalaxyInfoOut GetGalaxyInfo(IDbConnection connection, byte galaxyId)
        {
            var galaxy = _galaxyService.GetGalaxyById(connection, galaxyId, i => i);
            if (galaxy == null) throw new ArgumentNullException(nameof(galaxy), Error.NoData);

            var galaxyType = _gameTypeService.GetGGameType(connection, galaxy.TypeId);
            var sectorsIds = _gSectorsService.GetSectorsByGalaxy(connection, galaxyId, i => i.Id);
            var sectorsCount = sectorsIds.Count;

            var galaxyName = L10N.ExecuteTranslateNameOrDescr(galaxy.Translate, true, L10N.GetCurrentCulture());

            var galaxyInfo = new GalaxyInfoOut
            {
                Id = galaxy.Id,
                GalaxyId = galaxy.Id,
                NativeName = galaxy.NativeName,
                GalaxyName = galaxyName,
                TranslateName = galaxyName,
                TextureTypeId = galaxy.TextureTypeId,
                TypeNativeName = galaxyType.Type,
                TypeTranslateName = galaxyName,
                SubtypeNativeName = galaxyType.SubType,
                SubtypeTranslateName = "Spirale",
                SpriteImages = new SpriteImages().GalaxyImages(galaxy.TextureTypeId),
                Description = L10N.ExecuteTranslateNameOrDescr(galaxy.Translate, false),
                ChildCount = (short) sectorsCount
            };


            //todo  сделать перевод
            galaxyInfo.SetComplexButtonView();
            return galaxyInfo;
        }

        public SectorInfoOut GetSectorInfo(IDbConnection connection, short sectorId)
        {
            var sector = _gSectorsService.GetById(connection, sectorId, i => i);
            if (sector == null) return null;

            var sectorType = _gameTypeService.GetGGameType(connection, sector.TypeId);
            if (sectorType == null) return null;

            var galaxyName = _galaxyService.GetGalaxyById(connection, sector.GalaxyId, i => i);
            if (galaxyName == null) return null;


            var topAllianceName = _allianceService.GetTopAllianceInSector(connection,sectorId);
            var systemIds = _systemService.GetSystemIds(connection, sectorId);

            var sectorInfo = new SectorInfoOut
            {
                GalaxyId = sector.GalaxyId,
                GalaxyName = galaxyName.NativeName,
                SectorId = sector.Id,
                SectorName = sector.NativeName,
                Id = sector.Id,
                NativeName = sector.NativeName,
                TextureTypeId = sector.TextureTypeId,
                TypeNativeName = sectorType.Type,
                TypeTranslateName =
                    L10N.ExecuteTranslateNameOrDescr(sectorType.Description, true, L10N.GetCurrentCulture()),
                SubtypeNativeName = sectorType.SubType,
                Description = L10N.ExecuteTranslateNameOrDescr(sector.Translate, false, L10N.GetCurrentCulture()),
                AllianceName = topAllianceName,
                ChildCount = (short) systemIds.Count,
                SpriteImages = new SpriteImages().SectorImages(sector.TextureTypeId),
                GameTypeId = sectorType.Id
            };

            sectorInfo.SetComplexButtonView();
            return sectorInfo;
        }

        public StarInfoOut GetStarInfo(IDbConnection connection, int starId)
        {
            var system = _systemService.GetSystem(connection, starId, i => i);
            if (system == null) return null;

            var galaxyName = _galaxyService.GetGalaxyById(connection, system.GalaxyId, i => i.NativeName);
            if (galaxyName == null) return null;

            var sectorName = _gSectorsService.GetById(connection, system.SectorId, i => i.NativeName);
            if (sectorName == null) return null;

            var geometryStar = _systemService.GetGeometryStarById(connection, starId, i => i);
            if (geometryStar == null) return null;

            var detailSystem = _systemService.GetDetailSystemBySystemId(connection, starId);
            if (detailSystem == null) return null;

            var planetCountsInSystem = _gDetailPlanetService.GetPlanetCountInSystem(connection, starId);
            if (planetCountsInSystem == 0) return null;


            var npcSkagry = NpcHelper.GetNpcByName(Npc.SkagyName);
            var npcConfederaion = NpcHelper.GetNpcByName(Npc.ConfederationName);

            var owner = npcSkagry.NpcUser.Nickname;
            var allianceName = npcSkagry.NpcAlliance.Name;


            if (detailSystem.AllianceId == npcConfederaion.NpcAlliance.Id)
            {
                owner = npcConfederaion.NpcUser.Nickname;
                allianceName = npcConfederaion.NpcAlliance.Name;
            }
            if (detailSystem.UserName != null && detailSystem.UserName != npcSkagry.NpcUser.Nickname)
            {
                owner = detailSystem.UserName;
                if (detailSystem.AllianceId == npcConfederaion.NpcAlliance.Id)
                    allianceName = npcConfederaion.NpcAlliance.Name;
                else allianceName = _allianceService.GetAllianceById(connection,detailSystem.AllianceId, i => i.Name);
            }

            var systemType = _gameTypeService.GetGGameType(connection, geometryStar.TypeId);
            var starInfo = new StarInfoOut
            {
                GalaxyId = system.GalaxyId,
                GalaxyName = galaxyName,
                SectorId = system.SectorId,
                SectorName = sectorName,
                SystemId = system.Id,
                SystemName = detailSystem.Name,
                Id = system.Id,
                NativeName = detailSystem.Name,
                TextureTypeId = geometryStar.TextureTypeId,
                Owner = owner,
                Bonus = detailSystem.EnergyBonus,
                TypeNativeName = systemType.Type,
                SubtypeNativeName = systemType.SubType,
                SubtypeTranslateName = systemType.SubType,
                Description =
                    L10N.ExecuteTranslateNameOrDescr(detailSystem.Description, false, L10N.GetCurrentCulture()),
                AllianceName = allianceName,
                ChildCount = planetCountsInSystem,
                SpriteImages = new SpriteImages().StarImages(systemType.SubType, geometryStar.TextureTypeId)
            };

            starInfo.SetComplexButtonView();
    
            return starInfo;
        }

        public PlanetInfoOut GetPlanetInfo(IDbConnection connection, int planetId, int currentUserId)
        {
            var planetGeometry = _geometryPlanetService.GetGeometryPlanetById(connection, planetId);
            if (planetGeometry == null) return null;

            var planetType = _gameTypeService.GetGGameType(connection, planetGeometry.TypeId);
            if (planetType == null) return null;


            var galaxyName = _galaxyService.GetGalaxyById(connection, planetGeometry.GalaxyId, i => i.NativeName);
            if (galaxyName == null) return null;

            var sectorName = _gSectorsService.GetById(connection, planetGeometry.SectorId, i => i.NativeName);
            if (sectorName == null) return null;

            var systemName = _systemService.GetDetailSystemBySystemId(connection, planetGeometry.SystemId, i => i.Name);
            if (systemName == null) return null;


            var planetDetail = _gDetailPlanetService.GetPlanet(connection, planetId);
            if (planetDetail == null) return null;


            var skagry = NpcHelper.GetNpcByName(Npc.SkagyName);
            var userName = skagry.NpcUser.Nickname;
            var planetAllianceName = skagry.NpcAlliance.Name;
            if (planetDetail.UserId != skagry.NpcUser.Id)
            {
                userName = _gameUserService.GetGameUser(connection, planetDetail.UserId, i => i.Nickname);
                planetAllianceName = _allianceService.GetAllianceById(connection,planetDetail.AllianceId, i => i.Name);
            }
            var isCurrentUser = currentUserId == planetDetail.UserId;


            var planetInfo = new PlanetInfoOut
            {
                GalaxyId = planetGeometry.GalaxyId,
                GalaxyName = galaxyName,
                SectorId = planetGeometry.SectorId,
                SectorName = sectorName,
                SystemId = planetGeometry.SystemId,
                SystemName = systemName,
                Id = planetGeometry.Id,
                NativeName = planetDetail.Name,
                TextureTypeId = planetGeometry.TextureTypeId,
                Owner = userName,
                LastActive = planetDetail.LastActive,
                PlanetReferToCurrentUser = isCurrentUser,
                TypeNativeName = planetType.Type,
                SubtypeNativeName = planetType.SubType,
                Description =
                    L10N.ExecuteTranslateNameOrDescr(planetDetail.Description, false, L10N.GetCurrentCulture()),
                AllianceName = planetAllianceName,
                ChildCount = planetDetail.MoonCount,
                SpriteImages = new SpriteImages().PlanetImages(planetType.SubType, planetGeometry.TextureTypeId)
            };


            if (string.Equals(planetInfo.SubtypeNativeName, PlanetoidSubTypes.Earth.ToString(),
                StringComparison.CurrentCultureIgnoreCase))
                planetInfo.SubtypeTranslateName = "translate Earth";
            else if (string.Equals(planetInfo.SubtypeNativeName, PlanetoidSubTypes.Gas.ToString(),
                StringComparison.CurrentCultureIgnoreCase))
                planetInfo.SubtypeTranslateName = "translate Gas Gigant";
            else if (string.Equals(planetInfo.SubtypeNativeName, PlanetoidSubTypes.IceGas.ToString(),
                StringComparison.CurrentCultureIgnoreCase))
                planetInfo.SubtypeTranslateName = "translate Ice";
            planetInfo.SetComplexButtonView();
            return planetInfo;
        }

        public MoonInfoOut GetMoonInfo(IDbConnection connection, int moonId)
        {
            var geometryMoon = _moonService.GetGeometryMoon(connection, moonId);
            if (geometryMoon == null) return null;
            var moonType = _gameTypeService.GetGGameType(connection, geometryMoon.TypeId);
            if (moonType == null) return null;

            var galaxyName = _galaxyService.GetGalaxyById(connection, geometryMoon.GalaxyId, i => i.NativeName);
            if (galaxyName == null) return null;

            var sectorName = _gSectorsService.GetById(connection, geometryMoon.SectorId, i => i.NativeName);
            if (sectorName == null) return null;

            var systemName = _systemService.GetDetailSystemBySystemId(connection, geometryMoon.SystemId, i => i.Name);
            if (systemName == null) return null;

            var detailMoon = _moonService.GetDetailMoon(connection, moonId);
            if (detailMoon == null) return null;


            var moonInfo = new MoonInfoOut
            {
                GalaxyId = geometryMoon.GalaxyId,
                GalaxyName = galaxyName,
                SectorId = geometryMoon.SectorId,
                SectorName = sectorName,
                SystemId = geometryMoon.SystemId,
                SystemName = systemName,
                Id = geometryMoon.Id,
                NativeName = detailMoon.Name,
                TextureTypeId = geometryMoon.TextureTypeId,
                SpriteImages = new SpriteImages().MoonImages(geometryMoon.TextureTypeId),
                TypeNativeName = moonType.SubType,
                Description = L10N.ExecuteTranslateNameOrDescr(detailMoon.Description, false, L10N.GetCurrentCulture()),
            };

            moonInfo.SetComplexButtonView();
            return moonInfo;
        }

        #region Set Planshet body

        private static string IdConstructor(string type, int id)
        {
            return type.ToLower() + "_" + id;
        }

        public PlanshetViewData SetPlanshetGalaxyInfo(IDbConnection connection, GalaxyInfoOut galaxy)
        {
            return PlanshetBodyHelper.SetBody(
                galaxy,
                Resource.Galaxy,
                IdConstructor(galaxy.TypeNativeName, galaxy.Id),
                MapInfoTemplates[3],
                MapInfoTemplates[4]);
        }

        public PlanshetViewData SetPlanshetSectorInfo(IDbConnection connection, SectorInfoOut sector)
        {
            return PlanshetBodyHelper.SetBody(
                sector, Resource.Sector,
                IdConstructor(sector.TypeNativeName, sector.Id),
                MapInfoTemplates[3],
                MapInfoTemplates[4]);
        }

        public PlanshetViewData SetPlanshetStarInfo(IDbConnection connection, StarInfoOut star)
        {
            return PlanshetBodyHelper.SetBody(
                star,
                Resource.Star,
                IdConstructor(star.TypeNativeName, star.Id),
                MapInfoTemplates[3],
                MapInfoTemplates[4]);
        }

        public PlanshetViewData SetPlanshetPlanetInfo(IDbConnection connection, PlanetInfoOut planet)
        {
            return PlanshetBodyHelper.SetBody(planet,
                Resource.Planet,
                IdConstructor(planet.TypeNativeName, planet.Id),
                MapInfoTemplates[3],
                MapInfoTemplates[4]);
        }

        public PlanshetViewData SetPlanshetMoonInfo(IDbConnection connection, MoonInfoOut moon)
        {
            return PlanshetBodyHelper.SetBody(
                moon, Resource.Moon,
                IdConstructor(moon.TypeNativeName, moon.Id),
                MapInfoTemplates[3],
                MapInfoTemplates[4]);
        }

        #endregion

        #endregion
    }
}