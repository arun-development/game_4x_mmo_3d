var createScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 100, -500), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    var sphere = BABYLON.Mesh.CreateBox("sphere1", 30, scene);
    camera.speed = 20;

    // Move the sphere upward 1/2 its height
    var ground = BABYLON.Mesh.CreateGround("ground1", 500, 500, 2, scene);
    ground.visibility = 0.5;
    ground.material = new BABYLON.StandardMaterial("qwe", scene);
    ground.material.backFaceCulling = true;

    var maxRangPlanetPosition = 200;
    var plane = BABYLON.Mesh.CreatePlane("plane", 500, scene);
    plane.material = ground.material.clone();
    plane2 = plane.clone("planet2");
    plane2.rotation.y = Math.PI / 2;
    var disc = BABYLON.Mesh.CreateDisc("disc", 200, 20, scene);
    disc.rotation.x = 1.5;

    console.log(plane);
    plane.position = new BABYLON.Vector3(0, 0, 0);
    plane.visibility = 0.5;

    var defaultPlanetPosition = new BABYLON.Vector3(0, maxRangPlanetPosition / 2, 0);

    function IStarTrack() {
        var _self = this;
        this._path = [];
        this.Tes = 360;
        this._idx = 0;
        this._maxIdx = 0;
        this._intervalId = null;
        this.Position = defaultPlanetPosition.clone();
        this._light = sphere;
        this._runned = false;
        this.Update = function () {
            if (!this._runned) return;
            //   light.intensity = 1;
            if (this._idx > this._maxIdx) this._idx = 0;
            this._light.position = this._path[this._idx];
            this._idx++;
        };
        this._clearInteraval = function () {
            if (this._intervalId) clearInterval(this._intervalId);
        }
        this.Start = function () {
            this._clearInteraval();
            //  что то там запускаем 
            this._runned = true;
            this._intervalId = setInterval(function () {
                _self.Update();
            }, 10);

        };
        this.Stop = function () {
            // останавливаем рендер луп
            this._clearInteraval();
            this._runned = false;
        };
        this.IsRunned = function () {
            return this._runned;
        };

        this._createPath = function (tes) {
            if (tes) this.Tes = tes;
            var r = maxRangPlanetPosition / 2;

            var pi2 = Math.PI * 2;
            var phi = 0.4;
            // var step = _.round(pi2 / tes, 5);
            var step = pi2 / this.Tes;
            var path = [];
            var up = 5;
            for (var i = 0; i < pi2; i += step) {
                var x = r * Math.sin(i) * Math.cos(phi);//z
                var z = r * Math.cos(i);//x                
                var y = r * Math.sin(i) * Math.sin(phi);//y
                y += 1.2 * r;
                path.push(new BABYLON.Vector3(x, y, z));

            }
            path.push(path[0]);
            this._path = path;
            this._maxIdx = this._path.length - 1;

        };
        this._createPath(360);
    };
    var starTrack = new IStarTrack();
    starTrack.Start();



    return scene;

};