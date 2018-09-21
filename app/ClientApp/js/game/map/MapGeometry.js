/**
   * @description Генерирует геометрию мешей материалы и текстуры
   * @class {MapGeometry}
   * @name MapGeometry 
   */
EM.MapGeometry = {
    SYSTEM_PROTO_NAME: "starSystemProto",
    SYSTEM_REAL_PROTONAME: ".starSystemProto",
    SECTOR_PROTO_NAME: "sectorProto",
    SECTOR_REAL_PROTONAME: ".sectorProto",
    Scale: 10,
    MapTypes: {
        Mother: "Mother",        // base type
        Universe: "Universe",    // base type
        Galaxy: "Galaxy",        // base type
        Sector: "Sector",        // base type
        Star: "Star",            // base type
        Satellite: "Satellite",  // base type
        Planet: "Planet",        // base type
        Moon: "Moon",            // Satellite -  Moon может использоватсья и как // base type с поправкой на то что в ассет репозитории  базовым типом является  Satellite
        Bookmark: "Bookmark",    // указатель на связку (не тип)

        Earth: "Earth",          // Planet
        Gas: "Gas",              // Planet
        IceGas: "IceGas",        // Planet

        Asteroid: "Asteroid",    // Satellite
        Nibula: "Nibula",        // Universe
        Spirale: "Spirale",      // Galaxy
        //star types
        A: "A",                  // Star
        B: "B",                  // Star
        F: "F",                  // Star
        G: "G",                  // Star
        K: "K",                  // Star
        L: "L",                  // Star
        M: "M",                  // Star
        O: "O"                   // Star
    },

    _chekAndGetMeshInScene: function (meshId) {
        "use strict";
        var mesh = EM.GetMesh(meshId);
        if (!mesh) return false;
        return mesh;
    },

    Lang: appL10n.getL10NCurrentLanguage,
    Galaxies: null,
    Sectors: null,
    Systems: null,
    System: null,

    Effects: {},
    IGeometryMapItemFactory: null,
    IGeometryMaperFactory: null,
    GetUniqueIdFromAny: null
};

//#region Base
(function (MapGeometry) {
    "use strict";
    MapGeometry.IGeometryMapItemFactory = function (uniqueId, textureId, parentMeshName, getMeshContainer) {
        function IGeometryMapItem() {
            var meshContainer;
            var _self = this;
            if (getMeshContainer instanceof Function) meshContainer = getMeshContainer(textureId, uniqueId);
            else meshContainer = EM.AssetRepository.GetSpaceRegularMeshContainer(textureId);
            if (!meshContainer) throw Errors.ClientNullReferenceException({ uniqueId: uniqueId, textureId: textureId, meshContainer: meshContainer });
            this.UniqueId = uniqueId;
            this.TextureId = textureId;
            this.ParentMeshName = parentMeshName;
            this._baseMeshId = meshContainer.GetMeshId();
            this.FullMeshId = meshContainer.GetMeshId(uniqueId, parentMeshName);
            this.BasePartMeshId = meshContainer.GetMeshId(uniqueId);
            this[EM.AssetRepository.MESH_CONTAINER_KEY] = meshContainer;

            this.AdvPropNames = {};
            this.AddProp = function (propKey, val) {
                this.AdvPropNames[propKey] = propKey;
                this[propKey] = val;
            }
            this.GetMesh = function () {
                return _self.GetMeshById(_self.FullMeshId);
            }
            this._getMeshByOtherParams = function (_uniqueId, _parentMesId) {
                return meshContainer.GetMesh(_uniqueId, _parentMesId);
            }
            this.GetMeshById = function (meshId) {
                return EM.GetMesh(meshId);
            };
            this.GetMeshContainer = function () {
                return meshContainer;
            }
            return this;
        }

        return new IGeometryMapItem();
    };
    MapGeometry.IGeometryMaperFactory = function (mapperName, createIGeometryMapItem, init, parentMeshName, getMeshContainer) {
        if (!(init instanceof Function))
            init = angular.noop;

        function IGeometryMaper() {
            var _self = this;
            this._mapperName = mapperName;
            this._initialized = false;
            this._init = init;
            this._parentMeshName = parentMeshName;
            this._collection = {};
            this.Count = 0;
            this.GetMapItem = function (uniqueId, textureId) {
                if (!_self._initialized) {
                    _self._init(_self);
                    _self._initialized = true;
                    _self._init = null;
                    delete _self._init;
                    _self.GetMapItem = function (_uniqueId, _textureId) {
                        if (_uniqueId && _textureId) return _self.GetOrAdd(_uniqueId, _textureId);
                        return _self._collection[_uniqueId];
                    }
                    return _self.GetMapItem(uniqueId, textureId);
                }
            };
            this.GetOrAdd = function (uniqueId, textureId) {
                if (_self._collection[uniqueId]) return _self._collection[uniqueId];
                var item = new MapGeometry.IGeometryMapItemFactory(uniqueId, textureId, parentMeshName, getMeshContainer);
                item = createIGeometryMapItem(item);
                _self._collection[uniqueId] = item;
                this.Count++;
                return _self._collection[uniqueId];
            };
            this.GetTextureId = function (uniqueId) {
                var item = _self.GetMapItem(uniqueId);
                if (!item) return null;
                return item.TextureId;
            };


            this._getFullMeshId = function (uniqueId, textureId) {
                var item = _self.GetMapItem(uniqueId, textureId);
                if (!item) return null;
                return item.FullMeshId;
            };
            this._addAdvPropToItem = function (uniqueId, textureId, propKey, propVal) {
                var item = _self.GetMapItem(uniqueId, textureId);
                if (!item) return null;
                item.AddProp(propKey, propVal);
                return item;
            }
            this._getItemAdvPropNames = function (uniqueId, textureId) {
                var item = _self.GetMapItem(uniqueId, textureId);
                if (!item) return null;
                return item.AdvPropNames;
            }
            this.HasItem = function (uniqueId) {
                return !!this.GetMapItem(uniqueId);
            }
            this.GetMeshContainer = function (uniqueId, textureId) {
                var item = _self.GetMapItem(uniqueId, textureId);
                if (!item) return null;
                return item.GetMeshContainer();
            }
            this.GetMesh = function (uniqueId, textureId) {
                var item = _self.GetMapItem(uniqueId, textureId);
                if (!item) return null;
                return item.GetMesh();
            }
            this.GetMeshById = function (meshId) {
                return EM.GetMesh(meshId);
            };
            this._reset = function () {
                this._collection = {};
                this.Count = 0;
            }
            this._cleanPerItem = function (perItemAction, condition) {
                if (perItemAction instanceof Function) {
                    if (condition instanceof Function) {
                        _.forEach(_self._collection, function (item, itemKey) {
                            if (condition(item, itemKey)) {
                                perItemAction(item, itemKey);
                                _self.Count--;
                            }

                        });
                    }
                    else {
                        _.forEach(_self._collection, function (item, itemKey) {
                            perItemAction(item, itemKey);
                            _self._collection[itemKey] = null;
                            delete _self._collection[itemKey];
                            _self.Count--;
                        });
                    }
                }
                else this._clean();
            }

            this._getAll = function () {
                return this._collection;
            }
            return _self;
        }

        return new IGeometryMaper();
    };

    /**  
     * пытается извлеч ид из переданного аргумента. в следующем порядке   
     * uniqueId  число - возвращает как есть предполагается что ид уже существует из объекта даты сервера или другого проверяемого параметра 
     * uniqueId -!uniqueId return null;   
     * uniqueId  - строка  делается попатка приведения к числу, если удачно возвращается числовое значение  
     * uniqueId - object    
     * делается попытка извлеч значение из свойства объекта в указанной последовательности,
     * при первом совпадении следующее значение не используется  
     * [id,Id,uniqueId,UniqueId]
     * id - предполагается что это меш ид
     * Id - предполагается что это объект серверной даты а значением является число
     * uniqueId - свойство вспомогательного объекта {string||int}   
     * UniqueId  свойство базового объекта     {string||int}  
     * повторная проверка на число если значение конвертируемо в число возвращается числовой тип
     * @param {int||string||object||object.id||object.Id||object.uniqueId||object.UniqueId} uniqueId 
     * @param {string} fromPropertyName  can be null   если установленно считается именем свойства   UniqueId[fromPropertyName]  проверка на тип
     * @returns {int||string||null} извлеченное знаение если найденно иначе нулл
     */
    MapGeometry.GetUniqueIdFromAny = function (uniqueId, fromPropertyName) {
        var _id = null;
        if (fromPropertyName) {
            if (!uniqueId) return null;
            _id = uniqueId[fromPropertyName];
        }
        else if (typeof uniqueId === "number") return uniqueId;
        else if (!uniqueId) return null;
        else if (typeof uniqueId === "string") _id = uniqueId;
        else if (typeof uniqueId === "object") {
            if (uniqueId.hasOwnProperty("id")) _id = uniqueId.id;
            else if (uniqueId.hasOwnProperty("Id")) _id = uniqueId.Id;
            else if (uniqueId.hasOwnProperty("uniqueId")) _id = uniqueId.uniqueId;
            else if (uniqueId.hasOwnProperty("UniqueId")) _id = uniqueId.UniqueId;
        }

        if (!_id) return null;
        if (_.isNumber(_id)) return _id;
        if (Utils.IsNumeric(_id)) return _.toNumber(_id);
        return _id;

    };

    /**
     * 
     * @param {string||int} meshId 
     * @returns {int} uniqueId
     * throws [ClientNullReferenceException,ClientTypeErrorException]
     */
    MapGeometry.GetUniqueIdFromMeshId = function (meshId) {
        if (!meshId) throw Errors.ClientNullReferenceException({ meshId: meshId }, "meshId", "MapGeometry.GetUniqueIdFromMeshId");
        var _id = MapGeometry.GetUniqueIdFromAny(meshId);
        if (typeof _id === "number") return _id;
        if (!_id) throw Errors.ClientNullReferenceException({ meshId: meshId, _id: _id }, "_id", "MapGeometry.GetUniqueIdFromMeshId");
        if (typeof _id !== "string") throw Errors.ClientTypeErrorException({ meshId: meshId, _id: _id }, _id, "string", "MapGeometry.GetUniqueIdFromMeshId");
        var meshInfo = ar.GetMeshInfoByMeshId(_id);
        if (!meshInfo) Errors.ClientNullReferenceException({ meshId: meshId, _id: _id, meshInfo: meshInfo }, "meshInfo", "MapGeometry.GetUniqueIdFromMeshId");
        _id = meshInfo.UniqueId;
        if (!_id) Errors.ClientNullReferenceException({ meshId: meshId, _id: _id, meshInfo: meshInfo, "meshInfo.UniqueId": meshInfo.UniqueId }, "meshInfo", "MapGeometry.GetUniqueIdFromMeshId");
        return _id;
    };
})(EM.MapGeometry);

