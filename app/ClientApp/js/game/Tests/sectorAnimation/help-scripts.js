var Utils = {};
Utils.PatternFactory = {};

var GameCamera = {};
var MapAnimation = {};
var EM = {};

(function () {
    function Observer(nativeName) {
        var observer = {};

        var defaultNotifyName = nativeName;

        var observers = [];
        var observerUniqueIdFieldKey = "_observerUniqueId";
        var observerUniqueIdPrefix = "_observer_";

        function notifyAll(overageName) {
            for (var i in observers) {
                if (observers.hasOwnProperty(i)) observers[i].Update(overageName || defaultNotifyName);
            }
        }

        function subscribe(outObserver) {
            for (var i in observers) {
                if (observers.hasOwnProperty(i)) {
                    if (_.isEqual(observers[i], outObserver)) return;
                }
            }
            if (outObserver.hasOwnProperty("Update")) {
                outObserver[observerUniqueIdFieldKey] = _.uniqueId(observerUniqueIdPrefix);
                observers.push(outObserver);
            }

        };
        function unsubscribe(outObserver) {
            _.remove(observers, function (o) {
                return o[observerUniqueIdFieldKey] === outObserver[observerUniqueIdFieldKey];
            });
        }

        observer.Subscribe = subscribe;
        observer.NotifyAll = notifyAll;
        observer.Unsubscribe = unsubscribe;
        observer.GetObservers = function () {
            return observers;
        };
        return observer;
    }

    function StackCommands() {
        var stackCommands = {};
        var MAX_CAPACITY = 20;
        var stacks = [];


        function count() {
            return stacks.length;
        };

        function push(command) {
            if (count() >= MAX_CAPACITY) {
                _.remove(stacks, 0);
            }
            stacks.push(command);
        };

        function pop() {
            return stacks.pop();
        };

        function clear() {
            stacks = [];
        };

        stackCommands.Count = count;
        stackCommands.Push = push;
        stackCommands.Pop = pop;
        stackCommands.Clear = clear;

        return stackCommands;
    }

    /**
     * 
     * @param {} nativeName имя которым будут оповещены слушатели
     * @returns {object}  создает объект  Observer 
     * в метод NotifyAll по умолчанию идет переданное имя, его можно переопределить вызове NotifyAll -NotifyAll(overageName)
     * методы "Subscribe" "NotifyAll"  "Unsubscribe" 
     */
    Utils.PatternFactory.Observer = Observer;
    Utils.PatternFactory.StackCommands = StackCommands;
})();

MapAnimation._IAnimation = function (subscribeName) {
    var animation = {
        SubscribeName: subscribeName,
        SubscribeNames: {
            BaseName: subscribeName,
            Stop: subscribeName + ".Stop",
            Start: subscribeName + ".Start"
        },
        Observer: Utils.PatternFactory.Observer(subscribeName),
        Stack: Utils.PatternFactory.StackCommands(),
        Play: null,
        Stop: null
    };
    return animation;
};

EM.StarLight = {
    States: {
        Other: 1,
        InPlanet: 2,
        InSystem: 3,
        InCamera: 4
    },
    SetInSystem: null,
    SetInPlanet: null,
    SetOther: null,
    SetState: null,
    SetInCamera: null,
    _create:null
};

EM.StarLight._create = function () {
    //var light = new BABYLON.HemisphericLight("StarLight", new BABYLON.Vector3.Zero(), scene);
    //hemo.intensity = 0.05;
    var light = new BABYLON.PointLight("StarLight", new BABYLON.Vector3.Zero(), EM.Scene);
    var states = EM.StarLight.States;
    var baseSlPosition = new BABYLON.Vector3(0, 1e6, 0);
    var baseIntensity = 0.2;


    function setInCamera(intensity) {
        light.intensity = intensity || 0.6;
        light.position = GameCamera.Camera.position;
    };
    function setInPlanet() {
        light.intensity = 1;
        light.position = GameCamera.Camera.position;
    };

    function setOther() {
        light.intensity = baseIntensity;
        light.position = baseSlPosition;
    };

    function setInSystem() {
        light.intensity = 0.5;
        var csl = EstateData.GetCurrentSpaceLocation();
        // console.log("EM.CreateScene.setInSystem", ce);
        var curStar = scene.getMeshByID(MapGeometry.System.GetStarId(csl.SystemId));
        if (curStar) light.position = curStar.position;
        else setOther();
    };

    function setState(state) {
        if (!state) return;
        if (typeof state != "number") return;
        if (state === states.InSystem) {
            setInSystem();
        }
        else if (state === states.InPlanet) {
            setInPlanet();
        }
        else if (state === states.Other) {
            setOther();
        }
    };

    EM.StarLight.SetOther = setOther;
    EM.StarLight.SetInPlanet = setInPlanet;
    EM.StarLight.SetInSystem = setInSystem;
    EM.StarLight.SetState = setState;
    EM.StarLight.SetInCamera = setInCamera;


}