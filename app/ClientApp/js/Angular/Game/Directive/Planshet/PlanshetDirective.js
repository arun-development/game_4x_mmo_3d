Utils.CoreApp.gameApp.directive("planshet", [
    "planshetService", function (planshetService) {
        var planshetToggle = {
            cssActive: "",
            onclick: planshetService.toggle,
            opened: false
        };

        function link($scope, element, attrs, ctrl) {
            $scope.planshetToggle = planshetToggle;

            var pagination = {};
            pagination.hasPrev = planshetService.hasPrevPlanshetElem;
            pagination.hasNext = planshetService.hasNextPlanshetElem;

            pagination.OnPrev = function () {
                planshetService.updateByHistory(-1);

            }
            pagination.OnNext = function () {
                planshetService.updateByHistory(1);
            }
            $scope.pagination = pagination;
          //  console.log("planshet", $scope);
        }

        return {
            restrict: "E",
            templateUrl: "planshet.tmpl",
            replace:true,
            link: link
        }
    }
]);