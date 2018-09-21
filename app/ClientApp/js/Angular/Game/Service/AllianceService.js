Utils.CoreApp.gameApp.service("allianceService", [
    "planshetService",
    "tabService",
    "scrollerHelper",
    "mainHelper",
    "statisticHelper",
    "profileService",
    "allianceDialogHelper",
    "npcHelper",
    "timerHelper",
    "$q",
    "$mdDialog",
    "$timeout",
    "maxLenghtConsts",
    function (planshetService, tabService, scrollerHelper, mainHelper, statisticHelper, profileService, allianceDialogHelper, npcHelper, timerHelper, $q, $mdDialog, $timeout, maxLenghtConsts) {
        //#region Declare
        var $self = this;
        var alliancePlanshetModel = {};
        var mf = Utils.ModelFactory;
        var alianceUniqueId;

        var addItemInAllianceList = null;
        var hasItemInAllianceList = null;
        var allianceNames;


        var _allianceTotalCount = 0;
        var _allianceUserTotalCount = 0;

        Object.defineProperty($self, "_allianceTotalCount", {
            get: function () {
                //console.log("_allianceTotalCount.get.before", {
                //    _allianceTotalCount: _allianceTotalCount,
                //    _allianceUserTotalCount: _allianceUserTotalCount,
                //    allianceNames: allianceNames
                //});
                if (_allianceUserTotalCount !== $self._scrollerOptions.TotalServerCount) {
                    var col = _.filter(allianceNames, function (o) {
                        return !o.Disbandet && o.Id >= 1000;
                    });

                    $self._scrollerOptions.TotalServerCount = _allianceUserTotalCount = col.length;
                    //console.log("_allianceTotalCount.get.after", {
                    //    _allianceTotalCount: _allianceTotalCount,
                    //    _allianceUserTotalCount: _allianceUserTotalCount,
                    //    col: col,
                    //    "npcHelper.NPC_USER_IDS": npcHelper.NPC_USER_IDS
                    //});
                }
                return _allianceTotalCount;
            },
            set: function (value) {
                _allianceTotalCount = value;

            }
        });
        this._scrollerOptions = scrollerHelper.IScrollerOptions();

        var LANG_KEY = appL10n.getL10NCurrentLanguage();


        var MESSAGE_SOURCE_TYPE = {
            IsAlliance: 1,
            IsUser: 2
        };

        this.MESSAGE_SOURCE_TYPE = MESSAGE_SOURCE_TYPE;
        /**
         * @enum [numeric]
         * @readonly
         */
        var ArmAllianceAcceptedStatus = {
            NoAction: 1,
            Accept: 2,
            Reject: 3
        };
        this.armAllianceAcceptedStatus = ArmAllianceAcceptedStatus;


        //$self.$hub
        Object.defineProperty($self, "$hub", {
            get: function () {
                return GameServices.mainGameHubService;
            }

        });


        //#endregion

        //#region Helpers
        function updatePlanshet(initializeTabs) {
            planshetService.updatePlanshet();
            if (alianceUniqueId && initializeTabs) GameServices.tabService.initializeTabs(planshetService.getItemById(alianceUniqueId));

        }


        function getAlliancePage(pvpPoint, skip, onSuccess) {
            $self.$hub
                .allianceGetAllianceItemByMinRating(pvpPoint, skip)
                .then(function (answer) {
                    if (onSuccess instanceof Function) onSuccess(answer);
                }, function (errorAnswer) {
                    console.log("getAlliancePage.getAlliancePage", { errorAnswer: errorAnswer });
                });
        }

        function applyAllianceList() {
            mainHelper.applyTimeout(function () {
                //    alliance.Bodys[0].TemplateData.Collection = getAllianceList();
            });
        }

        function getLocalAllianceNames(request, response, update) {
            var lowerName = request.term.toLowerCase();
            function filter() {
                var f = _.filter(allianceNames, function (o) {
                    return _.includes(o.Name.toLowerCase(), lowerName) && !o.Disbandet;
                });
                //console.log("f", _.map(f, function(item) {
                //    return {
                //        label: item.Name,
                //        value: item.Name,
                //        id: item.Id
                //    }
                //}));
                return _.map(f, function (item) {
                    console.log("getLocalAllianceNames.item", item);
                    return {
                        label: item.Name,
                        value: item.Name,
                        id: item.Id
                    };
                });
            }

            if (allianceNames && !update) {
                if (response) return response(filter());
                return;
            }

            $self.$hub
                .allianceGetAllianceNamesByPartName(lowerName)
                .then(function (answer) {
                    var serverNames = [];
                    _.forEach(answer || [], function (val, idx) {
                        serverNames[idx] = Utils.ModelFactory.IAllianceNameSerchItem(val);
                    });
                    allianceNames = _.unionBy(allianceNames, serverNames, "Id");
                    $self._allianceTotalCount = allianceNames.length;
                    if (response) response(filter());

                }, function (errorAnswer) {
                    console.log("getLocalAllianceNames.AllianceGetAllActiveAllianceNames", { errorAnswer: errorAnswer });
                });

        }

        function allianceNameIsExist(allianceNameOrId) {
            function toBool(idx) {
                return idx !== -1;
            }

            if (typeof allianceNameOrId === "number") {

                return toBool(_.findIndex(allianceNames, function (o) {
                    return o.Id === allianceNameOrId;
                }));
            }
            else if (typeof allianceNameOrId === "string") {
                return toBool(_.findIndex(allianceNames, function (o) {
                    return o.Name === allianceNameOrId;
                }));

            }
        }

        function addAllianceNameToLocal(newAllianceObj) {
            if (!newAllianceObj || !newAllianceObj.hasOwnProperty("Id") || !newAllianceObj.hasOwnProperty("Name")) return;
            if (allianceNameIsExist(newAllianceObj.Id)) {
                console.log("alliance exist!!", {
                    allianceNames: allianceNames,
                    newAlliance: newAllianceObj
                });
                return;
            }
            allianceNames.push(newAllianceObj);

            $self._allianceTotalCount = allianceNames.length;

        }

        function removeAllianceNameFromLocal(allianceNameOrId) {
            //    console.log("removeAllianceNameFromLocal", {
            //        allianceNameOrId:allianceNameOrId,
            //        type:typeof allianceNameOrId,
            //        idx:_.findIndex(allianceNames, function(o) {
            //            return o.Id===allianceNameOrId;
            //        }),
            //        find: _.findIndex(allianceNames, function (o) { return o.Id === allianceNameOrId; }),
            //        allNames: allianceNames
            //});
            if (allianceNameIsExist(allianceNameOrId)) {
                if (typeof allianceNameOrId === "number") {
                    _.remove(allianceNames, function (o) {
                        return o.Id === allianceNameOrId;
                    });

                }
                else if (typeof allianceNameOrId === "string") {
                    _.remove(allianceNames, function (o) {
                        return o.Name === allianceNameOrId;
                    });

                }

                $self._allianceTotalCount = allianceNames.length;
            }
            else console.log("error can't remove, alliance not exist");

        }

        function setSpanText(data, cssClass) {
            return Utils.SetSpanText(data, cssClass);
        }



        function _checkUserIdIsValid(userId) {
            return typeof userId === "number" && userId !== 0;
        }

        function _checkUserNameIsValid(userName) {
            return typeof userName === "string" && userName !== "";
        }
        function _chechAllianceIdIsMyAllianceId(allianceId) {
            console.log({
                type: typeof allianceId === "number",
                typeName: typeof allianceId,
                notZero: allianceId !== 0,
                myAlId: $self.getMyAllianceId(),
                equalId: allianceId !== 0 && allianceId === $self.getMyAllianceId(),
                allEqual: typeof allianceId === "number" && allianceId !== 0 && allianceId === $self.getMyAllianceId(),
            });
            return typeof allianceId === "number" && allianceId !== 0 && allianceId === $self.getMyAllianceId();
        }


        this.addAllianceNameToLocal = addAllianceNameToLocal;

        this.getAllianceNames = getLocalAllianceNames;
        this.getAllianceItemDescription = function (description) {
            if (description && _.startsWith(description, "{")) {
                var translateObj = JSON.parse(description);
                return translateObj[LANG_KEY];
            }
            return description;
        };


        this.isCurrentModel = function () {
            if (!alianceUniqueId) return false;
            return planshetService.isCurrentModel(alianceUniqueId);
        };


        //#endregion

        //#region Role
        this.Role = (function () {
            var _r = {};

            /**
            * 
            * @param {string} roleName 
            * @param {bool} roleVal 
            * @returns {object} RoleModel
            */
            function RolePropModel(propName, propVal) {
                this.propName = propName;
                this.propVal = propVal;
            }

            function SelectRole(nativeName, roleId) {
                this.TranslateName = null;
                this.Id = roleId;
                this.NativeName = nativeName;
                this.updateTranslateName = function (translateRoleNames) {
                    this.TranslateName = translateRoleNames[this.NativeName][LANG_KEY];
                };
            }

            function IAllianceRoleDescription() {
                var _self = this;
                this._roles = {};
                this.Add = function (roleId, iLangSimple) {
                    this._roles[roleId] = iLangSimple;
                }
                this.Get = function (roleId) {
                    return _self._roles[roleId];
                }
                this.GetCurrent = function (roleId) {
                    return this.Get(roleId).getCurrent();
                }
                return this;
            }


            _r.IRolePropModel = function (propName, propVal) {
                return new RolePropModel(propName, propVal);
            };
            _r.ISelectRole = function (nativeName, roleId) {
                return new SelectRole(nativeName, roleId);
            };


            var rolePropsKeys = {
                EditAllianceInfo: "EditAllianceInfo",
                CanManagePermition: "CanManagePermition",
                MessageRead: "MessageRead",
                MessageSend: "MessageSend",
                SetTech: "SetTech",
                ShowManage: "ShowManage",
                AcceptNewMembers: "AcceptNewMembers",
                DeleteMembers: "DeleteMembers"
            };


            function INameIdRoles() {
                this.Creator = mf.INameIdModel(1, "Creator");
                this.Recrut = mf.INameIdModel(2, "Recrut");
                this.Director = mf.INameIdModel(3, "Director");

                //managers
                this.RecrutManager = mf.INameIdModel(4, "RecrutManager");
                this.Scientist = mf.INameIdModel(5, "Scientist");
                this.InfoManager = mf.INameIdModel(6, "InfoManager");
                this.AdvManager = mf.INameIdModel(7, "AdvManager");
                this.ChannelManager = mf.INameIdModel(8, "ChannelManager");

                //adv userRoles
                this.Reader = mf.INameIdModel(11, "Reader");
                this.Outcast = mf.INameIdModel(12, "Outcast");
            }

            INameIdRoles.prototype._error = function (param) {
                if (SHOW_DEBUG) throw new Error("paramIsWrong param : " + param);
                return null;
            };
            INameIdRoles.prototype.getIdByName = function (roleName) {
                if (typeof roleName !== "string") return this._error(roleName);
                var name = roleName.toLowerCase();
                var _id;
                _.forEach(this, function (o) {
                    if (o.Name.toLowerCase() === name) {
                        _id = o.Id;
                        return false;
                    }
                });
                if (!_id) {
                    return this._error(roleName);
                }
                return _id;

            };
            INameIdRoles.prototype.getNameById = function (roleId) {
                if (typeof roleId !== "number") return this._error(roleId);
                //main roles
                var _name;
                _.forEach(this, function (o) {
                    if (o.Id === roleId) {
                        _name = o.Name;
                        return false;
                    }
                });
                if (!_name) {
                    return this._error(roleId);
                }
                return _name;

            };
            INameIdRoles.prototype.equal = function (sourceIdOrName, targetIdOrName) {
                var sourceType = typeof sourceIdOrName;
                var targetType = typeof targetIdOrName;
                if (sourceType === targetType) {
                    if (sourceType === "number") return sourceIdOrName === targetIdOrName;
                    else if (sourceType === "string") return sourceIdOrName.toLowerCase() === targetIdOrName.toLowerCase();
                    else return this._error("source is: " + sourceIdOrName + " , sourct is:" + targetIdOrName);
                }
                else if (sourceType === "string") return this.getNameById(sourceIdOrName).toLowerCase() === targetIdOrName.toLowerCase();
                else if (targetType === "string") return this.getNameById(targetIdOrName).toLowerCase() === targetIdOrName.toLowerCase();
                else return this._error("source is: " + sourceIdOrName + " , sourct is:" + targetIdOrName);

            };


            var nameIdRoles = _r.roleNativeNames = new INameIdRoles();

            _r.rolePropsKeys = rolePropsKeys;
            _r._addAdvancedDataToPlanshetRole = function (newPlanshet) {
                var planshetRoles = newPlanshet.Bodys[1].TemplateData.AllianceMembers.Roles;

                _.forEach(planshetRoles, function (val, roleId) {
                    val.translateRoleHtmlDescription = _r.allianceRoleDescription.GetCurrent(roleId);
                });
            };

            _r.getRoleByName = function (roleName) {
                var roleId = nameIdRoles.getIdByName(roleName);
                if (typeof roleId === "number") {
                    var data = $self.getMyAllianceData();
                    if (data && data.AllianceMembers && data.AllianceMembers.Roles.hasOwnProperty(roleId)) return data.AllianceMembers.Roles[roleId];
                }
                return null;
            };

            _r.createSelectRoles = function (trRoles) {
                return _.map(nameIdRoles, function (o) {
                    var role = new SelectRole(o.Name, o.Id);
                    role.updateTranslateName(trRoles);
                    return role;
                });
            };

            _r.getRolePropertyName = function (trFieldRoles, propertyNativeName) {
                return trFieldRoles[propertyNativeName][LANG_KEY];
            };


            _r.allianceRoleDescription = (function () {
                var ard = new IAllianceRoleDescription();
                var tr = Utils.CreateLangSimple;


                function ardTemplate(roleTranslateName, contentText, nameCss, contentTextCss, containerCss) {
                    var _containerCss = "alliance-role-description";
                    var _namecss = "unique-name";
                    if (containerCss) _containerCss = containerCss;
                    if (nameCss) _namecss = nameCss;

                    return "<div class='" + _containerCss + "'>" +
                        Utils.SetSpanText(roleTranslateName, _namecss) +
                        Utils.SetSpanText(contentText, contentTextCss) +
                        "</div>";
                }

                ard.Add(nameIdRoles.Creator.Id, tr(ardTemplate("Leader ", " description heare"),
                    ardTemplate("Líder ", " description heare"),
                    ardTemplate("Лидер ", " обладает безграничными полномочиями в рамках своего альянса")));

                ard.Add(nameIdRoles.Recrut.Id, tr(ardTemplate("Member ", "description heare"),
                    ardTemplate("Miembro ", "description heare"),
                    ardTemplate("Участнику ", "доступны основные функции комуникации в альянсе<br>" +
                        "<b>Полномочия:</b><br>" +
                        "-отправка сообщений в чат альянса <br>" +
                        "-чтение сообщений альянса")));

                ard.Add(nameIdRoles.Director.Id, tr(ardTemplate("Director ", "description heare"),
                    ardTemplate("Director ", "description heare"),
                    ardTemplate("Директор ", "назначается лидером для помощи в управлении альянсом и обладате теми же полномочиями что и лидер альянса")));

                //  need full
                ard.Add(nameIdRoles.RecrutManager.Id, tr(ardTemplate("HR Manager ", "descr HR Manager"),
                    ardTemplate("HR Gerente ", " descr HR Manager"),
                    ardTemplate("HR Менеджер ", "занимается рассмотрением заявок от кандидатов на вступление в альянс<br>" +
                        "<b>Полномочия:</b><br>" +
                        "-Приём заявок на вступление в альянс")));

                ard.Add(nameIdRoles.Scientist.Id, tr(ardTemplate("Scientist ", "description heare"),
                    ardTemplate("Científico ", "description heare"),
                    ardTemplate("Учёные ", "уполномочены выбирать направление развития технологий в альянсе<br>" +
                        "<b>Полномочия:</b><br>" +
                        "-Доступ в лаботаторию альянса")));

                ard.Add(nameIdRoles.InfoManager.Id, tr(ardTemplate("Community manager ", "description heare"),
                    ardTemplate("El responsable de comunicacion ", "description heare"),
                    ardTemplate("Комьюнити менеджер ", "отвечает за информационную составляющую альянса<br>" +
                        "<b>Полномочия:</b><br>" +
                        "-Редактирование информации альянса")));

                ard.Add(nameIdRoles.AdvManager.Id, tr(ardTemplate("Deputy director ", "description heare"),
                    ardTemplate("Subdirector ", "description heare"),
                    ardTemplate("Заместитель директора ", "руководит альянсом в отсутствие вышестоящего руководства<br>" +
                        "<b>Полномочия:</b><br>" +
                        "-Приём заявок на вступление в альянс<br>" +
                        "-Доступ управлением лаботаторией альянса<br>" +
                        "-Редактирование информации альянса")));

                ard.Add(nameIdRoles.ChannelManager.Id, tr(ardTemplate("Messenger ", "description heare"),
                    ardTemplate("Mensajero ", "description heare"),
                    ardTemplate("Связист ", "руководит каналами связи альянса<br>" +
                        "<b>Полномочия:</b><br>" +
                        "-Управление каналами связи альянса")));

                ard.Add(nameIdRoles.Reader.Id, tr(ardTemplate("Observer ", "description heare"),
                    ardTemplate("Observador ", "description heare"),
                    ardTemplate("Наблюдателю ", "доступно только чтение альянсовых сообщений<br>" +
                        "<b>Полномочия:</b><br>" +
                        "-Чтение сообщений альянса")));

                ard.Add(nameIdRoles.Outcast.Id, tr(ardTemplate("Outcast ", "description heare"),
                    ardTemplate("El exiliado ", "description heare"),
                    ardTemplate("Изгой ", "отбывающий наказание, не имеет никаких прав и ограничен в комуникации с альянсом<br>" +
                        "<b>Полномочия:</b><br>" +
                        "-Лишён всех полномочий")));
                return ard;
            })();

            _r.initRoleView = function (rolesView, roleId, trFieldRoles, outRoles) {
                if (rolesView.hasOwnProperty(roleId)) return;
                var baseRole = outRoles[roleId];
                function _crRoleView(propertyNativeName, propertyValue) {
                    return new RolePropModel(_r.getRolePropertyName(trFieldRoles, propertyNativeName), propertyValue);
                }

                rolesView[roleId] = [
                    _crRoleView(rolePropsKeys.EditAllianceInfo, baseRole.EditAllianceInfo),
                    _crRoleView(rolePropsKeys.CanManagePermition, baseRole.CanManagePermition),
                    _crRoleView(rolePropsKeys.MessageRead, baseRole.MessageRead),
                    _crRoleView(rolePropsKeys.MessageSend, baseRole.MessageSend),
                    _crRoleView(rolePropsKeys.SetTech, baseRole.SetTech),
                    _crRoleView(rolePropsKeys.ShowManage, baseRole.ShowManage),
                ];

            };
            _r.initRolesView = function (rolesView, outRoles) {
                var data = $self.getMyAllianceData();
                if (!data || !data.AllianceMembers || !data.AllianceMembers.TranslateRoleFields) {
                    throw Errors.ClientNotImplementedException({
                        rolesView: rolesView,
                        outRoles: outRoles,
                        data: data
                    });
                }

                var trFieldRoles = data.AllianceMembers.TranslateRoleFields;
                //main roles
                _.forEach(nameIdRoles, function (o) {
                    _r.initRoleView(rolesView, o.Id, trFieldRoles, outRoles);
                });

            };
            _r.getTranslateRoleName = function (trRoles, roleName) {
                return trRoles[roleName][LANG_KEY];
            };


            _r.updateLoacalAmRole = function (userId, newRole) {
                var memModel = $self.getMyAllianceMembers();
                var am = _.find(memModel.Members, function (o) {
                    return o.UserId === userId;
                });
                if (!am) return null;
                Utils.UpdateObjData(am.Role, newRole);
                return am;
            };
            var _updateUserRoleInProgres = false;
            _r.requestUpdateUserRole = function (targetAllianceUserId, targetUserName, targetUserId, targetRoleId, targetRoleName, $event, $$RootScope) {
                if (_updateUserRoleInProgres) return;
                _updateUserRoleInProgres = true;

                $self.$hub.allianceUpdateUserRole(targetAllianceUserId, targetUserId, targetRoleId)
                    .finally(function () {
                        _updateUserRoleInProgres = false;
                    }).then(function (answer) {
                        allianceDialogHelper.openDialogRoleUpdated(targetUserName, targetRoleName, $event);
                        answer.$$RootScope = $$RootScope;
                        answer.IsCurrentUser = false;
                        _r.onAllianceUserUpdateRole(answer);
                    }, function (errorAnswer) {
                        var msg = Errors.GetHubMessage(errorAnswer);
                        if (msg === ErrorMsg.NotPermitted) {
                            allianceDialogHelper.openDialogNotPermitted($event);
                        } else if (msg === ErrorMsg.AllianceRoleNotChanged) {
                            allianceDialogHelper.openDialogRoleNotChanged(targetUserName, targetRoleName, $event);
                        }
                        else {
                            throw Errors.ClientNotImplementedException({
                                errorAnswer: errorAnswer,
                                msg: msg,
                                targetUserName: targetUserName,
                                targetUserId: targetUserId,
                                targetRoleId: targetRoleId,
                                targetRoleName: targetRoleName
                            });
                        }

                    });


            };

            _r.onAllianceUserUpdateRole = function (answer) {
                var data = $self.getMyAllianceData();
                if (!data || data.Id !== answer.AllianceId) return;
                if (data.hasOwnProperty("AllianceMembers")
                    && data.AllianceMembers.hasOwnProperty("Members")
                    && data.AllianceMembers.Members) {
                    var role = answer.NewRole;
                    var allianceMember = _r.updateLoacalAmRole(answer.TargetUserId, role);
                    if (!allianceMember) return;
                    if (answer.IsCurrentUser) {
                        if (role.AcceptNewMembers && !answer.AllianceUserRequests) {
                            throw Errors.ClientNullReferenceException({
                                answer: answer,
                                allianceMember: allianceMember,
                                data: data
                            }, "allianceService.Role.onAllianceUserUpdateRole", "user has role but AllianceUserRequests not exist");
                        }

                        var manageTabData = $self.getManageTabData();
                        manageTabData.AllianceUserRequests = answer.AllianceUserRequests;
                    }
                    answer.$$RootScope.$broadcast("alliance:user-role-updated", { allianceMember: allianceMember, IsCurrentUser: answer.IsCurrentUser });
                }

            }
            return _r;
        })();
        //#endregion

        //#region Request



        function _getAlliancePlanset(onSuccess, doNotChangeState) {
            /*нет серверного запроса на обновление всей модели, предполагается что все данные находятся в кеше,
            а время кеширования больше предполагаемого времени сесии.
            Модель альянса обновляется только по частям,
            или со стороны сервера устанавливает модель другими методами,
            в любом случае, модель приходит при инициализации и тут не вызывается,
            при попытке обратиться к методу сервера бросается исключение
            */
            var opts = planshetService.IHubRequestOptions(function () {
                throw opts.OnError("альянс уже должен был быть инициализирован");
                return $self.$hub["get gull alliance tabs"]();
            },alianceUniqueId);

            opts.OnSuccsess = function (_alliancePlanshet) {
                if (onSuccess instanceof Function) onSuccess(_alliancePlanshet);
            };
            opts.OnError = function (errorAnswer) {
                var msg = typeof errorAnswer === "string" ? errorAnswer : Errors.GetHubMessage(errorAnswer);
                throw Errors.ClientNotImplementedException({
                    msg: msg,
                    errorAnswer: errorAnswer
                });
            };

            opts.TryGetLocal = true;
            opts.SetToCurrent = true;
            opts.UpdateCacheTime = true;
            opts.ChangePlanshetState = !doNotChangeState;
            opts.CacheTime = Utils.Time.TIME_CACHE_ALLIANCE;
            planshetService.planshetHubRequest(opts);
        }

        function toggleAlliance(params, element, attrs, $scope, $event) {
            if (alianceUniqueId && !_.isEmpty(alliancePlanshetModel)) {
                if (planshetService.isCurrentModel(alianceUniqueId)) planshetService.toggle();
                else planshetService.updatePlanshet(planshetService.toggle, alianceUniqueId, true, false);
            }
            else throw new Error("allianceService.toggleAlliance NotImplementedException");

        }


        function _setNewPlanshet(newPlanshet, needUpdateProfile) {
            $self.Role._addAdvancedDataToPlanshetRole(newPlanshet);
            alliancePlanshetModel = newPlanshet;
            alianceUniqueId = newPlanshet.UniqueId;

            planshetService.updatePlanshetItemData(newPlanshet, true, Utils.Time.TIME_CACHE_ALLIANCE);

            if (planshetService.isCurrentModel(alianceUniqueId)) GameServices._updatePlanshet();
            if (needUpdateProfile) profileService.updateAllianceInfoInCurrentUserProfile($self.getMyAllianceData());
        }

        function getAllianceItem(allianceId, apply, tabIdx) {
            if (hasItemInAllianceList(allianceId)) {
                if (apply instanceof Function) apply();
                return;
            }
            if (!tabIdx) tabIdx = 0;
            $self.$hub.allianceGetAllianceItemById(allianceId, tabIdx).then(function (answer) {
                console.log("answer", answer);
                addItemInAllianceList(answer);
                if (apply instanceof Function) apply();
            }, function (errorAnswer) {
                console.log("getAllianceItem.errorAnswer", errorAnswer);
            });
        }

        function filterAllianceSerchByName(allianceName) {
            function onLoadAlliance(allianceModel) {
                console.log("filterAllianceSerchByName", allianceModel);
                var scope;
                planshetService.conditionAwaiter(function () {
                    scope = angular.element("#inputlg").scope();
                    return !!scope;
                }, function () {
                    scope.allianceName = allianceName;
                });

            }

            _getAlliancePlanset(onLoadAlliance, true);
        }


        this.toggleAlliance = toggleAlliance;

        this.getAllianceItem = getAllianceItem;
        this.filterAllianceSerchByName = filterAllianceSerchByName;

        //#endregion

        //#region Members  

        hasItemInAllianceList = function (allianceId) {
            return !!_.find($self.getAllianceList(), { "Id": allianceId });
        };

        function getTabs() {
            return alliancePlanshetModel;
        }

        function getBodyByIdx(idx) {
            if (alliancePlanshetModel.Bodys && alliancePlanshetModel.Bodys[idx]) return alliancePlanshetModel.Bodys[idx];
            return null;
        }

        function getSerchBody() {
            return getBodyByIdx(0);

        }

        function getAlianceItemInList(allianceId) {
            return _.find($self.getAllianceList(), function (o) {
                return o.Id === allianceId;
            });
        }

        function getTotalAllianceServerItems(withNpc, fromLocl) {
            var total = $self._allianceTotalCount;
            var count = withNpc ? total : _allianceUserTotalCount;
            if (fromLocl) return count;
            var deferred = $q.defer();
            // todo серверное или локальное обновление
            deferred.resolve(count);
            return deferred.promise;
        };

        function getMinAlliancePoint() {
            return _.minBy($self.getAllianceList(), "PvpPoint").PvpPoint;
        }

        function addListToAllianceList(advancedAllianeList) {
            //_.unionBy(getAllianceList(), advancedAllianeList, "Id");
            alliancePlanshetModel.Bodys[0].TemplateData.Collection = _.unionBy($self.getAllianceList(), advancedAllianeList, "Id");
        }

        function saveNewAllianceItem(answer) {
            addListToAllianceList(answer.Collection);
            applyAllianceList();
        }



        addItemInAllianceList = function (item) {
            alliancePlanshetModel.Bodys[0].TemplateData.Collection = _.unionBy($self.getAllianceList(), [item], "Id");

        };



        function getMyAllianceName() {
            var data = $self.getMyAllianceData();
            if (data && data.hasOwnProperty("Name")) return data.Name;
            return null;
        }

        function isNpcAllianceName(name) {
            return npcHelper.isNpc(name);
        }

        this.getTabs = getTabs;
        this.getAllianceList = function () {
            return getSerchBody().TemplateData.Collection;
        };
        this.addItemInAllianceList = addItemInAllianceList;
        this.getMyAllianceData = function () {
            var data = getBodyByIdx(1);
            //console.log("getMyAllianceData", data);
            if (data && data.hasOwnProperty("TemplateData")) return data.TemplateData;
            return null;
        };
        this.getMyAllianceId = function () {
            var data = $self.getMyAllianceData();
            if (data && data.hasOwnProperty("Id")) return data.Id;
            return null;
        };
        this.getMyAllianceName = getMyAllianceName;



        /**
        * Utils.AllianceUserShort
        * @returns {object || Utils.AllianceUserShort} id and names for user
        */
        Object.defineProperty($self, "$currentUserInfo", {
            get: function () {
                var data = $self.getMyAllianceData();
                if (!data) throw new Error("current alliance not exist");
                var userId = profileService.getCurrentUserId();
                var userName = profileService.getCurrentUserName();
                var userAvatar = profileService.getCurrentUserAvatar();
                var allianceUserId = null;
                var allianceRoleId = null;
                var allianceId = data.Id;
                var allianceName = data.Name;
                var allianceLabel = data.Label;
                if (data.hasOwnProperty("AllianceMembers")
                    && data.AllianceMembers
                    && data.AllianceMembers.hasOwnProperty("Members")
                    && data.AllianceMembers.Members
                    && data.AllianceMembers.Members.length > 0) {

                    var member = _.find(data.AllianceMembers.Members, function (o) {
                        return o.UserId === userId;
                    });
                    if (member) {
                        allianceUserId = member.AllianceUserId;
                        allianceRoleId = member.Role.Id;
                    }

                }
                return Utils.ModelFactory.AllianceUserShort(allianceId, allianceName, userId, userName, allianceUserId, allianceRoleId, allianceLabel, userAvatar);

            }
        });






        // #region Translate vars
        var _allianceTranslate;
        Object.defineProperty($self, "_allianceTranslate", {
            get: function () {
                if (!_allianceTranslate) {
                    _allianceTranslate = _.cloneDeep(GameServices.translateService.getAlliance());
                }
                return _allianceTranslate;
            }
        });

        var _commonTranslate;
        Object.defineProperty($self, "_commonTranslate", {
            get: function () {
                if (!_commonTranslate) {
                    _commonTranslate = _.cloneDeep(GameServices.translateService.getCommon());
                }
                return _commonTranslate;
            }
        });

        // #endregion


        this.setAllianceStatsModelInScope = function (scope, model, isProfile) {
            if (!scope || !model) return null;
            //      console.log("setAllianceStatsModelInScope", scope);
            if (!model.AllianceTranslates) {
                model.AllianceTranslates = $self._allianceTranslate;
            };

            var translate = model.AllianceTranslates;
            var linkToUser = statisticHelper.createStatItemModel(translate.leader, model.LeaderName, null, null, " link-to-target unique-name ");
            var linkToAlliance = statisticHelper.createStatItemModel(translate.name, model.Name, null, null, " unique-name ");

            if (!isProfile) profileService.setOnClickToUser(linkToUser, model.LeaderName);
            else if (!isNpcAllianceName(model.Name)) {
                linkToAlliance.advancedCssVal += "link-to-target active ";
                linkToAlliance.hasOnclick = true;
                linkToAlliance.onClick = function () {
                    filterAllianceSerchByName(model.Name);
                };

            }
            var stats = [
                linkToAlliance,
                linkToUser,
                statisticHelper.createStatItemModel(translate.pvpPoint, model.PvpPoint),
                statisticHelper.createStatItemModel(translate.tax, model.TaxView + ""),
                statisticHelper.createStatItemModel(translate.controlledPlanet, model.ControlledPlanet),
                statisticHelper.createStatItemModel(translate.population, model.Pilots)
            ];


            var bgImage = statisticHelper.createBgImage("", model.Name);
            bgImage.url = model.Label.Detail;
            bgImage.style = { backgroundImage: Utils.CssHelper.SetUrl(bgImage.url) };
            //console.log({ model: model, bgImage: bgImage });
            statisticHelper.resizePictire(bgImage.style, bgImage.url);

            scope.allianceStatsModel = statisticHelper.createStatisticModel(stats, bgImage);
            return scope;
        };
        this.isNpcAllianceName = isNpcAllianceName;


        //#endregion

        //#region Alliance Common

        var messageBlockedState = false;
        function _updateMessageBlockedState(val) {
            messageBlockedState = val;
        }

        function getMessageBlockedState() {
            return messageBlockedState;
        }


        this.allianceButtonsNativeName = {
            leaveFromAlliance: "leavefromalliance",
            joinToAlliacne: "jointoalliacne"
        };
        this.getAllianceItemBtns = function (allianceItemModel) {
            var btns = allianceItemModel.Buttons;
            var newBtns = [];
            if (btns) {
                _.forEach(newBtns, function (item, idx) {
                    newBtns.push(_.cloneDeep(item));
                });
            }
            return btns;
        };

        this.updateMessageBlockedState = _updateMessageBlockedState;
        this.getMessageBlockedState = getMessageBlockedState;
        //#endregion

        //#region Leave from alliance and Drop User from Alliance
        var _leaveFromAllianceInProgress;
        this.leaveFromAlliance = function (serverParams, element, attrs, $scope) {
            if (_leaveFromAllianceInProgress) return;
            if (serverParams && serverParams.hasOwnProperty("Id") && serverParams.Id) {
                function _finally() {
                    _leaveFromAllianceInProgress = false;
                }

                var btn = $scope.button;
                if (btn.Params.NativeName !== "LeaveFromAlliance".toLowerCase()) return;
                var aItem = $scope.$parent.item;
                var allianceName = aItem.Name;
                var leaveType = 1;
                if (aItem.Pilots === 1) leaveType = 2;
                else {
                    var userName = profileService.getCurrentUserInfo().Name;
                    if (userName.toLowerCase() === aItem.LeaderName.toLowerCase()) leaveType = 2;
                }
                if (leaveType === 2) {
                    allianceDialogHelper.openDialogLeaveLeader(allianceName);
                    //   requestDisbandAlliance(allianceName);
                }
                else if (leaveType === 1) {
                    _leaveFromAllianceInProgress = true;
                    allianceDialogHelper.openDialogleaveFromAlliance(allianceName)
                        .then(function () {
                            //confirmed
                            $self.$hub
                                .allianceLeaveFromUserAlliance()
                                .then(function (newAlliancePlanshet) {
                                    //update planshet and profile
                                    //todo   изменить метод - текущая версия возвращает данные новго планшета
                                    _setNewPlanshet(newAlliancePlanshet, true);
                                    allianceDialogHelper
                                        .openDialogOnLeaveFromUserAlliance(allianceName)
                                        .finally(_finally);
                                }, function (errorAnswer) {
                                    var msg = Errors.GetHubMessage(errorAnswer);
                                    console.log("leavePilotFromAlliance", {
                                        errorAnswer: errorAnswer,
                                        msg: msg
                                    });
                                    _finally();
                                });
                        }, function () {
                            //cancel
                            _leaveFromAllianceInProgress = false;
                        });
                }
                else throw new Error("leaveFromAlliance.leaveType NotImplementedException");
            }


        }

        var _dropUserFromAllianceInProgress = false;

        this.dropUserFromAlliance = function (targetUserName, targetDropUserId, $event) {
            if (_dropUserFromAllianceInProgress) return;
            allianceDialogHelper
                .openDialogDropUserFromAlliance(targetUserName, $event)
                .then(function () {
                    _dropUserFromAllianceInProgress = true;
                    //confirm 

                    return $self.$hub
                        .allianceDropUserFromAlliance(targetDropUserId)
                        .finally(function () {
                            _dropUserFromAllianceInProgress = false;
                        })
                        .then(function (answer) {
                            // ничего не делаем активируются слудующие событияД
                            // onAllianceUserLeftAlliance  - для текущего альянса
                            // onAllianceUserDroped для пользователя котого дропнули   (передаем новый планшет)
                            // allianceAddNewUserToAlliane  для нового альянса
                            // (проверить все ли данные обновляется и для этой вью)  

                        }, function (errorAnswer) {

                            //error   
                            var msg = Errors.GetHubMessage(errorAnswer);
                            if (msg === ErrorMsg.NotPermitted) {
                                allianceDialogHelper.openDialogNotPermitted($event);
                            }
                            else {
                                throw Errors.ClientNotImplementedException({
                                    errorAnswer: errorAnswer,
                                    msg: msg
                                }, "allianceDropUserFromAlliance.error");
                            }
                        });

                }, function () {
                    _dropUserFromAllianceInProgress = false;
                    //cancel
                });


        };
        this.onAllianceUserDroped = function (oldAllianceId, newConnectionUser, newPlanshetData) {
            _setNewPlanshet(newPlanshetData, true);

            console.log("onAllianceUserDroped", {
                oldAllianceId: oldAllianceId,
                newConnectionUser: newConnectionUser,
                newPlanshetData: newPlanshetData
            });

        };

        //#endregion


        //#region MyAlliance Tab    

        // #region Alliance Members

        function checkAmDataNotValid(allianceId, userName) {
            return !_chechAllianceIdIsMyAllianceId(allianceId) || !_checkUserNameIsValid(userName);
        }
        function _getAllianceMember(allianceId, userName) {
            if (checkAmDataNotValid(allianceId, userName)) return null;
            var data = $self.getMyAllianceMembers();
            if (data) {
                return _.find(data, function (o) {
                    return o.UserName === userName;
                });
            }
            return null;
        }
        function _getAllianceMemberByUserId(allianceId, userId) {
            if (!_chechAllianceIdIsMyAllianceId(allianceId)) return null;
            if (!_checkUserIdIsValid(userId)) return null;
            var data = $self.getMyAllianceMembers();
            if (data && data.Members && data.Members.length) {
                return _.find(data.Members, function (o) {
                    return o.UserId === userId;
                });
            }
            return null;
        }

        // #region Alliance Members status 
        function _updateAllianceMemberStatus(allianceMember, onlineStatus) {
            if (!allianceMember) return;
            mainHelper.applyTimeout(function () {
                allianceMember.OnlineStatus = onlineStatus;
            });
        }


        this.updateAllianceMemberStatusByUserName = function (allianceId, userName, onlineStatus) {
            _updateAllianceMemberStatus(_getAllianceMember(allianceId, userName), onlineStatus);
        };
        this.updateAllianceMemberStatusByUserId = function (allianceId, userId, onlineStatus) {
            _updateAllianceMemberStatus(_getAllianceMemberByUserId(allianceId, userId), onlineStatus);
        };
        // #endregion


        this.getMyAllianceMembers = function () {
            var data = $self.getMyAllianceData();
            if (data && data.hasOwnProperty("AllianceMembers")) return data.AllianceMembers;
            return null;
        }

        this.getCurrentUserMemberFromMembers = function (members) {
            var uId = profileService.getCurrentUserId();
            var member = _.find(members, function (o) {
                return o.UserId === uId;
            });
            if (!member) throw new Error("user not exist");
            return member;

        };


        //#endregion   

        //#endregion

        //#region Module UserRequestsToAlliance

        function _getRequestsFromAllianceManage() {
            var data = $self.getManageTabData();
            if (data && data.hasOwnProperty("AllianceUserRequests") && data.AllianceUserRequests) return data.AllianceUserRequests;
            return null;
        }

        function _getAurCtrlScope() {
            var elem = angular.element("#my-alliance-requests");
            if (elem.scope) {
                var $scope = elem.scope();
                if ($scope && $scope.hasOwnProperty("aurCtrl")) return $scope;
            }
            return null;
        }

        function _getAmrCtrlScope() {
            var elem = angular.element("#alliance-manage-requests");
            if (elem.scope) {
                var $scope = elem.scope();
                if ($scope && $scope.hasOwnProperty("amrCtrl")) return $scope;
            }
            return null;
        }

        /**
     * 
     * @param {} isMyAllianceTab 
     * @param {} setTimeout 
     * @returns {} 
     */
        function _updateSectionHeight(isMyAllianceTab, setTimeout) {
            var $scope = isMyAllianceTab ? _getAurCtrlScope() : _getAmrCtrlScope();
            var deferred = $q.defer();

            function onDone() {
                $scope.$emit("dropElementContainer:changeHeight", { resolve: deferred.resolve });
            }

            var time = (setTimeout && $scope) ? 40 : 1;
            $timeout(function () {
                if ($scope) onDone();
                else deferred.reject("no scope");

            }, time);
            return deferred.promise;
        }

        this.getRequestsFromMyAlliance = function () {
            var data = $self.getMyAllianceData();
            if (data && data.hasOwnProperty("AllianceUserRequests")
                && data.AllianceUserRequests) return data.AllianceUserRequests;
            return null;
        }

        this.hasRequestsInMyAlliance = function () {
            //    console.log("hasRequestsInMyAlliance", !!getRequestsFromMyAlliance());
            return !!$self.getRequestsFromMyAlliance();
        };



        function _getBaseMessageModelInAllianceManage() {
            var curUserData = $self.$currentUserInfo;
            var allianceMessageModelExt = mf.AllianceMessageModelExt(true, curUserData.allianceRoleId, curUserData.allianceUserId);
            allianceMessageModelExt._setModel(MESSAGE_SOURCE_TYPE.IsAlliance, curUserData.allianceId, curUserData.allianceName, curUserData.allianceLabel.Icon);
            return allianceMessageModelExt;

        }

        function _getBaseMessageModelInMyAlliance() {
            var curUserData = $self.$currentUserInfo;
            var allianceMessageModelExt = mf.AllianceMessageModelExt(false, curUserData.allianceRoleId, curUserData.allianceUserId);
            allianceMessageModelExt._setModel(MESSAGE_SOURCE_TYPE.IsUser, curUserData.userId, curUserData.userName, curUserData.userAvatar.Icon);
            return allianceMessageModelExt;
        }

        function _getMessageModel(baseMessageModel, request) {
            var msg = baseMessageModel._clone();
            msg.Model._setTo(request.GroupId, request.GroupName);
            msg.Model.Message = "";
            return msg;
        }

        function _addNewRequestItem(allianceUserRequests, newDataArmModelExt, isMyAllianceTab, createBtns, onDone) {
            if (!(onDone instanceof Function)) {
                onDone = function () {
                    _updateMessageBlockedState(false);
                };
            }
            if (!allianceUserRequests || !allianceUserRequests.hasOwnProperty("Requests")) {
                onDone();
                if (SHOW_DEBUG) {
                    console.log({ allianceUserRequests: allianceUserRequests });
                    throw new Error("allianceService._addNewRequestItem : no allianceUserRequests");
                }
                else return;
            }

            if (typeof isMyAllianceTab !== "boolean") throw new Error("allianceService._addNewrequestItem : argument -isMyAllianceTab- is wrong ");
            var requests = allianceUserRequests.Requests;
            if (!requests) requests = allianceUserRequests.Requests = [];
            var m = newDataArmModelExt.Model;


            var groupId = null;
            var groupName = "";
            if (MESSAGE_SOURCE_TYPE.IsAlliance === m.SourceType && isMyAllianceTab || MESSAGE_SOURCE_TYPE.IsUser === m.SourceType && !isMyAllianceTab) {
                groupId = m.FromId;
                groupName = m.FromName;
            }

            else if (MESSAGE_SOURCE_TYPE.IsAlliance === m.SourceType && !isMyAllianceTab || MESSAGE_SOURCE_TYPE.IsUser === m.SourceType && isMyAllianceTab) {
                groupId = m.ToId;
                groupName = m.ToName;
            }
            else {
                if (SHOW_DEBUG) {
                    console.log({
                        allianceUserRequests: allianceUserRequests,
                        newDataArmModelExt: newDataArmModelExt,
                        isMyAllianceTab: isMyAllianceTab
                    });
                }
                throw new Error("condition is wrong");
            }

            var group = _.find(requests, function (o) {
                return o.GroupId === groupId;
            });

            if (!group) {
                var au = Utils.ModelFactory.AllianceUserRequestItem(groupName, groupId, [m], m.UserAccepted, m.AllianceAccepted);
                allianceUserRequests.LastUpdateTime = Utils.Time.GetUtcNow();
                requests.push(au);
                group = au;
            }
            else group.Messages.push(m);

            group.AllianceAccepted = m.AllianceAccepted;
            if (m.UserAccepted) group.UserAccepted = m.UserAccepted;
            if (createBtns instanceof Function) createBtns(group);
            if (group.dropable && group.dropable._closed === false) {
                _updateMessageBlockedState(true);
                $timeout(function () {
                    group.dropable.updateHeihgt(function () {
                        _updateSectionHeight(isMyAllianceTab, true)
                            .finally(function () {
                                console.log("group.dropable.updateHeihgt.finally");
                                _updateMessageBlockedState(false);
                                onDone();

                            });
                    });
                }, 10);

            }
            else onDone();

            console.log("_addNewRequestItem", {
                group: group,
                m: m,
                allianceUserRequests: allianceUserRequests
            });
        }

        function _checkRequestDataIsCorrect(request) {
            if (request && request.hasOwnProperty("GroupId")
                && typeof request.GroupId === "number"
                && request.hasOwnProperty("GroupName")
                && typeof request.GroupName === "string") return true;
            return false;
        }

        function _acceptJoinUserToAlliance(toAllianceId) {
            _updateMessageBlockedState(true);
            $self.$hub
                .requestAllianceAcceptJoinUserToAlliance(toAllianceId)
                .finally(function () {
                    console.log("allianceService._acceptJoinUserToAlliance.finally");
                    _updateMessageBlockedState(false);
                }).then(function (newAlliancePlanshet) {
                    _setNewPlanshet(newAlliancePlanshet, true);
                    console.log("newAlliancePlanshet", newAlliancePlanshet);
                }, function (errorAnswer) {
                    var msg = Errors.GetHubMessage(errorAnswer);
                    if (msg === ErrorMsg.AllianceActionInBlockedState) {
                        var timeToDone = errorAnswer.data.TimeToDone;
                        allianceDialogHelper.errorUserCantJoinToAllianceBecauseInBlockedState(Utils.Time.Seconds2Time(timeToDone));
                    }
                    console.log("allianceService._acceptJoinUserToAlliance.errorAnswer", { msg: msg, errorAnswer: errorAnswer });
                    //error
                });
        }


        function _deleteRequestsFromPlanshet(data, groupId, isMyAllianceTab) {
            if (data && data.Requests && data.Requests.length) {
                _updateMessageBlockedState(true);
                mainHelper.applyTimeout(function () {
                    _.remove(data.Requests, function (o) {
                        return o.GroupId === groupId;
                    });
                    _updateSectionHeight(isMyAllianceTab, true).finally(function () {
                        _updateMessageBlockedState(false);
                    });
                });
            }
        }

        function _deleteRequestHistoryFromMyAlliance(groupId) {
            if (!groupId || typeof groupId !== "number") return;
            _deleteRequestsFromPlanshet($self.getRequestsFromMyAlliance(), groupId, true);
        };

        /**
        * толкьо для  my alliance
        * @param {int} toAllianceId 
        * @param {string} toAllianceName 
        * @param {object} $event 
        * @param {function} onSuccess 
        * @returns {void} 
        */
        this.requestDeleteRequestForUserToAlliance = function (toAllianceId, toAllianceName, $event, onSuccess) {
            allianceDialogHelper.openDialogDeleteUserRequestToAlliance(toAllianceName, function (updateBlockedState) {
                $self.$hub.requestAllianceDeleteRequestForUserToAlliance(toAllianceId)
                    .then(function (answer) {
                        if (answer) {
                            _deleteRequestHistoryFromMyAlliance(toAllianceId, true);
                            updateBlockedState(false);
                            if (onSuccess instanceof Function) onSuccess(answer);

                        }
                        else {
                            updateBlockedState(false);
                            throw new Error("requestDeleteRequestForUserToAlliance.Error");
                        }

                    }, function (errorAnswer) {
                        var msg = null;
                        if (errorAnswer) {
                            msg = Errors.GetMessage(errorAnswer);
                            console.log("requestDeleteRequestForUserToAlliance.errorAnswer", { msg: msg, errorAnswer: errorAnswer });
                        }
                        updateBlockedState(false);
                        throw new Error(errorAnswer);
                    });
            }, _updateMessageBlockedState, $event);
        };


        /**
         * 
         * @param {object} armModelExt  Utils.ModelFactory.AllianceMessageModelExt;
         * @param {Function} onSuccess 
         * @param {Function} onError 
         * @param {object} $event 
         * @returns {void} 
         */
        this.myAllianceRequestSendRequestMessage = function (armModelExt, onSuccess, onError, $event) {
            if (typeof armModelExt !== "object") throw new Error("AllianceMessageModelExt allianceService.myAllianceRequestSendRequestMessage argument armModelExt is wrong");
            allianceDialogHelper.openDialogSendMessage(armModelExt, function () {
                if (armModelExt.FromAlliance && !armModelExt.AllianceUserId || armModelExt.FromAlliance && !armModelExt.AllianceRoleId) {
                    console.log("myAllianceRequestSendRequestMessage.NOT PERMITION");
                    return;
                }
                if (armModelExt.Model.AllianceAccepted === 0) armModelExt.Model.AllianceAccepted = ArmAllianceAcceptedStatus.NoAction;
                _updateMessageBlockedState(true);

                function always() {
                    _updateMessageBlockedState(false);
                }

                function onSuc(answer) {
                    if (onSuccess instanceof Function) onSuccess(answer);
                    console.log({ answer: answer });
                }

                function onErr(errorAnswer) {
                    var msg = Errors.GetMessage(errorAnswer);
                    if (!armModelExt.FromAlliance) {
                        if (msg === "YouInAlliance") {
                            allianceDialogHelper.errorUserInAlliance(getMyAllianceName())
                                .finally(always)
                                .then(function (okData) {
                                    console.log("allianceDialogHelper.errorUserInAlliance on ok", okData);
                                },
                                function (cancel) {
                                    console.log("allianceDialogHelper.errorUserInAlliance on cancel", cancel);
                                });
                        }
                        else allianceDialogHelper.errorJoinToAlliance(errorAnswer, armModelExt.Model.ToId, armModelExt.Model.ToName, $self);
                    }
                    else {
                        //todo  code heare
                    }

                    console.log({ errorAnswer: errorAnswer });
                }

                if (armModelExt.FromAlliance) $self.$hub.requestAllianceFromAllianceManageAddMessage(armModelExt).finally(always).then(onSuc, onErr);
                else $self.$hub.requestAllianceFromMyAllianceAddMessage(armModelExt).finally(always).then(onSuc, onErr);


            }, _updateMessageBlockedState, $event);
        };

        this.addNewRequetToMyAlliance = function (newDataArmModelExt) {
            var requests = $self.getRequestsFromMyAlliance();
            if (!requests) {
                if (SHOW_DEBUG) {
                    console.log({ requests: requests, newDataArmModelExt: newDataArmModelExt });
                    throw new Error("allianceService.addNewRequetToMyAlliance : no data");
                }
                else return;
            }
            _updateMessageBlockedState(true);
            mainHelper.applyTimeout(function () {
                _addNewRequestItem(requests, newDataArmModelExt, true, $self.createMyAllianceRequestBtns);
            });

        };

        this.addNewRequetToAllianceManage = function (newDataArmModelExt) {
            var requests = _getRequestsFromAllianceManage();
            if (!requests) {
                if (SHOW_DEBUG) throw new Error("allianceService.addNewRequetToAllianceManage : no data");
                else return;
            }
            _updateMessageBlockedState(true);
            mainHelper.applyTimeout(function () {
                _addNewRequestItem(requests, newDataArmModelExt, false, $self.createAllianceManageRequestBtns);
            });
        }

        this.onRequestAllianceConfirmAcceptFromAllianceManage = function (serverAllianceMessageModelExt, isRequestUser) {
            var allianceMessageModelExt = Utils.ModelFactory.AllianceMessageModelExt();
            allianceMessageModelExt._setFromData(serverAllianceMessageModelExt);
            if (isRequestUser) {
                $self.addNewRequetToMyAlliance(allianceMessageModelExt);
                $timeout(function () {
                    _updateMessageBlockedState(true);
                    var alName = allianceMessageModelExt.Model.FromName;
                    allianceDialogHelper
                        .onRequestAllianceConfirmAcceptToAllianceForUser(alName)
                        .finally(function () {
                            console.log("onRequestAllianceConfirmAcceptToAllianceForUser.finally");
                            _updateMessageBlockedState(false);
                        })
                        .then(function (now) {

                            _acceptJoinUserToAlliance(allianceMessageModelExt.Model.FromId);
                            console.log("onRequestAllianceConfirmAcceptToAllianceForUser.now", now);

                        }, function (late) {
                            console.log("onRequestAllianceConfirmAcceptToAllianceForUser.late", late);

                        });
                }, 100);

            }
            else $self.addNewRequetToAllianceManage(allianceMessageModelExt);
        };
        this.onRequestAllianceRejectRequestToAlliance = function (rejectUserId, isRequestUser, armModelExt) {
            console.log("onRequestAllianceRejectRequestToAlliance", {
                isRequestUser: isRequestUser,
                rejectUserId: rejectUserId,
                armModelExt: armModelExt,
            });
            if (isRequestUser) $self.addNewRequetToMyAlliance(armModelExt);
            else $self.deleteRequestHistoryFromAllianceManage(rejectUserId);

        };
        this.onDeleteAllianceRequestsByManager = function (allianceId, removerRequestUserId) {
            var data = $self.getMyAllianceData();
            if (data && data.Id === allianceId) {
                $self.deleteRequestHistoryFromAllianceManage(removerRequestUserId)
            }
        }

        this.createAllianceManageRequestBtns = function (requestItem) {
            if (requestItem.AllianceAccepted === ArmAllianceAcceptedStatus.Accept) {
                requestItem.ButtonsView = [];
                return requestItem.ButtonsView;
            }

            if (!requestItem.hasOwnProperty("ButtonsView")) {
                var bms = _getBaseMessageModelInAllianceManage();

                function always() {
                    _updateMessageBlockedState(false);
                }

                // #region Actions
                function createMessageToMember(params, element, attrs, scope, $event) {
                    if (getMessageBlockedState()) return;
                    var request = params.request;
                    if (!_checkRequestDataIsCorrect(request)) return;

                    var armModelExt = _getMessageModel(bms, request);
                    _updateMessageBlockedState(true);
                    $self.myAllianceRequestSendRequestMessage(armModelExt, function (answer) {
                        console.log("createMessageToMember.succsess", answer);
                        $self.addNewRequetToAllianceManage(answer);
                    }, function (errorAnswer) {
                        //on error
                        console.log("createMessageToMember.errorAnswer", errorAnswer);
                        always();
                    }, $event);
                }

                function refuseMember(params, element, attrs, scope, $event) {
                    if (getMessageBlockedState()) return;
                    var request = params.request;
                    if (!_checkRequestDataIsCorrect(request)) return;
                    _updateMessageBlockedState(true);
                    allianceDialogHelper.openDialogAllianceManageRefuseMemberRequest(request.GroupName, $event)
                        .finally(always)
                        .then(function () {
                            //ok
                            _updateMessageBlockedState(true);
                            $self.$hub
                                .requestAllianceRejectRequestToAlliance(request.GroupId)
                                .finally(always)
                                .catch(function (error) {
                                    var msg = "createAllianceManageRequestBtns.refuseMember.Error, request data";
                                    if (error) msg = Errors.GetHubMessage(error);
                                    console.log("createAllianceManageRequestBtns.refuseMember.Error, request data", {
                                        request: request,
                                        ErrorMsg: msg
                                    });

                                });
                        }, function () {
                            //cancel
                        });
                }

                function acceptMember(params, element, attrs, scope, $event) {
                    if (getMessageBlockedState()) return;
                    var request = params.request;
                    if (!request) return;
                    _updateMessageBlockedState(true);
                    var armModelExt = _getMessageModel(bms, request);
                    $self.$hub
                        .requestAllianceConfirmAcceptFromAllianceManage(armModelExt)
                        .finally(always)
                        .then($self.onRequestAllianceConfirmAcceptFromAllianceManage, function (errorAnswer) {
                            var msg = Errors.GetHubMessage(errorAnswer);
                            if (msg === ErrorMsg.UserInAlliance) {
                                allianceDialogHelper
                                    .errorAllianceManageTargetUserInAlliance(armModelExt.Model.ToName)
                                    .then(function () {
                                        $self.deleteRequestHistoryFromAllianceManage(request.GroupId);
                                    }, function (cancel) {
                                        console.log("cancel", cancel);
                                    });
                            }
                            console.log("onRequestAllianceConfirmAcceptFromAllianceManage.Error", {
                                errorAnswer: errorAnswer
                            });

                        });

                }

                // #endregion

                GameServices.paralaxButtonHelper.createAllianceManageUserRequestBtns(requestItem, createMessageToMember, refuseMember, acceptMember, ArmAllianceAcceptedStatus);
            }
            return requestItem.ButtonsView;
        };

        this.createMyAllianceRequestBtns = function (requestItem) {
            var bms = _getBaseMessageModelInMyAlliance();

            function always() {
                _updateMessageBlockedState(false);
                console.log("createMyAllianceRequestBtns.always");
            }

            function createMsg(params, element, attrs, scope, $event) {
                console.log("createMyAllianceRequestBtns.createMsg", {
                    params: params,
                    requestItem: requestItem,
                    getMessageBlockedState: getMessageBlockedState(),
                    bms: bms
                });
                if (getMessageBlockedState()) return;
                var request = params.request;
                if (!_checkRequestDataIsCorrect(request)) return;
                var armModelExt = _getMessageModel(bms, request);
                _updateMessageBlockedState(true);
                $self.myAllianceRequestSendRequestMessage(armModelExt, function (answer) {
                    if (!answer) throw new Error("allianceService.myAllianceRequestSendRequestMessage no answer");
                    $self.addNewRequetToMyAlliance(answer);
                }, function (errorName) {
                    //on error
                    always();
                }, $event);
            }

            function removeRequest(params, element, attrs, scope, $event) {
                var request = params.request;
                if (!_checkRequestDataIsCorrect(request)) return;
                _updateMessageBlockedState(true);
                $self.requestDeleteRequestForUserToAlliance(request.GroupId, request.GroupName, $event, function () {
                    _updateSectionHeight(true, true);
                });
            }

            function joinToAlliance(params, element, attrs, scope, $event) {
                if (getMessageBlockedState()) return;
                var request = params.request;
                var toAllianceId = request.GroupId;
                _acceptJoinUserToAlliance(toAllianceId);
            }

            GameServices.paralaxButtonHelper.getOrCreateMyAllianceRequestBtns(requestItem, createMsg, removeRequest, joinToAlliance);
            return requestItem.ButtonsView;

        };

        this.sendRequestJoinToAlliance = function (serverParams, element, attrs, $scope, $event) {
            if (serverParams
                && serverParams.hasOwnProperty("Id")
                && serverParams.Id
                && serverParams.hasOwnProperty("AllianceName")
                && serverParams.AllianceName) {
                var curUserInfo = $self.$currentUserInfo;
                if (!isNpcAllianceName(curUserInfo.allianceName)) {
                    allianceDialogHelper.errorUserInAlliance(curUserInfo.allianceName);
                    return;
                }

                var targetAllianceId = serverParams.Id;
                var targetAllianceName = serverParams.AllianceName;

                // todo  chech existing request
                //allianceDialogHelper.errorUserToAllianceRequestExist(targetAllianceName);

                if (!curUserInfo.userName
                    || !curUserInfo.userId
                    || !curUserInfo.userAvatar
                    || !targetAllianceId
                    || !targetAllianceName
                    || !curUserInfo.allianceRoleId
                    || !curUserInfo.userAvatar.Icon) {
                    console.log("requestJoinToAlliance.error input data incorrect");
                    return;
                }

                var armModelExt = Utils.ModelFactory.AllianceMessageModelExt(false, curUserInfo.allianceRoleId, curUserInfo.allianceUserId);
                armModelExt._setModel(MESSAGE_SOURCE_TYPE.IsUser, curUserInfo.userId, curUserInfo.userName, curUserInfo.userAvatar.Icon);
                armModelExt.Model._setTo(targetAllianceId, targetAllianceName);
                armModelExt.Model.AllianceAccepted = ArmAllianceAcceptedStatus.NoAction;
                $self.myAllianceRequestSendRequestMessage(armModelExt,
                    function (answer) {
                        $self.addNewRequetToMyAlliance(answer, curUserInfo.userName);
                        allianceDialogHelper.openDialogJoinMessageSended(targetAllianceName);
                    },
                    function (errorAnswer) {
                        console.log("sendRequestJoinToAlliance.myAllianceRequestSendRequestMessage.errorAnswer", errorAnswer);
                    }, $event);
            }
        };

        this.deleteRequestHistoryFromAllianceManage = function (requestUserId) {
            if (typeof requestUserId !== "number") return;
            _deleteRequestsFromPlanshet(_getRequestsFromAllianceManage(), requestUserId, false);
        };

        /**
         * когда пользователь приседеняется к альянсу (на сервере уже добавленн)
         * обновляет информацию о количетве пользователей и создает запрос на удаление пеерписки пользователя и альянс менеджера
         * @param {object } newAllianceMembers see c# List<AllianceMember>
         * @param {object} $$RootScope 
         * @returns {void} 
         */
        this.allianceAddNewUsersToAlliane = function (newAllianceMembers, $$RootScope) {
            var data = $self.getMyAllianceData();
            if (data
                && data.hasOwnProperty("AllianceMembers")
                && data.AllianceMembers.hasOwnProperty("Members")
                && data.AllianceMembers.Members) {
                _.forEach(newAllianceMembers, function (newMember, idx) {
                    var tryFindUser = _.find(data.AllianceMembers.Members, function (o) {
                        return o.UserId === newMember.UserId;
                    });
                    if (!tryFindUser) {
                        data.AllianceMembers.Members.push(newMember);
                        //   data.PvpPoint += newMember.UserPvp;
                        data.Pilots++;
                        data.ComplexButtonView.Collection[1].Data.Pilots = data.Pilots;
                        // data.ComplexButtonView.Collection[1].Data.PvpPoint = data.PvpPoint;
                    }

                });

                var deleteMessages = false;
                var role = $self.Role.getRoleByName(data.AllianceMembers.CurrentUserRoleName);
                if (role && role.AcceptNewMembers) deleteMessages = true;
                if (deleteMessages) {
                    _.forEach(newAllianceMembers, function (newMember, idx) {
                        $self.deleteRequestHistoryFromAllianceManage(newMember.UserId);
                    });
                }

            }
            $$RootScope.$broadcast("alliance:user-join-to-alliance", {
                AllianceData: data
            });

        };
        /**
         * обертка над this.allianceAddNewUsersToAlliane  делает из олного эллемента масив
         * @param {object} newAllianceMember   see c# AllianceMember
         * @param {object} $$RootScope 
         * @returns {void} 
         */
        this.allianceAddNewUserToAlliane = function (newAllianceMember, $$RootScope) {
            $self.allianceAddNewUsersToAlliane([newAllianceMember], $$RootScope);
        };

        /**
         * срабатывает когда пользователь выходит из состава альянса
         * @param {int} leftUserId 
         * @param {int} leftAllianceId 
         * @param {object} $$RootScope 
         * @returns {void}   0
         */
        this.onAllianceUserLeftAlliance = function (leftUserId, leftAllianceId, $$RootScope) {
            console.log("aService.onAllianceUserLeftAlliance", {
                leftUserId: leftUserId,
                leftAllianceId: leftAllianceId,
            });
            profileService.removeOtherProfileByUserId(leftUserId);
            var data = $self.getMyAllianceData();
            if (data
                && data.Id === leftAllianceId
                && data.hasOwnProperty("AllianceMembers")
                && data.AllianceMembers.hasOwnProperty("Members")
                && data.AllianceMembers.Members) {
                var tryFindUser = _.find(data.AllianceMembers.Members, function (o) {
                    return o.UserId === leftUserId;
                });
                if (tryFindUser) {
                    console.log("aService.onAllianceUserLeftAlliance.tryFindUser", {
                        leftUserId: leftUserId,
                        leftAllianceId: leftAllianceId,
                        data: data,
                        "data.PvpPoint": data.PvpPoint,
                        "data.Pilots": data.Pilots,
                    });
                    //                    var newPvp = data.PvpPoint - tryFindUser.UserPvp;
                    //                    if (newPvp < 0) newPvp = 0;
                    //                    data.PvpPoint = newPvp;
                    data.Pilots--;
                    data.ComplexButtonView.Collection[1].Data.Pilots = data.Pilots;
                    //  data.ComplexButtonView.Collection[1].Data.PvpPoint = data.PvpPoint;

                    _.remove(data.AllianceMembers.Members, function (o) {
                        return o.UserId === leftUserId;
                    });
                }
            }

            console.log("aService.onAllianceUserLeftAlliance", {
                leftUserId: leftUserId,
                leftAllianceId: leftAllianceId,
                $$RootScope: $$RootScope
            });

            $$RootScope.$broadcast("alliance:user-left-from-alliance", {
                leftUserId: leftUserId,
                leftAllianceId: leftAllianceId
            });


        };


        //#endregion

        //#region ManageTab 
        this.getManageTabData = function () {
            var data = getBodyByIdx(2);
            if (data) return data.TemplateData;
            return null;
        };;
        //#endregion


        //#region DisbandAlliance
        var disbandInProgress = false;
        this.onAllianceDisbanded = function (disbandedAlianceId, currentConnectionUser, newPlanshetData) {
            removeAllianceNameFromLocal(disbandedAlianceId);
            if (currentConnectionUser) {
                _setNewPlanshet(newPlanshetData, true);
                //console.log("onAllianceDisbanded.isCurrentConnectionUser", {
                //    currentConnectionUser: currentConnectionUser,
                //    newPlanshetData: newPlanshetData,
                //    allianceId: allianceId
                //});
            }
            else {
                profileService.removeProfilesByAllianceId(disbandedAlianceId);
                //todo очистить косвенные данные с альянсом по ид реквесты поиски итп
            }
        };

        this.disbandAlliance = function (serverParams, element, attrs, $scope, $event) {
            if (disbandInProgress) return;
            // ReSharper disable once FunctionsUsedBeforeDeclared
            var userInfo = $self.$currentUserInfo;
            var allianceId = userInfo.allianceId;
            if (!allianceId) {
                console.log("alliance id not exist", $self.getMyAllianceData());
                return;
            }
            if (!$self.Role.roleNativeNames.equal($self.Role.roleNativeNames.CreatorId, userInfo.allianceRoleId)) return;


            allianceDialogHelper.openDialogDisbandAlliance(userInfo.allianceName, $event)
                .then(function () {
                    disbandInProgress = true;
                    var hub = $self.$hub;
                    hub.allianceDisbandAlliance()
                        .finally(function () {
                            disbandInProgress = false;
                        }).then(function (isOk) {
                            console.log("onAllianceDisbanded.isOk", isOk);
                        }, function (errorAnswer) {
                            console.log("disbandAlliance.errorAnswer", errorAnswer);
                        });
                }, function () {
                    //cancel
                });



        };

        //#endregion

        //#region CreateAlliance
        var _allianceCreateMessages = null;
        this.allianceCreateMessages = function () {
            if (_allianceCreateMessages) return _allianceCreateMessages;
            var allianceCreatePrice = 100;
            var endMsgPrice = " " + allianceCreatePrice + " CC";
            var cls = Utils.CreateLangSimple;
            _allianceCreateMessages = {
                allianceCreatePrice: allianceCreatePrice,
                trCreateAlliance: cls("EN Create alliance",
                    "ES Create alliance",
                    "RU Create alliance"),
                trAllianceTitlle: cls("EN Allaince name",
                    "ES Allaince name",
                    "RU Allaince name"),
                trCreate: cls("Create", "Crear", "Создать"),
                trErrorMsg: {
                    required: cls("en is required",
                        "es is required",
                        "ru is required"),
                    minlength: cls("en min minlength = 5",
                        "es min minlength = 5",
                        "ru min minlength = 5"),
                    maxlength: cls("en max maxlength = 12",
                        "es max maxlength = 12",
                        "ru max maxlength = 12"),
                    pattern: cls("en uppercase no spase first is letter end is letter or number",
                        "es uppercase no spase first is letter end is letter or number",
                        "ru uppercase no spase first is letter end is letter or number"),
                    notUnic: cls("EN Name not unic",
                        "ES Name not unic",
                        "RU Name not unic"),
                    notChecked: cls("EN not checked",
                        "ES not checked",
                        "RU not checked")

                },
                trMsgCanBuy: {
                    trCanBuy: cls("en Стоимость лицензии составляет :" + endMsgPrice,
                        "es Стоимость лицензии составляет :" + endMsgPrice,
                        "ru Стоимость лицензии составляет :" + endMsgPrice),
                    trError: cls("en На вашем балансе недостаточно средств стоимость лицензии составляет :" + endMsgPrice,
                        "es На вашем балансе недостаточно средств стоимость лицензии составляет :" + endMsgPrice,
                        "ru На вашем балансе недостаточно средств стоимость лицензии составляет :" + endMsgPrice)
                },
                trConfirm: {
                    trTitle: cls("EN Вы создаете альянс : ",
                        "ES Вы создаете альянс : ",
                        "RU Вы создаете альянс : "),
                    trConfirm: cls("Confirm",
                        "Confirmar",
                        "Подтвердить"),
                    trCancel: cls("Cancel",
                        "Cancelar",
                        "Отменить"),
                    trTextContent: cls("en C вашего счета будет списанно " + endMsgPrice,
                        "es C вашего счета будет списанно " + endMsgPrice,
                        "ru C вашего счета будет списанно " + endMsgPrice)
                },
                trConfirmGc: {
                    trTitle: cls("EN Congratulations!",
                        "ES Congratulations!",
                        "RU Congratulations!"),
                    trHtmlContent: function (allianceName) {
                        var tr = cls("EN Теперь вы лидер альянса  - " + setSpanText(allianceName, " unique-name ") + " для завершения настройки передйтите в раздел управления.",
                            "ES Теперь вы лидер альянса  - " + setSpanText(allianceName, " unique-name ") + " для завершения настройки передйтите в раздел управления.",
                            "RU Теперь вы лидер альянса  - " + setSpanText(allianceName, " unique-name ") + " для завершения настройки передйтите в раздел управления.");
                        return tr.getCurrent();

                    }
                },
                trCheck: cls("EN Check", "ES Check", "RU Check")
            };
            return _allianceCreateMessages;
        };

        this.checkNameIsUnic = function (checkName, onSucsess, onError, nameUppered) {
            if (!checkName) onSucsess(false);
            if (checkName.length < 5) onSucsess(false);
            if (!nameUppered) checkName = checkName.toUpperCase();
            if (allianceNameIsExist(checkName)) {
                onSucsess(false);
                return;
            }

            $self.$hub
                .allianceCheckAllianceNameIsUnic(checkName)
                .then(function (answer) {
                    if (typeof answer === "boolean") {
                        onSucsess(answer);
                        return;
                    }
                    else if (answer.hasOwnProperty("Id") && answer.hasOwnProperty("Name")) {
                        addAllianceNameToLocal(answer);
                        onSucsess(false);
                        return;
                    }
                    else if (!answer) onSucsess(false);

                }, function (errorAnswer) {
                    var errMsg = Errors.GetHubMessage(errorAnswer);
                    if (onError instanceof Function) onError(errMsg);

                });

        };
        this.canCreateAlliance = function canCreateAlliance() {
            var mdata = $self.getMyAllianceData();
            return isNpcAllianceName(mdata.Name);
        };
        this.createAlliance = function (checkedAllianceName, nameUppered, onSucsess, onError, resourceService) {
            if (!nameUppered) checkedAllianceName = checkedAllianceName.toUpperCase();
            var hub = $self.$hub;
            hub.allianceCreateAlliance(checkedAllianceName)
                .then(function (answer) {
                    var connUser = answer["ConnectionUser"];
                    hub._updateCurrentUser(connUser);
                    _setNewPlanshet(answer["NewAlliancePlanshet"], true);
                    addAllianceNameToLocal({
                        Id: connUser.AllianceId,
                        Name: connUser.AllianceName
                    });
                    resourceService.setCc(answer["NewBalanceCc"]);
                    if (onSucsess instanceof Function) onSucsess(connUser.AllianceName);

                    console.log("createAlliance answer", answer);
                }, function (errorAnswer) {
                    var errMsg = Errors.GetHubMessage(errorAnswer);
                    if (onError instanceof Function) onError(errMsg);
                });
        };


        //#endregion

        // #region Edit alliance


        this.setEditAllianceInfoModelToScope = function (allianceEditInfoCtrl, scope, skipParent) {

            var myAllianceData = $self.getMyAllianceData();
            var translate = $self._allianceTranslate;

            var cb = GameServices.paralaxButtonHelper.ComplexButtonView();
            cb.SimpleCentr(null, "Edit info");

            function _blockState(val) {
                planshetService.setInProgress(val);
                _updateMessageBlockedState(val);
            }

            var tax = statisticHelper.createStatItemModel(translate.tax, myAllianceData.TaxView + "");
            tax.hasOnclick = true;
            tax.onClick = function ($event) {
                if (getMessageBlockedState() || planshetService.getInProgress()) return;
                _blockState(true);
                EM.Audio.GameSounds.dialogOpen.play();
                allianceDialogHelper
                    .openDialogChengeTax(myAllianceData.Tax, $event)
                    .then(function (newTax) {
                        if (_.endsWith(newTax, "%")) newTax = newTax.substr(0, newTax.length - 1);
                        var _tax = _.toInteger(newTax);
                        if (_tax === myAllianceData.Tax) {
                            _blockState(false);
                            return;
                        }
                        if (_tax < 0) _tax = 0;
                        else if (_tax > 100) _tax = 100;
                        _blockState(false);
                        $self.$hub.allianceInfoUpdateTax(_tax);
                        EM.Audio.GameSounds.dialogClose.play();

                    }, function () {
                        EM.Audio.GameSounds.dialogClose.play();
                        _blockState(false);
                        //cancel
                    });

                console.log("on click by tax ", { $event: $event });
            }

            var stats = [tax];
            var bgImage = statisticHelper.createBgImage("", myAllianceData.Name);
            bgImage.url = myAllianceData.Label.Detail;
            bgImage.style = { backgroundImage: Utils.CssHelper.SetUrl(bgImage.url) };
            bgImage.setTemplate("alliance-change-label.tmpl");
            statisticHelper.resizePictire(bgImage.style, bgImage.url);

            var description = {
                text: myAllianceData.AllianceDescription,
                activateEdit: false,
                mediumBindOptions: {
                    toolbar: false,
                    disableEditing: true,
                    placeholder: false
                }
            };
            function broadCastMe(disableEditing) {
                description.mediumBindOptions.disableEditing = disableEditing;
                if (disableEditing) description.mediumBindOptions.toolbar = false;
                //else mediumBindOptions.toolbar = { buttons: ["removeFormat", "bold", "italic", "underline", "h1", "h2", "h3"] };
                else description.mediumBindOptions.toolbar = {
                    buttons: ["bold",
                        "italic",
                        "underline",
                        "strikethrough",
                        "subscript",
                        "superscript",
                        "anchor",
                        "image",
                        "quote",
                        "pre",
                        "orderedlist",
                        "unorderedlist",
                        "indent",
                        "outdent",
                        "justifyLeft",
                        "justifyCenter",
                        "justifyRight",
                        "justifyFull",
                        "h1",
                        "h2",
                        "h3",
                        "h4",
                        "h5",
                        "h6",
                        "removeFormat",
                        "html"
                    ]
                };
                scope.aeiCtrl.description = description;
                scope.$broadcast("mediumEditor:update-option", description.mediumBindOptions);
            }

            description.setActivate = function (avtivate) {
                mainHelper.applyTimeout(function () {
                    description.activateEdit = avtivate;
                    broadCastMe(!avtivate);
                });

            };

            description.resetDescription = function () {
                description.text = myAllianceData.AllianceDescription;
                description.setActivate(false);
                EM.Audio.GameSounds.defaultButtonClose.play();
            };
            description.sendDescription = function (params, element, attrs, $scope, $event) {
                if (GameServices.planshetService.getInProgress()) return;

                var hasChange = typeof description.text === "string" && myAllianceData.AllianceDescription !== description.text;
                if (hasChange) {

                    if (description.text.length <= maxLenghtConsts.AllianceDescription) {
                        _blockState(true);
                        $self.$hub.allianceInfoUpdateDescription(description.text)
                            .finally(function () {
                                _blockState(false);
                            })
                            .then(function (answer) {
                                myAllianceData.AllianceDescription = answer.Description;
                                description.text = answer.Description;
                                description.setActivate(false);
                                $self.onAllianceInfoUpdateDescription(answer.Description, answer.Id);
                                EM.Audio.GameSounds.defaultButtonClose.play();

                            }, function (errorAnswer) {
                                var msg = Errors.GetHubMessage(errorAnswer);
                                if (msg === ErrorMsg.OverMaxLength) {
                                    console.log("msg === ErrorMsg.OverMaxLength  (message lenght > 600)");
                                }
                                else if (msg === ErrorMsg.NotPermitted) {
                                    console.log("msg === ErrorMsg.NotPermitted  not has edit role in alliance");
                                }
                                description.resetDescription();
                                console.log("msg", { msg: msg, errorAnswer: errorAnswer });
                            });

                    }
                    else {
                        allianceDialogHelper.errorDescriptionOverMaxLength($event, description.text.length).finally(description.resetDescription);
                    }
                }
                else description.resetDescription();

            };

            var buttons = {
                edit: GameServices.paralaxButtonHelper.ButtonsView(),
                send: GameServices.paralaxButtonHelper.ButtonsView(),
                cancel: GameServices.paralaxButtonHelper.ButtonsView()
            };

            buttons.edit.ConstructorSizeBtn(1, true, $self._commonTranslate.edit, function () {
                console.log(" buttons.edit.ConstructorSizeBtn", {
                    getInProgress: GameServices.planshetService.getInProgress(),
                    buttons: buttons,
                    scope: scope
                });
                if (GameServices.planshetService.getInProgress()) return;
                EM.Audio.GameSounds.defaultButtonClick.play();
                description.setActivate(true);
            });
            buttons.send.ConstructorSizeBtn(2, true, $self._commonTranslate.send, description.sendDescription);
            buttons.cancel.ConstructorSizeBtn(2, true, "Cancel", description.resetDescription);


            allianceEditInfoCtrl.description = description;
            allianceEditInfoCtrl.Buttons = buttons;


            allianceEditInfoCtrl.complexButtonView = cb;
            allianceEditInfoCtrl.onClickCb = function ($event) {
                scope.dropElementonClickByDropable(skipParent);
              //  console.log("setEditAllianceInfoModelToScope.$event", { $event: $event, scope: scope });
            };
            allianceEditInfoCtrl.allianceStatsModel = statisticHelper.createStatisticModel(stats, bgImage);

            description.setActivate(false);

        }

        this._updateAllianceInfo = function (_oldAllianceData, newAllianceData) {
            if (!newAllianceData || !_oldAllianceData) return null;
            var a = newAllianceData;
            var cb0 = _oldAllianceData.ComplexButtonView.Collection[0];
            var cb1 = _oldAllianceData.ComplexButtonView.Collection[1];
            var cb2 = _oldAllianceData.ComplexButtonView.Collection[2];
            mainHelper.applyTimeout(function () {
                if (_oldAllianceData.Id !== a.Id) {
                    _oldAllianceData.Id = a.Id;
                }
                if (_oldAllianceData.LeaderName !== a.LeaderName) {
                    _oldAllianceData.LeaderName = a.LeaderName;
                }
                if (_oldAllianceData.Tax !== a.Tax) {
                    _oldAllianceData.Tax = a.Tax;
                    _oldAllianceData.TaxView = a.Tax + "%";
                }
                if (_oldAllianceData.AllianceDescription !== a.AllianceDescription) {
                    _oldAllianceData.AllianceDescription = a.AllianceDescription || "";
                }
                if (!_.isEqual(_oldAllianceData.Label, a.Label)) {
                    Utils.UpdateObjData(_oldAllianceData.Label, a.Label);
                }
                if (!_.isEqual(_oldAllianceData.LeaderImg, a.LeaderImg)) {
                    Utils.UpdateObjData(_oldAllianceData.LeaderImg, a.LeaderImg);
                }
                if (_oldAllianceData.Pilots !== cb1.Pilots !== cb1.Data.Pilots !== a.Pilots) {
                    _oldAllianceData.Pilots = cb1.Pilots = cb1.Data.Pilots = a.Pilots;
                }
                if (_oldAllianceData.PvpPoint !== cb1.PvpPoint !== cb1.Data.PvpPoint !== a.PvpPoint) {
                    _oldAllianceData.PvpPoint = cb1.PvpPoint = cb1.Data.PvpPoint = a.PvpPoint;
                }
                if (_oldAllianceData.Name !== cb0.Title !== cb0.Data.Title !== cb1.Name !== cb1.Data.Name !== cb2.Title !== a.Name) {
                    _oldAllianceData.Name = cb0.Title = cb0.Data.Title = cb1.Name = cb1.Data.Name = cb2.Title = a.Name;
                }

                if (_oldAllianceData.ControlledPlanet !== cb1.ControlledPlanet !== cb1.Data.ControlledPlanet !== a.ControlledPlanet) {
                    _oldAllianceData.ControlledPlanet = cb1.ControlledPlanet = cb1.Data.ControlledPlanet = a.ControlledPlanet;
                }
                if (cb0.ImagePathOrCss !== cb0.Data.ImagePathOrCss !== newAllianceData.Label.Icon) {
                    cb0.ImagePathOrCss = cb0.Data.ImagePathOrCss = newAllianceData.Label.Icon;
                }
                if (cb2.ImagePathOrCss !== cb2.Data.ImagePathOrCss !== newAllianceData.LeaderImg.Icon) {
                    cb2.ImagePathOrCss = cb2.Data.ImagePathOrCss = newAllianceData.LeaderImg.Icon;

                }


            });
            if ($self.isCurrentModel()) updatePlanshet();
            return _oldAllianceData;
        }



        /**
         * срабатывает когда пользователь обновил лейбл альянса   (на сервере данные уже обновленны)
         * @param {object} newUserImageModel  see    Utils.ModelFactory.IUserImageModel;
         * @param {int} allianceId 
         * @returns {void}
         */
        this.onAllianceInfoUpdateLabel = function (newUserImageModel, allianceId) {
            var myAllianceData = $self.getMyAllianceData();
            if (!myAllianceData || myAllianceData.Id !== allianceId) return;
            myAllianceData.Label = newUserImageModel;
            $self._updateAllianceInfo(myAllianceData, myAllianceData);
            var ai = getAlianceItemInList(allianceId);
            $self._updateAllianceInfo(ai, myAllianceData);
            profileService.updateAllianceInfoInProfiles(myAllianceData);

        };
        /**
         * когда пользователь обновил описание альянса   (на сервере данные уже обновленны)
         * @param {string} newDescription 
         * @param {int} allianceId 
         * @returns {void} 
         */
        this.onAllianceInfoUpdateDescription = function (newDescription, allianceId) {
            var myAllianceData = $self.getMyAllianceData();
            if (!myAllianceData || myAllianceData.Id !== allianceId) return;
            myAllianceData.AllianceDescription = newDescription;
            $self._updateAllianceInfo(myAllianceData, myAllianceData);
            var ai = getAlianceItemInList(allianceId);
            $self._updateAllianceInfo(ai, myAllianceData);
            profileService.updateAllianceInfoInProfiles(myAllianceData);
        };
        /**
         *  когда пользователь обновил налог альянса (на сервере данные уже обновленны)
         * @param {int} newTax 
         * @param {int} allianceId 
         * @returns {void} 
         */
        this.onAllianceInfoUpdateTax = function (newTax, allianceId) {
            var myAllianceData = $self.getMyAllianceData();
            if (!myAllianceData || myAllianceData.Id !== allianceId) return;
            myAllianceData.Tax = newTax;
            myAllianceData.TaxView = newTax + "%";
            $self._updateAllianceInfo(myAllianceData, myAllianceData);
            var ai = getAlianceItemInList(allianceId);
            $self._updateAllianceInfo(ai, myAllianceData);
            profileService.updateAllianceInfoInProfiles(myAllianceData);
        };



        // #endregion

        // #region Tech

        this.getAllianceTechModel = function () {
            var mad = $self.getMyAllianceData();
            if (!mad) return null;
            return mad.AllianceTechesOut;

        };

        var _updateTechRequestInProgress = false;



        this.$updateTechConditionIfTechUpdate = function (teches, newTech) {
            if (!newTech.Progress.Level) return;
            if (newTech.NativeName === "TechDamageControl" || newTech.NativeName === "TechWeaponUpgrade") {
                _.forEach(teches, function (techItem, key) {
                    if (!techItem.Disabled) return;
                    if (techItem.Conditions[newTech.NativeName] <= newTech.Progress.Level) {

                        var secondKey = newTech.NativeName === "TechWeaponUpgrade" ? "TechDamageControl" : "TechWeaponUpgrade";
                        var secondCondition = techItem.Conditions[secondKey] <= teches[secondKey].Progress.Level;
                        if (secondCondition) {
                            techItem.Disabled = false;
                        }
                    }

                });
            }



        };
        this.$prepareTechItem = function (myAllianceData, techItem) {
            if (!techItem.infoStatsModel) {
                var props = techItem.Progress.Advanced;
                var stats = [];
                _.forEach(props, function (val, key) {
                    var propVal = val.CurrentValue;
                    if (key !== "Level" && propVal) {
                        propVal = _.round(propVal, 2);
                        propVal += "%";
                    }
                    stats.push(statisticHelper.createStatItemModel(val.PropertyName, propVal));
                });
                var img = statisticHelper.createBgImage(techItem.SpriteImages.Detail, techItem.Text.Name);
                img.onClick = function ($event) {
                    GameServices.techTreeHelper.createTechTreeDialog($event, true);
                };
                techItem.infoStatsModel = statisticHelper.createStatisticModel(stats, img);
            }
            if (!techItem.$getCanUpgrade) {
                techItem.$getCanUpgrade = function () {
                    return myAllianceData.AllianceTechesOut.CanUpgrade;
                };
            }
            if (myAllianceData.AllianceTechesOut.CanUpgrade && !techItem.Disabled && !techItem.$controls) {
                techItem.$controls = {
                    buyBtn: GameServices.paralaxButtonHelper.ButtonsView()
                        .ConstructorSizeBtn(1, true, "Upgrade (" + techItem.BasePrice.Cc + " Alliance CC)", function (params, element, attrs, $buttonScope, $event) {
                            if (_updateTechRequestInProgress) return;
                            if (techItem.BasePrice.Cc > myAllianceData.BalanceCc) return;
                            if (!myAllianceData.AllianceTechesOut.CanUpgrade) {
                                allianceDialogHelper.openDialogNotPermitted($event).then(function () {
                                    techItem.$controls = null;
                                    delete techItem.$controls;
                                });
                                return;
                            }

                            var nextLevelTech = techItem.Progress.Level + 1;
                            _updateTechRequestInProgress = true;
                            allianceDialogHelper.openDiaologConfirmTechUpgrade($event, techItem.Text.Name, nextLevelTech)
                                .then(function () {
                                    //confirmed

                                    var techName = techItem.Text.Name;
                                    $self.$hub.allianceUpdateAllianceTech(techItem.TechType).then(function (answer) {
                                        console.log("allianceUpdateAllianceTech answer");
                                        allianceDialogHelper.openDiaologTechUpgraded($event, techName, nextLevelTech);
                                        _updateTechRequestInProgress = false;
                                    }, function (errorAnswer) {
                                        var msg = Errors.GetHubMessage(errorAnswer);
                                        _updateTechRequestInProgress = false;
                                        if (msg === ErrorMsg.NotPermitted) {
                                            allianceDialogHelper.openDialogNotPermitted($event);
                                        }
                                        else if (msg === ErrorMsg.NotEnoughCc) {
                                            //open dialog NotEnoughCc alliance cc
                                            throw new Error("ErrorMsg.NotEnoughCc");
                                        }
                                        else {
                                            throw Errors.ClientNotImplementedException({
                                                errorAnswer: errorAnswer,
                                                msg: msg,
                                                techItem: techItem,
                                                myAllianceData: myAllianceData
                                            });
                                        }
                                    });

                                });

                            console.log("buyBtn", {
                                techModel: myAllianceData.AllianceTechesOut,
                                techItem: techItem
                            });
                        })
                };
            }
        };
        this.prepareTechList = function (myAllianceData) {
            //StatModel
            var list = [];
            _.forEach(myAllianceData.AllianceTechesOut.Teches, function (techItem) {
                $self.$prepareTechItem(myAllianceData, techItem);
                list.push(techItem);
            });

            return list;

        };
        this.onAllianceTechUpdated = function (updatedTechItem, newAllianceBalanceCc, $$RootScope) {
            //todo code heare
            var data = $self.getMyAllianceData();
            data.BalanceCc = newAllianceBalanceCc;
            $self.$updateTechConditionIfTechUpdate(data.AllianceTechesOut.Teches, updatedTechItem);
            _.forEach(data.AllianceTechesOut.Teches, function (oldItem, key) {
                if (oldItem.TechType === updatedTechItem.TechType) {
                    data.AllianceTechesOut.Teches[key] = updatedTechItem;
                    return false;
                }
            });
            $$RootScope.$broadcast("alliance:tech-updated", { newTech: updatedTechItem, myAllianceData: data });

        };

        // #endregion

        //#region Other


        this.getAllianceItemCompexBtnConfig = function (allianceId) {
            return _.find($self.getAllianceList(), { Id: allianceId }).ComplexButtonView;
        };
        this.setInitialAlliance = function (initialAllianceModel) {
            _setNewPlanshet(initialAllianceModel);
        };
        this.setAllianceNames = function (names) {
            allianceNames = [];
            _.forEach(names, function (val, idx) {
                allianceNames.push(Utils.ModelFactory.IAllianceNameSerchItem(val));
            });
            $self._allianceTotalCount = names.length;
        };
        this.initializeScroll = function (bodyElement) {

            var opts = $self._scrollerOptions;
            opts.HtmlElementToBind = bodyElement;
            opts.GetTotalServerCountPromise = getTotalAllianceServerItems;
            opts.GetItemsCollection = $self.getAllianceList;
            opts.GetMinIdOrCondition = getMinAlliancePoint;
            opts.GetPage = getAlliancePage;
            opts.SaveAndSetItem = saveNewAllianceItem;
            scrollerHelper.initializeScroll($self._scrollerOptions);
        };

        this.onOtherUserConnected = function (otherUserId, unkAllianceId, totalOnlineCount) {
            if (unkAllianceId === $self.getMyAllianceId()) $self.updateAllianceMemberStatusByUserId(unkAllianceId, otherUserId, true);
        };
        this.onUserLeftGame = function (disconnectedConnectionUser) {
            var u = disconnectedConnectionUser;
            if ($self.$hub.isValidUserData(u)) {
                $self.updateAllianceMemberStatusByUserId(u.AllianceId, u.UserId, false);
            }
        }


        this.onUserUpdateAvatar = function (newAvatar, userId, allianceId) {
            var data = $self.getMyAllianceData();
            if (data) {
                var member = _getAllianceMemberByUserId(allianceId, userId);
                if (member && member.UserName === data.LeaderName) {
                    data.LeaderImg = newAvatar;
                    data.ComplexButtonView.Collection[2].Data.ImagePathOrCss = newAvatar.Icon;
                    if ($self.isCurrentModel()) updatePlanshet();
                }
            }
        }
        this.onLocalUserUpdateAvatar = function (newAvatar) {
            var data = $self.$currentUserInfo;
            if (data) $self.onUserUpdateAvatar(newAvatar, data.userId, data.allianceId);
        }

        //#endregion


    }
]);