
EM.EstateGeometry = {
    IModules: function () {
        return {
            Modules: null,
            RegistrEvents: null,
            GetMesh: function (meshId) {
                return EM.GetMesh(meshId);
            },
            /**
             *Устанавливает видимость меша
             * @param {string|| int} meshId 
             * @param {bool} show 
             * @returns {щиоусе}  mesh
             */
            SetVisible: function (meshId, show) {
                return EM.SetVisible(meshId, show);
            },
            States: { In: 1, Arround: 2, Hide: 3 }
        };
    },
    PlanetModules: null,
    MotherModules: null,
    //names
    MotherElements: [],
    PlanetGroundsMeshes: [],
    GameModelsInit: null
};

//#region MotherModules
(function (EstateGeometry) {
    var motherModules = EM.EstateGeometry.IModules();

    var industrialComplexId = "mother_industrial_complex";
    var spaceShipyardId = "mother_space_shipyard";
    var motherResearchId = "mother_research";
    var motherCoreId = "mother_core";
    var estateMotherGroupId = "mother_parent";
    var loadedMotherId = "mother";

    var modules = [industrialComplexId, spaceShipyardId, motherResearchId];

    var states = motherModules.States;


    function getMesh(meshId) {
        return motherModules.GetMesh(meshId);
    }

    function setVisible(meshId, show) {
        return motherModules.SetVisible(meshId, show);
    }

    function registrEvents() {
        //   console.log("registrEvents industrialComplexId ", getMesh(industrialComplexId));
        EM.EstateEvents.RegisterMotherIndustrialComplex(getMesh(industrialComplexId));
        // console.log("registrEvents spaceShipyardId ", getMesh(spaceShipyardId));
        EM.EstateEvents.RegisterMotherSpaceShipyard(getMesh(spaceShipyardId));
        //console.log("registrEvents motherResearchId ", getMesh(motherResearchId));
        EM.EstateEvents.RegisterMotherResearch(getMesh(motherResearchId));
        //console.log("registrEvents motherCapsuleId ", getMesh(motherCapsuleId));
        //console.log("registrEvents estateMotherGroupId ", getMesh(estateMotherGroupId));
        EM.EstateEvents.RegisterMotherCapsule(getMesh(estateMotherGroupId));

    }

    function motherModulesVisible(show, name) {
        var alpha = show ? 1 : 0;
        if (show) {
            if (name === industrialComplexId) getMesh(name).visibility = alpha;
            else if (name === spaceShipyardId) getMesh(name).visibility = alpha;
            else if (name === motherResearchId) getMesh(name).visibility = alpha;
        } else {
            _.forEach(modules, function (module, key) {
                getMesh(module).visibility = alpha;
            });
        }
    }
    function setMotherVisible(show) {
        return setVisible(estateMotherGroupId, show);
    }

    function setMotherState(state) {
        function isPickable(mesh, val) {
            if (mesh) mesh.isPickable = val;
        }

        if (state === states.In) isPickable(setMotherVisible(true), false);
        else if (state === states.Arround) isPickable(setMotherVisible(true), true);
        else if (state === states.Hide) isPickable(setMotherVisible(false), true);
        motherModulesVisible(false);
    }


    motherModules.MotherIndustrialComplex = industrialComplexId;
    motherModules.MotherSpaceShipyard = spaceShipyardId;
    motherModules.MotherResearch = motherResearchId;

    motherModules.SetMotherModulesVisible = motherModulesVisible;
    motherModules.LoadedMotherId = loadedMotherId;

    /**
    * 'mother_parent'
    */
    motherModules.EstateMotherGroupId = estateMotherGroupId;
    motherModules.MotherCoreId = motherCoreId;


    motherModules.Modules = modules;
    Object.defineProperty(motherModules, "Modules", {
        get: function () {
            return modules;
        }
    });
    motherModules.RegistrEvents = registrEvents;

    motherModules.GetMotherGroupMesh = function () {
        return getMesh(estateMotherGroupId);
    };

    motherModules.InMother = function () {
        setMotherState(states.In);
    };
    motherModules.ArroundMother = function () {
        setMotherState(states.Arround);
    };
    motherModules.HideMother = function () {
        setMotherState(states.Hide);
    };
    Object.defineProperty(EstateGeometry, "MotherModules", {
        get: function () {
            return motherModules;
        }
    });

})(EM.EstateGeometry);
//#endregion

