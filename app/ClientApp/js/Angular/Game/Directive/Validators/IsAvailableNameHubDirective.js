//custom validation
//https://www.algotech.solutions/blog/javascript/how-to-create-custom-validator-directives-with-angularjs/ 
Utils.CoreApp.gameApp.directive("isAvailableNameHub", [
        "$q", "mainGameHubService", function ($q, $hub) {   

            return {
                restrict: "A",
                require: "ngModel",
                link: function ($scope, $element, $attr, $ngModel) {

                    if (!$attr.isAvailableNameHub || !($hub[$attr.isAvailableNameHub] instanceof Function)) {
                        throw new Error("$hub method not  exist");
                    }
                    var method = $hub[$attr.isAvailableNameHub];

                    $ngModel.$asyncValidators.isAvailableName = function (modelValue, viewValue) {
                        console.log("$ngModel.$asyncValidators.isAvailableName");
                        var deferred = $q.defer();
                        method(viewValue).then(function (isAvailable) {
                            if (isAvailable) {
                                if ($attr.onNameValidate) {
                                    var onNameValidate = Utils.StrToRef($attr.onNameValidate, $scope);
                                    if (onNameValidate instanceof Function) onNameValidate();
                                }
                                deferred.resolve();

                            }

                            else {
                                if ($attr.onNameInvalidate) {
                                    var onNameInvalidate = Utils.StrToRef($attr.onNameInvalidate, $scope);
                                    if (onNameInvalidate instanceof Function) onNameInvalidate();
                                }
                                deferred.reject();

                            }
                        }, function () {
                            deferred.reject();

                        });
                        return deferred.promise;
                    }
                }
            }
        }
]);
