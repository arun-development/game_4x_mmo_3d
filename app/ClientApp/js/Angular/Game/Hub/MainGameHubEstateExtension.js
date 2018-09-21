Utils.CoreApp.gameAppExtensions.HubEstate = function (hubService, client, server) {
    /**
     * получает синхронизированные данные  ангара по текущему владению 
     * @param {int} bookmarkOutModel  0 mother, else planetId
     * @returns {object}  signalR deffered  => object see server  Dictionary<UnitType, HangarUnitsOut>  or Utils.ModelFactory.UnitList
     */
    hubService.estateGetHangar = function (ownId) {
        return server.estateGetHangar(ownId);
    };
    /**
     *  получает весь список доступных владений пользователя на текущший момент
     * @returns {object} signalR deffered  => object   see server IList<EstateItemOut>    or List<Utils.ModelFactory.EstateListData>
     */
    hubService.estateGetEstateList = function () {
        return server.estateGetEstateList();
    };
    /**
     *  получает  данные для едиственнго эллемента если пользователю принадежит плантеа иначе выбрасывает исключение
     * @param {int} planetId 
     * @returns {object} signalR deffered  => object    EstateListData see server  EstateItemOut or  Utils.ModelFactory.EstateListData
     */
    hubService.estateGetEstateItemByPlanetId = function (planetId) {
        return server.estateGetEstateItemByPlanetId(planetId);
    };

    /**
     * получает синхронизированные данные по переданному владению для всех зданий которые могут принаджать текущему типу владения 
     * @param {int} ownId 0 mother, else planetId 
     * @returns {object} signalR deffered  => object see server Dictionary<string, IPlanshetViewData>   где key - UniqueId :  BuildCollection.BuildPrefixId + moduleId   пример ic:  build-collection-industrial-complex
     */
    hubService.estateGetFullEstate = function (ownId) {
        return server.estateGetFullEstate(ownId);
    };

}