//#endregion




//#region _baseObject
(function (MapGeometry) {
    "use strict";
    MapGeometry._baseObject = function (generate, destroy, setVisible, mapper) {
        return {
            Generate: generate,
            Destroy: destroy,
            SetVisible: setVisible,
            Mapper: mapper
        };
    };
})(EM.MapGeometry);
//#endregion


//#region Generate

//#region Galaxies
(function (MapGeometry) {
    "use strict";
    var ar = EM.AssetRepository;
    var _mapItemKey = ar.MAP_ITEM_KEY;
    var _textureTypeIdKey = ar.TEXTURE_TYPE_ID_KEY;
    var _mapTypeKey = ar.MAP_TYPE_KEY;
    var _meshInfoKey = ar.MESH_INFO_KEY;
    var _meshContainerKey = ar.MESH_CONTAINER_KEY;
    var _serverDataKey = ar.SERVER_DATA_KEY;


    function createGalaxyMapItem(_super) {
        function IGalaxyMapItem() {
            var _self = _.extend(this, _super);
            _self.Sectors = null;
            return _self;
        }
        return new IGalaxyMapItem();
    }

    function _initMapper(_super) {
        _super.GetOrAdd(1, 1);
    }
    var galaxyMapper = MapGeometry.IGeometryMaperFactory("GalaxyMapper", createGalaxyMapItem, _initMapper);
    galaxyMapper._hasSectors = {};
    galaxyMapper.HasSectorsInGalaxy = function (galaxyId) {
        return galaxyMapper._hasSectors[galaxyId];
    };
    galaxyMapper.GetSectors = function (galaxyId) {
        if (!galaxyMapper.HasSectorsInGalaxy(galaxyId)) return null;
        var item = galaxyMapper.GetMapItem(galaxyId);
        return item.Sectors;
    };
    galaxyMapper.GalaxyInitialized = function (galaxyId) {
        var item = galaxyMapper.GetMapItem(galaxyId);
        if (!item) return false;
        return item._gInitialized;
    };
    galaxyMapper.GetGalaxyes = function () {
        return galaxyMapper._collection;
    };

    var galaxies = MapGeometry._baseObject(null, null, null, galaxyMapper);


    function saveSectorsFromServer(answer) {
        _.forEach(answer, function (sector, sectorIdx) {
            var item = galaxyMapper.GetMapItem(sector.GalaxyId);
            if (!item) throw Errors.ClientNullReferenceException({ answer: answer, galaxyMapper: galaxyMapper, item: item }, "item", "galaxies.saveSectorsFromServer");

            if (!item.Sectors) {
                item.AddProp("Sectors", {});
                item.Sectors[sector.Id] = sector;
                galaxyMapper._hasSectors[sector.GalaxyId] = true;

            }
            else if (!item.Sectors[sector.Id]) item.Sectors[sector.Id] = sector;

        });

    }

    function getGalaxy(numId) {
        var meshContainer = galaxyMapper.GetMapItem(numId);
        var realGalaxyId = meshContainer.FullMeshId;
        var galaxy = galaxyMapper.GetMeshById(realGalaxyId);
        if (galaxy) return galaxy;
        else {
            MapGeometry.Sectors.Generate(numId);
            var newGalaxy = galaxyMapper.GetMeshById(realGalaxyId);
            if (newGalaxy) return newGalaxy;
            else console.log("galaxy__" + numId + "__not exist");
            return null;
        }
    }

    function setVisible(show) {
        _.forEach(galaxyMapper.GetGalaxyes(), function (galaxyItem, galaxyItemKey) {
            EM.SetVisibleByMesh(galaxyMapper.GetMeshById(galaxyItem.FullMeshId), show);
        });
    }

    function generateGalaxy1(mapItem) {
        var x = 16;
        var y = 16;
        var scale = 3e3;
        var galParams = {
            width: x * scale,
            height: y * scale
        };
        var galaxyId = 1;
        var _mapItem = mapItem || galaxyMapper.GetMapItem(galaxyId);
        var textureId = _mapItem.TextureId;
        var gMeshId = _mapItem.FullMeshId;
        var galaxyMesh = _mapItem.GetMeshById(gMeshId);
        if (galaxyMesh) return galaxyMesh;

        var galaxy = BABYLON.MeshBuilder.CreateGround(gMeshId, galParams, EM.Scene);
        galaxy.material = ar.GetSpaceRegularMaterial(textureId);


        ar.AddLocalsToMesh(galaxy, _textureTypeIdKey, textureId);
        var meshInfo = ar.GetMeshInfoByMeshId(galaxy.id);
        ar.AddLocalsToMesh(galaxy, _mapTypeKey, meshInfo.GetMapType());
        ar.AddLocalsToMesh(galaxy, _meshContainerKey, meshInfo.GetMeshContainer());
        ar.AddLocalsToMesh(galaxy, _meshInfoKey, meshInfo);
        ar.AddLocalsToMesh(galaxy, _mapItemKey, _mapItem);

        var _galaxyVisible = false;
        var _galaxyObserver;
        var nibulaBox = EM.GetMesh(ar.NUBULA_BOX_MESH_ID);
        Object.defineProperty(galaxy, "isVisible", {
            get: function () {
                return _galaxyVisible;
            },
            set: function (value) {
                if (value) {
                    _galaxyObserver = EM.Scene.onBeforeRenderObservable.add(function (eventData, mask) {
                        nibulaBox.isVisible = false;
                        galaxy.rotation.y -= 0.00006;
                    });
                }
                else {
                    EM.Scene.onBeforeRenderObservable.remove(_galaxyObserver);
                    nibulaBox.isVisible = true;
                }
                _galaxyVisible = value;
                //  console.log("galaxy change state new value: " + value);
            }
        });

        EM.MapEvent.AddExecuteCodeAction(galaxy, BABYLON.ActionManager.OnPickTrigger, function () {
            EM.MapEvent.HideContextMenu();
        });
        return galaxy;
    }

    function generateGalaxyiesAndSectorsIn() {
        var galaxiId1 = 1;
        if (!galaxyMapper.GalaxyInitialized(galaxiId1) && galaxyMapper.HasSectorsInGalaxy(galaxiId1)) {
            var mapItem = galaxyMapper.GetMapItem(1);
            var g1 = generateGalaxy1(mapItem);
            var sectors = mapItem.Sectors;
            MapGeometry.Sectors.Generate(g1, true, sectors);
            mapItem._gInitialized = true;


        }


    }

    function createGalaxyById(galaxyId) {
        if (Utils.ConvertToInt(galaxyId) === 1) return generateGalaxy1();
        return false;
    }

    galaxies.CreateGalaxyById = createGalaxyById;
    galaxies.Generate = generateGalaxyiesAndSectorsIn;
    galaxies.SetVisible = setVisible;


    galaxies.SaveSectorsFromServer = saveSectorsFromServer;



    galaxies.GetGalaxy = getGalaxy;
    galaxies.GetSectorsByGalaxyId = galaxyMapper.GetSectors;

    galaxies.GetGalaxyIdFromMesh = function (meshId) {
        var _id = MapGeometry.GetUniqueIdFromAny(meshId);
        if (!_id) return null;
        if (_.isNumber(_id)) return _.toInteger(_id);
        var item = ar.GetMeshInfoByMeshId(_id);
        if (item) return item.UniqueId;
        throw Errors.ClientNotImplementedException({ meshId: meshId, _id: _id }, "MapGeometry.GetGalaxyIdFromMesh");
    };

    galaxies.GalaxyInitialized = galaxyMapper.GalaxyInitialized;
    galaxies.HasSectorsInGalaxy = galaxyMapper.HasSectorsInGalaxy;
    MapGeometry.Galaxies = galaxies;
})(EM.MapGeometry);
//#endregion


