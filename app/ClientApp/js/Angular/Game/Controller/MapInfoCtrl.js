Utils.CoreApp.gameApp.controller("mapInfoCtrl", ["$scope",
    "mapInfoService", function ($scope, mapInfoService) {
        this.getPlanetoidInfo = mapInfoService.getPlanetoidInfo;

        $scope.$on("planshet:update", function (evt) {
            $scope.$broadcast("mapinfo:planshet:update", { planshetEvent: evt });
        });


    }
]);