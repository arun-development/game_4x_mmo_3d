Utils.CoreApp.gameApp.controller("profileCtrl", ["$scope", "profileService",
    function ($scope, profileService) {
        this.setProfileModel = profileService.setProfile;
        this.hasCheset = profileService.hasCheset;
        // GameServices.profileService.
        $scope.$on("user:avatar-updated", function (event, args) {
            GameServices._updatePlanshet();
        }); 
    }
]);

