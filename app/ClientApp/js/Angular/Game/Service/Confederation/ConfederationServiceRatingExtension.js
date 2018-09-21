Utils.CoreApp.gameAppExtensions.ConfederationRating = function (service) {

    service.ratingGetNextPage = function (ratingData, onDone, onError) {
        function _onError(errorAnswer) {
            var msg = Errors.GetHubMessage(errorAnswer);
            var errorData = {
                msg: msg,
                errorAnswer: errorAnswer,
                onDone: onDone
            };
            onError(errorAnswer, msg, errorData);
            throw Errors.ClientNotImplementedException(errorData, "ConfederationRating.ratingGetNextPage");
        }
        var skip = ratingData.Users.length;
        service.$hub.confederationRatingGetNextPage(skip)
            .then(function (answer) {
                _.forEach(answer, function (item, idx) {
                    ratingData.Users.push(item);
                });
                onDone(answer);
            }, _onError);
    };
    service.ratingAddAndTakeLocalUsers = function (dataUsers, targetArr, take) {
        if (!_.isInteger(take)) return;
        var skip = targetArr.length;

        var max = skip + take;
        if (!dataUsers[max]) {
            max = dataUsers.length;
        }
        _.forEach(dataUsers, function (item, idx) {
            if (idx >= skip && idx < max) {
                targetArr.push(item);
            }
        });
    }

    service.ratingAddUserItemsToOld = function (oldUsers, newUsers) {
        var newLenght = newUsers.length;
        for (var i = 0; i < newLenght; i++) {
            oldUsers.push(newUsers[i]);
        }
    };
    /**
     * 
     * @param {object} ctrl  must contain   "users" property  - array
     * @returns {} 
     */
    service.ratingCheckAndFixUniqe = function (ctrl) {
        if (!ctrl.users) return;
        var beforeLenght = ctrl.users.length;
        var unic = _.uniqBy(ctrl.users, "UserId");
        if (beforeLenght !== unic.length) {
            service.Rating.Users = _.uniqBy(service.Rating.Users, "UserId");
            ctrl.users = [];
            service.ratingAddAndTakeLocalUsers(service.Rating.Users, ctrl.users, beforeLenght);
            if (service.Rating.$totalCount) {
                service.Rating.$totalCount = null;
            }
        }
    };

    var _userInlock = false;

    service.ratingGetUserItem = function (userId, users, onDone, onError) {    
        if (_userInlock) {
            onError({}, ErrorMsg.Locked, {});
            return;
        }
       
        _userInlock = true;
        var item = _.find(users, function (o) {
            return o.UserId === userId;
        });
        if (item) {
            try {
                onDone(item);
                _userInlock = false;
            }
            catch (e) {
                _userInlock = false;
                throw console.log("retingGetUserItem.local", { e: e });
            }


        }
        else {  
            if (GameServices.planshetService.getInProgress()) {
                onError({}, ErrorMsg.Locked, {});
                return;;
            }

            GameServices.planshetService.setInProgress(true);
            service.$hub.confederationRatingGetUser(userId).finally(function () {
                    GameServices.planshetService.setInProgress(false);
                })
                .then(function (answer) {
                    try {
                        onDone(answer);
                        _userInlock = false;
                    }
                    catch (e) {
                        _userInlock = false;  
                        throw console.log("retingGetUserItem.answer", { e: e });
                    }

                }, function (errorAnswer) {
                    var msg = Errors.GetHubMessage(errorAnswer);
                    var errorData = {
                        msg: msg,
                        userId: userId,
                        users: users,
                        errorAnswer: errorAnswer,
                        onDone: onDone,
                        onError: onError
                    };
                    if (onError instanceof Function) {
                        onError(errorAnswer, msg, errorData);
                    }
                    _userInlock = false;
                    throw Errors.ClientNotImplementedException(errorData, "ConfederationRating.ratingGetNextPage");

                });
        }

    };

};

