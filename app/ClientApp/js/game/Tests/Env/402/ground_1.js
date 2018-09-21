(function () {
    var lodash = $("#lodash-lib");
    if (!lodash.length) $("head").append("<script id='lodash-lib' src='https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.0/lodash.min.js'></script>");
})();


function fixFixGroundMaterial(groundMesh) {
    var material = groundMesh.material;
    var bump = material.bumpTexture;          
    var diffuseTexture = material.diffuseTexture;

    var configObject = {
        renderMode: ['Parallax Occlusion', 'Parallax', 'Bump'],

        bumpLevel: 1,
        parallaxScaleBias: 0.01,
        specularPower: 50,
        dScale: 1,
        sR: 1,
        sG: 1,
        sB: 1,

    };
    material.useParallax = false;
    material.useParallaxOcclusion = false;
    material.parallaxScaleBias = configObject.parallaxScaleBias;
    material.specularPower = configObject.specularPower;


    function setGuid() {
        var oldgui = document.querySelector("#datGUI");
        if (oldgui != null) oldgui.remove();
        var gui = new dat.GUI();
        gui.domElement.style.marginTop = "150px";
        gui.domElement.id = "datGUI";

        var f1 = gui.addFolder('ground');
        f1.add(configObject, "parallaxScaleBias", 0.01, 0.2).onChange(function (value) {
            material.parallaxScaleBias = value;
        });
        f1.add(configObject, "renderMode", ['Parallax Occlusion', 'Parallax', 'Bump']).onChange(function (value) {
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



        f1.add(configObject, "bumpLevel", 0.1, 10).onChange(function (value) {
            bump.level = value;
        });

        f1.add(configObject, "specularPower", 0.1, 100).onChange(function (value) {
            material.specularPower = value;
        });

        f1.add(configObject, "dScale", 0.001, 1).onChange(function (value) {
            bump.vScale = bump.uScale = diffuseTexture.vScale = diffuseTexture.uScale = value;

            material.specularPower = value;
        });


        f1.add(configObject, "sR", 0.001, 1).onChange(function (value) {
            material.specularColor.r = value;

        });
        f1.add(configObject, "sG", 0.001, 1).onChange(function (value) {
            material.specularColor.g = value;
        });
        f1.add(configObject, "sB", 0.001, 1).onChange(function (value) {
            material.specularColor.b = value;
        });


        //f1.add(configObject, "bumpTexuteUrl").onChange(function (value) {
        //    if (material.bumpTexture.url !== value) {
        //        bump = new BABYLON.Texture(value, EM.Scene);
        //        material.bumpTexture = bump;
        //        material.bumpTexture.level = configObject.bumpLevel;
        //    }

        //});


    }

    setGuid();
    console.log("material", material);
}


function importScene(scene) {
    var cat = "https://eternplaypublic.blob.core.windows.net/babylon/env_402/";

    var fileName = "planets_16_06.babylon";

    BABYLON.SceneLoader.ImportMesh("", cat, fileName, scene, function (loadedMeshesGroup, particleSystems, skeletons) {

        console.log("loadedMeshesGroup", loadedMeshesGroup);
        fixFixGroundMaterial(loadedMeshesGroup[0]);
    });

};


var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    // Setup a simple environment
    var light = new BABYLON.PointLight("StarLight", new BABYLON.Vector3(0, 100, 0), scene);
    // ArcRotateCamera >> Camera rotating around a 3D point (here Vector zero)
    // Parameters : name, alpha, beta, radius, target, scene
    var arcCamera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene);
    arcCamera.setPosition(new BABYLON.Vector3(0, 0, 50));
    arcCamera.target = new BABYLON.Vector3(3, 0, 0);



    scene.activeCamera = arcCamera;
    arcCamera.attachControl(canvas, true);

    importScene(scene);

    return scene;
}