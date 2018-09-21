Utils.CoreApp.gameApp.directive("userAvatar", ["profileService", "planshetService",
    function (profileService, planshetService) {
 
        var template = '<section><div class="" ng-click="avatar.Onclick()" id="user-avatar">' +
                                    '<img ng-src="{{avatar.Avatar.Icon}}" ng-attr-alt="{{avatar.Name}}" ng-attr-title="{{avatar.Name}}" class="user-ava" />' +
                                 '</div>' +
                       '</section>';


        function setAvatar(scope) {
            var userInfo;
            function set(data) {
                //console.log("scope data", data);
                scope.avatar = {
                    Avatar: data.Avatar,
                    Name: data.Name,
                    Onclick: function () {
                        //  console.log("Onclick");
         
                        profileService.setCurrentUserProfile();
                    }
                }

            }
            var max = 1000;
            planshetService.conditionAwaiter(function () {
                userInfo = profileService.getCurrentUserInfo();
                return !!userInfo;
            }, function () {
                set(userInfo);
            }, 40, max);
        }
        
        function link($scope, element, attrs, ctrl) {
            setAvatar($scope);
            $scope.$on("user:avatar-updated", function (event, args) {
                $scope.avatar.Avatar = args.data;
            });
        }

        return {
            restrict: "A",
            //templateUrl: template,
            template: template,
            replace: true,
            scope: {},
            link: link
        }
    }
]);