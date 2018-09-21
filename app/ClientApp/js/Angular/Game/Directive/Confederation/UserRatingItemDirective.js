Utils.CoreApp.gameApp.directive("userRatingItem", [
    function () {
        return {
            restrict: "E",
            templateUrl: "confederation-user-rating-item.tmpl",
            replace: true,
            scope: {
                user: "=",
                getUserInfo: "&"

            },

        };
    }
]);