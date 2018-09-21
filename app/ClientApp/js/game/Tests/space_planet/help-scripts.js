window.CreateHelp = function () {
    this.createEnveropment = function (Enveropment) {
        var universeBoxMeshId = "Universe";
        var universeMaterialId = "UniverseMaterial";
        var nibulaBoxMaterialId = "NibulaBoxMaterial";
        var nibulaBoxMeshId = "NibulaBoxMaterial";
        var activeWorldMeshId = "ActiveWorldMeshId";
        var activeWorldmaterialId = "ActiveWorldmaterialId.Universe";
        //  var enverotmentDir = "/Content/Materiales/map/env/";
        var orderedNames = ["back.jpg", "top.jpg", "right.jpg", "front.jpg", "bottom.jpg", "left.jpg"];



        Enveropment.UniverseBoxMeshId = universeBoxMeshId;
        Enveropment.UniverseMaterialId = universeMaterialId;
        Enveropment.NibulaBoxMaterialId = nibulaBoxMaterialId;
        Enveropment.NibulaBoxMeshId = nibulaBoxMeshId;
        Enveropment.ActiveWorldMeshId = activeWorldMeshId + "." + universeBoxMeshId;
        Enveropment.ActiveWorldmaterialId = activeWorldmaterialId;

        Enveropment.Create = function (_scene, envDir) {
            var baseDir = Enveropment.Directory = envDir;
            function createSkayBoxMaterial(materialName, dir, fileNames, alpha, reflection) {
                var material = new BABYLON.StandardMaterial(materialName, _scene);
                material.backFaceCulling = false;
                material.reflectionTexture = new BABYLON.CubeTexture(dir, _scene, fileNames);

                material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

                material.disableLighting = true;
                material.reflectionTexture.level = (typeof reflection === "number") ? reflection : 2;
                material.alpha = alpha || 1;
                material.alphaMode = BABYLON.Engine.ALPHA_ADD;
                return material;
            }

            function createUniverse() {
                var universe = BABYLON.Mesh.CreateSphere(universeBoxMeshId, 32, 1.8e6, _scene);
                //            var universe = BABYLON.Mesh.CreateBox(self.UniverseBoxMeshId, 1.8e6, scene);
                var universeDir = baseDir + "universe/";
                var uf = "universe.jpg";
                var universeNames = [uf, uf, uf, uf, uf, uf];
                universe.material = createSkayBoxMaterial(universeMaterialId, universeDir, universeNames, 0.999999, 0);
                universe.material.emissiveTexture = new BABYLON.Texture(universeDir + uf, _scene);
                universe.material.emissiveTexture.level = 1.5;
                universe.material.emissiveTexture.useEmissiveAsIllumination = true;
                universe.setEnabled(1);
                return universe;
            }

            function createNibulaBox() {
                /**
                 * Top.jpg -  по часовйо +90
                 * Bottom.jpg  против часовой -90
                 * последовательность  "Back.jpg", "Top.jpg", "Right.jpg", "Front.jpg", "Bottom.jpg", "Left.jpg"
                 */
                //            var nibulaBox = new BABYLON.Mesh.CreateBox(self.NibulaBoxMeshId, 1.3e6, scene);
                var nibulaBox = new BABYLON.Mesh.CreateSphere(nibulaBoxMeshId, 32, 1.3e6, _scene);
                var nibulaBoxDir = baseDir + "nibulabox/";
                var nibulaBoxMaterial = createSkayBoxMaterial(nibulaBoxMaterialId, nibulaBoxDir, orderedNames, 0.9999, 1.2);


                nibulaBoxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                nibulaBoxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                nibulaBox.material = nibulaBoxMaterial;

                //            nibulaBox.setEnabled(1);


                nibulaBox.rotation.z = Math.PI / 4;
                nibulaBox.rotation.x = Math.PI / 6;


                //            nibulaBox.rotation.z = Math.PI / 2;
                //            nibulaBox.rotation.x = Math.PI / 4;


                //            nibulaBox.rotation.x = Math.PI / 8;
                //            nibulaBox.rotation.y = Math.PI / 8;
                //            nibulaBox.rotation.z -= Math.PI / 2;
                //            nibulaBox.rotation.x = Math.PI /4;
            }

            function activeZone() {
                var zone = _scene.getMeshByID(activeWorldMeshId);
                var scale = 0.3;
                zone.scaling = new BABYLON.Vector3(scale, scale, scale);
                var rotation = -1;
                zone.rotation = new BABYLON.Vector3(rotation, rotation, rotation);

            }

            // test multy material (skaybox)

            // EM.Particle.Init();
            createUniverse();
            createNibulaBox();
            //    activeZone();


        };


        Enveropment.OrderedNames = orderedNames;
        Enveropment.SetVisibleMesh = function (mesh, show) {
            function setVisible(_mesh, _show) {
                _mesh.isPickable = _show;
                _mesh.isVisible = _show;
                _mesh.setEnabled((_show) ? 1 : 0);
            }

            setVisible(mesh, show);

            var children = mesh.getChildMeshes();
            for (var i = 0; i < children.length; i++) {
                setVisible(children[i], show);
            }
        }


    }
    this.createCamera = function (scene, canvas) {
        var defaultTarget = new BABYLON.Vector3.Zero();
        //#region CameraStateConfigs
        var pi = _.round(Math.PI, 4);
        var fakePi = 3;
        var fakeZero = 0.1;

        function createCameraConfig(upperRadiusLimit, lowerRadiusLimit, minZ, radius, wheelPrecision, lowerBetaLimit, upperBetaLimit, fov) {
            var sens = 1;

            return {

                //required dynamic state
                target: null,
                //required state config
                radius: radius || 10,
                //required state config
                minZ: minZ || 0,

                maxZ: 3e6,
                //optional
                wheelPrecision: wheelPrecision || 0.01,
                //default
                alpha: 0.4,
                //default
                beta: 1.2,
                //required state config
                lowerBetaLimit: lowerBetaLimit || fakeZero,
                //required state config
                upperBetaLimit: upperBetaLimit || fakePi,
                //required state config
                lowerRadiusLimit: lowerRadiusLimit || 1,
                //required state config
                upperRadiusLimit: upperRadiusLimit || 0,

                lowerAlphaLimit: 0,
                upperAlphaLimit: 0,
                lockedTarget: null,
                zoomOnFactor: 1,
                //required
                position: null,
                fov: fov || 1,
                speed: 100,
                panningSensibility: 0,
                keysLeft: [39, 68],
                keysDown: [40, 83],
                keysRight: [37, 65],
                keysUp: [38, 87],
                angularSensibilityX: sens,
                angularSensibilityY: sens,
                setTarget: function (vector3Target) {
                    //console.log("vector3Target", typeof vector3Target);
                    if (vector3Target) this.target = vector3Target;
                    else {
                        if (SHOW_DEBUG) {
                            console.log("target not set, seted default");
                        }
                        this.target = _.cloneDeep(defaultTarget);
                    };

                },
                setPosition: function (vectorPosition) {
                    if (vectorPosition) this.position = vectorPosition;
                    else this.position = null;
                }
            };

        }

        var system = createCameraConfig();
        system.upperRadiusLimit = 1e3;
        system.lowerRadiusLimit = 1;
        system.minZ = 1;
        system.wheelPrecision = 50;
        system.speed = 1;
        system.fov = 0.9;

        var config = system;
        config.target = _.cloneDeep(defaultTarget);
        var camera = new BABYLON.ArcRotateCamera("GameCamera", config.alpha, config.beta, config.radius, config.target, scene);
        camera.attachControl(canvas, true, false);
        function setNewConfigToActiveCamera(activeCamera, configCamera) {
            //console.log("setNewConfigToActiveCamera", {
            //    activeCamera: activeCamera,
            //    configCamera: configCamera
            //});
            activeCamera.target = configCamera.target;
            activeCamera.alpha = configCamera.alpha;
            activeCamera.beta = configCamera.beta;
            activeCamera.radius = configCamera.radius;
            activeCamera.lowerRadiusLimit = configCamera.lowerRadiusLimit;
            activeCamera.minZ = configCamera.minZ;
            activeCamera.maxZ = configCamera.maxZ;
            activeCamera.wheelPrecision = configCamera.wheelPrecision;
            activeCamera.upperRadiusLimit = configCamera.upperRadiusLimit;
            activeCamera.fov = configCamera.fov;
            activeCamera.lowerBetaLimit = configCamera.lowerBetaLimit;
            activeCamera.upperBetaLimit = configCamera.upperBetaLimit;

            activeCamera.lowerAlphaLimit = configCamera.lowerAlphaLimit;
            activeCamera.upperAlphaLimit = configCamera.upperAlphaLimit;

            activeCamera.lockedTarget = configCamera.lockedTarget;
            activeCamera.zoomOnFactor = configCamera.zoomOnFactor;

            if (configCamera.position) activeCamera.position = configCamera.position;
        }

        setNewConfigToActiveCamera(camera, config);
        return camera;

    }

    this.getMesh = function (scene) {
        var _scene = scene;
        return function (meshId) {
            return _scene.getMeshByID(meshId);
        }
    }
    this.getMaterial = function (scene) {
        var _scene = scene;
        return function (meshId) {
            return _scene.getMaterialByID(meshId);
        }
    }
    this.createTexture = function (scene) {
        var _scene = scene;
        return function (url) {
            return new BABYLON.Texture(url, _scene);
        };
    }
    this.createHl = function (scene, _getMesh) {
        var _scene = scene;
        var getMesh = _getMesh;
        return function () {
            var hl = {};
            hl._name = "hl1";
            hl.HighlightLayer = null;
            var created = false;


            function setBlur(h, w) {
                hl.HighlightLayer.blurHorizontalSize = h;
                hl.HighlightLayer.blurVerticalSize = w ? w : h;
            }

            function create(h, w) {
                //        console.log("created", created);
                if (!created) {
                    hl.HighlightLayer = new BABYLON.HighlightLayer(hl._name, _scene);
                    hl.HighlightLayer.innerGlow = true;
                    setBlur((h ? h : 1), (w ? w : 0.5));
                    created = true;
                }
            }

            function updateMeshColor(meshId, color3Int) {
                hl.HighlightLayer._meshes[meshId].color = BABYLON.Color4.FromInts(color3Int.r, color3Int.g, color3Int.b, 255);
            }

            function hasMeshInInstance(mesh) {
                var meshes = hl.HighlightLayer._meshes;
                return meshes.hasOwnProperty(mesh.id) && meshes[mesh.id];

            }

            function addMesh(mesh, color3Int) {
                if (hasMeshInInstance(addMesh) && color3Int) {
                    console.log("exist!!");
                    updateMeshColor(mesh.id, color3Int);
                } else {
                    var observer = mesh.onDisposeObservable.add(function (observerMesh, mask, insertFirst) {
                        if (observerMesh.id === mesh.id) {
                            hl.HighlightLayer.removeMesh(mesh);
                            observerMesh.onBeforeRenderObservable.remove(observer);
                        }

                    });
                    hl.HighlightLayer.addMesh(mesh, (color3Int ? BABYLON.Color4.FromInts(color3Int.r, color3Int.g, color3Int.b, 255) : new BABYLON.Color4(1, 1, 1, 1)));
                }


            }

            function addMeshById(meshId, color3Int) {
                addMesh(getMesh(meshId), color3Int);
            }

            function cleanAll() {
                _.forEach(hl.HighlightLayer._meshes, function (mesh, meshKey) {
                    hl.HighlightLayer.removeMesh(getMesh(meshKey));
                });
            }

            /**
             * Ищет в сцене меш по имени элемента и удаляет его из инста эфекта: ["meshId1","meshId2"]
             * @param {array} list  array<string>
             * @returns {void}  void
             */
            function removeByListNames(list) {
                _.forEach(list, function (meshName, meshKey) {
                    hl.HighlightLayer.removeMesh(getMesh(meshName));
                });
            }

            hl.SetBlur = setBlur;
            hl.Create = create;
            hl.AddMesh = addMesh;
            hl.AddMeshById = addMeshById;
            hl.RemoveByListNames = removeByListNames;
            hl.CleanAll = cleanAll;
            hl.UpdateMeshColor = updateMeshColor;
            return hl;

        }
    }

}

