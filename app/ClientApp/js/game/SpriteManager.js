EM.SpriteManager = {};
(function (SpriteManager) {
    SpriteManager.init = function () {
        var existingSpriteNames = [];
        //var baseSpriteCatalog = "/Content/BabylonSprites/";
        var sprites = {};

        function getRegistratedSpriteNames() {
            return existingSpriteNames;
        };

        function getSpriteByName(spriteName) {
            return sprites.hasOwnProperty(spriteName) ? sprites[spriteName] : false;
        };

        function checkSpriteExist(spriteName) {
            return !!getSpriteByName(spriteName);
        };

        function addOrGetSpriteTexture(spriteMetaItem) {
            var name = spriteMetaItem.name;
            if (checkSpriteExist(name)) {
                if (SHOW_DEBUG) console.log("spriteExist");
                return getSpriteByName(name);
            }
            else {
                var spriteTexture = new BABYLON.Texture(spriteMetaItem.url, EM.Scene, true, false, BABYLON.Texture.NEAREST_SAMPLINGMODE);
                spriteTexture.hasAlpha = true;
                spriteTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
                spriteTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
                return sprites[name] = spriteTexture;
            };
        }

        function disposeByName(spriteName, onDispose) {
            var sprite = getSpriteByName(getSpriteByName);
            sprite.onDispose(function () {
                delete sprites[spriteName];
                onDispose();
            });
            sprite.dispose();

        };


        function createUrl(fileName, ext, fromLocal) {
            return Utils.CdnManager.GetBjsSprite(fileName + ((ext) ? ext : ".png"), fromLocal);
        };


        function createSpriteMetaData(fileName, cellSize, scale, sellInRow,imageSizeX, imageSizeY) {
            if (!imageSizeY) imageSizeY = imageSizeX;
            return {
                name: fileName,
                url: createUrl(fileName),
                cellSize: cellSize,
                scale: scale,
                sellInRow: sellInRow,
                imageSize: new BABYLON.Vector2(imageSizeX, imageSizeY)
            };
        };

        var spriteMeta = {
            starSprite: createSpriteMetaData("starSprite", 260, 0.15, 8, 2080)
        };

        SpriteManager.getRegistratedSpriteNames = getRegistratedSpriteNames;
        SpriteManager.getSpriteByName = getSpriteByName;
        SpriteManager.addOrGetSpriteTexture = addOrGetSpriteTexture;
        SpriteManager.checkSpriteExist = checkSpriteExist;
        SpriteManager.disposeByName = disposeByName;
        SpriteManager.spriteMeta = spriteMeta;
    };
})(EM.SpriteManager);

