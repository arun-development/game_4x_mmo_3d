Utils.CoreApp.gameAppExtensions.HubConfederation = function (hubService, client, server, $confederation, $$RootScope) {

    // #region Common  

    hubService.confederationGetPlanshet = function () {
        return server.confederationGetPlanshet();
    };

    client.onConfederationVoitingStarted = function (activeCandidatesOutList) {
        try {
            hubService._checkCurrentUser();
            $confederation.updateCandidates(activeCandidatesOutList, false, $$RootScope);
            console.log("onConfederationVoitingStarted", { activeCandidatesOutList: activeCandidatesOutList });
        }
        catch(e) {
            return;
        } 
      
       
    };  
    client.onConfederationVoitingFinalized = function (tabElectionData, newListIOfficerOut) {
        try {
            hubService._checkCurrentUser();
            $confederation.onVoteFinalize(tabElectionData, newListIOfficerOut);
        }
        catch(e) {
            return;
        } 
     
    };
    // #endregion


    // #region Officers
    hubService.confederationAddNewOfficer = function (newUserOfficerOutDataModel, presidentOfficerId, presidentUserId) {
        hubService._checkCurrentUser();
        return server.confederationAddNewOfficer(newUserOfficerOutDataModel, presidentOfficerId, presidentUserId);
    };
    client.confederationAddOrUpdateOfficer = function (newUserOfficerOutDataModel) {
        try {
            hubService._checkCurrentUser();
            $confederation.addOrUpdateOfficer(newUserOfficerOutDataModel, $$RootScope);
        }
        catch(e) {
            return;
        } 

    };
    // #endregion

    // #region Rating
    hubService.confederationRatingGetNextPage = function (skip) {
        return server.confederationRatingGetNextPage(skip);
    };

    hubService.confederationRatingGetUser = function (userId) {
        return server.confederationRatingGetUser(userId);
    };

    // #endregion


    // #region Elections Election  and registration
    hubService.confederationAddVote = function (candidateUserId) {
        return server.confederationAddVote(candidateUserId);
    };

    client.onConfederationCandidatesUpdated = function (candidatesOutList, updateVotes) {
        try {
            hubService._checkCurrentUser();
            $confederation.updateCandidates(candidatesOutList, updateVotes, $$RootScope);
        }
        catch(e) {
            return;
        } 
     
    };

 
    hubService.confederationRegistrateCandidate = function() {
        return server.confederationRegistrateCandidate();
    };

    // #endregion


}

