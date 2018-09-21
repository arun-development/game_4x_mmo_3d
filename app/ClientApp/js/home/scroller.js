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


// проверка на прокрутку
(function($) {
    $.fn.hasScrollBar = function() {
        return this.get(0) ? this.get(0).scrollHeight > this.innerHeight() : false;
    };
})(jQuery);