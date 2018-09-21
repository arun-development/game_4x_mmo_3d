EM.MapAnimation = {};
//#region BASE Анимация камеры и состояний и базовые методы
// Анимация камеры и состояний
(function (MapAnimation) {
    var animationNames = {
        CameraChangeTarget: "CameraChangeTarget",
        CameraChangeRadius: "CameraChangeRadius"
    };

    var easingTypes = {
        linear: 1,
        easeIn: 2,
        easeInOut: 3
    }

    function IAnimation(subscribeName) {
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

    function getEasingByType(easingType) {
        var easing;
        if (!easingType) easingType = easingTypes.easeInOut;
        if (easingType === easingTypes.easeInOut) {
            easing = new BABYLON.CubicEase();
            easing.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
            return easing;
        }
        if (easingType === easingTypes.linear) {
            return null;
        }

        if (easingType === easingTypes.easeIn) {
            easing = new BABYLON.CubicEase();
            easing.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);
            return easing;
        }
        return null;
    };


    function animationCameraTarget(source, target, easing, frames, fps) {
        var animateCameraTarget = new BABYLON.Animation(animationNames.CameraChangeTarget, "target", fps,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keys = [
            {
                frame: 0,
                value: source
            },
            {
                frame: frames,
                value: target
            }
        ];
        animateCameraTarget.setKeys(keys);

        if (easing) {
            animateCameraTarget.setEasingFunction(easing);
        }

        //animateCameraTarget.enableBlending = true;
        //animateCameraTarget.blendingSpeed = 1;
        EM.GameCamera.Camera.animations.push(animateCameraTarget);
        return animateCameraTarget;
    }

    function animationCameraRadius(endRadius, easing, frames, fps) {
        var currentRadius = EM.GameCamera.Camera.radius;
        var animateCameraRadius = new BABYLON.Animation(animationNames.CameraChangeRadius, "radius", fps, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keys2 = [
            {
                frame: 0,
                value: currentRadius
            },
            {
                frame: frames,
                value: endRadius
            }
        ];

        animateCameraRadius.setKeys(keys2);
        if (easing) {
            animateCameraRadius.setEasingFunction(easing);
        }

        //animateCameraRadius.enableBlending = true;
        //animateCameraRadius.blendingSpeed = 1;
        //console.log("animateCameraRadius", { animateCameraRadius: animateCameraRadius });
        EM.GameCamera.Camera.animations.push(animateCameraRadius);
        return animateCameraRadius;
    }

    function zoomToPlanetoid(planetoid) {
        console.log("zoomToPlanetoid", {
            planetoid: planetoid
        });
        //todo есть баг функция вавилона ставит 
        //в позицию меньшую чем это определенно в фаиле конфига.
        //Будет исправленно с добавлением функции анимации
        EM.GameCamera.Camera.zoomOn([planetoid], true);
    };




    function moveToMesh(targetMesh, endRadius, onAnimationEnd, animationTime, easingType) {
        if (!(onAnimationEnd instanceof Function)) onAnimationEnd = function () { };
        var source = EM.GameCamera.Camera.target.clone();
        var m2 = targetMesh.getAbsolutePivotPoint();     //var easing = new BABYLON.PowerEase(7);

        var cT;
        var easing = getEasingByType(easingType);

        var frames = 30;
        var time = animationTime || 1.5;
        var fps = frames / time;
        if (!Utils.CheckNullDistanceVector3(source, m2)) {
            cT = animationCameraTarget(source.clone(), m2.clone(), easing, frames, fps);
        }
        var cR = animationCameraRadius(endRadius, easing, frames, fps);
        function onStop() {
            _.remove(EM.GameCamera.Camera.animations, function (o) {
                return o === cT || o === cR;
            });

            cT = null;
            cR = null;
            onAnimationEnd();
        }
        EM.Scene.beginAnimation(EM.GameCamera.Camera, 0, frames, false, 1.0, onStop);
 

    }

    function moveToPlanetoid(targetMesh, endRadius, onAnimationEnd) {
        moveToMesh(targetMesh, endRadius, onAnimationEnd, 0.5, easingTypes.linear);
    };

    function moveToMother(targetMesh, endRadius, onAnimationEnd) {
        if (!!EM.GameLoader) {
            function animationDone() {
                onAnimationEnd();
                EM.GameLoader.Update("MotherJumped");
            }
            moveToMesh(targetMesh, endRadius, animationDone);
        } else moveToMesh(targetMesh, endRadius, onAnimationEnd,0.5);

    }

    //todo  на удаление?
    var sectorStarInfo = {};
    MapAnimation.SectorStarInfo = sectorStarInfo;


    MapAnimation.MoveToPlanetoid = moveToPlanetoid;
    MapAnimation.ZoomToPlanetoid = zoomToPlanetoid;
    MapAnimation.MoveToMother = moveToMother;
    MapAnimation.MoveToMesh = moveToMesh;
    MapAnimation.AnimationCameraTarget = animationCameraTarget;
    MapAnimation.AnimationCameraRadius = animationCameraRadius;


    MapAnimation._IAnimation = IAnimation;
    MapAnimation.EasingTypes = easingTypes;
})(EM.MapAnimation);
//#endregion

 
//todo  Пример активной анимации
/*
function MapAnimation() {
    var _scene = MapV.manage.engine.scenes[0];

    var _camera = _scene.activeCamera;

    function calculateFrames(fps, time) {
        return Math.ceil(fps * time);
    };

    function firstPartSectorZoom(mesh) {
        var durationRotateCamera = 0.1;
        var _fps = 25;
        var endFrame = calculateFrames(_fps, durationRotateCamera);

        //        var bezierEase = new BABYLON.BezierCurveEase(0, .9, 0, .92);
        //        var easingFunction = new BABYLON.CircleEase();

        var animation = new BABYLON.Animation("sectorAnimation", "target", _fps, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
        var keys = [];
        keys.push({
            frame: 0,
            value: _camera.target
        });
        keys.push({
            frame: endFrame,
            value: mesh.position
        });

        animation.setKeys(keys);

        //Then add the animation object to box1
        _camera.animations.push(animation);

        //Finally, launch animations on box1, from key 0 to key 100 with loop activated
        _scene.beginAnimation(_camera, 0, endFrame, false);
    }

    function secondPartSectorZoom() {
        var durationRangeCamera = 0.5;
        var _fps = 25;
        var endFrame = calculateFrames(_fps, durationRangeCamera);

        var animation = new BABYLON.Animation("sectorAnimation1", "radius", _fps, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
        var keys = [];
        keys.push({
            frame: 0,
            value: _camera.radius
        });
        keys.push({
            frame: endFrame,
            value: 1
        });

        animation.setKeys(keys);

        //Then add the animation object to box1
        _camera.animations.push(animation);

        //Finally, launch animations on box1, from key 0 to key 100 with loop activated
        _scene.beginAnimation(_camera, 0, endFrame, false);
    }

    this.sectorZoom = function(mesh) {

        MapV.animVars.isSectorZoom = true;


todo exemle baizer animation
        firstPartSectorZoom(mesh);

        setTimeout(function() {
            secondPartSectorZoom();
        }, 0.5);

        _camera.lowerRadiusLimit = 0.00001;
        _camera.upperRadiusLimit = 80;
    };

    this.sectorUnZoom = function(mesh) {

        MapV.animVars.isSectorZoom = false;

        var durationRotateCamera = 0.1;
        var _fps = 25;
        var endFrame = calculateFrames(_fps, durationRotateCamera);

        //        var bezierEase = new BABYLON.BezierCurveEase(0, .9, 0, .92);
        var easingFunction = new BABYLON.CircleEase();

        var animation = new BABYLON.Animation("sectorAnimation", "target", _fps, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
        var keys = [];
        keys.push({
            frame: 0,
            value: mesh.position
        });
        keys.push({
            frame: endFrame,
            value: sectorCameraPosition('get').position
        });

        animation.setKeys(keys);

        //Then add the animation object to box1
        _camera.animations.push(animation);

        //Finally, launch animations on box1, from key 0 to key 100 with loop activated
        _scene.beginAnimation(_camera, 0, endFrame, false);
    };
}*/


