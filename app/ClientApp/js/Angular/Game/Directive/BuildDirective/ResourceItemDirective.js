Utils.CoreApp.gameApp.directive("resourceItem", [
    function () {
 
        function link($scope, element, attrs, ctrl) {
            
        }
         
        return {
            restrict: "A",
            replace: true,
            scope: {
                resourceData:"="
            },
            link: link,
            templateUrl: "build-av-resource-item.tmpl"
        };
    }
]);