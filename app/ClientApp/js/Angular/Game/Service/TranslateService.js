Utils.CoreApp.gameApp.service("translateService", [
    "planshetService",
    function (planshetService) {
        var keys = ["alliance", "mapInfo", "confederation", "journal", "common", "unit"];
        var translate = {
            alliance: null,
            mapInfo: null,
            confederation: null,
            journal: null,
            common: null,
            unit: null
        };

        function _setAlltranslate(data) {
            translate.alliance = data.alliance;
            translate.mapInfo = data.mapInfo;
            translate.confederation = data.confederation;
            translate.journal = data.journal;
            translate.common = data.common;
            translate.unit = data.unit;
        }

        function getFromServer() {
            var params = {};
            params.url = "/api/Translate/GetGameTranslate/";
            params.onSuccess = function (answer) {
                _setAlltranslate(answer);
            };
            planshetService.requestHelper(params, "translateService", true, true);

        };

        this.getAlliance = function () {
            return translate.alliance;
        };
        this.getMapInfo = function () {
            return translate.mapInfo;
        };
        this.getConfederation = function () {
            return translate.confederation;
        };
        this.getJournal = function () {
            return translate.journal;
        };
        this.getCommon = function () {
            return translate.common;
        };
        this.getUnit = function () {
            return translate.unit;
        };
        this.getAll = function () {
            return translate;
        };

        var tr = Utils.CreateLangSimple;
        this.local = {
            notPermitedForShow: tr("EN notPermitedForShow", "Es notPermitedForShow", "RU не достаточно прав для просмотра")
        };
        this.init = _setAlltranslate;
 

    }
]);