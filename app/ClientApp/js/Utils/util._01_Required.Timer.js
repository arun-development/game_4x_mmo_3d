(function () {
    function Timer(options) {
        options = $.extend({
            elem: null,
            button: 'button',
            actionMethod: null,
            interval: 5000,
            targetForm: '#timer',
            role: '[role=timer]'
        }, options);

        if (!options.elem || !options.actionMethod) {
            return {
                init: function () { }
            }
        }

        var inProcess = false;

        function getDateStart() {
            if (!Timer.dateStart) {
                Timer.dateStart = Date.now();
            }

            return Timer.dateStart;
        };


        function start() {
            Timer.dateStart = getDateStart();

            if (!inProcess) {
                inProcess = true;

                setTimeout(function () {
                    Timer.dateStart = null;
                    inProcess = false;
                }, options.interval);

            }
        };


        function status() {
            if (Timer.dateStart) {
                return (Timer.dateStart + options.interval) - Date.now();
            }

            return false;
        };

        $(options.elem).find(options.button).click(function () {
            if (!status()) {
                options.actionMethod(this);

            } else {
                $(options.targetForm).modal();
                $(options.targetForm).find(options.role).text(status());
            }

            start();
        });
    }
    Timer.dateStart = null;
    var TimeDelay = {
        BaseDelay: 2000, // ms
        Objects: {},
        Start: function (timerKey, delay) {
            if (this.Objects[timerKey]) {
                return;
            }

            this.Objects[timerKey] = {
                StartTime: Date.now(),
                Delay: delay || TimeDelay.BaseDelay
            };
        },
        IsTimeOver: function (timerKey) {
            if (!this.Objects[timerKey]) {
                return true;
            }

            var timer = this.Objects[timerKey];

            if ((timer.StartTime + timer.Delay) < Date.now()) {
                delete this.Objects[timerKey];
                return true;
            }

            return false;
        },
        UpdateTimer: function (timerKey, delay) {
            if (!this.IsTimeOver(timerKey)) {
                delete this.Objects[timerKey];
                this.Start(timerKey, delay);
            } else {
                this.Start(timerKey, delay);
            }
        },
        Chronometer: {
            SetProgressHtmlData: function (chronometerrDom, progress) {
                chronometerrDom.attr("data-timer", JSON.stringify(progress));
            },
            GetProgressHtmlData: function (chronometerrDom) {
                return Utils.ModelFactory.ItemProgress(chronometerrDom.data("timer"));
            },
            TimeSelectors: {
                //Timer: Utils.GenAttrItem(["timer"], true),
                Timer: "[itemid=timer]",
                StartTime: "[data-start-time]",
                Duration: "[data-duration]",
                Progress: "[data-progress]"
            },
            Timers: {},
            TimerModel: function () {
                return {
                    DomElem: null,
                    StartTime: null,
                    Duration: null,
                    EndTime: null,
                    Progress: null,
                    CallBack: null,
                    IsStop: null,
                    Update: null
                }
            },
            _getNativeName: function (elem, skipParent) {
                var parent = elem;
                for (var i = 0; i < skipParent; i++) {
                    parent = parent.parent();
                }

                var itemid = parent.attr("itemid");

                if (!itemid) {
                    console.log("Error :class Utils.TimeDelay.Chronometer.CreateTimer,  parent name =  не найден  или имя было изменено");
                    return false;
                }

                return itemid;
            },
            CreateTimer: function (dom, domSkipUp, callback, progressData) {

                //===
                //  console.log("qwertyui");
                //===

                var timeData;

                if (progressData) {
                    progressData = Utils.ModelFactory.ItemProgress(progressData);
                    this.SetProgressHtmlData(dom, progressData);
                    timeData = progressData;
                }
                else {
                    timeData = this.GetProgressHtmlData(dom);
                }

                var progress = timeData.IsProgress;
                if (!progress) {
                    return;
                }

                var name = this._getNativeName(dom, domSkipUp);


                //var startTime = dom.attr(s.StartTime);
                //var duration = +dom.attr(s.Duration);
                //var endTime = startTime + duration;

                var startTime = timeData.StartTime;
                var duration = timeData.Duration;
                var endTime = startTime + duration;
                if (!(callback instanceof Function)) {
                    callback = function () { };
                }

                this.Timers[name] = {
                    DomElem: dom,
                    StartTime: startTime,
                    Duration: duration,
                    EndTime: endTime,
                    Progress: progress,
                    CallBack: callback,
                    IsStop: false,
                    Update: function () {
                        var d = Math.floor(Time.GetUtcNow());
                        var timeToLeft = this.EndTime - d;

                        var timeProgress = Math.abs((timeToLeft / this.Duration) * 100 - 100);

                        this.DomElem.prev().css("width", timeProgress + "%");
                        this.DomElem.parent().addClass("opacityPlus");

                        if (timeToLeft <= 0) {
                            this.DomElem.parent().removeClass("opacityPlus");
                            this.CallBack();
                            this.IsStop = true;
                            this.DomElem.attr("data-progress", "false");
                        }

                        var outData = Time.Seconds2Time(timeToLeft);
                        this.DomElem.html(outData);
                    }
                };
            },


            SetCustomTimer: function (timerName, timerModel) {
                if (!(timerModel.CallBack instanceof Function)) {
                    timerModel.CallBack = function () { };
                }
                timerModel.IsStop = false;
                this.Timers[timerName] = timerModel;
            },
            //        ProtoObject: {
            //            StartTime: 0,
            //            Duration: 0,
            //            EndTime: 0,
            //            Progress: false
            //        },
            Objects: {},
            TimerId: null,
            Start: function () {
                var self = this;
                if (this.TimerId) {
                    return;
                }

                this.TimerId = setInterval(function () {
                    var timers = self.Timers;
                    for (var name in timers) {
                        if (!timers.hasOwnProperty(name)) continue;
                        if (timers[name].IsStop) {
                            delete timers[name];
                            continue;
                        }
                        timers[name].Update();
                    }
                }, 1000);
            },
            Clear: function (name) {
                //delete this.Chronometer.Timers[name];
                delete this.Timers[name];
            },
            TimeOver: function (callback) {
                if (callback) {
                    callback();
                }
            }
        }
    };
    Utils.Timer = Timer;
    Utils.TimeDelay = TimeDelay;
})();