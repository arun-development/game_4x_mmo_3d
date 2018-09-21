(function (signalR,$) {
signalR.createMainGameHub = function (loglevel) {
if (!loglevel) {
loglevel = signalR.LogLevel.Information;
}
var hub = new signalR.HubConnectionBuilder()
.withUrl('/hub/MainGameHub'.toLowerCase())
.configureLogging(loglevel)
.build();
hub.server = {};
hub.client = {};
            
hub.server['requestAllianceFromAllianceManageAddMessage'] = function(messageModel) {return hub.invoke.apply(hub, $.merge(['RequestAllianceFromAllianceManageAddMessage'], $.makeArray(arguments)));};
hub.server['requestAllianceFromMyAllianceAddMessage'] = function(messageModel) {return hub.invoke.apply(hub, $.merge(['RequestAllianceFromMyAllianceAddMessage'], $.makeArray(arguments)));};
hub.server['requestAllianceConfirmAcceptFromAllianceManage'] = function(messageModel) {return hub.invoke.apply(hub, $.merge(['RequestAllianceConfirmAcceptFromAllianceManage'], $.makeArray(arguments)));};
hub.server['requestAllianceDeleteRequestForUserToAlliance'] = function(toAllianceId) {return hub.invoke.apply(hub, $.merge(['RequestAllianceDeleteRequestForUserToAlliance'], $.makeArray(arguments)));};
hub.server['requestAllianceRejectRequestToAlliance'] = function(rejectUserId) {return hub.invoke.apply(hub, $.merge(['RequestAllianceRejectRequestToAlliance'], $.makeArray(arguments)));};
hub.server['requestAllianceAcceptJoinUserToAlliance'] = function(toAllianceId) {return hub.invoke.apply(hub, $.merge(['RequestAllianceAcceptJoinUserToAlliance'], $.makeArray(arguments)));};
hub.server['userChannelsGetPlanshet'] = function() {return hub.invoke.apply(hub, $.merge(['UserChannelsGetPlanshet'], $.makeArray(arguments)));};
hub.server['userChannelsSendMessage'] = function(messageModel) {return hub.invoke.apply(hub, $.merge(['UserChannelsSendMessage'], $.makeArray(arguments)));};
hub.server['userChannelsGetNextMessagesPage'] = function(channelId,channelType,skip) {return hub.invoke.apply(hub, $.merge(['UserChannelsGetNextMessagesPage'], $.makeArray(arguments)));};
hub.server['userChannelsCreatePrivateChannel'] = function(messageModel) {return hub.invoke.apply(hub, $.merge(['UserChannelsCreatePrivateChannel'], $.makeArray(arguments)));};
hub.server['userChannelsClosePrivateChannel'] = function(channelId,userId) {return hub.invoke.apply(hub, $.merge(['UserChannelsClosePrivateChannel'], $.makeArray(arguments)));};
hub.server['userChannelsIsAvailableChannelName'] = function(hubName) {return hub.invoke.apply(hub, $.merge(['UserChannelsIsAvailableChannelName'], $.makeArray(arguments)));};
hub.server['userChannelsCreateGroupChannel'] = function(newChannelData) {return hub.invoke.apply(hub, $.merge(['UserChannelsCreateGroupChannel'], $.makeArray(arguments)));};
hub.server['userChannelsDeleteGroupChannelByOwner'] = function(channelId) {return hub.invoke.apply(hub, $.merge(['UserChannelsDeleteGroupChannelByOwner'], $.makeArray(arguments)));};
hub.server['userChannelsUpdatePassword'] = function(channelId,newPassword) {return hub.invoke.apply(hub, $.merge(['UserChannelsUpdatePassword'], $.makeArray(arguments)));};
hub.server['userChannelsSerchGroupChannelNames'] = function(partChannelName) {return hub.invoke.apply(hub, $.merge(['UserChannelsSerchGroupChannelNames'], $.makeArray(arguments)));};
hub.server['userChannelsJoinToGroupChannel'] = function(channelId,password) {return hub.invoke.apply(hub, $.merge(['UserChannelsJoinToGroupChannel'], $.makeArray(arguments)));};
hub.server['userChannelsUnsubscribeUserFromGroupChannel'] = function(channelId) {return hub.invoke.apply(hub, $.merge(['UserChannelsUnsubscribeUserFromGroupChannel'], $.makeArray(arguments)));};
hub.server['userChannelsDeepDeleteOtherGroupChannels'] = function() {return hub.invoke.apply(hub, $.merge(['UserChannelsDeepDeleteOtherGroupChannels'], $.makeArray(arguments)));};
hub.server['userChannelsGroupUpdateUser'] = function(tragetUser,updatePasswordByChannel,channelAdminUserId) {return hub.invoke.apply(hub, $.merge(['UserChannelsGroupUpdateUser'], $.makeArray(arguments)));};
hub.server['userChannelsGroupUploadIcon'] = function(newBase64SourceImageModel,channelId) {return hub.invoke.apply(hub, $.merge(['UserChannelsGroupUploadIcon'], $.makeArray(arguments)));};
hub.server['worldGetSectors'] = function() {return hub.invoke.apply(hub, $.merge(['WorldGetSectors'], $.makeArray(arguments)));};
hub.server['worldGetSystems'] = function(sectorId) {return hub.invoke.apply(hub, $.merge(['WorldGetSystems'], $.makeArray(arguments)));};
hub.server['worldGetSystemGeometry'] = function(systemId) {return hub.invoke.apply(hub, $.merge(['WorldGetSystemGeometry'], $.makeArray(arguments)));};
hub.server['worldGetGalaxyInfo'] = function(galaxyId) {return hub.invoke.apply(hub, $.merge(['WorldGetGalaxyInfo'], $.makeArray(arguments)));};
hub.server['worldGetSectorInfo'] = function(sectorId) {return hub.invoke.apply(hub, $.merge(['WorldGetSectorInfo'], $.makeArray(arguments)));};
hub.server['worldGetStarInfo'] = function(starId) {return hub.invoke.apply(hub, $.merge(['WorldGetStarInfo'], $.makeArray(arguments)));};
hub.server['worldGetPlanetInfo'] = function(planetId) {return hub.invoke.apply(hub, $.merge(['WorldGetPlanetInfo'], $.makeArray(arguments)));};
hub.server['worldGetMoonInfo'] = function(moonId) {return hub.invoke.apply(hub, $.merge(['WorldGetMoonInfo'], $.makeArray(arguments)));};
hub.server['worldSerchPlanetNames'] = function(planetName,serchPlanetType) {return hub.invoke.apply(hub, $.merge(['WorldSerchPlanetNames'], $.makeArray(arguments)));};
hub.server['allianceLeaveFromUserAlliance'] = function() {return hub.invoke.apply(hub, $.merge(['AllianceLeaveFromUserAlliance'], $.makeArray(arguments)));};
hub.server['allianceDropUserFromAlliance'] = function(targetDropUserId) {return hub.invoke.apply(hub, $.merge(['AllianceDropUserFromAlliance'], $.makeArray(arguments)));};
hub.server['allianceDisbandAlliance'] = function() {return hub.invoke.apply(hub, $.merge(['AllianceDisbandAlliance'], $.makeArray(arguments)));};
hub.server['allianceCreateAlliance'] = function(newAllianceName) {return hub.invoke.apply(hub, $.merge(['AllianceCreateAlliance'], $.makeArray(arguments)));};
hub.server['allianceCheckAllianceNameIsUnic'] = function(newAllianceName) {return hub.invoke.apply(hub, $.merge(['AllianceCheckAllianceNameIsUnic'], $.makeArray(arguments)));};
hub.server['allianceGetAllActiveAllianceNames'] = function() {return hub.invoke.apply(hub, $.merge(['AllianceGetAllActiveAllianceNames'], $.makeArray(arguments)));};
hub.server['allianceGetAllianceNamesByPartName'] = function(partAllianceName) {return hub.invoke.apply(hub, $.merge(['AllianceGetAllianceNamesByPartName'], $.makeArray(arguments)));};
hub.server['allianceGetAllianceItemById'] = function(allianceId,tabIdx) {return hub.invoke.apply(hub, $.merge(['AllianceGetAllianceItemById'], $.makeArray(arguments)));};
hub.server['allianceGetAllianceItemByMinRating'] = function(pvpPoint,skip) {return hub.invoke.apply(hub, $.merge(['AllianceGetAllianceItemByMinRating'], $.makeArray(arguments)));};
hub.server['allianceUpdateUserRole'] = function(targetAllianceUserId,targetUserId,targetRoleId) {return hub.invoke.apply(hub, $.merge(['AllianceUpdateUserRole'], $.makeArray(arguments)));};
hub.server['allianceInfoUpdateLabel'] = function(newBase64SourceImageModel) {return hub.invoke.apply(hub, $.merge(['AllianceInfoUpdateLabel'], $.makeArray(arguments)));};
hub.server['allianceInfoUpdateDescription'] = function(newDescription) {return hub.invoke.apply(hub, $.merge(['AllianceInfoUpdateDescription'], $.makeArray(arguments)));};
hub.server['allianceInfoUpdateTax'] = function(newTax) {return hub.invoke.apply(hub, $.merge(['AllianceInfoUpdateTax'], $.makeArray(arguments)));};
hub.server['allianceUpdateAllianceTech'] = function(allianceTechType) {return hub.invoke.apply(hub, $.merge(['AllianceUpdateAllianceTech'], $.makeArray(arguments)));};
hub.server['bookmarkGetPlanshet'] = function() {return hub.invoke.apply(hub, $.merge(['BookmarkGetPlanshet'], $.makeArray(arguments)));};
hub.server['bookmarkAddBookmark'] = function(bm) {return hub.invoke.apply(hub, $.merge(['BookmarkAddBookmark'], $.makeArray(arguments)));};
hub.server['bookmarkDeleteItem'] = function(bm) {return hub.invoke.apply(hub, $.merge(['BookmarkDeleteItem'], $.makeArray(arguments)));};
hub.server['buildGetIndustrialComplex'] = function(planetId) {return hub.invoke.apply(hub, $.merge(['BuildGetIndustrialComplex'], $.makeArray(arguments)));};
hub.server['buildGetCommandCenter'] = function(planetId) {return hub.invoke.apply(hub, $.merge(['BuildGetCommandCenter'], $.makeArray(arguments)));};
hub.server['buildGetSpaceShipyard'] = function(planetId) {return hub.invoke.apply(hub, $.merge(['BuildGetSpaceShipyard'], $.makeArray(arguments)));};
hub.server['buildGetMotherIndustrialComplex'] = function() {return hub.invoke.apply(hub, $.merge(['BuildGetMotherIndustrialComplex'], $.makeArray(arguments)));};
hub.server['buildGetMotherSpaceShipyard'] = function() {return hub.invoke.apply(hub, $.merge(['BuildGetMotherSpaceShipyard'], $.makeArray(arguments)));};
hub.server['buildGetMotherLaboratory'] = function() {return hub.invoke.apply(hub, $.merge(['BuildGetMotherLaboratory'], $.makeArray(arguments)));};
hub.server['buildItemUpgrade'] = function(data,buildItemNativeName) {return hub.invoke.apply(hub, $.merge(['BuildItemUpgrade'], $.makeArray(arguments)));};
hub.server['buildItemUpgraded'] = function(planetId,buildItemNativeName) {return hub.invoke.apply(hub, $.merge(['BuildItemUpgraded'], $.makeArray(arguments)));};
hub.server['buildEnergyConverterExchangeResource'] = function(clientData) {return hub.invoke.apply(hub, $.merge(['BuildEnergyConverterExchangeResource'], $.makeArray(arguments)));};
hub.server['buildExtractionModuleChangeProportion'] = function(clientData) {return hub.invoke.apply(hub, $.merge(['BuildExtractionModuleChangeProportion'], $.makeArray(arguments)));};
hub.server['buildExtractionModuleStopProduction'] = function(ownId) {return hub.invoke.apply(hub, $.merge(['BuildExtractionModuleStopProduction'], $.makeArray(arguments)));};
hub.server['buildExtractionModuleStartProduction'] = function(ownId) {return hub.invoke.apply(hub, $.merge(['BuildExtractionModuleStartProduction'], $.makeArray(arguments)));};
hub.server['buildSpaceShipyardFixUnitTurn'] = function(ownId,unitTypeName) {return hub.invoke.apply(hub, $.merge(['BuildSpaceShipyardFixUnitTurn'], $.makeArray(arguments)));};
hub.server['buildSpaceShipyardSetUnitTurn'] = function(data) {return hub.invoke.apply(hub, $.merge(['BuildSpaceShipyardSetUnitTurn'], $.makeArray(arguments)));};
hub.server['buildStorageGetResourcesView'] = function(ownId) {return hub.invoke.apply(hub, $.merge(['BuildStorageGetResourcesView'], $.makeArray(arguments)));};
hub.server['buildStorageGetStorageResources'] = function(targetOwnId) {return hub.invoke.apply(hub, $.merge(['BuildStorageGetStorageResources'], $.makeArray(arguments)));};
hub.server['buildStorageDoTransfer'] = function(data) {return hub.invoke.apply(hub, $.merge(['BuildStorageDoTransfer'], $.makeArray(arguments)));};
hub.server['techItemUpgraded'] = function(techType) {return hub.invoke.apply(hub, $.merge(['TechItemUpgraded'], $.makeArray(arguments)));};
hub.server['buildLaboratorySetTechTurn'] = function(data) {return hub.invoke.apply(hub, $.merge(['BuildLaboratorySetTechTurn'], $.makeArray(arguments)));};
hub.server['confederationGetPlanshet'] = function() {return hub.invoke.apply(hub, $.merge(['ConfederationGetPlanshet'], $.makeArray(arguments)));};
hub.server['confederationAddNewOfficer'] = function(newOfficer,presidentOfficerId,presidentUserId) {return hub.invoke.apply(hub, $.merge(['ConfederationAddNewOfficer'], $.makeArray(arguments)));};
hub.server['confederationRatingGetNextPage'] = function(skip) {return hub.invoke.apply(hub, $.merge(['ConfederationRatingGetNextPage'], $.makeArray(arguments)));};
hub.server['confederationRatingGetUser'] = function(userId) {return hub.invoke.apply(hub, $.merge(['ConfederationRatingGetUser'], $.makeArray(arguments)));};
hub.server['confederationAddVote'] = function(candidateUserId) {return hub.invoke.apply(hub, $.merge(['ConfederationAddVote'], $.makeArray(arguments)));};
hub.server['confederationRegistrateCandidate'] = function() {return hub.invoke.apply(hub, $.merge(['ConfederationRegistrateCandidate'], $.makeArray(arguments)));};
hub.server['onDisconnectedAsync'] = function(exception) {return hub.invoke.apply(hub, $.merge(['OnDisconnectedAsync'], $.makeArray(arguments)));};
hub.server['onReconnected'] = function() {return hub.invoke.apply(hub, $.merge(['OnReconnected'], $.makeArray(arguments)));};
hub.server['init'] = function(langKey) {return hub.invoke.apply(hub, $.merge(['Init'], $.makeArray(arguments)));};
hub.server['ping'] = function() {return hub.invoke.apply(hub, $.merge(['Ping'], $.makeArray(arguments)));};
hub.server['estateGetHangar'] = function(ownId) {return hub.invoke.apply(hub, $.merge(['EstateGetHangar'], $.makeArray(arguments)));};
hub.server['estateGetEstateList'] = function() {return hub.invoke.apply(hub, $.merge(['EstateGetEstateList'], $.makeArray(arguments)));};
hub.server['estateGetEstateItemByPlanetId'] = function(planetId) {return hub.invoke.apply(hub, $.merge(['EstateGetEstateItemByPlanetId'], $.makeArray(arguments)));};
hub.server['estateGetFullEstate'] = function(ownId) {return hub.invoke.apply(hub, $.merge(['EstateGetFullEstate'], $.makeArray(arguments)));};
hub.server['journalInitialPlanshet'] = function() {return hub.invoke.apply(hub, $.merge(['JournalInitialPlanshet'], $.makeArray(arguments)));};
hub.server['journalCreateTaskItem'] = function(inputData) {return hub.invoke.apply(hub, $.merge(['JournalCreateTaskItem'], $.makeArray(arguments)));};
hub.server['journalGetTaskTime'] = function(estateId,planetName,startSystemId) {return hub.invoke.apply(hub, $.merge(['JournalGetTaskTime'], $.makeArray(arguments)));};
hub.server['journalTaskTimeIsOver'] = function(taskId) {return hub.invoke.apply(hub, $.merge(['JournalTaskTimeIsOver'], $.makeArray(arguments)));};
hub.server['journalGetReportItemByTaskId'] = function(taskId) {return hub.invoke.apply(hub, $.merge(['JournalGetReportItemByTaskId'], $.makeArray(arguments)));};
hub.server['journalCreateReportItem'] = function(id) {return hub.invoke.apply(hub, $.merge(['JournalCreateReportItem'], $.makeArray(arguments)));};
hub.server['journalGetReportItems'] = function(lastReportId) {return hub.invoke.apply(hub, $.merge(['JournalGetReportItems'], $.makeArray(arguments)));};
hub.server['journalDeleteReportItem'] = function(reportId) {return hub.invoke.apply(hub, $.merge(['JournalDeleteReportItem'], $.makeArray(arguments)));};
hub.server['journalGetSpyItems'] = function(lastSpyId) {return hub.invoke.apply(hub, $.merge(['JournalGetSpyItems'], $.makeArray(arguments)));};
hub.server['journalCreateSpyItemByPlanetId'] = function(planetId) {return hub.invoke.apply(hub, $.merge(['JournalCreateSpyItemByPlanetId'], $.makeArray(arguments)));};
hub.server['journalCreateSpyItemByPlanetName'] = function(planetName) {return hub.invoke.apply(hub, $.merge(['JournalCreateSpyItemByPlanetName'], $.makeArray(arguments)));};
hub.server['journalDeleteSpyItem'] = function(spyId) {return hub.invoke.apply(hub, $.merge(['JournalDeleteSpyItem'], $.makeArray(arguments)));};
hub.server['journalGetMotherJumpTime'] = function(sourceSystemId,targetSystemId) {return hub.invoke.apply(hub, $.merge(['JournalGetMotherJumpTime'], $.makeArray(arguments)));};
hub.server['journalAddTaskMotherJump'] = function(guid) {return hub.invoke.apply(hub, $.merge(['JournalAddTaskMotherJump'], $.makeArray(arguments)));};
hub.server['journalCancelMotherJump'] = function(jumpId) {return hub.invoke.apply(hub, $.merge(['JournalCancelMotherJump'], $.makeArray(arguments)));};
hub.server['journalInstMotherJump'] = function(jumpId) {return hub.invoke.apply(hub, $.merge(['JournalInstMotherJump'], $.makeArray(arguments)));};
hub.server['journalIsMotherJumpTimeDone'] = function() {return hub.invoke.apply(hub, $.merge(['JournalIsMotherJumpTimeDone'], $.makeArray(arguments)));};
hub.server['journalRemoveGuid'] = function(guid) {return hub.invoke.apply(hub, $.merge(['JournalRemoveGuid'], $.makeArray(arguments)));};
hub.server['sercherGetUserNames'] = function(partUserName) {return hub.invoke.apply(hub, $.merge(['SercherGetUserNames'], $.makeArray(arguments)));};
hub.server['testApiCall'] = function(message) {return hub.invoke.apply(hub, $.merge(['TestApiCall'], $.makeArray(arguments)));};
hub.server['personalInfoUpdateAvatar'] = function(newBase64SourceImageModel) {return hub.invoke.apply(hub, $.merge(['PersonalInfoUpdateAvatar'], $.makeArray(arguments)));};
hub.server['personalInfoUpdateUserDescription'] = function(newDescriptionText) {return hub.invoke.apply(hub, $.merge(['PersonalInfoUpdateUserDescription'], $.makeArray(arguments)));};
hub.server['personalInfoGetProfileByUserName'] = function(userName) {return hub.invoke.apply(hub, $.merge(['PersonalInfoGetProfileByUserName'], $.makeArray(arguments)));};
hub.server['personalInfoGetProfileByUserId'] = function(userId) {return hub.invoke.apply(hub, $.merge(['PersonalInfoGetProfileByUserId'], $.makeArray(arguments)));};
return hub;
}})(signalR,jQuery);

$("html").unbind("contextmenu").bind("contextmenu", function (event) {
    console.log("html.oncontextmenu", {
        e:event
    });
    return false;
}).bind("dblclick", function (event) {
    return false;
});

var EM = {
    SubscribeName: "EM",
    Observer: null,
    EstateContainerId: "#estate",
    CanvasId: "estateCanvas",
    Engine: null,
    Scene: null,
    CreateScene: null,
    StartRender: null,
    StopRender: null,
    GetMotherMesh: null,
    ShowDebug: function (show, popup) {
        if (show) {
            this.Scene.debugLayer.show();
            setTimeout(function () {
                $(".insp-right-panel").css("z-index", 5);
            },100);
           
            return;
            // пример конфига с настройками
            this.Scene.debugLayer.show({
                popup: popup,
                initialTab: 2,
                //parentElement:$("body"),
                newColors: {
                    backgroundColor: '#eee',
                    backgroundColorLighter: '#fff',
                    backgroundColorLighter2: '#fff',
                    backgroundColorLighter3: '#fff',
                    color: '#333',
                    colorTop: 'red',
                    colorBottom: 'blue'
                }
            });
  
           
        }
        else {
            this.Scene.debugLayer.hide();
        }
     
    },
    StarLight: {
        States: {
            Other: 1,
            InPlanet: 2,
            InSystem: 3,
            InCamera: 4 ,
 
        },
        ActiveState: null,
        SetInSystem: null,
        SetInPlanet: null, 
        SetOther: null,
        SetState: null,
        SetInCamera: null
    },
    _helpers: null,
    $hub: null,
    Audio: {
        GameSounds: {},
        InitGame: angular.noop
    }

};  
(function () {
    var canvas;
    var engine;
    var scene;
    var showLog = false;



    EM.Observer = Utils.PatternFactory.Observer(EM.SubscribeName);
    EM.CreateScene = function (initServerData, mainGameHubService) {
        function _log(methodName, data) {
            if (!showLog) return;
            var message = "EM.CreateScene";
            if (methodName) message = message + "__{" + methodName + "}__Ok__";
            if (data) console.log(message, { data: data });
            else console.log(message);

        }
        EM.Canvas = canvas = document.getElementById(EM.CanvasId);
        EM.Engine = engine = new BABYLON.Engine(canvas, true, { stencil: true });

        EM._helpers = new EM.IHelper(new BABYLON.Scene(engine), mainGameHubService);
        EM.SetHelpersToObject(EM);
        //BABYLON.Scene.ExclusiveDoubleClickMode = true;
        EM.Scene.exclusiveDoubleMode = true;
        scene = EM.Scene;
        EM.Audio.InitGame(scene);

        function createWorld() {
 
            var tmp = {};
            tmp.Update = function (name) {
                if (name === EM.MapBuilder.Sectors.SubscribeName) {
                    EM.MapBuilder.Sectors.Observer.Unsubscribe(tmp);
                    EM.Observer.NotifyAll();
                    tmp = null;
                    _log("createWorld.Update name", name);
                    EM.Particle.GetOrCreateSectorParticles();
                }
            };

            EM.MapBuilder.Sectors.Observer.Subscribe(tmp);
            _log(" EM.MapBuilder.Sectors.Observer.Subscribe(tmp)");

            EM.MapBuilder.Sectors.Build(initServerData[EM.MapGeometry.MapTypes.Sector]);
            _log(" EM.MapBuilder.Sectors.Build(initserverData[EM.MapGeometry.MapTypes.Sector]);");

            EM.MapData.GetSystem.InitSystemData(initServerData.SystemGeometry);
            _log("MapData.GetSystem.InitSystemData(initserverData.SystemGeometry)");

         

        }

        function createLight() {
            //  var light = new BABYLON.HemisphericLight("StarLight", new BABYLON.Vector3.Zero(), scene);
            //hemo.intensity = 0.05;
            var light = new BABYLON.PointLight("StarLight", new BABYLON.Vector3.Zero(), scene);
            var states = EM.StarLight.States;
            var baseSlPosition = new BABYLON.Vector3(0, 1e6, 0);
            var baseIntensity = 0.2;
            var maxRangPlanetPosition = 800;
            var defaultPlanetPosition = new BABYLON.Vector3(0, maxRangPlanetPosition / 2, 0);
            //todo  делаем трек солнца
            var planetLight;

            function IStarTrack(Tes, Light, Radius) {
                var _self = this;
                var tes = Tes || 360;
                var path = [];
                var idx = 0;
                var maxIdx = 0;
                var runned = false;
                var r = Radius || maxRangPlanetPosition;
                var intervalId = null;
                var day = Utils.Time.ONE_DAY;
                var delay = _.floor(day / tes);

                function _clearInteraval() {
                    if (intervalId) {
                        clearInterval(intervalId);
                        intervalId = null;
                    }
                }

                this.Position = new BABYLON.Vector3(0, 140, 0);
                this._light = null;
                this.Update = function () {
                    if (!runned) return;
                    if (idx > maxIdx) idx = 0;
                    this._light.position = path[idx];
                    idx++;
                };
                this.SetTrack = false;

                function cleanLight() {
                    _clearInteraval();
                    if (_self._light) {
                        _self._light.dispose();
                        _self._light = null;
                    }
                }
                function _createPath() {
                    var pi2 = Math.PI * 2;
                    var phi = 0.4;
                    var step = pi2 / tes;
                    path = [];
                    idx = 0;
                    for (var i = 0; i < pi2; i += step) {
                        var x = r / 4 * Math.sin(i) * Math.cos(phi);
                        var z = r / 4 * Math.cos(i);
                        //  var y = r * Math.sin(i) * Math.sin(phi);
                        var y = r * Math.sin(i) * Math.sin(phi);
                        // y += 0.4* r;
                        // y +=  r;
                        path.push(new BABYLON.Vector3(_.round(x, 5), _.round(y, 5), _.round(z, 5)));
                    }
                    path.push(path[0]);
                    maxIdx = path.length - 1;

                };


                this.LightName = "PlanetPointLight1";
                this.Start = function () {
                    cleanLight();
                    //planetLight = new BABYLON.HemisphericLight("PlanetLightHemo", new BABYLON.Vector3.Zero(), scene);
                    this._light = new BABYLON.PointLight(this.LightName, this.Position, scene);
                    this._light.intensity = 0.9;
                    this._light.specular.b = 0.7;
                    this._light.intensity = 1.0;
                    light.intensity = 0.0;
                    runned = true;
                    if (this.SetTrack) {
                        if (!path) _createPath();
                        _self.Update();
                        intervalId = setInterval(function () {
                            _self.Update();
                        }, delay);
                    }


                };
                this.Stop = function () {
                    cleanLight();
                    runned = false;
                };
                this.IsRunned = function () {
                    return runned;
                };


            };
            var starTrack = new IStarTrack();
            var setState = null;

            function _setActiveState(state) {
                EM.StarLight.ActiveState = state;
            }
            function setInCamera(intensity) {
                starTrack.Stop();
                light.intensity = intensity || 0.6;
                light.position = EM.GameCamera.Camera.position;
                _setActiveState(EM.StarLight.States.InCamera);
            };
            function setInPlanet(_state) {
                if (!_state) setState(states.InPlanet);
                else {
                    starTrack.Start();
                    _setActiveState(_state);
                }

            };

            function setOther(_state) {
                if (!_state) setState(states.Other);
                else {
                    light.intensity = baseIntensity;
                    light.position = baseSlPosition;
                    _setActiveState(_state);
                }

            };

            function setInSystem(_state) {
                if (!_state) {
                    setState(states.InSystem);
                    return;
                }

                light.intensity = 0.8;
                var csl = EM.EstateData.GetCurrentSpaceLocation();
                var starMeshId = EM.MapGeometry.System.GetStarMeshIdByUniqueId(csl.SystemId);
                var curStar = null;
                if (starMeshId) curStar = scene.getMeshByID(starMeshId);
                _log(".setInSystem", {
                    csl: csl,
                    curStar: curStar
                });

                if (curStar) {
                    light.position = curStar.getAbsolutePosition().clone();
                    _setActiveState(_state);
                }
                else setOther(states.Other);
            };    
   
            setState = function (state) {
                if (!state) return;
                if (state === EM.StarLight.ActiveState) return;
                if (typeof state != "number") return;
                if (starTrack.IsRunned() && state !== states.InPlanet) starTrack.Stop();

                if (state === states.InSystem) setInSystem(states.InSystem);
                else if (state === states.InPlanet) setInPlanet(states.InPlanet);
                else if (state === states.InCamera) setInCamera();
  
                else if (state === states.Other) setOther(states.Other);
            };

            EM.StarLight.SetOther = setOther;
            EM.StarLight.SetInPlanet = setInPlanet;
            EM.StarLight.SetInSystem = setInSystem;
            EM.StarLight.SetState = setState;
            EM.StarLight.SetInCamera = setInCamera;
 

        }

        function createCamera() {
            EM.GameCamera.CreateCamera(scene, canvas, EM.GameCamera.Keys.SystemSelected);
        }

        function createHdrSetting() {
            var hdr = new BABYLON.HDRRenderingPipeline("hdr", scene, 1.0, null, [EM.GameCamera.Camera]);
            hdr.brightThreshold = 2.0;
            hdr.gaussCoeff = 0.1;
            hdr.gaussMean = 1.0;
            hdr.gaussStandDev = 6.0;
            hdr.minimumLuminance = 0.1;
            hdr.luminanceDecreaseRate = 0.1;
            hdr.luminanceIncreaserate = 0.5;
            hdr.exposure = 0.3;
        };

 
        function regisertResizer() {
            window.addEventListener("resize", function () {
                if (engine) engine.resize();
            }, false);
        }

        createLight();
        _log("createLight");
        createCamera();
        _log("createCamera");

        regisertResizer();
        _log("regisertResizer");



        EM.AssetRepository.Init(scene, function () {
 
            createWorld();
            _log("createWorld");
        });

 

        //todo  события для отслеживаний кликов - дебаг
        //scene.debugLayer.show(true);

        return scene;
    };
    EM.StartRender = function () {
        engine.runRenderLoop(function () {
            scene.render();
        });
    };
    EM.StopRender = function () {
        engine.stopRenderLoop();
    };
    EM.GetMotherMesh = function () {
        return scene.getMeshByID(EM.EstateGeometry.MotherModules.EstateMotherGroupId);
    };
    EM.GetPointerCoordinate = function () {
        return new BABYLON.Vector2(EM.Scene.pointerX, EM.Scene.pointerY);
    };


    //#region GetHelpers


    EM.IHelper = function (_scene, mainGameHubService) {
        var _self = this;
        _self.Scene = _scene;
        _self.$hub = mainGameHubService;

        /**
        * памятка
        * isVisible {bool}  состояние видимый не видимый
        * isPickable {bool} будет ли меш реагировать на события в невидимом состоянии
        * visibility {decimal}   это аналог альфы меша принимает значения от 0 до 1;
        * @param {} mesh 
        * @param {} show 
        * @param {} notChangIsPickable 
        * @param {} notRecurseChildrens 
        * @returns {} 
        */
        function _setVisibleMesh(mesh, show, notChangIsPickable, notRecurseChildrens) {
            if (mesh.isVisible === show && (notChangIsPickable || mesh.isPickable === show)) return;
            function _setVisible(_mesh, _show) {
                _mesh.isVisible = _show;
                // _mesh.setEnabled((_show) ? 1 : 0);  
                if (!notChangIsPickable && _mesh.isPickable !== _show) _mesh.isPickable = _show;
            }


            _setVisible(mesh, show);
            if (notRecurseChildrens) return;
            var children = mesh.getChildMeshes();
            if (children) {
                _.forEach(children, function (val, idx) {
                    _setVisible(val, show);
                });
            }
            return mesh;

        }

        _self.GetMesh = function (meshId) {
            return _scene.getMeshByID(meshId);
        };
        _self.GetMaterial = function (materialId) {
            return _scene.getMaterialByID(materialId);
        };
        _self.CreateTexture = function (url) {
            var texture = new BABYLON.Texture(url, EM.Scene);
            return texture;
        };
        _self.CreateBaseMaterial = function (materialId, onCreate) {
            var material = new BABYLON.StandardMaterial(materialId, EM.Scene);
            if (onCreate instanceof Function) onCreate(material);
            return material;
        };


        _self.SetVisibleByMesh = function (mesh, show, notChangIsPickable, notRecurseChildrens) {
            show = !!show;
            if (mesh) _setVisibleMesh(mesh, show, notChangIsPickable, notRecurseChildrens);
            return mesh;
        };
        _self.SetVisible = function (meshId, show, notChangIsPickable, notRecurseChildrens) {
            return _self.SetVisibleByMesh(_self.GetMesh(meshId), show, notChangIsPickable, notRecurseChildrens);
        };
        _self.SetVisibleGroupByMeshes = function (meshes, show, notChangIsPickable, notRecurseChildrens) {
            _.forEach(meshes, function (mesh) {
                _self.SetVisibleByMesh(mesh, show, notChangIsPickable, notRecurseChildrens);
            });
        };
        _self.SetVisibleGroupByIds = function (meshIds, show, notChangisPickable, notRecurseChildrens) {
            _.forEach(meshIds, function (meshId) {
                _self.SetVisible(meshId, false, show, notChangisPickable, notRecurseChildrens);
            });
        };
        _self.CreateVec3Scale = function (scale) {
            return new BABYLON.Vector3(scale, scale, scale);
        };
        _self.SetScaleToMesh = function (mesh, scale) {
            var data = {
                mesh: mesh,
                scale: scale
            };

            if (!mesh) throw Errors.ClientNullReferenceException(data, "mesh", "EM.setScaleToMesh");
            if (typeof scale === "object") {
                mesh.scaling = scale;
                return mesh;
            }
            var _scale = null;
            if (!scale) _scale = 1;
            else if (typeof scale == "number") _scale = scale;
            else if (Utils.IsNumeric(scale)) {
                var numScale = _.toNumber(scale);
                if (numScale) _scale = numScale;
            }
            else throw Errors.ClientTypeErrorException(data, scale, "object||BABYLON.Vector3||number||string", "EM.setScaleToMesh");
            mesh.scaling = _self.CreateVec3Scale(_scale);
            return mesh;

        };

        return _self;
    }


    var hp = 1e7;
    EM.HIDDEN_POSITION = new BABYLON.Vector3(hp, hp, hp);

    EM.GetHelpers = function () {
        if (!EM._helpers) {
            throw Errors.ClientNotImplementedException({ EM: EM }, "scene not exist");
        }
        return EM._helpers;
    };

    EM.SetHelpersToObject = function (object) {
        if (object instanceof Object) {
            return _.extend(object, EM.GetHelpers());
        }
        return false;
    };
    //#endregion
})();

//EstateBuilder
(function () {
    EM.EstateBuilder = {
        UpdatePlanet: function () {
            var sp = new EM.SpaceState.SpacePosition();
            sp.clickByUserPlanet();
        },
        UpdateMother: function () {
            EM.EstateEvents.MotherCapsuleClick();
        },
        UserPlanetBuilder: {
            SetPlanetEnv: function (sourceType) {
                if (sourceType) {
                    //disposeCurrMapSystem();

                } else {
                    //disposeCurrPlanetEnv();
                }
            }
        }
    };
})();






EM.SpriteManager = {};
(function (SpriteManager) {
    SpriteManager.init = function () {
        var existingSpriteNames = [];
        //var baseSpriteCatalog = "/Content/BabylonSprites/";
        var sprites = {};

        function getRegistratedSpriteNames() {
            return existingSpriteNames;
        };

        function getSpriteByName(spriteName) {
            return sprites.hasOwnProperty(spriteName) ? sprites[spriteName] : false;
        };

        function checkSpriteExist(spriteName) {
            return !!getSpriteByName(spriteName);
        };

        function addOrGetSpriteTexture(spriteMetaItem) {
            var name = spriteMetaItem.name;
            if (checkSpriteExist(name)) {
                if (SHOW_DEBUG) console.log("spriteExist");
                return getSpriteByName(name);
            }
            else {
                var spriteTexture = new BABYLON.Texture(spriteMetaItem.url, EM.Scene, true, false, BABYLON.Texture.NEAREST_SAMPLINGMODE);
                spriteTexture.hasAlpha = true;
                spriteTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
                spriteTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
                return sprites[name] = spriteTexture;
            };
        }

        function disposeByName(spriteName, onDispose) {
            var sprite = getSpriteByName(getSpriteByName);
            sprite.onDispose(function () {
                delete sprites[spriteName];
                onDispose();
            });
            sprite.dispose();

        };


        function createUrl(fileName, ext, fromLocal) {
            return Utils.CdnManager.GetBjsSprite(fileName + ((ext) ? ext : ".png"), fromLocal);
        };


        function createSpriteMetaData(fileName, cellSize, scale, sellInRow,imageSizeX, imageSizeY) {
            if (!imageSizeY) imageSizeY = imageSizeX;
            return {
                name: fileName,
                url: createUrl(fileName),
                cellSize: cellSize,
                scale: scale,
                sellInRow: sellInRow,
                imageSize: new BABYLON.Vector2(imageSizeX, imageSizeY)
            };
        };

        var spriteMeta = {
            starSprite: createSpriteMetaData("starSprite", 260, 0.15, 8, 2080)
        };

        SpriteManager.getRegistratedSpriteNames = getRegistratedSpriteNames;
        SpriteManager.getSpriteByName = getSpriteByName;
        SpriteManager.addOrGetSpriteTexture = addOrGetSpriteTexture;
        SpriteManager.checkSpriteExist = checkSpriteExist;
        SpriteManager.disposeByName = disposeByName;
        SpriteManager.spriteMeta = spriteMeta;
    };
})(EM.SpriteManager);


(function ($a) {

    var gameAudioDir = "/content/audio/game/";
    var bAudioDir = gameAudioDir + "background/";
    var background = {};
    $a.background = background;
    var systemVoiceDir = gameAudioDir + "test/";
    $a.systemVoiceListUrls = {};
    $a.InitGame = function (scene) {

        function createSound(name, fileName, readyToPlayCallback, options) {
            var urlOrArrayBuffer = ((options && options.dir) ? options.dir : systemVoiceDir) + fileName;
            $a.systemVoiceListUrls[name] = urlOrArrayBuffer;
            $a.GameSounds[name] = new BABYLON.Sound(name, urlOrArrayBuffer, scene, readyToPlayCallback, options);
        }

        // createSound("sceneObjectHover", "SE_ControlDisk_Label.wav");
        createSound("onGameStart", "SE_LoadingLogo1.wav", function () {
            $a.GameSounds.onGameStart.play();
        },
            {
                volume: 0.5
            });

        createSound("mainFone", "main-fone.mp3", null, {
            dir: bAudioDir,
            loop: true,
            volume: 0.5
        });
        //space

        createSound("onSpaceObjectHoveredIn", "SE_HoverBodyIn.wav");
        createSound("onControlDiscShow", "UI_DiscToggleActivate.wav");
        //createSound("onJumpToSystemStart", "SE_EnterJumpPointStart.wav");
        createSound("onSpaceJumpToSystemStart", "SE_EnterStarSystemStart.wav");
        createSound("onMoveToPlanetoid", "SE_ShowOrbitals.wav");

        createSound("onSpaceMoveToSystemPoint", "SE_SelectNothing.wav");
        createSound("onSpaceRotate", "CAM_FastMove_LOOP.wav");
        createSound("onSpaceScroll", "CAM_Dolly_LOOP.wav");

        //interfaces

        createSound("defaultButtonClick", "UI_DiscClick.wav");
        createSound("defaultButtonClose", "UI_DiscClose.wav");
        createSound("defaultHover", "SE_HoverBodyIn.wav");

        createSound("dialogOpen", "SE_ShowHeatmap.wav");
        createSound("dialogClose", "SE_HideHeatmap.wav");

        createSound("dropableOpen", "SE_ShowHeatmap.wav");

        createSound("planshetOpen", "SE_ShowHeatmap.wav");
        createSound("planshetClose", "SE_HideHeatmap.wav");
        createSound("planshetTabActivate", "SE_UpdateHeatmap.wav");

        createSound("contollPannelToggle", "UI_DiscClose.wav");
        createSound("onSelectPlanetOpen", "SE_ShowHeatmap.wav");
        createSound("onSelectPlanetClose", "SE_HideHeatmap.wav");


    };
    //babylon https://www.babylonjs-playground.com/#14NOH8#0

})(EM.Audio);
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



//новое https://github.com/BabylonJS/Babylon.js/releases
EM.AssetRepository = {
    TypeList: {
        lavaMat: function () {
            "use strict";
            var dir = Utils.CdnManager.GetBabylonMaterialesCatalog("lava");
            var material = new BABYLON.LavaMaterial(dir, EM.Scene);
            material.noiseTexture = new BABYLON.Texture(dir + "cloud.png", EM.Scene); // Set the bump texture
            material.diffuseTexture = new BABYLON.Texture(dir + "lavatile.jpg", EM.Scene); // Set the diffuse texture
            material.speed = 0.01;
            this._groundMaterial = material;
            return this._groundMaterial;
        },
        whaterMat: function (groundMesh, skybox) {
            "use strict";
            if (!groundMesh) throw Utils.Console.Error("AssetRepository.TypeList.whaterMat ground mesh not exsit");
            var catalog = Utils.CdnManager.GetBabylonMaterialesCatalog();
            var path = catalog + "waterbump.png";
            var material = new BABYLON.WaterMaterial("whaterMat", EM.Scene);
            material.bumpTexture = new BABYLON.Texture(path, EM.Scene); // Set the bump texture 
            material.windForce = 10; // Represents the wind force applied on the water surface
            material.waveHeight = 0.1; // Represents the height of the waves
            material.bumpHeight = 1; // According to the bump map, represents the pertubation of Reflection and refraction
            material.windDirection = new BABYLON.Vector2(1.0, 1.0); // The wind direction on the water surface (on width and height)
            material.waterColor = new BABYLON.Color3(0.1, 0.2, 0.2); // Represents the water color mixed with the reflected and refracted world
            material.colorBlendFactor = 4.0; // Factor to determine how the water color is blended with the reflected and refracted world
            material.waveLength = 0.1; // The lenght of waves. With smaller values, more waves are generated
            if (!skybox) skybox = EM.GetMesh(EM.AssetRepository.NUBULA_BOX_MESH_ID);
            material.addToRenderList(skybox);
            material.addToRenderList(groundMesh);
            // ... etc.
            this._groundMaterial = material;
            return this._groundMaterial;
        }
    },
    MAP_TYPE_KEY: "_mapTypeInfo",
    MESH_CONTAINER_KEY: "_meshContainer",
    TEXTURE_TYPE_ID_KEY: "_textureTypeId",
    SERVER_DATA_KEY: "_serverData",
    MESH_LOCALS_KEY: "_localData",
    MESH_INFO_KEY: "_meshInfo",
    MAP_ITEM_KEY: "_mapItem",
    MATERIALES_KEY: "_materiales",
    BEFORE_RENDER_SPACE_PLANET_ACTION_KEY: "space_planet",
    NUBULA_BOX_MESH_ID: null

};

//#region common 

//#region common  MeshLocals
(function (ar) {
    "use strict";

    var _mlKey = ar.MESH_LOCALS_KEY;
    function getLocalsFromMesh(mesh, advancedKey, returnLocalsIfAdvancedNull) {
        if (mesh.hasOwnProperty(_mlKey)) {
            var locals = mesh[_mlKey];
            if (!advancedKey) return locals;
            if (locals.hasOwnProperty(advancedKey)) return locals[advancedKey];
            if (returnLocalsIfAdvancedNull) return locals;
            return null;
        }
        return null;
    }

    function addLocalsToMesh(mesh, advancedKey, val) {
        if (!mesh[_mlKey]) mesh[_mlKey] = {};
        mesh[_mlKey][advancedKey] = val;
    }

    function hasLocalsInMesh(mesh, advancedKey, checkAdvancedValue) {
        var key = ar.MESH_LOCALS_KEY;
        if (!mesh) return false;
        if (_.isEmpty(mesh[key])) return false;
        if (!advancedKey) return true;
        if (!checkAdvancedValue && mesh[key].hasOwnProperty(advancedKey)) return true;
        return !_.isEmpty(mesh[key][advancedKey]);
    };

    function getOrAddLoacalsInMesh(mesh, advancedKey, val) {
        if (!hasLocalsInMesh(mesh, advancedKey)) addLocalsToMesh(mesh, advancedKey, val);
        return getLocalsFromMesh(mesh, advancedKey);

    }

    ar.GetLocalsFromMesh = getLocalsFromMesh;
    ar.AddLocalsToMesh = addLocalsToMesh;
    ar.HasLocalsInMesh = hasLocalsInMesh;
    ar.GetOrAddLoacalsInMesh = getOrAddLoacalsInMesh;

})(EM.AssetRepository);
//#endregion; 

//#region common  Dispose
(function (ar) {
    "use strict";
    var showLog = true;
    function _getMessage(message) {
        var _m = "__AssetRepository.Dispose__";
        if (message) _m += "{" + message + "}__";
        return _m;
    }
    function _log(disposeType, oldId, advancedData, advancedMessage) {
        if (!showLog) return;
        var data = {
            disposeType: disposeType,
            oldId: oldId,
            advancedData: advancedData
        };
        //    console.log(_getMessage(advancedMessage), data);
    }
    ar.BindDisposeMaterial = function (material) {
        if (!material) return;
        var oldMaterialId = material.id;
        _log("BindDisposeMaterial REGISTER", oldMaterialId);
        material.onDisposeObservable.add(function (_material, maskItem) {
            var keys = Object.keys(material);
            _log("DisposeMaterial", oldMaterialId, [_material, maskItem, keys]);
            _.forEach(keys, function (propName, propIdx) {
                if (material[propName] && material[propName].dispose && !_.startsWith(propName, "_") && _.endsWith(propName, "Texture")) {
                    material[propName].dispose();
                    _log("____Texture_____", oldMaterialId, [_material, maskItem, material[propName]], propName);
                }

            });

            if (showLog) {
                setTimeout(function () {
                    _log("HAS MATERIAL IN SCENE", EM.GetMaterial(oldMaterialId));
                }, 5);
            }


        });
    };
    ar.BindDisposeFullMesh = function (mesh, onBeforeDisposed, onDoneDisposed) {
        if (!mesh) return;
        var disposedMeshId = mesh.id;
        _log("BindDisposeFullMesh REGISTER", disposedMeshId);
        ar.BindDisposeMaterial(mesh.material);
        mesh.onDisposeObservable.add(function (_mesh, maskItem, insertFirst) {
            if (onBeforeDisposed instanceof Function) onBeforeDisposed(mesh);
            if (mesh && mesh.material) mesh.material.dispose(true, true);

            if (onDoneDisposed instanceof Function) onDoneDisposed(disposedMeshId);
            if (showLog) {
                setTimeout(function () {
                    _log("DisposeFullMesh HAS MESH IN SCENE", disposedMeshId);
                }, 5);
            }
            mesh.onDisposeObservable.remove(this);

        });
    }
})(EM.AssetRepository);

//#endregion; 


//#region common  MeshInfo
(function (ar) {
    "use strict";
    var _mlKey = ar.MESH_LOCALS_KEY;
    var _meshInfoKey = ar.MESH_INFO_KEY;

    function IMeshArgumentType(meshIdOrUniqueIdOrMesh) {
        this.IsMesh = false;
        this.IsMeshId = false;
        this.IsUniqueId = false;
        this.IsString = false;
        this.IsEmptyString = false;
        this.IsEmptyObject = false;
        this.IsObject = false;
        this.IsNumber = false;
        this.Undefined = false;

        this._isCorrectMesh = function (mesh) {
            return mesh && typeof mesh === "object" && !_.isEmpty(mesh) && meshIdOrUniqueIdOrMesh.hasOwnProperty("_scene");
        }

        this._isCorrectMeshId = function (meshId) {
            return Utils.IsNotEmptyString(meshId);
        }
        this.IsCorrectMesh = function () {
            return this.IsMesh;
        }
        this.IsCorrectMeshId = function () {
            return this.IsString && !this.IsEmptyString;
        }

        if (!meshIdOrUniqueIdOrMesh) {
            this.Undefined = true;
            return this;
        }

        if (typeof meshIdOrUniqueIdOrMesh === "object") {
            this.IsObject = true;
            this.IsEmptyObject = _.isEmpty(meshIdOrUniqueIdOrMesh);
            if (this.IsEmptyObject) return this;

            if (meshIdOrUniqueIdOrMesh.hasOwnProperty("id") && meshIdOrUniqueIdOrMesh.hasOwnProperty("_scene")) {
                this.IsMesh = true;
                return this;
            }
        }

        if (typeof meshIdOrUniqueIdOrMesh === "string") {
            this.IsString = true;
            this.IsEmptyString = Utils.IsNotEmptyString(meshIdOrUniqueIdOrMesh);
            if (!this.IsEmptyString) {
                this.IsMeshId = true;
                return this;
            }
            return this;
        }

        if (typeof meshIdOrUniqueIdOrMesh === "number") {
            this.IsUniqueId = true;
            return this;
        }



        return this;

    }

    function IMeshInfo(textureId, layerName, subTypeMeshName, uniqueId, hasParent, parentName) {
        var _self = this;
        this.TextureTypeId = textureId;
        this.LayerName = layerName;
        this.SubTypeMeshName = subTypeMeshName;
        this.HasParent = hasParent;
        this.ParentName = parentName;
        this.UniqueId = uniqueId;
        this.HasUniqueId = !!uniqueId;
        this.MapTypeItem = null;
        this.GetMeshContainer = function () {
            return ar.GetMeshContainer(textureId, layerName, subTypeMeshName);
        };
        this.GetMapType = function () {
            if (_self.MapTypeItem) return _self.MapTypeItem;
            var mapTypeItem = ar.MapTypeContainer.Get(textureId);
            if (!mapTypeItem) return null;
            return _self.MapTypeItem = mapTypeItem;
        }
    }


    /**
     * создает объект IMeshInfo  из имени меша
    * перед созданием пытается найти меш в сцене и извлеч уже записанные данные, если данные существуют - возвращает их
    * @param {string} meshId 
    * @returns {object} IMeshInfo 
    */
    ar.GetMeshInfoByMeshId = function (meshId) {
        if (!Utils.IsNotEmptyString(meshId)) throw Errors.ClientNullReferenceException({ meshId: meshId }, "meshId", "AssetRepository.GetMeshInfoByMeshId");
        var _chekMesh = EM.GetMesh(meshId);
        if (_chekMesh && ar.HasLocalsInMesh(_chekMesh, _meshInfoKey, true)) ar.GetLocalsFromMesh(_chekMesh, _meshInfoKey);

        var parts = _.split(meshId, ".");
        var hasParent = false;
        var parentName = "";
        var meshName = "";

        if (parts.length > 2)
            throw Errors.ClientNotImplementedException({
                meshId: meshId,
                parts: parts
            }, "AssetRepository.GetMeshInfoByMeshId");

        if (parts.length === 2) {
            hasParent = true;
            parentName = parts[1];
            meshName = parts[0];
        }
        else meshName = parts;
        //var sections = _.split("403_space_test_2.403_space", "_");
        var sections = _.split(meshName, "_");
        var textureId = _.toNumber(sections[0]);
        var layerName = sections[1];

        // var SUBTYPE_MESH_NAMES
        var subTypeMeshName = "";
        var uniqueId = null;
        if (sections.length === 4 && Utils.IsNumeric(sections[3])) {
            uniqueId = _.toNumber(sections[3]);
            subTypeMeshName = sections[2];
        }
        else if (sections.length === 3 && Utils.IsNumeric(sections[2])) uniqueId = _.toNumber(sections[2]);
        else if (sections.length !== 2) {
            console.log("данные не соответствуют шаблону, данные не полные");
        }

        return new IMeshInfo(textureId, layerName, subTypeMeshName, uniqueId, hasParent, parentName);

    };

    /**
     * получает объект IMeshInfo  из меша или ид меша.
     * если переданный аргумент меш и он не имеет инста по ключу  AssetRepository.MESH_INFO_KEY, инфо меш инфо добавляется к  в соотв локаль
     * @param {string||object} meshOrMeshId 
     * @returns {object} IMeshInfo
     */
    ar.GetMeshInfoFromMeshOrMeshId = function (meshOrMeshId) {
        if (!meshOrMeshId) throw Errors.ClientNullReferenceException({ meshOrMeshId: meshOrMeshId }, "meshOrMeshId", "EM.MapGeometry.GetMeshInfoFromMeshOrMeshId");
        if (Utils.IsNotEmptyString(meshOrMeshId)) return ar.GetMeshInfoByMeshId(meshOrMeshId);
        else if (typeof meshOrMeshId === "object" && !_.isEmpty(meshOrMeshId)) {
            if (!meshOrMeshId.hasOwnProperty("id")) throw Errors.ClientNullReferenceException({ meshOrMeshId: meshOrMeshId }, "meshOrMeshId", "AssetRepository.GetMeshInfoFromMeshOrMeshId");
            if (ar.HasLocalsInMesh(meshOrMeshId, _meshInfoKey, true)) return ar.GetLocalsFromMesh(meshOrMeshId, _meshInfoKey);
            var meshInfo = ar.GetMeshInfoByMeshId(meshOrMeshId.id);
            ar.AddLocalsToMesh(meshOrMeshId, _meshInfoKey, meshInfo);
            return meshInfo;
        }
        throw Errors.ClientNotImplementedException({ meshOrMeshId: meshOrMeshId }, "AssetRepository.GetMeshInfoFromMeshOrMeshId");
    };

    ar.CreateMeshArgumentType = function (meshIdOrUniqueIdOrMesh) {
        return new IMeshArgumentType(meshIdOrUniqueIdOrMesh);
    };


})(EM.AssetRepository);
//#endregion; 

//#region common CloneMaterial
(function (ar) {
    "use strict";
    var _mlKey = ar.MESH_LOCALS_KEY;
    var _mKey = ar.MATERIALES_KEY;
    var _cmKey = ar.CLONE_MATERIAL_POSTFIX = "cloneMaterial";
    function _createCloneMaterialId(materialId, uniqueId) {
        var matId = ar._endsStartWithSeparator(materialId, false, false, ar.SEPARATOR);
        return ar.JoinNames([matId, uniqueId, _cmKey]);
    }
    function IMaterialInfo(baseMaterialId, cloneMaterialId, uniqueId) {
        var _self = this;
        this.BaseMaterialId = baseMaterialId;
        this.CloneMaterialId = cloneMaterialId || _createCloneMaterialId(baseMaterialId, uniqueId);
        this._getMaterial = EM.GetMaterial;
        this.GetBaseMaterial = function () {
            return _self._getMaterial(baseMaterialId);
        };
        this.GetCloneMaterial = function () {
            return _self._getMaterial(cloneMaterialId);
        };
    }

    function _addMaterialInfo(mesh, iMaterialInfo) {
        if (!mesh[_mlKey]) mesh[_mlKey] = {};
        if (!mesh[_mlKey][_mKey]) mesh[_mlKey][_mKey] = {};
        mesh[_mlKey][_mKey][iMaterialInfo.CloneMaterialId] = iMaterialInfo;
    }


    ar.GetMaterialInfoFromMesh = function (mesh, cloneMaterialName) {
        var materialInfo = ar.GetLocalsFromMesh(mesh, _mKey);
        if (!materialInfo) return null;
        return materialInfo[cloneMaterialName];
    };


    /**
     *  создает клоне материал ид, 
     *  делает клон исходного материала с этим ид,
     *  создает  IMaterialInfo  объект и добавляет его в локали меша по ключу
     *  mesh[AssetRepository.MESH_LOCALS_KEY][AssetRepository.MATERIALES_KEY][CLONED_MATERIAL_ID]  
     * @param {object} mesh 
     * @param {object} storedMaterial  базовый метериал извлеченный из храничлища
     * @returns {object} cloned material
     * throws [ClientNotImplementedException] если информация уже была доабавленна в меш
     */
    ar.CloneMaterial = function (mesh, storedMaterial, uniqueId) {
        var materialId = storedMaterial.id;
        var cloneMaterialId = _createCloneMaterialId(materialId, uniqueId);
        if (ar.GetMaterialInfoFromMesh(mesh, cloneMaterialId)) throw Errors.ClientNotImplementedException({ mesh: mesh, storedMaterial: storedMaterial }, "AssetRepository.ClonetMaterial: clone material exist in mesh");
        var cloneMaterial = storedMaterial.clone(cloneMaterialId);
        _addMaterialInfo(mesh, new IMaterialInfo(materialId, cloneMaterialId, uniqueId));
        //console.log("ar.CloneMaterial", {
        //    mesh: mesh,
        //    storedMaterial: storedMaterial,
        //    cloneMaterialId: cloneMaterialId,
        //    cloneMaterial: cloneMaterial,
        //});
        return cloneMaterial;
    }
})(EM.AssetRepository);


//#endregion; 

//#region PLANET ENVEROTMEN MODULE
(function (ar) {
    "use strict";
    var IPLANET_ENVEROTMENT_KEY = ar.IPLANET_ENVEROTMENT_KEY = "_iPlanetEnverotment";
    var PLANET_ENV_MESH_ID = ar.PLANET_ENV_MESH_ID = "skybox_planet"; //#region Skybox

    function IPlanetEnverotmentItem(baseParentMesh, skyboxMesh, groundMesh, planetId) {
        this.Base = baseParentMesh;
        this.Env = skyboxMesh;
        this.Ground = groundMesh;
        this.PlanetId = planetId;
        this.IsVisible = null;
    }

    function IPlanetEnverotment(skyboxMesh, groundMesh, skyBoxMaterialMesh, textureTypeId, onShow, onHide) {
        var _self = this;
        var hiddenPosition = ar.HIDDEN_POSITION.clone();
        var zeroPosition = BABYLON.Vector3.Zero();
        this.TextureTypeId = textureTypeId;
        this.GroundMeshId = groundMesh.id;
        this.SkyBoxMaterialId = skyBoxMaterialMesh.material.id;
        this._emptySkayBoxMaterialId = skyboxMesh.material.id;
        this._skyBoxMesh = skyboxMesh;
        this._groundMesh = groundMesh;
        this._skyBoxMaterialMesh = skyBoxMaterialMesh;
        this._isVisible = false;
        this._setVisible = function (show, iPlanetEnverotmentItem) {
            _self._isVisible = show;
            var meshes = [iPlanetEnverotmentItem.Base, iPlanetEnverotmentItem.Ground, iPlanetEnverotmentItem.Env];
            EM.SetVisibleGroupByMeshes(meshes, show, true);
            if (show) {
                _self._setToPosition(zeroPosition, iPlanetEnverotmentItem.Base);
                _self.OnShow(iPlanetEnverotmentItem);
            }
            else {
                _self._setToPosition(hiddenPosition, iPlanetEnverotmentItem.Base);
                _self.OnHilde(iPlanetEnverotmentItem);
            }

        };
        this._setToPosition = function (newPosition, baseParentMesh) {
            skyboxMesh.position = groundMesh.position = baseParentMesh.position = newPosition.clone();
            return skyboxMesh.position;
        };

        this.GetEnverotment = function (baseParentMesh, show, planetId) {
            if (skyboxMesh.material.id !== _self.SkyBoxMaterialId) _self._skyBoxMesh.material = _self._skyBoxMaterialMesh.material;
            var IPE = new IPlanetEnverotmentItem(baseParentMesh, _self._skyBoxMesh, _self._groundMesh, planetId);
            Object.defineProperty(IPE, "IsVisible", {
                get: function () {
                    return _self._isVisible;
                },
                set: function (value) {
                    _self._setVisible(value, IPE);
                }
            });
            IPE.IsVisible = show;
            return IPE;
        };

        this.OnShow = function (iPlanetEnverotmentItem) {
            if (onShow instanceof Function) onShow(iPlanetEnverotmentItem, _self);

        };
        this.OnHilde = function (iPlanetEnverotmentItem) {
            if (onHide instanceof Function) onHide(iPlanetEnverotmentItem, _self);
        };

    }
    ar.CreateIPlanetEnverotment = function (groundMesh, skyBoxMaterialMesh, textureTypeId, onShow, onHide) {
        var skyboxMesh = EM.GetMesh(PLANET_ENV_MESH_ID);
        return new IPlanetEnverotment(skyboxMesh, groundMesh, skyBoxMaterialMesh, textureTypeId, onShow, onHide);

    };

    //#endregion;

    //#region Ground


    function getPlanetGroundByTextureTypeId(textureTypeId) {
        var meshId = planetGroundMeshIdTemplate(textureTypeId);
        console.log("getPlanetGroundByTextureTypeId", meshId);

        return help.GetMesh(meshId);
    };

    /**
     * DEPRECATED 
     * @param {} sceneName 
     * @param {} textureTypeId 
     * @param {} onCreateMaterial 
     * @returns {} 
     */
    function createGroundMeshByByTextureTypeId(sceneName, textureTypeId, onCreateMaterial) {
        throw Errors.ClientDeprecatedException({ sceneName: sceneName, textureTypeId: textureTypeId, onCreateMaterial: onCreateMaterial }, "createGroundMeshByByTextureTypeId");
        var meshId = planetGroundMeshIdTemplate(textureTypeId);
        var heightMapUrl = getHeightPath(textureTypeId);
        var width = envCubeSide;
        var height = width;
        var minHeight = 0;
        var maxHeight = 30;
        var subdivisions = 200;
        var updatable = false;
        var successCallback = function () { };
        var mesh = BABYLON.Mesh.CreateGroundFromHeightMap(meshId, heightMapUrl, width, height, subdivisions, minHeight, maxHeight, EM.Scene, updatable, successCallback);

        var matId = createGroundMaterialId(textureTypeId);
        var mat = help.GetMaterial(matId);
        if (mat) console.log("createGroundMeshByByTextureTypeId.materialExist in scene", { baseCatalog: baseCatalog, textureTypeId: textureTypeId, existMaterial: mat });
        else {
            mat = onCreateMaterial(help.CreateBaseMaterial(matId));
            if (!mat || mat.id !== matId) throw new Error("material not exist or not correct");
        }
        mesh.material = mat;
        return mesh;
    };

    ar.GetIPlanetEnverotment = function (textureTypeId) {
        var item = ar.GetTypeItem(textureTypeId);
        if (!item) return null;
        var meshContainer = item.GetMeshContainer(ar.LAYER_NAMES.ground);
        if (!meshContainer) return null;
        if (!meshContainer.hasOwnProperty(IPLANET_ENVEROTMENT_KEY)) return null;
        return meshContainer[IPLANET_ENVEROTMENT_KEY];
    }
    //#endregion;

})(EM.AssetRepository);
//#endregion; 


//#region Base
(function (ar) {
    "use strict";
    ar._initBase = function (gameObjectVersion, useFromLocla, motherCatalogUrl) {

        //#region Declare
        /**
         * последовательность  "back.jpg", "top.jpg", "right.jpg", "front.jpg", "bottom.jpg", "left.jpg"
         */
        ar.SKYBOXE_NAMES = ["back.jpg", "top.jpg", "right.jpg", "front.jpg", "bottom.jpg", "left.jpg"];
        /**
         * Vector3 1e7,1e7,1e7
         */
        var HIDDEN_POSITION = ar.HIDDEN_POSITION = EM.HIDDEN_POSITION;
        var GAME_OBJECTS_VERSION = ar.GAME_OBJECTS_VERSION = gameObjectVersion;
        var USE_FROM_LOCAL = ar.USE_FROM_LOCAL = useFromLocla;
        var GAME_OBJECTCS_CATALOG = ar.GAME_OBJECTCS_CATALOG = Utils.CdnManager.GetGameObjectsCatalog(GAME_OBJECTS_VERSION, USE_FROM_LOCAL);

        var TEXTURE_TYPES = ar.TEXTURE_TYPES = {
            Dffuse: "diffuse",
            Bump: "bump",
            Specular: "specular",
            Ambient: "ambient",
            Emissive: "emissive",
            Opacity: "opacity",
            Reflection: "reflection",
            Light: "light",
            Height: "height",
            Refraction: "refraction"
        };

        // game_object type and subdirectoryes game_object    
        function IGameObject(mother, universe, galaxy, sector, star, planet, moon) {
            this.mother = mother;
            this.universe = universe;
            this.galaxy = galaxy;
            this.sector = sector;
            this.star = star;
            this.planet = planet;
            this.moon = moon;
        }

        var GO_TYPE_NAMES = ar.GO_TYPE_NAMES = new IGameObject("mother", "universe", "galaxy", "sector", "star", "planet", "moon");

        var LAYER_NAMES = ar.LAYER_NAMES = {
            space: "space",
            ground: "ground",
            env: "env"
        };


        var BASE_SUB_NAMES = ar.BASE_SUB_NAMES = {
            regular: "regular",
            cloud: "cloud",
            ring: "ring"
        };

        /**
        * extend from BASE_SUB_NAMES
        */
        var ADVANCED_NAMES = ar.ADVANCED_NAMES = _.extend({
            sprite: "sprite",
            material: "material"
        }, BASE_SUB_NAMES);

        /**
         * extend from BASE_SUB_NAMES
         */
        var SUBTYPE_MESH_NAMES = ar.SUBTYPE_MESH_NAMES = (_.extend({
            empty: "empty"
        }, ADVANCED_NAMES));

        /**
         * extend from BASE_SUB_NAMES
         */
        var SUBTYPE_MATERIAL_NAMES = ar.SUBTYPE_MATERIAL_NAMES = _.extend({
            click: "click",
            hover: "hover"
        }, BASE_SUB_NAMES);

        var EXTENTIONS = {
            jpg: ".jpg",
            png: ".png",
            babylon: ".babylon",
            hdr: ".hdr"
        }
        EXTENTIONS.cleanPoint = function (ext) {
            if (_.startsWith(ext, ".")) return ext.substring(1);
            return ext;
        };
        ar.EXTENTIONS = EXTENTIONS;

        var SEPARATOR = ar.SEPARATOR = "_";


        function endsWithSeparator(section, setOrRemoveSeparator, _separator) {
            return Utils.Parce.EndsWithSeparatorAndReplace(section, setOrRemoveSeparator, _separator || SEPARATOR);
        }
        function startsWithSeparator(section, setOrRemoveSeparator, _separator) {
            return Utils.Parce.StartsWithSeparatorAndReplace(section, setOrRemoveSeparator, _separator || SEPARATOR);
        }
        function _getUrlInfo(url) {
            return Utils.Parce.GetUrlInfo(url);

        }

        function createSubDirUrl(baseDir, subDirName) {
            var _baseDir = endsWithSeparator(baseDir, true, "/");
            var _subDirName = startsWithSeparator(endsWithSeparator(subDirName, true, "/"), false);
            return _baseDir + _subDirName;
        }
        function _createGoCatalogUrl(goTypeNmae) {
            return createSubDirUrl(GAME_OBJECTCS_CATALOG, goTypeNmae);
        }

        var GO_CATALOG_URLS = ar.GO_CATALOG_URLS = new IGameObject(motherCatalogUrl,
                                                                                _createGoCatalogUrl(GO_TYPE_NAMES.universe),
                                                                                _createGoCatalogUrl(GO_TYPE_NAMES.galaxy),
                                                                                _createGoCatalogUrl(GO_TYPE_NAMES.sector),
                                                                                _createGoCatalogUrl(GO_TYPE_NAMES.star),
                                                                                _createGoCatalogUrl(GO_TYPE_NAMES.planet),
                                                                                _createGoCatalogUrl(GO_TYPE_NAMES.moon));




        //#endregion;

        //#region Helpers
        var help = EM.GetHelpers();

        function _isNotEmptyString(stringName) {
            return Utils.IsNotEmptyString(stringName);
        }


        /**
           * @param {array} nameParts 
          * @param {string} _separator 
          * @returns {string} 
          */
        function _join(nameParts, _separator) {
            if (!_separator) _separator = SEPARATOR;
            return nameParts.join(_separator);
        }

        function _createObjectName(layerName, advancedName) {
            if (advancedName) return _join([layerName, advancedName]);
            else return layerName;
        }

        function _createTextureFileName(textureTypeId, objectFullName, textureType, ext) {
            var _id = endsWithSeparator(startsWithSeparator(textureTypeId, false), true);
            var _baseType = endsWithSeparator(startsWithSeparator(objectFullName, false), true);
            var _textureType = endsWithSeparator(startsWithSeparator(textureType, false), false);
            var _ext = endsWithSeparator(startsWithSeparator(ext, true, "."), false);
            return _id + _baseType + _textureType + _ext;
        }

        function _createOriginalMeshIdTemplate(textureTypeId, layerName, subtypeMeshName) {
            var names = [textureTypeId.toString(), layerName];
            if (_isNotEmptyString(subtypeMeshName) && subtypeMeshName !== SUBTYPE_MESH_NAMES.regular) names.push(subtypeMeshName);
            return _join(names);
        }

        function _combineMeshIds(originalMeshId, uniqueId, parentMeshId) {
            if (!uniqueId && !parentMeshId) return originalMeshId;
            if (uniqueId && !parentMeshId) return _join([originalMeshId, uniqueId.toString()]);
            if (parentMeshId) {
                parentMeshId = endsWithSeparator(startsWithSeparator(parentMeshId, true, "."), false, ".");
                if (!uniqueId) return originalMeshId + parentMeshId;
                return _join([originalMeshId, uniqueId.toString() + parentMeshId]);
            }
            throw Errors.ClientNotImplementedException({
                orignMeshId: originalMeshId,
                uniqueId: uniqueId,
                parentMeshId: parentMeshId
            }, "AssetRepository._initBase._combineMeshIds");
        }

        function _createFullMeshIdTemplate(textureTypeId, layerName, subtypeMeshName, uniqueId, parentMeshId) {
            var orignMeshId = _createOriginalMeshIdTemplate(textureTypeId, layerName, subtypeMeshName);
            return _combineMeshIds(orignMeshId, uniqueId, parentMeshId);
        }

        function _materialIdTemplate(textureTypeId, layerName, advancedName) {
            var names = [textureTypeId.toString(), layerName];
            if (_isNotEmptyString(advancedName)) names.push(advancedName);
            return _join(names);
        }


        function _getScenePrefix(sceneName) {
            if (_isNotEmptyString(sceneName)) sceneName = endsWithSeparator(sceneName, true, ".");
            else sceneName = "";
            return sceneName;
        }


        ar.GetMeshIdByMeta = function (meta, uniqueId, parentMeshId) {
            function getBaseMeshId() {
                return _createOriginalMeshIdTemplate(meta.TextureTypeId, meta.LayerName, meta._advancedName);
            };
            // ReSharper disable once FunctionsUsedBeforeDeclared
            var meshContainer = new IMeshContainer(getBaseMeshId);
            return meshContainer.GetMeshId(uniqueId, parentMeshId);
        };

        ar.GetPlanetCatalog = function (textureTypeId) {
            var pc = GO_CATALOG_URLS.planet;
            if (!textureTypeId) return pc;
            return createSubDirUrl(pc, textureTypeId.toString());
        }
        ar.JoinNames = _join;
        ar._endsStartWithSeparator = function (section, setOrRemoveStartSeparator, setOrRemoveEndSeparator, separator) {
            return endsWithSeparator(startsWithSeparator(section, setOrRemoveStartSeparator, separator), setOrRemoveEndSeparator, separator);
        };

        ar._createOriginalMeshIdTemplate = _createOriginalMeshIdTemplate;

        //#endregion;


        //#region GroupType
        function TextureTypeRange(name, from, to) {
            this.Name = name;
            this.From = from;
            this.To = to;
            return this;
        };

        var mapTypes = ar.MapTypes = EM.MapGeometry.MapTypes;
        var GAME_TEXTURE_ID_RANGES = ar.GAME_TEXTURE_ID_RANGES = {
            Galaxy: new TextureTypeRange(mapTypes.Galaxy.toLowerCase(), 1, 100),
            Sector: new TextureTypeRange(mapTypes.Sector.toLowerCase(), 201, 300),
            Star: new TextureTypeRange(mapTypes.Star.toLowerCase(), 301, 400),
            Earth: new TextureTypeRange(mapTypes.Earth.toLowerCase(), 401, 500),
            Gas: new TextureTypeRange(mapTypes.Gas.toLowerCase(), 501, 600),
            IceGas: new TextureTypeRange(mapTypes.IceGas.toLowerCase(), 601, 700),
            Moon: new TextureTypeRange(mapTypes.Moon.toLowerCase(), 901, 1000),
            Mother: new TextureTypeRange(mapTypes.Mother.toLowerCase(), 2000, 2000),
            Universe: new TextureTypeRange(mapTypes.Universe.toLowerCase(), 4001, 4100)
        };

        function _equalRange(textureTypeId, range) {
            return textureTypeId >= range.From && textureTypeId <= range.To;
        }
        function getGroupTypeName(textureTypeId) {
            function eq(range) {
                return _equalRange(textureTypeId, range);
            }
            if (eq(GAME_TEXTURE_ID_RANGES.Mother)) return GAME_TEXTURE_ID_RANGES.Mother.Name;
            if (eq(GAME_TEXTURE_ID_RANGES.Galaxy)) return GAME_TEXTURE_ID_RANGES.Galaxy.Name;
            if (eq(GAME_TEXTURE_ID_RANGES.Sector)) return GAME_TEXTURE_ID_RANGES.Sector.Name;
            if (eq(GAME_TEXTURE_ID_RANGES.Star)) return GAME_TEXTURE_ID_RANGES.Star.Name;
            if (eq(GAME_TEXTURE_ID_RANGES.Earth)) return GAME_TEXTURE_ID_RANGES.Earth.Name;
            if (eq(GAME_TEXTURE_ID_RANGES.Gas)) return GAME_TEXTURE_ID_RANGES.Gas.Name;
            if (eq(GAME_TEXTURE_ID_RANGES.IceGas)) return GAME_TEXTURE_ID_RANGES.IceGas.Name;
            if (eq(GAME_TEXTURE_ID_RANGES.Moon)) return GAME_TEXTURE_ID_RANGES.Moon.Name;
            if (eq(GAME_TEXTURE_ID_RANGES.Universe)) return GAME_TEXTURE_ID_RANGES.Universe.Name;
            return false;
        };


        function mapTextureIdToCatalogUrl(textureTypeId) {
            var _tId = null;
            if (typeof textureTypeId === "number") _tId = textureTypeId;
            else if (typeof textureTypeId === "string") _tId = +textureTypeId;
            if (!_tId) throw new Error("arg --textureTypeId-- is not convertable to numeric type");
            function eq(range) {
                return _equalRange(textureTypeId, range);
            }

            if (eq(GAME_TEXTURE_ID_RANGES.Mother)) return motherCatalogUrl;
            if (eq(GAME_TEXTURE_ID_RANGES.Earth)) return GO_CATALOG_URLS.planet;
            if (eq(GAME_TEXTURE_ID_RANGES.Gas)) return GO_CATALOG_URLS.planet;
            if (eq(GAME_TEXTURE_ID_RANGES.IceGas)) return GO_CATALOG_URLS.planet;
            if (eq(GAME_TEXTURE_ID_RANGES.Moon)) return GO_CATALOG_URLS.moon;
            if (eq(GAME_TEXTURE_ID_RANGES.Star)) return GO_CATALOG_URLS.star;
            if (eq(GAME_TEXTURE_ID_RANGES.Sector)) return GO_CATALOG_URLS.sector;
            if (eq(GAME_TEXTURE_ID_RANGES.Galaxy)) return GO_CATALOG_URLS.galaxy;
            if (eq(GAME_TEXTURE_ID_RANGES.Universe)) return GO_CATALOG_URLS.universe;

            throw new Errors.ClientNotImplementedException({ argTextureTypeId: textureTypeId, GAME_TEXTURE_ID_RANGES: GAME_TEXTURE_ID_RANGES }, "Catalog by textyreId:{" + textureTypeId + "} not exist");
        }


        ar._initGroup = function (createItem, groupIds, notForEach) {
            if (!notForEach) {
                _.forEach(groupIds, function (textureTypeId, idx) {
                    createItem(textureTypeId);
                });
            } else createItem();

        };
        ar.GetGroupTypeName = getGroupTypeName;
        ar.MapTextureIdToCatalogUrl = mapTextureIdToCatalogUrl;


        //#endregion;

        //#region TypeList getTypeItem   
        function _getTypeItem(textureTypeId) {
            if (ar.TypeList.hasOwnProperty(textureTypeId)) return ar.TypeList[textureTypeId];
            return null;
        };

        function _getCss(textureTypeId) {
            var item = _getTypeItem(textureTypeId);
            if (!item) return null;
            return _getTypeItem(textureTypeId).Css;
        };

        function _getIconSelectCss(textureTypeId) {
            var css = _getCss(textureTypeId);
            if (!css) return null;
            return css.IconSelect;
        };

        function _getMeshId(textureTypeId, layerName, subTypeMeshName, uniqueId, parentMehsId) {
            var item = _getTypeItem(textureTypeId);
            if (!item) return null;
            return item.Pub.GetMeshId(layerName, subTypeMeshName, uniqueId, parentMehsId);
        }

        function _getMeshContainer(textureTypeId, layerName, meshSubTypeName) {
            var item = _getTypeItem(textureTypeId);
            if (!item) return null;
            return item.Pub.GetMeshContainer(layerName, meshSubTypeName);
        }

        function _getMaterial(textureTypeId, layerName, subTypeMaterialName) {
            var item = _getTypeItem(textureTypeId);
            if (!item) return null;
            return item.Pub.GetMaterial(layerName, subTypeMaterialName);
        }

        function _getMaterialId(textureTypeId, layerName, subTypeMaterialName) {
            var item = _getTypeItem(textureTypeId);
            if (!item) return null;
            return item.Pub.GetMaterialId(layerName, subTypeMaterialName);
        }


        ar.GetTypeItem = function (textureTypeId) {
            var item = _getTypeItem(textureTypeId);
            if (!item) return null;
            return item.Pub;
        };
        ar.GetCss = _getCss;
        ar.GetIconSelectCss = _getIconSelectCss;

        function _createMethodName(methodType, layerName, subTypeName, mathodTargetName) {
            return _.upperFirst(methodType) + _.upperFirst(layerName) + _.upperFirst(subTypeName) + _.upperFirst(mathodTargetName);
        }

        function _createMeshMethods(layerName, subTypeName) {
            ar[_createMethodName("Get", layerName, subTypeName, "MeshContainer")] = function (textureTypeId) {
                return _getMeshContainer(textureTypeId, layerName, subTypeName);
            }
            ar[_createMethodName("Get", layerName, subTypeName, "MeshId")] = function (textureTypeId, uniqueId, parentMehsId) {
                return _getMeshId(textureTypeId, layerName, subTypeName, uniqueId, parentMehsId);
            }
            ar[_createMethodName("Create", layerName, subTypeName, "MeshId")] = function (textureTypeId, uniqueId, parentMehsId) {
                return _createFullMeshIdTemplate(textureTypeId, layerName, subTypeName, uniqueId, parentMehsId);
            }

            ar[_createMethodName("Get", layerName, subTypeName, "Mesh")] = function (textureTypeId, uniqueId, parentMehsId) {
                var item = _getTypeItem(textureTypeId);
                if (!item) return null;
                return item.Pub.GetMesh(layerName, subTypeName, uniqueId, parentMehsId);
            }
        }

        function _createMaterailMethods(layerName, subTypeMaterialName) {
            ar[_createMethodName("Get", layerName, subTypeMaterialName, "Material")] = function (textureTypeId) {
                return _getMaterial(textureTypeId, layerName, subTypeMaterialName);
            }
            ar[_createMethodName("Get", layerName, subTypeMaterialName, "MaterialId")] = function (textureTypeId) {
                return _getMaterialId(textureTypeId, layerName, subTypeMaterialName);
            }
            ar[_createMethodName("Create", layerName, subTypeMaterialName, "MaterialId")] = function (textureTypeId) {
                return _materialIdTemplate(textureTypeId, layerName, subTypeMaterialName);
            }

        }

        // #region Space

        // #region Mesh
        ar.GetSpaceRegularMeshContainer = null;
        ar.GetSpaceCloudMeshContainer = null;
        ar.GetSpaceRingMeshContainer = null;
        ar.GetSpaceMaterialMeshContainer = null;
        ar.GetSpaceEmptyMeshContainer = null;
        ar.GetSpaceSpriteMeshContainer = null;

        ar.GetSpaceRegularMesh = null;
        ar.GetSpaceCloudMesh = null;
        ar.GetSpaceRingMesh = null;
        ar.GetSpaceMaterialMesh = null;
        ar.GetSpaceEmptyMesh = null;
        ar.GetSpaceSpriteMesh = null;


        ar.GetSpaceRegularMeshId = null;
        ar.GetSpaceCloudMeshId = null;
        ar.GetSpaceRingMeshId = null;
        ar.GetSpaceMaterialMeshId = null;
        ar.GetSpaceEmptyMeshId = null;
        ar.GetSpaceSpriteMeshId = null;

        ar.CreateSpaceRegularMeshId = null;
        ar.CreateSpaceCloudMeshId = null;
        ar.CreateSpaceRingMeshId = null;
        ar.CreateSpaceMaterialMeshId = null;
        ar.CreateSpaceEmptyMeshId = null;
        ar.CreateSpaceSpriteMeshId = null;



        _createMeshMethods(LAYER_NAMES.space, SUBTYPE_MESH_NAMES.regular);
        _createMeshMethods(LAYER_NAMES.space, SUBTYPE_MESH_NAMES.cloud);
        _createMeshMethods(LAYER_NAMES.space, SUBTYPE_MESH_NAMES.ring);
        _createMeshMethods(LAYER_NAMES.space, SUBTYPE_MESH_NAMES.material);
        _createMeshMethods(LAYER_NAMES.space, SUBTYPE_MESH_NAMES.empty);
        _createMeshMethods(LAYER_NAMES.space, SUBTYPE_MESH_NAMES.sprite);

        ar.GetMeshContainer = _getMeshContainer;

        // #endregion

        // #region Material

        ar.GetSpaceRegularMaterial = null;
        ar.GetSpaceClickMaterial = null;
        ar.GetSpaceHoverMaterial = null;
        ar.GetSpaceCloudMaterial = null;
        ar.GetSpaceRingMaterial = null;

        ar.GetSpaceRegularMaterialId = null;
        ar.GetSpaceClickMaterialId = null;
        ar.GetSpaceHoverMaterialId = null;
        ar.GetSpaceCloudMaterialId = null;
        ar.GetSpaceRingMaterialId = null;


        ar.CreateSpaceRegularMaterialId = null;
        ar.CreateSpaceClickMaterialId = null;
        ar.CreateSpaceHoverMaterialId = null;
        ar.CreateSpaceCloudMaterialId = null;
        ar.CreateSpaceRingMaterialId = null;

        _createMaterailMethods(LAYER_NAMES.space, SUBTYPE_MATERIAL_NAMES.regular);
        _createMaterailMethods(LAYER_NAMES.space, SUBTYPE_MATERIAL_NAMES.click);
        _createMaterailMethods(LAYER_NAMES.space, SUBTYPE_MATERIAL_NAMES.hover);
        _createMaterailMethods(LAYER_NAMES.space, SUBTYPE_MATERIAL_NAMES.cloud);
        _createMaterailMethods(LAYER_NAMES.space, SUBTYPE_MATERIAL_NAMES.ring);
        // #endregion

        // #endregion


        //#endregion;


        //#region IMapTypeItem
        function IMapTypeItem(textureTypeId, baseMapTypeName, subMapTypeName) {

            this.TextureTypeId = textureTypeId;

            this._mapType = null;
            this.MapType = null;
            this.MapTypeLower = null;

            this._subMapType = null;
            this.SubMapType = null;
            this.SubMapTypeLower = null;

            this._setSub = function (subType) {
                this._subMapType = subType || "";
                this.SubMapType = _.upperFirst(this._subMapType);
                this.SubMapTypeLower = this._subMapType.toLowerCase();
            }
            this._setMapType = function (baseMapType) {
                this._mapType = baseMapType || "";
                this.MapType = _.upperFirst(this._mapType);
                this.MapTypeLower = this._mapType.toLowerCase();
            };
            this._setMapType(baseMapTypeName);
            this.hasSubType = function () {
                return _isNotEmptyString(this._subMapType);
            }
            if (subMapTypeName) {
                this._setSub(subMapTypeName);
            }
        }

        function IMapTypeStorage() {
            var _self = this;
            this.GetOrAdd = function (textureId, baseMapTypeName, subMapTypeName) {
                if (!_self._collection[textureId]) _self._collection[textureId] = new IMapTypeItem(textureId, baseMapTypeName, subMapTypeName);
                return _self._collection[textureId];
            };
            this._collection = {};
            this.AddCollection = function (textureIds, baseMapTypeName, subMapTypeName) {
                _.forEach(textureIds, function (textureId, idx) {
                    _self._collection[textureId] = new IMapTypeItem(textureId, baseMapTypeName, subMapTypeName);
                });
            };
            this.UpdateItem = function (iMapTypeItem) {
                var _src = "MapTypeContainer.UpdateItem";
                if (!iMapTypeItem) throw Errors.ClientNullReferenceException(iMapTypeItem, "iMapTypeItem", _src);
                if (typeof iMapTypeItem !== "object") throw Errors.ClientTypeErrorException(iMapTypeItem, iMapTypeItem, "object/IMapTypeItem", _src);
                if (!iMapTypeItem.TextureTypeId) throw Errors.ClientInvalidDataException(iMapTypeItem, "MapTypeContainer.UpdateItem", _src);
                if (!_self._collection[iMapTypeItem.TextureTypeId]) _self._collection[iMapTypeItem.TextureTypeId] = iMapTypeItem;
                else Utils.UpdateObjData(_self._collection[iMapTypeItem.TextureTypeId], iMapTypeItem);
                return _self._collection[iMapTypeItem.TextureTypeId];

            };
            this.Get = function (textureId) {
                return _self._collection[textureId];
            };
        }

        ar.MapTypeContainer = new IMapTypeStorage();
        //#endregion;


        //#region iTypeItem


        function ITypeCatalog(textureTypeId, innerGatalogName) {
            var _self = this;
            this._textureId = textureTypeId;
            this.CatalogUrl = mapTextureIdToCatalogUrl(textureTypeId);
            this.InnerCatalogUrl = null;
            this.InnerCatalogName = null;
            /**
             * не влияет на локальные поля
             * @param {string} subDirName    can be null default this.InnerCatalogName
             * @param {string} baseUrl   can be null default this.CatalogUrl 
             * @returns {string} subDirUrl
             */
            this.CreateSubDirUrl = function (subDirName, baseUrl) {
                if (!subDirName && !_self.InnerCatalogName) return null;
                var _subDir = subDirName ? subDirName : _self.InnerCatalogName;
                var _baseUrl = baseUrl ? baseUrl : this.CatalogUrl;
                return createSubDirUrl(_baseUrl, _subDir);
            };

            if (_isNotEmptyString(innerGatalogName)) {
                _self.InnerCatalogName = endsWithSeparator(startsWithSeparator(innerGatalogName, false, "/"), false);
                return this.InnerCatalogUrl = this.CreateSubDirUrl();
            }
            return this;
        }


        var cssBase = {
            _spriteMapPrefix: "sprite_map_",
            _textureCssPrefix: "texture_",
            _planetPrefix: "planet_",
            _separator: "_",
            xl: "xl",
            m: "m",
            ms: "ms",
            s: "s",
            sx: "sx",
            xs: "xs",
            _cleanSeparator: function (name) {
                if (!_isNotEmptyString(name)) return "";
                return this.startsWithSeparator(this.endsWithSeparator(name, false), false);
            },
            startsWithSeparator: function (name, setOrRemoveSeparator) {
                return startsWithSeparator(name, setOrRemoveSeparator, this._separator);
            },
            endsWithSeparator: function (name, setOrRemoveSeparator) {
                return endsWithSeparator(name, setOrRemoveSeparator, this._separator);
            },
            convertCssNameToClass: function (cssName) {
                return startsWithSeparator(cssName, true, ".");
            }
        };

        function ICss(textureTypeId, mapTypeName, spriteCatalogUrl) {
            var _self = _.extend(this, cssBase);
            _self._textureTypeId = textureTypeId;
            _self._mapTypeName = mapTypeName;
            _self._mapTypeLowerName = mapTypeName.toLowerCase();
            _self.IconSelect = "";
            _self.TextureCss = null;
            _self.Sprite = null;
            _self._spriteCatalogUrl = spriteCatalogUrl;
            _self.GroupName = null;
            _self.DetailCss = null;
            _self.MediumCss = null;
            _self.SmallCss = null;
            _self.CreateSelectors = null;

            _self.InitCss = function () {
                // sprite_control_icons m map-object jumptomother
                //select2-sprite sprite_map_mother mother texture_2000 m 
                //sprite_map_planet_gas xl texture_503 planet_gas
                var textureCss = _self._textureCssPrefix + _self._textureTypeId;
                var groupName = "";
                var name = _self._mapTypeLowerName;
                if (name === "earth" || name === "gas" || name === "icegas") groupName = _self._planetPrefix + name;
                else groupName = name;
                var spriteName = _self._spriteMapPrefix + groupName;

                if (name === "mother") {
                    spriteName = "sprite_control_icons";
                    groupName = "map-object";
                    textureCss = "jumptomother";
                }

                function createFull(size) {
                    return spriteName + " " + groupName + " " + textureCss + " " + size;
                };


                _self.TextureCss = textureCss;
                _self.Sprite = spriteName;
                _self.GroupName = groupName;
                _self.DetailCss = createFull(_self.xl);
                _self.MediumCss = createFull(_self.m);
                _self.SmallCss = createFull(_self.s);
                _self.СreateSelectors = createFull;
                _self.IconSelect = _self.SmallCss;
                _self.SetIconSelect = function (newCss) {
                    _self.IconSelect = newCss;
                };
            };
            return _self;
        }

        function IGameObjectMeta(textureTypeId, layerName, advancedName) {
            this.LayerName = layerName;
            this.TextureTypeId = textureTypeId;
            this._advancedName = "";
            if (!advancedName) advancedName = ADVANCED_NAMES.regular;
            this.AdvancedName = advancedName;
            if (advancedName !== ADVANCED_NAMES.regular) this._advancedName = advancedName;
            this.ObjectName = _createObjectName(this.LayerName, this._advancedName);
        }



        function ITextureItem(catalog, iGameObjectMeta, textureTypeName, ext) {
            var SHOW_CONSOLE = false;
            var _self = this;
            _self.LayerName = null;
            _self.TextureTypeId = null;
            _self.ObjectName = null;

            _self._texture = null;
            _self.TextureTypeName = null;
            _self.Ext = null;
            _self.FileName = null;
            _self.CubeNames = null;
            _self.Catalog = null;
            _self.Url = null;
            _self.Created = false;
            _self._externalTextureType = null;
            _self.ExternalTextureHasCorrectInfo = false;

            function _init() {
                if (!iGameObjectMeta || !catalog || !textureTypeName) return;
                _self.TextureTypeId = iGameObjectMeta.TextureTypeId;
                _self.TextureTypeName = textureTypeName;
                _self.ObjectName = iGameObjectMeta.ObjectName;
                _self.LayerName = iGameObjectMeta.LayerName;
                _self.Ext = ext ? ext : EXTENTIONS.jpg;
                _self.FileName = _createTextureFileName(_self.TextureTypeId, _self.ObjectName, _self.TextureTypeName, _self.Ext);
                _self.Catalog = catalog;
                _self.Url = _self.Catalog + _self.FileName;
            }

            _init();

            /**
             * 
             * @returns {object} BABYLON.Texture
             */
            _self.GetOrCreateTexture = function (url) {
                if (_self.Created) return _self._texture;
                if (url) {
                    var urlInfo = _getUrlInfo(url);
                    _self.Url = urlInfo.Url;
                    _self.FileName = urlInfo.FileName;
                    _self.Catalog = urlInfo.Catalog;
                    console.log("GetOrCreateTexture", { _self: _self });
                }

                _self._texture = help.CreateTexture(_self.Url);
                _self.Created = true;
                return _self._texture;
            };

            /**
             * 
             * @param {string} cubeNames  can be null default  EM.AssetRepository.SKYBOXE_NAMES     in current directory
             * @param {string} dir      can be null default currentDir    
             * @returns {object} BABYLON.CubeTexture 
             */
            _self.GetOrCreateCubeTexture = function (cubeNames, dir) {
                if (_self.Created) return _self._texture;
                if (dir) {
                    _self.Url = null;
                    _self.Catalog = dir;
                }
                _self.CubeNames = cubeNames ? cubeNames : ar.SKYBOXE_NAMES;
                _self._texture = new BABYLON.CubeTexture(_self.Catalog, EM.Scene, _self.CubeNames);
                _self.Created = true;
                return _self._texture;

            };
            _self.GetOrCreateHdrTexture = function (name, dir) {
                if (_self.Created) return _self._texture;
                if (dir) {
                    _self.Url = null;
                    _self.Catalog = dir;
                }

                var url = dir + name + ar.EXTENTIONS.hdr;

                _self._texture = new BABYLON.HDRCubeTexture(url, EM.Scene, 512);
                _self.Created = true;
                return _self._texture;
            }

            /**
             * 
             * @param {string} fileName    can be null if file na,e from template
             * @param {string} dir    can be null if is current dir
             * @returns {object}  BABYLON.CubeTexture
             */
            _self.GetOrCreateCubeTextureFromOneFile = function (fileName, dir) {
                if (_self.Created) return _self._texture;
                var hasChange = false;
                if (dir) {
                    _self.Catalog = dir;
                    hasChange = true;
                }
                if (fileName) {
                    _self.FileName = fileName;
                    _self.Ext = _self.FileName.substring(_self.FileName.length - 4);
                    hasChange = true;
                }
                if (hasChange) _self.Url = _self.Catalog + _self.FileName;
                _self.CubeNames = [_self.FileName, _self.FileName, _self.FileName, _self.FileName, _self.FileName, _self.FileName];
                _self._texture = new BABYLON.CubeTexture(_self.Catalog, EM.Scene, _self.CubeNames);
                _self.Created = true;
                return _self._texture;
            };

            /**
             * при установке текстуры новые данные берутся из урл текстуры, записываются только те данные которые проходят валидацию по именованиям
             * @param {string} textureTypeName see  EM.AssetRepository.TEXTURE_TYPES
             * @param {object} babylonTexture   BABYLON.Texture
             * @returns {object}  ITextureItem обновленную информацию после установки  новой текстуры
             * exceptions [ClientNullReferenceException] 
             */
            _self.SetExternalTexture = function (textureType, babylonTexture) {
                if (!babylonTexture) throw Errors.ClientNullReferenceException({ ITextureItem: _self, babylonTexture: babylonTexture }, "babylonTexture", "ITextureItem.SetExternalTexture");
                _self.TextureTypeName = textureType;
                _self.Url = babylonTexture.url;
                _self._texture = babylonTexture;
                _self.Created = true;
                var fileInfo = _getUrlInfo(_self.Url);
                _self.Catalog = fileInfo.Catalog;
                _self.FileName = null;
                _self.Ext = null;
                _self.TextureTypeId = null;
                _self.LayerName = null;


                if (fileInfo.IsFile()) {
                    _self.FileName = fileInfo.FileName;
                    _self.Ext = fileInfo.Ext;
                    var file = _.split(_self.FileName, "_");
                    var textId = _.toInteger(file[0]);

                    if (!textId) {
                        _self.ObjectName = _self.FileName.substr(0, _self.FileName.lastIndexOf("."));
                        return _self;
                    }

                    _self.TextureTypeId = textId;

                    var last = file[file.length - 1];

                    if (last.length > 4) {
                        var _externalTextureType = last.substr(0, last.lastIndexOf("."));
                        if (TEXTURE_TYPES.hasOwnProperty(_.upperFirst(_externalTextureType))) _self._externalTextureType = _externalTextureType;
                        if (_externalTextureType === _self.TextureTypeName) _self.ExternalTextureHasCorrectInfo = true;
                        else {
                            _self.IsLinkToOtherTexture = true;
                            if (SHOW_CONSOLE) {
                                console.log("external texture type inccorect", {
                                    babylonTexture: babylonTexture,
                                    _externalTextureType: _externalTextureType,
                                    currentTextureType: _self.TextureTypeName,
                                    ITextureItem: _self
                                });
                            }

                        }

                    }
                    if (LAYER_NAMES.hasOwnProperty(file[1])) {
                        _self.LayerName = file[1];
                    }
                    if (_self.LayerName && _self._externalTextureType) {;
                        _self.ObjectName = _.join(_.dropRight(_.drop(file, 1), 1), "_");
                    }

                }
                return _self;
            }
            return _self;

        }

        function IMaterialContainer(iGameObjectMeta, iTypeCatalog, subtypeMaterialName) {
            var _self = this;
            _self.LayerName = iGameObjectMeta.LayerName;
            _self.TextureTypeId = iGameObjectMeta.TextureTypeId;
            _self.AdvancedName = iGameObjectMeta.AdvancedName;
            _self.ObjectName = iGameObjectMeta.ObjectName;
            _self.SubtypeMaterialName = subtypeMaterialName;
            _self._subtypeMaterialName = null;
            if (_self.SubtypeMaterialName === SUBTYPE_MATERIAL_NAMES.regular) _self._subtypeMaterialName = "";
            else _self._subtypeMaterialName = subtypeMaterialName;

            _self.CatalogUrl = iTypeCatalog.CatalogUrl;
            _self.InnerCatalogUrl = iTypeCatalog.InnerCatalogUrl;
            _self.CreateSubDirUrl = iTypeCatalog.CreateSubDirUrl;

            _self._activeCatalogUrl = _self.InnerCatalogUrl ? _self.InnerCatalogUrl : _self.CatalogUrl;
            _self.UpdateActiveCatalogUrl = function (newUrl) {
                _self._activeCatalogUrl = newUrl;
            };


            _self.diffuse = null;
            _self.bump = null;
            _self.specular = null;
            _self.ambient = null;
            _self.emissive = null;
            _self.opacity = null;
            _self.reflection = null;
            _self.refraction = null;
            _self.light = null;

            _self.MaterialId = null;
            _self.ImportSceneName = null;
            _self.ScenePrefix = "";

            _self.SetScenePrefix = function (sceneName) {
                if (!sceneName) Errors.ClientNullReferenceException({ sceneName: sceneName, IMaterialContainer: IMaterialContainer }, "sceneName", "IMaterialContainer.SetScenePrefix");
                _self.ImportSceneName = sceneName;
                _self.ScenePrefix = _getScenePrefix(sceneName);
                return _self;

            }


            _self.GetOrCreateTextureItem = function (textureTypeName, ext, useFromBaseCatalog, otherCatalogUrl) {
                if (_self[textureTypeName]) return _self[textureTypeName];
                if (!otherCatalogUrl && !useFromBaseCatalog) {
                    _self[textureTypeName] = new ITextureItem(_self._activeCatalogUrl, iGameObjectMeta, textureTypeName, ext);
                    return _self[textureTypeName];
                }
                if (otherCatalogUrl) _self.UpdateActiveCatalogUrl(otherCatalogUrl);
                else if (useFromBaseCatalog && _self.InnerCatalogUrl && _self._activeCatalogUrl !== _self.CatalogUrl) {
                    _self.UpdateActiveCatalogUrl(_self.CatalogUrl);
                }
                _self[textureTypeName] = new ITextureItem(_self._activeCatalogUrl, iGameObjectMeta, textureTypeName, ext);
                return _self[textureTypeName];
            };
            _self.GetOrCreateTexture = function (textureTypeName, ext, useFromBaseCatalog, otherCatalogUrl) {
                if (_self.ExistTexture(textureTypeName)) return _self.GetTexture(textureTypeName);
                else {
                    var container = _self.GetOrCreateTextureItem(textureTypeName, ext, useFromBaseCatalog, otherCatalogUrl);
                    return container.GetOrCreateTexture();
                }
            }

            _self.ExistTexture = function (textureTypeName) {
                return !!_self[textureTypeName];
            };
            _self.GetTextureObj = function (textureTypeName) {
                if (_self.ExistTexture(textureTypeName)) return _self[textureTypeName];
                return null;
            };
            _self.GetTexture = function (textureTypeName) {
                if (_self.ExistTexture(textureTypeName)) {
                    return _self[textureTypeName].GetOrCreateTexture();
                }

                return null;
            };
            _self.GetTextureUrl = function (textureTypeName) {
                if (_self.ExistTexture(textureTypeName)) return _self[textureTypeName].Url;
                return null;
            };

            /**
             * see  ITextureItem.SetExternalTexture 
             * устанавливает новую текстуру в контейнер. Если контейнер не существует создает с пустыми параметрами
             * и вызывает одноименный метод текстуры 
             * @param {string} textureTypeName see  EM.AssetRepository.TEXTURE_TYPES
             * @param {object} babylonTexture   BABYLON.Texture
             * @returns {object}  ITextureItem обновленную информацию после установки  новой текстуры
             * exceptions [ClientNullReferenceException] 
             */
            _self.SetExternalTexture = function (textureTypeName, babylonTexture) {
                if (_self.ExistTexture(textureTypeName)) {
                    var cont = _self.GetTextureObj(textureTypeName);
                    return cont.SetExternalTexture(textureTypeName, babylonTexture);
                }
                else {
                    _self[textureTypeName] = new ITextureItem();
                    return _self[textureTypeName].SetExternalTexture(textureTypeName, babylonTexture);
                }
            };
            _self._createMaterialId = function () {
                return _self.ScenePrefix + _materialIdTemplate(_self.TextureTypeId, _self.LayerName, _self._subtypeMaterialName);
            }
            _self.GetOrCreateMaterialId = function () {
                if (!_self.MaterialId) _self.MaterialId = _self._createMaterialId();
                return _self.MaterialId;
            };
            _self._setMaterialProperty = null;
            _self.GetOrCreateMaterial = function (setMaterialProperty) {
                var matId = _self.GetOrCreateMaterialId();
                var mat = help.GetMaterial(matId);
                var materialIsExist = !!mat;
                if (!setMaterialProperty && materialIsExist) return mat;
 
                if (setMaterialProperty instanceof Function && !_self._setMaterialProperty) _self._setMaterialProperty = setMaterialProperty;

                mat = help.CreateBaseMaterial(matId, function (material) {
                    if (_self._setMaterialProperty instanceof Function) {
                        var m = _self._setMaterialProperty(material, _self, matId, materialIsExist);  
                        return m;
                    }

                    return material;
                });
                if (!mat) {
                    _self._setMaterialProperty = null;
                    Errors.ClientNotImplementedException("material not exist", { IMaterialContainer: _self, setMaterialProperty: setMaterialProperty, matId: matId });
                }
                return mat;

            };

            /**
             * Переопределяет  и извлекает мета инфу о материале и о текстурах если не указанно обратное.
             * делает проверку на соответствие имени материала
             * но исключение не выбрасывает  - показывает только консоль о потенциальной ошибке
             * see IMaterialContainer.SetExternalTexture
             * @param {object} babylonMaterial BABYLON.Material 
             * @param {bool} notSetExternalTextures   default false
             * @param {object} advancedTextureNames    can be null, prop name must be texturename not equal with default texture name
             * @returns {object}  IMaterialContainer  текущий инст контейнера
             */
            _self.SetExternalMaterial = function (babylonMaterial, notSetExternalTextures, advancedTextureNames) {
                if (!babylonMaterial) throw Errors.ClientNullReferenceException({ babylonMaterial: babylonMaterial, IMaterialContainer: _self }, "babylonMaterial", "IMaterialContainer.SetExternalMaterial");
                var templateMaterialId = _self._createMaterialId();
                if (_self.MaterialId) {
                    var oldMaterial = EM.GetMaterial(_self.MaterialId);
                    if (oldMaterial) {
                        Utils.Console.Warn("IMaterialContainer.SetExternalMaterial в текущей сцене уже есть связанным и назначенный материал", {
                            IMaterialContainer: _self,
                            oldMaterial: oldMaterial,
                            babylonMaterial: babylonMaterial,
                            babylonMaterialId: babylonMaterial.id,
                            templateMaterialId: templateMaterialId
                        });
                    }
                }
                _self.MaterialId = babylonMaterial.id;
                if (templateMaterialId !== babylonMaterial.id) {
                    Utils.Console.Warn("Material is not equal with template", {
                        "babylonMaterial.id": babylonMaterial.id,
                        templateMaterialId: templateMaterialId,
                        IMaterialContainer: _self
                    });
                }
                if (!notSetExternalTextures) {
                    var st = _self.SetExternalTexture;
                    if (babylonMaterial.diffuseTexture) {
                        st(TEXTURE_TYPES.Dffuse, babylonMaterial.diffuseTexture);
                    }

                    if (babylonMaterial.bumpTexture) {
                        st(TEXTURE_TYPES.Bump, babylonMaterial.bumpTexture);
                    }
                    if (babylonMaterial.specularTexture) {
                        st(TEXTURE_TYPES.Specular, babylonMaterial.specularTexture);
                    }
                    if (babylonMaterial.ambientTexture) {
                        st(TEXTURE_TYPES.Ambient, babylonMaterial.ambientTexture);
                    }
                    if (babylonMaterial.emissiveTexture) {
                        st(TEXTURE_TYPES.Emissive, babylonMaterial.emissiveTexture);
                    }
                    if (babylonMaterial.opacityTexture) {
                        st(TEXTURE_TYPES.Opacity, babylonMaterial.opacityTexture);
                    }
                    if (babylonMaterial.reflectionTexture) {
                        st(TEXTURE_TYPES.Reflection, babylonMaterial.reflectionTexture);
                    }
                    if (babylonMaterial.lightmapTexture) {
                        st(TEXTURE_TYPES.Light, babylonMaterial.lightmapTexture);
                    }
                    if (babylonMaterial.refractionTexture) {
                        st(TEXTURE_TYPES.Refraction, babylonMaterial.refractionTexture);
                    }
                    if (advancedTextureNames && !_.isEmpty(advancedTextureNames)) {
                        _.forEach(advancedTextureNames, function (texture, textureKey) {
                            if (!_self.ExistTexture(textureKey)) {
                                st(textureKey, texture);
                            }
                            else {
                                console.log("texture type is wrong", {
                                    advancedTextureNames: advancedTextureNames,
                                    texture: texture,
                                    textureKey: textureKey,
                                    IMaterialContainer: _self,
                                });
                            }
                        });
                    }
                }
                return _self;

            }
            _self.GetMaterial = function () {
                return _self.GetOrCreateMaterial();
            };
            return _self;
        }

        function IRenderOption() {
            var _self = this;
            var _observers = {};
            var _callbaks = {};
            this.StartOnBeforeRender = function (uniqeId, actionKey, params) {
                if (!uniqeId || !_isNotEmptyString(actionKey) || !params || typeof params !== "object") {
                    throw Errors.ClientTypeErrorException({ IRenderOption: _self }, params, "object", "IRenderOption.StartOnBeforeRenderObservable");
                }

                // _observer =  EM.Scene.onBeforeRenderObservable(_onBeforeRenderObservable);
                var callback = _callbaks[actionKey];
                if (!(callback instanceof Function)) throw Errors.ClientNullReferenceException({ IRenderOption: _self }, "_callbaks[key]", "IRenderOption.StartOnBeforeRenderObservable");
                _observers[uniqeId] = EM.Scene.onBeforeRenderObservable.add(function (eventData, mask) {
                    if (!callback(eventData, mask, params, _self)) _self.StopBeforeRender(uniqeId);
                });
                return _self;
            };
            this.StopBeforeRender = function (uniqeId) {
                //   EM.Scene.unregisterBeforeRender(_onBeforeRenderObservable);  
                EM.Scene.onBeforeRenderObservable.remove(_observers[uniqeId]);
                _observers[uniqeId] = null;
                delete _observers[uniqeId];
            };
            this.AddFunction = function (key, onBeforeRenderObservable) {
                _callbaks[key] = onBeforeRenderObservable;

            }
            return this;
        }


        /**
         * Создает инст для хранения информации о базовом меше
         * @param {function} createMeshId возвращает базовый meshId для соответствующего типа меша   BASE_SUB_NAMES исполюзуются как имена по умолчанию на вернем слое поэтому   
         * фабрика должна возвращать базове имя по шаблону
         * {textureId}_{LAYER_NAMES} ? {возможное дополнение в рамках создания шаблона BASE_SUB_NAMES.ring||BASE_SUB_NAMES.cloud},
         * Если меш импортируется фабрика должна возвращать имя импортированного меша, 
         * имя меша  из сцены так же должно соответствовать шаблону.
         * нельзя указывать BASE_SUB_NAMES.regular
         * если меш не имеет префиксов и поствиксов (uniqueId,parentMeshId) метод следует вызывать без параметров, иначе с.
         * если имя не является шаблонным есть следующие варианты использвоания: 
         * 1-только через   ILayerContainer - при инициализации переопределить базовый метод создания меш ид,
         * 2-не использовать и не создавать конструктора
         * 3  в каком то из родительских класов учесть отличие в имени  
         * @returns {object} IMeshContainer 
         */
        function IMeshContainer(createMeshId) {
            if (!(createMeshId instanceof Function)) throw Utils.Console.Error("IMeshContainer - param createMeshId is requred  mesh id factory");
            var _self = this;
            this._meshId = null;
            this._createMeshId = createMeshId;

            /**
             * если без параметров будет возвращено имя базового меша, иначе параметры будут добавленны в соотв с шаблоном {parentMeshId}.{_meshId}_{uniqueId}
             * @param {int||string} uniqueId   can be null  
             * @param {int||string} parentMeshId can be null
             * @returns {string} meshId  по шаблонам:
             *  передан uniqueId  {_meshId}_{uniqueId}
             *  передан uniqueId  и  parentMeshId   {parentMeshId}.{_meshId}_{uniqueId}
             *  передан только парент   {parentMeshId}.{_meshId}
             * стандартный шаблон для _meshId    см в описании класа IMeshContainer
             */
            this.GetMeshId = function (uniqueId, parentMeshId) {
                if (!this._meshId) this._meshId = this._createMeshId();
                return _combineMeshIds(this._meshId, uniqueId, parentMeshId);
            };
            this.AdvPropNames = {};

            /**
             * see IMeshContainer  GetMeshId
             * @param {int||string} uniqueId   can be null  
             * @param {int||string} parentMeshId can be null
             * @returns {object||null}   BABYLON.Mesh  если  null  следуют проверить шаблон имени меша, или же меш был уничтожен и требуется пересоздание
             */
            this.GetMesh = function (uniqueId, parentMesId) {
                return help.GetMesh(_self.GetMeshId(uniqueId, parentMesId));
            };
            this._addProp = function (propKey, propVal) {
                this[propKey] = propVal;
                if (!_.startsWith(propKey, "_")) {
                    console.log("IMeshContainer.AddProp: Local property must be start with '_' ", { IMeshContainer: _self });
                }
                this.AdvPropNames[propKey] = propKey;
            };
            return this;
        }

        /**
         * создает контейнер для одноименного слоя (см - AssetRepositor.LAYER_NAMES) 
         * назначение :создание хранение и извлеченик информации о мешах и материалах возможные типы контейнеров 
         * @param {object} iGameObjectMeta   see  IGameObjectMeta
         * @returns {object}  ILayerContainer
         */
        function ILayerContainer(iGameObjectMeta) {
            var $self = this;
            $self.LayerName = iGameObjectMeta.LayerName;
            $self.TextureTypeId = iGameObjectMeta.TextureTypeId;
            $self.AdvancedName = iGameObjectMeta.AdvancedName;
            $self.ObjectName = iGameObjectMeta.ObjectName;

            $self.materiales = {};
            $self.materiales[SUBTYPE_MATERIAL_NAMES.regular] = null;
            $self.materiales[SUBTYPE_MATERIAL_NAMES.cloud] = null;
            $self.materiales[SUBTYPE_MATERIAL_NAMES.ring] = null;

            $self.materiales[SUBTYPE_MATERIAL_NAMES.click] = null;
            $self.materiales[SUBTYPE_MATERIAL_NAMES.hover] = null;

            $self.meshes = {};
            $self.meshes[SUBTYPE_MESH_NAMES.regular] = null;
            $self.meshes[SUBTYPE_MESH_NAMES.cloud] = null;
            $self.meshes[SUBTYPE_MESH_NAMES.ring] = null;

            $self.GetMeshContainer = function (baseSubContainerName) {
                if (!baseSubContainerName) return $self.meshes.regular;
                return $self.meshes[baseSubContainerName];
            };


            $self.GetMesh = function (subTypeMeshName, uniqueId, parentMesId) {
                //IMeshContainer
                var meshContainer = $self.GetMeshContainer(subTypeMeshName);
                if (!meshContainer) return null;
                if (typeof meshContainer === "object") return meshContainer.GetMesh(uniqueId, parentMesId); // IMeshContainer  
                throw Errors.ClientTypeErrorException({
                    subTypeMeshName: subTypeMeshName,
                    ILayerContainer: $self,
                    meshSection: meshContainer
                }, meshContainer, "object/IMeshContainer", "ILayerContainer.GetMesh");
            };
            $self.GetMeshId = function (subTypeMeshName, uniqueId, parentMesId) {
                //IMeshContainer
                var meshContainer = $self.GetMeshContainer(subTypeMeshName);
                if (!meshContainer) return null;
                if (typeof meshContainer === "object") return meshContainer.GetMeshId(uniqueId, parentMesId);
                throw Errors.ClientTypeErrorException({
                    subTypeMeshName: subTypeMeshName,
                    ILayerContainer: $self,
                    meshSection: meshContainer
                }, meshContainer, "object/IMeshContainer", "ILayerContainer.GetMeshId");
            };

            /**
             *  
             * @param {string} subTypeMeshName   see SUBTYPE_MESH_NAME
             * @param {function} createMeshId see   IMeshContainer.constructor
             * @returns {object} IMeshContainer
             */
            $self.AddMeshContainer = function (subTypeMeshName, createMeshId) {
                var advName = subTypeMeshName || "";
                if (!subTypeMeshName) subTypeMeshName = BASE_SUB_NAMES.regular;
                if (subTypeMeshName !== BASE_SUB_NAMES.regular) advName = subTypeMeshName;
                $self.meshes[subTypeMeshName] = new IMeshContainer(createMeshId || function () {
                    return _createOriginalMeshIdTemplate($self.TextureTypeId, $self.LayerName, advName);
                });
                return $self.meshes[subTypeMeshName];
            };

            $self.AddMeshContainerFromExternalMesh = function (externalMesh, subTypeMeshName) {
                var advName = subTypeMeshName || "";
                if (subTypeMeshName === BASE_SUB_NAMES.regular) advName = "";
                if (!subTypeMeshName) subTypeMeshName = BASE_SUB_NAMES.regular;
                var templateName = _createOriginalMeshIdTemplate($self.TextureTypeId, $self.LayerName, advName);
                if (templateName !== externalMesh.id) {
                    throw Errors.ClientNotEqualException({
                        advName: advName,
                        externalMesh: externalMesh,
                        subTypeMeshName: subTypeMeshName,
                        templateName: templateName
                    }, "ILayerContainer.AddMeshContainerFromExternalMesh");
                }
                var meshId = externalMesh.id;
                $self.meshes[subTypeMeshName] = new IMeshContainer(function () {
                    return meshId;
                });
                return $self.meshes[subTypeMeshName];
            };

            /**
             * 
             * @param {string} subtypeMaterialName  can be null, default - SUBTYPE_MATERIAL_NAMES.regular 
             * @returns {object||null}  IMaterialContainer
             */
            $self._getIMaterialContainer = function (subtypeMaterialName) {
                if (subtypeMaterialName && SUBTYPE_MATERIAL_NAMES.hasOwnProperty(subtypeMaterialName)) return $self.materiales[subtypeMaterialName];
                if ($self.materiales[SUBTYPE_MATERIAL_NAMES.regular]) return $self.materiales[SUBTYPE_MATERIAL_NAMES.regular];
                return null;
            }

            /**
             * 
             * @param {object} iMaterialContainer constuctor IMaterialContainer 
             * @param {string} subtypeMaterialName  can be null, default - SUBTYPE_MATERIAL_NAMES.regular 
             * @returns {object} IMaterialContainer 
             * throws [ClientNullReferenceException,ClientTypeErrorException,ClientNotImplementedException]
             */
            $self.AddIMaterialContainer = function (iMaterialContainer, subtypeMaterialName) {
                if (!iMaterialContainer) throw Errors.ClientNullReferenceException({
                    subtypeMaterialName: subtypeMaterialName,
                    iMaterial: iMaterialContainer
                }, "iMaterialContainer", "ILayerContainer.AddIMaterialContainer");

                if (typeof iMaterialContainer !== "object") {
                    throw Errors.ClientTypeErrorException({
                        subtypeMaterialName: subtypeMaterialName,
                        iMaterial: iMaterialContainer
                    }, iMaterialContainer, "object/IMaterialContainer", "ILayerContainer.AddIMaterialContainer");
                }
                if (!subtypeMaterialName && !$self.materiales[SUBTYPE_MATERIAL_NAMES.regular]) return $self.materiales[SUBTYPE_MATERIAL_NAMES.regular] = iMaterialContainer;
                if ($self.materiales[subtypeMaterialName]) return $self.materiales[subtypeMaterialName];
                if (SUBTYPE_MATERIAL_NAMES.hasOwnProperty(subtypeMaterialName)) {
                    $self.materiales[subtypeMaterialName] = iMaterialContainer;
                    return $self.materiales[subtypeMaterialName];
                }
                throw Errors.ClientNotImplementedException({ subtypeMaterialName: subtypeMaterialName, iMaterialContainer: iMaterialContainer, ILayerContainer: $self }, "ILayerContainer.AddIMaterialContainer");
            };

            /**
             * 
             * @param {string} subtypeMaterialName  can be null, default - SUBTYPE_MATERIAL_NAMES.regular 
             * @param {boolian} notThrowIfNull   can be null   if true not droup Exception
             * @returns {object} IMaterialContainer 
             * throws [Errors.ClientNullReferenceException]
             */
            $self.GetIMaterialContainer = function (subtypeMaterialName, notThrowIfNull) {
                var iMat = $self._getIMaterialContainer(subtypeMaterialName);
                if (!iMat && !notThrowIfNull) throw Errors.ClientNullReferenceException({ IMaterialContainer: iMat, ILayerContainer: $self }, "iMat", "ILayerContainer.GetIMaterialContainer");
                return iMat;
            };


            /**
             * see  ILayerContainer._getIMaterialContainer
             * @param {string} subtypeMaterialName  can be null, default - SUBTYPE_MATERIAL_NAMES.regular 
             * @returns {boolian} isEmpty
             */
            $self.HasIMaterialContainer = function (subtypeMaterialName) {
                return !!$self._getIMaterialContainer(subtypeMaterialName);
            };
            $self.RenderOption = null;
            $self.GetOrCreateRenderOptions = function () {
                if ($self.RenderOption) return $self.RenderOption;
                return $self.RenderOption = new IRenderOption();
            };
            return $self;

        };

        /**
         *  Create new ITypeItem
         * Хранит связанную с textureTypeId информацию о объектах
         * текстуры
         * мешы
         * материалы
         * css спрайты
         * Информцию о каталоге для соотв типа
         * Примечание :
         * данные и фабрики должны быть инициализированны в момент старта приложения до запуска  метдов котоыре будут обращаться к данным класа
         * может  расширятсья при инициализации
         * цель класса создать всею связанную мета иформацию для создания и извлечения обектов сцены  и html спрайтов
         * @param {int|| string} textureTypeId ключ эллемнта, основной идентификатор для типа
         * @param {string} mapTypeName (loweredName) 
         * @param {string} innerGatalogName   can be null
         * @param {string} sceneName     can be null   имя сцены из загрузочного файла для формирования правильных имен патериалов в сцене
         * @param {string} iTypeCatalog   can be null если указан -класс расширяется переданным каталогом
         * @param {bool} notSetCss  по умолчанию создает  css спраты для эллемента,  для отмены нужно явное указание 
         * @returns {object} ITypeItem 
         */
        ar.ITypeItem = function (textureTypeId, mapTypeName, innerGatalogName, sceneName, iTypeCatalog, notSetCss) {
            // console.log("itemKeyId", itemKeyId); 
            function ITypeItem() {
                var _self = _.extend(this, iTypeCatalog || new ITypeCatalog(textureTypeId, innerGatalogName));
                _self._sceneName = sceneName;

                //#region Layer
                /**
                 * 
                 * @param {string} layerName  required
                 * @param {bool} notThrowIfNull 
                 * @returns {object} ILayerContainer
                 * throws[ClientNullReferenceException,ClientTypeErrorException] 
                 */
                _self._getLayer = function (layerName, notThrowIfNull) {
                    if (_self.hasOwnProperty(layerName)) {
                        var layer = _self[layerName];
                        if (!layer && notThrowIfNull) return layer;
                        if (typeof layer === "object") return layer;
                        throw Errors.ClientTypeErrorException({
                            layerName: layerName
                        }, "ITypeItem._getLayer", layerName, "object/ILayerContainer");
                    }
                    else if (notThrowIfNull) return null;
                    else throw Errors.ClientNullReferenceException({ layerName: layerName, notThrowIfNull: notThrowIfNull }, "ITypeItem[layerName]", "ITypeItem._getLayer");
                };

                /**
                 * проверяет переданные параметры и в зависимости от их наличия возвращает объект ILayerContainer 
                 * @param {string} layerName  can be null  if IGameObjectMeta or  _layer    else required
                 * @param {object} gameObjectMeta IGameObjectMeta    can be null  if layerName  or  _layer    else required
                 * @param {bool} notThrowIfNull 
                 * @param {object} _layer  can be null    if IGameObjectMeta or  layerName    else required
                 * @returns {object||null} ILayerContainer
                 * throws[ClientNullReferenceException,ClientTypeErrorException,ClientNotImplementedException]   (if notThrowIfNull = false)
                 */
                _self._getLayerElseIf = function (layerName, gameObjectMeta, notThrowIfNull, _layer) {
                    if (_layer) return _layer;
                    if (gameObjectMeta) return _self.GetOrCreateLayer(gameObjectMeta);
                    if (layerName) return _self._getLayer(layerName);
                    throw Errors.ClientNotImplementedException({ ITypeItem: _self, layerName: layerName, gameObjectMeta: gameObjectMeta, notThrowIfNull: notThrowIfNull, _layer: _layer });

                };

                /**
                 * получает или создает объект слоя
                 * @param {object} gameObjectMeta IGameObjectMeta required
                 * @returns {object}  ILayerContainer
                 * throws[ClientNullReferenceException,ClientTypeErrorException] 
                 */
                _self.GetOrCreateLayer = function (gameObjectMeta) {
                    _self._isValidObjectMeta(gameObjectMeta);
                    var layerName = gameObjectMeta.LayerName;
                    if (!layerName) {
                        throw Errors.ClientNullReferenceException({ layerName: layerName, iGameObjectMeta: gameObjectMeta }, "ITypeItem.GetOrCreateLayer");
                    }
                    if (_self[layerName]) return _self[layerName];
                    return _self[layerName] = new ILayerContainer(gameObjectMeta);
                };

                //#endregion;

                //#region Mesh

                /**
                 * see ILayerContainer.GetMeshId , IMeshContainer.GetMesh
                 * @param {string} layerName  can be null  if IGameObjectMeta or  _layer    else required
                 * @param {string}subTypeMeshName can be null  - SUBTYPE_MESH_NAME  see EM.AssetRepository.SUBTYPE_MESH_NAMES,  ILayerContainer.GetMeshId,  IMeshContainer.GetMeshId
                 * @param {object} gameObjectMeta IGameObjectMeta    can be null  if layerName  or  _layer    else required
                 * @param {int||string} uniqueId     see IMeshContainer.GetMeshId
                 * @param {int||string} parentMehsId   see IMeshContainer.GetMeshId
                 * @param {object} _layer  can be null    if IGameObjectMeta or  layerName    else required
                 * @returns {string} meshId
                 * throws[ClientNullReferenceException,ClientTypeErrorException,ClientNotImplementedException]
                 */
                _self.GetMeshId = function (layerName, subTypeMeshName, gameObjectMeta, uniqueId, parentMehsId, _layer) {
                    var layer = _self._getLayerElseIf(layerName, gameObjectMeta, false, _layer);
                    if (layer) return layer.GetMeshId(subTypeMeshName, uniqueId, parentMehsId);
                    throw Errors.ClientNullReferenceException({ layerName: layerName, subTypeMeshName: subTypeMeshName, ITypeItem: _self }, "layer", "ITypeItem.GetMeshId");
                };
                /**
                 * see ILayerContainer.GetMesh,IMeshContainer.GetMesh
                 * @param {string} layerName  can be null  if IGameObjectMeta or  _layer    else required
                 * @param {string}subTypeMeshName can be null  - SUBTYPE_MESH_NAME  see EM.AssetRepository.SUBTYPE_MESH_NAMES,  ILayerContainer.GetMesh,  IMeshContainer.GetMesh
                 * @param {int||string} uniqueId     see IMeshContainer.GetMesh
                 * @param {int||string} parentMehsId   see IMeshContainer.GetMesh
                 * @param {object} gameObjectMeta IGameObjectMeta    can be null  if layerName  or  _layer    else required
                 * @param {object} _layer  can be null    if IGameObjectMeta or  layerName    else required
                 * @returns {object} BABYLON.Mesh || null
                 * throws[ClientNullReferenceException,ClientTypeErrorException,ClientNotImplementedException]
                 */
                _self.GetMesh = function (layerName, subTypeMeshName, uniqueId, parentMehsId, gameObjectMeta, _layer) {
                    var layer = _self._getLayerElseIf(layerName, gameObjectMeta, false, _layer);
                    return layer.GetMesh(subTypeMeshName, uniqueId, parentMehsId);
                };

                /**
                 *  see  ILayerContainer.AddMeshContainer
                 * @param {object} gameObjectMeta IGameObjectMeta    can be null  if layerName  or  _layer    else required
                 * @param {function} createMeshId   see    IMeshContainer can be null if name standart
                 * @param {string} layerName  can be null  if IGameObjectMeta or  _layer    else required
                 * @param {string}subTypeMeshName can be null  - SUBTYPE_MESH_NAME  see EM.AssetRepository.SUBTYPE_MESH_NAMES,  ILayerContainer.AddMeshContainer
                 * @param {object} _layer  can be null    if IGameObjectMeta or  layerName    else required
                 * @returns {object} IMeshContainer
                 * throws[ClientNullReferenceException,ClientTypeErrorException,ClientNotImplementedException]
                 */
                _self.AddMeshContainer = function (gameObjectMeta, createMeshId, layerName, subTypeMeshName, _layer) {
                    var layer = _self._getLayerElseIf(layerName, gameObjectMeta, _layer);
                    return layer.AddMeshContainer(subTypeMeshName, createMeshId);
                };

                /**
                 * see  ILayerContainer.AddMeshContainerFromExternalMesh
                 * @param {object} externalMesh   BABYLON.Mesh
                 * @param {object} gameObjectMeta IGameObjectMeta    can be null  if layerName  or  _layer    else required
                 * @param {string}subTypeMeshName can be null  - SUBTYPE_MESH_NAME  see EM.AssetRepository.SUBTYPE_MESH_NAMES,  ILayerContainer.AddMeshContainerFromExternalMesh
                 * @param {string} layerName  can be null  if IGameObjectMeta or  _layer    else required
                 * @param {object} _layer  can be null    if IGameObjectMeta or  layerName    else required
                 * @returns {object}  IMeshContainer
                 * throws[ClientNullReferenceException,ClientTypeErrorException,ClientNotImplementedException]
                 */
                _self.AddMeshContainerFromExternalMesh = function (externalMesh, gameObjectMeta, subTypeMeshName, layerName, _layer) {
                    var layer = _self._getLayerElseIf(layerName, gameObjectMeta, _layer);
                    return layer.AddMeshContainerFromExternalMesh(externalMesh, subTypeMeshName);
                };
                //#endregion;

                //#region Material

                /**
                 *  see  ILayerContainer.GetIMaterialContainer, IMaterialContainer
                 * @param {string} layerName  can be null  if  _layer    else required
                 * @param {string} subtypeMaterialName  can be null, default - SUBTYPE_MATERIAL_NAMES.regular  (in
                 * @param {bool} notThrowIfNull    can be null 
                 * @param {object} _layer   layerName  can be null  if  layerName    else required
                 * @returns {object}  IMaterialContainer
                 *  throws[ClientNullReferenceException,ClientTypeErrorException,ClientNotImplementedException]
                 */
                _self.GetIMaterialContainer = function (layerName, subtypeMaterialName, notThrowIfNull, _layer) {
                    var layer = _self._getLayerElseIf(layerName, null, notThrowIfNull, _layer);
                    if (!layer) return null;
                    return layer.GetIMaterialContainer(subtypeMaterialName, notThrowIfNull);
                }

                /**
                 * see   ILayerContainer.GetIMaterialContainer, IMaterialContainer
                 * @param {object} gameObjectMeta IGameObjectMeta    can be null   if _layer    else required
                 * @param {string} subtypeMaterialName  can be null, default - SUBTYPE_MATERIAL_NAMES.regular  (in)
                 * @param {bool} notShowConsoleIfExist 
                 * @param {object} _layer    can be null  if  gameObjectMeta    else required
                 * @returns {object}  IMaterialContainer || console if material before exist and  notShowConsoleIfExist = flase
                 *  throws[ClientNullReferenceException,ClientTypeErrorException,ClientNotImplementedException]
                 */
                _self.CreateIMaterialContainer = function (gameObjectMeta, subtypeMaterialName, notShowConsoleIfExist, _layer) {
                    var layer = _self._getLayerElseIf(null, gameObjectMeta, false, _layer);
                    if (!subtypeMaterialName) subtypeMaterialName = SUBTYPE_MATERIAL_NAMES.regular;
                    if (layer.HasIMaterialContainer(subtypeMaterialName)) {
                        var mat = layer.GetIMaterialContainer(subtypeMaterialName);
                        if (!notShowConsoleIfExist) {
                            Utils.Console.Warn("ITypeItem.CreateIMaterialContainer - IMaterialContainer exist, return old IMaterialContainer", {
                                subtypeMaterialName: subtypeMaterialName,
                                layer: layer,
                                mat: mat
                            });
                        }
                        return mat;
                    }
                    var meta = new IGameObjectMeta(textureTypeId, layer.LayerName, subtypeMaterialName);
                    var iMaterial = new IMaterialContainer(meta, _self, subtypeMaterialName);
                    return layer.AddIMaterialContainer(iMaterial, subtypeMaterialName);
                };

                /**
                 *  see  ILayerContainer.GetIMaterialContainer, ILayerContainer.AddIMaterialContainer
                 * @param {string} layerName  can be null  if  _layer    else required
                 * @param {object} iMaterial   required
                 * @param {string} subtypeMaterialName  can be null, default - SUBTYPE_MATERIAL_NAMES.regular 
                 * @param {object} _layer    can be null  if  layerName    else required
                 * @returns {object} IMaterialContainer , if  exist return old container
                 *  throws[ClientNullReferenceException,ClientTypeErrorException,ClientNotImplementedException]
                 */
                _self.AddIMaterialContainer = function (layerName, iMaterial, subtypeMaterialName, _layer) {
                    var layer = _self._getLayerElseIf(layerName, null, false, _layer);
                    if (layer.HasIMaterialContainer(subtypeMaterialName)) {
                        var mat = layer.GetIMaterialContainer(subtypeMaterialName);
                        Utils.Console.Warn("ITypeItem.AddIMaterialContainer - IMaterialContainer exist, return old IMaterialContainer", {
                            layerName: layerName,
                            subtypeMaterialName: subtypeMaterialName,
                            existIMaterial: mat,
                            paramIMaterial: iMaterial
                        });
                        return mat;
                    }
                    return layer.AddIMaterialContainer(iMaterial, subtypeMaterialName);
                };

                /**
                 * see  ITypeItem.GetIMaterialContainer, ITypeItem.CreateIMaterialContainer
                 * @param {object} gameObjectMeta IGameObjectMeta    can be null   if _layer    else required
                 * @param {string} subtypeMaterialName  can be null, default - SUBTYPE_MATERIAL_NAMES.regular  (in) 
                 * @param {object} _layer    can be null  if  gameObjectMeta    else required
                 * @returns {object}   IMaterialContainer
                 * throws[ClientNullReferenceException,ClientTypeErrorException,ClientNotImplementedException]
                 */
                _self.GetOrCreateIMaterial = function (gameObjectMeta, subtypeMaterialName, _layer) {
                    var layer = _self._getLayerElseIf(null, gameObjectMeta, false, _layer);
                    var iMat = _self.GetIMaterialContainer(layer.LayerName, subtypeMaterialName, true, layer);
                    if (!iMat) iMat = _self.CreateIMaterialContainer(gameObjectMeta, subtypeMaterialName, false, layer);
                    return iMat;
                };
                /**
                 * see  ITypeItem.CreateIMaterialContainer
                 * @param {object} gameObjectMeta IGameObjectMeta    required
                 * @param {function} setMaterialProperty  if null return empty material
                 * @param {string} subtypeMaterialName  can be null, default - SUBTYPE_MATERIAL_NAMES.regular  (in) 
                 * @returns {object} BABYLON.Material
                 * throws[ClientNullReferenceException,ClientTypeErrorException,ClientNotImplementedException]
                 */
                _self.GetOrCreateMaterial = function (gameObjectMeta, setMaterialProperty, subtypeMaterialName) {
                    if (!subtypeMaterialName) subtypeMaterialName = SUBTYPE_MATERIAL_NAMES.regular;
                    var iMat = _self.GetOrCreateIMaterial(gameObjectMeta, subtypeMaterialName);
                    return iMat.GetOrCreateMaterial(setMaterialProperty);
                };
                /**
                 * Если существует контейнер ITypeItem[layerName] работает как GetOrCreateMaterial  иначе возвращает  null
                 * @param {string} layerName  can be null  if  _layer    else required
                 * @param {string} subtypeMaterialName  can be null, default - SUBTYPE_MATERIAL_NAMES.regular  (in)  
                 * @param {object} _layer    can be null  if  layerName    else required
                 * @returns {object}   BABYLON.Material || null
                 */
                _self.GetMaterial = function (layerName, subtypeMaterialName, _layer) {
                    var layer = _self._getLayerElseIf(layerName, null, true, _layer);
                    if (!layer) return null;
                    if (!subtypeMaterialName) subtypeMaterialName = SUBTYPE_MATERIAL_NAMES.regular;
                    var matContainer = layer.GetIMaterialContainer(subtypeMaterialName, true);
                    if (!matContainer) return null;
                    return matContainer.GetMaterial();
                }

                //#endregion;

                /**
                  * проверяет  существует ли объект и равен ли конструктор объекта типу IGameObjectMeta
                  * @param {object} gameObjectMeta IGameObjectMeta    required
                  * @returns {bool} true or throw
                 *  throws[ClientNullReferenceException,ClientTypeErrorException]
                  */
                _self._isValidObjectMeta = function (gameObjectMeta) {
                    if (!gameObjectMeta) throw Errors.ClientNullReferenceException(null, "gameObjectMeta", "ITypeItem._checkObjectMeta");
                    if (typeof gameObjectMeta !== "object") throw Errors.ClientTypeErrorException({ gameObjectMeta: gameObjectMeta }, gameObjectMeta, "object/IGameObjectMeta", "ITypeItem._isValidObjectMeta");
                    return true;
                };

                /**
                 * Создает новый инст IGameObjectMeta
                 * @param {string} layerName required
                 * @param {string} baseSubName  see BASE_SUB_NAMES
                 * @returns {object} CreateGameObjectMeta
                 *  throws[ClientNullReferenceException] 
                 */
                _self.CreateGameObjectMeta = function (layerName, baseSubName) {
                    if (!layerName) Errors.ClientNullReferenceException({ layerName: layerName, baseSubName: baseSubName }, "layerName", "ITypeItem.CreateGameObjectMeta");
                    return new IGameObjectMeta(textureTypeId, layerName, baseSubName);
                };

                if (!notSetCss) {
                    _self.Css = new ICss(textureTypeId, mapTypeName, _self.CatalogUrl);
                    _self.Css.InitCss();
                }

                _self.GetOrCreateRenderOptions = function (layerName, gameObjectMeta, _layer) {
                    var layer = _self._getLayerElseIf(layerName, gameObjectMeta, false, _layer);
                    return layer.GetOrCreateRenderOptions();
                };

                _self.Pub = {};
                _self.Pub.GetLayer = function (layerName) {
                    return _self._getLayer(layerName, true);
                }
                _self.Pub.GetMeshContainer = function (layerName, meshSubTypeName) {
                    var layer = _self.Pub.GetLayer(layerName);
                    if (!layer) return null;
                    return layer.GetMeshContainer(meshSubTypeName);
                }
                _self.Pub.GetMeshId = function (layerName, subTypeMeshName, uniqueId, parentMehsId) {
                    var layer = _self.Pub.GetLayer(layerName);
                    if (!layer) return null;
                    return layer.GetMeshId(subTypeMeshName, uniqueId, parentMehsId);
                }
                _self.Pub.GetMesh = function (layerName, subTypeMeshName, uniqueId, parentMehsId) {
                    var layer = _self.Pub.GetLayer(layerName);
                    if (!layer) return null;
                    return layer.GetMeshId(subTypeMeshName, uniqueId, parentMehsId);
                }
                _self.Pub.GetIMaterialContainer = function (layerName, subtypeMaterialName) {
                    var layer = _self.Pub.GetLayer(layerName);
                    if (!layer) return null;
                    return layer.GetIMaterialContainer(subtypeMaterialName, true);
                }
                _self.Pub.GetMaterialId = function (layerName, subTypeMaterialName) {
                    var container = _self.Pub.GetIMaterialContainer(layerName, subTypeMaterialName);
                    if (!container) return null;
                    return container.GetOrCreateMaterialId();
                }
                _self.Pub.GetMaterial = function (layerName, subTypeMaterialName) {
                    var container = _self.Pub.GetIMaterialContainer(layerName, subTypeMaterialName);
                    if (!container) return null;
                    return container.GetMaterial();
                }


                _self.Pub.GetTexture = function (layerName, subTypeMaterialName, textureTypeName) {
                    var container = _self.Pub.GetIMaterialContainer(layerName, subTypeMaterialName);
                    if (!container) return null;
                    return container.GetTexture(textureTypeName);
                }
                _self.Pub.GetTextureUrl = function (layerName, subTypeMaterialName, textureTypeName) {
                    var container = _self.Pub.GetIMaterialContainer(layerName, subTypeMaterialName);
                    if (!container) return null;
                    return container.GetTextureUrl(textureTypeName);
                }
                _self.GetTextureContainer = function (layerName, subTypeMaterialName, textureTypeName) {
                    var container = _self.Pub.GetIMaterialContainer(layerName, subTypeMaterialName);
                    if (!container) return null;
                    return container.GetTextureObj(textureTypeName);
                }
                return _self;
            }

            return new ITypeItem();
        }
        ar.SetTypeItem = function (textureTypeId, typeItem) {
            ar.TypeList[textureTypeId] = typeItem;
        };
    };
})(EM.AssetRepository);
//#endregion;

//#endregion;

//#region Initialize TypeItem

//#region TypeList Mother
(function (ar) {
    "use strict";
    ar._initMother = function () {
        var motherTextureId = 2000;
        ar.A_MOTHER_IDS = [motherTextureId];

        var gt = ar.GAME_TEXTURE_ID_RANGES.Mother;
        ar.MapTypeContainer.GetOrAdd(motherTextureId, ar.MapTypes.Mother);

        function createItem() {
            var item = ar.ITypeItem(motherTextureId, gt.Name);
            item.Css.SetIconSelect(item.Css.MediumCss);
            ar.SetTypeItem(motherTextureId, item);
            return item;
        };

        ar._initGroup(createItem, null, true);
    };
})(EM.AssetRepository);

//#endregion;

//#region TypeList Galaxy 
(function (ar) {
    "use strict";
    ar._initGalaxies = function () {
        ar.A_GALAXY_IDS = [];
        var gt = ar.GAME_TEXTURE_ID_RANGES.Galaxy;
        var ln = ar.LAYER_NAMES;
        var text = ar.TEXTURE_TYPES;
        var stMn = ar.SUBTYPE_MATERIAL_NAMES;
        var bsn = ar.BASE_SUB_NAMES;
        var showLog = false;

        function createGalaxy1Material(material, iMaterial, matId, materialIsExist) {
            if (materialIsExist) {

                console.log("createGalaxyMaterial.materialIsExist", {
                    material: material,
                    iMaterial: iMaterial,
                    matId: matId
                });

                return material;

            }


            var emissiveTextureContainer = iMaterial.GetOrCreateTextureItem(text.Emissive);
            var bumpTextureContainer = iMaterial.GetOrCreateTextureItem(text.Bump, ar.EXTENTIONS.png);
            
            material.emissiveTexture = emissiveTextureContainer.GetOrCreateTexture();
            material.emissiveTexture.level = 3;
            material.backFaceCulling = false;
            material.disableLighting = true;
            material.useEmissiveAsIllumination = true;
            material.alpha = 0.999;
            material.alphaMode = BABYLON.Engine.ALPHA_ADD;


            var emFp = new BABYLON.FresnelParameters();
            emFp.bias = 0.1268;
            emFp.power = 10;
            emFp.leftColor = new BABYLON.Color3(0.6,0.85,0.97);
            emFp.rightColor = new BABYLON.Color3(0.36, 0.67, 0.93);
            material.emissiveFresnelParameters = emFp;



            material.bumpTexture = bumpTextureContainer.GetOrCreateTexture();
            material.bumpTexture.level = 3;// 3;
            material.useParallax = true;
            material.useParallaxOcclusion = false;
            material.parallaxScaleBias = 0.015;//0.007;//0.015;     

            //console.log("createGalaxy1Material", {
            //    emissiveTextureContainer: emissiveTextureContainer,
            //    bumpTextureContainer: material.bumpTexture,
            //});
            return material;
        };

        function createGalaxy1() {
            var textureId = 1;
            ar.A_GALAXY_IDS.push(textureId);
            var mapTypeInfo = ar.MapTypeContainer.GetOrAdd(textureId, ar.MapTypes.Galaxy, ar.MapTypes.Spirale);

            //var galaxyId = 1;
            var item = ar.ITypeItem(textureId, gt.Name);
            var meta = item.CreateGameObjectMeta(ln.space, bsn.regular);
            var meshContainer = item.AddMeshContainer(meta);
            meshContainer._addProp(ar.MAP_TYPE_KEY, mapTypeInfo);

            var material = item.GetOrCreateMaterial(meta, createGalaxy1Material, stMn.regular);
            var meshId = item.GetMeshId(ln.space);

            if (showLog) {
                console.log("createGalaxy1", {
                    galaxyItem: item,
                    meta: meta,
                    material: material,
                    meshId: meshId,
                    meshContainer: meshContainer
                });
            }


            ar.SetTypeItem(textureId, item);
            return item;
        }
        createGalaxy1();


    };
})(EM.AssetRepository);




//#endregion;

//#region TypeList Sector
(function (ar) {
    "use strict";
    ar._initSectors = function () {
        ar.A_SECTOR_IDS = [];
        var gt = ar.GAME_TEXTURE_ID_RANGES.Sector;
        var ln = ar.LAYER_NAMES;
        var stMn = ar.SUBTYPE_MATERIAL_NAMES;
        var showLog = false;
        function createSector201Material(material, materialIsExist, color, isEmissive, alpha) {
            if (materialIsExist) return material;
            color = BABYLON.Color3.FromInts(color.r, color.g, color.b);
            if (isEmissive) {
                material.emissiveColor = color;
                material.alpha = alpha || 1;
                material.disableLighting = true;
            } else {
                material.diffuseColor = color;
                material.emissiveColor = color;
            };
            return material;
        };

        function createSector201() {
            var textureId = 201;
            ar.A_SECTOR_IDS.push(textureId);
            var mapTypeInfo = ar.MapTypeContainer.GetOrAdd(textureId, ar.MapTypes.Sector);
            var item = ar.ITypeItem(textureId, gt.Name);
            var meta = item.CreateGameObjectMeta(ln.space);
            var meshContainer = item.AddMeshContainer(meta);
            meshContainer._addProp(ar.MAP_TYPE_KEY, mapTypeInfo);
            var meshId = item.GetMeshId(ln.space);
            item.GetOrCreateMaterial(meta, function (material, iMaterial, matId, materialIsExist) {
                return createSector201Material(material, materialIsExist, new BABYLON.Color3(230, 204, 255), true, 0.4);
            }, stMn.regular);

            item.GetOrCreateMaterial(meta, function (material, iMaterial, matId, materialIsExist) {
                return createSector201Material(material, materialIsExist, new BABYLON.Color3(255, 0, 0));
            }, stMn.click);

            item.GetOrCreateMaterial(meta, function (material, iMaterial, matId, materialIsExist) {
                return createSector201Material(material, materialIsExist, new BABYLON.Color3(25, 229, 225));
            }, stMn.hover);
            ar.SetTypeItem(textureId, item);
            if (showLog) {
                console.log("createSector201", { meshId: meshId, item: item });
            }

        };
        createSector201();
    };
})(EM.AssetRepository);

//#endregion

//#region TypeList Stars

(function (ar) {
    "use strict";
    ar._initStars = function () {
        var groupIds = ar.A_STAR_IDS = [301, 302, 303, 304, 305, 306, 307, 308];
 
        var gt = ar.GAME_TEXTURE_ID_RANGES.Star;
        var ln = ar.LAYER_NAMES;
        var text = ar.TEXTURE_TYPES;
        var bsn = ar.BASE_SUB_NAMES;
        var subMeshName = ar.SUBTYPE_MESH_NAMES;
        function createItem(textureTypeId, subMapTypeName, spriteIndex) {
            var mapTypeInfo = ar.MapTypeContainer.GetOrAdd(textureTypeId, ar.MapTypes.Star, subMapTypeName);
            var item = ar.ITypeItem(textureTypeId, gt.Name);
            var meta = item.CreateGameObjectMeta(ln.space);
            var baseStarContainer = item.AddMeshContainer(meta);
            item.GetMeshId(ln.space);

            var spriteMeta = item.CreateGameObjectMeta(ln.space, subMeshName.sprite);
            var spriteMeshContainer = item.AddMeshContainer(spriteMeta, null, ln.space, subMeshName.sprite);
            spriteMeshContainer._addProp("_parentName", EM.MapGeometry.SYSTEM_PROTO_NAME);
            spriteMeshContainer._addProp(ar.MAP_TYPE_KEY, mapTypeInfo);
            spriteMeshContainer._addProp("_spriteIndex", spriteIndex);

            spriteMeshContainer._addProp("_getFullSpriteId", function (systemId) {
                return spriteMeshContainer.GetMeshId(systemId, spriteMeshContainer._parentName);
            });

            spriteMeshContainer._addProp("_getBaseSpriteId", function (systemId) {
                return spriteMeshContainer.GetMeshId(systemId);
            });



            baseStarContainer._addProp(ar.MAP_TYPE_KEY, mapTypeInfo);
            baseStarContainer._addProp("_getFullSpriteId", function (systemId) {
                return spriteMeshContainer._getFullSpriteId(systemId);
            });



            item.GetOrCreateMaterial(meta, function (material, _iMaterial, matId, materialIsExist) {
                if (materialIsExist) return material;
                var emissiveTextureContainer = _iMaterial.GetOrCreateTextureItem(text.Emissive);
                material.emissiveTexture = emissiveTextureContainer.GetOrCreateTexture();
                material.emissiveTexture.level = 0.5;
                material.disableLighting = true;
                return material;
            }, bsn.regular);



            var spriteContainer = item.Pub.GetMeshContainer(ln.space, subMeshName.sprite);
            var spriteMesh = spriteContainer.GetMeshId();

            ar.SetTypeItem(textureTypeId, item);
        };

        createItem(301, ar.MapTypes.A, 0);
        createItem(302, ar.MapTypes.B, 1);
        createItem(303, ar.MapTypes.F, 2);
        createItem(304, ar.MapTypes.G, 3);
        createItem(305, ar.MapTypes.K, 4);
        createItem(306, ar.MapTypes.L, 5);
        createItem(307, ar.MapTypes.M, 6);
        createItem(308, ar.MapTypes.O, 7);

    };
})(EM.AssetRepository);

//#endregion;

//#region TypeList Planet    (all)
(function (ar) {
    "use strict";
    ar._initPlanets = function (newMeshes, sceneName) {

        ar.A_PLANET_IDS = [];
        var erthIds = [401, 402, 403, 404, 405, 406];
        var gasIds = [501, 502, 503, 504, 505];
        var iceGasIds = [601, 602];
        var showLog = false;


        if (showLog) {
            console.log("_initPlanets.newMeshes", newMeshes);
        }

        function _zero() {
            return BABYLON.Vector3.Zero();
        }

        var gt = ar.GAME_TEXTURE_ID_RANGES;
        var ln = ar.LAYER_NAMES;
        var text = ar.TEXTURE_TYPES;
        var sbMn = ar.SUBTYPE_MATERIAL_NAMES;
        var subMeshName = ar.SUBTYPE_MESH_NAMES;
        var gtn = ar.GO_TYPE_NAMES;
        var bsn = ar.BASE_SUB_NAMES;
        var ext = ar.EXTENTIONS;
        var blackColor = BABYLON.Color3.Black();
        var _mapTypeKey = ar.MAP_TYPE_KEY;
        var TWO_PI = Math.PI * 2;

        // SubtypeMaterialName

        function clientNotImplementedException(material, iMaterial, spaceLayer, materialType, message) {
            Errors.ClientNotImplementedException({
                material: material,
                iMaterial: iMaterial,
                spaceLayer: spaceLayer,
                materialType: materialType
            }, message);
        };

        function IEnverotmenEvent(onShow, onHide) {
            this.OnShow = onShow;
            this.OnHide = onHide;
        }



        var EVENTS = {
            _fogEvent: function (option) {
                var observer;
                var _scene = EM.Scene;
                var beforeFogColor;
                var beforeFogMod;
                var beforeFogDensity;
                function onShow(iPlanetEnverotmentItem, iPlanetEnverotment) {
                    beforeFogColor = _scene.fogColor.clone();
                    beforeFogMod = _scene.fogMode;
                    beforeFogDensity = _scene.fogDensity;

                    _scene.fogMode = option.fogMode;

                    _scene.fogColor = option.fogColor; //#4b4242
                    _scene.fogDensity = 0.0001;

                    var max = option.max || 1.566;
                    var min = option.min || max - option.dev;
                    var alpha = _.round(_.random(max, min), 3);
                    var step = option.step;
                    if (option.onBeforeShow) {
                        option.onBeforeShow();
                    }
                    observer = _scene.onBeforeRenderObservable.add(function (eventData, mask) {
                        // max = window._max;
                        var abs = Math.abs(alpha);
                        if (abs > max || abs < min) step *= -1;
                        alpha += step;
                        _scene.fogDensity = Math.cos(alpha);
                    });

                }
                function onHide(iPlanetEnverotmentItem, iPlanetEnverotment) {
                    if (option.onHide) {
                        option.onHide();
                    }
                    _scene.onBeforeRenderObservable.remove(observer);
                    _scene.fogMode = beforeFogMod;
                    _scene.fogDensity = beforeFogDensity;
                    _scene.fogColor = beforeFogColor;

                    beforeFogMod = null;
                    beforeFogDensity = null;
                    beforeFogColor = null;
                    observer = null;

                    console.log("IEnverotmenEvent onHide", {
                        iPlanetEnverotmentItem: iPlanetEnverotmentItem,
                        iPlanetEnverotment: iPlanetEnverotment
                    });
                }

                return new IEnverotmenEvent(onShow, onHide);
            },
            401: function () {
                return EVENTS._fogEvent({
                    dev: 0.008,
                    step: 0.000001,
                    fogColor: BABYLON.Color3.FromInts(75, 66, 66),
                    fogMode: BABYLON.Scene.FOGMODE_EXP2
                });
            },
            403: function () {
                //return EVENTS.standard();
                var evetnBeta = 1.1;
                var option = {
                    step: 0.000001,
                    fogColor: BABYLON.Color3.FromInts(125, 125, 140),
                    fogMode: BABYLON.Scene.FOGMODE_EXP,
                    max: Math.PI / 2,
                    min: 1.550,
                    onBeforeShow: function () {
                        //EM.GameCamera.Camera.fov = 1.5;
                        //EM.GameCamera.Camera.upperBetaLimit = evetnBeta;
                    },
                    onHide: function () {
                        //EM.GameCamera.Camera.fov = EM.GameCamera.InUserPlanet.fov;
                        //EM.GameCamera.Camera.upperBetaLimit = EM.GameCamera.InUserPlanet.upperBetaLimit;
                    }
                };
                // window._option = option;
                return EVENTS._fogEvent(option);
            },
            standard: function () {
                return new IEnverotmenEvent(function (iPlanetEnverotmentItem, iPlanetEnverotment) {
                    console.log("IEnverotmenEvent onShow", {
                        iPlanetEnverotmentItem: iPlanetEnverotmentItem,
                        iPlanetEnverotment: iPlanetEnverotment
                    });
                }, function (iPlanetEnverotmentItem, iPlanetEnverotment) {
                    console.log("IEnverotmenEvent onHide", {
                        iPlanetEnverotmentItem: iPlanetEnverotmentItem,
                        iPlanetEnverotment: iPlanetEnverotment,
                    });
                });
            }
        };

        var defaultEmColor3Int = new BABYLON.Color3(197, 172, 163);
        var defaultColor3 = BABYLON.Color3.FromInts(defaultEmColor3Int.r, defaultEmColor3Int.g, defaultEmColor3Int.b);
        // var _scale = 1.02;
        var _scale = 1.03;
        var specularPower = 100;

        /**
         * 
         * @param {object} _baseColor     BABYLON.Vector3 0-255
         * @param {object} defaultColor      BABYLON.Vector3 0-1
         * @returns {} 
         */
        function getColorFromInts(_baseColor, defaultColor) {
            return Utils.GetColor3FromInts(_baseColor, defaultColor || defaultColor3);
        }

        function crateFresnel(bias, power, leftColor, rightColor) {
            var fresnel = new BABYLON.FresnelParameters();
            if (bias) fresnel.bias = bias;
            if (power) fresnel.power = power;
            if (leftColor) fresnel.leftColor = leftColor.clone();
            if (rightColor) fresnel.rightColor = rightColor.clone();
            return fresnel;
        }
        function log(key, val, textureTypeId, prefix) {
            if (!showLog) return;
            var data = {};
            data[key] = val;
            var _prefix = "item";
            if (prefix) _prefix = prefix;
            var mes = _prefix + ".__{" + textureTypeId + "}__";
            console.log(mes, data);
        }

        var MATERIALES = {
            401: function (material, iMaterial, layer) {
                if (layer.LayerName === ln.ground) {
                    return MATERIALES.standartGround(material, iMaterial, layer);
                }
                if (layer.LayerName === ln.env) return MATERIALES.standartEnv(material, iMaterial, layer);

                if (layer.LayerName === ln.space) {
                    if (iMaterial.SubtypeMaterialName === sbMn.regular) {
                        var diffuse = iMaterial.GetOrCreateTexture(text.Dffuse);
                        material.diffuseTexture = diffuse;
                        material.diffuseTexture.level = 2;

                        var bump = iMaterial.GetOrCreateTexture(text.Bump);

                        material.bumpTexture = bump;
                        //    material.bumpTexture.anisotropicFilteringLevel = 3;
                        material.bumpTexture.level = 1;

                        var light = iMaterial.GetOrCreateTexture(text.Light);
                        material.lightmapTexture = light;
                        material.lightmapTexture.level = 0.5;

                        //em Fresnel
                        var emColor = BABYLON.Color3.FromInts(197, 172, 163);
                        material.emissiveColor = emColor.clone();
                        material.useEmissiveAsIllumination = true;
                        material.emissiveFresnelParameters = crateFresnel(0.5, 2, emColor, blackColor);


                        var spec = iMaterial.GetOrCreateTexture(text.Specular);
                        material.specularTexture = spec;
                        material.specularPower = specularPower;



                        // action
                        var dir = 1;
                        var step = 0.005;
                        var spaceRenderOption = layer.GetOrCreateRenderOptions();
                        var key = ar.BEFORE_RENDER_SPACE_PLANET_ACTION_KEY;
                        function onBeforeRenderSpace401(eventData, mask, params, renderOption) {
                            try {
                                params.cloud.rotation.y += 0.0003;
                                params.planet.rotation.y -= 0.0003;

                                if (params.cloud.rotation.y > TWO_PI) params.cloud.rotation.y -= TWO_PI;
                                if (params.planet.rotation.y < TWO_PI) params.planet.rotation.y += TWO_PI;
                                var light = params.planet.material.lightmapTexture;

                                var cloudEmissive = params.cloud.material.emissiveTexture;
                                if (light.level > 2 || light.level < 0.5) dir = -dir;
                                light.level += step * dir;
                                //  console.log("onBeforeRenderSpace401 GO", params.cloud.rotation);     

                                return true;
                            }
                            catch (e) {
                                console.log("onBeforeRenderSpace401 STOP");
                                return false;
                            }

                        };
                        spaceRenderOption.AddFunction(key, onBeforeRenderSpace401);
                        return material;

                    }
                    else if (iMaterial.SubtypeMaterialName === sbMn.cloud) {

                        var m = MATERIALES.standard(material, iMaterial, layer);
                        m.specularColor = new BABYLON.Color3(0, 0, 0);
                        return m;
                    }
                }


                else return material;
            },
            402: function (material, iMaterial, layer) {
                if (layer.LayerName === ln.ground) {
                    material.diffuseTexture.uScale = material.diffuseTexture.vScale = 2;
                    material.diffuseTexture.level = 0.75;
                    material.diffuseColor.r = 0.7;
                    material.diffuseColor.b = 0.5;
                    material.diffuseFresnelParameters = crateFresnel(0.9, 13, blackColor, new BABYLON.Color3(1, 1, 1));
                    material.emissiveFresnelParameters = crateFresnel(0.1, 0.6, new BABYLON.Color3(1, 1, 1), blackColor);
                    material.emissiveColor = new BABYLON.Color3(1, 0.9, 0.9);


                    return MATERIALES.standartGround(material, iMaterial, layer);
                }
                else if (layer.LayerName === ln.env) {
                    material.emissiveTexture = material.diffuseTexture;
                    material.emissiveTexture.level = 0.75;
                    return material;
                }
                else if (layer.LayerName === ln.space) {
                    if (iMaterial.SubtypeMaterialName === sbMn.regular) {

                        material.specularColor = new BABYLON.Color3(0, 0, 0);
                        var diffuse = iMaterial.GetOrCreateTexture(text.Dffuse);
                        material.diffuseTexture = diffuse;
                        material.diffuseTexture.level = 1.1;

                        //todo  создает проблему на рендере появляются черные точки      верменно  выключенна

                        var bump = iMaterial.GetOrCreateTexture(text.Bump);

                        material.bumpTexture = bump;
                        //          material.bumpTexture.anisotropicFilteringLevel = 3;
                        material.bumpTexture.level = 1;

                        var baseColor = BABYLON.Color3.FromInts(88, 54, 30);
                        material.diffuseColor = BABYLON.Color3.White();
                        material.diffuseFresnelParameters = crateFresnel(0.6, 50, baseColor.clone(), BABYLON.Color3.White());
                        material.specularColor = baseColor.clone();
                        material.specularPower = 2;


                        material.emissiveColor = BABYLON.Color3.FromInts(164, 122, 70);
                        material.useEmissiveAsIllumination = true;
                        material.emissiveFresnelParameters = crateFresnel(0.5, 2, BABYLON.Color3.White(), blackColor);



                        var spaceRenderOption = layer.GetOrCreateRenderOptions();
                        var key = ar.BEFORE_RENDER_SPACE_PLANET_ACTION_KEY;

                        function onBeforeRenderSpace402(eventData, mask, params, renderOption) {
                            try {
                                params.planet.rotation.y -= 0.0003;
                                if (params.planet.rotation.y < TWO_PI) params.planet.rotation.y += TWO_PI;
                                return true;
                            }
                            catch (e) {
                                console.log("onBeforeRenderSpace402 STOP", { e: e });
                                return false;
                            }

                        };
                        spaceRenderOption.AddFunction(key, onBeforeRenderSpace402);
                        return material;

                    }
                    if (iMaterial.SubtypeMaterialName === sbMn.cloud) {
                        material.alphaMode = BABYLON.Engine.ALPHA_SUBTRACT;
                        material.alpha = 0.9;
                        material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
                        material.specularColor = blackColor.clone();
                        return material;
                    }
                }

                else return material;
            },
            403: function (material, iMaterial, layer) {
                if (layer.LayerName === ln.ground) {
                    //m.id ="planets.403_ground"

                    //material.diffuseTexture.uScale = material.diffuseTexture.vScale = 1;
                    //material.diffuseTexture.level = 0.75;
                    //material.diffuseColor.r = 0.7;
                    //material.diffuseColor.b = 0.5;
                    material.diffuseFresnelParameters = crateFresnel(0.7, 5, new BABYLON.Color3(0.7, 0.7, 0.7), new BABYLON.Color3(1, 1, 1));
                    material.emissiveFresnelParameters = crateFresnel(0.95, 20, new BABYLON.Color3(1, 1, 1), blackColor);
                    material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
                    material.specularColor = new BABYLON.Color3(0.15, 0.15, 0.1);
                    material.specularPower = 200;
                    // iMaterial.  
                    //gm.bumpTexture.level =1
                    if (material.bumpTexture) {
                        Utils.Console.Warn("ground.403 material.bumpTexture - exist and will be disposed", {
                            material: material,
                            iMaterial: iMaterial
                        });
                        material.bumpTexture.dispose();
                        delete material.bumpTexture;

                    }
                    material.bumpTexture = iMaterial.GetOrCreateTexture(text.Bump, ext.png);
                    material.useParallax = true;
                    material.useParallaxOcclusion = true;
                    material.parallaxScaleBias = 0.002;
                    return MATERIALES.standartGround(material, iMaterial, layer);
                }
                else if (layer.LayerName === ln.env) {
                    material.emissiveTexture = material.diffuseTexture;
                    material.emissiveTexture.level = 0.85;
                    return material;
                }
                else if (layer.LayerName === ln.space) {
                    if (iMaterial.SubtypeMaterialName === sbMn.regular) {
                        material.specularColor = new BABYLON.Color3(0, 0, 0);
                        var diffuse = iMaterial.GetOrCreateTexture(text.Dffuse);
                        material.diffuseTexture = diffuse;
                        material.diffuseTexture.level = 1.1;
                        material.invertNormalMapY = material.invertNormalMapX = true;
                        material.specularPower = 20;
                        //todo  создает проблему на рендере появляются черные точки      верменно  выключенна

                        var bump = iMaterial.GetOrCreateTexture(text.Bump);

                        material.bumpTexture = bump;
                        material.bumpTexture.anisotropicFilteringLevel = 3;
                        material.bumpTexture.level = 5;

                        material.diffuseFresnelParameters = crateFresnel(0.2, 3.4, blackColor.clone(), BABYLON.Color3.White());

                        var spaceRenderOption = layer.GetOrCreateRenderOptions();


                        spaceRenderOption.AddFunction(ar.BEFORE_RENDER_SPACE_PLANET_ACTION_KEY, function (eventData, mask, params, renderOption) {
                            try {
                                params.planet.rotation.y += 0.0005;
                                params.cloud.rotation.y += 0.0007;
                                if (params.planet.rotation.y > TWO_PI) params.planet.rotation.y -= TWO_PI;
                                if (params.cloud.rotation.y > TWO_PI) params.planet.rotation.y -= TWO_PI;
                                return true;
                            }
                            catch (e) {
                                console.log("onBeforeRenderSpace403 STOP", { e: e });
                                return false;
                            }

                        });
                        return material;

                    }
                    else if (iMaterial.SubtypeMaterialName === sbMn.cloud) {
                        material.alphaMode = BABYLON.Engine.ALPHA_MAXIMIZED;
                        material.alpha = 0.99;
                        var emTexture = iMaterial.GetOrCreateTexture(text.Emissive);
                        emTexture.level = 5;    
                        material.emissiveTexture = emTexture;
                        material.disableLighting = true;
                        //var bumpCloud = iMaterial.GetOrCreateTexture(text.Bump); 
                        //material.bumpTexture = bumpCloud;    
                        material.emissiveColor = new BABYLON.Color3(0.63, 0.67, 0.77);
                        material.emissiveFresnelParameters = crateFresnel(0, 0.2, BABYLON.Color3.White(), blackColor);
                        //console.log("403 material", {
                        //    emTexture: emTexture,
                        //    material: material,
                        //    iMaterial: iMaterial,
                        //    layer: layer,
                        //});
                        return material;
                    }
                }
                else return material;
            },
            standard: function (material, iMaterial, layer, onSetStandart, emmisiveColorInt, setAlphaMode) {
                function _log(key, val) {
                    log(key, val, layer.TextureTypeId, "mats.standart{" + iMaterial.SubtypeMaterialName + "}");
                }
                _log("standart.material", material);
                if (layer.LayerName === ln.env) return MATERIALES.standartEnv(material, iMaterial, layer, onSetStandart);
                else if (layer.LayerName === ln.ground) return MATERIALES.standartGround(material, iMaterial, layer, onSetStandart);
                else if (layer.LayerName === ln.space) {
                    var _emColor = getColorFromInts(emmisiveColorInt);

                    function _setAlphaToMaterial(_setAlphaMode) {
                        if (_setAlphaMode && material.alphaMode !== BABYLON.Engine.ALPHA_ADD) {
                            material.alphaMode = BABYLON.Engine.ALPHA_ADD;
                            if (material.alpha === 1) material.alpha = 0.999;
                        }
                    }

                    if (setAlphaMode) {
                        _setAlphaToMaterial(true);
                    }

                    if (iMaterial.SubtypeMaterialName === sbMn.regular) {

                        _log("iMaterial.SubtypeMaterialName === sbMn.regular  !material.diffuseTexture", !material.diffuseTexture);
                        if (!material.diffuseTexture) {
                            var diffuse = iMaterial.GetOrCreateTexture(text.Dffuse);
                            if (diffuse) {
                                material.diffuseTexture = diffuse;
                                material.diffuseTexture.level = 1;
                            }

                        }

                        //todo  создает проблему на рендере появляются черные точки      верменно  выключенна
                        if (!material.bumpTexture) {
                            // var bump = iMaterial.GetOrCreateTexture(text.Bump);
                            if (false) {
                                material.bumpTexture = bump;
                                material.bumpTexture.anisotropicFilteringLevel = 3;
                                material.bumpTexture.level = 1;
                            }

                        }
                        if (!material.lightmapTexture) {
                            var light = iMaterial.GetOrCreateTexture(text.Light);
                            if (light) {
                                material.lightmapTexture = light;
                                material.lightmapTexture.level = 0.5;
                            }

                        }

                        if (_emColor && !material.emissiveFresnelParameters) {
                            material.emissiveColor = _emColor.clone();
                            material.useEmissiveAsIllumination = true;
                            material.emissiveFresnelParameters = crateFresnel(0.5, 2, _emColor, blackColor);

                        }

                        if (!material.specularTexture) {
                            var spec = iMaterial.GetOrCreateTexture(text.Specular);
                            if (spec) {
                                material.specularTexture = spec;
                                material.specularPower = specularPower;
                            }

                        }



                        if (onSetStandart instanceof Function) return onSetStandart(material, iMaterial, layer, sbMn.regular);
                        return material;
                    }

                    else if (iMaterial.SubtypeMaterialName === sbMn.cloud) {
                        var regularMatContainer = layer.GetIMaterialContainer(sbMn.regular);
                        var regMaterial = regularMatContainer.GetMaterial();
                        if (!regMaterial) throw new Error("базовый метериал небыл создан");
                        if (!material.emissiveTexture) {
                            var emTexture = iMaterial.GetOrCreateTexture(text.Emissive);
                            if (emTexture) {

                                material.emissiveColor = _emColor.clone();
                                material.emissiveTexture = emTexture;
                                material.emissiveTexture.level = 1;
                                material.disableLighting = true;


                                if (!material.diffuseTexture) {
                                    var _diffuse = emTexture.clone();
                                    _diffuse.level = 2;
                                    iMaterial.SetExternalTexture(text.Dffuse, _diffuse);
                                    material.diffuseTexture = _diffuse;
                                }
                                if (!material.specularTexture) {
                                    var specular = regMaterial.specularTexture.clone();
                                    if (!specular) throw new Error("specular not exist");
                                    iMaterial.SetExternalTexture(text.Specular, specular);
                                    material.specularTexture = specular;
                                    material.specularPower = specularPower;
                                }

                                if (!material.opacityFresnelParameters) {
                                    material.opacityFresnelParameters = crateFresnel(0.9, 10, _emColor, blackColor);
                                }
                                if (!material.emissiveFresnelParameters) {
                                    material.emissiveFresnelParameters = crateFresnel(0.1, 1, blackColor, _emColor);
                                }
                                _setAlphaToMaterial(true);
                                material.alpha = 0.9;
                            }
                        }


                        if (onSetStandart instanceof Function) return onSetStandart(material, iMaterial, layer, sbMn.cloud);
                        return material;
                    }
                    else if (iMaterial.SubtypeMaterialName === sbMn.ring) throw clientNotImplementedException(material, iMaterial, layer, sbMn.ring, "materialType === stMn.ring");
                }


                else throw clientNotImplementedException(material, iMaterial, layer, iMaterial.SubtypeMaterialName, "Material type is wrong");

            },
            standartEnv: function (material, iMaterial, layer, onSetStandart) {
                if (onSetStandart instanceof Function) return onSetStandart(material, iMaterial, layer);
                //  material.useLogarithmicDepth = true;
                return material;
            },
            standartGround: function (material, iMaterial, layer, onSetStandart) {
                if (onSetStandart instanceof Function) return onSetStandart(material, iMaterial, layer, onSetStandart);

                return material;
            }
        };


        function tryGetMesh(meta) {
            var meshId = ar.GetMeshIdByMeta(meta);
            if (meshId) {
                var mesh = EM.GetMesh(meshId);
                if (!mesh) {
                    log("mesh", {
                        mesh: mesh,
                        meta: meta
                    }, meta.TextureTypeId, "tryGetMesh");
                    return null;
                }
                return mesh;
            }
            else return null;
        }

        function _addMeshContainer(tryLoadMeshFromFile, iTypeItem, gameObjectMeta, subTypeMeshName, _externalMesh) {
            var result = {
                loadedMesh: null,
                meshLoaded: false,
                meshContainer: null,
                meshId: null
            }
            if (tryLoadMeshFromFile) {
                var mesh = _externalMesh || tryGetMesh(gameObjectMeta);
                if (mesh) {
                    result.meshContainer = iTypeItem.AddMeshContainerFromExternalMesh(mesh, gameObjectMeta, subTypeMeshName);
                    result.meshLoaded = true;
                    result.loadedMesh = mesh;
                }
                else {
        

                    log("mesh", {
                        tryLoadMeshFromFile: tryLoadMeshFromFile,
                        iTypeItem: iTypeItem,
                        gameObjectMeta: gameObjectMeta,
                        result: result
                    }, gameObjectMeta.TextureTypeId, "_addMeshContainer.mesh.notFiended");
                }

            }
            if (!result.meshLoaded) result.meshContainer = iTypeItem.AddMeshContainer(gameObjectMeta, null, null, subTypeMeshName);
            result.meshId = result.meshContainer.GetMeshId();   
            return result;
        }

        function _createMaterial(material, iMaterial, materialIsExist, layer) {
            if (materialIsExist) return material;  
            if (MATERIALES[iMaterial.TextureTypeId]) return MATERIALES[iMaterial.TextureTypeId](material, iMaterial, layer);
            return MATERIALES.standard(material, iMaterial, layer);
        }

        function createOrUpdate(meta, typeItem, materialType, loadedMesh, _meshId) {
            var textureId = meta.TextureTypeId;
            function _log(key, val) {
                log(key, val, textureId, "createOrUpdateMaterial.materialType_{" + materialType + "}_");
            }

            var material = null;
            var loadExternalMaterial = !!loadedMesh;
            _log("loadExternalMaterial", { loadExternalMaterial: loadExternalMaterial, loadedMesh: loadedMesh, "!!loadedMesh": !!loadedMesh });
            var layer = typeItem.GetOrCreateLayer(meta);
            _log("layer", layer);

            var iMaterialContainer = typeItem.GetOrCreateIMaterial(meta, materialType, layer);


            if (layer.LayerName === ln.space) {
                if (loadedMesh) {
                    throw new Error("в сцене существует меш с именем спейс или спейс клауд");
                }
                if (!_meshId) {
                    throw new Error("_meshId not exit", { _meshId: _meshId, meta: meta, typeItem: typeItem });
                }
                var mesh = BABYLON.Mesh.CreateSphere(_meshId, 12, 1, EM.Scene);
                mesh.isVisible = false;
                mesh.isPickable = false;
                mesh.material = material = iMaterialContainer.GetOrCreateMaterial(function (_material, _iMaterial, _matId, _materialIsExist) {
                    return _createMaterial(_material, _iMaterial, _materialIsExist, layer);
                });
                _log("loadExternalMaterial layer.LayerName === ln.space, material", material);

            }       
            else if (loadExternalMaterial) {
                iMaterialContainer.SetScenePrefix(sceneName);
                iMaterialContainer.SetExternalMaterial(loadedMesh.material);
                material = _createMaterial(loadedMesh.material, iMaterialContainer, false, layer);
                _log("updatedMaterialFromLoadData", material);
            }
            else {
                material = iMaterialContainer.GetOrCreateMaterial(function (_material, _iMaterial, _matId, _materialIsExist) {
                    return _createMaterial(_material, _iMaterial, _materialIsExist, layer);
                });
                //  _log("CreatedMaterial", material);
            }
            //  material.useLogarithmicDepth = true;

            return {
                iMaterialContainer: iMaterialContainer,
                material: material,
                layer: layer,
                matId: material.id,
                loadExternalMaterial: loadExternalMaterial
            };


        }

        function createItem(textureTypeId, subMapTypeName, canUseRing, loadFromFile) {
            function _log(key, val) {
                log(key, val, textureTypeId, "createItem");
            }
            var item = ar.ITypeItem(textureTypeId, subMapTypeName, textureTypeId.toString());
            ar.A_PLANET_IDS.push(textureTypeId);

            var mapTypeInfo = ar.MapTypeContainer.GetOrAdd(textureTypeId, ar.MapTypes.Planet, subMapTypeName);
            // space

            // space regular
            var metaSpace = item.CreateGameObjectMeta(ln.space, bsn.regular);
            //   _log("metaSpace", metaSpace);
            var spRegularMeshInfo = _addMeshContainer(loadFromFile, item, metaSpace, subMeshName.regular);
            spRegularMeshInfo.meshContainer._addProp(_mapTypeKey, mapTypeInfo);

            _log("spRegularMeshInfo", spRegularMeshInfo);
            //console.log("spRegularMeshInfo", {
            //    spRegularMeshInfo: spRegularMeshInfo
            //});
              var spRegular = createOrUpdate(metaSpace, item, sbMn.regular, null, spRegularMeshInfo.meshId);
            _log("spRegular", spRegular);

            // space cloud
            var spCloudMeta = item.CreateGameObjectMeta(ln.space, bsn.cloud);
             _log("spCloudMeta", spCloudMeta);

            var spCloudMeshInfo = _addMeshContainer(loadFromFile, item, spCloudMeta, subMeshName.cloud);
             _log("spCloudMeshInfo", spCloudMeshInfo);
             var spCloud = createOrUpdate(spCloudMeta, item, sbMn.cloud, null, spCloudMeshInfo.meshId);
            spCloudMeshInfo.meshContainer._addProp("_cloudScaling", _scale);
            spCloudMeshInfo.meshContainer._addProp(_mapTypeKey, mapTypeInfo);

            //   _log("spCloud", spCloud);

            // space ring
            if (canUseRing) {
                var spRingMeta = item.CreateGameObjectMeta(ln.space, bsn.ring);
                _log("spRingMeta", spRingMeta);
                var spRingMeshInfo = _addMeshContainer(loadFromFile, item, spRingMeta, subMeshName.ring);
                _log("spRingMeshInfo", spRingMeshInfo);
                spRingMeshInfo.meshContainer._addProp(_mapTypeKey, mapTypeInfo);
                var spRing = createOrUpdate(spRingMeta, item, sbMn.ring, spRingMeta.loadedMesh);
                _log("spRing", spRing);

            }

            // enverotment                              
            var envMaterialMeshId = ar._createOriginalMeshIdTemplate(textureTypeId, ln.env, subMeshName.material);
            var envMeshMaterial = EM.GetMesh(envMaterialMeshId);
            if (!envMeshMaterial) {
                _log("!envMeshMaterial", {
                    envMeshMaterial: envMeshMaterial
                });
                throw new Error("envMeshMaterial  NOT EXIST IN LOADED FILES");

            }
            var envMeta = item.CreateGameObjectMeta(ln.env, bsn.regular);
            //    _log("metaEnv", envMeta);
            var envMeshInfo = _addMeshContainer(true, item, envMeta, subMeshName.material, envMeshMaterial);
            envMeshInfo.meshContainer._addProp(_mapTypeKey, mapTypeInfo);
            //   _log("envMeshInfo", envMeshInfo);
            var envRegular = createOrUpdate(envMeta, item, sbMn.regular, envMeshInfo.loadedMesh);
            //     _log("envRegular", envRegular);

            // ground
            var groundMeta = item.CreateGameObjectMeta(ln.ground, bsn.regular);
            //    _log("groundMeta", groundMeta);

            var groudnMeshInfo = _addMeshContainer(true, item, groundMeta, subMeshName.regular);
            envMeshInfo.meshContainer._addProp(_mapTypeKey, mapTypeInfo);
            //   _log("groudnMeshInfo", groudnMeshInfo);

            var groundRegular = createOrUpdate(groundMeta, item, sbMn.regular, groudnMeshInfo.loadedMesh);
            //   _log("groundRegular", groundRegular);


            if (groudnMeshInfo.meshLoaded && envMeshInfo.meshLoaded) {

                var event;
                if (EVENTS[textureTypeId]) event = EVENTS[textureTypeId]();
                else event = EVENTS.standard();
                var iPlanetEnverotment = ar.CreateIPlanetEnverotment(groudnMeshInfo.loadedMesh, envMeshInfo.loadedMesh, textureTypeId, event.OnShow, event.OnHide);
                var getEnverotmentKey = ar.IPLANET_ENVEROTMENT_KEY;

                spRegularMeshInfo.meshContainer._addProp(getEnverotmentKey, iPlanetEnverotment);
                envMeshInfo.meshContainer._addProp(getEnverotmentKey, iPlanetEnverotment);
                groudnMeshInfo.meshContainer._addProp(getEnverotmentKey, iPlanetEnverotment);
            }
            else {
                //   _log("groudnMeshInfo.meshLoaded && envMeshInfo.meshLoaded", { groudnMeshInfo: groudnMeshInfo, envMeshInfo: envMeshInfo  });
                throw new Error("ENVEROTMENT NOT EXIST IN LOADED FILES");
            }



            ar.SetTypeItem(textureTypeId, item);
        };

        function _initGroup(textureIds, mapTypeName, canUseRing, loadFromFile) {
            ar._initGroup(function (textureTypeId) {
                createItem(textureTypeId, mapTypeName, canUseRing, loadFromFile);
            }, textureIds);
        }

        var hasScene = newMeshes && newMeshes.length > 0 && sceneName && typeof sceneName === "string" && sceneName.length > 0;

        _initGroup(erthIds, ar.MapTypes.Earth, false, hasScene ? true : false);
        _initGroup(gasIds, ar.MapTypes.Gas, false, hasScene ? true : false);
        _initGroup(iceGasIds, ar.MapTypes.IceGas, false, hasScene ? true : false);


    };
})(EM.AssetRepository);

//#endregion;


//#region TypeList Moons
(function (ar) {
    "use strict";
    ar._initMoons = function () {
        var groupIds = ar.A_MOON_IDS = [901, 902, 903, 904, 905, 906];
        var gt = ar.GAME_TEXTURE_ID_RANGES.Sector;
        var ln = ar.LAYER_NAMES;
        var text = ar.TEXTURE_TYPES;
        var bsn = ar.BASE_SUB_NAMES;
        function createItem(textureTypeId) {
            var item = ar.ITypeItem(textureTypeId, gt.Name);
            var meta = item.CreateGameObjectMeta(ln.space);
            var mapTypeInfo = ar.MapTypeContainer.GetOrAdd(textureTypeId, ar.MapTypes.Satellite, ar.MapTypes.Moon);
            var meshContainer = item.AddMeshContainer(meta);
            meshContainer._addProp(ar.MAP_TYPE_KEY, mapTypeInfo);
            item.GetMeshId(ln.space);
            item.GetOrCreateMaterial(meta, function (material, iMaterial, matId, materialIsExist) {
                if (materialIsExist) return material;
                var dffuseTextureContainer = iMaterial.GetOrCreateTextureItem(text.Dffuse);
                material.diffuseTexture = dffuseTextureContainer.GetOrCreateTexture();
                material.diffuseTexture.level = 1;
                return material;
            }, bsn.regular);
            ar.SetTypeItem(textureTypeId, item);
            return item;
        };


        ar._initGroup(createItem, groupIds);
    };
})(EM.AssetRepository);

//#endregion;


// #region Universe
(function (ar) {
    "use strict";
    ar._initUniverse = function (scene) {
        // old
        // var Enveropment = {};  
        var universeId = 4001;
        ar.A_UNIVERSE_IDS = [universeId];
        ar.MapTypeContainer.AddCollection(ar.A_UNIVERSE_IDS, ar.MapTypes.Universe);
        var gt = ar.GAME_TEXTURE_ID_RANGES.Sector;
        var ln = ar.LAYER_NAMES;
        var text = ar.TEXTURE_TYPES;
        var stMn = ar.SUBTYPE_MATERIAL_NAMES;
        var subMeshName = ar.SUBTYPE_MESH_NAMES;
        var bsn = ar.BASE_SUB_NAMES;
        var clearColor = new BABYLON.Color3.Black;
        scene.clearColor = clearColor;

 
        function _createSkayBoxMaterial(material, cubeTexture, alpha, reflection) { 
            material.backFaceCulling = false;
            material.reflectionTexture = cubeTexture;
            material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            material.disableLighting = true;
            material.reflectionTexture.level = (typeof reflection === "number") ? reflection : 2;
            material.alpha = alpha || 1;
            if (material.alpha !== 1) material.alphaMode = BABYLON.Engine.ALPHA_ADD;
            return material;
        }

        var item = ar.ITypeItem(universeId, gt.Name);
        var meta = item.CreateGameObjectMeta(ln.env);
        var universeMeshContainer = item.AddMeshContainer(meta);
        var universeBoxMeshId = universeMeshContainer.GetMeshId();

        var universeMaterial = item.GetOrCreateMaterial(meta, function (material, iMaterial, matId, materialIsExist) {
            if (materialIsExist) return material;
            var emissiveTextureContainer = iMaterial.GetOrCreateTextureItem(text.Emissive);
            var emFileName = emissiveTextureContainer.FileName;
            var cubeTextureContainer = iMaterial.GetOrCreateTextureItem(text.Reflection);
            var cubeTexture = cubeTextureContainer.GetOrCreateCubeTextureFromOneFile(emFileName);

            var mat = _createSkayBoxMaterial(material, cubeTexture, 0.999999, 2);
            mat.emissiveTexture = emissiveTextureContainer.GetOrCreateTexture();
            mat.emissiveTexture.level = 1.5;
            mat.emissiveTexture.useEmissiveAsIllumination = true;
            mat.material = mat;
            return mat;
        }, stMn.regular);

        
       // universeMaterial.useLogarithmicDepth = true;
        function createUniverse() {
            var mesh = BABYLON.Mesh.CreateSphere(universeBoxMeshId, 32, 1.8e6, scene);
            ar.UNIVERSE_SKY_BOX_MESH_ID = mesh.id;
            mesh.material = universeMaterial;
            mesh.setEnabled(1);
            return mesh;
        }

        var universeMesh = createUniverse();

        var nibulaMeta = item.CreateGameObjectMeta(ln.env, bsn.cloud);
        var nibulaMeshContainer = item.AddMeshContainer(nibulaMeta, null, null, subMeshName.cloud);
        var nibulaBoxMeshId = nibulaMeshContainer.GetMeshId();
        ar.NUBULA_BOX_MESH_ID = nibulaBoxMeshId;

        function _setBlackDiffuserAndSpecular(material) {
            material.diffuseColor = new BABYLON.Color3(0, 0, 0);
            material.specularColor = new BABYLON.Color3(0, 0, 0);
        }

        function _createNibulaBoxMaterial(dir, material, textureContainer) {
            // console.log("nibulaMaterial.cubeTexture", { cubeTexture: cubeTexture });
            var cubeTexture = textureContainer.GetOrCreateCubeTexture();   
            _createSkayBoxMaterial(material, cubeTexture, 0.9999, 1.2); 
            _setBlackDiffuserAndSpecular(material);
            return material;
        }

        function _createNibulaHdrMaterial(name, dir, material, textureContainer) {
            var hdrTexture = textureContainer.GetOrCreateHdrTexture(name, dir);
 
            _createSkayBoxMaterial(material, hdrTexture, 0.9999,1.2); 
            _setBlackDiffuserAndSpecular(material);
            return material;
        }

        /**
        * top.jpg -  по часовйо +90
        * bottom.jpg  против часовой -90
        */
        var nibulaMaterial = item.GetOrCreateMaterial(nibulaMeta, function (material, iMaterial, matId, materialIsExist) {
            if (materialIsExist) return material;
            var dir = iMaterial.CreateSubDirUrl("nibulabox"); 
            var textureContainer = iMaterial.GetOrCreateTextureItem(text.Reflection, false, false, dir);  
 
            _createNibulaBoxMaterial(dir, material, textureContainer);
           // nibula-box_4k_75 nibula-box_4k_50
            //_createNibulaHdrMaterial("hdr/box_3k", dir, material, textureContainer);
            return material;
        }, stMn.cloud);

        
       //  nibulaMaterial.useLogarithmicDepth = true;
        function createNibulaBox() {
            var mesh = BABYLON.Mesh.CreateSphere(nibulaBoxMeshId, 32, 1.3e6, scene);
           mesh.rotation.z = Math.PI / 4;
           mesh.rotation.x = Math.PI / 6;
            mesh.material = nibulaMaterial;
            return mesh;
        }

        createNibulaBox();

        var activeZoneMeshContainer = item.AddMeshContainer(meta, null, ln.env, subMeshName.empty);
        var activeZoneMeshId = activeZoneMeshContainer.GetMeshId();
        ar.ACTIVE_WORLD_MESH_ID = activeZoneMeshContainer.GetMeshId(null, universeBoxMeshId);
        function createactiveZone() {
            var mesh = universeMesh.clone(activeZoneMeshId);
            var scale = 0.3;
            mesh.scaling = new BABYLON.Vector3(scale, scale, scale);
            var rotation = -1;
            mesh.rotation = new BABYLON.Vector3(rotation, rotation, rotation);
          //  mesh.material.useLogarithmicDepth = true;
             EM.MapEvent.InitSceneEvents(mesh);
        }
        createactiveZone();

        ar.SetTypeItem(universeId, item);

    }
})(EM.AssetRepository);

// #endregion 

//#endregion;     
 
 
//#region Main Init load and run
(function (ar) {
    "use strict";
    ar.Init = function (scene, onLoaded) {
        var _motherVersion = "1.0.0";
        var _assetsVersion = "v.1.403.dist";
        var useFromLocal = true;
        var showLog = false;
        // ReSharper disable ExpressionIsAlwaysConst
        var motherCatalog = Utils.CdnManager.GetGameModelsCatalog(_motherVersion, useFromLocal);
        ar._initBase(_assetsVersion, useFromLocal, motherCatalog);
        ar._initBase = null;
        delete ar._initBase;

        var ext = ar.EXTENTIONS;
        //planet
        var planetGatarogUrl = ar.GetPlanetCatalog();
        var planetSceneName = "planets";
        var planetBabylon = planetSceneName + ext.babylon;
        var planetSceneUrl = planetGatarogUrl + planetBabylon;

        //mother
        var motherSceneName = "game_models";
        var motherBabylon = motherSceneName + ext.babylon;
 

        var motherInitialized = false;
        var moonsInitialized = false;
        var planetInitialized = false;
        var starsInitialized = false;
        var sectorsInitialized = false;
        var galaxiesInitialized = false;
        var universeInitialized = false;


        function _onLoaded() {
            onLoaded();
            ar.Init = null;
            delete ar.Init;

        }

        var _updated = false;

        function _update() {
            if (_updated) return;
            if (motherInitialized &&
                moonsInitialized &&
                planetInitialized &&
                starsInitialized &&
                sectorsInitialized &&
                galaxiesInitialized &&
                universeInitialized) {  
                _updated = true;
                EM.Scene.resetCachedMaterial();

                //   console.log("assets loaded 0");
                _onLoaded();
                // console.log("assets loaded 1");

                EM.GameLoader.Update("LoadMeshes");

                if (showLog) {
                    console.log("assets loaded 2");
                }

            }
        }



        function _initUniverse() {
            ar._initUniverse(scene);
            ar._initUniverse = null;
            delete ar._initUniverse;
            universeInitialized = true;
            if (showLog) {
                console.log("universeInitialized");
            }

            _update();


        }
        function _initPlanets(newMeshes) {
            EM.SetVisibleGroupByMeshes(newMeshes, false);

            ar._initPlanets(newMeshes, planetSceneName);
            ar._initPlanets = null;
            delete ar._initPlanets;
            if (showLog) {
                console.log("planetInitialized");
            }


            planetInitialized = true;
            _update();
        }

        function _initMother(newMeshes) {
            ar._initMother();
            ar._initMother = null;
            delete ar._initMother;
            EM.EstateGeometry.GameModelsInit(newMeshes);
            motherInitialized = true;

            if (showLog) {
                console.log("motherInitialized");
            }


            _update();
        }

        function _initMoons() {
            ar._initMoons();
            ar._initMoons = null;
            delete ar._initMoons;
            moonsInitialized = true;
            // console.log("moons loaded");
            _update();
        }
        function _initStars() {
            ar._initStars();
            ar._initStars = null;
            delete ar._initStars;
            starsInitialized = true;
            if (showLog) {
                console.log("starsInitialized");
            }

            _update();

        }

        function _initSectors() {
            ar._initSectors();
            ar._initSectors = null;
            delete ar._initSectors;
            sectorsInitialized = true;
            if (showLog) {
                console.log("sectorsInitialized");
            }


            _update();
        }
        function _initGalaxies() {
            ar._initGalaxies();
            ar._initGalaxies = null;
            galaxiesInitialized = true;
            delete ar._initGalaxies;
            if (showLog) {
                console.log("galaxiesInitialized");
            }

            _update();
        }


        function initWorld() {
            if (planetInitialized && motherInitialized ) {
                _initUniverse();
                _initMoons();
                _initStars();
                _initSectors();
                _initGalaxies();
            }
        }

 
        BABYLON.SceneLoader.ImportMesh("", planetGatarogUrl, planetBabylon, scene, function (loadedMeshesGroup, particleSystems, skeletons) {
            if (showLog) {
                console.log("BABYLON.SceneLoader.ImportMesh.planetBabylon", {
                    loadedMeshesGroup: loadedMeshesGroup
                });
            }
            _initPlanets(loadedMeshesGroup);
            initWorld();
            //setTimeout(function () {
            //    // todo  срабатывают калбеки на текстуры уже тогда когда сами материалы удалены.    
            //    //В резултьтате веб жл ошибки. 
            //    //нужно найти альтернативный подход к пересозданию материалов.
            //    _initPlanets(loadedMeshesGroup);
            //},3000);

        });


        BABYLON.SceneLoader.ImportMesh("", motherCatalog, motherBabylon, scene, function (loadedMeshesGroup, particleSystems, skeletons) {
            if (showLog) {
                console.log("BABYLON.SceneLoader.ImportMesh.motherBabylon", {
                    loadedMeshesGroup: loadedMeshesGroup
                });
            }
            _initMother(loadedMeshesGroup);
            initWorld();

        });

    };
})(EM.AssetRepository);

//#endregion; 







//videoTextures
EM.VideoTextures = {};

//base
(function (VideoTextures) {
    var videoContainerId = "vidio-container";
    function getVideoContainer() {
        return $("#" + videoContainerId);
    };
    function getVideoTag(videoDomId) {
        return document.getElementById(videoDomId);
    };

    /**
     * 
     * @param {stirng} id 
     * @param {Array<object>} sources    props: src,   memeType
     * @param {int||string} width 
     * @param {int||string} height 
     * @param {boolean} loop 
     * @returns {Object<$>} 
     */
    function addVodioTag(id, sources, width, height, loop) {
        var video = $("<video/>", {
            loop: loop|| "loop"
        }).attr({
            width: width || 1920,
            height: height || 1080
        });
        _.forEach(sources,
            function (value) {
                video.append($("<source/>", {
                    src: value.src,
                    type: value.memeType
                }));
            });


        getVideoContainer().append(video);
        return video;
    }
    VideoTextures.GetVideoTag = getVideoTag;
})(EM.VideoTextures);

//sectorJump
(function (VideoTextures) {
    "use_strict";
    var sectorJump = {
        Texture: null,
        Play: null,
        Stop: null,
        GetTexture: null
    };
    var videoDomId = "video-sector-jump";

    function createTexture() {
        sectorJump.Texture = new BABYLON.VideoTexture(videoDomId, VideoTextures.GetVideoTag(videoDomId), EM.Scene, true);
        sectorJump.Play = function (playbackRate) {
            sectorJump.Texture.video.playbackRate = playbackRate || 1;
            //sectorJump.Texture.video.load();
            sectorJump.Texture.video.play();
        };
        sectorJump.Stop = function () {
            //sectorJump.Texture.video.load();
            sectorJump.Texture.video.pause();
        };
        sectorJump.Stop();
        return sectorJump.Texture;
    }

    function getTexture() {
        if (sectorJump.Texture) return sectorJump.Texture;
        return createTexture();
    }

    sectorJump.GetTexture = getTexture;
    VideoTextures.SectorJump = sectorJump;
})(EM.VideoTextures);

EM.GameCamera = {
    //http://doc.babylonjs.com/tutorials/Cameras
    // inputs http://doc.babylonjs.com/tutorials/Customizing_Camera_Inputs
    //vars===================================================================
    Name: "GameCamera",
    Id: null,
    Camera: null,
    Keys: {
        Galaxy: "Galaxy",
        Systems: "Systems",
        SystemSelected: "SystemSelected",
        ArroundSystem: "ArroundSystem",
        MotherSelected: "MotherSelected",
        UserPlanet: "UserPlanet",
        Planetoid: "Planetoid"
    }
};
(function (GameCamera) {
    var defaultTarget = new BABYLON.Vector3.Zero();
    var keys = GameCamera.Keys;
    //#region CameraStateConfigs
    var pi = _.round(Math.PI, 4);
    var fakePi = 3;
    var fakeZero = 0.1;
    var twoPi = pi * 2;


    /**
    * 
    * @param {double} upperRadiusLimit required default 0
    * @param {double} lower required default 1
    * @param {int} minZ required default 0
    * @param {int} radius default 10
    * @param {double} wheelPrecision  default 0.01
    * @param {double} lowerBetaLimit  default -Math.PI
    * @param {double} upperBeta  default Math.PI
    * @param {double} fov required default 1.2
    * @returns  {object}  остальные параметры по умолчанию или переопределению
    */
    function createCameraConfig(upperRadiusLimit, lowerRadiusLimit, minZ, radius, wheelPrecision, lowerBetaLimit, upperBetaLimit, fov) {
        var sens = 1;
        var config = {

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
            upperRadiusLimit: upperRadiusLimit || 0,
            //required state config
            lowerRadiusLimit: lowerRadiusLimit || 1,


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
            angularSensibilityY: sens
        };
 
        config.setTarget = function (vector3Target) {
            //console.log("vector3Target", typeof vector3Target);
            if (vector3Target && vector3Target.clone) config.target = vector3Target.clone();
            else {
                if (SHOW_DEBUG) {
                    console.log("target not set, seted default");
                }
                config.target = defaultTarget.clone();
            };

        };
        config.setPosition = function (vectorPosition) {
            if (vectorPosition && vectorPosition.clone) config.position = vectorPosition.clone();
            else config.position = null;
        };
        return config;

    }


    GameCamera.$activeState = null;


    var galaxy = createCameraConfig();
    galaxy.upperRadiusLimit = 5e4;
    galaxy.lowerRadiusLimit = 1.4e4;
    galaxy.minZ = 1e3;
    galaxy.radius = 1e4;
    galaxy.wheelPrecision = 0.01;
    galaxy.lowerBetaLimit = 0.1;
    galaxy.upperBetaLimit = 1;


    var systems = createCameraConfig();
    systems.upperRadiusLimit = 2e5;
    systems.lowerRadiusLimit = 4e4;
    systems.minZ = 3;
    systems.radius = 7e4;
    systems.wheelPrecision = 0.01;
    systems.lowerBetaLimit = 0;
    systems.upperBetaLimit = pi;
    systems.setTarget(defaultTarget.clone());

    //todo  не для состояния
    var arroundSystem = createCameraConfig(systems.upperRadiusLimit, systems.lowerRadiusLimit, systems.minZ, systems.wheelPrecision);
    arroundSystem.radius = 5e4;
    Object.freeze(arroundSystem);

    var system = createCameraConfig();
    system.upperRadiusLimit = 900;
    system.lowerRadiusLimit =8;
    system.minZ = 1;
    system.radius = system.lowerRadiusLimit * 2;
    system.wheelPrecision = 10;
    system.speed = 1;
    system.lowerBetaLimit = fakeZero;
    system.upperBetaLimit = fakePi;
    system.fov = 1;
    system.$endAnimationRadius = 100;
    system.$newSystemId = null;
    system.$setOnBeforeAnimationParams = function() {
        system.radius = system.$endAnimationRadius;
        return system.radius;
    };
    system.$setOnEndAnimationParams = function (minCameraRadius) {
        system.alpha = GameCamera.Camera.alpha;
        system.beta = GameCamera.Camera.beta;
        if (minCameraRadius) {
            GameCamera.SetAndGetNewLowerRadiusLimit(minCameraRadius);
        }
 
    };

    var mother = createCameraConfig();
    mother.upperRadiusLimit = 1e3;
    mother.lowerRadiusLimit = 14;
    mother.minZ = 1;
    mother.radius = 15;
    mother.wheelPrecision = 50;
    mother.speed = 1;
    //mother.alpha = pi / 4;
    //mother.beta = pi / 4;  
    mother.$alpha = 2.2;
    mother.$beta = 1.2;  
    Object.defineProperty(mother, "alpha", {
        get: function () {
            return GameCamera.Camera.alpha;
        },
        //set: function (value) {
        //    return GameCamera.Camera.alpha = value;
        //}
    });
    Object.defineProperty(mother, "beta", {
        get: function () {
            return GameCamera.Camera.beta;
        },
        //set: function (value) {
        //    return GameCamera.Camera.beta = value;
        //}
    });
    mother.$setABToCamera = function() {
        GameCamera.Camera.alpha = mother.$alpha;
        GameCamera.Camera.beta = mother.$beta;
    };


    var inUserPlanet = createCameraConfig();
    inUserPlanet.upperRadiusLimit = 20;
    //  inUserPlanet.upperRadiusLimit = 500;
    //inUserPlanet.lowerRadiusLimit = 2;
    inUserPlanet.lowerRadiusLimit = 10;
    inUserPlanet.minZ = 1;
    inUserPlanet.maxZ = 300;
    inUserPlanet.radius = 15;
    //inUserPlanet.wheelPrecision = 50;
    inUserPlanet.wheelPrecision = 200;
    inUserPlanet.lowerBetaLimit = 0.1;
    inUserPlanet.upperBetaLimit = 1.3;

    //inUserPlanet.lowerBetaLimit = -pi;
    // inUserPlanet.upperBetaLimit = pi;
    inUserPlanet.fov = 1;
    inUserPlanet.setTarget(defaultTarget.clone());

    //#endregion

    //#region SetState
    function setNewConfigToActiveCamera(activeCamera, configCamera, state) {
       // if (GameCamera.$activeState && GameCamera.$activeState === state) return;

        if (configCamera.target && !_.isEqual(activeCamera.target, configCamera.target)) {
              activeCamera.setTarget(configCamera.target.clone());  
        }
        if (activeCamera.alpha !== configCamera.alpha) activeCamera.alpha = configCamera.alpha;
        if (activeCamera.beta !== configCamera.beta) activeCamera.beta = configCamera.beta;

        //console.log("cameraRadius", {
        //    camR: activeCamera.radius,
        //    configCamR: configCamera.radius,
        //});


        if (activeCamera.lowerRadiusLimit !== configCamera.lowerRadiusLimit) activeCamera.lowerRadiusLimit = configCamera.lowerRadiusLimit;
        if (activeCamera.upperRadiusLimit !== configCamera.upperRadiusLimit) activeCamera.upperRadiusLimit = configCamera.upperRadiusLimit;
        if (activeCamera.radius !== configCamera.radius) { 
            if (configCamera.radius > configCamera.upperRadiusLimit) {
                configCamera.radius = configCamera.upperRadiusLimit;
            } else if (configCamera.radius < configCamera.lowerRadiusLimit) {
                configCamera.radius = configCamera.lowerRadiusLimit;
            }
            activeCamera.radius = configCamera.radius;
        }


        if (activeCamera.minZ !== configCamera.minZ) activeCamera.minZ = configCamera.minZ;
        if (activeCamera.maxZ !== configCamera.maxZ) activeCamera.maxZ = configCamera.maxZ;

        if (activeCamera.wheelPrecision !== configCamera.wheelPrecision) activeCamera.wheelPrecision = configCamera.wheelPrecision;


        if (activeCamera.fov !== configCamera.fov) activeCamera.fov = configCamera.fov;

        if (activeCamera.lowerBetaLimit !== configCamera.lowerBetaLimit) activeCamera.lowerBetaLimit = configCamera.lowerBetaLimit;
        if (activeCamera.upperBetaLimit !== configCamera.upperBetaLimit) activeCamera.upperBetaLimit = configCamera.upperBetaLimit;

        if (activeCamera.lowerAlphaLimit !== configCamera.lowerAlphaLimit) activeCamera.lowerAlphaLimit = configCamera.lowerAlphaLimit;
        if (activeCamera.upperAlphaLimit !== configCamera.upperAlphaLimit) activeCamera.upperAlphaLimit = configCamera.upperAlphaLimit;

        if (activeCamera.lockedTarget !== configCamera.lockedTarget) activeCamera.lockedTarget = configCamera.lockedTarget;

        if (activeCamera.zoomOnFactor !== configCamera.zoomOnFactor) activeCamera.zoomOnFactor = configCamera.zoomOnFactor;



        if (configCamera.position) {
            console.log("configCamera.position", { position: configCamera.position.clone() });
            activeCamera.position = configCamera.position.clone();
        }

        GameCamera.$activeState = state;
    }

    function getConfig(state) {
       // console.log("getConfig state", state);
        if (state === keys.Galaxy) return galaxy;
        else if (state === keys.Systems) return systems;
        else if (state === keys.ArroundSystem) return arroundSystem;
        else if (state === keys.SystemSelected) return system;
        else if (state === keys.MotherSelected) return mother;
        else if (state === keys.UserPlanet) return inUserPlanet;
        console.log("error state not configured for this type");
        return createCameraConfig();
    };

    function setGalaxy(galaxyId) {
        if (GameCamera.$activeState && GameCamera.$activeState === keys.Galaxy) return;
        var config = getConfig(keys.Galaxy);
        config.setTarget(EM.MapGeometry.Galaxies.GetGalaxy(galaxyId).position);
        setNewConfigToActiveCamera(GameCamera.Camera, config, keys.Galaxy);
    };

    function setSystems() {
        if (GameCamera.$activeState && GameCamera.$activeState === keys.Systems) return;
        var config = getConfig(keys.Systems);
        setNewConfigToActiveCamera(GameCamera.Camera, config, keys.Systems);
    }

    function setArroundSystem(target) {
        if (GameCamera.$activeState && GameCamera.$activeState === keys.ArroundSystem) return;
        var config = getConfig(keys.ArroundSystem);
        config.setTarget(target);
        setNewConfigToActiveCamera(GameCamera.Camera, config, keys.ArroundSystem);
    }

    function setSystemSelected(target, fromState, newSystemId) {
        if (fromState === "PlanetoidSelectedState") {
           return;
        }
        else {
            if (GameCamera.$activeState && GameCamera.$activeState === keys.SystemSelected && system.$newSystemId === newSystemId) return;
            system.$setOnEndAnimationParams();
            var config = getConfig(keys.SystemSelected);
            config.setTarget(target);
            setNewConfigToActiveCamera(GameCamera.Camera, config, keys.SystemSelected);
            system.$newSystemId = newSystemId;
        }


    }

    function setMotherSelected(ignore) {
        //console.log("camera.setMotherSelected", {
        //    activeState: GameCamera.$activeState,
        //    "activeState === keys.MotherSelected)": GameCamera.$activeState === keys.MotherSelected,
        //    "activeState && activeState === keys.MotherSelected": GameCamera.$activeState && GameCamera.$activeState === keys.MotherSelected
        //});
    
        var csl = EM.EstateData.GetCurrentSpaceLocation();
        var motherLocation = EM.EstateData.GetMotherLocation();
        if (!ignore) {
            if (csl.SystemId === motherLocation.SystemId) {
                GameCamera.Camera.upperRadiusLimit = mother.upperRadiusLimit;
                GameCamera.Camera.lowerRadiusLimit = mother.lowerRadiusLimit;
                GameCamera.Camera.maxZ = mother.maxZ;
                mother.$setABToCamera();
                console.log("setMotherSelected csl.SystemId === motherLocation.SystemId");
                return;
            }
            if (GameCamera.$activeState && GameCamera.$activeState === keys.MotherSelected) return;
        }
  
        system.$newSystemId = motherLocation.SystemId;
        var config = getConfig(keys.MotherSelected);
        mother.$setABToCamera();
        config.setTarget(EM.GetMotherMesh().getAbsolutePosition());
        setNewConfigToActiveCamera(GameCamera.Camera, config, keys.MotherSelected);
    }

    function setInUserPlanet() {
        if (GameCamera.$activeState && GameCamera.$activeState === keys.UserPlanet) return;
        var config = getConfig(keys.UserPlanet);
        setNewConfigToActiveCamera(GameCamera.Camera, config, keys.UserPlanet);
    }

    //#endregion

    function createCamera(scene, canvas, key, target) {
        var config = getConfig(key);
        if (target != null) config.target = target;
        if (config.target == null) config.target = defaultTarget.clone();        
        var camera = new BABYLON.ArcRotateCamera(GameCamera.Name, config.alpha, config.beta, config.radius, config.target, scene); 
        camera.attachControl(canvas, true, false);      
        GameCamera.Id = camera.id;
        GameCamera.Camera = camera;

        setNewConfigToActiveCamera(camera, config);

    }


    GameCamera.Galaxy = galaxy;
    GameCamera.Systems = systems;
    GameCamera.ArroundSystem = arroundSystem;
    GameCamera.System = system;
    GameCamera.Mother = mother;
    GameCamera.InUserPlanet = inUserPlanet;
    GameCamera.DefaultTarget = defaultTarget;
    GameCamera.CreateCamera = createCamera;
    GameCamera.GetConfig = getConfig;

    GameCamera.SetGalaxy = setGalaxy;
    GameCamera.SetSystems = setSystems;
    GameCamera.SetArroundSystem = setArroundSystem;
    GameCamera.SetSystemSelected = setSystemSelected;
    GameCamera.SetMotherSelected = setMotherSelected;
    GameCamera.SetInUserPlanet = setInUserPlanet;
    GameCamera.SetAndGetNewLowerRadiusLimit = function (newLowerRadiusLimit) {
        var newRadius = newLowerRadiusLimit;
        if (newLowerRadiusLimit < GameCamera.Camera.minZ) newRadius = _.ceil(GameCamera.Camera.minZ) + 1;
        if (newRadius !== GameCamera.Camera.lowerRadiusLimit) GameCamera.Camera.lowerRadiusLimit = newRadius;
        return newRadius;
    };

})(EM.GameCamera);
EM.MapData = {
    SystemKeys : {
        Name: "Name",
        NativeName: "NativeName",
        Planetoids: "Planetoids",
        Stars: "Stars",
        Planets: "Planets",
        Moons: "Moons",
        Coords: "Coords",
        GroupType: "GameTypeId",
        Texture: "Texture",
        TextureMap: "TextureMap",
        TextureColor: "TextureColor",
        Url: "Url",
        DiffuseMap: "DiffuseMap",
        HeightMap: "HeightMap",
        NormalMap: "NormalMap",
        SpecularMap: "SpecularMap",
        StencilMap: "StencilMap",
        DiffuseColor: "DiffuseColor",
        EmissiveColor: "EmissiveColor",
        HoverColor: "HoverColor",
        SpecularColor: "SpecularColor",
        Power: "Power",
        Radius: "Radius",
        Parent: "Parent",
        Rings: "Rings",
        Width: "Width",
        MaxRadius: "MaxRadius",
        Atmosphere: "Atmosphere",
        Opacity: "Opacity",
        AxisAngle: "AxisAngle",
        OrbitAngle: "OrbitAngle",
        Orbit: "Orbit",
        OrbitPosition: "OrbitPosition",
        TypeId: "TypeId"
    }
}; 
Object.freeze(EM.MapData.SystemKeys);

//#region Create Base                
(function (MapData, LocalStorage) {
    MapData.Sectors = null;
    MapData.Systems = null;
    MapData.System = null;
    MapData._actionNames = {
        worldGetSectors: "worldGetSectors",
        worldGetSystems: "worldGetSystems",
        worldGetSystemGeometry: "worldGetSystemGeometry",
        worldGetGalaxyInfo: "worldGetGalaxyInfo",
        worldGetSectorInfo: "worldGetSectorInfo",
        worldGetStarInfo: "worldGetStarInfo",
        worldGetPlanetInfo: "worldGetPlanetInfo",
        worldGetMoonInfo: "worldGetMoonInfo",
        worldSerchPlanetNames: "worldSerchPlanetNames"
    };
    Object.freeze(MapData._actionNames);

    MapData._getHubAction = function (hubActionName) {
        return EM.$hub[hubActionName];
    }
    MapData._createStorageKey = function (id, actionName) {
        var identity;
        if (id) identity = id;
        else if (typeof id === "number" && id === 0) {
            throw new Error("id  не может быть 0");
        }
        else identity = "_id_";
        return _.snakeCase(actionName + "_" + identity);
    };


    function createMapDataItem(subscribeName) {
        var mi = {
            SubscribeName: subscribeName,
            GetData: null,
            Observer: Utils.PatternFactory.Observer(subscribeName),
            Update: null
        };
        Object.defineProperty(mi, "$hub", {
            get: function () {
                return EM.$hub;
            }
        });
        return mi;
    };

    MapData.GetSectors = createMapDataItem("MapData.Sectors");
    MapData.GetSystems = createMapDataItem("MapData.Systems");
    MapData.GetSystem = createMapDataItem("MapData.System");

    MapData._request = function (actionName, onSuccess, id, notSetCookie, expires) {
        var key = MapData._createStorageKey(id, actionName);
        var resultData = LocalStorage.GetFromStorage(key);
        if (resultData) {
            onSuccess(resultData);
            return;
        }
        else {
            MapData._getHubAction(actionName)(id)
                .then(function (answer) {
                    LocalStorage.SaveInStorage(key, answer, notSetCookie, expires);
                    onSuccess(answer);

                    //console.log(" MapData.$hub[actionName](id)", {
                    //    id: id,
                    //    actionName: actionName,
                    //    answer: answer,
                    //    $hub: MapData.$hub
                    //});

                }, function (errorAnswer) {
                    var msg = Errors.GetHubMessage(errorAnswer);
                    throw Errors.ClientNotImplementedException({
                        key: key,
                        id: id,
                        resultData: resultData,
                        msg: msg,
                        expires: expires,
                        notSetCookie: notSetCookie,
                        errorAnswer: errorAnswer,
                        LocalStorageData: resultData
                    }, key);

                });
        }

    };
})(EM.MapData, Utils.LocalStorage);

//#region GetSectors 
(function (MapData, LocalStorage) {
    function onSuccess(answer) {
       // console.log("MapData.GetSectors.GetData", answer);
        EM.MapGeometry.Galaxies.SaveSectorsFromServer(answer);
        MapData.Sectors = answer;
        MapData.GetSectors.Observer.NotifyAll();
        //MapData.GetSectors.Update();

        //            console.log("MapData.GetSectors.GetData", {
        //                Galaxies: MapGeometry.Galaxies,
        //                Sectors: MapData.Sectors
        //            });
    }

    var _actionName = MapData._actionNames.worldGetSectors;
    MapData.GetSectors.GetData = function () {
        MapData._request(_actionName, onSuccess, null, true, null);
    };
    MapData.GetSectors.InitSectorData = function (sectorsData) {
        //    console.log("MapData.GetSectors.InitSectorData", sectorsData);
        var key = MapData._createStorageKey(null, _actionName);
        LocalStorage.SaveInStorage(key, sectorsData, true, null);
        MapData._request(_actionName, onSuccess, null, true, null);
    };
})(EM.MapData, Utils.LocalStorage);
//#endregion

//#region GetSystems
(function (MapData) {
    var _actionName = MapData._actionNames.worldGetSystems;
    MapData.GetSystems.DataSectorId = null;
    MapData.GetSystems.GetData = function (sectorId) {
        //console.log(" MapData.GetSystems.GetData", {
        //    sectorId: sectorId,
        //    " MapData.GetSystems.DataSectorId": MapData.GetSystems.DataSectorId,
        //});
        if (typeof sectorId === "number" && (sectorId === MapData.GetSystems.DataSectorId)) {
            MapData.GetSystems.Observer.NotifyAll();
            return;
        }
        function onSuccess(answer) {
            //   console.log("MapData.GetSystems.GetData", answer);
            MapData.Systems = answer;
            MapData.GetSystems.DataSectorId = sectorId;
            MapData.GetSystems.Observer.NotifyAll();
        }

        MapData._request(_actionName, onSuccess, sectorId, true, null);
    };
})(EM.MapData);
//#endregion

//#region GetSystem
(function (MapData, LocalStorage) {
    var _actionName = MapData._actionNames.worldGetSystemGeometry;
    function onSuccess(answer, callback) {
        MapData.System = answer;
        MapData.GetSystem.Observer.NotifyAll();
        if (callback) callback(MapData.System);
    }
    MapData.GetSystem.GetData = function (systemId, callback) {
        // console.log("GetSystem count"); 
        MapData._request(_actionName, function (answer) {
            return onSuccess(answer, callback);
        }, systemId, true, null);
    };

    MapData.GetSystem.InitSystemData = function (systemGeometryData, callback) {
        //  console.log("MapData.GetSectors.InitSystemData", systemGeometryData);
        var id = 0;
        _.forEach(systemGeometryData.Stars, function (star, starKey) {
            id = star.Id;
            return false;
        });
        var key = MapData._createStorageKey(id, _actionName);
        LocalStorage.SaveInStorage(key, systemGeometryData, true, null);
        return id;
    }
})(EM.MapData, Utils.LocalStorage);
//#endregion
/**
   * @description Генерирует геометрию мешей материалы и текстуры
   * @class {MapGeometry}
   * @name MapGeometry 
   */
EM.MapGeometry = {
    SYSTEM_PROTO_NAME: "starSystemProto",
    SYSTEM_REAL_PROTONAME: ".starSystemProto",
    SECTOR_PROTO_NAME: "sectorProto",
    SECTOR_REAL_PROTONAME: ".sectorProto",
    Scale: 10,
    MapTypes: {
        Mother: "Mother",        // base type
        Universe: "Universe",    // base type
        Galaxy: "Galaxy",        // base type
        Sector: "Sector",        // base type
        Star: "Star",            // base type
        Satellite: "Satellite",  // base type
        Planet: "Planet",        // base type
        Moon: "Moon",            // Satellite -  Moon может использоватсья и как // base type с поправкой на то что в ассет репозитории  базовым типом является  Satellite
        Bookmark: "Bookmark",    // указатель на связку (не тип)

        Earth: "Earth",          // Planet
        Gas: "Gas",              // Planet
        IceGas: "IceGas",        // Planet

        Asteroid: "Asteroid",    // Satellite
        Nibula: "Nibula",        // Universe
        Spirale: "Spirale",      // Galaxy
        //star types
        A: "A",                  // Star
        B: "B",                  // Star
        F: "F",                  // Star
        G: "G",                  // Star
        K: "K",                  // Star
        L: "L",                  // Star
        M: "M",                  // Star
        O: "O"                   // Star
    },

    _chekAndGetMeshInScene: function (meshId) {
        "use strict";
        var mesh = EM.GetMesh(meshId);
        if (!mesh) return false;
        return mesh;
    },

    Lang: appL10n.getL10NCurrentLanguage,
    Galaxies: null,
    Sectors: null,
    Systems: null,
    System: null,

    Effects: {},
    IGeometryMapItemFactory: null,
    IGeometryMaperFactory: null,
    GetUniqueIdFromAny: null
};

//#region Base
(function (MapGeometry) {
    "use strict";
    MapGeometry.IGeometryMapItemFactory = function (uniqueId, textureId, parentMeshName, getMeshContainer) {
        function IGeometryMapItem() {
            var meshContainer;
            var _self = this;
            if (getMeshContainer instanceof Function) meshContainer = getMeshContainer(textureId, uniqueId);
            else meshContainer = EM.AssetRepository.GetSpaceRegularMeshContainer(textureId);
            if (!meshContainer) throw Errors.ClientNullReferenceException({ uniqueId: uniqueId, textureId: textureId, meshContainer: meshContainer });
            this.UniqueId = uniqueId;
            this.TextureId = textureId;
            this.ParentMeshName = parentMeshName;
            this._baseMeshId = meshContainer.GetMeshId();
            this.FullMeshId = meshContainer.GetMeshId(uniqueId, parentMeshName);
            this.BasePartMeshId = meshContainer.GetMeshId(uniqueId);
            this[EM.AssetRepository.MESH_CONTAINER_KEY] = meshContainer;

            this.AdvPropNames = {};
            this.AddProp = function (propKey, val) {
                this.AdvPropNames[propKey] = propKey;
                this[propKey] = val;
            }
            this.GetMesh = function () {
                return _self.GetMeshById(_self.FullMeshId);
            }
            this._getMeshByOtherParams = function (_uniqueId, _parentMesId) {
                return meshContainer.GetMesh(_uniqueId, _parentMesId);
            }
            this.GetMeshById = function (meshId) {
                return EM.GetMesh(meshId);
            };
            this.GetMeshContainer = function () {
                return meshContainer;
            }
            return this;
        }

        return new IGeometryMapItem();
    };
    MapGeometry.IGeometryMaperFactory = function (mapperName, createIGeometryMapItem, init, parentMeshName, getMeshContainer) {
        if (!(init instanceof Function))
            init = angular.noop;

        function IGeometryMaper() {
            var _self = this;
            this._mapperName = mapperName;
            this._initialized = false;
            this._init = init;
            this._parentMeshName = parentMeshName;
            this._collection = {};
            this.Count = 0;
            this.GetMapItem = function (uniqueId, textureId) {
                if (!_self._initialized) {
                    _self._init(_self);
                    _self._initialized = true;
                    _self._init = null;
                    delete _self._init;
                    _self.GetMapItem = function (_uniqueId, _textureId) {
                        if (_uniqueId && _textureId) return _self.GetOrAdd(_uniqueId, _textureId);
                        return _self._collection[_uniqueId];
                    }
                    return _self.GetMapItem(uniqueId, textureId);
                }
            };
            this.GetOrAdd = function (uniqueId, textureId) {
                if (_self._collection[uniqueId]) return _self._collection[uniqueId];
                var item = new MapGeometry.IGeometryMapItemFactory(uniqueId, textureId, parentMeshName, getMeshContainer);
                item = createIGeometryMapItem(item);
                _self._collection[uniqueId] = item;
                this.Count++;
                return _self._collection[uniqueId];
            };
            this.GetTextureId = function (uniqueId) {
                var item = _self.GetMapItem(uniqueId);
                if (!item) return null;
                return item.TextureId;
            };


            this._getFullMeshId = function (uniqueId, textureId) {
                var item = _self.GetMapItem(uniqueId, textureId);
                if (!item) return null;
                return item.FullMeshId;
            };
            this._addAdvPropToItem = function (uniqueId, textureId, propKey, propVal) {
                var item = _self.GetMapItem(uniqueId, textureId);
                if (!item) return null;
                item.AddProp(propKey, propVal);
                return item;
            }
            this._getItemAdvPropNames = function (uniqueId, textureId) {
                var item = _self.GetMapItem(uniqueId, textureId);
                if (!item) return null;
                return item.AdvPropNames;
            }
            this.HasItem = function (uniqueId) {
                return !!this.GetMapItem(uniqueId);
            }
            this.GetMeshContainer = function (uniqueId, textureId) {
                var item = _self.GetMapItem(uniqueId, textureId);
                if (!item) return null;
                return item.GetMeshContainer();
            }
            this.GetMesh = function (uniqueId, textureId) {
                var item = _self.GetMapItem(uniqueId, textureId);
                if (!item) return null;
                return item.GetMesh();
            }
            this.GetMeshById = function (meshId) {
                return EM.GetMesh(meshId);
            };
            this._reset = function () {
                this._collection = {};
                this.Count = 0;
            }
            this._cleanPerItem = function (perItemAction, condition) {
                if (perItemAction instanceof Function) {
                    if (condition instanceof Function) {
                        _.forEach(_self._collection, function (item, itemKey) {
                            if (condition(item, itemKey)) {
                                perItemAction(item, itemKey);
                                _self.Count--;
                            }

                        });
                    }
                    else {
                        _.forEach(_self._collection, function (item, itemKey) {
                            perItemAction(item, itemKey);
                            _self._collection[itemKey] = null;
                            delete _self._collection[itemKey];
                            _self.Count--;
                        });
                    }
                }
                else this._clean();
            }

            this._getAll = function () {
                return this._collection;
            }
            return _self;
        }

        return new IGeometryMaper();
    };

    /**  
     * пытается извлеч ид из переданного аргумента. в следующем порядке   
     * uniqueId  число - возвращает как есть предполагается что ид уже существует из объекта даты сервера или другого проверяемого параметра 
     * uniqueId -!uniqueId return null;   
     * uniqueId  - строка  делается попатка приведения к числу, если удачно возвращается числовое значение  
     * uniqueId - object    
     * делается попытка извлеч значение из свойства объекта в указанной последовательности,
     * при первом совпадении следующее значение не используется  
     * [id,Id,uniqueId,UniqueId]
     * id - предполагается что это меш ид
     * Id - предполагается что это объект серверной даты а значением является число
     * uniqueId - свойство вспомогательного объекта {string||int}   
     * UniqueId  свойство базового объекта     {string||int}  
     * повторная проверка на число если значение конвертируемо в число возвращается числовой тип
     * @param {int||string||object||object.id||object.Id||object.uniqueId||object.UniqueId} uniqueId 
     * @param {string} fromPropertyName  can be null   если установленно считается именем свойства   UniqueId[fromPropertyName]  проверка на тип
     * @returns {int||string||null} извлеченное знаение если найденно иначе нулл
     */
    MapGeometry.GetUniqueIdFromAny = function (uniqueId, fromPropertyName) {
        var _id = null;
        if (fromPropertyName) {
            if (!uniqueId) return null;
            _id = uniqueId[fromPropertyName];
        }
        else if (typeof uniqueId === "number") return uniqueId;
        else if (!uniqueId) return null;
        else if (typeof uniqueId === "string") _id = uniqueId;
        else if (typeof uniqueId === "object") {
            if (uniqueId.hasOwnProperty("id")) _id = uniqueId.id;
            else if (uniqueId.hasOwnProperty("Id")) _id = uniqueId.Id;
            else if (uniqueId.hasOwnProperty("uniqueId")) _id = uniqueId.uniqueId;
            else if (uniqueId.hasOwnProperty("UniqueId")) _id = uniqueId.UniqueId;
        }

        if (!_id) return null;
        if (_.isNumber(_id)) return _id;
        if (Utils.IsNumeric(_id)) return _.toNumber(_id);
        return _id;

    };

    /**
     * 
     * @param {string||int} meshId 
     * @returns {int} uniqueId
     * throws [ClientNullReferenceException,ClientTypeErrorException]
     */
    MapGeometry.GetUniqueIdFromMeshId = function (meshId) {
        if (!meshId) throw Errors.ClientNullReferenceException({ meshId: meshId }, "meshId", "MapGeometry.GetUniqueIdFromMeshId");
        var _id = MapGeometry.GetUniqueIdFromAny(meshId);
        if (typeof _id === "number") return _id;
        if (!_id) throw Errors.ClientNullReferenceException({ meshId: meshId, _id: _id }, "_id", "MapGeometry.GetUniqueIdFromMeshId");
        if (typeof _id !== "string") throw Errors.ClientTypeErrorException({ meshId: meshId, _id: _id }, _id, "string", "MapGeometry.GetUniqueIdFromMeshId");
        var meshInfo = ar.GetMeshInfoByMeshId(_id);
        if (!meshInfo) Errors.ClientNullReferenceException({ meshId: meshId, _id: _id, meshInfo: meshInfo }, "meshInfo", "MapGeometry.GetUniqueIdFromMeshId");
        _id = meshInfo.UniqueId;
        if (!_id) Errors.ClientNullReferenceException({ meshId: meshId, _id: _id, meshInfo: meshInfo, "meshInfo.UniqueId": meshInfo.UniqueId }, "meshInfo", "MapGeometry.GetUniqueIdFromMeshId");
        return _id;
    };
})(EM.MapGeometry);

//#endregion




//#region _baseObject
(function (MapGeometry) {
    "use strict";
    MapGeometry._baseObject = function (generate, destroy, setVisible, mapper) {
        return {
            Generate: generate,
            Destroy: destroy,
            SetVisible: setVisible,
            Mapper: mapper
        };
    };
})(EM.MapGeometry);
//#endregion


//#region Generate

//#region Galaxies
(function (MapGeometry) {
    "use strict";
    var ar = EM.AssetRepository;
    var _mapItemKey = ar.MAP_ITEM_KEY;
    var _textureTypeIdKey = ar.TEXTURE_TYPE_ID_KEY;
    var _mapTypeKey = ar.MAP_TYPE_KEY;
    var _meshInfoKey = ar.MESH_INFO_KEY;
    var _meshContainerKey = ar.MESH_CONTAINER_KEY;
    var _serverDataKey = ar.SERVER_DATA_KEY;


    function createGalaxyMapItem(_super) {
        function IGalaxyMapItem() {
            var _self = _.extend(this, _super);
            _self.Sectors = null;
            return _self;
        }
        return new IGalaxyMapItem();
    }

    function _initMapper(_super) {
        _super.GetOrAdd(1, 1);
    }
    var galaxyMapper = MapGeometry.IGeometryMaperFactory("GalaxyMapper", createGalaxyMapItem, _initMapper);
    galaxyMapper._hasSectors = {};
    galaxyMapper.HasSectorsInGalaxy = function (galaxyId) {
        return galaxyMapper._hasSectors[galaxyId];
    };
    galaxyMapper.GetSectors = function (galaxyId) {
        if (!galaxyMapper.HasSectorsInGalaxy(galaxyId)) return null;
        var item = galaxyMapper.GetMapItem(galaxyId);
        return item.Sectors;
    };
    galaxyMapper.GalaxyInitialized = function (galaxyId) {
        var item = galaxyMapper.GetMapItem(galaxyId);
        if (!item) return false;
        return item._gInitialized;
    };
    galaxyMapper.GetGalaxyes = function () {
        return galaxyMapper._collection;
    };

    var galaxies = MapGeometry._baseObject(null, null, null, galaxyMapper);


    function saveSectorsFromServer(answer) {
        _.forEach(answer, function (sector, sectorIdx) {
            var item = galaxyMapper.GetMapItem(sector.GalaxyId);
            if (!item) throw Errors.ClientNullReferenceException({ answer: answer, galaxyMapper: galaxyMapper, item: item }, "item", "galaxies.saveSectorsFromServer");

            if (!item.Sectors) {
                item.AddProp("Sectors", {});
                item.Sectors[sector.Id] = sector;
                galaxyMapper._hasSectors[sector.GalaxyId] = true;

            }
            else if (!item.Sectors[sector.Id]) item.Sectors[sector.Id] = sector;

        });

    }

    function getGalaxy(numId) {
        var meshContainer = galaxyMapper.GetMapItem(numId);
        var realGalaxyId = meshContainer.FullMeshId;
        var galaxy = galaxyMapper.GetMeshById(realGalaxyId);
        if (galaxy) return galaxy;
        else {
            MapGeometry.Sectors.Generate(numId);
            var newGalaxy = galaxyMapper.GetMeshById(realGalaxyId);
            if (newGalaxy) return newGalaxy;
            else console.log("galaxy__" + numId + "__not exist");
            return null;
        }
    }

    function setVisible(show) {
        _.forEach(galaxyMapper.GetGalaxyes(), function (galaxyItem, galaxyItemKey) {
            EM.SetVisibleByMesh(galaxyMapper.GetMeshById(galaxyItem.FullMeshId), show);
        });
    }

    function generateGalaxy1(mapItem) {
        var x = 16;
        var y = 16;
        var scale = 3e3;
        var galParams = {
            width: x * scale,
            height: y * scale
        };
        var galaxyId = 1;
        var _mapItem = mapItem || galaxyMapper.GetMapItem(galaxyId);
        var textureId = _mapItem.TextureId;
        var gMeshId = _mapItem.FullMeshId;
        var galaxyMesh = _mapItem.GetMeshById(gMeshId);
        if (galaxyMesh) return galaxyMesh;

        var galaxy = BABYLON.MeshBuilder.CreateGround(gMeshId, galParams, EM.Scene);
        galaxy.material = ar.GetSpaceRegularMaterial(textureId);


        ar.AddLocalsToMesh(galaxy, _textureTypeIdKey, textureId);
        var meshInfo = ar.GetMeshInfoByMeshId(galaxy.id);
        ar.AddLocalsToMesh(galaxy, _mapTypeKey, meshInfo.GetMapType());
        ar.AddLocalsToMesh(galaxy, _meshContainerKey, meshInfo.GetMeshContainer());
        ar.AddLocalsToMesh(galaxy, _meshInfoKey, meshInfo);
        ar.AddLocalsToMesh(galaxy, _mapItemKey, _mapItem);

        var _galaxyVisible = false;
        var _galaxyObserver;
        var nibulaBox = EM.GetMesh(ar.NUBULA_BOX_MESH_ID);
        Object.defineProperty(galaxy, "isVisible", {
            get: function () {
                return _galaxyVisible;
            },
            set: function (value) {
                if (value) {
                    _galaxyObserver = EM.Scene.onBeforeRenderObservable.add(function (eventData, mask) {
                        nibulaBox.isVisible = false;
                        galaxy.rotation.y -= 0.00006;
                    });
                }
                else {
                    EM.Scene.onBeforeRenderObservable.remove(_galaxyObserver);
                    nibulaBox.isVisible = true;
                }
                _galaxyVisible = value;
                //  console.log("galaxy change state new value: " + value);
            }
        });

        EM.MapEvent.AddExecuteCodeAction(galaxy, BABYLON.ActionManager.OnPickTrigger, function () {
            EM.MapEvent.HideContextMenu();
        });
        return galaxy;
    }

    function generateGalaxyiesAndSectorsIn() {
        var galaxiId1 = 1;
        if (!galaxyMapper.GalaxyInitialized(galaxiId1) && galaxyMapper.HasSectorsInGalaxy(galaxiId1)) {
            var mapItem = galaxyMapper.GetMapItem(1);
            var g1 = generateGalaxy1(mapItem);
            var sectors = mapItem.Sectors;
            MapGeometry.Sectors.Generate(g1, true, sectors);
            mapItem._gInitialized = true;


        }


    }

    function createGalaxyById(galaxyId) {
        if (Utils.ConvertToInt(galaxyId) === 1) return generateGalaxy1();
        return false;
    }

    galaxies.CreateGalaxyById = createGalaxyById;
    galaxies.Generate = generateGalaxyiesAndSectorsIn;
    galaxies.SetVisible = setVisible;


    galaxies.SaveSectorsFromServer = saveSectorsFromServer;



    galaxies.GetGalaxy = getGalaxy;
    galaxies.GetSectorsByGalaxyId = galaxyMapper.GetSectors;

    galaxies.GetGalaxyIdFromMesh = function (meshId) {
        var _id = MapGeometry.GetUniqueIdFromAny(meshId);
        if (!_id) return null;
        if (_.isNumber(_id)) return _.toInteger(_id);
        var item = ar.GetMeshInfoByMeshId(_id);
        if (item) return item.UniqueId;
        throw Errors.ClientNotImplementedException({ meshId: meshId, _id: _id }, "MapGeometry.GetGalaxyIdFromMesh");
    };

    galaxies.GalaxyInitialized = galaxyMapper.GalaxyInitialized;
    galaxies.HasSectorsInGalaxy = galaxyMapper.HasSectorsInGalaxy;
    MapGeometry.Galaxies = galaxies;
})(EM.MapGeometry);
//#endregion


//#region Sectors
(function (MapGeometry) {
    "use strict";
    var scale = MapGeometry.Scale;
    var galaxies = MapGeometry.Galaxies;

    var ar = EM.AssetRepository;
    var _mapItemKey = ar.MAP_ITEM_KEY;
    var _textureTypeIdKey = ar.TEXTURE_TYPE_ID_KEY;
    var _mapTypeKey = ar.MAP_TYPE_KEY;
    var _meshInfoKey = ar.MESH_INFO_KEY;
    var _meshContainerKey = ar.MESH_CONTAINER_KEY;
    var _serverDataKey = ar.SERVER_DATA_KEY;
    var sectorTextureId = 201;


    function createSectorMapItem(_super) {
        function ISectorMapItem() {
            var _self = _.extend(this, _super);
            return _self;
        }
        return new ISectorMapItem();
    }


    var sectorMapper = MapGeometry.IGeometryMaperFactory("SectorMapper", createSectorMapItem, null, MapGeometry.SECTOR_REAL_PROTONAME);

    function generateSectors(galaxyId, isGalaxyMesh, _sectors) {
        var galaxy;
        var sectors;
        if (isGalaxyMesh) galaxy = galaxyId;
        else if (!galaxies.HasSectorsInGalaxy(galaxyId) || galaxies.GalaxyInitialized(galaxyId)) return;
        else galaxy = galaxies.CreateGalaxyById(galaxyId);

        if (!galaxy) throw Errors.ClientNullReferenceException({
            galaxyId: galaxyId,
            isGalaxyMesh: isGalaxyMesh,
            _sectors: _sectors,
            galaxy: galaxy
        }, "galaxy", "MapGeometry.Sectors.Generate (generateSectors(galaxyId, isGalaxyMesh, _sectors))");

        if (_sectors) sectors = _sectors;
        else sectors = galaxies.GetSectorsByGalaxyId(galaxyId);



        var cubeLenght = 100 * scale / 4;
        //   var sectorProto = BABYLON.MeshBuilder.CreateBox(MapGeometry.SECTOR_PROTO_NAME, { size: cubeLenght }, EM.Scene);
        var sectorProto = BABYLON.MeshBuilder.CreateDisc(MapGeometry.SECTOR_PROTO_NAME, {
            radius: cubeLenght,
            tessellation: 32,
            updatable: false,
            sideOrientation: 1
        }, EM.Scene);


        sectorProto.rotation.x = -Math.PI / 2;
        _.forEach(sectors, function (sector, key) {
            var mapItem = sectorMapper.GetOrAdd(sector.Id, sector.TextureTypeId);
            var oldSector = sectorMapper.GetMeshById(mapItem.BasePartMeshId);
            if (oldSector) {
                console.log("Old sector extist", {
                    sMapedData: mapItem,
                    oldSector: oldSector,
                    sector: sector,
                    sectors: sectors,
                    galaxy: galaxy,

                });
                return;
            }
            var cloneSector = sectorProto.clone(mapItem.BasePartMeshId);

            cloneSector.material = MapGeometry.Sectors.Materials.GetRegular(sector.TextureTypeId);
            var coordObj = Utils.ObjectToVector3(sector.Position);
            cloneSector.position = coordObj;
            cloneSector.position.y += 10;
            cloneSector.parent = galaxy;



            ar.AddLocalsToMesh(cloneSector, _textureTypeIdKey, sector.TextureTypeId);
            var meshInfo = ar.GetMeshInfoByMeshId(cloneSector.id);
            ar.AddLocalsToMesh(cloneSector, _mapTypeKey, meshInfo.GetMapType());
            ar.AddLocalsToMesh(cloneSector, _meshContainerKey, meshInfo.GetMeshContainer());
            ar.AddLocalsToMesh(cloneSector, _meshInfoKey, meshInfo);
            ar.AddLocalsToMesh(cloneSector, _mapItemKey, mapItem);
            ar.AddLocalsToMesh(cloneSector, _serverDataKey, sector);


            EM.MapEvent.RegisterSectorActions(cloneSector);

        });
        sectorProto.dispose();
        EM.SetVisibleByMesh(galaxy, false);
    }

    function getMeshIdBySectorNumId(sectorNumId) {
        var item = sectorMapper.GetMapItem(sectorNumId, sectorTextureId);
        if (!item) return null;
        return item.FullMeshId;
    };

    function getMeshBySectorNumId(sectorNumId) {
        console.log("getMeshBySectorNumId", { sectorMapper: sectorMapper, sectorNumId: sectorNumId });
        return sectorMapper.GetMeshById(getMeshIdBySectorNumId(sectorNumId));
    };

    function setSectorsUnselected() {
        var csl = EM.EstateData.GetCurrentSpaceLocation();
        // console.log("setSectorsUnselected", csl);
        var sectors = galaxies.GetSectorsByGalaxyId(csl.GalaxyId);
        var regularMaterial = MapGeometry.Sectors.Materials.GetRegular();
        _.forEach(sectors, function (sectorData, key) {
            var id = sectorData.Id;
            var sectorMeshId = getMeshIdBySectorNumId(id);

            if (sectorMeshId) {
                var sectorMesh = EM.GetMesh(sectorMeshId);
                if (sectorMesh && sectorMesh.material && sectorMesh.material.id !== regularMaterial.id) {
                    sectorMesh.material = regularMaterial;
                }
            }

        });
    }

    MapGeometry.Sectors = MapGeometry._baseObject(generateSectors, null, null, sectorMapper);
    MapGeometry.Sectors.SetUnselected = setSectorsUnselected;
    MapGeometry.Sectors.GetMeshIdBySectorNumId = getMeshIdBySectorNumId;
    MapGeometry.Sectors.GetMeshBySectorNumId = getMeshBySectorNumId;


    // todo  костыль

    MapGeometry.Sectors.Materials = {
        GetRegular: function () {
            return EM.AssetRepository.GetSpaceRegularMaterial(sectorTextureId);
        },
        GetHover: function () {
            return EM.AssetRepository.GetSpaceHoverMaterial(sectorTextureId);
        },
        GetClick: function () {
            return EM.AssetRepository.GetSpaceClickMaterial(sectorTextureId);
        }
    };
})(EM.MapGeometry);

//#endregion

//#region Systems
(function (MapGeometry) {
    "use strict";
    var ar = EM.AssetRepository;
    var _mapItemKey = ar.MAP_ITEM_KEY;
    var _textureTypeIdKey = ar.TEXTURE_TYPE_ID_KEY;
    var _mapTypeKey = ar.MAP_TYPE_KEY;
    var _meshInfoKey = ar.MESH_INFO_KEY;
    var _meshContainerKey = ar.MESH_CONTAINER_KEY;
    var _serverDataKey = ar.SERVER_DATA_KEY;

    var _systemProtoMeshName = MapGeometry.SYSTEM_PROTO_NAME;
    var _typeIdKey = EM.MapData.SystemKeys.TypeId;

    function ISystemSpriteData() {
        this._coords = null;
        this.Coords = null;
        this.Id = null;
        this.NativeName = null;
        this.TextureTypeId = null;
        this.GameTypeId = null;
        this.GalaxyId = null;
        this.SectorId = null;
        this._setData = function (_serverData) {
            this._coords = _serverData.Coords;
            this.Coords = Utils.ObjectToVector3(_serverData.Coords);
            this.Id = _serverData.Id;
            this.NativeName = _serverData.NativeName;
            this.TextureTypeId = _serverData.TextureTypeId;
            this.GameTypeId = _serverData.GameTypeId;
            this.GalaxyId = _serverData.GalaxyId;
            this.SectorId = _serverData.SectorId;
            return this;
        }
    }

    var spriteData = (function () {
        var s = {
            url: Utils.CdnManager.GetBjsSprite("starSprite.png", true),
            items: 8,
            originalWidth: 2080,
            itemSize: 0,
            //nameColor: "#0a5789",
            nameColor: "#0065f0",
            typeColor: "#005cc5",
            _offsets: []
        };
        s.itemSize = s.originalWidth / s.items;
        s.getOffset = function (index) {
            return s._offsets[index];
        }
        for (var j = 0; j < s.items; j++) {
            s._offsets.push(j * s.itemSize);
        }
        s.pW = 2.9;
        s.pH = 1;
        s.ratio = s.pW / s.pH;
        s.h = s.itemSize;
        s.w = s.h * s.ratio;


        s.width = s.w + "px";
        s.height = s.h + "px";
        s.textW = (s.w * 0.5) + "px";
        s.imgW = s.itemSize + "px";
        return s;
    })();
    function _createText(panel, meshId, typeName, systemName) {
        // Adding text
        var textPanel = new BABYLON.GUI.StackPanel("text_panel_" + meshId);
        var fontFamily = "Electrolize sans-serif";
        textPanel.width = spriteData.textW;
        textPanel.isVertical = true;
        //textPanel.background = "red";
        textPanel.height = spriteData.height;
        textPanel.fontFamily = fontFamily;

        var tb1 = new BABYLON.GUI.TextBlock("text_block_name" + meshId, systemName);
        tb1.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        tb1.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        tb1.height = "50%";
        tb1.color = spriteData.nameColor;
        tb1.fontSize = "89px";

        textPanel.addControl(tb1);

        var tb2 = new BABYLON.GUI.TextBlock("text_block_type" + meshId, typeName);
        tb2.textHorizontalAlignment = tb1.textHorizontalAlignment;
        tb2.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

        tb2.height = "30%";
        tb2.color = spriteData.typeColor;
        tb2.fontSize = "60px";
        textPanel.addControl(tb2);
        panel.addControl(textPanel);


    };

    function _createButton(panel, meshId, index) {
        var btn = BABYLON.GUI.Button.CreateImageOnlyButton("btn_" + meshId, spriteData.url);
        btn.thickness = 0;
        btn.width = spriteData.imgW;
        btn.height = spriteData.height;

        //  btn.linkOffsetX ="-10px";
        //btn.background = "blue";
        var img = btn.children[0];
        img.stretch = BABYLON.GUI.Image.STRETCH_NONE;
        img.sourceWidth = spriteData.itemSize;
        img.sourceHeight = spriteData.itemSize;
        img.sourceLeft = spriteData.getOffset(index);//2080;
        img.sourceTop = 0;
        img.width = img.height = spriteData.height;
        img.scaleY = 1.4;
        img.scaleX = 1;
        //img.top = "4px";
        img.left = "-10%";
        panel.addControl(btn);

    }

    function _createContainer(meshId, typeName, systemName, spriteIndex, advancedTextureContainer) {
        //   advancedTextureContainer.renderAtIdealSize = true;
        var panel = new BABYLON.GUI.StackPanel("container_" + meshId);
        panel.isVertical = false;
        panel.thickness = 0;
        panel.width = spriteData.width;
        panel.height = spriteData.height;
        _createText(panel, meshId, typeName, systemName);
        _createButton(panel, meshId, spriteIndex);
        advancedTextureContainer.addControl(panel);
    }


    function _createSystemSpriteMappItem(_super) {

        /**
         * BEGIN EQUAL
         * this._nodeSpriteMeshId - (meshId ==> BABYLON.Mesh) === sprite.id  (sprite==> BABYLON.Sprite2D)
         * ===   EM.AssetRepository.GetSpaceSpriteMesh(systemTextureId/startextureId, systemId/starId, MapGeometry.SYSTEM_PROTO_NAME)  
         * ===   EM.AssetRepository.GetSpaceSpriteMeshContainer(MapGeometry.SYSTEM_PROTO_NAME)._getBaseSpriteId(systemId/starId)
         * ===   IGeometryMapItem[EM.AssetRepository.MESH_CONTAINER_KEY] --  meshContainer  . _getBaseSpriteId(systemId/starId) ---- 
         * END EQUAL
         *  _super - base class  IGeometryMapItem
         * @returns {ISystemSpriteMappItem}  болванка без данных (кроме константных)
         * -- данные устанавливаются через вызов метода  this.CreateSprite (serverDataItem, parentMesh) 
         */
        function ISystemSpriteMappItem() {
            var _self = _.extend(this, _super);
            _self._serverSystemData = new ISystemSpriteData();
            _self._nodeSpriteMeshId = null;
            _self._spriteCreated = false;
            _self._sectorId = null;
            _self._systemId = null;
            _self._advancedTexture = null;
            _self.CreateSprite = function (serverDataItem, parentMesh) {
                if (_self._spriteCreated) {
                    var _mesh = _self.GetMeshById(_self._nodeSpriteMeshId);
                    if (_mesh) return _mesh;
                    else {
                        throw console.log("_self._spriteCreated, but mesh not exist");
                    }
                }
                //console.log("data", {
                //    serverDataItem: serverDataItem
                //});
                var data = _self._serverSystemData._setData(serverDataItem);
                _self._sectorId = data.SectorId;
                _self._systemId = data.Id;
                var mc = _self[EM.AssetRepository.MESH_CONTAINER_KEY];
                var meshId = mc._getBaseSpriteId(data.Id);
                var system = parentMesh.clone(meshId);
                system.position = data.Coords;
                // system.scaling = new BABYLON.Vector3(3000, 3000, 3000);
                system.scalingDeterminant = 3000;
                _self._nodeSpriteMeshId = system.id;

                var advancedTexture = _self._advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(system, spriteData.w, spriteData.h, false);
                _createContainer(system.id, "SYSTEM", data.NativeName, mc._spriteIndex, advancedTexture);

                system.onDisposeObservable.add(function () {
                    //   console.log("onDisposeObservable");
                    if (system.material) {
                        system.material.dispose(true, true);
                        system.material = null;
                        delete system.material;
                        console.log(" mesh.material");
                        advancedTexture.dispose();
                    }
                    // system.onDisposeObservable.remove(this);

                });

                ar.AddLocalsToMesh(system, _textureTypeIdKey, data.TextureTypeId);
                var meshInfo = ar.GetMeshInfoByMeshId(system.id);
                var mapType = meshInfo.GetMapType();

                ar.AddLocalsToMesh(system, _mapTypeKey, mapType);
                ar.AddLocalsToMesh(system, _meshContainerKey, mc);
                ar.AddLocalsToMesh(system, _meshInfoKey, meshInfo);
                ar.AddLocalsToMesh(system, _mapItemKey, _self);
                ar.AddLocalsToMesh(system, _serverDataKey, _self._serverSystemData);
                //  console.log("system", system);
                //  system.material.alpha =0.7;
                if (system.material && system.material.emissiveTexture) {
                    system.material.emissiveTexture.level = 0.95;
                }
                EM.MapEvent.RegisterSystemsActions(system);
                _self._spriteCreated = true;

                return system;

            };
            _self.GetSpriteNodeMesh = function () {
                if (!_self._nodeSpriteMeshId) return null;
                return _self.GetMeshById(_self._nodeSpriteMeshId);
            }
            _self._dispose = function () {
                var _mesh = _self.GetMeshById(_self._nodeSpriteMeshId);
                if (!_mesh) return;
                _mesh.dispose();
            };
            _self.setVisible = function (show) {
                EM.SetVisible(_self._nodeSpriteMeshId, show);
            };

            return _self;
        }
        return new ISystemSpriteMappItem();
    }

    function _disposeItem(item, itemKey) {
        item._dispose();
    }
    var systemsMapper = MapGeometry.IGeometryMaperFactory("SystemSpriteMapper", _createSystemSpriteMappItem, null, _systemProtoMeshName, function (textureId, uniqueId) {
        return ar.GetSpaceSpriteMeshContainer(textureId);
    });
    systemsMapper.Destroy = function (sectorId) {
        if (!systemsMapper.Count) return;
        if (sectorId) {
            systemsMapper._cleanPerItem(_disposeItem, function (item) {
                return item._sectorId === sectorId;
            });
        }
        else systemsMapper._cleanPerItem(_disposeItem);
    }

    function _setVisible(show) {
        EM.Particle.ShowOrHideSectorParticles(show);
        _.forEach(systemsMapper._collection, function (item) {
            item.setVisible(show);
        });
    }

    function _getProtoMesh() {
        var protoMesh = systemsMapper.GetMeshById(_systemProtoMeshName);
        if (!protoMesh) {
            protoMesh = BABYLON.MeshBuilder.CreatePlane(_systemProtoMeshName, { width: spriteData.pW, height: spriteData.pH }, EM.Scene);
            protoMesh.isVisible = false;
            protoMesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
            protoMesh.updatable = true;

        }
        return protoMesh;
    }


    function _generateSystems(callback) {
        var data = EM.MapData.Systems;
        var starsSystemsProto = _getProtoMesh();
        _.forEach(data, function (itemData, key) {
            var item = systemsMapper.GetOrAdd(itemData.Id, itemData.TextureTypeId);
            item.CreateSprite(itemData, starsSystemsProto);
        });
        _setVisible(false);
        if (callback instanceof Function) callback();
    }

    var systems = MapGeometry._baseObject(_generateSystems, systemsMapper.Destroy, _setVisible);

    systems.NeedNewSystems = function () {
        if (!systemsMapper.Count) return true;
        var csl = EM.EstateData.GetCurrentSpaceLocation();
        console.log("needNewSystems", {
            "MapData.GetSystems.DataSectorId": EM.MapData.GetSystems.DataSectorId,
            "csl.SectorId": csl.SectorId
        });
        if (EM.MapData.GetSystems.DataSectorId === csl.SectorId) return false;
        else return true;
    };

    systems.GetSpriteMeshByStarId = function (starId) {
        var item = _.find(systemsMapper._getAll(), function (o) {
            return o._systemId === starId;
        });
        if (!item) return null;
        var mesh = item.GetSpriteNodeMesh();
        //  console.log("systems.GetSpriteMeshByStarId", { item: item, systemsMapper: systemsMapper, mesh: mesh });
        return mesh;
    }

    MapGeometry.Systems = systems;
})(EM.MapGeometry);
//#endregion

//#region System
(function (MapGeometry) {
    "use strict";
    var system = MapGeometry._baseObject();
    var ar = EM.AssetRepository;
    system.CallBack = null;
    system.StarRadius = null;
    var config = EM.MapData.SystemKeys;
    var types = MapGeometry.MapTypes;
    var PMCRK = system.PLANETOID_MIN_CAMERA_RADIUS_KEY = "_minCameraRadius";
    var showLog = false;
    function _log(key, data, type) {
        if (!showLog) return;
        console.log("__system.generate__" + type + "__" + key + "__   ", { data: data });
    }

    var starMeshIds = {};
    var planetMeshIds = {};
    var moonMeshIds = {};


    function _prepareColor(baseMaterialColor, dataColor) {
        var _dataColor = Utils.ObjectToColor3(dataColor);
        var cd = Utils.Color3IntToDecimal(_dataColor, 0.2);
        cd.r += baseMaterialColor.r;
        cd.g += baseMaterialColor.g;
        cd.b += baseMaterialColor.b;

        cd.r = cd.r > 1 ? 1 : cd.r;
        cd.g = cd.g > 1 ? 1 : cd.g;
        cd.b = cd.b > 1 ? 1 : cd.b;
        return cd;
    }

    system.getMinCameraRadiusByMesh = function (mesh) {
        var locals = ar.GetLocalsFromMesh(mesh, PMCRK);
    }



    // todo  important!!!! иначе дрожит камера
    var SCALE_SYSTEM = 15;

    function createPlanetoidMeshId(textureTypeId, uniqueId) {
        return ar.CreateSpaceRegularMeshId(textureTypeId, uniqueId);
        //  return ar.GetSpaceRegularMeshId(textureTypeId, uniqueId);
    }

    function createActivePlanetMeshId(textureTypeId, uniqueId) {
        var meshContainer = ar.GetSpaceRegularMeshContainer(textureTypeId);
        var baseMesh = meshContainer.GetMesh();
        var baseMeshId = baseMesh.id;
        var childId = meshContainer.GetMeshId(uniqueId, baseMeshId);
        console.log("createActivePlanetMeshId", childId);
        return childId;

    }

    function _setScale(mesh, scaneNum) {
        return EM.SetScaleToMesh(mesh, scaneNum);
    }


    function generate() {
        var _textureTypeIdKey = ar.TEXTURE_TYPE_ID_KEY;
        var _mapTypeKey = ar.MAP_TYPE_KEY;
        var _meshInfoKey = ar.MESH_INFO_KEY;
        var _meshContainerKey = ar.MESH_CONTAINER_KEY;
        var _serverDataKey = ar.SERVER_DATA_KEY;
        var _laerNames = ar.LAYER_NAMES;
        var _subMeshNames = ar.SUBTYPE_MESH_NAMES;


        //  var hl = MapGeometry.Effects.Hl;
        //    hl.Create();

        if (!EM.MapData.System) return false;
        //console.log("System.generate");
        function _addChildrenDataToLocals(parentMesh, childData) {
            parentMesh._localData._serverData.Children[childData.Id] = childData;
        }

        function _addLocals(mesh, meshContainer, serverData, radius) {
            ar.AddLocalsToMesh(mesh, _textureTypeIdKey, serverData.TextureTypeId);
            var meshInfo = ar.GetMeshInfoByMeshId(mesh.id);
            ar.GetOrAddLoacalsInMesh(mesh, _mapTypeKey, meshInfo.GetMapType());
            ar.AddLocalsToMesh(mesh, _meshContainerKey, meshContainer);
            ar.AddLocalsToMesh(mesh, _meshInfoKey, meshInfo);
            ar.AddLocalsToMesh(mesh, _serverDataKey, serverData);

            var minCameraRadius = radius * 3 * SCALE_SYSTEM;
            var _min = EM.GameCamera.System.lowerRadiusLimit;
            if (_min > minCameraRadius) {
                minCameraRadius = _min;
            }
            ar.AddLocalsToMesh(mesh, PMCRK, minCameraRadius);
        }

        function _rgisterPdActions(mesh) {
            EM.MapEvent.RegisterPlanetoidActions(mesh);
        }

        function _cloneMaterial(mesh, baseMaterial, uniqueId) {

            var cloneMaterial = ar.CloneMaterial(mesh, baseMaterial, uniqueId);
            if (mesh.material) {
                //todo  нельзя диспосить ничего, в данных меша пока хратится клоне меш и  ссылка на исходный материал
                //mesh.material.dispose(true, true);
                //delete mesh.material;
            }
            //console.log("_cloneMaterial", {
            //    cloneMaterial: cloneMaterial,
            //    mat: mesh.material,
            //    mesh: mesh,
            //});
            mesh.material = cloneMaterial;
            return cloneMaterial;
        }

        function _cloneBaseMesh(meshContainer, uniqueId) {
            //console.log("_cloneBaseMesh", {
            //    meshContainer: meshContainer,
            //    uniqueId: uniqueId,
            //});
            var baseMesh = meshContainer.GetMesh();
            if (!baseMesh) {
                throw Errors.ClientNullReferenceException({
                    meshContainer: meshContainer,
                    baseMesh: baseMesh
                });
            }
            var meshId = meshContainer.GetMeshId(uniqueId);
            var mesh = baseMesh.clone(meshId);
            //mesh.makeGeometryUnique();
            return mesh;
        }


        /**
         *  
         * see   _addLocals
         *  see    EM.AssetRepository.BindDisposeFullMesh
         * @param {object} mesh 
         * @param {object} meshContainer 
         * @param {object} serverData 
         * @returns {object}   BABYLON.Mesh
         */
        function _onCreatePlanetoid(mesh, meshContainer, serverData, radius) {
            if (!serverData.Children) serverData.Children = {};
            _addLocals(mesh, meshContainer, serverData, radius);
            EM.AssetRepository.BindDisposeFullMesh(mesh);
            return mesh;
        }

        function createOrbit(data, parent, scale) {
            var radiusOrbit = data[config.Orbit] * scale;
            var connectionPlanet = data[config.NativeName];
            var meshId = "orbit_" + connectionPlanet;
            //  var tes = 359;
            var tes = 89;
            var pi2 = Math.PI * 2;
            var step = pi2 / tes;
            //  var step = _.round(pi2 / tes, 5);
            var path = [];
            for (var i = 0; i < pi2; i += step) {
                var x = radiusOrbit * Math.cos(i);
                var z = radiusOrbit * Math.sin(i);
                var y = 0;
                path.push(new BABYLON.Vector3(x, y, z));

            }
            path.push(path[0]);

            //var orbit = BABYLON.Mesh.CreateDashedLines(meshName, path, 1, 2, tes * 1.5, EM.Scene, true);
            var orbit = BABYLON.MeshBuilder.CreateLines(meshId, { points: path }, EM.Scene);

            //todo 0-1 generate 
            //  console.log(data[config.OrbitAngle]);
            orbit.rotation = Utils.ObjectToVector3(data[config.OrbitAngle]);

            orbit.isEnabled(1);
            orbit.isPickable = false;
            orbit.color = BABYLON.Color3.White();
            orbit.alpha = 0.05;
            orbit.parent = parent;
            return {
                coord: path,
                orbit: orbit
            };

        }

        function _getOrbitPosition(dataOrbitPosition, coords) {
            if (dataOrbitPosition < 0) {
                throw new Error("_getOrbitPosition dataOrbitPosition< 0");
            }
            if (coords[dataOrbitPosition]) {
                return coords[dataOrbitPosition].clone();
            }
            else {
                return _getOrbitPosition(dataOrbitPosition - 1, coords);
            }
        }
        function createAxis(data, parent, type) {
            var axisName = _.join(["axis", type.toLowerCase(), parent.orbit.id], "_");
            var angle = Utils.ObjectToVector3(data.AxisAngle);
            var length = _.round(data[config.Radius] * 1.5, 4);
            var line = [new BABYLON.Vector3(0, -length, 0), new BABYLON.Vector3(0, length, 0)];
            var axis = BABYLON.MeshBuilder.CreateLines(axisName, { points: line }, EM.Scene);

            var orbitPosition = data[config.OrbitPosition];
            axis.position = _getOrbitPosition(orbitPosition, parent.coord);
            axis.rotation = angle;
            // axis.position = parent.coord[0]; 

            axis.isPickable = false;
            axis.isVisible = false;

            axis.parent = parent.orbit;
            return axis;
        }


        function _createMeshPlanetoid(textureTypeId, diameter, meshContainer, uniqueId) {
            var meshId = meshContainer.GetMeshId(uniqueId);
            var planetoidMesh = BABYLON.Mesh.CreateSphere(meshId, 16, diameter, EM.Scene);
            _cloneMaterial(planetoidMesh, ar.GetSpaceRegularMaterial(textureTypeId), uniqueId);
            return planetoidMesh;
        }

        function createBasePlanetoid(serverDataItem, planetoidType) {
            var textureTypeId = serverDataItem["TextureTypeId"];
            var _radius = serverDataItem[config.Radius];

            var diametr = _radius * 2;
            var meshContainer = ar.GetSpaceRegularMeshContainer(textureTypeId);
            var mesh = _createMeshPlanetoid(textureTypeId, diametr, meshContainer, serverDataItem.Id);

            if (planetoidType === types.Star) {
                system.StarRadius = _radius;
                mesh.position = Utils.ObjectToVector3(serverDataItem[config.Coords]);
                //scattering light effect
                //   object.material = RepoTexturesAndImgList.GetSpaceRegularMaterial(textureTypeId);
                MapGeometry.Effects.Scattering.SetStar(mesh);
                EM.SpaceState.LastActiveStarSystem = mesh.id;
            }
            mesh.isVisible = true;
            mesh.isPickable = true;


            _onCreatePlanetoid(mesh, meshContainer, serverDataItem, _radius);
            _rgisterPdActions(mesh);
            return mesh;
        }

        function createPlanetCloud(cloudMeshContainer, serverPlanetData) {
            var textureTypeId = serverPlanetData.TextureTypeId;
            var planetId = serverPlanetData.Id;
            var _cloudMesh = _cloneBaseMesh(cloudMeshContainer, planetId);
            _cloneMaterial(_cloudMesh, ar.GetSpaceCloudMaterial(textureTypeId), planetId);
            _cloudMesh.isVisible = true;
            return _cloudMesh;
        }

        //#region Planetoids initialize


        function createMoons(moonsData, planetMesh) {
            _.forEach(moonsData, function (moonData, idx) {
                var moonId = moonData.Id;
                var moonOrbit = createOrbit(moonData, planetMesh, 2);
                var moonAxis = createAxis(moonData, moonOrbit, types.Moon); //
                var moon = createBasePlanetoid(moonData, types.Moon);
                moon.parent = moonAxis;
                _addChildrenDataToLocals(planetMesh, moonData);
                if (!moonMeshIds[moonId]) moonMeshIds[moonId] = moon.id;

            });

        }


        function _createPlanetoidLabel(axisMesh, planetoidRadius, planetoidName) {
            //https://www.babylonjs-playground.com/#ESI1DK
            var labelId = axisMesh.id + "_label";

            var planeSize = planetoidRadius * 2 * SCALE_SYSTEM;

            var plane = BABYLON.Mesh.CreatePlane(labelId, planeSize);
            plane.position.y = axisMesh.geometry.extend.maximum.y * 0.5;
            plane.position.x = plane.position.z = 0;
            //var lableH = 1024;
            var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);
            var label = new BABYLON.GUI.TextBlock();
            label.text = planetoidName;
            label.color = "#0065f0";
            label.fontSize = "128px";
            label.fontFamily = "Electrolize sans-serif bold"; //Play

            label.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            advancedTexture.addControl(label);
            label.linkWithMesh(axisMesh);
            //plane.scaling = planetMesh.scaling.clone();
            plane.parent = axisMesh;
            plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;


        }

        function _cteateStarLabel(starMesh, starData) {
            //https://www.babylonjs-playground.com/#ESI1DK
            //console.log("starData", { starMesh: starMesh, starData: starData });
            var radius = starData.Radius;

            var labelId = starMesh.id + "_label";
            var w = radius * 2;
            var h = w / 4;
            var plane = BABYLON.MeshBuilder.CreatePlane(labelId, { width: w * SCALE_SYSTEM, height: h * SCALE_SYSTEM }, EM.Scene);
            plane.position.y += radius * 1.5;
            plane.position.x = plane.position.z = 0;
            //var lableH = 1024;
            var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);
            var fontSize = 256;
            advancedTexture.idealWidth = fontSize * 5;
            var label = new BABYLON.GUI.TextBlock();
            label.text = starData.NativeName;
            label.color = "#0065f0";
            label.fontSize = fontSize * 1.7;
            label.fontFamily = "Electrolize  sans-serif bold";
            //label.shadowColor = "red";
            //label.shadowBlur = 50;
            //label.shadowOffsetX = 5;
            //label.shadowOffsetY = 10;
            label.scaleY = 4;
            label.resizeToFit = true;
            label.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            advancedTexture.addControl(label);
            plane.parent = starMesh;
            plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
            EM.AssetRepository.BindDisposeFullMesh(plane, function () {
                advancedTexture.removeControl(label);
                advancedTexture.dispose();


            },
                function () {
                    console.log("after dispose", { plane: EM.GetMesh(labelId), label: label });
                });

        };


        function createPlanes(centerStar) {
            var planetsData = EM.MapData.System[config.Planets];
            var moonsData = EM.MapData.System[config.Moons];
            _.forEach(planetsData, function (planetData, idx) {
                var planetId = planetData.Id;
                var textureTypeId = planetData["TextureTypeId"];
                var _radius = planetData[config.Radius] * 1;
                var diametr = _radius * 2;
                var planetOrbit = createOrbit(planetData, centerStar, 1);

                var planetAxis = createAxis(planetData, planetOrbit, types.Planet);
                //console.log("planetAxis", planetAxis.id);

                var ti = ar.GetTypeItem(textureTypeId);



                var layer = ti.GetLayer(_laerNames.space);


                var meshRegularContainer = layer.GetMeshContainer(_subMeshNames.regular);


                //main planet
                var planetMesh = _cloneBaseMesh(meshRegularContainer, planetId);
                var planetMaterial = _cloneMaterial(planetMesh, ar.GetSpaceRegularMaterial(textureTypeId), planetId);
                //console.log("createPlanes", {
                //    planetData: planetData,
                //    ti: ti,
                //    textureTypeId: textureTypeId,
                //    planetMaterial: planetMaterial,
                //    planetMesh: planetMesh,
                //});

                var color = _prepareColor(planetMaterial.emissiveColor, planetData["Color"]);
                planetMaterial.emissiveColor = color.clone();
                if (planetMaterial.emissiveFresnelParameters) {
                    planetMaterial.emissiveFresnelParameters.leftColor = color.clone();
                }


                planetMesh.isVisible = true;
                planetMesh.isPickable = true;


                planetMesh.parent = planetAxis;
                planetMesh.rotation = new BABYLON.Vector3.Zero();

                _addChildrenDataToLocals(centerStar, planetData);


                _onCreatePlanetoid(planetMesh, meshRegularContainer, planetData, _radius);



                _setScale(planetMesh, _radius);
                _rgisterPdActions(planetMesh);

                //cloud
                var cloudMeshContainer = layer.GetMeshContainer(_subMeshNames.cloud);

                var cloudScale = cloudMeshContainer._cloudScaling;
                var cloudRadius = cloudScale * _radius;


                var cloudMesh = createPlanetCloud(cloudMeshContainer, planetData);

                _setScale(cloudMesh, cloudRadius);

                cloudMesh.isPickable = false;
                cloudMesh.parent = planetAxis;
                EM.AssetRepository.BindDisposeFullMesh(cloudMesh);

                //EM.AssetRepository.BindDisposeFullMesh(planetOrbit);



                if (layer.RenderOption) {
                    var renderKey = ar.BEFORE_RENDER_SPACE_PLANET_ACTION_KEY;
                    var ro = layer.RenderOption.StartOnBeforeRender(planetId, renderKey, {
                        cloud: cloudMesh,
                        planet: planetMesh
                    });
                    centerStar.onDisposeObservable.add(function (_centerStar, maskItem, insertFirst) {
                        ro.StopBeforeRender(planetId);
                    });

                }

                // rings
                if (planetData.Rings) {
                    //particle
                    var sps = EM.Particle.SaturnRings.createRings(planetAxis, planetData.Radius, 400);
                    sps.vars.startRingRotation();
                }
                EM.AssetRepository.BindDisposeFullMesh(planetAxis);

                //label лейбл не подходит как дизайн. из  за пересечения с эффектом стар скаттеринга.
                //_createPlanetoidLabel(planetAxis, cloudRadius, planetData.NativeName);

                //moons
                var _moonsData = _.filter(moonsData, ["Parent", planetId]);
                if (_moonsData.length) {

                    createMoons(_moonsData, planetMesh);
                }

                if (!planetMeshIds[planetId]) planetMeshIds[planetId] = planetMesh.id;
                //  createAtmosphere(color, planet);


            });


            function logRequest() {
                var r = new Utils.Request("/api/test/AbsPlanets/", function (a) {
                    var planets = {};
                    _.forEach(a, function (d, key) {
                        planets[d.Id] = {
                            server: {
                                id: d.Id,
                                position: d.position
                            },
                            client: tmp[d.Id]
                        };

                    });
                    Utils.SaveLogToFile(planets, "planetsCoord");
                }, {});
                r.getJson();
            }


        }

        function createStars() {
            var starsData = EM.MapData.System[config.Stars];
            var star = null;
            var starKeys = Object.keys(starsData);
            var length = starKeys.length;
            if (!length) {
                console.log("star not exist!!!");
                return null;
            }
            if (length > 1) {
                //Todo  что то делаем с 2 мя звездами для расчета центра системы 
            } else if (length === 1) {
                var starId = starKeys[0];
                var curStarData = starsData[starId];
                star = createBasePlanetoid(curStarData, types.Star);
                if (!starMeshIds[curStarData.Id]) starMeshIds[curStarData.Id] = star.id;
                _cteateStarLabel(star, curStarData);
            }

            return star;
        }


        var centerStarMesh = createStars();

        createPlanes(centerStarMesh);


        //console.log("base scaling", {
        //    x: centerStarMesh.scaling.x
        //});
        centerStarMesh.scaling = new BABYLON.Vector3(SCALE_SYSTEM, SCALE_SYSTEM, SCALE_SYSTEM);
        //#endregion

        if (system.CallBack instanceof Function) {
            _log("system.CallBack instanceof Function", system.CallBack, "generate");
            system.CallBack();
            system.CallBack = null;
        }
        _log("GENERATE", "DONE", "generate");
        return true;
    }

    function destroy() {
        //console.log("MapGeometry.System.destroy. EM.SpaceState.LastActiveStarSystem", EM.SpaceState.LastActiveStarSystem);
        if (!EM.SpaceState.LastActiveStarSystem) return;
        var lastSystem = EM.GetMesh(EM.SpaceState.LastActiveStarSystem);
        if (lastSystem) {
            //console.log("EM.SpaceState.LastActiveStarSystem", {
            //    lastSystem: lastSystem
            //});

            //  EM.SetVisibleByMesh(lastSystem, false);
            lastSystem.dispose();
            EM.SpaceState.LastActiveStarSystem = null;
            EM.Scene.resetCachedMaterial();
            lastSystem = null;
        }
    }

    function getOrCreateStarMeshId(uniqueId, textureTypeId, saveIfNotExist) {
        var meshId = starMeshIds[uniqueId];
        if (!meshId) {
            meshId = createPlanetoidMeshId(textureTypeId, uniqueId);
            if (meshId && textureTypeId && saveIfNotExist) {
                starMeshIds[uniqueId] = meshId;
            }
        }
        return meshId;

    }

    function getStarStatus(uniqueStarId, textureTypeId) {
        var meshId;
        if (textureTypeId) {
            meshId = getOrCreateStarMeshId(uniqueStarId, textureTypeId);
        }
        else {
            meshId = system.GetStarMeshIdByUniqueId(uniqueStarId);
        }

        var mesh = MapGeometry._chekAndGetMeshInScene(meshId);
        if (mesh) return mesh.isVisible;
        return false;
    }


    system.CreatePlanetoidMeshId = createPlanetoidMeshId;

    system.Generate = generate;
    system.Destroy = destroy;
    system.GetStarStatus = getStarStatus;
    system.GetOrCreateStarMeshId = getOrCreateStarMeshId;
    system.GetPlanetMeshIdByUniqueId = function (uniqueId) {
        return planetMeshIds[uniqueId];
    };
    system.GetMoonMeshIdByUniqueId = function (uniqueId) {
        return moonMeshIds[uniqueId];
    };
    system.GetStarMeshIdByUniqueId = function (uniqueId) {
        return starMeshIds[uniqueId];
    };
    system.GetOrCreatePlanetMeshId = function (uniqueId, textureTypeId, saveIfNotExist) {
        //"404_space_1.404_space"
        var meshId = system.GetPlanetMeshIdByUniqueId();
        if (!meshId && textureTypeId) {
            var meshContainer = ar.GetSpaceRegularMeshContainer(textureTypeId);
            var parentMesh = meshContainer.GetMeshId();
            meshId = meshContainer.GetMeshId(uniqueId, parentMesh);
            if (meshId && saveIfNotExist) {
                planetMeshIds[uniqueId] = meshId;
            }
        }
        return meshId;
    };
    MapGeometry.System = system;

    /**
     * 
     * @param {int||string||object||BABYLON.Mesh} anySystem 
     *  systemId,
     *  meshName,
     *  object with systemId by key Id or id or uniqueId or UniqueId,
     *  mesh,
     * @returns {int} systemId
     * @throws  [ClientNotImplementedException]
     */
    MapGeometry.GetSystemIdFromAny = function (anySystem) {
        var _id = MapGeometry.GetUniqueIdFromAny(anySystem);
        if (typeof _id === "number") return _id;
        if (typeof _id === "string" && _id.length >= 5) {
            var item = ar.GetMeshInfoByMeshId(_id);
            if (item.UniqueId) return item.UniqueId;
            // todo  как кликаем сектора                                                        

        }
        throw Errors.ClientNotImplementedException({
            _id: _id,
            anySystem: anySystem
        }, "_id");
    }
})(EM.MapGeometry);
//#endregion

//#region Effects HL
(function (MapGeometry) {
    "use strict";
    var hl = {};
    hl._name = "hl1";
    hl.HighlightLayer = null;
    var created = false;

    function getMesh(meshId) {
        return EM.GetMesh(meshId);
    }

    function setBlur(h, w) {
        hl.HighlightLayer.blurHorizontalSize = h;
        hl.HighlightLayer.blurVerticalSize = w ? w : h;
    }

    function create(h, w) {
        //        console.log("created", created);
        if (!created) {
            hl.HighlightLayer = new BABYLON.HighlightLayer(hl._name, EM.Scene);
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
        _.forEach(hl.HighlightLayer._meshes, function (mesh, meshId) {
            hl.HighlightLayer.removeMesh(getMesh(meshId));
        });
    }

    /**
     * Ищет в сцене меш по имени элемента и удаляет его из инста эфекта: ["meshId1","meshId2"]
     * @param {array} list  array<string>
     * @returns {void}  void
     */
    function removeByListNames(list) {
        _.forEach(list, function (meshId, meshKey) {
            hl.HighlightLayer.removeMesh(getMesh(meshId));
        });
    }

    hl.SetBlur = setBlur;
    hl.Create = create;
    hl.AddMesh = addMesh;
    hl.AddMeshById = addMeshById;
    hl.RemoveByListNames = removeByListNames;
    hl.CleanAll = cleanAll;
    hl.UpdateMeshColor = updateMeshColor;

    MapGeometry.Effects.Hl = hl;


})(EM.MapGeometry);

//#region Effects Scattering 
(function (MapGeometry) {
    "use strict";
    var _starScattering;
    var scattering = {
        //StarScattering effect 
        SetStar: function (mesh) {
            if (!_starScattering) {
                _starScattering = new BABYLON.VolumetricLightScatteringPostProcess("godrays", 1.0, EM.GameCamera.Camera, mesh, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, EM.Engine, false);
                //star.exposure = 0.2;
                //star.decay = 0.96815;
                //star.weight = 1.5;
                //star.density = 1.1;  
            } else _starScattering.mesh = mesh;
        }

    };
    MapGeometry.Effects.Scattering = scattering;
})(EM.MapGeometry);
//#endregion





EM.MapBuilder = {};
//base 
(function (MapBuilder) {

    function IMapBuilder(subscriberName) {
        this.SubscribeName = subscriberName;
        this.Observer = Utils.PatternFactory.Observer(subscriberName);
        this.Build = null;
        this.Update = null;
    }  

    MapBuilder._createMapBuildItem = function (subscriberName) {
        return new IMapBuilder(subscriberName);
    };
})(EM.MapBuilder);
//Sectors 
(function (MapBuilder) {
    var sectors = MapBuilder._createMapBuildItem("MapBuilder.Sectors");
    sectors.Build = function (initData) {
      // console.log("sectors.Build", { initData: initData });
        EM.MapData.GetSectors.Observer.Subscribe(MapBuilder.Sectors);
        if (initData != null) EM.MapData.GetSectors.InitSectorData(initData);
        else EM.MapData.GetSectors.GetData();

    };
    sectors.Update = function (subscriberName) {
     //   console.log("sectors.Update", subscriberName);
        //console.log("sectors.Update");
        if (EM.MapData.GetSectors.SubscribeName === subscriberName) {
            EM.MapData.GetSectors.Observer.Unsubscribe(MapBuilder.Sectors);
            EM.MapGeometry.Galaxies.Generate();
            MapBuilder.Sectors.Observer.NotifyAll();
         //    console.log("sectors.NotifyAll");
        }
    };
    MapBuilder.Sectors = sectors;
})(EM.MapBuilder);

// Systems 
(function (MapBuilder) {
    var systems = MapBuilder._createMapBuildItem("MapBuilder.Systems");  
    var _buildInProgress = false;
    var _onlyVisible = false;

    systems.Build = function () {
        //console.log("MapBuilder.Systems.Build");
        if (_buildInProgress) return;
        _buildInProgress = true;
        if (EM.MapGeometry.Systems.NeedNewSystems()) {
            EM.MapGeometry.Systems.Destroy();
            _onlyVisible = false;
        }
        else {
            EM.MapGeometry.Systems.SetVisible(false);
            _onlyVisible = true;
        };

        EM.MapData.GetSystems.Observer.Subscribe(systems);
        EM.MapData.GetSystems.GetData(EM.SpaceState.CurrentActiveSector);
 
    };
    systems.Update = function (subscriberName) {  
        if (EM.MapData.GetSystems.SubscribeName === subscriberName) {
            EM.MapData.GetSystems.Observer.Unsubscribe(systems);    
            function onGenerate(advancedAction) {
                if (advancedAction instanceof Function) {
                    advancedAction();
                }
                systems.Observer.NotifyAll();
                _buildInProgress = false;
            }
            if (_onlyVisible) {
                _onlyVisible = false;
                onGenerate(function () {
                    EM.MapGeometry.Systems.SetVisible(true);
                });
                return;
            } else EM.MapGeometry.Systems.Generate(onGenerate);
        };

 
    };
    MapBuilder.Systems = systems;
})(EM.MapBuilder);
 
// System
(function (MapBuilder) {
    var system = MapBuilder._createMapBuildItem("MapBuilder.System");
    system.Callback = null;
    system.Build = function (initSystemGeometryData) {
    //    console.log("System.Build");
        var systemId = 0;
        if (initSystemGeometryData != null) systemId = EM.MapData.GetSectors.InitSectorData(initSystemGeometryData);
        else systemId = EM.MapGeometry.GetSystemIdFromAny(EM.SpaceState.CurrentActiveSystem);
        // console.log("system.Build", SpaceState.CurrentActiveSystem); 
        if (systemId === 0) {
            console.log("Error system is incorrect");
            return;
        }
        EM.MapData.GetSystem.Observer.Subscribe(system);
        EM.MapData.GetSystem.GetData(systemId);

    };
    system.Update = function (subscriberName) {
        if (EM.MapData.GetSystem.SubscribeName === subscriberName) {
         //   console.log(" system.Update");
            EM.MapData.GetSystem.Observer.Unsubscribe(system);
            EM.MapGeometry.System.Generate();
            if (null !== system.Callback) {
                system.Callback();
                system.Callback = null;
            }
        }

    };
    MapBuilder.System = system;
})(EM.MapBuilder);

EM.MapAnimation = {};
//#region BASE Анимация камеры и состояний и базовые методы
// Анимация камеры и состояний
(function (MapAnimation) {
    var animationNames = {
        CameraChangeTarget: "CameraChangeTarget",
        CameraChangeRadius: "CameraChangeRadius"
    };

    var easingTypes = {
        linear: 1,
        easeIn: 2,
        easeInOut: 3
    }

    function IAnimation(subscribeName) {
        var animation = {
            SubscribeName: subscribeName,
            SubscribeNames: {
                BaseName: subscribeName,
                Stop: subscribeName + ".Stop",
                Start: subscribeName + ".Start"
            },
            Observer: Utils.PatternFactory.Observer(subscribeName),
            Stack: Utils.PatternFactory.StackCommands(),
            Play: null,
            Stop: null
        };
        return animation;
    };

    function getEasingByType(easingType) {
        var easing;
        if (!easingType) easingType = easingTypes.easeInOut;
        if (easingType === easingTypes.easeInOut) {
            easing = new BABYLON.CubicEase();
            easing.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
            return easing;
        }
        if (easingType === easingTypes.linear) {
            return null;
        }

        if (easingType === easingTypes.easeIn) {
            easing = new BABYLON.CubicEase();
            easing.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);
            return easing;
        }
        return null;
    };


    function animationCameraTarget(source, target, easing, frames, fps) {
        var animateCameraTarget = new BABYLON.Animation(animationNames.CameraChangeTarget, "target", fps,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keys = [
            {
                frame: 0,
                value: source
            },
            {
                frame: frames,
                value: target
            }
        ];
        animateCameraTarget.setKeys(keys);

        if (easing) {
            animateCameraTarget.setEasingFunction(easing);
        }

        //animateCameraTarget.enableBlending = true;
        //animateCameraTarget.blendingSpeed = 1;
        EM.GameCamera.Camera.animations.push(animateCameraTarget);
        return animateCameraTarget;
    }

    function animationCameraRadius(endRadius, easing, frames, fps) {
        var currentRadius = EM.GameCamera.Camera.radius;
        var animateCameraRadius = new BABYLON.Animation(animationNames.CameraChangeRadius, "radius", fps, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keys2 = [
            {
                frame: 0,
                value: currentRadius
            },
            {
                frame: frames,
                value: endRadius
            }
        ];

        animateCameraRadius.setKeys(keys2);
        if (easing) {
            animateCameraRadius.setEasingFunction(easing);
        }

        //animateCameraRadius.enableBlending = true;
        //animateCameraRadius.blendingSpeed = 1;
        //console.log("animateCameraRadius", { animateCameraRadius: animateCameraRadius });
        EM.GameCamera.Camera.animations.push(animateCameraRadius);
        return animateCameraRadius;
    }

    function zoomToPlanetoid(planetoid) {
        console.log("zoomToPlanetoid", {
            planetoid: planetoid
        });
        //todo есть баг функция вавилона ставит 
        //в позицию меньшую чем это определенно в фаиле конфига.
        //Будет исправленно с добавлением функции анимации
        EM.GameCamera.Camera.zoomOn([planetoid], true);
    };




    function moveToMesh(targetMesh, endRadius, onAnimationEnd, animationTime, easingType) {
        if (!(onAnimationEnd instanceof Function)) onAnimationEnd = function () { };
        var source = EM.GameCamera.Camera.target.clone();
        var m2 = targetMesh.getAbsolutePivotPoint();     //var easing = new BABYLON.PowerEase(7);

        var cT;
        var easing = getEasingByType(easingType);

        var frames = 30;
        var time = animationTime || 1.5;
        var fps = frames / time;
        if (!Utils.CheckNullDistanceVector3(source, m2)) {
            cT = animationCameraTarget(source.clone(), m2.clone(), easing, frames, fps);
        }
        var cR = animationCameraRadius(endRadius, easing, frames, fps);
        function onStop() {
            _.remove(EM.GameCamera.Camera.animations, function (o) {
                return o === cT || o === cR;
            });

            cT = null;
            cR = null;
            onAnimationEnd();
        }
        EM.Scene.beginAnimation(EM.GameCamera.Camera, 0, frames, false, 1.0, onStop);
 

    }

    function moveToPlanetoid(targetMesh, endRadius, onAnimationEnd) {
        moveToMesh(targetMesh, endRadius, onAnimationEnd, 0.5, easingTypes.linear);
    };

    function moveToMother(targetMesh, endRadius, onAnimationEnd) {
        if (!!EM.GameLoader) {
            function animationDone() {
                onAnimationEnd();
                EM.GameLoader.Update("MotherJumped");
            }
            moveToMesh(targetMesh, endRadius, animationDone);
        } else moveToMesh(targetMesh, endRadius, onAnimationEnd,0.5);

    }

    //todo  на удаление?
    var sectorStarInfo = {};
    MapAnimation.SectorStarInfo = sectorStarInfo;


    MapAnimation.MoveToPlanetoid = moveToPlanetoid;
    MapAnimation.ZoomToPlanetoid = zoomToPlanetoid;
    MapAnimation.MoveToMother = moveToMother;
    MapAnimation.MoveToMesh = moveToMesh;
    MapAnimation.AnimationCameraTarget = animationCameraTarget;
    MapAnimation.AnimationCameraRadius = animationCameraRadius;


    MapAnimation._IAnimation = IAnimation;
    MapAnimation.EasingTypes = easingTypes;
})(EM.MapAnimation);
//#endregion

 
//todo  Пример активной анимации
/*
function MapAnimation() {
    var _scene = MapV.manage.engine.scenes[0];

    var _camera = _scene.activeCamera;

    function calculateFrames(fps, time) {
        return Math.ceil(fps * time);
    };

    function firstPartSectorZoom(mesh) {
        var durationRotateCamera = 0.1;
        var _fps = 25;
        var endFrame = calculateFrames(_fps, durationRotateCamera);

        //        var bezierEase = new BABYLON.BezierCurveEase(0, .9, 0, .92);
        //        var easingFunction = new BABYLON.CircleEase();

        var animation = new BABYLON.Animation("sectorAnimation", "target", _fps, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
        var keys = [];
        keys.push({
            frame: 0,
            value: _camera.target
        });
        keys.push({
            frame: endFrame,
            value: mesh.position
        });

        animation.setKeys(keys);

        //Then add the animation object to box1
        _camera.animations.push(animation);

        //Finally, launch animations on box1, from key 0 to key 100 with loop activated
        _scene.beginAnimation(_camera, 0, endFrame, false);
    }

    function secondPartSectorZoom() {
        var durationRangeCamera = 0.5;
        var _fps = 25;
        var endFrame = calculateFrames(_fps, durationRangeCamera);

        var animation = new BABYLON.Animation("sectorAnimation1", "radius", _fps, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
        var keys = [];
        keys.push({
            frame: 0,
            value: _camera.radius
        });
        keys.push({
            frame: endFrame,
            value: 1
        });

        animation.setKeys(keys);

        //Then add the animation object to box1
        _camera.animations.push(animation);

        //Finally, launch animations on box1, from key 0 to key 100 with loop activated
        _scene.beginAnimation(_camera, 0, endFrame, false);
    }

    this.sectorZoom = function(mesh) {

        MapV.animVars.isSectorZoom = true;


todo exemle baizer animation
        firstPartSectorZoom(mesh);

        setTimeout(function() {
            secondPartSectorZoom();
        }, 0.5);

        _camera.lowerRadiusLimit = 0.00001;
        _camera.upperRadiusLimit = 80;
    };

    this.sectorUnZoom = function(mesh) {

        MapV.animVars.isSectorZoom = false;

        var durationRotateCamera = 0.1;
        var _fps = 25;
        var endFrame = calculateFrames(_fps, durationRotateCamera);

        //        var bezierEase = new BABYLON.BezierCurveEase(0, .9, 0, .92);
        var easingFunction = new BABYLON.CircleEase();

        var animation = new BABYLON.Animation("sectorAnimation", "target", _fps, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
        var keys = [];
        keys.push({
            frame: 0,
            value: mesh.position
        });
        keys.push({
            frame: endFrame,
            value: sectorCameraPosition('get').position
        });

        animation.setKeys(keys);

        //Then add the animation object to box1
        _camera.animations.push(animation);

        //Finally, launch animations on box1, from key 0 to key 100 with loop activated
        _scene.beginAnimation(_camera, 0, endFrame, false);
    };
}*/



/**
 * @class  Director
 */
EM.SpaceState = {

    CurrentActiveSector: null,
    /**
     * System(meshId)   
     */
    CurrentActiveSystem: null,
    /**
     * @name Star
     * @var {mesh}
     */
    LastActiveStarSystem: null,
    NewTargetFlag: false,

    SetNewCoord: function (sectorId, systemId) {
        EM.SpaceState.CurrentActiveSector = sectorId;
        // EM.SpaceState.CurrentActiveSystem = systemId + EM.MapGeometry.SYSTEM_REAL_PROTONAME;
        EM.SpaceState.CurrentActiveSystem = systemId;
    },
    /**
     * @name SpacePosition  Director  состояний
     */
    SpacePosition: null
};

//#region SpacePosition
(function ($ss) {
    var visible = {};
    visible.sectorsIsvisible = false;
    visible.userPlanetState = false;
    function SpacePosition() {
        var instance;
        return function SpacePositionPrototype() {
            if (instance) return instance;
            //#region Declare 
            var $self = this;
            var inGalaxy = new $ss.GalaxyState(this);
            var inSector = new $ss.SectorState(this);
            var systemSelected = new $ss.ArroundSystemState(this);
            var inSystem = new $ss.SystemSelectedState(this);
            var planetoidSelected = new $ss.PlanetoidSelectedState(this);
            var inUserPlanet = new $ss.UserPlanetState(this);
            var inMother = new $ss.MotherState(this);

            var currState = inGalaxy;
            var currTarget = EM.MapGeometry.MapTypes.Galaxy;
            //#endregion

            //#region Set
            this.setState = function (state) {
                var curMother = EM.EstateGeometry.MotherModules.GetMotherGroupMesh();
                var csl = EM.EstateData.GetCurrentSpaceLocation();
                // console.log("____STATE____", csl);
                var galaxy = EM.MapGeometry.Galaxies.GetGalaxy(csl.GalaxyId);

                var isGalaxyState = state instanceof $ss.GalaxyState;
                var isMotherState = state instanceof $ss.MotherState;
                var isPlanetoidSelectedState = state instanceof $ss.PlanetoidSelectedState;
                var isSystemSelectedState = state instanceof $ss.SystemSelectedState;
                var isUserPlanetState = state instanceof $ss.UserPlanetState;
                var isSectorState = state instanceof $ss.SectorState;

                //  console.log("____STATE____", state);
                if (isMotherState) {
                    EM.EstateGeometry.MotherModules.InMother();
                }
                else if (isPlanetoidSelectedState || isSystemSelectedState) {

                    GameServices.controlPanelSwicherHelper.setMap();
                    if (EM.MapGeometry.GetUniqueIdFromAny(EM.SpaceState.CurrentActiveSystem) === EM.EstateData.GetMotherLocation().SystemId) {
                        EM.EstateGeometry.MotherModules.ArroundMother();
                    }
                    else EM.EstateGeometry.MotherModules.HideMother();
                }

                else if (isGalaxyState) EM.MapGeometry.Galaxies.SetVisible(true);
                else if (isSectorState) visible.sectorsIsvisible = true;
                //#region isUserPlanetState  and  StarLight 
                if (isUserPlanetState) {
                    visible.userPlanetState = true;
                    EM.EstateGeometry.PlanetModules.InPlanet();
                    EM.StarLight.SetInPlanet();
                }
                else if (isMotherState || isPlanetoidSelectedState || isSystemSelectedState) {
                    EM.GameCamera.System.$newSystemId = csl.SystemId;
                    EM.StarLight.SetInSystem();
                }
                else EM.StarLight.SetOther();

                if (curMother.isVisible) {
                    if (isMotherState || isPlanetoidSelectedState || isSystemSelectedState) { }
                    else EM.EstateGeometry.MotherModules.HideMother();
                }
                //#endregion

                if (visible.userPlanetState && !isUserPlanetState) {
                    EM.EstateGeometry.PlanetModules.HidePlanet();
                    visible.userPlanetState = false;
                }
                if (galaxy.isVisible && !isGalaxyState) EM.MapGeometry.Galaxies.SetVisible(false);
                if (visible.sectorsIsvisible && !isSectorState) {
                    EM.MapGeometry.Systems.SetVisible(false);
                    visible.sectorsIsvisible = false;
                }

                if (GameServices.controlDiskHelper.hide) {
                    GameServices.controlDiskHelper.hide();
                }


                currState = state;
            };

            this.setTarget = function (target) {
                if (target === currTarget) EM.SpaceState.NewTargetFlag = false;
                else EM.SpaceState.NewTargetFlag = true;
                currTarget = target;
            };

            //#region blocked
            function getBlockedState() {
                return EM.SpacePositionBlocked;
            }

            function setBlockedState(val, ignore) {
                //                console.log("setBlockedState", {
                //                    val: val,
                //                    "EM.SpacePositionBlocked": EM.SpacePositionBlocked
                //                });
                if (!ignore) EM.SpacePositionBlocked = val;
                else EM.SpacePositionBlocked = false;
            }

            //#endregion

            function stateChanger(action, ignore) {
                if (getBlockedState() && !ignore) return;
                setBlockedState(true, ignore);
                GameServices.planshetService.close();

                function onComplete() {
                    setBlockedState(false);
                }

                if (action instanceof Function) action(onComplete);
                else onComplete();

            }

            this.stateChanger = stateChanger;
            this.setBlockedState = setBlockedState;
            this.getBlockedState = getBlockedState;
            //#endregion

            //#region Check
            this.isNewTarget = function () {
                return EM.SpaceState.NewTargetFlag;
            };
            //#endregion

            //#region Get
            this.getCurrentState = function () {
                return currState;
            };

            this.getMesh = function () {
                var _id = null;
                if (!currTarget) return null;
                else if (typeof currTarget === "object") {
                    if (currTarget.hasOwnProperty("_scene")) return currTarget;
                    if (currTarget.hasOwnProperty("id")) _id = currTarget.id;
                }
                else if (typeof currTarget === "string") _id = currTarget;
                else {
                    console.log("SpacePositionPrototype.getMesh mesh type not impl", {
                        currTarget: currTarget
                    });
                    return null;
                }

                if (Utils.IsNotEmptyString(_id)) return EM.GetMesh(_id);
                return null;

            };

            this.getGalaxyState = function () {
                return inGalaxy;
            };

            this.getSectorState = function () {
                return inSector;
            };

            this.getArroundSystemState = function () {
                return systemSelected;
            };

            this.getSystemSelectedState = function () {
                return inSystem;
            };

            this.getPlanetoidSelectedState = function () {
                return planetoidSelected;
            };

            this.getUserPlanetState = function () {
                return inUserPlanet;
            };

            this.getMotherState = function () {
                return inMother;
            };

            //#endregion

            //#region click Actions in concrete state

            function abstractTargetClick(action, target) {
                if (getBlockedState()) return;
                $self.setTarget(target);
                action();
            }

            this.clickByBtnGalaxy = function (target, galaxyId) {
                abstractTargetClick(function () {
                    currState.clickByBtnGalaxy(galaxyId);
                }, target);

            };

            this.clickByBtnSystem = function (target, coord) {
                abstractTargetClick(function () {
                    currState.clickByBtnSystem(coord);
                }, target);
            };

            this.clickBySpace = function (target) {

                if (getBlockedState()) return;
                abstractTargetClick(function () {
                    currState.clickBySpace();
                }, target);
            };

            this.clickBySector = function (target) {
                abstractTargetClick(function () {
                    currState.clickBySector();
                }, target);
            };

            this.clickBySystem = function (target) {
                abstractTargetClick(function () {
                    currState.clickBySystem();
                }, target);
            };

            this.clickByPlanetoid = function (target) {
                abstractTargetClick(function () {
                    currState.clickByPlanetoid();
                }, target);
            };

            this.clickByUserPlanet = function () {
                currState.clickByUserPlanet();
            };

            this.clickByBtnMapToggle = function (target) {
                abstractTargetClick(function () {
                    currState.clickByBtnMapToggle();
                }, target);
            };
            this.clickByMother = function (target) {
                abstractTargetClick(function () {
                    currState.clickByMother();
                }, target);
            }; //#endregion

            //#region  Others methods
            this.disposeLastSystem = function () {
                EM.MapGeometry.System.Destroy();
            };
            //#endregion

            //#region  instance  
            if (this.constructor === SpacePositionPrototype) {
                instance = this;
                return instance;
            } else {
                console.log("new SpacePositionPrototype");
                return new SpacePositionPrototype();
            };
            //#endregion
        };
    }

    $ss.SpacePosition = SpacePosition();
})(EM.SpaceState);

//#endregion

//#region States

//ISpacePositionState
(function ($ss) {
    function ISpacePositionState(director) {
        this._director = director;
    }
 
    ISpacePositionState.prototype.clickByBtnGalaxy = function (galaxyId) {
        var director = this._director;
        director.stateChanger(function (onComplete) {
            EM.Audio.GameSounds.onMoveToPlanetoid.play(); 
            function destroyLastSystem() {
                EM.MapGeometry.System.Destroy();
                EM.SpaceState.CurrentActiveSystem = null;
                EM.SpaceState.NewTargetFlag = false;
            };
            // set visible state for cube of sectors
            EM.MapGeometry.Sectors.SetUnselected();
            EM.GameCamera.SetGalaxy(galaxyId);
            destroyLastSystem();

            GameServices.mapControlHelper.setState("GalaxyState");
            director.setState(director.getGalaxyState());

            var csl = EM.EstateData.GetCurrentSpaceLocation();
            var sectorId = csl.SectorId;
 

            var activeMesh = EM.MapGeometry.Sectors.GetMeshBySectorNumId(sectorId);
            console.log("activeMesh", { activeMesh: activeMesh, activeMeshId: activeMesh.id, sectorId: sectorId});
            if (activeMesh) {
                EM.MapEvent.SectorLeftClick(activeMesh);
            }
            EM.Audio.GameSounds.onMoveToPlanetoid.play();
            onComplete();
        });

    };

    ISpacePositionState.prototype.clickByBtnSystem = function (coord) {
        // start building of system
        var director = this._director;
        var $self = this;

        director.stateChanger(function (onComplete) {
            // set unvisible state for cube of sectors
            $self.setSystemsVisible(false);

            // start building of system
            director.setState(director.getSystemSelectedState());

            //director.setBlockedState(true);
            var mesh = director.getMesh();
            //   console.log("clickByBtnSystem", mesh);
            // set camera in system position
            EM.GameCamera.SetSystemSelected(mesh.position);

            //  director.getMesh();




            onComplete();
        });
    };

    ISpacePositionState.prototype.clickBySpace = function () {
        // console.log("ISpacePositionState.prototype.clickBySpace");
        // console.log("itionState.prototype.clickByS");
        var director = this._director;
        //if (director.getBlockedState()) return;

        director.stateChanger(function (onComplete) {
            onComplete();
        });
    };

    ISpacePositionState.prototype.clickBySector = function () {
        // console.log("ISpacePositionState.prototype.clickBySector");
        var $self = this;
        var director = this._director;
        director.stateChanger(function (onComplete) {
            var clickBySectorChangeState = {};
            function update(subscribeName) {
                if (subscribeName === EM.MapBuilder.Systems.SubscribeName) {
                    EM.MapBuilder.Systems.Observer.Unsubscribe(clickBySectorChangeState);
                    $self.setSystemsVisible(true);
                    director.disposeLastSystem();
                    EM.GameCamera.SetSystems();
                    GameServices.mapControlHelper.setSectorState();
                    onComplete();
                }

            }
            clickBySectorChangeState.Update = update;
            EM.MapBuilder.Systems.Observer.Subscribe(clickBySectorChangeState);
            EM.MapBuilder.Systems.Build();
            director.setState(director.getSectorState());
        });
    };

    ISpacePositionState.prototype.clickBySystem = function () {
        var director = this._director;
        director.stateChanger(function (onComplete) {
            onComplete();
        });
    };

    ISpacePositionState.prototype.clickByPlanetoid = function () {
        var $self = this;
        var director = $self._director;
        var ar = EM.AssetRepository;
        director.stateChanger(function (onComplete) {
            // $self.setSystemsVisible(false);
            var target = director.getMesh();
            if (director.isNewTarget()) {

                var _meshInfoKey = ar.MESH_INFO_KEY;
                var localsKey = ar.MESH_LOCALS_KEY;

                // var meshInfo = ar.GetMeshInfoFromMeshOrMeshId(target.id);
                if (!target.hasOwnProperty(localsKey)) throw Errors.ClientNullReferenceException({ target: target }, "target<mesh>");
                var locals = target[localsKey];
                var meshInfo = locals[_meshInfoKey];
                if (!meshInfo.HasUniqueId) throw Errors.ClientNullReferenceException({ meshInfo: meshInfo, target: target }, "meshInfo.HasUniqueId", "ISpacePositionState.prototype.clickByPlanetoid");

                var uniqueId = meshInfo.UniqueId;
                var mapTypeItem = meshInfo.GetMapType();
                var mapType = mapTypeItem.MapType;

                var targetStarId = locals._serverData.SystemId;
                var targetIsStar = false;
                if (mapType === EM.MapGeometry.MapTypes.Star) {
                    targetIsStar = true;
                    EM.EstateData.SetSpaceLocationFromSystemId(uniqueId);
                    GameServices.mapControlHelper.setStarState();

                } else if (mapType === EM.MapGeometry.MapTypes.Planet) {

                    EM.EstateData.SetSpaceLocationFromPlanetId(uniqueId);
                    GameServices.mapControlHelper.setPlanetoidState();
                }
                else if (mapType === EM.MapGeometry.MapTypes.Satellite && mapTypeItem.SubMapType === EM.MapGeometry.MapTypes.Moon) {
                    EM.EstateData.SetSpaceLocationFromMoonId(uniqueId);
                    GameServices.mapControlHelper.setPlanetoidState();
                }


                var camRadiusKey = EM.MapGeometry.System.PLANETOID_MIN_CAMERA_RADIUS_KEY;
                var endRadius = locals[camRadiusKey];
                var radius = EM.GameCamera.SetAndGetNewLowerRadiusLimit(_.ceil(endRadius));
                EM.GameCamera.System.lowerRadiusLimit = radius;
                var fromStateName = null;
                if (targetIsStar) {
                    radius = EM.GameCamera.System.$setOnBeforeAnimationParams();
                }
                else {
                    var csl = EM.EstateData.GetCurrentSpaceLocation();
                    var isCurrentSystem = csl.SystemId === targetStarId;
                    var state = director.getCurrentState();
                    var isPlanetoidState = state instanceof $ss.PlanetoidSelectedState;
                    if (isCurrentSystem && isPlanetoidState) {
                        fromStateName = "PlanetoidSelectedState";
                    } else {
                        var isGalaxyState = state instanceof $ss.GalaxyState;
                        
                    }

                }
                EM.MapAnimation.MoveToPlanetoid(target, radius, function () {
                    director.setState(director.getPlanetoidSelectedState());
                    if (mapType === EM.MapGeometry.MapTypes.Star) {
                        director.setState(director.getSystemSelectedState());
                    } else {
                        director.setState(director.getPlanetoidSelectedState());
                    }
                    EM.GameCamera.SetSystemSelected(target.getAbsolutePosition(), fromStateName, targetStarId);
                    onComplete();
                });
            } onComplete();

        });
    };

    ISpacePositionState.prototype.clickByUserPlanet = function () {
        var $self = this;
        var director = $self._director;
        director.stateChanger(function (onComplete) {
            EM.MapGeometry.Systems.Destroy();
            EM.EstateBuilder.UserPlanetBuilder.SetPlanetEnv();
            EM.GameCamera.SetInUserPlanet();
            GameServices.mapControlHelper.setUserPlanetState();
            $self.setSystemsVisible(false);
            director.setState(director.getUserPlanetState());
            GameServices.estateService.getFullEstate(EM.EstateData.GetPlanetLocation().PlanetId);
            GameServices.controlPanelSwicherHelper.setHangar();
            onComplete();
        });

    };

    ISpacePositionState.prototype.clickByMother = function () {
        var $self = this;
        var director = $self._director;
        director.stateChanger(function (onComplete) {
            EM.Audio.GameSounds.onMoveToPlanetoid.play(); 
          
            var currentState = director.getCurrentState();
            //console.log("clickByMother currentState", { currentState: currentState });
            if (currentState instanceof $ss.MotherState) {
                onComplete();
                //console.log("clickByMother onComplete");
                return;
            }
            if (currentState instanceof $ss.SectorState || currentState instanceof $ss.ArroundSystemState) {
                $self.setSystemsVisible(false);
            }
            director.setState(director.getMotherState());
            GameServices.estateService.getFullEstate(0);
            GameServices.mapControlHelper.setMotherState();
            GameServices.controlPanelSwicherHelper.setHangar();
           // console.log("EM.GameCamera.Mother.radius", EM.GameCamera.Mother.radius);
            if (currentState instanceof $ss.UserPlanetState) {
                EM.GameCamera.SetMotherSelected(true);
                onComplete();
            } else {
                EM.MapAnimation.MoveToMother(EM.GetMotherMesh(), EM.GameCamera.Mother.radius, function () {
                    EM.GameCamera.SetMotherSelected(true);
                    onComplete();
                });
            }
    
        });

    };

    ISpacePositionState.prototype.clickByBtnMapToggle = function () {
        //console.log("ISpacePositionState.prototype.clickByBtnMapToggle");
        var director = this._director;
        director.stateChanger(function (onComplete) {
            onComplete();
        });
    };

    ISpacePositionState.prototype.Update = function (name) {
        //  console.log("ISpacePositionState.prototype.Update", name);
        var director = this._director;
        director.stateChanger(function (onComplete) {
            onComplete();
        });

    };

    ISpacePositionState.prototype.setSystemsVisible = EM.MapGeometry.Systems.SetVisible;
    EM.SpaceState.ISpacePositionState = ISpacePositionState;
})(EM.SpaceState);


(function ($ss) {
    var ISpacePositionState = $ss.ISpacePositionState;
    //#region Galaxy state
    function GalaxyState() {
        ISpacePositionState.apply(this, arguments);
    }
    GalaxyState.prototype = Object.create($ss.ISpacePositionState.prototype);
    GalaxyState.prototype.constructor = GalaxyState;
    $ss.GalaxyState = GalaxyState;
    //#endregion

    //#region Sector state
    function SectorState() {
        var ar = EM.AssetRepository;
        ISpacePositionState.apply(this, arguments);

        var $self = this;
        var director = $self._director;

        function clickBySystem(onComplete) {
            var systemSpriteNodeMesh = director.getMesh();
            var iSystemSpriteData = ar.GetLocalsFromMesh(systemSpriteNodeMesh, ar.SERVER_DATA_KEY);
            var systemId = iSystemSpriteData.Id;
            EM.SpaceState.CurrentActiveSystem = systemId;
            EM.EstateData.SetSpaceLocationFromSystemId(systemId);
            GameServices.mapControlHelper.setSystemState();
            //MapControl.SetState("SystemState");

            EM.MapBuilder.System.Build();
            EM.MapGeometry.Systems.SetVisible(false);
            EM.GameCamera.System.$setOnBeforeAnimationParams();
            EM.MapAnimation.MoveToMesh(systemSpriteNodeMesh, EM.GameCamera.System.radius, function () {
                EM.GameCamera.System.$setOnEndAnimationParams();
                director.setState(director.getSystemSelectedState());
                EM.GameCamera.SetSystemSelected(director.getMesh().position);
                $self.setSystemsVisible(false);
                onComplete();
            });
        }

        this.clickBySystem = function () {
            director.stateChanger(clickBySystem);
        };
    }

    SectorState.prototype = Object.create(ISpacePositionState.prototype);
    SectorState.prototype.constructor = SectorState;
    $ss.SectorState = SectorState;

    //#endregion


    //#region ArroundSystemState
    function ArroundSystemState() {

        ISpacePositionState.apply(this, arguments);

        var $self = this;
        var director = $self._director;

        function clickBySpace(onComplete) {
            console.log("ArroundSystemState.clickBySpace");
            director.disposeLastSystem();

            director.setState(director.getSectorState());

            EM.GameCamera.SetSystems();
            onComplete();
        }

        function clickBySystem(onComplete) {
            console.log("ArroundSystemState.clickBySystem");
            //        if (director.isNewTarget()) {
            var targetMesh = director.getMesh();
            EM.SpaceState.CurrentActiveSystem = targetMesh.id;
            EM.MapBuilder.System.Build();

            EM.MapAnimation.MoveToMesh(director.getMesh(), EM.GameCamera.System.radius, function () {
                director.setState(director.getSystemSelectedState());
                EM.GameCamera.SetSystemSelected(director.getMesh().position);
                $self.setSystemsVisible(false);
                onComplete();
            });
        }

        this.clickBySpace = function () {
            director.stateChanger(clickBySpace);
        };
        this.clickBySystem = function () {
            director.stateChanger(clickBySystem);
        };
    }

    ArroundSystemState.prototype = Object.create(ISpacePositionState.prototype);
    ArroundSystemState.prototype.constructor = ArroundSystemState;
    $ss.ArroundSystemState = ArroundSystemState;
    //#endregion


    //#region  SystemSelectedState
    function SystemSelectedState() {
        ISpacePositionState.apply(this, arguments);
        var $self = this;

        var director = this._director;

        function clickBySpace(onComplete) {
 
            var changeState = {
                Update: function (subscriber) {
                    EM.Audio.GameSounds.onSpaceMoveToSystemPoint.play();
                    if (subscriber === EM.MapBuilder.Systems.SubscribeName) {
                        var csl = EM.EstateData.GetCurrentSpaceLocation();
                        EM.EstateData.SetSpaceLocationFromSectorId(csl.SectorId);
                        EM.MapBuilder.Systems.Observer.Unsubscribe(changeState);

                        var curSystemSpriteMesh = EM.MapGeometry.Systems.GetSpriteMeshByStarId(EM.SpaceState.CurrentActiveSystem);
                        GameServices.mapControlHelper.setSectorState();
                        EM.GameCamera.SetSystems();
                        EM.MapAnimation.MoveToMesh(curSystemSpriteMesh, EM.GameCamera.Systems.radius, function () {
                            director.setBlockedState(false);
                            director.setState(director.getSectorState());
                            director.setBlockedState(true);
                            $self.setSystemsVisible(true);
                            director.setTarget(curSystemSpriteMesh.id);
                            director.disposeLastSystem();
                            EM.GameCamera.System.$newSystemId = null;
                            onComplete();
                        });
                    }

                }
            };
            EM.MapBuilder.Systems.Observer.Subscribe(changeState);
            EM.MapBuilder.Systems.Build();

            ////console.log("EM.SpaceState", SpaceState.CurrentActiveSystem);
            //if (!EM.GetMesh(EM.SpaceState.CurrentActiveSystem)) {
            //     EM.MapBuilder.Systems.Observer.Subscribe(changeState);
            //    EM.MapBuilder.Systems.Build();

            //} else changeState.Update();
        }

        this.clickBySpace = function () {
            director.stateChanger(clickBySpace);
        };
    }

    SystemSelectedState.prototype = Object.create(ISpacePositionState.prototype);
    SystemSelectedState.prototype.constructor = SystemSelectedState;
    $ss.SystemSelectedState = SystemSelectedState;

    //#endregion


    //#region Palanetoid selected state

    function PlanetoidSelectedState() {
        ISpacePositionState.apply(this, arguments);
      //  console.log("PlanetoidSelectedState");

        var director = this._director;
        function clickBySpace(onComplete) {
            EM.Audio.GameSounds.onMoveToPlanetoid.play();
            var csl = EM.EstateData.GetCurrentSpaceLocation();
            EM.EstateData.SetSpaceLocationFromSystemId(csl.SystemId);
            director.setState(director.getSystemSelectedState());
            GameServices.mapControlHelper.setSystemState();
            var lastSystem = EM.GetMesh(EM.SpaceState.LastActiveStarSystem);
            GameServices.controlPanelSwicherHelper.setMap();
            EM.GameCamera.System.$setOnBeforeAnimationParams();
            EM.MapAnimation.MoveToPlanetoid(lastSystem, EM.GameCamera.System.radius, function () {
                EM.GameCamera.System.$setOnEndAnimationParams();
                EM.GameCamera.SetSystemSelected(lastSystem.position, "PlanetoidSelectedState", csl.SystemId);
                onComplete();
            });

        }

        this.clickBySpace = function () {
            director.stateChanger(clickBySpace);
        };
    }

    PlanetoidSelectedState.prototype = Object.create(ISpacePositionState.prototype);
    PlanetoidSelectedState.prototype.constructor = PlanetoidSelectedState;
    $ss.PlanetoidSelectedState = PlanetoidSelectedState;

    //#endregion


    //#region UserPlanetState
    function UserPlanetState() {
        ISpacePositionState.apply(this, arguments);
        var director = this._director;

        function clickBySpace(onComplete) { onComplete() }

        this.clickBySpace = function () {
            director.stateChanger(clickBySpace);
        };
    }

    UserPlanetState.prototype = Object.create(ISpacePositionState.prototype);
    UserPlanetState.prototype.constructor = UserPlanetState;
    $ss.UserPlanetState = UserPlanetState;

    //#endregion


    //#region MotherState
    function MotherState() {
        ISpacePositionState.apply(this, arguments);
        var director = this._director;

        var ar = EM.AssetRepository;
        var camRadiusKey = EM.MapGeometry.System.PLANETOID_MIN_CAMERA_RADIUS_KEY;

        function clickBySpace(onComplete) {
            EM.Audio.GameSounds.onMoveToPlanetoid.play();
            var lastSystem = EM.GetMesh(EM.SpaceState.LastActiveStarSystem);
            var minCameraRadius = ar.GetLocalsFromMesh(lastSystem, camRadiusKey);


            var csl = EM.EstateData.GetCurrentSpaceLocation();
            EM.EstateData.SetSpaceLocationFromSystemId(csl.SystemId);
            director.setState(director.getSystemSelectedState());
            GameServices.mapControlHelper.setSystemState();
            GameServices.controlPanelSwicherHelper.setMap();

            EM.GameCamera.SetAndGetNewLowerRadiusLimit(minCameraRadius);
            var absPosition = lastSystem.getAbsolutePosition().clone();
            EM.GameCamera.System.$setOnBeforeAnimationParams();

            EM.MapAnimation.MoveToPlanetoid(lastSystem, EM.GameCamera.System.radius, function () {
                EM.GameCamera.System.$setOnEndAnimationParams(minCameraRadius);
                EM.GameCamera.SetSystemSelected(absPosition, null, csl.SystemId);

                onComplete();
            });
        }

        this.clickBySpace = function () {
            director.stateChanger(clickBySpace);
        };
    }

    MotherState.prototype = Object.create(ISpacePositionState.prototype);
    MotherState.prototype.constructor = MotherState;
    $ss.MotherState = MotherState;
    //#endregion


})(EM.SpaceState);


//#endregion




EM.MapEvent = {};
(function (MapEvent) {

    //MapEvent.SceneIsMoved = false;
    MapEvent.HoveredPlanetoid = null;
    var ar = EM.AssetRepository;
    var _mapItemKey = ar.MAP_ITEM_KEY;
    var _textyreTypeIdKey = ar.TEXTURE_TYPE_ID_KEY;
    var _serverDataKey = ar.SERVER_DATA_KEY;
    var _sounds = EM.Audio.GameSounds;

    MapEvent.HideContextMenu = function () {
        GameServices.controlDiskHelper.hide();
    };
    MapEvent.ShowContextMenu = function (event) {
        MapEvent.HideContextMenu();
        GameServices.controlDiskHelper.show(event);
    };


    //#region Sector

    var lastSectorClickMeshId;

    function _checkMeshTypeFromSector(mesh) {
        var meshType = ar.CreateMeshArgumentType(mesh);
        if (!meshType.IsMesh) throw Errors.ClientTypeErrorException({
            event: event,
            asNew: asNew,
            meshType: meshType,
        }, mesh, "object||BABYLON.Mesh", "!MapEvent.sectorClick.meshType.IsMesh");
        else {
            meshType = null;
        }

    }
    MapEvent.SectorLeftClick = function (mesh, event) {
        if (!mesh) {
            return;
        }
        _checkMeshTypeFromSector(mesh);
        var clickMaterial = EM.MapGeometry.Sectors.Materials.GetClick();
        if (lastSectorClickMeshId && mesh.id !== lastSectorClickMeshId) {
            var lastMesh = EM.GetMesh(lastSectorClickMeshId);
            var data = ar.GetLocalsFromMesh(lastMesh, _serverDataKey);
            if (data) {
                var regularMaterial = EM.MapGeometry.Sectors.Materials.GetRegular();
                if (regularMaterial.id !== mesh.material.id) {
                    lastMesh.material = regularMaterial;
                }
            }

        }
        lastSectorClickMeshId = mesh.id;

        if (clickMaterial.id !== mesh.material.id) {
            mesh.material = clickMaterial;
        }

    };
    MapEvent.SectorDoubleClick = function (mesh, event) {
        _checkMeshTypeFromSector(mesh);
        console.log("sectorClick", mesh);
        var meshData = ar.GetLocalsFromMesh(mesh, _serverDataKey);
        var sectorId = meshData.SectorId;
        MapEvent.SectorProgrammClick(sectorId);
        lastSectorClickMeshId = null;
        return;
    };
    MapEvent.RegisterSectorActions = function (sectorMesh) {
        var options = MapEvent.IMapEventItemOption(sectorMesh);
        options.rightClick = function (mesh, event) {
            MapEvent.ShowContextMenu(event);
        };
        options.leftClick = MapEvent.SectorLeftClick;
        options.doubleClick = MapEvent.SectorDoubleClick;
        options.hovered = function (mesh, event) {
            if (!mesh) {
                return;
            }
            _sounds.onSpaceObjectHoveredIn.play();
            var hover = EM.MapGeometry.Sectors.Materials.GetHover();
            if (mesh.material.id !== hover.id) {
                mesh.material = hover;
            }

        };
        options.unHovered = function (mesh, event) {
            if (!mesh) {
                return;
            }
            var regularMaterial = EM.MapGeometry.Sectors.Materials.GetRegular();
            var clickMaterial = EM.MapGeometry.Sectors.Materials.GetClick();
            if (lastSectorClickMeshId) {
                if (mesh.id === lastSectorClickMeshId) {
                    mesh.material = clickMaterial;
                } else if (mesh.material && mesh.material.id !== regularMaterial.id) {
                    mesh.material = regularMaterial;
                }
            } else {
                mesh.material = regularMaterial;
            }
            MapEvent.HideContextMenu();
        };
        MapEvent.RegisterFactoryAction(options);
    };
    MapEvent.SectorProgrammClick = function (sectorId) {
        EM.SpaceState.CurrentActiveSector = sectorId;
        EM.Audio.GameSounds.onSpaceMoveToSystemPoint.play();
        EM.EstateData.SetSpaceLocationFromSectorId(sectorId);
        GameServices.mapControlHelper.jumpToSector();
    };
    //#endregion

    //#region Systems
    var lastHoveredSystems = {};
    var ignoreResetHoverSystemsId;
    MapEvent.SystemsLeftClick = function (systemCloneMesh, event) {
        //move to around system 
        if (EM.SpacePositionBlocked || !systemCloneMesh || !systemCloneMesh.getAbsolutePosition) return;
        var ct = EM.GameCamera.Camera.target;
        var absMeshPosition = systemCloneMesh.getAbsolutePosition();
        if (ct.equals(absMeshPosition)) return;

        MapEvent._systemsHover(systemCloneMesh);
        ignoreResetHoverSystemsId = systemCloneMesh.id;
        var sp = new EM.SpaceState.SpacePosition();
        sp.setBlockedState(true);
        _sounds.onSpaceMoveToSystemPoint.play();
        EM.MapAnimation.MoveToMesh(systemCloneMesh, EM.GameCamera.ArroundSystem.radius, function () {
            sp.setBlockedState(false);

        }, 0.5, EM.MapAnimation.EasingTypes.linear);

    };

    MapEvent.SystemsDoubleClick = function (systemCloneMesh, event) {
        //console.log("systemsDoubleClick", {
        //    event: event,
        //    systemCloneMesh: systemCloneMesh
        //});

        _sounds.onSpaceMoveToSystemPoint.stop();
        _sounds.onSpaceJumpToSystemStart.play();
        //sprite.id === spriteNodeMeshId
        var systemMeshId = systemCloneMesh.id;
        var iSystemSpriteData = ar.GetLocalsFromMesh(systemCloneMesh, ar.SERVER_DATA_KEY);
        var systemId = iSystemSpriteData.Id;
        EM.SpaceState.CurrentActiveSystem = systemId;
        //console.log("systemsClick", {
        //    event: event,
        //    sprite: systemCloneMesh,
        //    iSystemSpriteData: iSystemSpriteData,
        //    systemId: systemId,
        //});
        var sp = new EM.SpaceState.SpacePosition();
        sp.clickBySystem(systemCloneMesh);
        MapEvent.HideContextMenu();
    };
    MapEvent._systemsHover = function (systemCloneMesh) {
        _sounds.onSpaceObjectHoveredIn.play();
        _.forEach(lastHoveredSystems, function (lastHoveredSystem, key) {
            MapEvent._systemsOut(lastHoveredSystem, null);
        });
        // systemCloneMesh.material.alpha = 1;
        if (systemCloneMesh.material && systemCloneMesh.material.emissiveTexture) {
            systemCloneMesh.material.emissiveTexture.level = 1.3;
        }
        lastHoveredSystems[systemCloneMesh.id] = systemCloneMesh;
    };
    MapEvent._systemsOut = function (systemCloneMesh, event) {
        if (systemCloneMesh.id === ignoreResetHoverSystemsId) return;
        if (systemCloneMesh.material && systemCloneMesh.material.emissiveTexture) {
            systemCloneMesh.material.emissiveTexture.level = 0.95;
        }
        if (lastHoveredSystems[systemCloneMesh.id]) delete lastHoveredSystems[systemCloneMesh.id];
    };
    MapEvent.RegisterSystemsActions = function (systemCloneMesh) {
        var options = MapEvent.IMapEventItemOption(systemCloneMesh);
        options.leftClick = MapEvent.SystemsLeftClick;
        options.rightClick = function (mesh, event) {
            MapEvent.ShowContextMenu(event);
        };
        options.doubleClick = MapEvent.SystemsDoubleClick;
        options.hovered = MapEvent._systemsHover;
        options.unHovered = MapEvent._systemsOut;
        MapEvent.RegisterFactoryAction(options);
    };
    //#endregion

    //#region Planetoid



    MapEvent.PlanetoidDubleClick = function (meshOrMeshId, event, isMeshId) {
        var meshId;
        if (isMeshId) {
            meshId = meshOrMeshId;
        }
        else {
            meshId = meshOrMeshId.id;
        }
       // console.log("PlanetoidDubleClick", { meshOrMeshId: meshOrMeshId, meshId: meshId});
        if (!meshId) return;

        MapEvent.HideContextMenu();
        var sp = new EM.SpaceState.SpacePosition();
        sp.clickByPlanetoid(meshId);
        _sounds.onMoveToPlanetoid.play();
    };


    MapEvent.RegisterPlanetoidActions = function (planetoidMesh) {
        var options = MapEvent.IMapEventItemOption(planetoidMesh);
        options.hovered = function () {
            _sounds.onSpaceObjectHoveredIn.play();
        }
        options.rightClick = function (mesh, event) {
            MapEvent.ShowContextMenu(event);
        };
        options.doubleClick = MapEvent.PlanetoidDubleClick;
        MapEvent.RegisterFactoryAction(options);
    };

    //#endregion 


    //#region Common
    MapEvent.InitSceneEvents = function (activeWorldMesh) {
        EM.Scene.hoverCursor = " default ";
        MapEvent.AddExecuteCodeAction(activeWorldMesh, BABYLON.ActionManager.OnPickTrigger, function (mesh, event) {
 
            MapEvent.HideContextMenu();
        });

        var rotateOptions = {
            beginRotate: false,
            beginAlpha: 0,
            beginBeta: 0,
            $timeout: null,
            loop: true
        };

        function onStartRotation(alpha, beta) {
            rotateOptions.beginRotate = true;
            rotateOptions.beginAlpha = alpha;
            rotateOptions.beginBeta = beta;
            if (!_sounds.onSpaceRotate.isPlaying) {
                _sounds.onSpaceRotate.loop = rotateOptions.loop;
                _sounds.onSpaceRotate.play();
            }

        }

        function onStopRotation() {
            clearTimeout(rotateOptions.$timeout);
            rotateOptions.beginRotate = false;
            // _sounds.onSpaceRotate.loop = false;
            setTimeout(function () {
                _sounds.onSpaceRotate.stop();
            }, 100);
        }
        MapEvent.AddExecuteCodeAction(activeWorldMesh, BABYLON.ActionManager.OnPickDownTrigger, function (mesh, event) {
            if (EM.EstateData.GetCurrentEstate().EstateType) {
                if (rotateOptions.$timeout) {
                    onStopRotation();
                }
                return;
            }
            rotateOptions.beginBeta = EM.GameCamera.Camera.beta;
            rotateOptions.beginAlpha = EM.GameCamera.Camera.alpha;
            if (!rotateOptions.beginRotate) {
                rotateOptions.$timeout = setTimeout(function () {
                    if (!rotateOptions.beginRotate && rotateOptions.beginAlpha !== EM.GameCamera.Camera.alpha || rotateOptions.beginBeta !== EM.GameCamera.Camera.beta) {
                        onStartRotation(EM.GameCamera.Camera.alpha, EM.GameCamera.Camera.beta);
                    }
                }, 150);
            }
        });
        MapEvent.AddExecuteCodeAction(activeWorldMesh, BABYLON.ActionManager.OnPickUpTrigger, function (mesh, event) {

            if (rotateOptions.$timeout) {
                onStopRotation();
            }
        });

        MapEvent.AddExecuteCodeAction(activeWorldMesh, BABYLON.ActionManager.OnDoublePickTrigger, function (mesh, event) {
            MapEvent.HideContextMenu();
            EM.Scene.hoverCursor = " default ";
            var sp = new EM.SpaceState.SpacePosition();
            sp.clickBySpace(activeWorldMesh.id);
        });
        // BABYLON.ActionManager.OnLongPressTrigger

        //BABYLON.ActionManager.OnPointerOverTrigger
        //BABYLON.ActionManager.OnPointerOutTrigger


        var zoomOpts = {
            timer: null,
            inProgress: false,
            loop: true
        };
        function onStopZoomTimer() {
            console.log('onStopZoomTimer',
                {
                    onSpaceScroll: EM.Audio.GameSounds.onSpaceScroll
                });
            zoomOpts.timer = null;
            _sounds.onSpaceScroll.stop();
            zoomOpts.inProgress = false;
            console.log('onStopZoomTimer');
            return false;

        }

        var lastTime = 0;
        function continuationTimer() {
            var curTime = Date.now();
            if (!zoomOpts.timer) {
                lastTime = curTime;
                zoomOpts.timer = setTimeout(onStopZoomTimer, 300);
            } else if (curTime - lastTime > 20 && zoomOpts.timer) {
                if (zoomOpts.timer) {
                    clearTimeout(zoomOpts.timer);
                    //zoomOpts.timer = null;
                    lastTime = curTime;
                    zoomOpts.timer = setTimeout(onStopZoomTimer, 300);
                }
            }
        }

        function onStartZoomTimer() {
            zoomOpts.inProgress = true;
            if (_sounds.onSpaceScroll.loop !== rotateOptions.loop) {
                _sounds.onSpaceScroll.loop = rotateOptions.loop;
            }
            if (!_sounds.onSpaceScroll.isPlaying) {
                _sounds.onSpaceScroll.play();
            } else {
                continuationTimer();
            }
        }

        EM.Scene.onPrePointerObservable.add(function (pointerInfo, eventState) {
            return;
            if (pointerInfo && EM.Scene.meshUnderPointer && EM.Scene.meshUnderPointer.id === activeWorldMesh.id) {
                //&& pointerInfo.pickInfo && pointerInfo.pickInfo.pickedMesh
                //pointerInfo.pickInfo.pickedMesh.id === activeWorldMesh.id
                onStartZoomTimer();
                console.log("eventState", { eventState: eventState, pointerInfo: pointerInfo });
            }

        }, BABYLON.PointerEventTypes.POINTERWHEEL, false);

        MapEvent.AddExecuteCodeAction(activeWorldMesh, BABYLON.ActionManager.OnPointerOutTrigger, function (mesh, event) {
            //  onStopZoomTimer();
            onStopRotation();
        });
        MapEvent.AddExecuteCodeAction(activeWorldMesh, BABYLON.ActionManager.OnPointerOverTrigger, function (mesh, event) {
            //  onStopZoomTimer();
            //onStopRotation();
           // console.log("OnPointerOverTrigger");
        });


        //OnLongPressTrigger
        //BABYLON.ActionManager.OnKeyDownTrigger
        //OnKeyUpTrigger
        //MapEvent.InitSceneEvents = null;
        //delete MapEvent.InitSceneEvents;

    };

    MapEvent.IMapEventItemOption = function (mesh) {
        function IMapEventItemOption() {
            this.mesh = mesh;
            this.leftClick = null;
            this.rightClick = null;
            this.doubleClick = null;
            this.hovered = null;
            this.unHovered = null;
        }
        return new IMapEventItemOption();
    }
    MapEvent.RegisterFactoryAction = function (iMapEventItemOption) {
        if (!iMapEventItemOption) {
            throw new Error("MapEvent.RegisterFactoryAction: iMapEventItemOption not exist");
        }
        if (!iMapEventItemOption.mesh) {
            throw new Error("MapEvent.RegisterFactoryAction: mesh not exist");
        }

        var mesh = iMapEventItemOption.mesh;

        if (mesh.actionManager) {
            mesh.actionManager.dispose();
        }
        if (iMapEventItemOption.leftClick) {
            MapEvent.AddExecuteCodeAction(mesh, BABYLON.ActionManager.OnLeftPickTrigger, iMapEventItemOption.leftClick);
        }
        if (iMapEventItemOption.rightClick) {
            MapEvent.AddExecuteCodeAction(mesh, BABYLON.ActionManager.OnRightPickTrigger, iMapEventItemOption.rightClick);
        }
        if (iMapEventItemOption.doubleClick) {
            MapEvent.AddExecuteCodeAction(mesh, BABYLON.ActionManager.OnDoublePickTrigger, iMapEventItemOption.doubleClick);
        }
        if (iMapEventItemOption.hovered) {
            MapEvent.AddExecuteCodeAction(mesh, BABYLON.ActionManager.OnPointerOverTrigger, iMapEventItemOption.hovered);
        }
        if (iMapEventItemOption.unHovered) {
            MapEvent.AddExecuteCodeAction(mesh, BABYLON.ActionManager.OnPointerOutTrigger, iMapEventItemOption.unHovered);
        }

    };
    MapEvent.RemoveActionFromMesh = function (mesh, triggerType) {
        return EM.EstateEvents.RemoveActionFromMesh.apply(EM.EstateEvents, arguments);
    };
    MapEvent.GetOrCreateActionManagerFromMesh = function (mesh) {
        return EM.EstateEvents.GetOrCreateActionManagerFromMesh.apply(EM.EstateEvents, arguments);

    };
    MapEvent.AddExecuteCodeAction = function () {
        return EM.EstateEvents.AddExecuteCodeAction.apply(EM.EstateEvents, arguments);

    };
    //#endregion

})(EM.MapEvent);


EM.EstateGeometry = {
    IModules: function () {
        return {
            Modules: null,
            RegistrEvents: null,
            GetMesh: function (meshId) {
                return EM.GetMesh(meshId);
            },
            /**
             *Устанавливает видимость меша
             * @param {string|| int} meshId 
             * @param {bool} show 
             * @returns {щиоусе}  mesh
             */
            SetVisible: function (meshId, show) {
                return EM.SetVisible(meshId, show);
            },
            States: { In: 1, Arround: 2, Hide: 3 }
        };
    },
    PlanetModules: null,
    MotherModules: null,
    //names
    MotherElements: [],
    PlanetGroundsMeshes: [],
    GameModelsInit: null
};

//#region MotherModules
(function (EstateGeometry) {
    var motherModules = EM.EstateGeometry.IModules();

    var industrialComplexId = "mother_industrial_complex";
    var spaceShipyardId = "mother_space_shipyard";
    var motherResearchId = "mother_research";
    var motherCoreId = "mother_core";
    var estateMotherGroupId = "mother_parent";
    var loadedMotherId = "mother";

    var modules = [industrialComplexId, spaceShipyardId, motherResearchId];

    var states = motherModules.States;


    function getMesh(meshId) {
        return motherModules.GetMesh(meshId);
    }

    function setVisible(meshId, show) {
        return motherModules.SetVisible(meshId, show);
    }

    function registrEvents() {
        //   console.log("registrEvents industrialComplexId ", getMesh(industrialComplexId));
        EM.EstateEvents.RegisterMotherIndustrialComplex(getMesh(industrialComplexId));
        // console.log("registrEvents spaceShipyardId ", getMesh(spaceShipyardId));
        EM.EstateEvents.RegisterMotherSpaceShipyard(getMesh(spaceShipyardId));
        //console.log("registrEvents motherResearchId ", getMesh(motherResearchId));
        EM.EstateEvents.RegisterMotherResearch(getMesh(motherResearchId));
        //console.log("registrEvents motherCapsuleId ", getMesh(motherCapsuleId));
        //console.log("registrEvents estateMotherGroupId ", getMesh(estateMotherGroupId));
        EM.EstateEvents.RegisterMotherCapsule(getMesh(estateMotherGroupId));

    }

    function motherModulesVisible(show, name) {
        var alpha = show ? 1 : 0;
        if (show) {
            if (name === industrialComplexId) getMesh(name).visibility = alpha;
            else if (name === spaceShipyardId) getMesh(name).visibility = alpha;
            else if (name === motherResearchId) getMesh(name).visibility = alpha;
        } else {
            _.forEach(modules, function (module, key) {
                getMesh(module).visibility = alpha;
            });
        }
    }
    function setMotherVisible(show) {
        return setVisible(estateMotherGroupId, show);
    }

    function setMotherState(state) {
        function isPickable(mesh, val) {
            if (mesh) mesh.isPickable = val;
        }

        if (state === states.In) isPickable(setMotherVisible(true), false);
        else if (state === states.Arround) isPickable(setMotherVisible(true), true);
        else if (state === states.Hide) isPickable(setMotherVisible(false), true);
        motherModulesVisible(false);
    }


    motherModules.MotherIndustrialComplex = industrialComplexId;
    motherModules.MotherSpaceShipyard = spaceShipyardId;
    motherModules.MotherResearch = motherResearchId;

    motherModules.SetMotherModulesVisible = motherModulesVisible;
    motherModules.LoadedMotherId = loadedMotherId;

    /**
    * 'mother_parent'
    */
    motherModules.EstateMotherGroupId = estateMotherGroupId;
    motherModules.MotherCoreId = motherCoreId;


    motherModules.Modules = modules;
    Object.defineProperty(motherModules, "Modules", {
        get: function () {
            return modules;
        }
    });
    motherModules.RegistrEvents = registrEvents;

    motherModules.GetMotherGroupMesh = function () {
        return getMesh(estateMotherGroupId);
    };

    motherModules.InMother = function () {
        setMotherState(states.In);
    };
    motherModules.ArroundMother = function () {
        setMotherState(states.Arround);
    };
    motherModules.HideMother = function () {
        setMotherState(states.Hide);
    };
    Object.defineProperty(EstateGeometry, "MotherModules", {
        get: function () {
            return motherModules;
        }
    });

})(EM.EstateGeometry);
//#endregion

//#region PlanetModules
(function (EstateGeometry) {
    //#region Declare
    var ar = EM.AssetRepository;
    var planetModules = EstateGeometry.IModules();
    var industrialComplex = "base_industrial_complex";
    var spaceShipyard = "base_space_shipyard";
    var comandCenter = "base_comand_center";
    var baseMeshId = "base";
    var baseParentId = "base_parent";
    var modules = [industrialComplex, spaceShipyard, comandCenter];
    var _baseMesh;
    var moduleMeshes = {
        industrialComplex: null,
        spaceShipyard: null,
        comandCenter: null
    };


    var _lastPlanetEnverotment;
    var states = planetModules.States;

    //#endregion

    //#region Helpers
    function getMesh(meshId) {
        return planetModules.GetMesh(meshId);
    }


    function _nullRef(data, argName, sourceMethod) {
        throw Errors.ClientNullReferenceException(data, argName, "EstateGeometry.PlanetModules." + sourceMethod);
    }

    function getPlanetEnverotment(planetId, show) {
        if (!planetId) throw _nullRef({ planetId: planetId }, "planetId", "getPlanetEnverotment");
        var pl = EM.EstateData.GetPlanetLocation();
        if (!pl.TextureTypeId) throw _nullRef({ pl: pl }, "pl.TextureTypeId", "getPlanetEnverotment");
        //   console.log("getPlanetEnverotment", pl);
        var iPlanetEnverotment = ar.GetIPlanetEnverotment(pl.TextureTypeId);
        var env = iPlanetEnverotment.GetEnverotment(_baseMesh, show, planetId);
        return env;

    }
    //#endregion

    //#region Main


    function baseModulesVisible(show, name) {
        var alpha = show ? 1 : 0;
        if (show && name) {
            if (name === industrialComplex) moduleMeshes.industrialComplex.visibility = alpha;
            else if (name === spaceShipyard) moduleMeshes.spaceShipyard.visibility = alpha;
            else if (name === comandCenter) moduleMeshes.comandCenter.visibility = alpha;
            return;
        }
        _.forEach(modules, function (moduleMeshId, key) {
            var moduleMesh = getMesh(moduleMeshId);
            moduleMesh.visibility = alpha;

        });
    }

    function setPlanetEnverotment(planetId, show) {
        // console.log("_lastPlanetEnverotment", _lastPlanetEnverotment);
        if (!_lastPlanetEnverotment) {
            try {
                var last = getPlanetEnverotment(planetId, show);
                if (last) _lastPlanetEnverotment = last;

            }
            catch (e) {
                console.log("setPlanetEnverotment", { e: e });
                return;
            }
            return;
        }

        if (typeof planetId !== "number") {
            //console.log("typeof planetId !== number");
            return;
        }
        if (_lastPlanetEnverotment.PlanetId === planetId && _lastPlanetEnverotment.IsVisible === show) {
            // console.log("if (_lastPlanetEnverotment.planetId === planetId && _lastPlanetEnverotment.visible === show) return;");
            return;
        }
        if (_lastPlanetEnverotment.PlanetId === planetId && _lastPlanetEnverotment.IsVisible) {
            //console.log("if (_lastPlanetEnverotment.planetId === planetId && _lastPlanetEnverotment.visible)");
            _lastPlanetEnverotment.IsVisible = false;
            return;
        } else if (_lastPlanetEnverotment.PlanetId !== planetId && _lastPlanetEnverotment.IsVisible) {
            // console.log("else if (_lastPlanetEnverotment.planetId !== planetId && _lastPlanetEnverotment.visible)");
            _lastPlanetEnverotment.IsVisible = false;
        }

        //  console.log("_____GO_______");
        //EM.GameCamera.Camera.target = BABYLON.Vector3.Zero();
        // EM.GameCamera.Camera.lowerRadiusLimit = 1;
        _lastPlanetEnverotment = getPlanetEnverotment(planetId, show);
        //console.log("_lastPlanetEnverotment", _lastPlanetEnverotment);

    }

    function setPlanetState(state) {
        var ce;
        var planetId;
        if (!_lastPlanetEnverotment) {
            if (state === states.In) {
                ce = EM.EstateData.GetCurrentEstate();
                planetId = ce.EstateId;
                if (!planetId) state = states.Hide;
                setPlanetEnverotment(planetId, true);
            }
            if (state === states.Hide) EM.SetVisible(baseParentId, false, true);
            baseModulesVisible(false);
            return;
        }
        else {
            ce = EM.EstateData.GetCurrentEstate();
            planetId = ce.EstateId;
            if (!planetId) state = states.Hide;
            if (state === states.In) setPlanetEnverotment(planetId, true);
            else if (state === states.Arround) {
                //todo зарезервированно но пока нет в нем необходимости
            }
            else if (state === states.Hide) setPlanetEnverotment(_lastPlanetEnverotment.PlanetId, false);
        }
        baseModulesVisible(false);
    }

    //#endregion

    //#region Public
    planetModules.IndustrialComplex = industrialComplex;
    planetModules.SpaceShipyard = spaceShipyard;
    planetModules.ComandCenter = comandCenter;
    planetModules.BaseModulesVisible = baseModulesVisible;
    planetModules.BaseParentId = baseParentId;


    planetModules.Modules = modules;


    planetModules.InPlanet = function () {
        setPlanetState(states.In);
    };
    planetModules.ArroundPlanet = function () {
        setPlanetState(states.Arround);
    };
    planetModules.HidePlanet = function () {
        setPlanetState(states.Hide);
    };
    planetModules.BaseVisibleObserverable = null;

    planetModules.RegistrEvents = function (parentBase) {

        var _vo = Utils.IPropertyObserverable(parentBase, "isVisible", "VisibleObserverable");
        planetModules.BaseVisibleObserverable = parentBase[_vo.ObserverablePropertyName];
        Object.defineProperty(planetModules, "BaseVisibleObserverable", {
            get: function () {
                return parentBase[_vo.ObserverablePropertyName];
            }
        });
        _baseMesh = _vo._rootObject;
        //console.log("_baseMesh", {
        //    _baseMesh: _baseMesh
        //});

        moduleMeshes.industrialComplex = getMesh(industrialComplex);
        moduleMeshes.spaceShipyard = getMesh(spaceShipyard);
        moduleMeshes.comandCenter = getMesh(comandCenter);
        EM.EstateEvents.RegisterBaseIndustrialComplex(moduleMeshes.industrialComplex);
        EM.EstateEvents.RegisterBaseSpaceShipyard(moduleMeshes.spaceShipyard);
        EM.EstateEvents.RegisterBaseCommandCenter(moduleMeshes.comandCenter);

        delete planetModules.RegistrEvents;
    };




    Object.defineProperty(EstateGeometry, "PlanetModules", {
        get: function () {
            return planetModules;
        }
    });

    //#endregion 
})(EM.EstateGeometry);
//#endregion

//#region GameModelsInit
(function (EstateGeometry) {
    var sceneName = "game_models";
    var showLog = false;
    function _log(mes, val) {
        if (!showLog) return;
        var _mes = "EstateGeometry.GameModelsInit__{" + mes + "}__";
        if (!val) console.log(_mes);
        else console.log(_mes, val);

    }
    function getMatName(matName) {
        return sceneName + "." + matName;
    }
    function getMat(matName) {
        return EM.GetMaterial(matName);
    }

    function _createCoreParticles(emmitterName, particleSystemName, emitterPosition) {

        var emitter = BABYLON.Mesh.CreateBox(emmitterName, 0.01, EM.Scene);
        emitter.isVisible = false;
        emitter.position = emitterPosition || BABYLON.Vector3.Zero();
        var particleSystem = new BABYLON.ParticleSystem(particleSystemName, 20, EM.Scene);
        particleSystem.particleTexture = EM.CreateTexture(EM.Particle.$getLaserFireTextureUrl());

        particleSystem.minAngularSpeed = -6;
        particleSystem.maxAngularSpeed = 6;
        particleSystem.minSize = 1;
        particleSystem.maxSize = 1.1;
        particleSystem.minLifeTime = 1;
        particleSystem.maxLifeTime = 2;
        particleSystem.minEmitPower = 0;
        particleSystem.maxEmitPower = 0;
        particleSystem.emitter = emitter;

        particleSystem.minEmitBox = BABYLON.Vector3.Zero();
        particleSystem.maxEmitBox = BABYLON.Vector3.Zero();


        particleSystem.gravity = BABYLON.Vector3.Zero();
        particleSystem.updateSpeed = 0.02;
        particleSystem.emitRate = 10;


        particleSystem.direction1 = BABYLON.Vector3.Zero();
        particleSystem.direction2 = BABYLON.Vector3.Zero();


        particleSystem.color1 = new BABYLON.Color3(0.1, 0.7, 1.0);
        particleSystem.color2 = new BABYLON.Color3(0.1, 0, 1.0);
        return particleSystem;


    }



    function buildPlanetFactory() {
        var baseFenceBodyId = "base_fence_body";
        var floorId = "base_floor_gexa";
        var m = EstateGeometry.PlanetModules;


        function createFenceCylAnimations(fenceCylMeshes, fb) {
            var animations = [];
            var twoPi = 6.28;
            var direction = 1;
            var scale = 0.2;
            var fps = 16;
            var cell = 40;
            var baseSpeed = 1.76;

            var minSpeed = 1 * baseSpeed;
            var maxSpeed = 3 * baseSpeed;

            //effects
            function createFenceHl() {
                var hlColor = new BABYLON.Color3(200, 125, 255);
                var bColor = BABYLON.Color4.FromInts(hlColor.r, hlColor.g, hlColor.b, 255);
                var hl = new BABYLON.HighlightLayer("fence_cyl_hl", EM.Scene, { mainTextureRatio: 0.2 });
                return hl;
            }
            _.forEach(fenceCylMeshes, function (mesh, key) {
                //   hl.addMesh(mesh, bColor);
                // hl.addExcludedMesh(mesh);
                direction = direction * -1;
                var animationName = mesh.name + ".rotation.x";
                var baseRotation = _.floor(_.random(0, 3, true), 2);
                var startRot = baseRotation * direction;
                var endRot = (twoPi + baseRotation) * direction;
                mesh.scaling.z = mesh.scaling.y = scale;
                mesh.rotation.x = startRot;
                //    mesh.position.y +=0.5;
                var animation = BABYLON.Animation.CreateAndStartAnimation(animationName, mesh, "rotation.x", fps, cell, startRot, endRot,
                BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                animation.speedRatio = _.random(minSpeed, maxSpeed, true);

                animations.push(animation);


            });

            return animations;
        };
        function setDiffToOpacyti(material) {
            material.opacityTexture = material.diffuseTexture;
            material.opacityTexture.getAlphaFromRGB = true;
            material.useSpecularOverAlpha = false;
        }

        function fixFloor() {
            var configObject = {
                parallaxScaleBias: 0.1,
                renderMode: "Bump",
                bumpLevel: 2,
                specularPower: 30,
                uvScale: 10,
                specularScale: 1,
                bumpTexuteUrl: ""
            }

            var gexa = m.GetMesh(floorId);
            var material = gexa.material;
            var diffuse = material.diffuseTexture;
            var bump = material.bumpTexture;
            bump.getAlphaFromRGB = true;
            bump.level = configObject.bumpLevel;
            var specular = diffuse.clone("specular");
            //   material.useParallax = true;
            //   material.useParallaxOcclusion = true;           
            material.specularTexture = specular;
            material.specularPower = configObject.specularPower;
            function setScale(val) {
                diffuse.uScale = diffuse.vScale = bump.uScale = bump.vScale = val;
            }

            function setSpecularScale(val) {
                material.specularTexture.vScale = material.specularTexture.uScale = val;
            }

            setScale(configObject.uvScale);
            configObject.bumpTexuteUrl = bump.url;

        };

        function fixFenceCyl(fenceMaterial) {
            fenceMaterial.backFaceCulling = false;
            setDiffToOpacyti(fenceMaterial);
            fenceMaterial.diffuseTexture.level = 1.5;
        }

        function fixFenceBody(fenceBodyMesh, setAnumation) {
            var fbMat = fenceBodyMesh.material;
            fbMat.backFaceCulling = false;
            setDiffToOpacyti(fbMat);
            fbMat.diffuseTexture.level = 1;

            function registerFenceBodyAnimation() {
                fbMat.diffuseTexture.uOffset += 0.01;
                if (fbMat.diffuseTexture.uOffset >= 1) {
                    fbMat.diffuseTexture.uOffset = 0;
                }
            };

            if (setAnumation) _scene.registerBeforeRender(registerFenceBodyAnimation);
        };

        function fixFence() {
            var bodyMesh = m.GetMesh(baseFenceBodyId);
            var cylinders = [];
            var cylNames = [];
            var pref = "base_fence_";
            function setSideFenceNames(_side) {
                cylNames.push(pref + _side + "_cyl_1");
                cylNames.push(pref + _side + "_cyl_2");
                cylNames.push(pref + _side + "_cyl_3");
            }
            setSideFenceNames("top");
            setSideFenceNames("right");
            setSideFenceNames("down");
            setSideFenceNames("left");

            _.forEach(cylNames, function (id, idx) {
                cylinders.push(m.GetMesh(id));
            });

            fixFenceCyl(getMat(getMatName("base_fence_cyl")));
            fixFenceBody(bodyMesh);
            createFenceCylAnimations(cylinders, bodyMesh);

        };


        function createBaseLaserInSky() {

            var emitter = BABYLON.Mesh.CreateBox("base_laser_emmiter", 0.01, EM.Scene);
            // фиксированное положение тк нет суб меша с точными координатами 
            emitter.position = new BABYLON.Vector3(-4.75, 2.5, 6.1);
            emitter.isVisible = false;
            var particleSystem = new BABYLON.ParticleSystem("base_laser_particle", 200, EM.Scene);
            particleSystem.particleTexture = EM.CreateTexture(EM.Particle.$getLaserFireTextureUrl(), EM.Scene);
            particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

            particleSystem.minAngularSpeed = -1;
            particleSystem.maxAngularSpeed = 1;
            particleSystem.minSize = 1;
            particleSystem.maxSize = 1;
            particleSystem.minLifeTime = 5;
            particleSystem.maxLifeTime = 5;
            particleSystem.minEmitPower = 0.01;
            particleSystem.maxEmitPower = 0.01;
            particleSystem.emitter = emitter;

            particleSystem.minEmitBox = BABYLON.Vector3.Zero();
            particleSystem.maxEmitBox = BABYLON.Vector3.Zero();


            particleSystem.gravity = BABYLON.Vector3.Zero();
            particleSystem.gravity.y = 1;
            particleSystem.updateSpeed = 0.05;
            particleSystem.emitRate = 40;


            particleSystem.direction1 = BABYLON.Vector3.Zero();
            particleSystem.direction2 = BABYLON.Vector3.Zero();


            particleSystem.color1 = new BABYLON.Color3(0.1, 0.1, 1.0);
            particleSystem.color2 = new BABYLON.Color3(0.2, 0.1, 1.0);
            EM.EstateGeometry.PlanetModules.BaseVisibleObserverable.add(function (observer, eventState) {
                if (observer.PropertyInfo.NewValue) {
                    particleSystem.start();
                } else {
                    particleSystem.stop();
                }
            });
          //  console.log("particleSystem", { particleSystem: particleSystem });
        }



        function createBaseCoreParticles() {
            var particleSystem = _createCoreParticles("base_core_emmiter", "base_core_parricle", new BABYLON.Vector3(0.05, 2.4, 3.65));
            EM.EstateGeometry.PlanetModules.BaseVisibleObserverable.add(function (observer, eventState) {
                if (observer.PropertyInfo.NewValue) {
                    particleSystem.start();

                } else {
                    particleSystem.stop();
                }
            });
        }
        // tmp
        function loadOrbitalTurrentAnumation() {
            var mesh = EM.GetMesh("base_orbital_turret_1");
            mesh.actionManager = new BABYLON.ActionManager(EM.Scene);
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (e, t) {
                EM.Scene.beginAnimation(mesh, 0, 160, true);
                //  console.log("Hi turel1", { e: e, t: t });
            }, null));

            var mesh2 = EM.GetMesh("base_orbital_turret_2");
            mesh2.actionManager = new BABYLON.ActionManager(EM.Scene);
            mesh2.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (e, t) {
                EM.Scene.beginAnimation(mesh2, 0, 160, true);
                //   console.log("Hi turel2", { e: e, t: t });
            }, null));
        }



        var baseParent = m.GetMesh(m.BaseParentId);
        baseParent.isPickable = false;
        EM.SetVisibleByMesh(baseParent, false, true);
        m.RegistrEvents(baseParent);

        fixFloor();
        fixFence();
        createBaseLaserInSky();
        createBaseCoreParticles();
        _log("planetFactory done");


    }

    function buildMother() {
        var scale = 6;
        var scaling = BABYLON.Vector3.One().scale(scale);
        var m = EstateGeometry.MotherModules;

        function rebuildCore() {
            var core = m.GetMesh(m.MotherCoreId);
            // core.dispose();   //todo удалить из файла выгрузки меш


            var matId = core.material.id;
            var defaultFireCataolg = "/Content/babylon-assets/babylon_materiales/fire/";
            var diffuseUrl = defaultFireCataolg + "diffuse.png";
            var distortionUrl = defaultFireCataolg + "distortion.png";
            var opacityUrl = defaultFireCataolg + "opacity.png";
            return core;
        }

        var parent = m.GetMesh(m.EstateMotherGroupId);

        //todo удалить из файла выгрузки меш
        var core = m.GetMesh(m.MotherCoreId);
        if (core) {
            core.dispose();
        }
      

        var motherCoreParticleSystem = _createCoreParticles(m.MotherCoreId, "mother_core_particle", new BABYLON.Vector3(0, -0.13, 0.46));
        motherCoreParticleSystem.emitter.parent = parent;
        Object.defineProperty(motherCoreParticleSystem.emitter, "isVisible",{
                value: false,
                enumerable: true,
                configurable: false,
                writable: false
        });
        motherCoreParticleSystem.maxSize = 1.4;
        motherCoreParticleSystem.emitRate = 15;





        // rebuildCore(parent);
        var emmisiveMaterialeNames = [
            getMatName("mother_windows"),
            getMatName("mother_detail_3"),
            getMatName("mother_detail_2"),
            getMatName("mother_detail_1"),
            getMatName("mother_hull_5")];

        //  console.log("mother emmisiveMateriales ", emmisiveMaterialeNames);
        _.forEach(emmisiveMaterialeNames, function (emmisiveMaterialName, key) {
            //   return false;
            var vindowMaterial = EM.Scene.getMaterialByID(emmisiveMaterialName);
            vindowMaterial.emissiveTexture.level = 3;
            vindowMaterial.emissiveTexture.useEmissiveAsIllumination = true;
        });
        parent.scaling = scaling;
        m.RegistrEvents();
        var _vo = Utils.IPropertyObserverable(parent, "isVisible", "VisibleObserverable");
        parent.VisibleObserverable = parent[_vo.ObserverablePropertyName];
        Object.defineProperty(m, "MotherVisibleObserverable", {
            get: function () {
                return parent[_vo.ObserverablePropertyName];
            }
        });


        var motherLight = new BABYLON.PointLight("MotherLight", new BABYLON.Vector3.Zero(), EM.Scene);
        motherLight.position = new BABYLON.Vector3.Zero();
        motherLight.position.y = 5;
        motherLight.parent = parent;
        motherLight.intensity = 0.5;

        motherCoreParticleSystem.start();
        parent.VisibleObserverable.add(function (observer, eventState) {
            if (observer.PropertyInfo.NewValue) {
                motherLight.intensity = 0.5;
                motherCoreParticleSystem.start();
            } else {
                motherLight.intensity = 0;
                motherCoreParticleSystem.stop();
            }
        });
        _log("mother done");



    }

    function gameModelsInit(loadedMeshesGroup) {
        //#region debug
        var showMeshNames = false;
        if (showMeshNames) {
            _log("showMeshNames", {
                loadedMeshesGroup: loadedMeshesGroup
            });

        }
        buildPlanetFactory();
        buildMother();
        delete EstateGeometry.GameModelsInit;
    }


    Object.defineProperty(EstateGeometry, "GameModelsInit", {
        get: function () {
            return gameModelsInit;
        }
    });

})(EM.EstateGeometry);
//#endregion

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

EM.EstateData = {
    //    =======================Vars========================
    //server response objects
    IndustrialComplex: null,
    SpaceShipyard: null,
    Laboratory: null,                           
    CommandCenter: null,
    GetCurrentEstate: null,
    GetCurrentSpaceLocation: null,
    GetMotherLocation: null,
    GetPlanetLocation: null,
 
    SaveCurrentEstateByEsateType: null,
    SavePlanetLocationFromData: null,
    SaveMotherLocationFromData: null,
    SaveCurrentSpaceLocation: null,
    UpdateCurrentFromSource: null,


    SetSpaceLocationFromGalaxyId: null,
    SetSpaceLocationFromSectorId: null,
    SetSpaceLocationFromSystemId: null,
    SetSpaceLocationFromPlanetId: null,
    SetSpaceLocationFromMoonId: null
};

(function (MapData, EstateData) {
    //#region Declare
    var keys = Utils.RepoKeys.EstateListKeys;
    var motherTextureId = 2000;
    var motherSpaceObject = 0;
    var MOTHER_ESTATE_TYPE = false;
    var PLANET_ESTATE_TYPE = true;

    //#region Model

    /**
     * 
     * @param {int} galaxyId 
     * @param {int} sectorId 
     * @param {int} systemId 
     * @param {int} textureTypeId 
     * @returns {object}  BaseLocationModel
     */
    function createBaseLocationModel(galaxyId, sectorId, systemId, textureTypeId) {
        return {
            GalaxyId: (typeof galaxyId === "number") ? galaxyId : null,
            SectorId: (typeof sectorId === "number") ? sectorId : null,
            SystemId: (typeof systemId === "number") ? systemId : null,
            TextureTypeId: (typeof textureTypeId === "number") ? textureTypeId : null
        };
    }

    /**
     * 
     * @param {int} galaxyId 
     * @param {int} sectorId 
     * @param {int} systemId 
     * @param {int} textureTypeId 
     * @param {bool} estateType 
     * @param {int} estateId 
     * @returns {object} CurrentEstateModel
     */
    function createCurrentEstateModel(galaxyId, sectorId, systemId, textureTypeId, estateType, estateId) {
        var b = createBaseLocationModel(galaxyId, sectorId, systemId, textureTypeId);
        b.EstateType = (typeof estateType === "boolean") ? estateType : null;
        b.EstateId = (typeof estateId === "number") ? estateId : null;
        return b;
    }

    /**
     * 
     * @param {int} galaxyId 
     * @param {int} sectorId 
     * @param {int} systemId 
     * @param {int} textureTypeId 
     * @param {int} spaceObjectId 
     * @param {string} mapType 
     * @returns {object} CurrentSpaceLocationModel
     */
    function createCurrentSpaceLocationModel(galaxyId, sectorId, systemId, textureTypeId, spaceObjectId, mapType) {
        var b = createBaseLocationModel(galaxyId, sectorId, systemId, textureTypeId);
        b.SpaceObjectId = (typeof spaceObjectId === "number") ? spaceObjectId : null;
        b.MapTypeName = (typeof mapType === "string") ? mapType : null;
        return b;
    }

    /**
     * 
     * @param {int} galaxyId 
     * @param {int} sectorId 
     * @param {int} systemId 
     * @param {int} textureTypeId 
     * @param {int} startTime  timestamp
     * @param {int} endTime timestamp
     * @returns {object} MotherLocationModel
     */
    function createMotherLocationModel(galaxyId, sectorId, systemId, textureTypeId, targetSystemId, startTime, endTime) {
        var b = createBaseLocationModel(galaxyId, sectorId, systemId, textureTypeId);
        b.StartTime = (typeof startTime === "number") ? startTime : null;
        b.EndTime = (typeof endTime === "number") ? endTime : null;
        b.IsMoving = (targetSystemId && endTime) ? true : false;
        b.TargetSystemId = targetSystemId;
        return b;
    }

    /**
     * 
     * @param {int} galaxyId 
     * @param {int} sectorId 
     * @param {int} systemId 
     * @param {int} textureTypeId 
     * @param {int} planetId 
     * @returns {object} PlanetLocationModel
     */
    function createPlanetLocationModel(galaxyId, sectorId, systemId, textureTypeId, planetId) {
        var b = createBaseLocationModel(galaxyId, sectorId, systemId, textureTypeId);
        b.PlanetId = (typeof planetId === "number") ? planetId : null;
        return b;
    }

    EstateData.CreateBaseLocationModel = createBaseLocationModel;
    EstateData.CreateCurrentEstateModel = createCurrentEstateModel;
    EstateData.CreateCurrentSpaceLocationModel = createCurrentSpaceLocationModel;
    EstateData.CreateMotherLocationModel = createMotherLocationModel;
    //#endregion

    // ReSharper disable once ExpressionIsAlwaysConst
    var currentEstate = createCurrentEstateModel(null, null, null, motherTextureId, MOTHER_ESTATE_TYPE, motherSpaceObject);
    var currentSpaceLocation = createCurrentSpaceLocationModel(null, null, null, motherTextureId, EM.MapGeometry.MapTypes.Mother);
    var motherLocation = createMotherLocationModel();
    var planetLocation = createPlanetLocationModel();


    //#endregion


    //#region Members

    /**
     *http://doc.babylonjs.com/classes/2.5/node
     *@param {directDecendantsOnly} только прямы потомки       : an optiona
     *@param {predicate}  : an optiona
     *mesh.getChildMeshes(directDecendantsOnly, predicate) → AbstractMesh[]
     * 
     *@param {predicate}  : an optiona
     *mesh.getChildren(predicate) → Node[]
     */
  


    //#region GetConcreteLocation
    function getCurrentEstate() {
        return currentEstate;
    }
    function getCurrentSpaceLocation() {
        return currentSpaceLocation;
    }
    function getMotherLocation() {
        return motherLocation;
    }
    function getPlanetLocation() {
        return planetLocation;
    }

    EstateData.GetCurrentEstate = getCurrentEstate;
    EstateData.GetCurrentSpaceLocation = getCurrentSpaceLocation;
    EstateData.GetMotherLocation = getMotherLocation;
    EstateData.GetPlanetLocation = getPlanetLocation;
    //#endregion


    //#region SetConcreteLoacation
    function setCurrentEstateFromDynamicState(galaxyId, sectorId, systemId, textureTypeId, estateType, estateId) {
        currentEstate.GalaxyId = galaxyId;
        currentEstate.SectorId = sectorId;
        currentEstate.SystemId = systemId;
        currentEstate.EstateType = estateType;
        currentEstate.EstateId = estateId;
        currentEstate.TextureTypeId = textureTypeId;
    }

    function setPlanetLocationFromModel(planetLocationModel) {
        planetLocation = planetLocationModel;
    }

    function setMotherLocationFromModel(motherLocationModel) {
        motherLocation = motherLocationModel;
    }


    function setCurrentEstateFromModel(currentEstateModel) {
        currentEstate = currentEstateModel;
    }

    function setCurrentLocationFromModel(currentLocationModel) {
        currentSpaceLocation = currentLocationModel;
    }


    EstateData.SetCurrentEstateFromModel = setCurrentEstateFromModel;
    EstateData.SetCurrentLocationFromModel = setCurrentLocationFromModel;




    //#endregion

    //#region SaveAndUpdate
    function saveCurrentSpaceLocation(galaxyId, sectorId, systemId, spaceObjectId, textureTypeId, mapTypeName) {
        currentSpaceLocation.GalaxyId = galaxyId;
        currentSpaceLocation.SectorId = sectorId;
        currentSpaceLocation.SystemId = systemId;
        currentSpaceLocation.SpaceObjectId = spaceObjectId;
        currentSpaceLocation.TextureTypeId = textureTypeId;
        currentSpaceLocation.MapTypeName = mapTypeName;
    }

    function savePlanetLocationFromData(data) {
        var galaxyId = data[keys.Galaxy];
        var sectorId = data[keys.Sector];
        var systemId = data[keys.System];
        var textureTypeId = data[keys.TextureTypeId];
        var planetId = data[keys.OwnId];
        setPlanetLocationFromModel(createPlanetLocationModel(galaxyId, sectorId, systemId, textureTypeId, planetId));
        setCurrentEstateFromDynamicState(galaxyId, sectorId, systemId, textureTypeId, PLANET_ESTATE_TYPE, planetId);
        saveCurrentSpaceLocation(galaxyId, sectorId, systemId, planetId, textureTypeId, EM.MapGeometry.MapTypes.Planet);
    }

    function setMotherJump(targetSystemId, startTime, endTime) {
        setMotherLocationFromModel(createMotherLocationModel(motherLocation.GalaxyId, motherLocation.SectorId, motherLocation.SystemId, motherTextureId, targetSystemId, startTime, endTime));
    }

    function saveMotherSpaceLocationFromData(data, targetSystemId, startTime, endTime) {
        var galaxyId = data[keys.Galaxy];
        var sectorId = data[keys.Sector];
        var startSystemId = data[keys.System];
        var textureTypeId = data[keys.TextureTypeId];
        //console.log("saveMotherSpaceLocationFromData", {
        //    data: data,
        //    targetSystemId: targetSystemId,
        //    endTime: endTime
        //});
        setMotherLocationFromModel(createMotherLocationModel(galaxyId, sectorId, startSystemId, textureTypeId, targetSystemId, startTime, endTime));
    }

    function saveMotherLocationFromData(data, targetSystemId, startTime, endTime) {
        //  console.log("uno saveMotherLocationFromData");
        var galaxyId = data[keys.Galaxy];
        var sectorId = data[keys.Sector];
        var startSystemId = data[keys.System];
        var textureTypeId = data[keys.TextureTypeId];

        saveMotherSpaceLocationFromData(data, targetSystemId, startTime, endTime);
        setCurrentEstateFromDynamicState(galaxyId, sectorId, startSystemId, textureTypeId, MOTHER_ESTATE_TYPE, motherSpaceObject);
        saveCurrentSpaceLocation(galaxyId, sectorId, startSystemId, motherSpaceObject, motherTextureId, EM.MapGeometry.MapTypes.Mother);

    }

    function updateCurrentFromSource(fromPlanet) {
        if (fromPlanet) {
            setCurrentEstateFromDynamicState(planetLocation.GalaxyId, planetLocation.SectorId, planetLocation.SystemId, planetLocation.TextureTypeId, PLANET_ESTATE_TYPE, planetId);
            saveCurrentSpaceLocation(planetLocation.GalaxyId, planetLocation.SectorId, planetLocation.SystemId, planetLocation.PlanetId, planetLocation.TextureTypeId, EM.MapGeometry.MapTypes.Planet);

        } else {
            setCurrentEstateFromDynamicState(motherLocation.GalaxyId, motherLocation.SectorId, motherLocation.SystemId, motherLocation.TextureTypeId, MOTHER_ESTATE_TYPE, motherSpaceObject);
            saveCurrentSpaceLocation(motherLocation.GalaxyId, motherLocation.SectorId, motherLocation.SystemId, motherSpaceObject, motherTextureId, EM.MapGeometry.MapTypes.Mother);
        }
    }

    function updateMotherDataLocation(galaxyId, sectorId, startSystemId) {
        var newMotherData = GameServices.estateService.getEstateItem(0);
        newMotherData.Galaxy = galaxyId;
        newMotherData.Sector = sectorId;
        newMotherData.System = startSystemId;
        GameServices.estateService.addEstateItem(newMotherData);
        saveMotherSpaceLocationFromData(newMotherData);
        if (currentEstate.EstateType === MOTHER_ESTATE_TYPE) {
            saveCurrentSpaceLocation(galaxyId, sectorId, startSystemId, motherSpaceObject, motherTextureId, EM.MapGeometry.MapTypes.Mother);
        }
        if (currentSpaceLocation.SystemId === startSystemId && !(typeof currentSpaceLocation.SpaceObjectId === "number")) {
            saveCurrentSpaceLocation(galaxyId, sectorId, startSystemId, motherSpaceObject, motherTextureId, EM.MapGeometry.MapTypes.Mother);
        }
    }


    function saveCurrentEstateByEsateType(type, id, motherTargetSystemId, motherStartTime, motherEndTime) {
        //   console.log("saveCurrentEstateByEsateType");
        if (type) savePlanetLocationFromData(GameServices.estateService.getEstateItem(id));
        else saveMotherLocationFromData(GameServices.estateService.getEstateItem(id || 0), motherTargetSystemId, motherStartTime, motherEndTime);
    }

    EstateData.SaveCurrentSpaceLocation = saveCurrentSpaceLocation;
    EstateData.SavePlanetLocationFromData = savePlanetLocationFromData;
    EstateData.SaveMotherLocationFromData = saveMotherLocationFromData;
    EstateData.SaveMotherSpaceLocationFromData = saveMotherSpaceLocationFromData;
    EstateData.SetMotherJump = setMotherJump;
    EstateData.UpdateMotherDataLocation = updateMotherDataLocation;
    EstateData.UpdateCurrentFromSource = updateCurrentFromSource;
    EstateData.SaveCurrentEstateByEsateType = saveCurrentEstateByEsateType;
    //#endregion

    //#region getMeshData
    function getDataSector(sectorId) {
        var sector = null;
        if (MapData.Sectors) {
            var idx = sectorId - 1;
            sector = MapData.Sectors[idx];
            if (sector.Id !== sectorId) {
                sector = _.find(MapData.Sectors, function (o) {
                    return o.Id === sectorId;
                });
            }
        };
        return sector;
    }

    function getDataSystem(systemId) {
        var system = null;
        if (MapData.System
            && MapData.System.Stars
            && MapData.System.Stars[systemId]) {
            return MapData.System.Stars[systemId];
        }
        if (MapData.Systems) {
            system = _.find(MapData.Systems, function (o) {
                return o.Id === systemId;
            });
        }
        return system;
    }

    function getDataPlanet(planetId) {
        var planet = null;
        if (MapData.System && MapData.System.Planets) {
            planet = _.find(MapData.System.Planets, function (o) {
                return o.Id === planetId;
            });
        }
        return planet;
    }
    function getDataMoon(moonId) {
        var moon = null;
        if (MapData.System && MapData.System.Moons) {
            moon = _.find(MapData.System.Moons, function (o) {
                return o.Id === moonId;
            });
        }
        return moon;
    }
    //#endregion

    //#region SetById

    function setSpaceLocationFromGalaxyId(galaxyId) {
        var textureTypeId = galaxyId;
        var model = createCurrentSpaceLocationModel(galaxyId, null, null, textureTypeId, galaxyId, EM.MapGeometry.MapTypes.Galaxy);
        setCurrentLocationFromModel(model);
    }


    /**
     * fromExist mesh
     * @param {int} sectorId 
     * @returns {void} 
     */
    function setSpaceLocationFromSectorId(sectorId) {
        var sector = getDataSector(sectorId);
        if (sector) {
            var model = createCurrentSpaceLocationModel(sector.GalaxyId, sectorId, null, sector.TextureTypeId, sectorId, EM.MapGeometry.MapTypes.Sector);
            setCurrentLocationFromModel(model);
        }
        else console.log("setSpaceLocationFromSectorId data not exist");  
    }

    /**
     * fromExist mesh
     * @param {int} systemId
     * @returns {void} 
     */
    function setSpaceLocationFromSystemId(systemId) {
        var system = getDataSystem(systemId);
        if (system) {
            var model = createCurrentSpaceLocationModel(system.GalaxyId, system.SectorId, systemId, system.TextureTypeId, systemId, EM.MapGeometry.MapTypes.Star);
            setCurrentLocationFromModel(model);
        }
        else console.log("setSpaceLocationFromSystemId data not exist");
    }
    /**
     * from existMesh
     * @param {int} planetId 
     * @returns {void} 
     */
    function setSpaceLocationFromPlanetId(planetId) {
        var planet = getDataPlanet(planetId);
        if (planet) {
            var model = createCurrentSpaceLocationModel(planet.GalaxyId, planet.SectorId, planet.SystemId, planet.TextureTypeId, planetId, EM.MapGeometry.MapTypes.Planet);
            setCurrentLocationFromModel(model);
        } else console.log("setSpaceLocationFromSystemId data not exist");

    }
    /**
     * from existMesh
     * @returns {} 
     */
    function setSpaceLocationFromMoonId(moonId) {
        var moon = getDataMoon(moonId);
        if (moon) {
            var model = createCurrentSpaceLocationModel(moon.GalaxyId, moon.SectorId, moon.SystemId, moon.TextureTypeId, moonId, EM.MapGeometry.MapTypes.Moon);
            setCurrentLocationFromModel(model);
        } else console.log("setSpaceLocationFromSystemId data not exist");

    };



    EstateData.SetSpaceLocationFromGalaxyId = setSpaceLocationFromGalaxyId;
    EstateData.SetSpaceLocationFromSectorId = setSpaceLocationFromSectorId;
    EstateData.SetSpaceLocationFromSystemId = setSpaceLocationFromSystemId;
    EstateData.SetSpaceLocationFromPlanetId = setSpaceLocationFromPlanetId;
    EstateData.SetSpaceLocationFromMoonId = setSpaceLocationFromMoonId;
    EstateData.GetLocalDataSystem = getDataSystem;

    //#endregion

    //#region Other   
    // ReSharper disable  ExpressionIsAlwaysConst
    EstateData.PlanetEstateType = PLANET_ESTATE_TYPE;
    EstateData.MotherEstateType = MOTHER_ESTATE_TYPE;
    // ReSharper restore  ExpressionIsAlwaysConst

    //#endregion
    //#endregion                                           
})(EM.MapData,EM.EstateData);
                                       
EM.GameLoader = {};
(function (GameLoader) {
    var _preloaderId = "#scene-loader";
    var _estateLoaded = false;
    var _meshesLoaded = false;
    //var _dataLoaded = false;
    //todo debug
    var _dataLoaded = true;
    var _smoke;


    function loadAnimation() {
        "use strict";
        var processes = {};
        var loadControl = $("#scene-loader-progress");
        function updateProgress(data) {
            var process = data.currentTarget.responseURL;
            if (!processes[process]) {
                processes[process] = {
                    loaded: 0,
                    total: 0
                };
            }

            processes[process].loaded = data.loaded;
            processes[process].total = data.total;

            var progress = {
                loaded: 0,
                total: 0
            };
            _.forEach(processes, function (proces, key) {
                progress.loaded += proces.loaded;
                progress.total += proces.total;
            });

            var currReadyValue = (progress.loaded / progress.total) * 100;
            currReadyValue = (currReadyValue < 10) ? 10 : currReadyValue;
            loadControl.css("width", currReadyValue + "%");
        };


        var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        var _lodash = _,
            random = _lodash.random,
            range = _lodash.range,
            times = _lodash.times,
            assign = _lodash.assign;

        var FloatArray = window.Float32Array || Array;

        // base +/- range
        function fuzzy(range, base) {
            return (base || 0) + (Math.random() - 0.5) * range * 2;
        }

        function makeNoise(width, height) {
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');

            canvas.width = width;
            canvas.height = height;

            var imgData = ctx.getImageData(0, 0, width, height),
                data = imgData.data,
                pixels = data.length;

            for (var i = 0; i < pixels; i += 4) {
                data[i] = Math.random() * 255;
                data[i + 1] = Math.random() * 255;
                data[i + 2] = Math.random() * 255;
                //       data[i+1] = data[i];
                //     data[i+2] = data[i];
                data[i + 3] = 255;
            }
            ctx.putImageData(imgData, 0, 0);

            return canvas;
        }

        function makeOctaveNoise(width, height, octaves) {
            var canvas = document.createElement("canvas"),
                ctx = canvas.getContext("2d");

            canvas.width = width;
            canvas.height = height;

            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, width, height);

            ctx.globalAlpha = 1 / octaves;
            ctx.globalCompositeOperation = "lighter";

            for (var i = 0; i < octaves; i++) {
                var octave = makeNoise(width >> i, height >> i);
                ctx.drawImage(octave, 0, 0, width, height);
            }
            return canvas;
        }

        var defaults = {
            // maxAge: 70,
            maxAge: 20,
            exposure: 0.1,
            //  exposure: 0.9,

            //damping: 0.8,
            // damping: 0.5,
            damping: 0.1,
            noise: 1.0,
            fuzz: 5.0,
            intensity: 2.0,

            vx: 10,
            vy: 10,
            spawn: 5,
            octaves: 7,

            color: {
                r: 25,
                g: 100,
                b: 75
            },
            width: window.innerWidth,
            height: window.innerHeight,
            sppedX: 12,
            x: 0,
            y: 0
        };
        defaults.x = defaults.width * 0.5;
        defaults.y = defaults.height * 0.5;

        var Emitter = function () {
            function Emitter(options) {
                var _this = this;

                _classCallCheck(this, Emitter);

                assign(this, defaults, options);
                this.canvas = document.createElement("canvas");
                this.canvas.width = this.width;
                this.canvas.height = this.height;
                this.ctx = this.canvas.getContext("2d");

                this.noiseData = this.noiseCanvas.getContext("2d").getImageData(0, 0, this.width, this.height).data;
                this.particles = [];

                this.ctx.fillStyle = "black";
                this.ctx.fillRect(0, 0, this.width, this.height);
                this.imgdata = this.ctx.getImageData(0, 0, this.width, this.height);
                this.data = this.imgdata.data;
                this.ctx.clearRect(0, 0, this.width, this.height);

                this.hdrdata = new FloatArray(this.data.length);
                times(this.noiseData.length, function (n) {
                    _this.hdrdata[n] = 0;
                });

                this.velocity = {
                    x: random(-0.5, 0.5, true),
                    y: random(-0.5, 0.5, true)
                };
                this.update = this.update.bind(this);
            }

            _createClass(Emitter, [{
                key: "tonemap",
                value: function tonemap(n) {
                    return (1 - Math.pow(2, -n * 0.005 * this.exposure)) * 255;
                }
            }, {
                key: "getNoise",
                value: function getNoise(x, y, channel) {
                    // ~~  DOUBLE NOT BITWISE OPERATOR
                    return this.noiseData[(~~x + ~~y * this.width) * 4 + channel] / 127 - 1.0;
                }
            }, {
                key: "update",
                value: function update() {
                    var _this2 = this;

                    if (this.x < 0 || this.x > this.width) {
                        return;
                    }
                    if (this.y < 0 || this.y > this.height) {
                        return;
                    }

                    this.x += this.velocity.x;
                    this.y += this.velocity.y;

                    var x = this.x,
                        y = this.y,
                        vx = this.vx,
                        vy = this.vy,
                        width = this.width,
                        height = this.height,
                        color = this.color,
                        maxAge = this.maxAge,
                        damping = this.damping,
                        noise = this.noise,
                        fuzz = this.fuzz,
                        intensity = this.intensity,
                        spawn = this.spawn;
                    var r = color.r,
                        g = color.g,
                        b = color.b;


                    times(spawn, function (n) {
                        _this2.particles.push({
                            vx: fuzzy(vx),
                            vy: fuzzy(vy),
                            x: x,
                            y: y,
                            age: 0
                        });
                    });

                    var alive = [];

                    this.particles.forEach(function (p) {
                        p.vx = p.vx * damping + _this2.getNoise(p.x, p.y, 0) * 4 * noise + fuzzy(0.1) * fuzz;
                        p.vy = p.vy * damping + _this2.getNoise(p.x, p.y, 1) * 4 * noise + fuzzy(0.1) * fuzz;
                        p.age++;
                        times(10, function (x) {
                            p.x += p.vx * 0.1;
                            p.y += p.vy * 0.1;
                            var index = (~~p.x + ~~p.y * width) * 4;
                            _this2.data[index] = _this2.tonemap(_this2.hdrdata[index] += r * intensity);
                            _this2.data[index + 1] = _this2.tonemap(_this2.hdrdata[index + 1] += g * intensity);
                            _this2.data[index + 2] = _this2.tonemap(_this2.hdrdata[index + 2] += b * intensity);
                        });
                        if (p.age < maxAge) {
                            alive.push(p);
                        }
                    });
                    this.ctx.putImageData(this.imgdata, 0, 0);
                    this.particles = alive;
                }
            }]);
            return Emitter;
        }();

        var requestFrameId = void 0;
        var Smoke = function () {
            function Smoke(container) {
                _classCallCheck(this, Smoke);
                var canvas = container;

                var width = defaults.width;
                var height = defaults.height;

                // console.log(width, height);
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext('2d');

                var y = canvas.height * 0.5;
                var noiseCanvas = makeOctaveNoise(width, height, defaults.octaves);

                var green = new Emitter({
                    name: "left",
                    maxAge: 100,
                    width: canvas.width,
                    height: canvas.height,
                    damping: 0.75,
                    exposure: 0.05,
                    intensity: defaults.intensity,
                    noiseCanvas: noiseCanvas
                });

                green.x = 0;
                green.y = y;
                green.velocity.x = defaults.sppedX;
                green.velocity.y = 0;
                this.canvas = canvas;
                this.ctx = ctx;
                this.emitters = [green];
                //this.emitters.push(green2, blue2, white2);

                this.update = this.update.bind(this);
                this.loop = this.loop.bind(this);
                this.loop();
            }

            _createClass(Smoke, [{
                key: "update",
                value: function () {
                    var _this3 = this;

                    var ctx = this.ctx,
                        canvas = this.canvas;

                    ctx.globalCompositeOperation = 'normal';
                    ctx.fillStyle = 'rgba(5, 15, 16, 1.00)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    //  this.ctx.globalCompositeOperation = 'lighter';
                    this.emitters.forEach(function (emitter) {
                        emitter.update();
                        _this3.ctx.drawImage(emitter.canvas, 0, 0);
                        emitter.ctx.restore();
                    });
                }
            }, {
                key: "loop",
                value: function () {
                    this.update();
                    requestFrameId = requestAnimationFrame(this.loop);
                }
            }, {
                key: "stop",
                value: function () {
                    if (requestFrameId) {
                        window.cancelAnimationFrame(requestFrameId);
                        this.ctx.restore();
                        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                        //   console.log("stop", requestFrameId);
                    }
                }
            }]);

            return Smoke;
        }();
        _smoke = new Smoke(document.getElementById("demo"));
    };

    function hidePreloader() {
        $(EM.EstateContainerId).prepend(EM.Canvas);
        EM.Engine.resize();
        var preloader = $(_preloaderId);
        preloader.css("opacity", 0);

        setTimeout(function () {
            _smoke.stop();
            preloader.addClass("display-none");
            $("#scene-loader").remove();
          //  EM.Audio.GameSounds.mainFone.play();
            EM.GameLoader = null;
            delete EM.GameLoader;
        }, 2000);

    }

    function update(subscriber) {
        if (EM.SubscribeName === subscriber) _estateLoaded = true;

        // if ("DataLoaded" === subscriber) _dataLoaded = true;

        if (_estateLoaded) {
            _estateLoaded = false;
            EM.Observer.Unsubscribe(GameLoader);
        };
        if ("LoadMeshes" === subscriber) _meshesLoaded = true;

        if (_meshesLoaded && _dataLoaded) {
            EM.StartRender();
            //   console.log("GameLoader.update _meshesLoaded && _dataLoaded");
            GameServices.mapControlHelper.jumpToMother(null, null, null, null, true);
            _meshesLoaded = false;
            _dataLoaded = false;

        }
        if ("MotherJumped" === subscriber) {
            hidePreloader();
        }
    }


    GameLoader.Update = update;
    GameLoader.Load = function (data) {
        var scope = angular.element("#Game").scope();
        scope.gameCtrl.loadGame(data);
        EM.Observer.Subscribe(GameLoader);
        EM.CreateScene(data, GameServices.mainGameHubService);

    };
    GameLoader.loadAnimation = loadAnimation;

})(EM.GameLoader);