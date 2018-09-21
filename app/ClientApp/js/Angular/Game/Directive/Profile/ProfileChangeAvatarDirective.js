Utils.CoreApp.gameApp.directive("profileChangeAvatar", [function () {
    var template = "<div class='profile-change-avatar'  ng-click='replaceImage($event)'>" +
                        "<i class='fa fa-plus-circle fa-3x'></i>" +
                   "</div>";

    return {
        restrict: "E",
        template: template,
        replace: true,
        scope: {},
        controller: "userAvatarDialogCtrl"
    };
}]).controller("userAvatarDialogCtrl", ["$scope", "$rootScope", "$mdDialog", "mainGameHubService", "profileService", "allianceService",
    function ($scope, $rootScope, $mdDialog, mainGameHubService, profileService, allianceService) {
   
        $scope.customFullscreen = false;
        $scope.replaceImage = function ($event) {
            EM.Audio.GameSounds.dialogOpen.play();
            var dialog = $mdDialog.show({
                parent: angular.element(document.body),
                _locals: {
                    _request: mainGameHubService.personalInfoUpdateAvatar,
                    _onError: function (errorAnswer) {
                        if (errorAnswer === ErrorMsg.UploadedImageNotSetInInstance) {
                            $mdDialog.cancel();
                        }
                    }
                },
                targetEvent: $event,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                controller: "uploadImageCtrl",
                bindToController: true,
                templateUrl: "dialog-upload-user-image.tmpl",
                controllerAs: "uploadImageCtrl"
            });
            dialog.then(function (newAvatar) {
                EM.Audio.GameSounds.dialogClose.play();
                profileService.updateLocalUserAvatar(newAvatar);
                allianceService.onLocalUserUpdateAvatar(newAvatar);
                $rootScope.$broadcast("user:avatar-updated", { data: newAvatar });
                console.log("newAvatar", newAvatar);
                }, function () {
                EM.Audio.GameSounds.dialogClose.play();
                //close

            });
        };
    }]);