 
Utils.CdnManager = {
    GetGameModelsFile: null,
    GetMatVideoFile: null,
    GetBjsSprite: null,
    ContainerNames: null,
    ContainerCdnUrls: null,
    ContainerLocalUrls: null
};
 
(function (cm) {
    var publicCdn = "https://eternplaypublic.blob.core.windows.net/";
    var userImagesCdn = "https://skagryuserimages.blob.core.windows.net/";

    var localPath = "/Content/";
    var babylonSprites = "babylon-sprites";
    var babylonAssets = "babylon-assets";
    var alliance = "alliance";
    var user = "user";


    var s = "/";//separator
    var dist = "dist";
     
    function IConteiner() {
        this.babylonSprites = "";
        this.babylonAssets = "";
        this.alliance = "";
        this.user = "";
        return this; 
    }

    function _setNames(iContainerToSet) {
        iContainerToSet.babylonSprites = babylonSprites;
        iContainerToSet.babylonAssets = babylonAssets;
        iContainerToSet.alliance = alliance,
        iContainerToSet.user = user;
    }
    function _setUserImageCatalogs(iContainerToSet) {
        iContainerToSet.alliance = userImagesCdn + alliance + s,
        iContainerToSet.user = userImagesCdn + user + s;
    }
    function _setLocalUrls(iContainerToSet) {
        iContainerToSet.babylonSprites =localPath + babylonSprites + s;
        iContainerToSet.babylonAssets =localPath + babylonAssets + s;
        _setUserImageCatalogs(iContainerToSet);
    }
    function _setCdnUrls(iContainerToSet) {
        iContainerToSet.babylonSprites = publicCdn + babylonSprites + s;
        iContainerToSet.babylonAssets = publicCdn + babylonAssets + s;
        _setUserImageCatalogs(iContainerToSet);
    }



    var containerNames = new IConteiner();
    _setNames(containerNames);
    cm.ContainerNames = containerNames;

    var containerCdnUrls = new IConteiner();
    _setCdnUrls(containerCdnUrls);
    cm.ContainerCdnUrls = containerCdnUrls;

    var containerLocalUrls = new IConteiner();
    _setLocalUrls(containerLocalUrls);
    cm.ContainerLocalUrls = containerLocalUrls; 

    function endsWithSeparator(section, setOrRemoveSeparator) {
        return Utils.Parce.EndsWithSeparatorAndReplace(section, setOrRemoveSeparator,s);
 
    }
    function startsWith(section, setOrRemoveSeparator) {
        return Utils.Parce.StartsWithSeparatorAndReplace(section, setOrRemoveSeparator, s);
    }

    function getUrl(cataolg, fileName) {
        if (typeof cataolg != "string") throw new Error("param cataolg is not String");
        if (cataolg.length <= 0) throw new Error("param cataolg is empty");
        cataolg = endsWithSeparator(cataolg, true);

        if (fileName) {
            if (typeof fileName != "string") throw new Error("param fileName is not String");
            if (fileName.length <= 0) throw new Error("param fileName is empty");
            fileName = startsWith(fileName, false);
        }
        else fileName = "";
        return cataolg + fileName;
    }

    function setSection(section) {
        return startsWith(endsWithSeparator(section, true), false);
    }

    function getCatalog(containerName, fromLocal) {
        if (!cm.ContainerNames.hasOwnProperty(containerName)) throw new Error("invalid containerName, paramName: " + containerName);
        if (fromLocal) return cm.ContainerLocalUrls[containerName];
        else return cm.ContainerCdnUrls[containerName];
    }

    cm._gameModelsCatalog =null;
    cm.GetGameModelsCatalog = function(version, fromLocal) {
        if(cm._gameModelsCatalog!=null) return cm._gameModelsCatalog;
        if(!version) version = dist+s;
        else version = setSection(version)+dist+s;
        var catalog = getCatalog(_.camelCase(babylonAssets), fromLocal);
        var path = catalog+setSection("game_models")+setSection(version);
        cm._modelsCatalog = path;
        return path;
    };
    cm.GetGameModelsFile = function(fileName, version, fromLocal) {
        var cataolg = cm.GetGameModelsCatalog(version, fromLocal);
        return getUrl(cataolg, fileName);
    };

    cm.GetMatVideoFile = function(fileName, fromLocal) {
        var cataolg = getCatalog(_.camelCase(babylonAssets), fromLocal);
        var videoMaterialesCatalog = cataolg+"video_materiales"+s;
        return getUrl(videoMaterialesCatalog, fileName);
    };
    cm.GetBjsSprite = function(fileName, fromLocal) {
        var cataolg = getCatalog(_.camelCase(babylonSprites), fromLocal);
        return getUrl(cataolg, fileName);
    };

    cm.GetGameObjectsCatalog = function(version, fromLocal) {
        if(!version) version = dist+s;
        else version = setSection(version);
        var catalog = getCatalog(_.camelCase(babylonAssets), fromLocal);
        var path = catalog+setSection("game_objects")+setSection(version);
        return path;
    };
    cm.GetBabylonMaterialesCatalog = function(subdirName, fromLocal) {
        var catalog = getCatalog(_.camelCase(babylonAssets), fromLocal);
        var path = catalog+setSection("babylon_materiales");
        if(subdirName) path += setSection(subdirName);
        return path;
    };

    cm.GetCommonTextureUrl = function (fileName, fromLocal) {
        var cataolg = getCatalog(_.camelCase(babylonAssets), fromLocal);
        cataolg+= "common_textures"+s;
        return getUrl(cataolg, fileName);
    };
    
})(Utils.CdnManager);