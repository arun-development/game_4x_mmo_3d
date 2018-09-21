Utils.CoreApp.gameAppExtensions.UserChannelsGroup = function (service) {
    var channelSerchContainer = {};
    var lock = false;

    function _filter(query, collection) {
        var _qwery = query.toLowerCase();
        return _.filter(collection, function (o) {
            return o.Name.toLowerCase().indexOf(_qwery) !== -1;
        });
    };

    function _filterByPublic(query, collection, isPuplic) {
        var _qwery = query.toLowerCase();
        return _.filter(collection, function (o) {
            return o.IsPublic === isPuplic && o.Name.toLowerCase().indexOf(_qwery) !== -1;
        });
    }


    function _filterByType(queryName, channelSerchTypes) {
        var local;
        if (queryName.length === 0) {
            local = channelSerchContainer;
        } else if (channelSerchTypes === service.ChannelSerchTypes.OnlyPublic) {
            local = _filterByPublic(queryName, channelSerchContainer, true);
        }
        else if (channelSerchTypes === service.ChannelSerchTypes.OnlyPrivate) {
            local = _filterByPublic(queryName, channelSerchContainer, false);
        }
        else {
            local = _filter(queryName, channelSerchContainer);
        }
        return local;
    }

    function _addSerchItems(collection) {
        _.forEach(collection, function (item, idxOrId) {
            service.addOrUpdateGroupSerchChannelItem(item.Id, item.Name, item.IsPublic);
        });
    }



    function _getUserChannel() {
        var crData = service.$currentUserInfo;
        var chats = service.getCollectionByChannelType(service.ChannelTypes.Group);
        if (!chats) return false;
        return _.find(chats, { CreatorId: crData.userId });

    };

    function _getGroupLimitModel() {
        var count = 0;
        var group = service.Group;
        if (group.Collection) {
            count = _.size(group.Collection);
        }
        return { count: count, max: group.MaxChannelsLimit };

    }

    service.getGroupLimitModel = _getGroupLimitModel;

    /**
     * 
     * @param {} channelItem 
     * @returns {} 
     */
    service.createGroupChannelControls = function (channelItem) {
        var createChannelBtn = service.$btnHelper.ButtonsView();
        createChannelBtn.ConstructorSizeBtn(3, true, "Create", function (params, $element, $attrs, $scope, $event) {
            if (lock) return;
            lock = true;

            var userChannel = _getUserChannel();
            if (userChannel) {
                service.$ucdH.openDialogUserHasChannel($event, userChannel.ChannelName)
                    .finally(function () {
                        lock = false;
                    });
            }
            else {
                var limit = _getGroupLimitModel();
                if (limit.count + 1 > limit.max) {
                    var translateTabName = service.getTabTranslateNameByChannelType(service.bodyIdx.Group);
                    service.$ucdH.openDialogChannelMaxLimit($event, translateTabName, limit.max).finally(function () {
                        lock = false;
                    });
                }
                else {
                    service.$ucdH.$mdDialog.show({
                        templateUrl: "dialog-channels-group-create-channel.tmpl",
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        clickOutsideToClose: false,
                        fullscreen: true,
                        controller: "dialogCreateGroupChannelCtrl",
                        controllerAs: "dcgmCtrl"

                    }).then(function (ctrlScope) {
                        //create(ed)   
                        ctrlScope.$destroy();
                        lock = false;

                    }, function (ctrlScope) {
                        //cancel
                        ctrlScope.$destroy();
                        lock = false;
                    });
                    console.log("createGroupChannelControls.click", {
                        params: params,
                        $scope: $scope,
                        channelItem: channelItem
                    });
                }



            }
        });

        var joinToChannelBtn = service.$btnHelper.ButtonsView();
        joinToChannelBtn.ConstructorSizeBtn(3, true, "Join", function (params, $element, $attrs, $scope, $event) {
            if (lock) return;
            lock = true;
            var limit = _getGroupLimitModel();
            if (limit.count + 1 > limit.max) {
                var translateTabName = service.getTabTranslateNameByChannelType(service.bodyIdx.Group);
                service.$ucdH.openDialogChannelMaxLimit($event, translateTabName, limit.max).finally(function () {
                    lock = false;
                });
            }
            else {
                service.$ucdH.$mdDialog.show({
                    templateUrl: "dialog-channels-group-join.tmpl",
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    fullscreen: true,
                    controller: "dialogChannelsGroupJoinToChannel",
                    controllerAs: "jCtrl"

                }).then(function (ctrlScope) {
                    //create
                    ctrlScope.$destroy();
                    lock = false;
                }, function (ctrlScope) {
                    //cancel
                    lock = false;
                    ctrlScope.$destroy();
                });
            }


        });
        var deepDeleteBtn = service.$btnHelper.ButtonsView();
        deepDeleteBtn.ConstructorSizeBtn(3, true, "Delete all", function (params, $element, $attrs, $scope, $event) {
            if (lock) return;
            lock = true;
            service.$ucdH.openDialogDeepDeleteOtherGroupChannels($event)
                .then(function () {
                    //confirm
                    service.$hub.userChannelsDeepDeleteOtherGroupChannels()
                        .then(function (answer) {
                            var userChannel = _getUserChannel();
                            if (userChannel) {
                                _.forEach(service.Group.Collection, function (channel, channelId) {
                                    if (channel.ChannelId !== userChannel.ChannelId) {
                                        delete service.Group.Collection[channelId];
                                    }
                                });
                            }
                            else {
                                _.forEach(service.Group.Collection, function (channel, channelId) {
                                    delete service.Group.Collection[channelId];
                                });
                            }
                            lock = false;

                        }, function (errorAnswer) {
                            var msg = Errors.GetHubMessage(errorAnswer);
                            console.log("userChannelsService.groupSerchChannelItemsFilterAsync", {
                                errorAnswer: errorAnswer,
                                msg: msg
                            });
                            lock = false;
                        });


                }, function () {
                    //cancel
                    lock = false;
                });
        });
        return {
            buttons: [createChannelBtn, joinToChannelBtn, deepDeleteBtn]
        }

    };
    /**
     * 
     * @returns {} 
     */
    service.getSerchTypesView = function () {

        var all = Utils.ModelFactory.INameIdModel(service.ChannelSerchTypes.All);
        all.Translate = Utils.CreateLangSimple("All", "Todas", "Все");
        all.Name = all.Translate.getCurrent();

        var onlyPublic = Utils.ModelFactory.INameIdModel(service.ChannelSerchTypes.OnlyPublic);
        onlyPublic.Translate = Utils.CreateLangSimple("Public", "Abierto", "Открытые");
        onlyPublic.Name = onlyPublic.Translate.getCurrent();

        var onlyPrivate = Utils.ModelFactory.INameIdModel(service.ChannelSerchTypes.OnlyPrivate);
        onlyPrivate.Translate = Utils.CreateLangSimple("Protected", "Protegido", "Защищенныe");
        onlyPrivate.Name = onlyPrivate.Translate.getCurrent();


        return [all, onlyPublic, onlyPrivate];
    };

    /**
     * 
     * @param {} channelId 
     * @returns {} 
     */
    service.removeGroupSerchChannelItem = function (channelId) {
        if (channelSerchContainer[channelId]) {
            delete channelSerchContainer[channelId];
        }
    };
    /**
     * 
     * @param {} channelId 
     * @param {} channelName 
     * @param {} isPublic 
     * @returns {} 
     */
    service.addOrUpdateGroupSerchChannelItem = function (channelId, channelName, isPublic) {
        channelSerchContainer[channelId] = Utils.ModelFactory.IChannelSerchItem(channelId, channelName, isPublic);
    };



    /**
     * 
     * @returns {} 
     */
    service.getGroupExistChannelNames = function () {
        var col = service.Group.Collection;
        if (!col) return [];
        return _.map(col, function (o) {
            return o.ChannelName.toLowerCase();
        });
    };
    /**
     * 
     * @param {} collection 
     * @param {} ignoreChannelNames 
     * @returns {} 
     */
    service.filterGroupByIgnoreNames = function (collection, ignoreChannelNames) {
        if (!ignoreChannelNames || !ignoreChannelNames.length) {
            return collection;
        }
        return _.filter(collection, function (o) {
            var name = o.Name.toLowerCase();
            var ignore = _.includes(ignoreChannelNames, name);
            return !ignore;
        });
    };

    /**
     * 
     * @param {} newGroupChannelOut 
     * @returns {} 
     */
    service.addOrReplaceGroupChannelLocal = function (newGroupChannelOut) {
        newGroupChannelOut.ComplexButtonView.IsNewItem = true;
        service.addOrUpdateGroupSerchChannelItem(newGroupChannelOut.ChannelId, newGroupChannelOut.ChannelName, newGroupChannelOut.IsPublic);
        service.addOrReplaceLocalChannelItem(newGroupChannelOut);
    };

    var serchInProgress = false;
    /**
     * 
     * @param {} queryName 
     * @param {} channelSerchTypes 
     * @returns {} 
     */
    service.groupSerchChannelItemsFilterAsync = function (queryName, channelSerchTypes, ignoreLocal) {
        queryName = queryName.trim();
        var deferred = service.$q.defer();
        if (serchInProgress) {
            deferred.resolve([]);
            return deferred.promise;
        }

        var local;
        if (!ignoreLocal) {
            local = _filterByType(queryName, channelSerchTypes);
            if (local.length !== 0) {
                deferred.resolve({ items: local ,fromLocal:true});
                return deferred.promise;
            }

        }

        serchInProgress = true;
        service.$hub.userChannelsSerchGroupChannelNames(queryName)
            .finally(function () {
                serchInProgress = false;
            }).then(function (answer) {
                console.log("groupSerchChannelItemsFilterAsync.answer", {
                    answer: answer
                });
                _addSerchItems(answer);
                local = _filterByType(queryName, channelSerchTypes);
                deferred.resolve({ items: local, fromLocal: false });

            }, function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                deferred.reject(errorAnswer, msg);
                console.log("userChannelsService.groupSerchChannelItemsFilterAsync", {
                    queryName: queryName,
                    errorAnswer: errorAnswer,
                    msg: msg
                });
            });
        return deferred.promise;

    };
    /**
     * 
     * @param {} iChannelDataModel 
     * @param {} onDone 
     * @param {} onError 
     * @returns {} 
     */
    service.createGroupChannel = function (iChannelDataModel, onDone, onError) {
        service.$hub.userChannelsCreateGroupChannel(iChannelDataModel)
            .then(function (newGroupChannelOut) {
                service.addOrReplaceGroupChannelLocal(newGroupChannelOut);
                if (onDone instanceof Function) onDone();
            }, onError);
    };


    /**
     * 
     * @param {} channelId 
     * @param {} $event 
     * @param {} onFinally 
     * @returns {} 
     */
    service.$deleteGroupChannelByOwner = function (channelId, $event, onFinally) {
        service.$hub
            .userChannelsDeleteGroupChannelByOwner(channelId)
            .then(function (answer) {
                onFinally();
                service.deleteGroupChannelFromLoclal(channelId, true);

            }, function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                if (msg === ErrorMsg.NotPermitted) {
                    service.$ucdH.openDialogNotPermitted($event).finally(onFinally);
                }
                else {
                    onFinally();
                    throw Errors.ClientNotEqualException({
                        errorAnswer: errorAnswer,
                        msg: msg
                    });
                }
            });
    };
    /**
     * 
     * @param {} channelId 
     * @param {} removeMeta 
     * @returns {} 
     */
    service.deleteGroupChannelFromLoclal = function (channelId, removeMeta) {
        if (removeMeta) {
            service.removeGroupSerchChannelItem(channelId);
        }

        service.deleteLocalChannelItem(service.ChannelTypes.Group, channelId);
    };

    /**
     * 
     * @param {} channelId 
     * @param {} channelName 
     * @param {} $event 
     * @returns {} 
     */
    service.unsubscribeFromGroupChannel = function (channelId, channelName, $event) {
        if (lock) return;
        lock = true;
        console.log("confunsubscribeFromGroupChannelirm", {
            channelId: channelId,
            channelName: channelName,
            $event: $event
        });
        service.$ucdH.openDialogUnsubscribeFromGroupChannel($event, channelName).then(function () {
            //confirm                       
            service.$hub.userChannelsUnsubscribeUserFromGroupChannel(channelId)
                .then(function (answer) {
                    service.deleteGroupChannelFromLoclal(channelId, false);
                    lock = false;
                }, function (errorAnswer) {
                    var msg = Errors.GetHubMessage(errorAnswer);
                    if (msg === ErrorMsg.IsEmpty) {
                        service.deleteGroupChannelFromLoclal(channelId, false);
                        lock = false;
                    }
                    else {
                        lock = false;
                        throw Errors.ClientNotImplementedException({
                            errorAnswer: errorAnswer,
                            msg: msg,
                            channelId: channelId,
                            channelName: channelName,
                            channel: service.Group.Collection[channelId]
                        });
                    }
                });




        }, function () {
            //cancel
            console.log("cancel");
            lock = false;
        });

    };


    service.addOrUpdateGroupUserToLocalAdminUsers = function (iChannelConnectionUserOut) {
        var channel = service.getChannelByChannelType(iChannelConnectionUserOut.ChannelType, iChannelConnectionUserOut.ChannelId);
        if (channel) {
            if (!channel.Users) {
                channel.Users = {};
            }
            channel.Users[iChannelConnectionUserOut.Id] = iChannelConnectionUserOut;
            return channel;
        }
    };
    service.deleteGroupUserFromLocalAdminUsers = function (iChannelConnectionUserOut) {
        var channel = service.getChannelByChannelType(iChannelConnectionUserOut.ChannelType, iChannelConnectionUserOut.ChannelId);
        if (channel && channel.Users && channel.Users[iChannelConnectionUserOut.Id]) {
            delete channel.Users[iChannelConnectionUserOut.Id];
        }
        return channel;

    };
    service.setIncorrectPwToToLocalAdminUsers = function (channelId) {
        var channel = service.getChannelByChannelType(service.ChannelTypes.Group, channelId);
        if (channel && channel.Users) {
            _.forEach(channel.Users, function (o) {
                o.HasCorrectPassword = false;
            });
        }
    };

    /**
     * 
     * @param {} channelAdminUsrId 
     * @param {} channelConnectionDataModel 
     * @param {} $$RootScope 
     * @returns {} 
     */
    service.onGroupUserUnsubscribe = function (channelAdminUserId, iChannelConnectionUserOut, $$RootScope) {
        if (channelAdminUserId === service.$currentUserInfo.userId) {
            console.log("onGroupUserUnsubscribe", {
                channelAdminUserId: channelAdminUserId,
                iChannelConnectionUserOut: iChannelConnectionUserOut,
                $$RootScope: $$RootScope,
            });
            var channel = service.deleteGroupUserFromLocalAdminUsers(iChannelConnectionUserOut);
            if (channel) {
                $$RootScope.$broadcast("user-channels-group-:user-unsubscribe", {
                    // is not userId    is ChannelConnection.Id
                    ChannelConnectionUserOut: iChannelConnectionUserOut,
                    channel: channel
                });
            }

        }

        //todo code heare
    };

    /**
     * 
     * @param {} channelAdminUserId 
     * @param {} iChannelConnectionUserOut 
     * @param {} $$RootScope 
     * @returns {} 
     */
    service.onGroupUserSubscribe = function (channelAdminUserId, iChannelConnectionUserOut, $$RootScope) {
        if (channelAdminUserId === service.$currentUserInfo.userId) {
            var channel = service.addOrUpdateGroupUserToLocalAdminUsers(iChannelConnectionUserOut);
            if (channel) {
                $$RootScope.$broadcast("user-channels-group-:user-subscribe", {
                    // is not userId    is ChannelConnection.Id
                    ChannelConnectionUserOutId: iChannelConnectionUserOut.Id,
                    channel: channel
                });
            }
        }
    };


    service.onCrUserGroupUpdatedPermition = function (iChannelConnectionUserOutCurrentUserDataModel, $$RootScope) {  
        var data = iChannelConnectionUserOutCurrentUserDataModel;
        if (service.$currentUserInfo.userId !== data.UserId) return;
        var channel = service.getChannelByChannelType(data.ChannelType, data.ChannelId);
        if (channel) {
            channel.MessageSend = data.MessageSend;
            $$RootScope.$broadcast("channelItem:update-permition", {
                channel: channel
            });
        }
    };

    service.onGroupIconUploaded = function (newIconUrl, channelId, $$RootScope) {
        var channel = service.getChannelByChannelType(service.ChannelTypes.Group, channelId);
        if (channel) {
            var cb = service.getCbButtonByIdx(0, channel);
            if (cb && cb.Data) {
                cb.Data.ImagePathOrCss = newIconUrl;
                $$RootScope.$broadcast("user-channels-group-:channel-icon-updated", {
                    channel: channel
                });
            }            

        }   

    };

};