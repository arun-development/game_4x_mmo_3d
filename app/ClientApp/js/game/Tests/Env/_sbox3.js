//http://www.babylonjs-playground.com/#14XZ8T#18
(function () {
    var lodash = $("#lodash-lib");
    if (!lodash.length) $("head").append("<script id='lodash-lib' src='https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.0/lodash.min.js'></script>");
})();

var _scene;
var r = 1000;

var cdnCatalog = "https://eternplaypublic.blob.core.windows.net/env-test/";
var babylonFileName = "game_model_000.babylon";
var babylonFileName2 = "planet_ground_403.babylon";
var babylonFileName3 = "skybox-ground-3.babylon";

var loadetSbMaterialId = "skybox-ground-3.planet_skybox_";
var sbTextureFileName = "sphere_env_401.jpg";//not used
var testSbMaterialId = "testMaterial";
var sbTestTextureFileName = "sphere_env_test_401.jpg";
var sbMeshId = "planet_skybox_";
var groundId = "planet_ground_401";

var repM = {
    sb: {},
    sbTest: {}
}

function getMesh(meshId) {
    return _scene.getMeshByID(meshId);
}
function getMaterial(materialId) {
    var mat = _scene.getMaterialByID(materialId);
    console.log("mat", {
        mat: mat,
        matId: materialId
    });
    return mat;
}
function createTestMaterial() {
    var testMaterial = new BABYLON.StandardMaterial(testSbMaterialId, _scene);
    testMaterial.backFaceCulling = false;
    testMaterial.disableLighting = false;
    testMaterial.diffuseTexture = new BABYLON.Texture(cdnCatalog + sbTestTextureFileName, _scene, false, true);
    testMaterial.diffuseTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE;
    console.log("createTestMaterial", testMaterial);
    return testMaterial;
};


function updateMaterial(mesh, newMaterialId) {
    if (newMaterialId) { mesh.material = getMaterial(newMaterialId); }

};

function fixMeshes(change) {
    var box = getMesh(sbMeshId);
    var ground = getMesh(groundId);
    //  ground.position = BABYLON.Vector3.Zero();
    //  box.position = BABYLON.Vector3.Zero();
    if (change) {
        setInterval(function () {
            var id = box.material.id;
            if (id === testSbMaterialId) {
                id = loadetSbMaterialId;
            } else { id = testSbMaterialId }
            updateMaterial(box, id);
        }, 5000);
    }

    // console.log("ground", ground);

}


function importMesh() {
    function updateProgress(data) { }
    BABYLON.SceneLoader.ImportMesh("", cdnCatalog, babylonFileName3, _scene, function (loadedMeshesGroup, particleSystems, skeletons) {
        console.log(loadedMeshesGroup);
        fixMeshes();
    }, updateProgress);
}

var createScene = function () {
    _scene = new BABYLON.Scene(engine);

    var arcCamera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0, 1.5, 100, BABYLON.Vector3.Zero(), _scene);
    arcCamera.setPosition(new BABYLON.Vector3(50, 50, 50));

    arcCamera.wheelPrecision = 50;
    arcCamera.lowerBetaLimit = 0;
    arcCamera.upperBetaLimit = 1.5;
    arcCamera.attachControl(canvas, true);
    _scene.activeCamera = arcCamera;

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), _scene);
    light.intensity = 0.7;
    createTestMaterial();
    importMesh();
    return _scene;

};

