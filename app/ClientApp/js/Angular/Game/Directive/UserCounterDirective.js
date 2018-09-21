Utils.CoreApp.gameApp.directive("userCounter", [function () {
    return {
        restrict: "A",
        templateUrl: "user-counter.tmpl",
        replace: true,
        scope: {},
        link: function ($scope, element, attrs, ctrl) {
            var counter = {
                count: 0,
                cssLoading: "",
                low: {
                    max: 1,
                    cssClass: ""
                },
                medium: {
                    max: 2,
                    cssClass: "medium"
                },
                hard: {
                    max: 99999,
                    cssClass: "hard"
                }
            };
            counter.cssLoading = counter.low.cssClass;

            function updateCss() {
                var val = counter.cssLoading;
                var count = counter.count;
                if (count < counter.low.max && val !== counter.low.cssClass) {
                    counter.cssLoading = counter.low.cssClass;
                }
                else if (count < counter.medium.max && val !== counter.medium.cssClass) {
                    counter.cssLoading = counter.medium.cssClass;
                }
                else if (val !== counter.hard.cssClass) {
                    counter.cssLoading = counter.hard.cssClass;
                }
            }
            //window._t = function (val) {
            //    $scope.$apply(function () {
            //        counter.count = val;
            //        updateCss();
            //    }); 
            //}
            $scope.counter = counter;
            $scope.$on("user:join-to-game", function (event, data) {
                $scope.$apply(function () {
                    counter.count = data.OnlineTotalCount;
                    updateCss();
                });
            });
            $scope.$on("user:left-game", function (event, disconnectedConnectionUser) {
                $scope.$apply(function () {
                    counter.count--;
                    updateCss();
                });


            });

        }

    }
}
]);