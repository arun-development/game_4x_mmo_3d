Utils.CoreApp.gameAppExtensions.HubBuild = function (hubService, client, server) {

    // #region IPlanshetViewData build collections

    /**
    * Возвращает модель планшета для здания
    * @param {int} planetId   
    * @returns {object}  signalR deffered  see server IPlanshetViewData (planet IndustrialComplex)
    */
    hubService.buildGetIndustrialComplex = function (planetId) {
        return server.buildGetIndustrialComplex(planetId);
    };

    /**
     * Возвращает модель планшета для здания
     * @param {int} planetId   
     * @returns {object}  signalR deffered  see server IPlanshetViewData (planet CommandCenter)
     */
    hubService.buildGetCommandCenter = function (planetId) {
        return server.buildGetCommandCenter(planetId);
    };

    /**
    * Возвращает модель планшета для здания
    * @param {int} planetId   
    * @returns {object}  signalR deffered  see server IPlanshetViewData (planet SpaceShipyard)
    */
    hubService.buildGetSpaceShipyard = function (planetId) {
        return server.buildGetSpaceShipyard(planetId);
    };

    /**
     * Возвращает модель планшета для здания
     * @returns {object}  signalR deffered  see server IPlanshetViewData (MotherIndustrialComplex)
     */
    hubService.buildGetMotherIndustrialComplex = function () {
        return server.buildGetMotherIndustrialComplex();
    };

    /**
    *Возвращает модель планшета для здания 
    * @returns {object}  signalR deffered  see server IPlanshetViewData (MotherSpaceShipyard)
    */
    hubService.buildGetMotherSpaceShipyard = function () {
        return server.buildGetMotherSpaceShipyard();
    };

    /**
    * Возвращает модель планшета для здания
    * @returns {object}  signalR deffered  see server IPlanshetViewData (MotherLaboratory)
    */
    hubService.buildGetMotherLaboratory = function () {
        console.log("hubService.buildGetMotherLaboratory");
        return server.buildGetMotherLaboratory();
    };
    // #endregion


    // #region Build Item Common

    /**
     * planet builds only!
     * @param {object} unitTurnOutDataModel     see server UnitTurnOut or Utils.ModelFactory.UnitTurnOut
     * @param {string} buildItemNativeName    see server   enum.BuildNativeNames  planet names only 
     * @returns {object}  signalR deffered   => bool (true - upgrade added and data was changed) || int => wen buy for cc retturn new result cc
     */
    hubService.buildItemUpgrade = function (unitTurnOutDataModel, buildItemNativeName) {
        return server.buildItemUpgrade(unitTurnOutDataModel, buildItemNativeName);
    };

    /**
     * planet builds only!
     * @param {int} planetId   not 0
     * @param {string} buildItemNativeName     see server   enum.BuildNativeNames planet names only 
     * @returns {object}  signalR deffered   =>  ItemProgress  see server ItemProgress  updated progress for build item 
     */
    hubService.buildItemUpgraded = function (planetId, buildItemNativeName) {
        return server.buildItemUpgraded(planetId, buildItemNativeName);
    };


    // #endregion


    // #region EnergyConverter   
    /**
    *  обменивает ресурс текцщего владения на другой тип ресурса текущего владения, сохраняет изменения в базу
    * @param {object} energyConverterChangeOutDataModel  see server EnergyConverterChangeOut 
    * @returns {object}  signalR deffered => bool
    */
    hubService.buildEnergyConverterExchangeResource = function (energyConverterChangeOutDataModel) {
        return server.buildEnergyConverterExchangeResource(energyConverterChangeOutDataModel);
    };
    // #endregion


    // #region ExtractionModule  
    /**
     * изменяет % добываемых ресурсов, фиксирует ресурсы так чтобы суммарно получалось 100% добычи
     * @param {object} extractionModuleChangeOutDataModel  see server  ExtractionModuleChangeOut
     * @returns {object}   signalR deffered => bool
     */
    hubService.buildExtractionModuleChangeProportion = function (extractionModuleChangeOutDataModel) {
        return server.buildExtractionModuleChangeProportion(extractionModuleChangeOutDataModel);
    };

    // TODO NotImplemented - test data!
    /**
     * 
     * @param {int} ownId   planetId  or 0 for mother
     * @returns {object}  signalR deffered => string test messge
     */
    hubService.buildExtractionModuleStopProduction = function (ownId) {
        return server.buildExtractionModuleStopProduction(ownId);
    };

    // TODO NotImplemented - test data!
    /**
     *  
     * @param {int} ownId    planetId  or 0 for mother
     * @returns {object}   signalR deffered => string test messge
     */
    hubService.buildExtractionModuleStartProduction = function (ownId) {
        return server.buildExtractionModuleStartProduction(ownId);
    };
    // #endregion


    // #region SpaceShipyard 

    //todo   TODO NotImplemented in client is ok 
    /**
     * синхронизирует данные клиента и сервера об обновлении  юнита
     * @param {int} ownId    planetId  or 0 for mother
     * @param {string} unitTypeName       see server  enum.UnitType or 
     * @returns {object}   signalR deffered =>   ItemProgress see server ItemProgress updated unit progress
     */
    hubService.buildSpaceShipyardFixUnitTurn = function (ownId, unitTypeName) {
        return server.buildSpaceShipyardFixUnitTurn(ownId, unitTypeName);
    };


    /**
     * создает и записывает новй объект очереди для юнита
     * @param {object} unitTurnOutDataModel  see server UnitTurnOut   or Utils.ModelFactory.UnitTurnOut
     * @returns {object}   signalR deffered => bool 
     */
    hubService.buildSpaceShipyardSetUnitTurn = function (unitTurnOutDataModel) {
        return server.buildSpaceShipyardSetUnitTurn(unitTurnOutDataModel);
    };


    // #endregion


    // #region Storage

    //todo   TODO NotImplemented in client  is ok
    /**
    * получает все ресурсны для текущего владения 
    * @param {int} ownId    default -0 => mother else must be planetId
    * @returns {object} signalR deffered => ResourcesView see  server ResourcesView or   Utils.ModelFactory.ResourcesView
    */
    hubService.buildStorageGetResourcesView = function (ownId) {
        return server.buildStorageGetResourcesView(ownId);
    };


    /**
     * получает игровые ресурсы переданого владения
     * @param {int} targetOwnId   mother -0 else planetId
     * @returns {object} signalR deffered =>   StorageResources
     */
    hubService.buildStorageGetStorageResources = function (targetOwnId) {
        return server.buildStorageGetStorageResources(targetOwnId);
    };

    /**
     * осузествляет перезапись данных из одного own  в другой
     * @param {object} transferResourceDataModel   see server  TransferResource or      Utils.ModelFactory.TransferResource
     *  @returns {object} signalR deffered =>   bool
     */
    hubService.buildStorageDoTransfer = function (transferResourceDataModel) {
        return server.buildStorageDoTransfer(transferResourceDataModel);
    };


    // #endregion

    // #region Turel
    // no action
    // #endregion

    // #region Laboratory   
    hubService.buildLaboratorySetTechTurn = function (techTurnOutDataModel) {
        return server.buildLaboratorySetTechTurn(techTurnOutDataModel);
    };
    hubService.techItemUpgraded = function(techType) {
        return server.techItemUpgraded(techType);
    };
    // #endregion

}