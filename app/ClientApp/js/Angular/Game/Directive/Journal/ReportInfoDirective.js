Utils.CoreApp.gameApp.directive("reportInfo", ["journalService", "translateService",
    function (journalService, translateService) {  
        return {
            replace: true,
            restrict: "E",
            scope: {
                info: "=",
                infoButtons: "=?",
                commonTranslate:"=?"
            },
            templateUrl: "journal-report-info.tmpl",
            link: function ($scope, element, attrs, ctrl) {
                //console.log("reportInfo", $scope);
                var isReport = $scope.info.IsReport;
 
                if (isReport) {
                    $scope.infoButtons = journalService.getReportInfoButtons($scope.info);
                } else {
                    //console.log("IsReport", $scope.info);
                    $scope.infoButtons = journalService.getSpyInfoButtons($scope.info);
                }

                $scope.commonTranslate = translateService.getCommon();

            }
        }
    }
]);
