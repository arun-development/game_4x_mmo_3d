/**
 * @class  Director
 */
EM.SpaceState = {

    CurrentActiveSector: null,
    /**
     * System(meshId)   
     */
    CurrentActiveSystem: null,
    /**
     * @name Star
     * @var {mesh}
     */
    LastActiveStarSystem: null,
    NewTargetFlag: false,

    SetNewCoord: function (sectorId, systemId) {
        EM.SpaceState.CurrentActiveSector = sectorId;
        // EM.SpaceState.CurrentActiveSystem = systemId + EM.MapGeometry.SYSTEM_REAL_PROTONAME;
        EM.SpaceState.CurrentActiveSystem = systemId;
    },
    /**
     * @name SpacePosition  Director  состояний
     */
    SpacePosition: null
};

//#region SpacePosition
(function ($ss) {
    var visible = {};
    visible.sectorsIsvisible = false;
    visible.userPlanetState = false;
    function SpacePosition() {
        var instance;
        return function SpacePositionPrototype() {
            if (instance) return instance;
            //#region Declare 
            var $self = this;
            var inGalaxy = new $ss.GalaxyState(this);
            var inSector = new $ss.SectorState(this);
            var systemSelected = new $ss.ArroundSystemState(this);
            var inSystem = new $ss.SystemSelectedState(this);
            var planetoidSelected = new $ss.PlanetoidSelectedState(this);
            var inUserPlanet = new $ss.UserPlanetState(this);
            var inMother = new $ss.MotherState(this);

            var currState = inGalaxy;
            var currTarget = EM.MapGeometry.MapTypes.Galaxy;
            //#endregion

            //#region Set
            this.setState = function (state) {
                var curMother = EM.EstateGeometry.MotherModules.GetMotherGroupMesh();
                var csl = EM.EstateData.GetCurrentSpaceLocation();
                // console.log("____STATE____", csl);
                var galaxy = EM.MapGeometry.Galaxies.GetGalaxy(csl.GalaxyId);

                var isGalaxyState = state instanceof $ss.GalaxyState;
                var isMotherState = state instanceof $ss.MotherState;
                var isPlanetoidSelectedState = state instanceof $ss.PlanetoidSelectedState;
                var isSystemSelectedState = state instanceof $ss.SystemSelectedState;
                var isUserPlanetState = state instanceof $ss.UserPlanetState;
                var isSectorState = state instanceof $ss.SectorState;

                //  console.log("____STATE____", state);
                if (isMotherState) {
                    EM.EstateGeometry.MotherModules.InMother();
                }
                else if (isPlanetoidSelectedState || isSystemSelectedState) {

                    GameServices.controlPanelSwicherHelper.setMap();
                    if (EM.MapGeometry.GetUniqueIdFromAny(EM.SpaceState.CurrentActiveSystem) === EM.EstateData.GetMotherLocation().SystemId) {
                        EM.EstateGeometry.MotherModules.ArroundMother();
                    }
                    else EM.EstateGeometry.MotherModules.HideMother();
                }

                else if (isGalaxyState) EM.MapGeometry.Galaxies.SetVisible(true);
                else if (isSectorState) visible.sectorsIsvisible = true;
                //#region isUserPlanetState  and  StarLight 
                if (isUserPlanetState) {
                    visible.userPlanetState = true;
                    EM.EstateGeometry.PlanetModules.InPlanet();
                    EM.StarLight.SetInPlanet();
                }
                else if (isMotherState || isPlanetoidSelectedState || isSystemSelectedState) {
                    EM.GameCamera.System.$newSystemId = csl.SystemId;
                    EM.StarLight.SetInSystem();
                }
                else EM.StarLight.SetOther();

                if (curMother.isVisible) {
                    if (isMotherState || isPlanetoidSelectedState || isSystemSelectedState) { }
                    else EM.EstateGeometry.MotherModules.HideMother();
                }
                //#endregion

                if (visible.userPlanetState && !isUserPlanetState) {
                    EM.EstateGeometry.PlanetModules.HidePlanet();
                    visible.userPlanetState = false;
                }
                if (galaxy.isVisible && !isGalaxyState) EM.MapGeometry.Galaxies.SetVisible(false);
                if (visible.sectorsIsvisible && !isSectorState) {
                    EM.MapGeometry.Systems.SetVisible(false);
                    visible.sectorsIsvisible = false;
                }

                if (GameServices.controlDiskHelper.hide) {
                    GameServices.controlDiskHelper.hide();
                }


                currState = state;
            };

            this.setTarget = function (target) {
                if (target === currTarget) EM.SpaceState.NewTargetFlag = false;
                else EM.SpaceState.NewTargetFlag = true;
                currTarget = target;
            };

            //#region blocked
            function getBlockedState() {
                return EM.SpacePositionBlocked;
            }

            function setBlockedState(val, ignore) {
                //                console.log("setBlockedState", {
                //                    val: val,
                //                    "EM.SpacePositionBlocked": EM.SpacePositionBlocked
                //                });
                if (!ignore) EM.SpacePositionBlocked = val;
                else EM.SpacePositionBlocked = false;
            }

            //#endregion

            function stateChanger(action, ignore) {
                if (getBlockedState() && !ignore) return;
                setBlockedState(true, ignore);
                GameServices.planshetService.close();

                function onComplete() {
                    setBlockedState(false);
                }

                if (action instanceof Function) action(onComplete);
                else onComplete();

            }

            this.stateChanger = stateChanger;
            this.setBlockedState = setBlockedState;
            this.getBlockedState = getBlockedState;
            //#endregion

            //#region Check
            this.isNewTarget = function () {
                return EM.SpaceState.NewTargetFlag;
            };
            //#endregion

            //#region Get
            this.getCurrentState = function () {
                return currState;
            };

            this.getMesh = function () {
                var _id = null;
                if (!currTarget) return null;
                else if (typeof currTarget === "object") {
                    if (currTarget.hasOwnProperty("_scene")) return currTarget;
                    if (currTarget.hasOwnProperty("id")) _id = currTarget.id;
                }
                else if (typeof currTarget === "string") _id = currTarget;
                else {
                    console.log("SpacePositionPrototype.getMesh mesh type not impl", {
                        currTarget: currTarget
                    });
                    return null;
                }

                if (Utils.IsNotEmptyString(_id)) return EM.GetMesh(_id);
                return null;

            };

            this.getGalaxyState = function () {
                return inGalaxy;
            };

            this.getSectorState = function () {
                return inSector;
            };

            this.getArroundSystemState = function () {
                return systemSelected;
            };

            this.getSystemSelectedState = function () {
                return inSystem;
            };

            this.getPlanetoidSelectedState = function () {
                return planetoidSelected;
            };

            this.getUserPlanetState = function () {
                return inUserPlanet;
            };

            this.getMotherState = function () {
                return inMother;
            };

            //#endregion

            //#region click Actions in concrete state

            function abstractTargetClick(action, target) {
                if (getBlockedState()) return;
                $self.setTarget(target);
                action();
            }

            this.clickByBtnGalaxy = function (target, galaxyId) {
                abstractTargetClick(function () {
                    currState.clickByBtnGalaxy(galaxyId);
                }, target);

            };

            this.clickByBtnSystem = function (target, coord) {
                abstractTargetClick(function () {
                    currState.clickByBtnSystem(coord);
                }, target);
            };

            this.clickBySpace = function (target) {

                if (getBlockedState()) return;
                abstractTargetClick(function () {
                    currState.clickBySpace();
                }, target);
            };

            this.clickBySector = function (target) {
                abstractTargetClick(function () {
                    currState.clickBySector();
                }, target);
            };

            this.clickBySystem = function (target) {
                abstractTargetClick(function () {
                    currState.clickBySystem();
                }, target);
            };

            this.clickByPlanetoid = function (target) {
                abstractTargetClick(function () {
                    currState.clickByPlanetoid();
                }, target);
            };

            this.clickByUserPlanet = function () {
                currState.clickByUserPlanet();
            };

            this.clickByBtnMapToggle = function (target) {
                abstractTargetClick(function () {
                    currState.clickByBtnMapToggle();
                }, target);
            };
            this.clickByMother = function (target) {
                abstractTargetClick(function () {
                    currState.clickByMother();
                }, target);
            }; //#endregion

            //#region  Others methods
            this.disposeLastSystem = function () {
                EM.MapGeometry.System.Destroy();
            };
            //#endregion

            //#region  instance  
            if (this.constructor === SpacePositionPrototype) {
                instance = this;
                return instance;
            } else {
                console.log("new SpacePositionPrototype");
                return new SpacePositionPrototype();
            };
            //#endregion
        };
    }

    $ss.SpacePosition = SpacePosition();
})(EM.SpaceState);

