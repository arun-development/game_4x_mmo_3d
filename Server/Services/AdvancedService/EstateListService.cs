using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Interfaces.UserServices;
using Server.Core.Interfaces.World;
using Server.Core.Map;
using Server.DataLayer;

namespace Server.Services.AdvancedService
{
    public interface IEstateListService
    {
        IList<EstateItemOut> GetList(IDbConnection connection, int userId);
        EstateItemOut GetPlanetItem(IDbConnection connection, int planetId, int userId);
    }

    public class EstateListService : IEstateListService
    {
        private readonly IGDetailPlanetService _detailPlanetService;
        private readonly IMothershipService _motherService;
        private readonly ISystemService _systemService;

        public EstateListService(IMothershipService motherService, ISystemService systemService,
            IGDetailPlanetService detailPlanetService)
        {
            _motherService = motherService;
            _systemService = systemService;
            _detailPlanetService = detailPlanetService;
        }

        public IList<EstateItemOut> GetList(IDbConnection connection, int userId)
        {
            var mother = _motherService.GetMother(connection, userId);
            var planets = _detailPlanetService.GetUserPlanets(connection, userId);
            return GetList(connection, mother, planets);
        }

        public EstateItemOut GetPlanetItem(IDbConnection connection, int planetId, int userId)
        {
            return _detailPlanetService.GetUserEstate(connection, planetId, userId);
        }

        public IList<EstateItemOut> GetList(IDbConnection connection, UserMothershipDataModel mother, IList<GDetailPlanetDataModel> planets)
        {
            var motherAdress = _systemService.GetSystem(connection, mother.StartSystemId, i => i);
            var list = new List<EstateItemOut>
            {
                new EstateItemOut
                {
                    Name = "MotherShip",
                    Type = false,
                    Sector = motherAdress.SectorId,
                    System = motherAdress.Id,
                    Galaxy = motherAdress.GalaxyId,
                    TextureTypeId = 2000,
                    GameTypeId = 20
                }
            };
            if (!planets.Any()) return list;
            var estatePlenets = _detailPlanetService.GetUserEstates(connection, planets);
            list.AddRange(estatePlenets);

            return list;
        }
    }
}