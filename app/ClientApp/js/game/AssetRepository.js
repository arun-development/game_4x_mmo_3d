//новое https://github.com/BabylonJS/Babylon.js/releases
EM.AssetRepository = {
    TypeList: {
        lavaMat: function () {
            "use strict";
            var dir = Utils.CdnManager.GetBabylonMaterialesCatalog("lava");
            var material = new BABYLON.LavaMaterial(dir, EM.Scene);
            material.noiseTexture = new BABYLON.Texture(dir + "cloud.png", EM.Scene); // Set the bump texture
            material.diffuseTexture = new BABYLON.Texture(dir + "lavatile.jpg", EM.Scene); // Set the diffuse texture
            material.speed = 0.01;
            this._groundMaterial = material;
            return this._groundMaterial;
        },
        whaterMat: function (groundMesh, skybox) {
            "use strict";
            if (!groundMesh) throw Utils.Console.Error("AssetRepository.TypeList.whaterMat ground mesh not exsit");
            var catalog = Utils.CdnManager.GetBabylonMaterialesCatalog();
            var path = catalog + "waterbump.png";
            var material = new BABYLON.WaterMaterial("whaterMat", EM.Scene);
            material.bumpTexture = new BABYLON.Texture(path, EM.Scene); // Set the bump texture 
            material.windForce = 10; // Represents the wind force applied on the water surface
            material.waveHeight = 0.1; // Represents the height of the waves
            material.bumpHeight = 1; // According to the bump map, represents the pertubation of Reflection and refraction
            material.windDirection = new BABYLON.Vector2(1.0, 1.0); // The wind direction on the water surface (on width and height)
            material.waterColor = new BABYLON.Color3(0.1, 0.2, 0.2); // Represents the water color mixed with the reflected and refracted world
            material.colorBlendFactor = 4.0; // Factor to determine how the water color is blended with the reflected and refracted world
            material.waveLength = 0.1; // The lenght of waves. With smaller values, more waves are generated
            if (!skybox) skybox = EM.GetMesh(EM.AssetRepository.NUBULA_BOX_MESH_ID);
            material.addToRenderList(skybox);
            material.addToRenderList(groundMesh);
            // ... etc.
            this._groundMaterial = material;
            return this._groundMaterial;
        }
    },
    MAP_TYPE_KEY: "_mapTypeInfo",
    MESH_CONTAINER_KEY: "_meshContainer",
    TEXTURE_TYPE_ID_KEY: "_textureTypeId",
    SERVER_DATA_KEY: "_serverData",
    MESH_LOCALS_KEY: "_localData",
    MESH_INFO_KEY: "_meshInfo",
    MAP_ITEM_KEY: "_mapItem",
    MATERIALES_KEY: "_materiales",
    BEFORE_RENDER_SPACE_PLANET_ACTION_KEY: "space_planet",
    NUBULA_BOX_MESH_ID: null

};

//#region common 

//#region common  MeshLocals
(function (ar) {
    "use strict";

    var _mlKey = ar.MESH_LOCALS_KEY;
    function getLocalsFromMesh(mesh, advancedKey, returnLocalsIfAdvancedNull) {
        if (mesh.hasOwnProperty(_mlKey)) {
            var locals = mesh[_mlKey];
            if (!advancedKey) return locals;
            if (locals.hasOwnProperty(advancedKey)) return locals[advancedKey];
            if (returnLocalsIfAdvancedNull) return locals;
            return null;
        }
        return null;
    }

    function addLocalsToMesh(mesh, advancedKey, val) {
        if (!mesh[_mlKey]) mesh[_mlKey] = {};
        mesh[_mlKey][advancedKey] = val;
    }

    function hasLocalsInMesh(mesh, advancedKey, checkAdvancedValue) {
        var key = ar.MESH_LOCALS_KEY;
        if (!mesh) return false;
        if (_.isEmpty(mesh[key])) return false;
        if (!advancedKey) return true;
        if (!checkAdvancedValue && mesh[key].hasOwnProperty(advancedKey)) return true;
        return !_.isEmpty(mesh[key][advancedKey]);
    };

    function getOrAddLoacalsInMesh(mesh, advancedKey, val) {
        if (!hasLocalsInMesh(mesh, advancedKey)) addLocalsToMesh(mesh, advancedKey, val);
        return getLocalsFromMesh(mesh, advancedKey);

    }

    ar.GetLocalsFromMesh = getLocalsFromMesh;
    ar.AddLocalsToMesh = addLocalsToMesh;
    ar.HasLocalsInMesh = hasLocalsInMesh;
    ar.GetOrAddLoacalsInMesh = getOrAddLoacalsInMesh;

})(EM.AssetRepository);
//#endregion; 

//#region common  Dispose
(function (ar) {
    "use strict";
    var showLog = true;
    function _getMessage(message) {
        var _m = "__AssetRepository.Dispose__";
        if (message) _m += "{" + message + "}__";
        return _m;
    }
    function _log(disposeType, oldId, advancedData, advancedMessage) {
        if (!showLog) return;
        var data = {
            disposeType: disposeType,
            oldId: oldId,
            advancedData: advancedData
        };
        //    console.log(_getMessage(advancedMessage), data);
    }
    ar.BindDisposeMaterial = function (material) {
        if (!material) return;
        var oldMaterialId = material.id;
        _log("BindDisposeMaterial REGISTER", oldMaterialId);
        material.onDisposeObservable.add(function (_material, maskItem) {
            var keys = Object.keys(material);
            _log("DisposeMaterial", oldMaterialId, [_material, maskItem, keys]);
            _.forEach(keys, function (propName, propIdx) {
                if (material[propName] && material[propName].dispose && !_.startsWith(propName, "_") && _.endsWith(propName, "Texture")) {
                    material[propName].dispose();
                    _log("____Texture_____", oldMaterialId, [_material, maskItem, material[propName]], propName);
                }

            });

            if (showLog) {
                setTimeout(function () {
                    _log("HAS MATERIAL IN SCENE", EM.GetMaterial(oldMaterialId));
                }, 5);
            }


        });
    };
    ar.BindDisposeFullMesh = function (mesh, onBeforeDisposed, onDoneDisposed) {
        if (!mesh) return;
        var disposedMeshId = mesh.id;
        _log("BindDisposeFullMesh REGISTER", disposedMeshId);
        ar.BindDisposeMaterial(mesh.material);
        mesh.onDisposeObservable.add(function (_mesh, maskItem, insertFirst) {
            if (onBeforeDisposed instanceof Function) onBeforeDisposed(mesh);
            if (mesh && mesh.material) mesh.material.dispose(true, true);

            if (onDoneDisposed instanceof Function) onDoneDisposed(disposedMeshId);
            if (showLog) {
                setTimeout(function () {
                    _log("DisposeFullMesh HAS MESH IN SCENE", disposedMeshId);
                }, 5);
            }
            mesh.onDisposeObservable.remove(this);

        });
    }
})(EM.AssetRepository);

//#endregion; 


//#region common  MeshInfo
(function (ar) {
    "use strict";
    var _mlKey = ar.MESH_LOCALS_KEY;
    var _meshInfoKey = ar.MESH_INFO_KEY;

    function IMeshArgumentType(meshIdOrUniqueIdOrMesh) {
        this.IsMesh = false;
        this.IsMeshId = false;
        this.IsUniqueId = false;
        this.IsString = false;
        this.IsEmptyString = false;
        this.IsEmptyObject = false;
        this.IsObject = false;
        this.IsNumber = false;
        this.Undefined = false;

        this._isCorrectMesh = function (mesh) {
            return mesh && typeof mesh === "object" && !_.isEmpty(mesh) && meshIdOrUniqueIdOrMesh.hasOwnProperty("_scene");
        }

        this._isCorrectMeshId = function (meshId) {
            return Utils.IsNotEmptyString(meshId);
        }
        this.IsCorrectMesh = function () {
            return this.IsMesh;
        }
        this.IsCorrectMeshId = function () {
            return this.IsString && !this.IsEmptyString;
        }

        if (!meshIdOrUniqueIdOrMesh) {
            this.Undefined = true;
            return this;
        }

        if (typeof meshIdOrUniqueIdOrMesh === "object") {
            this.IsObject = true;
            this.IsEmptyObject = _.isEmpty(meshIdOrUniqueIdOrMesh);
            if (this.IsEmptyObject) return this;

            if (meshIdOrUniqueIdOrMesh.hasOwnProperty("id") && meshIdOrUniqueIdOrMesh.hasOwnProperty("_scene")) {
                this.IsMesh = true;
                return this;
            }
        }

        if (typeof meshIdOrUniqueIdOrMesh === "string") {
            this.IsString = true;
            this.IsEmptyString = Utils.IsNotEmptyString(meshIdOrUniqueIdOrMesh);
            if (!this.IsEmptyString) {
                this.IsMeshId = true;
                return this;
            }
            return this;
        }

        if (typeof meshIdOrUniqueIdOrMesh === "number") {
            this.IsUniqueId = true;
            return this;
        }



        return this;

    }

    function IMeshInfo(textureId, layerName, subTypeMeshName, uniqueId, hasParent, parentName) {
        var _self = this;
        this.TextureTypeId = textureId;
        this.LayerName = layerName;
        this.SubTypeMeshName = subTypeMeshName;
        this.HasParent = hasParent;
        this.ParentName = parentName;
        this.UniqueId = uniqueId;
        this.HasUniqueId = !!uniqueId;
        this.MapTypeItem = null;
        this.GetMeshContainer = function () {
            return ar.GetMeshContainer(textureId, layerName, subTypeMeshName);
        };
        this.GetMapType = function () {
            if (_self.MapTypeItem) return _self.MapTypeItem;
            var mapTypeItem = ar.MapTypeContainer.Get(textureId);
            if (!mapTypeItem) return null;
            return _self.MapTypeItem = mapTypeItem;
        }
    }


    /**
     * создает объект IMeshInfo  из имени меша
    * перед созданием пытается найти меш в сцене и извлеч уже записанные данные, если данные существуют - возвращает их
    * @param {string} meshId 
    * @returns {object} IMeshInfo 
    */
    ar.GetMeshInfoByMeshId = function (meshId) {
        if (!Utils.IsNotEmptyString(meshId)) throw Errors.ClientNullReferenceException({ meshId: meshId }, "meshId", "AssetRepository.GetMeshInfoByMeshId");
        var _chekMesh = EM.GetMesh(meshId);
        if (_chekMesh && ar.HasLocalsInMesh(_chekMesh, _meshInfoKey, true)) ar.GetLocalsFromMesh(_chekMesh, _meshInfoKey);

        var parts = _.split(meshId, ".");
        var hasParent = false;
        var parentName = "";
        var meshName = "";

        if (parts.length > 2)
            throw Errors.ClientNotImplementedException({
                meshId: meshId,
                parts: parts
            }, "AssetRepository.GetMeshInfoByMeshId");

        if (parts.length === 2) {
            hasParent = true;
            parentName = parts[1];
            meshName = parts[0];
        }
        else meshName = parts;
        //var sections = _.split("403_space_test_2.403_space", "_");
        var sections = _.split(meshName, "_");
        var textureId = _.toNumber(sections[0]);
        var layerName = sections[1];

        // var SUBTYPE_MESH_NAMES
        var subTypeMeshName = "";
        var uniqueId = null;
        if (sections.length === 4 && Utils.IsNumeric(sections[3])) {
            uniqueId = _.toNumber(sections[3]);
            subTypeMeshName = sections[2];
        }
        else if (sections.length === 3 && Utils.IsNumeric(sections[2])) uniqueId = _.toNumber(sections[2]);
        else if (sections.length !== 2) {
            console.log("данные не соответствуют шаблону, данные не полные");
        }

        return new IMeshInfo(textureId, layerName, subTypeMeshName, uniqueId, hasParent, parentName);

    };

    /**
     * получает объект IMeshInfo  из меша или ид меша.
     * если переданный аргумент меш и он не имеет инста по ключу  AssetRepository.MESH_INFO_KEY, инфо меш инфо добавляется к  в соотв локаль
     * @param {string||object} meshOrMeshId 
     * @returns {object} IMeshInfo
     */
    ar.GetMeshInfoFromMeshOrMeshId = function (meshOrMeshId) {
        if (!meshOrMeshId) throw Errors.ClientNullReferenceException({ meshOrMeshId: meshOrMeshId }, "meshOrMeshId", "EM.MapGeometry.GetMeshInfoFromMeshOrMeshId");
        if (Utils.IsNotEmptyString(meshOrMeshId)) return ar.GetMeshInfoByMeshId(meshOrMeshId);
        else if (typeof meshOrMeshId === "object" && !_.isEmpty(meshOrMeshId)) {
            if (!meshOrMeshId.hasOwnProperty("id")) throw Errors.ClientNullReferenceException({ meshOrMeshId: meshOrMeshId }, "meshOrMeshId", "AssetRepository.GetMeshInfoFromMeshOrMeshId");
            if (ar.HasLocalsInMesh(meshOrMeshId, _meshInfoKey, true)) return ar.GetLocalsFromMesh(meshOrMeshId, _meshInfoKey);
            var meshInfo = ar.GetMeshInfoByMeshId(meshOrMeshId.id);
            ar.AddLocalsToMesh(meshOrMeshId, _meshInfoKey, meshInfo);
            return meshInfo;
        }
        throw Errors.ClientNotImplementedException({ meshOrMeshId: meshOrMeshId }, "AssetRepository.GetMeshInfoFromMeshOrMeshId");
    };

    ar.CreateMeshArgumentType = function (meshIdOrUniqueIdOrMesh) {
        return new IMeshArgumentType(meshIdOrUniqueIdOrMesh);
    };


})(EM.AssetRepository);
//#endregion; 

//#region common CloneMaterial
(function (ar) {
    "use strict";
    var _mlKey = ar.MESH_LOCALS_KEY;
    var _mKey = ar.MATERIALES_KEY;
    var _cmKey = ar.CLONE_MATERIAL_POSTFIX = "cloneMaterial";
    function _createCloneMaterialId(materialId, uniqueId) {
        var matId = ar._endsStartWithSeparator(materialId, false, false, ar.SEPARATOR);
        return ar.JoinNames([matId, uniqueId, _cmKey]);
    }
    function IMaterialInfo(baseMaterialId, cloneMaterialId, uniqueId) {
        var _self = this;
        this.BaseMaterialId = baseMaterialId;
        this.CloneMaterialId = cloneMaterialId || _createCloneMaterialId(baseMaterialId, uniqueId);
        this._getMaterial = EM.GetMaterial;
        this.GetBaseMaterial = function () {
            return _self._getMaterial(baseMaterialId);
        };
        this.GetCloneMaterial = function () {
            return _self._getMaterial(cloneMaterialId);
        };
    }

    function _addMaterialInfo(mesh, iMaterialInfo) {
        if (!mesh[_mlKey]) mesh[_mlKey] = {};
        if (!mesh[_mlKey][_mKey]) mesh[_mlKey][_mKey] = {};
        mesh[_mlKey][_mKey][iMaterialInfo.CloneMaterialId] = iMaterialInfo;
    }


    ar.GetMaterialInfoFromMesh = function (mesh, cloneMaterialName) {
        var materialInfo = ar.GetLocalsFromMesh(mesh, _mKey);
        if (!materialInfo) return null;
        return materialInfo[cloneMaterialName];
    };


    /**
     *  создает клоне материал ид, 
     *  делает клон исходного материала с этим ид,
     *  создает  IMaterialInfo  объект и добавляет его в локали меша по ключу
     *  mesh[AssetRepository.MESH_LOCALS_KEY][AssetRepository.MATERIALES_KEY][CLONED_MATERIAL_ID]  
     * @param {object} mesh 
     * @param {object} storedMaterial  базовый метериал извлеченный из храничлища
     * @returns {object} cloned material
     * throws [ClientNotImplementedException] если информация уже была доабавленна в меш
     */
    ar.CloneMaterial = function (mesh, storedMaterial, uniqueId) {
        var materialId = storedMaterial.id;
        var cloneMaterialId = _createCloneMaterialId(materialId, uniqueId);
        if (ar.GetMaterialInfoFromMesh(mesh, cloneMaterialId)) throw Errors.ClientNotImplementedException({ mesh: mesh, storedMaterial: storedMaterial }, "AssetRepository.ClonetMaterial: clone material exist in mesh");
        var cloneMaterial = storedMaterial.clone(cloneMaterialId);
        _addMaterialInfo(mesh, new IMaterialInfo(materialId, cloneMaterialId, uniqueId));
        //console.log("ar.CloneMaterial", {
        //    mesh: mesh,
        //    storedMaterial: storedMaterial,
        //    cloneMaterialId: cloneMaterialId,
        //    cloneMaterial: cloneMaterial,
        //});
        return cloneMaterial;
    }
})(EM.AssetRepository);


//#endregion; 

