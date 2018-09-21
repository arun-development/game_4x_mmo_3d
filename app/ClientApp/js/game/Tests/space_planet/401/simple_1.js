var cat = "https://eternplaypublic.blob.core.windows.net/babylon-assets/game_objects/v.1.401.test.6/planet/401/";
var diffUrl = cat+"401_space_diffuse.jpg";
var bumpUrl = cat+"401_ground_diffuse.jpg";
var lightUrl = cat+"401_space_light.jpg";
var specUrl =cat+ "401_space_specular.jpg";
var emColor = BABYLON.Color3.FromInts(197, 172, 163);
var blackColor = BABYLON.Color3.Black();
function createTexture(url, scene) {
    return new BABYLON.Texture(url, scene);
}
function createPlanetMaterial(material, scene) {
    material.diffuseTexture = createTexture(diffUrl, scene);    
    material.diffuseTexture.level = 2;

    material.bumpTexture = createTexture(bumpUrl, scene);

    material.lightmapTexture = createTexture(lightUrl, scene);
    material.lightmapTexture.level = 0.5;
    material.specularTexture = createTexture(specUrl, scene);
    material.specularPower = 1000;

    //freesnel
    material.emissiveColor = emColor;
    material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
    material.emissiveFresnelParameters.bias = 0.5;
    material.emissiveFresnelParameters.power = 2;
    material.emissiveFresnelParameters.leftColor = emColor;
    material.emissiveFresnelParameters.rightColor = blackColor;
    material.useEmissiveAsIllumination = true;
}


var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 10, BABYLON.Vector3.Zero(), scene);
    camera.wheelPrecision = 50;
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;


    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    var planet = BABYLON.Mesh.CreateSphere("planet", 16, 2, scene);
    var material = new BABYLON.StandardMaterial("planetMaterial", scene);
    createPlanetMaterial(material, scene);
    planet.material = material;
    return scene;

};