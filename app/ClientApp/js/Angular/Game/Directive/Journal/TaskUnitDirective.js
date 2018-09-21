Utils.CoreApp.gameApp.directive("taskUnit", ["journalHelper",
    function (journalHelper) {  
        return {
            replace: true,
            restrict: "E",
            scope: {
                unit: "="
            },
            templateUrl: "journal-task-unit.tmpl",
            link: function ($scope, element, attrs) {
                $scope.target = (attrs.target === "target");
                journalHelper.rgisterTaskUnit($scope, attrs.target);    

            }
        }
    }
]);
