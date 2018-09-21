Utils.CoreApp.gameAppExtensions.ConfederationOfficers = function (service) {
    var lock = false;
    service.getPresidentOfficerFromOfficerList = function (listOfficers) {
        return _.find(listOfficers, function (o) {
            return o.Type === service.OfficerTypes.President;
        });
    };

    service.officerOpenFormSetOfficer = function ($event, emptyUserOfficerOutDataModel, presidentUserOfficer, currentUserShortInfo, postName) {
        if (lock || currentUserShortInfo.userId !== presidentUserOfficer.UserId) return;
        lock = true;
        service.$cdH.$mdDialog.show({
            templateUrl: "dialog-set-officer.tmpl",
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: false,
            fullscreen: true,
            bindToController: true,
            _locals: {
                postName: postName,
                presidentOfficer: presidentUserOfficer,
                targetOficer: emptyUserOfficerOutDataModel
            },
            controller: "dialogSetOfficerCtrl",
            controllerAs: "soCtrl"

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
            emptyUserOfficerOutDataModel: emptyUserOfficerOutDataModel,
        });


    };

    service.addOrUpdateOfficer = function (newUserOfficerOutDataModel, $$RootScope) {
        var oficers = service.Officers.Officers;
        if (newUserOfficerOutDataModel && oficers) {
            //todo code heare
            var type = newUserOfficerOutDataModel.Type;
            var elected = newUserOfficerOutDataModel.Elected;
            // колекция упорядочена по типу - можно обращаться по индексу
            var idx = type - 1;
            var item = oficers[idx];
            var userOficer = elected ? item.Elected : item.Appointed;
            if (userOficer.Type !== type || userOficer.Elected !== elected) {
                throw Errors.ClientNotImplementedException({
                    newUserOfficerOutDataModel: newUserOfficerOutDataModel,
                    oficers: oficers
                }, "userOficer.Type !== type || userOficer.Elected !== elected");
            }
            Utils.UpdateObjData(userOficer, newUserOfficerOutDataModel);
            // данных обновлять по скоупу не требуется можно выходить
            console.log("addOrUpdateOfficer && service.Officers.Officers", {
                newUserOfficerOutDataModel: newUserOfficerOutDataModel,
                LocalOficers: oficers,
                $$RootScope: $$RootScope,
            });
        }
        else {
            console.log("addOrUpdateOfficer.error no Data", {
                LocalOficers: oficers,
                newUserOfficerOutDataModel: newUserOfficerOutDataModel

            });
        }

    };

    service.getIUserOfficerOutListFromOfficers = function () {
        var result = [];
        _.forEach(service.Officers.Officers, function (val, idx) {
            if (val) {
                if (val.Elected) {
                    result.push(val.Elected);
                } if (val.Appointed) {
                    result.push(val.Appointed);
                }
            }
        });
        return result;
    };
    service.officerGetExistOfficerNames = function (setToLower) {
        var col = service.getIUserOfficerOutListFromOfficers();
        if (!col) return [];
        var names = [];
        _.forEach(col, function (item, idx) {
            if (item.UserName && item.UserName.length > 3 && item.UserName !== "None") {
                names.push(item.UserName);
            }
        });

        if (setToLower) {
            names = names.join("|").toLowerCase().split("|");
        }
        return names;
    };

    service.getOfficerBonusForCurrentUser = function () {
        var result = Utils.ModelFactory.IBattleStats();
        var crInfo = service.$currentUserInfo;
        var crAllianceId = crInfo.AllianceId;

        if (GameServices.npcHelper.isNpcAllianceId(crAllianceId)) {
            return result;
        }   
        var list = service.getIUserOfficerOutListFromOfficers();
        if (_.isEmpty(list)) {
            return result;
        }
        //todo code heare
        return result;
    };

};