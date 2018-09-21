
Utils.CoreApp.gameApp.controller("allianceCtrl", [
    "$scope", "allianceService", "translateService",
    function ($scope, allianceService, translateService) {
        var $self = this;
        $self.translations = translateService.getAlliance();
        //  this.allianceList = allianceService.getAllianceList;

        Object.defineProperty($self, "allianceList", {
            get: function () {
                return allianceService.getAllianceList();
            }
        });

        $self.getAllianceItemCompexBtnConfig = function (allianceId) {
            return allianceService.getAllianceItemCompexBtnConfig(allianceId);
        };
        $self.canCreateAlliance = allianceService.canCreateAlliance();

        $self.getMyAllianceId = allianceService.getMyAllianceId;
        //this.getMyAllianceData = allianceService.getMyAllianceData; 
        Object.defineProperty($self, "MyAllianceData", {
            get: function () {
                return allianceService.getMyAllianceData();
            }
        });


        // this.getAllianceStatisticByAllianceItem = allianceService.getAllianceStatisticByAllianceItem;
        $self.hasRequestsInMyAlliance = allianceService.hasRequestsInMyAlliance();




        $scope.$on("planshet:update", function (evt) {
            if (allianceService.isCurrentModel()) {

                $self.canCreateAlliance = allianceService.canCreateAlliance();
                $self.hasRequestsInMyAlliance = allianceService.hasRequestsInMyAlliance();
            }

        });
        $scope.$on("allianceCtrl:initializeScrollSerch", function (e, bodyElement, scrollerId) {
            //console.log("$scope.$on initializeScroll", { e: e, bodyElement: typeof bodyElement });
            if (scrollerId === "alliance-serch") {
                e.stopPropagation();
                allianceService.initializeScroll(bodyElement);
            }

        });

        //$scope.$on("", function () {

        //});

    }
]);

