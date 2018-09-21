(function ($a) {

    var gameAudioDir = "/content/audio/game/";
    var bAudioDir = gameAudioDir + "background/";
    var background = {};
    $a.background = background;
    var systemVoiceDir = gameAudioDir + "test/";
    $a.systemVoiceListUrls = {};
    $a.InitGame = function (scene) {

        function createSound(name, fileName, readyToPlayCallback, options) {
            var urlOrArrayBuffer = ((options && options.dir) ? options.dir : systemVoiceDir) + fileName;
            $a.systemVoiceListUrls[name] = urlOrArrayBuffer;
            $a.GameSounds[name] = new BABYLON.Sound(name, urlOrArrayBuffer, scene, readyToPlayCallback, options);
        }

        // createSound("sceneObjectHover", "SE_ControlDisk_Label.wav");
        createSound("onGameStart", "SE_LoadingLogo1.wav", function () {
            $a.GameSounds.onGameStart.play();
        },
            {
                volume: 0.5
            });

        createSound("mainFone", "main-fone.mp3", null, {
            dir: bAudioDir,
            loop: true,
            volume: 0.5
        });
        //space

        createSound("onSpaceObjectHoveredIn", "SE_HoverBodyIn.wav");
        createSound("onControlDiscShow", "UI_DiscToggleActivate.wav");
        //createSound("onJumpToSystemStart", "SE_EnterJumpPointStart.wav");
        createSound("onSpaceJumpToSystemStart", "SE_EnterStarSystemStart.wav");
        createSound("onMoveToPlanetoid", "SE_ShowOrbitals.wav");

        createSound("onSpaceMoveToSystemPoint", "SE_SelectNothing.wav");
        createSound("onSpaceRotate", "CAM_FastMove_LOOP.wav");
        createSound("onSpaceScroll", "CAM_Dolly_LOOP.wav");

        //interfaces

        createSound("defaultButtonClick", "UI_DiscClick.wav");
        createSound("defaultButtonClose", "UI_DiscClose.wav");
        createSound("defaultHover", "SE_HoverBodyIn.wav");

        createSound("dialogOpen", "SE_ShowHeatmap.wav");
        createSound("dialogClose", "SE_HideHeatmap.wav");

        createSound("dropableOpen", "SE_ShowHeatmap.wav");

        createSound("planshetOpen", "SE_ShowHeatmap.wav");
        createSound("planshetClose", "SE_HideHeatmap.wav");
        createSound("planshetTabActivate", "SE_UpdateHeatmap.wav");

        createSound("contollPannelToggle", "UI_DiscClose.wav");
        createSound("onSelectPlanetOpen", "SE_ShowHeatmap.wav");
        createSound("onSelectPlanetClose", "SE_HideHeatmap.wav");


    };
    //babylon https://www.babylonjs-playground.com/#14NOH8#0

})(EM.Audio);