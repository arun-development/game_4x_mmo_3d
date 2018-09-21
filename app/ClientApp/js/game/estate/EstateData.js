EM.EstateData = {
    //    =======================Vars========================
    //server response objects
    IndustrialComplex: null,
    SpaceShipyard: null,
    Laboratory: null,                           
    CommandCenter: null,
    GetCurrentEstate: null,
    GetCurrentSpaceLocation: null,
    GetMotherLocation: null,
    GetPlanetLocation: null,
 
    SaveCurrentEstateByEsateType: null,
    SavePlanetLocationFromData: null,
    SaveMotherLocationFromData: null,
    SaveCurrentSpaceLocation: null,
    UpdateCurrentFromSource: null,


    SetSpaceLocationFromGalaxyId: null,
    SetSpaceLocationFromSectorId: null,
    SetSpaceLocationFromSystemId: null,
    SetSpaceLocationFromPlanetId: null,
    SetSpaceLocationFromMoonId: null
};

(function (MapData, EstateData) {
    //#region Declare
    var keys = Utils.RepoKeys.EstateListKeys;
    var motherTextureId = 2000;
    var motherSpaceObject = 0;
    var MOTHER_ESTATE_TYPE = false;
    var PLANET_ESTATE_TYPE = true;

    //#region Model

    /**
     * 
     * @param {int} galaxyId 
     * @param {int} sectorId 
     * @param {int} systemId 
     * @param {int} textureTypeId 
     * @returns {object}  BaseLocationModel
     */
    function createBaseLocationModel(galaxyId, sectorId, systemId, textureTypeId) {
        return {
            GalaxyId: (typeof galaxyId === "number") ? galaxyId : null,
            SectorId: (typeof sectorId === "number") ? sectorId : null,
            SystemId: (typeof systemId === "number") ? systemId : null,
            TextureTypeId: (typeof textureTypeId === "number") ? textureTypeId : null
        };
    }

    /**
     * 
     * @param {int} galaxyId 
     * @param {int} sectorId 
     * @param {int} systemId 
     * @param {int} textureTypeId 
     * @param {bool} estateType 
     * @param {int} estateId 
     * @returns {object} CurrentEstateModel
     */
    function createCurrentEstateModel(galaxyId, sectorId, systemId, textureTypeId, estateType, estateId) {
        var b = createBaseLocationModel(galaxyId, sectorId, systemId, textureTypeId);
        b.EstateType = (typeof estateType === "boolean") ? estateType : null;
        b.EstateId = (typeof estateId === "number") ? estateId : null;
        return b;
    }

    /**
     * 
     * @param {int} galaxyId 
     * @param {int} sectorId 
     * @param {int} systemId 
     * @param {int} textureTypeId 
     * @param {int} spaceObjectId 
     * @param {string} mapType 
     * @returns {object} CurrentSpaceLocationModel
     */
    function createCurrentSpaceLocationModel(galaxyId, sectorId, systemId, textureTypeId, spaceObjectId, mapType) {
        var b = createBaseLocationModel(galaxyId, sectorId, systemId, textureTypeId);
        b.SpaceObjectId = (typeof spaceObjectId === "number") ? spaceObjectId : null;
        b.MapTypeName = (typeof mapType === "string") ? mapType : null;
        return b;
    }

    /**
     * 
     * @param {int} galaxyId 
     * @param {int} sectorId 
     * @param {int} systemId 
     * @param {int} textureTypeId 
     * @param {int} startTime  timestamp
     * @param {int} endTime timestamp
     * @returns {object} MotherLocationModel
     */
    function createMotherLocationModel(galaxyId, sectorId, systemId, textureTypeId, targetSystemId, startTime, endTime) {
        var b = createBaseLocationModel(galaxyId, sectorId, systemId, textureTypeId);
        b.StartTime = (typeof startTime === "number") ? startTime : null;
        b.EndTime = (typeof endTime === "number") ? endTime : null;
        b.IsMoving = (targetSystemId && endTime) ? true : false;
        b.TargetSystemId = targetSystemId;
        return b;
    }

    /**
     * 
     * @param {int} galaxyId 
     * @param {int} sectorId 
     * @param {int} systemId 
     * @param {int} textureTypeId 
     * @param {int} planetId 
     * @returns {object} PlanetLocationModel
     */
    function createPlanetLocationModel(galaxyId, sectorId, systemId, textureTypeId, planetId) {
        var b = createBaseLocationModel(galaxyId, sectorId, systemId, textureTypeId);
        b.PlanetId = (typeof planetId === "number") ? planetId : null;
        return b;
    }

    EstateData.CreateBaseLocationModel = createBaseLocationModel;
    EstateData.CreateCurrentEstateModel = createCurrentEstateModel;
    EstateData.CreateCurrentSpaceLocationModel = createCurrentSpaceLocationModel;
    EstateData.CreateMotherLocationModel = createMotherLocationModel;
    //#endregion

    // ReSharper disable once ExpressionIsAlwaysConst
    var currentEstate = createCurrentEstateModel(null, null, null, motherTextureId, MOTHER_ESTATE_TYPE, motherSpaceObject);
    var currentSpaceLocation = createCurrentSpaceLocationModel(null, null, null, motherTextureId, EM.MapGeometry.MapTypes.Mother);
    var motherLocation = createMotherLocationModel();
    var planetLocation = createPlanetLocationModel();


    //#endregion


    //#region Members

    /**
     *http://doc.babylonjs.com/classes/2.5/node
     *@param {directDecendantsOnly} только прямы потомки       : an optiona
     *@param {predicate}  : an optiona
     *mesh.getChildMeshes(directDecendantsOnly, predicate) → AbstractMesh[]
     * 
     *@param {predicate}  : an optiona
     *mesh.getChildren(predicate) → Node[]
     */
  


    //#region GetConcreteLocation
    function getCurrentEstate() {
        return currentEstate;
    }
    function getCurrentSpaceLocation() {
        return currentSpaceLocation;
    }
    function getMotherLocation() {
        return motherLocation;
    }
    function getPlanetLocation() {
        return planetLocation;
    }

    EstateData.GetCurrentEstate = getCurrentEstate;
    EstateData.GetCurrentSpaceLocation = getCurrentSpaceLocation;
    EstateData.GetMotherLocation = getMotherLocation;
    EstateData.GetPlanetLocation = getPlanetLocation;
    //#endregion


    //#region SetConcreteLoacation
    function setCurrentEstateFromDynamicState(galaxyId, sectorId, systemId, textureTypeId, estateType, estateId) {
        currentEstate.GalaxyId = galaxyId;
        currentEstate.SectorId = sectorId;
        currentEstate.SystemId = systemId;
        currentEstate.EstateType = estateType;
        currentEstate.EstateId = estateId;
        currentEstate.TextureTypeId = textureTypeId;
    }

    function setPlanetLocationFromModel(planetLocationModel) {
        planetLocation = planetLocationModel;
    }

    function setMotherLocationFromModel(motherLocationModel) {
        motherLocation = motherLocationModel;
    }


    function setCurrentEstateFromModel(currentEstateModel) {
        currentEstate = currentEstateModel;
    }

    function setCurrentLocationFromModel(currentLocationModel) {
        currentSpaceLocation = currentLocationModel;
    }


    EstateData.SetCurrentEstateFromModel = setCurrentEstateFromModel;
    EstateData.SetCurrentLocationFromModel = setCurrentLocationFromModel;




    //#endregion

    //#region SaveAndUpdate
    function saveCurrentSpaceLocation(galaxyId, sectorId, systemId, spaceObjectId, textureTypeId, mapTypeName) {
        currentSpaceLocation.GalaxyId = galaxyId;
        currentSpaceLocation.SectorId = sectorId;
        currentSpaceLocation.SystemId = systemId;
        currentSpaceLocation.SpaceObjectId = spaceObjectId;
        currentSpaceLocation.TextureTypeId = textureTypeId;
        currentSpaceLocation.MapTypeName = mapTypeName;
    }

    function savePlanetLocationFromData(data) {
        var galaxyId = data[keys.Galaxy];
        var sectorId = data[keys.Sector];
        var systemId = data[keys.System];
        var textureTypeId = data[keys.TextureTypeId];
        var planetId = data[keys.OwnId];
        setPlanetLocationFromModel(createPlanetLocationModel(galaxyId, sectorId, systemId, textureTypeId, planetId));
        setCurrentEstateFromDynamicState(galaxyId, sectorId, systemId, textureTypeId, PLANET_ESTATE_TYPE, planetId);
        saveCurrentSpaceLocation(galaxyId, sectorId, systemId, planetId, textureTypeId, EM.MapGeometry.MapTypes.Planet);
    }

    function setMotherJump(targetSystemId, startTime, endTime) {
        setMotherLocationFromModel(createMotherLocationModel(motherLocation.GalaxyId, motherLocation.SectorId, motherLocation.SystemId, motherTextureId, targetSystemId, startTime, endTime));
    }

    function saveMotherSpaceLocationFromData(data, targetSystemId, startTime, endTime) {
        var galaxyId = data[keys.Galaxy];
        var sectorId = data[keys.Sector];
        var startSystemId = data[keys.System];
        var textureTypeId = data[keys.TextureTypeId];
        //console.log("saveMotherSpaceLocationFromData", {
        //    data: data,
        //    targetSystemId: targetSystemId,
        //    endTime: endTime
        //});
        setMotherLocationFromModel(createMotherLocationModel(galaxyId, sectorId, startSystemId, textureTypeId, targetSystemId, startTime, endTime));
    }

    function saveMotherLocationFromData(data, targetSystemId, startTime, endTime) {
        //  console.log("uno saveMotherLocationFromData");
        var galaxyId = data[keys.Galaxy];
        var sectorId = data[keys.Sector];
        var startSystemId = data[keys.System];
        var textureTypeId = data[keys.TextureTypeId];

        saveMotherSpaceLocationFromData(data, targetSystemId, startTime, endTime);
        setCurrentEstateFromDynamicState(galaxyId, sectorId, startSystemId, textureTypeId, MOTHER_ESTATE_TYPE, motherSpaceObject);
        saveCurrentSpaceLocation(galaxyId, sectorId, startSystemId, motherSpaceObject, motherTextureId, EM.MapGeometry.MapTypes.Mother);

    }

    function updateCurrentFromSource(fromPlanet) {
        if (fromPlanet) {
            setCurrentEstateFromDynamicState(planetLocation.GalaxyId, planetLocation.SectorId, planetLocation.SystemId, planetLocation.TextureTypeId, PLANET_ESTATE_TYPE, planetId);
            saveCurrentSpaceLocation(planetLocation.GalaxyId, planetLocation.SectorId, planetLocation.SystemId, planetLocation.PlanetId, planetLocation.TextureTypeId, EM.MapGeometry.MapTypes.Planet);

        } else {
            setCurrentEstateFromDynamicState(motherLocation.GalaxyId, motherLocation.SectorId, motherLocation.SystemId, motherLocation.TextureTypeId, MOTHER_ESTATE_TYPE, motherSpaceObject);
            saveCurrentSpaceLocation(motherLocation.GalaxyId, motherLocation.SectorId, motherLocation.SystemId, motherSpaceObject, motherTextureId, EM.MapGeometry.MapTypes.Mother);
        }
    }

    function updateMotherDataLocation(galaxyId, sectorId, startSystemId) {
        var newMotherData = GameServices.estateService.getEstateItem(0);
        newMotherData.Galaxy = galaxyId;
        newMotherData.Sector = sectorId;
        newMotherData.System = startSystemId;
        GameServices.estateService.addEstateItem(newMotherData);
        saveMotherSpaceLocationFromData(newMotherData);
        if (currentEstate.EstateType === MOTHER_ESTATE_TYPE) {
            saveCurrentSpaceLocation(galaxyId, sectorId, startSystemId, motherSpaceObject, motherTextureId, EM.MapGeometry.MapTypes.Mother);
        }
        if (currentSpaceLocation.SystemId === startSystemId && !(typeof currentSpaceLocation.SpaceObjectId === "number")) {
            saveCurrentSpaceLocation(galaxyId, sectorId, startSystemId, motherSpaceObject, motherTextureId, EM.MapGeometry.MapTypes.Mother);
        }
    }


    function saveCurrentEstateByEsateType(type, id, motherTargetSystemId, motherStartTime, motherEndTime) {
        //   console.log("saveCurrentEstateByEsateType");
        if (type) savePlanetLocationFromData(GameServices.estateService.getEstateItem(id));
        else saveMotherLocationFromData(GameServices.estateService.getEstateItem(id || 0), motherTargetSystemId, motherStartTime, motherEndTime);
    }

    EstateData.SaveCurrentSpaceLocation = saveCurrentSpaceLocation;
    EstateData.SavePlanetLocationFromData = savePlanetLocationFromData;
    EstateData.SaveMotherLocationFromData = saveMotherLocationFromData;
    EstateData.SaveMotherSpaceLocationFromData = saveMotherSpaceLocationFromData;
    EstateData.SetMotherJump = setMotherJump;
    EstateData.UpdateMotherDataLocation = updateMotherDataLocation;
    EstateData.UpdateCurrentFromSource = updateCurrentFromSource;
    EstateData.SaveCurrentEstateByEsateType = saveCurrentEstateByEsateType;
    //#endregion

    //#region getMeshData
    function getDataSector(sectorId) {
        var sector = null;
        if (MapData.Sectors) {
            var idx = sectorId - 1;
            sector = MapData.Sectors[idx];
            if (sector.Id !== sectorId) {
                sector = _.find(MapData.Sectors, function (o) {
                    return o.Id === sectorId;
                });
            }
        };
        return sector;
    }

    function getDataSystem(systemId) {
        var system = null;
        if (MapData.System
            && MapData.System.Stars
            && MapData.System.Stars[systemId]) {
            return MapData.System.Stars[systemId];
        }
        if (MapData.Systems) {
            system = _.find(MapData.Systems, function (o) {
                return o.Id === systemId;
            });
        }
        return system;
    }

    function getDataPlanet(planetId) {
        var planet = null;
        if (MapData.System && MapData.System.Planets) {
            planet = _.find(MapData.System.Planets, function (o) {
                return o.Id === planetId;
            });
        }
        return planet;
    }
    function getDataMoon(moonId) {
        var moon = null;
        if (MapData.System && MapData.System.Moons) {
            moon = _.find(MapData.System.Moons, function (o) {
                return o.Id === moonId;
            });
        }
        return moon;
    }
    //#endregion

    //#region SetById

    function setSpaceLocationFromGalaxyId(galaxyId) {
        var textureTypeId = galaxyId;
        var model = createCurrentSpaceLocationModel(galaxyId, null, null, textureTypeId, galaxyId, EM.MapGeometry.MapTypes.Galaxy);
        setCurrentLocationFromModel(model);
    }


    /**
     * fromExist mesh
     * @param {int} sectorId 
     * @returns {void} 
     */
    function setSpaceLocationFromSectorId(sectorId) {
        var sector = getDataSector(sectorId);
        if (sector) {
            var model = createCurrentSpaceLocationModel(sector.GalaxyId, sectorId, null, sector.TextureTypeId, sectorId, EM.MapGeometry.MapTypes.Sector);
            setCurrentLocationFromModel(model);
        }
        else console.log("setSpaceLocationFromSectorId data not exist");  
    }

    /**
     * fromExist mesh
     * @param {int} systemId
     * @returns {void} 
     */
    function setSpaceLocationFromSystemId(systemId) {
        var system = getDataSystem(systemId);
        if (system) {
            var model = createCurrentSpaceLocationModel(system.GalaxyId, system.SectorId, systemId, system.TextureTypeId, systemId, EM.MapGeometry.MapTypes.Star);
            setCurrentLocationFromModel(model);
        }
        else console.log("setSpaceLocationFromSystemId data not exist");
    }
    /**
     * from existMesh
     * @param {int} planetId 
     * @returns {void} 
     */
    function setSpaceLocationFromPlanetId(planetId) {
        var planet = getDataPlanet(planetId);
        if (planet) {
            var model = createCurrentSpaceLocationModel(planet.GalaxyId, planet.SectorId, planet.SystemId, planet.TextureTypeId, planetId, EM.MapGeometry.MapTypes.Planet);
            setCurrentLocationFromModel(model);
        } else console.log("setSpaceLocationFromSystemId data not exist");

    }
    /**
     * from existMesh
     * @returns {} 
     */
    function setSpaceLocationFromMoonId(moonId) {
        var moon = getDataMoon(moonId);
        if (moon) {
            var model = createCurrentSpaceLocationModel(moon.GalaxyId, moon.SectorId, moon.SystemId, moon.TextureTypeId, moonId, EM.MapGeometry.MapTypes.Moon);
            setCurrentLocationFromModel(model);
        } else console.log("setSpaceLocationFromSystemId data not exist");

    };



    EstateData.SetSpaceLocationFromGalaxyId = setSpaceLocationFromGalaxyId;
    EstateData.SetSpaceLocationFromSectorId = setSpaceLocationFromSectorId;
    EstateData.SetSpaceLocationFromSystemId = setSpaceLocationFromSystemId;
    EstateData.SetSpaceLocationFromPlanetId = setSpaceLocationFromPlanetId;
    EstateData.SetSpaceLocationFromMoonId = setSpaceLocationFromMoonId;
    EstateData.GetLocalDataSystem = getDataSystem;

    //#endregion

    //#region Other   
    // ReSharper disable  ExpressionIsAlwaysConst
    EstateData.PlanetEstateType = PLANET_ESTATE_TYPE;
    EstateData.MotherEstateType = MOTHER_ESTATE_TYPE;
    // ReSharper restore  ExpressionIsAlwaysConst

    //#endregion
    //#endregion                                           
})(EM.MapData,EM.EstateData);
                                       