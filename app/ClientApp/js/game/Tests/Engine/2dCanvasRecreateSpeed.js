//playground http://babylonjs-playground.com/#1MXS36#1
var create = function (scene, canvasName, offset, text) {
    var canvas = new BABYLON.WorldSpaceCanvas2D(scene, new BABYLON.Size(500, 100), {
        id: "WorldSpaceCanvas",
        worldPosition: new BABYLON.Vector3(offset, offset * 2, offset),
        worldRotation: BABYLON.Quaternion.RotationYawPitchRoll(0, Math.PI / 2, Math.PI / 2),
        enableInteraction: true,
        backgroundFill: "#C0C0C040",
        backgroundRoundRadius: 20,
        children: [
            new BABYLON.Text2D(text, {
                fontName: "8pt Arial",
                marginAlignment: "h: center, v: bottom",
                fontSuperSample: true
            })
        ]
    });
    return canvas;
};

var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 200, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, false);

    var labels = new Array();
    var log;

    function createLables(count) {
        var baseName = "ScreenCanvas_";
        for (var j = 0; j < count; j++) {
            var name = baseName + j;
            var item = {
                id: name,
                canvas: create(scene, name, j * 2, "mytext_" + j)
            };
            labels[j] = item;
        }

    };

    function deleteItems() {
        for (var l in labels) {
            if (labels.hasOwnProperty(l)) {
                var i = labels[l];
                i.canvas.dispose();
            }
        }
        labels = new Array();
        log.deleted++;
        return labels.length === 0;
    };

    function recreate(countPerIteration) {
        log.request++;
        var canCreate = deleteItems();
        if (canCreate) {
            log.created++;
            createLables(countPerIteration);
        };

        update();
    };

    var maxIteration;
    var curIter;
    var countPerI;
    var startTime;
    function resetParams() {
        maxIteration = 1;
        curIter = 0;
        countPerI = 200;
        startTime = Math.floor(Date.now());
        log = { deleted: 0, created: 0, request: 0 };
    };
    resetParams();

    function update() {
        curIter++;
        if (maxIteration <= curIter) {
            var end = Math.floor(Date.now());
            var deltaTime = end - startTime;
            log.deltaTime = deltaTime / 1000;
            log.speedPerMs = countPerI * maxIteration / deltaTime;
            // createLables(counrPerI);     //show resilt
            console.log(log);
            resetParams();
        } else {
            recreate(countPerI);
        };
    };

    update();

    return scene;
};