//#region PLANET ENVEROTMEN MODULE
(function (ar) {
    "use strict";
    var IPLANET_ENVEROTMENT_KEY = ar.IPLANET_ENVEROTMENT_KEY = "_iPlanetEnverotment";
    var PLANET_ENV_MESH_ID = ar.PLANET_ENV_MESH_ID = "skybox_planet"; //#region Skybox

    function IPlanetEnverotmentItem(baseParentMesh, skyboxMesh, groundMesh, planetId) {
        this.Base = baseParentMesh;
        this.Env = skyboxMesh;
        this.Ground = groundMesh;
        this.PlanetId = planetId;
        this.IsVisible = null;
    }

    function IPlanetEnverotment(skyboxMesh, groundMesh, skyBoxMaterialMesh, textureTypeId, onShow, onHide) {
        var _self = this;
        var hiddenPosition = ar.HIDDEN_POSITION.clone();
        var zeroPosition = BABYLON.Vector3.Zero();
        this.TextureTypeId = textureTypeId;
        this.GroundMeshId = groundMesh.id;
        this.SkyBoxMaterialId = skyBoxMaterialMesh.material.id;
        this._emptySkayBoxMaterialId = skyboxMesh.material.id;
        this._skyBoxMesh = skyboxMesh;
        this._groundMesh = groundMesh;
        this._skyBoxMaterialMesh = skyBoxMaterialMesh;
        this._isVisible = false;
        this._setVisible = function (show, iPlanetEnverotmentItem) {
            _self._isVisible = show;
            var meshes = [iPlanetEnverotmentItem.Base, iPlanetEnverotmentItem.Ground, iPlanetEnverotmentItem.Env];
            EM.SetVisibleGroupByMeshes(meshes, show, true);
            if (show) {
                _self._setToPosition(zeroPosition, iPlanetEnverotmentItem.Base);
                _self.OnShow(iPlanetEnverotmentItem);
            }
            else {
                _self._setToPosition(hiddenPosition, iPlanetEnverotmentItem.Base);
                _self.OnHilde(iPlanetEnverotmentItem);
            }

        };
        this._setToPosition = function (newPosition, baseParentMesh) {
            skyboxMesh.position = groundMesh.position = baseParentMesh.position = newPosition.clone();
            return skyboxMesh.position;
        };

        this.GetEnverotment = function (baseParentMesh, show, planetId) {
            if (skyboxMesh.material.id !== _self.SkyBoxMaterialId) _self._skyBoxMesh.material = _self._skyBoxMaterialMesh.material;
            var IPE = new IPlanetEnverotmentItem(baseParentMesh, _self._skyBoxMesh, _self._groundMesh, planetId);
            Object.defineProperty(IPE, "IsVisible", {
                get: function () {
                    return _self._isVisible;
                },
                set: function (value) {
                    _self._setVisible(value, IPE);
                }
            });
            IPE.IsVisible = show;
            return IPE;
        };

        this.OnShow = function (iPlanetEnverotmentItem) {
            if (onShow instanceof Function) onShow(iPlanetEnverotmentItem, _self);

        };
        this.OnHilde = function (iPlanetEnverotmentItem) {
            if (onHide instanceof Function) onHide(iPlanetEnverotmentItem, _self);
        };

    }
    ar.CreateIPlanetEnverotment = function (groundMesh, skyBoxMaterialMesh, textureTypeId, onShow, onHide) {
        var skyboxMesh = EM.GetMesh(PLANET_ENV_MESH_ID);
        return new IPlanetEnverotment(skyboxMesh, groundMesh, skyBoxMaterialMesh, textureTypeId, onShow, onHide);

    };

    //#endregion;

    //#region Ground


    function getPlanetGroundByTextureTypeId(textureTypeId) {
        var meshId = planetGroundMeshIdTemplate(textureTypeId);
        console.log("getPlanetGroundByTextureTypeId", meshId);

        return help.GetMesh(meshId);
    };

    /**
     * DEPRECATED 
     * @param {} sceneName 
     * @param {} textureTypeId 
     * @param {} onCreateMaterial 
     * @returns {} 
     */
    function createGroundMeshByByTextureTypeId(sceneName, textureTypeId, onCreateMaterial) {
        throw Errors.ClientDeprecatedException({ sceneName: sceneName, textureTypeId: textureTypeId, onCreateMaterial: onCreateMaterial }, "createGroundMeshByByTextureTypeId");
        var meshId = planetGroundMeshIdTemplate(textureTypeId);
        var heightMapUrl = getHeightPath(textureTypeId);
        var width = envCubeSide;
        var height = width;
        var minHeight = 0;
        var maxHeight = 30;
        var subdivisions = 200;
        var updatable = false;
        var successCallback = function () { };
        var mesh = BABYLON.Mesh.CreateGroundFromHeightMap(meshId, heightMapUrl, width, height, subdivisions, minHeight, maxHeight, EM.Scene, updatable, successCallback);

        var matId = createGroundMaterialId(textureTypeId);
        var mat = help.GetMaterial(matId);
        if (mat) console.log("createGroundMeshByByTextureTypeId.materialExist in scene", { baseCatalog: baseCatalog, textureTypeId: textureTypeId, existMaterial: mat });
        else {
            mat = onCreateMaterial(help.CreateBaseMaterial(matId));
            if (!mat || mat.id !== matId) throw new Error("material not exist or not correct");
        }
        mesh.material = mat;
        return mesh;
    };

    ar.GetIPlanetEnverotment = function (textureTypeId) {
        var item = ar.GetTypeItem(textureTypeId);
        if (!item) return null;
        var meshContainer = item.GetMeshContainer(ar.LAYER_NAMES.ground);
        if (!meshContainer) return null;
        if (!meshContainer.hasOwnProperty(IPLANET_ENVEROTMENT_KEY)) return null;
        return meshContainer[IPLANET_ENVEROTMENT_KEY];
    }
    //#endregion;

})(EM.AssetRepository);
//#endregion; 


