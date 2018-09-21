Utils.CoreApp.gameApp.directive("reportUnit", [
    function () {  
        return {
            replace: true,
            restrict: "E",
            scope: {
                unit: "="
            },
            templateUrl: "journal-report-unit.tmpl",
            link: function ($scope, element, attrs, ctrl) {
                var source = element.parent().parent().data("hangar");    
 
                if ($scope.unit.StartUnitCount === 0) {
                    $scope.unit.StartUnitCount = null;
                    $scope.unit.cssSepia = "grayScale";
                }
        

                if ($scope.unit.LostUnitCount === 0) {
                    $scope.unit.LostUnitCount = null;
                }
                if ($scope.unit.LostUnitCount !== null && $scope.unit.LostUnitCount >0) {
                    $scope.unit.LostUnitCount = -$scope.unit.LostUnitCount;
                }
                return;
                //else {
                //    $scope.unit.LostUnitCount = -$scope.unit.LostUnitCount;
                //}
            }
        }
    }
]);
