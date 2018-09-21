Utils.CoreApp.gameApp.service("buildService", [
    function () {
        var $self = this;
        //#region buildIds

        var buildIds = Utils.RepoKeys.DataKeys.BuildIds;
        var map = {
            IndustrialComplex: 0,
            CommandCenter: 1,
            SpaceShipyard: 2,
            laboratory: 3
        };
        map.IC = map.IndustrialComplex;
        map.CC = map.CommandCenter;
        map.SS = map.SpaceShipyard;
        map.Lab = map.laboratory;

        //$self.$hub
        Object.defineProperty($self, "$hub", {
            get: function () {
                return GameServices.mainGameHubService;
            }
        });
        function _isCurrentEstate(oldOwnId) {
            var ce = EM.EstateData.GetCurrentEstate();
            return oldOwnId === ce.EstateId;
        }


        //#endregion

        //todo  из за смены на гуид не верно отображается
        function isUnit(buildId) {
            //console.log("buildService", buildId);
            var unitNames = Utils.RepoKeys.DataKeys.UnitListNames();
            var result = false;
            _.forEach(unitNames, function (unitName, key) {
                if (unitName.toLowerCase() === buildId.toLowerCase()) {
                    result = true;
                    return false;
                }
            });
            return result;
        }



        function getServiceByGroupId(groupName) {
            //console.log();
            if (groupName === buildIds.GetBuildIdByIdx(map.IC)) {
                return GameServices.industrialComplexService;
            } else if (groupName === buildIds.GetBuildIdByIdx(map.CC)) {
                return GameServices.commandCenterService;
            } else if (groupName === buildIds.GetBuildIdByIdx(map.SS)) {
                return GameServices.spaceShipyardService;
            } else if (groupName === buildIds.GetBuildIdByIdx(map.Lab)) {
                return GameServices.laboratoryService;
            }
            return null;
        }


        var _timerRequestInProgress; 
        function _updateTechTimer(timerScope, itemData) {
            console.log("_updateTechTimer");
            if (_timerRequestInProgress) return true;
            if (!itemData.Progress) return true;
            //if (!itemData.Progress || !itemData.Progress.IsProgress) return true;
            var stop = GameServices.timerHelper.updateStringTimer(timerScope);
            if (stop) {
                var ownId = 0;
                _timerRequestInProgress = true;
                $self.$hub.techItemUpgraded(itemData.NativeName)
                    .then(function (answer) { 
                        var progress = answer;
                        console.log("_updateTechTimer.answer", { answer: answer, progress: progress });
                        if (progress.IsProgress) {   
                            var service = getServiceByGroupId(itemData.parentUniqueId);
                            if (service.hasOwnProperty("updateBuildProgress")) service.updateBuildProgress(itemData.NativeName, progress);
                            GameServices.timerHelper.registerBuildTimer(timerScope, progress, ownId);
                            _timerRequestInProgress = false;
                            console.log("_updateTechTimer.progress.IsProgress : data", {
                                answer: answer,
                                itemData: itemData,
                                service: service
                            });

                        }
                        else {
                            GameServices.estateService.getFullEstate(ownId, function () {
                                console.log("_updateTechTimer.progress.getFullEstate : finalize", {
                                    answer: answer,
                                    itemData: itemData,
                                    labItem: GameServices.laboratoryService.getItem(itemData.NativeName)
                                });
                                _timerRequestInProgress = false;
                            });
                        }
                    }, function (errorAnswer) {
                        _timerRequestInProgress = false;
                        var msg = Errors.GetHubMessage(errorAnswer);
                        throw Errors.ClientNotImplementedException({
                            errorAnswer: errorAnswer,
                            msg: msg
                        }, "buildService._updateTechTimer");
                    });
            }
            return stop;
            //  
        }



        /**
         * 
         * @param {object} timerScope  - timerProgress directive scope 
         * @param {object} itemData - buildItem
         * @returns {bool} true - stop timer, false - update timer
         */
        function updateBuildTimer(timerScope, itemData) {
            //   console.log("updateBuildTimer", { timerScope: timerScope, itemData: itemData });
            if (itemData && itemData.AdvancedData && itemData.AdvancedData.TechOut) {
                return _updateTechTimer(timerScope, itemData);
            }
            var currentEstate = EM.EstateData.GetCurrentEstate();
            var ownId = currentEstate.EstateId;
            if (_timerRequestInProgress || timerScope.timerData.$ownId !== ownId || timerScope.timerData.$isUnit) return true;
 
            if (!itemData.Progress || !itemData.Progress.IsProgress) return true;
            var stop = GameServices.timerHelper.updateStringTimer(timerScope);
            if (stop) {
                if (ownId === 0) return true;
                function onFinally() {
                    _timerRequestInProgress = false;
                }
                function updateEstate() {
                    if (_isCurrentEstate(ownId)) {
                        GameServices.estateService.getFullEstate(ownId, onFinally);
                    }
                    else {
                        Utils.Console.Bold("clickSubmitBuyUpgrade.own changed", { itemData: itemData });
                    }
                }


                _timerRequestInProgress = true;
                var promise = $self.$hub.buildItemUpgraded(ownId, itemData.NativeName);
                promise.then(function (answer) {
                    if (!_isCurrentEstate(ownId)) return;
                    var progress = answer;
                    if (progress.IsProgress) {
                        var service = getServiceByGroupId(itemData.parentUniqueId);
                        if (service.hasOwnProperty("updateBuildProgress")) service.updateBuildProgress(itemData.NativeName, progress);
                        GameServices.timerHelper.registerBuildTimer(timerScope, progress, ownId);
                        onFinally();

                    } else updateEstate();

                }, function (errorAnswer) {
                    onFinally();
                    var msg = Errors.GetHubMessage(errorAnswer);
                    throw Errors.ClientNotImplementedException({
                        errorAnswer: errorAnswer,
                        msg: msg
                    }, "buildService.updateBuildTimer");
                });

            }
            return stop;
        }



        function validatePrice(price, count) {
            var resources = GameServices.resourceService.getStorageResources().Current;
            var valid = true;
            _.forEach(resources, function (current, key) {
                var priceItem = price[key];
                if (current < priceItem * count) {
                    valid = false;
                    return false;
                }
            });
            return valid;
        };

        function validateCcPrice(ccPrice, count) {
            var ccItem = GameServices.resourceService.getCcItem();
            if (!ccItem) return false;
            var curCc = ccItem.Current;
            if (!curCc || !(typeof curCc === "number")) return false;
            return (curCc >= ccPrice * count);
        }

        var _requestSubmitBuildInProgress = false;

        function clickSubmitBuyUpgrade(section) {
            if (_requestSubmitBuildInProgress) return;

            if (!section) return;
            var update = section.Update;
            if (!update || !update.Price || !section.Progress) return;
            var price = update.Price;
            var canBeUpgrade = true;
            var count = 1;
            if (section.Progress.$isUnit) count = update.upgradeCount;
            else {
                canBeUpgrade = !section.Progress.IsProgress;
            }

            if (!canBeUpgrade) return;


            var validate = price.forCc ? validateCcPrice(price.Cc, count) : validatePrice(price, count);
            if (!validate) return;

            var currentEstate = EM.EstateData.GetCurrentEstate();
            // console.log("buildService.clickSubmitBuyUpgrade", currentEstate);

            var data = Utils.ModelFactory.UnitTurnOut();
            data.OwnId = currentEstate.EstateId;
            data.Count = +count;
            data.ForCc = price.forCc;
            data.NativeName = section.NativeName;

            function onFinally() {
                _requestSubmitBuildInProgress = false;
            }

            function updateEstate() {
                if (_isCurrentEstate(data.OwnId)) {
                    GameServices.estateService.getFullEstate(data.OwnId, onFinally);
                }
                else {
                    onFinally();
                    Utils.Console.Bold("clickSubmitBuyUpgrade.own changed", { data: data });
                }

            }

            var hub = $self.$hub;
            var action;
            if (section.IsBuildItem) {
                action = hub.buildItemUpgrade;
                console.log("clickSubmitBuyUpgrade.section. IsBuildItem", {
                    section: section,
                    data: data
                });
            }
            else if (section.Progress.$isUnit) {
                action = hub.buildSpaceShipyardSetUnitTurn;
                console.log("clickSubmitBuyUpgrade.section. isUnit", {
                    section: section,
                    data: data
                });
            }
            else if (section.AdvancedData && section.AdvancedData.TechOut && !section.AdvancedData.TechOut.Disabled) {
                console.log("clickSubmitBuyUpgrade.section. is tech upgrade", {
                    section: section,
                    data: data
                });
                action = hub.buildLaboratorySetTechTurn;

            }
            else {
                console.log("clickSubmitBuyUpgrade.section undefinded", {
                    section: section,
                    data: data
                });
                throw new Error("No imp");
            }



            _requestSubmitBuildInProgress = true;
            action(data, section.NativeName)
                .then(function (answer) {
                    if (price.forCc && typeof answer === "number") {
                        GameServices.resourceService.setCc(answer);
                        updateEstate();
                    }
                    else if (answer === true) updateEstate();
                    else {
                        onFinally();
                        throw Errors.ClientNotImplementedException({
                            answer: answer,
                            requestData: data
                        }, "buildService.clickSubmitBuyUpgrade.responcce not impl");
                    }

                }, function (errorAnswer) {
                    onFinally();
                    var msg = Errors.GetHubMessage(errorAnswer);
                    if (ErrorMsg.TechInProgress) {
                        //todо  обработать ошибку
                    }
                    throw Errors.ClientNotImplementedException({
                        errorAnswer: errorAnswer,
                        requestData: data,
                        msg: msg
                    }, "buildService.clickSubmitBuyUpgrade");
                });





        }

        function upgradeSubmit(params) {
            clickSubmitBuyUpgrade(params);
        }

        function actionSubmit(params, element, attrs, $scope) {
            var service = getServiceByGroupId(params.parentUniqueId);
            if (service && service.hasOwnProperty("actionSubmit")) {
                service.actionSubmit(params, element, attrs, $scope);
            }
            //console.log("buildService Hi actionSubmit", {
            //    params: params,
            //    element: element,
            //    attrs: attrs,
            //    $scope: $scope
            //});
        }

        //#region Update modules end scopes
        function upgradeMotherEnv() {
            GameServices.laboratoryService.upgradeModel();
        }

        function upgradePlanetEnv() {
            GameServices.commandCenterService.upgradeModel();
        }

        function upgradeCommonEnv() {
            //  console.log("buildService.upgradeCommonEnv");
            GameServices.industrialComplexService.upgradeModel();
            GameServices.spaceShipyardService.upgradeModel();
        }

        function upgradeEstateBuilds(isMotherState) {
            // console.log("buildService.upgradeEstateBuilds");
            upgradeCommonEnv();
            isMotherState ? upgradeMotherEnv() : upgradePlanetEnv();
        }

        //#endregion


        this.isUnit = isUnit;
        this.updateBuildTimer = updateBuildTimer;
        this.upgradeSubmit = upgradeSubmit;
        this.actionSubmit = actionSubmit;
        this.upgradeEstateBuilds = upgradeEstateBuilds;


    }
]);