//#region Base
(function (ar) {
    "use strict";
    ar._initBase = function (gameObjectVersion, useFromLocla, motherCatalogUrl) {

        //#region Declare
        /**
         * последовательность  "back.jpg", "top.jpg", "right.jpg", "front.jpg", "bottom.jpg", "left.jpg"
         */
        ar.SKYBOXE_NAMES = ["back.jpg", "top.jpg", "right.jpg", "front.jpg", "bottom.jpg", "left.jpg"];
        /**
         * Vector3 1e7,1e7,1e7
         */
        var HIDDEN_POSITION = ar.HIDDEN_POSITION = EM.HIDDEN_POSITION;
        var GAME_OBJECTS_VERSION = ar.GAME_OBJECTS_VERSION = gameObjectVersion;
        var USE_FROM_LOCAL = ar.USE_FROM_LOCAL = useFromLocla;
        var GAME_OBJECTCS_CATALOG = ar.GAME_OBJECTCS_CATALOG = Utils.CdnManager.GetGameObjectsCatalog(GAME_OBJECTS_VERSION, USE_FROM_LOCAL);

        var TEXTURE_TYPES = ar.TEXTURE_TYPES = {
            Dffuse: "diffuse",
            Bump: "bump",
            Specular: "specular",
            Ambient: "ambient",
            Emissive: "emissive",
            Opacity: "opacity",
            Reflection: "reflection",
            Light: "light",
            Height: "height",
            Refraction: "refraction"
        };

        // game_object type and subdirectoryes game_object    
        function IGameObject(mother, universe, galaxy, sector, star, planet, moon) {
            this.mother = mother;
            this.universe = universe;
            this.galaxy = galaxy;
            this.sector = sector;
            this.star = star;
            this.planet = planet;
            this.moon = moon;
        }

        var GO_TYPE_NAMES = ar.GO_TYPE_NAMES = new IGameObject("mother", "universe", "galaxy", "sector", "star", "planet", "moon");

        var LAYER_NAMES = ar.LAYER_NAMES = {
            space: "space",
            ground: "ground",
            env: "env"
        };


        var BASE_SUB_NAMES = ar.BASE_SUB_NAMES = {
            regular: "regular",
            cloud: "cloud",
            ring: "ring"
        };

        /**
        * extend from BASE_SUB_NAMES
        */
        var ADVANCED_NAMES = ar.ADVANCED_NAMES = _.extend({
            sprite: "sprite",
            material: "material"
        }, BASE_SUB_NAMES);

        /**
         * extend from BASE_SUB_NAMES
         */
        var SUBTYPE_MESH_NAMES = ar.SUBTYPE_MESH_NAMES = (_.extend({
            empty: "empty"
        }, ADVANCED_NAMES));

        /**
         * extend from BASE_SUB_NAMES
         */
        var SUBTYPE_MATERIAL_NAMES = ar.SUBTYPE_MATERIAL_NAMES = _.extend({
            click: "click",
            hover: "hover"
        }, BASE_SUB_NAMES);

        var EXTENTIONS = {
            jpg: ".jpg",
            png: ".png",
            babylon: ".babylon",
            hdr: ".hdr"
        }
        EXTENTIONS.cleanPoint = function (ext) {
            if (_.startsWith(ext, ".")) return ext.substring(1);
            return ext;
        };
        ar.EXTENTIONS = EXTENTIONS;

        var SEPARATOR = ar.SEPARATOR = "_";


        function endsWithSeparator(section, setOrRemoveSeparator, _separator) {
            return Utils.Parce.EndsWithSeparatorAndReplace(section, setOrRemoveSeparator, _separator || SEPARATOR);
        }
        function startsWithSeparator(section, setOrRemoveSeparator, _separator) {
            return Utils.Parce.StartsWithSeparatorAndReplace(section, setOrRemoveSeparator, _separator || SEPARATOR);
        }
        function _getUrlInfo(url) {
            return Utils.Parce.GetUrlInfo(url);

        }

        function createSubDirUrl(baseDir, subDirName) {
            var _baseDir = endsWithSeparator(baseDir, true, "/");
            var _subDirName = startsWithSeparator(endsWithSeparator(subDirName, true, "/"), false);
            return _baseDir + _subDirName;
        }
        function _createGoCatalogUrl(goTypeNmae) {
            return createSubDirUrl(GAME_OBJECTCS_CATALOG, goTypeNmae);
        }

        var GO_CATALOG_URLS = ar.GO_CATALOG_URLS = new IGameObject(motherCatalogUrl,
                                                                                _createGoCatalogUrl(GO_TYPE_NAMES.universe),
                                                                                _createGoCatalogUrl(GO_TYPE_NAMES.galaxy),
                                                                                _createGoCatalogUrl(GO_TYPE_NAMES.sector),
                                                                                _createGoCatalogUrl(GO_TYPE_NAMES.star),
                                                                                _createGoCatalogUrl(GO_TYPE_NAMES.planet),
                                                                                _createGoCatalogUrl(GO_TYPE_NAMES.moon));




        //#endregion;

        //#region Helpers
        var help = EM.GetHelpers();

        function _isNotEmptyString(stringName) {
            return Utils.IsNotEmptyString(stringName);
        }


        /**
           * @param {array} nameParts 
          * @param {string} _separator 
          * @returns {string} 
          */
        function _join(nameParts, _separator) {
            if (!_separator) _separator = SEPARATOR;
            return nameParts.join(_separator);
        }

        function _createObjectName(layerName, advancedName) {
            if (advancedName) return _join([layerName, advancedName]);
            else return layerName;
        }

        function _createTextureFileName(textureTypeId, objectFullName, textureType, ext) {
            var _id = endsWithSeparator(startsWithSeparator(textureTypeId, false), true);
            var _baseType = endsWithSeparator(startsWithSeparator(objectFullName, false), true);
            var _textureType = endsWithSeparator(startsWithSeparator(textureType, false), false);
            var _ext = endsWithSeparator(startsWithSeparator(ext, true, "."), false);
            return _id + _baseType + _textureType + _ext;
        }

        function _createOriginalMeshIdTemplate(textureTypeId, layerName, subtypeMeshName) {
            var names = [textureTypeId.toString(), layerName];
            if (_isNotEmptyString(subtypeMeshName) && subtypeMeshName !== SUBTYPE_MESH_NAMES.regular) names.push(subtypeMeshName);
            return _join(names);
        }

        function _combineMeshIds(originalMeshId, uniqueId, parentMeshId) {
            if (!uniqueId && !parentMeshId) return originalMeshId;
            if (uniqueId && !parentMeshId) return _join([originalMeshId, uniqueId.toString()]);
            if (parentMeshId) {
                parentMeshId = endsWithSeparator(startsWithSeparator(parentMeshId, true, "."), false, ".");
                if (!uniqueId) return originalMeshId + parentMeshId;
                return _join([originalMeshId, uniqueId.toString() + parentMeshId]);
            }
            throw Errors.ClientNotImplementedException({
                orignMeshId: originalMeshId,
                uniqueId: uniqueId,
                parentMeshId: parentMeshId
            }, "AssetRepository._initBase._combineMeshIds");
        }

        function _createFullMeshIdTemplate(textureTypeId, layerName, subtypeMeshName, uniqueId, parentMeshId) {
            var orignMeshId = _createOriginalMeshIdTemplate(textureTypeId, layerName, subtypeMeshName);
            return _combineMeshIds(orignMeshId, uniqueId, parentMeshId);
        }

        function _materialIdTemplate(textureTypeId, layerName, advancedName) {
            var names = [textureTypeId.toString(), layerName];
            if (_isNotEmptyString(advancedName)) names.push(advancedName);
            return _join(names);
        }


        function _getScenePrefix(sceneName) {
            if (_isNotEmptyString(sceneName)) sceneName = endsWithSeparator(sceneName, true, ".");
            else sceneName = "";
            return sceneName;
        }


        ar.GetMeshIdByMeta = function (meta, uniqueId, parentMeshId) {
            function getBaseMeshId() {
                return _createOriginalMeshIdTemplate(meta.TextureTypeId, meta.LayerName, meta._advancedName);
            };
            // ReSharper disable once FunctionsUsedBeforeDeclared
            var meshContainer = new IMeshContainer(getBaseMeshId);
            return meshContainer.GetMeshId(uniqueId, parentMeshId);
        };

        ar.GetPlanetCatalog = function (textureTypeId) {
            var pc = GO_CATALOG_URLS.planet;
            if (!textureTypeId) return pc;
            return createSubDirUrl(pc, textureTypeId.toString());
        }
        ar.JoinNames = _join;
        ar._endsStartWithSeparator = function (section, setOrRemoveStartSeparator, setOrRemoveEndSeparator, separator) {
            return endsWithSeparator(startsWithSeparator(section, setOrRemoveStartSeparator, separator), setOrRemoveEndSeparator, separator);
        };

        ar._createOriginalMeshIdTemplate = _createOriginalMeshIdTemplate;

        //#endregion;


        //#region GroupType
        function TextureTypeRange(name, from, to) {
            this.Name = name;
            this.From = from;
            this.To = to;
            return this;
        };

        var mapTypes = ar.MapTypes = EM.MapGeometry.MapTypes;
        var GAME_TEXTURE_ID_RANGES = ar.GAME_TEXTURE_ID_RANGES = {
            Galaxy: new TextureTypeRange(mapTypes.Galaxy.toLowerCase(), 1, 100),
            Sector: new TextureTypeRange(mapTypes.Sector.toLowerCase(), 201, 300),
            Star: new TextureTypeRange(mapTypes.Star.toLowerCase(), 301, 400),
            Earth: new TextureTypeRange(mapTypes.Earth.toLowerCase(), 401, 500),
            Gas: new TextureTypeRange(mapTypes.Gas.toLowerCase(), 501, 600),
            IceGas: new TextureTypeRange(mapTypes.IceGas.toLowerCase(), 601, 700),
            Moon: new TextureTypeRange(mapTypes.Moon.toLowerCase(), 901, 1000),
            Mother: new TextureTypeRange(mapTypes.Mother.toLowerCase(), 2000, 2000),
            Universe: new TextureTypeRange(mapTypes.Universe.toLowerCase(), 4001, 4100)
        };

        function _equalRange(textureTypeId, range) {
            return textureTypeId >= range.From && textureTypeId <= range.To;
        }
        function getGroupTypeName(textureTypeId) {
            function eq(range) {
                return _equalRange(textureTypeId, range);
            }
            if (eq(GAME_TEXTURE_ID_RANGES.Mother)) return GAME_TEXTURE_ID_RANGES.Mother.Name;
            if (eq(GAME_TEXTURE_ID_RANGES.Galaxy)) return GAME_TEXTURE_ID_RANGES.Galaxy.Name;
            if (eq(GAME_TEXTURE_ID_RANGES.Sector)) return GAME_TEXTURE_ID_RANGES.Sector.Name;
            if (eq(GAME_TEXTURE_ID_RANGES.Star)) return GAME_TEXTURE_ID_RANGES.Star.Name;
            if (eq(GAME_TEXTURE_ID_RANGES.Earth)) return GAME_TEXTURE_ID_RANGES.Earth.Name;
            if (eq(GAME_TEXTURE_ID_RANGES.Gas)) return GAME_TEXTURE_ID_RANGES.Gas.Name;
            if (eq(GAME_TEXTURE_ID_RANGES.IceGas)) return GAME_TEXTURE_ID_RANGES.IceGas.Name;
            if (eq(GAME_TEXTURE_ID_RANGES.Moon)) return GAME_TEXTURE_ID_RANGES.Moon.Name;
            if (eq(GAME_TEXTURE_ID_RANGES.Universe)) return GAME_TEXTURE_ID_RANGES.Universe.Name;
            return false;
        };


        function mapTextureIdToCatalogUrl(textureTypeId) {
            var _tId = null;
            if (typeof textureTypeId === "number") _tId = textureTypeId;
            else if (typeof textureTypeId === "string") _tId = +textureTypeId;
            if (!_tId) throw new Error("arg --textureTypeId-- is not convertable to numeric type");
            function eq(range) {
                return _equalRange(textureTypeId, range);
            }

            if (eq(GAME_TEXTURE_ID_RANGES.Mother)) return motherCatalogUrl;
            if (eq(GAME_TEXTURE_ID_RANGES.Earth)) return GO_CATALOG_URLS.planet;
            if (eq(GAME_TEXTURE_ID_RANGES.Gas)) return GO_CATALOG_URLS.planet;
            if (eq(GAME_TEXTURE_ID_RANGES.IceGas)) return GO_CATALOG_URLS.planet;
            if (eq(GAME_TEXTURE_ID_RANGES.Moon)) return GO_CATALOG_URLS.moon;
            if (eq(GAME_TEXTURE_ID_RANGES.Star)) return GO_CATALOG_URLS.star;
            if (eq(GAME_TEXTURE_ID_RANGES.Sector)) return GO_CATALOG_URLS.sector;
            if (eq(GAME_TEXTURE_ID_RANGES.Galaxy)) return GO_CATALOG_URLS.galaxy;
            if (eq(GAME_TEXTURE_ID_RANGES.Universe)) return GO_CATALOG_URLS.universe;

            throw new Errors.ClientNotImplementedException({ argTextureTypeId: textureTypeId, GAME_TEXTURE_ID_RANGES: GAME_TEXTURE_ID_RANGES }, "Catalog by textyreId:{" + textureTypeId + "} not exist");
        }


        ar._initGroup = function (createItem, groupIds, notForEach) {
            if (!notForEach) {
                _.forEach(groupIds, function (textureTypeId, idx) {
                    createItem(textureTypeId);
                });
            } else createItem();

        };
        ar.GetGroupTypeName = getGroupTypeName;
        ar.MapTextureIdToCatalogUrl = mapTextureIdToCatalogUrl;


        //#endregion;

        //#region TypeList getTypeItem   
        function _getTypeItem(textureTypeId) {
            if (ar.TypeList.hasOwnProperty(textureTypeId)) return ar.TypeList[textureTypeId];
            return null;
        };

        function _getCss(textureTypeId) {
            var item = _getTypeItem(textureTypeId);
            if (!item) return null;
            return _getTypeItem(textureTypeId).Css;
        };

        function _getIconSelectCss(textureTypeId) {
            var css = _getCss(textureTypeId);
            if (!css) return null;
            return css.IconSelect;
        };

        function _getMeshId(textureTypeId, layerName, subTypeMeshName, uniqueId, parentMehsId) {
            var item = _getTypeItem(textureTypeId);
            if (!item) return null;
            return item.Pub.GetMeshId(layerName, subTypeMeshName, uniqueId, parentMehsId);
        }

        function _getMeshContainer(textureTypeId, layerName, meshSubTypeName) {
            var item = _getTypeItem(textureTypeId);
            if (!item) return null;
            return item.Pub.GetMeshContainer(layerName, meshSubTypeName);
        }

        function _getMaterial(textureTypeId, layerName, subTypeMaterialName) {
            var item = _getTypeItem(textureTypeId);
            if (!item) return null;
            return item.Pub.GetMaterial(layerName, subTypeMaterialName);
        }

        function _getMaterialId(textureTypeId, layerName, subTypeMaterialName) {
            var item = _getTypeItem(textureTypeId);
            if (!item) return null;
            return item.Pub.GetMaterialId(layerName, subTypeMaterialName);
        }


        ar.GetTypeItem = function (textureTypeId) {
            var item = _getTypeItem(textureTypeId);
            if (!item) return null;
            return item.Pub;
        };
        ar.GetCss = _getCss;
        ar.GetIconSelectCss = _getIconSelectCss;

        function _createMethodName(methodType, layerName, subTypeName, mathodTargetName) {
            return _.upperFirst(methodType) + _.upperFirst(layerName) + _.upperFirst(subTypeName) + _.upperFirst(mathodTargetName);
        }

        function _createMeshMethods(layerName, subTypeName) {
            ar[_createMethodName("Get", layerName, subTypeName, "MeshContainer")] = function (textureTypeId) {
                return _getMeshContainer(textureTypeId, layerName, subTypeName);
            }
            ar[_createMethodName("Get", layerName, subTypeName, "MeshId")] = function (textureTypeId, uniqueId, parentMehsId) {
                return _getMeshId(textureTypeId, layerName, subTypeName, uniqueId, parentMehsId);
            }
            ar[_createMethodName("Create", layerName, subTypeName, "MeshId")] = function (textureTypeId, uniqueId, parentMehsId) {
                return _createFullMeshIdTemplate(textureTypeId, layerName, subTypeName, uniqueId, parentMehsId);
            }

            ar[_createMethodName("Get", layerName, subTypeName, "Mesh")] = function (textureTypeId, uniqueId, parentMehsId) {
                var item = _getTypeItem(textureTypeId);
                if (!item) return null;
                return item.Pub.GetMesh(layerName, subTypeName, uniqueId, parentMehsId);
            }
        }

        function _createMaterailMethods(layerName, subTypeMaterialName) {
            ar[_createMethodName("Get", layerName, subTypeMaterialName, "Material")] = function (textureTypeId) {
                return _getMaterial(textureTypeId, layerName, subTypeMaterialName);
            }
            ar[_createMethodName("Get", layerName, subTypeMaterialName, "MaterialId")] = function (textureTypeId) {
                return _getMaterialId(textureTypeId, layerName, subTypeMaterialName);
            }
            ar[_createMethodName("Create", layerName, subTypeMaterialName, "MaterialId")] = function (textureTypeId) {
                return _materialIdTemplate(textureTypeId, layerName, subTypeMaterialName);
            }

        }

        // #region Space

        // #region Mesh
        ar.GetSpaceRegularMeshContainer = null;
        ar.GetSpaceCloudMeshContainer = null;
        ar.GetSpaceRingMeshContainer = null;
        ar.GetSpaceMaterialMeshContainer = null;
        ar.GetSpaceEmptyMeshContainer = null;
        ar.GetSpaceSpriteMeshContainer = null;

        ar.GetSpaceRegularMesh = null;
        ar.GetSpaceCloudMesh = null;
        ar.GetSpaceRingMesh = null;
        ar.GetSpaceMaterialMesh = null;
        ar.GetSpaceEmptyMesh = null;
        ar.GetSpaceSpriteMesh = null;


        ar.GetSpaceRegularMeshId = null;
        ar.GetSpaceCloudMeshId = null;
        ar.GetSpaceRingMeshId = null;
        ar.GetSpaceMaterialMeshId = null;
        ar.GetSpaceEmptyMeshId = null;
        ar.GetSpaceSpriteMeshId = null;

        ar.CreateSpaceRegularMeshId = null;
        ar.CreateSpaceCloudMeshId = null;
        ar.CreateSpaceRingMeshId = null;
        ar.CreateSpaceMaterialMeshId = null;
        ar.CreateSpaceEmptyMeshId = null;
        ar.CreateSpaceSpriteMeshId = null;



        _createMeshMethods(LAYER_NAMES.space, SUBTYPE_MESH_NAMES.regular);
        _createMeshMethods(LAYER_NAMES.space, SUBTYPE_MESH_NAMES.cloud);
        _createMeshMethods(LAYER_NAMES.space, SUBTYPE_MESH_NAMES.ring);
        _createMeshMethods(LAYER_NAMES.space, SUBTYPE_MESH_NAMES.material);
        _createMeshMethods(LAYER_NAMES.space, SUBTYPE_MESH_NAMES.empty);
        _createMeshMethods(LAYER_NAMES.space, SUBTYPE_MESH_NAMES.sprite);

        ar.GetMeshContainer = _getMeshContainer;

        // #endregion

        // #region Material

        ar.GetSpaceRegularMaterial = null;
        ar.GetSpaceClickMaterial = null;
        ar.GetSpaceHoverMaterial = null;
        ar.GetSpaceCloudMaterial = null;
        ar.GetSpaceRingMaterial = null;

        ar.GetSpaceRegularMaterialId = null;
        ar.GetSpaceClickMaterialId = null;
        ar.GetSpaceHoverMaterialId = null;
        ar.GetSpaceCloudMaterialId = null;
        ar.GetSpaceRingMaterialId = null;


        ar.CreateSpaceRegularMaterialId = null;
        ar.CreateSpaceClickMaterialId = null;
        ar.CreateSpaceHoverMaterialId = null;
        ar.CreateSpaceCloudMaterialId = null;
        ar.CreateSpaceRingMaterialId = null;

        _createMaterailMethods(LAYER_NAMES.space, SUBTYPE_MATERIAL_NAMES.regular);
        _createMaterailMethods(LAYER_NAMES.space, SUBTYPE_MATERIAL_NAMES.click);
        _createMaterailMethods(LAYER_NAMES.space, SUBTYPE_MATERIAL_NAMES.hover);
        _createMaterailMethods(LAYER_NAMES.space, SUBTYPE_MATERIAL_NAMES.cloud);
        _createMaterailMethods(LAYER_NAMES.space, SUBTYPE_MATERIAL_NAMES.ring);
        // #endregion

        // #endregion


        //#endregion;


        //#region IMapTypeItem
        function IMapTypeItem(textureTypeId, baseMapTypeName, subMapTypeName) {

            this.TextureTypeId = textureTypeId;

            this._mapType = null;
            this.MapType = null;
            this.MapTypeLower = null;

            this._subMapType = null;
            this.SubMapType = null;
            this.SubMapTypeLower = null;

            this._setSub = function (subType) {
                this._subMapType = subType || "";
                this.SubMapType = _.upperFirst(this._subMapType);
                this.SubMapTypeLower = this._subMapType.toLowerCase();
            }
            this._setMapType = function (baseMapType) {
                this._mapType = baseMapType || "";
                this.MapType = _.upperFirst(this._mapType);
                this.MapTypeLower = this._mapType.toLowerCase();
            };
            this._setMapType(baseMapTypeName);
            this.hasSubType = function () {
                return _isNotEmptyString(this._subMapType);
            }
            if (subMapTypeName) {
                this._setSub(subMapTypeName);
            }
        }

        function IMapTypeStorage() {
            var _self = this;
            this.GetOrAdd = function (textureId, baseMapTypeName, subMapTypeName) {
                if (!_self._collection[textureId]) _self._collection[textureId] = new IMapTypeItem(textureId, baseMapTypeName, subMapTypeName);
                return _self._collection[textureId];
            };
            this._collection = {};
            this.AddCollection = function (textureIds, baseMapTypeName, subMapTypeName) {
                _.forEach(textureIds, function (textureId, idx) {
                    _self._collection[textureId] = new IMapTypeItem(textureId, baseMapTypeName, subMapTypeName);
                });
            };
            this.UpdateItem = function (iMapTypeItem) {
                var _src = "MapTypeContainer.UpdateItem";
                if (!iMapTypeItem) throw Errors.ClientNullReferenceException(iMapTypeItem, "iMapTypeItem", _src);
                if (typeof iMapTypeItem !== "object") throw Errors.ClientTypeErrorException(iMapTypeItem, iMapTypeItem, "object/IMapTypeItem", _src);
                if (!iMapTypeItem.TextureTypeId) throw Errors.ClientInvalidDataException(iMapTypeItem, "MapTypeContainer.UpdateItem", _src);
                if (!_self._collection[iMapTypeItem.TextureTypeId]) _self._collection[iMapTypeItem.TextureTypeId] = iMapTypeItem;
                else Utils.UpdateObjData(_self._collection[iMapTypeItem.TextureTypeId], iMapTypeItem);
                return _self._collection[iMapTypeItem.TextureTypeId];

            };
            this.Get = function (textureId) {
                return _self._collection[textureId];
            };
        }

        ar.MapTypeContainer = new IMapTypeStorage();
        //#endregion;


        //#region iTypeItem


        function ITypeCatalog(textureTypeId, innerGatalogName) {
            var _self = this;
            this._textureId = textureTypeId;
            this.CatalogUrl = mapTextureIdToCatalogUrl(textureTypeId);
            this.InnerCatalogUrl = null;
            this.InnerCatalogName = null;
            /**
             * не влияет на локальные поля
             * @param {string} subDirName    can be null default this.InnerCatalogName
             * @param {string} baseUrl   can be null default this.CatalogUrl 
             * @returns {string} subDirUrl
             */
            this.CreateSubDirUrl = function (subDirName, baseUrl) {
                if (!subDirName && !_self.InnerCatalogName) return null;
                var _subDir = subDirName ? subDirName : _self.InnerCatalogName;
                var _baseUrl = baseUrl ? baseUrl : this.CatalogUrl;
                return createSubDirUrl(_baseUrl, _subDir);
            };

            if (_isNotEmptyString(innerGatalogName)) {
                _self.InnerCatalogName = endsWithSeparator(startsWithSeparator(innerGatalogName, false, "/"), false);
                return this.InnerCatalogUrl = this.CreateSubDirUrl();
            }
            return this;
        }


        var cssBase = {
            _spriteMapPrefix: "sprite_map_",
            _textureCssPrefix: "texture_",
            _planetPrefix: "planet_",
            _separator: "_",
            xl: "xl",
            m: "m",
            ms: "ms",
            s: "s",
            sx: "sx",
            xs: "xs",
            _cleanSeparator: function (name) {
                if (!_isNotEmptyString(name)) return "";
                return this.startsWithSeparator(this.endsWithSeparator(name, false), false);
            },
            startsWithSeparator: function (name, setOrRemoveSeparator) {
                return startsWithSeparator(name, setOrRemoveSeparator, this._separator);
            },
            endsWithSeparator: function (name, setOrRemoveSeparator) {
                return endsWithSeparator(name, setOrRemoveSeparator, this._separator);
            },
            convertCssNameToClass: function (cssName) {
                return startsWithSeparator(cssName, true, ".");
            }
        };

        function ICss(textureTypeId, mapTypeName, spriteCatalogUrl) {
            var _self = _.extend(this, cssBase);
            _self._textureTypeId = textureTypeId;
            _self._mapTypeName = mapTypeName;
            _self._mapTypeLowerName = mapTypeName.toLowerCase();
            _self.IconSelect = "";
            _self.TextureCss = null;
            _self.Sprite = null;
            _self._spriteCatalogUrl = spriteCatalogUrl;
            _self.GroupName = null;
            _self.DetailCss = null;
            _self.MediumCss = null;
            _self.SmallCss = null;
            _self.CreateSelectors = null;

            _self.InitCss = function () {
                // sprite_control_icons m map-object jumptomother
                //select2-sprite sprite_map_mother mother texture_2000 m 
                //sprite_map_planet_gas xl texture_503 planet_gas
                var textureCss = _self._textureCssPrefix + _self._textureTypeId;
                var groupName = "";
                var name = _self._mapTypeLowerName;
                if (name === "earth" || name === "gas" || name === "icegas") groupName = _self._planetPrefix + name;
                else groupName = name;
                var spriteName = _self._spriteMapPrefix + groupName;

                if (name === "mother") {
                    spriteName = "sprite_control_icons";
                    groupName = "map-object";
                    textureCss = "jumptomother";
                }

                function createFull(size) {
                    return spriteName + " " + groupName + " " + textureCss + " " + size;
                };


                _self.TextureCss = textureCss;
                _self.Sprite = spriteName;
                _self.GroupName = groupName;
                _self.DetailCss = createFull(_self.xl);
                _self.MediumCss = createFull(_self.m);
                _self.SmallCss = createFull(_self.s);
                _self.СreateSelectors = createFull;
                _self.IconSelect = _self.SmallCss;
                _self.SetIconSelect = function (newCss) {
                    _self.IconSelect = newCss;
                };
            };
            return _self;
        }

        function IGameObjectMeta(textureTypeId, layerName, advancedName) {
            this.LayerName = layerName;
            this.TextureTypeId = textureTypeId;
            this._advancedName = "";
            if (!advancedName) advancedName = ADVANCED_NAMES.regular;
            this.AdvancedName = advancedName;
            if (advancedName !== ADVANCED_NAMES.regular) this._advancedName = advancedName;
            this.ObjectName = _createObjectName(this.LayerName, this._advancedName);
        }



        function ITextureItem(catalog, iGameObjectMeta, textureTypeName, ext) {
            var SHOW_CONSOLE = false;
            var _self = this;
            _self.LayerName = null;
            _self.TextureTypeId = null;
            _self.ObjectName = null;

            _self._texture = null;
            _self.TextureTypeName = null;
            _self.Ext = null;
            _self.FileName = null;
            _self.CubeNames = null;
            _self.Catalog = null;
            _self.Url = null;
            _self.Created = false;
            _self._externalTextureType = null;
            _self.ExternalTextureHasCorrectInfo = false;

            function _init() {
                if (!iGameObjectMeta || !catalog || !textureTypeName) return;
                _self.TextureTypeId = iGameObjectMeta.TextureTypeId;
                _self.TextureTypeName = textureTypeName;
                _self.ObjectName = iGameObjectMeta.ObjectName;
                _self.LayerName = iGameObjectMeta.LayerName;
                _self.Ext = ext ? ext : EXTENTIONS.jpg;
                _self.FileName = _createTextureFileName(_self.TextureTypeId, _self.ObjectName, _self.TextureTypeName, _self.Ext);
                _self.Catalog = catalog;
                _self.Url = _self.Catalog + _self.FileName;
            }

            _init();

            /**
             * 
             * @returns {object} BABYLON.Texture
             */
            _self.GetOrCreateTexture = function (url) {
                if (_self.Created) return _self._texture;
                if (url) {
                    var urlInfo = _getUrlInfo(url);
                    _self.Url = urlInfo.Url;
                    _self.FileName = urlInfo.FileName;
                    _self.Catalog = urlInfo.Catalog;
                    console.log("GetOrCreateTexture", { _self: _self });
                }

                _self._texture = help.CreateTexture(_self.Url);
                _self.Created = true;
                return _self._texture;
            };

            /**
             * 
             * @param {string} cubeNames  can be null default  EM.AssetRepository.SKYBOXE_NAMES     in current directory
             * @param {string} dir      can be null default currentDir    
             * @returns {object} BABYLON.CubeTexture 
             */
            _self.GetOrCreateCubeTexture = function (cubeNames, dir) {
                if (_self.Created) return _self._texture;
                if (dir) {
                    _self.Url = null;
                    _self.Catalog = dir;
                }
                _self.CubeNames = cubeNames ? cubeNames : ar.SKYBOXE_NAMES;
                _self._texture = new BABYLON.CubeTexture(_self.Catalog, EM.Scene, _self.CubeNames);
                _self.Created = true;
                return _self._texture;

            };
            _self.GetOrCreateHdrTexture = function (name, dir) {
                if (_self.Created) return _self._texture;
                if (dir) {
                    _self.Url = null;
                    _self.Catalog = dir;
                }

                var url = dir + name + ar.EXTENTIONS.hdr;

                _self._texture = new BABYLON.HDRCubeTexture(url, EM.Scene, 512);
                _self.Created = true;
                return _self._texture;
            }

            /**
             * 
             * @param {string} fileName    can be null if file na,e from template
             * @param {string} dir    can be null if is current dir
             * @returns {object}  BABYLON.CubeTexture
             */
            _self.GetOrCreateCubeTextureFromOneFile = function (fileName, dir) {
                if (_self.Created) return _self._texture;
                var hasChange = false;
                if (dir) {
                    _self.Catalog = dir;
                    hasChange = true;
                }
                if (fileName) {
                    _self.FileName = fileName;
                    _self.Ext = _self.FileName.substring(_self.FileName.length - 4);
                    hasChange = true;
                }
                if (hasChange) _self.Url = _self.Catalog + _self.FileName;
                _self.CubeNames = [_self.FileName, _self.FileName, _self.FileName, _self.FileName, _self.FileName, _self.FileName];
                _self._texture = new BABYLON.CubeTexture(_self.Catalog, EM.Scene, _self.CubeNames);
                _self.Created = true;
                return _self._texture;
            };

            /**
             * при установке текстуры новые данные берутся из урл текстуры, записываются только те данные которые проходят валидацию по именованиям
             * @param {string} textureTypeName see  EM.AssetRepository.TEXTURE_TYPES
             * @param {object} babylonTexture   BABYLON.Texture
             * @returns {object}  ITextureItem обновленную информацию после установки  новой текстуры
             * exceptions [ClientNullReferenceException] 
             */
            _self.SetExternalTexture = function (textureType, babylonTexture) {
                if (!babylonTexture) throw Errors.ClientNullReferenceException({ ITextureItem: _self, babylonTexture: babylonTexture }, "babylonTexture", "ITextureItem.SetExternalTexture");
                _self.TextureTypeName = textureType;
                _self.Url = babylonTexture.url;
                _self._texture = babylonTexture;
                _self.Created = true;
                var fileInfo = _getUrlInfo(_self.Url);
                _self.Catalog = fileInfo.Catalog;
                _self.FileName = null;
                _self.Ext = null;
                _self.TextureTypeId = null;
                _self.LayerName = null;


                if (fileInfo.IsFile()) {
                    _self.FileName = fileInfo.FileName;
                    _self.Ext = fileInfo.Ext;
                    var file = _.split(_self.FileName, "_");
                    var textId = _.toInteger(file[0]);

                    if (!textId) {
                        _self.ObjectName = _self.FileName.substr(0, _self.FileName.lastIndexOf("."));
                        return _self;
                    }

                    _self.TextureTypeId = textId;

                    var last = file[file.length - 1];

                    if (last.length > 4) {
                        var _externalTextureType = last.substr(0, last.lastIndexOf("."));
                        if (TEXTURE_TYPES.hasOwnProperty(_.upperFirst(_externalTextureType))) _self._externalTextureType = _externalTextureType;
                        if (_externalTextureType === _self.TextureTypeName) _self.ExternalTextureHasCorrectInfo = true;
                        else {
                            _self.IsLinkToOtherTexture = true;
                            if (SHOW_CONSOLE) {
                                console.log("external texture type inccorect", {
                                    babylonTexture: babylonTexture,
                                    _externalTextureType: _externalTextureType,
                                    currentTextureType: _self.TextureTypeName,
                                    ITextureItem: _self
                                });
                            }

                        }

                    }
                    if (LAYER_NAMES.hasOwnProperty(file[1])) {
                        _self.LayerName = file[1];
                    }
                    if (_self.LayerName && _self._externalTextureType) {;
                        _self.ObjectName = _.join(_.dropRight(_.drop(file, 1), 1), "_");
                    }

                }
                return _self;
            }
            return _self;

        }

        function IMaterialContainer(iGameObjectMeta, iTypeCatalog, subtypeMaterialName) {
            var _self = this;
            _self.LayerName = iGameObjectMeta.LayerName;
            _self.TextureTypeId = iGameObjectMeta.TextureTypeId;
            _self.AdvancedName = iGameObjectMeta.AdvancedName;
            _self.ObjectName = iGameObjectMeta.ObjectName;
            _self.SubtypeMaterialName = subtypeMaterialName;
            _self._subtypeMaterialName = null;
            if (_self.SubtypeMaterialName === SUBTYPE_MATERIAL_NAMES.regular) _self._subtypeMaterialName = "";
            else _self._subtypeMaterialName = subtypeMaterialName;

            _self.CatalogUrl = iTypeCatalog.CatalogUrl;
            _self.InnerCatalogUrl = iTypeCatalog.InnerCatalogUrl;
            _self.CreateSubDirUrl = iTypeCatalog.CreateSubDirUrl;

            _self._activeCatalogUrl = _self.InnerCatalogUrl ? _self.InnerCatalogUrl : _self.CatalogUrl;
            _self.UpdateActiveCatalogUrl = function (newUrl) {
                _self._activeCatalogUrl = newUrl;
            };


            _self.diffuse = null;
            _self.bump = null;
            _self.specular = null;
            _self.ambient = null;
            _self.emissive = null;
            _self.opacity = null;
            _self.reflection = null;
            _self.refraction = null;
            _self.light = null;

            _self.MaterialId = null;
            _self.ImportSceneName = null;
            _self.ScenePrefix = "";

            _self.SetScenePrefix = function (sceneName) {
                if (!sceneName) Errors.ClientNullReferenceException({ sceneName: sceneName, IMaterialContainer: IMaterialContainer }, "sceneName", "IMaterialContainer.SetScenePrefix");
                _self.ImportSceneName = sceneName;
                _self.ScenePrefix = _getScenePrefix(sceneName);
                return _self;

            }


            _self.GetOrCreateTextureItem = function (textureTypeName, ext, useFromBaseCatalog, otherCatalogUrl) {
                if (_self[textureTypeName]) return _self[textureTypeName];
                if (!otherCatalogUrl && !useFromBaseCatalog) {
                    _self[textureTypeName] = new ITextureItem(_self._activeCatalogUrl, iGameObjectMeta, textureTypeName, ext);
                    return _self[textureTypeName];
                }
                if (otherCatalogUrl) _self.UpdateActiveCatalogUrl(otherCatalogUrl);
                else if (useFromBaseCatalog && _self.InnerCatalogUrl && _self._activeCatalogUrl !== _self.CatalogUrl) {
                    _self.UpdateActiveCatalogUrl(_self.CatalogUrl);
                }
                _self[textureTypeName] = new ITextureItem(_self._activeCatalogUrl, iGameObjectMeta, textureTypeName, ext);
                return _self[textureTypeName];
            };
            _self.GetOrCreateTexture = function (textureTypeName, ext, useFromBaseCatalog, otherCatalogUrl) {
                if (_self.ExistTexture(textureTypeName)) return _self.GetTexture(textureTypeName);
                else {
                    var container = _self.GetOrCreateTextureItem(textureTypeName, ext, useFromBaseCatalog, otherCatalogUrl);
                    return container.GetOrCreateTexture();
                }
            }

            _self.ExistTexture = function (textureTypeName) {
                return !!_self[textureTypeName];
            };
            _self.GetTextureObj = function (textureTypeName) {
                if (_self.ExistTexture(textureTypeName)) return _self[textureTypeName];
                return null;
            };
            _self.GetTexture = function (textureTypeName) {
                if (_self.ExistTexture(textureTypeName)) {
                    return _self[textureTypeName].GetOrCreateTexture();
                }

                return null;
            };
            _self.GetTextureUrl = function (textureTypeName) {
                if (_self.ExistTexture(textureTypeName)) return _self[textureTypeName].Url;
                return null;
            };

            /**
             * see  ITextureItem.SetExternalTexture 
             * устанавливает новую текстуру в контейнер. Если контейнер не существует создает с пустыми параметрами
             * и вызывает одноименный метод текстуры 
             * @param {string} textureTypeName see  EM.AssetRepository.TEXTURE_TYPES
             * @param {object} babylonTexture   BABYLON.Texture
             * @returns {object}  ITextureItem обновленную информацию после установки  новой текстуры
             * exceptions [ClientNullReferenceException] 
             */
            _self.SetExternalTexture = function (textureTypeName, babylonTexture) {
                if (_self.ExistTexture(textureTypeName)) {
                    var cont = _self.GetTextureObj(textureTypeName);
                    return cont.SetExternalTexture(textureTypeName, babylonTexture);
                }
                else {
                    _self[textureTypeName] = new ITextureItem();
                    return _self[textureTypeName].SetExternalTexture(textureTypeName, babylonTexture);
                }
            };
            _self._createMaterialId = function () {
                return _self.ScenePrefix + _materialIdTemplate(_self.TextureTypeId, _self.LayerName, _self._subtypeMaterialName);
            }
            _self.GetOrCreateMaterialId = function () {
                if (!_self.MaterialId) _self.MaterialId = _self._createMaterialId();
                return _self.MaterialId;
            };
            _self._setMaterialProperty = null;
            _self.GetOrCreateMaterial = function (setMaterialProperty) {
                var matId = _self.GetOrCreateMaterialId();
                var mat = help.GetMaterial(matId);
                var materialIsExist = !!mat;
                if (!setMaterialProperty && materialIsExist) return mat;
 
                if (setMaterialProperty instanceof Function && !_self._setMaterialProperty) _self._setMaterialProperty = setMaterialProperty;

                mat = help.CreateBaseMaterial(matId, function (material) {
                    if (_self._setMaterialProperty instanceof Function) {
                        var m = _self._setMaterialProperty(material, _self, matId, materialIsExist);  
                        return m;
                    }

                    return material;
                });
                if (!mat) {
                    _self._setMaterialProperty = null;
                    Errors.ClientNotImplementedException("material not exist", { IMaterialContainer: _self, setMaterialProperty: setMaterialProperty, matId: matId });
                }
                return mat;

            };

            /**
             * Переопределяет  и извлекает мета инфу о материале и о текстурах если не указанно обратное.
             * делает проверку на соответствие имени материала
             * но исключение не выбрасывает  - показывает только консоль о потенциальной ошибке
             * see IMaterialContainer.SetExternalTexture
             * @param {object} babylonMaterial BABYLON.Material 
             * @param {bool} notSetExternalTextures   default false
             * @param {object} advancedTextureNames    can be null, prop name must be texturename not equal with default texture name
             * @returns {object}  IMaterialContainer  текущий инст контейнера
             */
            _self.SetExternalMaterial = function (babylonMaterial, notSetExternalTextures, advancedTextureNames) {
                if (!babylonMaterial) throw Errors.ClientNullReferenceException({ babylonMaterial: babylonMaterial, IMaterialContainer: _self }, "babylonMaterial", "IMaterialContainer.SetExternalMaterial");
                var templateMaterialId = _self._createMaterialId();
                if (_self.MaterialId) {
                    var oldMaterial = EM.GetMaterial(_self.MaterialId);
                    if (oldMaterial) {
                        Utils.Console.Warn("IMaterialContainer.SetExternalMaterial в текущей сцене уже есть связанным и назначенный материал", {
                            IMaterialContainer: _self,
                            oldMaterial: oldMaterial,
                            babylonMaterial: babylonMaterial,
                            babylonMaterialId: babylonMaterial.id,
                            templateMaterialId: templateMaterialId
                        });
                    }
                }
                _self.MaterialId = babylonMaterial.id;
                if (templateMaterialId !== babylonMaterial.id) {
                    Utils.Console.Warn("Material is not equal with template", {
                        "babylonMaterial.id": babylonMaterial.id,
                        templateMaterialId: templateMaterialId,
                        IMaterialContainer: _self
                    });
                }
                if (!notSetExternalTextures) {
                    var st = _self.SetExternalTexture;
                    if (babylonMaterial.diffuseTexture) {
                        st(TEXTURE_TYPES.Dffuse, babylonMaterial.diffuseTexture);
                    }

                    if (babylonMaterial.bumpTexture) {
                        st(TEXTURE_TYPES.Bump, babylonMaterial.bumpTexture);
                    }
                    if (babylonMaterial.specularTexture) {
                        st(TEXTURE_TYPES.Specular, babylonMaterial.specularTexture);
                    }
                    if (babylonMaterial.ambientTexture) {
                        st(TEXTURE_TYPES.Ambient, babylonMaterial.ambientTexture);
                    }
                    if (babylonMaterial.emissiveTexture) {
                        st(TEXTURE_TYPES.Emissive, babylonMaterial.emissiveTexture);
                    }
                    if (babylonMaterial.opacityTexture) {
                        st(TEXTURE_TYPES.Opacity, babylonMaterial.opacityTexture);
                    }
                    if (babylonMaterial.reflectionTexture) {
                        st(TEXTURE_TYPES.Reflection, babylonMaterial.reflectionTexture);
                    }
                    if (babylonMaterial.lightmapTexture) {
                        st(TEXTURE_TYPES.Light, babylonMaterial.lightmapTexture);
                    }
                    if (babylonMaterial.refractionTexture) {
                        st(TEXTURE_TYPES.Refraction, babylonMaterial.refractionTexture);
                    }
                    if (advancedTextureNames && !_.isEmpty(advancedTextureNames)) {
                        _.forEach(advancedTextureNames, function (texture, textureKey) {
                            if (!_self.ExistTexture(textureKey)) {
                                st(textureKey, texture);
                            }
                            else {
                                console.log("texture type is wrong", {
                                    advancedTextureNames: advancedTextureNames,
                                    texture: texture,
                                    textureKey: textureKey,
                                    IMaterialContainer: _self,
                                });
                            }
                        });
                    }
                }
                return _self;

            }
            _self.GetMaterial = function () {
                return _self.GetOrCreateMaterial();
            };
            return _self;
        }

        function IRenderOption() {
            var _self = this;
            var _observers = {};
            var _callbaks = {};
            this.StartOnBeforeRender = function (uniqeId, actionKey, params) {
                if (!uniqeId || !_isNotEmptyString(actionKey) || !params || typeof params !== "object") {
                    throw Errors.ClientTypeErrorException({ IRenderOption: _self }, params, "object", "IRenderOption.StartOnBeforeRenderObservable");
                }

                // _observer =  EM.Scene.onBeforeRenderObservable(_onBeforeRenderObservable);
                var callback = _callbaks[actionKey];
                if (!(callback instanceof Function)) throw Errors.ClientNullReferenceException({ IRenderOption: _self }, "_callbaks[key]", "IRenderOption.StartOnBeforeRenderObservable");
                _observers[uniqeId] = EM.Scene.onBeforeRenderObservable.add(function (eventData, mask) {
                    if (!callback(eventData, mask, params, _self)) _self.StopBeforeRender(uniqeId);
                });
                return _self;
            };
            this.StopBeforeRender = function (uniqeId) {
                //   EM.Scene.unregisterBeforeRender(_onBeforeRenderObservable);  
                EM.Scene.onBeforeRenderObservable.remove(_observers[uniqeId]);
                _observers[uniqeId] = null;
                delete _observers[uniqeId];
            };
            this.AddFunction = function (key, onBeforeRenderObservable) {
                _callbaks[key] = onBeforeRenderObservable;

            }
            return this;
        }


        /**
         * Создает инст для хранения информации о базовом меше
         * @param {function} createMeshId возвращает базовый meshId для соответствующего типа меша   BASE_SUB_NAMES исполюзуются как имена по умолчанию на вернем слое поэтому   
         * фабрика должна возвращать базове имя по шаблону
         * {textureId}_{LAYER_NAMES} ? {возможное дополнение в рамках создания шаблона BASE_SUB_NAMES.ring||BASE_SUB_NAMES.cloud},
         * Если меш импортируется фабрика должна возвращать имя импортированного меша, 
         * имя меша  из сцены так же должно соответствовать шаблону.
         * нельзя указывать BASE_SUB_NAMES.regular
         * если меш не имеет префиксов и поствиксов (uniqueId,parentMeshId) метод следует вызывать без параметров, иначе с.
         * если имя не является шаблонным есть следующие варианты использвоания: 
         * 1-только через   ILayerContainer - при инициализации переопределить базовый метод создания меш ид,
         * 2-не использовать и не создавать конструктора
         * 3  в каком то из родительских класов учесть отличие в имени  
         * @returns {object} IMeshContainer 
         */
        function IMeshContainer(createMeshId) {
            if (!(createMeshId instanceof Function)) throw Utils.Console.Error("IMeshContainer - param createMeshId is requred  mesh id factory");
            var _self = this;
            this._meshId = null;
            this._createMeshId = createMeshId;

            /**
             * если без параметров будет возвращено имя базового меша, иначе параметры будут добавленны в соотв с шаблоном {parentMeshId}.{_meshId}_{uniqueId}
             * @param {int||string} uniqueId   can be null  
             * @param {int||string} parentMeshId can be null
             * @returns {string} meshId  по шаблонам:
             *  передан uniqueId  {_meshId}_{uniqueId}
             *  передан uniqueId  и  parentMeshId   {parentMeshId}.{_meshId}_{uniqueId}
             *  передан только парент   {parentMeshId}.{_meshId}
             * стандартный шаблон для _meshId    см в описании класа IMeshContainer
             */
            this.GetMeshId = function (uniqueId, parentMeshId) {
                if (!this._meshId) this._meshId = this._createMeshId();
                return _combineMeshIds(this._meshId, uniqueId, parentMeshId);
            };
            this.AdvPropNames = {};

            /**
             * see IMeshContainer  GetMeshId
             * @param {int||string} uniqueId   can be null  
             * @param {int||string} parentMeshId can be null
             * @returns {object||null}   BABYLON.Mesh  если  null  следуют проверить шаблон имени меша, или же меш был уничтожен и требуется пересоздание
             */
            this.GetMesh = function (uniqueId, parentMesId) {
                return help.GetMesh(_self.GetMeshId(uniqueId, parentMesId));
            };
            this._addProp = function (propKey, propVal) {
                this[propKey] = propVal;
                if (!_.startsWith(propKey, "_")) {
                    console.log("IMeshContainer.AddProp: Local property must be start with '_' ", { IMeshContainer: _self });
                }
                this.AdvPropNames[propKey] = propKey;
            };
            return this;
        }

        /**
         * создает контейнер для одноименного слоя (см - AssetRepositor.LAYER_NAMES) 
         * назначение :создание хранение и извлеченик информации о мешах и материалах возможные типы контейнеров 
         * @param {object} iGameObjectMeta   see  IGameObjectMeta
         * @returns {object}  ILayerContainer
         */
        function ILayerContainer(iGameObjectMeta) {
            var $self = this;
            $self.LayerName = iGameObjectMeta.LayerName;
            $self.TextureTypeId = iGameObjectMeta.TextureTypeId;
            $self.AdvancedName = iGameObjectMeta.AdvancedName;
            $self.ObjectName = iGameObjectMeta.ObjectName;

            $self.materiales = {};
            $self.materiales[SUBTYPE_MATERIAL_NAMES.regular] = null;
            $self.materiales[SUBTYPE_MATERIAL_NAMES.cloud] = null;
            $self.materiales[SUBTYPE_MATERIAL_NAMES.ring] = null;

            $self.materiales[SUBTYPE_MATERIAL_NAMES.click] = null;
            $self.materiales[SUBTYPE_MATERIAL_NAMES.hover] = null;

            $self.meshes = {};
            $self.meshes[SUBTYPE_MESH_NAMES.regular] = null;
            $self.meshes[SUBTYPE_MESH_NAMES.cloud] = null;
            $self.meshes[SUBTYPE_MESH_NAMES.ring] = null;

            $self.GetMeshContainer = function (baseSubContainerName) {
                if (!baseSubContainerName) return $self.meshes.regular;
                return $self.meshes[baseSubContainerName];
            };


            $self.GetMesh = function (subTypeMeshName, uniqueId, parentMesId) {
                //IMeshContainer
                var meshContainer = $self.GetMeshContainer(subTypeMeshName);
                if (!meshContainer) return null;
                if (typeof meshContainer === "object") return meshContainer.GetMesh(uniqueId, parentMesId); // IMeshContainer  
                throw Errors.ClientTypeErrorException({
                    subTypeMeshName: subTypeMeshName,
                    ILayerContainer: $self,
                    meshSection: meshContainer
                }, meshContainer, "object/IMeshContainer", "ILayerContainer.GetMesh");
            };
            $self.GetMeshId = function (subTypeMeshName, uniqueId, parentMesId) {
                //IMeshContainer
                var meshContainer = $self.GetMeshContainer(subTypeMeshName);
                if (!meshContainer) return null;
                if (typeof meshContainer === "object") return meshContainer.GetMeshId(uniqueId, parentMesId);
                throw Errors.ClientTypeErrorException({
                    subTypeMeshName: subTypeMeshName,
                    ILayerContainer: $self,
                    meshSection: meshContainer
                }, meshContainer, "object/IMeshContainer", "ILayerContainer.GetMeshId");
            };

            /**
             *  
             * @param {string} subTypeMeshName   see SUBTYPE_MESH_NAME
             * @param {function} createMeshId see   IMeshContainer.constructor
             * @returns {object} IMeshContainer
             */
            $self.AddMeshContainer = function (subTypeMeshName, createMeshId) {
                var advName = subTypeMeshName || "";
                if (!subTypeMeshName) subTypeMeshName = BASE_SUB_NAMES.regular;
                if (subTypeMeshName !== BASE_SUB_NAMES.regular) advName = subTypeMeshName;
                $self.meshes[subTypeMeshName] = new IMeshContainer(createMeshId || function () {
                    return _createOriginalMeshIdTemplate($self.TextureTypeId, $self.LayerName, advName);
                });
                return $self.meshes[subTypeMeshName];
            };

            $self.AddMeshContainerFromExternalMesh = function (externalMesh, subTypeMeshName) {
                var advName = subTypeMeshName || "";
                if (subTypeMeshName === BASE_SUB_NAMES.regular) advName = "";
                if (!subTypeMeshName) subTypeMeshName = BASE_SUB_NAMES.regular;
                var templateName = _createOriginalMeshIdTemplate($self.TextureTypeId, $self.LayerName, advName);
                if (templateName !== externalMesh.id) {
                    throw Errors.ClientNotEqualException({
                        advName: advName,
                        externalMesh: externalMesh,
                        subTypeMeshName: subTypeMeshName,
                        templateName: templateName
                    }, "ILayerContainer.AddMeshContainerFromExternalMesh");
                }
                var meshId = externalMesh.id;
                $self.meshes[subTypeMeshName] = new IMeshContainer(function () {
                    return meshId;
                });
                return $self.meshes[subTypeMeshName];
            };

            /**
             * 
             * @param {string} subtypeMaterialName  can be null, default - SUBTYPE_MATERIAL_NAMES.regular 
             * @returns {object||null}  IMaterialContainer
             */
            $self._getIMaterialContainer = function (subtypeMaterialName) {
                if (subtypeMaterialName && SUBTYPE_MATERIAL_NAMES.hasOwnProperty(subtypeMaterialName)) return $self.materiales[subtypeMaterialName];
                if ($self.materiales[SUBTYPE_MATERIAL_NAMES.regular]) return $self.materiales[SUBTYPE_MATERIAL_NAMES.regular];
                return null;
            }

            /**
             * 
             * @param {object} iMaterialContainer constuctor IMaterialContainer 
             * @param {string} subtypeMaterialName  can be null, default - SUBTYPE_MATERIAL_NAMES.regular 
             * @returns {object} IMaterialContainer 
             * throws [ClientNullReferenceException,ClientTypeErrorException,ClientNotImplementedException]
             */
            $self.AddIMaterialContainer = function (iMaterialContainer, subtypeMaterialName) {
                if (!iMaterialContainer) throw Errors.ClientNullReferenceException({
                    subtypeMaterialName: subtypeMaterialName,
                    iMaterial: iMaterialContainer
                }, "iMaterialContainer", "ILayerContainer.AddIMaterialContainer");

                if (typeof iMaterialContainer !== "object") {
                    throw Errors.ClientTypeErrorException({
                        subtypeMaterialName: subtypeMaterialName,
                        iMaterial: iMaterialContainer
                    }, iMaterialContainer, "object/IMaterialContainer", "ILayerContainer.AddIMaterialContainer");
                }
                if (!subtypeMaterialName && !$self.materiales[SUBTYPE_MATERIAL_NAMES.regular]) return $self.materiales[SUBTYPE_MATERIAL_NAMES.regular] = iMaterialContainer;
                if ($self.materiales[subtypeMaterialName]) return $self.materiales[subtypeMaterialName];
                if (SUBTYPE_MATERIAL_NAMES.hasOwnProperty(subtypeMaterialName)) {
                    $self.materiales[subtypeMaterialName] = iMaterialContainer;
                    return $self.materiales[subtypeMaterialName];
                }
                throw Errors.ClientNotImplementedException({ subtypeMaterialName: subtypeMaterialName, iMaterialContainer: iMaterialContainer, ILayerContainer: $self }, "ILayerContainer.AddIMaterialContainer");
            };

            /**
             * 
             * @param {string} subtypeMaterialName  can be null, default - SUBTYPE_MATERIAL_NAMES.regular 
             * @param {boolian} notThrowIfNull   can be null   if true not droup Exception
             * @returns {object} IMaterialContainer 
             * throws [Errors.ClientNullReferenceException]
             */
            $self.GetIMaterialContainer = function (subtypeMaterialName, notThrowIfNull) {
                var iMat = $self._getIMaterialContainer(subtypeMaterialName);
                if (!iMat && !notThrowIfNull) throw Errors.ClientNullReferenceException({ IMaterialContainer: iMat, ILayerContainer: $self }, "iMat", "ILayerContainer.GetIMaterialContainer");
                return iMat;
            };


            /**
             * see  ILayerContainer._getIMaterialContainer
             * @param {string} subtypeMaterialName  can be null, default - SUBTYPE_MATERIAL_NAMES.regular 
             * @returns {boolian} isEmpty
             */
            $self.HasIMaterialContainer = function (subtypeMaterialName) {
                return !!$self._getIMaterialContainer(subtypeMaterialName);
            };
            $self.RenderOption = null;
            $self.GetOrCreateRenderOptions = function () {
                if ($self.RenderOption) return $self.RenderOption;
                return $self.RenderOption = new IRenderOption();
            };
            return $self;

        };

        /**
         *  Create new ITypeItem
         * Хранит связанную с textureTypeId информацию о объектах
         * текстуры
         * мешы
         * материалы
         * css спрайты
         * Информцию о каталоге для соотв типа
         * Примечание :
         * данные и фабрики должны быть инициализированны в момент старта приложения до запуска  метдов котоыре будут обращаться к данным класа
         * может  расширятсья при инициализации
         * цель класса создать всею связанную мета иформацию для создания и извлечения обектов сцены  и html спрайтов
         * @param {int|| string} textureTypeId ключ эллемнта, основной идентификатор для типа
         * @param {string} mapTypeName (loweredName) 
         * @param {string} innerGatalogName   can be null
         * @param {string} sceneName     can be null   имя сцены из загрузочного файла для формирования правильных имен патериалов в сцене
         * @param {string} iTypeCatalog   can be null если указан -класс расширяется переданным каталогом
         * @param {bool} notSetCss  по умолчанию создает  css спраты для эллемента,  для отмены нужно явное указание 
         * @returns {object} ITypeItem 
         */
        ar.ITypeItem = function (textureTypeId, mapTypeName, innerGatalogName, sceneName, iTypeCatalog, notSetCss) {
            // console.log("itemKeyId", itemKeyId); 
            function ITypeItem() {
                var _self = _.extend(this, iTypeCatalog || new ITypeCatalog(textureTypeId, innerGatalogName));
                _self._sceneName = sceneName;

                //#region Layer
                /**
                 * 
                 * @param {string} layerName  required
                 * @param {bool} notThrowIfNull 
                 * @returns {object} ILayerContainer
                 * throws[ClientNullReferenceException,ClientTypeErrorException] 
                 */
                _self._getLayer = function (layerName, notThrowIfNull) {
                    if (_self.hasOwnProperty(layerName)) {
                        var layer = _self[layerName];
                        if (!layer && notThrowIfNull) return layer;
                        if (typeof layer === "object") return layer;
                        throw Errors.ClientTypeErrorException({
                            layerName: layerName
                        }, "ITypeItem._getLayer", layerName, "object/ILayerContainer");
                    }
                    else if (notThrowIfNull) return null;
                    else throw Errors.ClientNullReferenceException({ layerName: layerName, notThrowIfNull: notThrowIfNull }, "ITypeItem[layerName]", "ITypeItem._getLayer");
                };

                /**
                 * проверяет переданные параметры и в зависимости от их наличия возвращает объект ILayerContainer 
                 * @param {string} layerName  can be null  if IGameObjectMeta or  _layer    else required
                 * @param {object} gameObjectMeta IGameObjectMeta    can be null  if layerName  or  _layer    else required
                 * @param {bool} notThrowIfNull 
                 * @param {object} _layer  can be null    if IGameObjectMeta or  layerName    else required
                 * @returns {object||null} ILayerContainer
                 * throws[ClientNullReferenceException,ClientTypeErrorException,ClientNotImplementedException]   (if notThrowIfNull = false)
                 */
                _self._getLayerElseIf = function (layerName, gameObjectMeta, notThrowIfNull, _layer) {
                    if (_layer) return _layer;
                    if (gameObjectMeta) return _self.GetOrCreateLayer(gameObjectMeta);
                    if (layerName) return _self._getLayer(layerName);
                    throw Errors.ClientNotImplementedException({ ITypeItem: _self, layerName: layerName, gameObjectMeta: gameObjectMeta, notThrowIfNull: notThrowIfNull, _layer: _layer });

                };

                /**
                 * получает или создает объект слоя
                 * @param {object} gameObjectMeta IGameObjectMeta required
                 * @returns {object}  ILayerContainer
                 * throws[ClientNullReferenceException,ClientTypeErrorException] 
                 */
                _self.GetOrCreateLayer = function (gameObjectMeta) {
                    _self._isValidObjectMeta(gameObjectMeta);
                    var layerName = gameObjectMeta.LayerName;
                    if (!layerName) {
                        throw Errors.ClientNullReferenceException({ layerName: layerName, iGameObjectMeta: gameObjectMeta }, "ITypeItem.GetOrCreateLayer");
                    }
                    if (_self[layerName]) return _self[layerName];
                    return _self[layerName] = new ILayerContainer(gameObjectMeta);
                };

                //#endregion;

                //#region Mesh

                /**
                 * see ILayerContainer.GetMeshId , IMeshContainer.GetMesh
                 * @param {string} layerName  can be null  if IGameObjectMeta or  _layer    else required
                 * @param {string}subTypeMeshName can be null  - SUBTYPE_MESH_NAME  see EM.AssetRepository.SUBTYPE_MESH_NAMES,  ILayerContainer.GetMeshId,  IMeshContainer.GetMeshId
                 * @param {object} gameObjectMeta IGameObjectMeta    can be null  if layerName  or  _layer    else required
                 * @param {int||string} uniqueId     see IMeshContainer.GetMeshId
                 * @param {int||string} parentMehsId   see IMeshContainer.GetMeshId
                 * @param {object} _layer  can be null    if IGameObjectMeta or  layerName    else required
                 * @returns {string} meshId
                 * throws[ClientNullReferenceException,ClientTypeErrorException,ClientNotImplementedException]
                 */
                _self.GetMeshId = function (layerName, subTypeMeshName, gameObjectMeta, uniqueId, parentMehsId, _layer) {
                    var layer = _self._getLayerElseIf(layerName, gameObjectMeta, false, _layer);
                    if (layer) return layer.GetMeshId(subTypeMeshName, uniqueId, parentMehsId);
                    throw Errors.ClientNullReferenceException({ layerName: layerName, subTypeMeshName: subTypeMeshName, ITypeItem: _self }, "layer", "ITypeItem.GetMeshId");
                };
                /**
                 * see ILayerContainer.GetMesh,IMeshContainer.GetMesh
                 * @param {string} layerName  can be null  if IGameObjectMeta or  _layer    else required
                 * @param {string}subTypeMeshName can be null  - SUBTYPE_MESH_NAME  see EM.AssetRepository.SUBTYPE_MESH_NAMES,  ILayerContainer.GetMesh,  IMeshContainer.GetMesh
                 * @param {int||string} uniqueId     see IMeshContainer.GetMesh
                 * @param {int||string} parentMehsId   see IMeshContainer.GetMesh
                 * @param {object} gameObjectMeta IGameObjectMeta    can be null  if layerName  or  _layer    else required
                 * @param {object} _layer  can be null    if IGameObjectMeta or  layerName    else required
                 * @returns {object} BABYLON.Mesh || null
                 * throws[ClientNullReferenceException,ClientTypeErrorException,ClientNotImplementedException]
                 */
                _self.GetMesh = function (layerName, subTypeMeshName, uniqueId, parentMehsId, gameObjectMeta, _layer) {
                    var layer = _self._getLayerElseIf(layerName, gameObjectMeta, false, _layer);
                    return layer.GetMesh(subTypeMeshName, uniqueId, parentMehsId);
                };

                /**
                 *  see  ILayerContainer.AddMeshContainer
                 * @param {object} gameObjectMeta IGameObjectMeta    can be null  if layerName  or  _layer    else required
                 * @param {function} createMeshId   see    IMeshContainer can be null if name standart
                 * @param {string} layerName  can be null  if IGameObjectMeta or  _layer    else required
                 * @param {string}subTypeMeshName can be null  - SUBTYPE_MESH_NAME  see EM.AssetRepository.SUBTYPE_MESH_NAMES,  ILayerContainer.AddMeshContainer
                 * @param {object} _layer  can be null    if IGameObjectMeta or  layerName    else required
                 * @returns {object} IMeshContainer
                 * throws[ClientNullReferenceException,ClientTypeErrorException,ClientNotImplementedException]
                 */
                _self.AddMeshContainer = function (gameObjectMeta, createMeshId, layerName, subTypeMeshName, _layer) {
                    var layer = _self._getLayerElseIf(layerName, gameObjectMeta, _layer);
                    return layer.AddMeshContainer(subTypeMeshName, createMeshId);
                };

                /**
                 * see  ILayerContainer.AddMeshContainerFromExternalMesh
                 * @param {object} externalMesh   BABYLON.Mesh
                 * @param {object} gameObjectMeta IGameObjectMeta    can be null  if layerName  or  _layer    else required
                 * @param {string}subTypeMeshName can be null  - SUBTYPE_MESH_NAME  see EM.AssetRepository.SUBTYPE_MESH_NAMES,  ILayerContainer.AddMeshContainerFromExternalMesh
                 * @param {string} layerName  can be null  if IGameObjectMeta or  _layer    else required
                 * @param {object} _layer  can be null    if IGameObjectMeta or  layerName    else required
                 * @returns {object}  IMeshContainer
                 * throws[ClientNullReferenceException,ClientTypeErrorException,ClientNotImplementedException]
                 */
                _self.AddMeshContainerFromExternalMesh = function (externalMesh, gameObjectMeta, subTypeMeshName, layerName, _layer) {
                    var layer = _self._getLayerElseIf(layerName, gameObjectMeta, _layer);
                    return layer.AddMeshContainerFromExternalMesh(externalMesh, subTypeMeshName);
                };
                //#endregion;

                //#region Material

                /**
                 *  see  ILayerContainer.GetIMaterialContainer, IMaterialContainer
                 * @param {string} layerName  can be null  if  _layer    else required
                 * @param {string} subtypeMaterialName  can be null, default - SUBTYPE_MATERIAL_NAMES.regular  (in
                 * @param {bool} notThrowIfNull    can be null 
                 * @param {object} _layer   layerName  can be null  if  layerName    else required
                 * @returns {object}  IMaterialContainer
                 *  throws[ClientNullReferenceException,ClientTypeErrorException,ClientNotImplementedException]
                 */
                _self.GetIMaterialContainer = function (layerName, subtypeMaterialName, notThrowIfNull, _layer) {
                    var layer = _self._getLayerElseIf(layerName, null, notThrowIfNull, _layer);
                    if (!layer) return null;
                    return layer.GetIMaterialContainer(subtypeMaterialName, notThrowIfNull);
                }

                /**
                 * see   ILayerContainer.GetIMaterialContainer, IMaterialContainer
                 * @param {object} gameObjectMeta IGameObjectMeta    can be null   if _layer    else required
                 * @param {string} subtypeMaterialName  can be null, default - SUBTYPE_MATERIAL_NAMES.regular  (in)
                 * @param {bool} notShowConsoleIfExist 
                 * @param {object} _layer    can be null  if  gameObjectMeta    else required
                 * @returns {object}  IMaterialContainer || console if material before exist and  notShowConsoleIfExist = flase
                 *  throws[ClientNullReferenceException,ClientTypeErrorException,ClientNotImplementedException]
                 */
                _self.CreateIMaterialContainer = function (gameObjectMeta, subtypeMaterialName, notShowConsoleIfExist, _layer) {
                    var layer = _self._getLayerElseIf(null, gameObjectMeta, false, _layer);
                    if (!subtypeMaterialName) subtypeMaterialName = SUBTYPE_MATERIAL_NAMES.regular;
                    if (layer.HasIMaterialContainer(subtypeMaterialName)) {
                        var mat = layer.GetIMaterialContainer(subtypeMaterialName);
                        if (!notShowConsoleIfExist) {
                            Utils.Console.Warn("ITypeItem.CreateIMaterialContainer - IMaterialContainer exist, return old IMaterialContainer", {
                                subtypeMaterialName: subtypeMaterialName,
                                layer: layer,
                                mat: mat
                            });
                        }
                        return mat;
                    }
                    var meta = new IGameObjectMeta(textureTypeId, layer.LayerName, subtypeMaterialName);
                    var iMaterial = new IMaterialContainer(meta, _self, subtypeMaterialName);
                    return layer.AddIMaterialContainer(iMaterial, subtypeMaterialName);
                };

                /**
                 *  see  ILayerContainer.GetIMaterialContainer, ILayerContainer.AddIMaterialContainer
                 * @param {string} layerName  can be null  if  _layer    else required
                 * @param {object} iMaterial   required
                 * @param {string} subtypeMaterialName  can be null, default - SUBTYPE_MATERIAL_NAMES.regular 
                 * @param {object} _layer    can be null  if  layerName    else required
                 * @returns {object} IMaterialContainer , if  exist return old container
                 *  throws[ClientNullReferenceException,ClientTypeErrorException,ClientNotImplementedException]
                 */
                _self.AddIMaterialContainer = function (layerName, iMaterial, subtypeMaterialName, _layer) {
                    var layer = _self._getLayerElseIf(layerName, null, false, _layer);
                    if (layer.HasIMaterialContainer(subtypeMaterialName)) {
                        var mat = layer.GetIMaterialContainer(subtypeMaterialName);
                        Utils.Console.Warn("ITypeItem.AddIMaterialContainer - IMaterialContainer exist, return old IMaterialContainer", {
                            layerName: layerName,
                            subtypeMaterialName: subtypeMaterialName,
                            existIMaterial: mat,
                            paramIMaterial: iMaterial
                        });
                        return mat;
                    }
                    return layer.AddIMaterialContainer(iMaterial, subtypeMaterialName);
                };

                /**
                 * see  ITypeItem.GetIMaterialContainer, ITypeItem.CreateIMaterialContainer
                 * @param {object} gameObjectMeta IGameObjectMeta    can be null   if _layer    else required
                 * @param {string} subtypeMaterialName  can be null, default - SUBTYPE_MATERIAL_NAMES.regular  (in) 
                 * @param {object} _layer    can be null  if  gameObjectMeta    else required
                 * @returns {object}   IMaterialContainer
                 * throws[ClientNullReferenceException,ClientTypeErrorException,ClientNotImplementedException]
                 */
                _self.GetOrCreateIMaterial = function (gameObjectMeta, subtypeMaterialName, _layer) {
                    var layer = _self._getLayerElseIf(null, gameObjectMeta, false, _layer);
                    var iMat = _self.GetIMaterialContainer(layer.LayerName, subtypeMaterialName, true, layer);
                    if (!iMat) iMat = _self.CreateIMaterialContainer(gameObjectMeta, subtypeMaterialName, false, layer);
                    return iMat;
                };
                /**
                 * see  ITypeItem.CreateIMaterialContainer
                 * @param {object} gameObjectMeta IGameObjectMeta    required
                 * @param {function} setMaterialProperty  if null return empty material
                 * @param {string} subtypeMaterialName  can be null, default - SUBTYPE_MATERIAL_NAMES.regular  (in) 
                 * @returns {object} BABYLON.Material
                 * throws[ClientNullReferenceException,ClientTypeErrorException,ClientNotImplementedException]
                 */
                _self.GetOrCreateMaterial = function (gameObjectMeta, setMaterialProperty, subtypeMaterialName) {
                    if (!subtypeMaterialName) subtypeMaterialName = SUBTYPE_MATERIAL_NAMES.regular;
                    var iMat = _self.GetOrCreateIMaterial(gameObjectMeta, subtypeMaterialName);
                    return iMat.GetOrCreateMaterial(setMaterialProperty);
                };
                /**
                 * Если существует контейнер ITypeItem[layerName] работает как GetOrCreateMaterial  иначе возвращает  null
                 * @param {string} layerName  can be null  if  _layer    else required
                 * @param {string} subtypeMaterialName  can be null, default - SUBTYPE_MATERIAL_NAMES.regular  (in)  
                 * @param {object} _layer    can be null  if  layerName    else required
                 * @returns {object}   BABYLON.Material || null
                 */
                _self.GetMaterial = function (layerName, subtypeMaterialName, _layer) {
                    var layer = _self._getLayerElseIf(layerName, null, true, _layer);
                    if (!layer) return null;
                    if (!subtypeMaterialName) subtypeMaterialName = SUBTYPE_MATERIAL_NAMES.regular;
                    var matContainer = layer.GetIMaterialContainer(subtypeMaterialName, true);
                    if (!matContainer) return null;
                    return matContainer.GetMaterial();
                }

                //#endregion;

                /**
                  * проверяет  существует ли объект и равен ли конструктор объекта типу IGameObjectMeta
                  * @param {object} gameObjectMeta IGameObjectMeta    required
                  * @returns {bool} true or throw
                 *  throws[ClientNullReferenceException,ClientTypeErrorException]
                  */
                _self._isValidObjectMeta = function (gameObjectMeta) {
                    if (!gameObjectMeta) throw Errors.ClientNullReferenceException(null, "gameObjectMeta", "ITypeItem._checkObjectMeta");
                    if (typeof gameObjectMeta !== "object") throw Errors.ClientTypeErrorException({ gameObjectMeta: gameObjectMeta }, gameObjectMeta, "object/IGameObjectMeta", "ITypeItem._isValidObjectMeta");
                    return true;
                };

                /**
                 * Создает новый инст IGameObjectMeta
                 * @param {string} layerName required
                 * @param {string} baseSubName  see BASE_SUB_NAMES
                 * @returns {object} CreateGameObjectMeta
                 *  throws[ClientNullReferenceException] 
                 */
                _self.CreateGameObjectMeta = function (layerName, baseSubName) {
                    if (!layerName) Errors.ClientNullReferenceException({ layerName: layerName, baseSubName: baseSubName }, "layerName", "ITypeItem.CreateGameObjectMeta");
                    return new IGameObjectMeta(textureTypeId, layerName, baseSubName);
                };

                if (!notSetCss) {
                    _self.Css = new ICss(textureTypeId, mapTypeName, _self.CatalogUrl);
                    _self.Css.InitCss();
                }

                _self.GetOrCreateRenderOptions = function (layerName, gameObjectMeta, _layer) {
                    var layer = _self._getLayerElseIf(layerName, gameObjectMeta, false, _layer);
                    return layer.GetOrCreateRenderOptions();
                };

                _self.Pub = {};
                _self.Pub.GetLayer = function (layerName) {
                    return _self._getLayer(layerName, true);
                }
                _self.Pub.GetMeshContainer = function (layerName, meshSubTypeName) {
                    var layer = _self.Pub.GetLayer(layerName);
                    if (!layer) return null;
                    return layer.GetMeshContainer(meshSubTypeName);
                }
                _self.Pub.GetMeshId = function (layerName, subTypeMeshName, uniqueId, parentMehsId) {
                    var layer = _self.Pub.GetLayer(layerName);
                    if (!layer) return null;
                    return layer.GetMeshId(subTypeMeshName, uniqueId, parentMehsId);
                }
                _self.Pub.GetMesh = function (layerName, subTypeMeshName, uniqueId, parentMehsId) {
                    var layer = _self.Pub.GetLayer(layerName);
                    if (!layer) return null;
                    return layer.GetMeshId(subTypeMeshName, uniqueId, parentMehsId);
                }
                _self.Pub.GetIMaterialContainer = function (layerName, subtypeMaterialName) {
                    var layer = _self.Pub.GetLayer(layerName);
                    if (!layer) return null;
                    return layer.GetIMaterialContainer(subtypeMaterialName, true);
                }
                _self.Pub.GetMaterialId = function (layerName, subTypeMaterialName) {
                    var container = _self.Pub.GetIMaterialContainer(layerName, subTypeMaterialName);
                    if (!container) return null;
                    return container.GetOrCreateMaterialId();
                }
                _self.Pub.GetMaterial = function (layerName, subTypeMaterialName) {
                    var container = _self.Pub.GetIMaterialContainer(layerName, subTypeMaterialName);
                    if (!container) return null;
                    return container.GetMaterial();
                }


                _self.Pub.GetTexture = function (layerName, subTypeMaterialName, textureTypeName) {
                    var container = _self.Pub.GetIMaterialContainer(layerName, subTypeMaterialName);
                    if (!container) return null;
                    return container.GetTexture(textureTypeName);
                }
                _self.Pub.GetTextureUrl = function (layerName, subTypeMaterialName, textureTypeName) {
                    var container = _self.Pub.GetIMaterialContainer(layerName, subTypeMaterialName);
                    if (!container) return null;
                    return container.GetTextureUrl(textureTypeName);
                }
                _self.GetTextureContainer = function (layerName, subTypeMaterialName, textureTypeName) {
                    var container = _self.Pub.GetIMaterialContainer(layerName, subTypeMaterialName);
                    if (!container) return null;
                    return container.GetTextureObj(textureTypeName);
                }
                return _self;
            }

            return new ITypeItem();
        }
        ar.SetTypeItem = function (textureTypeId, typeItem) {
            ar.TypeList[textureTypeId] = typeItem;
        };
    };
})(EM.AssetRepository);
//#endregion;

