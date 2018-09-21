EM.GameCamera.Camera.lowerRadiusLimit = 0.1;
var cloudMesh = EM.GetMesh("402_space_cloud_3.402_space_cloud");
//cloudMesh.isVisible = false;
var cm = cloudMesh.material;
var planstMesh = EM.GetMesh("402_space_3.402_space");
var pm = planstMesh.material;

var ef = pm.emissiveFresnelParameters;
//var ef = new BABYLON.FresnelParameters();  
//pm.emissiveFresnelParameters = ef;

//var ec = pm.emissiveColor;
//var ef = pm.emissiveColor;
var df = pm.diffuseFresnelParameters;

m.alphaMode = BABYLON.Engine.ALPHA_COMBINE;   //2
cm.alphaMode = BABYLON.Engine.ALPHA_SUBTRACT; // 3
cm.alphaMode = Engine.ALPHA_MULTIPLY;//4;


 
var gm = EM.GetMaterial("planets.403_ground");
gm.bumpTexture = new BABYLON.Texture(url, EM.Scene);  

var $g = Utils.DatGuid;
var to = $g.SUPORTED_TEXTURES;
var mat = $g.getOrAddMaterialFolder("planets.403_ground", true);
var bUrl = "https://eternplaypublic.blob.core.windows.net/babylon-assets/game_objects/v.1.403.test.1/planet/403/403_ground_bump";
var bumpUrl = bUrl+".jpg";  
var paralaxUrl = bUrl + ".png";
var bumpOpts = $g.createTextureOptions(to.Bump, bumpUrl, 1);
$g.createTextureView(mat, bumpOpts);
var paralaxOpts = $g.createParalaxOptions(bumpUrl, paralaxUrl);
$g.createParalaxView(mat, paralaxOpts);  
$g.createColor3Views(mat);
$g.createFresnelAllViews(mat);


var matId = "planets.403_ground";   
var bUrl = "https://eternplaypublic.blob.core.windows.net/babylon-assets/game_objects/v.1.403.test.1/planet/403/403_ground_bump";  
var paralaxUrl = bUrl + ".png";
var $g = Utils.DatGuid;
var opts = $g.createAllMaterialOption(matId);
opts.bumpUrl = bUrl + ".jpg";
opts.paralaxUrl = bUrl + ".png";
$g.createAllMaterialViews(opts);

var matId = "planets.403_ground";   
var bUrl = "https://eternplaypublic.blob.core.windows.net/babylon-assets/game_objects/v.1.403.test.1/planet/403/403_ground_bump"; 
Utils.DatGuid.createMaterialOptionsFromMaterial(matId, {
    paralaxUrl: bUrl + ".png"
});

var m = EM.GetMesh("403_space_4.403_space");
Utils.DatGuid.createMaterialOptionsFromMaterial(m.material);
EM.GameCamera.Camera.lowerRadiusLimit = 0;


Utils.DatGuid.createMaterialOptionsFromMaterial("planets.403_space_cloud_4_cloneMaterial");



//gui
//http://doc.babylonjs.com/overviews/gui

var plane = BABYLON.Mesh.CreatePlane("plane", 2);
var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);
var image = new BABYLON.GUI.Image("but", "https://eternplaypublic.blob.core.windows.net/art/001_fleet.jpg");
advancedTexture.addControl(image);

 


var m = new BABYLON.StandardMaterial("t1", EM.Scene);     
m.diffuseTexture = new BABYLON.Texture("https://eternplaypublic.blob.core.windows.net/art/001_fleet.jpg",EM.Scene);  
m.emissiveTexture = new BABYLON.Texture("https://eternplaypublic.blob.core.windows.net/art/001_fleet.jpg",EM.Scene);

EM.ShowDebug(true);
function create() {
    var id = Utils.Guid.CreateQuickGuid();
    var mat = new BABYLON.StandardMaterial(id, EM.Scene);
    mat.diffuseTexture = new BABYLON.Texture("https://eternplaypublic.blob.core.windows.net/art/001_fleet.jpg", EM.Scene);
    mat.emissiveTexture = new BABYLON.Texture("https://eternplaypublic.blob.core.windows.net/art/001_fleet.jpg", EM.Scene);
    return mat;

}

function dispose(material) {
    material.dispose(true,true);
} 
 