using System;
using System.Collections.Generic;
using System.Data;
using Server.Core.Interfaces.UserServices;
using Server.Core.Interfaces.World;
using Server.Core.Map.Structure;
using Server.Core.StaticData;
using Server.Services.HtmlHelpers;

namespace Server.Services.AdvancedService
{
    public interface IWorldService
    {
        IList<Sector> GetSectors(IDbConnection connection);

        /// <summary>
        ///     возвращает системы принадлежащие запрашиваему сектору
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="sectorId">sectorId</param>
        /// <returns></returns>
        IList<SystemsView> GetSystems(IDbConnection connection, int sectorId);

        Planetoids GetSystemGeometry(IDbConnection connection, int systemId);
        PlanshetViewData GalaxyInfo(IDbConnection connection, int galaxyId);
        PlanshetViewData SectorInfo(IDbConnection connection, int sectorId);
        PlanshetViewData StarInfo(IDbConnection connection, int starId);
        PlanshetViewData PlanetInfo(IDbConnection connection, int planetId, int currentUserId);
        PlanshetViewData MoonInfo(IDbConnection connection, int moonId);


        /// <summary>
        ///     Возвращет список планет для подсказки пользователю при выборе
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="planetName">частичное имя планеты (от 4 х символов) ищет совпадения</param>
        /// <param name="serchPlanetType">
        ///     1 искать все планеты, 2 -  не пренадлежащие пользоваетлю,  3 только пренадлежащие
        ///     пользователю
        /// </param>
        /// <param name="currentUserId"></param>
        /// <returns>список конечных имен планет</returns>
        IList<string> SerchPlanetNames(IDbConnection connection, string planetName = null, byte serchPlanetType = (byte) WorldService.SerchPlanetType.OtherUsers, int? currentUserId = null);
    }

    public class WorldService : IWorldService
    {
        private readonly IGDetailPlanetService _gDetailPlanetService;
        private readonly IGSectorsService _gSectorsService;
        private readonly IMapInfoService _mapInfoService;
        private readonly ISystemService _systemService;

        public WorldService(IGDetailPlanetService gDetailPlanetService, IGSectorsService gSectorsService,
            IMapInfoService mapInfoService, ISystemService systemService)
        {
            _gDetailPlanetService = gDetailPlanetService;
            _gSectorsService = gSectorsService;
            _mapInfoService = mapInfoService;
            _systemService = systemService;
        }


        public IList<Sector> GetSectors(IDbConnection connection)
        {
            return _gSectorsService.GetInitSectors(connection);
        }


        public IList<SystemsView> GetSystems(IDbConnection connection, int sectorId)
        {
            if (sectorId == 0) throw new Exception(Error.NoData);
            var systems = _systemService.GetSystemViewsBySector(connection, sectorId);
            //return Json(_systemService.GetSystemsBySector(id));
            return systems;
        }


        public Planetoids GetSystemGeometry(IDbConnection connection, int systemId)
        {
            return _systemService.GetSystemGeometryViewData(connection, systemId);
        }


        public PlanshetViewData GalaxyInfo(IDbConnection connection, int galaxyId)
        {
            var data = _mapInfoService.GetGalaxyInfo(connection, (byte) galaxyId);
            if (data == null) throw new Exception(Error.NoData);
           
            return _mapInfoService.SetPlanshetGalaxyInfo(connection, data);
        }

        public PlanshetViewData SectorInfo(IDbConnection connection, int sectorId)
        {
            var data = _mapInfoService.GetSectorInfo(connection, (short) sectorId);
            if (data == null) throw new Exception(Error.NoData);
            data.SectorInfoButtons();
            return _mapInfoService.SetPlanshetSectorInfo(connection, data);
        }


        public PlanshetViewData StarInfo(IDbConnection connection, int starId)
        {
            var data = _mapInfoService.GetStarInfo(connection, starId);
            if (data == null) throw new Exception(Error.NoData);
            data.StarInfoButtons();
            return _mapInfoService.SetPlanshetStarInfo(connection, data);
        }


        public PlanshetViewData PlanetInfo(IDbConnection connection, int planetId, int currentUserId)
        {
            var data = _mapInfoService.GetPlanetInfo(connection, planetId, currentUserId);
            if (data == null) throw new Exception(Error.NoData);
            data.PlanetInfoButtons();
            return _mapInfoService.SetPlanshetPlanetInfo(connection, data);
        }


        public PlanshetViewData MoonInfo(IDbConnection connection, int moonId)
        {
            var data = _mapInfoService.GetMoonInfo(connection, moonId);
            if (data == null) throw new Exception(Error.NoData);
           
            return _mapInfoService.SetPlanshetMoonInfo(connection, data);
        }


        public IList<string> SerchPlanetNames(IDbConnection connection, string planetName = null, byte serchPlanetType = (byte) WorldService.SerchPlanetType.OtherUsers, int? currentUserId = null)
        {
            if (planetName == null && (serchPlanetType != (byte) SerchPlanetType.OnlyUserPlanet))
                return new List<string>();
            planetName = planetName?.ToUpper();


            if (serchPlanetType == (byte) SerchPlanetType.AllPlanets)
            {
                if (string.IsNullOrWhiteSpace(planetName))
                    throw new ArgumentNullException(nameof(planetName), Error.PlanetNotSetInInstance);
                return _gDetailPlanetService.GetPlanetNames(connection, i => i.Name.Contains(planetName));
            }


            if (currentUserId == null || currentUserId == 0)
                throw new ArgumentNullException(nameof(currentUserId), Error.UserIdNotSetInInstance);

            var crUserId = (int) currentUserId;

            if (serchPlanetType == (byte) SerchPlanetType.OtherUsers)
            {
                if (string.IsNullOrWhiteSpace(planetName))
                    throw new ArgumentNullException(nameof(planetName), Error.PlanetNotSetInInstance);
                return _gDetailPlanetService.GetPlanetNames(connection, i =>
                    i.Name.Contains(planetName) && i.UserId != crUserId);
            }


            if (serchPlanetType == (byte) SerchPlanetType.OnlyUserPlanet)
            {
                if (planetName == null)
                    return _gDetailPlanetService.GetPlanetNames(connection, i => i.UserId == crUserId);
                return _gDetailPlanetService.GetPlanetNames(connection, i =>
                    i.Name.Contains(planetName) && i.UserId == crUserId);
            }
            throw new Exception(Error.PlanetNotExsist);
        }


        //private readonly IGameUserService _gameUserService;

        public enum SerchPlanetType : byte

        {
            AllPlanets = 1,
            OtherUsers = 2,
            OnlyUserPlanet = 3
        }
    }
}