Utils.CoreApp.gameApp.controller("allianceCreateCtrl", [
    "$scope", "allianceService", "resourceService", "paralaxButtonHelper", "$mdDialog", "$q",
    function ($scope, allianceService, resourceService, paralaxButtonHelper, $mdDialog, $q) {
        var self = this;
        var msg = allianceService.allianceCreateMessages();
        var cb = paralaxButtonHelper.ComplexButtonView();
        cb.SimpleCentr(null, msg.trCreateAlliance.getCurrent());

        var balance = resourceService.getCcCount();
        var canBuy = balance >= msg.allianceCreatePrice;

        var chekNameIcon = "fa-check-circle-o succsess ";
        var notChekedIcon = "fa-question-circle-o check-undefined ";
        var invalidNameIcon = "fa-exclamation-circle error ";

        var nameIsUnic = false;
        var nameIsValid = false;

        function checkNameValid() {
            var errors = $scope.formCreateAlliance.allianceName.$error;
            if (!errors) return true;
            else if (errors.required || errors.minlength || errors.maxlength || errors.pattern) return false;
            else return true;
        }

        function checkAlianceName() {
            if (self.disabled) return;
            if (!nameIsValid) return;
            if (nameIsUnic) return;
            self.disabled = true;
            var chName = self.allianceName;
            var aNameForm = $scope.formCreateAlliance.allianceName;
            var deferred = $q.defer();
            allianceService.checkNameIsUnic(chName, deferred.resolve, deferred.reject);
            deferred.promise
                .then(function (isUnic) {
                    nameIsUnic = isUnic;
                    self.allianceName = chName.toUpperCase();
                    self.nameIcon = nameIsUnic ? chekNameIcon : invalidNameIcon;
                    aNameForm.$setValidity("notUnic", nameIsUnic);
                    aNameForm.$setValidity("notCeked", true);
                    self.disabled = false;
                },
                    function (errorAnswer) {
                        self.disabled = false;
                        if (errorAnswer === ErrorMsg.AllianceNameNotValid) $scope.formCreateAlliance.allianceName.$setValidity("pattern", false);
                    });


        }

        var checkBtn = paralaxButtonHelper.ButtonsView();
        checkBtn.ConstructorSizeBtn(4, true, msg.trCheck.getCurrent(), checkAlianceName);

        function onNameChange() {
            var alNameForm = $scope.formCreateAlliance.allianceName;
            nameIsValid = checkNameValid();
            nameIsUnic = false;
            self.nameIcon = nameIsValid ? notChekedIcon : invalidNameIcon;
            alNameForm.$setValidity("notCeked", false);
            alNameForm.$setValidity("notUnic", true);
        }

        function showConfirm(params, element, attrs, scope, $event) {
            if (!nameIsUnic) return;
            var aName = self.allianceName.toUpperCase();
            var confirm = $mdDialog.confirm()
                .title(msg.trConfirm.trTitle.getCurrent() + aName)
                .textContent(msg.trConfirm.trTextContent.getCurrent())
                .ariaLabel("default-dialog")
                .targetEvent($event)
                .ok(msg.trConfirm.trConfirm.getCurrent())
                .cancel(msg.trConfirm.trCancel.getCurrent());

            $mdDialog.show(confirm)
                .then(function () {
                    //confirm
                    allianceService.createAlliance(aName, true, function () {
                        //sucsses
                        $mdDialog.show(
                            $mdDialog.alert()
                            .title(msg.trConfirmGc.trTitle.getCurrent())
                            .ariaLabel("default-dialog")
                            .clickOutsideToClose(true)
                            .htmlContent(msg.trConfirmGc.trHtmlContent(aName))
                            .ok("Ok"));
                    },
                        function (errorMsg) {
                            //error
                            if (errorMsg === ErrorMsg.YouInAlliance) {
                                //   allianceService.updateAlliancePlanshet();
                                return;
                            }
                            if (errorMsg === ErrorMsg.AllianceNameNotValid) {
                                $scope.formCreateAlliance.allianceName.$setValidity("pattern", false);
                                return;
                            }
                            if (errorMsg === ErrorMsg.NotEnoughCc) {
                                self.canBuy = false;
                                return;
                            }
                            if (errorMsg === ErrorMsg.AllianceNameNotUnic) $scope.formCreateAlliance.allianceName.$setValidity("notUnic", false);

                            console.log("$mdDialog.sho", errorMsg);
                        }, resourceService);

                }, function () {
                    //cancel
                });
        }

        var sendBtn = paralaxButtonHelper.ButtonsView();
        sendBtn.ConstructorSizeBtn(1, true, msg.trCreate.getCurrent(), showConfirm);

        this.canBuy = canBuy;
        this.msgCanBuy = msg.trMsgCanBuy.trCanBuy.getCurrent();
        this.msgCantBuy = msg.trMsgCanBuy.trError.getCurrent();

        this.allianceName = "";
        this.disabled = false;
        this.nameIcon = notChekedIcon;
        this.complexButtonView = cb;
        this.createAllianceTitlle = msg.trAllianceTitlle.getCurrent();
        this.errorMsg = msg.trErrorMsg;
        this.checkBtn = checkBtn;
        this.onNameChange = onNameChange;
        this.sendBtn = sendBtn;


    }
]);

