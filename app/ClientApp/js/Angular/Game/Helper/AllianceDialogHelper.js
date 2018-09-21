Utils.CoreApp.gameApp.service("allianceDialogHelper", ["baseDialogHelper", "maxLenghtConsts",
    function (baseDialogHelper, maxLenghtConsts) {
        //todo delete after
        GameServices.$adH = this;
        var supLangs = baseDialogHelper.supportedLangs;
        var cssSelectName = baseDialogHelper.cssSelectName;
        var defaultTheme = baseDialogHelper.defaultTheme;
 
        var $mdDialog = baseDialogHelper.$$mdDialog;
        var setSpanText = baseDialogHelper.setSpanText;

 

        //#region sendRequestJoinToAlliance
        function getTextUserHasAlliance(allianceName) {
            if (LANG === supLangs.Ru) {
                return setSpanText("Вы уже состоите в альянсе  " + setSpanText(allianceName, cssSelectName) + "<br> " +
                    "запустите процедуру выхода из текущего альянса, <br>" +
                    "дождитесь  окончания блокировки (не менее 24 часов) ");
            }
            else if (LANG === supLangs.Es) {
                return setSpanText("Es Вы уже состоите в альянсе  " + setSpanText(allianceName, cssSelectName) + "<br>  " +
                    "запустите процедуру выхода из текущего альянса, <br>" +
                    "дождитесь  окончания блокировки (не менее 24 часов) ");
            }
            else {
                return setSpanText("En Вы уже состоите в альянсе  " + setSpanText(allianceName, cssSelectName) + "<br>" +
                    "запустите процедуру выхода из текущего альянса, <br> " +
                    "дождитесь  окончания блокировки (не менее 24 часов) ");
            }
        }

        function getTextJoinMessageSended(allianceName) {

            if (LANG === supLangs.Ru) return setSpanText("Ваша заявка в альянс  " + setSpanText(allianceName, cssSelectName) + " принята ");
            else if (LANG === supLangs.Es) return setSpanText("Es Ваша заявка в альянс  " + setSpanText(allianceName, cssSelectName) + " принята ");
            else return setSpanText("En Ваша заявка в альянс  " + setSpanText(allianceName, cssSelectName) + " принята ");
        }

        function getTextDeleteUserRequestToAlliance(allianceName) {
            if (LANG === supLangs.Ru) return setSpanText("Ваша заявка в альянс  " + setSpanText(allianceName, cssSelectName) + " и вся переписка будет удалена <br> Хотите подтвердить удаление? ");
            else if (LANG === supLangs.Es) return setSpanText("Es Ваша заявка в альянс   " + setSpanText(allianceName, cssSelectName) + " и вся переписка будет удалена <br> Хотите подтвердить удаление?  ");
            else return setSpanText("En Ваша заявка в альянс   " + setSpanText(allianceName, cssSelectName) + "  и вся переписка будет удалена <br> Хотите подтвердить удаление? ");
        }

        function getTextUserCantJoinToAllianceBecauseInBlockedState(dateTimeTimeToDone) {
            if (LANG === supLangs.Ru) return setSpanText("Вы не можете принять новую заявку до окончания блокиовки. <br> До окончания блокировки осталость " + setSpanText(dateTimeTimeToDone, cssSelectName));
            else if (LANG === supLangs.Es) return setSpanText("ES Вы не можете принять новую заявку до окончания блокиовки. <br> До окончания блокировки осталость " + setSpanText(dateTimeTimeToDone, cssSelectName));
            else return setSpanText("EN Вы не можете принять новую заявку до окончания блокиовки. <br> До окончания блокировки осталость " + setSpanText(dateTimeTimeToDone, cssSelectName));
        }

        function errorUserCantJoinToAllianceBecauseInBlockedState(dateTimeTimeToDone) {
            return $mdDialog.show(
                $mdDialog.alert()
                .ariaLabel(defaultTheme)
                .clickOutsideToClose(true)
                .title("Join to alliance in block")
                .htmlContent(getTextUserCantJoinToAllianceBecauseInBlockedState(dateTimeTimeToDone))
                .ok("Ok!")
                .openFrom({
                    width: 1,
                    height: 1
                }));
        }

        function errorUserInAlliance(currentAllianceName) {
            $mdDialog.show(
                $mdDialog.alert()
                .ariaLabel(defaultTheme)
                .clickOutsideToClose(true)
                .title("Error")
                .htmlContent(getTextUserHasAlliance(currentAllianceName))
                .ok("Ok!")
                .openFrom({
                    width: 1,
                    height: 1
                }));
        }

        function errorJoinToAlliance(errorAnswer, allianceId, toAllianceName, allianceService) {
            console.log("errorJoinToAlliance", {
                allianceName: toAllianceName,
                allianceId: allianceId,
                errorAnswer: errorAnswer,
                allianceService: allianceService
            });
        }

        function openDialogJoinMessageSended(allianceName) {
            return $mdDialog.show(
                $mdDialog.alert()
                .clickOutsideToClose(true)
                .title("Sucsess")
                .htmlContent(getTextJoinMessageSended(allianceName))
                .ariaLabel(defaultTheme)
                .ok("Ok!")
                .openFrom({
                    width: 1,
                    height: 1
                }));
        }

        function openDialogSendMessage(armModelExt, onSend, updateBlockedState, $event) {
            updateBlockedState(true);
            $mdDialog.show({
                templateUrl: "dialog-alliance-send-msg.tmpl",
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                fullscreen: true,
                locals: {
                    _fromName: armModelExt.Model.FromName,
                    _toName: armModelExt.Model.ToName,
                    _maxLength: 1000,
                    _minLength: 2,
                    _title: null,
                    updateBlockedState: updateBlockedState

                },
                controller: "allianceRequestSendMsgCtrl",
                bindToController: true,
                controllerAs: "arsmCtrl"
            })
                .then(function (message) {
                    console.log("message", message);
                    //onOk
                    if (message && message.length > 1000) {
                        console.log("message length > 1000", { message: message });
                        // todo show error message
                        return;
                    }
                    armModelExt.Model.Message = message;
                    onSend();
                    updateBlockedState(false);
                }, function () {
                    //onCancel
                    console.log("createMessageToAlliance onCancel");
                    updateBlockedState(false);
                });
        }

        function openDialogDeleteUserRequestToAlliance(toAllianceName, onSend, updateBlockedState, $event) {
            updateBlockedState(true);
            var confirm = $mdDialog.confirm()
                .ariaLabel(defaultTheme)
                .title("Confirm")
                .htmlContent(getTextDeleteUserRequestToAlliance(toAllianceName))
                .ok("Confirm")
                .cancel("Cancel")
                .targetEvent($event);

            $mdDialog
                .show(confirm)
                .then(function () {
                    onSend(updateBlockedState);
                }, function () {
                    updateBlockedState(false);
                });
        }

        this.errorUserInAlliance = errorUserInAlliance;
 
        this.openDialogJoinMessageSended = openDialogJoinMessageSended;
        this.errorJoinToAlliance = errorJoinToAlliance;
        this.openDialogSendMessage = openDialogSendMessage;
        this.openDialogDeleteUserRequestToAlliance = openDialogDeleteUserRequestToAlliance;
        this.errorUserCantJoinToAllianceBecauseInBlockedState = errorUserCantJoinToAllianceBecauseInBlockedState;


        var _titleOpenDialogAllianceManageRefuseMemberRequest;

        function getTitleOpenDialogAllianceManageRefuseMemberRequest() {
            if (!_titleOpenDialogAllianceManageRefuseMemberRequest) {
                _titleOpenDialogAllianceManageRefuseMemberRequest = Utils.CreateLangSimple("EN Удаление заявки",
                    "ES Удаление заявки",
                    "RU Удаление заявки");
            }
            return _titleOpenDialogAllianceManageRefuseMemberRequest.getCurrent();
        }

        function getTextopenDialogAllianceManageRefuseMemberRequest(targetUserName) {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU Заявка от пользователя   -" + setSpanText(targetUserName, cssSelectName) + " будет удалена. <br> Подтвердить действие? ");
            }
            else if (LANG === supLangs.Es) {
                return setSpanText("ES  Заявка от пользователя   -" + setSpanText(targetUserName, cssSelectName) + " будет удалена. <br> Подтвердить действие? ");
            }
            else {
                return setSpanText("EN  Заявка от пользователя   -" + setSpanText(targetUserName, cssSelectName) + " будет удалена. <br> Подтвердить действие? ");
            }

        }

        this.openDialogAllianceManageRefuseMemberRequest = function (targetUserName, $event) {
            var confirm = $mdDialog.confirm()
                .title(getTitleOpenDialogAllianceManageRefuseMemberRequest())
                .htmlContent(getTextopenDialogAllianceManageRefuseMemberRequest(targetUserName))
                .ariaLabel("default-dialog")
                .targetEvent($event)
                .ok("Ok")
                .cancel("Cancel");
            return $mdDialog.show(confirm);
        }


        //#endregion

        //#region leaveAlliance

        function getTextLeaveConfirm(fromAllianceName) {
            if (LANG === supLangs.Ru) return setSpanText("Вы дейсттвительно хотите выйти из  " + setSpanText(fromAllianceName, cssSelectName));
            else if (LANG === supLangs.Es) return setSpanText("Es Вы дейсттвительно хотите выйти из  " + setSpanText(fromAllianceName, cssSelectName));
            else return setSpanText("En Вы дейсттвительно хотите выйти из  " + setSpanText(fromAllianceName, cssSelectName));
        }

        function getTextLeaveOnLeave(fromAllianceName) {
            if (LANG === supLangs.Ru) return setSpanText("Вы вышли из альянса " + setSpanText(fromAllianceName, cssSelectName) + "  и вошли в режим блокировки, <br> через 24 часа вы сможете подать новую заявку в альянс ");
            else if (LANG === supLangs.Es) return setSpanText("es Вы вышли из альянса " + setSpanText(fromAllianceName, cssSelectName) + "  и вошли в режим блокировки, <br> через 24 часа вы сможете подать новую заявку в альянс ");
            else return setSpanText("en Вы вышли из альянса " + setSpanText(fromAllianceName, cssSelectName) + "  и вошли в режим блокировки, <br> через 24 часа вы сможете подать новую заявку в альянс ");
        }

        function getTextLeaveLeader(fromAllianceName) {
            if (LANG === supLangs.Ru) return setSpanText("Вы действующией лидер альянса " + setSpanText(fromAllianceName, cssSelectName) + "<br> Переназначте лидера, или распустите альянс и повторите попытку ");
            else if (LANG === supLangs.Es) return setSpanText("es Вы действующией лидер альянса " + setSpanText(fromAllianceName, cssSelectName) + "<br> Переназначте лидера, или распустите альянс и повторите попытку ");
            else return setSpanText("en Вы действующией лидер альянса " + setSpanText(fromAllianceName, cssSelectName) + "<br> Переназначте лидера, или распустите альянс и повторите попытку ");
        }

        function openDialogleaveFromAlliance(fromAllianceName) {
            var confirm = $mdDialog.confirm()
                .ariaLabel(defaultTheme)
                .title("Confirm")
                .htmlContent(getTextLeaveConfirm(fromAllianceName))
                .ok("Confirm")
                .cancel("Cancel");

            return $mdDialog.show(confirm);
        };

        function openDialogOnLeaveFromUserAlliance(fromAllianceName) {
            return $mdDialog.show(
                $mdDialog.alert()
                .ariaLabel(defaultTheme)
                .clickOutsideToClose(true)
                .title("Warn")
                .htmlContent(getTextLeaveOnLeave(fromAllianceName))
                .ok("Ok!")
                .openFrom({
                    width: 1,
                    height: 1
                }));

        }

        function openDialogLeaveLeader(fromAllianceName) {
            return $mdDialog.show(
                $mdDialog.alert()
                .ariaLabel(defaultTheme)
                .clickOutsideToClose(true)
                .title("Sucsess")
                .htmlContent(getTextLeaveLeader(fromAllianceName))
                .ok("Ok!")
                .openFrom({
                    width: 1,
                    height: 1
                }));
        }

        this.openDialogleaveFromAlliance = openDialogleaveFromAlliance;
        this.openDialogOnLeaveFromUserAlliance = openDialogOnLeaveFromUserAlliance;
        this.openDialogLeaveLeader = openDialogLeaveLeader;

        //#endregion

        // #region openDialogDropUserFromAlliance

        var _titleDropUserFromAlliance;

        function getTitleDropUserFromAlliance() {
            if (!_titleDropUserFromAlliance) {
                _titleDropUserFromAlliance = Utils.CreateLangSimple("EN Drop user",
                    "ES  Drop user",
                    "RU  Drop user");
            }
            return _titleDropUserFromAlliance.getCurrent();

        }

        function getTextDropUserFromAlliance(targetDropUserName) {
            if (LANG === supLangs.Ru) return setSpanText("RU Вы удаляете пользователя " + setSpanText(targetDropUserName, cssSelectName) + " из состава вашего альянса, подтвердить действие?");
            else if (LANG === supLangs.Es) return setSpanText("ES Вы удаляете пользователя " + setSpanText(targetDropUserName, cssSelectName) + " из состава вашего альянса, подтвердить действие?");
            else return setSpanText("EN Вы удаляете пользователя " + setSpanText(targetDropUserName, cssSelectName) + " из состава вашего альянса, подтвердить действие?");

        }

        this.openDialogDropUserFromAlliance = function (targetDropUserName, $event) {
            var confirm = $mdDialog.confirm()
                .title(getTitleDropUserFromAlliance())
                .htmlContent(getTextDropUserFromAlliance(targetDropUserName))
                .ariaLabel(defaultTheme)
                .targetEvent($event)
                .ok("Confirm")
                .cancel("Cancel");
            return $mdDialog.show(confirm);
        };
        // #endregion

        // #region openDialogDisbandAlliance

 
        function getTextDisbandAlliance(targetAllianceName) {      
            if (LANG === supLangs.Ru) return setSpanText("EN Вы " + setSpanText("удаляете альянс " + targetAllianceName, cssSelectName) + " <br> после удаления вы не сможете восстановить или создать  альянс с имнем " + setSpanText(targetAllianceName, cssSelectName) + "<br> подтвердить удаление?");
            else if (LANG === supLangs.Es) return setSpanText("ES Вы " + setSpanText("удаляете альянс " + targetAllianceName, cssSelectName) + " <br> после удаления вы не сможете восстановить или создать  альянс с имнем " + setSpanText(targetAllianceName, cssSelectName) + "<br> подтвердить удаление?");
            else return setSpanText("EN Вы " + setSpanText("удаляете альянс " + targetAllianceName, cssSelectName) + " <br> после удаления вы не сможете восстановить или создать  альянс с имнем " + setSpanText(targetAllianceName, cssSelectName) + "<br> подтвердить удаление?");
        }

        this.openDialogDisbandAlliance = function (targetAllianceName, $event) {
            var confirm = $mdDialog.confirm()
           .title(baseDialogHelper.titleImportant())
           .htmlContent(getTextDisbandAlliance(targetAllianceName))
           .ariaLabel(defaultTheme)
           .targetEvent($event)
           .ok("Delete --" + targetAllianceName+"--")
           .cancel("Cancel");

            return $mdDialog.show(confirm);
        }

        // #endregion


        //#region RequestJoinToAlliance
        function getTextAllianceManageTargetUserInAlliance(targetUserName) {
            if (LANG === supLangs.Ru) {
                return setSpanText("пользователь " + setSpanText(targetUserName, cssSelectName) + " уже состоит в альянсе. Удалить заявку?");
            }
            else if (LANG === supLangs.Es) {
                return setSpanText("ES пользователь " + setSpanText(targetUserName, cssSelectName) + " уже состоит в альянсе. Удалить заявку?");
            }
            else {
                return setSpanText("EN пользователь " + setSpanText(targetUserName, cssSelectName) + " уже состоит в альянсе. Удалить заявку?");
            }
        }

        /**
         * 
         * @param {string} targetUserName 
         * @returns {object} deferred (angular $q promise)
         */
        function errorAllianceManageTargetUserInAlliance(targetUserName) {
            var confirm = $mdDialog.confirm()
                .ariaLabel(defaultTheme)
                .title("User in alliance")
                .htmlContent(getTextAllianceManageTargetUserInAlliance(targetUserName))
                .ok("Confirm")
                .cancel("Cancel");
            return $mdDialog.show(confirm);
        }

        this.errorAllianceManageTargetUserInAlliance = errorAllianceManageTargetUserInAlliance;


        //#endregion

        // #region onRequestAllianceConfirmAcceptToAllianceForUser

        function getTextOnRequestAllianceConfirmAcceptToAllianceForUser(toAllianceName) {
            if (LANG === supLangs.Ru) {
                return setSpanText("Ваша заявка в альянс " + setSpanText(toAllianceName, cssSelectName) + " рассмотренна и принята. <br> Подтвердить вступление сейчас  или сделать это позднее?");
            }
            else if (LANG === supLangs.Es) {
                return setSpanText("ES Ваша заявка в альянс " + setSpanText(toAllianceName, cssSelectName) + " рассмотренна и принята. <br> Подтвердить вступление сейчас  или сделать это позднее?");
            }
            else {
                return setSpanText("EN Ваша заявка в альянс " + setSpanText(toAllianceName, cssSelectName) + " рассмотренна и принята. <br> Подтвердить вступление сейчас  или сделать это позднее?");
            }
        }

        function onRequestAllianceConfirmAcceptToAllianceForUser(toAllianceName) {
            var confirm = $mdDialog.confirm()
                .ariaLabel(defaultTheme)
                .title("Accepted")
                .htmlContent(getTextOnRequestAllianceConfirmAcceptToAllianceForUser(toAllianceName))
                .ok("Now")
                .cancel("Late");
            return $mdDialog.show(confirm);
        }

        this.onRequestAllianceConfirmAcceptToAllianceForUser = onRequestAllianceConfirmAcceptToAllianceForUser;
        // #endregion


        // #region changeTax
        var _titleOpenDialogChengeTax;

        function getTitleOpenDialogChengeTax() {
            if (!_titleOpenDialogChengeTax) {
                _titleOpenDialogChengeTax = Utils.CreateLangSimple("EN Change Tax", "ES Change Tax", "RU Change Tax");
            }
            return _titleOpenDialogChengeTax.getCurrent();
        }

        function openDialogChengeTax(currentTax, $event) {
            var confirm = $mdDialog.prompt()
                .title(getTitleOpenDialogChengeTax())
                //.textContent("Bowser is a common name.")
                .placeholder(currentTax)
                .ariaLabel(defaultTheme)
                .initialValue(currentTax)
                .targetEvent($event)
                .ok("Ok")
                .cancel("Cancel");
            return $mdDialog.show(confirm);
        }

        this.openDialogChengeTax = openDialogChengeTax;

        // #endregion

        // #region OpenDialogNotPermitted
        this.openDialogNotPermitted = baseDialogHelper.openDialogNotPermitted;
        // #endregion

        // #region Role

        // #region openDialogChangeRole
        var _titleOpenDialogChangeRole;

        function getTitleOpenDialogChangeRole() {
            if (!_titleOpenDialogChangeRole) {
                _titleOpenDialogChangeRole = Utils.CreateLangSimple("EN Alliance member change Role",
                    "ES Alliance member change Role",
                    "RU Alliance member change Role");
            }

            return _titleOpenDialogChangeRole.getCurrent();
        }

        function getTextOpenDialogChangeRole(roleNameBefore, toUserName, roleNameToCSet) {
            if (LANG === supLangs.Ru) return setSpanText("Обновить текущую роль  -" + setSpanText(roleNameBefore, cssSelectName) + " для пользователя  " + setSpanText(toUserName, cssSelectName) + " на роль - " + setSpanText(roleNameToCSet, cssSelectName) + " ?");
            else if (LANG === supLangs.Es) return setSpanText("Обновить текущую роль  -" + setSpanText(roleNameBefore, cssSelectName) + " для пользователя  " + setSpanText(toUserName, cssSelectName) + " на роль - " + setSpanText(roleNameToCSet, cssSelectName) + " ?");
            else return setSpanText("Обновить текущую роль  -" + setSpanText(roleNameBefore, cssSelectName) + " для пользователя  " + setSpanText(toUserName, cssSelectName) + " на роль - " + setSpanText(roleNameToCSet, cssSelectName) + " ?");
        }

        this.openDialogChangeRole = function (translateRoleNameBefore, toUserName, translateRoleNameToSet, $event) {
            var confirm = $mdDialog.confirm()
                .title(getTitleOpenDialogChangeRole())
                .htmlContent(getTextOpenDialogChangeRole(translateRoleNameBefore, toUserName, translateRoleNameToSet))
                .ariaLabel(defaultTheme)
                .targetEvent($event)
                .ok("Ok")
                .cancel("Cancel");
            return $mdDialog.show(confirm);
        };


        // #endregion

        // #region openDialogRoleNotChanged

        function getTextOpenDialogRoleNotChanged(targetUserName, targetTranslatedRoleName) {
            if (LANG === supLangs.Ru) return setSpanText("RU Пользователю " + setSpanText(targetUserName, cssSelectName) + " уже назначенна роль " + setSpanText(targetTranslatedRoleName, cssSelectName));
            else if (LANG === supLangs.Es) return setSpanText("ES Пользователю " + setSpanText(targetUserName, cssSelectName) + " уже назначенна роль " + setSpanText(targetTranslatedRoleName, cssSelectName));
            else return setSpanText("En Пользователю " + setSpanText(targetUserName, cssSelectName) + " уже назначенна роль " + setSpanText(targetTranslatedRoleName, cssSelectName));

        }

        this.openDialogRoleNotChanged = function (targetUserName, targetTranslatedRoleName, $event) {
            return $mdDialog.show(
                $mdDialog.alert()
                .title("Alliance role")
                .targetEvent($event)
                .htmlContent(getTextOpenDialogRoleNotChanged(targetUserName, targetTranslatedRoleName))
                .ariaLabel(defaultTheme)
                .clickOutsideToClose(true)
                .ok("Ok!"));
        };

        // #endregion  


        // #region openDialogRoleUpdated
        var _titleOpenDialogRoleUpdated;

        function getTitleOpenDialogRoleUpdated() {
            if (!_titleOpenDialogRoleUpdated) {
                _titleOpenDialogRoleUpdated = Utils.CreateLangSimple("EN Alliance member change Role",
                                                                     "ES Alliance member change Role",
                                                                      "RU Alliance member change Role");
            }
            return _titleOpenDialogRoleUpdated.getCurrent();
        }


        function getTextOpenDialogRoleUpdated(targetUserName, newTranslatedRoleName) {
            if (LANG === supLangs.Ru) return setSpanText("RU Польззователю " + setSpanText(targetUserName, cssSelectName) + " назначена новая роль - " + setSpanText(newTranslatedRoleName, cssSelectName));
            else if (LANG === supLangs.Es) return setSpanText("ES Польззователю " + setSpanText(targetUserName, cssSelectName) + " назначена новая роль - " + setSpanText(newTranslatedRoleName, cssSelectName));
            else return setSpanText("EN Польззователю " + setSpanText(targetUserName, cssSelectName) + " назначена новая роль - " + setSpanText(newTranslatedRoleName, cssSelectName));

        }

        this.openDialogRoleUpdated = function (targetUserName, newTranslatedRoleName, $event) {
            return $mdDialog.show($mdDialog
                .alert()
                .title(getTitleOpenDialogRoleUpdated())
                .ariaLabel(defaultTheme)
                .targetEvent($event)
                .clickOutsideToClose(true)
                .htmlContent(getTextOpenDialogRoleUpdated(targetUserName, newTranslatedRoleName))
                .ok("Ok"));
        };
        // #endregion



        // #endregion

        // #region errorOverMaxLength
        this.errorDescriptionOverMaxLength = function ($event, currentMessageLenght) {

            return baseDialogHelper.errorOverMaxLength($event, currentMessageLenght, maxLenghtConsts.AllianceDescription);
        }
        // #endregion


        // #region openDiaologConfirmTechUpgrade
        function getTextOpenDiaologConfirmTechUpgrade(targetTranslatedRoleName, newLevel) {
            if (LANG === supLangs.Ru) return setSpanText("RU Обновить технологию  " + setSpanText(targetTranslatedRoleName, cssSelectName) + " до уровня " + setSpanText(newLevel, cssSelectName)  +"?");
            else if (LANG === supLangs.Es) return setSpanText("ES Обновить технологию  " + setSpanText(targetTranslatedRoleName, cssSelectName) + " до уровня " + setSpanText(newLevel, cssSelectName) + "?");
            else return setSpanText("EN  Обновить технологию  " + setSpanText(targetTranslatedRoleName, cssSelectName) + " до уровня " + setSpanText(newLevel, cssSelectName) + "?");

        }

        this.openDiaologConfirmTechUpgrade = function($event, techName, nextLevel) {
            var confirm = $mdDialog.confirm()
               .title("Alliance : update tech")
               .htmlContent(getTextOpenDiaologConfirmTechUpgrade(techName, nextLevel))
               .ariaLabel(defaultTheme)
               .targetEvent($event)
               .ok("Update")
               .cancel("Cancel");
            return $mdDialog.show(confirm);
        };


        // #endregion



        // #region openDiaologConfirmTechUpgrade
        function getTextopenDiaologTechUpgraded(targetTranslatedRoleName, newTechLevel) {
            if (LANG === supLangs.Ru) return setSpanText("RU Технология  " + setSpanText(targetTranslatedRoleName, cssSelectName) + " успешно обновлена до уровня " + setSpanText(newTechLevel, cssSelectName));
            else if (LANG === supLangs.Es) return setSpanText("ES Технология  " + setSpanText(targetTranslatedRoleName, cssSelectName) + " успешно обновлена до уровня " + setSpanText(newTechLevel, cssSelectName));
            else return setSpanText("EN Технология  " + setSpanText(targetTranslatedRoleName, cssSelectName) + " успешно обновлена до уровня " + setSpanText(newTechLevel, cssSelectName));

        }

        this.openDiaologTechUpgraded = function ($event, techName, newTechLevel) {
            return $mdDialog.show($mdDialog
                .alert()
                .title("Alliance :  tech upgraded")
                .ariaLabel(defaultTheme)
                .targetEvent($event)
                .clickOutsideToClose(true)
                .htmlContent(getTextopenDiaologTechUpgraded(techName, newTechLevel))
                .ok("Ok"));
        };


        // #endregion



    }
]);