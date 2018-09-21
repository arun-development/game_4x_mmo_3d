Utils.CoreApp.gameApp.service("hangarService", [
    "spaceShipyardService",
    function (spaceShipyardService) {
        var hangarPanel;
        //not for use example hangar item

        function unitProgress() {
            return {
                Level: null,
                StartTime: null,
                Duration: null,
                IsProgress: false,
                RemainToComplete: null,
                verticalIndicator: { height: 0 }
            }
        }

        var hangarPanelItemView = {
            NativeName: "",
            Name: "",
            SpriteImages: "",
            Count: null,
            Progress: unitProgress()
        };   
        var nativeNames = Utils.RepoKeys.DataKeys.UnitListNames();
        var nameIdReference = {
            Drone: 0,
            Frigate: 1,
            Battlecruiser: 2,
            Battleship: 3,
            Drednout: 4
        };
       
        function getShipyard() {
            return GameServices.spaceShipyardService.getBuildCollection();
        }

        function findPanelItem(name) {
            return _.find(hangarPanel, function (o) {
                return o.PartialView.Data.NativeName === name;
            });
        }

        function findUnitInShipyard(shipyardCollection, unitName) {
            return _.find(shipyardCollection, function (o) {
                return o.NativeName === unitName;
            });
        }

        function setShipyardData(unitItemViewData) {
            var shipyardItem = findUnitInShipyard(getShipyard(), unitItemViewData.NativeName);
            if (!shipyardItem) return;
            shipyardItem.Progress.Level = unitItemViewData.Count;

        }


        function updatePanelItemData(unitViewData) {
            var mid = "mid";
            var grayScale = " grayScale";
            var item = findPanelItem(unitViewData.NativeName);
            if (unitViewData.Count !== null && unitViewData.Count > 0) item.CssClass = mid;
            else if (item.CssClass === mid) item.CssClass = mid + grayScale;
            item.PartialView.Data = unitViewData;
            //setShipyardData(unitViewData);

        }

        function getHangarData() {
            var shipyard = getShipyard();
            var result = [];
            for (var i = 0; i < hangarPanel.length; i++) {
                var panelItem = hangarPanel[i].PartialView.Data;
                var resultItem = panelItem;
                var shipyardItem = _.find(shipyard, function (o) {
                    return o.NativeName === panelItem.NativeName;
                });


                if (!shipyardItem) {
                    resultItem.Progress = unitProgress();
                    resultItem.Count = null;
                } else {
                    resultItem.Progress = shipyardItem.Progress;    
                    if (!resultItem.Progress) resultItem.Progress = unitProgress();
    
                    resultItem.Count = resultItem.Progress.Level;
       
                }

                result.push(resultItem);
            }

            return result;
        }

        function getCloneHangarData() {
            return _.cloneDeep(getHangarData());
        }

        /**
         * 
         * @param {array} repoUnits 
         * @returns {object}  {UnitNativeName:repoUnits[i]}
         */
        function convertArrToObject(repoUnits) {
            var result = {};
            for (var i = 0; i < repoUnits.length; i++) {
                var key = repoUnits[i].NativeName;
                result[key] = repoUnits[i];
            }
            return result;
        }

        function getCloneObjectHangarData() {
            return convertArrToObject(getCloneHangarData());
        }

        function getPanelUnitData(unitName) {
            return _.find(hangarPanel, function (o) {
                return o.PartialView.Data.NativeName === unitName;
            }).PartialView.Data;
        }
            
        function cycleUpdateUnits() {
            spaceShipyardService.upgradeShipyardUnits();  
            var dataUnits = getHangarData();
            // console.log("cycleUpdateUnits", dataUnits);

            for (var i = 0; i < dataUnits.length; i++) {
                updatePanelItemData(dataUnits[i]);
            }
            //console.log("dataUnits", dataUnits);
        }


        function startProduction() {
            GameServices.timerHelper.addViewSinchronizer("units", cycleUpdateUnits);
        }

        this.saveInitHangarPanel = function (panelHangarButtons) { 
            hangarPanel = panelHangarButtons;
            var lock = false;

            function unlock() { lock = false; }

            _.forEach(hangarPanel, function (unitBtn, key) {
       
                unitBtn.Method = function (params, element, attrs, $btnScope, $event) {
                    if (lock) return;
                    lock = true;
                    GameServices.unitDialogService.CreateUnitDetailDialog($event, unlock, unitBtn.PartialView.Data.NativeName);
                };
               
            });
        };

        this.getHangarPanel = function () {   
            return hangarPanel;
        };

        this.getHangarData = getHangarData;
        this.getCloneHangarData = getCloneHangarData;
        this.getCloneObjectHangarData = getCloneObjectHangarData;
        this.updateHangarView = function () {
            _.forEach(hangarPanel, function (item, key) {
                if (hangarPanel.hasOwnProperty(key)) {
                    updatePanelItemData(item.PartialView.Data);
                }
            });
        };

        this.retstartView = function () {
            //   console.log("hangarService.retstartView updateSinchronizer");
            GameServices.estateService.updateSinchronizer(true);
            startProduction();
        };
        this.getPanelUnitData = getPanelUnitData;
    }
]);