Utils.CoreApp.gameApp.controller("allianceMembersCtrl", [
    "$rootScope", "$scope", "allianceService", "dropableElementHelper", "translateService", "paralaxButtonHelper", "mainHelper", "profileService", "allianceDialogHelper",
    function ($rootScope, $scope, allianceService, dropableElementHelper, translateService, paralaxButtonHelper, mainHelper, profileService, allianceDialogHelper) {
        "user strict";
        var $self = this;
        var btnsFull = [paralaxButtonHelper.ButtonsView(), paralaxButtonHelper.ButtonsView()];
        $self._rolesView = {};
        $self._updateMembers = true;
        var creatorName = allianceService.getMyAllianceData().LeaderName;

        function deleteUser(params, element, attrs, scope, $event) {
            var member = params.member;
            var curRole = $self.crMemberRole;
            /*
             * кнопки быть не должно но так исторически сложилось что метод уже есть.
             */
            if (!curRole.Role.DeleteMembers) {
                allianceDialogHelper.openDialogNotPermitted($event);
                return;
            }
            if (curRole.UserId === member.UserId) return;// кнопки бытьне должно доп обработка не трубуется

            allianceService.dropUserFromAlliance(member.UserName, member.UserId, $event);
        }

        function updateUserRole(params, element, attrs, scope, $event) {
            var member = params.member;
            var curRole = $self.crMemberRole;
            var targetUserName = member.UserName;
            if (!curRole.Role.CanManagePermition) return;// не должна была загрузиться вью  доп обработка не трубуется
            if (member.UserId === curRole.UserId) return;// кнопки быть не должно   доп обработка не трубуется
            if (member.UserName === creatorName && member.Role.Id === allianceService.Role.roleNativeNames.CreatorId) return;   // кнопки быть не должно   доп обработка не трубуется

            var selectedRole = $self.selectedRoleModel;
            var roleTranslateNameToCSet = selectedRole.TranslateName;
            if (selectedRole.Id === member.Role.Id) {
                allianceDialogHelper.openDialogRoleNotChanged(targetUserName, roleTranslateNameToCSet, $event);
                return;
            }

            var roleTranslateNameBefore = $self.getTranslateRoleName(member.Role.RoleName);

            allianceDialogHelper
                .openDialogChangeRole(roleTranslateNameBefore, targetUserName, roleTranslateNameToCSet, $event)
                .then(function () {
                    //on confirm   
                    console.log("update user role", {
                        member: member,
                        selectedRole: selectedRole,
                        "selectRole": _.cloneDeep($self.allianceMembers.Roles[selectedRole.Id]),
                        roles: $self.selectRoles
                    });
                    allianceService.Role.requestUpdateUserRole(member.AllianceUserId, targetUserName, member.UserId, selectedRole.Id, roleTranslateNameToCSet, $event, $rootScope);
                },
                    function () {
                        console.log("Cancel");
                        //on Cancel
                    });

            console.log("updateUserRole", { member: member, selectRole: selectedRole, curRole: curRole });
        }

        function deleteUserBtn(member, size) {
            btnsFull[0].ConstructorSizeBtn(size, true, "deleteUserBtn", deleteUser, { member: member });
            return btnsFull[0];
        };

        function updateUserBtn(member, size) {
            btnsFull[1].ConstructorSizeBtn(size, true, "updateUserRoleBtn", updateUserRole, { member: member });
            return btnsFull[1];
        }

        function getManageBtns(member) {
            var role = $self.crMemberRole.Role;
            if (member.UserId === $self.crMemberRole.UserId) return [];
            else if (member.UserName === creatorName && role.Id !== allianceService.Role.roleNativeNames.CreatorId) return [];
            else if (role.DeleteMembers && role.CanManagePermition) return [deleteUserBtn(member, 3), updateUserBtn(member, 3)];
            else if (role.DeleteMembers) return [deleteUserBtn(member, 1)];
            else if (role.CanManagePermition) return [updateUserBtn(member, 1)];
            else return [];
        }

        Object.defineProperty($self, "updateMembers", {
            get: function () {
                if ($self._updateMembers) {
                    $self._updateMembers = false;
                    return true;
                }
                return false;
            }
        });

        $self.getProfileInfo = function (userId) {
            profileService.setProfile(userId);
        };
        $self.onLinkHover = function() {
            EM.Audio.GameSounds.defaultHover.play();
        };

        $self.getRolePropsView = function (roleId) {
            return $self._rolesView[roleId];
        };
        $self.getManageBtns = getManageBtns;


        function load() {
            mainHelper.applyTimeout(function () {
                $self.allianceMembers = allianceService.getMyAllianceMembers();
                $self.members = $self.allianceMembers.Members;

                var membersCount = _.size($self.members);
                if (!$self.memberCount || $self.memberCount !== membersCount) {
                    $self.memberCount = membersCount;
                    $self._updateMembers = true;
                }
                var trRoles = $self.allianceMembers.TranslateRoleNames;

                $self.crMemberRole = allianceService.getCurrentUserMemberFromMembers($self.members);

                $self.getTranslateRoleName = function (roleName) {
                    return allianceService.Role.getTranslateRoleName(trRoles, roleName);
                };

                $self.selectRoles = allianceService.Role.createSelectRoles(trRoles);

                $self.selectedRoleModel = null;
                $self.setInitialSelectedRole = function (roleId) {
                    $self.selectedRoleModel = _.find($self.selectRoles, function (o) {
                        return o.Id === roleId;
                    });
                };


                $self.roleDescription = "";
                $self.memberSettingToggle = function (member) {
                    if (!member.hasOwnProperty("setting")) member.setting = dropableElementHelper.create();
                    if (!$self.selectedRoleModel || $self.selectedRoleModel.Id !== member.Role.Id) $self.setInitialSelectedRole(member.Role.Id);
                    member.setting.toggle();
                    $self.roleDescription = $self.allianceMembers.Roles[member.Role.Id].translateRoleHtmlDescription;

                };

                allianceService.Role.initRolesView($self._rolesView, $self.allianceMembers.Roles);

                $self.onselectedRoleChange = function (roleId) {
                    $self.roleDescription = $self.allianceMembers.Roles[$self.selectedRoleModel.Id].translateRoleHtmlDescription;

                }


            });

        }

        load();

        $scope.$watch("amCtrl.serchMemberRequest", function (newVal, oldVal) {
            if (newVal !== oldVal) {
                //    console.log(" $scope.$watch(amCtrl.serchMemberRequest");
                $scope.$emit("dropElementContainer:changeHeight");
            }
        });
        $scope.$watch("amCtrl.onlyOnline", function (newVal, oldVal) {
            if (newVal !== oldVal) {
                // console.log(" $scope.$watch(amCtrl.onlyOnline");
                $scope.$emit("dropElementContainer:changeHeight");

            }
        });

        $scope.$on("planshet:update", function (evt) {
            if (allianceService.isCurrentModel()) {
                $self._updateMembers = true;
                load();
            }
        });



        $scope.$on("alliance:user-left-from-alliance", function (event, data) {
            if (allianceService.isCurrentModel()) {
                $self._updateMembers = true;
                load();
                var leftAllianceId = data.leftAllianceId;
                var leftUserId = data.leftUserId;
            }

        });

        $scope.$on("alliance:user-join-to-alliance", function (e, t) {
            if (allianceService.isCurrentModel()) {
                $self._updateMembers = true;
                load();
            }

        });

        $scope.$on("$destroy", function () {
            $scope.amCtrl = null;
            delete $scope.amCtrl;
        });
    }
]);

