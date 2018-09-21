Utils.CoreApp.gameApp.service("commandCenterService", [
    "mainHelper","planshetService",
    function (mainHelper, planshetService) {
        var commandCenter = {};
        var commandCenterUniqueId = Utils.RepoKeys.DataKeys.BuildIds.GetBuildIdByIdx(1);
  
        //#region Members
        //#endregion

        //#region Require
        function getPlanshetModel() {
            return planshetService.getItemById(commandCenterUniqueId);
        }
        function upgradeModel() {
            commandCenter = getPlanshetModel();
            if (planshetService.isCurrentModel(commandCenterUniqueId)) {
                planshetService.updatePlanshet(null, commandCenterUniqueId);
            }
        }

        this.getUniqueId = function () {
            return commandCenterUniqueId;
        };
        this.upgradeModel = upgradeModel;
        //#endregion

    }
]);