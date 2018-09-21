
Utils.CoreApp.gameAppExtensions.HubPersonalInfo = function (hubService, client, server, allianceService, profileService) {
    /**
     * 
     * @param {object} newBase64SourceImageModel see server  Base64ImageOut or  Utils.ModelFactory.Base64ImageOut
     * @returns {object}  signalR deffered => UserImageModel see  server UserImageModel or Utils.ModelFactory.IUserImageModel
     */
    hubService.personalInfoUpdateAvatar = function (newBase64SourceImageModel) { 
        return server.personalInfoUpdateAvatar(newBase64SourceImageModel);
    };
    /**
     * 
     * @param {} newUserImageModel  see  server UserImageModel or Utils.ModelFactory.IUserImageModel
     * @param {int} userId 
     * @param {int} allianceId 
     * @returns {void}
     */
    client.onPersonalInfoUserUpdateAvatar = function (newUserImageModel, userId, allianceId) {
        allianceService.onUserUpdateAvatar(newUserImageModel, userId, allianceId);
        profileService.onUserUpdateAvatar(newUserImageModel, userId, allianceId);
        console.log("onPersonalInfoUserUpdateAvatar.data", {
            newUserImageModel: newUserImageModel,
            userId: userId,
            allianceId: allianceId
        });
    };

    /**
     * 
     * @param {string} newDescriptionText 
     * @returns {object} signalR deffered  => string updated description
     */
    hubService.personalInfoUpdateUserDescription = function (newDescriptionText) {
        return server.personalInfoUpdateUserDescription(newDescriptionText);
    };
    /**
     * 
     * @param {string} userName 
     * @returns {object}   signalR deffered => object see server IPlanshetViewData (personal info)
     */
    hubService.personalInfoGetProfileByUserName = function (userName) {
        return server.personalInfoGetProfileByUserName(userName);
    };
    /**
     * 
     * @param {int} userId 
     * @returns {object} signalR deffered => object see server IPlanshetViewData (personal info)
     */
    hubService.personalInfoGetProfileByUserId = function (userId) {
        return server.personalInfoGetProfileByUserId(userId);
    };

}