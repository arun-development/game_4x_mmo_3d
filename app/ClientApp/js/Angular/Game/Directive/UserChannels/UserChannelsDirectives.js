(function (app) {
    app.directive("channelItem", [
"$rootScope", "userChannelsService", function ($rootScope, $ucs) {
    function _updateBtnIds(channel, ctrl) {
        if (!channel._btnIds) ctrl.btnIds = $ucs.createBtnIds(channel);
        if (!ctrl.btnIds) {
            ctrl.btnIds = channel._btnIds;
        }

    }

    return {
        restrict: "E",
        templateUrl: "channel-item.tmpl",
        replace: true,
        scope: {
            channel: "="
        },
        controller: [
            "$scope", function ($scope) {
                var $self = this;
                _updateBtnIds($scope.channel, $self);
                $ucs.checkPrivateHead($scope.channel);
                var maxMessagesInChannel = $scope.channel.PerPage;
                this.scrollEventName = "channelItem:get-next-page:filtered-" + $scope.channel.ChannelId;



                var isInit = true;
                this.scrollDataInProgress = false;
                this.loadNextPage = function (e) {
                    if (this.scrollDataInProgress) return;
                    if (isInit) {
                        this.messages = _.take(_.orderBy(_.toArray($scope.channel.Messages), ["Id"], ["desc"]), maxMessagesInChannel);
                        var size = _.size($scope.channel.Messages);
                        if (size < maxMessagesInChannel) {
                            $scope.channel.$totalMessagesCount = size;
                        }
                        isInit = false;
                        return;
                    }
                    if ($scope.channel.$totalMessagesCount && this.messages.length === $scope.channel.$totalMessagesCount) return;

                    this.scrollDataInProgress = true;
                    var arr = _.orderBy(_.toArray($scope.channel.Messages), ["Id"], ["desc"]);
                    var startCount = this.messages.length;
                    if (!startCount) {
                        this.scrollDataInProgress = false;
                        return;
                    }
                    if (!arr[startCount]) {
                        //server request
                        //console.log("server request");
                        $ucs.getNextMessagesPage($scope.channel.ChannelId, $scope.channel.ChannelType, function (newMessages, updatedChannel) {
                            var newSize = _.size(newMessages);
                            if (newSize === 0) {
                                $scope.channel.$totalMessagesCount = _.size($scope.channel.Messages);
                            }
                            else {

                                var arrMessages = _.orderBy(_.toArray(newMessages), ["Id"], ["desc"]);
                                //console.log("$scope.getNextPage", {
                                //    newMessages: _.cloneDeep(newMessages),
                                //    updatedChannel: _.cloneDeep(updatedChannel),
                                //    "$scope.messages": _.cloneDeep($scope.messages),
                                //    arrMessages: _.cloneDeep(arrMessages)
                                //});


                                _.forEach(arrMessages, function (val, key) {
                                    $self.messages.push(val);
                                });
                                if (arrMessages.length < maxMessagesInChannel) {
                                    $scope.channel.$totalMessagesCount = _.size($scope.channel.Messages);
                                }

                            }
                            $self.scrollDataInProgress = false;


                        }, function () {
                            $self.scrollDataInProgress = false;
                        });

                        return;
                    }
                    else {
                        //update from local   
                        var end = startCount + maxMessagesInChannel - 1;
                        if (end > arr.length - 1) end = arr.length - 1;
                        for (var i = startCount; i <= end; i++) {
                            $self.messages.push(arr[i]);
                        }
                        $self.scrollDataInProgress = false;
                        return;
                    }


                };
                this.channelTypes = $ucs.ChannelTypes;
                $scope.$on("channelItem:add-message", function (e, data) {
                    if (e.defaultPrevented) return;
                    if (data.newChannel.ChannelId === $scope.channel.ChannelId) {
                        if (e.stopPropagation) e.stopPropagation();
                        else e.preventDefault();
                        _updateBtnIds($scope.channel, $self);
                        var newMessage = data.newMessageData;
                        $self.messages.unshift(newMessage);

                        //  $scope.$broadcast($scope.scrollEventName);
                        $scope.$broadcast("dropElementContainer:changeComplexHeight", {
                            dropItemSelectior: $self.btnIds.MessagesId
                        });

                    }
                });

                $scope.$on("channelItem:update-permition", function (e, data) {
                    if (e.defaultPrevented) return;
                    if (data.channel.ChannelId === $scope.channel.ChannelId) {
                        if (e.stopPropagation) e.stopPropagation();
                        else e.preventDefault();
                        $scope.$broadcast("dropElementContainer:changeComplexHeight", {
                            dropItemSelectior: $self.btnIds.MessagesId
                        });


                    }
                });

            }
        ],
        controllerAs: "channelCtrl"
    };
}
    ]);
    app.directive("channelControlMenu", [function () {
        return {
            restrict: "E",
            templateUrl: "channel-control-menu.tmpl",
            replace: true,
            scope: {
                channelControls: "="
            }
        };
    }
    ]);

    app.directive("channelMessageForm", [
        "userChannelsService", "allianceService", function ($ucs, $as) {
            return {
                restrict: "E",
                templateUrl: "channel-message-form.tmpl",
                replace: true,
                scope: {
                    btnSendMessage: "="
                },
                controller: ["$scope", function ($scope) {
                    var $self = this;
                    this.mesageModel = {
                        maxLength: $scope.btnSendMessage.Params.MessageMaxLength
                    };
                    this.mesageModel.text = "";

                    this._inProgress = false;
                    this.onChange = function (model) {
                        if (model.text && model.text.length > model.maxLength) model.text = model.text.substring(0, model.maxLength);

                    }
                    this.sendMessage = function (params, $element, $attrs, sourceScope, $event) {
                        if ($self._inProgress) return;
                        $self.mesageModel.text = $self.mesageModel.text.trim();
                        if ($self.mesageModel.text.length === 0) return;
                        params.text = $self.mesageModel.text;
                        params.onFinally = function () {
                            $self._inProgress = false;
                        };
                        params.onError = function (errorMessage) {
                            console.log("userChannelsService.errorMessage", {
                                errorMessage: errorMessage,
                                $event: $event
                            });
                        };
                        params.onSuccess = function () {
                            $self.mesageModel.text = "";
                        };
                        $ucs.sendMessage(params, $event);
                        return;
                    };

                    $scope.btnSendMessage.Method = this.sendMessage;

                }],
                controllerAs: "mFormCtrl"
            };
        }
    ]);

    app.directive("channelPrivateCreateForm", [
        "userChannelsService", function ($ucs) {
            return {
                restrict: "E",
                templateUrl: "channel-private-create-form.tmpl",
                replace: true,
                controller: ["$scope", function ($scope) {
                    $scope.buttons = $ucs.createPrivateChannelControls();
                }]
            };
        }
    ]);

    app.directive("channelMessageItem", ["$filter", "$q", function ($filter, $q) {
        return {
            restrict: "E",
            templateUrl: "channel-message-item.tmpl",
            replace: true,
            scope: {
                message: "="
            },
            controller: ["$scope", function ($scope) {
                var $self = this;
                //console.log("channelMessageItem.$scope", { $scope: $scope });
                if (!$scope.message.$dateCreate) {
                    var date = Utils.Time.GetUtcDateTimeFromSecondUtc($scope.message.DateCreate);
                    $scope.message.$dateCreate = $filter("date")(date, "dd.MM.yyyy HH:mm") + " (server time)";
                    //   console.log("channelMessageItem", { date: date, "$scope.message": $scope.message, $scope });
                }


                if ($scope.message.$isCurrentUser === undefined) {
                    var crUserId = GameServices.profileService.getCurrentUserId();
                    $scope.message.$isCurrentUser = crUserId === $scope.message.UserId;
                    $scope.message.$avatarCss = $scope.message.$isCurrentUser ? "message-avatar_left" : "message-avatar_right";
                }


                this.messageText = $scope.message.Message;
                this.setTranslate = function (translatedText) {
                    $self.messageText = translatedText;
                }

                this.setting = {
                    show: false,
                    btnCloseCss: "fa-times-circle-o",
                    btnOpenCss: "fa-bars",
                    toggle: function (show) {
                        this.show = !show;
                        this.btnCss = this.show ? this.btnCloseCss : this.btnOpenCss;
                        if (!this.show) {
                            $self.setTranslate($scope.message.Message);
                        }
                    },
                    btnCss: ""
                };
                this.setting.btnCss = this.setting.btnOpenCss;
                this.getUserInfo = function () {
                    GameServices.profileService.setProfile($scope.message.UserId);
                };


            }],
            controllerAs: "chmiCtrl"
        }
    }
    ]);

    app.directive("channelGroupSetting", ["userChannelsService", function ($ucs) {
        var $btnHelper = $ucs.$btnHelper;
        var lock = false;
        return {
            restrict: "E",
            replace: true,
            templateUrl: "channel-group-setting.tmpl",
            scope: {
                channel: "="
            },
            controller: ["$scope", "minLenghtConsts", function ($scope, $minLenght) {
                if ($ucs.$currentUserInfo.userId !== $scope.channel.CreatorId) {
                    $scope.$destroy();
                }
                var $self = this;
                var _scrollDataInProgress = false;
                var _scrollDataUpdateInProgress = false;
                var $sorrceUsers = _.orderBy(_.map($scope.channel.Users, function (o) {
                    return o;
                }), ["Name"], ["asc"]);
                this.users = [];
                var delaydActions = [];
                function _update() {
                    if (!_scrollDataInProgress) _scrollDataInProgress = true;
                    if (_scrollDataUpdateInProgress) return;
                    _scrollDataUpdateInProgress = true;
                    $sorrceUsers = _.orderBy(_.map($scope.channel.Users, function (o) {
                        return o;
                    }), ["Name"], ["asc"]);
                    $self.$max = $sorrceUsers.length;
                    $self.hasUsers = $sorrceUsers.length > 0;
                    var existCount = $self.users.length;
                    $self.users = _.take($sorrceUsers, existCount);
                    _scrollDataInProgress = false;
                    _scrollDataUpdateInProgress = false;
                    if (delaydActions.length) {
                        while (delaydActions.length) {
                            delaydActions.shift()();
                        }
                    }
                }

                this.Buttons = {
                    updatePassword: $btnHelper.ButtonsView().ConstructorSizeBtn(3, true, "updatePassword", function (params, $element, $attrs, btnScope, $event) {
                        if (lock) return;
                        lock = true;
                        $ucs.$ucdH.$mdDialog.show({
                            templateUrl: "dialog-channels-group-update-password.tmpl",
                            parent: angular.element(document.body),
                            targetEvent: $event,
                            clickOutsideToClose: false,
                            fullscreen: false,
                            _locals: {
                                channel: $scope.channel
                            },
                            bindToController: true,
                            controller: "dialogChannelsGroupUpdatePasswordCtrl",
                            controllerAs: "pCtrl"
                        }).then(function (ctrlScope) {
                            //confirm       
                            ctrlScope.$destroy();
                            _update();
                            lock = false;
                        }, function (ctrlScope) {
                            //cancel
                            ctrlScope.$destroy();
                            //console.log("updatePassword.cancel", {
                            //    $scope: $scope,
                            //    btnScope: btnScope
                            //});
                            lock = false;
                        });
                    }),
                    updateIcon: $btnHelper.ButtonsView().ConstructorSizeBtn(3, true, "updateIcon", function (params, $element, $attrs, btnScope, $event) {
                        if (lock) return;
                        lock = true;
                        $ucs.$ucdH.$mdDialog.show({
                            parent: angular.element(document.body),
                            _locals: {
                                _request: function (newBase64SourceImageModel) {
                                    return $ucs.$hub.userChannelsGroupUploadIcon(newBase64SourceImageModel, $scope.channel.ChannelId);
                                },
                                _onError: function (errorAnswer) {
                                    var msg = Errors.GetHubMessage(errorAnswer);
                                    if (msg === ErrorMsg.NotPermitted) {
                                        $ucs.$ucdH.openDialogNotPermitted($event).finally(function () {
                                            lock = false;
                                        });
                                    }
                                    else {
                                        lock = false;
                                        throw Errors.ClientNotEqualException({
                                            errorAnswer: errorAnswer,
                                            msg: msg
                                        });
                                    }


                                },
                                _imageSize: 90,
                                _cssDialogContainer: "delete_after_test_cssDialogContainer"
                            },
                            targetEvent: $event,
                            clickOutsideToClose: true,
                            fullscreen: false,
                            controller: "uploadImageCtrl",
                            bindToController: true,
                            templateUrl: "dialog-upload-user-image.tmpl",
                            controllerAs: "uploadImageCtrl"
                        })
                         .then(function (ok) {
                             //console.log("ok", { ok: ok });
                             //confirm
                             lock = false;

                         }, function () {
                             //cancel

                             lock = false;
                         });
                    }),

                    deleteChannel: $btnHelper.ButtonsView().ConstructorSizeBtn(3, true, "deleteChannel", function (params, $element, $attrs, btnScope, $event) {
                        if (lock) return;
                        lock = true;
                        $ucs.$ucdH.openDialogConfirmDeleteGroupChannel($event, $scope.channel.ChannelName)
                            .then(function () {
                                //confirm
                                $ucs.$deleteGroupChannelByOwner($scope.channel.ChannelId, $event, function () {
                                    lock = false;
                                });
                            }, function () {
                                //cancel          
                                lock = false;
                            });
                    })
                };



                this.hasUsers = $sorrceUsers.length > 0;
                this.$max = $sorrceUsers.length;
                var perPage = 3;




                this.css = {
                    read: "fa-eye",
                    notRead: "fa-eye-slash",
                    write: "fa-pencil-square-o",
                    password: "fa-key"
                };


                this.loadNextPage = function () {

                    if (_scrollDataInProgress) return;
                    if (_scrollDataUpdateInProgress) return;
                    if (!this.hasUsers || _scrollDataInProgress || this.users.length === this.$max) return;
                    _scrollDataInProgress = true;
                    var startIdx = this.users.length;
                    var endIdx = startIdx + perPage;
                    if (endIdx > $sorrceUsers.length - 1) endIdx = $sorrceUsers.length - 1;
                    for (var i = startIdx; i <= endIdx; i++) {
                        if (_scrollDataUpdateInProgress) return;
                        if ($sorrceUsers[i]) {
                            this.users.push($sorrceUsers[i]);
                        }
                    }
                    _scrollDataInProgress = false;

                    return;

                };




                $scope.$on("user-channels-group-:user-unsubscribe", function ($event, data) {
                    //todo  upadte users
                    if ($scope.channel.ChannelId === data.channel.ChannelId) {
                        var unsubscibedConUser = data.ChannelConnectionUserOut;
                        //console.log("channelGroupSetting.user-channels-group-:user-unsubscribe", {
                        //    $scope: $scope,
                        //    data: data,
                        //    unsubscibedConUser: unsubscibedConUser,
                        //});
                        _update();

                    }



                });
                $scope.$on("user-channels-group-:user-subscribe", function ($event, data) {
                    //todo  upadte users
                    // is not userId    is ChannelConnection.Id     
                    if ($scope.channel.ChannelId === data.channel.ChannelId) {
                        var subscibedConUserId = data.ChannelConnectionUserOutId;
                        var newUser = data.channel.Users[subscibedConUserId];
                        //console.log("channelGroupSetting.user-channels-group-:user-subscribe", {
                        //    $scope: $scope,
                        //    data: data,
                        //    newUser: newUser,
                        //});
                        _update();

                    }



                });



                //form region

                var updateInprogress = false;
                this.updateUser = function (user, $index, $event) {
                    if (updateInprogress) return;
                    if (_scrollDataUpdateInProgress) return;

                    function destroy(ctrlScope) {
                        ctrlScope.$destroy();
                        lock = false;
                    }


                    $ucs.$ucdH.$mdDialog.show({
                        templateUrl: "dialog-channels-group-update-user.tmpl",
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        clickOutsideToClose: false,
                        fullscreen: false,
                        _locals: {
                            $updateUser: user,
                            $onUserUpdated: function (updatedUser) {
                                function update() {
                                    if ($self.users[$index] && $self.users[$index].Id === updatedUser.Id) {
                                        $self.users[$index] = updatedUser;
                                    }
                                    else {
                                        var idx = _.findIndex($self.users, function (o) {
                                            return o.Id === updatedUser.Id;
                                        });
                                        if (_.isInteger(idx)) {
                                            $self.users[$index] = updatedUser;
                                        }
                                    }
                                }

                                if (_scrollDataUpdateInProgress) {
                                    delaydActions.push(update);
                                }
                                else {
                                    update();
                                }

                            },
                            $css: $self.css,
                            $channelAdminUserId: $scope.channel.CreatorConnection.UserId
                        },
                        bindToController: true,
                        controller: "dialogChannelsGroupUpdateUser",
                        controllerAs: "suCtrl"
                    }).then(destroy, destroy);

                };
            }],
            controllerAs: "settingCtrl"
        };
    }]);
})(Utils.CoreApp.gameApp);