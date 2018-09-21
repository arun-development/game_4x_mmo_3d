Utils.CoreApp.gameAppExtensions.HubUserChannels = function (hubService, client, server, $uChannelsService, $$RootScope) {

    // #region Common

    /**
    * получает все данные всего планшета со всеми сообщениями для инициализации или глобальных событий обновления
    * @returns {object}   signalR deffered =>  object object see server IPlanshetViewData (UserChannelsPlanshetOut model) 
    */
    hubService.userChannelsGetPlanshet = function () {
        return server.userChannelsGetPlanshet();
    };
    /**
     * модель с базовыми данными для отправки
     * @param {object} channelMessageTransferDataModel see server ChannelMessageTransfer  or Utils.ModelFactory.IChannelMessageTransfer 
     * @returns {object}   signalR deffered =>  bool 
     */
    hubService.userChannelsSendMessage = function (channelMessageTransferDataModel) {
        return server.userChannelsSendMessage(channelMessageTransferDataModel);
    };
    /**
     * 
     * @param {object} channelMessageTransferDataModel  see server ChannelMessageTransfer  or Utils.ModelFactory.IChannelMessageTransfer
     * @returns {void} 
     */
    client.onUserChannelsSended = function (channelMessageTransferDataModel) {
        hubService._checkCurrentUser();
        $uChannelsService.onMessageSended(channelMessageTransferDataModel, $$RootScope);
    };

    /**
     * 
     * @param {} channelId 
     * @param {} channelType 
     * @param {} skip 
     * @returns {} 
     */
    hubService.userChannelsGetNextMessagesPage = function (channelId, channelType, skip) {
        return server.userChannelsGetNextMessagesPage(channelId, channelType, skip);
    };
    // #endregion




    // #region Private

    /**
    *
    * @param {object} iChannelMessageCreateModel   see server  ChannelMessageCreateModel  or Utils.ModelFactory.IChannelMessageCreateModel
    * @returns  {object}  signalR deffered =>  bool 
    */
    hubService.userChannelsCreatePrivateChannel = function (iChannelMessageCreateModel) {
        return server.userChannelsCreatePrivateChannel(iChannelMessageCreateModel);
    };



    /**
     * событие оповещение пользователей приватного канала
     * @param {object} privateChannelOutDataModel  see  server PrivateChannelOut
     * @returns {void} 
     */
    client.onUserChannelsCreatedPrivateChannel = function (privateChannelOutDataModel, iHubGroupItem) {
        hubService._checkCurrentUser();
        if (iHubGroupItem) {
            hubService._addHubGroupForCr(iHubGroupItem);
        }
        $uChannelsService.onPrivateChannelCreated(privateChannelOutDataModel, $$RootScope);
    };

    /**
     * 
     * @param {} channelId 
     * @param {} userId 
     * @returns {} 
     */
    hubService.userChannelsClosePrivateChannel = function (channelId, userId) {
        return server.userChannelsClosePrivateChannel(channelId, userId);
    };

    /**
     * 
     * @param {} hubName 
     * @returns {} 
     */
    hubService.userChannelsIsAvailableChannelName = function (hubName) {
        return server.userChannelsIsAvailableChannelName(hubName);
    };

    // #endregion


    // #region Group

    /**
     * 
     * @param {} iChannelDataModel 
     * @returns {} 
     */
    hubService.userChannelsCreateGroupChannel = function (iChannelDataModel) {
        return server.userChannelsCreateGroupChannel(iChannelDataModel);
    };
    /**
     * 
     * @param {} channelId 
     * @returns {} 
     */
    hubService.userChannelsDeleteGroupChannelByOwner = function (channelId) {
        return server.userChannelsDeleteGroupChannelByOwner(channelId);
    };
    /**
     * 
     * @param {} channelId 
     * @param {} removeMeta 
     * @returns {} 
     */
    client.userChannelsGroupDropChannel = function (channelId, removeMeta, hubGroupName) {
        hubService._checkCurrentUser();
        if (hubGroupName) {
            hubService._removeHubGroupForCr(hubGroupName);
        }

        $uChannelsService.deleteGroupChannelFromLoclal(channelId, removeMeta);
    };
    /**
     * 
     * @param {} channelId 
     * @returns {} 
     */
    client.userChannelsRemoveGroupSerchChannelItem = function (channelId) {
        hubService._checkCurrentUser();
        $uChannelsService.removeGroupSerchChannelItem(channelId);
    };

    /**
     * 
     * @param {} channelId 
     * @param {} channelName 
     * @param {} isPublic 
     * @returns {} 
     */
    client.userChannelsAddOrUpdateGroupSerchChannelItem = function (channelId, channelName, isPublic) {
        hubService._checkCurrentUser();
        $uChannelsService.addOrUpdateGroupSerchChannelItem(channelId, channelName, isPublic);
    };
    /**
     * 
     * @param {} partChannelName 
     * @returns {} 
     */
    hubService.userChannelsSerchGroupChannelNames = function (partChannelName) {
        return server.userChannelsSerchGroupChannelNames(partChannelName);
    };
    /**
     * 
     * @param {} intChannelId 
     * @param {} password 
     * @returns {} 
     */
    hubService.userChannelsJoinToGroupChannel = function (intChannelId, password) {
        return server.userChannelsJoinToGroupChannel(intChannelId, password);
    };
    /**
     * 
     * @param {} channelId 
     * @param {} newPassword 
     * @returns {} 
     */
    hubService.userChannelsUpdatePassword = function (channelId, newPassword) {
        return server.userChannelsUpdatePassword(channelId, newPassword);
    };

    /**
     * 
     * @param {} channelId 
     * @returns {} 
     */
    hubService.userChannelsUnsubscribeUserFromGroupChannel = function (channelId) {
        return server.userChannelsUnsubscribeUserFromGroupChannel(channelId);
    };
    /**
     * 
     * @param {} channelAdminUsrId 
     * @param {} channelConnectionDataModel 
     * @returns {} 
     */
    client.onUserChannelsGroupUserUnsubscribe = function (channelAdminUsrId, iChannelConnectionUserOut) {
        hubService._checkCurrentUser();
        $uChannelsService.onGroupUserUnsubscribe(channelAdminUsrId, iChannelConnectionUserOut, $$RootScope);
    };
    client.onUserChannelsGroupUserSubscribe = function (channelAdminUsrId, iChannelConnectionUserOut) {
        hubService._checkCurrentUser();
        $uChannelsService.onGroupUserSubscribe(channelAdminUsrId, iChannelConnectionUserOut, $$RootScope);

    };


    hubService.userChannelsDeepDeleteOtherGroupChannels = function () {
        return server.userChannelsDeepDeleteOtherGroupChannels();
    };
    client.userChannelsAddOrUpdateGroupChannel = function (groupChannelOutDataModel, iHubGroupItem) {
        hubService._checkCurrentUser();
        if (iHubGroupItem) {
            hubService._addHubGroupForCr(iHubGroupItem);
        }
        $uChannelsService.addOrReplaceGroupChannelLocal(groupChannelOutDataModel);
    };

    /**
     * 
     * @param {object} tragetUserChannelConnectionUserOutDataModel 
     * @param {bool} updatePasswordByChannel 
     * @param {int} channelAdminUserId 
     * @returns {} 
     */
    hubService.userChannelsGroupUpdateUser = function (tragetUserChannelConnectionUserOutDataModel, updatePasswordByChannel, channelAdminUserId) {

        return server.userChannelsGroupUpdateUser(tragetUserChannelConnectionUserOutDataModel, updatePasswordByChannel, channelAdminUserId);
    };


    client.onUserChannelsCrUserGroupUpdatedPermition = function (iChannelConnectionUserOutCurrentUserDataModel) {
        hubService._checkCurrentUser();
        if (hubService._currentUser.UserId === iChannelConnectionUserOutCurrentUserDataModel.UserId) {
            $uChannelsService.onCrUserGroupUpdatedPermition(iChannelConnectionUserOutCurrentUserDataModel, $$RootScope);
        }
    };

    hubService.userChannelsGroupUploadIcon = function (newBase64SourceImageModel, channelId) {
        return server.userChannelsGroupUploadIcon(newBase64SourceImageModel, channelId);
    };


    client.onUserChannelsGroupIconUploaded = function (newIconUrl, channelId) {
        hubService._checkCurrentUser();
        $uChannelsService.onGroupIconUploaded(newIconUrl, channelId, $$RootScope);
    };



    // #endregion

     // #region alliance

    hubService.$onUserChannelsUserChangeAlliance = function (oldChannelId, newAllianceChannelOutDataModel) {
        $uChannelsService.onUserChangeAlliance(oldChannelId, newAllianceChannelOutDataModel, $$RootScope);
    };
    client.onUserChannelsUserChangeAlliance = function (oldChannelId,newAllianceChannelOutDataModel, newCrConnectionUser) {
        hubService._checkCurrentUser();
        if (newCrConnectionUser) {
            hubService._updateCurrentUser(newCrConnectionUser);
        }
        hubService.$onUserChannelsUserChangeAlliance(oldChannelId, newAllianceChannelOutDataModel);
    };

    // #endregion




}

