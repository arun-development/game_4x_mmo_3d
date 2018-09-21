//bace+ facnce
//http://www.babylonjs-playground.com/index2_5.html#8R77A0#9
//bace+mother+fence + not optemized jpg (28mb)
//https://www.babylonjs-playground.com/index2_5.html#S86PYK
//job in  - non vercion

(function () {
    var lodash = $("#lodash-lib");
    if (!lodash.length) $("head").append("<script id='lodash-lib' src='https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.0/lodash.min.js'></script>");
})();
var _scene;
var cdnCatalog = "https://eternplaypublic.blob.core.windows.net/babylonjs-playground/base-core/assets2/";
var bFileName = "game_models";
var babylonFileName = bFileName + ".babylon";

function getMesh(meshId) {
    return _scene.getMeshByID(meshId);
}
function getMaterial(materialId) {
    return _scene.getMaterialByID(materialId);
}
function createFenceCylAnimations(fenceCylMeshes) {
    var animations = [];
    var twoPi = 6.28;
    var direction = 1;
    var scale = 0.4;
    var fps = 16;
    var cell = 40;
    var baseSpeed = 1.76;
    var minSpeed = 1 * baseSpeed;
    var maxSpeed = 2 * baseSpeed;

    //effects
    var hlColor = new BABYLON.Color3(200, 125, 255);
    var bColor = BABYLON.Color4.FromInts(hlColor.r, hlColor.g, hlColor.b, 255);
    var hl = new BABYLON.HighlightLayer("fence_cyl_hl", _scene, { mainTextureRatio: 0.5 });
    hl.innerGlow = true;
    hl.outerGlow = true;
    hl.blurHorizontalSize = 2;
    hl.blurVerticalSize = 2;

    _.forEach(fenceCylMeshes, function (mesh, key) {
        hl.addMesh(mesh, bColor);
        direction = direction * -1;
        var animationName = mesh.name + ".rotation.x";
        var baseRotation = _.floor(_.random(0, 3, true), 2);
        var startRot = baseRotation * direction;
        var endRot = (twoPi + baseRotation) * direction;


        mesh.scaling.z = mesh.scaling.y = scale;
        mesh.rotation.x = startRot;
        var animation = BABYLON.Animation.CreateAndStartAnimation(animationName, mesh, "rotation.x", fps, cell, startRot, endRot,
         BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        animation.speedRatio = _.random(minSpeed, maxSpeed, true);
        animations.push(animation);
    });
    return animations;
};


function setFenceBody(fenceBodyMesh) {
    var fbMat = fenceBodyMesh.material;
    fbMat.backFaceCulling = false;
    fbMat.useAlphaFromDiffuseTexture = true;
    fbMat.linkEmissiveWithDiffuse = true;
    // fbMat.useEmissiveAsIllumination = true;
    fbMat.diffuseTexture.level = 2;

    function registerFenceBodyAnimation() {
        fbMat.diffuseTexture.uOffset += 0.01;
        if (fbMat.diffuseTexture.uOffset >= 1) {
            fbMat.diffuseTexture.uOffset = 0;
        }
    };
    // _scene.registerBeforeRender(registerFenceBodyAnimation);

};

function createFenceAnimation(loadedMeshesGroup) {
    //full name ex  "fence_top_cyl_1"
    var serch = /^base_fence_[a-z_]{0,}_cyl_[a-z_0-9]{0,}/;

    var fence = {
        cylinders: [],
        body: null
    }
    _.forEach(loadedMeshesGroup, function (value) {
        if (value.name === "base_fence_body") {
            fence.body = value;
            return;
        }
        if (value.name.search(serch) !== -1) {
            fence.cylinders.push(value);
        }
    });
    console.log({ fence: fence });
    var fenceMaterial = getMaterial(bFileName + ".base_fence_cyl");
    console.log({ fenceMaterial: fenceMaterial });
    fenceMaterial.duseAlphaFromDiffuseTexture = true;
    fenceMaterial.backFaceCulling = false;

    createFenceCylAnimations(fence.cylinders);
    setFenceBody(fence.body);

};

//for concole fast acc. data
window._fmat = function () {
    return getMaterial(bFileName + ".fence_cyl.002");
}
window._fdif = function () {
    return getMaterial(bFileName + ".fence_cyl.002").diffuseTexture;
}
window._fBase = function () {
    return getMaterial("fence_body");
}

function movieMother() {
    var motherParentId = "mother_parent";
    var mother = getMesh(motherParentId);
    mother.position = new BABYLON.Vector3(50, 10, 0);
}
function fixFloor() {
    var floorId = "base_floor_gexa";
    var fllorMesh = getMesh(floorId);
    var fMat = fllorMesh.material;
    var pngNHURL = "https://eternplaypublic.blob.core.windows.net/babylonjs-playground/base-core/assets2/bump_floor_gexa.png";
    var text = new BABYLON.Texture(pngNHURL, _scene);
    // var brickWallDiffURL = "http://i.imgur.com/Rkh1uFK.png";
    // var brickWallNHURL = "http://i.imgur.com/GtIUsWW.png";
    //var wallDiffuseTexture = new BABYLON.Texture(brickWallDiffURL, scene);
    //var wallNormalsHeightTexture = new BABYLON.Texture(brickWallNHURL, _scene);
    // fMat.diffuseTexture = wallDiffuseTexture;
    // fMat.bumpTexture = wallNormalsHeightTexture;
    fMat.bumpTexture = text;
    fMat.useParallax = true;
    fMat.useParallaxOcclusion = true;
    fMat.parallaxScaleBias = 0.1;
    fMat.specularPower = 1000.0;
    fMat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);

    //    var fBump = fllorMesh.material.bumpTexture;

    console.log(fllorMesh);
};
function loadMesh() {
    BABYLON.SceneLoader.ImportMesh("", cdnCatalog, babylonFileName, _scene, function (loadedMeshesGroup, particleSystems, skeletons) {
        movieMother();
        fixFloor();
        createFenceAnimation(loadedMeshesGroup);
    });
}

var createScene = function () {
    window._scene = _scene = new BABYLON.Scene(engine);
    var arcCamera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0, 1.45, 15, BABYLON.Vector3.Zero(), _scene);
    arcCamera.setPosition(new BABYLON.Vector3(15, 15, 15));
    // arcCamera.upperRadiusLimit = 18;
    arcCamera.wheelPrecision = 50;
    arcCamera.lowerBetaLimit = 0;
    arcCamera.upperBetaLimit = 1.5;
    arcCamera.attachControl(canvas, true);
    _scene.activeCamera = arcCamera;
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), _scene);
    light.intensity = 0.8;
    loadMesh();
    return _scene;
};