Utils.CoreApp.gameApp.directive("statistic", [
    function () {
        function link($scope, element, attrs, ctrl) {
           //  console.log("statistic $scope", $scope);
        }

        return {

            restrict: "E",
            templateUrl: "statistic.tmpl",
            scope: {
                statisticModel:"="
            },
            replace: true,
            link: link
        }
    }
]);