Utils.CoreApp.gameApp.directive("resourceTransferList", ["industrialComplexService",
    function (industrialComplexService) {
        function link($scope, element, attrs, ctrl) {
            industrialComplexService.registerStorageTransferListEvents($scope, element);

        }       
        return {
            restrict: "A",
            scope: true,
            link: link
        }; 
    }
]);