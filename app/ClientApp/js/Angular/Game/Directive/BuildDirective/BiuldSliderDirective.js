Utils.CoreApp.gameApp.directive("biuldSlider", [
    function () {
        function link($scope, element, attrs, ctrl) {
            var register = $scope.registerSlider();
            if (element.hasOwnProperty("slider")) {
                element.slider("destroy");
            }

            register(element, $scope);
        }

        return {
            restrict: "A",
            scope: {
                registerSlider: "&",
                sliderData: "="
            },
            link: link
        };
    }
]);