Utils.CoreApp.gameApp.controller("allianceTechCtrl", ["$scope", "allianceService",
function ($scope, allianceService) {
    "user strict";
    var $self = this;
    this.$data = allianceService.getMyAllianceData();  
    this.BalanceCCTitle = "Alliance balance CC : ";
    this.TechList = allianceService.prepareTechList(this.$data);
   // console.log("allianceTechCtrl", $scope);
    $scope.$on("alliance:tech-updated", function (event,data) {
        $self.$data = data.myAllianceData;
        $self.TechList = allianceService.prepareTechList($self.$data);
    });
}
]);


Utils.CoreApp.gameApp.controller("allianceManageCtrl", ["$scope", "allianceService", "mainHelper",
    function ($scope, allianceService, mainHelper) {
        var $self = this;
        $self.notPermitted = true;
        $self.canDeleteAlliance = false;
        function load(am) {
            var allianceMembers = allianceService.getMyAllianceMembers();
            var menageTabData = allianceService.getManageTabData();
            if (!menageTabData || !allianceMembers || !allianceMembers.Members) return;
            if (am && $self._crAm && $self._crAm.AllianceUserId !== am.AllianceUserId) return;
            var currentAllianceUser = $self._crAm = am || allianceService.getCurrentUserMemberFromMembers(allianceMembers.Members);
            var role = currentAllianceUser.Role;
            mainHelper.applyTimeout(function () {
                //  this.getManageCompexBtn = allianceService.getManageCompexBtn;
                $self.permitions = role;
                $self.notPermitted = !(role.AcceptNewMembers || role.EditAllianceInfo || role.SetTech);
                //delete allaince
                $self.canDeleteAlliance = menageTabData.CanDeleteAlliance;
                if (menageTabData.CanDeleteAlliance) $self.disbandAlliance = menageTabData.DisbandAllianceBtn;

            });

        }
        load();

        $scope.$on("alliance:user-role-updated", function (event, data) {
            if (allianceService.isCurrentModel()) load(data.allianceMember);
        });

        $scope.$on("planshet:update", function (evt) {
            if (allianceService.isCurrentModel()) load();
        });
        $scope.$on("$destroy", function () {
            $scope.alManage = null;
            delete $scope.alManage;
        });

    }
]);


