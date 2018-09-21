Utils.Test = {};
(function ($t) {
    $t.SizeLocalalStorage = function () {
        function gen(n) {
            return [(n * 1024) + 1].join("a");
        }

        // Determine size of localStorage if it's not set
        if (!localStorage.getItem("size")) {
            var i = 0;
            try {
                // Test up to 10 MB
                for (i = 0; i <= 10000; i += 250) {
                    localStorage.setItem("test", gen(i));
                }
            } catch (e) {
                localStorage.removeItem("test");
                localStorage.setItem("size", i ? i - 250 : 0);

            }
        }
    };
    // for or lodashForEach - Win
    $t.IterationTest = function (countInItem, repeat) {
        var tCollection = [];
        var count = countInItem || 100000;

        function create() {
            for (var i = 0; i < count; i++) {
                tCollection.push("test" + Math.random());
            }
        }

        create();

        var forinTime = 0;
        var forTime = 0;
        var customForTime = 0;
        var lodashForEach = 0;
        var lodashForIn = 0;

        function testCustomFor(coll, action) {
            var keys = Object.keys(coll);
            var length = keys.length;
            for (var i = 0; i < length; i++) {
                action(keys[i]);
            }
        }


        function _forTime() {
            var startTime = Date.now();
            var l = tCollection.length;
            for (var i = 0; i < l; i++) {
                tCollection[i] = "test" + Math.random();
            }
            return Date.now() - startTime;
        }

        function _forInTime() {
            var startTime = Date.now();
            for (var i in tCollection) {
                if (tCollection.hasOwnProperty(i)) {
                    tCollection[i] = "test" + Math.random();
                }
            }
            return Date.now() - startTime;
        }

        function _customFor() {
            var startTime = Date.now();
            testCustomFor(tCollection,
                function (key) {
                    tCollection[key] = "test" + Math.random();
                });

            return Date.now() - startTime;
        }

        function _lodashForEach() {
            var startTime = Date.now();
            _.forEach(tCollection,
                function (value, key) {
                    tCollection[key] = "test" + Math.random();
                });
            return Date.now() - startTime;
        }

        function _lodashForIn() {
            var startTime = Date.now();
            _.forIn(tCollection,
                function (value, key) {
                    tCollection[key] = "test" + Math.random();
                });
            return Date.now() - startTime;
        }


        function calc() {
            var rep = repeat || 5;
            for (var i = 0; i < rep; i++) {
                customForTime += _customFor();
                forinTime += _forInTime();
                forTime += _forTime();
                lodashForEach += _lodashForEach();
                lodashForIn += _lodashForIn();

            }
        }

        calc();
        console.log("testTime",
            {
                forInTime: forinTime,
                forTime: forTime,
                customForTime: customForTime,
                lodashForEach: lodashForEach,
                lodashForIn: lodashForIn
            });


    };
})(Utils.Test);


(function ($t) {
    /*database libs
        --js stores http:
        jsstore.net/tutorial/or

        --dexie
        http://dexie.org/docs/Tutorial/Getting-started
    --zangodb
     https://github.com/erikolson186/zangodb
     https://erikolson186.github.io/zangodb/

    */


    //PushTest

    $t.JobPushTest = function () {
        var url = "/api/Job/push";
        var r =new  Utils.Request(url, function (data) {
            console.log({ data: data });
        });
       r.getJson();

    };
    
})(Utils.Test);