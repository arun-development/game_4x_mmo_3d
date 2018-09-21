Utils.CoreApp.gameApp.controller("confederationCtrl", ["$scope", "confederationService", function ($scope, $cs) {

}
]);
Utils.CoreApp.gameApp.controller("officersCtrl", ["$scope", "confederationService", "profileService", function ($scope, $cs, profileService) {
    var $self = this;
    var langKey = appL10n.getL10NCurrentLanguage();
    var cr = $cs.$currentUserInfo;


    function _update(oficerList) {
        $self.hasOfficers = oficerList && oficerList.length;
        if ($self.hasOfficers) {
            $self.list = oficerList;
            $self.$$president = $cs.getPresidentOfficerFromOfficerList($self.list);
            $self.$$crIsPresident = cr.userId === $self.$$president.Elected.UserId;
        }
    }

    _update($cs.Officers.Officers);

    this.trDesctiption = function (officer) {
        return "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        return officer.Translate[langKey].Description;
    };

    this.trName = function (officer, isElected) {
        return officer.Translate[langKey].Name;
    };

    this.getAllianceInfo = function ($event, officer, isElected) {
        var userOfficerOut = isElected ? officer.Elected : officer.Appointed;
        console.log("officersCtrl.getAllianceInfo", {
            officer: officer,
            isElected: isElected,
            data: userOfficerOut,
            $event: $event,
        });
        if (userOfficerOut) {
            if (userOfficerOut.UserId) {
                if (userOfficerOut.AllianceId) {
                    // todo  делаем запрос на фильтр к альянсу   
                }
            }
            else if (!isElected && userOfficerOut.Elected === false && $self.$$crIsPresident) {
                $cs.officerOpenFormSetOfficer($event, userOfficerOut, $self.$$president.Elected, cr, $self.trName(officer));
            }
        }        

    };

    this.getUserInfo = function ($event, officer, isElected) {
        var userOfficerOut = isElected ? officer.Elected : officer.Appointed;
        console.log("officersCtrl.getUserInfo", {
            officer: officer,
            isElected: isElected,
            data: userOfficerOut,
            $event: $event,
        });
        if (userOfficerOut) {
            if (userOfficerOut.UserId) {
                profileService.setProfile(userOfficerOut.UserId);
            }
            else if (!isElected && userOfficerOut.Elected === false && $self.$$crIsPresident) {
                $cs.officerOpenFormSetOfficer($event, userOfficerOut, $self.$$president.Elected, cr, $self.trName(officer));
            }
        }


    };     
    $scope.$on("election:finished", function (data) {
        if (_.isEqual($self.list, data.newListIOfficerOut)) {
            console.log("officersCtrl.election:finished.isEqual");
        }
        else {
            _update(data.newListIOfficerOut);

        }
        console.log("electionCtrl.election:finished", {
            data: data,
            $self: $self
        });
    });

}
]);

