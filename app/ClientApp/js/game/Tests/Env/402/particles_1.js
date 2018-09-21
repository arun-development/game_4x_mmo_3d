(function () {
    var lodash = $("#lodash-lib");
    if (!lodash.length) $("head").append("<script id='lodash-lib' src='https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.0/lodash.min.js'></script>");
})();


function particl(pMesh) {
    console.log("particl", pMesh);
    window._t = pMesh;
    var inst = pMesh.instances;

    var count = 0;
    var i = 0;
    var height = 3;
    scene.registerBeforeRender(function () {

        _.forEach(inst, function (particle, idx) {
            var ix = particle.position.x;
            var iy = particle.position.y;
            particle.position.y = (Math.sin((ix + count) * 0.3) * height) + (Math.sin((iy + count) * 0.3)) + 7;
            particle.scaling.z = particle.scaling.x = particle.scaling.y = Math.sin(ix + count / 10);
            particle.rotation.x = Math.sin((ix + count) * 0.3);
            count += 0.0001;
        });




    });
    setInterval(function () {


    }, 40);

}


function importScene(scene) {
    var cat = "https://eternplaypublic.blob.core.windows.net/babylon/env_402/";
    var fileName = "planets.babylon";

    BABYLON.SceneLoader.ImportMesh("", cat, fileName, scene, function (loadedMeshesGroup, particleSystems, skeletons) {
        particl(loadedMeshesGroup[0]);
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