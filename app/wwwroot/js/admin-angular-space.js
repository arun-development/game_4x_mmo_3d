(function (module) {
    "use strict";
    var mf = Utils.ModelFactory;
    module.controller("spaceCtrl", ["$scope", "spaceService", function ($scope, spaceService) {

        this.$selectedType = null;
        this.spaceTypes = spaceService.getSpaceTypes();
        this.contendData = null;
        this.showContentData = false;
        this.typeSelectDisabled = false;

        this.onSpaceTypeSelected = function (selectedType) {
            $scope.spaceCtrl.typeSelectDisabled = true;
            spaceService.getSpaceTypeItemsData(selectedType.Name, function (data) {
                console.log("data", {
                    data: data,
                    $scope: $scope,
                });
                if (data) {
                    $scope.spaceCtrl.contendData = data;
                    $scope.spaceCtrl.showContentData = true;

                }
                else {
                    $scope.spaceCtrl.showContentData = false;
                }
                $scope.spaceCtrl.typeSelectDisabled = false;
            });
        }

        this.filterName = "";
        this.updateItemDisabled = false;
        this.updateItem = function ($event, item) {
            $scope.spaceCtrl.updateItemDisabled = true;
            spaceService.updateItem($event, item, function () {
                $scope.spaceCtrl.updateItemDisabled = false;
            });
        };


        console.log("spaceCtrl", {
            $scope: $scope,
            spaceService: spaceService,
        });
    }]);

    module.controller("updateSpaceItemDialogCtrl", ["$scope", "$mdDialog", "spaceService", "$q", "spaceItem", function ($scope, $mdDialog, spaceService, $q, spaceItem) {
        this.maxlength = 1000;
        this.spaceItem = spaceItem;
        this.model = _.cloneDeep(spaceItem.Translate);
        this.cancel = function () {
            console.log("cancel");
            $mdDialog.cancel();
        };

        this.sendIsDisabled = false;
        this.send = function () {
            //todo code heare
            if (!_.isEqual($scope.ctrl.spaceItem.Translate, $scope.ctrl.model)) {
                console.log("send");
                $scope.ctrl.sendIsDisabled = true;
                var undoTranslate = _.cloneDeep(spaceItem.Translate);
                spaceItem.Translate = $scope.ctrl.model;
                var deferred = $q.defer();
                $.ajax({
                    url: "adminSpace/UpdateDescription/",
                    method: "POST",
                    type: "json",
                    data: Utils.XSRF.MakeIPostXsrf("spaceItem",spaceItem) 
                }).then(function (okAnswer) {
                    if (okAnswer) {
                        deferred.resolve();
                    }
                    else {
                        deferred.reject();
                    }

                }, deferred.reject);

                deferred.promise.then($mdDialog.hide, function (errorAnswer) {
                    $scope.ctrl.spaceItem.Translate = undoTranslate;
                    spaceService.$defaultError(errorAnswer);
                }).finally(function () {
                    $scope.ctrl.sendIsDisabled = false;
                });


            }
            else {
                $scope.ctrl.cancel();
            }


        };

        console.log("updateSpaceItemDialogCtrl", {
            $scope: $scope
        });
    }]);

    module.service("spaceService", ["$q", "$mdDialog", function ($q, $mdDialog) {
        var $self = this;
        this.$defaultError = Errors.$defaultErrorResponce;
        this.$spaceTypeNames = null;

        this.$spaceData = {};
        this.typesData = (function () {
            var types = {};
            types.Galaxy = mf.INameIdModel(0, "Galaxy");
            types.Sector = mf.INameIdModel(1, "Sector");
            types.Star = mf.INameIdModel(2, "Star");
            types.Planet = mf.INameIdModel(3, "Planet");
            types.Satellite = mf.INameIdModel(4, "Satellite");


            $self.$spaceTypeNames = [types.Galaxy.Name,
                                     types.Sector.Name,
                                     types.Star.Name,
                                     types.Planet.Name,
                                     types.Satellite.Name];

            Utils.FreezeDeep($self.$spaceTypeNames);

            _.forEach($self.$spaceTypeNames, function (o) {
                $self.$spaceData[o] = null;
            });
            return types;

        })();

        this.getSpaceTypes = function () {
            return $self.typesData;
        };

        this.getSpaceTypeItemsData = function (spaceTypeName, onComplete) {
            var deferred = $q.defer();
            var setToCurrent = true;
            if ($self.$spaceData[spaceTypeName]) {
                setToCurrent = false;
                deferred.resolve($self.$spaceData[spaceTypeName]);
            }
            else {  
                $.ajax({
                    url: "adminSpace/GetSpaceItems/",
                    method: "POST",
                    type: "json",
                    data: Utils.XSRF.MakeIPostXsrf("mapType", spaceTypeName)

                }).then(deferred.resolve, deferred.reject);

            }
            deferred.promise.then(function (answer) {
                if (setToCurrent) {
                    console.log("request", { answer: answer });
                    $self.$spaceData[spaceTypeName] = answer;
                }
                onComplete($self.$spaceData[spaceTypeName]);
            }, function (errorAnswer) {
                onComplete(false);

                $self.$defaultError(errorAnswer);
            });

        };

        this.updateItem = function ($event, spaceItem, onComplete) {
            $mdDialog.show({
                templateUrl: "update-space-item-dialog.tmpl",
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                fullscreen: true,
                locals: {
                    spaceItem: spaceItem
                },
                controller: "updateSpaceItemDialogCtrl",
                controllerAs: "ctrl"
            }).finally(onComplete).then(angular.noop, angular.noop);
        };


    }]);


})(Utils.CoreApp.adminApp);