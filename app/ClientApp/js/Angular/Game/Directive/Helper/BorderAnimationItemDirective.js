Utils.CoreApp.gameApp.directive("borderAnimationItem", [
    function () {
        // почитать про нг иф https://docs.angularjs.org/error/$compile
        // если потребуется посмотреть пакет https://github.com/zachsnow/ng-elif  
        function isSimple(obj) {
            var simple = 
                obj.hasOwnProperty("Data")
                && obj.Data
                && obj.Data.hasOwnProperty("Head")
                && typeof obj.Data.Head === "string";
            obj.IsSimpleCentr = simple;
        }

        return {
            //compile: function compile(templateElement, templateAttrs) {
            //    templateElement.html("<div>{{" + templateAttrs.habraHabrWork + "}}" + templateAttrs.habra + "</div>");
            //},
            scope: {
                border: "="
            },
            replace: true,
            restrict: "EA",
            templateUrl: "border-animation.tmpl",
            link: function ($scope, element, attrs, ctrl) {
               //console.log("borderAnimationItem $scope", $scope);
                var border = $scope.border;
                var _cbScope;
                isSimple(border);
                function _getCbScope(scope) {
                    if (_cbScope) {
                        return _cbScope;
                    }
                    else {
                        return _cbScope = Utils.A.getParentScopeWithProp(scope, "dropElement");
                    }
                }
                if (!border.$onClick) {
                    if (border.Size === "center") {
                        var cbScope = Utils.A.getParentScopeWithPropAndDepth($scope, "advancedCbParams", 3);
                        if (cbScope && cbScope.advancedCbParams.needBroadCast && cbScope.advancedCbParams.activateUpdate.length > 0) {
                            var hasData = false;
                            if (cbScope.advancedCbParams.activateUpdate === "updateJumpMotherTimer") {
                                cbScope.advancedCbParams.cbItemData = GameServices.journalService.getLocalMotherJump();
                                if (cbScope.advancedCbParams.cbItemData) {
                                    hasData = true;
                                    cbScope.advancedCbParams.activateUpdate = GameServices.journalService.updateJumpMotherTimer;
                                }

                            }
                            if (hasData) {
                                cbScope.advancedCbParams.borderScope = $scope;
                                border.dataOnload = function () {
                                    return cbScope.advancedCbParams;
                                }
                            }
                        }
                    }
                    if (!Utils.Event.HasClick(element)) {
                        if (border.IsComplexPart) {
                            element.click(function ($event) {
                                var parent = _getCbScope($scope);
                                if (!parent) {
                                   console.log("borderAnimationItem.click parentScope not exist");
                                    return;
                                }
                                parent.dropElementonClickByDropable(null, true, border.ItemId);
                            });
                        }
                        else {
                            element.click(function ($event) {
                              //  console.log("border.custom click", { $scope: $scope, border: border });
                                if (border.JsFunction instanceof Function) border.JsFunction($event);
                                else if (typeof border.JsFunction === "string") eval(border.JsFunction);
                            });
                        }
                    }
                }
                else if (!Utils.Event.HasClick(element)) {
                    element.click(function ($event) {
                        $event.$$border = border;
                        border.$onClick($event);
                    });
                }
            }
        }
    }
]);