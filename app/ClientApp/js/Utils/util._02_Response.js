//Response
Utils.Response = {
    HomeVideo: null,
    Sizes: null
};
(function (r) {
    var sizes = {
        Small: 412,
        Medium: 768,
        Large: 1200
    };
    function Player(videoId) {
        var p = {};
        var vId = videoId;
        p.getVideo = function () {
            return document.getElementById(vId);
        }
        p.getSize = function () {
            p.size = $(window).width();
            return p.size;
        };
        p.canPlay = function () {
            return (p.getSize() > sizes.Medium);
        };
        p.onResize = function () {
            var canPlay = p.canPlay();
            var vCont = p.getVideo();
            if (canPlay) vCont.play();
            else vCont.pause();

        }
        return p;
    };
    var homeVideo = {
        Player: null,
        Init: function () {
            var dId = "homeVideoBackground";
            var v = document.getElementById(dId);
            if (!v) {
                Utils.Console.Error("VIDEO NOT EXIST");
                return;
            };
            if (!homeVideo.Player) homeVideo.Player = Player(dId);
            // toggle();
            window.addEventListener("resize", function () {
                if (homeVideo.Player && homeVideo.Player.hasOwnProperty("onResize")) {
                    homeVideo.Player.onResize();
                }
            });
            setTimeout(function () {
                homeVideo.Player.onResize();
            }, 50);
        }
    };

    r.HomeVideo = homeVideo;
    r.Sizes = sizes;
})(Utils.Response);