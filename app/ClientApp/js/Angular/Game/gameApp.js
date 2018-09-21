// прототипное наследование http://rav.pw/angularjs-inheritance/
var GameServices = {
    buildReqHelper: {},
    buildService: {},
    commandCenterService: {},
    industrialComplexService: {},
    laboratoryService: {},
    spaceShipyardService: {},

    //#region Hub
    mainGameHubService: {},
    //#endregion
    userChannelsService:{},
    allianceService: {},

    bookmarkService: {},
    confederationService: {},
    estateService: {},
    gameChestService: {},
    hangarService: {},
    journalService: {},
    mapInfoService: {},

    planshetService: {},
    profileService: {},
    resourceService: {},
    tabService: {},
    translateService: {},
    unitDialogService: {},

 
    controlDiskHelper: {},
    controlPanelSwicherHelper: {},
    dropableElementHelper: {},
    journalHelper: {},
    mainHelper: {},
    mapControlHelper: {},
    mapInfoHelper: {},
    npcHelper: {},
    paralaxButtonHelper: {},
    planshetHelper: {},
    scrollerHelper: {},
    statisticHelper: {},
    techTreeHelper: {},
    timerHelper: {},
    uploadHelper: {},
    _updatePlanshet: null,
    Init: function (services) {
        $.extend(this, services);
    }
};
 
Utils.CoreApp.gameApp = angular.module("gameApp", ["ngMaterial",
    "ngSanitize",
    "infinite-scroll",
    "angular-medium-editor",
    "ngMessages",
    "svgAssetsCache",
    "angularFileUpload",
    "ngFileUpload",
    "ngImgCrop",
    "uiCropper",
    "angularAppCommon"]);
Utils.CoreApp.gameApp.config(["$mdThemingProvider", function ($mdThemingProvider) {
    $mdThemingProvider.disableTheming();
    //$mdThemingProvider.theme("default_dialog");
    // $mdThemingProvider.theme("default");
    // $mdThemingProvider.theme("default").dark();
    //$mdThemingProvider.definePalette("mother_dialog", {
    //    '50': "ffebee",
    //    '100': "ffcdd2",
    //    '200': "ef9a9a",
    //    '300': "e57373",
    //    '400': "ef5350",
    //    '500': "f44336",
    //    '600': "e53935",
    //    '700': "d32f2f",
    //    '800': "c62828",
    //    '900': "b71c1c",
    //    'A100': "ff8a80",
    //    'A200': "ff5252",
    //    'A400': "ff1744",
    //    'A700': "d50000",
    //    'contrastDefaultColor': "light", // whether, by default, text (contrast)
    //    // on this palette should be dark or light

    //    'contrastDarkColors': [
    //        "50", "100", //hues which contrast should be 'dark' by default
    //        "200", "300", "400", "A100"
    //    ],
    //    'contrastLightColors': undefined // could also specify this if default was 'dark'
    //});

    //$mdThemingProvider.theme("default")
    //    .primaryPalette("mother_dialog");

}]);
Utils.CoreApp.gameApp.config(["$mdIconProvider", function ($mdIconProvider) {
    var ext = ".svg";
    var svgSection = "/_svg/";
    function setAchievement() {
        var prefix = "achievement-";
        var dir = svgSection+"achievement/" + prefix;

        var defaultSize = 100;
        for (var i = 1; i <= 12; i++) {
            //console.log("setAchievement", {
            //    path: dir + i + ext,
            //    id: prefix + i
            //});
            $mdIconProvider.icon(prefix + i, dir + i + ext);
        }

    }

    function setPlanshetArrow() {
        $mdIconProvider.icon("planshet-arrow", "/Content/images/home/arrow.svg", 50);
        $mdIconProvider.icon("select-container-cursor", "/_svg/select-container-cursor.svg",30);
    }

    function setInterface() {
        var names = {
            //res
            "0": "interface-icon-cc",
            "1": "interface-icon-e", 
            "2": "interface-icon-ir",
            "3": "interface-icon-dm",
            "4": "interface-icon-cc-body",
            "5": "interface-icon-e-body",
            "6": "interface-icon-ir-body",
            "7": "interface-icon-dm-body",

            //left menu
            "8": "interface-icon-confederation",
            "9": "interface-icon-alliance", 
            "10": "interface-icon-journal",
            "11": "interface-icon-message",

            "12": "interface-icon-hangar-toggle", //controll menu

            "13": "interface-icon-galaxy-info",
            "14": "interface-icon-sector-info",
            "15": "interface-icon-star-info",
            "16": "interface-icon-planet-info",
       

            "17": "interface-icon-jump-to-galaxy",
            "18": "interface-icon-jump-to-sector", 
            "19": "interface-icon-jump-to-star", 
            "20": "interface-icon-jump-to-mother",    
            "21": "interface-icon-jump-to-user-planet",

            "22": "interface-icon-jump-to-galaxy-body",
            "23": "interface-icon-jump-to-sector-body", 
            "24": "interface-icon-jump-to-star-body", 
            "25": "interface-icon-jump-to-mother-body", 
            "26": "interface-icon-jump-to-user-planet-body",

            "27": "interface-icon-jump-to-planetoid",
            "28": "interface-icon-open-bookmarks",
 
        }
 
        var dir = svgSection + "interface/";
        _.forEach(names, function (name, key) {
            var url = dir + name + ext;
         //  console.log({ url: url, name: name});
            $mdIconProvider.icon(name, url);
        });
    }

    function init() {
        setInterface();
        setAchievement();
        setPlanshetArrow();
    }

    init();

}]);
angular.module("infinite-scroll").value("THROTTLE_MILLISECONDS", 250);

