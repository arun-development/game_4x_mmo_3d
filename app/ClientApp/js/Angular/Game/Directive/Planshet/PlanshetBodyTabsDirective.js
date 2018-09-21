Utils.CoreApp.gameApp.directive("planshetBodyTabs", ["tabService", function (tabService) {
        function link($scope, element, attrs, ctrl) {
            tabService.initializeTabs($scope.planshetModel);
        }   
        return {
            restrict: "E",
            templateUrl: "planshet-tabs.tmpl",
            replace: true,
            link: link
        }
    }
]);