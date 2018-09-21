Utils.CoreApp.gameApp.directive("allianceItem", ["allianceService", function (allianceService) {
    function _setData($scope, attrs) {
        $scope.item = $scope.$parent.item;
        var skipParent = 1;
        if (attrs.hasOwnProperty("skipParent")) skipParent = +attrs.skipParent;
        $scope.item.skipParent = skipParent;
        allianceService.setAllianceStatsModelInScope($scope, $scope.item);
        $scope.alianceButtons = allianceService.getAllianceItemBtns($scope.item);
        $scope.description = allianceService.getAllianceItemDescription($scope.item.AllianceDescription);
    }

    function link($scope, element, attrs, ctrl) {
        _setData($scope, attrs);
        $scope.$on("planshet:update", function (e, data) {
            _setData($scope, attrs);
        });
        $scope.$on("alliance:user-join-to-alliance", function (e, data) {
            var ma = data.AllianceData;
            if ($scope.item.Id === ma.Id) {
                console.log("allianceItem.$on(alliance:user-join-to-alliance", {
                    ma: ma,
                    $scope: $scope
                });   
                _setData($scope, attrs);
            }
            _setData($scope, attrs);
        });
        $scope.$on("alliance:user-left-from-alliance", function (e, data) {
            var leftUserId = data.leftUserId;
            var leftAllianceId = data.leftAllianceId;
            if ($scope.item.Id === leftAllianceId) {
                _setData($scope, attrs);
            }

        });

    }

    return {
        restrict: "E",
        templateUrl: "alliance-item.tmpl",
        replace: true,
        link: link,
        scope: {}
    }
}
]);