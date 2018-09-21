Utils.CoreApp.gameApp.service("tabService", [
    "planshetService", "mainHelper",
    function(planshetService, mainHelper) {
        //var index = _.findIndex(tabModels, function (o) { return o.UniqueId === newModel.UniqueId; }); //  ищет в масиве по значению элелмента
        var planshetBodyId = "#planshet-body";
        var cssNewDataInTab = "new-data-in-tab";
        var cssTabBtn = "tab-btn";
        var cssActive = " "+Utils.RepoKeys.HtmlKeys.CssActive;
        var newTabEvent = false;

        var tabIds = ["planshet_tab_0", "planshet_tab_1", "planshet_tab_2"];

        var activeTabIdx = 0;
        var activeModel;

        var idxOnCompile;

        function getIdxOnCompile() {
            return idxOnCompile;
        }
        function setIdxOnCompile(idx) {
            idxOnCompile = idx;
        }

        function getButtons() {
            if (activeModel && activeModel.Buttons) {
                return activeModel.Buttons;
            }
            return null;
            
        }

        function getBodys() {
            if (activeModel && activeModel.Bodys) {
                return activeModel.Bodys;
            }
            return null;
        }


        function updateDataTabEvent(idx, addOrRemove) {
            newTabEvent = addOrRemove;
            var btns = getButtons();
            if (btns) {
                btns[idx].Params.hasNewEvent = addOrRemove;
            }
            return null;

        }

        function addNewDataInTabEvent(idx) {
            updateDataTabEvent(idx, true);
        }

        function updateCssBtn(btn) {
            if (btn.active) btn.CssClass = cssTabBtn + cssActive;
            else btn.CssClass = cssTabBtn;
        }

        function activateTabItem(tabIdx) {
            var bodys = getBodys();
            if (bodys) {
                var btns = getButtons();
                var activateVoice = activeTabIdx === tabIdx;
                mainHelper.applyTimeout(function () {
                    for (var i = 0; i < btns.length; i++) {
                        btns[i].active = false;
                        bodys[i].active = false;
                        if (i === tabIdx) {
                            btns[tabIdx].active = true;
                            bodys[tabIdx].active = true;
                        }
                        updateCssBtn(btns[i]);
                    }

                    if (newTabEvent) {
                        updateDataTabEvent(tabIdx, false);
                    }

                });
                if (activateVoice) {
                    EM.Audio.GameSounds.planshetTabActivate.play();
                }
            }
 
        }


        function setTabIdx(tabIdx) {
            activeTabIdx = tabIdx;
            activateTabItem(tabIdx);
        }

        function tabClick(params) {
            setTabIdx(params.tabIdx);
        }

        function initializeTabs(tabs) {
            for (var i = 0; i < tabs.Buttons.length; i++) {
                tabs.Buttons[i].Method = tabClick;
                var params = {
                    hasNewEvent: false,
                    newEventCss: cssNewDataInTab,
                    tabIdx: i
                };
                tabs.Buttons[i].Params = params;

            }
            activeModel = tabs;
            setTabIdx(getIdxOnCompile() || 0);
            idxOnCompile = null;
        }

        function activateTabByIdx (idx, callback) {
            setTabIdx(idx);
            if (callback instanceof Function) {
                callback();
            }

            if (newTabEvent) {
                updateDataTabEvent(idx, false);
            }

        }


        this.activateTabItem = activateTabItem;

        this.getButtons = getButtons;
        this.getBodys = getBodys;


        this.isActiveTab = function(item) {
            return (+item.BodyId.substr(-1) === activeTabIdx);
        }
        this.isActiveTabByIdx = function(idx) {
            return (idx === activeTabIdx);
        }
        this.delayActivate = function (idx, callback) {
            planshetService.conditionAwaiter(function () {
                return  activeModel &&  activeModel.hasOwnProperty("Buttons") && activeModel.Buttons.length === 3;
            }, function () {
                activateTabByIdx(idx, callback);
            });
        }
        this.activateTabByIdx = activateTabByIdx;

        this.addNewDataInTabEvent = addNewDataInTabEvent;
        this.initializeTabs = initializeTabs;
        this.setTabIdx = setTabIdx;
        this.getIdxOnCompile = getIdxOnCompile;
        this.setIdxOnCompile = setIdxOnCompile;
        this.tabIds = tabIds;

    }
]);