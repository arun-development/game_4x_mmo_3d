Utils.CoreApp.gameApp.controller("gameCtrl", [
    //#region base
    "$scope", "$rootScope", "$compile",
    //#region Build
    "buildReqHelper",
    "buildService",
    "commandCenterService",
    "industrialComplexService",
    "laboratoryService",
    "spaceShipyardService",
    //#endregion

    //#region Hub
    "mainGameHubService",
    //#endregion

    "allianceService",
    "bookmarkService",
    "confederationService",
    "estateService",
    "gameChestService",
    "hangarService",
    "journalService",
    "mapInfoService",
    "userChannelsService",
    "planshetService",
    "profileService",
    "resourceService",
    "tabService",
    "translateService",
    "unitDialogService",
    //#region Helper

 
    "controlDiskHelper",
    "controlPanelSwicherHelper",
    "dropableElementHelper",
    "journalHelper",
    "mainHelper",
    "mapControlHelper",
    "mapInfoHelper",
    "npcHelper",
    "paralaxButtonHelper",
    "planshetHelper",
    "scrollerHelper",
    "statisticHelper",
    "techTreeHelper",
    "timerHelper",
    "uploadHelper",
    //#endregion
    function (//#region base
        $scope, $rootScope, $compile,
        //#region Build
        buildReqHelper,
        buildService,
        commandCenterService,
        industrialComplexService,
        laboratoryService,
        spaceShipyardService,
        //#endregion

         //#region Hub
        mainGameHubService,
        //#endregion

        allianceService,
        bookmarkService,
        confederationService,
        estateService,
        gameChestService,
        hangarService,
        journalService,
        mapInfoService,
        userChannelsService,
        planshetService,
        profileService,
        resourceService,
        tabService,
        translateService,
        unitDialogService,

        //#region Helper
 
        controlDiskHelper,
        controlPanelSwicherHelper,
        dropableElementHelper,
        journalHelper,
        mainHelper,
        mapControlHelper,
        mapInfoHelper,
        npcHelper,
        paralaxButtonHelper,
        planshetHelper,
        scrollerHelper,
        statisticHelper,
        techTreeHelper,
        timerHelper,
        uploadHelper
        //#endregion
    ) {
        "use strict";

        //#region Core

        //#region Planshet
        $scope.planshetModel = planshetService.getCurrentModel();
        this.isActiveTab = function(item) {
            return tabService.isActiveTab(item);
        };
        this.activateTabByIdx = function(button) {
            tabService.activateTabByIdx(button);
        };

        function updatePlanshet(func) {
            mainHelper.applyTimeout(function () {
                $scope.planshetModel = planshetService.getCurrentModel();
                //console.log("updatePlanshet_______", $scope.planshetModel);
                if (func instanceof Function) func();
                $scope.$broadcast("planshet:update");
            });
        }

        GameServices._updatePlanshet =  $scope.updatePlanshet = updatePlanshet;
        //#endregion


        //#region Init Data
        var services = {
            //#region Build
            buildReqHelper: buildReqHelper,
            buildService: buildService,
            commandCenterService: commandCenterService,
            industrialComplexService: industrialComplexService,
            laboratoryService: laboratoryService,
            spaceShipyardService: spaceShipyardService,
            //#endregion

            //#region Hub
            mainGameHubService: mainGameHubService,
            //#endregion

            allianceService: allianceService,
            bookmarkService: bookmarkService,
            confederationService: confederationService,
            estateService: estateService,
            gameChestService: gameChestService,
            hangarService: hangarService,
            journalService: journalService,
            mapInfoService: mapInfoService,
            userChannelsService: userChannelsService,

            planshetService: planshetService,
            profileService: profileService,
            resourceService: resourceService,
            tabService: tabService,
            translateService: translateService,
            unitDialogService: unitDialogService,

            //#region Helper        
            controlDiskHelper: controlDiskHelper,
            controlPanelSwicherHelper: controlPanelSwicherHelper,
            dropableElementHelper: dropableElementHelper,
            journalHelper: journalHelper,
            mainHelper: mainHelper,
            mapControlHelper: mapControlHelper,
            mapInfoHelper: mapInfoHelper,
            npcHelper: npcHelper,
            paralaxButtonHelper: paralaxButtonHelper,
            planshetHelper: planshetHelper,
            scrollerHelper: scrollerHelper,
            statisticHelper: statisticHelper,
            techTreeHelper: techTreeHelper,
            timerHelper: timerHelper,
            uploadHelper: uploadHelper
            //#endregion

        };
        GameServices.Init(services);
        this.setEstateBuilds = function (data) {
           // console.log("gameCtrl.setEstateBuilds");
            buildReqHelper.addBuildsToPlanshet(data);

        }
        this.setCtrlData = function(data) {
            paralaxButtonHelper.setBaseBtns(data);
            //hide panel
            mapControlHelper.init();
        }

        this.setTranslate = function(data) {
            translateService.init(data);

        }
        this.setPersonalData = function (data) {
            profileService.setInitDataCurrentUser(data);
        };
        this.setResources = function (data) {
           // console.log("gameCtrl.setResources");
            resourceService.init(data);
        }
        this.setServerTime = function (serverTime) {
            Utils.Time.LOCAL_SERVER_DELTA_TIME = 0;
            Utils.Time.LOCAL_SERVER_DELTA_TIME = serverTime - Utils.Time.GetUtcNow(true);
            //Utils.Time.LOCAL_SERVER_DELTA_TIME = serverTime - Math.floor(Time.GetUtcNow(true));
            Object.freeze(Utils.Time);
        }
        this.setInitialAlliance = allianceService.setInitialAlliance;
        this.setAllianceNames = allianceService.setAllianceNames;
        this.setInitialUserChannelsModel = userChannelsService.setInitialUserChannelsModel;
        this.setInitialConfederationsModel = confederationService.setInitialConfederationsModel;
 
        this._$broadcastEstateId = function(newEstateId) {
            $rootScope.$broadcast("gameCtrl:estate-changed", {newVal:newEstateId});
        };

        this.skagryLoaded = false;

        this.loadGame = function (data) {
            estateService.loadGame($scope, data);
        };  

        //#endregion  


        //#region Global Events
 
        $scope.$on("user:join-to-game", function (event,data) {
            var currentUserId = data.CurrentConnectionUser.UserId;
            var connectedUserId = data.ConnectedUserId;
            var allianceId = data.ConnectedAllianceId;
            var onlineTotalCount = data.OnlineTotalCount;
            if (currentUserId !== connectedUserId) {
                allianceService.onOtherUserConnected(connectedUserId, allianceId, onlineTotalCount);
            }

        });
        $scope.$on("user:left-game", function (event, disconnectedConnectionUser) {
            console.log("gameCtrl.$on user:left-game", {
                event: event,
                disconnectedConnectionUser: disconnectedConnectionUser
            });
            allianceService.onUserLeftGame(disconnectedConnectionUser, $rootScope);
        });

        //#endregion

        //#endregion
    }
]);

