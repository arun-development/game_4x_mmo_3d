EM.MapEvent = {};
(function (MapEvent) {

    //MapEvent.SceneIsMoved = false;
    MapEvent.HoveredPlanetoid = null;
    var ar = EM.AssetRepository;
    var _mapItemKey = ar.MAP_ITEM_KEY;
    var _textyreTypeIdKey = ar.TEXTURE_TYPE_ID_KEY;
    var _serverDataKey = ar.SERVER_DATA_KEY;
    var _sounds = EM.Audio.GameSounds;

    MapEvent.HideContextMenu = function () {
        GameServices.controlDiskHelper.hide();
    };
    MapEvent.ShowContextMenu = function (event) {
        MapEvent.HideContextMenu();
        GameServices.controlDiskHelper.show(event);
    };


    //#region Sector

    var lastSectorClickMeshId;

    function _checkMeshTypeFromSector(mesh) {
        var meshType = ar.CreateMeshArgumentType(mesh);
        if (!meshType.IsMesh) throw Errors.ClientTypeErrorException({
            event: event,
            asNew: asNew,
            meshType: meshType,
        }, mesh, "object||BABYLON.Mesh", "!MapEvent.sectorClick.meshType.IsMesh");
        else {
            meshType = null;
        }

    }
    MapEvent.SectorLeftClick = function (mesh, event) {
        if (!mesh) {
            return;
        }
        _checkMeshTypeFromSector(mesh);
        var clickMaterial = EM.MapGeometry.Sectors.Materials.GetClick();
        if (lastSectorClickMeshId && mesh.id !== lastSectorClickMeshId) {
            var lastMesh = EM.GetMesh(lastSectorClickMeshId);
            var data = ar.GetLocalsFromMesh(lastMesh, _serverDataKey);
            if (data) {
                var regularMaterial = EM.MapGeometry.Sectors.Materials.GetRegular();
                if (regularMaterial.id !== mesh.material.id) {
                    lastMesh.material = regularMaterial;
                }
            }

        }
        lastSectorClickMeshId = mesh.id;

        if (clickMaterial.id !== mesh.material.id) {
            mesh.material = clickMaterial;
        }

    };
    MapEvent.SectorDoubleClick = function (mesh, event) {
        _checkMeshTypeFromSector(mesh);
        console.log("sectorClick", mesh);
        var meshData = ar.GetLocalsFromMesh(mesh, _serverDataKey);
        var sectorId = meshData.SectorId;
        MapEvent.SectorProgrammClick(sectorId);
        lastSectorClickMeshId = null;
        return;
    };
    MapEvent.RegisterSectorActions = function (sectorMesh) {
        var options = MapEvent.IMapEventItemOption(sectorMesh);
        options.rightClick = function (mesh, event) {
            MapEvent.ShowContextMenu(event);
        };
        options.leftClick = MapEvent.SectorLeftClick;
        options.doubleClick = MapEvent.SectorDoubleClick;
        options.hovered = function (mesh, event) {
            if (!mesh) {
                return;
            }
            _sounds.onSpaceObjectHoveredIn.play();
            var hover = EM.MapGeometry.Sectors.Materials.GetHover();
            if (mesh.material.id !== hover.id) {
                mesh.material = hover;
            }

        };
        options.unHovered = function (mesh, event) {
            if (!mesh) {
                return;
            }
            var regularMaterial = EM.MapGeometry.Sectors.Materials.GetRegular();
            var clickMaterial = EM.MapGeometry.Sectors.Materials.GetClick();
            if (lastSectorClickMeshId) {
                if (mesh.id === lastSectorClickMeshId) {
                    mesh.material = clickMaterial;
                } else if (mesh.material && mesh.material.id !== regularMaterial.id) {
                    mesh.material = regularMaterial;
                }
            } else {
                mesh.material = regularMaterial;
            }
            MapEvent.HideContextMenu();
        };
        MapEvent.RegisterFactoryAction(options);
    };
    MapEvent.SectorProgrammClick = function (sectorId) {
        EM.SpaceState.CurrentActiveSector = sectorId;
        EM.Audio.GameSounds.onSpaceMoveToSystemPoint.play();
        EM.EstateData.SetSpaceLocationFromSectorId(sectorId);
        GameServices.mapControlHelper.jumpToSector();
    };
    //#endregion

    //#region Systems
    var lastHoveredSystems = {};
    var ignoreResetHoverSystemsId;
    MapEvent.SystemsLeftClick = function (systemCloneMesh, event) {
        //move to around system 
        if (EM.SpacePositionBlocked || !systemCloneMesh || !systemCloneMesh.getAbsolutePosition) return;
        var ct = EM.GameCamera.Camera.target;
        var absMeshPosition = systemCloneMesh.getAbsolutePosition();
        if (ct.equals(absMeshPosition)) return;

        MapEvent._systemsHover(systemCloneMesh);
        ignoreResetHoverSystemsId = systemCloneMesh.id;
        var sp = new EM.SpaceState.SpacePosition();
        sp.setBlockedState(true);
        _sounds.onSpaceMoveToSystemPoint.play();
        EM.MapAnimation.MoveToMesh(systemCloneMesh, EM.GameCamera.ArroundSystem.radius, function () {
            sp.setBlockedState(false);

        }, 0.5, EM.MapAnimation.EasingTypes.linear);

    };

    MapEvent.SystemsDoubleClick = function (systemCloneMesh, event) {
        //console.log("systemsDoubleClick", {
        //    event: event,
        //    systemCloneMesh: systemCloneMesh
        //});

        _sounds.onSpaceMoveToSystemPoint.stop();
        _sounds.onSpaceJumpToSystemStart.play();
        //sprite.id === spriteNodeMeshId
        var systemMeshId = systemCloneMesh.id;
        var iSystemSpriteData = ar.GetLocalsFromMesh(systemCloneMesh, ar.SERVER_DATA_KEY);
        var systemId = iSystemSpriteData.Id;
        EM.SpaceState.CurrentActiveSystem = systemId;
        //console.log("systemsClick", {
        //    event: event,
        //    sprite: systemCloneMesh,
        //    iSystemSpriteData: iSystemSpriteData,
        //    systemId: systemId,
        //});
        var sp = new EM.SpaceState.SpacePosition();
        sp.clickBySystem(systemCloneMesh);
        MapEvent.HideContextMenu();
    };
    MapEvent._systemsHover = function (systemCloneMesh) {
        _sounds.onSpaceObjectHoveredIn.play();
        _.forEach(lastHoveredSystems, function (lastHoveredSystem, key) {
            MapEvent._systemsOut(lastHoveredSystem, null);
        });
        // systemCloneMesh.material.alpha = 1;
        if (systemCloneMesh.material && systemCloneMesh.material.emissiveTexture) {
            systemCloneMesh.material.emissiveTexture.level = 1.3;
        }
        lastHoveredSystems[systemCloneMesh.id] = systemCloneMesh;
    };
    MapEvent._systemsOut = function (systemCloneMesh, event) {
        if (systemCloneMesh.id === ignoreResetHoverSystemsId) return;
        if (systemCloneMesh.material && systemCloneMesh.material.emissiveTexture) {
            systemCloneMesh.material.emissiveTexture.level = 0.95;
        }
        if (lastHoveredSystems[systemCloneMesh.id]) delete lastHoveredSystems[systemCloneMesh.id];
    };
    MapEvent.RegisterSystemsActions = function (systemCloneMesh) {
        var options = MapEvent.IMapEventItemOption(systemCloneMesh);
        options.leftClick = MapEvent.SystemsLeftClick;
        options.rightClick = function (mesh, event) {
            MapEvent.ShowContextMenu(event);
        };
        options.doubleClick = MapEvent.SystemsDoubleClick;
        options.hovered = MapEvent._systemsHover;
        options.unHovered = MapEvent._systemsOut;
        MapEvent.RegisterFactoryAction(options);
    };
    //#endregion

    //#region Planetoid



    MapEvent.PlanetoidDubleClick = function (meshOrMeshId, event, isMeshId) {
        var meshId;
        if (isMeshId) {
            meshId = meshOrMeshId;
        }
        else {
            meshId = meshOrMeshId.id;
        }
       // console.log("PlanetoidDubleClick", { meshOrMeshId: meshOrMeshId, meshId: meshId});
        if (!meshId) return;

        MapEvent.HideContextMenu();
        var sp = new EM.SpaceState.SpacePosition();
        sp.clickByPlanetoid(meshId);
        _sounds.onMoveToPlanetoid.play();
    };


    MapEvent.RegisterPlanetoidActions = function (planetoidMesh) {
        var options = MapEvent.IMapEventItemOption(planetoidMesh);
        options.hovered = function () {
            _sounds.onSpaceObjectHoveredIn.play();
        }
        options.rightClick = function (mesh, event) {
            MapEvent.ShowContextMenu(event);
        };
        options.doubleClick = MapEvent.PlanetoidDubleClick;
        MapEvent.RegisterFactoryAction(options);
    };

    //#endregion 


    //#region Common
    MapEvent.InitSceneEvents = function (activeWorldMesh) {
        EM.Scene.hoverCursor = " default ";
        MapEvent.AddExecuteCodeAction(activeWorldMesh, BABYLON.ActionManager.OnPickTrigger, function (mesh, event) {
 
            MapEvent.HideContextMenu();
        });

        var rotateOptions = {
            beginRotate: false,
            beginAlpha: 0,
            beginBeta: 0,
            $timeout: null,
            loop: true
        };

        function onStartRotation(alpha, beta) {
            rotateOptions.beginRotate = true;
            rotateOptions.beginAlpha = alpha;
            rotateOptions.beginBeta = beta;
            if (!_sounds.onSpaceRotate.isPlaying) {
                _sounds.onSpaceRotate.loop = rotateOptions.loop;
                _sounds.onSpaceRotate.play();
            }

        }

        function onStopRotation() {
            clearTimeout(rotateOptions.$timeout);
            rotateOptions.beginRotate = false;
            // _sounds.onSpaceRotate.loop = false;
            setTimeout(function () {
                _sounds.onSpaceRotate.stop();
            }, 100);
        }
        MapEvent.AddExecuteCodeAction(activeWorldMesh, BABYLON.ActionManager.OnPickDownTrigger, function (mesh, event) {
            if (EM.EstateData.GetCurrentEstate().EstateType) {
                if (rotateOptions.$timeout) {
                    onStopRotation();
                }
                return;
            }
            rotateOptions.beginBeta = EM.GameCamera.Camera.beta;
            rotateOptions.beginAlpha = EM.GameCamera.Camera.alpha;
            if (!rotateOptions.beginRotate) {
                rotateOptions.$timeout = setTimeout(function () {
                    if (!rotateOptions.beginRotate && rotateOptions.beginAlpha !== EM.GameCamera.Camera.alpha || rotateOptions.beginBeta !== EM.GameCamera.Camera.beta) {
                        onStartRotation(EM.GameCamera.Camera.alpha, EM.GameCamera.Camera.beta);
                    }
                }, 150);
            }
        });
        MapEvent.AddExecuteCodeAction(activeWorldMesh, BABYLON.ActionManager.OnPickUpTrigger, function (mesh, event) {

            if (rotateOptions.$timeout) {
                onStopRotation();
            }
        });

        MapEvent.AddExecuteCodeAction(activeWorldMesh, BABYLON.ActionManager.OnDoublePickTrigger, function (mesh, event) {
            MapEvent.HideContextMenu();
            EM.Scene.hoverCursor = " default ";
            var sp = new EM.SpaceState.SpacePosition();
            sp.clickBySpace(activeWorldMesh.id);
        });
        // BABYLON.ActionManager.OnLongPressTrigger

        //BABYLON.ActionManager.OnPointerOverTrigger
        //BABYLON.ActionManager.OnPointerOutTrigger


        var zoomOpts = {
            timer: null,
            inProgress: false,
            loop: true
        };
        function onStopZoomTimer() {
            console.log('onStopZoomTimer',
                {
                    onSpaceScroll: EM.Audio.GameSounds.onSpaceScroll
                });
            zoomOpts.timer = null;
            _sounds.onSpaceScroll.stop();
            zoomOpts.inProgress = false;
            console.log('onStopZoomTimer');
            return false;

        }

        var lastTime = 0;
        function continuationTimer() {
            var curTime = Date.now();
            if (!zoomOpts.timer) {
                lastTime = curTime;
                zoomOpts.timer = setTimeout(onStopZoomTimer, 300);
            } else if (curTime - lastTime > 20 && zoomOpts.timer) {
                if (zoomOpts.timer) {
                    clearTimeout(zoomOpts.timer);
                    //zoomOpts.timer = null;
                    lastTime = curTime;
                    zoomOpts.timer = setTimeout(onStopZoomTimer, 300);
                }
            }
        }

        function onStartZoomTimer() {
            zoomOpts.inProgress = true;
            if (_sounds.onSpaceScroll.loop !== rotateOptions.loop) {
                _sounds.onSpaceScroll.loop = rotateOptions.loop;
            }
            if (!_sounds.onSpaceScroll.isPlaying) {
                _sounds.onSpaceScroll.play();
            } else {
                continuationTimer();
            }
        }

        EM.Scene.onPrePointerObservable.add(function (pointerInfo, eventState) {
            return;
            if (pointerInfo && EM.Scene.meshUnderPointer && EM.Scene.meshUnderPointer.id === activeWorldMesh.id) {
                //&& pointerInfo.pickInfo && pointerInfo.pickInfo.pickedMesh
                //pointerInfo.pickInfo.pickedMesh.id === activeWorldMesh.id
                onStartZoomTimer();
                console.log("eventState", { eventState: eventState, pointerInfo: pointerInfo });
            }

        }, BABYLON.PointerEventTypes.POINTERWHEEL, false);

        MapEvent.AddExecuteCodeAction(activeWorldMesh, BABYLON.ActionManager.OnPointerOutTrigger, function (mesh, event) {
            //  onStopZoomTimer();
            onStopRotation();
        });
        MapEvent.AddExecuteCodeAction(activeWorldMesh, BABYLON.ActionManager.OnPointerOverTrigger, function (mesh, event) {
            //  onStopZoomTimer();
            //onStopRotation();
           // console.log("OnPointerOverTrigger");
        });


        //OnLongPressTrigger
        //BABYLON.ActionManager.OnKeyDownTrigger
        //OnKeyUpTrigger
        //MapEvent.InitSceneEvents = null;
        //delete MapEvent.InitSceneEvents;

    };

    MapEvent.IMapEventItemOption = function (mesh) {
        function IMapEventItemOption() {
            this.mesh = mesh;
            this.leftClick = null;
            this.rightClick = null;
            this.doubleClick = null;
            this.hovered = null;
            this.unHovered = null;
        }
        return new IMapEventItemOption();
    }
    MapEvent.RegisterFactoryAction = function (iMapEventItemOption) {
        if (!iMapEventItemOption) {
            throw new Error("MapEvent.RegisterFactoryAction: iMapEventItemOption not exist");
        }
        if (!iMapEventItemOption.mesh) {
            throw new Error("MapEvent.RegisterFactoryAction: mesh not exist");
        }

        var mesh = iMapEventItemOption.mesh;

        if (mesh.actionManager) {
            mesh.actionManager.dispose();
        }
        if (iMapEventItemOption.leftClick) {
            MapEvent.AddExecuteCodeAction(mesh, BABYLON.ActionManager.OnLeftPickTrigger, iMapEventItemOption.leftClick);
        }
        if (iMapEventItemOption.rightClick) {
            MapEvent.AddExecuteCodeAction(mesh, BABYLON.ActionManager.OnRightPickTrigger, iMapEventItemOption.rightClick);
        }
        if (iMapEventItemOption.doubleClick) {
            MapEvent.AddExecuteCodeAction(mesh, BABYLON.ActionManager.OnDoublePickTrigger, iMapEventItemOption.doubleClick);
        }
        if (iMapEventItemOption.hovered) {
            MapEvent.AddExecuteCodeAction(mesh, BABYLON.ActionManager.OnPointerOverTrigger, iMapEventItemOption.hovered);
        }
        if (iMapEventItemOption.unHovered) {
            MapEvent.AddExecuteCodeAction(mesh, BABYLON.ActionManager.OnPointerOutTrigger, iMapEventItemOption.unHovered);
        }

    };
    MapEvent.RemoveActionFromMesh = function (mesh, triggerType) {
        return EM.EstateEvents.RemoveActionFromMesh.apply(EM.EstateEvents, arguments);
    };
    MapEvent.GetOrCreateActionManagerFromMesh = function (mesh) {
        return EM.EstateEvents.GetOrCreateActionManagerFromMesh.apply(EM.EstateEvents, arguments);

    };
    MapEvent.AddExecuteCodeAction = function () {
        return EM.EstateEvents.AddExecuteCodeAction.apply(EM.EstateEvents, arguments);

    };
    //#endregion

})(EM.MapEvent);
