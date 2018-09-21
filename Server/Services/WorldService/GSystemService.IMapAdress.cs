using System.Data;
using Server.Core.Map;

namespace Server.Services.WorldService
{
    public partial class SystemService
    {
        #region Sync

        public MapAdress GetAdress(IDbConnection connection, string name)
        {
            var systemId = _systemNameSercherPkCache.GetOrAdd(connection,name, _detailSystemCache);
            return GetAdress(connection, systemId);
        }

        public MapAdress GetAdress(IDbConnection connection, int systemId)
        {
            var system = GetSystem(connection, systemId, i => i);
            var sector = _sectorsService.GetById(connection, system.SectorId, i => i);
            var galaxy = _galaxyService.GetGalaxyById(connection, system.GalaxyId, i => i);
            return new MapAdress
            {
                SystemPosition = system.Position,
                System = system.Id,
                SectorPosition = sector.Position,
                GalaxyPosition = galaxy.Position,
                Galaxy = galaxy.Id,
                Sector = sector.Id
            };
        }

        #endregion
    }
}