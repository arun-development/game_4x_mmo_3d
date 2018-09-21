Utils.CoreApp.gameApp.service("spaceShipyardService", [
    "mainHelper", "planshetService",
    function (mainHelper, planshetService) {
        var spaceShipyard = {};
        var spaceShipyardUniqueId = Utils.RepoKeys.DataKeys.BuildIds.GetBuildIdByIdx(2);
        
        //#region Members
        var _unitRequestInProgress = false;

        /**
         * 
         * @param {object} timerScope  - timerProgress directive scope 
         * @param {object} itemData - buildItem
         * @returns {bool} true - stop timer, false - update timer
         */
        function requestUpdateCurrentEstate(ownId) {
            var finaly = function () {
                _unitRequestInProgress = false;
            };
            _unitRequestInProgress = true;
            var getInProgress = planshetService.getInProgress;
            if (getInProgress()) {
                var t = setInterval(function () {
                    var ce = EM.EstateData.GetCurrentEstate();
                    //  console.log("spaceShipyardService.requestUpdateCurrentEstate", ce);
                    if (ce.EstateId !== ownId) {
                        clearInterval(t);
                        finaly();
                        return;
                    } else if (!getInProgress()) {
                        GameServices.estateService.getFullEstate(ownId, finaly, false);
                        clearInterval(t);
                        return;
                    }
                }, 100);


            } else GameServices.estateService.getFullEstate(ownId, finaly, false);

        }

        function getBuildCollection() {
            return spaceShipyard.Bodys[0].TemplateData;
        }

        function isActiveModel() {
            return planshetService.isCurrentModel(spaceShipyardUniqueId);
        }


        function upgradeShipyardUnits() {
            var units = getBuildCollection();
            var shipyardIsActive = isActiveModel();
            var timerService = GameServices.timerHelper;
            var needServerUpdate = false;

            _.forEach(units, function (unit, key) {
                var name = unit.NativeName;
                var progress = unit.Progress;

                if (name === Utils.RepoKeys.DataKeys.SpaceShipyard || !progress.IsProgress) return;
                if (typeof progress._duration === "number" && progress._duration <= 0) {
                    needServerUpdate = true;
                    return;
                }
 

                var startTime = progress.StartTime;

                var turnedUnit = progress.Advanced;
                var startTurnTime = turnedUnit.DateCreate;
                var totalCount = turnedUnit.TotalCount;
                var readyUnits = turnedUnit.ReadyUnits;

                if (!progress._ups) {
                    progress._ups = progress.RemainToComplete / progress.Duration;
                    progress._duration = _.clone(progress.Duration);
                    progress._remainToСomplete = _.clone(progress.RemainToComplete);
                    progress.__remainToComplete = totalCount - readyUnits;
                    turnedUnit.UnitToSave = turnedUnit.ReadyUnits - Math.floor(turnedUnit.ReadyUnits);
                };
                var ups = progress._ups;


                turnedUnit.UnitToSave += ups;
                progress.__remainToComplete -= ups;
                progress._remainToComplete = Math.ceil(progress.__remainToComplete);
                var intUnitToSave = Math.floor(turnedUnit.UnitToSave);
                if (turnedUnit.UnitToSave >= 1) {
                    turnedUnit.UnitToSave -= intUnitToSave;
                    progress.Level += intUnitToSave;
                }
                var unitProgress = turnedUnit.UnitToSave * 100;
                if (unitProgress > 100) unitProgress = 0;
                if (!progress.verticalIndicator) {
                    progress.verticalIndicator = timerService.getIndicator(true, unitProgress);
                }
                else {
                    Utils.UpdateObjFromOther(progress.verticalIndicator, timerService.getIndicator(true, unitProgress));
                }
             
                progress._duration--;


                if (shipyardIsActive) {
                   //var htmlName = _.lowerFirst(name);
       
                    var cbElement = angular.element("#" + unit.$guid);
                    if (cbElement.length) {
                        var cssClassTimeContiol = "time-contiol";
                        var stringTimerScope = cbElement.find(".center ." + cssClassTimeContiol).scope();
                        var countTimerScope = cbElement.find(".ms ." + cssClassTimeContiol).scope();   
                        var timerData = stringTimerScope.$parent.timerData;



                        var endTime = startTime + progress.Duration;
                        var totalTime = endTime - startTurnTime;
                        var timeToLeft = endTime - Utils.Time.GetUtcNow();
                        var turnProgress = Math.floor(Math.abs(((timeToLeft / totalTime) * 100) - 100));


                        timerData.$orientation = timerService.horizontalCss;
                        timerData.$hasTimer = true;
                        timerData.$timerHtmlData = Utils.Time.Seconds2Time(Math.ceil(timeToLeft));
                        if (!timerData.$indicator) {
                            timerData.$indicator = timerService.getIndicator(false, turnProgress);
                        }
                        else {
                            Utils.UpdateObjFromOther(timerData.$indicator, timerService.getIndicator(false, turnProgress));
                        }
                  

                        
                        if (!timerData.$noTimer) {
                            timerService.registerNoTimerRight(countTimerScope.timerData);
                        }
                        var $noTimer = timerData.$noTimer;  
                        $noTimer.$orientation = timerService.verticalCss;
                        $noTimer.$hasTimer = true;  
                        $noTimer.$timerHtmlData = progress._remainToComplete;
                        Utils.UpdateObjFromOther($noTimer.$indicator, progress.verticalIndicator); 


                    }
                    else {
                        console.log("spaceShipyardService.upgradeShipyardUnits.shipyardIsActive: unit not exist");
                    }



                }
            });


            if (needServerUpdate) {
                var ce = EM.EstateData.GetCurrentEstate();
                //  console.log("spaceShipyardService.upgradeShipyardUnits.needServerUpdate", ce);
                requestUpdateCurrentEstate(ce.EstateId);
            }
        }


        function getUnitByName(nativeName) {
            return _.find(getBuildCollection(), function (o) {
                return o.NativeName === nativeName;
            });
        }

        function setUnitProgress(nativeName, newProgress) {
            getUnitByName(nativeName).Progress = newProgress;
        }

        function updateUnitInputModel(item) {
            var resourceService = GameServices.resourceService;
            //Update.upgradeCount
            var price = item.Update.Price;
            var iUnitcount = item.Update.upgradeCount;
            if (iUnitcount < 1) return;
            if (price.forCc) {
                var curCc = resourceService.getCcCount();
                var ccPrice = price.Cc;
                if (ccPrice > curCc) {
                    item.Update.upgradeCount = 0;
                    return;
                }
                var sumCc = iUnitcount * ccPrice;
                if (sumCc <= curCc) return;
                var limCc = Math.floor(curCc / ccPrice);
                item.Update.upgradeCount = limCc;
                return;
            } else {
                var resource = resourceService.getStorageResources().Current;

                if (resource.E < price.E && resource.Ir < price.Ir && resource.Dm < price.Dm) item.Update.upgradeCount = 0;
                var limits = [];
                _.forEach(resource, function (curRes, resName) {
                    if (price[resName] === 0) return;
                    limits.push(curRes / price[resName]);
                });
                if (limits.length < 1) return;
                var limit = Math.floor(Math.min.apply(Math, limits));
                if (iUnitcount > limit) item.Update.upgradeCount = limit;
            }
            //forCc

        }

        //#endregion
        

        //#region Require
        function getPlanshetModel() {
            return planshetService.getItemById(spaceShipyardUniqueId);
        }

        function upgradeModel() {  
            _unitRequestInProgress = false;
            spaceShipyard = getPlanshetModel();

            if (planshetService.isCurrentModel(spaceShipyardUniqueId)) {
                planshetService.updatePlanshet(upgradeShipyardUnits, spaceShipyardUniqueId);
            }
            //console.log("spaceShipyardService.upgradeModel.retstartView");
            GameServices.hangarService.retstartView();
        }

        //#region registerUnitItem
        var lockDialogUnit = false;
 

        function unlockDialogUnit() {
            lockDialogUnit = false;
        };
 

        function registerUnitItem(item) {
            var col = item.ComplexButtonView.Collection;
            var info = col[0];
            var detail = col[1];
            var update = col[2];
            info.$onClick = detail.$onClick = function ($event) {
                if (lockDialogUnit) return;
                lockDialogUnit = true;
                GameServices.unitDialogService.CreateUnitDetailDialog($event, unlockDialogUnit, item.NativeName);

            };
            update.$onClick = function ($event) {
                if (lockDialogUnit) return;
                lockDialogUnit = true;
                GameServices.unitDialogService.CreateBuyUnitDialog($event, unlockDialogUnit, item);
            };

        }
        //#endregion
 


        this.getUniqueId = function () {
            return spaceShipyardUniqueId;
        };
        this.upgradeModel = upgradeModel;
        this.getBuildCollection = getBuildCollection;
        this.upgradeShipyardUnits = upgradeShipyardUnits;
        this.setUnitProgress = setUnitProgress;
        this.updateUnitInputModel = updateUnitInputModel;
        this.registerUnitItem = registerUnitItem;
        //#endregion
    }
]);