//#region Sectors
(function (MapGeometry) {
    "use strict";
    var scale = MapGeometry.Scale;
    var galaxies = MapGeometry.Galaxies;

    var ar = EM.AssetRepository;
    var _mapItemKey = ar.MAP_ITEM_KEY;
    var _textureTypeIdKey = ar.TEXTURE_TYPE_ID_KEY;
    var _mapTypeKey = ar.MAP_TYPE_KEY;
    var _meshInfoKey = ar.MESH_INFO_KEY;
    var _meshContainerKey = ar.MESH_CONTAINER_KEY;
    var _serverDataKey = ar.SERVER_DATA_KEY;
    var sectorTextureId = 201;


    function createSectorMapItem(_super) {
        function ISectorMapItem() {
            var _self = _.extend(this, _super);
            return _self;
        }
        return new ISectorMapItem();
    }


    var sectorMapper = MapGeometry.IGeometryMaperFactory("SectorMapper", createSectorMapItem, null, MapGeometry.SECTOR_REAL_PROTONAME);

    function generateSectors(galaxyId, isGalaxyMesh, _sectors) {
        var galaxy;
        var sectors;
        if (isGalaxyMesh) galaxy = galaxyId;
        else if (!galaxies.HasSectorsInGalaxy(galaxyId) || galaxies.GalaxyInitialized(galaxyId)) return;
        else galaxy = galaxies.CreateGalaxyById(galaxyId);

        if (!galaxy) throw Errors.ClientNullReferenceException({
            galaxyId: galaxyId,
            isGalaxyMesh: isGalaxyMesh,
            _sectors: _sectors,
            galaxy: galaxy
        }, "galaxy", "MapGeometry.Sectors.Generate (generateSectors(galaxyId, isGalaxyMesh, _sectors))");

        if (_sectors) sectors = _sectors;
        else sectors = galaxies.GetSectorsByGalaxyId(galaxyId);



        var cubeLenght = 100 * scale / 4;
        //   var sectorProto = BABYLON.MeshBuilder.CreateBox(MapGeometry.SECTOR_PROTO_NAME, { size: cubeLenght }, EM.Scene);
        var sectorProto = BABYLON.MeshBuilder.CreateDisc(MapGeometry.SECTOR_PROTO_NAME, {
            radius: cubeLenght,
            tessellation: 32,
            updatable: false,
            sideOrientation: 1
        }, EM.Scene);


        sectorProto.rotation.x = -Math.PI / 2;
        _.forEach(sectors, function (sector, key) {
            var mapItem = sectorMapper.GetOrAdd(sector.Id, sector.TextureTypeId);
            var oldSector = sectorMapper.GetMeshById(mapItem.BasePartMeshId);
            if (oldSector) {
                console.log("Old sector extist", {
                    sMapedData: mapItem,
                    oldSector: oldSector,
                    sector: sector,
                    sectors: sectors,
                    galaxy: galaxy,

                });
                return;
            }
            var cloneSector = sectorProto.clone(mapItem.BasePartMeshId);

            cloneSector.material = MapGeometry.Sectors.Materials.GetRegular(sector.TextureTypeId);
            var coordObj = Utils.ObjectToVector3(sector.Position);
            cloneSector.position = coordObj;
            cloneSector.position.y += 10;
            cloneSector.parent = galaxy;



            ar.AddLocalsToMesh(cloneSector, _textureTypeIdKey, sector.TextureTypeId);
            var meshInfo = ar.GetMeshInfoByMeshId(cloneSector.id);
            ar.AddLocalsToMesh(cloneSector, _mapTypeKey, meshInfo.GetMapType());
            ar.AddLocalsToMesh(cloneSector, _meshContainerKey, meshInfo.GetMeshContainer());
            ar.AddLocalsToMesh(cloneSector, _meshInfoKey, meshInfo);
            ar.AddLocalsToMesh(cloneSector, _mapItemKey, mapItem);
            ar.AddLocalsToMesh(cloneSector, _serverDataKey, sector);


            EM.MapEvent.RegisterSectorActions(cloneSector);

        });
        sectorProto.dispose();
        EM.SetVisibleByMesh(galaxy, false);
    }

    function getMeshIdBySectorNumId(sectorNumId) {
        var item = sectorMapper.GetMapItem(sectorNumId, sectorTextureId);
        if (!item) return null;
        return item.FullMeshId;
    };

    function getMeshBySectorNumId(sectorNumId) {
        console.log("getMeshBySectorNumId", { sectorMapper: sectorMapper, sectorNumId: sectorNumId });
        return sectorMapper.GetMeshById(getMeshIdBySectorNumId(sectorNumId));
    };

    function setSectorsUnselected() {
        var csl = EM.EstateData.GetCurrentSpaceLocation();
        // console.log("setSectorsUnselected", csl);
        var sectors = galaxies.GetSectorsByGalaxyId(csl.GalaxyId);
        var regularMaterial = MapGeometry.Sectors.Materials.GetRegular();
        _.forEach(sectors, function (sectorData, key) {
            var id = sectorData.Id;
            var sectorMeshId = getMeshIdBySectorNumId(id);

            if (sectorMeshId) {
                var sectorMesh = EM.GetMesh(sectorMeshId);
                if (sectorMesh && sectorMesh.material && sectorMesh.material.id !== regularMaterial.id) {
                    sectorMesh.material = regularMaterial;
                }
            }

        });
    }

    MapGeometry.Sectors = MapGeometry._baseObject(generateSectors, null, null, sectorMapper);
    MapGeometry.Sectors.SetUnselected = setSectorsUnselected;
    MapGeometry.Sectors.GetMeshIdBySectorNumId = getMeshIdBySectorNumId;
    MapGeometry.Sectors.GetMeshBySectorNumId = getMeshBySectorNumId;


    // todo  костыль

    MapGeometry.Sectors.Materials = {
        GetRegular: function () {
            return EM.AssetRepository.GetSpaceRegularMaterial(sectorTextureId);
        },
        GetHover: function () {
            return EM.AssetRepository.GetSpaceHoverMaterial(sectorTextureId);
        },
        GetClick: function () {
            return EM.AssetRepository.GetSpaceClickMaterial(sectorTextureId);
        }
    };
})(EM.MapGeometry);

