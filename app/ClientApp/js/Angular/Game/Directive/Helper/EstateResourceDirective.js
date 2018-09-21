Utils.CoreApp.gameApp.directive("estateResource", ["resourceService",
    function (resourceService) {
        function link($scope, element, attrs, ctrl) {
            $scope.estateResource = resourceService.getEstateResources();
        }

        return {
            restrict: "A",
            templateUrl: "estate-resource.tmpl",
            replace: true,
            //scope: true,
            link: link
        }
    }
]);