//#endregion;

//#region Initialize TypeItem

//#region TypeList Mother
(function (ar) {
    "use strict";
    ar._initMother = function () {
        var motherTextureId = 2000;
        ar.A_MOTHER_IDS = [motherTextureId];

        var gt = ar.GAME_TEXTURE_ID_RANGES.Mother;
        ar.MapTypeContainer.GetOrAdd(motherTextureId, ar.MapTypes.Mother);

        function createItem() {
            var item = ar.ITypeItem(motherTextureId, gt.Name);
            item.Css.SetIconSelect(item.Css.MediumCss);
            ar.SetTypeItem(motherTextureId, item);
            return item;
        };

        ar._initGroup(createItem, null, true);
    };
})(EM.AssetRepository);

//#endregion;

//#region TypeList Galaxy 
(function (ar) {
    "use strict";
    ar._initGalaxies = function () {
        ar.A_GALAXY_IDS = [];
        var gt = ar.GAME_TEXTURE_ID_RANGES.Galaxy;
        var ln = ar.LAYER_NAMES;
        var text = ar.TEXTURE_TYPES;
        var stMn = ar.SUBTYPE_MATERIAL_NAMES;
        var bsn = ar.BASE_SUB_NAMES;
        var showLog = false;

        function createGalaxy1Material(material, iMaterial, matId, materialIsExist) {
            if (materialIsExist) {

                console.log("createGalaxyMaterial.materialIsExist", {
                    material: material,
                    iMaterial: iMaterial,
                    matId: matId
                });

                return material;

            }


            var emissiveTextureContainer = iMaterial.GetOrCreateTextureItem(text.Emissive);
            var bumpTextureContainer = iMaterial.GetOrCreateTextureItem(text.Bump, ar.EXTENTIONS.png);
            
            material.emissiveTexture = emissiveTextureContainer.GetOrCreateTexture();
            material.emissiveTexture.level = 3;
            material.backFaceCulling = false;
            material.disableLighting = true;
            material.useEmissiveAsIllumination = true;
            material.alpha = 0.999;
            material.alphaMode = BABYLON.Engine.ALPHA_ADD;


            var emFp = new BABYLON.FresnelParameters();
            emFp.bias = 0.1268;
            emFp.power = 10;
            emFp.leftColor = new BABYLON.Color3(0.6,0.85,0.97);
            emFp.rightColor = new BABYLON.Color3(0.36, 0.67, 0.93);
            material.emissiveFresnelParameters = emFp;



            material.bumpTexture = bumpTextureContainer.GetOrCreateTexture();
            material.bumpTexture.level = 3;// 3;
            material.useParallax = true;
            material.useParallaxOcclusion = false;
            material.parallaxScaleBias = 0.015;//0.007;//0.015;     

            //console.log("createGalaxy1Material", {
            //    emissiveTextureContainer: emissiveTextureContainer,
            //    bumpTextureContainer: material.bumpTexture,
            //});
            return material;
        };

        function createGalaxy1() {
            var textureId = 1;
            ar.A_GALAXY_IDS.push(textureId);
            var mapTypeInfo = ar.MapTypeContainer.GetOrAdd(textureId, ar.MapTypes.Galaxy, ar.MapTypes.Spirale);

            //var galaxyId = 1;
            var item = ar.ITypeItem(textureId, gt.Name);
            var meta = item.CreateGameObjectMeta(ln.space, bsn.regular);
            var meshContainer = item.AddMeshContainer(meta);
            meshContainer._addProp(ar.MAP_TYPE_KEY, mapTypeInfo);

            var material = item.GetOrCreateMaterial(meta, createGalaxy1Material, stMn.regular);
            var meshId = item.GetMeshId(ln.space);

            if (showLog) {
                console.log("createGalaxy1", {
                    galaxyItem: item,
                    meta: meta,
                    material: material,
                    meshId: meshId,
                    meshContainer: meshContainer
                });
            }


            ar.SetTypeItem(textureId, item);
            return item;
        }
        createGalaxy1();


    };
})(EM.AssetRepository);




