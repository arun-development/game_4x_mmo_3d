Utils.CoreApp.gameApp.factory("gameChestService", ["chestService", function (chestService) {

    chestService.$getActiveItemByItemType = function(chestData, typeId) {
        if (!chestData || chestData.ActivatedItemsView) return null;
        return _.find(chestData.ActivatedItemsView, function (o) {
            return o.ProductTypeId===typeId;
        });
    };
    chestService.$getPremiumItem = function() {
        return chestService.getActiveDataByTypeId( chestService.ProductTypes.Premium.Id);
    };
    chestService.$getPremiumModelByChestData = function(chestData) {
        var pm = chestService.$getActiveItemByItemType(chestData, chestService.ProductTypes.Premium.Id);
        if(!pm||!pm.Data||!pm.Data.Premium) {
            return null;
        }
        return pm.Data.Premium;
    };
 
    chestService.$hasPremium = function (premiumModel) {
        if (!premiumModel) {
            return false;
        }  
        var pmFinished = premiumModel.Finished;
        if (pmFinished) {
            return false;
        }  
        var currTime = Utils.Time.GetUtcNow();
        var et = chestService.$getPremiumEndTime();
        if (currTime > et) {
            premiumModel.Finished = true;
            //todo set upgrade premium data
        }
        return !premiumModel.Finished;
 
    };
    chestService.$getPremiumEndTime = function (premiumModel) {
        if (!premiumModel) {
            return 0;
        }
        return premiumModel.EndTime;
    };
    chestService.$getPremiumMods = function() {
        var pm = chestService.$getPremiumItem();
        if (!pm || !pm.ProductItemProperty || !pm.ProductItemProperty.Property) {
            return null;
        }                                             
        return pm.ProductItemProperty.Property;

    };

    return chestService;
}]);        