Utils.CoreApp.gameApp.service("userChannelsService", [
    "planshetService", "paralaxButtonHelper", "$q", "userChannelsDialogHelper", function (planshetService, $btnHelper, $q, $ucdH) {
        var $self = this;
        this.$planshetService = planshetService;
        Object.freeze(this.$planshetService);
        this.$btnHelper = $btnHelper;
        Object.freeze(this.$paralaxButtonHelper);


        Object.defineProperty($self, "_userChannelsUniqueId", {
            value: "user-channels-collection",
            writable: false,
            configurable: false
        });

        this.$planshetIndex = null;

        /**
        * 
        * @description Основной контейнер для Tabs message  экземпляр planshetModel        */

        Object.defineProperty($self, "_userChannelsModel", {
            get: function () {
                if (!$self.$planshetIndex) throw Errors.ClientNullReferenceException({ $self: $self }, "$self.$planshetIndex", "userChannelsService", ErrorMsg.NoData);
                var model = planshetService.$planshetModels[$self.$planshetIndex];
                if (model.UniqueId !== $self._userChannelsUniqueId) throw Errors.ClientNotImplementedException({ $self: $self }, "is not  message model");
                return model;
            },
            set: function (value) {
                planshetService.updatePlanshetItemData(value, true, Utils.Time.TIME_CACHE_USER_CHANNELS);
                $self.$planshetIndex = planshetService.getModelIndex($self._userChannelsUniqueId);
            }
        });

        this.$ucdH = $ucdH;
        this.$q = $q;
        this.ChannelTypes = {
            Private: 1,
            Group: 2,
            Alliance: 3
        };
        Object.freeze(this.ChannelTypes);
        this.ChannelSerchTypes = {
            All: 1,
            OnlyPublic: 2,
            OnlyPrivate: 3
        };
        Object.freeze(this.ChannelSerchTypes);
  
        this.cbIds = {
            Setting: 2,
            Messages: 1,
            Delete: 2
        };
        Object.freeze(this.cbIds);
        this.bodyIdx = {
            Private: $self.ChannelTypes.Private - 1,
            Group: $self.ChannelTypes.Group - 1,
            Alliance: $self.ChannelTypes.Alliance - 1
        };
        Object.freeze(this.bodyIdx);

        this.ChannelTypeNames = {
            Private: "Private",
            Group: "Group",
            Alliance: "Alliance"
        };
        Object.freeze(this.ChannelTypeNames);

        function IChannelRef(name, idx, typeId) {
            this.NativeName = name;
            this.PlanshetIdx = idx;
            this.ChannelType = typeId;
            return this;
        }

        this.ChannelRefs = {
            Private: new IChannelRef($self.ChannelTypeNames.Private, $self.bodyIdx.Private, $self.ChannelTypes.Private),
            Group: new IChannelRef($self.ChannelTypeNames.Group, $self.bodyIdx.Group, $self.ChannelTypes.Group),
            Alliance: new IChannelRef($self.ChannelTypeNames.Alliance, $self.bodyIdx.Alliance, $self.ChannelTypes.Alliance)
        };
        _.forEach(this.ChannelRefs, function (val, key) {
            Object.freeze($self.ChannelRefs[key]);
        });
        Object.freeze($self.ChannelRefs);


        /**
         * 
         * @param {} advancedAction 
         * @param {} setToCurrent 
         * @returns {} 
         */
        this._updatePlanshet = function (advancedAction, setToCurrent) {
            planshetService.updatePlanshet(advancedAction, $self._userChannelsUniqueId, setToCurrent);
        };

        this.leftNavGetUserChannels = function (params, element, attrs, $scope, $event) {
            // грузим планшет  из левого меню
            $self.loadUserChannelsPlanshet();
        };
 
        //$self.$hub
        Object.defineProperty($self, "$hub", {
            get: function () {
                return GameServices.mainGameHubService;
            }
        });

        /**
         * 
         * @param {} onDone 
         * @param {} onError 
         * @returns {} 
         */
        this.getServerPlanshetData = function (onDone, onError) {
            return $self.$hub.userChannelsGetPlanshet()
                .then(function (answer) {
                    console.log("_______UPDATE_userChannelsService_FROM SERVER______");
                    $self._setNewPlanshetData(answer, onDone);
                }, function (errorAnswer) {
                    if (onError instanceof Function) onError(errorAnswer);
                    else {
                        var msg = Errors.GetHubMessage(errorAnswer);
                        throw Errors.ClientNotImplementedException({ errorAnswer: errorAnswer, msg: msg }, "userChannelsService.getServerPlanshetData");
                    }
                });
        };
        this._toggle = function () {
            planshetService.toggle($self._userChannelsUniqueId);
        };
        /**
         * 
         * @param {} updateFromServer 
         * @returns {} 
         */
        this.loadUserChannelsPlanshet = function (updateFromServer) {
            if (updateFromServer || !$self._userChannelsModel) $self.getServerPlanshetData($self._toggle);
            else if (planshetService.isCurrentModel($self._userChannelsUniqueId)) $self._toggle();
            else $self._updatePlanshet($self._toggle, true);
        };

        this._getCollectionByIdx = function (idx) {
            return $self._userChannelsModel.Bodys[idx].TemplateData.Collection;
        };

        function _createRefToData(iChannelRefItem) {
            Object.defineProperty($self, iChannelRefItem.NativeName, {
                get: function () {
                    return $self._userChannelsModel.Bodys[iChannelRefItem.PlanshetIdx].TemplateData;
                },
                set: function (value) {
                    $self._userChannelsModel.Bodys[iChannelRefItem.PlanshetIdx].TemplateData = value;
                }
            });
        }
        _createRefToData($self.ChannelRefs.Private);
        _createRefToData($self.ChannelRefs.Group);
        _createRefToData($self.ChannelRefs.Alliance);

 

        /**
         * 
         * @param {} initData 
         * @returns {} 
         */
        this.setInitialUserChannelsModel = function (initData) {
            $self._userChannelsModel = _.cloneDeep(initData[$self._userChannelsUniqueId]);
        };
        /**
         * 
         * @param {} newPlanshet 
         * @param {} onDone 
         * @returns {} 
         */
        this._setNewPlanshetData = function (newPlanshet, onDone) {
            $self._userChannelsModel = newPlanshet;
            if (onDone instanceof Function) onDone($self._userChannelsModel);
        }
        /**
         * 
         * @param {} idx 
         * @param {} channelItem 
         * @returns {} 
         */
        this.getCbButtonByIdx = function (idx, channelItem) {
            if (!channelItem || !channelItem.ComplexButtonView) return null;
            return channelItem.ComplexButtonView.Collection[idx];
        };
        /**
         * 
         * @param {} channelItem 
         * @returns {} 
         */
        this.createBtnIds = function (channelItem) {
            if (!channelItem._btnIds) {
                function IBtnIds() {
                    this.SettingId = null;
                    this.MessagesId = null;
                    this.DeleteId = null;
                    var messagesBtn = $self.getCbButtonByIdx($self.cbIds.Messages, channelItem);
                    var rightBtn = $self.getCbButtonByIdx($self.cbIds.Setting, channelItem);
                    if (rightBtn) {
                        if (rightBtn.ItemId === "setting") {
                            this.SettingId = rightBtn.ItemId;
                        }
                        else if (rightBtn.ItemId === "delete") {
                            this.DeleteId = rightBtn.ItemId;
                        }
                    }
                    if (messagesBtn) this.MessagesId = messagesBtn.ItemId;

                    return this;
                }
                channelItem._btnIds = new IBtnIds();
            }
            return channelItem._btnIds;
        };
        /**
         * 
         * @param {} bodyIdx 
         * @returns {} 
         */
        this.getTabTranslateNameByChannelType = function (bodyIdx) {
            return $self._userChannelsModel.Buttons[bodyIdx].TranslateName;
 
        }

        Utils.CoreApp.gameAppExtensions.UserChannelsPrivate($self);
        Utils.CoreApp.gameAppExtensions.UserChannelsGroup($self);
        Utils.CoreApp.gameAppExtensions.UserChannelsAlliance($self);



        Object.defineProperty($self, "$currentUserInfo", {
            get: function () {
                //UserId: crData.userId,
                //UserName: crData.userName,
                //UserIcon: crData.userAvatar.Icon,
                //AllianceId: crData.AllianceId,
                //AllianceName: crData.allianceName,
                //AllianceRoleId: crData.allianceRoleId,
                return GameServices.allianceService.$currentUserInfo;

            }
        });
        /**
         * 
         * @param {} intChannelType 
         * @returns {} 
         */
        this.getTabDataByChannelType = function (intChannelType) {
            var channelNativeName = "";
            if (intChannelType === $self.ChannelTypes.Private) {
                channelNativeName = $self.ChannelTypeNames.Private;
            }
            else if (intChannelType === $self.ChannelTypes.Group) {
                channelNativeName = $self.ChannelTypeNames.Group;
            }
            else if (intChannelType === $self.ChannelTypes.Alliance) {
                channelNativeName = $self.ChannelTypeNames.Alliance;
            }
            else throw Errors.ClientNotImplementedException({ intChannelType: intChannelType }, "userChannelsService.getTabDataByChannelType ChannelTypeNotExist");
            return $self[channelNativeName];
        };
        /**
         * 
         * @param {} intChannelType 
         * @returns {} 
         */
        this.getCollectionByChannelType = function(intChannelType) {
            var data = $self.getTabDataByChannelType(intChannelType);
            if(data&&data.Collection) {
                return data.Collection;
            }
            return null;
        };
        /**
         * 
         * @param {} intChannelType 
         * @param {} channelId 
         * @returns {} 
         */
        this.getChannelByChannelType = function (intChannelType, channelId) {
            var collection = $self.getCollectionByChannelType(intChannelType);
            if (!collection) throw Errors.ClientNotImplementedException({ collection: collection }, "userChannelsService.getChannelByChannelType channelCollection not exist");
            return collection[channelId];

        };
        /**
          * 
          * @param {} newChannelOutDataModel 
          * @returns {} 
          */
        this.addOrReplaceLocalChannelItem = function(newChannelOutDataModel) {
            var channelId = newChannelOutDataModel.ChannelId;
            var channelType = newChannelOutDataModel.ChannelType;
            var collection = $self.getCollectionByChannelType(channelType);
            if(collection) {
                collection[channelId] = newChannelOutDataModel;
            }
        };
        /**
         * 
         * @param {} intChannelType 
         * @param {} channelId 
         * @returns {} 
         */
        this.deleteLocalChannelItem = function(intChannelType, channelId) {
            var collection = $self.getCollectionByChannelType(intChannelType);
            if(collection&&collection[channelId]) {
                delete collection[channelId];
            }
        };
        /**
          * 
          * @param {} newMessage 
          * @param {} intChannelType 
          * @returns {} 
          */
        this.addMessageToLocal = function(newMessage, intChannelType) {
            var channel = $self.getChannelByChannelType(intChannelType, newMessage.ChannelId);
            if(channel) channel.Messages[newMessage.Id] = newMessage;
            else {
                console.log("GroupAddMessageToLocal channel not exist need create channel", {newMessage:newMessage, intChannelType:intChannelType, $self:$self});
            };
            return channel;

        };
        /**
         * 
         * @param {} params 
         * @param {} $event 
         * @returns {} 
         */
        this.sendMessage = function(params, $event) {
            var crData = $self.$currentUserInfo;
            var data = Utils.ModelFactory.IChannelMessageTransfer();
            data.Message = params.text;
            data.UserIcon = crData.userAvatar.Icon;
            data.ChannelId = params.ChannelId;
            data.ChannelType = params.ChannelType;

            var deferred = $q.defer();
            deferred.promise
                .finally(function() {
                    if(params.onFinally instanceof Function) params.onFinally();
                }).then(function(answer) {
                    if(params.onSuccess instanceof Function) params.onSuccess(answer);
                }, function(errorAnswer) {
                    var msg = Errors.GetHubMessage(errorAnswer);
                    if(params.onError instanceof Function) params.onError(msg);
                    throw Errors.ClientNotImplementedException({params:params, errorAnswer:errorAnswer, msg:msg}, "userChannelsService.sendMessage");
                });
            var hubPromise = $self.$hub.userChannelsSendMessage(data);
            hubPromise.then(function(answer) {
                return deferred.resolve(answer);

            }, function(errorAnswer) {
                return deferred.reject(errorAnswer);
            });
        };

        /**
         * 
         * @param {} iMessageTransferDataModel 
         * @param {} $$RootScope 
         * @returns {} 
         */
        this.onMessageSended = function (iMessageTransferDataModel, $$RootScope) {
            console.log("userChannelsService.onMessageSended.before", {
                iMessageTransferDataModel: iMessageTransferDataModel,
                $self: $self
            });
            try {
                var channel = $self.addMessageToLocal(iMessageTransferDataModel, iMessageTransferDataModel.ChannelType);
                if (!channel) {
                    throw Errors.ClientNullReferenceException({ iMessageTransferDataModel: iMessageTransferDataModel }, "channel", "userChannelsService.onMessageSended", ErrorMsg.NoData);
                }
                $$RootScope.$broadcast("channelItem:add-message", { newChannel: channel, newMessageData: iMessageTransferDataModel });

            }
            catch (e) {
                throw Errors.ClientNotImplementedException({ iMessageTransferDataModel: iMessageTransferDataModel }, "userChannelsService.onMessageSended", e);
            }

        };
        /**
         * 
         * @param {} channelId 
         * @param {} intChannelType 
         * @param {} onDone 
         * @param {} onError 
         * @returns {} 
         */
        this.getNextMessagesPage = function (channelId, intChannelType, onDone, onError) {
            function _onError(errorAnswer, data) {
                var msg = Errors.GetHubMessage(errorAnswer);
                var errorData = {
                    _data: data,
                    channelId: channelId,
                    intChannelType: intChannelType,
                    msg: msg,
                    errorAnswer: errorAnswer,
                    onDone: onDone
                };
                onError(errorAnswer, msg, errorData);
                throw Errors.ClientNotImplementedException(errorData, "userChannelsService.getNextMessagesPage");
            }
            var channel = $self.getChannelByChannelType(intChannelType, channelId);
            if (!channel || !channel.Messages) {
                onError(ErrorMsg.ChannelNotExist, { $self: $self, channel: channel });
                return;
            }

            var skip = _.size(channel.Messages);
            $self.$hub.userChannelsGetNextMessagesPage(channelId, intChannelType, skip)
                 .then(function (answer) {    
                     _.extend(channel.Messages, answer);   
                     onDone(answer, channel);
                 }, _onError);
        };

        //#endregion
    }
]);