//#endregion;

//#region TypeList Sector
(function (ar) {
    "use strict";
    ar._initSectors = function () {
        ar.A_SECTOR_IDS = [];
        var gt = ar.GAME_TEXTURE_ID_RANGES.Sector;
        var ln = ar.LAYER_NAMES;
        var stMn = ar.SUBTYPE_MATERIAL_NAMES;
        var showLog = false;
        function createSector201Material(material, materialIsExist, color, isEmissive, alpha) {
            if (materialIsExist) return material;
            color = BABYLON.Color3.FromInts(color.r, color.g, color.b);
            if (isEmissive) {
                material.emissiveColor = color;
                material.alpha = alpha || 1;
                material.disableLighting = true;
            } else {
                material.diffuseColor = color;
                material.emissiveColor = color;
            };
            return material;
        };

        function createSector201() {
            var textureId = 201;
            ar.A_SECTOR_IDS.push(textureId);
            var mapTypeInfo = ar.MapTypeContainer.GetOrAdd(textureId, ar.MapTypes.Sector);
            var item = ar.ITypeItem(textureId, gt.Name);
            var meta = item.CreateGameObjectMeta(ln.space);
            var meshContainer = item.AddMeshContainer(meta);
            meshContainer._addProp(ar.MAP_TYPE_KEY, mapTypeInfo);
            var meshId = item.GetMeshId(ln.space);
            item.GetOrCreateMaterial(meta, function (material, iMaterial, matId, materialIsExist) {
                return createSector201Material(material, materialIsExist, new BABYLON.Color3(230, 204, 255), true, 0.4);
            }, stMn.regular);

            item.GetOrCreateMaterial(meta, function (material, iMaterial, matId, materialIsExist) {
                return createSector201Material(material, materialIsExist, new BABYLON.Color3(255, 0, 0));
            }, stMn.click);

            item.GetOrCreateMaterial(meta, function (material, iMaterial, matId, materialIsExist) {
                return createSector201Material(material, materialIsExist, new BABYLON.Color3(25, 229, 225));
            }, stMn.hover);
            ar.SetTypeItem(textureId, item);
            if (showLog) {
                console.log("createSector201", { meshId: meshId, item: item });
            }

        };
        createSector201();
    };
})(EM.AssetRepository);

