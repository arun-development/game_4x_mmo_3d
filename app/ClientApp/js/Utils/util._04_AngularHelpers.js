//angular  helpers
Utils.A = {};
(function ($a) {
    $a.getValFromParent = function ($scope, propName) {
        if (!$scope || !propName) return null;
        if ($scope[propName]) {
            return $scope[propName];
        }
        else {
            return $a.getValFromParent($scope.$parent, propName);
        }
    };
    $a.getParentScopeWithProp = function ($scope, propName) {
        if (!$scope || !propName) return null;

        if ($scope[propName]) {
            return $scope;
        }
        else {
            return $a.getParentScopeWithProp($scope.$parent, propName);
        }
    };
    $a.getParentScopeWithPropAndDepth = function ($scope, propName, maxDepth) {
        if (maxDepth === null || maxDepth === undefined) {
            console.log("Utils.A.getParentScopeWithPropAndDepth : param 'maxDepth' not exist value will be set to default 1");
            maxDepth = 1;
        }
        if (!$scope || !propName || maxDepth < 0) return null;
        if ($scope[propName]) {
            return $scope;
        }
        else {
            return $a.getParentScopeWithProp($scope.$parent, propName, --maxDepth);
        }
    };

})(Utils.A);
