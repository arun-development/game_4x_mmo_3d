Utils.CoreApp.gameApp.directive("allianceItemSearch", [
    "allianceService", function(allianceService) {
        function link($scope, element, attrs, ctrl) {
            element.autocomplete({
                delay: 250,
                minLength: 0,
                source: function(request, response) {
                    allianceService.getAllianceNames(request, response);
                },
                select: function(event, ui) {
                    var allianceId = ui.item.id;
                    var allianceName = ui.item.value;
                    function apply() {
                        $scope.$apply(function() {
                            $scope.allianceName = allianceName;
                        });
                    }

                    allianceService.getAllianceItem(allianceId, apply);
                }
            });
        }

        return {
            restrict: "A",
            controller: "allianceCtrl as allianceCtrl",
            link: link
        };
    }
]);