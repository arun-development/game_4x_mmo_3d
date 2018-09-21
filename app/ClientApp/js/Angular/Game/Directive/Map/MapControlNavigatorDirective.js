Utils.CoreApp.gameApp.directive("mapControlNavigator", ["controlDiskHelper",
    function (controlDiskHelper) {
        return {
            templateUrl: "map-control-navigator.tmpl",
            restrict: "E",
            replace: true,
            scope: { controlDisk :"@"},
            link: function ($scope, element, attrs) {
                $scope.controlDisk = controlDiskHelper.createCdModel(element, $scope);
            }
        }
    }
]);