Utils.CoreApp.gameAppExtensions.HubWorld = function (hubService, client, server) {
    /**
     * 
     * @returns {object}  signalR deffered   => see server IList<Sector>
     */
    hubService.worldGetSectors = function () {
        return server.worldGetSectors();
    };

    /**
     * 
     * @param {int} sectorId 
     * @returns {object}   signalR deffered    => see server IList<SystemsView>
     */
    hubService.worldGetSystems = function (sectorId) {
        return server.worldGetSystems(sectorId);
    };

    /**
     * 
     * @param {int} systemId 
     * @returns {}   signalR deffered      => see server Planetoids
     */
    hubService.worldGetSystemGeometry = function (systemId) {
        return server.worldGetSystemGeometry(systemId);
    };

    /**
     * 
     * @param {int} galaxyId 
     * @returns {object}    signalR deffered    => see server IPlanshetViewData (single GalaxyInfo)
     */
    hubService.worldGetGalaxyInfo = function (galaxyId) {
        return server.worldGetGalaxyInfo(galaxyId);
    };
    /**
     * 
     * @param {} sectorId 
     * @returns {object}    signalR deffered     => see server IPlanshetViewData (single SectorInfo)
     */
    hubService.worldGetSectorInfo = function (sectorId) {
        return server.worldGetSectorInfo(sectorId);
    };
    /**
     * 
     * @param {int} starId 
     * @returns {object}   signalR deffered     => see server IPlanshetViewData (single StarInfo)
     */
    hubService.worldGetStarInfo = function (starId) {
        return server.worldGetStarInfo(starId);
    };
    /**
     * 
     * @param {int} planetId 
     * @returns {object}  signalR deffered    => see server IPlanshetViewData  (single PlanetInfo)
     */
    hubService.worldGetPlanetInfo = function (planetId) {
        return server.worldGetPlanetInfo(planetId);
    };
    /**
     * 
     * @param {int} moonId 
     * @returns {object}    signalR deffered     => see server IPlanshetViewData    (single MoonInfo)
     */
    hubService.worldGetMoonInfo = function (moonId) {
        return server.worldGetMoonInfo(moonId);
    };

    /**
     * 
     * @param {string} planetName 
     * @param {numeric} serchPlanetType  (byte)
     * @returns {object}  signalR deffered     => see server IList<string> - planet names
     */
    hubService.worldSerchPlanetNames = function (planetName, serchPlanetType) {
        return server.worldSerchPlanetNames(planetName, serchPlanetType);
    };
};