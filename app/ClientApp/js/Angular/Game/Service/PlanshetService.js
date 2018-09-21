Utils.CoreApp.gameApp.service("planshetService", [
    "$interval", "timerHelper", "planshetHelper",
    function ($interval, timerHelper, planshetHelper) {
        //#region Declare
        var $self = this;
        var plansheteDefaultUniqueId = "startPlanshet";
        var inProgress = false;

        /**
         * Базовая модель экзепляра планшета
         * @returns {object} plansheModel
         */
        var protoModel = function () {
            return {
                UniqueId: "",
                HeadTranslateName: "",
                Buttons: [],
                Bodys: [],
                TemplateUrl: "",
                HasTabs: false,
                IsMother: false
            };
        };
        var planshetModels = [];
        var currentModel = {};   

        var LocalErrors = {
            planshetInProgress: "planshetInProgress",
            notHasOnSuccess: "notHasOnSuccess",
            notHasHubDelegate: "notHasHubDelegate",
            notHasOnError: "notHasOnError",
            noCachePolicy: "noCachePolicy",
        };


        //#endregion




        //#region Progress
        /**
         * 
         * @param {function} condition  должна возвращать  bool
         * @param {function} callback   сделать если condition =true;
         * @param {int} delay Number of milliseconds between each function call.
         * @param {int} repeat count
         * @returns {void} 
         */
        function conditionAwaiter(condition, callback, delay, repeat) {
            if (condition()) return callback();
            delay = delay ? delay : 40;
            repeat = repeat ? repeat : 10;
            var t = $interval(function () {
                if (condition()) {
                    $interval.cancel(t);
                    t = null;
                    return callback();
                }
            }, delay, repeat);

        }

        function awaiter(callback, delay, repeat) {
            return conditionAwaiter(function () { return !inProgress; }, callback);
        }

        /**
         * 
         * @param {bool} value true or file
         * @returns {void} 
         */
        function setInProgress(value) {
            inProgress = value;
        }

        function getInProgress() {
            return inProgress;
        }

        //#endregion

        //#region reqHelpers

        /**
         * 
         * @returns {object} Utils.ModelFactory.RequestParams
         */
        function reqParams() {
            return Utils.ModelFactory.RequestParams();
        }

        /**
         * 
         * @param {object} serverParams params for server
         * @returns {object}  приведенный к reqParams
         */
        function reqFixParam(serverParams) {
            var p = reqParams();
            p.url = serverParams.Url;
            p.method = serverParams.Method;
            p.data = serverParams.Data;
            return p;
        }

        //#endregion

        //#region PlanshetViewData

        /**
         * 
         * @returns {object} planshetHelper - angular service 
         */

        function endLoad() {
            planshetHelper.endLoad();
        }

        function startPreloader(parameters) {
            planshetHelper.startLoad();
        }

        /**
        * закрывает  планшет панель
        * @returns {void} 
        */
        function close() {
            //console.log("close");
            planshetHelper.close();
        }

        /**
        * 
        * @returns {void} открывает  планшет панель
        */
        function open() {
            planshetHelper.open();
        }

        /**
                 * 
                 * @returns {void}  меняет состояние видимого плагщета не противоположенное 
                 */
        function isOpened() {
            return planshetHelper.isOpened();
        }

        function updateState(guid) {
            planshetHelper.updateState(guid);
        }

        var lastToggleId;
        function toggle(uniqueId) {
            var id = uniqueId || currentModel.UniqueId;
            if (lastToggleId === id) planshetHelper.toggle();
            else open();
            lastToggleId = id;
        } /**
         * 
         * @returns {void}   проверяет является ли текущее состояние плашета состоянием планшет открыт
         */ //#endregion

        //#region History
        var history = [];
        var historyIdx = 0;
        var maxHistoryElems = 20;

        var historyBlackList = ["startPlanshet",
            "build-collection-industrial-complex",
            "build-collection-space-shipyard",
            "build-collection-laboratory",
            "build-collection-command-center"
        ];

        function hasPrevPlanshetElem() {
            return !!history[historyIdx - 1];
        }
        function hasNextPlanshetElem() {
            return !!history[historyIdx + 1];
        }

        function canAddToHistory(uniqueId) {
            return !_.find(historyBlackList, function (o) {
                return o === uniqueId;
            });
        }

        function addToHistory(uniqueId) {
            if (canAddToHistory(uniqueId)) {
                history.push(uniqueId);
                if (history.length > maxHistoryElems) history.shift();
                var idx = history.length - 1;
                if (history[idx]) historyIdx = idx;
                else historyIdx = 0;

            }

        }

        function getPrevHistoryId() {
            console.log("getPrevHistoryId", {
                history: history,
                length: history.length - 1,
                UniqueId: history[history.length - 1],
            });
            if (hasPrevPlanshetElem()) return history[historyIdx - 1];
            return currentModel.UniqueId;
        }

        function updateByHistory(direction) {
            var idx = historyIdx + direction;
            var uniqueId = history[idx];

            //console.log("prev", {
            //    uniqueId: uniqueId,
            //    history: history,
            //    historyIdx: historyIdx
            //});
            if (history[idx]) {
                $self.updatePlanshet(function () {
                    historyIdx = idx;
                    //  console.log("updatePlanshet", {newIdx : historyIdx});
                }, uniqueId, true, true);
            }
        }

        this.hasPrevPlanshetElem = hasPrevPlanshetElem;
        this.hasNextPlanshetElem = hasNextPlanshetElem;
        this.updateByHistory = updateByHistory;


        //#endregion

        /**
         * Проверяет существует ли запрашиваемая модель в масиве планшет моделей
         * @param {string} uniqueId model.UniqueId
         * @returns {bool} exist or not
         */
        function getItemById(uniqueId) {
            return _.find(planshetModels, function (o) {
                return o.UniqueId === uniqueId;
            });
        }

        function hasItemById(uniqueId) {
            return !!getItemById(uniqueId);
        }

        /**
        * добавляет или обновляет newPlanshetViewModel в коллекцию planshetModels 
        * require  newPlanshetViewModel.UniqueId
        * @returns {object} newPlanshetViewModel planshetModels[i]
        * @returns {void} 
        */
        function addOrUpdatePlanshetModel(newPlanshetViewModel) {
            if (hasItemById(newPlanshetViewModel.UniqueId)) {
                var idx = _.findIndex(planshetModels, { UniqueId: newPlanshetViewModel.UniqueId });
                planshetModels[idx] = newPlanshetViewModel;
            } else planshetModels.push(newPlanshetViewModel);
        }

        function updatePlanshetItemData(newModel, updateCacheTime, cacheTime) {
            addOrUpdatePlanshetModel(newModel);
            if (updateCacheTime) timerHelper.timeDelay.UpdateTimer(newModel.UniqueId, cacheTime || Utils.Time.TIME_CACHE_PLANSHET);
        }

        /**
         * Находит  планшет модель planshetModels[i] по uniqueId и устанавливает в текущей моделью для видимого планшета в  currentModel переменную
         * @param {string} uniqueId model.UniqueId
         * @param {bool} isHistory if isHistory = true not set to current
         * @param {bool} hasTabs  has tab in planshet model
         * @returns {void} 
         */
        function setCurrentModel(uniqueId, isHistory, hasTabs) {
            currentModel = getItemById(uniqueId);
            if (!isHistory && currentModel && currentModel.hasOwnProperty("UniqueId") && history[history.length - 1] !== currentModel.UniqueId) {
                addToHistory(currentModel.UniqueId);
            }

        }

        /**
         * Добавляет или заменяет предудущю модель  новой моделью
         * @param {object} newPlanshetHelperModel planshetModels.add(i)
         * @returns {void} 
         */ /**
        * Устанавливает первичный - базовый планшет до получения данных с сервера
        * @returns {void} 
        */
        function getDefaultPlanshet() {
            var m = Utils.ModelFactory.PlanshetHelper();
            m.HasTabs = false;
            m.HeadTranslateName = "Hi Planshet";
            m.UniqueId = plansheteDefaultUniqueId;
            addOrUpdatePlanshetModel(m);
            return getItemById(plansheteDefaultUniqueId);
        }

        /**
         *  
         * @returns {object} currentModel  возвращает текущую модель видимого планшета
         */
        function getCurrentModel() {
            return inProgress ? false : currentModel;
        }

        /**
         * 
         * @returns {string}  model.UniqueId
         */
        function getCurrentUniqueId() {
            return currentModel.UniqueId;
        }

        /**
                 * 
                 * @param {string} uniqueId model.UniqueId
                 * @returns {bool} is current model or not
                 */
        function isCurrentModel(uniqueId) {
            var curId = getCurrentUniqueId();
            return uniqueId && curId && uniqueId === curId;
        }

        function _cacheIsTimeOver(uniqueId) {
            return timerHelper.timeDelay.IsTimeOver(uniqueId);
        }

        /**
         * 
         * @param {string} uniqueId model.UniqueId
         * @returns {bool}  данные для текущего таймера 
         */
        function needUpdateCache(uniqueId) {
            if (!uniqueId) return true;
            var hasLocalItem = hasItemById(uniqueId);

            // console.log("hasItemById(uniqueId)", hasItemById(uniqueId));
            if (hasLocalItem) {
                // console.log("timerHelper.timeDelay.IsTimeOver(uniqueId)", timerHelper.timeDelay.IsTimeOver(uniqueId));
                return _cacheIsTimeOver(uniqueId);
            }
            return true;
        }

        /**
          * Основной обработчик запросов для клиент серверных взаимодействий. восновном для взаимодействий модулей и подмодулей планшета, так же  обновляет время кеширования новой модели
          * @param {object} params  из конструктора reqParams
          * @param {bool} doNotChangeState not open planshet
          * @param {int} cacheTime ms
          * @param {bool} notCache default false
          * @returns {void} 
          */
        function request(params, doNotChangeState, cacheTime, notCache) {
            setInProgress(true);
            var showError = null;
            var changePlanshetState = !doNotChangeState;
            var onError = function (answer) {
                setInProgress(false);
                endLoad();
                if (params.onError instanceof Function) params.onError(answer);
            };
            showError = params.showError ? params.showError : false;

            if (changePlanshetState) startPreloader();

            function onSuccess(a) {
                setInProgress(false);
                params.onSuccess(a);
                if (changePlanshetState) {
                    endLoad();
                    toggle(a.UniqueId);
                }
                if (notCache) return;
                timerHelper.timeDelay.UpdateTimer(a.UniqueId, cacheTime || Utils.Time.TIME_CACHE_PLANSHET);

            }

            var r = new Utils.Request(params.url, onSuccess, params.data ? params.data : null, params.method, onError, showError);
            r.getJson();
        }
        function localError(params, msg) {
            if (params.hasOwnProperty("onError") && params.onError instanceof Function) params.onError(msg);
        }






        /**
         *  аналог    requestHelper но для хаб методов
         * @param {objct} opts    IHubRequestOptions
         * @returns {void} 
         */
        function planshetHubRequest(opts) {
            opts.$isValid();
            if (inProgress) throw opts.OnError(LocalErrors.planshetInProgress);
            if (opts.UniqueId && opts.TryGetLocal && opts.$tryUpdateLocal()) return;
            setInProgress(true);
            startPreloader();
            opts.Delegate().finally(function () {
                // console.log("hubRequestDelegate.always");
                setInProgress(false);
            })
                    .then(function (newPlanshet) {
                        //    console.log("hubRequestDelegate.then.start");
                        updatePlanshetItemData(newPlanshet, true, opts.CacheTime || Utils.Time.TIME_CACHE_PLANSHET);
                        opts.$onDone(newPlanshet);

                        //   console.log("hubRequestDelegate.then.end");
                    }, function (errorAnswer) {
                        endLoad();
                        opts.OnError(errorAnswer);
                    });

        }


        /**
         * Надстройка над request Проверяет данные перед запросом и определяет необходимость в извлечении данных из кеша а не из запроса
         * @param {object} params  из конструктора reqParams
         * @param {string} uniqueId  model.UniqueId
         * @param {bool} ignore if true not show in cache and current planshet state
         * @param {bool} doNotChangeState not open or close planshet
         * @param {int} cacheTime ms
         * @param {int} notCache ms default false
         * @returns {void} 
         */
        function requestHelper(params, uniqueId, ignore, doNotChangeState, cacheTime, notCache) {
            if (!params.hasOwnProperty("onSuccess")) {
                localError(params, LocalErrors.notHasOnSuccess);
                return;
            }
            if (getInProgress() && !ignore) {
                localError(params, LocalErrors.planshetInProgress);
                return;
            }
            else if (ignore) request(params, doNotChangeState, cacheTime, notCache);
                //else if (doNotChangeState) request(params, doNotChangeState, cacheTime, notCache);
            else {
                if (!notCache && uniqueId) {
                    var opts = $self.IHubRequestOptions(null, uniqueId);
                    opts.OnSuccsess = params.onSuccess;
                    opts.OnError = params.onError;
                    if (opts.$$tryUpdateLocalIgnoreValid()) return;
                }
                else request(params, doNotChangeState, cacheTime, notCache);
            }

        }

 
        //#region Default
        getDefaultPlanshet();
        setCurrentModel(plansheteDefaultUniqueId);
        //#endregion




        //#region Public
        this.getCurrentModel = getCurrentModel;
        this.getCurrentUniqueId = getCurrentUniqueId;
        this.isCurrentModel = isCurrentModel;
 
 

        this.addOrUpdatePlanshetModel = addOrUpdatePlanshetModel;
        this.updatePlanshetItemData = updatePlanshetItemData;
        this.updatePlanshet = function (advancedAction, uniqueId, setCurrentModelById, isHistory) {
            if (uniqueId && (isCurrentModel(uniqueId) || setCurrentModelById)) setCurrentModel(uniqueId, isHistory);
            GameServices._updatePlanshet(advancedAction);
        };
        this.setCurrentModel = setCurrentModel;
        this.hasItemById = hasItemById;
        this.getItemById = getItemById;
        this.getPlanshetModels = function () {
            return planshetModels;
        };

        this.requestHelper = requestHelper;
        //this.run = run;
        this.toggle = toggle;
        this.open = open;
        this.updateState = updateState;
        this.close = close;
        this.isOpened = isOpened;
        this.setInProgress = setInProgress;
        this.getInProgress = getInProgress;
        this.conditionAwaiter = conditionAwaiter;
        this.needUpdateCache = needUpdateCache;
        this.reqParams = reqParams;
        this.reqFixParam = reqFixParam;

        this.LocalErrors = LocalErrors;
        this.planshetHubRequest = planshetHubRequest;
        this.getModelIndex = function (uniqueId) {
            return _.findIndex(planshetModels, function (o) { return o.UniqueId === uniqueId; });
        }

        function IHubRequestOptions(delegate, uniqueId) {
            var $this = this;
            this.Delegate = delegate;
            this.UniqueId = uniqueId;
            this.OnSuccsess = null;
            this.OnError = null;
            this.TryGetLocal = false;
            this.SetToCurrent = false;
            this.UpdateCacheTime = false;
            this.ChangePlanshetState = false;
            this.CacheTime = 0;

            this.$tryUpdateLocal = function () {
                if (!$this.UniqueId) return false;
                if (!$this.$isValidSilent()) return false;
                return this.$$tryUpdateLocalIgnoreValid();
            }
            this.$$tryUpdateLocalIgnoreValid = function () {
                var localItem = getItemById($this.UniqueId);
                if (!localItem) return false;
                if ($this.CacheTime) timerHelper.timeDelay.UpdateTimer($this.CacheTime);
                else if (_cacheIsTimeOver($this.UniqueId)) return false;
                return $this.$onDone(localItem);
            }

            this.$isValid = function () {
                if (this.IsValidated && this._isValidated) return true;
                if (!(this.OnError instanceof Function)) {
                    this.IsValidated = true;
                    this._isValidated = false;
                    throw new Error(LocalErrors.notHasOnError);
                }
                if (!(this.Delegate instanceof Function)) {
                    this.IsValidated = true;
                    this._isValidated = false;
                    throw this.OnError(LocalErrors.notHasHubDelegate);
                }
                if (!(this.OnSuccsess instanceof Function)) {
                    this.IsValidated = true;
                    this._isValidated = false;
                    throw this.OnError(LocalErrors.notHasOnSuccess);
                }
                if (this.UpdateCacheTime && !this.CacheTime) {
                    this.IsValidated = true;
                    this._isValidated = false;
                    throw this.OnError(LocalErrors.noCachePolic);
                }
                this.IsValidated = true;
                this._isValidated = true;

            }
            this.IsValidated = false;
            this._isValidated = false;
            this.$isValidSilent = function () {
                if (this.IsValidated) return this._isValidated;
                this.IsValidated = true;
                if (!(this.OnError instanceof Function)) {
                    this.IsValidated = true;
                    this._isValidated = false;
                    return false;
                }
                if (!(this.Delegate instanceof Function)) {

                    this._isValidated = false;
                    return false;
                }
                if (!(this.OnSuccsess instanceof Function)) {
                    this.IsValidated = true;
                    this._isValidated = false;
                    return false;
                }
                if (this.UpdateCacheTime && !this.CacheTime) {
                    this.IsValidated = true;
                    this._isValidated = false;
                    return false;
                }
                this.IsValidated = true;
                this._isValidated = true;
                return this._isValidated;
            };
            this.$onDone = function (newPlanshetData) {
                if ($this.SetToCurrent) {
                    $self.updatePlanshet(function () {
                        endLoad();
                        $this.OnSuccsess(newPlanshetData);
                        if ($this.ChangePlanshetState) toggle(newPlanshetData.UniqueId);
                    }, newPlanshetData.UniqueId, true);
                }
                else {
                    endLoad();
                    $this.OnSuccsess(newPlanshetData);
                    if ($this.ChangePlanshetState) toggle(newPlanshetData.UniqueId);
                }
                return true;

            }
        }
        this.IHubRequestOptions = function (delegate, uniqueId) {
            return new IHubRequestOptions(delegate, uniqueId);
        };
        Object.defineProperty($self, "$planshetModels", {
            get: function () {
                return planshetModels;
            }
        });


        //#endregion

        //setInterval(function () {
        //    console.log({
        //        planshetModels: planshetModels
        //    });
        //}, 15000);
    }
]);