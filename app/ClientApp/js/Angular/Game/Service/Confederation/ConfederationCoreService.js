Utils.CoreApp.gameApp.service("confederationService", [
    "planshetService",
    "confederationDialogHelper",
    "paralaxButtonHelper" ,
    "compileHelper",
    function (planshetService, $cdH, $btnHelper,compileHelper) {
        var $self = this;
        this.$planshetIndex = null;
        this.$cdH = $cdH;
        this.$btnHelper = $btnHelper; 
        this.$compileHelper = compileHelper;
        Object.defineProperty($self, "_confederationId", {
            value: "confederation-collection",
            writable: false,
            configurable: false
        });
        Object.defineProperty($self, "_confederationModel", {
            get: function () {
                if (!$self.$planshetIndex) throw Errors.ClientNullReferenceException({ $self: $self }, "$self.$planshetIndex", "confederationService", ErrorMsg.NoData);
                var model = planshetService.$planshetModels[$self.$planshetIndex];
                if (model.UniqueId !== $self._confederationId) throw Errors.ClientNotImplementedException({ $self: $self }, "is not  confederation model");
                return model;
            },
            set: function (value) {
                planshetService.updatePlanshetItemData(value, true, Utils.Time.TIME_CACHE_CONFEDERATION);
                $self.$planshetIndex = planshetService.getModelIndex($self._confederationId);
            }
        });

        Object.defineProperty($self, "$hub", {
            get: function () {
                return GameServices.mainGameHubService;
            }
        });

        this.bodyIdx = {
            Officers: 0,
            Rating: 1,
            Election: 2
        };

        Object.freeze(this.bodyIdx);

        this.ConfederationTabNames = {
            Officers: "Officers",
            Rating: "Rating",
            Election: "Election"
        };
        Object.freeze(this.ConfederationTabNames);

        function IConfederationRef(name, idx) {
            this.NativeName = name;
            this.PlanshetIdx = idx;
            return this;
        }
        this.ConfederationRefs = {
            Officers: new IConfederationRef($self.ConfederationTabNames.Officers, $self.bodyIdx.Officers),
            Rating: new IConfederationRef($self.ConfederationTabNames.Rating, $self.bodyIdx.Rating),
            Election: new IConfederationRef($self.ConfederationTabNames.Election, $self.bodyIdx.Election),
        };

        _.forEach(this.ConfederationRefs, function (val, key) {
            Object.freeze($self.ConfederationRefs[key]);
        });
        Object.freeze($self.ConfederationRefs);

        function _createRefToData(iChannelRefItem) {
            Object.defineProperty($self, iChannelRefItem.NativeName, {
                get: function () {
                    return $self._confederationModel.Bodys[iChannelRefItem.PlanshetIdx].TemplateData;
                },
                set: function (value) {
                    $self._confederationModel.Bodys[iChannelRefItem.PlanshetIdx].TemplateData = value;
                }
            });
        }
        _createRefToData($self.ConfederationRefs.Officers);   
        _createRefToData($self.ConfederationRefs.Rating);
        _createRefToData($self.ConfederationRefs.Election);

        this.OfficerTypes = {
            President: 1,
            Atacker: 2,
            Protector: 3,
            Supporter: 4
        };
        Object.freeze(this.OfficerTypes);

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


        this._updatePlanshet = function (advancedAction, setToCurrent) {
            planshetService.updatePlanshet(advancedAction, $self._confederationId, setToCurrent);
        };

        this._toggle = function () {
            planshetService.toggle($self._userChannelsUniqueId);
        };

        this.leftNavGetConfederation = function (params, element, attrs, $scope, $event) {
            // грузим планшет  из левого меню
            $self.loadConfederationPlanshet();
        };

        this.loadConfederationPlanshet = function (updateFromServer) {
            if (updateFromServer || !$self._confederationModel) $self.getServerPlanshetData($self._toggle);
            else if (planshetService.isCurrentModel($self._confederationId)) $self._toggle();
            else $self._updatePlanshet($self._toggle, true);
        };


        this._setNewPlanshetData = function (newPlanshet, onDone) {
            $self._confederationModel = newPlanshet;
            if (onDone instanceof Function) onDone($self._confederationModel);
        }
        this.getServerPlanshetData = function (onDone, onError) {
            return $self.$hub.confederationGetPlanshet()
                .then(function (answer) {
                    console.log("_______UPDATE_confederation_FROM SERVER______");
                    $self._setNewPlanshetData(answer, onDone);
                }, function (errorAnswer) {
                    if (onError instanceof Function) onError(errorAnswer);
                    else {
                        var msg = Errors.GetHubMessage(errorAnswer);
                        throw Errors.ClientNotImplementedException({ errorAnswer: errorAnswer, msg: msg }, "confederationService.getServerPlanshetData");
                    }
                });
        };


        Utils.CoreApp.gameAppExtensions.ConfederationOfficers(this);
        Utils.CoreApp.gameAppExtensions.ConfederationRating(this);
        Utils.CoreApp.gameAppExtensions.ConfederationElection(this);

        /**
        * 
        * @param {} initData 
        * @returns {} 
        */
        this.setInitialConfederationsModel = function (initData) {
            $self._confederationModel = _.cloneDeep(initData[$self._confederationId]);
            $self.$checkAndRunOrDestroyVoteView($self.getElectionData());
        };


    }
]);