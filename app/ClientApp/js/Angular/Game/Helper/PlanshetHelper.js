Utils.CoreApp.gameApp.service("planshetHelper", ["mainHelper",
    function(mainHelper) {
        var lastGuid;
        var timer = Date.now();
        var DELAY_OF_RUN = 200;
        var planshet;
        var scope;
        var dataIsLoaded = true;
        var firstClose = false;
        function getPlanshet() {
            if (!planshet) {
                var $planshet = $("#planshet");
                if (!$planshet || !$planshet.length) return false;
                else planshet = $planshet;
            } 
            scope = planshet.scope();
            return planshet;
        };

        function isLoaded() {
            return dataIsLoaded;
        };

        function isOpened($planshet) {
            var _planshet = $planshet||getPlanshet();
            if (!_planshet) return null;
            var state = parseInt(_planshet.css("right"));
            if (state < 5) return false;
            else return true;
        };

        function close($planshet) {
            var _planshet =$planshet|| getPlanshet();
            if (!_planshet) return null;
            _planshet.removeAttr("style");
            if (!scope.planshetToggle.opened) {
                return null;
            }
            if (firstClose) {
                EM.Audio.GameSounds.planshetClose.play();
            } else {
                firstClose = true;
            }
           

            mainHelper.applyTimeout(function () {
                scope.planshetToggle.opened = false;
            });

        }
        function open($planshet) {
            var _planshet =$planshet|| getPlanshet();
            if (!_planshet) return;
            if (scope.planshetToggle.opened) {
                return;
            }
            _planshet.css("right", 5);
            EM.Audio.GameSounds.planshetOpen.play();
          
           
            mainHelper.applyTimeout(function () {
                scope.planshetToggle.opened = true;
            });
        }


        function _shortToggle($planshet) {
            var _planshet = $planshet || getPlanshet();
            if (!_planshet) return;
 

            isOpened(_planshet) ? close(_planshet) : open(_planshet);
        };

        function toggle($planshet) {
            var _planshet =$planshet|| getPlanshet();
            if (!_planshet) return;

            if ((Date.now() - timer) < DELAY_OF_RUN) return;
            timer = Date.now();
            _shortToggle(_planshet);

        };

        function updateState(source) {
            var _planshet = getPlanshet();
            if (!_planshet) return;
            if ((Date.now() - timer) < DELAY_OF_RUN) return;
            timer = Date.now();
            var guid;
            if (!source) {
                _shortToggle(_planshet);
                return;
            } else if (source.hasOwnProperty("name")) guid = source.name;
            else guid = source;

            if (guid !== lastGuid) {
                lastGuid = guid;
                open();
                return;
            }
            _shortToggle(_planshet);
        };

        function startLoad() {
            var _planshet = getPlanshet();
            if (!_planshet) return this;
            dataIsLoaded = false;
            _planshet.find(".load-indicator").removeClass("display-none");
            return this;
        };


        function endLoad(callback) {
            var _planshet = getPlanshet();
            if (!_planshet) {
                if (callback instanceof Function) callback();
                return this;
            }
            if (dataIsLoaded) return this;
            dataIsLoaded = true;
            _planshet.find(".load-indicator").addClass("display-none");
            if (callback instanceof Function) callback();
            return this;
        };

        this.isLoaded = isLoaded;
        this.updateState = updateState;
        this.isOpened = isOpened;
        this.toggle = toggle;
        this.open = open;
        this.close = close;
        this.startLoad = startLoad;
        this.endLoad = endLoad;
    }
]);