//#endregion

//#region Systems
(function (MapGeometry) {
    "use strict";
    var ar = EM.AssetRepository;
    var _mapItemKey = ar.MAP_ITEM_KEY;
    var _textureTypeIdKey = ar.TEXTURE_TYPE_ID_KEY;
    var _mapTypeKey = ar.MAP_TYPE_KEY;
    var _meshInfoKey = ar.MESH_INFO_KEY;
    var _meshContainerKey = ar.MESH_CONTAINER_KEY;
    var _serverDataKey = ar.SERVER_DATA_KEY;

    var _systemProtoMeshName = MapGeometry.SYSTEM_PROTO_NAME;
    var _typeIdKey = EM.MapData.SystemKeys.TypeId;

    function ISystemSpriteData() {
        this._coords = null;
        this.Coords = null;
        this.Id = null;
        this.NativeName = null;
        this.TextureTypeId = null;
        this.GameTypeId = null;
        this.GalaxyId = null;
        this.SectorId = null;
        this._setData = function (_serverData) {
            this._coords = _serverData.Coords;
            this.Coords = Utils.ObjectToVector3(_serverData.Coords);
            this.Id = _serverData.Id;
            this.NativeName = _serverData.NativeName;
            this.TextureTypeId = _serverData.TextureTypeId;
            this.GameTypeId = _serverData.GameTypeId;
            this.GalaxyId = _serverData.GalaxyId;
            this.SectorId = _serverData.SectorId;
            return this;
        }
    }

    var spriteData = (function () {
        var s = {
            url: Utils.CdnManager.GetBjsSprite("starSprite.png", true),
            items: 8,
            originalWidth: 2080,
            itemSize: 0,
            //nameColor: "#0a5789",
            nameColor: "#0065f0",
            typeColor: "#005cc5",
            _offsets: []
        };
        s.itemSize = s.originalWidth / s.items;
        s.getOffset = function (index) {
            return s._offsets[index];
        }
        for (var j = 0; j < s.items; j++) {
            s._offsets.push(j * s.itemSize);
        }
        s.pW = 2.9;
        s.pH = 1;
        s.ratio = s.pW / s.pH;
        s.h = s.itemSize;
        s.w = s.h * s.ratio;


        s.width = s.w + "px";
        s.height = s.h + "px";
        s.textW = (s.w * 0.5) + "px";
        s.imgW = s.itemSize + "px";
        return s;
    })();
    function _createText(panel, meshId, typeName, systemName) {
        // Adding text
        var textPanel = new BABYLON.GUI.StackPanel("text_panel_" + meshId);
        var fontFamily = "Electrolize sans-serif";
        textPanel.width = spriteData.textW;
        textPanel.isVertical = true;
        //textPanel.background = "red";
        textPanel.height = spriteData.height;
        textPanel.fontFamily = fontFamily;

        var tb1 = new BABYLON.GUI.TextBlock("text_block_name" + meshId, systemName);
        tb1.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        tb1.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        tb1.height = "50%";
        tb1.color = spriteData.nameColor;
        tb1.fontSize = "89px";

        textPanel.addControl(tb1);

        var tb2 = new BABYLON.GUI.TextBlock("text_block_type" + meshId, typeName);
        tb2.textHorizontalAlignment = tb1.textHorizontalAlignment;
        tb2.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

        tb2.height = "30%";
        tb2.color = spriteData.typeColor;
        tb2.fontSize = "60px";
        textPanel.addControl(tb2);
        panel.addControl(textPanel);


    };

    function _createButton(panel, meshId, index) {
        var btn = BABYLON.GUI.Button.CreateImageOnlyButton("btn_" + meshId, spriteData.url);
        btn.thickness = 0;
        btn.width = spriteData.imgW;
        btn.height = spriteData.height;

        //  btn.linkOffsetX ="-10px";
        //btn.background = "blue";
        var img = btn.children[0];
        img.stretch = BABYLON.GUI.Image.STRETCH_NONE;
        img.sourceWidth = spriteData.itemSize;
        img.sourceHeight = spriteData.itemSize;
        img.sourceLeft = spriteData.getOffset(index);//2080;
        img.sourceTop = 0;
        img.width = img.height = spriteData.height;
        img.scaleY = 1.4;
        img.scaleX = 1;
        //img.top = "4px";
        img.left = "-10%";
        panel.addControl(btn);

    }

    function _createContainer(meshId, typeName, systemName, spriteIndex, advancedTextureContainer) {
        //   advancedTextureContainer.renderAtIdealSize = true;
        var panel = new BABYLON.GUI.StackPanel("container_" + meshId);
        panel.isVertical = false;
        panel.thickness = 0;
        panel.width = spriteData.width;
        panel.height = spriteData.height;
        _createText(panel, meshId, typeName, systemName);
        _createButton(panel, meshId, spriteIndex);
        advancedTextureContainer.addControl(panel);
    }


    function _createSystemSpriteMappItem(_super) {

        /**
         * BEGIN EQUAL
         * this._nodeSpriteMeshId - (meshId ==> BABYLON.Mesh) === sprite.id  (sprite==> BABYLON.Sprite2D)
         * ===   EM.AssetRepository.GetSpaceSpriteMesh(systemTextureId/startextureId, systemId/starId, MapGeometry.SYSTEM_PROTO_NAME)  
         * ===   EM.AssetRepository.GetSpaceSpriteMeshContainer(MapGeometry.SYSTEM_PROTO_NAME)._getBaseSpriteId(systemId/starId)
         * ===   IGeometryMapItem[EM.AssetRepository.MESH_CONTAINER_KEY] --  meshContainer  . _getBaseSpriteId(systemId/starId) ---- 
         * END EQUAL
         *  _super - base class  IGeometryMapItem
         * @returns {ISystemSpriteMappItem}  болванка без данных (кроме константных)
         * -- данные устанавливаются через вызов метода  this.CreateSprite (serverDataItem, parentMesh) 
         */
        function ISystemSpriteMappItem() {
            var _self = _.extend(this, _super);
            _self._serverSystemData = new ISystemSpriteData();
            _self._nodeSpriteMeshId = null;
            _self._spriteCreated = false;
            _self._sectorId = null;
            _self._systemId = null;
            _self._advancedTexture = null;
            _self.CreateSprite = function (serverDataItem, parentMesh) {
                if (_self._spriteCreated) {
                    var _mesh = _self.GetMeshById(_self._nodeSpriteMeshId);
                    if (_mesh) return _mesh;
                    else {
                        throw console.log("_self._spriteCreated, but mesh not exist");
                    }
                }
                //console.log("data", {
                //    serverDataItem: serverDataItem
                //});
                var data = _self._serverSystemData._setData(serverDataItem);
                _self._sectorId = data.SectorId;
                _self._systemId = data.Id;
                var mc = _self[EM.AssetRepository.MESH_CONTAINER_KEY];
                var meshId = mc._getBaseSpriteId(data.Id);
                var system = parentMesh.clone(meshId);
                system.position = data.Coords;
                // system.scaling = new BABYLON.Vector3(3000, 3000, 3000);
                system.scalingDeterminant = 3000;
                _self._nodeSpriteMeshId = system.id;

                var advancedTexture = _self._advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(system, spriteData.w, spriteData.h, false);
                _createContainer(system.id, "SYSTEM", data.NativeName, mc._spriteIndex, advancedTexture);

                system.onDisposeObservable.add(function () {
                    //   console.log("onDisposeObservable");
                    if (system.material) {
                        system.material.dispose(true, true);
                        system.material = null;
                        delete system.material;
                        console.log(" mesh.material");
                        advancedTexture.dispose();
                    }
                    // system.onDisposeObservable.remove(this);

                });

                ar.AddLocalsToMesh(system, _textureTypeIdKey, data.TextureTypeId);
                var meshInfo = ar.GetMeshInfoByMeshId(system.id);
                var mapType = meshInfo.GetMapType();

                ar.AddLocalsToMesh(system, _mapTypeKey, mapType);
                ar.AddLocalsToMesh(system, _meshContainerKey, mc);
                ar.AddLocalsToMesh(system, _meshInfoKey, meshInfo);
                ar.AddLocalsToMesh(system, _mapItemKey, _self);
                ar.AddLocalsToMesh(system, _serverDataKey, _self._serverSystemData);
                //  console.log("system", system);
                //  system.material.alpha =0.7;
                if (system.material && system.material.emissiveTexture) {
                    system.material.emissiveTexture.level = 0.95;
                }
                EM.MapEvent.RegisterSystemsActions(system);
                _self._spriteCreated = true;

                return system;

            };
            _self.GetSpriteNodeMesh = function () {
                if (!_self._nodeSpriteMeshId) return null;
                return _self.GetMeshById(_self._nodeSpriteMeshId);
            }
            _self._dispose = function () {
                var _mesh = _self.GetMeshById(_self._nodeSpriteMeshId);
                if (!_mesh) return;
                _mesh.dispose();
            };
            _self.setVisible = function (show) {
                EM.SetVisible(_self._nodeSpriteMeshId, show);
            };

            return _self;
        }
        return new ISystemSpriteMappItem();
    }

    function _disposeItem(item, itemKey) {
        item._dispose();
    }
    var systemsMapper = MapGeometry.IGeometryMaperFactory("SystemSpriteMapper", _createSystemSpriteMappItem, null, _systemProtoMeshName, function (textureId, uniqueId) {
        return ar.GetSpaceSpriteMeshContainer(textureId);
    });
    systemsMapper.Destroy = function (sectorId) {
        if (!systemsMapper.Count) return;
        if (sectorId) {
            systemsMapper._cleanPerItem(_disposeItem, function (item) {
                return item._sectorId === sectorId;
            });
        }
        else systemsMapper._cleanPerItem(_disposeItem);
    }

    function _setVisible(show) {
        EM.Particle.ShowOrHideSectorParticles(show);
        _.forEach(systemsMapper._collection, function (item) {
            item.setVisible(show);
        });
    }

    function _getProtoMesh() {
        var protoMesh = systemsMapper.GetMeshById(_systemProtoMeshName);
        if (!protoMesh) {
            protoMesh = BABYLON.MeshBuilder.CreatePlane(_systemProtoMeshName, { width: spriteData.pW, height: spriteData.pH }, EM.Scene);
            protoMesh.isVisible = false;
            protoMesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
            protoMesh.updatable = true;

        }
        return protoMesh;
    }


    function _generateSystems(callback) {
        var data = EM.MapData.Systems;
        var starsSystemsProto = _getProtoMesh();
        _.forEach(data, function (itemData, key) {
            var item = systemsMapper.GetOrAdd(itemData.Id, itemData.TextureTypeId);
            item.CreateSprite(itemData, starsSystemsProto);
        });
        _setVisible(false);
        if (callback instanceof Function) callback();
    }

    var systems = MapGeometry._baseObject(_generateSystems, systemsMapper.Destroy, _setVisible);

    systems.NeedNewSystems = function () {
        if (!systemsMapper.Count) return true;
        var csl = EM.EstateData.GetCurrentSpaceLocation();
        console.log("needNewSystems", {
            "MapData.GetSystems.DataSectorId": EM.MapData.GetSystems.DataSectorId,
            "csl.SectorId": csl.SectorId
        });
        if (EM.MapData.GetSystems.DataSectorId === csl.SectorId) return false;
        else return true;
    };

    systems.GetSpriteMeshByStarId = function (starId) {
        var item = _.find(systemsMapper._getAll(), function (o) {
            return o._systemId === starId;
        });
        if (!item) return null;
        var mesh = item.GetSpriteNodeMesh();
        //  console.log("systems.GetSpriteMeshByStarId", { item: item, systemsMapper: systemsMapper, mesh: mesh });
        return mesh;
    }

    MapGeometry.Systems = systems;
})(EM.MapGeometry);
//#endregion