//#region PlanetModules
(function (EstateGeometry) {
    //#region Declare
    var ar = EM.AssetRepository;
    var planetModules = EstateGeometry.IModules();
    var industrialComplex = "base_industrial_complex";
    var spaceShipyard = "base_space_shipyard";
    var comandCenter = "base_comand_center";
    var baseMeshId = "base";
    var baseParentId = "base_parent";
    var modules = [industrialComplex, spaceShipyard, comandCenter];
    var _baseMesh;
    var moduleMeshes = {
        industrialComplex: null,
        spaceShipyard: null,
        comandCenter: null
    };


    var _lastPlanetEnverotment;
    var states = planetModules.States;

    //#endregion

    //#region Helpers
    function getMesh(meshId) {
        return planetModules.GetMesh(meshId);
    }


    function _nullRef(data, argName, sourceMethod) {
        throw Errors.ClientNullReferenceException(data, argName, "EstateGeometry.PlanetModules." + sourceMethod);
    }

    function getPlanetEnverotment(planetId, show) {
        if (!planetId) throw _nullRef({ planetId: planetId }, "planetId", "getPlanetEnverotment");
        var pl = EM.EstateData.GetPlanetLocation();
        if (!pl.TextureTypeId) throw _nullRef({ pl: pl }, "pl.TextureTypeId", "getPlanetEnverotment");
        //   console.log("getPlanetEnverotment", pl);
        var iPlanetEnverotment = ar.GetIPlanetEnverotment(pl.TextureTypeId);
        var env = iPlanetEnverotment.GetEnverotment(_baseMesh, show, planetId);
        return env;

    }
    //#endregion

    //#region Main


    function baseModulesVisible(show, name) {
        var alpha = show ? 1 : 0;
        if (show && name) {
            if (name === industrialComplex) moduleMeshes.industrialComplex.visibility = alpha;
            else if (name === spaceShipyard) moduleMeshes.spaceShipyard.visibility = alpha;
            else if (name === comandCenter) moduleMeshes.comandCenter.visibility = alpha;
            return;
        }
        _.forEach(modules, function (moduleMeshId, key) {
            var moduleMesh = getMesh(moduleMeshId);
            moduleMesh.visibility = alpha;

        });
    }

    function setPlanetEnverotment(planetId, show) {
        // console.log("_lastPlanetEnverotment", _lastPlanetEnverotment);
        if (!_lastPlanetEnverotment) {
            try {
                var last = getPlanetEnverotment(planetId, show);
                if (last) _lastPlanetEnverotment = last;

            }
            catch (e) {
                console.log("setPlanetEnverotment", { e: e });
                return;
            }
            return;
        }

        if (typeof planetId !== "number") {
            //console.log("typeof planetId !== number");
            return;
        }
        if (_lastPlanetEnverotment.PlanetId === planetId && _lastPlanetEnverotment.IsVisible === show) {
            // console.log("if (_lastPlanetEnverotment.planetId === planetId && _lastPlanetEnverotment.visible === show) return;");
            return;
        }
        if (_lastPlanetEnverotment.PlanetId === planetId && _lastPlanetEnverotment.IsVisible) {
            //console.log("if (_lastPlanetEnverotment.planetId === planetId && _lastPlanetEnverotment.visible)");
            _lastPlanetEnverotment.IsVisible = false;
            return;
        } else if (_lastPlanetEnverotment.PlanetId !== planetId && _lastPlanetEnverotment.IsVisible) {
            // console.log("else if (_lastPlanetEnverotment.planetId !== planetId && _lastPlanetEnverotment.visible)");
            _lastPlanetEnverotment.IsVisible = false;
        }

        //  console.log("_____GO_______");
        //EM.GameCamera.Camera.target = BABYLON.Vector3.Zero();
        // EM.GameCamera.Camera.lowerRadiusLimit = 1;
        _lastPlanetEnverotment = getPlanetEnverotment(planetId, show);
        //console.log("_lastPlanetEnverotment", _lastPlanetEnverotment);

    }

    function setPlanetState(state) {
        var ce;
        var planetId;
        if (!_lastPlanetEnverotment) {
            if (state === states.In) {
                ce = EM.EstateData.GetCurrentEstate();
                planetId = ce.EstateId;
                if (!planetId) state = states.Hide;
                setPlanetEnverotment(planetId, true);
            }
            if (state === states.Hide) EM.SetVisible(baseParentId, false, true);
            baseModulesVisible(false);
            return;
        }
        else {
            ce = EM.EstateData.GetCurrentEstate();
            planetId = ce.EstateId;
            if (!planetId) state = states.Hide;
            if (state === states.In) setPlanetEnverotment(planetId, true);
            else if (state === states.Arround) {
                //todo зарезервированно но пока нет в нем необходимости
            }
            else if (state === states.Hide) setPlanetEnverotment(_lastPlanetEnverotment.PlanetId, false);
        }
        baseModulesVisible(false);
    }

    //#endregion

    //#region Public
    planetModules.IndustrialComplex = industrialComplex;
    planetModules.SpaceShipyard = spaceShipyard;
    planetModules.ComandCenter = comandCenter;
    planetModules.BaseModulesVisible = baseModulesVisible;
    planetModules.BaseParentId = baseParentId;


    planetModules.Modules = modules;


    planetModules.InPlanet = function () {
        setPlanetState(states.In);
    };
    planetModules.ArroundPlanet = function () {
        setPlanetState(states.Arround);
    };
    planetModules.HidePlanet = function () {
        setPlanetState(states.Hide);
    };
    planetModules.BaseVisibleObserverable = null;

    planetModules.RegistrEvents = function (parentBase) {

        var _vo = Utils.IPropertyObserverable(parentBase, "isVisible", "VisibleObserverable");
        planetModules.BaseVisibleObserverable = parentBase[_vo.ObserverablePropertyName];
        Object.defineProperty(planetModules, "BaseVisibleObserverable", {
            get: function () {
                return parentBase[_vo.ObserverablePropertyName];
            }
        });
        _baseMesh = _vo._rootObject;
        //console.log("_baseMesh", {
        //    _baseMesh: _baseMesh
        //});

        moduleMeshes.industrialComplex = getMesh(industrialComplex);
        moduleMeshes.spaceShipyard = getMesh(spaceShipyard);
        moduleMeshes.comandCenter = getMesh(comandCenter);
        EM.EstateEvents.RegisterBaseIndustrialComplex(moduleMeshes.industrialComplex);
        EM.EstateEvents.RegisterBaseSpaceShipyard(moduleMeshes.spaceShipyard);
        EM.EstateEvents.RegisterBaseCommandCenter(moduleMeshes.comandCenter);

        delete planetModules.RegistrEvents;
    };




    Object.defineProperty(EstateGeometry, "PlanetModules", {
        get: function () {
            return planetModules;
        }
    });

    //#endregion 
})(EM.EstateGeometry);
//#endregion

