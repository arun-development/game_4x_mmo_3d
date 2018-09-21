//videoTextures
EM.VideoTextures = {};

//base
(function (VideoTextures) {
    var videoContainerId = "vidio-container";
    function getVideoContainer() {
        return $("#" + videoContainerId);
    };
    function getVideoTag(videoDomId) {
        return document.getElementById(videoDomId);
    };

    /**
     * 
     * @param {stirng} id 
     * @param {Array<object>} sources    props: src,   memeType
     * @param {int||string} width 
     * @param {int||string} height 
     * @param {boolean} loop 
     * @returns {Object<$>} 
     */
    function addVodioTag(id, sources, width, height, loop) {
        var video = $("<video/>", {
            loop: loop|| "loop"
        }).attr({
            width: width || 1920,
            height: height || 1080
        });
        _.forEach(sources,
            function (value) {
                video.append($("<source/>", {
                    src: value.src,
                    type: value.memeType
                }));
            });


        getVideoContainer().append(video);
        return video;
    }
    VideoTextures.GetVideoTag = getVideoTag;
})(EM.VideoTextures);

//sectorJump
(function (VideoTextures) {
    "use_strict";
    var sectorJump = {
        Texture: null,
        Play: null,
        Stop: null,
        GetTexture: null
    };
    var videoDomId = "video-sector-jump";

    function createTexture() {
        sectorJump.Texture = new BABYLON.VideoTexture(videoDomId, VideoTextures.GetVideoTag(videoDomId), EM.Scene, true);
        sectorJump.Play = function (playbackRate) {
            sectorJump.Texture.video.playbackRate = playbackRate || 1;
            //sectorJump.Texture.video.load();
            sectorJump.Texture.video.play();
        };
        sectorJump.Stop = function () {
            //sectorJump.Texture.video.load();
            sectorJump.Texture.video.pause();
        };
        sectorJump.Stop();
        return sectorJump.Texture;
    }

    function getTexture() {
        if (sectorJump.Texture) return sectorJump.Texture;
        return createTexture();
    }

    sectorJump.GetTexture = getTexture;
    VideoTextures.SectorJump = sectorJump;
})(EM.VideoTextures);
