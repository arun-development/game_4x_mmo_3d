/// <reference path="~/_js/game/map/events/spacePosition.js" />
/// <reference path="~/_js/Game/estate/EstateGeometry.js" />
/// <reference path="~/_js/Game/estate/EstateInit.js" />
/// <reference path="~/_js/Angular/Game/Service/BuildService/BuildReqHelper.js" />
 
 
EM.EstateEvents = {};
(function (EstateEvents) {
    // for debug events
    if(true) {
        EstateEvents.InitSceneEvents = function () {
            if (EM.Scene.onPointerUp) return;

            EM.Scene.onPointerUp = function (evt, target) {
                var targetName = target.pickedMesh.id;
                console.log("EM.Scene.onPointerUp", {
                    targetName: targetName,
                    evt: evt
                });    
                EM.SceneIsMoved = false;
            };
            EM.Scene.onPointerDown = function (evt, target) {
                EM.SceneIsMoved = false;

                var targetName = target.pickedMesh.id;
                console.log("EM.Scene.onPointerDown", {
                        targetName: targetName,
                        evt: evt
                    });
            };

            EM.Scene.onPointerMove = function (evt, pickingInfo) {
                if (pickingInfo.pickedMesh == null) {
                    EM.SceneIsMoved = false;
                }
                EM.SceneIsMoved = true;
            };
        };
    }

})(EM.EstateEvents);



