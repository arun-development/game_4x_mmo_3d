Utils.CoreApp.gameApp.service("controlPanelSwicherHelper", ["mainHelper", function(mainHelper) {
        var spScope;
        var animateCss = "animate";

        function getScope() {
            if (spScope) {
                return spScope;
            } else {
                return spScope = angular.element("#control-panel").scope();
            }
        }

        function updateState(showHangar) { 
            var sc = getScope();
            var targetState;
            if (showHangar === undefined) {
                //  console.log("showMap");
                targetState = !sc.cpShowHangar;
            } else {
                targetState = showHangar;
            }
            var curStateIsHangar = sc.cpShowHangar;
            if (curStateIsHangar === targetState) {
                return;
            }
            mainHelper.applyTimeout(function () {
                if (curStateIsHangar) {
                    sc.cpAnimateCss = animateCss;
                    mainHelper.$timeout(function () {
                        sc.cpShowHangar = false;
                        sc.cpMapAnimateCss = animateCss;
                    }, 400);

                } else {
                    //console.log("cpShowHangar");
                    sc.cpAnimateCss = "";
                    sc.cpMapAnimateCss = "";
                    sc.cpShowHangar = true;
                }
            });  
        } 

        this.updateState = updateState;
        this.setMap = function () {
            updateState(false);
        };
        this.setHangar = function () {
            updateState(true);
        };

    }
]);