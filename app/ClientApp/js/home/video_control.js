//not useed
(function ($) {
    "use strict";
    return;

    function VideoControl(element, template, settings) {
        var video = element[0];
        var controls = settings.controls;
        var icons = settings.icons;

        // Активные элементы

        var mainButton = {
            button: template.find(controls.mainButton),

            show: function() {
                this.button.show();
            },

            hide: function() {
                this.button.hide();
            }
        };

        var timeline = {
            timePicked: 0,
            timeline: template.find(controls.timeLine),
            buffer: template.find(controls.timeLine).find(controls.timeLine + "-buffer"),
            progress: template.find(controls.timeLine).find(controls.timeLine + "-progress"),

            init: function(e) {
                var self = this;

                self.timeline.on("mousedown", function(e) {
                    var duration = video.duration;
                    var timelineLength = self.timeline.width();

                    self.timePicked = (e.offsetX / timelineLength) * duration;

                    video.currentTime = (e.offsetX / timelineLength) * duration;
                });
            },

            updateProgress: function() {
                var self = this;
                var currTime = video.currentTime;
                var duration = video.duration;

                self.progress.css("width", (currTime / duration) * 100 + "%");
            },

            updateBuffer: function() {
                var self = this;
                var currBuffer = 0;
                var duration = video.duration;

                if (video.buffered.length) {
                    currBuffer = video.buffered.end(0);
                }

                self.buffer.css("width", (currBuffer / duration) * 100 + "%");
            },

            reset: function() {
                this.timeline.unbind("mousedown");
                this.progress.css("width", 0);
                this.buffer.css("width", 0);
                this.init();
            }
        };

        var volume = {
            control: template.find(controls.volume),
            progress: template.find(controls.volume).find(controls.volume + "-level"),

            init: function() {
                var self = this;

                self.setVolume(video.volume);

                self.control.mousedown(function(e) {
                    var volumeLength = self.control.width();
                    var volumeLevel = e.offsetX / volumeLength;

                    self.setVolume(volumeLevel);
                });
            },

            getVolume: function() {
                return video.volume;
            },

            setVolume: function(volume) {
                if (volume < 0) volume = 0;
                if (volume > 1) volume = 1;

                video.volume = volume;
                this.progress.css("width", (volume * 100) + "%");
            }
        };

        var playButton = {
            button: template.find(controls.play),

            setPlay: function() {
                this.button.removeClass(icons.pause);
                this.button.addClass(icons.play);
            },

            setPause: function() {
                this.button.removeClass(icons.play);
                this.button.addClass(icons.pause);
            },

            reset: function() {
                this.setPlay();
            }
        };


        // События

        template.find(controls.mainButton + "," + controls.play).click(function() {
            (video.paused) ? video.play() : video.pause();
        });

        template.find(controls.fullScreen).click(function() {
            if (video.requestFullscreen) {
                video.requestFullscreen();

            } else if (video.mozRequestFullScreen) {
                video.mozRequestFullScreen();

            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            }
        });

        timeline.init();

        volume.init();


        // События плейера

        video.addEventListener("canplay", function() {
            // console.log("canplay");
        });

        video.addEventListener("progress", function() {
            timeline.updateBuffer();
        });

        video.addEventListener("timeupdate", function() {
            timeline.updateProgress();
        });

        video.addEventListener("play", function() {
            mainButton.hide();
            playButton.setPlay();
        });

        video.addEventListener("pause", function() {
            playButton.setPause();
        });

        video.addEventListener("ended", function() {
            video.currentTime = 0;
            mainButton.show();
            playButton.setPlay();
        });

        video.addEventListener("error", function(e) {
            // console.log("Error", e);

            timeline.reset();
            playButton.reset();
            video.load();
        });

        // операция (напр. воспроизведение) была отложена до завершение другой операции (напр. поиск)
        video.addEventListener("waiting", function(e) {
            // console.log("waiting");
        });

        // Отправляется, когда начинается операция поиска.
        video.addEventListener("seeking", function(e) {
            // console.log("seeking");
        });

        // операция поиска завершена.
        video.addEventListener("seeked", function(e) {
            // console.log("seeked");
        });
    }

    $.fn.videoControl = function(options) {
        var settings = $.extend({
            width: 300,
            height: 200,
            template: "#video-control",
            templateIframe: ".video-iframe",
            controls: {
                mainButton: ".video-controls-button",
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

        return this.each(function() {
            var element = $(this);
            var template = $(tmpl).clone();

            element.after(template);

            new VideoControl(element, template, settings);
        });
    };
})(jQuery);