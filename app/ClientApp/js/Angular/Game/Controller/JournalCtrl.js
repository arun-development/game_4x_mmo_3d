Utils.CoreApp.gameApp.controller("journalCtrl", ["$scope",
    "planshetService",
    "tabService",
    "journalService",
    "hangarService",
    "journalHelper",
    "mapInfoService",
    "mainHelper",
    function ($scope,
        planshetService,
        tabService,
        journalService,
        hangarService,
        journalHelper,
        mapInfoService,
        mainHelper) {
        var _buttons = {};
        this.getTaskCollection = journalService.getTaskCollection;  
        this.getReportCollection = journalService.getReportCollection;
        this.getReportDeleteBtn = journalService.getReportDeleteBtn; 
        this.getSpyCollection = journalService.getSpyCollection;  
        this.getLocalMotherJump = journalService.getLocalMotherJump;
        this.hasJumpMother = journalService.hasJumpMother;       
        this.updateJScope = function(updateAction) {
            _buttons = {};
            if(updateAction instanceof Function)
                mainHelper.applyTimeout(function(){
                    updateAction($scope);
                });
        };

        this.getProfileInfo = function(userName) {
            GameServices.profileService.setProfile(userName);
        };


        $scope.updateSimpleTimer = journalService.updateSimpleTimer;

        $scope.$on("journalCtrl:initializeScrollReport", function (e, bodyElement, scrollerId) {
            if (scrollerId === "journal-report") {
                e.stopPropagation();
                journalService.initializeReportScroll(bodyElement);
            }
        });

        $scope.$on("journalCtrl:initializeScrollSpy", function (e, bodyElement, scrollerId) {
            if (scrollerId === "journal-spy") {
                e.stopPropagation();
                journalService.initializeSpyScroll(bodyElement);
            }

        });



        this.getReportInfoButtons = function (reportItem) {
            if (reportItem.$btnKey && _buttons[reportItem.$btnKey]) {
                return _buttons[reportItem.$btnKey];
            }
            var btns;
            var isReport = reportItem.IsReport;   
            if (isReport) {
                btns = journalService.getReportInfoButtons(reportItem);
                btns.push(journalService.getReportDeleteBtn(reportItem));
            } else {
                //console.log("IsReport", $scope.info);
                btns = journalService.getSpyInfoButtons(reportItem);
                btns.push(journalService.getSpyAtkBtn(reportItem));
                btns.push(journalService.getSpyDeleteBtn(reportItem));
            }
            reportItem.$btnKey = Utils.Guid.CreateQuickGuid();
            _buttons[reportItem.$btnKey] = btns;
            return btns;


        };

        this.userNameIsSkagry = function (userName) {  
            return GameServices.npcHelper.isNpc(userName);
            //journalCtrl
        };

    }
]);