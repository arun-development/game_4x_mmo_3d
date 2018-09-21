Utils.CoreApp.gameApp.directive("scroller", [
    function() {
        function link($scope, element, attrs, ctrl) {
            $scope.$emit(attrs.emitName, element, attrs.id);
        }

        return {
            restrict: "A",
            //scope: {},
            link: link
        }
    }
]);