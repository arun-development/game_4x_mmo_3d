Utils.CoreApp.gameApp.service("mapControlHelper", [
    "planshetService",
    "mapInfoHelper",
    "mainHelper",
    function (planshetService, mapInfoHelper, mainHelper) {
        var lk = Utils.RepoKeys.LowerEstateListKeys();
        var buttons = {};
        var mapTypes = EM.MapGeometry.MapTypes;

        /**
              * @description _setDIM SetDataInMapControllContainer
              * @param {string} funcBtmName   MapControl._buttons[имя функции - funcBtmName]
              * @param {string} dataName имя атрибута даты после 'data-'
              * @param {dynamic} val  значение дата атрибута
              * @returns {void} 
              */
        function setDim(funcBtmName, dataName, val) {
            Utils.SetAttrDataVal(buttons[funcBtmName](), dataName, val);
        };

        function getBtn(btnName) {
            return GameServices.paralaxButtonHelper.getMapCtrlBtn(btnName);
        }

        function updateBtn(btn) {
            GameServices.paralaxButtonHelper.updateMapCtrlBtn(btn);
        }

        function buttonShow(btn, show) {
            //console.log("buttonShow", { btn: btn, show: show });
            if (btn) {
                btn.Hide = !show;
            }


        };

        function setGroupVisible(
            idxGalaxyInfo,
            idxSectorInfo,
            idxPlanetInfo,
            idxStarInfo,
            idxJumpToSector,
            idxJumpToPlanetoid,
            idxumpToMother,
            idxJumpToUserPlanet,
            idxJumpToGalaxy,
            idxOpenBookmarks) {

            var show = buttonShow;
            var btns = buttons;

            mainHelper.applyTimeout(function () {
                show(btns.btnGalaxyInfo(), (idxGalaxyInfo));
                show(btns.btnSectorInfo(), (idxSectorInfo));
                show(btns.btnPlanetInfo(), (idxPlanetInfo));
                show(btns.btnStarInfo(), (idxStarInfo));

                show(btns.btnJumpToSector(), (idxJumpToSector));
                show(btns.btnJumpToPlanetoid(), (idxJumpToPlanetoid));
                show(btns.btnJumpToMother(), (idxumpToMother));
                show(btns.btnJumpToUserPlanet(), (idxJumpToUserPlanet));
                show(btns.btnJumpToGalaxy(), (idxJumpToGalaxy));
                show(btns.btnOpenBookmarks(), (idxOpenBookmarks));
            });


        };

        function hideAll() {
            setGroupVisible(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        };

        //#region State


        function setGalaxyState() {
            setGroupVisible(1, 0, 0, 0, 0, 0, 1, 0, 0, 1);
        }

        function setSectorState() {
            setGroupVisible(1, 1, 0, 0, 0, 0, 1, 0, 1, 1);
        }

        function setSystemState() {
            setGroupVisible(1, 1, 0, 0, 0, 0, 1, 0, 1, 1);
        }

        function setStarState() {
            setGroupVisible(1, 1, 0, 0, 1, 0, 0, 0, 1, 1);
        }

        function setPlanetoidState() {
            setGroupVisible(0, 1, 0, 0, 1, 0, 1, 0, 1, 1);
        }

        function setUserPlanetState() {
            setGroupVisible(0, 0, 1, 1, 0, 1, 1, 0, 0, 1);
        }

        function setMotherState() {
            //console.log("setMotherState");
            setGroupVisible(0, 1, 0, 1, 1, 0, 0, 0, 1, 1);
        }

        function setState(toState) {
            // console.log("toState", toState);
            var m = this["set" + toState];
            if (m instanceof Function) m();
            // eval("set" + toState + "()");
        }

        //#endregion

        //#region Buttons
        buttons._check = function (name) {
            var cont = buttons["_" + name];
            if (!cont) {
                cont = getBtn(name);
                buttons["_" + name] = cont;
            }
            return cont;
        };
        buttons._btnGalaxyInfo = null;
        buttons.btnGalaxyInfo = function () {
            return buttons._check("btnGalaxyInfo");
        };
        buttons._btnSectorInfo = null;
        buttons.btnSectorInfo = function () {
            return buttons._check("btnSectorInfo");
        };
        buttons._btnPlanetInfo = null;
        buttons.btnPlanetInfo = function () {
            return buttons._check("btnPlanetInfo");
        };
        buttons._btnStarInfo = null;
        buttons.btnStarInfo = function () {
            return buttons._check("btnStarInfo");
        };
        //navigation
        buttons._btnJumpToSector = null;
        buttons.btnJumpToSector = function () {
            return buttons._check("btnJumpToSector");
        };
        buttons._btnJumpToPlanetoid = null;
        buttons.btnJumpToPlanetoid = function () {
            return buttons._check("btnJumpToPlanetoid");
        };
        buttons._btnJumpToMother = null;
        buttons.btnJumpToMother = function () {
            return buttons._check("btnJumpToMother");
        };
        buttons._btnJumpToUserPlanet = null;
        buttons.btnJumpToUserPlanet = function () {
            return buttons._check("btnJumpToUserPlanet");
        };
        buttons._btnJumpToGalaxy = null;
        buttons.btnJumpToGalaxy = function () {
            return buttons._check("btnJumpToGalaxy");
        };
        buttons._btnOpenBookmarks = null;
        buttons.btnOpenBookmarks = function () {
            return buttons._check("btnOpenBookmarks");
        };

        //#endregion

        //#region Config



        //#endregion


        //#region Methods

        //#region Info
        function galaxyInfo(params, element, attrs, accept) {

            var galaxy = mapTypes.Galaxy;
            mapInfoHelper.getInfo(galaxy, EM.EstateData.GetCurrentSpaceLocation().GalaxyId, accept);
        };

        function sectorInfo(params, element, attrs, accept) {
            var sector = mapTypes.Sector;
            mapInfoHelper.getInfo(sector, EM.EstateData.GetCurrentSpaceLocation().SectorId, accept);

            //new Planshet().updateState(sector + EM.EstateData.CurrentEstate.SectorId);
        };

        function planetInfo(params, element, attrs, accept) {
            var planet = mapTypes.Planet;
            mapInfoHelper.getInfo(planet, EM.EstateData.GetCurrentSpaceLocation().SpaceObjectId, accept);
        }

        function starInfo(params, element, attrs, accept) {
            var star = mapTypes.Star;
            mapInfoHelper.getInfo(star, EM.EstateData.GetCurrentSpaceLocation().SystemId, accept);
        }

        function openBookmarks(param, element, attrs, accept) {

            mapInfoHelper.getInfo(mapTypes.Bookmark);
        };

        //#endregion

        //#region Navigation
        function jumpToSector(param, element, attrs, accept) {
            // todo  нужны парметры
            if (!param) {
                var csl = EM.EstateData.GetCurrentSpaceLocation();
                EM.EstateData.SetSpaceLocationFromSectorId(csl.SectorId);
            };
            console.log("jumpToSector", param);
 
            var sp = new EM.SpaceState.SpacePosition();
            sp.clickBySector();
           // setSectorState();
        }


        function jumpToPlanetoid(param, element, attrs, accept) {
            //Hangar.GetHangarData();
            var planetLoc = EM.EstateData.GetPlanetLocation();
            EM.MapGeometry.System.Destroy();
            EM.SpaceState.SetNewCoord(planetLoc.SectorId, planetLoc.SystemId);

            EM.MapBuilder.System.Callback = function () {
                var sp = new EM.SpaceState.SpacePosition();
                sp.clickByBtnSystem(EM.SpaceState.LastActiveStarSystem);

                setTimeout(function () {
                    var meshId = EM.MapGeometry.System.GetPlanetMeshIdByUniqueId(planetLoc.PlanetId);
                    EM.MapEvent.PlanetoidDubleClick(meshId, null, true);
                    setState("PlanetoidState");
                }, 10);
            }

            //moveToPlanet();

            EM.MapBuilder.System.Build();
        };


        function jumpToMother(param, element, attrs, accept, isInit) {
            //console.log("mapControlHelper.jumpToMother");
            if (!isInit) {
                GameServices.estateService.setEstate(0);
                EM.EstateData.SaveCurrentEstateByEsateType(false, 0);

            }

            var motherLoc = EM.EstateData.GetMotherLocation();
  
   
            //console.log("jumpToMother.motherLoc", motherLoc);
            if (EM.MapGeometry.System.GetStarStatus(motherLoc.SystemId)) {
                 console.log("if (EM.MapGeometry.System.GetStarStatus(motherLoc.SystemId))");
                EM.EstateBuilder.UpdateMother();
                return;
            }
            EM.MapGeometry.System.Destroy();
            EM.SpaceState.SetNewCoord(motherLoc.SectorId, motherLoc.SystemId);
            EM.MapBuilder.System.Callback = function () {
        
                var lastSystem = EM.GetMesh(EM.SpaceState.LastActiveStarSystem);
      
                var position = lastSystem.position.clone();
                var offset = 400;
                position.x += offset;
                position.y += 200;
                position.z += offset;
                var mother = EM.GetMotherMesh();
                mother.position = position;
                //console.log("lastSystem", {
                //    lastSystem: lastSystem
                //});
               EM.EstateBuilder.UpdateMother();
            };
            EM.MapBuilder.System.Build();

        };

        function jumpToUserPlanet(param, element, attrs, accept) {
         //   console.log("mapControlHelper.jumpToUserPlanet");
            var planetId = param.OwnId;
            if (!planetId) return;

            var curPlanetId = EM.EstateData.GetCurrentEstate().EstateId;


            function setEstate() {
                EM.EstateData.SaveCurrentEstateByEsateType(true, planetId);
                EM.EstateBuilder.UpdatePlanet();
                setState("UserPlanetState");
            }

            if (param.UpdateSelect) {
                var estateItem = GameServices.estateService.getEstateItem(planetId);
                if (estateItem) {
                    GameServices.estateService.setEstate(planetId);
                    setEstate();
                }
            } else {
                if (curPlanetId === planetId) return;
                setEstate();
            };

        };

        function jumpToGalaxy(param, element, attrs, accept) {
            var csl = EM.EstateData.GetCurrentSpaceLocation();
            // console.log("mapControlHelper.jumpToGalaxy", ce);
            var sp = new EM.SpaceState.SpacePosition();
            sp.clickByBtnGalaxy("Galaxy", csl.GalaxyId);

            EM.EstateData.SetSpaceLocationFromGalaxyId(csl.GalaxyId);
        };

        function jumpToPlanetFromPlanshet(param, element, attrs, accept) {
            //planetId

            var estateList = $(EstateList.TargetSelector);
            estateList.val(planetId);
            estateList.change();
        }


        //#endregionSetState
        //#endregion


        this.galaxyInfo = galaxyInfo;
        this.sectorInfo = sectorInfo;
        this.planetInfo = planetInfo;
        this.starInfo = starInfo;
        this.openBookmarks = openBookmarks;

        this.jumpToPlanetoid = jumpToPlanetoid;
        this.jumpToUserPlanet = jumpToUserPlanet;
        this.jumpToGalaxy = jumpToGalaxy;
        this.jumpToMother = jumpToMother;

        this.jumpToSector = jumpToSector;
        this.setState = setState;

        this.setGalaxyState = setGalaxyState;
        this.setSectorState = setSectorState;
        this.setSystemState = setSystemState;
        this.setStarState = setStarState;
        this.setPlanetoidState = setPlanetoidState;
        this.setUserPlanetState = setUserPlanetState;
        this.setMotherState = setMotherState;

        this.init = function () {
            //hideAll();
            setMotherState();
            return true;
        };


    }
]);