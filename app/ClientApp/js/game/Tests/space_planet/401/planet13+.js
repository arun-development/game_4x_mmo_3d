    (function () {
        function add(domId, path) {
            var item = $("#" + domId);
            if (!item.length) $("head").append("<script id=" + domId + " src=" + path + "></script>");
        }

        add("lodash-lib", "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.0/lodash.min.js");
        add("help-scripts", "https://eternplaypublic.blob.core.windows.net/babylonjs-playground/spance_planet/help-scripts.js");
    })();
//https://www.babylonjs-playground.com/#ANZXLW#23
var _scene;
var Enveropment = {};
var _camera;
var getMesh;
var getMaterial;
var createTexture;
var hl;
var sbMeshId = "planet_skybox_";
var groundId = "planet_ground_401";

function createStar() {
    var godrays = new BABYLON.VolumetricLightScatteringPostProcess("godrays", 1.0, _camera, null, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false, _scene);
    godrays.mesh.material.diffuseTexture = new BABYLON.Texture("textures/sun.png", _scene, true, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE);
    godrays.mesh.material.diffuseTexture.hasAlpha = true;
    godrays.mesh.position = new BABYLON.Vector3(0, 0, 150);
    godrays.mesh.scaling = new BABYLON.Vector3(35, 35, 35);
    return godrays.mesh;
}
var shaderName = "testShader1";

function createPlanet(star) {
    var cataolg = "https://eternplaypublic.blob.core.windows.net/babylonjs-playground/spance_planet/";
    var planetTypeName = "earth";
    var shaderCatalog = cataolg + "shaders/" + planetTypeName;
    var baseId = 401;
    var separator = "_";
    var diffusPref = "diffuse";
    var bumpPref = "bump";
    var emissivePref = "emissive";
    var lightPref = "light";
    var specularPref = "specular";
    var reflectionPref = "reflection";
    var cloudName = "cloud";
    var planetoidPrefix = "planetoid" + separator;
    var MapTypes = {
        Planet: "Planet"
    };

    function getUrl(prefix, type, id, isJpg, hasCloud) {
        var catalog = cataolg + "planet/" + type + "/" + id + "/";
        if (hasCloud) prefix += separator + cloudName;
        var fileName = prefix + separator + type + separator + id + (isJpg ? ".jpg" : ".png");
        var url = catalog + fileName;

        return url;
    }

    function createMeshName(type, id) {
        return type + id;
    }

    function getMatName(baseName, itemKeyId) {
        return planetoidPrefix + baseName + separator + itemKeyId;

    }

    var diffuseUrl = getUrl(diffusPref, planetTypeName, baseId, true);
    var bumpUrl = getUrl(bumpPref, planetTypeName, baseId, true);
    var lightUrl = getUrl(lightPref, planetTypeName, baseId, true);
    var specularUrl = getUrl(specularPref, planetTypeName, baseId, true);
    var emissiveCloudUrl = getUrl(emissivePref, planetTypeName, baseId, true, true);
    var planet = new BABYLON.Mesh.CreateSphere(createMeshName(MapTypes.Planet, baseId), 16, 20, _scene, true);
    planet.position = new BABYLON.Vector3(0, 0, 500);

    var scale = 1.015;
    var color = BABYLON.Color3.FromInts(197, 172, 163);

    var blackColor = BABYLON.Color3.Black();
    var specular = new BABYLON.Texture(specularUrl, _scene);
    function createCloud() {

        var planetCloud = new BABYLON.Mesh.CreateSphere(createMeshName(MapTypes.Planet + "." + cloudName, baseId), 16, 20, _scene, true);
        planetCloud.scaling = new BABYLON.Vector3(scale, scale, scale);
        planetCloud.position = planet.position;

        var material = new BABYLON.StandardMaterial(getMatName(planetTypeName + separator + cloudName, baseId));

        var emt = new BABYLON.Texture(emissiveCloudUrl, _scene);

        material.diffuseTexture = emt;
        material.emissiveTexture = emt;
        material.emissiveTexture.level = 2;
        material.emissiveColor = color;

        // Fresnel
        material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
        material.emissiveFresnelParameters.bias = 0.1;
        material.emissiveFresnelParameters.power = 1;
        material.emissiveFresnelParameters.leftColor = blackColor;
        material.emissiveFresnelParameters.rightColor = color;

        material.opacityFresnelParameters = new BABYLON.FresnelParameters();
        material.opacityFresnelParameters.bias = 0.5;
        material.opacityFresnelParameters.power = 10;
        material.opacityFresnelParameters.leftColor = color;
        material.opacityFresnelParameters.rightColor = BABYLON.Color3.Black();

        material.alphaMode = BABYLON.Engine.ALPHA_ADD;
        material.alpha = 0.9;
        material.specularTexture = specular;
        material.specularPower = 1000;
        material.disableLighting = true;
        planetCloud.material = material;

        return planetCloud;

    }

    function createStandartMaterial() {

        var material = new BABYLON.StandardMaterial(getMatName(planetTypeName, baseId), _scene);

        material.diffuseTexture = new BABYLON.Texture(diffuseUrl, _scene);
        material.diffuseTexture.level = 2;
        material.bumpTexture = new BABYLON.Texture(bumpUrl, _scene);
        material.lightmapTexture = new BABYLON.Texture(lightUrl, _scene);
        material.lightmapTexture.level = 0.5;


        material.emissiveColor = color;
        material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
        material.emissiveFresnelParameters.bias = 0.5;
        material.emissiveFresnelParameters.power = 2;
        material.emissiveFresnelParameters.leftColor = color;
        material.emissiveFresnelParameters.rightColor = blackColor;
        material.useEmissiveAsIllumination = true;
        material.specularTexture = specular;
        material.specularPower = 1000;


        console.log(material);
        return material;
    }

    planet.material = createStandartMaterial();

    var cloud = createCloud();
    var dir = 1;
    var step = 0.01;
    _scene.onBeforeRenderObservable.add(function () {
        cloud.rotation.y += 0.0005;
        planet.rotation.y -= 0.0005;
        var light = planet.material.lightmapTexture;
        var cloudEmissive = cloud.material.emissiveTexture;
        if (light.level > 2 || light.level < 0.5) dir = -dir;
        light.level += step * dir;
    });

    return planet;
}

function createScene() {
    _scene = new BABYLON.Scene(engine);
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
    var planet = createPlanet(star);
    _camera.target = planet;
    _camera.radius = 100;
    return _scene;
};