//#endregion

//#region States

//ISpacePositionState
(function ($ss) {
    function ISpacePositionState(director) {
        this._director = director;
    }
 
    ISpacePositionState.prototype.clickByBtnGalaxy = function (galaxyId) {
        var director = this._director;
        director.stateChanger(function (onComplete) {
            EM.Audio.GameSounds.onMoveToPlanetoid.play(); 
            function destroyLastSystem() {
                EM.MapGeometry.System.Destroy();
                EM.SpaceState.CurrentActiveSystem = null;
                EM.SpaceState.NewTargetFlag = false;
            };
            // set visible state for cube of sectors
            EM.MapGeometry.Sectors.SetUnselected();
            EM.GameCamera.SetGalaxy(galaxyId);
            destroyLastSystem();

            GameServices.mapControlHelper.setState("GalaxyState");
            director.setState(director.getGalaxyState());

            var csl = EM.EstateData.GetCurrentSpaceLocation();
            var sectorId = csl.SectorId;
 

            var activeMesh = EM.MapGeometry.Sectors.GetMeshBySectorNumId(sectorId);
            console.log("activeMesh", { activeMesh: activeMesh, activeMeshId: activeMesh.id, sectorId: sectorId});
            if (activeMesh) {
                EM.MapEvent.SectorLeftClick(activeMesh);
            }
            EM.Audio.GameSounds.onMoveToPlanetoid.play();
            onComplete();
        });

    };

    ISpacePositionState.prototype.clickByBtnSystem = function (coord) {
        // start building of system
        var director = this._director;
        var $self = this;

        director.stateChanger(function (onComplete) {
            // set unvisible state for cube of sectors
            $self.setSystemsVisible(false);

            // start building of system
            director.setState(director.getSystemSelectedState());

            //director.setBlockedState(true);
            var mesh = director.getMesh();
            //   console.log("clickByBtnSystem", mesh);
            // set camera in system position
            EM.GameCamera.SetSystemSelected(mesh.position);

            //  director.getMesh();




            onComplete();
        });
    };

    ISpacePositionState.prototype.clickBySpace = function () {
        // console.log("ISpacePositionState.prototype.clickBySpace");
        // console.log("itionState.prototype.clickByS");
        var director = this._director;
        //if (director.getBlockedState()) return;

        director.stateChanger(function (onComplete) {
            onComplete();
        });
    };

    ISpacePositionState.prototype.clickBySector = function () {
        // console.log("ISpacePositionState.prototype.clickBySector");
        var $self = this;
        var director = this._director;
        director.stateChanger(function (onComplete) {
            var clickBySectorChangeState = {};
            function update(subscribeName) {
                if (subscribeName === EM.MapBuilder.Systems.SubscribeName) {
                    EM.MapBuilder.Systems.Observer.Unsubscribe(clickBySectorChangeState);
                    $self.setSystemsVisible(true);
                    director.disposeLastSystem();
                    EM.GameCamera.SetSystems();
                    GameServices.mapControlHelper.setSectorState();
                    onComplete();
                }

            }
            clickBySectorChangeState.Update = update;
            EM.MapBuilder.Systems.Observer.Subscribe(clickBySectorChangeState);
            EM.MapBuilder.Systems.Build();
            director.setState(director.getSectorState());
        });
    };

    ISpacePositionState.prototype.clickBySystem = function () {
        var director = this._director;
        director.stateChanger(function (onComplete) {
            onComplete();
        });
    };

    ISpacePositionState.prototype.clickByPlanetoid = function () {
        var $self = this;
        var director = $self._director;
        var ar = EM.AssetRepository;
        director.stateChanger(function (onComplete) {
            // $self.setSystemsVisible(false);
            var target = director.getMesh();
            if (director.isNewTarget()) {

                var _meshInfoKey = ar.MESH_INFO_KEY;
                var localsKey = ar.MESH_LOCALS_KEY;

                // var meshInfo = ar.GetMeshInfoFromMeshOrMeshId(target.id);
                if (!target.hasOwnProperty(localsKey)) throw Errors.ClientNullReferenceException({ target: target }, "target<mesh>");
                var locals = target[localsKey];
                var meshInfo = locals[_meshInfoKey];
                if (!meshInfo.HasUniqueId) throw Errors.ClientNullReferenceException({ meshInfo: meshInfo, target: target }, "meshInfo.HasUniqueId", "ISpacePositionState.prototype.clickByPlanetoid");

                var uniqueId = meshInfo.UniqueId;
                var mapTypeItem = meshInfo.GetMapType();
                var mapType = mapTypeItem.MapType;

                var targetStarId = locals._serverData.SystemId;
                var targetIsStar = false;
                if (mapType === EM.MapGeometry.MapTypes.Star) {
                    targetIsStar = true;
                    EM.EstateData.SetSpaceLocationFromSystemId(uniqueId);
                    GameServices.mapControlHelper.setStarState();

                } else if (mapType === EM.MapGeometry.MapTypes.Planet) {

                    EM.EstateData.SetSpaceLocationFromPlanetId(uniqueId);
                    GameServices.mapControlHelper.setPlanetoidState();
                }
                else if (mapType === EM.MapGeometry.MapTypes.Satellite && mapTypeItem.SubMapType === EM.MapGeometry.MapTypes.Moon) {
                    EM.EstateData.SetSpaceLocationFromMoonId(uniqueId);
                    GameServices.mapControlHelper.setPlanetoidState();
                }


                var camRadiusKey = EM.MapGeometry.System.PLANETOID_MIN_CAMERA_RADIUS_KEY;
                var endRadius = locals[camRadiusKey];
                var radius = EM.GameCamera.SetAndGetNewLowerRadiusLimit(_.ceil(endRadius));
                EM.GameCamera.System.lowerRadiusLimit = radius;
                var fromStateName = null;
                if (targetIsStar) {
                    radius = EM.GameCamera.System.$setOnBeforeAnimationParams();
                }
                else {
                    var csl = EM.EstateData.GetCurrentSpaceLocation();
                    var isCurrentSystem = csl.SystemId === targetStarId;
                    var state = director.getCurrentState();
                    var isPlanetoidState = state instanceof $ss.PlanetoidSelectedState;
                    if (isCurrentSystem && isPlanetoidState) {
                        fromStateName = "PlanetoidSelectedState";
                    } else {
                        var isGalaxyState = state instanceof $ss.GalaxyState;
                        
                    }

                }
                EM.MapAnimation.MoveToPlanetoid(target, radius, function () {
                    director.setState(director.getPlanetoidSelectedState());
                    if (mapType === EM.MapGeometry.MapTypes.Star) {
                        director.setState(director.getSystemSelectedState());
                    } else {
                        director.setState(director.getPlanetoidSelectedState());
                    }
                    EM.GameCamera.SetSystemSelected(target.getAbsolutePosition(), fromStateName, targetStarId);
                    onComplete();
                });
            } onComplete();

        });
    };

    ISpacePositionState.prototype.clickByUserPlanet = function () {
        var $self = this;
        var director = $self._director;
        director.stateChanger(function (onComplete) {
            EM.MapGeometry.Systems.Destroy();
            EM.EstateBuilder.UserPlanetBuilder.SetPlanetEnv();
            EM.GameCamera.SetInUserPlanet();
            GameServices.mapControlHelper.setUserPlanetState();
            $self.setSystemsVisible(false);
            director.setState(director.getUserPlanetState());
            GameServices.estateService.getFullEstate(EM.EstateData.GetPlanetLocation().PlanetId);
            GameServices.controlPanelSwicherHelper.setHangar();
            onComplete();
        });

    };

    ISpacePositionState.prototype.clickByMother = function () {
        var $self = this;
        var director = $self._director;
        director.stateChanger(function (onComplete) {
            EM.Audio.GameSounds.onMoveToPlanetoid.play(); 
          
            var currentState = director.getCurrentState();
            //console.log("clickByMother currentState", { currentState: currentState });
            if (currentState instanceof $ss.MotherState) {
                onComplete();
                //console.log("clickByMother onComplete");
                return;
            }
            if (currentState instanceof $ss.SectorState || currentState instanceof $ss.ArroundSystemState) {
                $self.setSystemsVisible(false);
            }
            director.setState(director.getMotherState());
            GameServices.estateService.getFullEstate(0);
            GameServices.mapControlHelper.setMotherState();
            GameServices.controlPanelSwicherHelper.setHangar();
           // console.log("EM.GameCamera.Mother.radius", EM.GameCamera.Mother.radius);
            if (currentState instanceof $ss.UserPlanetState) {
                EM.GameCamera.SetMotherSelected(true);
                onComplete();
            } else {
                EM.MapAnimation.MoveToMother(EM.GetMotherMesh(), EM.GameCamera.Mother.radius, function () {
                    EM.GameCamera.SetMotherSelected(true);
                    onComplete();
                });
            }
    
        });

    };

    ISpacePositionState.prototype.clickByBtnMapToggle = function () {
        //console.log("ISpacePositionState.prototype.clickByBtnMapToggle");
        var director = this._director;
        director.stateChanger(function (onComplete) {
            onComplete();
        });
    };

    ISpacePositionState.prototype.Update = function (name) {
        //  console.log("ISpacePositionState.prototype.Update", name);
        var director = this._director;
        director.stateChanger(function (onComplete) {
            onComplete();
        });

    };

    ISpacePositionState.prototype.setSystemsVisible = EM.MapGeometry.Systems.SetVisible;
    EM.SpaceState.ISpacePositionState = ISpacePositionState;
})(EM.SpaceState);


