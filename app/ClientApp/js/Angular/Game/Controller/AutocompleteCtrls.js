
//https://docs.angularjs.org/guide/di

(function () {
    "use strict";
    function ProtoAutocomplete($q, getData, getPlaceholder, onTextChange, onSelected) {
        var showDebug = true;
        this.isDisabled = false;
        var $self = this;
        var inProgress = false;
        this.isValide = false;

        function filter(query, collection) {
            return _.filter(collection, function (o) {
                if (!o.hasOwnProperty("value")) return false;
                return o.value.indexOf(query) !== -1;
            });
        }

        function setItem(newName) {
            var val = null;
            var display = null;
            if (newName) {
                val = newName.toUpperCase();
                display = newName;
            }
            return {
                value: val,
                display: display
            };
        }

        this.querySearch = function (query) {
            if (!query) return null;
            if (query.length === 0) return null;
            if (!(getData instanceof Function)) return null;
            if (inProgress) return null;
            inProgress = true;
            var deferred = $q.defer();
            query = query.toUpperCase();
            getData(query, function (collection) {
                if (!collection) collection = [];
                var results = filter(query, collection.map(function (colItem) {
                    return setItem(colItem);
                }));
                inProgress = false;
                if (!results) return;
                deferred.resolve(results);
            });
            return deferred.promise;
        };

        this.curItem = setItem();

        this.selectedItemChange = function (item) {
            if (item && item.hasOwnProperty("value")) {
                this.curItem = item;
                this.isValide = true;
                if (onSelected instanceof Function) onSelected(this.curItem);
            } else {
                this.isValide = false;
                if (onSelected instanceof Function) onSelected(null);
            }

        };

        this.searchTextChange = function (newText) {
            if (showDebug) console.log("Text changed to", { newText: newText });
            this.curItem = setItem(newText);
            if (onTextChange instanceof Function) {
                onTextChange(newText);
            }
        };

        this.getNotFoundMsg = function () {
            var reqName = "";
            if (this.curItem && this.curItem.hasOwnProperty("display") && this.curItem.display) reqName = this.curItem.display;
            return "Not Found " + reqName;
        };

        if (getPlaceholder instanceof Function) this.getPlaceholder = getPlaceholder;
        else this.getPlaceholder = function () {
            return "Search:";
        };

        function _getCurVal() {
            var item = $self.curItem;
            if (item.hasOwnProperty("value") && typeof item.value === "string") return item.value;
            return null;
        }

        this._getCurVal = _getCurVal;

        this.clear = function (inputId, onClear) {
            var tScope = angular.element("#" + inputId);
            if (tScope) {
                var mdScope = tScope.scope();
                console.log("clear", mdScope);
                if (mdScope && mdScope.$parent && mdScope.$parent.$mdAutocompleteCtrl) mdScope.$parent.$mdAutocompleteCtrl.clear();
            }
            if (onClear instanceof Function) onClear();
        }

    }

    function spyPlanetSerchCtrl($scope, $q, mapInfoService, journalService) {

        var $self = this;
        this.getSpyButtonFromSerch = journalService.getSpyButtonFromSerch;

        ProtoAutocomplete.call(this, $q, function (request, response) {
            mapInfoService.getPlanetNames(request, response, mapInfoService.serchPlanetType.OtherUsers);
        }, function () {
            return "Enter planet name: ";
        });
        this.spySerchInputId = "spy-serch-planet";

        function clear() {
            $self.clear($self.spySerchInputId);
        }

        $scope.clear = clear;

        $scope.getSpyTargetPlanetName = this._getCurVal;

        $scope.$on("gameCtrl:estate-changed", function (event, oItems, t) {
            var newOwnId = oItems.newVal;
            clear();
        });
    }

    spyPlanetSerchCtrl.prototype = Object.create(ProtoAutocomplete.prototype);
    Utils.CoreApp.gameApp.controller("spyPlanetSerchCtrl", ["$scope", "$q", "mapInfoService", "journalService", spyPlanetSerchCtrl]);


    function taskPlanetSerchCtrl($scope, $q, mapInfoService, journalService, journalHelper, hangarService, $timeout) {

        this.showTaskForm = false;
        this.taskTargetPlanetName = null;
        this.getNewTaskButtons = journalService.getNewTaskButtons;
        this.getTaskActionButtons = journalService.getTaskActionButtons;
        this.taskSourceUnits = hangarService.getCloneObjectHangarData();
        this.taskTargetUnits = journalService.getTaskTargetUnits();
        this.taskTransferTypeIsTransfer = false;
        this.transferTypeName = "";
        this.transferTimeName = "";
        var defaultTime = "--:--:--";
        this.transferTimeVal = defaultTime;
        this.activate = false;
        var lastCalculatedPlanetName = null;


        this.unitsIsValid = false;
        this.resultIsValid = false;
        this.minLength = 3;
        var $self = this;
        var animationTime = 500;
        this.setResultIsValid = function (unitsIsValid) {
            $self.unitsIsValid = unitsIsValid;
            $self.resultIsValid = $self.isValide && $self.unitsIsValid;
        };

        function clear() {
            $self.clear("task-serch-planet", function () {
                journalHelper.resetTaskForm($scope);
            });
            //var q = angular.element("#task-serch-planet");
            //if (q) {
            //    var qScope = q.scope();
            //    if (qScope.$mdAutocompleteCtrl) qScope.$mdAutocompleteCtrl.clear();
            //}
            //journalHelper.resetTaskForm($scope);
        }

        this.closeTaskForm = function (updateNow) {
            $self.activate = false;
            clear();
            if (updateNow) {
                $self.showTaskForm = false;
            } else {
                $timeout(function () {
                    $self.showTaskForm = false;
                }, animationTime);
            }

        };


        this.taskErrors = journalHelper.taskErrors;

        this.setTransferType = function (isTransfer) {
            if (isTransfer) this.minLength = 1;
            else this.minLength = 3;
            $self.taskTransferTypeIsTransfer = isTransfer;
            $self.transferTypeName = journalHelper.getTransferTypeName(isTransfer);
            $self.transferTimeName = journalHelper.getTransferTimeName();
            $self.transferTimeVal = defaultTime;
        };

        this.updateShowTaskError = function (errorName, show) {
            if (!errorName) return;
            if ($self.taskErrors.hasOwnProperty(errorName)) {
                $self.taskErrors[errorName].showError = show;
            }
        };

        //searchText

        function onChangeName(planetName, isNewQuery) {
            if (isNewQuery) $self.searchText = planetName;
            $self.isValide = mapInfoService.containPlanetName(journalHelper.getSerchType(), planetName);
            if ($self.isValide) {
                $self.taskTargetPlanetName = planetName;
            } else {
                $self.taskTargetPlanetName = $self._getCurVal();
            }
        }

        var _calcInProgress = false;
        function calcTime(targetPlanetName) {
            var deferred = $q.defer();
            journalHelper.calculateFleetTime(deferred, targetPlanetName);
 
            deferred.promise.then(function (answer) {
                    console.log("taskPlanetSerchCtrl.calcTime");
                    if (targetPlanetName === $self.taskTargetPlanetName) {
                        lastCalculatedPlanetName = targetPlanetName; 
                        $self.transferTimeVal = answer;
                    }
                    else {
                        $self.transferTimeVal = defaultTime;
                        lastCalculatedPlanetName = null;
                    }
                    _calcInProgress = false;

                },
                    function (erorAnswer) {
                        $self.transferTimeVal = defaultTime;
                        lastCalculatedPlanetName = null;
                        _calcInProgress = false;
                        var msg = Errors.GetHubMessage(erorAnswer);
                        throw Errors.ClientNotImplementedException({ $self: $self, msg: msg }, "taskPlanetSerchCtrl.calcTime.error");
                    });
            return deferred.promise;
        }

        $scope.$watch("ctrl.isValide", function (newVal, oldNal) {
            //  console.log("selectedItemChange");
            if (newVal && newVal !== oldNal && !lastCalculatedPlanetName && lastCalculatedPlanetName !== $self.taskTargetPlanetName && !_calcInProgress) {
                _calcInProgress = true;
                calcTime($self.taskTargetPlanetName);
                //            self.transferTimeVal = deferred.promise;

            } else {
                $self.transferTimeVal = defaultTime;
                lastCalculatedPlanetName = null;
            }
        });
        $scope.$on("taskPlanetSerch:showTaskForm", function (e, showTaskForm, planetName, advancedAction) {
            e.stopPropagation();
            $self.taskErrors.resetErrors();
            if (advancedAction instanceof Function) advancedAction($scope);
            if (showTaskForm) {
                $self.showTaskForm = showTaskForm;
                onChangeName(planetName, true);
                $timeout(function () {
                    $self.activate = true;
                }, 150);
            } else $self.closeTaskForm();

        });
        $scope.$on("taskPlanetSerch:changeTransferUnit", function (e, updateTaskHangar, unitName) {
            e.stopPropagation();
            updateTaskHangar(e, unitName);

        });

        $scope.$on("gameCtrl:estate-changed", function (event, oItems) {
            var newOwnId = oItems.newVal;
            $scope.ctrl.closeTaskForm();
            _calcInProgress = false;
        });

        ProtoAutocomplete.call(this, $q, function (request, response) {
            mapInfoService.getPlanetNames(request, response, journalHelper.getSerchType(), true);
        }, function () {
            return "Enter planet name: ";
        }, null, function (newItem) {
            if (newItem) onChangeName(newItem.value, false);
            else onChangeName(null, false);

        });

    }

    taskPlanetSerchCtrl.prototype = Object.create(ProtoAutocomplete.prototype);
    Utils.CoreApp.gameApp.controller("taskPlanetSerchCtrl", ["$scope", "$q", "mapInfoService", "journalService", "journalHelper", "hangarService", "$timeout", taskPlanetSerchCtrl]);



})();
