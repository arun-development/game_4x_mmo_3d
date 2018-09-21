// example 1 http://www.babylonjs-playground.com/#1KQUCO#0
// color and uvs https://doc.babylonjs.com/overviews/Solid_Particle_System#colors-and-uvs
// sps https://doc.babylonjs.com/overviews/Solid_Particle_System#create-an-immutable-sps
// last job http://www.babylonjs-playground.com/#2HZJTW#18
//https://drive.google.com/file/d/0BwgSQ10AzF7nYUppczYyX2RjUTA/view?usp=sharing
var scene, camera;
(function () {
    var lodash = $("#lodash-lib");
    if (!lodash.length) $("head").append("<script id='lodash-lib' src='https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.0/lodash.min.js'></script>");
})();

// Materials
// heightMap
var createScene = function () {
    scene = new BABYLON.Scene(engine);
    scene.clearColor = BABYLON.Color3.Black();

    camera = new BABYLON.ArcRotateCamera("Camera", 1.2, 0.4, 200, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, false);

    var light1 = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 50, 10), scene);
    //light1.diffuseColor = new BABYLON.Color3(0, 10, 10);

    var parentName = "saturne";
    var parentRadius = 20;



    var saturne = BABYLON.Mesh.CreateSphere(parentName, 8, parentRadius, scene);
    saturne.position = new BABYLON.Vector3(3, 2, 1);

    function setBlur(h, w) {
        hl.blurHorizontalSize = h;
        hl.blurVerticalSize = (w ? w : h);
    };
    var rockMaterialName = "rock_material";

    function createRockMaterial() {
        var catalog = "https://eternplaypublic.blob.core.windows.net/particle/saturn_ring_e_rock/";
        var bumpUrl = catalog + "bump_e_rock.jpg";
        var diffuseUrl = catalog + "diffuse_e_rock.jpg";
        var reflectionUrl = catalog + "reflection_e_rock.jpg";

        var endColor = BABYLON.Color3.FromHexString("#7d9bbd");
        var material = new BABYLON.StandardMaterial("rock_material", scene);
        material.useParallax = true;
        material.useParallaxOcclusion = true;
        material.parallaxScaleBias = 0.15;

        material.specularColor = endColor;
        material.specularPower = 20;

        material.diffuseTexture = new BABYLON.Texture(diffuseUrl, scene);
        material.bumpTexture = new BABYLON.Texture(bumpUrl, scene);
        material.reflectionTexture = new BABYLON.Texture(reflectionUrl, scene);
        material.reflectionTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE;
        material.reflectionTexture.level = 0.6;

        material.diffuseFresnelParameters = new BABYLON.FresnelParameters();
        material.diffuseFresnelParameters.leftColor = BABYLON.Color3.Black();
        material.diffuseFresnelParameters.rightColor = endColor;
        material.backFaceCulling = false;
        return material;

    };

    function getRockMaterial() {
        var m = scene.getMaterialByID(rockMaterialName);
        if (m) return m;
        return createRockMaterial();
    };

    function setScale(mesh, scale, scaleY) {
        mesh.scaling = new BABYLON.Vector3(scale, scale, scale);
    };

    var spsPrefix = "sps_";
    function getSpsByParentId(parentId) {
        scene.getParticleSystemByID(spsPrefix + parentId);
    };

    function createSpsName(parentId) {
        return spsPrefix + parentId;
    };

    function createRings(parentMesh, radius) {
        var sps = getSpsByParentId(parentMesh.id);
        if (sps) return sps;

        var particleCount = 1000;
        var pi = _.round(Math.PI, 2);
        var twoPi = pi * 2;
        var parentId = parentMesh.id;


        function myVertexFunction(particle, vertex, i) {
            var max = 1;
            var min = 0.6;
            vertex.x *= _.random(min, max, true);
            vertex.y *= _.random(min, max, true);
            vertex.z *= _.random(min, max, true);
        };

        var _pY = parentMesh.position.y;
        var _pYdev = radius / 20;

        var _pMin = 2 * radius;
        var _pMax = 1.14 * _pMin;
        var _angle = twoPi / particleCount;
        var _sMin = 0.001;
        var _sMax = 0.03;


        function myPositionFunction(particle, i, s) {
            var x = _.random(_pMin, _pMax) * Math.sin(_angle * i);
            var z = _.random(_pMin, _pMax) * Math.cos(_angle * i);
            particle.position = new BABYLON.Vector3(x, (_.random(-_pYdev, _pYdev)), z);
            particle.scale = new BABYLON.Vector3(_.random(_sMin, _sMax, true), _.random(_sMin, _sMax, true), _.random(_sMin, _sMax, true));
            particle.rotation = new BABYLON.Vector3(Math.random() * pi, Math.random() * pi, Math.random() * pi);
        };

        var rockModel = BABYLON.MeshBuilder.CreateSphere(parentId, { segments: 1, diameter: radius }, scene);

        sps = new BABYLON.SolidParticleSystem(createSpsName(parentId), scene, { updatable: false, boundingSphereOnly: true });
        sps.addShape(rockModel, particleCount, { positionFunction: myPositionFunction, vertexFunction: myVertexFunction });
        sps.buildMesh();
        rockModel.dispose();

        sps.mesh.parent = parentMesh;
        sps.mesh.material = getRockMaterial();
        sps.mesh.material.useAlphaFromDiffuseTexture = true;
        sps.mesh.rotation.y = 90;

        function createClones(offsetY) {
            var spsMesh = sps.mesh;
            var i = 0;
            function createCloneItem(cloneName, scale, changedY) {
                var clone = spsMesh.clone(cloneName);
                console.log(clone.id);
                clone.rotation.y = i * pi / 64 * _.random(-1, 1);
                if (scale) setScale(clone, scale);
                if (changedY) clone.position.y += changedY;
                i++;
                return clone;
            }

            var firstRing = createCloneItem("firstRing", 0.74);

            var middleUp = createCloneItem("middleUp", 0.86, -offsetY);

            var middleDowun = createCloneItem("middleDowun", 1.14, offsetY);

            var lastY = offsetY * 0.3;
            var lastRingUp = createCloneItem("lastRingUp", 1.3, lastY);
            var lastRingDown = createCloneItem("lastRingDown", 1.5, -lastY);


            sps.vars.startRingRotation = function () {
                var rY = 0.0;
                function registerBeforeRender() {
                    spsMesh.rotation.y = rY;

                    middleUp.rotation.y = -rY / 2;
                    middleDowun.rotation.y = rY / 3;

                    firstRing.rotation.y = -rY * 3;

                    lastRingUp.rotation.y = -1.5 * rY;
                    lastRingDown.rotation.y = 0.8 * rY;

                    rY += 0.0001;
                    if (rY >= twoPi) rY = 0.0;
                    if (!scene.getMeshByID(spsMesh.id)) {
                        sps.dispose();
                        sps = null;
                        scene.unregisterBeforeRender(registerBeforeRender)
                    };

                };
                scene.registerBeforeRender(registerBeforeRender);
            };

        }
        createClones(_pYdev);
        return sps;
    }

    var spsRings = createRings(saturne, parentRadius);
    spsRings.vars.startRingRotation();

    saturne.material = spsRings.mesh.material;
    setTimeout(function () {
        // saturne.position.y = 100;
        // saturne.dispose();

    }, 2000);

    return scene;
};