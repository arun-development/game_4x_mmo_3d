Utils.CoreApp.gameApp.service("journalService",
    [
        "planshetService",
        "tabService",
        "hangarService", "journalDialogHelper", "npcHelper", "timerHelper", "scrollerHelper", "journalMotherJumpDialogHelper", "mainHelper",
        function (planshetService,
                 tabService,
                 hangarService,
                 journalDialogHelper,
                 npcHelper,
                 timerHelper,
                 scrollerHelper,
                 journalMotherJumpDialogHelper,
                 mainHelper) {
            var $self = this;

            this.$planshetIndex = null;
            Object.defineProperty($self,
                "UniqueId",
                {
                    value: "journal-collection",
                    writable: false,
                    configurable: false
                });
            Object.defineProperty($self,
                "PlanshetModel",
                {
                    get: function () {
                        if (!$self.$planshetIndex)
                            throw Errors.ClientNullReferenceException({
                                $self: $self
                            },
                                "$self.$planshetIndex",
                                "journalService",
                                ErrorMsg.NoData);
                        var model = planshetService.$planshetModels[$self.$planshetIndex];
                        if (model.UniqueId !== $self.UniqueId)
                            throw Errors.ClientNotImplementedException({
                                $self: $self
                            },
                                "is not  journal model");
                        return model;
                    },
                    set: function (value) {
                        planshetService.updatePlanshetItemData(value, true, Utils.Time.TIME_CACHE_JOURNAL);
                        $self.$planshetIndex = planshetService.getModelIndex($self.UniqueId);
                    }
                });

            Object.defineProperty($self, "$currentUserInfo", {
                get: function () {
                    //UserId: crData.userId,
                    //UserName: crData.userName,
                    //UserIcon: crData.userAvatar.Icon,
                    //AllianceId: crData.allianceId,
                    //AllianceName: crData.allianceName,
                    //AllianceRoleId: crData.allianceRoleId,
                    return GameServices.allianceService.$currentUserInfo;

                }
            });
            this.$taskCreateDelayedActions = {};

            function updatePlanshet(advancedAction) {
                planshetService.updatePlanshet(advancedAction);
            };

            var _startDataInitialized = false;
            var newTaskButtons;

            var _taskActionButtons;
            var journalIdx = {
                task: 0,
                report: 1,
                spy: 2
            };
            var statuses = {
                noJournal: 0,
                inCache: 1,
                isActive: 2
            };

            var skagryName = npcHelper.NPC_NATIVE_NAMES.SKAGRY;

            Object.defineProperty($self,
                "$hub",
                {
                    get: function () {
                        return GameServices.mainGameHubService;
                    }
                });

            // порядок кнопок в листе кнопок таск (journal.Bodys[0].TemplateData.Buttons)
            var taskButtonEx = ["NewTaskAttack", "NewTaskTransfer", "Reset", "LoadAll", "SubmitForm"];
            var spyBtnsIds = ["btn-serch-target-spy"];

            //#region Helpers     

            function getBodyByIdx(idx) {      
                return $self.PlanshetModel.Bodys[idx];
            }

            function getUpdateStatus(update) {
                if (!$self.$planshetIndex) return true;
                if (update === undefined || update === null) {
                    update = (statuses.noJournal === $self.journalStatus());
                    return update;
                }
                return update;
            }

            function orderById(collection, directionAsk) {
                return _.orderBy(collection, ["Id"], directionAsk ? ["ask"] : ["desc"]);

            }

            this.getTabs = function () {
                return $self.PlanshetModel;
            };
            this.updatePlanshetView = function (advancedAction) {
                planshetService.setCurrentModel($self.UniqueId);
                if (advancedAction instanceof Function) updatePlanshet(advancedAction);
                else updatePlanshet();
            };

            //#endregion

            //#region Tabs Local
            function getTabDataByIdx(idx) {
                return getBodyByIdx(idx).TemplateData;
            }

            function getTaskData() {
                return getTabDataByIdx(journalIdx.task);
            }

            function getReportData() {
                return getTabDataByIdx(journalIdx.report);
            }

            function getSpyData() {
                return getTabDataByIdx(journalIdx.spy);
            }

            //#endregion

            //#region Total and Max

            // #region Deprecated
            function getMaxItems(tabIdx) {
                return getTabDataByIdx(tabIdx).MaxItems;
            }
            this.getTaskMaxItems = function () {
                return getMaxItems(journalIdx.task);
            };
            this.getSpyMaxItems = function () {
                return getMaxItems(journalIdx.spy);
            };
            this.getReportMaxItems = function () {
                return getMaxItems(journalIdx.report);
            };        

            // #endregion

            function getTotalItems(tabIdx) {
                return getTabDataByIdx(tabIdx).TotalItems;
            }



            this.getTaskTotalItems = function () {
                var d = getTaskData();
                if (typeof d.TotalItems !== "number") {
                    d.TotalItems = $self.getTaskCollection().length;
                }
                return d.TotalItems;

            };

            this.getReportTotalItems = function (isLocal) {
                var count = getTotalItems(journalIdx.report);
                if (isLocal) return count;
                var deferred = mainHelper.$q.defer();
                deferred.resolve(count, angular.noop);
                return deferred.promise;
            };

            this.getSpyTotalItems = function (isLocal) {
                var count = getTotalItems(journalIdx.spy);
                if (isLocal) return count;
                var deferred = mainHelper.$q.defer();
                deferred.resolve(count, angular.noop);
                return deferred.promise;
            };

            //#endregion

            //#region MotherJump
            var $mjd = journalMotherJumpDialogHelper;
            var motherTimerId = "journalTask_motherJumpTimer";

            function _setLocalMotherJump(newMotherJumpModel) {
                mainHelper.applyTimeout(function () {
                    var td = getTaskData();
                    td.MotherJump = newMotherJumpModel;
                });
            }

            function _resetMotherJumpModel() {
                var data = getTaskData();
                if (data) {
                    timerHelper.deleteTimerFromList(motherTimerId);
                    data.MotherJump = null;
                    updatePlanshet();
                    EM.EstateData.SaveMotherSpaceLocationFromData(GameServices.estateService.getEstateItem(0));
                }

            }

            //todo проверить текущее состояние и назначить анимацию если текущее состояние мазер
            function _activateMotherJump(newAdress, motherItemData) {

                EM.EstateData.UpdateMotherDataLocation(newAdress.Galaxy, newAdress.Sector, newAdress.System);
                var sourceSysName = motherItemData.SourceSystemName;
                var targetSysName = motherItemData.TargetSystemName;
                _resetMotherJumpModel();

                var curState = EM.EstateData.GetCurrentSpaceLocation();
                if (curState.SystemId === newAdress.System && newAdress.OwnId === curState.SpaceObjectId) {
                    console.log("curState.SystemId === newAdress.System && newAdress.OwnId === curState.SpaceObjectId");
                }
                $mjd.openDialogMotherJumped(sourceSysName, targetSysName);
            }

            function _instMotherJump(ccPrice, newAdress, motherItemData) {
                mainHelper.applyTimeout(function () {
                    GameServices.resourceService.addCc(ccPrice, "-");
                });
                _activateMotherJump(newAdress, motherItemData);
            }

            function _requestCheckMotherJumpTimeDone(advancedAction, motherItemData) {
                $self.$hub.journalIsMotherJumpTimeDone()
                    .then(function (answer) {
                        if (typeof answer === "number") advancedAction(answer);
                        else _activateMotherJump(answer, motherItemData);
                    },
                        function (errorAnswer) {
                            var msg = Errors.GetHubMessage(errorAnswer);
                            throw Errors.ClientNotImplementedException({
                                msg: msg,
                                errorAnswer: errorAnswer
                            });
                        });
            }

            this.requestGetMotherJumpTime = function (onSucsess, onError, sourceSystemId, targetSystemId) {
                if (!(onSucsess instanceof Function)) return;
                if (!sourceSystemId || !targetSystemId) return;
                if (!(onError instanceof Function)) {
                    onError = function (errorAnswer) {
                        var msg = Errors.GetHubMessage(errorAnswer);
                        throw Errors.ClientNotImplementedException({
                            msg: msg,
                            errorAnswer: errorAnswer
                        });
                    }
                }
                $self.$hub.journalGetMotherJumpTime(sourceSystemId, targetSystemId).then(onSucsess, onError);

            };
            this.setMotherJumpTimer = function (motherJumpModel) {
                if (motherJumpModel && motherJumpModel.FlyDuration && motherJumpModel.FlyDuration > 0) {
                    EM.EstateData.SaveMotherSpaceLocationFromData(GameServices.estateService.getEstateItem(0),
                        motherJumpModel.TargetSystemId,
                        motherJumpModel.StartTime,
                        motherJumpModel.EndTime);
                    _setLocalMotherJump(motherJumpModel);
                }

            };
            this.requestAddTaskMotherJump = function (guid, onError) {
                $self.$hub.journalAddTaskMotherJump(guid)
                    .then($self.setMotherJumpTimer,
                        function (errorAnswer) {
                            if (onError instanceof Function) onError(errorAnswer);
                            else {
                                var msg = Errors.GetHubMessage(errorAnswer);
                                throw Errors.ClientNotImplementedException({
                                    msg: msg,
                                    errorAnswer: errorAnswer
                                });
                            }
                        });
            };
            this.getLocalMotherJump = function () {
                return getTaskData().MotherJump;
            };
            this.hasJumpMother = function () {
                return (!!$self.getLocalMotherJump());
            };

            this.updateJumpMotherTimer = function (timerScope, motherItemData) {
                var stop = timerHelper.updateStringTimer(timerScope);
                if (stop) {
                    _requestCheckMotherJumpTimeDone(function (answer) {
                        if (typeof answer === "number") {
                            timerScope.timerData.Duration = answer;
                            timerScope.timerData.IsProgress = true;
                            timerHelper.registerSimpleTimer(timerScope, timerScope.timerData);
                        }
                    },
                        motherItemData);
                }
                return stop;
            };

            this.requestCancelMotherJump = function () {
                var data = $self.getLocalMotherJump();
                if (data) {
                    var jupId = data.Id;
                    $self.$hub.journalCancelMotherJump(jupId)
                        .then(_resetMotherJumpModel,
                            function (errorAnswer) {
                                var msg = Errors.GetHubMessage(errorAnswer);
                                if (msg === "TaskCompleted") {
                                    //todo  сделать диалог
                                    _resetMotherJumpModel();
                                }
                                else {
                                    throw Errors.ClientNotImplementedException({
                                        msg: msg,
                                        errorAnswer: errorAnswer
                                    });
                                };
                            });
                }
            };
            this.requestInstMotherJump = function (ccPrice, $event) {
                var data = $self.getLocalMotherJump();
                if (data) {
                    $mjd.openDialogBuyInstMotherJump(data.SourceSystemName, data.TargetSystemName, ccPrice, $event)
                        .then(function () {
                            // confirm
                            $self.$hub.journalInstMotherJump(data.Id)
                                .then(function (answer) {
                                    _instMotherJump(ccPrice, answer, data);
                                },
                                    function (errorAnswer) {
                                        var msg = Errors.GetHubMessage(errorAnswer);
                                        if (msg === ErrorMsg.TaskCompleted) {
                                            $mjd.openDialogErrorMoterJumpTaskCompleted();
                                        }
                                        throw Errors.ClientNotImplementedException({
                                            msg: msg,
                                            errorAnswer: errorAnswer
                                        });

                                    });
                        },
                            function () {
                                //cancel
                            });

                }
            };

            /**
             * 
             * @param {object} evt      domEvent
             * @param {object} model controlDiskHelper.controlDiskModel
             * @returns {void} 
             */
            this.jumpMotherToTargetSystemByMapControl = function (evt, model) {
                var systemData = model._meshServerData;
                var systemName = "";
                if (systemData) systemName = systemData.NativeName;
                else {
                    throw Errors.ClientNotImplementedException({
                        systemData: systemData,
                        msg: "System name not exist",
                        model: _.cloneDeep(model)
                    });
                }

                var targetSystemId = systemData.Id;
                var curMother = EM.EstateData.GetMotherLocation();
                var curMotherSystemId = curMother.SystemId;
                if (curMotherSystemId === targetSystemId) return $mjd.openDialogErrorJupmMotherIsCurrentSystem();

                if (curMother.IsMoving) return $mjd.openDialogErrorJumpMotherInProgress(systemName);

                function error(errorAnswer) {
                    var msg = Errors.GetHubMessage(errorAnswer);
                    $mjd.openDialogErrorJupmMother(msg, systemName);
                    throw Errors.ClientNotImplementedException({
                        msg: msg,
                        errorAnswer: errorAnswer
                    });
                }

                function setDialog(answer) {
                    console.log("setDialog.answer", answer);
                    var convertedDelay = answer.FormatedSeconds;
                    var hub = $self.$hub;
                    var confirm = $mjd.openDialogMotherJumpEnter(systemName, convertedDelay);

                    confirm
                        .then(function () {
                            //ok
                            $self.requestAddTaskMotherJump(answer.Guid,
                                function (errorAnswer) {
                                    hub.journalRemoveGuid(answer.Guid);
                                    error(errorAnswer);
                                });
                        },
                            function () {
                                //cancel
                                hub.journalRemoveGuid(answer.Guid);
                            });
                };

                $self.requestGetMotherJumpTime(setDialog, error, curMother.SystemId, targetSystemId);
                return null;
            };

            //#endregion

            //#region Collections

            function getTabCollection(idx) {
                var d = getBodyByIdx(idx).TemplateData;
                return d.hasOwnProperty("Collection") ? d.Collection : d.Collection = [];
            }

            function addCollectionByIdx(idx, newItems) {
                if (!(newItems instanceof Array)) {
                    newItems = [newItems];
                }

                var sumItems = _.unionBy(getTabCollection(idx), newItems, "Id");
                var j = $self.PlanshetModel;
                var data = j.Bodys[idx].TemplateData;
                if (!data.TotalItems || data.TotalItems < sumItems.length - 1) {
                    data.TotalItems = sumItems.length-1;
                }  
                data.Collection = orderById(sumItems);
            }

            function getReportCollection() {
                return getTabCollection(journalIdx.report);
            }

            function getSpyCollection() {
                return getTabCollection(journalIdx.spy);
            }

            this._deleteItemFromCollectionByIdx = function (idx, id) {
                var col = getTabCollection(idx);
                _.remove(col,
                    function (o) {
                        return o.Id === id;
                    });
                var j = $self.PlanshetModel;
                j.Bodys[idx].TemplateData.Collection = orderById(col);
                j.Bodys[idx].TemplateData.TotalItems--;

            };

            function addSpyCollection(items) {
                addCollectionByIdx(journalIdx.spy, items);
                $self._spyScrollerOptions.updateTotal();

            }

            function addReportCollection(items) {
                addCollectionByIdx(journalIdx.report, items);
                $self._reportScrollerOptions.updateTotal();
            }

            function fixTaskUnitCount(taskItem) {
                var hangar = taskItem.HangarInTask;
                console.log("fixTaskUnitCount", hangar);
                _.forEach(hangar,
                    function (unit, unitKey) {
                        if (unit.Count === 0) {
                            unit.Count = null;
                        }
                    });
                return taskItem;
            }

            function getLastId(idx) {
                var col = getTabCollection(idx);
                if (col) {
                    return _.minBy(col, "Id").Id;
                }
                return 0;


            }

            function getLastReportId() {
                return getLastId(journalIdx.report);
            }

            function getLastSpyId() {
                return getLastId(journalIdx.spy);
            }

            function registerTaskItems() {
                var col = getTabCollection(journalIdx.task);
                if (col && col.length > 0) {
                    for (var i = 0; i < col.length; i++) {
                        fixTaskUnitCount(col[i]);
                    }
                    //console.log("col", col);
                }
            }

            this.getTaskCollection = function () {
                return getTabCollection(journalIdx.task);
            };

            this.getReportCollection = getReportCollection;
            this.addReportCollection = addReportCollection;

            this.getSpyCollection = getSpyCollection;
            this.addSpyCollection = addSpyCollection;

            //#endregion

            //#region Item
            function addSpyItem(item) {
                item.ComplexButtonView.IsNewItem = true;
                addSpyCollection([item]);
            }

            function addReportItem(item) {
                //item.ComplexButtonView.IsNewItem = true;
                addReportCollection([item]);
            }

            this.addToLocalTaskItem = function (taskItem) {

                addCollectionByIdx(journalIdx.task, [fixTaskUnitCount(taskItem)]);
            };

            function deleteTaskItem(taskId) {
                $self._deleteItemFromCollectionByIdx(journalIdx.task, taskId);
            }

            // Проверяет юнитов в задании и назначает обновление в случае окончания таймера
            function updateSimpleTimer(timerScope, taskItemData) {
                var stop = timerHelper.updateStringTimer(timerScope);
                if (stop) {
                    //todo  ничего не делаем. серевер  пошлет нотификацио об окончании задачи
                    return stop;
                }

                return stop;

            }

            this.addSpyItem = addSpyItem;
            this.addReportItem = addReportItem;
            this.updateSimpleTimer = updateSimpleTimer;

            //#endregion

            //#region Buttons
            function getTaskButtons() {
                return getTaskData().Buttons;
            }

            function reportBtnIdConstructor(id, isSpy) {
                var prefix = (isSpy) ? "spy_" : "report_";
                var btnId = prefix + id + "_";
                var type = {
                    mes: btnId + "mes",
                    spy: btnId + "spy",
                    remove: btnId + "delete"
                };
                if (isSpy) {
                    type.attack = btnId + "attack";
                }
                return type;
            }

            function getNewTaskButtons() {
                if (newTaskButtons) {
                    return newTaskButtons;
                }
                else {
                    var b = getTaskButtons();
                    newTaskButtons = [
                        _.find(b,
                            function (o) {
                                return (o.ButtonId === "add-task-attack");
                            }), _.find(b,
                            function (o) {
                                return (o.ButtonId === "add-task-transfer");
                            })
                    ];
                    return newTaskButtons;

                }

            }

            //var t = 0;
            function getReportDeleteBtn(tabCollectionItem) {
                //console.log("getReportDeleteBtn count", t++);
                var btnsIds = reportBtnIdConstructor(tabCollectionItem.Id);
                return _.find(tabCollectionItem.Buttons,
                    function (o) {
                        return (o.ButtonId === btnsIds.remove);
                    });

            }

            function getSpyInfoButtons(tabCollectionItem) {
                var btns = [];
                var tb = tabCollectionItem.Buttons;
                var id = tabCollectionItem.Id;
                var btnsIds = reportBtnIdConstructor(id, true);

                var spy;
                if (tabCollectionItem.TargetUserName === skagryName) {
                    spy = _.find(tb,
                        function (o) {
                            return (o.ButtonId === btnsIds.spy);
                        });
                    if (spy) {
                        btns.push(spy);
                    }

                }
                else {
                    var mes = _.find(tb,
                        function (o) {
                            return (o.ButtonId === btnsIds.mes);
                        });
                    spy = _.find(tb,
                        function (o) {
                            return (o.ButtonId === btnsIds.spy);
                        });
                    if (mes) {
                        btns.push(mes);
                    }
                    if (spy) {
                        btns.push(spy);
                    }

                }
                //console.log("getSpyInfoButtons", btns);
                return btns;
            }

            function getSpyButtonFromSerch() {
                var c = getSpyData().Buttons;
                var b = _.find(c,
                    function (o) {
                        return o.ButtonId === spyBtnsIds[0];
                    });
                return b;
            }

            function getSpyAtkBtn(tabCollectionItem) {
                var btnsIds = reportBtnIdConstructor(tabCollectionItem.Id, true);
                return _.find(tabCollectionItem.Buttons,
                    function (o) {
                        return (o.ButtonId === btnsIds.attack);
                    });
            }

            function getSpyDeleteBtn(tabCollectionItem) {
                var btnsIds = reportBtnIdConstructor(tabCollectionItem.Id, true);
                return _.find(tabCollectionItem.Buttons,
                    function (o) {
                        return (o.ButtonId === btnsIds.remove);
                    });

            }

            this.getNewTaskButtons = getNewTaskButtons;
            this.getNewAttackBtn = function getNewAttackBtn() {
                return getNewTaskButtons()[0];

            }
            this.getTaskActionButtons = function () {
                if (_taskActionButtons) {
                    return _taskActionButtons;
                }
                else {
                    var b = getTaskButtons();
                    _taskActionButtons = [b[2], b[3], b[4]];
                    return _taskActionButtons;

                }
            };
            this.getReportInfoButtons = function (tabCollectionItem) {
                var btns = [];
                var id = tabCollectionItem.Id;
                var btnsIds = reportBtnIdConstructor(id);
                var tb = tabCollectionItem.Buttons;

                if (tabCollectionItem.IsLose) {
                    //tabCollectionItem.AtackerIsSkagry
                    var spy = _.find(tb,
                        function (o) {
                            return (o.ButtonId === btnsIds.spy);
                        });
                    if (tabCollectionItem.TargetUserName === skagryName) {
                        if (spy) {
                            btns.push(spy);
                        }

                    }
                    else {
                        var mes = _.find(tb,
                            function (o) {
                                return (o.ButtonId === btnsIds.mes);
                            });
                        if (mes) {
                            btns.push(mes);
                        }
                        if (spy) {
                            btns.push(spy);
                        }
                    }

                }
                return btns;

            };
            this.getReportDeleteBtn = getReportDeleteBtn;

            this.getSpyInfoButtons = getSpyInfoButtons;
            this.getSpyButtonFromSerch = getSpyButtonFromSerch;
            this.getSpyAtkBtn = getSpyAtkBtn;
            this.getSpyDeleteBtn = getSpyDeleteBtn;
            this.getSourceHangarInTask = hangarService.getHangarData;
            this.getTaskTargetUnits = function () {
                return _.cloneDeep(getTaskData().HangarInTask);
            }; //#endregion

            //#region Check and Cache

            function isActiveModel() {
                return planshetService.isCurrentModel($self.UniqueId);
            }

            function needUpdateCache() {
                return planshetService.needUpdateCache($self.UniqueId);
            }

            this.hasJournalInPlanshet = function () {
                if (!$self.$planshetIndex) {
                    return false;
                }
                else {
                    return true;
                }
            };
            this.isActiveModel = isActiveModel;
            this.statuses = statuses;
            this.journalStatus = function () {
                return $self.hasJournalInPlanshet() ? isActiveModel() ? statuses.isActive : needUpdateCache() ? statuses.noJournal : statuses.inCache : statuses.noJournal;
            };
            this.journalIdx = journalIdx;

            //#endregion

            //#region Request 

            this._checkTaskTimeIsOver = function (taskId, calback) {
                $self.$hub.journalTaskTimeIsOver(taskId).then(function (answer) {
                    if (calback instanceof Function) calback(answer);
                },
                    function (errorAnswer) {
                        var msg = Errors.GetHubMessage(errorAnswer);
                        throw Errors.ClientNotImplementedException({
                            msg: msg,
                            errorAnswer: errorAnswer
                        });
                    });
            };
            this._getReportItemByTaskId = function (taskId, calback) {
                var deferred = mainHelper.$q.defer();
                deferred.promise
                    .then(function (answer) {
                        console.log("_getReportItemByTaskId",
                            {
                                answer: answer
                            });
                        if (calback instanceof Function) {
                            calback(answer);
                        }
                    },
                        function (errorAnswer) {
                            var msg = Errors.GetHubMessage(errorAnswer);
                            throw Errors.ClientNotImplementedException({
                                msg: msg,
                                errorAnswer: errorAnswer
                            });
                        });
                $self.$hub.journalGetReportItemByTaskId(taskId).then(deferred.resolve, deferred.reject);
                return deferred.promise;  
            };

            // callbacks
            function saveReportCollection(answer) {
                console.log("saveReportCollection",
                    {
                        answer: _.cloneDeep(answer)
                    });
                if (answer && answer.length > 0) {
                    mainHelper.applyTimeout(function () {
                        addReportCollection(answer);
                    });
                }
            }

            function saveSpyCollection(answer) {
                if (answer && answer.length > 0) {
                    mainHelper.applyTimeout(function () {
                        addSpyCollection(answer);
                    });
                }
            }

            function getServerReportItems(minPosition, collectionCount, callback) {
                // #region Deprecated
                //  var total = $self.getReportTotalItems(true);
                //var max = $self.getReportMaxItems();
                //if (total >= max) {
                //    Utils.Console.Warn("Превышен лимит хранимых эллементов сделать обработчик");
                //    return;
                //}    
                // #endregion

                $self.$hub.journalGetReportItems(minPosition).then(function (answer) {
                    if (callback instanceof Function) callback(answer);

                },
                    function (errorAnswer) {
                        var msg = Errors.GetHubMessage(errorAnswer);
                        throw Errors.ClientNotImplementedException({
                            msg: msg,
                            errorAnswer: errorAnswer
                        });
                    });

            }

            function getServerSpyItems(minPosition, collectionCount, callback) {   
                // #region Deprecated
                //var max = $self.getSpyMaxItems();
                //var total = collectionCount || $self.getSpyTotalItems(true);
                //if (total >= max) {
                //    return;
                //}
                // #endregion
                $self.$hub.journalGetSpyItems(minPosition)
                    .then(function (answer) {
                        if (callback instanceof Function) callback(answer);
                    },
                        function (errorAnswer) {
                            var msg = Errors.GetHubMessage(errorAnswer);
                            throw Errors.ClientNotImplementedException({
                                minPosition: minPosition,
                                collectionCount: collectionCount, 
                                errorAnswer: errorAnswer,
                                msg: msg
                            },
                                "journalService.getServeSpyItems");
                        });

            }

            function deleteReportOrSpyItem(params, name) {
                var hubDelegate;
                var isSpy = false;
                if (name === "deleteSpyItem") {
                    isSpy = true;
                    hubDelegate = function () {
                        return $self.$hub.journalDeleteSpyItem(params.Id);
                    };
                }
                else if (name === "deleteReportItem") {
                    hubDelegate = function () {
                        return $self.$hub.journalDeleteReportItem(params.Id);
                    };
                }
                else {
                    throw Errors.ClientNotImplementedException({
                        params: params,
                        name: name,
                        exMessage: "method not exist"

                    },
                        "journalService.deleteReportOrSpyItem");
                }

                function onError(errorAnswer) {
                    var msg = Errors.GetHubMessage(errorAnswer);
                    throw Errors.ClientNotImplementedException({
                        msg: msg,
                        errorAnswer: errorAnswer
                    });
                }

                hubDelegate().then(function (answer) {
                    if (answer) {
                        if (isSpy) $self._spyScrollerOptions.updateTotal();
                        else $self._reportScrollerOptions.updateTotal();
                        mainHelper.applyTimeout(function () {
                            $self._deleteItemFromCollectionByIdx(params.TabIdx, params.Id);
                        });
                    }
                    else throw onError("Journal item not deleted");
                },
                    onError);
            }

            this.leftNavGetJournal = function (params, element, attrs, $scope, $event) {
                this.getJournalPlanshet();
            };

            this.getJournalPlanshet = function (params, update, targetTabIdx, advancedAction) {
                var $update = getUpdateStatus(update);
                if (!$update && planshetService.isCurrentModel($self.UniqueId)) {
                    if (_.isInteger(targetTabIdx)) {
                        planshetService.open();
                        if (!(tabService.isActiveTab(targetTabIdx))) {
                            tabService.setTabIdx(targetTabIdx);
                            //tabService.initializeTabs(journal, targetTabIdx);
                        }
                        if (advancedAction instanceof Function) advancedAction();
                    }
                    else planshetService.toggle($self.UniqueId);
                    return;
                }
                if (!$update) {
                    $self.updatePlanshetView(advancedAction);
                    planshetService.toggle($self.UniqueId);
                    return;
                }

                var opts = planshetService.IHubRequestOptions(function () {
                    return $self.$hub.journalInitialPlanshet();
                },
                    $self.UniqueId);

                opts.OnSuccsess = function (answer) {
                    $self.PlanshetModel = answer;
                    registerTaskItems();
                    $self.updatePlanshetView(advancedAction);
                    planshetService.toggle($self.UniqueId);
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
                opts.CacheTime = Utils.Time.TIME_CACHE_JOURNAL;
                planshetService.planshetHubRequest(opts);

            };

            this.deleteReportOrSpyItem = deleteReportOrSpyItem;
            //#endregion

            //#region  Hub Event
            this.onTaskCreated = function (newTaskItem, $maxCount) {
                console.log(" onTaskCreated",
                    {
                        newTaskItem: newTaskItem,
                        maxCount: $maxCount
                    });
                if (getTaskData()) {

                }
                if (!newTaskItem || !newTaskItem.Id) return;
                if ($self.$taskCreateDelayedActions[newTaskItem.Id]) {
                    $self.$taskCreateDelayedActions[newTaskItem.Id](newTaskItem);
                    return;
                }
                else {
                    $self.addToLocalTaskItem(newTaskItem);     
                    return;

                    if ($maxCount === undefined) {
                        $maxCount = 10;
                    }
                    $maxCount--;
                    if ($maxCount < 1) {
                        $self.addToLocalTaskItem(newTaskItem);
                    }
                    else {
                        mainHelper.$timeout(function () {
                            $self.onTaskCreated(newTaskItem, $maxCount);
                        },
                            100);
                    }

                }   

            };

            this.onTaskFinished = function (notyfyData) { 
                console.log("onTaskFinished", {
                    notyfyData: notyfyData

                });
                if (!notyfyData || !notyfyData.Task) {
                    console.log("onTaskFinished:error", {
                        notyfyData: notyfyData
                    });
                    return;
                }
                var taskItem = notyfyData.Task;
                if (taskItem.TaskEnd) {
                    if (taskItem.IsTransfer) {
                        journalDialogHelper.openDialogTransferComplete(taskItem.TargetPlanetName);
                        deleteTaskItem(taskItem.Id);
                    }
                    else {
                        var reportAnswer = notyfyData.TabReportOut;
                        mainHelper.applyTimeout(function () {
                            if (reportAnswer.IsLose) {
                                if ($self.$currentUserInfo.userName === reportAnswer.TargetUserName) {
                                    GameServices.estateService.updateServerEstateList(true);
                                }
                            }
                            deleteTaskItem(taskItem.Id);
                            addReportItem(reportAnswer);
                            if (planshetService.isCurrentModel($self.UniqueId)) {
                                if (!tabService.isActiveTabByIdx(journalIdx.report)) {
                                    tabService.addNewDataInTabEvent(journalIdx.report);
                                }
                            }
                           
               

                            if (notyfyData.NewTotalWinnerUserCc) {
                                 GameServices.resourceService.setCc(notyfyData.NewTotalWinnerUserCc);
                            }


                        });

                    }

                }
                else {
                    console.log("onTaskFinished:error task not finished");
                }

            };
            //#endregion

            //#region  Scroller 
            this._reportScrollerOptions = scrollerHelper.IScrollerOptions();
            this._spyScrollerOptions = scrollerHelper.IScrollerOptions();
            this.initializeReportScroll = function (bodyElement) {
                var opts = $self._reportScrollerOptions;
                opts.HtmlElementToBind = bodyElement;
                opts.GetTotalServerCountPromise = $self.getReportTotalItems;
                opts.GetItemsCollection = getReportCollection;
                opts.GetMinIdOrCondition = getLastReportId;
                opts.GetPage = getServerReportItems;
                opts.SaveAndSetItem = saveReportCollection;
                scrollerHelper.initializeScroll($self._reportScrollerOptions);

            };
            this.initializeSpyScroll = function (bodyElement) {
                var opts = $self._spyScrollerOptions;
                opts.HtmlElementToBind = bodyElement;
                opts.GetTotalServerCountPromise = $self.getSpyTotalItems;
                opts.GetItemsCollection = getSpyCollection;
                opts.GetMinIdOrCondition = getLastSpyId;
                opts.GetPage = getServerSpyItems;
                opts.SaveAndSetItem = saveSpyCollection;
                scrollerHelper.initializeScroll($self._spyScrollerOptions);

            };
            this.setInitializeJournal = function (initData) {
                $self.PlanshetModel = _.cloneDeep(initData[$self.UniqueId]);
            };
            //#endregion

        }
    ]);
