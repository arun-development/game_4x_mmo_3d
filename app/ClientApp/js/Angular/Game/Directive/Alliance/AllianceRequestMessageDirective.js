Utils.CoreApp.gameApp.directive("allianceRequestMessage", ["$filter", function ($filter) {
    function link($scope, element, attrs) {
      //  console.log("allianceRequestMessage.$scope", { $scope: $scope });  
        //$scope.dateCreate = $filter("date")(new Date($scope.message.DateCreate * 1000), "dd.MM.yyyy HH:mm");
        $scope.dateCreate = $filter("date")($filter("date")(Utils.Time.GetUtcDateTimeFromSecondUtc($scope.message.DateCreate), "dd.MM.yyyy HH:mm"));
        var isCurrent = $scope.currentUserName === $scope.message.FromName;
        $scope.positionAvatarCss = isCurrent ? 'message-avatar_left' : 'message-avatar_right';
    }

    return {
        restrict: "A",
        templateUrl: "alliance-request-message.tmpl",
        replace: false,
        link: link,
        scope: {
            message: "=",
            currentUserName: "=",
            getUserProfile: "&?"
            
        }
    }
}
]);