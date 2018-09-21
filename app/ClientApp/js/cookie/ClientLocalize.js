/**
 * Работа с локализацией, для пользователя на стороне клиента
 * Устанавливает и обновляет информацию о культуре
 * запрашивает поддерживаемые сервером языки
 * Преобразует поддерживаемые языки в куки с типом : Текущий язык, язык по умолчанию, поддерживаемые языки
 */
var appL10n = {};
var LANG = "";
(function () {
    var langsCookieName = "_langs";
    var defaultLangCookieName = "_defaultLang";
    var currLangCookieName = "_currLang";

    function getCurrentLanguage(convertToL10NField) {
        var lang = $.cookie(currLangCookieName);
        LANG = lang;
        if (convertToL10NField) {
            lang = _.upperFirst(lang.toLowerCase()).trim();
        }
        return lang;
    }

    LANG = $.cookie(currLangCookieName) || $.cookie(defaultLangCookieName) || "en";

    var langL10N; 
    function getL10NCurrentLanguage() {
        if (!langL10N) langL10N = getCurrentLanguage(true);
        return langL10N;
    }


    function getSupportedLanguages() {
        var result = [];
        var languages = $.cookie(langsCookieName);
        if (languages) result = JSON.parse(languages);
        return result;
    }

    /**
    * @description  Устанавливает текущий язык исходя из параметров url, и сравнения с доступными языками из куки
    * @returns {void} 
    */
    function setCurrentLanguage() {
        var currUrl = window.location.pathname;
        var supportedLanguages = getSupportedLanguages();
        var currLang = null;

        for (var i = 0; i < supportedLanguages.length; i++) {
            var langItem = supportedLanguages[i].toLowerCase();
            var langPos = currUrl.search(langItem);

            if (undefined == langPos || -1 === langPos || 1 < langItem) {
                continue;
            }

            currLang = supportedLanguages[i];

            break;
        }

        if (!currLang) {
            currLang = $.cookie(defaultLangCookieName);
        }

        $.cookie(currLangCookieName, currLang);
    }

    appL10n.getL10NCurrentLanguage = getL10NCurrentLanguage;

    /**
     * @description  Получает масив доступных языков. и языка по умолчанию с сервера, и записывает его в куку, задает время жизни куки
     * @deprecated  
     */
    appL10n.getLanguagesFromServer = function () {
        $.ajax({
            url: "/api/translate/getSupportedLangs",
            dataType: "json",
            method: "get",
            success: function (answer) {
                $.cookie(langsCookieName, answer[langsCookieName], { expires: 14, path: '/' });
                $.cookie(defaultLangCookieName, answer[defaultLangCookieName].slice(-2).toLowerCase(), { expires: 14, path: '/' });
                setCurrentLanguage();
            }
        });
    };

    /**
    * @description Получает  масив поддерживаемых языком сохраненных локально (в куке)
    * @returns {array} ['en','ru','es']
    */
    appL10n.getSupportedLanguages = getSupportedLanguages;
})();




