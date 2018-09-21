// http://www.babylonjs-playground.com/#NVKAU#3
//http://www.babylonjs-playground.com/#1X8NRY#2
// out code
(function () {
    var lodash = $("#lodash-lib");
    if (!lodash.length) $("head").append("<script id='lodash-lib' src='https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.0/lodash.min.js'></script>");
    var helps = $("#help-scripts");
    if (!helps.length) $("head").append("<script id='help-scripts' src='https://eternplaypublic.blob.core.windows.net/particle/sectorAnimation/help-scripts.js'></script>");
})();

(function () {
    "use_strict";
    var baseFogColor = new BABYLON.Color3(0.99, 0.99, 0.99);
    function resetCamera() {
        GameCamera.Camera.lockedTarget = null;
        GameCamera.Camera.zoomOnFactor = 1;
    };

    var hiddenPosition = new BABYLON.Vector3(99999, 99999, 99999);
    var showPosition = new BABYLON.Vector3(0, 0, -1);



    //#region sectorAnimation
    var sectorAnimationSubscribeName = "MapAnimation.SectorAnimation";
    var sectorAnimation = MapAnimation._IAnimation(sectorAnimationSubscribeName);
    sectorAnimation.SubscribeNames.PlayFilm = sectorAnimationSubscribeName + ".PlayFilm";

    var videoPlaneId = "movie-screen";
    var sectorVideoMaterialId = "sector-movie-screen";
    var fogParam = {
        color: baseFogColor,
        step: null,
        fogDuration: null,
        mediaFogDuration: null,
        fogStartTime: null,
        revers: false
    };


    //#region  Movie Screen
    function createVideoPlane() {
        var w = 1920;
        var h = w * 9 / 16;
        var vp = BABYLON.MeshBuilder.CreatePlane(videoPlaneId, { width: w, height: h }, EM.Scene);
        vp.position = BABYLON.Vector3.Zero();
        vp.position.z -= 1;
        vp.backFaceCulling = true;
        vp.isVisible = false;
    };
    function getVideoPlane() {
        var vp = EM.Scene.getMeshByID(videoPlaneId);
        if (vp) return vp;
        return createVideoPlane();
    };
    function setPlaneToPosition(toShowPosition) {
        var plane = getVideoPlane();
        plane.position = (toShowPosition) ? showPosition : hiddenPosition;
        return plane;
    }
    function showOrHideScreen(show) {
        var plane = setPlaneToPosition(show);
        plane.isVisible = show;
        return plane;
    };
    //#endregion

    function cleanFog() {
        //BABYLON.Scene.FOGMODE_NONE;
        //BABYLON.Scene.FOGMODE_EXP;
        //BABYLON.Scene.FOGMODE_EXP2;
        //BABYLON.Scene.FOGMODE_LINEAR;
        //Only if LINEAR
        //scene.fogStart = 20.0;
        //scene.fogEnd = 60.0;
        EM.Scene.fogMode = BABYLON.Scene.FOGMODE_NONE;
        EM.Scene.fogColor = baseFogColor;
        EM.Scene.fogDensity = 0;
    };

    function getSectorMovieMaterial() {
        var mat = EM.Scene.getMaterialByID(sectorVideoMaterialId);
        if (mat) return mat;
        mat = new BABYLON.StandardMaterial(sectorVideoMaterialId, EM.Scene);
        mat.diffuseTexture = EM.VideoTextures.SectorJump.Texture;
        mat.diffuseTexture.level = 1.5;
        mat.alpha = 0.8;
        return mat;
    };

    function setSectorScreen() {
        EM.VideoTextures.SectorJump.Stop();
        var plane = getVideoPlane();
        plane.material = getSectorMovieMaterial();
        return plane;
    };

    function playFilm() {
        EM.VideoTextures.SectorJump.Play();
        sectorAnimation.Observer.NotifyAll(sectorAnimation.SubscribeNames.PlayFilm);
    };

    function setCameraToScreen() {
        var plane = showOrHideScreen(true);
        var c = GameCamera.Camera;
        var medPi = Math.PI / 2;
        var q = 16 / 9;

        // c.rebuildAnglesAndRadius();
        var fact = 0.5 / q;

        c.zoomOnFactor = fact;
        c.zoomOn([plane], true);
        c.alpha = c.lowerAlphaLimit = c.upperAlphaLimit = -medPi;
        c.beta = c.lowerBetaLimit = c.upperBetaLimit = medPi;
        c.lockedTarget = plane;
        c.lowerRadiusLimit = c.upperRadiusLimit = c.radius;
        c.fov = 1;

        EM.StarLight.SetInCamera();
        playFilm();
    };

    function registerFog(onMediaFog, unregister, onDone) {
        var curTime = Date.now();
        if (!fogParam.fogStartTime) {
            EM.Scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
            EM.Scene.fogColor = fogParam.color;
            EM.Scene.fogDensity = 0;

            fogParam.fogDuration = 1000;
            fogParam.mediaFogDuration = fogParam.fogDuration / 2;
            fogParam.step = 0.00001;
            fogParam.revers = false;
            fogParam.fogStartTime = curTime;
        };
        if (fogParam.mediaFogDuration <= (curTime - fogParam.fogStartTime) && !fogParam.revers) {
            fogParam.revers = true;
            fogParam.step = -fogParam.step;
            fogParam.fogDuration = fogParam.fogDuration;
            onMediaFog();
        };

        EM.Scene.fogDensity += fogParam.step;

        if (fogParam.fogDuration <= (curTime - fogParam.fogStartTime)) {
            EM.Scene.unregisterBeforeRender(unregister);
            cleanFog();
            fogParam.fogStartTime = null;
            if (onDone instanceof Function) onDone();
        }
    }

    function registerStartFog() {
        registerFog(setCameraToScreen, registerStartFog);
    };

    function play() {
        setSectorScreen();
        EM.Scene.registerBeforeRender(registerStartFog);
    };

    function registerEndFog() {
        registerFog(function () {
            showOrHideScreen(false);
        }, registerEndFog, function () {
            EM.VideoTextures.SectorJump.Stop();
            resetCamera();
            sectorAnimation.Observer.NotifyAll(sectorAnimation.SubscribeNames.Stop);
        });
    };

    function stop() {
        EM.Scene.registerBeforeRender(registerEndFog);
    };

    sectorAnimation.Play = play;
    sectorAnimation.Stop = stop;
    //#endregion
    MapAnimation.SectorAnimation = sectorAnimation;
})();

