Utils.CoreApp.gameApp.directive("complexButton", [
    function() {
        return {
            restrict: "E",
            templateUrl: "complexButton.tmpl",
            replace: true,
            scope: {
                complexButton: "=",
                advancedCbParams:"=?"
            }
        };
    }
]);