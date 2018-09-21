EM.Particle = {};

//base
(function (Particle) {
    Particle.GetByParticleById = function (particleId) {
        return EM.Scene.getParticleSystemByID(particleId);
    };
    Particle._checkParticleInScene = function (particleId) {
        return !! Particle.GetByParticleById(particleId);
    };
})(EM.Particle);


//sector particles 
(function (Particle) {
    Particle._sectorParticle = {
        sps: null,
        observer: null
    };

    function register() {
        if (Particle._sectorParticle.observer) return;
        Particle._sectorParticle.observer = EM.Scene.onBeforeRenderObservable.add(function () {
            Particle._sectorParticle.sps.setParticles();
        });
        //console.log("Particle._sectorParticle.observer",{
        //        "Particle._sectorParticle.observer": Particle._sectorParticle.observer
        //    });
    }
    function unRegister() {
        if (Particle._sectorParticle.observer) {
            EM.Scene.onBeforeRenderObservable.remove(Particle._sectorParticle.observer);
            Particle._sectorParticle.observer = null;
        }
    }

    function _createParticles() {
        var scale = 1000;
        //var nb = 5 * scale; // nb of triangles
        var nb =2 * scale; // nb of triangles
        //var fact = 700 * scale; // cube size 
        var fact = 500 * scale; // cube size 

        function _randomColor() {
            return BABYLON.Color3.White();
            var min = 1.0;
            var max = 1.0;
            return new BABYLON.Color3(_.random(min, max),
                                      _.random(min, max),
                                      _.random(min, max));
        }

        var myPositionFunction = function (particle, i, s) {
            particle.position.x = (Math.random() - 0.5) * fact;
            particle.position.y = (Math.random() - 0.5) * fact;
            particle.position.z = (Math.random() - 0.5) * fact;
            particle.rotation.z = Math.random() * 3.15;
            particle.color = _randomColor();
        };
        var plane = BABYLON.Mesh.CreatePlane("fake_star_particle_model", 0.2* scale, EM.Scene);
        //var plane = BABYLON.Mesh.CreatePlane("fake_star_particle_model", 0.9* scale, EM.Scene);

        var SPS = new BABYLON.SolidParticleSystem("fake_star_particle_system", EM.Scene, { updatable: false });
        SPS.addShape(plane, nb, { positionFunction: myPositionFunction });
        var mesh = SPS.buildMesh();
        mesh.material = new BABYLON.StandardMaterial("fake_star_particle_material", EM.Scene);
        mesh.material.disableLighting = true;
        mesh.material.backFaceCulling = false;
        mesh.isVisible = false;
        mesh.material.emissiveTexture = EM.CreateTexture(Particle.$getLaserFireTextureUrl());
        mesh.material.emissiveTexture.level = 50.0;
        mesh.material.alphaMode = BABYLON.Engine.ALPHA_ADD;
        mesh.material.alpha = 0.8;
        //mesh.material.freeze();
        mesh.freezeWorldMatrix();
        mesh.isPickable = false;
        SPS.billboard = true;
        plane.dispose();

        Particle._sectorParticle.sps = SPS;
        return Particle._sectorParticle.sps;
    };

    Particle.ShowOrHideSectorParticles = function (show) {
        var sps = Particle.GetOrCreateSectorParticles();
        sps.mesh.isVisible = show;
        if (show) {
            register();
      
        } else {
            unRegister();
        }

    };

    Particle.GetOrCreateSectorParticles = function () {
        if (Particle._sectorParticle.sps) {
            return Particle._sectorParticle.sps;
        }
        return _createParticles();

    };

    var _laser_fire_texuteUrl = null;
    Particle.$getLaserFireTextureUrl = function () {
        if (!_laser_fire_texuteUrl) {
            _laser_fire_texuteUrl = Utils.CdnManager.GetCommonTextureUrl("laser_fire.jpg", true);

        }
        return _laser_fire_texuteUrl;
    };

})(EM.Particle);

