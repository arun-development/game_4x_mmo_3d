function changeFooterPosition() {
    var bodyHeight = getBodyHeight();
    var windowHeight = getWindowHeight();
    if ('fixed' === $('#footer').css('position')) {
        bodyHeight = bodyHeight + getFooterHeight();
    }

    if (bodyHeight < windowHeight) {
        $('#footer').addClass('down_footer');

    } else {
        $('#footer').removeClass('down_footer');
    }
}

function getBodyHeight() {
    return document.body.offsetHeight;
}

function getWindowHeight() {
    return document.documentElement.clientHeight;
}

function getFooterHeight() {
    return document.getElementById('footer').clientHeight;
}

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


        // ������� �������� ���������� �� youtube-�����
        var videoId = getVideoId(element.attr("src"));
        var videoName = element.attr("name");

        template.replaceAll(element)
            .find(settings.templateIframe)
            .append($("<div>", {
                id: videoId,
                name: videoName
            }));


        /* ������� ��������� */

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
var HomeScroller = {
    _wheel: false,
    _isWebkit: null,
    _scrollTop: null,

    _windowDom: null,
    _documentDom: null,

    _DocH: null,
    _getDocH: function() {
        return HomeScroller._documentDom.height() - HomeScroller._windowDom.height();
        //this._DocH = HomeScroller._documentDom.height() - HomeScroller._windowDom.height();
        //        return this._DocH;
    },
    _lastTouchY: 0,
    StopScroll: function(e) {
        $(HomeScroller._isWebkit ? "body" : "html").stop();
    },
    SetEventScroll: function(e) {

        var delta = -e.originalEvent.detail / 3 || e.originalEvent.wheelDelta / 120;
        HomeScroller._wheel = true;

        HomeScroller._scrollTop = Math.min(HomeScroller._getDocH(), Math.max(1, parseInt(HomeScroller._scrollTop - delta * 400)));
        //        $(HomeScroller._isWebkit ? "body" : "html").stop().animate({ scrollTop: HomeScroller._scrollTop + "px" }, 1000, "easeOutQuint", function () { HomeScroller._wheel = false; });


        return false;
    },

    _isNotScrolable: function() {
        return /*$("html").hasClass("touch") ||*/ $("html").hasClass("ie");
    },
    _iframeResize: function() {
        var iframe = $("#videoStory iframe");
        var w = iframe.width();

        function resize(width) {
            var newHeight = width * (9 / 16);
            iframe.height(newHeight);
        }

        if (w === 300) {
            var t = setInterval(function() {
                if (w !== 300) {
                    resize(w);
                    clearInterval(t);
                }

            }, 40);
        } else resize(w);


    },
    _scroller: function() {
        //window
        var _windowDom;
        var _documentDom;

        this._windowDom = _windowDom = $(window);
        this._documentDom = _documentDom = $(document);
        var $self = this;
        // General vars
        var scrolable = false;

        //document selectors
        var homePageSelector = "#home_page";
        var homeScrollerSelector = "#home_scroller";
        var indicatorNavSelector = ".indicator-nav";
        var scrollButtonSelector = "#scrollButton";
        var headerSelector = "#header";
        var videoContainerItemsSelector = "#vid_cont_items";
        var articleHeadSelector = ".articleHead";

        //css
        var opacityPlusCss = "opacityPlus";
        var opacityMinusCss = "opacityMinus";
        var activeCssClass = "active";


        //doms
        var homePageDom = $(homePageSelector);
        var homeScrollerDom = $(homeScrollerSelector);
        var indicatorNavDom = $(indicatorNavSelector);
        var scrollButtonNav = $(scrollButtonSelector);
        var videoContainerDom = $(videoContainerItemsSelector);
        var headerDom = $(headerSelector);
        var articleHeadDoms = $(articleHeadSelector);


        $self._isWebkit = false;
        if (navigator.userAgent.indexOf("AppleWebKit") !== -1) {
            $self._isWebkit = true;
        }


        $self._wheel = false,
        //self._scrollTop = (self._isWebkit ? _documentDom : _windowDom).scrollTop();
        $self._scrollTop = homePageDom.scrollTop();

        //====================================
        $.fn.scrollEnd = function(callback, timeout) {
            $(this).scroll(function() {
                scrolable = true;
                var $this = $(this);
                if ($this.data("scrollTimeout")) {
                    clearTimeout($this.data("scrollTimeout"));
                    clearTimeout($this.data("clearScrollingBool"));
                }
                $this.data("scrollTimeout", setTimeout(callback, timeout));
                $this.data("clearScrollingBool", setTimeout(function() {
                    scrolable = false;
                }, timeout));
            });
        };

        $.fn.scrollStart = function(callback, timeout) {
            $(this).scroll(function() {
                if (!scrolable) callback();
                scrolable = true;

                var $this = $(this);
                if ($this.data("scrollTimeout")) {
                    clearTimeout($this.data("scrollTimeout"));
                }
                $this.data("scrollTimeout", setTimeout(function() {
                    scrolable = false;
                }, timeout));
            });
        };

        homePageDom.scrollStart($self._getDocH, 100);

        jQuery.extend(jQuery.easing, {
            easeOutQuint: function(x, t, b, c, d) {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            }
        });


        var sections;

        function getSectionPosition() {
            sections = {};
            $(homeScrollerSelector).children("section").each(function() {
                var name = $(this).attr("name");
                if (name) {
                    var top = $(this).offset().top;
                    sections[top] = name;
                }
            });

            $(homeScrollerSelector).scrollTop($(window).scrollTop);
        }


        if (!Utils.Event.HasResize(_windowDom)) {
            _windowDom.bind("resize", function() {
                getSectionPosition();
                $self._iframeResize();
            });
        };


        videoContainerDom.find("img").addClass(opacityPlusCss);

        // setTimeout(getSectionPosition, 100);


        function hideOrShowAdvancedContent(windowpos) {
            if (windowpos >= 200) {
                videoContainerDom.addClass(opacityMinusCss); // logo
                scrollButtonNav.addClass(opacityPlusCss); // mouse scroll icon

                homePageDom.find(".img_layer2").addClass(opacityPlusCss); // background
                headerDom.addClass("black");

            } else {
                videoContainerDom.removeClass(opacityMinusCss); // logo
                scrollButtonNav.removeClass(opacityMinusCss);

                homePageDom.find(".img_layer2").removeClass(opacityPlusCss); // background
                headerDom.removeClass("black");
            }
        }


        function onScroll(plugin) {
            var windowpos = (plugin.mcs) ? -plugin.mcs.top : plugin.scrollTop();
            var winHeight = homePageDom.height();
            if (_.isEmpty(sections)) getSectionPosition();

            $self._scrollTop = windowpos;

            var i = 1;

            _.forEach(sections, function(sectionName, top) {
                if (windowpos + winHeight / 2 < top) return false;
                if (windowpos + winHeight <= top && i === 1) {
                    //  indicatorNavDom.find(".line").removeClass(activeCssClass);
                }


                indicatorNavDom.find(".line").removeClass(activeCssClass);
                $("a[href*=\"#" + sectionName + "\"]").next().addClass(activeCssClass);

                i++;
            });

            if (windowpos >= 1) scrollButtonNav.addClass(opacityMinusCss);
            else scrollButtonNav.removeClass(opacityMinusCss);
            hideOrShowAdvancedContent(windowpos);
        }


        hideOrShowAdvancedContent($self._scrollTop);

        if (!Utils.Event.HasScroll(homePageDom)) {
            // homePageDom.bind("DOMMouseScroll mousewheel", self.SetEventScroll);

            if ($self._isNotScrolable()) {
                homePageDom.scroll(function() {
                    onScroll($(this));
                });

            }
            else {
                homePageDom.mCustomScrollbar({
                    scrollbarPosition: "outside",
                    documentTouchScroll: true,
                    advanced: {
                        autoExpandHorizontalScroll: 3
                    },
                    mouseWheel: {
                        enable: true,
                        scrollAmount: 700
                    },
                    keyboard: {
                        scrollType: "stepless",
                        scrollAmount: 10
                    },
                    callbacks: {
                        whileScrolling: function() {
                            onScroll(this);
                        }
                    }
                });
            }
        }

        function setScrollToSection(ancor) {
            homePageDom.mCustomScrollbar("scrollTo", ancor);
        };

        if (!$self._isNotScrolable()) {

            
            indicatorNavDom.find("a").click(function(event) {
                var menuItem = $(event.target);
                var link = null;
                for (var i = 0; i < 2; i++) {
                    link = menuItem.attr("href");
                    if (link) break;
                    menuItem = menuItem.parent();
                };

                if (!link || link.indexOf("#") === -1) return true;


                var labelPosition = link.indexOf("#");
                var itemName = link.substring(labelPosition + 1);

                setScrollToSection($("#" + itemName));
                return false;
            });
            var mouseIndicatorMove = $("#scrollButton .mouse-scroll");
            mouseIndicatorMove.click(function (e) {
                setScrollToSection($("#feature"));
                return false;
            });
        }

        function setScrolFromHead(idx, elem) {
            var source = $(elem);

            function scrollTo() {
                setScrollToSection(source.parents("section"));
            }

            source.click(scrollTo);
        };

        articleHeadDoms.each(setScrolFromHead);

    },
    Init: function() {
        var $self = this;
        $(document).ready(function() {
            $self._scroller();
            $self._iframeResize();
        });

    }
};


