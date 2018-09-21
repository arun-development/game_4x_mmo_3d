// timer animation http://lexxus.github.io/jq-timeTo/
// http://preview.codecanyon.net/item/jcountdown-mega-package/full_screen_preview/3443480?ref=tommyngo&clickthrough_id=922481326&redirect_back=true

Utils.CoreApp.gameApp.service("controlDiskHelper", [
    "$timeout", "mainHelper", "mapInfoHelper", "bookmarkService", "journalService", function ($timeout, mainHelper, mapInfoHelper, bookmarkService, journalService) {
        "use strict";
        var domId = "#map-control-navigator";
        var hk = Utils.RepoKeys.HtmlKeys;
        var mapTypes = mapInfoHelper.mapTypes;
        var ar = EM.AssetRepository;
        var _meshLocalsKey = ar.MESH_LOCALS_KEY;
        var _meshInfoKey = ar.MESH_INFO_KEY;

  
 
        //#region JumpMother

        var targets = {
            info: "info",
            bookmark: "bookmark",
            jumpMotherDialog: "jump-mother-dialog"
        };

        var jumpBtnTranslate = Utils.CreateLangSimple("Jump", "Saltar", "Гиперпрыжок");
        function jumpMotherHandler(eventMeshId, diskModel) {
            //var re = new RegExp(mapTypes.Star, "i");
            //var hasStar = eventMeshId.search(re);
            if (diskModel.mapType === ar.GO_TYPE_NAMES.star && diskModel._meshServerData) {
                var curMother = EM.EstateData.GetMotherLocation();
                if (curMother.SystemId && curMother.SystemId !== diskModel._meshServerData.Id) {
                    diskModel.jumpTranslate = jumpBtnTranslate.getCurrent();
                    diskModel.showMotherJump = true;
                }

                //console.log(diskModel);
            }

        };
        //#endregion


        var infoInProgress = false;

        function initEvents(model) { 
            if (!Utils.Event.HasClick(model.element)) {
                model.element.click(function (event) {
                    if (infoInProgress) return;
                    EM.Audio.GameSounds.defaultButtonClick.play();
                    //console.log("model.element.click", {
                    //    model: _.cloneDeep(model),
                    //    event: event                    });
                    if (!model.mapType || !model.mapId) {
                        throw Errors.ClientNotImplementedException({
                            model: model,
                            mapType: model.mapType,
                            mapId: model.mapId

                        }, "controlDiskHelper.model.element.click type and id not set in instance");
                    }
                    var target = null;
                    var elem = $(event.target);
                    if (typeof elem.data("target") === "string") {
                        target = elem.data("target");
                    } else if (typeof elem.parent().data("target") === "string") {
                        target = elem.parent().data("target");
                    } else {
                        console.log("target not exist");
                    }
                    //console.log("target", {
                    //    target: target
                    //});
                    if (targets.bookmark === target) bookmarkService.addBookmark(model.mapType, model.mapId);
                    else if (targets.info === target) mapInfoHelper.getInfo(model.mapType, model.mapId);
                    else if (targets.jumpMotherDialog === target) journalService.jumpMotherToTargetSystemByMapControl(event, model);
                    model.hide();
                });
            }
            model.element.find(".md-button").hover(function (event) {
                EM.Audio.GameSounds.defaultHover.play();
            }, angular.noop);

        };
        //controlDiskModel
        var cDm;
        function createCdModel(element, scope) {
            cDm = {
                element: element,
                scope: scope,
                activeCssClass: "active",
                visible: false,
                dropContainerActiveCss: false,
                styles: {
                    left: 0,
                    top: 0
                },
                _setSyles: function (x, y) {
                    cDm.styles.left = x;
                    cDm.styles.top = y;
                },
                _resetSyles:  function () {
                    cDm.styles.left = -9999;
                    cDm.styles.top = -9999;
                },
                meshId: "",
                mapId: 0,
                mapType: null, //string

                delayDone: true,
                showMotherJump: false,
                jumpTranslate: null,
                _meshInfo: null,
                _meshServerData: null,
                _mapTypeItem: null,
                _setMeshData: function (event) {
                    if (cDm._meshInfo) return;
                    var _mesh;
                    var meshType = ar.CreateMeshArgumentType(event.source);
                    if (meshType.IsMesh) _mesh = event.source;
                    else if (meshType.IsObject
                             && !meshType.IsEmptyObject
                             && meshType._isCorrectMeshId(event.source.id)) {

                        _mesh = EM.GetMesh(event.source.id);

                    }
                    else if (meshType.IsCorrectMeshId()) _mesh = EM.GetMesh(event.source);
                    else throw Errors.ClientNotImplementedException({ event: event, cDm: cDm }, "controlDiskHelper.cDm.controlDiskModel._setMeshData");

                    if (!_mesh) throw Errors.ClientNullReferenceException({ event: event, cDm: cDm, _mesh: _mesh }, "_mesh", "controlDiskHelper.cDm.controlDiskModel._setMeshData");

                    cDm._meshInfo = ar.GetMeshInfoFromMeshOrMeshId(_mesh);
                    cDm.meshId = _mesh.id;
                    cDm.mapId = cDm._meshInfo.UniqueId;

                    cDm._mapTypeItem = cDm._meshInfo.GetMapType();
                    if (!cDm._mapTypeItem) throw Errors.ClientNotImplementedException({ event: event, cDm: cDm }, "controlDiskHelper.cDm.controlDiskModel._setMeshData._mapTypeItem");

                    var mapType = cDm._mapTypeItem.MapType;
                    if (mapType === ar.MapTypes.Satellite && cDm._mapTypeItem.SubMapType === ar.MapTypes.Moon) cDm.mapType = cDm._mapTypeItem.SubMapTypeLower;
                    else cDm.mapType = cDm._mapTypeItem.MapTypeLower;
                    if (cDm._mapTypeItem.MapTypeLower === ar.GO_TYPE_NAMES.star) {
                        cDm._meshServerData = ar.GetLocalsFromMesh(_mesh, ar.SERVER_DATA_KEY);
                    }
                },
                _isReseted :false,
                reset: function () {
                    if (cDm._isReseted) return;   
                    cDm.visible = false;
                    cDm.dropContainerActiveCss = false;
                    cDm._resetSyles();

                    cDm.meshId = null;
                    cDm.mapId = null;
                    cDm.mapType = null;
                    cDm.showMotherJump = false;
                    cDm.targetSystemId = null;
                    cDm._meshInfo = null;
                    cDm._mapTypeItem = null;
                    cDm._isReseted = true;
                },

                show: function (event) {
        
                    // var coord = EM.GetPointerCoordinate();
                    cDm._isReseted = false;
                    cDm.visible = true;
                    console.log("event", event);
                    cDm._setMeshData(event);
                    cDm._setSyles(event.pointerX + 20, event.pointerY);
                    jumpMotherHandler(cDm.meshId, cDm);
                    cDm.dropContainerActiveCss = true;
                    $timeout(angular.noop);
                    $timeout(function() {
                        EM.Audio.GameSounds.onControlDiscShow.play();
                    },200);
                  
                    return;
 
                },
                hide: function () {
                    cDm.reset();
                    $timeout(angular.noop);
                }
            };
            initEvents(cDm);
            //  console.log(controlDiskModel);
            return cDm;
        };

        this.createCdModel = createCdModel;
        this.show = function (event) {
            return cDm.show(event);
        };
        this.hide = function () {
            return cDm.hide();
        };
    }
]);