Utils.CoreApp.gameApp.controller("dialogSetOfficerCtrl", ["$scope", "$mdDialog", "confederationService", "$q", "userNameSercherService", "maxLenghtConsts",
function ($scope, $mdDialog, $cs, $q, $uSercher,$maxLenght) {
    var $self = this;
    var model = {
        $title: "Set officer", 
        $userNameMaxLenght: $maxLenght.UniqueName,
        postName: $self._locals.postName

    };
    this.model = model;



    var existOffcierNames = $cs.officerGetExistOfficerNames();

    var ignoreNames = $uSercher.createIgnoreNamesWithNpc(existOffcierNames);
    this.lockInfo = true;
    this.serchInputId = Utils.Guid.CreateGuid();
    this.searchText = null;
    this.onTextChange = function (text) {
        console.log("onTextChange", { text: text });
        if (!$self.model.To || !$self.model.To.Name) return;
        if (text === $self.model.To.Name) return;        
        if (text.toLowerCase() === $self.model.To.Name.toLowerCase()) {
            $self.searchText = $self.model.To.Name;
        };
    };

    this.serchInLock = false;
    this.querySearch = function (query) {
        var deferred = $q.defer();
        if ($self.serchInLock) {
            deferred.reject();
        }
        $self.serchInLock = true;
        $uSercher.filterAsync(query).then(function (items) {
            var cleanItems = $uSercher.filterByIgnoreNames(items, ignoreNames);
            deferred.resolve(cleanItems);
            $self.serchInLock = false;
        }, function () {
            $self.serchInLock = false;
        });
        return deferred.promise;

    };
    this.messages = {
        required: "This is a required field",
        serchRequireMmatch: "This requireMmatch.",
        serchNotFounded: "not founded",
        serchMaxlength: "The user name must be less than " + model.$userNameMaxLenght + " characters long.",
    };

    this.onSelectedItemChange = function (item) {
        if (!item || !item.Id) {
            $self.lockInfo = true;
        }
        else {
            $self.lockInfo = false;
        }
        console.log("onSelectedItemChange", { item: item, text: $self.searchText });
    };

    this.getUserInfo = function () {     
        if (!$self.serchInLock && $self.model.To && $self.model.To.Id) {
            GameServices.profileService.setProfile($self.model.To.Id);
        }
       
    };

    this.lockUpdate = false;
    this.send = function () {
        if ($self.lockUpdate) return; 
        if (!model.To || !model.To.Id) {
            console.log("send.validateion.error: no model to", {
                model: model,
                $self: $self
            });
        }
        $self.lockUpdate = true;
        $self.serchInLock = true;

        //UserId
        var userOfficerOut = _.cloneDeep($self._locals.targetOficer);
        userOfficerOut.UserId = model.To.Id;
        var president = $self._locals.presidentOfficer;
        $cs.$hub.confederationAddNewOfficer(userOfficerOut, president.Id, president.UserId)
            .then(function (answerOk) {
                console.log("dialogSetOfficerCtrl.send.ok", {
                    answerOk: answerOk,
                    $self: $self,
                });
                $mdDialog.hide($scope);
            }, function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                var errorData = {
                    msg: msg,
                    errorAnswer: errorAnswer,
                    $self: $self
                };
                $self.lockUpdate = false;
                $self.serchInLock = false;
                throw Errors.ClientNotImplementedException(errorData, "dialogSetOfficerCtrl.send.error");
            });

        console.log("dialogSetOfficerCtrl.send", {
            userOfficerOut: userOfficerOut,
            president: president,
            $self: $self
        });

    };
    this.cancel = function () {
        console.log("dialogSetOfficerCtrl.cancel", {
            $self: $self
        });
        $mdDialog.cancel($scope);
    };

}]);


Utils.CoreApp.gameApp.controller("userRatingCtrl", ["$scope", "confederationService", "profileService", "$q", "userNameSercherService", function ($scope, $cs, profileService, $q, $uSercher) {
    var $self = this;
    var $ratting = $cs.Rating;
    var isInit = true;

    this.scrollDataInProgress = false;
    var $scrollDisabled = true;
    Object.defineProperty(this, "scrollDisabled", {
        get: function () {
            return $scrollDisabled || $self.scrollDataInProgress;
        }
    });

    this.useScroll = true;
    var perPage = $ratting.PerPage;
    this.users = [];
    this.loadNextPage = function () {
        if (this.scrollDataInProgress) return;
        if (isInit) {
            $cs.ratingAddAndTakeLocalUsers($ratting.Users, this.users, $ratting.PerPage);
            var size = this.users.length;
            if (size < perPage) {
                $ratting.$totalCount = size;
            }
            isInit = false;
            return;
        }
        if ($ratting.$totalCount && this.users.length === $ratting.$totalCount) return;

        this.scrollDataInProgress = true;

        var startCount = this.users.length;
        if (!startCount) {
            this.scrollDataInProgress = false;
            return;
        }
        if (!$ratting.Users[startCount]) {
            //console.log(" $cs.ratingGetNextPage", { $self: $self });
            //server request
            $cs.ratingGetNextPage($ratting, function (newDataUsers) {
             //   console.log(" ratingGetNextPage.answer", { $self: $self, newDataUsers: newDataUsers });
                var newSize = _.size(newDataUsers);
                if (newSize === 0) {
                    $ratting.$totalCount = $self.users.length;
                }
                else {
                    $cs.ratingAddUserItemsToOld($self.users, newDataUsers);
                    $cs.ratingCheckAndFixUniqe($self);
                }
                $self.scrollDataInProgress = false;

            }, function (errorAnswer, msg, errorData) {
                $self.scrollDataInProgress = false;
            });

            return;
        }
        else {
            //update from local 
            $cs.ratingAddAndTakeLocalUsers($ratting.Users, $self.users, perPage);
            $cs.ratingCheckAndFixUniqe($self);
            $self.scrollDataInProgress = false;
            return;
        }


    };
    //PerPage
    //MaxCacheTime
    this.getUserInfo = function (user) {
        profileService.setProfile(user.UserId);
    };
    this.serchedUser = null;

    // serch user
    this.inLoc = false;
    this.serchPlaceholder = GameServices.translateService.getCommon().serch;

    this.searchText = null;
    this.onTextChange = function (text) {
        if (text === "" || !text) {
            $self.useScroll = true;
            $self.serchedUser = null;
        }
    };
    this.selectedSerchedItem = null;
    this.querySearch = function (query) {
        var deferred = $q.defer();
        $uSercher.filterAsync(query).then(function (items) {
            var cleanItems = $uSercher.ignoreNpcFilter(items);
            deferred.resolve(cleanItems);
        });
        return deferred.promise;
    };
    this.onSelectedItemChanded = function (serchedItem) {
        if (serchedItem) {
            if ($self.useScroll) {
                $self.inLoc = true;
                $cs.ratingGetUserItem(serchedItem.Id, $ratting.Users, function (serchedUserItem) {
                    if (serchedUserItem) {   
                        $self.serchedUser = serchedUserItem;
                        $self.useScroll = false;
                    }
                    $self.inLoc = false;

                }, function (errorAnswer, msg, errorData) {
                    console.log("userRatingCtrl.onSelectedItemChanded.error", { errorAnswer: errorAnswer, msg: msg, errorData: errorData, $self: $self });
                    $self.inLoc = false;
                });
            }
        }
        else {
            $self.useScroll = true;
            $self.serchedUser = null;
        }

    };
    //acCtrl = $scope.$$childHead.$mdAutocompleteCtrl                       S

    $scope.$watch("body.active", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scrollDisabled = !newVal;
        }
        //console.log("userRatingCtrl", {
        //    body: $scope.body,
        //    $scope: $scope,
        //    newVal: newVal,
        //    oldVal: oldVal,
        //});
    });




}]);

