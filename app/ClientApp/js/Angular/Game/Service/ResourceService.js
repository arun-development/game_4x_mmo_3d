Utils.CoreApp.gameApp.service("resourceService", [
    function () {
        //#region Declare

        var nativeNames = ["e", "ir", "dm", "cc"];
        var refResNames = {
            e: nativeNames[0],
            ir: nativeNames[1],
            dm: nativeNames[2],
            cc: nativeNames[3]
        }
        var estateResources;//array
        var stopProduction = false;
        // model not for use
        var modelResItem = Utils.ModelFactory.ResourceItemModel();
        //modelresItem.Current;
        //modelresItem.Max;
        //modelresItem.NativeName;
        //modelresItem.Percent;
        //modelresItem.TranslateName;

        // ReSharper disable once JoinDeclarationAndInitializerJs
        //functions
        var serverStopProduction;

        function getStorageData() {
            return GameServices.industrialComplexService.getStorageData();
        }

        function upgradeLocalBuilStorageResources(storageResources) {
            getStorageData().StorageResources = storageResources;
        }




        function getProductionData() {
            return GameServices.industrialComplexService.getExtractionModuleData();
        }

        function getStorageResources() {
            return getStorageData().StorageResources;
        }

        //#endregion

        //#region Helpers
        function findViewResItem(resName) {
            return _.find(estateResources, function (o) { return o.NativeName === resName; });
        }
        function getMaterialResourceFromView(resType) {
            function get(resName) {
                var item = _.find(estateResources, function (o) { return o.NativeName === resName; });
                return resType ? item.Max : item.Current;
            }

            var materialResource = Utils.ModelFactory.MaterialResources();
            materialResource.E = get(refResNames.e);
            materialResource.Ir = get(refResNames.ir);
            materialResource.Dm = get(refResNames.dm);
            return materialResource;
        }
        function updatePrcents() {
            function calc(item) {
                item.Percent = GameServices.industrialComplexService.calcResPercent(item.Current, item.Max);
            }
            calc(findViewResItem(refResNames.e));
            calc(findViewResItem(refResNames.ir));
            calc(findViewResItem(refResNames.dm));
        }

        //#endregion


        //#region resource View
        function updateViewResourceMax(resName, newMax) {
            findViewResItem(resName).Max = newMax;
        }
        function updateViewResourceCount(resName, newCount) {
            var item = findViewResItem(resName);
            item.Current = newCount;
            var max = item.Max;
            if (newCount >= max) {
                item.Current = max;
                stopProduction = true;
            }
            if (stopProduction) {
                serverStopProduction();
            }

        }
        function addViewResourceCount(resName, newCount) {
            var resItem = findViewResItem(resName);
            resItem.Current += newCount;
            var max = resItem.Max;
            if (newCount >= max) {
                resItem.Current = max;
                stopProduction = true;
            }
            if (stopProduction) {
                serverStopProduction();
            }


        }


        function updateViewCountsByMaterialResource(materialResource, resType) {
            function setRes(resName, count) {
                if (resType) {
                    updateViewResourceMax(resName, count);
                }
                else {
                    updateViewResourceCount(resName, count);
                }

            }

            setRes(refResNames.e, materialResource.E);
            setRes(refResNames.ir, materialResource.Ir);
            setRes(refResNames.dm, materialResource.Dm);

        };
        function addViewCountsByMaterialResource(materialResource, upgradePersent) {
            function setRes(resName, count) {
                addViewResourceCount(resName, count);
            }
            setRes(refResNames.e, materialResource.E);
            setRes(refResNames.ir, materialResource.Ir);
            setRes(refResNames.dm, materialResource.Dm);
            if (upgradePersent) {
                updatePrcents();
            }

        };
        function updateViewDataResourceByStorageResource(newStorageResource, upgradePersent) {

            updateViewCountsByMaterialResource(newStorageResource.Max,true);
            updateViewCountsByMaterialResource(newStorageResource.Current);
            if (upgradePersent) {
                updatePrcents();
            }
        }
        function isEnoughResources(matRes) {
            var cur = getStorageResources().Current;
            if (cur.E < matRes.E) return false;
            if (cur.Ir < matRes.Ir) return false;
            if (cur.Dm < matRes.Dm) return false;
            return true;
        };
        //#endregion

        //#region Cc
        function getCcItem() {
            return findViewResItem(refResNames.cc);
        }
        function getCcCount() {
            return getCcItem().Current;
        }

        function setCc(newCc) {
            getCcItem().Current = newCc;
        }
        function addCc(adedCc, operator) {
            if (operator === "-") adedCc = -adedCc;
            getCcItem().Current += adedCc;

        }
        function isEnoughCc(cc) {
            return (getCcCount() >= cc);
        };


        //#endregion

        //#region Upgrade and sinchronize
        function isMaximum(storageResource) {
            var cur = storageResource.Current;
            var max = storageResource.Max;

            _.forEach(cur, function (value, resName) {
                var maxValue = max[resName];
                var currValue = cur[resName];
                if (currValue >= maxValue) {
                    stopProduction = true;
                    return false;
                };
            });
            return false;

        }

        function calculateProduction() {
            if (stopProduction) return;
            var sr = getStorageResources();
            if (isMaximum(sr)) return;

            var eph = getProductionData().ExtractionPerHour;
            var newResources = Utils.ModelFactory.MaterialResources();

            function addDelta(sourceVal,perHouer) {
                return sourceVal + ((perHouer / 3600));
            }

            newResources.E = addDelta(sr.Current.E, eph.E);
            newResources.Ir = addDelta(sr.Current.Ir, eph.Ir);
            newResources.Dm = addDelta(sr.Current.Dm, eph.Dm);

            var storableRes = _.cloneDeep(sr);
            storableRes.Current = newResources;
            upgradeLocalBuilStorageResources(storableRes);

            var toInt = Utils.ConvertToInt;
            var newViewRes;
            function cloneToInt() {
                newViewRes = _.cloneDeep(newResources);
                newViewRes.E = toInt(newViewRes.E);
                newViewRes.Ir = toInt(newViewRes.Ir);
                newViewRes.Dm = toInt(newViewRes.Dm);
            }
            cloneToInt();
            var newStorageRes = _.cloneDeep(sr);
            newStorageRes.Current = newViewRes;

            updateViewDataResourceByStorageResource(newStorageRes, true);
        }
        function startProduction() {
            GameServices.timerHelper.addViewSinchronizer("resources", calculateProduction);
        }


        function retstartView() {
            stopProduction = false;
          //  console.log("resourceService.retstartView updateSinchronizer");
            GameServices.estateService.updateSinchronizer(true);
            startProduction();
        }

        //#endregion


        //#region Request
        serverStopProduction = function () {
            // set stop timers
            // set server stop
        }
        //#endregion

        //#region Public
        this.init = function (data) {
         //   console.log("resourceService.init");
            estateResources = data;
            retstartView();
        };


        this.getEstateResources = function () {
            return estateResources;
        };

        this.isEnoughCc = isEnoughCc;
        this.addCc = addCc;

        /**
         * пытается извлеч новый баланс из ответа ошибки (см метод исключения и назначения даты текущего баланса в методе сервера: "StoreService.BalanceCalcResultCc(BalanceCcDataModel balanceModel, int value)" )
         * если данные не верны возвращает текущий баланс
         * @param {object} errorAnswer 
         * @param {string} msg 
         * @returns {int} 
         */
        this.setBalanceFromErrorAnswerNotEnoughCc = function (errorAnswer ,msg) {
            if (msg && msg === ErrorMsg.NotEnoughCc
                && errorAnswer.data
                && errorAnswer.data.InnerException
                && errorAnswer.data.InnerException.Message
                && $.isNumeric(errorAnswer.data.InnerException.Message)
                && _.isInteger(+errorAnswer.data.InnerException.Message)) {
                var newCc = +errorAnswer.data.InnerException.Message;
                setCc(newCc);
                return newCc;
            }
            return getCcCount();
        };

        this.isEnoughResources = isEnoughResources;
        this.updateViewCountsByMaterialResource = updateViewCountsByMaterialResource;
        this.addViewCountsByMaterialResource = addViewCountsByMaterialResource;
        this.retstartView = retstartView;
        this.getCcItem = getCcItem;
        this.getCcCount = getCcCount;
        this.getStorageResources = getStorageResources;
        this.updateViewDataResourceByStorageResource = updateViewDataResourceByStorageResource;
        this.setCc = setCc;
        //#endregion
    }
]);