//http://www.babylonjs-playground.com/#4VGTT/1
var _scene;
var r = 1000;

var cdnCatalog = "https://eternplaypublic.blob.core.windows.net/env-test/";
function _material(matName, onCreate) {
    var mat = new BABYLON.StandardMaterial(matName, _scene)
    onCreate(mat);
    return mat;
};
function simpeMat(matName) {
    return _material(matName, function (material) {
        material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    });
}

function createBase() {
    var side = 5;
    var name = "base";
    var base = BABYLON.Mesh.CreateBox(name, side, _scene);
    base.position.y += side;
    base.material = simpeMat(name);
    return base;
}

function createGround() {
    var diffUrl = cdnCatalog + "diffuse_earth_401.jpg";
    var heightMapUrl = cdnCatalog + "height_earth_401.jpg";
    var meshId = "planet_ground_401";
    var mesh = BABYLON.Mesh.CreateGroundFromHeightMap(meshId, heightMapUrl, r, r, 100, 0, 30, _scene);
    _material(meshId, function (mat) {
        mat.specularPower = 10000;
        mat.diffuseTexture = new BABYLON.Texture(diffUrl, _scene);
        mesh.material = mat;
    });
};
function createEnv() {
    var name = 'sphere1';
    var sphere = BABYLON.Mesh.CreateSphere(name, 32, r, _scene);
    var urlD = cdnCatalog + "sphere_env_401.jpg";

    var mat = new BABYLON.StandardMaterial(name, _scene);
    mat.backFaceCulling = false;
    mat.disableLighting = true;
    mat.emissiveTexture = new BABYLON.Texture(urlD, _scene, false, false);
    mat.emissiveTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE;
    console.log(BABYLON.Texture.CUBIC_MODE);
    sphere.material = mat;
};


var createScene = function () {
    _scene = new BABYLON.Scene(engine);
    var arcCamera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0, 1.5, 100, BABYLON.Vector3.Zero(), _scene);
    arcCamera.setPosition(new BABYLON.Vector3(50, 50, 50));

    arcCamera.wheelPrecision = 50;
    arcCamera.lowerBetaLimit = 0;
    arcCamera.upperBetaLimit = 1.5;
    arcCamera.attachControl(canvas, true);
    _scene.activeCamera = arcCamera;

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 100, 100), _scene);
    light.intensity = 0.7;
    createEnv();
    createGround();
    createBase();
    return _scene;

};