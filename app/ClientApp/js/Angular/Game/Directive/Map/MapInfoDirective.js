Utils.CoreApp.gameApp.directive("mapInfo", [
    function() {   
        function link($scope, element, attrs) {
            $scope.$on("mapinfo:planshet:update", function (event, args) {
                var pm = args.planshetEvent.targetScope.planshetModel.Bodys[$scope.$index].TemplateData;
                $scope.infoModel = pm;
//                console.log("planshet:update", {
//                    event: event, $scope: $scope,
//                    planshetEvent: args.planshetEvent
//                });
            });
        }
        return {
            restrict: "E",
            templateUrl: "map-info.tmpl",
            replace: true,
            link: link
        }
    }
]);