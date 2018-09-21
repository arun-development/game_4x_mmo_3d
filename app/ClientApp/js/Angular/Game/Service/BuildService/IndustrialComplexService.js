Utils.CoreApp.gameApp.service("industrialComplexService", [
    "mainHelper", "planshetService", "translateService",
    function (mainHelper, planshetService, translateService) {
        var $self = this;
        var hk = Utils.RepoKeys.HtmlKeys;
        var dk = Utils.RepoKeys.DataKeys;
        var icIds = {
            energyConverter: dk.EnergyConverter,
            extractionModule: dk.ExtractionModule,
            storage: dk.Storage
        };
        var industrialComplex = {}; 

        var industrialComplexUniqueId = dk.BuildIds.GetBuildIdByIdx(0);
        // declare common functions
        var getStorageData = null;
        var getStorageAction = null;
        var buildNames =   {
            ExtractionModule: dk.ExtractionModule,
            EnergyConverter: dk.EnergyConverter,
            Storage: dk.Storage
        }

        // local models
        function resourceItem(name) {
            return {
                current: 0,
                max: 0,
                persent: 0,
                showMax: false,
                title: "",
                htmlName: name,
                showItem: true
            };
        }

        function baseResourceItem(name, translateName) {
            return {
                NativeName: _.upperFirst(name),
                TranslateName: translateName,
                htmlName: _.lowerFirst(name)
            };
        }

        var toInt = Utils.ConvertToInt;


        var getExtractionModuleData = null;
        var getExtractionModule = null;

        var getEnergyConverterData = null;

        var resourceTranslateKeys = {
            Cc: "cc",
            E: "enegry",
            Ir: "iridium",
            Dm: "darkMatter"
        };


        //#region server ctrls
        var ctrls = {
            Storage: "Storage",
            SpaceShipyard: "SpaceShipyard",
            ExtractionModule: "ExtractionModule",
            EnergyConverter: "EnergyConverter"
        };
        var commonMethods = {
            Upgrade: "Upgrade",
            Upgraded: "Upgraded"
        };

        //#endregion

        //#region Helpers
        // $self.$hub
        Object.defineProperty($self, "$hub", {
            get: function () {
                return GameServices.mainGameHubService;
            }
        });

 

        function reqParams() {
            return planshetService.reqParams();
        }

        /**
        * 
        * @param {string} url server url
        * @param {function} callback onSuccess
        * @param {object} data reqParams
        * @returns {void} 
        */
        function request(uniqueId, url, callback, data, method, ignore, onError) {
            if (ignore === undefined) ignore = true;
            var params = reqParams();
            params.data = data;
            params.url = url;
            params.onSuccess = callback;
            if (method) {
                params.method = method;
            }

            if ((onError instanceof Function)) {
                params.onError = onError;
            }
            planshetService.requestHelper(params, uniqueId, ignore, true);
        }

        /**
         * 
         * @param {string} ctrl  имя серверного контролера
         * @param {string} actionName имя серверного действия
         * @returns {string} url
         */
        function urlConstructor(ctrl, actionName) {
            return "/api/" + ctrl + "/" + actionName + "/";
        }

        /**
         * 
         * @param {number} cur  количество текущего ресурса
         * @param {number} max Максимальное значение для текущего ресурса
         * @returns {float} Percent Процент заполненности  текущего ресурса (без знака %)
         */
        function calcResPercent(cur, max) {
            if (cur && max) return (cur / max) * 100;
            return 0;
        }

        function getTranslate() {
            return translateService.getUnit();
        }

        function getIcCtrlScope() {
            var elem = angular.element("#buildContainer");
            if (elem && elem.length > 0) {
                if (elem.scope().hasOwnProperty("buildCtrl")) {
                    return elem.scope();
                }

            }
            return false;
        }

        /**
         * 
         * @param {int} animate milisecond
         * @returns {object} default slider config
         */
        function createEmptySlider(animate) {
            return {
                range: "min",
                max: 0,
                value: 0,
                step: 1,
                animate: animate || 300,
                slide: null,
                stop: null
            };
        }

        var baseResourceProportion = Utils.ModelFactory.MaterialResources(1, 2, 5);

        function calcBaseResourceProportionByNativeName(srcName, targetName, convertLoses) {
            return (baseResourceProportion[srcName] / baseResourceProportion[targetName]) * convertLoses;
        }

        function setNewStorageResources(newStorageresources) {
            getStorageData().StorageResources = newStorageresources;
            console.log("industrialComplexService.setNewStorageResources.retstartView");
            GameServices.resourceService.retstartView();

        }

        this.calcResPercent = calcResPercent;
        //#endregion

        //#region Members
        //#region Strorage Action View
        var storableItemPrefix = "storage-storable-item_";
        var showStorageTargetList = false;
        var storageStorableContainer;
        var resetStorage;
        var _submitStorageActionInProgress = false;

        /**
         * возвращает статус видимости обектов удаленного хранилища на основе которого строятся эллементы упраления, разрушения и создания дочерних эллементов Storage.Action
         * @returns {bool} show or hide target dom elements
         */
        function getStorageTargetShowStatus() {
            return showStorageTargetList;
        }
        function btnStorageSendAllResources() {
            if (!showStorageTargetList || !storageStorableContainer || _submitStorageActionInProgress) return;
            var sliderItemPrefix = "storage-transfer-slider-";
            var currentItems = 0;
            var storableItems = storageStorableContainer.storableItems;
            mainHelper.applyTimeout(function () {
                _.forEach(storableItems, function (storableItem, key) {
                    var sliderElement = angular.element("#" + sliderItemPrefix + storableItem.htmlName);
                    //sliderElement.slider("instance").options.slide(null, "100");
                    sliderElement.slider("value", storableItem.source.current);
                    console.log("sliderElement", storableItem);
                });
            });

            // console.log("storageStorableContainer", storageStorableContainer);
        }

        /**
        * Создает новую модель  из текущуей модели ресурсов для новой модели и готовит ее к дополнительным данным от других директив
        * @returns {array} StorableItems
        */
        function createStorageStorableContainer() {
            storageStorableContainer = {};

            function getBaseItem(name, translateName) {
                var obj = baseResourceItem(name, translateName);
                obj.showTarget = getStorageTargetShowStatus;
                obj.toTransfer = 0;
                obj.source = resourceItem(obj.htmlName);
                obj.target = resourceItem(obj.htmlName);
                return obj;
            }

            function beforeSetUpgradeResource() {
                var resource = _.cloneDeep(getStorageData().StorageResources);
                if (resource) {
                    _.forEach(resource.Current, function (value, key) {
                        resource.Current[key] = toInt(resource.Current[key]);
                    });
                    //console.log("beforeSetUpgradeResource", resource);
                    GameServices.resourceService.updateViewDataResourceByStorageResource(resource, true);
                }
            }

            beforeSetUpgradeResource();


            var storableResources = GameServices.resourceService.getEstateResources();

            var storableItems = [];


            _.forEach(storableResources, function (item, key) {
                if (item.NativeName !== "cc") {
                    var storableItem = getBaseItem(item.NativeName, item.TranslateName);
                    storableItem.source.current = item.Current;
                    storableItem.source.max = item.Max;
                    storableItem.source.persent = item.Percent;
                    storableItems.push(storableItem);
                }
            });

            var ce = EM.EstateData.GetCurrentEstate();
            //  console.log("industrialComplexService.createStorageStorableContainer", ce);

            storageStorableContainer.storableItems = storableItems;
            storageStorableContainer.SourceId = ce.EstateId;
            storageStorableContainer.SourceType = ce.EstateType;
            storageStorableContainer.TargetId = null;
            return storageStorableContainer;
        }

        var getStorageTransferLoses = function () {
            return getStorageData().Losses;
        };

        function setStorageTargetResources(answer, targetOwndId, advancedAction) {
            var targetRes = answer;
            var cur = targetRes.Current;

            _.forEach(cur, function (value, prop) {
                var targetIdx = _.findIndex(storageStorableContainer.storableItems, function (o) { return (o.NativeName === prop); });
                var item = storageStorableContainer.storableItems[targetIdx];
                item.target.current = toInt(cur[prop]);
                item.target.max = targetRes.Max[prop];
                item.target.persent = calcResPercent(item.target.current, item.target.max);
            });

            mainHelper.applyTimeout(function () {
                advancedAction();
                storageStorableContainer.TargetId = targetOwndId;
            });


        }

        //request

        /**
         * see hubService.buildStorageGetStorageResources
         * @param {int} targetOwndId 
         * @param {function} advancedAction 
         * @returns {void} 
         */
        function requestTargetStorableItems(targetOwndId, advancedAction) {
            var timerName = storableItemPrefix + targetOwndId;
            if (storageStorableContainer && storageStorableContainer.TargetId === targetOwndId && !GameServices.timerHelper.timeDelay.IsTimeOver(timerName)) {
                advancedAction();
                return;
            }
            resetStorage();
            var promise = $self.$hub.buildStorageGetStorageResources(targetOwndId);
            promise.then(function (answer) {
                setStorageTargetResources(answer, targetOwndId, advancedAction);
                GameServices.timerHelper.timeDelay.UpdateTimer(timerName, Utils.Time.ONE_MINUTE);
            }, function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                throw Errors.ClientNotImplementedException({
                    errorAnswer: errorAnswer,
                    msg: msg
                }, "industrialComplexService.requestTargetStorableItems");
            }); 
 
        }

        /**
         * Надстройка над модулем select2  и настройка параметров и событий для  всплвающего меню селекта для выбора планеты цели куда в дальнейшем необходимо передать ресурсы
         * @param {object} transferScope  скоуп в котором находится директива селекта
         * @param {object} element jQuery DOM element
         * @returns {void} 
         */
        function registerStorageTransferListEvents(transferScope, element) {
            var targetList = [
                {
                    OwnId: null,
                    Name: "Выбрать цель",
                    TextureTypeId: null
                }
            ];
            var curList = GameServices.estateService.getEstateListData();
            _.forEach(curList, function (listItem, key) {
                var ce = EM.EstateData.GetCurrentEstate();
                // console.log("industrialComplexService.registerStorageTransferListEvents", ce);
                if (listItem.OwnId !== ce.EstateId) {    
                    targetList.push({
                        OwnId: listItem.OwnId,
                        Name: listItem.Name,
                        TextureTypeId: listItem.TextureTypeId
                    });
                }
            });
            transferScope.targetTransferList = targetList;

            element.change(function (event) {
                var ownId = element.find(":selected")[0].value;
                if (ownId === "") showStorageTargetList = false;
                else {
                    ownId = +ownId;
                    requestTargetStorableItems(ownId, function () {
                        showStorageTargetList = true;
                    });

                }
            });

            //http://vanzzo.net/html-css/select2-jquery.html
            // containerCssClass  — добавит класс к контейнеру на который вы будете нажимать чтобы вызвать список.
            // dropdownCssClass — добавит класс к контейнеру который будет выпадать.
            // containerCss и dropdownCss  стили на прямую
            element.select2({
                //placeholder: 'Select an option',
                templateResult: function (optItemData) {
                    var itemHtml = $("<div/>", {
                        text: optItemData.text
                    });
                    var data = function () {
                        var elemData = _.find(targetList, function (o) {
                            return o.Name = optItemData.text;
                        });
                        //console.log("optItemData", optItemData);
                        if (elemData) {
                            //$(optItemData.element).data(kl.TextureTypeId);
                            var imgType = elemData.TextureTypeId;
                            if ($.isNumeric(imgType)) {
                                //return RepoTexturesAndImgList.GetIconSelectCss(imgType);
                                return "sprite_control_icons m map-object jumptomother";
                            }
                            return null;
                        }


                    };

                    var imgContainer = $("<span/>", {
                        "class": "main_directior_css_class " + data()
                    });
                    return itemHtml.prepend(imgContainer);
                },
                minimumInputLength: 0,
                //allowClear: true,
                containerCssClass: "select2-container-transfer",
                dropdownCssClass: "select2-dropdown-container-transfer"
            });
            //console.log("transferListScope", {
            //    element: element,
            //    scope: transferScope,
            //    "element.select2": element.select2
            //});
            return targetList;
        }

        /**
         * надстрйока над модулем  jQuery  slider  для создания элементов  range control и взаимодействия с ангуляр скоупом
         * @param {object} element jQuery DOM element
         * @param {object} scope Angular $scope  директивы biuldSlider в данноми экземплярe StorableItem 
         * @returns {void} 
         */
        function registerStorageSlider(element, scope) {
            var losses = getStorageTransferLoses();
            var data = scope.sliderData;
            var cloneData = _.cloneDeep(data);

            var slider = createEmptySlider();
            var value;
            var sourceKey = "source";
            var targetKey = "target";

            function calc(item, val, isTarget) {
                if (isTarget) {
                    var source = cloneData.source.current;
                    if (source - val < 0) val = source;
                    var t = cloneData[targetKey].current + (val * losses);

                    if (t > item.max) {
                        var delta = t - item.max;
                        item.current = item.max;
                        if (delta === 0) return val;
                        var fixedVal = val - toInt(delta / losses);
                        item.persent = calcResPercent(t, item.max);
                        return fixedVal;
                    }
                    item.current = toInt(t);
                    item.persent = calcResPercent(t, item.max);
                    return val;
                } else {
                    item.current = cloneData[sourceKey].current - val;
                    item.persent = calcResPercent(item.current, item.max);
                }


            }

            function slide(event, ui) {
                console.log("stopSlide");
                value = null;
                value = +ui.value;
                mainHelper.applyTimeout(function () {
                    var fixedVal = calc(data.target, value, true);
                    calc(data.source, fixedVal, false);
                    data.toTransfer = fixedVal;
                });

            }

            function stopSlide(event, ui) {
                console.log("stopSlide");
                value = null;
                value = +ui.value;
                var fixedVal = calc(data.target, value, true);

                if (fixedVal !== value) {
                    calc(data.source, fixedVal, false);
                    data.toTransfer = fixedVal;
                    element.slider("value", fixedVal);
                }
                data.toTransfer = fixedVal;
                //console.log("registerStorageSlider element", {
                //    storageStorableContainer: storageStorableContainer
                //});
            }

            slider.slide = slide;
            slider.stop = stopSlide;
            slider.max = cloneData.source.current;
            slider.change = function (e, ui) {
                slide(e, ui);
            };
            element.slider(slider);

        }

        resetStorage = function () {
            showStorageTargetList = false;
            createStorageStorableContainer();
            var scope = getIcCtrlScope();
            if (scope) scope.buildCtrl.storageStorableContainer = storageStorableContainer;
        };

        //#region Sibmit


        function submitStorageAction() {
            if (_submitStorageActionInProgress) return;
            //console.log("submitStorageAction", storageStorableContainer);
            var resources = Utils.ModelFactory.MaterialResources();

            var storableItems = storageStorableContainer.storableItems;

            var sumaryRes = 0;
            _.forEach(storableItems, function (storableItem, key) {
                var toTransfer = storableItem.toTransfer;
                resources[storableItem.NativeName] = toTransfer;
                sumaryRes += toTransfer;
            });

            if (sumaryRes < 3) {
                sumaryRes = 0;
                return;
            }

            function getType(id) {
                return (id === 0) ? false : true;
            }

            var data = {
                Resources: resources,
                SourceId: storageStorableContainer.SourceId,
                SourceType: storageStorableContainer.SourceType,
                TargetId: storageStorableContainer.TargetId,
                TargetType: getType(storageStorableContainer.TargetId)
            };
            // console.log("submitStorageAction", data);

            function onFinally() {
                _submitStorageActionInProgress = false;
            }


            var errorData = {
                retquestData: data
            }

            function onError(errorAnswer, isLocl) {
                onFinally();
                if (!isLocl) {
                    var msg = Errors.GetHubMessage(errorAnswer);
                    errorData.msg = msg;
                    errorData.errorAnswer = errorAnswer;
                    errorData.isLocl = isLocl;
                }
                resetStorage();
                throw Errors.ClientNotImplementedException(errorData, "submitStorageAction.DoTransfer");
            }

            _submitStorageActionInProgress = true;
 


              var promise = $self.$hub.buildStorageDoTransfer(data);
            promise.then(function (answerOk) {
                if (answerOk) {
                    var ce = EM.EstateData.GetCurrentEstate();
                    if (data.SourceId === ce.EstateId) {
                        GameServices.estateService.getFullEstate(data.SourceId, onFinally);
                    }
                    else {
                        errorData.CurrentEstate = ce;
                        throw onError("submitStorageAction own is changed", true);
                    }
                }
                else throw onError("Not transfered", true);

            }, onError);


        }

        //#endregion

        this.getStorageTargetShowStatus = getStorageTargetShowStatus;
        this.requestTargetStorableItems = requestTargetStorableItems;
        this.createStorageStorableContainer = createStorageStorableContainer;
        this.registerStorageTransferListEvents = registerStorageTransferListEvents;
        this.registerStorageSlider = registerStorageSlider;


        //#endregion

        //#region Extraction Action View


        function getExtractionPower() {
            return getExtractionModuleData().Power;
        }

        function getExtractionPowerData() {
            return getTranslate().productionPower + " : " + getExtractionPower();
        }

        var extractionContainer;
        var submitExtractionActionInProgress = false;

        function getExtractionContainer() {
            extractionContainer = {};

            var translate = getTranslate();
            var epd = getExtractionModuleData();
            var resourcesPerHour = epd.ExtractionPerHour;
            var persents = epd.Percent;

            var productionItems = [];

            function resProductionItem(name, curPercent, eph) {
                var translateName = translate[resourceTranslateKeys[name]];
                var obj = baseResourceItem(name, translateName);
                obj.currentPercent = curPercent || 0;
                obj.targetPersent = 0;
                obj.extractionPerHour = eph || 0;
                obj.freePercent = 0;
                obj.power = epd.Power;
                return obj;
            }

            _.forEach(persents, function (curPercentVal, prop) {
                var curEph = toInt(resourcesPerHour[prop]);
                var item = resProductionItem(prop, curPercentVal, curEph);
                productionItems.push(item);
            });

            var ce = EM.EstateData.GetCurrentEstate();
            //  console.log("industrialComplexService.getExtractionContainer", ce);
            extractionContainer.productionItems = productionItems;
            extractionContainer.OwnId = ce.EstateId;

            return extractionContainer;

        }

        var undoExtractionContainer;

        function registerExtractionSlider(element, scope) {
            var data = scope.sliderData;
            undoExtractionContainer = _.cloneDeep(extractionContainer);
            var reources = extractionContainer.productionItems;


            var resName = data.NativeName;
            var baseResProportion = baseResourceProportion[resName];
            var power = data.power;

            function getFreePercent() {
                var p = 100;
                _.forEach(reources, function (resource, key) {
                    p -= resource.currentPercent;
                });
                //console.log("getFreePercent", p);
                return p;
            }

            function convertPercentToResValue(percent) {
                var part = percent / 100;
                return part * (power / baseResProportion);
            }

            var slider = createEmptySlider();

            function setFreePercent(freePercent) {
                _.forEach(reources, function (value, key) {
                    reources[key].freePercent = freePercent;
                });
            }

            function setSlider(val) {
                data.currentPercent = val;
                data.extractionPerHour = toInt(convertPercentToResValue(val));
                setFreePercent(getFreePercent());
            }

            var multiple = 100;

            function slide(event, ui) {
                //console.log("slide");
                var result = true;
                var value = +ui.value;
                var scale = value / multiple;
                mainHelper.applyTimeout(function () {
                    if (data.freePercent > 0) {
                        if (data.currentPercent + data.freePercent >= scale) {
                            setSlider(scale);
                        } else {
                            setSlider(data.currentPercent + data.freePercent);
                        }
                        return result;
                    } else if (data.currentPercent > scale) {
                        setSlider(scale);
                    } else {
                        result = false;
                    }


                });
                return result;


            }

            function stopSlide(event, ui) {
                if (data.freePercent <= 0) {
                    element.slider(
                    {
                        value: data.currentPercent * multiple
                    });
                }
            }

            slider.slide = slide;
            slider.stop = stopSlide;
            slider.max = 100 * multiple;
            slider.value = data.currentPercent * multiple;
            element.slider(slider);
        }

        function resetExtraction(fromBtn) {
            if (fromBtn) {
                var scope = getIcCtrlScope();
                if (scope) {
                }
            }
            getExtractionContainer();
            //var sliderPrefix = "extraction-slider-";

        }

        //#region Sibmit
        function submitExtractionAction() {
            if (submitExtractionActionInProgress) return;
            submitExtractionActionInProgress = true;

            var proportion = Utils.ModelFactory.MaterialResources();

            var productionItems = extractionContainer.productionItems;

            _.forEach(productionItems, function (productionItem, key) {
                proportion[productionItem.NativeName] = productionItem.currentPercent;
            });

            var fullPersent = 100;
            var sum = proportion.E + proportion.Ir + proportion.Dm;
            var k = sum / fullPersent;
            proportion.E = proportion.E / k;
            proportion.Ir = proportion.Ir / k;
            proportion.Dm = proportion.Dm / k;

            var data = {
                OwnId: extractionContainer.OwnId,
                Proportion: proportion
            }

            var errorData = {
                retquestData: data
            }

            function onFinally() {
                submitExtractionActionInProgress = false;
            }

            function onError(errorAnswer, isLocl) {
                onFinally();
                if (!isLocl) {
                    var msg = Errors.GetHubMessage(errorAnswer);
                    errorData.msg = msg;
                    errorData.errorAnswer = errorAnswer;
                    errorData.isLocl = isLocl;
                }
                resetExtraction();
                throw Errors.ClientNotImplementedException(errorData, "submitExtractionAction");
            }

            var promise = $self.$hub.buildExtractionModuleChangeProportion(data);
            promise.then(function (answerOk) {
                if (answerOk) {
                    var ce = EM.EstateData.GetCurrentEstate();
                    if (data.OwnId === ce.EstateId) {
                        GameServices.estateService.getFullEstate(data.OwnId, onFinally);
                    }
                    else {
                        errorData.CurrentEstate = ce;
                        throw onError("submitExtractionAction own is changed", true);
                    }

                }
                else throw onError("Proportion not changed", true);

            }, onError);

        }

        //#endregion

        this.getExtractionPowerData = getExtractionPowerData;
        this.getExtractionContainer = getExtractionContainer;
        this.registerExtractionSlider = registerExtractionSlider;


        //#endregion

        //#region EnergyConverter Action View

        //#region Data Acces
        function getExchangeCource() {
            return getEnergyConverterData().ConvertLoses;
        }

        function getExchangeCourceData() {
            return getTranslate().exchangeCourse + " : " + getExchangeCource();
        }

        function upgradeEcStorageFromPlanshet() {
            getEnergyConverterData().StorageResources = _.cloneDeep(getStorageData().StorageResources);
        }

        this.getExchangeCourceData = getExchangeCourceData;
        //#endregion

        //#region animate view update

        //base;
        var convertableKeyResults = {
            notChanged: 1,
            isSource: 2,
            isTarget: 4
        };

        function ecSliderData() {
            return {
                maximum: 0,
                rate: null,
                sourceHtmlName: "",
                targetHtmlName: "",
                toTransfer: {}
            };
        }

        var resetEnergyConverter;
        var energyConverterContainer;
        var upgradeResourceConnection;
        var updateExchangeInputModel;
        var resetEnergyConverterSlider;
        var _submitEcActionInProgress = false;

        function getEnergyConverterContainer() {
            energyConverterContainer = {};

            var translate = getTranslate();

            function getBaseItem(name) {
                var translateName = translate[resourceTranslateKeys[name]];
                var obj = baseResourceItem(name, translateName);
                obj.source = resourceItem(obj.htmlName);
                obj.target = resourceItem(obj.htmlName);
                return obj;
            }

            var storageResource = getEnergyConverterData().StorageResources;
            var cur = storageResource.Current;
            var max = storageResource.Max;

            function setItem(item, nativeName) {
                item.current = toInt(cur[nativeName]);
                item.max = max[nativeName];
                item.persent = calcResPercent(cur[nativeName], item.max);

            }

            var convertableItems = [];

            _.forEach(cur, function (value, resName) {
                var convertableItem = getBaseItem(resName);
                setItem(convertableItem.source, resName);
                setItem(convertableItem.target, resName);
                convertableItem.upgradeConnecton = upgradeResourceConnection;
                convertableItems.push(convertableItem);
            });


            energyConverterContainer.activeConnectionData = ecSliderData();
            energyConverterContainer.convertableItems = convertableItems;
            energyConverterContainer.findItemByName = function (name) {
                name = name.toLowerCase();
                return _.find(energyConverterContainer.convertableItems, function (o) {
                    return o.htmlName === name;
                });
            };
            energyConverterContainer.getItemByType = function (name, isTarget) {
                var key = isTarget ? "target" : "source";
                return energyConverterContainer.findItemByName(name)[key];
            }
            energyConverterContainer.getStorageResources = function () {
                return _.cloneDeep(getEnergyConverterData().StorageResources);
            }
            energyConverterContainer.upgradeConvertableItems = function () {
                function updateData(item) {
                    var name = item.NativeName;
                    var sr = energyConverterContainer.getStorageResources();
                    var current = sr.Current[name];
                    var itemMax = sr.Max[name];
                    item.source.current = toInt(current);
                    item.source.max = itemMax;
                    item.source.persent = calcResPercent(item.source.current, item.source.max);

                    item.target.current = toInt(current);
                    item.target.max = itemMax;
                    item.target.persent = calcResPercent(item.target.current, item.target.max);
                }

                var items = energyConverterContainer.convertableItems;
                _.forEach(items, function (item, key) {
                    updateData(item);
                });

            }
            energyConverterContainer.getRate = function () {
                return energyConverterContainer.activeConnectionData.rate;
            };
            energyConverterContainer.updateRate = function (srcName, targetName) {
                energyConverterContainer.activeConnectionData.rate = calcBaseResourceProportionByNativeName(srcName, targetName, getExchangeCource());
            };
            return energyConverterContainer;
        }

        var eConverterSliderRegistred = false;

        function registerEnergyConverterSlider(element) {
            eConverterSliderRegistred = true;
            var slider = createEmptySlider();
            slider.slide = function (event, ui) {
                var value = +ui.value;
                updateExchangeInputModel(true, value);
            };
            slider.max = 0;
            element.slider(slider);
            //console.log("registerEnergyConverterSlider", element);
        }


        resetEnergyConverterSlider = function () {
            registerEnergyConverterSlider($("#energy-converter-slider"));
        }

        function updateEnergyConverterSlider(max, value) {
            var element = $("#energy-converter-slider");
            element.slider("option", "max", max);
            element.slider("option", "value", value);
        }

        function updateValueEnergyConverterSlider(newValue) {
            $("#energy-converter-slider").slider("option", "value", newValue);
        }

        updateExchangeInputModel = function (notUpdateSlider, value) {
            var scope = getIcCtrlScope().buildCtrl;
            if (typeof scope.exchangeInputModel !== "number") scope.exchangeInputModel = 0;
            var inputModel = scope.exchangeInputModel;
            var activeConnectionData = energyConverterContainer.activeConnectionData;
            var maximum = activeConnectionData.maximum;
            if (typeof value === "number") inputModel = value;


            function findItem(resName) {
                return _.find(energyConverterContainer.convertableItems, function (o) { return (o.htmlName === resName) });
            }

            var resources = _.cloneDeep(getStorageData().StorageResources);

            function upgradeItem(item, isTarget, rate, newCount) {
                var operator = isTarget ? 1 : -1;
                var key = isTarget ? "target" : "source";
                var nativeName = item.NativeName;
                var count = resources.Current[nativeName] + (newCount * operator * rate);
                var intCount = toInt(count);
                item[key].current = intCount;
                item[key].persent = calcResPercent(count, resources.Max[nativeName]);
            }

            var sourceConvertable = findItem(activeConnectionData.sourceHtmlName);
            var targetConvertable = findItem(activeConnectionData.targetHtmlName);
            if (!targetConvertable) {
                scope.exchangeInputModel = 0;
                return;
            }
            mainHelper.applyTimeout(function () {
                scope.exchangeInputModel = (inputModel > maximum) ? maximum || 0 : inputModel;
                upgradeItem(sourceConvertable, false, 1, scope.exchangeInputModel);
                upgradeItem(targetConvertable, true, activeConnectionData.rate, scope.exchangeInputModel);

                activeConnectionData.toTransfer = inputModel;
                if (!notUpdateSlider) updateValueEnergyConverterSlider(inputModel);
            });


        }


        function svgAnimation(convertableItem, isSource, delay) {
            var resNativeName = convertableItem.NativeName;
            var resHtmlName = convertableItem.htmlName;
            var sourceKey = isSource ? "source" : "target";
            var pathId = sourceKey + "-path-res";
            var gradientId = sourceKey + "-connection-gradient";

            var linearGradientElement = $("#" + gradientId);
            var pathElement = $("#" + pathId);

            var centrItemElement = $("#exchange-connection-value-conteiner");

            var parentSelectorContainer = ".exchange-connection-container";
            var selectiorConnectionItem = "exchange-connection-item";
            var activeElement = pathElement.parents("." + selectiorConnectionItem);

            var resColors = Utils.ModelFactory.MaterialResources();
            resColors.E = "#30c4c8";
            resColors.Ir = "#98cfd6";
            resColors.Dm = "#9365c4";


            function gradientColor(startColor, endColor) {
                return {
                    startColor: startColor,
                    endColor: endColor
                };
            }

            function getGradientColor() {
                if (isSource) {
                    return gradientColor(resColors[resNativeName], resColors.E);
                }
                return gradientColor(resColors.E, resColors[resNativeName]);
            }

            function setGradientColor() {
                var colors = getGradientColor();
                var stopsColor = linearGradientElement.find("stop");
                var startGradient = $(stopsColor[0]);
                var end = $(stopsColor[2]);
                startGradient.attr("stop-color", colors.startColor);
                end.attr("stop-color", colors.endColor);
            }


            var pathPoints;

            function getResPath() {
                if (!pathPoints) {
                    var createPath = function (source) {
                        var model = Utils.ModelFactory.MaterialResources();
                        if (source) {
                            model.E = "M0,17 C96,17 0,96 93,96";
                            model.Ir = "m0,96 96,1";
                            model.Dm = "M0,174 C93,174 0,96 93,96";
                            return model;
                        }
                        model.E = "M0,96 C93,96 0,17 93,17";
                        model.Ir = "m0,96 93,1";
                        model.Dm = "M0,96 C93,96 0,174 93,174";
                        return model;
                    };

                    pathPoints = {};
                    pathPoints.source = createPath(true);
                    pathPoints.target = createPath(false);
                }
                return isSource ? pathPoints.source : pathPoints.target;
            }

            function setPath() {
                var resPath = getResPath()[resNativeName];
                pathElement.attr("class", "connection-item " + resHtmlName);
                pathElement.attr("d", resPath);
            }


            function setConfig() {
                activeElement.attr("class", selectiorConnectionItem + " active " + resHtmlName);
                setGradientColor();
                setPath();
            }

            function activateConnection(hide) {
                var container = $(parentSelectorContainer);
                var active = hk.CssActive;
                var items = container.find("." + active);
                var hasActive = items && items.length > 0;
                var input = centrItemElement.find("input");

                function updateInput(activate) {
                    if (activate) {
                        input.removeAttr("readonly");
                    } else {
                        input.attr("readonly", "readonly");
                    }
                }

                function activateCentr(activate) {
                    activate ? centrItemElement.addClass(active) : centrItemElement.removeClass(active);
                }


                function clean(jqObj) {
                    jqObj.attr("class", selectiorConnectionItem);
                }

                function hideAll() {
                    items.each(function (idx) {
                        clean($(this));
                    });
                }

                if (hide) {
                    hideAll();
                    activateCentr(false);
                    return null;
                }

                if (!hasActive) {
                    activateCentr(true);
                    setConfig();
                    return convertableKeyResults.isSource;
                }
                if (activeElement.hasClass(resHtmlName)) return convertableKeyResults.notChanged;


                if (isSource) {
                    activateCentr(false);
                    updateInput(false);
                    hideAll();
                    setTimeout(function () {
                        activateCentr(true);
                        setConfig();
                    }, delay);
                    //console.log("isSource");
                    return convertableKeyResults.isSource;
                } else if ($(items[0]).hasClass(resHtmlName)) return convertableKeyResults.notChanged;
                else {
                    clean(activeElement);
                    setTimeout(function () {
                        updateInput(true);
                        setConfig();
                    }, delay);
                    return convertableKeyResults.isTarget;
                }


            }

            return activateConnection;

        }

        upgradeResourceConnection = function (convertableItem, isSource, hide) {
            _submitEcActionInProgress = true;
            var delay = 300;

            var animConfig = svgAnimation(convertableItem, isSource, delay);
            var upgradeType = animConfig(hide);
            if (hide) return;

            var activeData = energyConverterContainer.activeConnectionData;

            if (upgradeType === convertableKeyResults.notChanged) return;
            else if (upgradeType === convertableKeyResults.isSource) {
                energyConverterContainer.upgradeConvertableItems();

                activeData.sourceHtmlName = convertableItem.htmlName;
                activeData.maximum = 0;
                updateEnergyConverterSlider(0, 0);
                updateExchangeInputModel(true, 0);
                return;
            } else if (upgradeType === convertableKeyResults.isTarget) {
                if (convertableItem.htmlName === activeData.sourceHtmlName) {
                    if (SHOW_DEBUG) {
                        Utils.Console.Error("последовательность не верна", {
                            convertableItem: convertableItem,
                            isSource: isSource,
                            upgradeType: upgradeType,
                            convertableKeyResults: convertableKeyResults,
                            energyConverterContainer: energyConverterContainer,
                            activeData: activeData
                        });
                    }
                    return;
                }
                var sr = energyConverterContainer.getStorageResources();

                activeData.targetHtmlName = convertableItem.htmlName;
                var sourceItem = energyConverterContainer.findItemByName(activeData.sourceHtmlName);
                energyConverterContainer.updateRate(sourceItem.NativeName, convertableItem.NativeName);
                var sourceCount = sr.Current[sourceItem.NativeName];
                var targetCount = sr.Current[convertableItem.NativeName];

                convertableItem.target.max = sr.Max[convertableItem.NativeName];
                convertableItem.target.current = toInt(targetCount);
                var freeTarget = convertableItem.target.max - convertableItem.target.current;
                var maximum = freeTarget / energyConverterContainer.getRate();
                if (sourceCount <= maximum) {
                    maximum = sourceCount;
                }
                activeData.maximum = toInt(maximum);
                updateEnergyConverterSlider(activeData.maximum, 0);
                _submitEcActionInProgress = false;
            }
        }

        resetEnergyConverter = function () {
            _submitEcActionInProgress = false;
            upgradeEcStorageFromPlanshet();
            energyConverterContainer = {};
            getEnergyConverterContainer();
            if (eConverterSliderRegistred) {
                //resetEnergyConverterSlider();
                upgradeResourceConnection(energyConverterContainer.findItemByName("e"), true, true);
            }

        }
        this.getEnergyConverterContainer = getEnergyConverterContainer;
        this.updateExchangeInputModel = updateExchangeInputModel;
        this.registerEnergyConverterSlider = registerEnergyConverterSlider;

        //#endregion


        //#region Sibmit

        function submitEcAction(btnParams, element, attrs, $scope) {
            if (!energyConverterContainer) return;
            var actionData = energyConverterContainer.activeConnectionData;
            if (actionData && actionData.toTransfer > 0 && !_submitEcActionInProgress) {
                var sr = energyConverterContainer.getStorageResources();
                var targetItem = energyConverterContainer.findItemByName(actionData.targetHtmlName);
                if (targetItem.target.current - sr.Current[targetItem.NativeName] < 1) return;

                var sourceItem = energyConverterContainer.findItemByName(actionData.sourceHtmlName);
                if (sourceItem.source.current < 0) return;
                _submitEcActionInProgress = true;
                var ce = EM.EstateData.GetCurrentEstate();
                //   console.log("industrialComplexService.submitEcAction", ce);
                var data = {
                    OwnId: ce.EstateId,
                    From: sourceItem.NativeName,
                    To: targetItem.NativeName,
                    ToConvert: actionData.toTransfer
                }

                var errorData = {
                    btnParams: btnParams,
                    $scope: $scope,
                    sr: sr,
                    targetItem: targetItem,
                    data: data
                };
                function onFinally() {
                    _submitEcActionInProgress = true;
                }
                function onError(errorAnswer, isLocl) {
                    if (!isLocl) {
                        var msg = Errors.GetHubMessage(errorAnswer);
                        errorData.msg = msg;
                        errorData.errorAnswer = errorAnswer;
                        errorData.isLocl = isLocl;
                    }

                    onFinally();
                    throw Errors.ClientNotImplementedException(errorData, "submitEcAction");
                }

                var promise = $self.$hub.buildEnergyConverterExchangeResource(data);

                promise.then(function (answerOk) {
                    if (answerOk) {
                        var ce = EM.EstateData.GetCurrentEstate();
                        if (data.OwnId === ce.EstateId) {
                            GameServices.estateService.getFullEstate(data.OwnId, onFinally);
                        }
                        else {
                            errorData.CurrentEstate = ce;
                            throw onError("submitEcAction own is changed", true);
                        }
                    }
                    else throw onError("submitEcAction.not updated", true);
                }, onError);
            }


        }

        //#endregion

        //#endregion


        //#endregion

        //#region Require
        function getPlanshetModel() {
            return planshetService.getItemById(industrialComplexUniqueId);
        }

        function upgradeModel() {
            //console.log("upgradeModel");
            industrialComplex = getPlanshetModel();
            //console.log("upgradeModel", getStorageData().StorageResources.Current.E);
            resetStorage();
            resetExtraction();
            resetEnergyConverter();
            var scope = getIcCtrlScope();
            if (scope) {
                //scope.buildCtrl.storageStorableContainer = createStorageStorableContainer();
                scope.buildCtrl.extractionContainer = extractionContainer;
                scope.buildCtrl.energyConverterContainer = energyConverterContainer;
            }
            if (planshetService.isCurrentModel(industrialComplexUniqueId)) {
                planshetService.updatePlanshet(null, industrialComplexUniqueId);
            }


        }

        function actionSubmit(params, element, attrs, $scope) {
            if (params.NativeName === buildNames.Storage) {
                submitStorageAction(params, element, attrs, $scope);
            }
            else if (params.NativeName === buildNames.ExtractionModule) {
                submitExtractionAction(params, element, attrs, $scope);
            }
            else if (params.NativeName === buildNames.EnergyConverter) {
                submitEcAction(params, element, attrs, $scope);
            }
        }

        function getBuildCollection() {
            return industrialComplex.Bodys[0].TemplateData;
        }

        function getBuildByName(name) {
            return _.find(getBuildCollection(), function (o) {
                return (o.NativeName === name);
            });
        }

        function getStorage() {
            return getBuildByName(icIds.storage);
        }
        getStorageAction = function () {
            return getStorage().Action;
        }

        getStorageData = function () {
            return getStorageAction().Data;
        };

        getExtractionModule = function () {
            return getBuildByName(icIds.extractionModule);
        };

        getExtractionModuleData = function () {
            return getExtractionModule().Action.Data;
        };

        function getEnergyConverter() {
            return getBuildByName(icIds.energyConverter);

        }

        getEnergyConverterData = function () {
            return getEnergyConverter().Action.Data;

        };

        function updateBuildProgress(nativeName, newProgress) {
            if (nativeName === buildNames.Storage) {
                getStorage().Progress = newProgress;
            }
            else if (nativeName === buildNames.ExtractionModule) {
                getExtractionModule().Progress = newProgress;
            }
            else if (nativeName === buildNames.EnergyConverter) {
                getEnergyConverter().Progress = newProgress;
            }
        }


        this.getUniqueId = function () {
            return industrialComplexUniqueId;
        };
        this.upgradeModel = upgradeModel;
        this.getStorage = getStorage;
        this.getStorageData = getStorageData;
        this.getExtractionModuleData = getExtractionModuleData;
        this.actionSubmit = actionSubmit;
        this.updateBuildProgress = updateBuildProgress;
        this.btnStorageSendAllResources = btnStorageSendAllResources;
        //#endregion
    }
]);