//#region System
(function (MapGeometry) {
    "use strict";
    var system = MapGeometry._baseObject();
    var ar = EM.AssetRepository;
    system.CallBack = null;
    system.StarRadius = null;
    var config = EM.MapData.SystemKeys;
    var types = MapGeometry.MapTypes;
    var PMCRK = system.PLANETOID_MIN_CAMERA_RADIUS_KEY = "_minCameraRadius";
    var showLog = false;
    function _log(key, data, type) {
        if (!showLog) return;
        console.log("__system.generate__" + type + "__" + key + "__   ", { data: data });
    }

    var starMeshIds = {};
    var planetMeshIds = {};
    var moonMeshIds = {};


    function _prepareColor(baseMaterialColor, dataColor) {
        var _dataColor = Utils.ObjectToColor3(dataColor);
        var cd = Utils.Color3IntToDecimal(_dataColor, 0.2);
        cd.r += baseMaterialColor.r;
        cd.g += baseMaterialColor.g;
        cd.b += baseMaterialColor.b;

        cd.r = cd.r > 1 ? 1 : cd.r;
        cd.g = cd.g > 1 ? 1 : cd.g;
        cd.b = cd.b > 1 ? 1 : cd.b;
        return cd;
    }

    system.getMinCameraRadiusByMesh = function (mesh) {
        var locals = ar.GetLocalsFromMesh(mesh, PMCRK);
    }



    // todo  important!!!! иначе дрожит камера
    var SCALE_SYSTEM = 15;

    function createPlanetoidMeshId(textureTypeId, uniqueId) {
        return ar.CreateSpaceRegularMeshId(textureTypeId, uniqueId);
        //  return ar.GetSpaceRegularMeshId(textureTypeId, uniqueId);
    }

    function createActivePlanetMeshId(textureTypeId, uniqueId) {
        var meshContainer = ar.GetSpaceRegularMeshContainer(textureTypeId);
        var baseMesh = meshContainer.GetMesh();
        var baseMeshId = baseMesh.id;
        var childId = meshContainer.GetMeshId(uniqueId, baseMeshId);
        console.log("createActivePlanetMeshId", childId);
        return childId;

    }

    function _setScale(mesh, scaneNum) {
        return EM.SetScaleToMesh(mesh, scaneNum);
    }


    function generate() {
        var _textureTypeIdKey = ar.TEXTURE_TYPE_ID_KEY;
        var _mapTypeKey = ar.MAP_TYPE_KEY;
        var _meshInfoKey = ar.MESH_INFO_KEY;
        var _meshContainerKey = ar.MESH_CONTAINER_KEY;
        var _serverDataKey = ar.SERVER_DATA_KEY;
        var _laerNames = ar.LAYER_NAMES;
        var _subMeshNames = ar.SUBTYPE_MESH_NAMES;


        //  var hl = MapGeometry.Effects.Hl;
        //    hl.Create();

        if (!EM.MapData.System) return false;
        //console.log("System.generate");
        function _addChildrenDataToLocals(parentMesh, childData) {
            parentMesh._localData._serverData.Children[childData.Id] = childData;
        }

        function _addLocals(mesh, meshContainer, serverData, radius) {
            ar.AddLocalsToMesh(mesh, _textureTypeIdKey, serverData.TextureTypeId);
            var meshInfo = ar.GetMeshInfoByMeshId(mesh.id);
            ar.GetOrAddLoacalsInMesh(mesh, _mapTypeKey, meshInfo.GetMapType());
            ar.AddLocalsToMesh(mesh, _meshContainerKey, meshContainer);
            ar.AddLocalsToMesh(mesh, _meshInfoKey, meshInfo);
            ar.AddLocalsToMesh(mesh, _serverDataKey, serverData);

            var minCameraRadius = radius * 3 * SCALE_SYSTEM;
            var _min = EM.GameCamera.System.lowerRadiusLimit;
            if (_min > minCameraRadius) {
                minCameraRadius = _min;
            }
            ar.AddLocalsToMesh(mesh, PMCRK, minCameraRadius);
        }

        function _rgisterPdActions(mesh) {
            EM.MapEvent.RegisterPlanetoidActions(mesh);
        }

        function _cloneMaterial(mesh, baseMaterial, uniqueId) {

            var cloneMaterial = ar.CloneMaterial(mesh, baseMaterial, uniqueId);
            if (mesh.material) {
                //todo  нельзя диспосить ничего, в данных меша пока хратится клоне меш и  ссылка на исходный материал
                //mesh.material.dispose(true, true);
                //delete mesh.material;
            }
            //console.log("_cloneMaterial", {
            //    cloneMaterial: cloneMaterial,
            //    mat: mesh.material,
            //    mesh: mesh,
            //});
            mesh.material = cloneMaterial;
            return cloneMaterial;
        }

        function _cloneBaseMesh(meshContainer, uniqueId) {
            //console.log("_cloneBaseMesh", {
            //    meshContainer: meshContainer,
            //    uniqueId: uniqueId,
            //});
            var baseMesh = meshContainer.GetMesh();
            if (!baseMesh) {
                throw Errors.ClientNullReferenceException({
                    meshContainer: meshContainer,
                    baseMesh: baseMesh
                });
            }
            var meshId = meshContainer.GetMeshId(uniqueId);
            var mesh = baseMesh.clone(meshId);
            //mesh.makeGeometryUnique();
            return mesh;
        }


        /**
         *  
         * see   _addLocals
         *  see    EM.AssetRepository.BindDisposeFullMesh
         * @param {object} mesh 
         * @param {object} meshContainer 
         * @param {object} serverData 
         * @returns {object}   BABYLON.Mesh
         */
        function _onCreatePlanetoid(mesh, meshContainer, serverData, radius) {
            if (!serverData.Children) serverData.Children = {};
            _addLocals(mesh, meshContainer, serverData, radius);
            EM.AssetRepository.BindDisposeFullMesh(mesh);
            return mesh;
        }

        function createOrbit(data, parent, scale) {
            var radiusOrbit = data[config.Orbit] * scale;
            var connectionPlanet = data[config.NativeName];
            var meshId = "orbit_" + connectionPlanet;
            //  var tes = 359;
            var tes = 89;
            var pi2 = Math.PI * 2;
            var step = pi2 / tes;
            //  var step = _.round(pi2 / tes, 5);
            var path = [];
            for (var i = 0; i < pi2; i += step) {
                var x = radiusOrbit * Math.cos(i);
                var z = radiusOrbit * Math.sin(i);
                var y = 0;
                path.push(new BABYLON.Vector3(x, y, z));

            }
            path.push(path[0]);

            //var orbit = BABYLON.Mesh.CreateDashedLines(meshName, path, 1, 2, tes * 1.5, EM.Scene, true);
            var orbit = BABYLON.MeshBuilder.CreateLines(meshId, { points: path }, EM.Scene);

            //todo 0-1 generate 
            //  console.log(data[config.OrbitAngle]);
            orbit.rotation = Utils.ObjectToVector3(data[config.OrbitAngle]);

            orbit.isEnabled(1);
            orbit.isPickable = false;
            orbit.color = BABYLON.Color3.White();
            orbit.alpha = 0.05;
            orbit.parent = parent;
            return {
                coord: path,
                orbit: orbit
            };

        }

        function _getOrbitPosition(dataOrbitPosition, coords) {
            if (dataOrbitPosition < 0) {
                throw new Error("_getOrbitPosition dataOrbitPosition< 0");
            }
            if (coords[dataOrbitPosition]) {
                return coords[dataOrbitPosition].clone();
            }
            else {
                return _getOrbitPosition(dataOrbitPosition - 1, coords);
            }
        }
        function createAxis(data, parent, type) {
            var axisName = _.join(["axis", type.toLowerCase(), parent.orbit.id], "_");
            var angle = Utils.ObjectToVector3(data.AxisAngle);
            var length = _.round(data[config.Radius] * 1.5, 4);
            var line = [new BABYLON.Vector3(0, -length, 0), new BABYLON.Vector3(0, length, 0)];
            var axis = BABYLON.MeshBuilder.CreateLines(axisName, { points: line }, EM.Scene);

            var orbitPosition = data[config.OrbitPosition];
            axis.position = _getOrbitPosition(orbitPosition, parent.coord);
            axis.rotation = angle;
            // axis.position = parent.coord[0]; 

            axis.isPickable = false;
            axis.isVisible = false;

            axis.parent = parent.orbit;
            return axis;
        }


        function _createMeshPlanetoid(textureTypeId, diameter, meshContainer, uniqueId) {
            var meshId = meshContainer.GetMeshId(uniqueId);
            var planetoidMesh = BABYLON.Mesh.CreateSphere(meshId, 16, diameter, EM.Scene);
            _cloneMaterial(planetoidMesh, ar.GetSpaceRegularMaterial(textureTypeId), uniqueId);
            return planetoidMesh;
        }

        function createBasePlanetoid(serverDataItem, planetoidType) {
            var textureTypeId = serverDataItem["TextureTypeId"];
            var _radius = serverDataItem[config.Radius];

            var diametr = _radius * 2;
            var meshContainer = ar.GetSpaceRegularMeshContainer(textureTypeId);
            var mesh = _createMeshPlanetoid(textureTypeId, diametr, meshContainer, serverDataItem.Id);

            if (planetoidType === types.Star) {
                system.StarRadius = _radius;
                mesh.position = Utils.ObjectToVector3(serverDataItem[config.Coords]);
                //scattering light effect
                //   object.material = RepoTexturesAndImgList.GetSpaceRegularMaterial(textureTypeId);
                MapGeometry.Effects.Scattering.SetStar(mesh);
                EM.SpaceState.LastActiveStarSystem = mesh.id;
            }
            mesh.isVisible = true;
            mesh.isPickable = true;


            _onCreatePlanetoid(mesh, meshContainer, serverDataItem, _radius);
            _rgisterPdActions(mesh);
            return mesh;
        }

        function createPlanetCloud(cloudMeshContainer, serverPlanetData) {
            var textureTypeId = serverPlanetData.TextureTypeId;
            var planetId = serverPlanetData.Id;
            var _cloudMesh = _cloneBaseMesh(cloudMeshContainer, planetId);
            _cloneMaterial(_cloudMesh, ar.GetSpaceCloudMaterial(textureTypeId), planetId);
            _cloudMesh.isVisible = true;
            return _cloudMesh;
        }

        //#region Planetoids initialize


        function createMoons(moonsData, planetMesh) {
            _.forEach(moonsData, function (moonData, idx) {
                var moonId = moonData.Id;
                var moonOrbit = createOrbit(moonData, planetMesh, 2);
                var moonAxis = createAxis(moonData, moonOrbit, types.Moon); //
                var moon = createBasePlanetoid(moonData, types.Moon);
                moon.parent = moonAxis;
                _addChildrenDataToLocals(planetMesh, moonData);
                if (!moonMeshIds[moonId]) moonMeshIds[moonId] = moon.id;

            });

        }


        function _createPlanetoidLabel(axisMesh, planetoidRadius, planetoidName) {
            //https://www.babylonjs-playground.com/#ESI1DK
            var labelId = axisMesh.id + "_label";

            var planeSize = planetoidRadius * 2 * SCALE_SYSTEM;

            var plane = BABYLON.Mesh.CreatePlane(labelId, planeSize);
            plane.position.y = axisMesh.geometry.extend.maximum.y * 0.5;
            plane.position.x = plane.position.z = 0;
            //var lableH = 1024;
            var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);
            var label = new BABYLON.GUI.TextBlock();
            label.text = planetoidName;
            label.color = "#0065f0";
            label.fontSize = "128px";
            label.fontFamily = "Electrolize sans-serif bold"; //Play

            label.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            advancedTexture.addControl(label);
            label.linkWithMesh(axisMesh);
            //plane.scaling = planetMesh.scaling.clone();
            plane.parent = axisMesh;
            plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;


        }

        function _cteateStarLabel(starMesh, starData) {
            //https://www.babylonjs-playground.com/#ESI1DK
            //console.log("starData", { starMesh: starMesh, starData: starData });
            var radius = starData.Radius;

            var labelId = starMesh.id + "_label";
            var w = radius * 2;
            var h = w / 4;
            var plane = BABYLON.MeshBuilder.CreatePlane(labelId, { width: w * SCALE_SYSTEM, height: h * SCALE_SYSTEM }, EM.Scene);
            plane.position.y += radius * 1.5;
            plane.position.x = plane.position.z = 0;
            //var lableH = 1024;
            var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);
            var fontSize = 256;
            advancedTexture.idealWidth = fontSize * 5;
            var label = new BABYLON.GUI.TextBlock();
            label.text = starData.NativeName;
            label.color = "#0065f0";
            label.fontSize = fontSize * 1.7;
            label.fontFamily = "Electrolize  sans-serif bold";
            //label.shadowColor = "red";
            //label.shadowBlur = 50;
            //label.shadowOffsetX = 5;
            //label.shadowOffsetY = 10;
            label.scaleY = 4;
            label.resizeToFit = true;
            label.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            advancedTexture.addControl(label);
            plane.parent = starMesh;
            plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
            EM.AssetRepository.BindDisposeFullMesh(plane, function () {
                advancedTexture.removeControl(label);
                advancedTexture.dispose();


            },
                function () {
                    console.log("after dispose", { plane: EM.GetMesh(labelId), label: label });
                });

        };


        function createPlanes(centerStar) {
            var planetsData = EM.MapData.System[config.Planets];
            var moonsData = EM.MapData.System[config.Moons];
            _.forEach(planetsData, function (planetData, idx) {
                var planetId = planetData.Id;
                var textureTypeId = planetData["TextureTypeId"];
                var _radius = planetData[config.Radius] * 1;
                var diametr = _radius * 2;
                var planetOrbit = createOrbit(planetData, centerStar, 1);

                var planetAxis = createAxis(planetData, planetOrbit, types.Planet);
                //console.log("planetAxis", planetAxis.id);

                var ti = ar.GetTypeItem(textureTypeId);



                var layer = ti.GetLayer(_laerNames.space);


                var meshRegularContainer = layer.GetMeshContainer(_subMeshNames.regular);


                //main planet
                var planetMesh = _cloneBaseMesh(meshRegularContainer, planetId);
                var planetMaterial = _cloneMaterial(planetMesh, ar.GetSpaceRegularMaterial(textureTypeId), planetId);
                //console.log("createPlanes", {
                //    planetData: planetData,
                //    ti: ti,
                //    textureTypeId: textureTypeId,
                //    planetMaterial: planetMaterial,
                //    planetMesh: planetMesh,
                //});

                var color = _prepareColor(planetMaterial.emissiveColor, planetData["Color"]);
                planetMaterial.emissiveColor = color.clone();
                if (planetMaterial.emissiveFresnelParameters) {
                    planetMaterial.emissiveFresnelParameters.leftColor = color.clone();
                }


                planetMesh.isVisible = true;
                planetMesh.isPickable = true;


                planetMesh.parent = planetAxis;
                planetMesh.rotation = new BABYLON.Vector3.Zero();

                _addChildrenDataToLocals(centerStar, planetData);


                _onCreatePlanetoid(planetMesh, meshRegularContainer, planetData, _radius);



                _setScale(planetMesh, _radius);
                _rgisterPdActions(planetMesh);

                //cloud
                var cloudMeshContainer = layer.GetMeshContainer(_subMeshNames.cloud);

                var cloudScale = cloudMeshContainer._cloudScaling;
                var cloudRadius = cloudScale * _radius;


                var cloudMesh = createPlanetCloud(cloudMeshContainer, planetData);

                _setScale(cloudMesh, cloudRadius);

                cloudMesh.isPickable = false;
                cloudMesh.parent = planetAxis;
                EM.AssetRepository.BindDisposeFullMesh(cloudMesh);

                //EM.AssetRepository.BindDisposeFullMesh(planetOrbit);



                if (layer.RenderOption) {
                    var renderKey = ar.BEFORE_RENDER_SPACE_PLANET_ACTION_KEY;
                    var ro = layer.RenderOption.StartOnBeforeRender(planetId, renderKey, {
                        cloud: cloudMesh,
                        planet: planetMesh
                    });
                    centerStar.onDisposeObservable.add(function (_centerStar, maskItem, insertFirst) {
                        ro.StopBeforeRender(planetId);
                    });

                }

                // rings
                if (planetData.Rings) {
                    //particle
                    var sps = EM.Particle.SaturnRings.createRings(planetAxis, planetData.Radius, 400);
                    sps.vars.startRingRotation();
                }
                EM.AssetRepository.BindDisposeFullMesh(planetAxis);

                //label лейбл не подходит как дизайн. из  за пересечения с эффектом стар скаттеринга.
                //_createPlanetoidLabel(planetAxis, cloudRadius, planetData.NativeName);

                //moons
                var _moonsData = _.filter(moonsData, ["Parent", planetId]);
                if (_moonsData.length) {

                    createMoons(_moonsData, planetMesh);
                }

                if (!planetMeshIds[planetId]) planetMeshIds[planetId] = planetMesh.id;
                //  createAtmosphere(color, planet);


            });


            function logRequest() {
                var r = new Utils.Request("/api/test/AbsPlanets/", function (a) {
                    var planets = {};
                    _.forEach(a, function (d, key) {
                        planets[d.Id] = {
                            server: {
                                id: d.Id,
                                position: d.position
                            },
                            client: tmp[d.Id]
                        };

                    });
                    Utils.SaveLogToFile(planets, "planetsCoord");
                }, {});
                r.getJson();
            }


        }

        function createStars() {
            var starsData = EM.MapData.System[config.Stars];
            var star = null;
            var starKeys = Object.keys(starsData);
            var length = starKeys.length;
            if (!length) {
                console.log("star not exist!!!");
                return null;
            }
            if (length > 1) {
                //Todo  что то делаем с 2 мя звездами для расчета центра системы 
            } else if (length === 1) {
                var starId = starKeys[0];
                var curStarData = starsData[starId];
                star = createBasePlanetoid(curStarData, types.Star);
                if (!starMeshIds[curStarData.Id]) starMeshIds[curStarData.Id] = star.id;
                _cteateStarLabel(star, curStarData);
            }

            return star;
        }


        var centerStarMesh = createStars();

        createPlanes(centerStarMesh);


        //console.log("base scaling", {
        //    x: centerStarMesh.scaling.x
        //});
        centerStarMesh.scaling = new BABYLON.Vector3(SCALE_SYSTEM, SCALE_SYSTEM, SCALE_SYSTEM);
        //#endregion

        if (system.CallBack instanceof Function) {
            _log("system.CallBack instanceof Function", system.CallBack, "generate");
            system.CallBack();
            system.CallBack = null;
        }
        _log("GENERATE", "DONE", "generate");
        return true;
    }

    function destroy() {
        //console.log("MapGeometry.System.destroy. EM.SpaceState.LastActiveStarSystem", EM.SpaceState.LastActiveStarSystem);
        if (!EM.SpaceState.LastActiveStarSystem) return;
        var lastSystem = EM.GetMesh(EM.SpaceState.LastActiveStarSystem);
        if (lastSystem) {
            //console.log("EM.SpaceState.LastActiveStarSystem", {
            //    lastSystem: lastSystem
            //});

            //  EM.SetVisibleByMesh(lastSystem, false);
            lastSystem.dispose();
            EM.SpaceState.LastActiveStarSystem = null;
            EM.Scene.resetCachedMaterial();
            lastSystem = null;
        }
    }

    function getOrCreateStarMeshId(uniqueId, textureTypeId, saveIfNotExist) {
        var meshId = starMeshIds[uniqueId];
        if (!meshId) {
            meshId = createPlanetoidMeshId(textureTypeId, uniqueId);
            if (meshId && textureTypeId && saveIfNotExist) {
                starMeshIds[uniqueId] = meshId;
            }
        }
        return meshId;

    }

    function getStarStatus(uniqueStarId, textureTypeId) {
        var meshId;
        if (textureTypeId) {
            meshId = getOrCreateStarMeshId(uniqueStarId, textureTypeId);
        }
        else {
            meshId = system.GetStarMeshIdByUniqueId(uniqueStarId);
        }

        var mesh = MapGeometry._chekAndGetMeshInScene(meshId);
        if (mesh) return mesh.isVisible;
        return false;
    }


    system.CreatePlanetoidMeshId = createPlanetoidMeshId;

    system.Generate = generate;
    system.Destroy = destroy;
    system.GetStarStatus = getStarStatus;
    system.GetOrCreateStarMeshId = getOrCreateStarMeshId;
    system.GetPlanetMeshIdByUniqueId = function (uniqueId) {
        return planetMeshIds[uniqueId];
    };
    system.GetMoonMeshIdByUniqueId = function (uniqueId) {
        return moonMeshIds[uniqueId];
    };
    system.GetStarMeshIdByUniqueId = function (uniqueId) {
        return starMeshIds[uniqueId];
    };
    system.GetOrCreatePlanetMeshId = function (uniqueId, textureTypeId, saveIfNotExist) {
        //"404_space_1.404_space"
        var meshId = system.GetPlanetMeshIdByUniqueId();
        if (!meshId && textureTypeId) {
            var meshContainer = ar.GetSpaceRegularMeshContainer(textureTypeId);
            var parentMesh = meshContainer.GetMeshId();
            meshId = meshContainer.GetMeshId(uniqueId, parentMesh);
            if (meshId && saveIfNotExist) {
                planetMeshIds[uniqueId] = meshId;
            }
        }
        return meshId;
    };
    MapGeometry.System = system;

    /**
     * 
     * @param {int||string||object||BABYLON.Mesh} anySystem 
     *  systemId,
     *  meshName,
     *  object with systemId by key Id or id or uniqueId or UniqueId,
     *  mesh,
     * @returns {int} systemId
     * @throws  [ClientNotImplementedException]
     */
    MapGeometry.GetSystemIdFromAny = function (anySystem) {
        var _id = MapGeometry.GetUniqueIdFromAny(anySystem);
        if (typeof _id === "number") return _id;
        if (typeof _id === "string" && _id.length >= 5) {
            var item = ar.GetMeshInfoByMeshId(_id);
            if (item.UniqueId) return item.UniqueId;
            // todo  как кликаем сектора                                                        

        }
        throw Errors.ClientNotImplementedException({
            _id: _id,
            anySystem: anySystem
        }, "_id");
    }
})(EM.MapGeometry);
//#endregion