//#endregion

//#region TypeList Stars

(function (ar) {
    "use strict";
    ar._initStars = function () {
        var groupIds = ar.A_STAR_IDS = [301, 302, 303, 304, 305, 306, 307, 308];
 
        var gt = ar.GAME_TEXTURE_ID_RANGES.Star;
        var ln = ar.LAYER_NAMES;
        var text = ar.TEXTURE_TYPES;
        var bsn = ar.BASE_SUB_NAMES;
        var subMeshName = ar.SUBTYPE_MESH_NAMES;
        function createItem(textureTypeId, subMapTypeName, spriteIndex) {
            var mapTypeInfo = ar.MapTypeContainer.GetOrAdd(textureTypeId, ar.MapTypes.Star, subMapTypeName);
            var item = ar.ITypeItem(textureTypeId, gt.Name);
            var meta = item.CreateGameObjectMeta(ln.space);
            var baseStarContainer = item.AddMeshContainer(meta);
            item.GetMeshId(ln.space);

            var spriteMeta = item.CreateGameObjectMeta(ln.space, subMeshName.sprite);
            var spriteMeshContainer = item.AddMeshContainer(spriteMeta, null, ln.space, subMeshName.sprite);
            spriteMeshContainer._addProp("_parentName", EM.MapGeometry.SYSTEM_PROTO_NAME);
            spriteMeshContainer._addProp(ar.MAP_TYPE_KEY, mapTypeInfo);
            spriteMeshContainer._addProp("_spriteIndex", spriteIndex);

            spriteMeshContainer._addProp("_getFullSpriteId", function (systemId) {
                return spriteMeshContainer.GetMeshId(systemId, spriteMeshContainer._parentName);
            });

            spriteMeshContainer._addProp("_getBaseSpriteId", function (systemId) {
                return spriteMeshContainer.GetMeshId(systemId);
            });



            baseStarContainer._addProp(ar.MAP_TYPE_KEY, mapTypeInfo);
            baseStarContainer._addProp("_getFullSpriteId", function (systemId) {
                return spriteMeshContainer._getFullSpriteId(systemId);
            });



            item.GetOrCreateMaterial(meta, function (material, _iMaterial, matId, materialIsExist) {
                if (materialIsExist) return material;
                var emissiveTextureContainer = _iMaterial.GetOrCreateTextureItem(text.Emissive);
                material.emissiveTexture = emissiveTextureContainer.GetOrCreateTexture();
                material.emissiveTexture.level = 0.5;
                material.disableLighting = true;
                return material;
            }, bsn.regular);



            var spriteContainer = item.Pub.GetMeshContainer(ln.space, subMeshName.sprite);
            var spriteMesh = spriteContainer.GetMeshId();

            ar.SetTypeItem(textureTypeId, item);
        };

        createItem(301, ar.MapTypes.A, 0);
        createItem(302, ar.MapTypes.B, 1);
        createItem(303, ar.MapTypes.F, 2);
        createItem(304, ar.MapTypes.G, 3);
        createItem(305, ar.MapTypes.K, 4);
        createItem(306, ar.MapTypes.L, 5);
        createItem(307, ar.MapTypes.M, 6);
        createItem(308, ar.MapTypes.O, 7);

    };
})(EM.AssetRepository);

//#endregion;

