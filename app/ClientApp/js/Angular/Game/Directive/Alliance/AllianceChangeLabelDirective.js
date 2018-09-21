Utils.CoreApp.gameApp.directive("allianceChangeLabel", [
    function () {
        var template = "<div class='alliance-change-label'  ng-click='replaceImage($event)'>" +
            "<i class='fa fa-plus-circle fa-3x'></i>" +
            "</div>";

        return {
            restrict: "E",
            template: template,
            replace: true,
            scope: {},
            controller: "allianceLabelDialogCtrl"
        };
    }
]);

Utils.CoreApp.gameApp.controller("allianceLabelDialogCtrl", ["$scope", "$rootScope", "$mdDialog", "mainGameHubService",
    function ($scope, $rootScope, $mdDialog, mainGameHubService) {
        $scope.customFullscreen = false;
        $scope.replaceImage = function ($event) {
            EM.Audio.GameSounds.dialogOpen.play();
            $mdDialog.show({
                parent: angular.element(document.body),
                _locals: {
                    _request: mainGameHubService.allianceInfoUpdateLabel,
                    _onError: function (errorAnswer) {
                        if (errorAnswer === ErrorMsg.UploadedImageNotSetInInstance) {
                            $mdDialog.cancel();
                        }
                        console.log("allianceLabelDialogCtrl._onError", errorAnswer);
                    }
                },
                targetEvent: $event,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                controller: "uploadImageCtrl",
                bindToController: true,
                templateUrl: "dialog-upload-user-image.tmpl",
                controllerAs: "uploadImageCtrl"
            })
            .then(function (ok) {
                EM.Audio.GameSounds.dialogClose.play();
                $rootScope.$broadcast("alliance:label-updated");

                }, function () {
                    EM.Audio.GameSounds.dialogClose.play();
                //close
            });
        };

    }
]);