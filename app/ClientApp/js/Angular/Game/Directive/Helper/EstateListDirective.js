Utils.CoreApp.gameApp.directive("estateList", ["estateService", function (estateService) {
 
        var template = '<select class="estates-list"><option ng-repeat="estate in estateList" ng-attr-value="{{estate.OwnId}}">{{estate.Name}}</option></select>';
        function link($scope, element, attrs, ctrl) {
            //console.log("estateList $scope", $scope);
            $scope.estateList = estateService.getEstateListData();
            estateService.registerEvents(element);
        }

        return {
            restrict: "A",
            //templateUrl: template,
            template: template,
            replace: true,
            //scope: true,
            link: link
        }
    }
]);