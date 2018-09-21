Utils.CoreApp.gameAppExtensions.UserChannelsAlliance = function (service) {
 
    //service.getAllianceMenuConfig = function () {
    //    var btn = service.$btnHelper.ButtonsView();
    //    btn.ConstructorSizeBtn();
    //    service.$btnHelper.buttonPartialView();
    //};
    service.onUserChangeAlliance = function (oldChannelId, newAllianceChannelOutDataModel, $$RootScope) {
        service.deleteLocalChannelItem(service.ChannelTypes.Alliance, oldChannelId);
        service.addOrReplaceLocalChannelItem(newAllianceChannelOutDataModel);
        console.log("UserChannelsAlliance.onUserChangeAlliance", {service:service});
    };
};