//http://codepen.io/kuhnroyal/pen/gPvdPp
Utils.CoreApp.gameApp.controller("allianceManageRequestCtrl", [
    "$scope", "allianceService", "dropableElementHelper", "profileService", "$timeout",
    function ($scope, allianceService, dropableElementHelper, profileService, $timeout) {
        var $self = this;
        function load() {
            var curUserData = allianceService.$currentUserInfo;
            var manageTabData = allianceService.getManageTabData();
            var allianceUserRequests = manageTabData.AllianceUserRequests;
            var skipParent = 4;
            $self.auRequestsLoaded = false;
            $self.requests = allianceUserRequests.Requests;
            $self.complexButtonView = allianceUserRequests.ComplexButtonView;

            $self.onClickCbRequests = function ($event) {
                $scope.dropElementonClickByDropable(skipParent);
            }
            $self.currentAllianceName = curUserData.allianceName;

            $self.getProfileInfo = function (userId) {
                profileService.setProfile(userId);
            };

            $self.requestToggle = function (request) {
                var hasBv = request.hasOwnProperty("ButtonsView");
                //|| request.AllianceAccepted
                if (!hasBv) {
                    allianceService.createAllianceManageRequestBtns(request);
                    $timeout(function () {
                        request.dropable.toggle(function () {
                            $scope.$emit("dropElementContainer:changeHeight");
                        });
                    }, 50);
                }
                else {
                    request.dropable.toggle(function () {
                        $scope.$emit("dropElementContainer:changeHeight");
                    });
                }
            }

        }

        load();
        $scope.$on("alliance:user-role-updated", function (event, data) {
            if (!data.IsCurrentUser || !data.allianceMember.Role.AcceptNewMembers) return;
            if (allianceService.isCurrentModel()) load();
        });


    }
]);

Utils.CoreApp.gameApp.controller("allianceRequestSendMsgCtrl", [
    "$scope", "$mdDialog",
    function ($scope, $mdDialog) {
        var $self = this;
        this.title = $self._title || "Create Message";
        this.from = $self._fromName;
        this.to = $self._toName;
        this.message = $self._message;
        this.messageMaxLength = $self._maxLength || 1000;
        this.messageMinLength = $self._minLength || 5;
        this.send = function () {
            $mdDialog.hide($self.message);
        }
        this.cancel = function () {
            $mdDialog.cancel();
        }
    }
]);

Utils.CoreApp.gameApp.controller("allianceUserRequestsCtrl", [
    "$scope", "allianceService", "$timeout",
    function ($scope, allianceService, $timeout) {
        var data = allianceService.getRequestsFromMyAlliance();
        var curUserData = allianceService.$currentUserInfo;
        this.currentUserName = curUserData.userName;
        this.data = data;
        this.requests = data.Requests;
        this.requestToggle = function (request) {
            var hasBv = request.hasOwnProperty("ButtonsView") && request.ButtonsView;
            //|| request.AllianceAccepted
            if (!hasBv) {
                allianceService.createMyAllianceRequestBtns(request);
                $timeout(function () {
                    request.dropable.toggle(function () {
                        $scope.$emit("dropElementContainer:changeHeight");
                    });
                }, 50);
            }
            else {
                request.dropable.toggle(function () {
                    $scope.$emit("dropElementContainer:changeHeight");
                });
            }

        }
        // #endregion


    }
]);

Utils.CoreApp.gameApp.controller("allianceEditInfoCtrl", ["$scope", "allianceService", "mainHelper", function ($scope, allianceService, mainHelper) {
    var $self = this;
    var skipParent = 4;
    function load(evt) {
        allianceService.setEditAllianceInfoModelToScope($self, $scope, skipParent);
        //mainHelper.applyAsync(function () {

        //});  
    }
    load();
    $scope.$on("planshet:update", function (evt) {
        if (allianceService.isCurrentModel()) load(evt);
    });
    $scope.$on("$destroy", function () {
        $scope.aeiCtrl = null;
        delete $scope.alManage;
    });

}]);