Utils.CoreApp.gameApp.controller("electionCtrl", ["$scope", "$rootScope", "confederationService", "profileService", "$q", "userNameSercherService", function ($scope, $rootScope, $cs, profileService, $q, $uSercher) {
    var $self = this;
    var tmpElectionModel = {
        Candidates: [],
        IsRegisterPeriod: true,
        RegistrBtn: null,
        RegistrCcPrice: 100,
        Registred: false,
        StartVoteTime: 0,
        StartRegistrationTime: 0,
        EndVoteTime: 0

    };

    this.model = $cs.getElectionData();

    this.getUserInfo = function (candidat) {
        profileService.setProfile(candidat.UserId);
    };

    this.lockedAddVoice = false;

    this.addVoice = function ($event, candidat) {
        if ($self.lockedAddVoice) return;
        $self.lockedAddVoice = true;
        $cs.addVoiceToOfficer($event, candidat, $self.model.$params, function () {
            $self.lockedAddVoice = false;
        }, function (msg) {
            $self.lockedAddVoice = false;
            console.log("electionCtrl.addVoice.error", { msg: msg });
        }, $rootScope);
    };


    $scope.$on("election:finished", function ($event, data) {
        // var newListIOfficerOut = data.newListIOfficerOut;
        if (_.isEqual($self.model, data.election)) {
            console.log("isEqual.electionCtrl.election:finished.isEqual");
        }
        else {
            $self.model = data.election;
        }
        console.log("electionCtrl.election:finished", {
            $event: $event,
            data: data,
            $self: $self
        });
    });

    $scope.$on("election:update-candidates", function ($event, data) {
        if (_.isEqual($self.model.Candidates, data.Candidates)) {
            //todo  всегда одинаковые при регистрации - оповещении пользователя(проверенно)
            //todo  всегда олинаковые при полном обновлении кандидатов пользователя(не проверенно)
            console.log("isEqual.electionCtrl.election:update-candidates");
        }
        else {
            $self.model.Candidates = data.Candidates;
        }
        console.log("electionCtrl.election:update-candidates", {
            $event: $event,
            data: data,
            $self: $self,
        });
    });

    $scope.$on("election:cr-user-voice-added", function ($event, data) {
        if (_.isEqual(data.params, $self.params)) {
            console.log("isEqual.electionCtrl.election:cr-user-voice-added");
        }
        else {
            $self.model.$params = data.params;
        }
        console.log("electionCtrl.election:update-candidates", {
            $event: $event,
            data: data,
            $self: $self,
        });
    });



    //setInterval(function () {
    //    $cs.Election.IsRegisterPeriod = !$cs.Election.IsRegisterPeriod;

    //},5000);


}]);