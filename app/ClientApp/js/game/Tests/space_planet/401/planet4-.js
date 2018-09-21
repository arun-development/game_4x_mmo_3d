(function () {
    function add(domId, path) {
        var item = $("#" + domId);
        if (!item.length) {
            $("head").append("<script id=" + domId + " src=" + path + "></script>");
        }
    }
    add("lodash-lib", "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.0/lodash.min.js");
    add("help-scripts", "https://eternplaypublic.blob.core.windows.net/babylonjs-playground/spance_planet/help-scripts.js");
})();

var _scene;
var Enveropment = {};
var _camera;
var getMesh;
var getMaterial;
var createTexture;
var hl;



var cdnCatalog = "https://eternplaypublic.blob.core.windows.net/babylonjs-playground/materiales_tmp/map/planetoid/planet/earth/401/";

var sbMeshId = "planet_skybox_";
var groundId = "planet_ground_401";

function createStar() {
    console.log(_camera);
    var godrays = new BABYLON.VolumetricLightScatteringPostProcess('godrays', 1.0, _camera, null, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false, _scene);

    godrays.mesh.material.diffuseTexture = new BABYLON.Texture('textures/sun.png', _scene, true, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE);
    godrays.mesh.material.diffuseTexture.hasAlpha = true;
    godrays.mesh.position = new BABYLON.Vector3(0, 0, 150);
    godrays.mesh.scaling = new BABYLON.Vector3(35, 35, 35);

    return godrays.mesh;
}
var t;
function createPlanet(star) {
    var name = "earth_401";
    var diff = "diffuse_";
    var bump = "bump_";

    function tUrl(pref, jpg) { return cdnCatalog + pref + name + ((jpg) ? ".jpg" : ".png"); }

    var mesh = BABYLON.Mesh.CreateSphere("planet", 16, 2, _scene);
    var mat = new BABYLON.StandardMaterial("palnet", _scene);
    mat.diffuseTexture = createTexture(tUrl(diff, true));
    mat.bumpTexture = createTexture(tUrl(bump));
    mat.emissiveTexture = mat.diffuseTexture.clone();
    mat.diffuseTexture.level = 4;
    mat.emissiveTexture.level = 0.1;
    mat.specularPower = 10000;
    mat.useParallax = true;
    //mat.useParallaxOcclusion = true;
    mesh.material = mat;
    mesh.position = new BABYLON.Vector3(0, 0, 0);

    var c = 0;
    var step = 0.0005;
    var dir = 1;
    var max = 0.01;
    var min = 0.005;
    function run() {
        return setInterval(function () {
            mat.parallaxScaleBias += step * dir;
            if (mat.parallaxScaleBias > max || mat.parallaxScaleBias < min) {
                dir = -dir;
            }
        }, 50);

    }
    if (t != null) {
        clearInterval(t);
        t = run();
    } else t = run();

    hl.AddMesh(mesh, new BABYLON.Color3(93, 78, 73));
    //     var m2 = mesh.clone();
    //     var scale =1.2;
    //     var m2Mat =mat.clone();
    //     m2.material =m2Mat;
    //     m2.position.x =1;
    //     mesh.material.alpha =0.8;
    //     window.planet =mesh;
    return mesh;

}

function createScene() {
    var _scene = new BABYLON.Scene(engine);
    var clearColor = new BABYLON.Color3.Black;
    _scene.clearColor = clearColor;

    var light = new BABYLON.PointLight("StarLight", new BABYLON.Vector3(0, 0, 150), _scene);

    var helper = new CreateHelp();
    _camera = helper.createCamera(_scene, canvas);
    helper.createEnveropment(Enveropment);
    Enveropment.Create(_scene, "https://eternplaypublic.blob.core.windows.net/babylon/env/");
    getMesh = helper.getMesh(_scene);
    getMaterial = helper.getMaterial(_scene);
    createTexture = helper.createTexture(_scene);

    hl = helper.createHl(_scene, getMesh)();
    hl.Create(1, 0.5);
    var star = createStar();
    var planet = createPlanet(star)
    _camera.target = planet;
    //  createPlanet(createStar());
    return _scene;
};