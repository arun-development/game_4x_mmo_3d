(function () {
    var load = false;
    if (load) {
        var appInsights = window.appInsights || function (config) {
            function i(config) {
                t[config] = function () {
                    var i = arguments;
                    t.queue.push(function () {
                        t[config].apply(t, i);
                    });
                }
            }

            var t = { config: config }, u = document, e = window, o = "script", s = "AuthenticatedUserContext", h = "start", c = "stop", l = "Track", a = l + "Event", v = l + "Page", y = u.createElement(o), r, f;
            y.src = config.url || "https://az416426.vo.msecnd.net/scripts/a/ai.0.js";
            u.getElementsByTagName(o)[0].parentNode.appendChild(y);
            try {
                t.cookie = u.cookie;
            }
            catch (p) {
            }
            for (t.queue = [], t.version = "1.0", r = ["Event", "Exception", "Metric", "PageView", "Trace", "Dependency"]; r.length;) i("track" + r.pop());
            return i("set" + s), i("clear" + s), i(h + a), i(c + a), i(h + v), i(c + v), i("flush"), config.disableExceptionTracking || (r = "onerror", i("_" + r), f = e[r], e[r] = function (config, i, u, e, o) {
                var s = f && f(config, i, u, e, o);
                return s !== !0 && t["_" + r](config, i, u, e, o), s
            }), t
        }({
            instrumentationKey: ""
        });

        window.appInsights = appInsights;
    }

})();


//appInsights.trackPageView();
(function () {
    var load = false;
    if (load) {
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments);
            }, i[r].l = 1 * new Date();
            a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m);
        })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

        ga('create', 'UA-79450714-1', 'auto');
        ga('require', 'linkid');
        ga('send', 'pageview');}

})();