(function ($ss) {
    var ISpacePositionState = $ss.ISpacePositionState;
    //#region Galaxy state
    function GalaxyState() {
        ISpacePositionState.apply(this, arguments);
    }
    GalaxyState.prototype = Object.create($ss.ISpacePositionState.prototype);
    GalaxyState.prototype.constructor = GalaxyState;
    $ss.GalaxyState = GalaxyState;
    //#endregion

    //#region Sector state
    function SectorState() {
        var ar = EM.AssetRepository;
        ISpacePositionState.apply(this, arguments);

        var $self = this;
        var director = $self._director;

        function clickBySystem(onComplete) {
            var systemSpriteNodeMesh = director.getMesh();
            var iSystemSpriteData = ar.GetLocalsFromMesh(systemSpriteNodeMesh, ar.SERVER_DATA_KEY);
            var systemId = iSystemSpriteData.Id;
            EM.SpaceState.CurrentActiveSystem = systemId;
            EM.EstateData.SetSpaceLocationFromSystemId(systemId);
            GameServices.mapControlHelper.setSystemState();
            //MapControl.SetState("SystemState");

            EM.MapBuilder.System.Build();
            EM.MapGeometry.Systems.SetVisible(false);
            EM.GameCamera.System.$setOnBeforeAnimationParams();
            EM.MapAnimation.MoveToMesh(systemSpriteNodeMesh, EM.GameCamera.System.radius, function () {
                EM.GameCamera.System.$setOnEndAnimationParams();
                director.setState(director.getSystemSelectedState());
                EM.GameCamera.SetSystemSelected(director.getMesh().position);
                $self.setSystemsVisible(false);
                onComplete();
            });
        }

        this.clickBySystem = function () {
            director.stateChanger(clickBySystem);
        };
    }

    SectorState.prototype = Object.create(ISpacePositionState.prototype);
    SectorState.prototype.constructor = SectorState;
    $ss.SectorState = SectorState;

    //#endregion


    //#region ArroundSystemState
    function ArroundSystemState() {

        ISpacePositionState.apply(this, arguments);

        var $self = this;
        var director = $self._director;

        function clickBySpace(onComplete) {
            console.log("ArroundSystemState.clickBySpace");
            director.disposeLastSystem();

            director.setState(director.getSectorState());

            EM.GameCamera.SetSystems();
            onComplete();
        }

        function clickBySystem(onComplete) {
            console.log("ArroundSystemState.clickBySystem");
            //        if (director.isNewTarget()) {
            var targetMesh = director.getMesh();
            EM.SpaceState.CurrentActiveSystem = targetMesh.id;
            EM.MapBuilder.System.Build();

            EM.MapAnimation.MoveToMesh(director.getMesh(), EM.GameCamera.System.radius, function () {
                director.setState(director.getSystemSelectedState());
                EM.GameCamera.SetSystemSelected(director.getMesh().position);
                $self.setSystemsVisible(false);
                onComplete();
            });
        }

        this.clickBySpace = function () {
            director.stateChanger(clickBySpace);
        };
        this.clickBySystem = function () {
            director.stateChanger(clickBySystem);
        };
    }

    ArroundSystemState.prototype = Object.create(ISpacePositionState.prototype);
    ArroundSystemState.prototype.constructor = ArroundSystemState;
    $ss.ArroundSystemState = ArroundSystemState;
    //#endregion


    //#region  SystemSelectedState
    function SystemSelectedState() {
        ISpacePositionState.apply(this, arguments);
        var $self = this;

        var director = this._director;

        function clickBySpace(onComplete) {
 
            var changeState = {
                Update: function (subscriber) {
                    EM.Audio.GameSounds.onSpaceMoveToSystemPoint.play();
                    if (subscriber === EM.MapBuilder.Systems.SubscribeName) {
                        var csl = EM.EstateData.GetCurrentSpaceLocation();
                        EM.EstateData.SetSpaceLocationFromSectorId(csl.SectorId);
                        EM.MapBuilder.Systems.Observer.Unsubscribe(changeState);

                        var curSystemSpriteMesh = EM.MapGeometry.Systems.GetSpriteMeshByStarId(EM.SpaceState.CurrentActiveSystem);
                        GameServices.mapControlHelper.setSectorState();
                        EM.GameCamera.SetSystems();
                        EM.MapAnimation.MoveToMesh(curSystemSpriteMesh, EM.GameCamera.Systems.radius, function () {
                            director.setBlockedState(false);
                            director.setState(director.getSectorState());
                            director.setBlockedState(true);
                            $self.setSystemsVisible(true);
                            director.setTarget(curSystemSpriteMesh.id);
                            director.disposeLastSystem();
                            EM.GameCamera.System.$newSystemId = null;
                            onComplete();
                        });
                    }

                }
            };
            EM.MapBuilder.Systems.Observer.Subscribe(changeState);
            EM.MapBuilder.Systems.Build();

            ////console.log("EM.SpaceState", SpaceState.CurrentActiveSystem);
            //if (!EM.GetMesh(EM.SpaceState.CurrentActiveSystem)) {
            //     EM.MapBuilder.Systems.Observer.Subscribe(changeState);
            //    EM.MapBuilder.Systems.Build();

            //} else changeState.Update();
        }

        this.clickBySpace = function () {
            director.stateChanger(clickBySpace);
        };
    }

    SystemSelectedState.prototype = Object.create(ISpacePositionState.prototype);
    SystemSelectedState.prototype.constructor = SystemSelectedState;
    $ss.SystemSelectedState = SystemSelectedState;

    //#endregion


    //#region Palanetoid selected state

    function PlanetoidSelectedState() {
        ISpacePositionState.apply(this, arguments);
      //  console.log("PlanetoidSelectedState");

        var director = this._director;
        function clickBySpace(onComplete) {
            EM.Audio.GameSounds.onMoveToPlanetoid.play();
            var csl = EM.EstateData.GetCurrentSpaceLocation();
            EM.EstateData.SetSpaceLocationFromSystemId(csl.SystemId);
            director.setState(director.getSystemSelectedState());
            GameServices.mapControlHelper.setSystemState();
            var lastSystem = EM.GetMesh(EM.SpaceState.LastActiveStarSystem);
            GameServices.controlPanelSwicherHelper.setMap();
            EM.GameCamera.System.$setOnBeforeAnimationParams();
            EM.MapAnimation.MoveToPlanetoid(lastSystem, EM.GameCamera.System.radius, function () {
                EM.GameCamera.System.$setOnEndAnimationParams();
                EM.GameCamera.SetSystemSelected(lastSystem.position, "PlanetoidSelectedState", csl.SystemId);
                onComplete();
            });

        }

        this.clickBySpace = function () {
            director.stateChanger(clickBySpace);
        };
    }

    PlanetoidSelectedState.prototype = Object.create(ISpacePositionState.prototype);
    PlanetoidSelectedState.prototype.constructor = PlanetoidSelectedState;
    $ss.PlanetoidSelectedState = PlanetoidSelectedState;

    //#endregion


    //#region UserPlanetState
    function UserPlanetState() {
        ISpacePositionState.apply(this, arguments);
        var director = this._director;

        function clickBySpace(onComplete) { onComplete() }

        this.clickBySpace = function () {
            director.stateChanger(clickBySpace);
        };
    }

    UserPlanetState.prototype = Object.create(ISpacePositionState.prototype);
    UserPlanetState.prototype.constructor = UserPlanetState;
    $ss.UserPlanetState = UserPlanetState;

    //#endregion


    //#region MotherState
    function MotherState() {
        ISpacePositionState.apply(this, arguments);
        var director = this._director;

        var ar = EM.AssetRepository;
        var camRadiusKey = EM.MapGeometry.System.PLANETOID_MIN_CAMERA_RADIUS_KEY;

        function clickBySpace(onComplete) {
            EM.Audio.GameSounds.onMoveToPlanetoid.play();
            var lastSystem = EM.GetMesh(EM.SpaceState.LastActiveStarSystem);
            var minCameraRadius = ar.GetLocalsFromMesh(lastSystem, camRadiusKey);


            var csl = EM.EstateData.GetCurrentSpaceLocation();
            EM.EstateData.SetSpaceLocationFromSystemId(csl.SystemId);
            director.setState(director.getSystemSelectedState());
            GameServices.mapControlHelper.setSystemState();
            GameServices.controlPanelSwicherHelper.setMap();

            EM.GameCamera.SetAndGetNewLowerRadiusLimit(minCameraRadius);
            var absPosition = lastSystem.getAbsolutePosition().clone();
            EM.GameCamera.System.$setOnBeforeAnimationParams();

            EM.MapAnimation.MoveToPlanetoid(lastSystem, EM.GameCamera.System.radius, function () {
                EM.GameCamera.System.$setOnEndAnimationParams(minCameraRadius);
                EM.GameCamera.SetSystemSelected(absPosition, null, csl.SystemId);

                onComplete();
            });
        }

        this.clickBySpace = function () {
            director.stateChanger(clickBySpace);
        };
    }

    MotherState.prototype = Object.create(ISpacePositionState.prototype);
    MotherState.prototype.constructor = MotherState;
    $ss.MotherState = MotherState;
    //#endregion


})(EM.SpaceState);


//#endregion