//#region TypeList Planet    (all)
(function (ar) {
    "use strict";
    ar._initPlanets = function (newMeshes, sceneName) {

        ar.A_PLANET_IDS = [];
        var erthIds = [401, 402, 403, 404, 405, 406];
        var gasIds = [501, 502, 503, 504, 505];
        var iceGasIds = [601, 602];
        var showLog = false;


        if (showLog) {
            console.log("_initPlanets.newMeshes", newMeshes);
        }

        function _zero() {
            return BABYLON.Vector3.Zero();
        }

        var gt = ar.GAME_TEXTURE_ID_RANGES;
        var ln = ar.LAYER_NAMES;
        var text = ar.TEXTURE_TYPES;
        var sbMn = ar.SUBTYPE_MATERIAL_NAMES;
        var subMeshName = ar.SUBTYPE_MESH_NAMES;
        var gtn = ar.GO_TYPE_NAMES;
        var bsn = ar.BASE_SUB_NAMES;
        var ext = ar.EXTENTIONS;
        var blackColor = BABYLON.Color3.Black();
        var _mapTypeKey = ar.MAP_TYPE_KEY;
        var TWO_PI = Math.PI * 2;

        // SubtypeMaterialName

        function clientNotImplementedException(material, iMaterial, spaceLayer, materialType, message) {
            Errors.ClientNotImplementedException({
                material: material,
                iMaterial: iMaterial,
                spaceLayer: spaceLayer,
                materialType: materialType
            }, message);
        };

        function IEnverotmenEvent(onShow, onHide) {
            this.OnShow = onShow;
            this.OnHide = onHide;
        }



        var EVENTS = {
            _fogEvent: function (option) {
                var observer;
                var _scene = EM.Scene;
                var beforeFogColor;
                var beforeFogMod;
                var beforeFogDensity;
                function onShow(iPlanetEnverotmentItem, iPlanetEnverotment) {
                    beforeFogColor = _scene.fogColor.clone();
                    beforeFogMod = _scene.fogMode;
                    beforeFogDensity = _scene.fogDensity;

                    _scene.fogMode = option.fogMode;

                    _scene.fogColor = option.fogColor; //#4b4242
                    _scene.fogDensity = 0.0001;

                    var max = option.max || 1.566;
                    var min = option.min || max - option.dev;
                    var alpha = _.round(_.random(max, min), 3);
                    var step = option.step;
                    if (option.onBeforeShow) {
                        option.onBeforeShow();
                    }
                    observer = _scene.onBeforeRenderObservable.add(function (eventData, mask) {
                        // max = window._max;
                        var abs = Math.abs(alpha);
                        if (abs > max || abs < min) step *= -1;
                        alpha += step;
                        _scene.fogDensity = Math.cos(alpha);
                    });

                }
                function onHide(iPlanetEnverotmentItem, iPlanetEnverotment) {
                    if (option.onHide) {
                        option.onHide();
                    }
                    _scene.onBeforeRenderObservable.remove(observer);
                    _scene.fogMode = beforeFogMod;
                    _scene.fogDensity = beforeFogDensity;
                    _scene.fogColor = beforeFogColor;

                    beforeFogMod = null;
                    beforeFogDensity = null;
                    beforeFogColor = null;
                    observer = null;

                    console.log("IEnverotmenEvent onHide", {
                        iPlanetEnverotmentItem: iPlanetEnverotmentItem,
                        iPlanetEnverotment: iPlanetEnverotment
                    });
                }

                return new IEnverotmenEvent(onShow, onHide);
            },
            401: function () {
                return EVENTS._fogEvent({
                    dev: 0.008,
                    step: 0.000001,
                    fogColor: BABYLON.Color3.FromInts(75, 66, 66),
                    fogMode: BABYLON.Scene.FOGMODE_EXP2
                });
            },
            403: function () {
                //return EVENTS.standard();
                var evetnBeta = 1.1;
                var option = {
                    step: 0.000001,
                    fogColor: BABYLON.Color3.FromInts(125, 125, 140),
                    fogMode: BABYLON.Scene.FOGMODE_EXP,
                    max: Math.PI / 2,
                    min: 1.550,
                    onBeforeShow: function () {
                        //EM.GameCamera.Camera.fov = 1.5;
                        //EM.GameCamera.Camera.upperBetaLimit = evetnBeta;
                    },
                    onHide: function () {
                        //EM.GameCamera.Camera.fov = EM.GameCamera.InUserPlanet.fov;
                        //EM.GameCamera.Camera.upperBetaLimit = EM.GameCamera.InUserPlanet.upperBetaLimit;
                    }
                };
                // window._option = option;
                return EVENTS._fogEvent(option);
            },
            standard: function () {
                return new IEnverotmenEvent(function (iPlanetEnverotmentItem, iPlanetEnverotment) {
                    console.log("IEnverotmenEvent onShow", {
                        iPlanetEnverotmentItem: iPlanetEnverotmentItem,
                        iPlanetEnverotment: iPlanetEnverotment
                    });
                }, function (iPlanetEnverotmentItem, iPlanetEnverotment) {
                    console.log("IEnverotmenEvent onHide", {
                        iPlanetEnverotmentItem: iPlanetEnverotmentItem,
                        iPlanetEnverotment: iPlanetEnverotment,
                    });
                });
            }
        };

        var defaultEmColor3Int = new BABYLON.Color3(197, 172, 163);
        var defaultColor3 = BABYLON.Color3.FromInts(defaultEmColor3Int.r, defaultEmColor3Int.g, defaultEmColor3Int.b);
        // var _scale = 1.02;
        var _scale = 1.03;
        var specularPower = 100;

        /**
         * 
         * @param {object} _baseColor     BABYLON.Vector3 0-255
         * @param {object} defaultColor      BABYLON.Vector3 0-1
         * @returns {} 
         */
        function getColorFromInts(_baseColor, defaultColor) {
            return Utils.GetColor3FromInts(_baseColor, defaultColor || defaultColor3);
        }

        function crateFresnel(bias, power, leftColor, rightColor) {
            var fresnel = new BABYLON.FresnelParameters();
            if (bias) fresnel.bias = bias;
            if (power) fresnel.power = power;
            if (leftColor) fresnel.leftColor = leftColor.clone();
            if (rightColor) fresnel.rightColor = rightColor.clone();
            return fresnel;
        }
        function log(key, val, textureTypeId, prefix) {
            if (!showLog) return;
            var data = {};
            data[key] = val;
            var _prefix = "item";
            if (prefix) _prefix = prefix;
            var mes = _prefix + ".__{" + textureTypeId + "}__";
            console.log(mes, data);
        }

        var MATERIALES = {
            401: function (material, iMaterial, layer) {
                if (layer.LayerName === ln.ground) {
                    return MATERIALES.standartGround(material, iMaterial, layer);
                }
                if (layer.LayerName === ln.env) return MATERIALES.standartEnv(material, iMaterial, layer);

                if (layer.LayerName === ln.space) {
                    if (iMaterial.SubtypeMaterialName === sbMn.regular) {
                        var diffuse = iMaterial.GetOrCreateTexture(text.Dffuse);
                        material.diffuseTexture = diffuse;
                        material.diffuseTexture.level = 2;

                        var bump = iMaterial.GetOrCreateTexture(text.Bump);

                        material.bumpTexture = bump;
                        //    material.bumpTexture.anisotropicFilteringLevel = 3;
                        material.bumpTexture.level = 1;

                        var light = iMaterial.GetOrCreateTexture(text.Light);
                        material.lightmapTexture = light;
                        material.lightmapTexture.level = 0.5;

                        //em Fresnel
                        var emColor = BABYLON.Color3.FromInts(197, 172, 163);
                        material.emissiveColor = emColor.clone();
                        material.useEmissiveAsIllumination = true;
                        material.emissiveFresnelParameters = crateFresnel(0.5, 2, emColor, blackColor);


                        var spec = iMaterial.GetOrCreateTexture(text.Specular);
                        material.specularTexture = spec;
                        material.specularPower = specularPower;



                        // action
                        var dir = 1;
                        var step = 0.005;
                        var spaceRenderOption = layer.GetOrCreateRenderOptions();
                        var key = ar.BEFORE_RENDER_SPACE_PLANET_ACTION_KEY;
                        function onBeforeRenderSpace401(eventData, mask, params, renderOption) {
                            try {
                                params.cloud.rotation.y += 0.0003;
                                params.planet.rotation.y -= 0.0003;

                                if (params.cloud.rotation.y > TWO_PI) params.cloud.rotation.y -= TWO_PI;
                                if (params.planet.rotation.y < TWO_PI) params.planet.rotation.y += TWO_PI;
                                var light = params.planet.material.lightmapTexture;

                                var cloudEmissive = params.cloud.material.emissiveTexture;
                                if (light.level > 2 || light.level < 0.5) dir = -dir;
                                light.level += step * dir;
                                //  console.log("onBeforeRenderSpace401 GO", params.cloud.rotation);     

                                return true;
                            }
                            catch (e) {
                                console.log("onBeforeRenderSpace401 STOP");
                                return false;
                            }

                        };
                        spaceRenderOption.AddFunction(key, onBeforeRenderSpace401);
                        return material;

                    }
                    else if (iMaterial.SubtypeMaterialName === sbMn.cloud) {

                        var m = MATERIALES.standard(material, iMaterial, layer);
                        m.specularColor = new BABYLON.Color3(0, 0, 0);
                        return m;
                    }
                }


                else return material;
            },
            402: function (material, iMaterial, layer) {
                if (layer.LayerName === ln.ground) {
                    material.diffuseTexture.uScale = material.diffuseTexture.vScale = 2;
                    material.diffuseTexture.level = 0.75;
                    material.diffuseColor.r = 0.7;
                    material.diffuseColor.b = 0.5;
                    material.diffuseFresnelParameters = crateFresnel(0.9, 13, blackColor, new BABYLON.Color3(1, 1, 1));
                    material.emissiveFresnelParameters = crateFresnel(0.1, 0.6, new BABYLON.Color3(1, 1, 1), blackColor);
                    material.emissiveColor = new BABYLON.Color3(1, 0.9, 0.9);


                    return MATERIALES.standartGround(material, iMaterial, layer);
                }
                else if (layer.LayerName === ln.env) {
                    material.emissiveTexture = material.diffuseTexture;
                    material.emissiveTexture.level = 0.75;
                    return material;
                }
                else if (layer.LayerName === ln.space) {
                    if (iMaterial.SubtypeMaterialName === sbMn.regular) {

                        material.specularColor = new BABYLON.Color3(0, 0, 0);
                        var diffuse = iMaterial.GetOrCreateTexture(text.Dffuse);
                        material.diffuseTexture = diffuse;
                        material.diffuseTexture.level = 1.1;

                        //todo  создает проблему на рендере появляются черные точки      верменно  выключенна

                        var bump = iMaterial.GetOrCreateTexture(text.Bump);

                        material.bumpTexture = bump;
                        //          material.bumpTexture.anisotropicFilteringLevel = 3;
                        material.bumpTexture.level = 1;

                        var baseColor = BABYLON.Color3.FromInts(88, 54, 30);
                        material.diffuseColor = BABYLON.Color3.White();
                        material.diffuseFresnelParameters = crateFresnel(0.6, 50, baseColor.clone(), BABYLON.Color3.White());
                        material.specularColor = baseColor.clone();
                        material.specularPower = 2;


                        material.emissiveColor = BABYLON.Color3.FromInts(164, 122, 70);
                        material.useEmissiveAsIllumination = true;
                        material.emissiveFresnelParameters = crateFresnel(0.5, 2, BABYLON.Color3.White(), blackColor);



                        var spaceRenderOption = layer.GetOrCreateRenderOptions();
                        var key = ar.BEFORE_RENDER_SPACE_PLANET_ACTION_KEY;

                        function onBeforeRenderSpace402(eventData, mask, params, renderOption) {
                            try {
                                params.planet.rotation.y -= 0.0003;
                                if (params.planet.rotation.y < TWO_PI) params.planet.rotation.y += TWO_PI;
                                return true;
                            }
                            catch (e) {
                                console.log("onBeforeRenderSpace402 STOP", { e: e });
                                return false;
                            }

                        };
                        spaceRenderOption.AddFunction(key, onBeforeRenderSpace402);
                        return material;

                    }
                    if (iMaterial.SubtypeMaterialName === sbMn.cloud) {
                        material.alphaMode = BABYLON.Engine.ALPHA_SUBTRACT;
                        material.alpha = 0.9;
                        material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
                        material.specularColor = blackColor.clone();
                        return material;
                    }
                }

                else return material;
            },
            403: function (material, iMaterial, layer) {
                if (layer.LayerName === ln.ground) {
                    //m.id ="planets.403_ground"

                    //material.diffuseTexture.uScale = material.diffuseTexture.vScale = 1;
                    //material.diffuseTexture.level = 0.75;
                    //material.diffuseColor.r = 0.7;
                    //material.diffuseColor.b = 0.5;
                    material.diffuseFresnelParameters = crateFresnel(0.7, 5, new BABYLON.Color3(0.7, 0.7, 0.7), new BABYLON.Color3(1, 1, 1));
                    material.emissiveFresnelParameters = crateFresnel(0.95, 20, new BABYLON.Color3(1, 1, 1), blackColor);
                    material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
                    material.specularColor = new BABYLON.Color3(0.15, 0.15, 0.1);
                    material.specularPower = 200;
                    // iMaterial.  
                    //gm.bumpTexture.level =1
                    if (material.bumpTexture) {
                        Utils.Console.Warn("ground.403 material.bumpTexture - exist and will be disposed", {
                            material: material,
                            iMaterial: iMaterial
                        });
                        material.bumpTexture.dispose();
                        delete material.bumpTexture;

                    }
                    material.bumpTexture = iMaterial.GetOrCreateTexture(text.Bump, ext.png);
                    material.useParallax = true;
                    material.useParallaxOcclusion = true;
                    material.parallaxScaleBias = 0.002;
                    return MATERIALES.standartGround(material, iMaterial, layer);
                }
                else if (layer.LayerName === ln.env) {
                    material.emissiveTexture = material.diffuseTexture;
                    material.emissiveTexture.level = 0.85;
                    return material;
                }
                else if (layer.LayerName === ln.space) {
                    if (iMaterial.SubtypeMaterialName === sbMn.regular) {
                        material.specularColor = new BABYLON.Color3(0, 0, 0);
                        var diffuse = iMaterial.GetOrCreateTexture(text.Dffuse);
                        material.diffuseTexture = diffuse;
                        material.diffuseTexture.level = 1.1;
                        material.invertNormalMapY = material.invertNormalMapX = true;
                        material.specularPower = 20;
                        //todo  создает проблему на рендере появляются черные точки      верменно  выключенна

                        var bump = iMaterial.GetOrCreateTexture(text.Bump);

                        material.bumpTexture = bump;
                        material.bumpTexture.anisotropicFilteringLevel = 3;
                        material.bumpTexture.level = 5;

                        material.diffuseFresnelParameters = crateFresnel(0.2, 3.4, blackColor.clone(), BABYLON.Color3.White());

                        var spaceRenderOption = layer.GetOrCreateRenderOptions();


                        spaceRenderOption.AddFunction(ar.BEFORE_RENDER_SPACE_PLANET_ACTION_KEY, function (eventData, mask, params, renderOption) {
                            try {
                                params.planet.rotation.y += 0.0005;
                                params.cloud.rotation.y += 0.0007;
                                if (params.planet.rotation.y > TWO_PI) params.planet.rotation.y -= TWO_PI;
                                if (params.cloud.rotation.y > TWO_PI) params.planet.rotation.y -= TWO_PI;
                                return true;
                            }
                            catch (e) {
                                console.log("onBeforeRenderSpace403 STOP", { e: e });
                                return false;
                            }

                        });
                        return material;

                    }
                    else if (iMaterial.SubtypeMaterialName === sbMn.cloud) {
                        material.alphaMode = BABYLON.Engine.ALPHA_MAXIMIZED;
                        material.alpha = 0.99;
                        var emTexture = iMaterial.GetOrCreateTexture(text.Emissive);
                        emTexture.level = 5;    
                        material.emissiveTexture = emTexture;
                        material.disableLighting = true;
                        //var bumpCloud = iMaterial.GetOrCreateTexture(text.Bump); 
                        //material.bumpTexture = bumpCloud;    
                        material.emissiveColor = new BABYLON.Color3(0.63, 0.67, 0.77);
                        material.emissiveFresnelParameters = crateFresnel(0, 0.2, BABYLON.Color3.White(), blackColor);
                        //console.log("403 material", {
                        //    emTexture: emTexture,
                        //    material: material,
                        //    iMaterial: iMaterial,
                        //    layer: layer,
                        //});
                        return material;
                    }
                }
                else return material;
            },
            standard: function (material, iMaterial, layer, onSetStandart, emmisiveColorInt, setAlphaMode) {
                function _log(key, val) {
                    log(key, val, layer.TextureTypeId, "mats.standart{" + iMaterial.SubtypeMaterialName + "}");
                }
                _log("standart.material", material);
                if (layer.LayerName === ln.env) return MATERIALES.standartEnv(material, iMaterial, layer, onSetStandart);
                else if (layer.LayerName === ln.ground) return MATERIALES.standartGround(material, iMaterial, layer, onSetStandart);
                else if (layer.LayerName === ln.space) {
                    var _emColor = getColorFromInts(emmisiveColorInt);

                    function _setAlphaToMaterial(_setAlphaMode) {
                        if (_setAlphaMode && material.alphaMode !== BABYLON.Engine.ALPHA_ADD) {
                            material.alphaMode = BABYLON.Engine.ALPHA_ADD;
                            if (material.alpha === 1) material.alpha = 0.999;
                        }
                    }

                    if (setAlphaMode) {
                        _setAlphaToMaterial(true);
                    }

                    if (iMaterial.SubtypeMaterialName === sbMn.regular) {

                        _log("iMaterial.SubtypeMaterialName === sbMn.regular  !material.diffuseTexture", !material.diffuseTexture);
                        if (!material.diffuseTexture) {
                            var diffuse = iMaterial.GetOrCreateTexture(text.Dffuse);
                            if (diffuse) {
                                material.diffuseTexture = diffuse;
                                material.diffuseTexture.level = 1;
                            }

                        }

                        //todo  создает проблему на рендере появляются черные точки      верменно  выключенна
                        if (!material.bumpTexture) {
                            // var bump = iMaterial.GetOrCreateTexture(text.Bump);
                            if (false) {
                                material.bumpTexture = bump;
                                material.bumpTexture.anisotropicFilteringLevel = 3;
                                material.bumpTexture.level = 1;
                            }

                        }
                        if (!material.lightmapTexture) {
                            var light = iMaterial.GetOrCreateTexture(text.Light);
                            if (light) {
                                material.lightmapTexture = light;
                                material.lightmapTexture.level = 0.5;
                            }

                        }

                        if (_emColor && !material.emissiveFresnelParameters) {
                            material.emissiveColor = _emColor.clone();
                            material.useEmissiveAsIllumination = true;
                            material.emissiveFresnelParameters = crateFresnel(0.5, 2, _emColor, blackColor);

                        }

                        if (!material.specularTexture) {
                            var spec = iMaterial.GetOrCreateTexture(text.Specular);
                            if (spec) {
                                material.specularTexture = spec;
                                material.specularPower = specularPower;
                            }

                        }



                        if (onSetStandart instanceof Function) return onSetStandart(material, iMaterial, layer, sbMn.regular);
                        return material;
                    }

                    else if (iMaterial.SubtypeMaterialName === sbMn.cloud) {
                        var regularMatContainer = layer.GetIMaterialContainer(sbMn.regular);
                        var regMaterial = regularMatContainer.GetMaterial();
                        if (!regMaterial) throw new Error("базовый метериал небыл создан");
                        if (!material.emissiveTexture) {
                            var emTexture = iMaterial.GetOrCreateTexture(text.Emissive);
                            if (emTexture) {

                                material.emissiveColor = _emColor.clone();
                                material.emissiveTexture = emTexture;
                                material.emissiveTexture.level = 1;
                                material.disableLighting = true;


                                if (!material.diffuseTexture) {
                                    var _diffuse = emTexture.clone();
                                    _diffuse.level = 2;
                                    iMaterial.SetExternalTexture(text.Dffuse, _diffuse);
                                    material.diffuseTexture = _diffuse;
                                }
                                if (!material.specularTexture) {
                                    var specular = regMaterial.specularTexture.clone();
                                    if (!specular) throw new Error("specular not exist");
                                    iMaterial.SetExternalTexture(text.Specular, specular);
                                    material.specularTexture = specular;
                                    material.specularPower = specularPower;
                                }

                                if (!material.opacityFresnelParameters) {
                                    material.opacityFresnelParameters = crateFresnel(0.9, 10, _emColor, blackColor);
                                }
                                if (!material.emissiveFresnelParameters) {
                                    material.emissiveFresnelParameters = crateFresnel(0.1, 1, blackColor, _emColor);
                                }
                                _setAlphaToMaterial(true);
                                material.alpha = 0.9;
                            }
                        }


                        if (onSetStandart instanceof Function) return onSetStandart(material, iMaterial, layer, sbMn.cloud);
                        return material;
                    }
                    else if (iMaterial.SubtypeMaterialName === sbMn.ring) throw clientNotImplementedException(material, iMaterial, layer, sbMn.ring, "materialType === stMn.ring");
                }


                else throw clientNotImplementedException(material, iMaterial, layer, iMaterial.SubtypeMaterialName, "Material type is wrong");

            },
            standartEnv: function (material, iMaterial, layer, onSetStandart) {
                if (onSetStandart instanceof Function) return onSetStandart(material, iMaterial, layer);
                //  material.useLogarithmicDepth = true;
                return material;
            },
            standartGround: function (material, iMaterial, layer, onSetStandart) {
                if (onSetStandart instanceof Function) return onSetStandart(material, iMaterial, layer, onSetStandart);

                return material;
            }
        };


        function tryGetMesh(meta) {
            var meshId = ar.GetMeshIdByMeta(meta);
            if (meshId) {
                var mesh = EM.GetMesh(meshId);
                if (!mesh) {
                    log("mesh", {
                        mesh: mesh,
                        meta: meta
                    }, meta.TextureTypeId, "tryGetMesh");
                    return null;
                }
                return mesh;
            }
            else return null;
        }

        function _addMeshContainer(tryLoadMeshFromFile, iTypeItem, gameObjectMeta, subTypeMeshName, _externalMesh) {
            var result = {
                loadedMesh: null,
                meshLoaded: false,
                meshContainer: null,
                meshId: null
            }
            if (tryLoadMeshFromFile) {
                var mesh = _externalMesh || tryGetMesh(gameObjectMeta);
                if (mesh) {
                    result.meshContainer = iTypeItem.AddMeshContainerFromExternalMesh(mesh, gameObjectMeta, subTypeMeshName);
                    result.meshLoaded = true;
                    result.loadedMesh = mesh;
                }
                else {
        

                    log("mesh", {
                        tryLoadMeshFromFile: tryLoadMeshFromFile,
                        iTypeItem: iTypeItem,
                        gameObjectMeta: gameObjectMeta,
                        result: result
                    }, gameObjectMeta.TextureTypeId, "_addMeshContainer.mesh.notFiended");
                }

            }
            if (!result.meshLoaded) result.meshContainer = iTypeItem.AddMeshContainer(gameObjectMeta, null, null, subTypeMeshName);
            result.meshId = result.meshContainer.GetMeshId();   
            return result;
        }

        function _createMaterial(material, iMaterial, materialIsExist, layer) {
            if (materialIsExist) return material;  
            if (MATERIALES[iMaterial.TextureTypeId]) return MATERIALES[iMaterial.TextureTypeId](material, iMaterial, layer);
            return MATERIALES.standard(material, iMaterial, layer);
        }

        function createOrUpdate(meta, typeItem, materialType, loadedMesh, _meshId) {
            var textureId = meta.TextureTypeId;
            function _log(key, val) {
                log(key, val, textureId, "createOrUpdateMaterial.materialType_{" + materialType + "}_");
            }

            var material = null;
            var loadExternalMaterial = !!loadedMesh;
            _log("loadExternalMaterial", { loadExternalMaterial: loadExternalMaterial, loadedMesh: loadedMesh, "!!loadedMesh": !!loadedMesh });
            var layer = typeItem.GetOrCreateLayer(meta);
            _log("layer", layer);

            var iMaterialContainer = typeItem.GetOrCreateIMaterial(meta, materialType, layer);


            if (layer.LayerName === ln.space) {
                if (loadedMesh) {
                    throw new Error("в сцене существует меш с именем спейс или спейс клауд");
                }
                if (!_meshId) {
                    throw new Error("_meshId not exit", { _meshId: _meshId, meta: meta, typeItem: typeItem });
                }
                var mesh = BABYLON.Mesh.CreateSphere(_meshId, 12, 1, EM.Scene);
                mesh.isVisible = false;
                mesh.isPickable = false;
                mesh.material = material = iMaterialContainer.GetOrCreateMaterial(function (_material, _iMaterial, _matId, _materialIsExist) {
                    return _createMaterial(_material, _iMaterial, _materialIsExist, layer);
                });
                _log("loadExternalMaterial layer.LayerName === ln.space, material", material);

            }       
            else if (loadExternalMaterial) {
                iMaterialContainer.SetScenePrefix(sceneName);
                iMaterialContainer.SetExternalMaterial(loadedMesh.material);
                material = _createMaterial(loadedMesh.material, iMaterialContainer, false, layer);
                _log("updatedMaterialFromLoadData", material);
            }
            else {
                material = iMaterialContainer.GetOrCreateMaterial(function (_material, _iMaterial, _matId, _materialIsExist) {
                    return _createMaterial(_material, _iMaterial, _materialIsExist, layer);
                });
                //  _log("CreatedMaterial", material);
            }
            //  material.useLogarithmicDepth = true;

            return {
                iMaterialContainer: iMaterialContainer,
                material: material,
                layer: layer,
                matId: material.id,
                loadExternalMaterial: loadExternalMaterial
            };


        }

        function createItem(textureTypeId, subMapTypeName, canUseRing, loadFromFile) {
            function _log(key, val) {
                log(key, val, textureTypeId, "createItem");
            }
            var item = ar.ITypeItem(textureTypeId, subMapTypeName, textureTypeId.toString());
            ar.A_PLANET_IDS.push(textureTypeId);

            var mapTypeInfo = ar.MapTypeContainer.GetOrAdd(textureTypeId, ar.MapTypes.Planet, subMapTypeName);
            // space

            // space regular
            var metaSpace = item.CreateGameObjectMeta(ln.space, bsn.regular);
            //   _log("metaSpace", metaSpace);
            var spRegularMeshInfo = _addMeshContainer(loadFromFile, item, metaSpace, subMeshName.regular);
            spRegularMeshInfo.meshContainer._addProp(_mapTypeKey, mapTypeInfo);

            _log("spRegularMeshInfo", spRegularMeshInfo);
            //console.log("spRegularMeshInfo", {
            //    spRegularMeshInfo: spRegularMeshInfo
            //});
              var spRegular = createOrUpdate(metaSpace, item, sbMn.regular, null, spRegularMeshInfo.meshId);
            _log("spRegular", spRegular);

            // space cloud
            var spCloudMeta = item.CreateGameObjectMeta(ln.space, bsn.cloud);
             _log("spCloudMeta", spCloudMeta);

            var spCloudMeshInfo = _addMeshContainer(loadFromFile, item, spCloudMeta, subMeshName.cloud);
             _log("spCloudMeshInfo", spCloudMeshInfo);
             var spCloud = createOrUpdate(spCloudMeta, item, sbMn.cloud, null, spCloudMeshInfo.meshId);
            spCloudMeshInfo.meshContainer._addProp("_cloudScaling", _scale);
            spCloudMeshInfo.meshContainer._addProp(_mapTypeKey, mapTypeInfo);

            //   _log("spCloud", spCloud);

            // space ring
            if (canUseRing) {
                var spRingMeta = item.CreateGameObjectMeta(ln.space, bsn.ring);
                _log("spRingMeta", spRingMeta);
                var spRingMeshInfo = _addMeshContainer(loadFromFile, item, spRingMeta, subMeshName.ring);
                _log("spRingMeshInfo", spRingMeshInfo);
                spRingMeshInfo.meshContainer._addProp(_mapTypeKey, mapTypeInfo);
                var spRing = createOrUpdate(spRingMeta, item, sbMn.ring, spRingMeta.loadedMesh);
                _log("spRing", spRing);

            }

            // enverotment                              
            var envMaterialMeshId = ar._createOriginalMeshIdTemplate(textureTypeId, ln.env, subMeshName.material);
            var envMeshMaterial = EM.GetMesh(envMaterialMeshId);
            if (!envMeshMaterial) {
                _log("!envMeshMaterial", {
                    envMeshMaterial: envMeshMaterial
                });
                throw new Error("envMeshMaterial  NOT EXIST IN LOADED FILES");

            }
            var envMeta = item.CreateGameObjectMeta(ln.env, bsn.regular);
            //    _log("metaEnv", envMeta);
            var envMeshInfo = _addMeshContainer(true, item, envMeta, subMeshName.material, envMeshMaterial);
            envMeshInfo.meshContainer._addProp(_mapTypeKey, mapTypeInfo);
            //   _log("envMeshInfo", envMeshInfo);
            var envRegular = createOrUpdate(envMeta, item, sbMn.regular, envMeshInfo.loadedMesh);
            //     _log("envRegular", envRegular);

            // ground
            var groundMeta = item.CreateGameObjectMeta(ln.ground, bsn.regular);
            //    _log("groundMeta", groundMeta);

            var groudnMeshInfo = _addMeshContainer(true, item, groundMeta, subMeshName.regular);
            envMeshInfo.meshContainer._addProp(_mapTypeKey, mapTypeInfo);
            //   _log("groudnMeshInfo", groudnMeshInfo);

            var groundRegular = createOrUpdate(groundMeta, item, sbMn.regular, groudnMeshInfo.loadedMesh);
            //   _log("groundRegular", groundRegular);


            if (groudnMeshInfo.meshLoaded && envMeshInfo.meshLoaded) {

                var event;
                if (EVENTS[textureTypeId]) event = EVENTS[textureTypeId]();
                else event = EVENTS.standard();
                var iPlanetEnverotment = ar.CreateIPlanetEnverotment(groudnMeshInfo.loadedMesh, envMeshInfo.loadedMesh, textureTypeId, event.OnShow, event.OnHide);
                var getEnverotmentKey = ar.IPLANET_ENVEROTMENT_KEY;

                spRegularMeshInfo.meshContainer._addProp(getEnverotmentKey, iPlanetEnverotment);
                envMeshInfo.meshContainer._addProp(getEnverotmentKey, iPlanetEnverotment);
                groudnMeshInfo.meshContainer._addProp(getEnverotmentKey, iPlanetEnverotment);
            }
            else {
                //   _log("groudnMeshInfo.meshLoaded && envMeshInfo.meshLoaded", { groudnMeshInfo: groudnMeshInfo, envMeshInfo: envMeshInfo  });
                throw new Error("ENVEROTMENT NOT EXIST IN LOADED FILES");
            }



            ar.SetTypeItem(textureTypeId, item);
        };

        function _initGroup(textureIds, mapTypeName, canUseRing, loadFromFile) {
            ar._initGroup(function (textureTypeId) {
                createItem(textureTypeId, mapTypeName, canUseRing, loadFromFile);
            }, textureIds);
        }

        var hasScene = newMeshes && newMeshes.length > 0 && sceneName && typeof sceneName === "string" && sceneName.length > 0;

        _initGroup(erthIds, ar.MapTypes.Earth, false, hasScene ? true : false);
        _initGroup(gasIds, ar.MapTypes.Gas, false, hasScene ? true : false);
        _initGroup(iceGasIds, ar.MapTypes.IceGas, false, hasScene ? true : false);


    };
})(EM.AssetRepository);