// �������� �� ���������
(function($) {
    $.fn.hasScrollBar = function() {
        return this.get(0) ? this.get(0).scrollHeight > this.innerHeight() : false;
    };
})(jQuery);
function HomeResaizer() {
    var winWidth = $(window).width();
    var minWinWidth = 1199;

    function resizeTextContainer(addAttr) {
        var raceSelector = $("#race").find(".row");
        var targetName = "[data-type=text]";
        var items = raceSelector.children();
        var maxHeight = 0;

        items.each(function() {
            var height = $(this).find(targetName).height();

            if (maxHeight < height) {
                maxHeight = height;
            }
        });

        if (addAttr) {
            items.find(targetName).css("height", maxHeight);
        }    
        else {
            items.find(targetName).removeAttr("style");
        }
    }

    if (winWidth > minWinWidth) {
        resizeTextContainer(true);
    }


    $(window).on("resize", function (event) {
       winWidth = event.target.innerWidth;
      (winWidth > minWinWidth)?resizeTextContainer(true):  resizeTextContainer(false);        
    });
    resizeTextContainer(false);


}
function HomeCarousel() {
    var webP = Modernizr.webp;

    if (!$("#home-carousel").length > 0) {
        return;
    }


    var collectionString = $("#imgCollection").data("collection");
    if (!webP) { 
        collectionString = collectionString.replace(/webp/gi, "jpg");

        console.log(collectionString);
    }
    var collection = collectionString.split(",");

    var slidesBlock = $("#home-carousel").find(".carousel-inner:first");
    var indicatorsBlock = $("#imgNav");


    var attrAlt = " alt=\"";
    var attrTitle = " title=\"";
    var attrBigSlide = " data-index=\"";
    var attrIndicator = " data-target=\"#home-carousel\" data-slide-to=\"";
    var attrSrc = " src=\"";
    var attrGroup = " data-group=\"";
    var closeAttr = "\" ";


    function correctGroupIndex(index, min, max) {
        return (index < min) ? min :
        (max < index) ? max : index;
    }

    function getGroupCollection(baseCollection) {
        var objecCollection = [];
        var counterGroup = 0;
        var count = 6;
        for (var m = 0; m < baseCollection.length; m++) {
            if (m === 0) {
                count = 6;
            }

            if (!objecCollection[counterGroup]) {
                objecCollection[counterGroup] = [];
            }

            var item = baseCollection[m];
            item.dataGroup = attrGroup + counterGroup + closeAttr;

            objecCollection[counterGroup].push(item);

            count--;

            if (count === 0) {
                counterGroup++;
                count = 6;
            }
        }

        return objecCollection;
    }

    function getItemCollection(itemsCollection) {
        var itemCollection = [];
        for (var i = 0; i < itemsCollection.length; i++) {


            var url = itemsCollection[i];
            var fileName = getFileName(url, 4);
            var minFileUrl = getMinFile(url);

            itemCollection[i] = {
                alt: attrAlt + fileName + closeAttr,
                title: attrTitle + fileName + closeAttr,
                targetImage: attrSrc + url + closeAttr,
                indicatorImage: attrSrc + minFileUrl + closeAttr,
                dataBigSlide: attrBigSlide + i + closeAttr,
                dataIndicator: attrIndicator + i + closeAttr,
                dataGroup: null
            };
        }
        return itemCollection;
    }

    function bigSlideTemplate(params) {
        var template = "<div class=\"item\"" + params["dataBigSlide"] + params["dataGroup"] + "><img " + params["targetImage"] + params["alt"] + params["title"] + "></div>";

        //    template = $("<div/>", {
        //        "class": "item",
        //        params[]:

        //});
        return template;
    }

    function indicatorTemplate(params) {
        var template = "<div class=\"transition col-xs-2 col-md-2\"" + params["dataIndicator"] + params["dataGroup"] + " style=\"left:0%;\"><a class=\"thumbnail\"><img " + params["indicatorImage"] + params["alt"] + params["title"] + "></a></div>";

        return template;
    }

    function creteView(group) {
        function buildHtml(_group, handler) {
            var view = "";

            for (var i = 0; i < _group.length; i++) {
                var params = group[i];

                view += handler(params);
            }
            return view;
        };

        var bigSliders = buildHtml(group, bigSlideTemplate);
        var indicators = buildHtml(group, indicatorTemplate);

        slidesBlock.append(bigSliders);
        indicatorsBlock.append(indicators);
    }

    function existsGroup(group) {
        var items = slidesBlock.find('[data-group=' + group + ']');

        if (0 < items.length) {
            return true;
        }

        return false;
    }

    function existsNextIndex(index) {
        var items = slidesBlock.find('[data-index=' + index + ']');

        if (0 < items.length) {
            return true;
        }

        return false;
    }

    function animateDirection(targetGroupIndex) {
        var rateOffset = 1 / 6;
        var collectionOffset = targetGroupIndex * 600 * rateOffset;
        $("[data-slide-to]").css("left", "-" + collectionOffset + "%");

    }

    var itemCollection = getItemCollection(collection);
    var workCollection = getGroupCollection(itemCollection);

    (function() {
        if ($("#home_scroller")) {
            creteView(workCollection[0]);
            $("[data-index=0]").addClass("active");
            $("[data-slide-to=0]").addClass("active");
        }

    })();


    $("#home-carousel").find(".left").on("click", function() {
        var currIndex = $("#home-carousel").find(".active[data-index]").data("index");

        if (0 === currIndex) {
            return false;
        }
    });

    var isLastElem = false;

    $("#home-carousel").on("slide.bs.carousel", function(event, state) {
        var direction = 0;

        switch (event.direction) {
        case 'left':
            direction = 1;
            break;

        case 'right':
            direction = -1;
            break;

        default:
            direction = 0;
        }

        var currSlide = event.relatedTarget;
        var currIndex = $(currSlide).data("index");
        var currGroup = $(currSlide).data("group");


        $("[data-slide-to]").removeClass("active");
        $("[data-slide-to=" + currIndex + "]").addClass("active");

        var nextGroup = correctGroupIndex((currGroup + direction), 0, (workCollection.length - 1));

        var currGroupCount = workCollection[currGroup].length;
        var firstIndex = (currGroup * currGroupCount);
        var lastIndex = (currGroup * currGroupCount) + (currGroupCount - 1);

        if (!existsGroup(nextGroup)) {
            creteView(workCollection[nextGroup]);
        }

        if ((currIndex === firstIndex || currIndex === lastIndex)) {
            animateDirection(nextGroup);
        }

        if (!existsNextIndex(currIndex + 1)) {
            isLastElem = true;

        } else if (direction > 0 && isLastElem) {
            animateDirection(0);
            isLastElem = false;
        }
    });
}; 

function getFileName(url, prefixCount) {
    var pos = url.lastIndexOf('/');

    if (pos === -1) {
        return '';
    }

    var fileName = url.slice(pos + 1 + prefixCount, -4);

    fileName = fileName.toLowerCase().replace(/\b[a-zа-я]/g, function(letter) {
        return letter.toUpperCase();
    });

    return fileName;
}

function getMinFile(url) {
    var pos = url.lastIndexOf('/');

    if (pos === -1) {
        return "";
    } 
    var dir = url.slice(0, pos);
    var fileName = url.slice(pos + 1);  
    return dir + "/min/" + fileName;
};