//app.value('$helloWorld', { greating: 'Hello' });

//// или

//app.provider('$helloWorld', function () {
//    return {
//        $get: function () {
//            return { greating: 'Hello' };
//        }
//    }
//});

// или

Utils.CoreApp.gameApp.constant("maxLenghtConsts", {
    AllianceDescription: 3000,
    PersonalInfoDescription: 3000,
    DbDescriptionMax: 4000,
    DescriptionLangDescriptionMax: 1000,
    DescriptionLangNameMax: 50,
    ChannelMessage: 3000,
    UniqueName: 14,
    ChannelPassword: 14,
    ChannelNameDbMax : 50,
    ChannelNamePrivate : 50,
    ChannelName : 14,
    UserImagesDbMax: 1000,
    PropertyName: 50,
    GroupChannelsLimit: 20,
    MaxOfficerCandidates :10
});
Utils.CoreApp.gameApp.constant("minLenghtConsts", {
    GameUserName: 4,
    UserPassword: 6,
    ChannelPassword: 4,
    AllianceName: 4,
    ChannelName: 4,
    PlaneetName: 3,
    SerchChannelName:3
});
Utils.CoreApp.gameApp.value("$regExp", {
    channelName: new RegExp("^[A-Z]{1,}[A-Z0-9_-]{2,}[A-Z0-9]$"),
    channelPassword: new RegExp("^[A-Z]{1,}[A-Z0-9_-]{2,}[A-Z0-9]$", "i")
});

// example inject
(function () {
    // закрываю в функцию чтобы небыло вызова
    function exampleInject() {
        function ParentCtrl($mdDialog) {
            this.cancel = function (data) {
                return $mdDialog.cancel(data);
            }
        } 
        function myCtrl($scope, $mdDialog) {
            ParentCtrl.call(this, $mdDialog);
            // ctrl code heare
            // can run this.cancel({data:0});

        }
        myCtrl.prototype = Object.create(ParentCtrl.prototype);
        myCtrl.$inject = ["$scope", "$mdDialog"];
        app.controller("myCtrl", myCtrl);
    }
})();

//console.log("app loaded");
