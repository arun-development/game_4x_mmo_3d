(function ($) {

    "use strict";

    var ytButton = {};
    var timeline = {};
    var volume = {};
    var playButton = {};

    function YoutubeControl(element, template, settings) {
        var player;

        var controls = settings.controls;
        var icons = settings.icons;
        var playerState = YoutubeControl.PlayerState;

        function getVideoId(source) {
            var videoId = source.substr(source.lastIndexOf("/") + 1);

            if (videoId.indexOf("?") !== -1) {
                return videoId.substr(0, videoId.indexOf("?"));
            }

            return videoId;
        }

        ytButton = {
            button: template.find(controls.videoButton),

            show: function() {
                this.button.show();
            },

            hide: function() {
                this.button.hide();
            }
        };

        timeline = {
            timeline: template.find(controls.timeLine),
            progress: template.find(controls.timeLine).children(),
            timer: 0,
            INTERVAL_UPDATE: 40,

            init: function(e) {
                var $self = this;
                var duration = player.getDuration();

                $self.timeline.mousedown(function(e) {
                    var timelineLength = $self.timeline.width();
                    var second = Math.floor((e.offsetX / timelineLength) * duration);

                    $self.setTimePoint(second);
                });
            },

            setTimePoint: function(second) {
                player.seekTo(second, true);
            },

            play: function() {
                var $self = this;
                var duration = player.getDuration();

                $self.timer = setTimeout(function() {
                    var currTime = player.getCurrentTime();
                    $self.progress.css("width", (currTime / duration) * 100 + "%");

                    $self.timer = setTimeout($self.play.call($self), $self.INTERVAL_UPDATE);
                }, $self.INTERVAL_UPDATE);
            },

            pause: function() {
                clearTimeout(this.timer);
                player.pauseVideo();
            }
        };

        volume = {
            control: template.find(controls.volume),
            progress: template.find(controls.volume).children(),

            init: function() {
                var $self = this;

                $self.setVolume(player.getVolume());

                $self.control.mousedown(function(e) {
                    var volumeLength = $self.control.width();
                    var volumeLevel = Math.floor((e.offsetX / volumeLength) * 100);

                    $self.setVolume(volumeLevel);
                });
            },

            getVolume: function() {
                return player.getVolume();
            },

            setVolume: function(volume) {
                if (volume < 0) volume = 0;
                if (volume > 100) volume = 100;

                player.setVolume(volume);
                this.progress.css("width", volume + "%");
            }
        };

        playButton = {
            button: template.find(controls.play),

            setPlay: function() {
                this.button.removeClass(icons.pause);
                this.button.addClass(icons.play);
            },

            setPause: function() {
                this.button.removeClass(icons.play);
                this.button.addClass(icons.pause);
            }
        };

        template.find(controls.videoButton + "," + controls.play).click(function() {
            switch (player.getPlayerState()) {
            case playerState.ENDED:
            case playerState.PAUSED:
            case playerState.CUED:
            case playerState.NO_PLAIED:
                player.playVideo();
                break;

            case playerState.PLAYING:
                player.pauseVideo();
                break;

            default:
            }
        });

        template.find(controls.fullScreen).click(function() {
            var iframe = player.getIframe();

            if (iframe.requestFullscreen) {
                iframe.requestFullscreen();

            } else if (iframe.mozRequestFullScreen) {
                iframe.mozRequestFullScreen();

            } else if (iframe.webkitRequestFullscreen) {
                iframe.webkitRequestFullscreen();

            } else if (iframe.msRequestFullscreen) {
                iframe.msRequestFullscreen();
            }
        });


        // создаем элементы управления на youtube-блоке
        var videoId = getVideoId(element.attr("src"));
        var videoName = element.attr("name");

        template.replaceAll(element)
            .find(settings.templateIframe)
            .append($("<div>", {
                id: videoId,
                name: videoName
            }));


        /* Внешний интерфейс */

        this.id = videoId;

        this.setPlayer = function(p) {
            player = p;
        };
    }

    YoutubeControl.PlayerState = {
        NO_PLAIED: -1,
        ENDED: 0,
        PLAYING: 1,
        PAUSED: 2,
        CUED: 5
    };

    $.fn.youtubeControl = function(options) {
        var settings = $.extend({
            width: 300,
            height: 200,
            template: "#video-control",
            templateIframe: ".video-iframe",
            controls: {
                videoButton: ".video-controls-button",
                timeLine: ".time-line",
                play: ".button-play",
                volume: ".volume-control",
                fullScreen: ".button-full-screen"
            },
            icons: {
                play: "glyphicon-play",
                pause: "glyphicon-pause"
            }
        }, options);

        var tmpl = $(settings.template).html();

        var yControls = [];

        this.each(function() {
            var element = $(this);
            var template = $(tmpl).clone();

            yControls.push(new YoutubeControl(element, template, settings));
        });

        window.onYouTubeIframeAPIReady = function () {
            _.forEach(yControls, function(control, key) {
                var player = new YT.Player(control.id, {
                    playerVars: {
                        autoplay: 0,
                        controls: 0,
                        rel: 0
                    },
                    videoId: control.id,
                    events: {
                        onReady: function() {
                            onPlayerReady.apply(player);
                        },
                        onStateChange: onPlayerStateChange,
                        //onError: onPlayerError
                    }
                });

                var iframe = $(player.getIframe());
                iframe.css("height", iframe.width() * 9 / 16);
                control.setPlayer(player);
            });
 
        };

        function onPlayerReady() {
            var t = this;
            t.hideVideoInfo();
            volume.init();
            timeline.init();
        }

        function onPlayerStateChange(e) {
            if (e.data === YT.PlayerState.PLAYING) {
                timeline.play();
                ytButton.hide();
                playButton.setPlay();
            }

            if (e.data === YT.PlayerState.PAUSED) {
                timeline.pause();
                playButton.setPause();
            }

            if (e.data === YT.PlayerState.ENDED) {
                ytButton.show();
                playButton.setPlay();
            }
        }

        $("#scripts").append($("<script>", {src: "https://www.youtube.com/iframe_api"}));
    };
})(jQuery);