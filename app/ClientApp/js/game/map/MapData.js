EM.MapData = {
    SystemKeys : {
        Name: "Name",
        NativeName: "NativeName",
        Planetoids: "Planetoids",
        Stars: "Stars",
        Planets: "Planets",
        Moons: "Moons",
        Coords: "Coords",
        GroupType: "GameTypeId",
        Texture: "Texture",
        TextureMap: "TextureMap",
        TextureColor: "TextureColor",
        Url: "Url",
        DiffuseMap: "DiffuseMap",
        HeightMap: "HeightMap",
        NormalMap: "NormalMap",
        SpecularMap: "SpecularMap",
        StencilMap: "StencilMap",
        DiffuseColor: "DiffuseColor",
        EmissiveColor: "EmissiveColor",
        HoverColor: "HoverColor",
        SpecularColor: "SpecularColor",
        Power: "Power",
        Radius: "Radius",
        Parent: "Parent",
        Rings: "Rings",
        Width: "Width",
        MaxRadius: "MaxRadius",
        Atmosphere: "Atmosphere",
        Opacity: "Opacity",
        AxisAngle: "AxisAngle",
        OrbitAngle: "OrbitAngle",
        Orbit: "Orbit",
        OrbitPosition: "OrbitPosition",
        TypeId: "TypeId"
    }
}; 
Object.freeze(EM.MapData.SystemKeys);

//#region Create Base                
(function (MapData, LocalStorage) {
    MapData.Sectors = null;
    MapData.Systems = null;
    MapData.System = null;
    MapData._actionNames = {
        worldGetSectors: "worldGetSectors",
        worldGetSystems: "worldGetSystems",
        worldGetSystemGeometry: "worldGetSystemGeometry",
        worldGetGalaxyInfo: "worldGetGalaxyInfo",
        worldGetSectorInfo: "worldGetSectorInfo",
        worldGetStarInfo: "worldGetStarInfo",
        worldGetPlanetInfo: "worldGetPlanetInfo",
        worldGetMoonInfo: "worldGetMoonInfo",
        worldSerchPlanetNames: "worldSerchPlanetNames"
    };
    Object.freeze(MapData._actionNames);

    MapData._getHubAction = function (hubActionName) {
        return EM.$hub[hubActionName];
    }
    MapData._createStorageKey = function (id, actionName) {
        var identity;
        if (id) identity = id;
        else if (typeof id === "number" && id === 0) {
            throw new Error("id  не может быть 0");
        }
        else identity = "_id_";
        return _.snakeCase(actionName + "_" + identity);
    };


    function createMapDataItem(subscribeName) {
        var mi = {
            SubscribeName: subscribeName,
            GetData: null,
            Observer: Utils.PatternFactory.Observer(subscribeName),
            Update: null
        };
        Object.defineProperty(mi, "$hub", {
            get: function () {
                return EM.$hub;
            }
        });
        return mi;
    };

    MapData.GetSectors = createMapDataItem("MapData.Sectors");
    MapData.GetSystems = createMapDataItem("MapData.Systems");
    MapData.GetSystem = createMapDataItem("MapData.System");

    MapData._request = function (actionName, onSuccess, id, notSetCookie, expires) {
        var key = MapData._createStorageKey(id, actionName);
        var resultData = LocalStorage.GetFromStorage(key);
        if (resultData) {
            onSuccess(resultData);
            return;
        }
        else {
            MapData._getHubAction(actionName)(id)
                .then(function (answer) {
                    LocalStorage.SaveInStorage(key, answer, notSetCookie, expires);
                    onSuccess(answer);

                    //console.log(" MapData.$hub[actionName](id)", {
                    //    id: id,
                    //    actionName: actionName,
                    //    answer: answer,
                    //    $hub: MapData.$hub
                    //});

                }, function (errorAnswer) {
                    var msg = Errors.GetHubMessage(errorAnswer);
                    throw Errors.ClientNotImplementedException({
                        key: key,
                        id: id,
                        resultData: resultData,
                        msg: msg,
                        expires: expires,
                        notSetCookie: notSetCookie,
                        errorAnswer: errorAnswer,
                        LocalStorageData: resultData
                    }, key);

                });
        }

    };
})(EM.MapData, Utils.LocalStorage);

//#region GetSectors 
(function (MapData, LocalStorage) {
    function onSuccess(answer) {
       // console.log("MapData.GetSectors.GetData", answer);
        EM.MapGeometry.Galaxies.SaveSectorsFromServer(answer);
        MapData.Sectors = answer;
        MapData.GetSectors.Observer.NotifyAll();
        //MapData.GetSectors.Update();

        //            console.log("MapData.GetSectors.GetData", {
        //                Galaxies: MapGeometry.Galaxies,
        //                Sectors: MapData.Sectors
        //            });
    }

    var _actionName = MapData._actionNames.worldGetSectors;
    MapData.GetSectors.GetData = function () {
        MapData._request(_actionName, onSuccess, null, true, null);
    };
    MapData.GetSectors.InitSectorData = function (sectorsData) {
        //    console.log("MapData.GetSectors.InitSectorData", sectorsData);
        var key = MapData._createStorageKey(null, _actionName);
        LocalStorage.SaveInStorage(key, sectorsData, true, null);
        MapData._request(_actionName, onSuccess, null, true, null);
    };
})(EM.MapData, Utils.LocalStorage);
//#endregion

//#region GetSystems
(function (MapData) {
    var _actionName = MapData._actionNames.worldGetSystems;
    MapData.GetSystems.DataSectorId = null;
    MapData.GetSystems.GetData = function (sectorId) {
        //console.log(" MapData.GetSystems.GetData", {
        //    sectorId: sectorId,
        //    " MapData.GetSystems.DataSectorId": MapData.GetSystems.DataSectorId,
        //});
        if (typeof sectorId === "number" && (sectorId === MapData.GetSystems.DataSectorId)) {
            MapData.GetSystems.Observer.NotifyAll();
            return;
        }
        function onSuccess(answer) {
            //   console.log("MapData.GetSystems.GetData", answer);
            MapData.Systems = answer;
            MapData.GetSystems.DataSectorId = sectorId;
            MapData.GetSystems.Observer.NotifyAll();
        }

        MapData._request(_actionName, onSuccess, sectorId, true, null);
    };
})(EM.MapData);
//#endregion

//#region GetSystem
(function (MapData, LocalStorage) {
    var _actionName = MapData._actionNames.worldGetSystemGeometry;
    function onSuccess(answer, callback) {
        MapData.System = answer;
        MapData.GetSystem.Observer.NotifyAll();
        if (callback) callback(MapData.System);
    }
    MapData.GetSystem.GetData = function (systemId, callback) {
        // console.log("GetSystem count"); 
        MapData._request(_actionName, function (answer) {
            return onSuccess(answer, callback);
        }, systemId, true, null);
    };

    MapData.GetSystem.InitSystemData = function (systemGeometryData, callback) {
        //  console.log("MapData.GetSectors.InitSystemData", systemGeometryData);
        var id = 0;
        _.forEach(systemGeometryData.Stars, function (star, starKey) {
            id = star.Id;
            return false;
        });
        var key = MapData._createStorageKey(id, _actionName);
        LocalStorage.SaveInStorage(key, systemGeometryData, true, null);
        return id;
    }
})(EM.MapData, Utils.LocalStorage);
//#endregion