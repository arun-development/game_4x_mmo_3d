Utils.CoreApp.gameApp.service("bookmarkService", [
    "planshetService", "tabService", "mapInfoService", "mainHelper", "bookmarkDialogHelper","gameChestService",
function (planshetService, tabService, mapInfoService, mainHelper, $bdH,gameChestService) {
        // todo  передалать методы под хаб
        var $self = this;
        this.$bdH = $bdH;

        var bookmarkUniqueId;
        var bookmarksData;
        var baseBookmarkLimit = 100;
        var premiumBookmarkLimitMod;


        var bodyTabIdx = {
            planet: 0,
            system: 1,
            sector: 2
        };


        Object.defineProperty($self, "$hub", {
            get: function () {
                return GameServices.mainGameHubService;
            }
        });


        //#region Helpers
        function updatePlanshet(advancedAction) {
            planshetService.updatePlanshet(advancedAction);
        };

        function orderById(collection, directionAsk) {
            return _.orderBy(collection, ["BookmarkId"], directionAsk ? ["ask"] : ["desc"]);
        };

        function getBookmarkOutModel() {
            return Utils.ModelFactory.BookmarkOut();
        };

        function isCurrentModel() {
            return planshetService.isCurrentModel(bookmarkUniqueId);
        };


        //function bookmarkJump(type, galaxy, sector, system, id, textureTypeId) {
        function bookmarkJump(galaxyId, sectorId, systemId, spaceObjectId, textureTypeId, mapTypeName) {
            var guid = "bookmarkService.bookmarkJump" + "_" + (galaxyId || 0) + "_" + (sectorId || 0) + "_" + (systemId || 0) + "_" + (spaceObjectId || 0) + "_" + (textureTypeId || 0) + "_"+mapTypeName;
            if (!Utils.TimeDelay.IsTimeOver(guid)) return;
            Utils.TimeDelay.Start(guid);
            var types = EM.MapGeometry.MapTypes;
            if (!mapTypeName) return;
            if (!galaxyId) return;
            if (!sectorId) return;

            var lowType = mapTypeName.toLowerCase();
            function setLocation(typeName) {
                EM.EstateData.SaveCurrentSpaceLocation(galaxyId, sectorId, systemId, spaceObjectId, textureTypeId, typeName);
            }

            function setCameraMinZ() {
                EM.GameCamera.Camera.minZ = EM.GameCamera.System.minZ;
            }

            function planetoidClick(meshId) {
                EM.MapEvent.PlanetoidDubleClick(meshId, null, true);
            };

            function onMeshExist(meshId, typeName) {
                setLocation(typeName);
                planetoidClick(meshId);
            }

            function onMeshNotExist(meshId,typeName, onEnd) {
                EM.MapGeometry.System.Destroy();
                EM.SpaceState.SetNewCoord(sectorId, systemId);
                EM.MapBuilder.System.Callback = function () {
                    setLocation(typeName);
                    //todo  костыль на первое время  вызывает баги но перемещается
                    EM.StarLight.SetOther();
                    var sp = new EM.SpaceState.SpacePosition();
                    sp.setState(sp.getSystemSelectedState());
                    setCameraMinZ();
                    setTimeout(function () {
                        planetoidClick(meshId);
                        if (onEnd) {
                            onEnd();
                        }
                    }, 100);
                };
                EM.MapBuilder.System.Build();
            }

            function createOrClick(meshId, typeName, setLight) {
                var mesh = EM.GetMesh(meshId);
                if (mesh) {
                    onMeshExist(meshId, typeName);
                } else {
                    onMeshNotExist(meshId, typeName, setLight);
                }
            }
            // Sector
            if (lowType === types.Sector.toLowerCase()) {
                EM.MapEvent.SectorProgrammClick(sectorId);
            }
           // System
            else if (lowType === types.Star.toLowerCase()) {
                if (systemId === 0) return;
                var starMeshId = EM.MapGeometry.System.GetOrCreateStarMeshId(systemId, textureTypeId, true);
                createOrClick(starMeshId, types.Star, EM.StarLight.SetOther);
            }
                // Planet
            else if (lowType === types.Planet.toLowerCase()) {
                if (systemId === 0) return;
                if (spaceObjectId === 0) return;
                var planetMeshId = EM.MapGeometry.System.GetOrCreatePlanetMeshId(spaceObjectId, textureTypeId, true);
                createOrClick(planetMeshId, types.Planet, EM.StarLight.SetInSystem);
            }
        };


        //#region Collections
        function getBodyByIdx(idx) {
            return bookmarksData.Bodys[idx];
        }

        function getTabData(tabIdx) {
            return getBodyByIdx(tabIdx).TemplateData;
        }

        function getIdxByType(typeName) {
            var key = typeName.toLowerCase();
            if (key === "star") key = "system";
            if (bodyTabIdx.hasOwnProperty(key)) return bodyTabIdx[key];
            Utils.Console.Error("Не верный тип планетоида или ключа",
                {
                    typeName: typeName,
                    bodyIdx: bodyTabIdx
                });
            return false;
        }

        function getBodyByPlanetoidType(planetoidType) {
            var idx = getIdxByType(planetoidType);
            if (typeof idx === "number") return getBodyByIdx(idx);
            return false;
        }

        function getPlanetItems() {
            return getTabData(bodyTabIdx.planet);
        }

        function getSystemItems() {
            return getTabData(bodyTabIdx.system);
        }

        function getSectorItems() {
            return getTabData(bodyTabIdx.sector);
        }

        function findItem(bookmarkId, tabIdx) {
            var coll = getTabData(tabIdx);
            return _.findIndex(coll, function (o) {
                return o.BookmarkId === bookmarkId;
            });
        }

        function findItemByObjectId(objectId, tabIdx) {
            var coll = getTabData(tabIdx);
            return _.find(coll, function (o) {
                return o.Id === objectId;
            });
        }

        function findAndDeleteBookmark(bookmarkId, tabIdx) {
            var coll = getTabData(tabIdx);
            var item = _.findIndex(coll, function (o) {
                return o.BookmarkId === bookmarkId;
            });
            _.pullAt(coll, item);
            return;
        }

        function addNewItem(idx, item) {
            var body = getBodyByIdx(idx);
            if (!body) return;
            var col = body.TemplateData;
            if (!col) return;

            item.ComplexButtonView.IsNewItem = true;
            col.push(item);
            item.mapStatsModel = mapInfoService.getContent(item);
            body.TemplateData = orderById(col);
        }

        function setProperty() {
            function set(section) {
                _.forEach(section, function (item, key) {
                    item.mapStatsModel = mapInfoService.getContent(item);
                });

            }

            _.forEach(bookmarksData.Bodys, function (value, bodyIdx) {
                var td = getTabData(bodyIdx);
                if (td.length > 0) set(td);
            });

        }

        //#endregion


        //#region Calc
        function getLocalBookmarkCount() {
            var planets = getPlanetItems().length;
            var systems = getSystemItems().length;
            var sectors = getSectorItems().length;
            return planets + systems + sectors;
        }

        function getBookmarkLimit() {
            var hasPremium = gameChestService.$hasPremium();
            // todo   получаем премиум чест

            if (hasPremium) {
                console.log("outPremium", {                         
                    hasPremium: hasPremium,
                    GetPremiumMods: gameChestService.chestService.$getPremiumMods()
                });
                if (!premiumBookmarkLimitMod) premiumBookmarkLimitMod = gameChestService.chestService.$getPremiumMods().PremiumBookmarkMod;
                return Math.floor(baseBookmarkLimit * premiumBookmarkLimitMod);
            }
            return baseBookmarkLimit;

        }

        function localBookmarksIsFull() {
            var max = getBookmarkLimit();
            var current = getLocalBookmarkCount();
            return (max <= current);
        }

        //#endregion


        //#endregion    

        function setLocalModel(model) {
            bookmarksData = model;
            bookmarkUniqueId = bookmarksData.UniqueId;
            setProperty();
            planshetService.updatePlanshetItemData(bookmarksData, true, Utils.Time.TIME_CACHE_BOOKMARKS);
        };

        function setCssNewItem(id, idx, asObjectId, showOrHide) {
            var item;
            if (asObjectId) item = findItemByObjectId(id, idx);
            else item = findItem(id, idx);
            item.ComplexButtonView.IsNewItem = showOrHide;
        };

        function addBookmark(mapType, mapObjectId) {
            if (bookmarksData) {
                if (localBookmarksIsFull()) {
                    $self.ErrorHandler.BookMarkLimitDone();
                    return;
                };
                var item = findItemByObjectId(mapObjectId, getIdxByType(mapType));
                if (item) {
                    $self.ErrorHandler.BookmarkIsExist();
                    return;
                }
                $self.$requestAddBookmark(mapType, mapObjectId, false);
            }
            else $self.$requestAddBookmark(mapType, mapObjectId, true);
        };


        this.ErrorHandler = {
            BookMarkLimitDone: function (errorAnswer) {
                console.log("ErrorHandler.BookMarkLimitDone", {
                    errorAnswer: errorAnswer
                });
                $bdH.getTextOpenDialogBookMarkLimitDone();
            },
            BookmarkIsExist: function (errorAnswer) {
                console.log("ErrorHandler.BookmarkIsExist", {
                    errorAnswer: errorAnswer
                });
                $bdH.openDialogBookmarkIsExist();
            },
            HandleError: function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                if ($self.ErrorHandler.hasOwnProperty(msg)) {
                    $self.ErrorHandler[msg](errorAnswer);
                    return true;
                }
                return false;
            }
        };



        //#region Request 
        function loadBokmarksPlanshet() {
            if (bookmarkUniqueId && planshetService.isCurrentModel(bookmarkUniqueId)) {
                planshetService.toggle(bookmarkUniqueId);
                return;
            }
            var opts = planshetService.IHubRequestOptions($self.$hub.bookmarkGetPlanshet, bookmarkUniqueId);
            opts.OnSuccsess = function (answer) {
                setLocalModel(answer);
                planshetService.setCurrentModel(bookmarkUniqueId);
                updatePlanshet();
            };
            opts.OnError = function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                throw Errors.ClientNotImplementedException({
                    errorAnswer: errorAnswer,
                    msg: msg
                }, "mapInfoService.getMapInfo");

            };
            opts.TryGetLocal = true;
            opts.SetToCurrent = true;
            opts.UpdateCacheTime = true;
            opts.ChangePlanshetState = true;
            opts.CacheTime = Utils.Time.TIME_CACHE_BOOKMARKS;
            planshetService.planshetHubRequest(opts);
        };

        //todo  Не правильный метод    обращается к контроллеру  а не к хабу
        var _deleteBokmarkInProgress = false;
        function deleteBokmark(params, element, attrs) {
            if (_deleteBokmarkInProgress) return;
            _deleteBokmarkInProgress = true;

            $self.$hub.bookmarkDeleteItem(params.Data)
                .finally(function () {
                _deleteBokmarkInProgress = false;

            })
            .then(function (answer) {
                if (answer) {
                    mainHelper.applyTimeout(function () {
                        findAndDeleteBookmark(params.Id, params.TabIdx);
                    });
                }
            }, function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                var errorData = {
                    errorAnswer: errorAnswer,
                    msg: msg,
                    params: params,
                    bookmarksData: bookmarksData,
                };
                throw Errors.ClientNotImplementedException(errorData, "bookmarkService.deleteBokmark.error");

            });


        };


        var _requestAddBookmarkIsProgress = false;
        $self.$requestAddBookmark = function (mapType, mapObjectId, isAllTabs) {
            if (_requestAddBookmarkIsProgress) return;
            _requestAddBookmarkIsProgress = true;
            var data = getBookmarkOutModel();
            data.TypeName = mapType;
            data.ObjectId = mapObjectId;
            data.IsFull = isAllTabs;
            var idx = getIdxByType(mapType);

            $self.$hub.bookmarkAddBookmark(data).finally(function () {
                _requestAddBookmarkIsProgress = false;
            }).then(function (answer) {
                if (isAllTabs) {
                    setLocalModel(answer);
                    setCssNewItem(mapObjectId, idx, true, true);
                } else addNewItem(idx, answer);
                var state = bookmarkUniqueId && isCurrentModel();
                if (!state) planshetService.setCurrentModel(bookmarkUniqueId);

                updatePlanshet(function () {
                    tabService.delayActivate(idx);
                    if (!planshetService.isOpened()) {
                        planshetService.toggle(bookmarkUniqueId);
                    }
                });

            }, function (errorAnswer) {
                if (!$self.ErrorHandler.HandleError(errorAnswer)) {
                    var msg = Errors.GetHubMessage(errorAnswer);
                    var errorData = {
                        errorAnswer: errorAnswer,
                        msg: msg,
                        data: data,
                        mapType: mapType,
                        mapObjectId: mapObjectId,
                        bookmarksData: bookmarksData,
                    };
                    throw Errors.ClientNotImplementedException(errorData, "bookmarkService.$requestAddBookmark.error");
                }

            });

        }; //#endregion

        this.getTabs = function () {
            return bookmarksData;
        };

        this.loadBokmarksPlanshet = loadBokmarksPlanshet;
        this.bookmarkJump = bookmarkJump;

        this.getPlanetItems = getPlanetItems;
        this.getSystemItems = getSystemItems;
        this.getSectorItems = getSectorItems;
        this.deleteBokmark = deleteBokmark;
        this.addBookmark = addBookmark;
    }
]);