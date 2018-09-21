Utils.CoreApp.gameApp.service("timerHelper", [
    "$interval", "buildService",
    function ($interval, buildService) {
        var $self = this;

        function TimerTypes() {
            this.simpleTimer = "simpleTimer";
            this.buildTimer = "buildTimer";
            this.noTimerRight = "noTimerRight";
            this.hangarUnitTimer = "hangarUnitTimer";
        }

        TimerTypes.prototype.getKeys = function () {
            return Object.keys(this);
        };

        var refTimerTypes = new TimerTypes();
        Object.freeze(refTimerTypes);

        var timeDelay = {};
        timeDelay.BaseDelay = 2000;
        timeDelay.Objects = {};

        var vertical = "vertical";
        var horizontal = "horizontal";




        /**
         * 
         * @param {string} timerKey 
         * @param {int} delay milisecond
         * @returns {} 
         */
        timeDelay.Start = function (timerKey, delay) {
            if (timeDelay.Objects[timerKey]) return;

            timeDelay.Objects[timerKey] = {
                StartTime: Date.now(),
                Delay: delay || timeDelay.BaseDelay
            };
        };
        /**
         * 
         * @param {string} timerKey 
         * @returns {void} 
         */
        timeDelay.IsTimeOver = function (timerKey) {
            if (!timeDelay.Objects[timerKey]) {
                return true;
            }

            var timer = timeDelay.Objects[timerKey];


            if ((timer.StartTime + timer.Delay) < Date.now()) {
                delete timeDelay.Objects[timerKey];
                return true;
            }

            return false;
        };
        /**
         * 
         * @param {string} timerKey 
         * @returns {void} 
         */
        timeDelay.HasTimeDelay = function (timerKey) {
            return !!timeDelay.Objects[timerKey];
        }; /**
         * 
         * @param {string} timerKey 
         * @param {int} delay milisecond
         * @returns {void} 
         */
        timeDelay.UpdateTimer = function (timerKey, delay) {
            if (!timeDelay.IsTimeOver(timerKey)) {
                delete timeDelay.Objects[timerKey];
                timeDelay.Start(timerKey, delay);
            } else {
                timeDelay.Start(timerKey, delay);
            }
        };


        function ITimerDictionary() {

        }
        ITimerDictionary.prototype.names = [];
        ITimerDictionary.prototype.updateTimer = function (timerName) {
            var timer = this[timerName];
            var stop = timer.activateUpdateTimer();
            if (stop) {
                timer.scope.timerData.$hasTimer = false;
                this.deleteTimer(timerName);
            }

        };
        ITimerDictionary.prototype.addTimer = function (timerName, activateUpdateTimer, scope, setFirstStep) {
            this.names = _.union(this.names, [timerName]);
            this[timerName] = {};
            this[timerName].activateUpdateTimer = activateUpdateTimer;
            this[timerName].scope = scope;
            if (setFirstStep && this[timerName].scope) {
                $self.updateStringTimer(this[timerName].scope);
            }
        };
        ITimerDictionary.prototype.deleteTimer = function (timerName) {
            _.remove(this.names, function (o) {
                return o === timerName;
            });
            delete this[timerName];
        };
        ITimerDictionary.prototype.getTimer = function (timerName) {
            return this[timerName];
        };
        ITimerDictionary.prototype.timerNameConstuctior = function (typerTypePropertyName, uniqueId, itemId) {
            return refTimerTypes[typerTypePropertyName] + "_" + uniqueId + "_" + itemId;
        };
        ITimerDictionary.prototype.addSinchronizer = function (timerName, upgrade) {
            function activateUpdateTimer() {
                upgrade();
                return false;
            }

            this.addTimer(timerName, activateUpdateTimer, {});
        }; //#region Type Timers actions

        var timerDictionary = new ITimerDictionary();

        //#endregion


        //#region ScopeHelper  
        function getComplexBtnScope($scope) {
            return Utils.A.getParentScopeWithProp($scope, "dropElement");   
        }

        //#endregion;

        //#region Start Update Register  




        function registerSimpleTimer(timerScope, newTimerData) {
            //todo  переделать   
            if (!timerScope.timerData) {
                throw new Error("registerSimpleTimer:!timerScope.timerData");
            }
            if (newTimerData) {
                Utils.UpdateObjFromOther(timerScope.timerData, newTimerData);
            }   
            var cbScope;
            var cbItemData;
            var activateUpdateTimer;
            var timerName;
            if (timerScope.hasOwnProperty("timerAdvancedParam") && timerScope.timerAdvancedParam) {
                // ReSharper disable once PossiblyUnassignedProperty
                cbItemData = timerScope.timerAdvancedParam.cbItemData;
                activateUpdateTimer = function () {
                    timerScope.timerAdvancedParam.activateUpdate(timerScope, cbItemData);
                };
                timerName = timerScope.timerAdvancedParam.timerName;
            } else {
                cbScope = getComplexBtnScope(timerScope);
                cbItemData = cbScope.item;
                activateUpdateTimer = function () {
                    // todo  проверить
                    var updateSimpleTimer = Utils.A.getValFromParent(cbScope, "updateSimpleTimer");
                    if (updateSimpleTimer) {
                        return updateSimpleTimer(timerScope, cbItemData);
                    } else {
                        throw Errors.ClientNotImplementedException({
                            timerScope: timerScope,
                            newTimerData: newTimerData,
                            updateSimpleTimer: updateSimpleTimer,
                            cbItemData: cbItemData,
                            cbScope: cbScope,
                        }, "registerSimpleTimer : activateUpdateTimer");
                    }  
                };
                timerName = timerDictionary.timerNameConstuctior(refTimerTypes.simpleTimer, cbScope.body.BodyId, cbItemData.Id);
            }
            //   scope.timerData = timerData;
    
            timerScope.timerData.$orientation = horizontal;
            timerScope.timerData.$hasTimer = timerScope.timerData.IsProgress;
            if(!timerScope.timerData.$timerHtmlData) {
                timerScope.timerData.$timerHtmlData = "";
            }
            if (!timerScope.timerData.$indicator) {
                timerScope.timerData.$indicator = $self.getIndicator(false, 0);
            }
            if (timerScope.timerData.$hasTimer) {
                timerDictionary.addTimer(timerName, activateUpdateTimer, timerScope, true);
            }
 
 
        }


        function registerNoTimerRight(timerData) { 
            timerData.$noTimer = {}; 
            timerData.$noTimer.$showData = true;
            timerData.$noTimer.$orientation = vertical;
            timerData.$noTimer.$hasTimer = false;
            timerData.$noTimer.$timerHtmlData = (timerData.hasOwnProperty("Level")) ? timerData.Level : null;
            timerData.$noTimer.$indicator =$self.getIndicator(true,0);
        }


        function registerBuildTimer(timerScope, newTimerData, ownId, $cbScope) {
            if (!(typeof ownId === "number")) return;
            if (!timerScope.timerData) {
                throw new Error("registerBuildTimer: !timerData");
            }
            timerScope.timerData.$isUnit = buildService.isUnit(timerScope.border.Data.NativeName);
            if (timerScope.timerData.$isUnit) return;
            if (newTimerData && !_.isEqual(timerScope.timerData, newTimerData)) {
                Utils.UpdateObjFromOther(timerScope.timerData, newTimerData);
            }
            var cbScope = $cbScope || getComplexBtnScope(timerScope);
            var cbItemData = cbScope.item;

            // timerData = cbItemData.Progress;
            //  if (!timerScope.timerData) return;
            timerScope.timerData.$ownId = ownId;
            function activateUpdateTimer() {
                return buildService.updateBuildTimer(timerScope, cbItemData);
            }

            timerScope.timerData.$orientation = horizontal;
            //    scope.timerData = timerData;
            timerScope.timerData.$hasTimer = timerScope.timerData.IsProgress;
            if (!timerScope.timerData.$indicator) {
                timerScope.timerData.$indicator = $self.getIndicator(false, 0);
            }
         
            if (timerScope.timerData.$hasTimer) {
                var timerName = timerDictionary.timerNameConstuctior(refTimerTypes.buildTimer, cbItemData.parentUniqueId, cbItemData.NativeName);
                timerDictionary.addTimer(timerName, activateUpdateTimer, timerScope, true);

            }

        }

        function addSinchronizer(timerName, serverUpgrade, delay, restart) {
            function upgrade() {
                if (timeDelay.HasTimeDelay(timerName)) {
                    if (restart) {
                        timeDelay.UpdateTimer(timerName, delay);
                        restart = false;
                    } else if (timeDelay.IsTimeOver(timerName)) serverUpgrade();
                    return;
                } else timeDelay.Start(timerName, delay);
            }

            timerDictionary.addSinchronizer(timerName, upgrade);
        }

        function addViewSinchronizer(timerName, updateView) {
            timerDictionary.addSinchronizer(timerName, updateView);
        }

        //#endregion

        //непрерывный таймер
        $interval(function () {
            var names = timerDictionary.names;
            if (names.length > 0) {
                _.forEach(names, function (name, key) {
                    if (name) {
                        timerDictionary.updateTimer(name);
                    }

                });
            }
        }, 1000);

        //#region Public
        this.updateStringTimer = function (timerScope) {
            var timerData = timerScope.timerData;
            var startTime = timerData.StartTime;
            var duration = timerData.Duration;
            var timeToLeft = startTime + duration - Utils.Time.GetUtcNow(false);

            if (timeToLeft > duration) timeToLeft = duration;
            if (timeToLeft < 0) timeToLeft = 0;
            var timeProgress = Math.ceil(Math.abs(((timeToLeft / duration) * 100) - 100));
            if (!timerData.$indicator) {
                timerData.$indicator = $self.getIndicator(false, timeProgress);
            }
            else {
                Utils.UpdateObjFromOther(timerData.$indicator, $self.getIndicator(false, timeProgress));
            }  
          
            timerData.$timerHtmlData = Utils.Time.Seconds2Time(timeToLeft);
            var stop = (timeToLeft === 0);
            timerData.IsProgress = !stop;
            return stop;
        };

        this.deleteTimerFromList = function (timerName) {
            if (timerDictionary[timerName]) {
                timerDictionary.deleteTimer(timerName);
            }
        };
        this.registerSimpleTimer = registerSimpleTimer;
        this.registerNoTimerRight = registerNoTimerRight;
        this.registerBuildTimer = registerBuildTimer;
        this.timeDelay = timeDelay;
        this.refTimerTypes = refTimerTypes;
        this.addSinchronizer = addSinchronizer;
        this.addViewSinchronizer = addViewSinchronizer;
        this.getIndicator = function (orientation, progres) {
            var q = {};
            q[orientation ? "height" : "width"] = progres + "%";
            return q;
        };
        this.verticalCss = vertical;
        this.horizontalCss = horizontal;
        this.getComplexBtnScope = getComplexBtnScope;
        //#endregion
    }
]);