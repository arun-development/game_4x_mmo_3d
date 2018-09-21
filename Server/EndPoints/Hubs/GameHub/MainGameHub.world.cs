using System.Collections.Generic;
using System.Threading.Tasks;
using Server.Core.Interfaces.ForModel;
using Server.Core.Map.Structure;
using Server.Services.AdvancedService;

namespace Server.EndPoints.Hubs.GameHub
{
    public partial class MainGameHub
    {


        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public async Task<IList<Sector>> WorldGetSectors()
        {
            return await _contextAction(connection => _worldService.GetSectors(connection));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="sectorId"></param>
        /// <returns></returns>
        public async Task<IList<SystemsView>> WorldGetSystems(int sectorId)
        {
            return await _contextAction(connection => _worldService.GetSystems(connection, sectorId));

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="systemId"></param>
        /// <returns></returns>
        public async Task<Planetoids> WorldGetSystemGeometry(int systemId)
        {
            return await _contextAction(connection => _worldService.GetSystemGeometry(connection, systemId));

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="galaxyId"></param>
        /// <returns></returns>
        public async Task<IPlanshetViewData> WorldGetGalaxyInfo(int galaxyId)
        {
            return await _contextAction(connection => _worldService.GalaxyInfo(connection, galaxyId));

        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="sectorId"></param>
        /// <returns></returns>
        public async Task<IPlanshetViewData> WorldGetSectorInfo(int sectorId)
        {
            return await _contextAction(connection => _worldService.SectorInfo(connection, sectorId));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="starId"></param>
        /// <returns></returns>
        public async Task<IPlanshetViewData> WorldGetStarInfo(int starId)
        {
            return await _contextAction(connection => _worldService.StarInfo(connection, starId));

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="planetId"></param>
        /// <returns></returns>
        public async Task<IPlanshetViewData> WorldGetPlanetInfo(int planetId)
        {
            return await _contextAction(connection =>
            {
                var cu = _getCurrentUser(connection);
                return _worldService.PlanetInfo(connection, planetId, cu.UserId);
            });

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="moonId"></param>
        /// <returns></returns>
        public async Task<IPlanshetViewData> WorldGetMoonInfo(int moonId)
        {
            return await _contextAction(connection => _worldService.MoonInfo(connection, moonId));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="planetName"></param>
        /// <param name="serchPlanetType"></param>
        /// <returns></returns>
        public async Task<IList<string>> WorldSerchPlanetNames(string planetName = null,
            byte serchPlanetType = (byte)WorldService.SerchPlanetType.OtherUsers)
        {
            return await _contextAction(connection=>
            {
                if (serchPlanetType == (byte)WorldService.SerchPlanetType.AllPlanets)
                {
                    return _worldService.SerchPlanetNames(connection, planetName, serchPlanetType);
                }
                var cu = _getCurrentUser(connection);
                return _worldService.SerchPlanetNames(connection, planetName, serchPlanetType, cu.UserId);
            });
        }
    }
}