//bace+ facnce

(function () {
    var lodash = $("#lodash-lib");
    if (!lodash.length) $("head").append("<script id='lodash-lib' src='https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.0/lodash.min.js'></script>");
})();
//https://www.babylonjs-playground.com/#UFULAQ#2

var _scene;
var cdnCatalog = "https://eternplaypublic.blob.core.windows.net/babylonjs-playground/base-core/assets3/";
var bFileName = "game_models";
var babylonFileName = bFileName + ".babylon";

function getMesh(meshId) {
    return _scene.getMeshByID(meshId);
}
function getMaterial(materialId) {
    return _scene.getMaterialByID(materialId);
}
function createFenceCylAnimations(fenceCylMeshes, fb) {
    var animations = [];
    var twoPi = 6.28;
    var direction = 1;
    var scale = 0.33;
    var fps = 16;
    var cell = 40;
    var baseSpeed = 1.76;
    var minSpeed = 1 * baseSpeed;
    var maxSpeed = 3 * baseSpeed;

    //effects
    var hlColor = new BABYLON.Color3(200, 125, 255);
    var bColor = BABYLON.Color4.FromInts(hlColor.r, hlColor.g, hlColor.b, 255);
    var hl = new BABYLON.HighlightLayer("fence_cyl_hl", _scene, { mainTextureRatio: 0.2 });
    //  hl.innerGlow = true;
    // hl.outerGlow = true;
    //  hl.blurHorizontalSize = 0.5;
    //   hl.blurVerticalSize =2;
    //  hl.addExcludedMesh(fb);
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
    //material.useAlphaFromDiffuseTexture = true;
    material.opacityTexture = material.diffuseTexture;
    material.opacityTexture.getAlphaFromRGB = true;
    material.useSpecularOverAlpha = false;
    //material.alphaMode = BABYLON.Engine.ALPHA_MAXIMIZED;
    //material.alpha = 0.5;
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

function fixFenceCyl(fenceMaterial) {
    fenceMaterial.backFaceCulling = false;
    setDiffToOpacyti(fenceMaterial);
    fenceMaterial.diffuseTexture.level = 1.5;
    console.log({ fenceMaterial: fenceMaterial });
    // fenceMaterial.useAlphaFromDiffuseTexture = true;
    // fenceMaterial.backFaceCulling = false;
    //  fenceMaterial.alphaMode = BABYLON.Engine.ALPHA_MAXIMIZED;
    //  fenceMaterial.alpha =0.99;
    //  fenceMaterial.useAl

}

function fixFence(loadedMeshesGroup) {
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
    fixFenceCyl(fence.cylinders[0].material);
    fixFenceBody(fence.body);
    createFenceCylAnimations(fence.cylinders, fence.body);

};

//for concole fast acc. data
window._fmat = function () {
    return getMaterial(bFileName + ".base_fence_cyl");
}
window._fBase = function () {
    return getMaterial(bFileName + ".base_fence_body");
}

function movieMother() {
    var motherParentId = "mother_parent";
    var mother = getMesh(motherParentId);
    mother.position = new BABYLON.Vector3(50, 10, 0);
}

function fixFloor() {
    var floorId = "base_floor_gexa";
    var gexa = getMesh(floorId);
    var material = gexa.material;
    var diffuse = material.diffuseTexture;
    var bump = material.bumpTexture;
    var specular = diffuse.clone("specular");

    var configObject = {
        parallaxScaleBias: 0.1,
        renderMode: "Parallax Occlusion",
        bumpLevel: 2,
        specularPower: 30,
        uvScale: 20,
        specularScale: 1
    }


    bump.getAlphaFromRGB = true;
    bump.level = configObject.bumpLevel;
    material.specularTexture = specular;
    material.specularPower = configObject.specularPower;

    function setScale(val) {
        diffuse.uScale = diffuse.vScale = bump.uScale = bump.vScale = val;
    }

    function setSpecularScale(val) {
        material.specularTexture.vScale = material.specularTexture.uScale = val;
    }

    setScale(configObject.uvScale);
   
    function setGuid() {
        var oldgui = document.querySelector("#datGUI");
        if (oldgui != null) oldgui.remove();
        var gui = new dat.GUI();
        gui.domElement.style.marginTop = "150px";
        gui.domElement.id = "datGUI";
        gui.add(configObject, "parallaxScaleBias", 0.01, 0.2).onChange(function (value) {
            material.parallaxScaleBias = value;
        });
        gui.add(configObject, "bumpLevel", 1, 10).onChange(function (value) {
            bump.level = value;
        });
        gui.add(configObject, "specularPower", 1, 100).onChange(function (value) {
            material.specularPower = value;
        });
        gui.add(configObject, "uvScale", 1, 30).onChange(function (value) {
            setScale(value);
        });
        gui.add(configObject, "specularScale", 1, 30).onChange(function (value) {
            setSpecularScale(value);
        });
        gui.add(configObject, "renderMode", ['Parallax Occlusion', 'Parallax', 'Bump']).onChange(function (value) {
            switch (value) {
                case "Bump":
                    material.useParallax = false;
                    material.useParallaxOcclusion = false;
                    break;
                case "Parallax":
                    material.useParallax = true;
                    material.useParallaxOcclusion = false;
                    break;
                case "Parallax Occlusion":
                    material.useParallax = true;
                    material.useParallaxOcclusion = true;
                    break;
            }
        });

    }

    setGuid();
};

function loadMesh() {
    BABYLON.SceneLoader.ImportMesh("", cdnCatalog, babylonFileName, _scene, function (loadedMeshesGroup, particleSystems, skeletons) {
        movieMother();
        fixFloor();
        fixFence(loadedMeshesGroup);
        console.log(getMaterial(bFileName + ".base_bevel_2"));
    });
}

var createScene = function () {
    // var m= new BABYLON.StandardMaterial("qwe",_scene);

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