Utils.CoreApp.gameApp.directive("timerProgress", [
    "timerHelper",
    function (timerHelper) {  
        function link($scope, $element) {   
            var timerType = timerHelper.refTimerTypes;
            if (timerType.simpleTimer === $scope.timerType) {
                console.log("timerType.simpleTimer === $scope.timerType", { $scope: $scope });
                //todo   for mother jump
                if ($scope.border && $scope.border.dataOnload && $scope.border.dataOnload instanceof Function) {
                    var advancedParam = $scope.border.dataOnload();
                    if (advancedParam && advancedParam.hasOwnProperty("cbItemData")
                     && advancedParam.hasOwnProperty("activateUpdate") && advancedParam.hasOwnProperty("timerName")) {
                        $scope.timerAdvancedParam = advancedParam;
                    }
                }
                timerHelper.registerSimpleTimer($scope);

            }
            else if (timerType.buildTimer === $scope.timerType) {
                var cbScope = timerHelper.getComplexBtnScope($scope);
                if (!cbScope) {
                    throw new Error("timerProgress: !cbScope");
                }
                if (cbScope.item.hasOwnProperty("Progress")) {
                    $scope.timerData = cbScope.item.Progress || Utils.ModelFactory.ItemProgress();
                }
               
                //console.log("timerType.buildTimer === $scope.timerType", { $scope: $scope, cbScope: cbScope });
 

                //    setTimerDataParams($scope, $scope.$parent.timerData);
                var data = $scope.border.Data;
                if (data && data.NativeName && data.NativeName.substr(0, 4) === "Tech") {
                    timerHelper.registerBuildTimer($scope, null, 0, cbScope);
                }
                else {
                    var ce = EM.EstateData.GetCurrentEstate();
                    var ownId = ce.EstateId;
                    timerHelper.registerBuildTimer($scope, null, ownId, cbScope);
                }  
                //console.log("timerProgress complexButton", $scope);
            }

            else if (timerType.noTimerRight === $scope.timerType) {
                //console.log("timerType.noTimerRight === $scope.timerType", { $scope: $scope });
                if (!$scope.timerData) {
                    throw new Error("timerProgress: !$scope.timerData");
                }
                timerHelper.registerNoTimerRight($scope.timerData);
 
 
   
            } else if (timerType.hangarUnitTimer === $scope.timerType) {
                //  console.log("timerType.hangarUnitTimer", $scope.timerType);
                //console.log("hangarUnitTimer $scope", $scope);
                //todo метод удален и не существует
                // timerHelper.registerUnitTimer($scope, null, ownId);
            }


        }

        return {
            restrict: "EA",
            templateUrl: "timer-progress.tmpl",
            replace: true,
            scope: {
                timerType:"@", 
                border: "=?",
                timerData:"=?"
            },
            link: link
        };
    }
]);