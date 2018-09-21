Utils.CoreApp.gameApp.service("estateService", ["hangarService", "mapControlHelper",
    function (hangarService, mapControlHelper) {
        "use strict";
        var $self = this;
        //#region Declare   
        var rawData;
        var estateElement;
        var doChange = true;

        //#endregion

        //#region reqHelpers
 
 

        Object.defineProperty($self, "$hub", {
            get: function () {
                return GameServices.mainGameHubService;
            }  
        });

        function isCorrectEstateId(id) {
            var ce = EM.EstateData.GetCurrentEstate();
            // console.log("estateService.isCorrectEstateId", ce);
            if (Number.isInteger(id) && (id === ce.EstateId)) return true;
            if (SHOW_DEBUG) {
                Utils.Console.Error("CurrentEstate is wrong", {
                    GetCurrentEstate: ce,
                    id: id
                });
            }
            return false;
        }

        //#endregion

        //#region Members

        //#region select
        function orderByOwnId() {
            rawData = _.orderBy(rawData, ["OwnId"], ["ask"]);
        }

        function applyChange() {
            var scope = angular.element(estateElement).scope();
            scope.$apply(function () {
                scope.estateList = rawData;
            });
        }


        function setEstateListData(data, isInit) {
            rawData = data;
            if (!isInit) applyChange();

        }

        function getEstateListData() {
            return rawData;
        }

        function getEstateItem(ownId) {
            return _.find(rawData, function (o) {
                return o.OwnId === +ownId;
            });
        }

        function deleteEstateItem(palnetId) {
            _.remove(rawData, function (o) { return o.OwnId === palnetId; });
            orderByOwnId();
            applyChange();
        }

        function addEstateItem(newItem) {
            rawData = _.unionBy(rawData, newItem, "OwnId");
            orderByOwnId();
            applyChange();
        }

        function setEstate(ownId, isInit) {

            doChange = false;
            estateElement.val(ownId).trigger("change", [ownId, isInit]);
        }

        function updateServerEstateList(setAsNewItem) {
            var promise = $self.$hub.estateGetEstateList();
            promise.then(function (answer) {
                setEstateListData(answer);
                if (setAsNewItem) {
                    //todo  не понятно что это все такое
                    var newItemCss = Utils.RepoKeys.HtmlKeys.CssNewItem;
                    var elem = angular.element("#own-list-container");
                    var count = 7;
                    var show = true;

                    function toggleCss() {
                        show ? elem.addClass(newItemCss) : elem.removeClass(newItemCss);
                    };

                    var hasClick;
                    toggleCss();
                    var t = setInterval(function () {
                        count--;
                        show = !show;
                        if (count <= 0 || hasClick) {
                            show = false;
                            toggleCss();
                            clearInterval(t);
                        }
                        toggleCss();

                    }, 1500);

                    elem.addClass(newItemCss);
                }
            }, function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                throw Errors.ClientNotImplementedException({
                    errorAnswer: errorAnswer,
                    msg: msg
                }, "estateService.updateServerEstateList");
            });
            return promise;
        }

        function getServerEstateItem(planetId) {
            var promise = $self.$hub.estateGetEstateItemByPlanetId(planetId);
            promise.then(addEstateItem, function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                throw Errors.ClientNotImplementedException({
                    errorAnswer: errorAnswer,
                    msg: msg
                }, "estateService.getServerEstateItem");
            });
            return promise;
        }


        var _onRegistred;
        function init(data, onRegistred) {
            //   console.log("estateService.init");
            setEstateListData(data, true);
            EM.EstateData.SaveCurrentEstateByEsateType(false, 0);
            _onRegistred = onRegistred;
        }


        function registerEvents(element) {
            // console.log("registerEvents");
            //#region Declare
            estateElement = element;
            var ae = "aria-expanded";
            var selectParent = element.parent();
            function setAriaExp(param) {
                return selectParent.attr(ae, param);
            }
            //#endregion

            //#region Register
            element.change(function (event, ownId, isInit) {
                if (!doChange) {
                    doChange = true;
                    return;
                }

                ownId = ownId || estateElement.find(":selected")[0].value;

                element.scope().gameCtrl._$broadcastEstateId(ownId);
                var elemData = getEstateItem(ownId);
                if (elemData.Type) {
                    mapControlHelper.jumpToUserPlanet(elemData);

                } else {
                    //    console.log("estateService.registerEvents.element.change");
                    mapControlHelper.jumpToMother(elemData);

                }
                setAriaExp(false);
            });
            element.select2({
                templateResult: function (optItemData) {
                    var itemHtml = $("<div/>", {
                        text: optItemData.text,
                        "class": "select2-estate-item-container"
                    });
                    var data = function () {
                        var elemData = getEstateItem(optItemData.id);

                        if (elemData) {
                            //$(optItemData.element).data(kl.TextureTypeId);
                            var imgType = elemData.TextureTypeId;
                            if ($.isNumeric(imgType)) {

                                var css = EM.AssetRepository.GetIconSelectCss(imgType);
                                //   console.log("templateResult", css);
                                return css;

                            }
                            return null;
                        }


                    };
                    var imgContainer = $("<span/>", {
                        "class": "select2-sprite " + data()
                    });
                    return itemHtml.prepend(imgContainer);
                },
                dropdownCssClass: "select2-dropdown-container-estate-resource"
            });


            if (!Utils.Event.HasClick(selectParent)) {
                selectParent.bind("click", function () {
                    var state = Utils.ConvertToBool(selectParent.attr(ae));
                    if (!state) {
                        element.select2("open");
                        setAriaExp(true);

                    } else {
                        element.select2("close");
                        setAriaExp(false);
                    }

                });
            }
            //#endregion

            //#region Apply
            setAriaExp(false);
            //element.on("select2:select", function() {
            //    setAriaExp(false);
            //});
            // EM.EstateData.SaveMotherLocationFromData(getEstateItem(0));

            var self = this;
            if (_onRegistred instanceof Function) {
                _onRegistred();
                _onRegistred = null;
                delete self.registerEvents;
                registerEvents = null;
                init = null;
            }



            //#endregion
        };

        //#region select

        //#region EstateScene
        var updateSinchronizer = null;

        var hasFirstRequest = false;
        function getFullEstate(ownId, onFinally, isInit) {
            if (!(typeof ownId === "number")) {
                throw Errors.ClientNotImplementedException({
                    onFinally: onFinally,
                    ownId: ownId,
                    message: "НЕ установлен ид истоничка для обновления"
                }, "estateService.getFullEstate");
            }
            var isMother = ownId === 0;
            if (!isCorrectEstateId(isMother ? 0 : EM.EstateData.GetPlanetLocation().PlanetId)) return;

            if (!hasFirstRequest) {
                hasFirstRequest = true;
                updateSinchronizer(true);
                if (onFinally instanceof Function) onFinally();
                return;
            }

            var promise = $self.$hub.estateGetFullEstate(ownId);
            promise.then(function (answer) {
                GameServices.buildReqHelper.addBuildsToPlanshet(answer, isMother);
                updateSinchronizer(true);
                if (onFinally instanceof Function) onFinally();
            }, function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                throw Errors.ClientNotImplementedException({
                    errorAnswer: errorAnswer,
                    msg: msg
                }, "estateService.getFullEstate");
            });
            return promise;


        };

        updateSinchronizer = function (replaseSinchronizer) {
            var eid;
            var sucsess;
            // console.log("estateService.updateSinchronizer");
            function condition() {
                var ce = EM.EstateData.GetCurrentEstate();
                eid = ce.EstateId;
                //console.log("estateService.updateSinchronizer", {
                //    ce: ce,
                //    EstateId: ce.EstateId,
                //    condition: typeof eid === "number",
                //    conditionTypeof: typeof eid
                //});
                return (typeof eid === "number");
            };

            function accept() {
                GameServices.timerHelper.addSinchronizer("estate", function () {
                    getFullEstate(eid);
                }, Utils.Time.DELAY_SYNCHRONIZE, !!replaseSinchronizer);
                sucsess = true;
            }
            if (condition()) accept();
            else {
                var repeat = 100;
                var delay = 100;
                GameServices.planshetService.conditionAwaiter(condition, accept, delay, repeat);
                if (SHOW_DEBUG) {
                    setTimeout(function () {
                        if (!sucsess) Utils.Console.Error("CurrentEstate is Wrong");
                    }, (repeat * delay) + 1);
                }



            }

        }; //#endregion


        //#endregion
                                                                                  
        function loadGame(scope, data) {
            var self = this;
            scope.gameCtrl.setServerTime(data.serverTime);
            scope.gameCtrl.setTranslate(data.TranslationKey);
            GameServices.gameChestService.$rebuildChestData(data[GameServices.gameChestService.CHEST_KEY]);  
            init(data.EstateListDataKey, function () {
                delete self.loadGame;
            });
            scope.gameCtrl.setResources(data.ResourcesViewKey);
            scope.gameCtrl.setEstateBuilds(data.EstateViewKey);
            scope.gameCtrl.setCtrlData(data.BaseBtnsKey);
            scope.gameCtrl.setInitialAlliance(data["alliance-collection"]);
            scope.gameCtrl.setPersonalData(data.AvatarViewKey);
            scope.gameCtrl.setAllianceNames(data.AllianceNamesKey);
            scope.gameCtrl.setInitialUserChannelsModel(data);
            scope.gameCtrl.setInitialConfederationsModel(data);
            GameServices.journalService.setInitializeJournal(data);
            scope.gameCtrl.skagryLoaded = true;
        }

        //#region Public
        this.getEstateNames = function () {
            var names = [];
            _.forEach(rawData, function (estateItem, key) {
                if (estateItem.Name === "MotherShip") return;
                names.push(estateItem.Name);
            });
            return names;
        };
        this.setEstateListData = setEstateListData;
        this.registerEvents = registerEvents;
        this.getEstateListData = getEstateListData;
        this.getEstateItem = getEstateItem;

        this.deleteEstateItem = deleteEstateItem;
        this.addEstateItem = addEstateItem;
        this.setEstate = setEstate;

        this.getServerEstateItem = getServerEstateItem;
        this.updateServerEstateList = updateServerEstateList;
        this.getFullEstate = getFullEstate;
        this.updateSinchronizer = updateSinchronizer;

        this.isCorrectEstateId = isCorrectEstateId;
        this.loadGame = loadGame;
        //#endregion
    }
]);