Utils.CoreApp.gameApp.directive("paralaxButton", [
    function() {
        // почитать https://docs.angularjs.org/error/$compile
        return {
            replace: true,
            restrict: "EA",
            scope: {
                button: "="
            },
            templateUrl: "parralax-button.tmpl",
            link: function ($scope, element, attrs, ctrl) {
                var button = $scope.button;  
                if (button && button.Method && !Utils.Event.HasClick(element) ) {
                    element.bind("click", function ($event) {
                        //console.log("paralaxButton", {
                        //    $scopeargs: arguments[0]
                        //});
                        if (button.Method instanceof Function) {
                            button.Method(button.Params, element, attrs, $scope, $event);
                        } else if (typeof button.Method == "string" && !attrs.ignore) {
                            var method = Utils.StrToRef(button.Method);
                            method(button.Params, element, attrs, $scope, $event);
 
                        }
                    });
                    
         
                }
                if (button) {
                    GameServices.paralaxButtonHelper.setHoverVoiceToButton(button);
                    $(element).hover(function (event) {
                        EM.Audio.GameSounds.defaultHover.play();
                    }, angular.noop);
                }


            }
        }
    }
]);

//scope: {
//    TranslateName: "@",
//    Controller: "@",
//    Action: "@",
//    Callbacks: "@",
//    Atributes: "@",
//    Onclick: "@",
//    IsAjax: "@",
//    CssClass: "@",
//    DataAttrs: "@",
//    ShowName: "@",
//    HasDataAttr: "@",
//    ConteinPartial: "@",
//    PartialView: "@"
//},