//#region GameModelsInit
(function (EstateGeometry) {
    var sceneName = "game_models";
    var showLog = false;
    function _log(mes, val) {
        if (!showLog) return;
        var _mes = "EstateGeometry.GameModelsInit__{" + mes + "}__";
        if (!val) console.log(_mes);
        else console.log(_mes, val);

    }
    function getMatName(matName) {
        return sceneName + "." + matName;
    }
    function getMat(matName) {
        return EM.GetMaterial(matName);
    }

    function _createCoreParticles(emmitterName, particleSystemName, emitterPosition) {

        var emitter = BABYLON.Mesh.CreateBox(emmitterName, 0.01, EM.Scene);
        emitter.isVisible = false;
        emitter.position = emitterPosition || BABYLON.Vector3.Zero();
        var particleSystem = new BABYLON.ParticleSystem(particleSystemName, 20, EM.Scene);
        particleSystem.particleTexture = EM.CreateTexture(EM.Particle.$getLaserFireTextureUrl());

        particleSystem.minAngularSpeed = -6;
        particleSystem.maxAngularSpeed = 6;
        particleSystem.minSize = 1;
        particleSystem.maxSize = 1.1;
        particleSystem.minLifeTime = 1;
        particleSystem.maxLifeTime = 2;
        particleSystem.minEmitPower = 0;
        particleSystem.maxEmitPower = 0;
        particleSystem.emitter = emitter;

        particleSystem.minEmitBox = BABYLON.Vector3.Zero();
        particleSystem.maxEmitBox = BABYLON.Vector3.Zero();


        particleSystem.gravity = BABYLON.Vector3.Zero();
        particleSystem.updateSpeed = 0.02;
        particleSystem.emitRate = 10;


        particleSystem.direction1 = BABYLON.Vector3.Zero();
        particleSystem.direction2 = BABYLON.Vector3.Zero();


        particleSystem.color1 = new BABYLON.Color3(0.1, 0.7, 1.0);
        particleSystem.color2 = new BABYLON.Color3(0.1, 0, 1.0);
        return particleSystem;


    }



    function buildPlanetFactory() {
        var baseFenceBodyId = "base_fence_body";
        var floorId = "base_floor_gexa";
        var m = EstateGeometry.PlanetModules;


        function createFenceCylAnimations(fenceCylMeshes, fb) {
            var animations = [];
            var twoPi = 6.28;
            var direction = 1;
            var scale = 0.2;
            var fps = 16;
            var cell = 40;
            var baseSpeed = 1.76;

            var minSpeed = 1 * baseSpeed;
            var maxSpeed = 3 * baseSpeed;

            //effects
            function createFenceHl() {
                var hlColor = new BABYLON.Color3(200, 125, 255);
                var bColor = BABYLON.Color4.FromInts(hlColor.r, hlColor.g, hlColor.b, 255);
                var hl = new BABYLON.HighlightLayer("fence_cyl_hl", EM.Scene, { mainTextureRatio: 0.2 });
                return hl;
            }
            _.forEach(fenceCylMeshes, function (mesh, key) {
                //   hl.addMesh(mesh, bColor);
                // hl.addExcludedMesh(mesh);
                direction = direction * -1;
                var animationName = mesh.name + ".rotation.x";
                var baseRotation = _.floor(_.random(0, 3, true), 2);
                var startRot = baseRotation * direction;
                var endRot = (twoPi + baseRotation) * direction;
                mesh.scaling.z = mesh.scaling.y = scale;
                mesh.rotation.x = startRot;
                //    mesh.position.y +=0.5;
                var animation = BABYLON.Animation.CreateAndStartAnimation(animationName, mesh, "rotation.x", fps, cell, startRot, endRot,
                BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                animation.speedRatio = _.random(minSpeed, maxSpeed, true);

                animations.push(animation);


            });

            return animations;
        };
        function setDiffToOpacyti(material) {
            material.opacityTexture = material.diffuseTexture;
            material.opacityTexture.getAlphaFromRGB = true;
            material.useSpecularOverAlpha = false;
        }

        function fixFloor() {
            var configObject = {
                parallaxScaleBias: 0.1,
                renderMode: "Bump",
                bumpLevel: 2,
                specularPower: 30,
                uvScale: 10,
                specularScale: 1,
                bumpTexuteUrl: ""
            }

            var gexa = m.GetMesh(floorId);
            var material = gexa.material;
            var diffuse = material.diffuseTexture;
            var bump = material.bumpTexture;
            bump.getAlphaFromRGB = true;
            bump.level = configObject.bumpLevel;
            var specular = diffuse.clone("specular");
            //   material.useParallax = true;
            //   material.useParallaxOcclusion = true;           
            material.specularTexture = specular;
            material.specularPower = configObject.specularPower;
            function setScale(val) {
                diffuse.uScale = diffuse.vScale = bump.uScale = bump.vScale = val;
            }

            function setSpecularScale(val) {
                material.specularTexture.vScale = material.specularTexture.uScale = val;
            }

            setScale(configObject.uvScale);
            configObject.bumpTexuteUrl = bump.url;

        };

        function fixFenceCyl(fenceMaterial) {
            fenceMaterial.backFaceCulling = false;
            setDiffToOpacyti(fenceMaterial);
            fenceMaterial.diffuseTexture.level = 1.5;
        }

        function fixFenceBody(fenceBodyMesh, setAnumation) {
            var fbMat = fenceBodyMesh.material;
            fbMat.backFaceCulling = false;
            setDiffToOpacyti(fbMat);
            fbMat.diffuseTexture.level = 1;

            function registerFenceBodyAnimation() {
                fbMat.diffuseTexture.uOffset += 0.01;
                if (fbMat.diffuseTexture.uOffset >= 1) {
                    fbMat.diffuseTexture.uOffset = 0;
                }
            };

            if (setAnumation) _scene.registerBeforeRender(registerFenceBodyAnimation);
        };

        function fixFence() {
            var bodyMesh = m.GetMesh(baseFenceBodyId);
            var cylinders = [];
            var cylNames = [];
            var pref = "base_fence_";
            function setSideFenceNames(_side) {
                cylNames.push(pref + _side + "_cyl_1");
                cylNames.push(pref + _side + "_cyl_2");
                cylNames.push(pref + _side + "_cyl_3");
            }
            setSideFenceNames("top");
            setSideFenceNames("right");
            setSideFenceNames("down");
            setSideFenceNames("left");

            _.forEach(cylNames, function (id, idx) {
                cylinders.push(m.GetMesh(id));
            });

            fixFenceCyl(getMat(getMatName("base_fence_cyl")));
            fixFenceBody(bodyMesh);
            createFenceCylAnimations(cylinders, bodyMesh);

        };


        function createBaseLaserInSky() {

            var emitter = BABYLON.Mesh.CreateBox("base_laser_emmiter", 0.01, EM.Scene);
            // фиксированное положение тк нет суб меша с точными координатами 
            emitter.position = new BABYLON.Vector3(-4.75, 2.5, 6.1);
            emitter.isVisible = false;
            var particleSystem = new BABYLON.ParticleSystem("base_laser_particle", 200, EM.Scene);
            particleSystem.particleTexture = EM.CreateTexture(EM.Particle.$getLaserFireTextureUrl(), EM.Scene);
            particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

            particleSystem.minAngularSpeed = -1;
            particleSystem.maxAngularSpeed = 1;
            particleSystem.minSize = 1;
            particleSystem.maxSize = 1;
            particleSystem.minLifeTime = 5;
            particleSystem.maxLifeTime = 5;
            particleSystem.minEmitPower = 0.01;
            particleSystem.maxEmitPower = 0.01;
            particleSystem.emitter = emitter;

            particleSystem.minEmitBox = BABYLON.Vector3.Zero();
            particleSystem.maxEmitBox = BABYLON.Vector3.Zero();


            particleSystem.gravity = BABYLON.Vector3.Zero();
            particleSystem.gravity.y = 1;
            particleSystem.updateSpeed = 0.05;
            particleSystem.emitRate = 40;


            particleSystem.direction1 = BABYLON.Vector3.Zero();
            particleSystem.direction2 = BABYLON.Vector3.Zero();


            particleSystem.color1 = new BABYLON.Color3(0.1, 0.1, 1.0);
            particleSystem.color2 = new BABYLON.Color3(0.2, 0.1, 1.0);
            EM.EstateGeometry.PlanetModules.BaseVisibleObserverable.add(function (observer, eventState) {
                if (observer.PropertyInfo.NewValue) {
                    particleSystem.start();
                } else {
                    particleSystem.stop();
                }
            });
          //  console.log("particleSystem", { particleSystem: particleSystem });
        }



        function createBaseCoreParticles() {
            var particleSystem = _createCoreParticles("base_core_emmiter", "base_core_parricle", new BABYLON.Vector3(0.05, 2.4, 3.65));
            EM.EstateGeometry.PlanetModules.BaseVisibleObserverable.add(function (observer, eventState) {
                if (observer.PropertyInfo.NewValue) {
                    particleSystem.start();

                } else {
                    particleSystem.stop();
                }
            });
        }
        // tmp
        function loadOrbitalTurrentAnumation() {
            var mesh = EM.GetMesh("base_orbital_turret_1");
            mesh.actionManager = new BABYLON.ActionManager(EM.Scene);
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (e, t) {
                EM.Scene.beginAnimation(mesh, 0, 160, true);
                //  console.log("Hi turel1", { e: e, t: t });
            }, null));

            var mesh2 = EM.GetMesh("base_orbital_turret_2");
            mesh2.actionManager = new BABYLON.ActionManager(EM.Scene);
            mesh2.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (e, t) {
                EM.Scene.beginAnimation(mesh2, 0, 160, true);
                //   console.log("Hi turel2", { e: e, t: t });
            }, null));
        }



        var baseParent = m.GetMesh(m.BaseParentId);
        baseParent.isPickable = false;
        EM.SetVisibleByMesh(baseParent, false, true);
        m.RegistrEvents(baseParent);

        fixFloor();
        fixFence();
        createBaseLaserInSky();
        createBaseCoreParticles();
        _log("planetFactory done");


    }

    function buildMother() {
        var scale = 6;
        var scaling = BABYLON.Vector3.One().scale(scale);
        var m = EstateGeometry.MotherModules;

        function rebuildCore() {
            var core = m.GetMesh(m.MotherCoreId);
            // core.dispose();   //todo удалить из файла выгрузки меш


            var matId = core.material.id;
            var defaultFireCataolg = "/Content/babylon-assets/babylon_materiales/fire/";
            var diffuseUrl = defaultFireCataolg + "diffuse.png";
            var distortionUrl = defaultFireCataolg + "distortion.png";
            var opacityUrl = defaultFireCataolg + "opacity.png";
            return core;
        }

        var parent = m.GetMesh(m.EstateMotherGroupId);

        //todo удалить из файла выгрузки меш
        var core = m.GetMesh(m.MotherCoreId);
        if (core) {
            core.dispose();
        }
      

        var motherCoreParticleSystem = _createCoreParticles(m.MotherCoreId, "mother_core_particle", new BABYLON.Vector3(0, -0.13, 0.46));
        motherCoreParticleSystem.emitter.parent = parent;
        Object.defineProperty(motherCoreParticleSystem.emitter, "isVisible",{
                value: false,
                enumerable: true,
                configurable: false,
                writable: false
        });
        motherCoreParticleSystem.maxSize = 1.4;
        motherCoreParticleSystem.emitRate = 15;





        // rebuildCore(parent);
        var emmisiveMaterialeNames = [
            getMatName("mother_windows"),
            getMatName("mother_detail_3"),
            getMatName("mother_detail_2"),
            getMatName("mother_detail_1"),
            getMatName("mother_hull_5")];

        //  console.log("mother emmisiveMateriales ", emmisiveMaterialeNames);
        _.forEach(emmisiveMaterialeNames, function (emmisiveMaterialName, key) {
            //   return false;
            var vindowMaterial = EM.Scene.getMaterialByID(emmisiveMaterialName);
            vindowMaterial.emissiveTexture.level = 3;
            vindowMaterial.emissiveTexture.useEmissiveAsIllumination = true;
        });
        parent.scaling = scaling;
        m.RegistrEvents();
        var _vo = Utils.IPropertyObserverable(parent, "isVisible", "VisibleObserverable");
        parent.VisibleObserverable = parent[_vo.ObserverablePropertyName];
        Object.defineProperty(m, "MotherVisibleObserverable", {
            get: function () {
                return parent[_vo.ObserverablePropertyName];
            }
        });


        var motherLight = new BABYLON.PointLight("MotherLight", new BABYLON.Vector3.Zero(), EM.Scene);
        motherLight.position = new BABYLON.Vector3.Zero();
        motherLight.position.y = 5;
        motherLight.parent = parent;
        motherLight.intensity = 0.5;

        motherCoreParticleSystem.start();
        parent.VisibleObserverable.add(function (observer, eventState) {
            if (observer.PropertyInfo.NewValue) {
                motherLight.intensity = 0.5;
                motherCoreParticleSystem.start();
            } else {
                motherLight.intensity = 0;
                motherCoreParticleSystem.stop();
            }
        });
        _log("mother done");



    }

    function gameModelsInit(loadedMeshesGroup) {
        //#region debug
        var showMeshNames = false;
        if (showMeshNames) {
            _log("showMeshNames", {
                loadedMeshesGroup: loadedMeshesGroup
            });

        }
        buildPlanetFactory();
        buildMother();
        delete EstateGeometry.GameModelsInit;
    }


    Object.defineProperty(EstateGeometry, "GameModelsInit", {
        get: function () {
            return gameModelsInit;
        }
    });

})(EM.EstateGeometry);
//#endregion
