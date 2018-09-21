Utils.CoreApp.gameApp.service("journalHelper",
    [
        "planshetService",
        "journalService",
        "tabService",
        "mapInfoService",
        "hangarService",
        "journalDialogHelper",
        "$timeout",
        function (planshetService,
                 journalService,
                 tabService,
                 mapInfoService,
                 hangarService,
                 journalDialogHelper,
                 $timeout) {
            var $self = this;
            //#region Declare
            var transferHangarModel = function () {
                return Utils.ModelFactory.UnitList(null, true);
            }; //not for using
            var btnParamModelExample = {
                Id: 0,
                TabIdx: 0,
                SourceIsTab: false,
                TargetName: "name",

                Method: "POST",
                Url: "api/ctrl/method",
                Data: {}
            }; // helpVars
            var targetPlanetName;
            var statuses = journalService.statuses;

            var serchPlanetType = mapInfoService.serchPlanetType;
            var serchType;

            //#endregion

            //#region Help

            //$self.$hub
            Object.defineProperty($self,
                "$hub",
                {
                    get: function () {
                        return GameServices.mainGameHubService;
                    }

                });

            function setSerchType(state) {
                serchType = state;
            }

            function getSerchType() {
                return serchType;
            }

            function getJournal(tabIdx, callbackAction, update) {
                journalService.getJournalPlanshet(null, update, tabIdx, callbackAction);
            }

            function setAction(sourceIsJournal, callbackAction, tabIdx) {
                function tab() {
                    tabService.isActiveTabByIdx(tabIdx) ? callbackAction() : tabService.activateTabByIdx(tabIdx, callbackAction);
                }

                if (sourceIsJournal) {
                    tab();
                    return;
                }
                else {
                    var status = journalService.journalStatus();
                    tabService.setIdxOnCompile(tabIdx);
                    if (status === statuses.noJournal) getJournal(tabIdx, callbackAction, true);
                    else if (status === statuses.inCache) {
                        journalService.updatePlanshetView(callbackAction);

                    }
                }

            }

            //#endregion

            //#region TaskTransferTranslate
            var transferTranslate = {};
            transferTranslate.atack = Utils.CreateLangSimple("Attack the planet :", "Ataque al planeta :", "Атаковать планету :");
            transferTranslate.transfer = Utils.CreateLangSimple("en transfer to planet :", "es transfer to planet :", "ru transfer to planet :");
            transferTranslate.time = Utils.CreateLangSimple("en TaskTime :", "es TaskTime :", "ru TaskTime :");

            function getTransferTypeName(transferType) {
                if (transferType) return transferTranslate.transfer.getCurrent();
                else return transferTranslate.atack.getCurrent();
            }

            function getTransferTimeName() {
                return transferTranslate.time.getCurrent();
            }

            this.getTransferTypeName = getTransferTypeName;
            this.getTransferTimeName = getTransferTimeName;
            this.transferTranslate = transferTranslate;
            //#endregion

            //#region TaskTransferError

            this.taskErrors = (function () {
                function createErrorModel(en, es, ru) {
                    var langModel = Utils.CreateLangSimple(en, es, ru);

                    return {
                        showError: false,
                        translatedError: "",
                        getTranslateError: function () {
                            return langModel.getCurrent();
                        }
                    };
                }

                var taskErrors = {
                    planetNotExist: createErrorModel("en planetNotExist", "es planetNotExist", "ru planetNotExist"),
                    unitsIsEmpty: createErrorModel("en UnitsIsEmpty", "es UnitsIsEmpty", "ru  UnitsIsEmpty"),
                    resetErrors: null
                };
                taskErrors.resetErrors = function () {
                    taskErrors.planetNotExist.showError = false;
                    taskErrors.unitsIsEmpty.showError = false;
                };
                return taskErrors;
            })();

            //#endregion  

            //#region Task
            function tfi() {
                return {
                    before: transferHangarModel(),
                    source: transferHangarModel(),
                    target: transferHangarModel()
                };
            }

            var transferInst;
            var transferParams;

            function changeTaskForm(show, planetName, scope, action) {
                scope.$emit("taskPlanetSerch:showTaskForm", show, planetName, action);
            }

            function updateTaskHangar(event, unitName) {
                var tScopeUnit = event.targetScope.unit;
                var bef = transferInst.before[unitName].count;
                var src = tScopeUnit.sourceUnit;
                if (bef <= tScopeUnit.Count) {
                    tScopeUnit.Count = bef;
                }
                src.Count = bef - tScopeUnit.Count;
                transferInst.target[unitName].count = tScopeUnit.Count;
            }

            function rgisterTaskUnit(scope, target) {
                if (!transferInst) transferInst = tfi();

                var scopeUnit = scope.unit;
                var unitNativeName = scopeUnit.NativeName;

                if (target === "source") {
                    transferInst.before[unitNativeName].count = scopeUnit.Count;
                    transferInst.source[unitNativeName].count = scopeUnit.Count;
                    transferInst.source[unitNativeName].scope = scope;
                    return;
                }

                if (target === "target") {
                    var srcUnit = transferInst.source[unitNativeName].scope.unit;
                    scope.unit.sourceUnit = srcUnit;
                    transferInst.target[unitNativeName].scope = scope;

                    if (!srcUnit.Count) {
                        scope.unit.Count = null;
                        scope.target = false;
                    }
                    scope.unitChange = function () {
                        scope.$emit("taskPlanetSerch:changeTransferUnit", updateTaskHangar, unitNativeName);
                        return;
                    };
                    //console.log("transferInst", scope, transferInst);
                }
            }

            function resetTaskForm(taskPlanetScope) {
                if (!transferInst) return;
                var repoUnits = hangarService.getCloneObjectHangarData();
                var sourceUnits = taskPlanetScope.ctrl.taskSourceUnits;
                var targetUnits = taskPlanetScope.ctrl.taskTargetUnits;
                _.forEach(repoUnits,
                    function (value, key) {
                        if (sourceUnits.hasOwnProperty(key)
                            && targetUnits.hasOwnProperty(key)
                            && transferInst.before
                            && transferInst.before.hasOwnProperty(key)) {

                            var repoUnitCount = repoUnits[key].Count;
                            sourceUnits[key].Count = repoUnitCount;
                            transferInst.before[key].count = repoUnitCount;

                            targetUnits[key].Count = repoUnitCount === 0 || repoUnitCount === null ? null : 0;

                        }

                    });
            }

            //#endregion

            //#region CalculateTime

            this.calculateFleetTime = function (deferred, targetPName) {

                var ce = EM.EstateData.GetCurrentEstate();
                var estateId = ce.EstateId;
                var startSystemId = 0;
                var isMother = ce.EstateType === EM.EstateData.MotherEstateType;
                var msgs = {
                    startSystem: "mother start system is not exist",
                    notEstate: "estateId  not exist"
                };

                if (isMother) {
                    startSystemId = ce.SystemId;
                    if (typeof startSystemId !== "number" || startSystemId === 0 || estateId) {
                        console.log(msgs.startSystem);
                        deferred.reject(msgs.startSystem);
                        return;
                    }
                }
                else if (!estateId) {
                    console.log(msgs.notEstate);
                    deferred.reject(msgs.notEstate);
                    return;
                }

                var hubDeferred = $self.$hub.journalGetTaskTime(estateId, targetPName, startSystemId);
                hubDeferred.then(function (answer) {
                    var curEstateId = EM.EstateData.GetCurrentEstate().EstateId;
                    console.log("calculateFleetTime",
                        {
                            answer: answer,
                            curEstateId: curEstateId
                        });
                    if (estateId !== curEstateId) deferred.reject("sourceEstateIsWrong");
                    else deferred.resolve(answer.FormatedSeconds);
                },
                    function (erorAnswer) {
                        var msg = Errors.GetHubMessage(erorAnswer);
                        if (msg === ErrorMsg.SystemIdNotSet) {
                            //todo  что то там сделать
                            console.log("timer fleet error : ", msg);
                        }
                        deferred.reject(erorAnswer);
                    });

            }

            //#endregion 

            //#region Spy
            function getSpyPlanetName(scope) {
                return scope.$parent.getSpyTargetPlanetName();
            }

            function chekSpyPlanetName(scope) {
                var name = getSpyPlanetName(scope);
                if (name && name.length < 5) {
                    Utils.Console.Warn("Planet name is not unic", name);
                    return false;
                }
                return mapInfoService.containPlanetName(mapInfoService.serchPlanetType.OtherUsers, name);
            }

            function resetSpySerchForm(scope) {
                scope.$parent.clear();
            }

            //#endregion

            //#region open Buttons Action
            function attack(params) {
                targetPlanetName = params.TargetName;
                setSerchType(serchPlanetType.OtherUsers);
                mapInfoService.addPlanetNames([targetPlanetName], serchType);
                setAction(params.SourceIsTab,
                    function () {
                        var b = journalService.getNewAttackBtn();
                        var btnId = "#" + b.ButtonId;
                        var dom;
                        planshetService.conditionAwaiter(function () {
                            dom = $(btnId);
                            return dom.length === 1;
                        },
                            function () {
                                $timeout(function () {
                                    dom.click();
                                },
                                    40);

                            });
                    },
                    params.TabIdx);
                return;
            }

            function newAttack(params, element, attrs, scope) {
                transferParams = null;
                setSerchType(serchPlanetType.OtherUsers);
                params.Data.TargetName = null;
                if (targetPlanetName) {
                    params.Data.TargetName = targetPlanetName;
                    targetPlanetName = null;
                }
                params.Data.IsTransfer = false;
                changeTaskForm(true,
                    params.Data.TargetName,
                    scope,
                    function (taskPlanetScope) {
                        resetTaskForm(taskPlanetScope);
                        taskPlanetScope.ctrl.setTransferType(params.Data.IsTransfer);
                    });
                transferParams = params;
            }

            function newTransfer(params, element, attrs, scope) {
                setSerchType(serchPlanetType.OnlyUserPlanet);
                params.Data.TargetName = null;
                params.Data.IsTransfer = true;
                changeTaskForm(true,
                    params.Data.TargetName,
                    scope,
                    function (taskPlanetScope) {
                        resetTaskForm(taskPlanetScope);
                        taskPlanetScope.ctrl.setTransferType(params.Data.IsTransfer);

                    });

                transferParams = params;
            }

            var _spyInProgress = false;

            function spy(params, element, attrs, scope, $event) {
                if (_spyInProgress) return;
                //params.Data.planetId = params.Id; 

                // #region Deprecated

                //var max = journalService.getSpyMaxItems();
                //var total = journalService.getSpyTotalItems(true);
                //if (total >= max) {
                //    journalDialogHelper.openDialogMaxLimitSpyItems(max, $event);
                //    return;
                //}

                // #endregion


                _spyInProgress = true;
                setAction(params.SourceIsTab,
                    function () {
                        $self.$hub.journalCreateSpyItemByPlanetId(params.Data.planetId)
                            .finally(function () {
                                setTimeout(function () {
                                    _spyInProgress = false;
                                },
                                    1000);
                            }).then(function (answer) {
                                console.log("spy item", answer);
                                journalService.addSpyItem(answer);
                            },
                                function (errorAnswer) {
                                    var msg = Errors.GetHubMessage(errorAnswer);
                                    throw Errors.ClientNotImplementedException({
                                        params: params,
                                        scope: scope,
                                        errorAnswer: errorAnswer,
                                        msg: msg
                                    },
                                        "journalHelper.spy");
                                });
                    },
                    params.TabIdx);
                return;
            }

            function newSpy(params, element, attrs, scope, $event) {
                if (_spyInProgress) return;
                if (!chekSpyPlanetName(scope)) return;

                // #region Deprecated

                //var max = journalService.getSpyMaxItems();
                //var total = journalService.getSpyTotalItems(true);
                //if (total >= max) {
                //    journalDialogHelper.openDialogMaxLimitSpyItems(max, $event);
                //    return;
                //}   
                // #endregion

                _spyInProgress = true;
                var planetName = getSpyPlanetName(scope).toUpperCase();
                $self.$hub.journalCreateSpyItemByPlanetName(planetName)
                    .finally(function () {
                        setTimeout(function () {
                            _spyInProgress = false;
                        },
                            1000);
                    }).then(function (answer) {
                        journalService.addSpyItem(answer);
                        params.Data.planetName = null;
                        resetSpySerchForm(scope);
                    },
                        function (errorAnswer) {
                            var msg = Errors.GetHubMessage(errorAnswer);
                            throw Errors.ClientNotImplementedException({
                                params: params,
                                scope: params,
                                errorAnswer: errorAnswer,
                                msg: msg
                            },
                                "journalHelper.newSpy");
                        });

            }

            function deleteSpyItem(params, element, attrs, scope) {
                journalService.deleteReportOrSpyItem(params, "deleteSpyItem");
            }

            function deleteReportItem(params, element, attrs, scope) {
                journalService.deleteReportOrSpyItem(params, "deleteReportItem");
            }

            function updateShowTaskError(taskPlanetCtrl, errorName, show) {
                console.log("updateShowTaskError", taskPlanetCtrl);
                if (!taskPlanetCtrl || !errorName) return;
                if (taskPlanetCtrl.taskErrors.hasOwnProperty(errorName) && taskPlanetCtrl.taskErrors[errorName].showError !== show) {
                    taskPlanetCtrl.taskErrors[errorName].showError = show;
                }
            }

            var _submitTaskFormInProgress = false;

            function submitTaskForm(params, element, attrs, scope) {
                if (!scope) return;
                if (_submitTaskFormInProgress) return;
                _submitTaskFormInProgress = true;

                function onComplete(now) {
                    $timeout(function () {
                        _submitTaskFormInProgress = false;
                    },
                        now ? 0 : 1000);
                }

                var targetUnits = transferInst.target;
                var taskPlanetScope = scope.$parent.$parent.$parent;
                console.log("taskPlanetScope",
                    {
                        taskPlanetScope: taskPlanetScope,
                        scope: scope
                    });
                var tpCtrl = taskPlanetScope.ctrl;
                var planetValidate = tpCtrl.isValide;
                var unitsExist = false;

                function checkTargetUnits() {
                    _.forEach(targetUnits,
                        function (unit, unitKey) {
                            if (targetUnits.hasOwnProperty(unitKey) && unit.hasOwnProperty("count") && unit.count > 0) {
                                unitsExist = true;
                                return;
                            }
                        });
                }

                function send() {
                    updateShowTaskError(tpCtrl, "planetNotExist", false);
                    updateShowTaskError(tpCtrl, "unitsIsEmpty", false);
                    var names = Utils.ModelFactory.UnitList();
                    var unitCounts = {};
                    _.forEach(names,
                        function (value, key) {
                            if (names.hasOwnProperty(key)) {
                                var count = typeof targetUnits[key].count === "number" ? targetUnits[key].count : 0;
                                unitCounts[key] = count;
                            }
                        });
                    transferParams.Data.SourceId = EM.EstateData.GetCurrentEstate().EstateId;
                    transferParams.Data.Units = unitCounts;
                    transferParams.Data.TargetName = tpCtrl.taskTargetPlanetName;
                    console.log("submitTaskForm",
                        {
                            transferParams: transferParams,
                            tpCtrl: tpCtrl,
                            unitCounts: unitCounts,
                            "ournalService.$taskCreateDelayedActions": journalService.$taskCreateDelayedActions
                        });
                    $self.$hub.journalCreateTaskItem(transferParams.Data)
                        .then(function (newTaskId) {
                            console.log("$self.$hub.journalCreateTaskItem(transferParams.Data)", {
                                newTaskId: newTaskId
                            });
                            journalService.$taskCreateDelayedActions[newTaskId] = function (newTaskItem) {
                                journalService.addToLocalTaskItem(newTaskItem);
                                var serverUnitsInTask = newTaskItem.HangarInTask;
                                var beforeUnits = transferInst.before;

                                function calc(from, what) {
                                    from = from ? from : 0;
                                    what = what ? what : 0;
                                    var delta = from - what;
                                    return delta ? delta : null;
                                }

                                _.forEach(beforeUnits,
                                    function (value, unitNativeName) {
                                        if (beforeUnits.hasOwnProperty(unitNativeName)) {
                                            var serverUnitCountInTask = serverUnitsInTask[unitNativeName];
                                            var beforeUnit = beforeUnits[unitNativeName];

                                            beforeUnit.count = calc(beforeUnit.count, serverUnitCountInTask.Count);
                                            var repoUnit = hangarService.getPanelUnitData(unitNativeName);
                                            if (!repoUnit.Progress) repoUnit.Progress = {};
                                            repoUnit.Progress.Level = calc(repoUnit.Count, serverUnitCountInTask.Count);
                                            repoUnit.Count = repoUnit.Progress.Level;

                                            if (repoUnit.Count < 0) {
                                                repoUnit.Count = 0;
                                                console.log("repoUnit.Count < 0", repoUnit);
                                            }
                                        }
                                    });
                                changeTaskForm(false, null, scope, resetTaskForm);
                                hangarService.updateHangarView();
                                onComplete();
                                delete journalService.$taskCreateDelayedActions[newTaskItem.Id];
                            }
                            console.log("newTaskId", newTaskId);


                        },
                            function (errorAnswer) {
                                onComplete();
                                var msg = Errors.GetHubMessage(errorAnswer);
                                throw Errors.ClientNotImplementedException({
                                    params: params,
                                    scope: scope,
                                    errorAnswer: errorAnswer,
                                    msg: msg
                                },
                                    "journalHelper.submitTaskForm.send.onError");
                            });

                }

                checkTargetUnits();
                tpCtrl.setResultIsValid(unitsExist);
                if (tpCtrl.resultIsValid) send();
                else {
                    updateShowTaskError(tpCtrl, "planetNotExist", !planetValidate);
                    updateShowTaskError(tpCtrl, "unitsIsEmpty", !tpCtrl.unitsIsValid);
                    onComplete(true);
                }

            }

            function setAllUnits(params, element, attrs, scope) {
                var taskPlanetCtrlScope = scope.$parent.$parent.$parent;
                var repoUnits = hangarService.getCloneObjectHangarData();
                var srcUnits = taskPlanetCtrlScope.ctrl.taskSourceUnits;
                var targetUnits = taskPlanetCtrlScope.ctrl.taskTargetUnits;

                function nolCheck(count, setCount) {
                    return count === 0 || count === null ? null : setCount ? count : 0;
                }

                function setUnit(unitNativeName, instGroup, scopeGroup, fromCount, setCount, isTarget) {
                    var newCount = nolCheck(fromCount, setCount);
                    instGroup[unitNativeName].count = newCount;
                    scopeGroup[unitNativeName].Count = newCount;
                }

                taskPlanetCtrlScope.$apply(function () {
                    _.forEach(repoUnits,
                        function (value, unitKey) {
                            if (repoUnits.hasOwnProperty(unitKey) && srcUnits.hasOwnProperty(unitKey)) {
                                var repoUnit = repoUnits[unitKey];
                                setUnit(unitKey, transferInst.source, srcUnits, repoUnit.Count, false);
                                setUnit(unitKey, transferInst.target, targetUnits, repoUnit.Count, true, true);
                            }
                        });
                });
                return;
            }

            function resetTaskUnits(params, element, attrs, scope) {
                var taskPlanetScope = scope.$parent.$parent;
                resetTaskForm(taskPlanetScope);
            }

            function cancelMotherJump(params, element, attrs, scope) {
                journalService.requestCancelMotherJump();
            }

            function instMotherJump(params, element, attrs, scope, $event) {
                console.log("instMotherJump params",
                    {
                        params: params,
                        PriceCc: params.PriceCc,
                        type: typeof params.PriceCc,
                        isEnoughCc: GameServices.resourceService.isEnoughCc(params.PriceCc)
                    });
                if (typeof params.PriceCc === "number" && GameServices.resourceService.isEnoughCc(params.PriceCc)) {
                    journalService.requestInstMotherJump(params.PriceCc, $event);
                }

            }

            this.cancelMotherJump = cancelMotherJump;
            this.instMotherJump = instMotherJump;
            //#endregion

            //#region Public
            this.resetTaskForm = resetTaskForm;
            this.rgisterTaskUnit = rgisterTaskUnit;
            this.resetTaskUnits = resetTaskUnits;
            this.updateTaskHangar = updateTaskHangar;

            this.attack = attack;
            this.newAttack = newAttack;
            this.newTransfer = newTransfer;

            this.setAllUnits = setAllUnits;
            this.submitTaskForm = submitTaskForm;

            this.deleteReportItem = deleteReportItem;

            this.spy = spy;
            this.newSpy = newSpy;
            this.deleteSpyItem = deleteSpyItem;

            this.getSerchType = getSerchType;
            //#endregion
        }
    ]);
