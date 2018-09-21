Utils.CoreApp.gameApp.directive("userElectionItem", [
    function () {
        return {
            restrict: "E",
            templateUrl: "confederation-user-election-item.tmpl",
            replace: true,
            scope: {
                user: "=",
                getUserInfo: "&",
                isRegistredPeriod: "=",
                canSendVoice: "=",
                sendVoice:"="

            },

        };
    }
]);