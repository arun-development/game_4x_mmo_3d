EstateManager.Context2d = {};
// ReSharper disable once InconsistentNaming
(function (Context2d) {
    //#region base canvasInstances
    var _canvasInstances;

    function getCanvasInstances() {
        if (!_canvasInstances) _canvasInstances = {};
        return _canvasInstances;
    };

    function addCanvasInstanceItem(canvasId, canvasItem) {
        var inst = getCanvasInstances();
        if (inst.hasOwnProperty(canvasId)) {
            console.log("error canvas instance Exist");
            return false;
        };
        inst[canvasId] = canvasItem;
        return inst[canvasId];
    };

    function getCanvasInstanceItem(canvasId) {
        var inst = getCanvasInstances();
        if (!inst.hasOwnProperty(canvasId)) return false;
        return inst[canvasId];
    };

    function removeCanvasInstanceItem(canvasId) {
        var inst = getCanvasInstances();
        var canvas = getCanvasInstanceItem(canvasId);
        if (!canvas) return;
        canvas.dispose();
        delete inst[canvasId];
    };


    function changeVisibleAll(canvasInstance, show) {
        canvasInstance.isVisible = show;
        canvasInstance.levelVisible = show;
    }


    Context2d.GetCanvasInstances = getCanvasInstances;
    Context2d.AddCanvasInstanceItem = addCanvasInstanceItem;
    Context2d.GetCanvasInstanceItem = getCanvasInstanceItem;
    Context2d.RemoveCanvasInstanceItem = removeCanvasInstanceItem;
    Context2d.ChangeVisibleAll = changeVisibleAll;

    //#endregion
})(EstateManager.Context2d);

// ReSharper disable once InconsistentNaming
(function (Context2d) {
    var baseColor = new BABYLON.Color4.FromInts(10, 86, 136, 150);
    var nameColor = baseColor.scale(1.5);
    var typeColor = nameColor.scale(0.8);

    function createLabel(parentMesh, canvasInstance, textBlockHeight, xCoef, yCoef, viewName, viewType) {
        function getFont(size) {
            //return "lighter " + size + "px Electrolize sans-serif";
            return "normal " + size + "px Electrolize sans-serif";
        };

        function createText(name, vPosition, color, font) {
            return new BABYLON.Text2D(name, {
                marginAlignment: "h: right, v:" + vPosition + " ",
                fontSuperSample: true,
                fontName: font,
                defaultFontColor: color,
                isVisible: true
            });;
        };

        var nameH = textBlockHeight * 0.6;
        var typeH = textBlockHeight * 0.4;
        var textName = createText(viewName, "top", nameColor, getFont(Math.floor(nameH)));
        var textType = createText(viewType, "bottom", typeColor, getFont(Math.floor(typeH)));


        var blockId = "label_" + parentMesh.id;

        var LableBlock = new BABYLON.Rectangle2D({
            id: "lableBlock",
            width: 0,
            height: textBlockHeight,
            x: textBlockHeight * ((typeof xCoef === "number") ? xCoef : -0.05),
            y: textBlockHeight * (yCoef ? yCoef : 0),
            origin: BABYLON.Vector2.Zero(),
            border: "transparent",
            fill: "transparent",
            children: [textName, textType]
        });

        var context = new BABYLON.Group2D({
            parent: canvasInstance,
            id: blockId,
            trackNode: parentMesh,
            origin: BABYLON.Vector2.Zero(),
            //  cacheBehavior: BABYLON.Canvas2D.CACHESTRATEGY_DONTCACHE,
            cachingStrategy: BABYLON.Canvas2D.GROUPCACHEBEHAVIOR_CACHEINPARENTGROUP,
            children: [LableBlock]
        });

        return context;
    };

    Context2d._createLabel = createLabel;
})(EstateManager.Context2d);

// ReSharper disable once InconsistentNaming
(function (Context2d) {
    var _canvasLabelId = "labelSystems";
    var _systems = {};


    function createLabelCanvas() {
        var canvasItem = new BABYLON.ScreenSpaceCanvas2D(EstateManager.Scene, {
            id: _canvasLabelId,
            cachingStrategy: BABYLON.Canvas2D.CACHESTRATEGY_DONTCACHE
            //cachingStrategy: BABYLON.Canvas2D.CACHESTRATEGY_CANVAS
        });
        return Context2d.AddCanvasInstanceItem(_canvasLabelId, canvasItem);
    };
    function getLabelCanvas() {
        return Context2d.GetCanvasInstanceItem(_canvasLabelId);
    };

    function getOrCreateLabelCanvas() {
        var canvasInstance = getLabelCanvas();
        if (!canvasInstance) canvasInstance = createLabelCanvas();
        return canvasInstance;
    }

    function createLabel(systemMesh, canvasInstance, viewName) {
        var viewType = "system";//todo получить перевод
        return Context2d._createLabel(systemMesh, canvasInstance, 28, 0, 0.1, viewName.toUpperCase(), viewType.toUpperCase());
    };


    function changeVisibleAll(show) {
        var canvas = getLabelCanvas();
        if (canvas) Context2d.ChangeVisibleAll(canvas, show);

    }

    function destroy() {
        Context2d.RemoveCanvasInstanceItem(_canvasLabelId);

    };

    _systems.CreateLabelCanvas = createLabelCanvas;
    _systems.GetLabelCanvas = getLabelCanvas;
    _systems.CreateLabel = createLabel;
    _systems.GetOrCreateLabelCanvas = getOrCreateLabelCanvas;
    _systems.ChangeVisibleAll = changeVisibleAll;
    _systems.Destroy = destroy;
    _systems.CanvasLabelId = function () {
        return _canvasLabelId;
    };

    Context2d.Systems = _systems;
})(EstateManager.Context2d);