//#region saturnRings
(function (Particle) {
    var saturnRings = {};

    var rockMaterialName = "rock_material";

    function createRockMaterial() {
        //var catalog = "https://eternplaypublic.blob.core.windows.net/particle/saturn_ring_e_rock/";
        var catalog = "/content/babylon-assets/babylon_materiales/";
        var bumpUrl = catalog + "rockn.png";
        var diffuseUrl = catalog + "rock.png";
        var material = new BABYLON.StandardMaterial(rockMaterialName, EM.Scene);
        material.emissiveColor = new BABYLON.Color3(0, 0.15, 0.3);
        material.emissiveTexture = new BABYLON.Texture(diffuseUrl, EM.Scene);
        material.emissiveTexture.level = 1.5;
        material.backFaceCulling = false;
        material.disableLighting = true;
        material.useLogarithmicDepth = true;
        return material;

    };

    function getRockMaterial() {
        var m = EM.GetMaterial(rockMaterialName);
        if (m) return m;
        return createRockMaterial();
    };

    function setScale(mesh, scale) {
        mesh.scaling = new BABYLON.Vector3(scale, scale, scale);
    };

    var spsPrefix = "sps_";
    function createSpsName(parentId) {
        return spsPrefix + parentId;
    };
    function getSpsByParentId(parentId) {
        Particle.GetByParticleById(createSpsName(parentId));
    };



    function createRings(parentMesh, radius, particleCounts) {

        var sps = getSpsByParentId(parentMesh.id);
        if (sps) return sps;

        var particleCount = (particleCounts ? particleCounts : 500);
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

        var _pYdev = radius / 20;

        var _pMin = 1.05 * radius;
        var _pMax = 1.13 * _pMin;
        var _angle = twoPi / particleCount;
        var _sMin = 0.001;
        var _sMax = 0.015;


        function myPositionFunction(particle, i, s) {
            var x = _.random(_pMin, _pMax) * Math.sin(_angle * i);
            var z = _.random(_pMin, _pMax) * Math.cos(_angle * i);
            particle.position = new BABYLON.Vector3(x, (_.random(-_pYdev, _pYdev)), z);
            particle.scale = new BABYLON.Vector3(_.random(_sMin, _sMax, true), _.random(_sMin, _sMax, true), _.random(_sMin, _sMax, true));
            particle.rotation = new BABYLON.Vector3(Math.random() * pi, Math.random() * pi, Math.random() * pi);
        };



        var rockModel = BABYLON.MeshBuilder.CreateSphere(parentId, { segments: 1, diameter: radius }, EM.Scene);
        // var rockModel = BABYLON.MeshBuilder.CreatePolyhedron("oct", { type: 0, size: radius }, EM.Scene);

        sps = new BABYLON.SolidParticleSystem(createSpsName(parentId), EM.Scene, { updatable: false, boundingSphereOnly: true });
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
                clone.rotation.y = i * pi / 64 * _.random(-1, 1);
                if (scale) setScale(clone, scale);
                if (changedY) clone.position.y += changedY;
                i++;
                clone.visibility = _.random(0.5, 1);
                return clone;
            }

            var firstRing = createCloneItem("firstRing", 0.7);

            // var middleUp = createCloneItem("middleUp", 0.86, -offsetY);
            var middleUp = createCloneItem("middleUp", 1.4, -offsetY);

            //var middleDowun = createCloneItem("middleDowun", 1.14, offsetY);
            var middleDowun = createCloneItem("middleDowun", 1.9, offsetY);

            var lastY = offsetY * 0.3;
            // var lastRingUp = createCloneItem("lastRingUp", 1.3, lastY);
            var lastRingUp = createCloneItem("lastRingUp", 2.5, lastY);
            //var lastRingDown = createCloneItem("lastRingDown", 1.5, -lastY);
            var lastRingDown = createCloneItem("lastRingDown", 3, -lastY);

            sps.vars.startRingRotation = function () {
                sps.vars.rY = 0.0;
                var observer = EM.Scene.onBeforeRenderObservable.add(function () {
                    var rY = sps.vars.rY;
                    spsMesh.rotation.y = rY;

                    middleUp.rotation.y = -rY / 2;
                    middleDowun.rotation.y = rY / 3;

                    firstRing.rotation.y = -rY * 3;

                    lastRingUp.rotation.y = -1.5 * rY;
                    lastRingDown.rotation.y = 0.8 * rY;
                    sps.vars.rY += 0.0001;
                    if (sps.vars.rY >= twoPi) sps.vars.rY = 0.0;
                });
                sps.mesh.parent.onDisposeObservable.add(function () {
                    EM.Scene.onBeforeRenderObservable.remove(observer);
                    i = 0;
                    lastY = 0;

                    firstRing.dispose();
                    firstRing = null;

                    middleUp.dispose();
                    middleUp = null;

                    middleDowun.dispose();
                    middleDowun = null;

                    lastRingUp.dispose();
                    lastRingUp = null;

                    lastRingDown.dispose();
                    lastRingDown = null;

         
                    sps.dispose();
                    sps = null;
                   // console.log("onDisposeObservable");
       


                });
            };
        }
        createClones(_pYdev);
        return sps;
    }

    saturnRings.createRings = createRings;
    saturnRings.getSpsByParentId = getSpsByParentId;
    Particle.SaturnRings = saturnRings;
})(EM.Particle);
//#endregion


