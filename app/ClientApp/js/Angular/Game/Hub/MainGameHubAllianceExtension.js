Utils.CoreApp.gameAppExtensions.HubAlliance = function (hubService, client, server, allianceService, $$RootScope) {
    // #region Requests to alliance

    /**
	 * 
	 * @param {object} allianceMessageModelExt Utils.ModelFactory.AllianceMessageModelExt
	 * @returns {object} signalR deffered
	 */
    hubService.requestAllianceFromAllianceManageAddMessage = function(allianceMessageModelExt) {
        return server.requestAllianceFromAllianceManageAddMessage(allianceMessageModelExt);
    };
    /**
	* 
	* @param {object} allianceMessageModelExt Utils.ModelFactory.AllianceMessageModelExt
	* @returns {void} 
	*/
    client.requestAllianceAddMessageToAllianceManage = function(allianceMessageModelExt) {
        hubService._checkCurrentUser();
        allianceService.addNewRequetToAllianceManage(allianceMessageModelExt);
        console.log("otherOnRequestAllianceManageAddMessage", allianceMessageModelExt);
        //todo code heare
    };

    /**
	 * 
	 * @param {object} allianceMessageModelExt Utils.ModelFactory.AllianceMessageModelExt
	 * @returns {object} signalR deffered
	 */
    hubService.requestAllianceFromMyAllianceAddMessage = function(allianceMessageModelExt) {
        return server.requestAllianceFromMyAllianceAddMessage(allianceMessageModelExt);

    };

    /**
	 * for my alliance tab
	 * @param {object} allianceMessageModelExt Utils.ModelFactory.AllianceMessageModelExt
	 * @returns {void} 
	 */
    client.requestAllianceAddMessageToMyAlliance = function(allianceMessageModelExt) {
        hubService._checkCurrentUser();
        allianceService.addNewRequetToMyAlliance(allianceMessageModelExt);
        console.log("requestAllianceAddMessageToMyAlliance", allianceMessageModelExt);
        //todo code heare
    };

    /**
	 * 
	 * @param {int} toAllianceId
	 * @returns {object} signalR deffered
	 */
    hubService.requestAllianceDeleteRequestForUserToAlliance = function(toAllianceId) {
        return server.requestAllianceDeleteRequestForUserToAlliance(toAllianceId);
    }

    /**
	 * for alliance manage tab
	 * @param {object} fromConnectionUser ConnectionUser Utils.ModelFactory.ConnectionUser
	 * @returns {void} 
	 */
    client.onRequestAllianceDeleteRequestForUserToAlliance = function(requestUserId) {
        hubService._checkCurrentUser();
        allianceService.deleteRequestHistoryFromAllianceManage(requestUserId);
    };

    hubService.requestAllianceConfirmAcceptFromAllianceManage = function(allianceMessageModelExt) {
        return server.requestAllianceConfirmAcceptFromAllianceManage(allianceMessageModelExt);
    };
    client.onRequestAllianceConfirmAcceptFromAllianceManage = function(allianceMessageModelExt, isRequestUser) {
        hubService._checkCurrentUser();
        allianceService.onRequestAllianceConfirmAcceptFromAllianceManage(allianceMessageModelExt, isRequestUser);
    };

    client.onDeleteAllianceRequestsByManager = function(allianceId, removerRequestUserId) {
        hubService._checkCurrentUser();
        allianceService.onDeleteAllianceRequestsByManager(allianceId, removerRequestUserId);
    };


    hubService.requestAllianceRejectRequestToAlliance = function(rejectUserId) {
        console.log("rejectRequestToAlliance", rejectUserId);
        return server.requestAllianceRejectRequestToAlliance(rejectUserId);
    };
    client.onRequestAllianceRejectRequestToAlliance = function(rejectUserId, isRequestUser, allianceMessageModelExt) {
        hubService._checkCurrentUser();
        allianceService.onRequestAllianceRejectRequestToAlliance(rejectUserId, isRequestUser, allianceMessageModelExt);
    };


    hubService.requestAllianceAcceptJoinUserToAlliance = function(toAllianceId) {
        return server.requestAllianceAcceptJoinUserToAlliance(toAllianceId);
    };

    client.allianceAddNewUserToAlliane = function(newAllianceMember) {
        hubService._checkCurrentUser();
        allianceService.allianceAddNewUserToAlliane(newAllianceMember, $$RootScope);
    };

    client.allianceAddNewUsersToAlliane = function(newMembers) {
        hubService._checkCurrentUser();
        allianceService.allianceAddNewUsersToAlliane(newMembers, $$RootScope);
    };

    hubService.allianceLeaveFromUserAlliance = function() {
        return server.allianceLeaveFromUserAlliance();
    }
    client.onAllianceUserLeftAlliance = function(leftUserId, leftAllianceId) {
        hubService._checkCurrentUser();
        allianceService.onAllianceUserLeftAlliance(leftUserId, leftAllianceId, $$RootScope);
    };
    // #endregion


    hubService.allianceDisbandAlliance = function() {
        return server.allianceDisbandAlliance();
    };
    client.onAllianceDisbanded = function(disbandedAlianceId, newConnectionUser, newPlanshetData) {
        hubService._checkCurrentUser();
        if(newConnectionUser) {
            console.log("client.onAllianceDisbanded.is newConnectionUser");
            if(hubService._currentUser.UserId===newConnectionUser.UserId) {
                hubService._updateCurrentUser(newConnectionUser);
                console.log("client.onAllianceDisbanded.allianceService", allianceService);
                allianceService.onAllianceDisbanded(disbandedAlianceId, hubService._currentUser, newPlanshetData);
            }
            else throw new Error("mainGameHubService.client.onAllianceDisbanded.isAllianceGroup");
        }
        else {
            console.log("client.onAllianceDisbanded is other newConnectionUser");
            allianceService.onAllianceDisbanded(disbandedAlianceId);
        }

    }

    hubService.allianceCheckAllianceNameIsUnic = function(checkAllianceName) {
        return server.allianceCheckAllianceNameIsUnic(checkAllianceName);
    }

    hubService.allianceCreateAlliance = function(checkedAllianceName) {
        return server.allianceCreateAlliance(checkedAllianceName);
    }

    client.onAllianceCreateAlliance = function(newAllianceId, newAllianceName) {
        hubService._checkCurrentUser();
        allianceService.addAllianceNameToLocal({Id:newAllianceId, Name:newAllianceName});
    }
    hubService.allianceGetAllActiveAllianceNames = function() {
        return server.allianceGetAllActiveAllianceNames();
    };

    hubService.allianceGetAllianceNamesByPartName = function(partAllianceName) {
        return server.allianceGetAllianceNamesByPartName(partAllianceName);
    };

    hubService.allianceGetAllianceItemById = function(allianceId, tabIdx) {
        return server.allianceGetAllianceItemById(allianceId, tabIdx);
    };
    hubService.allianceGetAllianceItemByMinRating = function(pvpPoint, skip) {
        return server.allianceGetAllianceItemByMinRating(pvpPoint, skip);
    };

    hubService.allianceInfoUpdateLabel = function(newBase64SourceImageModel) {
        return server.allianceInfoUpdateLabel(newBase64SourceImageModel);
    };
    client.onAllianceInfoUpdateLabel = function(newUserImageModel, allianceId) {
        allianceService.onAllianceInfoUpdateLabel(newUserImageModel, allianceId);
    };

    hubService.allianceInfoUpdateDescription = function(newDescription) {
        return server.allianceInfoUpdateDescription(newDescription);
    };
    client.onAllianceInfoUpdateDescription = function(newDescription, allianceId) {
        allianceService.onAllianceInfoUpdateDescription(newDescription, allianceId);
    };

    hubService.allianceInfoUpdateTax = function(newTax) {
        return server.allianceInfoUpdateTax(newTax);
    };
    client.onAllianceInfoUpdateTax = function(newTax, allianceId) {
        allianceService.onAllianceInfoUpdateTax(newTax, allianceId);
    };

    hubService.allianceDropUserFromAlliance = function(targetDropUserId) {
        return server.allianceDropUserFromAlliance(targetDropUserId);
    }
    client.onAllianceUserDroped = function (oldAllianceId, newConnectionUser, newPlanshetData, oldChannelId, newAllianceChannelOutDataModel) {
        hubService._checkCurrentUser();
        if(newConnectionUser) {
            hubService._updateCurrentUser(newConnectionUser);   
            allianceService.onAllianceUserDroped(oldAllianceId, hubService._currentUser, newPlanshetData);
            hubService.$onUserChannelsUserChangeAlliance(oldChannelId, newAllianceChannelOutDataModel); 
        }
        else
            throw Errors.ClientNotImplementedException({
                args:arguments,   
                "hubService._currentUser":hubService._currentUser
            }, "mainGameHubService.client.onAllianceUserDroped");
    }


    hubService.allianceUpdateUserRole = function(targetAllianceUserId, targetUserId, targetRoleId) {
        return server.allianceUpdateUserRole(targetAllianceUserId, targetUserId, targetRoleId);
    };
    client.onAllianceUpdateUserRole = function(data) {
        hubService._checkCurrentUser();
        data.$$RootScope = $$RootScope;
        if(data.IsCurrentUser) {
            hubService._updateCurrentUser(data.NewCurrentConnectionUser);
            //console.log(" client.onAllianceUpdateUserRole.newCurrentConnectionUser", {
            //    newCurrentConnectionUser: newCurrentConnectionUser,
            //    "hubService._currentUser": hubService._currentUser
            //});

        }
        //   allianceService.Role.onAllianceUserUpdateRole(allianceId, targetUserId, newRole, $$RootScope);
        allianceService.Role.onAllianceUserUpdateRole(data);

    };

    hubService.allianceUpdateAllianceTech = function (techType) {
        return server.allianceUpdateAllianceTech(techType);
    };
    client.onAllianceTechUpdated = function(updatedTechItem, newAllianceBalanceCc) {
        hubService._checkCurrentUser();
        allianceService.onAllianceTechUpdated(updatedTechItem, newAllianceBalanceCc, $$RootScope);
    };

};