//#endregion;


//#region TypeList Moons
(function (ar) {
    "use strict";
    ar._initMoons = function () {
        var groupIds = ar.A_MOON_IDS = [901, 902, 903, 904, 905, 906];
        var gt = ar.GAME_TEXTURE_ID_RANGES.Sector;
        var ln = ar.LAYER_NAMES;
        var text = ar.TEXTURE_TYPES;
        var bsn = ar.BASE_SUB_NAMES;
        function createItem(textureTypeId) {
            var item = ar.ITypeItem(textureTypeId, gt.Name);
            var meta = item.CreateGameObjectMeta(ln.space);
            var mapTypeInfo = ar.MapTypeContainer.GetOrAdd(textureTypeId, ar.MapTypes.Satellite, ar.MapTypes.Moon);
            var meshContainer = item.AddMeshContainer(meta);
            meshContainer._addProp(ar.MAP_TYPE_KEY, mapTypeInfo);
            item.GetMeshId(ln.space);
            item.GetOrCreateMaterial(meta, function (material, iMaterial, matId, materialIsExist) {
                if (materialIsExist) return material;
                var dffuseTextureContainer = iMaterial.GetOrCreateTextureItem(text.Dffuse);
                material.diffuseTexture = dffuseTextureContainer.GetOrCreateTexture();
                material.diffuseTexture.level = 1;
                return material;
            }, bsn.regular);
            ar.SetTypeItem(textureTypeId, item);
            return item;
        };


        ar._initGroup(createItem, groupIds);
    };
})(EM.AssetRepository);

//#endregion;


// #region Universe
(function (ar) {
    "use strict";
    ar._initUniverse = function (scene) {
        // old
        // var Enveropment = {};  
        var universeId = 4001;
        ar.A_UNIVERSE_IDS = [universeId];
        ar.MapTypeContainer.AddCollection(ar.A_UNIVERSE_IDS, ar.MapTypes.Universe);
        var gt = ar.GAME_TEXTURE_ID_RANGES.Sector;
        var ln = ar.LAYER_NAMES;
        var text = ar.TEXTURE_TYPES;
        var stMn = ar.SUBTYPE_MATERIAL_NAMES;
        var subMeshName = ar.SUBTYPE_MESH_NAMES;
        var bsn = ar.BASE_SUB_NAMES;
        var clearColor = new BABYLON.Color3.Black;
        scene.clearColor = clearColor;

 
        function _createSkayBoxMaterial(material, cubeTexture, alpha, reflection) { 
            material.backFaceCulling = false;
            material.reflectionTexture = cubeTexture;
            material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            material.disableLighting = true;
            material.reflectionTexture.level = (typeof reflection === "number") ? reflection : 2;
            material.alpha = alpha || 1;
            if (material.alpha !== 1) material.alphaMode = BABYLON.Engine.ALPHA_ADD;
            return material;
        }

        var item = ar.ITypeItem(universeId, gt.Name);
        var meta = item.CreateGameObjectMeta(ln.env);
        var universeMeshContainer = item.AddMeshContainer(meta);
        var universeBoxMeshId = universeMeshContainer.GetMeshId();

        var universeMaterial = item.GetOrCreateMaterial(meta, function (material, iMaterial, matId, materialIsExist) {
            if (materialIsExist) return material;
            var emissiveTextureContainer = iMaterial.GetOrCreateTextureItem(text.Emissive);
            var emFileName = emissiveTextureContainer.FileName;
            var cubeTextureContainer = iMaterial.GetOrCreateTextureItem(text.Reflection);
            var cubeTexture = cubeTextureContainer.GetOrCreateCubeTextureFromOneFile(emFileName);

            var mat = _createSkayBoxMaterial(material, cubeTexture, 0.999999, 2);
            mat.emissiveTexture = emissiveTextureContainer.GetOrCreateTexture();
            mat.emissiveTexture.level = 1.5;
            mat.emissiveTexture.useEmissiveAsIllumination = true;
            mat.material = mat;
            return mat;
        }, stMn.regular);

        
       // universeMaterial.useLogarithmicDepth = true;
        function createUniverse() {
            var mesh = BABYLON.Mesh.CreateSphere(universeBoxMeshId, 32, 1.8e6, scene);
            ar.UNIVERSE_SKY_BOX_MESH_ID = mesh.id;
            mesh.material = universeMaterial;
            mesh.setEnabled(1);
            return mesh;
        }

        var universeMesh = createUniverse();

        var nibulaMeta = item.CreateGameObjectMeta(ln.env, bsn.cloud);
        var nibulaMeshContainer = item.AddMeshContainer(nibulaMeta, null, null, subMeshName.cloud);
        var nibulaBoxMeshId = nibulaMeshContainer.GetMeshId();
        ar.NUBULA_BOX_MESH_ID = nibulaBoxMeshId;

        function _setBlackDiffuserAndSpecular(material) {
            material.diffuseColor = new BABYLON.Color3(0, 0, 0);
            material.specularColor = new BABYLON.Color3(0, 0, 0);
        }

        function _createNibulaBoxMaterial(dir, material, textureContainer) {
            // console.log("nibulaMaterial.cubeTexture", { cubeTexture: cubeTexture });
            var cubeTexture = textureContainer.GetOrCreateCubeTexture();   
            _createSkayBoxMaterial(material, cubeTexture, 0.9999, 1.2); 
            _setBlackDiffuserAndSpecular(material);
            return material;
        }

        function _createNibulaHdrMaterial(name, dir, material, textureContainer) {
            var hdrTexture = textureContainer.GetOrCreateHdrTexture(name, dir);
 
            _createSkayBoxMaterial(material, hdrTexture, 0.9999,1.2); 
            _setBlackDiffuserAndSpecular(material);
            return material;
        }

        /**
        * top.jpg -  по часовйо +90
        * bottom.jpg  против часовой -90
        */
        var nibulaMaterial = item.GetOrCreateMaterial(nibulaMeta, function (material, iMaterial, matId, materialIsExist) {
            if (materialIsExist) return material;
            var dir = iMaterial.CreateSubDirUrl("nibulabox"); 
            var textureContainer = iMaterial.GetOrCreateTextureItem(text.Reflection, false, false, dir);  
 
            _createNibulaBoxMaterial(dir, material, textureContainer);
           // nibula-box_4k_75 nibula-box_4k_50
            //_createNibulaHdrMaterial("hdr/box_3k", dir, material, textureContainer);
            return material;
        }, stMn.cloud);

        
       //  nibulaMaterial.useLogarithmicDepth = true;
        function createNibulaBox() {
            var mesh = BABYLON.Mesh.CreateSphere(nibulaBoxMeshId, 32, 1.3e6, scene);
           mesh.rotation.z = Math.PI / 4;
           mesh.rotation.x = Math.PI / 6;
            mesh.material = nibulaMaterial;
            return mesh;
        }

        createNibulaBox();

        var activeZoneMeshContainer = item.AddMeshContainer(meta, null, ln.env, subMeshName.empty);
        var activeZoneMeshId = activeZoneMeshContainer.GetMeshId();
        ar.ACTIVE_WORLD_MESH_ID = activeZoneMeshContainer.GetMeshId(null, universeBoxMeshId);
        function createactiveZone() {
            var mesh = universeMesh.clone(activeZoneMeshId);
            var scale = 0.3;
            mesh.scaling = new BABYLON.Vector3(scale, scale, scale);
            var rotation = -1;
            mesh.rotation = new BABYLON.Vector3(rotation, rotation, rotation);
          //  mesh.material.useLogarithmicDepth = true;
             EM.MapEvent.InitSceneEvents(mesh);
        }
        createactiveZone();

        ar.SetTypeItem(universeId, item);

    }
})(EM.AssetRepository);

// #endregion 

//#endregion;     
 
 
//#region Main Init load and run
(function (ar) {
    "use strict";
    ar.Init = function (scene, onLoaded) {
        var _motherVersion = "1.0.0";
        var _assetsVersion = "v.1.403.dist";
        var useFromLocal = true;
        var showLog = false;
        // ReSharper disable ExpressionIsAlwaysConst
        var motherCatalog = Utils.CdnManager.GetGameModelsCatalog(_motherVersion, useFromLocal);
        ar._initBase(_assetsVersion, useFromLocal, motherCatalog);
        ar._initBase = null;
        delete ar._initBase;

        var ext = ar.EXTENTIONS;
        //planet
        var planetGatarogUrl = ar.GetPlanetCatalog();
        var planetSceneName = "planets";
        var planetBabylon = planetSceneName + ext.babylon;
        var planetSceneUrl = planetGatarogUrl + planetBabylon;

        //mother
        var motherSceneName = "game_models";
        var motherBabylon = motherSceneName + ext.babylon;
 

        var motherInitialized = false;
        var moonsInitialized = false;
        var planetInitialized = false;
        var starsInitialized = false;
        var sectorsInitialized = false;
        var galaxiesInitialized = false;
        var universeInitialized = false;


        function _onLoaded() {
            onLoaded();
            ar.Init = null;
            delete ar.Init;

        }

        var _updated = false;

        function _update() {
            if (_updated) return;
            if (motherInitialized &&
                moonsInitialized &&
                planetInitialized &&
                starsInitialized &&
                sectorsInitialized &&
                galaxiesInitialized &&
                universeInitialized) {  
                _updated = true;
                EM.Scene.resetCachedMaterial();

                //   console.log("assets loaded 0");
                _onLoaded();
                // console.log("assets loaded 1");

                EM.GameLoader.Update("LoadMeshes");

                if (showLog) {
                    console.log("assets loaded 2");
                }

            }
        }



        function _initUniverse() {
            ar._initUniverse(scene);
            ar._initUniverse = null;
            delete ar._initUniverse;
            universeInitialized = true;
            if (showLog) {
                console.log("universeInitialized");
            }

            _update();


        }
        function _initPlanets(newMeshes) {
            EM.SetVisibleGroupByMeshes(newMeshes, false);

            ar._initPlanets(newMeshes, planetSceneName);
            ar._initPlanets = null;
            delete ar._initPlanets;
            if (showLog) {
                console.log("planetInitialized");
            }


            planetInitialized = true;
            _update();
        }

        function _initMother(newMeshes) {
            ar._initMother();
            ar._initMother = null;
            delete ar._initMother;
            EM.EstateGeometry.GameModelsInit(newMeshes);
            motherInitialized = true;

            if (showLog) {
                console.log("motherInitialized");
            }


            _update();
        }

        function _initMoons() {
            ar._initMoons();
            ar._initMoons = null;
            delete ar._initMoons;
            moonsInitialized = true;
            // console.log("moons loaded");
            _update();
        }
        function _initStars() {
            ar._initStars();
            ar._initStars = null;
            delete ar._initStars;
            starsInitialized = true;
            if (showLog) {
                console.log("starsInitialized");
            }

            _update();

        }

        function _initSectors() {
            ar._initSectors();
            ar._initSectors = null;
            delete ar._initSectors;
            sectorsInitialized = true;
            if (showLog) {
                console.log("sectorsInitialized");
            }


            _update();
        }
        function _initGalaxies() {
            ar._initGalaxies();
            ar._initGalaxies = null;
            galaxiesInitialized = true;
            delete ar._initGalaxies;
            if (showLog) {
                console.log("galaxiesInitialized");
            }

            _update();
        }


        function initWorld() {
            if (planetInitialized && motherInitialized ) {
                _initUniverse();
                _initMoons();
                _initStars();
                _initSectors();
                _initGalaxies();
            }
        }

 
        BABYLON.SceneLoader.ImportMesh("", planetGatarogUrl, planetBabylon, scene, function (loadedMeshesGroup, particleSystems, skeletons) {
            if (showLog) {
                console.log("BABYLON.SceneLoader.ImportMesh.planetBabylon", {
                    loadedMeshesGroup: loadedMeshesGroup
                });
            }
            _initPlanets(loadedMeshesGroup);
            initWorld();
            //setTimeout(function () {
            //    // todo  срабатывают калбеки на текстуры уже тогда когда сами материалы удалены.    
            //    //В резултьтате веб жл ошибки. 
            //    //нужно найти альтернативный подход к пересозданию материалов.
            //    _initPlanets(loadedMeshesGroup);
            //},3000);

        });


        BABYLON.SceneLoader.ImportMesh("", motherCatalog, motherBabylon, scene, function (loadedMeshesGroup, particleSystems, skeletons) {
            if (showLog) {
                console.log("BABYLON.SceneLoader.ImportMesh.motherBabylon", {
                    loadedMeshesGroup: loadedMeshesGroup
                });
            }
            _initMother(loadedMeshesGroup);
            initWorld();

        });

    };
})(EM.AssetRepository);

//#endregion; 