//#region Effects HL
(function (MapGeometry) {
    "use strict";
    var hl = {};
    hl._name = "hl1";
    hl.HighlightLayer = null;
    var created = false;

    function getMesh(meshId) {
        return EM.GetMesh(meshId);
    }

    function setBlur(h, w) {
        hl.HighlightLayer.blurHorizontalSize = h;
        hl.HighlightLayer.blurVerticalSize = w ? w : h;
    }

    function create(h, w) {
        //        console.log("created", created);
        if (!created) {
            hl.HighlightLayer = new BABYLON.HighlightLayer(hl._name, EM.Scene);
            hl.HighlightLayer.innerGlow = true;
            setBlur((h ? h : 1), (w ? w : 0.5));
            created = true;
        }
    }

    function updateMeshColor(meshId, color3Int) {
        hl.HighlightLayer._meshes[meshId].color = BABYLON.Color4.FromInts(color3Int.r, color3Int.g, color3Int.b, 255);
    }

    function hasMeshInInstance(mesh) {
        var meshes = hl.HighlightLayer._meshes;
        return meshes.hasOwnProperty(mesh.id) && meshes[mesh.id];

    }

    function addMesh(mesh, color3Int) {
        if (hasMeshInInstance(addMesh) && color3Int) {
            console.log("exist!!");
            updateMeshColor(mesh.id, color3Int);
        } else {
            var observer = mesh.onDisposeObservable.add(function (observerMesh, mask, insertFirst) {
                if (observerMesh.id === mesh.id) {
                    hl.HighlightLayer.removeMesh(mesh);
                    observerMesh.onBeforeRenderObservable.remove(observer);
                }

            });
            hl.HighlightLayer.addMesh(mesh, (color3Int ? BABYLON.Color4.FromInts(color3Int.r, color3Int.g, color3Int.b, 255) : new BABYLON.Color4(1, 1, 1, 1)));
        }


    }

    function addMeshById(meshId, color3Int) {
        addMesh(getMesh(meshId), color3Int);
    }

    function cleanAll() {
        _.forEach(hl.HighlightLayer._meshes, function (mesh, meshId) {
            hl.HighlightLayer.removeMesh(getMesh(meshId));
        });
    }

    /**
     * Ищет в сцене меш по имени элемента и удаляет его из инста эфекта: ["meshId1","meshId2"]
     * @param {array} list  array<string>
     * @returns {void}  void
     */
    function removeByListNames(list) {
        _.forEach(list, function (meshId, meshKey) {
            hl.HighlightLayer.removeMesh(getMesh(meshId));
        });
    }

    hl.SetBlur = setBlur;
    hl.Create = create;
    hl.AddMesh = addMesh;
    hl.AddMeshById = addMeshById;
    hl.RemoveByListNames = removeByListNames;
    hl.CleanAll = cleanAll;
    hl.UpdateMeshColor = updateMeshColor;

    MapGeometry.Effects.Hl = hl;


})(EM.MapGeometry);

//#region Effects Scattering 
(function (MapGeometry) {
    "use strict";
    var _starScattering;
    var scattering = {
        //StarScattering effect 
        SetStar: function (mesh) {
            if (!_starScattering) {
                _starScattering = new BABYLON.VolumetricLightScatteringPostProcess("godrays", 1.0, EM.GameCamera.Camera, mesh, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, EM.Engine, false);
                //star.exposure = 0.2;
                //star.decay = 0.96815;
                //star.weight = 1.5;
                //star.density = 1.1;  
            } else _starScattering.mesh = mesh;
        }

    };
    MapGeometry.Effects.Scattering = scattering;
})(EM.MapGeometry);
//#endregion




