Utils.CoreApp.gameApp.directive("verifyTo", function () {
    return {
        require: "ngModel",
        scope: {
            verifyTo: "="
        },
        link: function ($scope, $element, $attr, $ngModel) { 
            $ngModel.$validators.verifyTo = function (modelValue, viewValue) {
                return modelValue === $scope.verifyTo;
            };

            $scope.$watch("verifyTo", function () {
                $ngModel.$validate();
            });
        }
    };
});                                             