Utils.CoreApp.gameApp.controller("userChannelsCtrl", [
    function () {
    }
]);
Utils.CoreApp.gameApp.controller("userChannelsPrivateCtrl", ["$scope",
    "userChannelsService",
    function ($scope, $ucs) {
        if (!$ucs.Private.channelControls) {
            $ucs.Private.channelControls = $ucs.createPrivateChannelControls();
        }
        var $self = _.extend(this, $ucs.Private);


    }
]);

Utils.CoreApp.gameApp.controller("userChannelsGroupCtrl", ["$scope",
    "userChannelsService",
    function ($scope, $ucs) {
        var $self = this;
        if (!$ucs.Group.channelControls) {
            $ucs.Group.channelControls = $ucs.createGroupChannelControls();
        }
        _.extend($self, $ucs.Group);
    }
]);

Utils.CoreApp.gameApp.controller("userChannelsAllianceCtrl", [
    "$scope",
    "userChannelsService",
    function ($scope, $ucs) {
        var $self = this;
        function load() {
            $self.channel = $ucs.Alliance.Collection[Object.keys($ucs.Alliance.Collection)[0]];
            if (!$self.channel.dropElementFreeze) {
                $self.channel.dropElementFreeze = true;
            }

            if (!$self.channel._btnIds) {
                $ucs.createBtnIds($self.channel);
            }
            if (!$self.channel.initTargetDropable) {
               // console.log("initTargetDropable", _.cloneDeep($self.channel));
                $self.channel.initTargetDropable = $self.channel._btnIds.MessagesId;
            }
            if (!$self.channel.cbClick) {

            }

        }

        load();

    }
]);



