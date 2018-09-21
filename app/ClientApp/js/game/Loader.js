EM.GameLoader = {};
(function (GameLoader) {
    var _preloaderId = "#scene-loader";
    var _estateLoaded = false;
    var _meshesLoaded = false;
    //var _dataLoaded = false;
    //todo debug
    var _dataLoaded = true;
    var _smoke;


    function loadAnimation() {
        "use strict";
        var processes = {};
        var loadControl = $("#scene-loader-progress");
        function updateProgress(data) {
            var process = data.currentTarget.responseURL;
            if (!processes[process]) {
                processes[process] = {
                    loaded: 0,
                    total: 0
                };
            }

            processes[process].loaded = data.loaded;
            processes[process].total = data.total;

            var progress = {
                loaded: 0,
                total: 0
            };
            _.forEach(processes, function (proces, key) {
                progress.loaded += proces.loaded;
                progress.total += proces.total;
            });

            var currReadyValue = (progress.loaded / progress.total) * 100;
            currReadyValue = (currReadyValue < 10) ? 10 : currReadyValue;
            loadControl.css("width", currReadyValue + "%");
        };


        var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        var _lodash = _,
            random = _lodash.random,
            range = _lodash.range,
            times = _lodash.times,
            assign = _lodash.assign;

        var FloatArray = window.Float32Array || Array;

        // base +/- range
        function fuzzy(range, base) {
            return (base || 0) + (Math.random() - 0.5) * range * 2;
        }

        function makeNoise(width, height) {
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');

            canvas.width = width;
            canvas.height = height;

            var imgData = ctx.getImageData(0, 0, width, height),
                data = imgData.data,
                pixels = data.length;

            for (var i = 0; i < pixels; i += 4) {
                data[i] = Math.random() * 255;
                data[i + 1] = Math.random() * 255;
                data[i + 2] = Math.random() * 255;
                //       data[i+1] = data[i];
                //     data[i+2] = data[i];
                data[i + 3] = 255;
            }
            ctx.putImageData(imgData, 0, 0);

            return canvas;
        }

        function makeOctaveNoise(width, height, octaves) {
            var canvas = document.createElement("canvas"),
                ctx = canvas.getContext("2d");

            canvas.width = width;
            canvas.height = height;

            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, width, height);

            ctx.globalAlpha = 1 / octaves;
            ctx.globalCompositeOperation = "lighter";

            for (var i = 0; i < octaves; i++) {
                var octave = makeNoise(width >> i, height >> i);
                ctx.drawImage(octave, 0, 0, width, height);
            }
            return canvas;
        }

        var defaults = {
            // maxAge: 70,
            maxAge: 20,
            exposure: 0.1,
            //  exposure: 0.9,

            //damping: 0.8,
            // damping: 0.5,
            damping: 0.1,
            noise: 1.0,
            fuzz: 5.0,
            intensity: 2.0,

            vx: 10,
            vy: 10,
            spawn: 5,
            octaves: 7,

            color: {
                r: 25,
                g: 100,
                b: 75
            },
            width: window.innerWidth,
            height: window.innerHeight,
            sppedX: 12,
            x: 0,
            y: 0
        };
        defaults.x = defaults.width * 0.5;
        defaults.y = defaults.height * 0.5;

        var Emitter = function () {
            function Emitter(options) {
                var _this = this;

                _classCallCheck(this, Emitter);

                assign(this, defaults, options);
                this.canvas = document.createElement("canvas");
                this.canvas.width = this.width;
                this.canvas.height = this.height;
                this.ctx = this.canvas.getContext("2d");

                this.noiseData = this.noiseCanvas.getContext("2d").getImageData(0, 0, this.width, this.height).data;
                this.particles = [];

                this.ctx.fillStyle = "black";
                this.ctx.fillRect(0, 0, this.width, this.height);
                this.imgdata = this.ctx.getImageData(0, 0, this.width, this.height);
                this.data = this.imgdata.data;
                this.ctx.clearRect(0, 0, this.width, this.height);

                this.hdrdata = new FloatArray(this.data.length);
                times(this.noiseData.length, function (n) {
                    _this.hdrdata[n] = 0;
                });

                this.velocity = {
                    x: random(-0.5, 0.5, true),
                    y: random(-0.5, 0.5, true)
                };
                this.update = this.update.bind(this);
            }

            _createClass(Emitter, [{
                key: "tonemap",
                value: function tonemap(n) {
                    return (1 - Math.pow(2, -n * 0.005 * this.exposure)) * 255;
                }
            }, {
                key: "getNoise",
                value: function getNoise(x, y, channel) {
                    // ~~  DOUBLE NOT BITWISE OPERATOR
                    return this.noiseData[(~~x + ~~y * this.width) * 4 + channel] / 127 - 1.0;
                }
            }, {
                key: "update",
                value: function update() {
                    var _this2 = this;

                    if (this.x < 0 || this.x > this.width) {
                        return;
                    }
                    if (this.y < 0 || this.y > this.height) {
                        return;
                    }

                    this.x += this.velocity.x;
                    this.y += this.velocity.y;

                    var x = this.x,
                        y = this.y,
                        vx = this.vx,
                        vy = this.vy,
                        width = this.width,
                        height = this.height,
                        color = this.color,
                        maxAge = this.maxAge,
                        damping = this.damping,
                        noise = this.noise,
                        fuzz = this.fuzz,
                        intensity = this.intensity,
                        spawn = this.spawn;
                    var r = color.r,
                        g = color.g,
                        b = color.b;


                    times(spawn, function (n) {
                        _this2.particles.push({
                            vx: fuzzy(vx),
                            vy: fuzzy(vy),
                            x: x,
                            y: y,
                            age: 0
                        });
                    });

                    var alive = [];

                    this.particles.forEach(function (p) {
                        p.vx = p.vx * damping + _this2.getNoise(p.x, p.y, 0) * 4 * noise + fuzzy(0.1) * fuzz;
                        p.vy = p.vy * damping + _this2.getNoise(p.x, p.y, 1) * 4 * noise + fuzzy(0.1) * fuzz;
                        p.age++;
                        times(10, function (x) {
                            p.x += p.vx * 0.1;
                            p.y += p.vy * 0.1;
                            var index = (~~p.x + ~~p.y * width) * 4;
                            _this2.data[index] = _this2.tonemap(_this2.hdrdata[index] += r * intensity);
                            _this2.data[index + 1] = _this2.tonemap(_this2.hdrdata[index + 1] += g * intensity);
                            _this2.data[index + 2] = _this2.tonemap(_this2.hdrdata[index + 2] += b * intensity);
                        });
                        if (p.age < maxAge) {
                            alive.push(p);
                        }
                    });
                    this.ctx.putImageData(this.imgdata, 0, 0);
                    this.particles = alive;
                }
            }]);
            return Emitter;
        }();

        var requestFrameId = void 0;
        var Smoke = function () {
            function Smoke(container) {
                _classCallCheck(this, Smoke);
                var canvas = container;

                var width = defaults.width;
                var height = defaults.height;

                // console.log(width, height);
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext('2d');

                var y = canvas.height * 0.5;
                var noiseCanvas = makeOctaveNoise(width, height, defaults.octaves);

                var green = new Emitter({
                    name: "left",
                    maxAge: 100,
                    width: canvas.width,
                    height: canvas.height,
                    damping: 0.75,
                    exposure: 0.05,
                    intensity: defaults.intensity,
                    noiseCanvas: noiseCanvas
                });

                green.x = 0;
                green.y = y;
                green.velocity.x = defaults.sppedX;
                green.velocity.y = 0;
                this.canvas = canvas;
                this.ctx = ctx;
                this.emitters = [green];
                //this.emitters.push(green2, blue2, white2);

                this.update = this.update.bind(this);
                this.loop = this.loop.bind(this);
                this.loop();
            }

            _createClass(Smoke, [{
                key: "update",
                value: function () {
                    var _this3 = this;

                    var ctx = this.ctx,
                        canvas = this.canvas;

                    ctx.globalCompositeOperation = 'normal';
                    ctx.fillStyle = 'rgba(5, 15, 16, 1.00)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    //  this.ctx.globalCompositeOperation = 'lighter';
                    this.emitters.forEach(function (emitter) {
                        emitter.update();
                        _this3.ctx.drawImage(emitter.canvas, 0, 0);
                        emitter.ctx.restore();
                    });
                }
            }, {
                key: "loop",
                value: function () {
                    this.update();
                    requestFrameId = requestAnimationFrame(this.loop);
                }
            }, {
                key: "stop",
                value: function () {
                    if (requestFrameId) {
                        window.cancelAnimationFrame(requestFrameId);
                        this.ctx.restore();
                        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                        //   console.log("stop", requestFrameId);
                    }
                }
            }]);

            return Smoke;
        }();
        _smoke = new Smoke(document.getElementById("demo"));
    };

    function hidePreloader() {
        $(EM.EstateContainerId).prepend(EM.Canvas);
        EM.Engine.resize();
        var preloader = $(_preloaderId);
        preloader.css("opacity", 0);

        setTimeout(function () {
            _smoke.stop();
            preloader.addClass("display-none");
            $("#scene-loader").remove();
          //  EM.Audio.GameSounds.mainFone.play();
            EM.GameLoader = null;
            delete EM.GameLoader;
        }, 2000);

    }

    function update(subscriber) {
        if (EM.SubscribeName === subscriber) _estateLoaded = true;

        // if ("DataLoaded" === subscriber) _dataLoaded = true;

        if (_estateLoaded) {
            _estateLoaded = false;
            EM.Observer.Unsubscribe(GameLoader);
        };
        if ("LoadMeshes" === subscriber) _meshesLoaded = true;

        if (_meshesLoaded && _dataLoaded) {
            EM.StartRender();
            //   console.log("GameLoader.update _meshesLoaded && _dataLoaded");
            GameServices.mapControlHelper.jumpToMother(null, null, null, null, true);
            _meshesLoaded = false;
            _dataLoaded = false;

        }
        if ("MotherJumped" === subscriber) {
            hidePreloader();
        }
    }


    GameLoader.Update = update;
    GameLoader.Load = function (data) {
        var scope = angular.element("#Game").scope();
        scope.gameCtrl.loadGame(data);
        EM.Observer.Subscribe(GameLoader);
        EM.CreateScene(data, GameServices.mainGameHubService);

    };
    GameLoader.loadAnimation = loadAnimation;

})(EM.GameLoader);
