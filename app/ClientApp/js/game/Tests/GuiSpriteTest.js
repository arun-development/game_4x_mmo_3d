(function () {
    function add(domId, path) {
        var item = $("#" + domId);
        if (!item.length) $("head").append("<script id=" + domId + " src=" + path + "></script>");
    }

    add("lodash-lib", "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.0/lodash.min.js");
})();

var ids = [];

var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;


    var protoMesh = BABYLON.MeshBuilder.CreatePlane("_systemProtoMeshName", { width: 3, height: 1 }, scene);
    protoMesh.isVisible = false;
    protoMesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
    protoMesh.updatable = true;

    var spriteW = 2080;
    var items = 8;
    var itemSize = spriteW / items;
    var color = ""
    function getOffset(index) {
        return index * itemSize;
    }

    var baseColor = new BABYLON.Color4.FromInts(10, 86, 136, 150);
    var nameColor = baseColor.scale(1.5);
    var typeColor = nameColor.scale(0.8);
    var nameC = nameColor.toHexString();
    var tC = typeColor.toHexString();
    nameColor = "#719dba";
    typeColor = "#3f83c3";
    function createText(panel, name) {
        var fontFamily = "Electrolize sans-serif";
        // Adding text
        var textPanel = new BABYLON.GUI.StackPanel("textPanel");
        textPanel.width = "70%";
        textPanel.isVertical = true;
        textPanel.background = "red";
        // textPanel.left ="100px";
        textPanel.height = "80%";
        // textPanel.ascent = 5;

        console.log("textPanel", textPanel);

        textPanel.fontFamily = fontFamily;

        var tb1 = new BABYLON.GUI.TextBlock("text_block_name" + name, "WW-WW");
        tb1.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        tb1.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        tb1.height = "50%";
        tb1.color = nameColor;
        tb1.fontSize = "89px";

        textPanel.addControl(tb1);

        var tb2 = new BABYLON.GUI.TextBlock("text_block_type" + name, 'SYSTEM');
        tb2.textHorizontalAlignment = tb1.textHorizontalAlignment;
        tb2.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        // tb2.textVerticalAlignment = tb1.VERTICAL_ALIGNMENT_BOTTOM;
        tb2.height = "30%";
        tb2.color = typeColor;
        tb2.fontSize = "70px";
        textPanel.addControl(tb2);

        panel.addControl(textPanel);
    };

    function createButton(panel) {
        var spriteUtl = "https://eternplaypublic.blob.core.windows.net/babylon-sprites/starSprite.png";
        var btn = BABYLON.GUI.Button.CreateImageOnlyButton("btn_" + name, spriteUtl);
        btn.thickness = 0;
        btn.width = "30%";
        btn.height = "100%";

        //  btn.linkOffsetX ="-10px";
        btn.background = "blue";
        var img = btn.children[0];
        img.stretch = BABYLON.GUI.Image.STRETCH_NONE;
        img.sourceWidth = img.sourceHeight = itemSize;
        img.sourceLeft = getOffset(_.random(0, items - 1));//2080;
        img.sourceTop = 0;
        img.width = img.height = "100%";
        //  img.scaleY = 1.1;
        img.scaleY = img.scaleX = 1.5;
        img.top = "4px";
        img.left = "1%";
        panel.addControl(btn);
    }

    function createContainer(name, advancedTexture) {
        //  advancedTexture.renderAtIdealSize = true;
        var panel = new BABYLON.GUI.StackPanel();
        panel.isVertical = false;
        panel.background = "green";
        panel.thickness = 0;
        panel.width = "100%";
        panel.height = "260px";

        createText(panel, name);
        createButton(panel);
        advancedTexture.addControl(panel);
    }
    var meshPositions = (function () {
        var r = 5;
        var tes = 20;
        var pi2 = Math.PI * 2;
        var step = pi2 / tes;
        var positions = [];
        for (var i = 0; i < pi2; i += step) {
            var x = r * Math.cos(i);
            var z = _.random(-10, 10, true);
            var y = r * Math.sin(i);
            positions.push(new BABYLON.Vector3(x, y, z));
        }
        return positions;

    })();


    function createClones() {
        ids = [];
        _.forEach(meshPositions, function (position, index) {
            var name = "clone_" + index;
            var clone = protoMesh.clone(name);
            clone.position = position;
            protoMesh.isVisible = true;
            var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(clone, itemSize * 2, itemSize, false);

            createContainer(name, advancedTexture);


            clone.onDisposeObservable.add(function () {
                if (clone.material) {
                    clone.material.dispose(true, true);
                    clone.material = null;
                    delete clone.material;
                    //   console.log(" mesh.material");
                    advancedTexture.dispose();
                }
            });
            //  console.log("clone", { clone: clone, advancedTexture: advancedTexture });
            ids.push(clone.id);
            return;
        });
    }
    createClones();
    window._t = {
        getScene: function () {
            return scene;
        },
        dispose: true,
        run: function () {
            window._t.interval = setInterval(function () {
                if (window._t.dispose) {
                    console.log("recreateClones");
                    _.forEach(ids, function (meshId, idx) {
                        var mesh = scene.getMeshByID(meshId);
                        if (mesh) {
                            mesh.dispose();
                        }

                    });

                    scene.resetCachedMaterial();
                }
                else {
                    createClones();
                }
                window._t.dispose = !window._t.dispose;


            }, 50);
        },
        interval: 0,
        clear: function () {
            clearInterval(window._t.interval);
        }
    };;
    return scene;

};