//common
(function (EstateEvents) {
    function meshClick(unicName, action) {
        action();
    }

    function registerFactoryAction(mesh, onPickClick, hovered, unHovered, doubleClick) {
        //console.log(" EstateEvents.RegisterFactoryAction ", {
        //    mesh: mesh,
        //    onPickClick: onPickClick,
        //    hovered: hovered,
        //    unHovered: unHovered,
        //    doubleClick: doubleClick,
        //});
        if (!mesh) {
            throw new Error("registerFactoryAction: mesh not exist");
        }
        if (mesh.actionManager) {
            mesh.actionManager.dispose();
        }    
        mesh.actionManager = new BABYLON.ActionManager(EM.Scene);
  
        if (onPickClick) {
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, onPickClick.bind(mesh.actionManager, mesh)));
        }
        if (doubleClick) {
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnDoublePickTrigger, doubleClick.bind(mesh.actionManager, mesh)));
        }
        if (hovered) {
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, hovered.bind(mesh.actionManager, mesh)));
        }
        if (unHovered) {
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, unHovered.bind(mesh.actionManager, mesh)));
        }
 

      

    }
    EstateEvents.MeshClick = meshClick;
    EstateEvents.RegisterFactoryAction = registerFactoryAction;
    EstateEvents.RemoveActionFromMesh = function (mesh, triggerType) {
        if (!mesh || mesh.actionManager || !mesh.actionManager.actions.length) {
            return;
        }
        _.remove(mesh.actionManager.actions, function (o) {
            return o.trigger === triggerType;
        });
    };
    EstateEvents.GetOrCreateActionManagerFromMesh = function (mesh) {
        if (!mesh) {
            throw new Error("registerFactoryAction: mesh not exist");
        }
        if (!mesh.actionManager) {
            mesh.actionManager = new BABYLON.ActionManager(EM.Scene); 
        }
        return mesh.actionManager;
    };
    EstateEvents.AddExecuteCodeAction = function (mesh,triggerType,action) {
        var am =EstateEvents.GetOrCreateActionManagerFromMesh(mesh);
        EstateEvents.RemoveActionFromMesh(mesh, triggerType);
        am.registerAction(new BABYLON.ExecuteCodeAction(triggerType, action.bind(mesh.actionManager, mesh)));  
    }
})(EM.EstateEvents);
//mother
(function (EstateEvents) {
    //#region Modther
    var meshClick = EstateEvents.MeshClick;
    var register = EstateEvents.RegisterFactoryAction;
    var modules = EM.EstateGeometry.MotherModules;
    function motherIndustrialComplexClick() {
        meshClick("MotherIndustrialComplexClick", GameServices.buildReqHelper.getMotherIndustrialComplexList);
    }
    function motherIndustrialComplexHovered() {
        modules.SetMotherModulesVisible(true, modules.MotherIndustrialComplex);
    }

    function motherLaboratoryClick() {
        meshClick("MotherLaboratoryClick", GameServices.buildReqHelper.getMotherLaboratoryList);

    }
    function motherLaboratoryHovered() {
        modules.SetMotherModulesVisible(true, modules.MotherResearch);
    }

    function motherSpaceShipyardClick() {
        meshClick("MotherSpaceShipyardClick", GameServices.buildReqHelper.getMotherSpaceShipyardList);
    }
    function motherSpaceShipyardHovered() {
        modules.SetMotherModulesVisible(true, modules.MotherSpaceShipyard);
    }
    function motherModulesUnHovered() {
        modules.SetMotherModulesVisible(false);
    }
    function motherCapsuleClick() {
        // console.log("motherCapsuleClick");
        //this = mesh.actionManager;
        var sp = new EM.SpaceState.SpacePosition();
        sp.clickByMother(EM.EstateGeometry.MotherModules.EstateMotherGroupId);
    }
    //#region  Register Mother
    function registerMotherIndustrialComplex(mesh) {
        register(mesh, motherIndustrialComplexClick, motherIndustrialComplexHovered, motherModulesUnHovered);
    }
    function registerMotherResearch(mesh) {
        register(mesh, motherLaboratoryClick, motherLaboratoryHovered, motherModulesUnHovered);

    }
    function registerMotherSpaceShipyard(mesh) {
        register(mesh, motherSpaceShipyardClick, motherSpaceShipyardHovered, motherModulesUnHovered);
    }
    function registerMotherCapsule(mesh) {
        var am = EstateEvents.GetOrCreateActionManagerFromMesh(mesh);    
        am.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, EstateEvents.MotherCapsuleClick.bind(mesh.actionManager, mesh)));
    }
    //#endregion

    //#region Public
    EstateEvents.MotherIndustrialComplexClick = motherIndustrialComplexClick;
    EstateEvents.MotherIndustrialComplexHovered = motherIndustrialComplexHovered;
    EstateEvents.MotherLaboratoryClick = motherLaboratoryClick;
    EstateEvents.MotherLaboratoryHovered = motherLaboratoryHovered;
    EstateEvents.MotherSpaceShipyardClick = motherSpaceShipyardClick;
    EstateEvents.MotherSpaceShipyardHovered = motherSpaceShipyardHovered;
    EstateEvents.MotherModulesUnHovered = motherModulesUnHovered;
    EstateEvents.MotherCapsuleClick = motherCapsuleClick;

    //regiser
    EstateEvents.RegisterMotherIndustrialComplex = registerMotherIndustrialComplex;
    EstateEvents.RegisterMotherResearch = registerMotherResearch;
    EstateEvents.RegisterMotherSpaceShipyard = registerMotherSpaceShipyard;
    EstateEvents.RegisterMotherCapsule = registerMotherCapsule;
    //#endregion
})(EM.EstateEvents);
//Base
(function (EstateEvents) {

    var meshClick = EstateEvents.MeshClick;
    var register = EstateEvents.RegisterFactoryAction;
    var modules = EM.EstateGeometry.PlanetModules;

    function baseIndustrialComplexClick(event) {
        meshClick("buildIcc", GameServices.buildReqHelper.getIndustrialComplexList);
    }
    function baseIndustrialComplexHovered() { 
        modules.BaseModulesVisible(true, modules.IndustrialComplex);
    }

    function baseSpaceShipyardClick(e, t) {
     //   console.log("baseSpaceShipyardClick", { e: e, t: t });
        meshClick("buildSpaceShipyard", GameServices.buildReqHelper.getSpaceShipyardList);
    }
    function baseSpaceShipyardHovered() {
        modules.BaseModulesVisible(true, modules.SpaceShipyard);
    }

    function baseCommandCenterClick() {
        meshClick("buildCommandCenter", GameServices.buildReqHelper.getCommandCenterList);
    }
    function baseCommandCenterHovered() {
        modules.BaseModulesVisible(true, modules.ComandCenter);
    }

    function baseModulesUnHovered() {
        modules.BaseModulesVisible(false);
    }

    function registerBaseIndustrialComplex(mesh) { 
        register(mesh, baseIndustrialComplexClick, baseIndustrialComplexHovered, baseModulesUnHovered);
    }
    function registerBaseSpaceShipyard(mesh) {
        register(mesh, baseSpaceShipyardClick, baseSpaceShipyardHovered, baseModulesUnHovered);
    }
    function registerBaseCommandCenter(mesh) {
        register(mesh, baseCommandCenterClick, baseCommandCenterHovered, baseModulesUnHovered);
    }


    //#region Public
    EstateEvents.BaseIndustrialComplexClick = baseIndustrialComplexClick;
    EstateEvents.BaseIndustrialComplexHovered = baseIndustrialComplexHovered;

    EstateEvents.BaseSpaceShipyardClick = baseSpaceShipyardClick;
    EstateEvents.BaseSpaceShipyardHovered = baseSpaceShipyardHovered;

    EstateEvents.BaseCommandCenterClick = baseCommandCenterClick;
    EstateEvents.BaseCommandCenterHovered = baseCommandCenterHovered;

    EstateEvents.BaseModulesUnHovered = baseModulesUnHovered;

    //regiser
    EstateEvents.RegisterBaseIndustrialComplex = registerBaseIndustrialComplex;
    EstateEvents.RegisterBaseSpaceShipyard = registerBaseSpaceShipyard;
    EstateEvents.RegisterBaseCommandCenter = registerBaseCommandCenter;

    //#endregion
})(EM.EstateEvents);
