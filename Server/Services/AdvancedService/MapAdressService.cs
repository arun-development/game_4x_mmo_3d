using System.Data;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.Core.Interfaces.World;
using Server.Core.Map;

namespace Server.Services.AdvancedService
{
    public interface IMapAdressService : ITest
    {
        MapAdress GetSystemAdress(IDbConnection connection, int systemId);
        EstateAdress GetSystemAdressIds(IDbConnection connection, int systemId);
        MapAdress GetPlanetAdress(IDbConnection connection, string planetName);
        MapAdress GetPlanetAdress(IDbConnection connection, int planetId);
    }

    public class MapAdressService : IMapAdressService
    {
        private readonly IGDetailPlanetService _gDetailPlanetService;
        private readonly ISystemService _systemService;

        public MapAdressService(ISystemService systemService, IGDetailPlanetService gDetailPlanetService)
        {
            _systemService = systemService;
            _gDetailPlanetService = gDetailPlanetService;
        }

        public EstateAdress GetSystemAdressIds(IDbConnection connection, int systemId)
        {
            return _systemService.GetSystem(connection, systemId, i => new EstateAdress
            {
                Galaxy = i.GalaxyId,
                Sector = i.SectorId,
                System = i.Id
            });
        }

        public MapAdress GetPlanetAdress(IDbConnection connection, string planetName)
        {
            return _gDetailPlanetService.GetAdress(connection, planetName);
        }

        public MapAdress GetPlanetAdress(IDbConnection connection, int planetId)
        {
            return _gDetailPlanetService.GetAdress(connection, planetId);
        }


        public MapAdress GetSystemAdress(IDbConnection connection, int systemId)
        {
            return _systemService.GetAdress(connection, systemId);
        }

        public string Test(string message = "Ok")
        {
            return message;
        }
    }
}