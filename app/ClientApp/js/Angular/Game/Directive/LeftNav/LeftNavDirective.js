Utils.CoreApp.gameApp.directive("leftNav", ["mainHelper",
    "paralaxButtonHelper",
    function (mainHelper,paralaxButtonHelper) {
        return {
            //replace: false,
            restrict: "A",
            //scope: true,
            link: function ($scope, element, attrs, ctrl) {
                $scope.leftNavButtons = paralaxButtonHelper.getLeftNavButtons();
            }
        }
    }
]);