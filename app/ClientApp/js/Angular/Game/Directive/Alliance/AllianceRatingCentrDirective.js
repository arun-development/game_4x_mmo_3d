Utils.CoreApp.gameApp.directive("allianceRatingCentr", [function () {
        function link($scope, element, attrs) {
            $scope.allianceHead = $scope.border.Data;
        }
        return {
            restrict: "A",
            replace: true,
            scope: true,
            link: link
        }
    }
]);