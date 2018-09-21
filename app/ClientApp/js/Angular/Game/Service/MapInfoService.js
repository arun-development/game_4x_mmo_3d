Utils.CoreApp.gameApp.service("mapInfoService", ["planshetService", "translateService", "statisticHelper", "profileService", "$filter", "mapInfoHelper", "allianceService", "npcHelper",
    function (planshetService, translateService, statisticHelper, profileService, $filter, mapInfoHelper, allianceService, npcHelper) {
        var $self = this;
        var planetoid;
        //#region GetPlanetNames
        var serchPlanetType = {
            AllPlanets: 1,
            OtherUsers: 2,
            OnlyUserPlanet:3
        };
        var lastTimeSerchRequest;
        var lastPlanetNames = [];
        var lastOtherPlanetNames = [];
        var lastUserPlanetNames = [];

        Object.defineProperty($self, "$hub", {
            get: function () {
                return GameServices.mainGameHubService;
            }     
        });

        function addPlanetNames(newNames, serchType) {
            if (!lastPlanetNames) lastPlanetNames = _.union(lastPlanetNames, newNames);
            if (serchType === serchPlanetType.AllPlanets) return;
            else {
                lastTimeSerchRequest = Utils.Time.GetUtcNow();
                if (serchType === serchPlanetType.OtherUsers) {
                    lastOtherPlanetNames = _.union(lastOtherPlanetNames, newNames);
                    return;
                }
                if (serchType === serchPlanetType.OnlyUserPlanet) {
                    lastUserPlanetNames = _.union(lastUserPlanetNames, newNames);
                    return;
                }


            }
        }

        function namesNeedUpdate(lastTime) {
            if (!lastTime) return true;
            return lastTime + Utils.Time.ONE_MINUTE_SECOND * 5 < Utils.Time.GetUtcNow();
        }
        function getLocalPlanetNames(serchType) {
            if (serchType === serchPlanetType.AllPlanets) return lastPlanetNames;
            if (serchType === serchPlanetType.OtherUsers) return lastOtherPlanetNames;
            if (serchType === serchPlanetType.OnlyUserPlanet) {
                if (lastUserPlanetNames.length === 0 || namesNeedUpdate(lastTimeSerchRequest)) {
                    addPlanetNames(GameServices.estateService.getEstateNames(), serchType);
                    return lastUserPlanetNames;
                }
                return lastUserPlanetNames;
            };
            if (SHOW_DEBUG) {
                console.log("Error serchType не верен",
                {
                    serchType: serchType,
                    serchPlanetType
                });
            }

            return [];
        }


        function containPlanetName(serchType, name) {
            if (!name) return false;
            var col = getLocalPlanetNames(serchType);
            if (!col || col.length === 0) return false;
            //var names = _.find(col, function(o) { return o === name });
            var _name = name.toUpperCase();
            var names = _.filter(col, function (o) {
                return o === _name;
            });
            if (!names || names.length === 0) return false;
            if (names.length === 1) return true;
            if (names.length > 1) {
                if (SHOW_DEBUG) {
                    Utils.Console.Error("Multimle chooses data:",
                    {
                        inputName: name,
                        resultCollection: col
                    });
                }
                return false;
            }
            return false;
        }

        function getPlanetNames(request, response, serchType, ignoreFiltr) {
            var requestName = request;

            function filter(collectionPlanetNames, ignore) {
                if (!requestName || ignore) return collectionPlanetNames;
                var name = requestName.toUpperCase();
                return _.filter(collectionPlanetNames, function (o) {
                    return _.includes(o, name);
                });
            }
            function hasLocalName(collection) {
                var hasItems = filter(collection, false);
                return hasItems && hasItems.length > 0;
            }


            function needRequest() {
                if (!lastTimeSerchRequest) return true;
                var _hasLocalName = hasLocalName(lastPlanetNames);
                if (lastPlanetNames.length > 0 && (serchType === serchPlanetType.AllPlanets) && _hasLocalName) return false;
                function restCache(storage) {
                    if (namesNeedUpdate(lastTimeSerchRequest)) {
                        storage = [];
                        return true;
                    }
                    return false;
                }

                if (lastOtherPlanetNames.length > 0 && (serchType === serchPlanetType.OtherUsers)) {
                    if (restCache(lastOtherPlanetNames)) return true;
                    return !_hasLocalName;

                }
                return true;
            }

            if (!requestName) {
                response(filter(getLocalPlanetNames(serchType, ignoreFiltr)));
            }
            else if (serchType === serchPlanetType.OnlyUserPlanet) {
                response(filter(getLocalPlanetNames(serchType, ignoreFiltr)));
            }
            else if (needRequest()) {
                //console.log("collectionPlanetNames", {
                //    lastUserPlanetNames: lastUserPlanetNames,
                //    serchType: serchType,
                //    "getLocalPlanetNames(serchType)": getLocalPlanetNames(serchType),
                //    lastTimeSerchRequest: lastTimeSerchRequest
                //});
                $self.$hub.worldSerchPlanetNames(requestName, serchType)
                    .then(function (answer) {
                        if (answer && answer.length > 0) addPlanetNames(answer, serchType); 
                        if (response) response(filter(getLocalPlanetNames(serchType, ignoreFiltr)));

                }, function (errorAnswer) {
                    var msg = Errors.GetHubMessage(errorAnswer);
                    throw Errors.ClientNotImplementedException({
                        errorAnswer: errorAnswer,
                        msg: msg, 
                        serchType: serchType,
                        request: request,
                        response: response,
                        ignoreFiltr: ignoreFiltr
                    });
                });
            }
            else response(filter(getLocalPlanetNames(serchType, ignoreFiltr)));

        }

        this.addPlanetNames = addPlanetNames;
        this.containPlanetName = containPlanetName;
        this.getPlanetNames = getPlanetNames;

        //#endregion


        function idConstructor(type, id) {
            return type.toLowerCase() + "_" + id;
        }

        function isCurrentModel(itemId) {
            return planshetService.isCurrentModel(itemId);
        }

        function hasItem(itemId) {
            return planshetService.hasItemById(itemId);
        }

        function updatePlanshetView(itemId, accept) {
            planshetService.setCurrentModel(itemId);
            planshetService.open();
            planshetService.updatePlanshet(accept, itemId);
        }

        //#region prepareInfoProperty
        var types = [
            "Galaxy",
            "Sector",
            "Star",
            "Planet",
            "Satellite",
            "Mother"
        ];
        var cssLowerText = " lower-text ";
        var cssLinkToTarget = " unique-name link-to-target ";
        var allianceTranslate;
        var commonTranslate;
        var moiTranslate;
        var moiCheked = false;

        var mapObject;

        function setNames() {
            allianceTranslate = translateService.getAlliance();
            moiTranslate = translateService.getMapInfo();
            commonTranslate = translateService.getCommon();
            moiCheked = true;
            //console.log("moi", moi);
        }

        function checkMoi() {
            if (moiCheked) return;
            if (!moiTranslate || !allianceTranslate || !commonTranslate) setNames();
        }

        function getUserProfileStat(mapObjectModel) {
            //console.log("getUserProfileStat.mapObjectModel", mapObjectModel);
            var linkToUser = statisticHelper.createStatItemModel(moiTranslate["owner"], mapObjectModel.Owner, null, null, cssLinkToTarget);
            if (!npcHelper.isNpc(mapObjectModel.Owner)) {
                profileService.setOnClickToUser(linkToUser, mapObjectModel.Owner);
            }
            return linkToUser;
        }

        function getAllianceStat(allianceKeyTranslatedName, mapObjectModel) {
            if (!mapObjectModel.AllianceName) return null;
            var stat = statisticHelper.createStatItemModel(allianceKeyTranslatedName, mapObjectModel.AllianceName, null, null, " unique-name ");
            if (!npcHelper.isNpc(mapObjectModel.AllianceName)) {
                stat.advancedCssVal += "link-to-target active ";
                stat.hasOnclick = true;
                stat.onClick = function () {
                    allianceService.filterAllianceSerchByName(mapObjectModel.AllianceName);
                };
            }

            return stat;
        }

        function checkAndSetMapStatOnClick(stat, isCurrent, onClick) {
            if (!isCurrent) {
                stat.advancedCssVal += " active ";
                stat.hasOnclick = true;
                stat.onClick = onClick;
            }
        }

        function getGalaxyStat(mapObjectModel, isGalaxyInfo) {
            var stat = statisticHelper.createStatItemModel(moiTranslate["galaxy"], mapObjectModel.GalaxyName, null, null, cssLinkToTarget);
            checkAndSetMapStatOnClick(stat, isGalaxyInfo, function () {
                mapInfoHelper.getGalaxyInfo(mapObjectModel.GalaxyId);
            });
            return stat;
        }

        function getSectorStat(mapObjectModel, isSectorInfo) {
            var stat = statisticHelper.createStatItemModel(moiTranslate["sector"], mapObjectModel.SectorName, null, null, cssLinkToTarget);
            checkAndSetMapStatOnClick(stat, isSectorInfo, function () {
                mapInfoHelper.getSectorInfo(mapObjectModel.SectorId);
            });
            return stat;
        }

        function getSystemStat(mapObjectModel, isSystemInfo) {
            var stat = statisticHelper.createStatItemModel(moiTranslate["system"], mapObjectModel.SystemName, null, null, cssLinkToTarget);
            checkAndSetMapStatOnClick(stat, isSystemInfo, function () {
                mapInfoHelper.getStarInfo(mapObjectModel.SystemId);
            });
            return stat;
        }

        function getPlanetStat(planetKeyTranslatedName, mapObjectModel, isPlanetInfo) {
            var stat = statisticHelper.createStatItemModel(planetKeyTranslatedName, mapObjectModel.NativeName, null, null, " unique-name ");
            checkAndSetMapStatOnClick(stat, isPlanetInfo, function () {
                mapInfoHelper.getPlanetInfo(mapObjectModel.Id);
            });
            return stat;
        }


        function galaxy(m) {
            checkMoi();
            var statItems = [
                getGalaxyStat(m, true),
                statisticHelper.createStatItemModel(moiTranslate["type"], m.SubtypeNativeName),
                statisticHelper.createStatItemModel(moiTranslate["sectors"], m.ChildCount)
            ];
            var img = statisticHelper.createBgImage(m.SpriteImages.Detail, m.GalaxyName);

            return statisticHelper.createStatisticModel(statItems, img);
        }

        function sector(m) {
            checkMoi();

            var statItems = [
                getAllianceStat(allianceTranslate["dominantAlliance"], m),
                getSectorStat(m, true),
                getGalaxyStat(m),
                statisticHelper.createStatItemModel(moiTranslate["systems"], m.ChildCount)

            ];
            var img = statisticHelper.createBgImage(m.SpriteImages.Detail, m.SectorName);
            return statisticHelper.createStatisticModel(statItems, img);
        }

        function star(m) {
            checkMoi();
            var statItems = [
                statisticHelper.createStatItemModel("EnergyBonus_tr", m.Bonus, null, null, ((m.Bonus > 1) ? " bonus-positive " : " bonus-negative ")),
                getUserProfileStat(m),
                getAllianceStat(allianceTranslate["alliance"], m),
                getSystemStat(m, true),
                getSectorStat(m),
                getGalaxyStat(m),
                statisticHelper.createStatItemModel(moiTranslate["type"], m.SubtypeTranslateName),
                statisticHelper.createStatItemModel(moiTranslate["planets"], m.ChildCount)
            ];
            var img = statisticHelper.createBgImage(m.SpriteImages.Detail, m.SystemName);
            return statisticHelper.createStatisticModel(statItems, img);
        }

        function planet(m) {
            checkMoi();
            var statItems = [
                getPlanetStat(commonTranslate["name"], m, true),
                getUserProfileStat(m),
                getAllianceStat(allianceTranslate["alliance"], m),
                statisticHelper.createStatItemModel(moiTranslate["lastActivity"], $filter("date")(new Date(m.LastActive), "dd.MM.yyyy"), null, null, cssLowerText),
                getSystemStat(m),
                getSectorStat(m),
                getGalaxyStat(m),
                statisticHelper.createStatItemModel(moiTranslate["type"], m.TypeTranslateName || m.TypeNativeName),
                statisticHelper.createStatItemModel(moiTranslate["subType"], m.SubtypeTranslateName),
                statisticHelper.createStatItemModel(moiTranslate["moons"], m.ChildCount)
            ];
            var img = statisticHelper.createBgImage(m.SpriteImages.Detail, m.SystemName);
            return statisticHelper.createStatisticModel(statItems, img);
        }

        function satellite(m) {
            checkMoi();
        }

        function moon(m) {
            checkMoi();
            var statItems = [
                    statisticHelper.createStatItemModel(moiTranslate["moon"], m.NativeName, null, null, " unique-name ")
            ];
            var img = statisticHelper.createBgImage(m.SpriteImages.Detail, m.SystemName);
            return statisticHelper.createStatisticModel(statItems, img);
        }

        function getMapObject(modelName, model) {
            if (!mapObject) {
                mapObject = {};
                mapObject.galaxy = galaxy;
                mapObject.sector = sector;
                // mapObject.systemItem = systemItem;
                mapObject.star = star;
                mapObject.planet = planet;
                mapObject.moon = moon;
                mapObject.satellite = satellite;
            }
            var name = modelName.toLowerCase();
            if (mapObject.hasOwnProperty(name)) return mapObject[name](model);
            else {
                console.log("methodNotExist", {
                    modelName: modelName,
                    model: model
                });
                return;
            }
        };


        function getContent(infoModel) {
            // console.log("infoModel", infoModel);
            return getMapObject(infoModel.TypeNativeName, infoModel);
        }
        this.getContent = getContent;
        //#endregion

        // request
        function getMapInfo(type, id, hubAction, accept, update) {
            var uniqueId = idConstructor(type, id);
            if (!(hubAction instanceof Function)) {
                throw Errors.ClientNullReferenceException({
                    type: type,
                    id: id,
                    hubAction: hubAction,
                    update: update,
                    accept: accept
                }, "hubAction", "mapInfoService.getMapInfo");
            }
            //            console.log("getMapInfo", {
            //                type: type,
            //                uniqueId: uniqueId,
            //                id: id,
            //                url: url
            //            });
            function request() {

                var opts = planshetService.IHubRequestOptions(function () {
                    return hubAction(id);
                }, uniqueId);

                opts.OnSuccsess = function (answer) {
                    //console.log("else  callback", answer);
                    planetoid = answer;
                    planetoid.Bodys[0].TemplateData.mapStatsModel = getContent(planetoid.Bodys[0].TemplateData);
                    if (uniqueId !== planetoid.UniqueId) {
                        Utils.Console.Error("planetoidId не совпадает!!! data: ",
                        {
                            planetoid: planetoid,
                            answer: answer,
                            uniqueId: uniqueId,
                            type: type,
                            id: id,
                            url: hubAction,
                            update: update
                        });
                    }
                    planshetService.addOrUpdatePlanshetModel(planetoid);
                    updatePlanshetView(uniqueId, accept);
                };
                opts.OnError = function (errorAnswer) {
                    var msg =typeof errorAnswer === "string"?errorAnswer :Errors.GetHubMessage(errorAnswer);
                    throw Errors.ClientNotImplementedException({
                        errorAnswer: errorAnswer,
                        msg: msg,
                        type: type,
                        id: id,
                        hubAction: hubAction,
                        accept: accept,
                        update: update,
                        opts: opts,
                    }, "mapInfoService.getMapInfo"); 


                };

                opts.TryGetLocal = false;
                opts.SetToCurrent = true;
                opts.UpdateCacheTime = true;
                opts.CacheTime = Utils.Time.TIME_CACHE_PROFILE;
                planshetService.planshetHubRequest(opts);

            }                                                    

            if (update) {
                request();
                return;
            }
            else if (planshetService.needUpdateCache(uniqueId)) {
                request();
                return;
            }
            else if (isCurrentModel(uniqueId)) {
                //  console.log("isCurrentModel");
                planshetService.toggle();
                return;
            }
            else if (hasItem(uniqueId)) {
                //  console.log("hasItem");
                planetoid = planshetService.getItemById(uniqueId);
                updatePlanshetView(uniqueId, accept);
                return;
            }
            else request();

        }

        function getPlanetoidData() {
            return planetoid.Bodys[0].TemplateData;
        }

        this.getMapInfo = getMapInfo;
        this.getPlanetoidInfo = getPlanetoidData;
        this.serchPlanetType = serchPlanetType;

    }
]);