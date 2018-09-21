Utils.CoreApp.gameApp.service("paralaxButtonHelper", [
    "planshetService", "hangarService", "mapControlHelper",
    function (planshetService, hangarService, mapControlHelper) {
        //#region Declate
        var btnKeys = ["leftNavBtns", "toggleBtns", "mapControllBtns", "hangarBtns"];

        var buttons = [];
        var leftNavButtons = [];
        var toggle = {};
        var mapCtrlBtns = [];
        // not fo using
        var mapControlbtnsIds = [
            "btnGalaxyInfo",
            "btnSectorInfo",
            "btnPlanetInfo",
            "btnStarInfo",
            "btnJumpToSector",
            "btnJumpToPlanetoid",
            "btnJumpToMother",
            "btnJumpToUserPlanet",
            "btnJumpToGalaxy",
            "btnOpenBookmarks"
        ];



        var updatePlanshet = function () {
            planshetService.updatePlanshet();
        }

        var leftnavIsSet = { q: false };
        var mapControlsIsSet = { q: false };
        var toggleSet = { q: false };




        //#endregion

        //#region Common

        function setHoverVoiceToButton(button, voice) {
            if (button) {
                if (!button.Params) {
                    button.Params = {};
                }
                if (!button.Params.onHovered) {
                    button.Params.onHovered = voice || function () { EM.Audio.GameSounds.defaultHover.play() }
                }
            }
        }

        function setInterfaceSvgNameToButton(button, name) {
            
            if (button) {
                if (!button.Params) {
                    button.Params = {};
                }
                if (!button.Params.svgName) {
                    button.Params.svgName = name;
                }
            }
        }
        
        function upgradeMethods(group, methods, chekItem) {
            function callback() {
                if (chekItem.q) {
                    return group;
                }
                if (methods instanceof Function) {
                    methods(group);
                    chekItem.q = true;
                    return group;
                }
                return group;
            }

            function hasData() {
                if (group instanceof Object) {
                    return !Utils.CheckObjIsEmpty(group);
                }
                return !!group;
            }

            return planshetService.conditionAwaiter(hasData, callback);

        }

        function getObj(group, methods, chekItem) {
            if (chekItem.q) {
                return group;
            } else {
                return upgradeMethods(group, methods, chekItem);
            }
        }

        //#endregion

        //#region LeftNav 

        function setNavBtnsMethods(data) {
            //alliance
            data[0].Method = function (params, element, attrs, $scope, $event) {
                GameServices.allianceService.toggleAlliance(params, element, attrs, $scope, $event);
            };
            //  confederation
            data[1].Method = function (params, element, attrs, $scope, $event) {
                GameServices.confederationService.leftNavGetConfederation(params, element, attrs, $scope, $event);
            };
            //journal
            data[2].Method = function (params, element, attrs, $scope, $event) {
                GameServices.journalService.leftNavGetJournal(params, element, attrs, $scope, $event);
            };
            //  userChannels
            data[3].Method = function (params, element, attrs, $scope, $event) {
                GameServices.userChannelsService.leftNavGetUserChannels(params, element, attrs, $scope, $event);
            };
 

            function voice() {
                EM.Audio.GameSounds.defaultHover.play(0.005);
            }

            function setAdvanced(d,svgName) {
                setInterfaceSvgNameToButton(d, svgName);
                setHoverVoiceToButton(d, voice);
            }

            setAdvanced(data[0], "alliance");
            setAdvanced(data[1],"confederation");
            setAdvanced(data[2],"journal");
            setAdvanced(data[3],"message");
 
            return data;
        };


        //#endregion

        function toggleMethod(data, onClickToggle) {
            data.Method = function () {
              // console.log("toggleMethod");
                onClickToggle();
                EM.Audio.GameSounds.defaultButtonClick.play();
            };
            setHoverVoiceToButton(data);
            setInterfaceSvgNameToButton(data,"hangar-toggle");
            
            return data;
        }

        function mapCtrlBtnsMethods(data) {
            //var refToSvgName = {
            //    "btnSectorInfo": "galaxy-info",
            //    "btnPlanetInfo": "sector-info",
            //    "btnStarInfo": "planet-info",
            //    "btnJumpToPlanetoid": "jump-to-planetoid",
            //    "btnJumpToMother": "jump-to-mother",
            //    "btnJumpToGalaxy": "jump-to-galaxy",
            //    "btnJumpToUserPlanet": "jump-to-user-planet",
            //    "btnOpenBookmarks": "open-bookmarks"
            //};

            for (var i = 0; i < data.length; i++) {
                function method(params, $event) {
                    mapControlHelper[params._methodName](params, $event.target, null, updatePlanshet);
                }
                data[i].Method = method;
                data[i].Hide = true;
                setHoverVoiceToButton(data[i]);
                var mn = _.lowerFirst(data[i].ButtonId.substr(3));
                data[i].Params._methodName = mn;
                setInterfaceSvgNameToButton(data[i], _.kebabCase(mn));
            }
            return data;
        }

        function getMapCtrlBtns() {
            return getObj(mapCtrlBtns, mapCtrlBtnsMethods, mapControlsIsSet);
        }


        //#region Public
        this.setBaseBtns = function (data) {
            leftNavButtons = data[btnKeys[0]];
            
            toggle = data[btnKeys[1]][0];
            mapCtrlBtns = data[btnKeys[2]];
            hangarService.saveInitHangarPanel(data[btnKeys[3]]);
        }

        this.getLeftNavButtons = function () {
            var btns = getObj(leftNavButtons, setNavBtnsMethods, leftnavIsSet);
            //console.log("getLeftNavButtons", { btns: btns });
            return btns;
        };

        this.getMapCtrlBtns = getMapCtrlBtns;
        this.getMapCtrlBtn = function (name) {
            return _.find(getMapCtrlBtns(), function (o) {
                return o.ButtonId === name;
            });
        };

        this.updateMapCtrlBtn = function (btn) {
            var idx = _.findIndex(mapCtrlBtns, function (o) { return (o.ButtonId === btn.ButtonId); });
            mapCtrlBtns[idx] = btn;
        }
        this.getToggle = function (onClickToggle) {
            return getObj(toggle, function (data) {
                if (onClickToggle) {
                    toggleMethod(data, onClickToggle);
                }

            }, toggleSet);
        }

        this.addMapCtrlBtn = function (newButton) {
            mapCtrlBtns.push(newButton);
        }

        this.removeButton = function (button) {
            _.pull(buttons, button);
        };
        //#endregion

        //#region Create - clone c#
        var buttonsConstants = {
            CssSmall: "small",
            CssMediaTriple: "media-triple",
            CssMediaDouble: "media-double",
            CssMid: "mid",
            CssTabButton: "tab-btn",
            CssXlBtn: "xl-btn",
            Post: "POST",
            Get: "GET",
            Center: "center",
            Ms: "ms",
            M: "m"
        };
        Object.freeze(buttonsConstants);
        function sectionItem() {
            function SectionItem() {
                var self = this;
                this.Data = {};
                this.Path = "";
                this.IsPath = false;
                this.Size = "";
                this.ItemId = "";
                this.JsFunction = "";
                this.IsComplexPart = false;
                this.BorderAnimView = function (size, path, data) {
                    self.Size = size;
                    if (path) {
                        self.Path = path;
                        self.IsPath = true;
                    }
                    if (data) {
                        self.Data = data;
                    }
                    return self;
                };
            }
            return new SectionItem();
        }

        function sectionContentViewData(left, centr, right) {
            function SectionContentViewData() {
                this.Left = left || sectionItem();
                this.Centr = centr || sectionItem();
                this.Right = right || sectionItem();
            }

            return new SectionContentViewData();
        }

        function buttonPartialView(data, path) {
            function ButtonPartialView() {
                this.PartialPath = path || "";
                this.Data = data;
            }

            return new ButtonPartialView();
        }

        function buttonsView(btnPartialView, params) {
            function ButtonsView() {
                var self = this;
                this._constants = buttonsConstants;
                this.TranslateName = "";
                this.ButtonId = "";
                this.CssClass = "";
                this.ShowName = false;
                this.ConteinPartial = false;
                this.PartialView = btnPartialView || buttonPartialView();
                this.IsCssImage = false;
                this.CssImage = "";
                this.Method = "";
                this.Params = params || {};
                /**
             * 
             * @param {} groupCount 
             * @param {} showName 
             * @param {} name 
             * @param {} method 
             * @param {} param 
             * @param {} buttonId 
             * @returns {} 
             */
                this.ConstructorSizeBtn = function (groupCount, showName, name, method, param, buttonId) {
                    if (!groupCount) groupCount = 1;
                    var size = this._constants.CssXlBtn;
                    if (groupCount === 2) size = self._constants.CssMediaDouble;
                    if (groupCount === 3) size = self._constants.CssMediaTriple;
                    if (groupCount === 4) size = self._constants.CssSmall;
                    if (name == null) name = "Ok";
                    self.TranslateName = name;
                    self.CssClass = size;
                    self.Method = method;
                    self.ShowName = showName;
                    self.Params = param;
                    self.ButtonId = buttonId;
                    return self;
                };

            }
            return new ButtonsView();
        }


        function complexButtonView() {
            function ComplexButtonView() {
                var self = this;
                this.Collection = [];
                this.IsNewItem = false;
                this.Full = function (_sectionContentViewData) {
                    _sectionContentViewData.Left.BorderAnimView(buttonsConstants.Ms);
                    _sectionContentViewData.Centr.BorderAnimView(buttonsConstants.Center);
                    _sectionContentViewData.Right.BorderAnimView(buttonsConstants.Ms);
                    self.Collection[0] = _sectionContentViewData.Left;
                    self.Collection[1] = _sectionContentViewData.Centr;
                    self.Collection[2] = _sectionContentViewData.Right;
                    return self;
                };
                this.OnlyCentr = function (path, data) {
                    var left = sectionItem();
                    left.BorderAnimView(buttonsConstants.Ms);
                    var centr = sectionItem();
                    centr.BorderAnimView(buttonsConstants.Center, path, data);
                    var right = sectionItem();
                    right.BorderAnimView(buttonsConstants.Ms);
                    self.Collection = [left, centr, right];
                    return self;
                };
                this.SimpleCentr = function (path, name) {
                    return self.OnlyCentr(path, { Head: name });
                };
            }

            return new ComplexButtonView();
        }

        this.SectionItem = sectionItem;
        this.ButtonPartialView = buttonPartialView;
        this.ButtonsView = buttonsView;
        this.ComplexButtonView = complexButtonView;
        this.SectionContentViewData = sectionContentViewData;
        this.BUTTONS_CONSTANTS = buttonsConstants;
        this.setHoverVoiceToButton = setHoverVoiceToButton;


        //#endregion



        // #region CustomConfigs

        this.createAllianceManageUserRequestBtns = function (request, actionNewMessage, actionRefuse, actionAccept, armAllianceAcceptedStatus) {
            if (request.AllianceAccepted === armAllianceAcceptedStatus.Accept) {
                request.ButtonsView = [];
                return;
            }
            var size = 3;
            var r = { request: request };
            var createMessageToMemberBtn = buttonsView();
            createMessageToMemberBtn.ConstructorSizeBtn(size, true, "new Message", actionNewMessage, r);

            var refuseMemberBtn = buttonsView();
            refuseMemberBtn.ConstructorSizeBtn(size, true, "Refuse", actionRefuse, r);

            var acceptMemberBtn = buttonsView();
            acceptMemberBtn.ConstructorSizeBtn(size, true, "Accept", actionAccept, r);

            console.log("createAllianceManageUserRequestBtns", request);
            request.ButtonsView = [createMessageToMemberBtn, refuseMemberBtn, acceptMemberBtn];
        }

        this.getOrCreateMyAllianceRequestBtns = function (request, actionCreateMsg, actionRemoveRequest, actionJoinToAlliance) {
            function createMsgBtn(size) {
                var btn = buttonsView();
                btn.ConstructorSizeBtn(size, true, "new Message", actionCreateMsg, { request: request });
                return btn;
            }
            function removeRequestBtn(size) {
                var btn = buttonsView();
                btn.ConstructorSizeBtn(size, true, "Refuse", actionRemoveRequest, { request: request });
                return btn;
            }

            function joinToAllianceBtn(size) {
                var btn = buttonsView();
                btn.ConstructorSizeBtn(size, true, "Join", actionJoinToAlliance, { request: request });
                //reqBtns[2].CssClass += " red";
                return btn;
            }

            function getRequestBtns() {
                var armStatus = GameServices.allianceService.armAllianceAcceptedStatus;
                console.log("getOrCreateMyAllianceRequestBtns", { request: request, armStatus: armStatus });
                if (request.AllianceAccepted === armStatus.NoAction) {
                    if (!request.hasOwnProperty("ButtonsView") || request.ButtonsView.length !== 2) request.ButtonsView = [createMsgBtn(2), removeRequestBtn(2)];
                }
                else if (request.AllianceAccepted === armStatus.Accept) {
                    if (!request.hasOwnProperty("ButtonsView") || request.ButtonsView.length !== 3) request.ButtonsView = [createMsgBtn(3), removeRequestBtn(3), joinToAllianceBtn(3)];
                }
                else if (request.AllianceAccepted === armStatus.Reject) {
                    if (!request.hasOwnProperty("ButtonsView") || request.ButtonsView.length !== 1) request.ButtonsView = [removeRequestBtn(1)];
                }
                else throw new Error("paralaxButtonHelper.getRequestBtns no data");
                return request.ButtonsView;
            };
            return getRequestBtns();

        }
        // #endregion
    }
]);