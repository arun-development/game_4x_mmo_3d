//babylon helpers
(function () {
    var colorCoef = Utils.INT_TO_COLOR_PROP = 1 / 255;
    Utils.ObjectToVector3 = function (object) {
        return new BABYLON.Vector3(object.X, object.Y, object.Z);
    };
    Utils.ObjectToColor3 = function (object) {
        if (object.hasOwnProperty("R")) return new BABYLON.Color3(object.R, object.G, object.B);
        else if (object.hasOwnProperty("r")) return new BABYLON.Color3(object.r, object.g, object.b);
        else if (object.hasOwnProperty("X")) return new BABYLON.Color3(object.X, object.Y, object.Z);
        else if (object.hasOwnProperty("x")) return new BABYLON.Color3(object.x, object.y, object.z);
        Utils.Console.Error("ColorTypeError Utils.ObjectToColor3", { object: object, suported: "RGB, rgb, XYZ ,xyz (x=r,y=g,z=b)" });
        return false;
    };
    Utils.ObjectToColor4 = function (object) {
        if (object.hasOwnProperty("R")) return new BABYLON.Color4(object.R, object.G, object.B, object.A);
        else if (object.hasOwnProperty("r")) return new BABYLON.Color4(object.r, object.g, object.b, object.a);
    };

    Utils.Color3IntToDecimal = function (color3, scale) {
        if (!scale) scale = 1;
        return new BABYLON.Color3(color3.r * colorCoef * scale, color3.g * colorCoef * scale, color3.b * colorCoef * scale);
    };
    /**
    * @name CalcDistanceVector3
   * @description  Врзвращает расстояние междудвумя точками по каждой координате
   * @param {BABYLON.Vector3} startPoint  координаты начального меша точки отсчета текущего полоэения камеры
   * @param {BABYLON.Vector3} endPoint  координаты конечного меша относительно стартового положения
   * @returns {object} BABYLON.Vector3
   */
    Utils.CalcDistanceVector3 = function (startPoint, endPoint) {
        var x = endPoint.x - startPoint.x;
        var y = endPoint.y - startPoint.y;
        var z = endPoint.z - startPoint.z;
        return new BABYLON.Vector3(x, y, z);
    };
    Utils.CalcStepDistanceVector3 = function (startPoint, endPoint, steps) {
        var source = this.CalcDistanceVector3(startPoint, endPoint);
        var stepX = source.x / steps;
        var stepY = source.y / steps;
        var stepZ = source.z / steps;

        return new BABYLON.Vector3(stepX, stepY, stepZ);
    };

    /**
* @name Alpha
* @description Расчитывает сферическии координаты Alpha   0-1
* @param {BABYLON.Vector3} startPoint  координаты начального меша точки отсчета текущего полоэения камеры
* @param {BABYLON.Vector3} endPoint  координаты конечного меша относительно стартового положения
* @returns {number} float
*/
    Utils.CalcAlpha = function (startPoint, endPoint) {
        var startPointVector2 = new BABYLON.Vector2(startPoint.x, startPoint.z);
        var endPointVector2 = new BABYLON.Vector2(endPoint.x, endPoint.z); //        return Math.cos(new BABYLON.Angle.BetweenTwoPoints(startPointVector2, endPointVector2).degrees());
        return new BABYLON.Angle.BetweenTwoPoints(startPointVector2, endPointVector2).radians();
    };
    /**
* @name Beta
* @description Расчитывает шферическии кооржинаты Beta   0-1
* @param {BABYLON.Vector3} startPoint  координаты начального меша точки отсчета текущего полоэения камеры
* @param {BABYLON.Vector3} endPoint  координаты конечного меша относительно стартового положения
* @returns {number} float
*/
    Utils.CalcBeta = function (startPoint, endPoint) {
        var startPointVector2 = new BABYLON.Vector2(startPoint.y, startPoint.z);
        var endPointVector2 = new BABYLON.Vector2(endPoint.y, endPoint.z);
        return Math.cos(new BABYLON.Angle.BetweenTwoPoints(startPointVector2, endPointVector2).degrees());
    };

    /**
* @description  Возвращает смещение угла Beta  за  один шаг
* @param {BABYLON.Vector3} startPoint  координаты начального меша точки отсчета текущего полоэения камеры
* @param {BABYLON.Vector3} endPoint  координаты конечного меша относительно стартового положения
* @param {int} steps  количкство шагов до окончания анимации или другого действия
* @returns {float}  угол Beta
*/
    Utils.CalcBetaWhithStep = function (startPoint, endPoint, steps) {
        return this.CalcBeta(startPoint, endPoint) / steps;
    };
    /**
* @description  Возвращает смещение угла Alpha  за  один шаг
* @param {BABYLON.Vector3} startPoint  координаты начального меша точки отсчета текущего полоэения камеры
* @param {BABYLON.Vector3} endPoint  координаты конечного меша относительно стартового положения
* @param {int} steps  количкство шагов до окончания анимации или другого действия
* @returns {float}  угол Alpha
*/
    Utils.CalcAlphaWhithStep = function (startPoint, endPoint, steps) {
        return this.CalcAlpha(startPoint, endPoint) / steps;
    };
    /**
* @description  Растояние между двмя точками BABYLON.Vector3
* @param {object} startPoint BABYLON.Vector3  
* @param {object} endPoint BABYLON.Vector3
* @returns {number} float Расстояние
*/
    Utils.CalcDisntanse = function (startPoint, endPoint) {
        return BABYLON.Vector3.Distance(startPoint, endPoint);
    };
    Utils.CheckNullDistanceVector3 = function (startPoint, endPoint) {
        return 0 === BABYLON.Vector3.Distance(startPoint, endPoint);
    };

    /**
* @name AnomateCameraToTargetMeth
* @description Расчитывает точку приварпа камеры 
* @param {BABYLON.Vector3} cameraPosition координаты камеры до начала действия анимации 
* @param {BABYLON.Vector3} meshPosition координаты целевого меша
* @param {float} endRadius радиус камеры от объекта целевого меша
* @returns {BABYLON.Vector3} Координаты точки
*/
    Utils.CalcEndPoint = function (cameraPosition, meshPosition, endRadius) {
        var c = cameraPosition;
        var m2 = meshPosition;
        var distCm2 = this.CalcDisntanse(c, m2);
        var distCr = distCm2 - endRadius;
        var k = distCr / endRadius;

        if (-1 === k) {
            k = -0.99999;
        }
        var rX = (c.x + (k * m2.x)) / (1 + k);
        var rY = (c.y + (k * m2.y)) / (1 + k);
        var rZ = (c.z + (k * m2.z)) / (1 + k);
        return new BABYLON.Vector3(rX, rY, rZ);
    };
    Utils.GetColor3FromInts = function (baseColor, defaultColor) {
        if (baseColor) return BABYLON.Color3.FromInts(baseColor.r, baseColor.g, baseColor.b);
        if (defaultColor) return defaultColor;
        return new BABYLON.Color3(0, 0, 0);
    };

    Utils.SceneSelectTextureFileNames = function () {
        var items = _.map(EM.Scene.textures, function (o) {
            var q = _.split(o, "/");
            return { fileName: q[q.length - 1] };
        });
        return _.orderBy(items, "fileName", ['asc']);
    };

})();