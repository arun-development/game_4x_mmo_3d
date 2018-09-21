Utils.CoreApp.gameApp.service("mapInfoHelper", [
    function () {
        var mapData = EM.MapData;
        var mapTypes = EM.MapGeometry.MapTypes;

        //#region Url

        var mapActions = {};
        Object.defineProperty(mapActions, mapTypes.Galaxy, {
            get: function () {
                return mapData._getHubAction(mapData._actionNames.worldGetGalaxyInfo);
            }
        });
        Object.defineProperty(mapActions, mapTypes.Sector, {
            get: function () {
                return mapData._getHubAction(mapData._actionNames.worldGetSectorInfo);
            }
        });
        Object.defineProperty(mapActions, mapTypes.Star, {
            get: function () {
                return mapData._getHubAction(mapData._actionNames.worldGetStarInfo);
            }
        });
        Object.defineProperty(mapActions, mapTypes.Planet, {
            get: function () {
                return mapData._getHubAction(mapData._actionNames.worldGetPlanetInfo);
            }
        });
        Object.defineProperty(mapActions, mapTypes.Moon, {
            get: function () {
                return mapData._getHubAction(mapData._actionNames.worldGetMoonInfo);
            }
        });

        //   mapActions[mapTypes.Bookmark] = "/api/bookmark/GetList/";

        //#endregion

        function getInfo(type, id, accept) {
            //console.log({
            //    type: type,
            //    id: id,
            //    accept: accept,
            //    mapTypes: mapTypes,
            //    lowType: type.toLowerCase(),
            //    url: url
            //});

            if (!type) return;
            if (mapTypes.Bookmark === type) {
                GameServices.bookmarkService.loadBokmarksPlanshet();
                return;
            }
            var lowType = type.toLowerCase();
            var nativeType = _.upperFirst(type);
            if (!mapActions[nativeType]) return;  
            GameServices.mapInfoService.getMapInfo(nativeType, id, mapActions[nativeType], accept);


        }

        this.getGalaxyInfo = function (id, accept) {
            getInfo(mapTypes.Galaxy, id, accept);
        }
        this.getSectorInfo = function (id, accept) {
            getInfo(mapTypes.Sector, id, accept);
        }
        this.getStarInfo = function (id, accept) {
            getInfo(mapTypes.Star, id, accept);
        }
        this.getPlanetInfo = function (id, accept) {
            getInfo(mapTypes.Planet, id, accept);
        }

        this.getInfo = getInfo;
        this.mapTypes = mapTypes;


    }
]);