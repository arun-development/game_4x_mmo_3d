Utils.CoreApp.gameApp.service("buildReqHelper", [
    "planshetService", "statisticHelper",
    function (planshetService, statisticHelper) {
        //#region reqHelpers

        var $self = this;
        var updatePlanshet = function (upgradeModel, afterSetPlanshet, uniqueId) {
            planshetService.setCurrentModel(uniqueId);
            upgradeModel();

            function afterSet() {
                if (afterSetPlanshet instanceof Function) {
                    afterSetPlanshet();
                }
            }

            planshetService.updatePlanshet(afterSet);
        };


        var buildHubActionNames = {
            GetMotherIndustrialComplex: "buildGetMotherIndustrialComplex",
            GetMotherLaboratory: "buildGetMotherLaboratory",
            GetMotherSpaceShipyard: "buildGetMotherSpaceShipyard",
            GetIndustrialComplex: "buildGetIndustrialComplex",
            GetCommandCenter: "buildGetCommandCenter",
            GetSpaceShipyard: "buildGetSpaceShipyard"
        };
        Object.defineProperty($self, "$hub", {
            get: function () {
                return GameServices.mainGameHubService;
            }
        });

        function getBuildAction(buildActionName) {
            return $self.$hub[buildActionName];
        }

        function getBuildItems(planshetModel) {
            //console.log("getBuildItems", {
            //    planshetModel: planshetModel,
            //    "planshetModel.Bodys[0]": planshetModel.Bodys[0],
            //    "planshetModel.Bodys[0].TemplateData": planshetModel.Bodys[0].TemplateData
            //});
            return planshetModel.Bodys[0].TemplateData;
        }


        function setBuildItemInfoStatModel(item) {
            var stats;
          //  console.log("setBuildItemInfoStatModel", item);
            var data = item.Info.Data;
            if (data && data.IsTech) {
                item.$isTech = true;
                GameServices.laboratoryService.setTechViewData(statisticHelper, item);
                return;
            }
            else {
                if (item.Info.infoStatsModel) return;
                if (data && data.IsUnitDetail) {
                    if (!data.UnitStats) return;
                    var us = data.UnitStats;
                    item.$isUnit = true;
                    if (item.Info.infoStatsModel) return;
                    stats = [
                        statisticHelper.createStatItemModel(us.HpName, us.Hp),
                        statisticHelper.createStatItemModel(us.AttackName, us.Attack)
                    ];
                }

                else {
                    item.$isBuild = true;
                    stats = [statisticHelper.createStatItemModel("build propKey", "prop Val")];
                }
            }
            var img = statisticHelper.createBgImage(item.Info.DropImage, item.TranslateName);
            item.Info.infoStatsModel = statisticHelper.createStatisticModel(stats, img);
        }



        function fixBuildItem(parentUniqueId, collection, isMother) {
            var unitTranslate = GameServices.translateService.getUnit();
            _.forEach(collection, function (item, key) {
                //var buildItemHtmlId = item.NativeName.toLowerCase();  
                if (!item.$guid) {
                    item.$guid = Utils.Guid.CreateGuid();
                    var buildItemHtmlId = item.$guid;
                    item.ComplexButtonView.Collection[1].buildItemId = buildItemHtmlId;
                    item.ComplexButtonView.Collection[2].buildItemId = buildItemHtmlId;
                }
                if (!item.unitTranslate) {
                    item.unitTranslate = unitTranslate;
                }
                item.$isMother = isMother;
                item.$compileItem = true;
                if (item.$isMother && item.NativeName) {
                    if (item.NativeName === "Battleship" || item.NativeName === "Drednout") {
                        item.$compileItem = false;
                    }
                }

                if (item.Info) setBuildItemInfoStatModel(item);
                if (item.Update) {
                    item.Update.Price.forCc = false;
                    item.Update.upgradeCount = 1;

                    if (item.Update.HasButtons && item.Update.Buttons.Submit) {
                        var updSubmit = item.Update.Buttons.Submit;
                        updSubmit.Method = GameServices.buildService.upgradeSubmit;
                        updSubmit.Params = item;
                        updSubmit.Params.parentUniqueId = parentUniqueId;
                    }

                }

                if (item.Action) {
                    item.Action.sendFormDisabled = true;
                    var btns = item.Action.Buttons;
                    if (btns.hasOwnProperty("Submit") && btns.Submit) {
                        if (!btns.Submit.Params || !(typeof btns.Submit.Params === "object")) btns.Submit.Params = {};
                        btns.Submit.Params.parentUniqueId = parentUniqueId;
                        btns.Submit.Params.NativeName = item.NativeName;

                        btns.Submit.Method = function (params, element, attrs, $scope) {
                            if (GameServices.buildService.hasOwnProperty("actionSubmit") && GameServices.buildService.actionSubmit instanceof Function) {
                                GameServices.buildService.actionSubmit(params, element, attrs, $scope);
                            }

                        };
                    }

                }

                if (item.$isUnit) {
                    GameServices.spaceShipyardService.registerUnitItem(item);
                }
            });

        }

        function buildCallback(answer, upgradeModel, afterSetPlanshet, uniqueId, isMother) {
            fixBuildItem(answer.UniqueId, getBuildItems(answer), isMother);
            planshetService.addOrUpdatePlanshetModel(answer);
            //console.log("planshetService.addOrUpdatePlanshetModel(answer)", planshetService.getItemById(uniqueId || answer.UniqueId));
            updatePlanshet(upgradeModel, afterSetPlanshet, uniqueId || answer.UniqueId);
        };


        function getBuild(hubActionName, setModel, afterSetPlanshet, uniqueId, isMother, ignore) {
            isMother = !!isMother;
            var pl = EM.EstateData.GetPlanetLocation();
            if (!GameServices.estateService.isCorrectEstateId(isMother ? 0 : pl.PlanetId)) return;


            if (!ignore && planshetService.needUpdateCache(uniqueId)) ignore = true;

            var opts = planshetService.IHubRequestOptions(function () {
                var _id = isMother ? null : pl.PlanetId;
                var action = getBuildAction(hubActionName);
                return action(_id);
            }, uniqueId);

            opts.OnSuccsess = function (answer) {
                buildCallback(answer, setModel, afterSetPlanshet, uniqueId, isMother);
            };
            opts.OnError = function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                throw Errors.ClientNotImplementedException({
                    hubActionName: hubActionName,
                    setModel: setModel,
                    afterSetPlanshet: afterSetPlanshet,
                    uniqueId: uniqueId,
                    isMother: isMother,
                    ignore: ignore,
                    msg: msg,
                    errorAnswer: errorAnswer
                }, "buildReqHelper.getBuild");
            };

            opts.TryGetLocal = !ignore;
            opts.SetToCurrent = true;
            opts.UpdateCacheTime = true;
            opts.CacheTime = Utils.Time.TIME_CACHE_BUILD;
            opts.ChangePlanshetState = true;
            planshetService.planshetHubRequest(opts);

        }

        /**
         * проверяет есть ли необходимость в новом запросе или нужно  толкьо закрыть планшет
         * @param {bool} ignore  проверенное и прощитанное значение
         * @param {string} uniqueId экземпляр планшета
         * @returns {bool} true-  не делать запрос, закрывает планшет. false -  необходим новых запрос
         */
        function isOnlyClose(ignore, uniqueId) {
            if (planshetService.isOpened() && !ignore && planshetService.isCurrentModel(uniqueId)) {
                planshetService.close();
                return true;
            }
            return false;
        };

        /**
         * 
         * @param {object} service angular build Sevice
         * @param {string} actionName serverControllserActionName
         * @param {bool} isMother source request is mother?
         * @param {Function} afterSetPlanshet advanced action after  apply build planshet
         * @returns {void} заполянет настройки конфига для запроса, иделает ряд проверок
         */
        function getBuildList(service, actionName, isMother, afterSetPlanshet) {
            var uniqueId = service.getUniqueId();    
            var ignore = (uniqueId && (isMother !== planshetService.getItemById(uniqueId).IsMother));

            //console.log("getBuildList", {
            //    uniqueId: uniqueId,
            //    ignore: ignore,
            //    IsMother: planshetService.getItemById(uniqueId).IsMother
            //});
            if (isOnlyClose(ignore, uniqueId)) return;
            if (!(afterSetPlanshet instanceof Function)) {
                afterSetPlanshet = angular.noop;
            }

            getBuild(actionName, service.upgradeModel, afterSetPlanshet, uniqueId, isMother, ignore);
        }

        //#endregion

        //#region reqConfig

        //#region Mother
        function getMotherIndustrialComplexList() {
            getBuildList(GameServices.industrialComplexService, buildHubActionNames.GetMotherIndustrialComplex, true);
        };

        function getMotherLaboratoryList() {
            getBuildList(GameServices.laboratoryService, buildHubActionNames.GetMotherLaboratory, true);
        };

        function getMotherSpaceShipyardList() {
            getBuildList(GameServices.spaceShipyardService, buildHubActionNames.GetMotherSpaceShipyard, true);
        };

        //#endregion


        //#region Planet
        function getIndustrialComplexList() {
            getBuildList(GameServices.industrialComplexService, buildHubActionNames.GetIndustrialComplex, false);
        };

        function getCommandCenterList() {
            getBuildList(GameServices.commandCenterService, buildHubActionNames.GetCommandCenter, false);
        };

        function getSpaceShipyardList() {
            getBuildList(GameServices.spaceShipyardService, buildHubActionNames.GetSpaceShipyard, false);
        };

        //#endregion
        //#endregion

        //#region UpdateEstate
        function addBuildsToPlanshet(estateBuilds, isMother) {
            _.forEach(estateBuilds, function (item, i) {
                if (estateBuilds.hasOwnProperty(i)) {
                    //console.log("estateBuilds", estateBuilds);
                    fixBuildItem(item.UniqueId, getBuildItems(item), isMother);     
                    planshetService.addOrUpdatePlanshetModel(item);
                }
            });
            //   console.log("buildReqHelper.addBuildsToPlanshet");
            GameServices.buildService.upgradeEstateBuilds(isMother);

        }
        //#endregion

        this.getMotherIndustrialComplexList = getMotherIndustrialComplexList;
        this.getMotherLaboratoryList = getMotherLaboratoryList;
        this.getMotherSpaceShipyardList = getMotherSpaceShipyardList;
        this.getIndustrialComplexList = getIndustrialComplexList;
        this.getCommandCenterList = getCommandCenterList;
        this.getSpaceShipyardList = getSpaceShipyardList;      
        this.addBuildsToPlanshet = addBuildsToPlanshet;
    }
]);