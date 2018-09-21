Utils.CoreApp.gameApp.directive("controlPanel", ["hangarService", "paralaxButtonHelper", "controlPanelSwicherHelper",
    function (hangarService, paralaxButtonHelper, controlPanelSwicherHelper) { 
        function link($scope, element, attrs) {
 
            controlPanelSwicherHelper.setHangar();
            $scope.cpToggleBtn = paralaxButtonHelper.getToggle(function () {
                controlPanelSwicherHelper.updateState();
            });
            $scope.cpHangarEstateItems = hangarService.getHangarPanel();
            $scope.cpMapControlBtns = paralaxButtonHelper.getMapCtrlBtns();

        }

        return {
            restrict: "A",
            templateUrl:"control-panel.tmpl",
            replace: true,
            scope: true, 
            link: link
        }
    }
]);