(function () {
    "use strict";
    var $icons = {
        checked: "fa-check",
        warn: "fa-exclamation",
        show: "fa-eye",
        notShow: "fa-eye-slash",
        locked: "fa-expeditedssl",
        unLocked: "fa-unlock"
    };

    function _autocompleteBase(ctrl, querySearch) {
        ctrl.serchInputId = Utils.Guid.CreateGuid();
        ctrl.searchText = null;
        ctrl.onTextChange = function (text, advancedAction) {
            if (!ctrl.model.To || !ctrl.model.To.Name) return;
            if (text === ctrl.model.To.Name) return;
            if (text.toLowerCase() === ctrl.model.To.Name.toLowerCase()) {
                ctrl.searchText = ctrl.model.To.Name;
            };
            if (advancedAction instanceof Function) {
                advancedAction();
            }
        };


        ctrl.querySearch = querySearch;
        var messages = {
            required: "This is a required field",
            serchRequireMmatch: "This requireMmatch.",
            serchNotFounded: "not founded"
        };

        if (ctrl.$messages) {
            _.extend(ctrl.$messages, messages);
        }
        else {
            ctrl.$messages = messages;
        }


    }


    Utils.CoreApp.gameApp.controller("dialogCreatePrivateChannelCtrl", ["$scope", "$mdDialog", "userNameSercherService", "userChannelsService", function ($scope, $mdDialog, $uSercher, $ucs) {
        var $self = this;  
        var crData = $ucs.$currentUserInfo;
        var maxLenght = $ucs.$ucdH.maxLenghtConsts;
        var model = Utils.ModelFactory.IChannelMessageTransfer();

        model.UserId = crData.userId;
        model.UserName = crData.userName;
        model.$messageMaxLenght = maxLenght.ChannelMessage;
        model.$userNameMaxLenght = maxLenght.UniqueName;
        model.Message = "";
        model.UserIcon = crData.userAvatar.Icon;
        model.ChannelType = $ucs.ChannelTypes.Private;
        model.$title = "Create private channel";
        this.model = model;



        var existChannelNames = $ucs.getPrivateExistChannelNames();
        var ignoreNames = $uSercher.createIgnoreNamesWithNpc(existChannelNames);

        this.serchInLock = false;
        _autocompleteBase($self, function (query) {
            var deferred = $ucs.$q.defer();
            if ($self.serchInLock) {
                deferred.reject();
            }
            $self.serchInLock =true;
            $uSercher.filterAsync(query).then(function (items) {
                var cleanItems = $uSercher.filterByIgnoreNames(items, ignoreNames);
                deferred.resolve(cleanItems);
                $self.serchInLock = false;
            }, function () {
                $self.serchInLock = false;
            });
            return deferred.promise;
        });

        this.messages = _.extend(this.$messages, {
            serchMaxlength: "The user name must be less than " + model.$userNameMaxLenght + " characters long.",
            messageMaxlength: "The description must be less than " + model.$messageMaxLenght + " characters long."
        });

        //serch user



        //md-dialog actions
        this.cancel = function () {
            $mdDialog.cancel($scope);
        };

        var _sendInProgress = false;
        this.send = function () {
            var data = Utils.ModelFactory.IChannelMessageCreateModel(model);
            if (_sendInProgress) return;
            _sendInProgress = true;
            $ucs.$hub.userChannelsCreatePrivateChannel(data)
                .then(function (answer) {
                    _sendInProgress = false;
                    console.log("createMessageChannelInBlockedState.answer", { answer: answer, data: data });
                    $mdDialog.hide($scope);
                }, function (errorAnswer) {
                    _sendInProgress = false;
                    var msg = Errors.GetHubMessage(errorAnswer);
                    Errors.ClientNotImplementedException({
                        msg: msg,
                        errorAnswer: errorAnswer,
                        model: model,
                        data: data
                    }, "dialogCreatePrivateChannelCtrl.send.errorAnswer");
                    $self.cancel();
                });

        };

    }]);

    function ProtoChannelPassword($ucs, $minLenght, $regExp) {
        var $self = this;
        this.$maxLenght = $ucs.$ucdH.maxLenghtConsts;

        var model = {
            isLocked: false,
            password: "",
            showPassword: false,
            inputPsswordType: "password",
            $passwordMinLenght: $minLenght.ChannelPassword,
            $passwordMaxLenght: $ucs.$ucdH.maxLenghtConsts.ChannelName,
            $title: ""
        };
        this.$openChannelLabel = "Open channel";
        this.$lockedChannelLabel = "Locked channel";
        Object.defineProperty(model, "$lockedLabel", {
            get: function () {
                if (model.isLocked) {
                    return $self.$lockedChannelLabel;
                }
                return $self.$openChannelLabel;
            }
        });
        Object.defineProperty(this, "cssIconLock", {
            get: function () {
                if (model.isLocked) return $icons.locked;
                return $icons.unLocked;
            }
        });
        this.showPasswordToggle = function () {
            model.showPassword = !model.showPassword;
            if (model.showPassword) model.inputPsswordType = "text";
            else model.inputPsswordType = "password";
        };
        Object.defineProperty(this, "cssIconShowPassword", {
            get: function () {
                if (model.showPassword) return $icons.show;
                return $icons.notShow;
            }
        });
        this.passwordPattern = $regExp.channelPassword;
        this.$model = model;
        this.$messages = {
            required: "This is a required field",
            passwodMinLength: "Password must be longer than " + model.$passwordMinLenght + " characters",
            passwodMaxLength: "Password must be less than " + model.$passwordMaxLenght + " characters",
            passwordPattern: "Password It contains invalid characters.<br>" + Utils.SetSpanText("<b>Available symbols : 'a-z', 'A-Z', '0-9', '-', '_'<br> Password must be contain latin only symbols,<br> Beginning  with  'a-z' or 'A-Z' <br>   Ends with  'a-z' or 'A-Z' or '0-9' </b>", "base-color"),
            noMatch: "No match!"
        };

        this.$toggleLock = function () {
            model.password = "";
            model.isLocked = !model.isLocked;
        };
    }


    function ProtoChannelPasswordForm($ucs, $minLenght, $regExp) {
        var $self = this;
        ProtoChannelPassword.call($self, $ucs, $minLenght, $regExp);
        var model = _.extend(this.$model, {
            confirmPassword: "",
            passwordVerifed: false,
        });

        this.toggleLock = function () {
            this.$toggleLock();
            model.confirmPassword = "";

        };

        this.messages = _.extend(this.$messages, {
            noMatch: "No match!"
        });


    };
    ProtoChannelPasswordForm.prototype = Object.create(ProtoChannelPassword.prototype);

    function dialogCreateGroupChannelCtrl($scope, $mdDialog, $ucs, $minLenght, $regExp) {
        var $self = this;
        ProtoChannelPasswordForm.call($self, $ucs, $minLenght, $regExp);
        var crData = $ucs.$currentUserInfo;
        var model = _.extend(this.$model, {
            channelName: "",
            isValidName: false,
            channelNameIsUnique: false,
            $title: "Create group channel",
            $enterChannelNameLabel: "Channel name",
            $channelNameMinLenght: $minLenght.ChannelName,
            $channelNameMaxLenght: this.$maxLenght.UniqueName,
            UserId: crData.userId,
            UserName: crData.userName,
            ChannelType: $ucs.ChannelTypes.Group
        });


        this.onChannelNameChange = function ($event) {
            model.isValidName = $self.form.channelName.$valid;
            //console.log("$self.form", {
            //    "form": $self.form,
            //    self: $self,

            //});

        };

        this.checkNameIsUnique = function () {
            model.channelNameIsUnique = !model.channelNameIsUnique;
        };
        this.onNameValidate = function () {
            model.isValidName = true;

        };
        this.onNameInvalidate = function () {
            model.isValidName = false;
        };
        this.model = model;


        Object.defineProperty($self, "cssIconChannelName", {
            get: function () {
                if (model.isValidName) return $icons.checked;
                return $icons.warn;
            }
        });


        //md-dialog actions
        this.cancel = function () {
            $mdDialog.cancel($scope);
        };
        var _sendInProgress = false;
        this.send = function () {
            if (_sendInProgress) return;
            _sendInProgress = true;
            var createModel = Utils.ModelFactory.IChannelDataModel();
            createModel.ChannelName = model.channelName;
            createModel.Password = model.password;
            createModel.ChannelIcon = crData.userAvatar.Icon;

            if ($self.form.$valid) {
                $ucs.createGroupChannel(createModel, function () {
                    _sendInProgress = false;
                    $mdDialog.hide($scope);
                }, function (errorAnswer) {
                    var msg = Errors.GetHubMessage(errorAnswer);
                    if (msg === ErrorMsg.MaxChannelsLimit) {
                        $self.form.$setValidity("maxChannelsLimit", false);
                        _sendInProgress = false;
                    }
                    else {
                        _sendInProgress = false;
                        Errors.ClientNotImplementedException({
                            msg: msg,
                            errorAnswer: errorAnswer,
                            createModel: createModel,
                            $scope: $scope
                        }, "dialogCreateGroupChannelCtrl.send.errorAnswer");
                        $self.cancel();
                    }

                });
            }
            else {
                console.log("dialogCreateGroupChannelCtrl.form.$invalid");
            }

        };

        this.channelNamePattern = $regExp.channelName;
        this.messages = _.extend(this.$messages, {
            nameMinLength: "Channel name must be longer than " + model.$channelNameMinLenght + " characters",
            nameMaxLength: "The Channel name must be less than  " + model.$channelNameMaxLenght + " characters long.",
            namePattern: "Channel name contains invalid characters.<br>" + Utils.SetSpanText("<b>Available symbols : 'A-Z', '0-9', '-','_' <br> Name must be contain latin only  symbols <br>In uppercase.<br> Beginning  with 'A-Z' <br>Ends with  'A-Z'  or '0-9'</b>", "base-color"),
            isAvailableName: "Name not Unique"
        });
        Object.defineProperty(this.messages, "maxChannelsLimit", {
            get: function () {
                var limit = $ucs.getGroupLimitModel();
                var translateTabName = $ucs.getTabTranslateNameByChannelType($ucs.bodyIdx.Group);
                return $ucs.$ucdH.getTextOpenDialogChannelMaxLimit(translateTabName, limit.max);
            }
        });

    };
    dialogCreateGroupChannelCtrl.prototype = Object.create(ProtoChannelPasswordForm.prototype);
    Utils.CoreApp.gameApp.controller("dialogCreateGroupChannelCtrl", ["$scope", "$mdDialog", "userChannelsService", "minLenghtConsts", "$regExp", dialogCreateGroupChannelCtrl]);

    function dialogChannelsGroupUpdatePassword($scope, $mdDialog, $ucs, $minLenght, $regExp) {
        var $self = this;
        var $channel = $self._locals.channel;
        ProtoChannelPasswordForm.call(this, $ucs, $minLenght, $regExp);
        this.model = _.extend(this.$model, { $title: "Update password" });
        this.model.isLocked = !$channel.IsPublic;
        this.cancel = function () {
            $mdDialog.cancel($scope);
        };
        var sendInProgress = false;
        this.send = function () {
            if (sendInProgress) return;
            sendInProgress = true;
            if ($channel.IsPublic && !$self.model.isLocked) {
                $self.cancel();
            }
            var newIsPublic = !$self.model.isLocked;
            var password = newIsPublic ? "" : $self.model.password;
            var promise = $ucs.$hub.userChannelsUpdatePassword($channel.ChannelId, password);
            promise.then(function (answer) {
                if (!answer) {
                    $self.cancel();
                }
                else {
                    $channel.IsPublic = newIsPublic;
                    $ucs.addOrUpdateGroupSerchChannelItem($channel.ChannelId, $channel.ChannelName, newIsPublic);
                    $ucs.setIncorrectPwToToLocalAdminUsers($channel.ChannelId);   
                    $mdDialog.hide($scope);
                }

            }, function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                console.log("dialogChannelsGroupUpdatePassword", {
                    errorAnswer: errorAnswer,
                    msg: msg,
                    $self: $self
                });
                $self.cancel();
            });

            console.log("dialogChannelsGroupUpdatePassword", {
                $scope: $scope
            });

            return;


            // todo send password to server and drop other user
            $mdDialog.hide($scope);
        };
    }
    dialogChannelsGroupUpdatePassword.prototype = Object.create(ProtoChannelPasswordForm.prototype);

    Utils.CoreApp.gameApp.controller("dialogChannelsGroupUpdatePasswordCtrl", ["$scope", "$mdDialog", "userChannelsService", "minLenghtConsts", "$regExp", dialogChannelsGroupUpdatePassword]);

    function dialogChannelsGroupJoinToChannel($scope, $mdDialog, $ucs, $minLenght, $regExp) {
        var $self = this;
        ProtoChannelPassword.call($self, $ucs, $minLenght, $regExp);


        var ignoreNames = $ucs.getGroupExistChannelNames();

        this.model = _.extend(this.$model, {
            $minSerchChannelName: $minLenght.SerchChannelName,
            $channelNameMinLenght: $minLenght.ChannelName,
            $channelNameMaxLenght: $self.$maxLenght.ChannelName,
            $title: "Join to channel",
            serchTypesView: $ucs.getSerchTypesView(),
            lockForm: false
        });
        this.model.selecctedSerchTypeView = this.model.serchTypesView[0];

        var _lastQuery;
        var _lastItems;
        var _lastSerchType;
        this.serchInLock = false;
        _autocompleteBase($self, function (query) {
            if ($self.serchInLock) return [];
            $self.serchInLock = true;

            if (_lastQuery && _lastQuery === query && _lastItems && _lastSerchType === $self.model.selecctedSerchTypeView.Id) {
                console.log("_autocompleteBase.cahce", { $self: $self, query: query, _lastItems: _lastItems });
                $self.serchInLock = false;
                return _lastItems;
            }   
            var deferred = $ucs.$q.defer();
            _lastSerchType = $self.model.selecctedSerchTypeView.Id;
            function onDone(items) {
                _lastQuery = query;
                if(items && items.length>0) {
                    _lastItems = items; 
                }
                else {
                    _lastItems = [];
                }
                deferred.resolve(_lastItems);
                $self.serchInLock = false;
            }

            $ucs.groupSerchChannelItemsFilterAsync(query, _lastSerchType).then(function (data) {
                var cleanItems = $ucs.filterGroupByIgnoreNames(data.items, ignoreNames);
                if (data.items.length === 0 && !data.fromLocal) {
                    onDone();
                    return;
                }
                else if (data.items.length > 0 && data.fromLocal && !cleanItems.length) {
                    $ucs.groupSerchChannelItemsFilterAsync(query, _lastSerchType, true)
                      .then(function (t2Data) {
                          var t2CleanItems = $ucs.filterGroupByIgnoreNames(t2Data.items, ignoreNames);
                          if (t2Data.items.length > 0 && t2CleanItems.length === 0) {
                              $self.form.toName.$error.channelExistLocal = true;
                          }
                          else {
                              $self.form.toName.$error.channelExistLocal = false;
                          }
                          onDone(t2CleanItems);
                          return;
                      });
                }
                else {
                    if (data.items.length > 0 && cleanItems.length === 0) {
                        $self.form.toName.$error.channelExistLocal = true;
                    }
                    else {
                        $self.form.toName.$error.channelExistLocal = false;
                    }
                    onDone(cleanItems);
                }
            }); 
            return deferred.promise;


        });


        //md-dialog actions

        var maxWrong = 5;
        var sendCount = 0;
        function _getMaxPasswordTryCountText() {
            var count = maxWrong - sendCount;
            if (count < 0) count = 0;
            return " " + count + "/" + maxWrong + " ";
        }
        this.messages = _.extend(this.$messages, {
            channelExistLocal: "Вы уже подключенны к этому каналу",
            passwordWrongMax: "Вы ввели неверный пароль слишком много раз, попробуйте позднее",
            youAreBlockedInThisChannel: "Вы были заблокированны на этом канале попробуйте связатсья с администратором канала",

        });

        this.showChannelChannelOwnerInfo = false;
        this.ChannelOwner = null;
        Object.defineProperty(this.messages, "passwordWrongCount", {
            get: function () {
                return "Пароль не верный, у вас  осталось попыток " + _getMaxPasswordTryCountText();
            }
        });
        Object.defineProperty(this.messages, "maxChannelsLimit", {
            get: function () {
                var limit = $ucs.getGroupLimitModel();
                var translateTabName = $ucs.getTabTranslateNameByChannelType($ucs.bodyIdx.Group);
                return $ucs.$ucdH.getTextOpenDialogChannelMaxLimit(translateTabName, limit.max);
            }
        });



        this.cancel = function () {
            $mdDialog.cancel($scope);
        };

        var _lastChannelId;
        var _sendInProgress = false;
        this.send = function () {
            if (_sendInProgress) return;
            _sendInProgress = true;
            if (_lastChannelId !== $self.model.To.Id) {
                sendCount = 0;
                $self.ChannelOwner = null;
                $self.showChannelChannelOwnerInfo = false;
                _lastChannelId = $self.model.To.Id;

            }
            sendCount++;
            if (sendCount > maxWrong + 1) {
                $self.cancel();
                return;
            }

            $ucs.$hub.userChannelsJoinToGroupChannel($self.model.To.Id, $self.model.password)
            .then(function (answer) {
                $ucs.addOrReplaceGroupChannelLocal(answer);
                _sendInProgress = false;
                $mdDialog.hide($scope);

            }, function (errorAnswer) {
                console.log("errorAnswer", { errorAnswer: errorAnswer });
                var msg = Errors.GetHubMessage(errorAnswer);

                if (msg === ErrorMsg.YouAreBlockedInThisChannel) {
                    $self.ChannelOwner = errorAnswer.data.ChannelOwner;
                    $self.showChannelChannelOwnerInfo = true;
                    $self.form.$setValidity("youAreBlockedInThisChannel", false);
                }
                else if (msg === ErrorMsg.MaxChannelsLimit) {
                    $self.form.$setValidity("maxChannelsLimit", false);
                }
                else if (msg === ErrorMsg.NotPermitted) {
                    $self.ChannelOwner = errorAnswer.data.ChannelOwner;
                    $self.showChannelChannelOwnerInfo = true;
                    $self.form.password.$setValidity("passwordWrongCount", false);
                    if (sendCount === maxWrong) {
                        $self.form.password.$setValidity("passwordWrongMax", false);

                    }
                    _sendInProgress = false;
                }
                else {
                    _sendInProgress = false;
                    Errors.ClientNotImplementedException({
                        $self: $self,
                        sendCount: sendCount,
                        maxWrong: maxWrong
                    }, "dialogChannelsGroupJoinToChannel.send");
                    $self.cancel();

                }
            });


            //  $mdDialog.hide($self.model);
        };
        this.onSlectedChannelChanged = function (item) {
            if (!item) {
                $self.model.isLocked = false;
            }
            else if ($self.model.isLocked !== !item.IsPublic) {
                $self.model.isLocked = !item.IsPublic;
            }

        };
        this.onPasswordChanged = function () {
            console.log("onPasswordChanged", { q: $self.form.password });
            if ($self.form.password.$error.passwordWrongCount) {
                $self.form.password.$setValidity("passwordWrongCount", true);
            }
        }
    }
    dialogChannelsGroupJoinToChannel.prototype = Object.create(ProtoChannelPassword.prototype);

    Utils.CoreApp.gameApp.controller("dialogChannelsGroupJoinToChannel", ["$scope", "$mdDialog", "userChannelsService", "minLenghtConsts", "$regExp", dialogChannelsGroupJoinToChannel]);


    Utils.CoreApp.gameApp.controller("dialogChannelsGroupUpdateUser", [
        "$scope", "$mdDialog", "userChannelsService", function ($scope, $mdDialog, $ucs) {

            var $self = this;
            this.model = _.extend(_.cloneDeep(this._locals.$updateUser));
            this.$title = "Update user: " + this._locals.$updateUser.UserName + " ";
            this.css = this._locals.$css;

            this.labels = {};
            Object.defineProperty(this.labels, "read", {
                get: function () {
                    if ($self.model.MessageRead) {
                        return "Can Read";
                    }
                    else {
                        return "Can't Read";
                    }
                }
            });
            Object.defineProperty(this.labels, "write", {
                get: function () {
                    if ($self.model.MessageSend) {
                        return "Can Write";
                    }
                    else {
                        return "Can't Write";
                    }
                }
            });
            Object.defineProperty(this.labels, "pw", {
                get: function () {
                    if ($self.updateFromChannel) {
                        return "Update password";
                    }
                    else {
                        return "Don't Update password";
                    }
                }
            });

            var _sendInProgress = false;

            this.toggleCanRead = function () {
                this.model.MessageRead = !this.model.MessageRead;
                if (!this.model.MessageRead) {
                    $self.model.MessageSend = false;
                    $self.updateFromChannel = false;
                }

            };
            this.toggleCanWrite = function () {
                if (this.model.MessageRead) {
                    this.model.MessageSend = !this.model.MessageSend;
                }

            };



            Object.defineProperty(this, "showUpdatePassword", {
                get: function () {
                    return !$self._locals.$updateUser.HasCorrectPassword && $self.model.MessageRead;
                }
            });
            this.updateFromChannel = false;
            this.toggleUpdatePasswordFromChannel = function () {
                this.updateFromChannel = !this.updateFromChannel;
            };

            this.send = function () {
                if (_sendInProgress) return;
                _sendInProgress = true;
                console.log("send", {
                    $scope: $scope,
                    $self: $self
                });
                if (!_.isEqual($self.model, $self._locals.$updateUser) || $self.updateFromChannel) {
                    $ucs.$hub.userChannelsGroupUpdateUser($self.model, $self.updateFromChannel, $self._locals.$channelAdminUserId)
                        .then(function (answer) {
                            $ucs.addOrUpdateGroupUserToLocalAdminUsers(answer);
                            $self._locals.$onUserUpdated(answer);
                            $mdDialog.hide($scope);
                        }, function (errorAnswer) {
                            var msg = Errors.GetHubMessage(errorAnswer);
                            if (msg === ErrorMsg.NotPermitted) {
                                var channel = $ucs.Group[$self.model.ChannelId];
                                channel.Users = null;
                                channel.CreatorConnection = null;
                                console.log("dialogChannelsGroupUpdateUser.send.error.NotPermitted", {
                                    $self: $self,
                                    errorAnswer: errorAnswer,
                                    msg: msg
                                });
                                $self.cancel();
                            }
                            else {
                                console.log("dialogChannelsGroupUpdateUser.send.error", {
                                    $self: $self,
                                    errorAnswer: errorAnswer,
                                    msg: msg
                                });
                                $self.cancel();
                            }

                        });




                }
                else {
                    $self.cancel();
                }


            };
            this.cancel = function () {
                console.log("cancel", {
                    $scope: $scope,
                    $self: $self
                });
                $mdDialog.cancel($scope);
            };   
            $scope.$on("user-channels-group-:user-unsubscribe", function ($event, data) {
                //todo checkIsCurrentUser   
                if (data.ChannelConnectionUserOut.Id === $self.model.Id) {
                    console.log("dialogChannelsGroupUpdateUser.user-channels-group-:user-unsubscribe", {
                        $scope: $scope,
                        data: data,
                        unsubscibedUser: data.ChannelConnectionUserOut,
                    });
                }

            });
        }]);

})();

