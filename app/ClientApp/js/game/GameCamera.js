EM.GameCamera = {
    //http://doc.babylonjs.com/tutorials/Cameras
    // inputs http://doc.babylonjs.com/tutorials/Customizing_Camera_Inputs
    //vars===================================================================
    Name: "GameCamera",
    Id: null,
    Camera: null,
    Keys: {
        Galaxy: "Galaxy",
        Systems: "Systems",
        SystemSelected: "SystemSelected",
        ArroundSystem: "ArroundSystem",
        MotherSelected: "MotherSelected",
        UserPlanet: "UserPlanet",
        Planetoid: "Planetoid"
    }
};
(function (GameCamera) {
    var defaultTarget = new BABYLON.Vector3.Zero();
    var keys = GameCamera.Keys;
    //#region CameraStateConfigs
    var pi = _.round(Math.PI, 4);
    var fakePi = 3;
    var fakeZero = 0.1;
    var twoPi = pi * 2;


    /**
    * 
    * @param {double} upperRadiusLimit required default 0
    * @param {double} lower required default 1
    * @param {int} minZ required default 0
    * @param {int} radius default 10
    * @param {double} wheelPrecision  default 0.01
    * @param {double} lowerBetaLimit  default -Math.PI
    * @param {double} upperBeta  default Math.PI
    * @param {double} fov required default 1.2
    * @returns  {object}  остальные параметры по умолчанию или переопределению
    */
    function createCameraConfig(upperRadiusLimit, lowerRadiusLimit, minZ, radius, wheelPrecision, lowerBetaLimit, upperBetaLimit, fov) {
        var sens = 1;
        var config = {

            //required dynamic state
            target: null,
            //required state config
            radius: radius || 10,
            //required state config
            minZ: minZ || 0,

            maxZ: 3e6,
            //optional
            wheelPrecision: wheelPrecision || 0.01,
            //default
            alpha: 0.4,
            //default
            beta: 1.2,
            //required state config
            lowerBetaLimit: lowerBetaLimit || fakeZero,
            //required state config
            upperBetaLimit: upperBetaLimit || fakePi,

            //required state config
            upperRadiusLimit: upperRadiusLimit || 0,
            //required state config
            lowerRadiusLimit: lowerRadiusLimit || 1,


            lowerAlphaLimit: 0,
            upperAlphaLimit: 0,
            lockedTarget: null,
            zoomOnFactor: 1,

            //required
            position: null,
            fov: fov || 1,
            speed: 100,
            panningSensibility: 0,
            keysLeft: [39, 68],
            keysDown: [40, 83],
            keysRight: [37, 65],
            keysUp: [38, 87],
            angularSensibilityX: sens,
            angularSensibilityY: sens
        };
 
        config.setTarget = function (vector3Target) {
            //console.log("vector3Target", typeof vector3Target);
            if (vector3Target && vector3Target.clone) config.target = vector3Target.clone();
            else {
                if (SHOW_DEBUG) {
                    console.log("target not set, seted default");
                }
                config.target = defaultTarget.clone();
            };

        };
        config.setPosition = function (vectorPosition) {
            if (vectorPosition && vectorPosition.clone) config.position = vectorPosition.clone();
            else config.position = null;
        };
        return config;

    }


    GameCamera.$activeState = null;


    var galaxy = createCameraConfig();
    galaxy.upperRadiusLimit = 5e4;
    galaxy.lowerRadiusLimit = 1.4e4;
    galaxy.minZ = 1e3;
    galaxy.radius = 1e4;
    galaxy.wheelPrecision = 0.01;
    galaxy.lowerBetaLimit = 0.1;
    galaxy.upperBetaLimit = 1;


    var systems = createCameraConfig();
    systems.upperRadiusLimit = 2e5;
    systems.lowerRadiusLimit = 4e4;
    systems.minZ = 3;
    systems.radius = 7e4;
    systems.wheelPrecision = 0.01;
    systems.lowerBetaLimit = 0;
    systems.upperBetaLimit = pi;
    systems.setTarget(defaultTarget.clone());

    //todo  не для состояния
    var arroundSystem = createCameraConfig(systems.upperRadiusLimit, systems.lowerRadiusLimit, systems.minZ, systems.wheelPrecision);
    arroundSystem.radius = 5e4;
    Object.freeze(arroundSystem);

    var system = createCameraConfig();
    system.upperRadiusLimit = 900;
    system.lowerRadiusLimit =8;
    system.minZ = 1;
    system.radius = system.lowerRadiusLimit * 2;
    system.wheelPrecision = 10;
    system.speed = 1;
    system.lowerBetaLimit = fakeZero;
    system.upperBetaLimit = fakePi;
    system.fov = 1;
    system.$endAnimationRadius = 100;
    system.$newSystemId = null;
    system.$setOnBeforeAnimationParams = function() {
        system.radius = system.$endAnimationRadius;
        return system.radius;
    };
    system.$setOnEndAnimationParams = function (minCameraRadius) {
        system.alpha = GameCamera.Camera.alpha;
        system.beta = GameCamera.Camera.beta;
        if (minCameraRadius) {
            GameCamera.SetAndGetNewLowerRadiusLimit(minCameraRadius);
        }
 
    };

    var mother = createCameraConfig();
    mother.upperRadiusLimit = 1e3;
    mother.lowerRadiusLimit = 14;
    mother.minZ = 1;
    mother.radius = 15;
    mother.wheelPrecision = 50;
    mother.speed = 1;
    //mother.alpha = pi / 4;
    //mother.beta = pi / 4;  
    mother.$alpha = 2.2;
    mother.$beta = 1.2;  
    Object.defineProperty(mother, "alpha", {
        get: function () {
            return GameCamera.Camera.alpha;
        },
        //set: function (value) {
        //    return GameCamera.Camera.alpha = value;
        //}
    });
    Object.defineProperty(mother, "beta", {
        get: function () {
            return GameCamera.Camera.beta;
        },
        //set: function (value) {
        //    return GameCamera.Camera.beta = value;
        //}
    });
    mother.$setABToCamera = function() {
        GameCamera.Camera.alpha = mother.$alpha;
        GameCamera.Camera.beta = mother.$beta;
    };


    var inUserPlanet = createCameraConfig();
    inUserPlanet.upperRadiusLimit = 20;
    //  inUserPlanet.upperRadiusLimit = 500;
    //inUserPlanet.lowerRadiusLimit = 2;
    inUserPlanet.lowerRadiusLimit = 10;
    inUserPlanet.minZ = 1;
    inUserPlanet.maxZ = 300;
    inUserPlanet.radius = 15;
    //inUserPlanet.wheelPrecision = 50;
    inUserPlanet.wheelPrecision = 200;
    inUserPlanet.lowerBetaLimit = 0.1;
    inUserPlanet.upperBetaLimit = 1.3;

    //inUserPlanet.lowerBetaLimit = -pi;
    // inUserPlanet.upperBetaLimit = pi;
    inUserPlanet.fov = 1;
    inUserPlanet.setTarget(defaultTarget.clone());

    //#endregion

    //#region SetState
    function setNewConfigToActiveCamera(activeCamera, configCamera, state) {
       // if (GameCamera.$activeState && GameCamera.$activeState === state) return;

        if (configCamera.target && !_.isEqual(activeCamera.target, configCamera.target)) {
              activeCamera.setTarget(configCamera.target.clone());  
        }
        if (activeCamera.alpha !== configCamera.alpha) activeCamera.alpha = configCamera.alpha;
        if (activeCamera.beta !== configCamera.beta) activeCamera.beta = configCamera.beta;

        //console.log("cameraRadius", {
        //    camR: activeCamera.radius,
        //    configCamR: configCamera.radius,
        //});


        if (activeCamera.lowerRadiusLimit !== configCamera.lowerRadiusLimit) activeCamera.lowerRadiusLimit = configCamera.lowerRadiusLimit;
        if (activeCamera.upperRadiusLimit !== configCamera.upperRadiusLimit) activeCamera.upperRadiusLimit = configCamera.upperRadiusLimit;
        if (activeCamera.radius !== configCamera.radius) { 
            if (configCamera.radius > configCamera.upperRadiusLimit) {
                configCamera.radius = configCamera.upperRadiusLimit;
            } else if (configCamera.radius < configCamera.lowerRadiusLimit) {
                configCamera.radius = configCamera.lowerRadiusLimit;
            }
            activeCamera.radius = configCamera.radius;
        }


        if (activeCamera.minZ !== configCamera.minZ) activeCamera.minZ = configCamera.minZ;
        if (activeCamera.maxZ !== configCamera.maxZ) activeCamera.maxZ = configCamera.maxZ;

        if (activeCamera.wheelPrecision !== configCamera.wheelPrecision) activeCamera.wheelPrecision = configCamera.wheelPrecision;


        if (activeCamera.fov !== configCamera.fov) activeCamera.fov = configCamera.fov;

        if (activeCamera.lowerBetaLimit !== configCamera.lowerBetaLimit) activeCamera.lowerBetaLimit = configCamera.lowerBetaLimit;
        if (activeCamera.upperBetaLimit !== configCamera.upperBetaLimit) activeCamera.upperBetaLimit = configCamera.upperBetaLimit;

        if (activeCamera.lowerAlphaLimit !== configCamera.lowerAlphaLimit) activeCamera.lowerAlphaLimit = configCamera.lowerAlphaLimit;
        if (activeCamera.upperAlphaLimit !== configCamera.upperAlphaLimit) activeCamera.upperAlphaLimit = configCamera.upperAlphaLimit;

        if (activeCamera.lockedTarget !== configCamera.lockedTarget) activeCamera.lockedTarget = configCamera.lockedTarget;

        if (activeCamera.zoomOnFactor !== configCamera.zoomOnFactor) activeCamera.zoomOnFactor = configCamera.zoomOnFactor;



        if (configCamera.position) {
            console.log("configCamera.position", { position: configCamera.position.clone() });
            activeCamera.position = configCamera.position.clone();
        }

        GameCamera.$activeState = state;
    }

    function getConfig(state) {
       // console.log("getConfig state", state);
        if (state === keys.Galaxy) return galaxy;
        else if (state === keys.Systems) return systems;
        else if (state === keys.ArroundSystem) return arroundSystem;
        else if (state === keys.SystemSelected) return system;
        else if (state === keys.MotherSelected) return mother;
        else if (state === keys.UserPlanet) return inUserPlanet;
        console.log("error state not configured for this type");
        return createCameraConfig();
    };

    function setGalaxy(galaxyId) {
        if (GameCamera.$activeState && GameCamera.$activeState === keys.Galaxy) return;
        var config = getConfig(keys.Galaxy);
        config.setTarget(EM.MapGeometry.Galaxies.GetGalaxy(galaxyId).position);
        setNewConfigToActiveCamera(GameCamera.Camera, config, keys.Galaxy);
    };

    function setSystems() {
        if (GameCamera.$activeState && GameCamera.$activeState === keys.Systems) return;
        var config = getConfig(keys.Systems);
        setNewConfigToActiveCamera(GameCamera.Camera, config, keys.Systems);
    }

    function setArroundSystem(target) {
        if (GameCamera.$activeState && GameCamera.$activeState === keys.ArroundSystem) return;
        var config = getConfig(keys.ArroundSystem);
        config.setTarget(target);
        setNewConfigToActiveCamera(GameCamera.Camera, config, keys.ArroundSystem);
    }

    function setSystemSelected(target, fromState, newSystemId) {
        if (fromState === "PlanetoidSelectedState") {
           return;
        }
        else {
            if (GameCamera.$activeState && GameCamera.$activeState === keys.SystemSelected && system.$newSystemId === newSystemId) return;
            system.$setOnEndAnimationParams();
            var config = getConfig(keys.SystemSelected);
            config.setTarget(target);
            setNewConfigToActiveCamera(GameCamera.Camera, config, keys.SystemSelected);
            system.$newSystemId = newSystemId;
        }


    }

    function setMotherSelected(ignore) {
        //console.log("camera.setMotherSelected", {
        //    activeState: GameCamera.$activeState,
        //    "activeState === keys.MotherSelected)": GameCamera.$activeState === keys.MotherSelected,
        //    "activeState && activeState === keys.MotherSelected": GameCamera.$activeState && GameCamera.$activeState === keys.MotherSelected
        //});
    
        var csl = EM.EstateData.GetCurrentSpaceLocation();
        var motherLocation = EM.EstateData.GetMotherLocation();
        if (!ignore) {
            if (csl.SystemId === motherLocation.SystemId) {
                GameCamera.Camera.upperRadiusLimit = mother.upperRadiusLimit;
                GameCamera.Camera.lowerRadiusLimit = mother.lowerRadiusLimit;
                GameCamera.Camera.maxZ = mother.maxZ;
                mother.$setABToCamera();
                console.log("setMotherSelected csl.SystemId === motherLocation.SystemId");
                return;
            }
            if (GameCamera.$activeState && GameCamera.$activeState === keys.MotherSelected) return;
        }
  
        system.$newSystemId = motherLocation.SystemId;
        var config = getConfig(keys.MotherSelected);
        mother.$setABToCamera();
        config.setTarget(EM.GetMotherMesh().getAbsolutePosition());
        setNewConfigToActiveCamera(GameCamera.Camera, config, keys.MotherSelected);
    }

    function setInUserPlanet() {
        if (GameCamera.$activeState && GameCamera.$activeState === keys.UserPlanet) return;
        var config = getConfig(keys.UserPlanet);
        setNewConfigToActiveCamera(GameCamera.Camera, config, keys.UserPlanet);
    }

    //#endregion

    function createCamera(scene, canvas, key, target) {
        var config = getConfig(key);
        if (target != null) config.target = target;
        if (config.target == null) config.target = defaultTarget.clone();        
        var camera = new BABYLON.ArcRotateCamera(GameCamera.Name, config.alpha, config.beta, config.radius, config.target, scene); 
        camera.attachControl(canvas, true, false);      
        GameCamera.Id = camera.id;
        GameCamera.Camera = camera;

        setNewConfigToActiveCamera(camera, config);

    }


    GameCamera.Galaxy = galaxy;
    GameCamera.Systems = systems;
    GameCamera.ArroundSystem = arroundSystem;
    GameCamera.System = system;
    GameCamera.Mother = mother;
    GameCamera.InUserPlanet = inUserPlanet;
    GameCamera.DefaultTarget = defaultTarget;
    GameCamera.CreateCamera = createCamera;
    GameCamera.GetConfig = getConfig;

    GameCamera.SetGalaxy = setGalaxy;
    GameCamera.SetSystems = setSystems;
    GameCamera.SetArroundSystem = setArroundSystem;
    GameCamera.SetSystemSelected = setSystemSelected;
    GameCamera.SetMotherSelected = setMotherSelected;
    GameCamera.SetInUserPlanet = setInUserPlanet;
    GameCamera.SetAndGetNewLowerRadiusLimit = function (newLowerRadiusLimit) {
        var newRadius = newLowerRadiusLimit;
        if (newLowerRadiusLimit < GameCamera.Camera.minZ) newRadius = _.ceil(GameCamera.Camera.minZ) + 1;
        if (newRadius !== GameCamera.Camera.lowerRadiusLimit) GameCamera.Camera.lowerRadiusLimit = newRadius;
        return newRadius;
    };

})(EM.GameCamera);