$("html").unbind("contextmenu").bind("contextmenu", function (event) {
    console.log("html.oncontextmenu", {
        e:event
    });
    return false;
}).bind("dblclick", function (event) {
    return false;
});

var EM = {
    SubscribeName: "EM",
    Observer: null,
    EstateContainerId: "#estate",
    CanvasId: "estateCanvas",
    Engine: null,
    Scene: null,
    CreateScene: null,
    StartRender: null,
    StopRender: null,
    GetMotherMesh: null,
    ShowDebug: function (show, popup) {
        if (show) {
            this.Scene.debugLayer.show();
            setTimeout(function () {
                $(".insp-right-panel").css("z-index", 5);
            },100);
           
            return;
            // пример конфига с настройками
            this.Scene.debugLayer.show({
                popup: popup,
                initialTab: 2,
                //parentElement:$("body"),
                newColors: {
                    backgroundColor: '#eee',
                    backgroundColorLighter: '#fff',
                    backgroundColorLighter2: '#fff',
                    backgroundColorLighter3: '#fff',
                    color: '#333',
                    colorTop: 'red',
                    colorBottom: 'blue'
                }
            });
  
           
        }
        else {
            this.Scene.debugLayer.hide();
        }
     
    },
    StarLight: {
        States: {
            Other: 1,
            InPlanet: 2,
            InSystem: 3,
            InCamera: 4 ,
 
        },
        ActiveState: null,
        SetInSystem: null,
        SetInPlanet: null, 
        SetOther: null,
        SetState: null,
        SetInCamera: null
    },
    _helpers: null,
    $hub: null,
    Audio: {
        GameSounds: {},
        InitGame: angular.noop
    }

};  
(function () {
    var canvas;
    var engine;
    var scene;
    var showLog = false;



    EM.Observer = Utils.PatternFactory.Observer(EM.SubscribeName);
    EM.CreateScene = function (initServerData, mainGameHubService) {
        function _log(methodName, data) {
            if (!showLog) return;
            var message = "EM.CreateScene";
            if (methodName) message = message + "__{" + methodName + "}__Ok__";
            if (data) console.log(message, { data: data });
            else console.log(message);

        }
        EM.Canvas = canvas = document.getElementById(EM.CanvasId);
        EM.Engine = engine = new BABYLON.Engine(canvas, true, { stencil: true });

        EM._helpers = new EM.IHelper(new BABYLON.Scene(engine), mainGameHubService);
        EM.SetHelpersToObject(EM);
        //BABYLON.Scene.ExclusiveDoubleClickMode = true;
        EM.Scene.exclusiveDoubleMode = true;
        scene = EM.Scene;
        EM.Audio.InitGame(scene);

        function createWorld() {
 
            var tmp = {};
            tmp.Update = function (name) {
                if (name === EM.MapBuilder.Sectors.SubscribeName) {
                    EM.MapBuilder.Sectors.Observer.Unsubscribe(tmp);
                    EM.Observer.NotifyAll();
                    tmp = null;
                    _log("createWorld.Update name", name);
                    EM.Particle.GetOrCreateSectorParticles();
                }
            };

            EM.MapBuilder.Sectors.Observer.Subscribe(tmp);
            _log(" EM.MapBuilder.Sectors.Observer.Subscribe(tmp)");

            EM.MapBuilder.Sectors.Build(initServerData[EM.MapGeometry.MapTypes.Sector]);
            _log(" EM.MapBuilder.Sectors.Build(initserverData[EM.MapGeometry.MapTypes.Sector]);");

            EM.MapData.GetSystem.InitSystemData(initServerData.SystemGeometry);
            _log("MapData.GetSystem.InitSystemData(initserverData.SystemGeometry)");

         

        }

        function createLight() {
            //  var light = new BABYLON.HemisphericLight("StarLight", new BABYLON.Vector3.Zero(), scene);
            //hemo.intensity = 0.05;
            var light = new BABYLON.PointLight("StarLight", new BABYLON.Vector3.Zero(), scene);
            var states = EM.StarLight.States;
            var baseSlPosition = new BABYLON.Vector3(0, 1e6, 0);
            var baseIntensity = 0.2;
            var maxRangPlanetPosition = 800;
            var defaultPlanetPosition = new BABYLON.Vector3(0, maxRangPlanetPosition / 2, 0);
            //todo  делаем трек солнца
            var planetLight;

            function IStarTrack(Tes, Light, Radius) {
                var _self = this;
                var tes = Tes || 360;
                var path = [];
                var idx = 0;
                var maxIdx = 0;
                var runned = false;
                var r = Radius || maxRangPlanetPosition;
                var intervalId = null;
                var day = Utils.Time.ONE_DAY;
                var delay = _.floor(day / tes);

                function _clearInteraval() {
                    if (intervalId) {
                        clearInterval(intervalId);
                        intervalId = null;
                    }
                }

                this.Position = new BABYLON.Vector3(0, 140, 0);
                this._light = null;
                this.Update = function () {
                    if (!runned) return;
                    if (idx > maxIdx) idx = 0;
                    this._light.position = path[idx];
                    idx++;
                };
                this.SetTrack = false;

                function cleanLight() {
                    _clearInteraval();
                    if (_self._light) {
                        _self._light.dispose();
                        _self._light = null;
                    }
                }
                function _createPath() {
                    var pi2 = Math.PI * 2;
                    var phi = 0.4;
                    var step = pi2 / tes;
                    path = [];
                    idx = 0;
                    for (var i = 0; i < pi2; i += step) {
                        var x = r / 4 * Math.sin(i) * Math.cos(phi);
                        var z = r / 4 * Math.cos(i);
                        //  var y = r * Math.sin(i) * Math.sin(phi);
                        var y = r * Math.sin(i) * Math.sin(phi);
                        // y += 0.4* r;
                        // y +=  r;
                        path.push(new BABYLON.Vector3(_.round(x, 5), _.round(y, 5), _.round(z, 5)));
                    }
                    path.push(path[0]);
                    maxIdx = path.length - 1;

                };


                this.LightName = "PlanetPointLight1";
                this.Start = function () {
                    cleanLight();
                    //planetLight = new BABYLON.HemisphericLight("PlanetLightHemo", new BABYLON.Vector3.Zero(), scene);
                    this._light = new BABYLON.PointLight(this.LightName, this.Position, scene);
                    this._light.intensity = 0.9;
                    this._light.specular.b = 0.7;
                    this._light.intensity = 1.0;
                    light.intensity = 0.0;
                    runned = true;
                    if (this.SetTrack) {
                        if (!path) _createPath();
                        _self.Update();
                        intervalId = setInterval(function () {
                            _self.Update();
                        }, delay);
                    }


                };
                this.Stop = function () {
                    cleanLight();
                    runned = false;
                };
                this.IsRunned = function () {
                    return runned;
                };


            };
            var starTrack = new IStarTrack();
            var setState = null;

            function _setActiveState(state) {
                EM.StarLight.ActiveState = state;
            }
            function setInCamera(intensity) {
                starTrack.Stop();
                light.intensity = intensity || 0.6;
                light.position = EM.GameCamera.Camera.position;
                _setActiveState(EM.StarLight.States.InCamera);
            };
            function setInPlanet(_state) {
                if (!_state) setState(states.InPlanet);
                else {
                    starTrack.Start();
                    _setActiveState(_state);
                }

            };

            function setOther(_state) {
                if (!_state) setState(states.Other);
                else {
                    light.intensity = baseIntensity;
                    light.position = baseSlPosition;
                    _setActiveState(_state);
                }

            };

            function setInSystem(_state) {
                if (!_state) {
                    setState(states.InSystem);
                    return;
                }

                light.intensity = 0.8;
                var csl = EM.EstateData.GetCurrentSpaceLocation();
                var starMeshId = EM.MapGeometry.System.GetStarMeshIdByUniqueId(csl.SystemId);
                var curStar = null;
                if (starMeshId) curStar = scene.getMeshByID(starMeshId);
                _log(".setInSystem", {
                    csl: csl,
                    curStar: curStar
                });

                if (curStar) {
                    light.position = curStar.getAbsolutePosition().clone();
                    _setActiveState(_state);
                }
                else setOther(states.Other);
            };    
   
            setState = function (state) {
                if (!state) return;
                if (state === EM.StarLight.ActiveState) return;
                if (typeof state != "number") return;
                if (starTrack.IsRunned() && state !== states.InPlanet) starTrack.Stop();

                if (state === states.InSystem) setInSystem(states.InSystem);
                else if (state === states.InPlanet) setInPlanet(states.InPlanet);
                else if (state === states.InCamera) setInCamera();
  
                else if (state === states.Other) setOther(states.Other);
            };

            EM.StarLight.SetOther = setOther;
            EM.StarLight.SetInPlanet = setInPlanet;
            EM.StarLight.SetInSystem = setInSystem;
            EM.StarLight.SetState = setState;
            EM.StarLight.SetInCamera = setInCamera;
 

        }

        function createCamera() {
            EM.GameCamera.CreateCamera(scene, canvas, EM.GameCamera.Keys.SystemSelected);
        }

        function createHdrSetting() {
            var hdr = new BABYLON.HDRRenderingPipeline("hdr", scene, 1.0, null, [EM.GameCamera.Camera]);
            hdr.brightThreshold = 2.0;
            hdr.gaussCoeff = 0.1;
            hdr.gaussMean = 1.0;
            hdr.gaussStandDev = 6.0;
            hdr.minimumLuminance = 0.1;
            hdr.luminanceDecreaseRate = 0.1;
            hdr.luminanceIncreaserate = 0.5;
            hdr.exposure = 0.3;
        };

 
        function regisertResizer() {
            window.addEventListener("resize", function () {
                if (engine) engine.resize();
            }, false);
        }

        createLight();
        _log("createLight");
        createCamera();
        _log("createCamera");

        regisertResizer();
        _log("regisertResizer");



        EM.AssetRepository.Init(scene, function () {
 
            createWorld();
            _log("createWorld");
        });

 

        //todo  события для отслеживаний кликов - дебаг
        //scene.debugLayer.show(true);

        return scene;
    };
    EM.StartRender = function () {
        engine.runRenderLoop(function () {
            scene.render();
        });
    };
    EM.StopRender = function () {
        engine.stopRenderLoop();
    };
    EM.GetMotherMesh = function () {
        return scene.getMeshByID(EM.EstateGeometry.MotherModules.EstateMotherGroupId);
    };
    EM.GetPointerCoordinate = function () {
        return new BABYLON.Vector2(EM.Scene.pointerX, EM.Scene.pointerY);
    };


    //#region GetHelpers


    EM.IHelper = function (_scene, mainGameHubService) {
        var _self = this;
        _self.Scene = _scene;
        _self.$hub = mainGameHubService;

        /**
        * памятка
        * isVisible {bool}  состояние видимый не видимый
        * isPickable {bool} будет ли меш реагировать на события в невидимом состоянии
        * visibility {decimal}   это аналог альфы меша принимает значения от 0 до 1;
        * @param {} mesh 
        * @param {} show 
        * @param {} notChangIsPickable 
        * @param {} notRecurseChildrens 
        * @returns {} 
        */
        function _setVisibleMesh(mesh, show, notChangIsPickable, notRecurseChildrens) {
            if (mesh.isVisible === show && (notChangIsPickable || mesh.isPickable === show)) return;
            function _setVisible(_mesh, _show) {
                _mesh.isVisible = _show;
                // _mesh.setEnabled((_show) ? 1 : 0);  
                if (!notChangIsPickable && _mesh.isPickable !== _show) _mesh.isPickable = _show;
            }


            _setVisible(mesh, show);
            if (notRecurseChildrens) return;
            var children = mesh.getChildMeshes();
            if (children) {
                _.forEach(children, function (val, idx) {
                    _setVisible(val, show);
                });
            }
            return mesh;

        }

        _self.GetMesh = function (meshId) {
            return _scene.getMeshByID(meshId);
        };
        _self.GetMaterial = function (materialId) {
            return _scene.getMaterialByID(materialId);
        };
        _self.CreateTexture = function (url) {
            var texture = new BABYLON.Texture(url, EM.Scene);
            return texture;
        };
        _self.CreateBaseMaterial = function (materialId, onCreate) {
            var material = new BABYLON.StandardMaterial(materialId, EM.Scene);
            if (onCreate instanceof Function) onCreate(material);
            return material;
        };


        _self.SetVisibleByMesh = function (mesh, show, notChangIsPickable, notRecurseChildrens) {
            show = !!show;
            if (mesh) _setVisibleMesh(mesh, show, notChangIsPickable, notRecurseChildrens);
            return mesh;
        };
        _self.SetVisible = function (meshId, show, notChangIsPickable, notRecurseChildrens) {
            return _self.SetVisibleByMesh(_self.GetMesh(meshId), show, notChangIsPickable, notRecurseChildrens);
        };
        _self.SetVisibleGroupByMeshes = function (meshes, show, notChangIsPickable, notRecurseChildrens) {
            _.forEach(meshes, function (mesh) {
                _self.SetVisibleByMesh(mesh, show, notChangIsPickable, notRecurseChildrens);
            });
        };
        _self.SetVisibleGroupByIds = function (meshIds, show, notChangisPickable, notRecurseChildrens) {
            _.forEach(meshIds, function (meshId) {
                _self.SetVisible(meshId, false, show, notChangisPickable, notRecurseChildrens);
            });
        };
        _self.CreateVec3Scale = function (scale) {
            return new BABYLON.Vector3(scale, scale, scale);
        };
        _self.SetScaleToMesh = function (mesh, scale) {
            var data = {
                mesh: mesh,
                scale: scale
            };

            if (!mesh) throw Errors.ClientNullReferenceException(data, "mesh", "EM.setScaleToMesh");
            if (typeof scale === "object") {
                mesh.scaling = scale;
                return mesh;
            }
            var _scale = null;
            if (!scale) _scale = 1;
            else if (typeof scale == "number") _scale = scale;
            else if (Utils.IsNumeric(scale)) {
                var numScale = _.toNumber(scale);
                if (numScale) _scale = numScale;
            }
            else throw Errors.ClientTypeErrorException(data, scale, "object||BABYLON.Vector3||number||string", "EM.setScaleToMesh");
            mesh.scaling = _self.CreateVec3Scale(_scale);
            return mesh;

        };

        return _self;
    }


    var hp = 1e7;
    EM.HIDDEN_POSITION = new BABYLON.Vector3(hp, hp, hp);

    EM.GetHelpers = function () {
        if (!EM._helpers) {
            throw Errors.ClientNotImplementedException({ EM: EM }, "scene not exist");
        }
        return EM._helpers;
    };

    EM.SetHelpersToObject = function (object) {
        if (object instanceof Object) {
            return _.extend(object, EM.GetHelpers());
        }
        return false;
    };
    //#endregion
})();

//EstateBuilder
(function () {
    EM.EstateBuilder = {
        UpdatePlanet: function () {
            var sp = new EM.SpaceState.SpacePosition();
            sp.clickByUserPlanet();
        },
        UpdateMother: function () {
            EM.EstateEvents.MotherCapsuleClick();
        },
        UserPlanetBuilder: {
            SetPlanetEnv: function (sourceType) {
                if (sourceType) {
                    //disposeCurrMapSystem();

                } else {
                    //disposeCurrPlanetEnv();
                }
            }
        }
    };
})();





