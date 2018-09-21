Utils.CoreApp.gameApp.directive("planshetUnitItem", [function() {
    return { 
        scope: {
            item: "="
        },
        replace: true,
        restrict: "EA",
        templateUrl: "planshet-unit-item.tmpl",
        link: function ($scope, element, attrs, ctrl) {

        },
        controller: ["$scope", function ($scope) {
            $scope.dropElement = {};
            console.log("unit.controller", $scope);

 
            //dropElement
        }]
    } 
}]);