Utils.CoreApp.gameApp.directive("buildProgress", [
    function () {
        function link($scope, element, attrs, ctrl) {
            var parentId = $scope.border.buildItemId;
            var parentElem = element.parents("#" + parentId);
            var parentScopeItem = parentElem.scope().item;
            $scope.ParentScope = parentScopeItem;
            $scope.timerData = parentScopeItem.Progress || {};  
            $scope.timerData.$isUnit = GameServices.buildService.isUnit(parentScopeItem.NativeName);
            $scope.Icon = parentScopeItem.ComplexButtonView.Collection[2].Data.Icon;  
        }

        return {
            restrict: "A",
            replace: true,                           
            scope: true,
            link: link
        };
    }
]);