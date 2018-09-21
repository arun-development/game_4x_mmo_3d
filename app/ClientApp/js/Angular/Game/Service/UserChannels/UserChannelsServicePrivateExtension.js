Utils.CoreApp.gameAppExtensions.UserChannelsPrivate = function (service) {

    service.getPriavateLeftRightCbName = function (nativeName, cbView) {
        if (cbView && cbView.$leftName) {
            return {
                leftName: cbView.$leftName,
                rightName: cbView.$rightName
            };
        }
        var names = _.split(nativeName, "<==>");
        var leftName = names[0].trim();
        var rightName = names[1].trim();
        if (cbView) {
            if (!cbView.$leftName || cbView.$leftName !== leftName) {
                cbView.$leftName = leftName;
            }

            if (!cbView.$rightName || cbView.$rightName !== rightName) {
                cbView.$rightName = rightName;
            }
        }

        return {
            leftName: leftName,
            rightName: rightName
        };
    };
    service.getPriavateCbHeadHtml = function (leftRight) {
        return "<div class=html-content>" + Utils.SetSpanText(leftRight.leftName) + Utils.SetSpanText(leftRight.rightName) + "</div>";
    };


    var lock = false;
    /**
     * 
     * @param {} channelItem 
     * @returns {} 
     */
    service.createPrivateChannelControls = function (channelItem) {
        return {
            buttons: [service.$btnHelper.ButtonsView().ConstructorSizeBtn(1, true, "Create private channel", function (params, $element, $attrs, $scope, $event) {
                if (lock) return;
                lock = true;

                function $destroy(ctrlScope) {
                    ctrlScope.$destroy();
                    lock = false;
                }

                service.$ucdH.$mdDialog.show({
                    templateUrl:"dialog-channel-private-create-channel.tmpl",
                    parent:angular.element(document.body),
                    targetEvent:$event,
                    clickOutsideToClose:false,
                    fullscreen:true,
                    controller:"dialogCreatePrivateChannelCtrl",
                    controllerAs:"dcpmCtrl"
                }).then($destroy, $destroy);
            })]
        };
    };
    /**
     * 
     * @param {} privateChannelOutDataModel 
     * @param {} $$RootScope 
     * @returns {} 
     */
    service.onPrivateChannelCreated = function (privateChannelOutDataModel, $$RootScope) {
        privateChannelOutDataModel.ComplexButtonView.IsNewItem = true;
        service.checkPrivateHead(privateChannelOutDataModel);
        service.addOrReplaceLocalChannelItem(privateChannelOutDataModel);  
    };
    /**
     * 
     * @param {} channelId 
     * @param {} channelType 
     * @param {} $event 
     * @returns {} 
     */
    service.deletePrivateChannel = function (channelId, channelType, $event) {
        if (lock) return;
        try {
            lock = true;
            var channel = service.getChannelByChannelType(channelType, channelId);
            var cr = service.$currentUserInfo;
            var cbV = channel.ComplexButtonView;
            var targetUserName = cbV.$rightName;
            if (channel.CreatorId !== cr.userId) targetUserName = cbV.$leftName;

            service.$ucdH.openDialogConfirmDeletePrivateChannel($event, targetUserName)
                .then(function () {
                    //confirm
                    service.$hub.userChannelsClosePrivateChannel(channelId, cr.userId)
                        .finally(function () {
                            lock = false;
                        })
                        .then(function (answer) {
                            service.deleteLocalChannelItem(channelType, channelId);
                        }, function (errorAnswer) {
                            var msg = Errors.GetHubMessage(errorAnswer);
                            throw Errors.ClientNotImplementedException({
                                errorAnswer: errorAnswer,
                                msg: msg
                            }, "userChannelsService.sendMessage");
                        });


                }, function () {
                    console.log("openDialogConfirmDeletePrivateChannel.cancel");
                    //cancel
                    lock = false;
                });

        }
        catch (e) {
            lock = false;
            throw Errors.ClientNotImplementedException({ channelId: channelId, channelType: channelType, $event: $event }, "throw.deletePrivateChannel", e);
        }


    };
    /**
     * 
     * @param {} channelItem 
     * @returns {} 
     */
    service.checkPrivateHead = function (channelItem) {
        if (channelItem.ChannelType === service.ChannelTypes.Private) {
            var cbData = channelItem.ComplexButtonView.Collection[1].Data;
            if (!cbData.$headNative) {
                var native = cbData.Head;
                var leftRight = service.getPriavateLeftRightCbName(native, channelItem.ComplexButtonView);
                cbData.Head = service.getPriavateCbHeadHtml(leftRight);
                cbData.$headNative = native;
            }
        }
    };
    /**
     * 
     * @param {} setToLower 
     * @returns {} 
     */
    service.getPrivateExistChannelNames = function (setToLower) {
        var col = service.Private.Collection;
        if (!col) return [];
        var names = [];
        _.forEach(col, function (item, channelId) {
            var lf = service.getPriavateLeftRightCbName(item.ChannelName, col.ComplexButtonView);
            names.push(lf.leftName, lf.rightName);
        });
        names = _.uniq(names);
        if (setToLower) {
            names = names.join("|").toLowerCase().split("|");
        }
        return names;
    };

};