var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    var mediaPi = _.round(Math.PI / 2, 4);
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 1, 1500, BABYLON.Vector3(5, 50, 1500), scene);
    camera.upperRadiusLimit = 1e6;
    camera.lowerRadiusLimit = 0;
    camera.minZ = 1;
    camera.maxZ = 3e6;
    camera.radius = 1e4;
    camera.wheelPrecision = 1;
    camera.attachControl(canvas, true);
    camera.alpha = -mediaPi;
    camera.beta = mediaPi;

    GameCamera.Camera = camera;

    EM.Scene = scene;
    EM.StarLight._create();
    EM.VideoTextures.SectorJump.CreateTexture();

    // Skybox
    var universe = BABYLON.Mesh.CreateSphere("Universe", 32, 1.8e6, scene);
    var material = new BABYLON.StandardMaterial("skyBox", scene);
    var sTexture = new BABYLON.CubeTexture("textures/skybox", scene);
    material.backFaceCulling = false;
    material.reflectionTexture = sTexture;

    //var qq = BABYLON.Mesh.CreateSphere("Univers2e", 32, 100, scene);

    material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

    material.disableLighting = true;
    material.reflectionTexture.level = 1;
    material.alpha = 0.99;
    material.alphaMode = BABYLON.Engine.ALPHA_ADD;
    material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    material.specularColor = new BABYLON.Color3(0, 0, 0);
    universe.material = material;

    // BABYLON.SceneOptimizer.OptimizeAsync(scene);
    return EM.Scene;
};