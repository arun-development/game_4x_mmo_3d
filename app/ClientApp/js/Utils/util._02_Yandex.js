//Yandex  Translate
Utils.Yandex = {
    _appKey:"trnsl.1.1.20170706T231907Z.f6f8b9db045476bf.78f2c8547d67a6c9e4ec6695c7f8839a9bed5d07",
    Translate:{}
};
(function (LS, YA) {
    //https://tech.yandex.ru/translate/doc/dg/reference/getLangs-docpage/
    var translate = YA.Translate;
    var keyPrefix = "yandex_";


    translate.api = "https://translate.yandex.net/api/v1.5/tr.json/";
    translate.suportedLangs = {
        /**
         * значение  направления перевода например из ru  в es лежитв в индексе 109 =>   109:"ru-es"
         */
        dirs: [],
        /**
         * short code lang : full lang name  - ex :  --en:"English"--
         */
        langs: {}
    };
    var methods = {
        getLangs: "getLangs",
        detect: "detect",
        translate: "translate"
    };
    var models = translate.models = {
        formats: {
            plain: "plain",
            html: "html"
        },

        /**
         * 
         * @param {string} text required
         * @param {string} lang   required 
         * @param {string} format can be null   default plain (ranslate.models.formats.plain)
         * @param {string} options  can be null 
         * @returns {object} translateModel for request to  Yandex.Api
         */
        translate: function (text, lang, format, options) {
            function translateModel() {
                /**
                * string
                */
                this.text = text;
                /**
                 *  Направление перевода.
                 *  Может задаваться одним из следующих способов:
                 *  В виде пары кодов языков («с какого»-«на какой»), разделенных дефисом. Например, en-ru обозначает перевод с английского на русский.
                 *  В виде кода конечного языка (например ru). В этом случае сервис пытается определить исходный язык автоматически.
                 *  see translate.suportedLangs.dirs
                 * 
                 */
                this.lang = lang;

                /**
                 * Формат текста.
                 * Возможные значения:
                 * plain — текст без разметки (значение по умолчанию);
                 * html — текст в формате HTML.
                 * see consts translate.models.formats
                 */
                this.format = format;
                /*
                 * В настоящее время доступна единственная опция — признак включения в ответ автоматически определенного языка переводимого текста. Этому соответствует значение 1 этого параметра.
                 * Если язык переводимого текста задан в явном виде, 
                 * т. е. параметр lang представлен в виде пары кодов, 
                 * то первый код однозначно определяет исходный язык.
                 * Это означает, что параметр options не позволяет переключиться в режим автоматического определения языка. 
                 * Однако он позволяет понять, правильно ли был указан исходный язык в параметре lang.
                 */
                this.options = options;
            }

            return new translateModel();
        },

        getLangs: {
            /**
             * ui  Обязательный параметр.
             * В ответе список поддерживаемых языков будет перечислен в поле langs вместе с расшифровкой кодов языков. Названия языков будут выведены на языке, код которого соответствует этому параметру.
             * Все коды языков перечислены в списке поддерживаемых языков.
             */
            ui: "en"
        },

        /**
         * 
         * @param {string} text required 
         * @param {string} hint lang codes  separator ","
         * @returns {object} detectModel for request to  Yandex.Api
         */
        detect: function (text, hint) {
            function detectModel() {
                /**
                * string
                */
                this.text = text;
                /**
                 * string - Список наиболее вероятных языков (им будет отдаваться предпочтение при определении языка текста). Разделитель списка — запятая.
                 */
                this.hint = hint || ["en", "es", "ru"];
            }

            return new detectModel();
        },
        detectResponce: function () {
            return {
                /**
                * see  translate.responceStatuses
               */
                code: null,
                /**
                 *  single lang ex: - en  -
                 */
                lang: ""
            };
        },
        translateResponce: function () {
            return {
                /**
                 * see  translate.responceStatuses
                 */
                code: null,
                /**
                 *  direction lang ex: en-es
                 */
                lang: "",
                /**
                 *  масив  подходящих языков
                 */
                text: []
            };
        }
    };
    Object.freeze(translate.models.formats);

    translate.responceStatuses = {};
    translate.flagItems = [];

    function _setStatus(code, nativeDescription) {
        translate.responceStatuses[code] = {
            code: code,
            nativeDescription: nativeDescription
        };
    }

    _setStatus(200, "Операция выполнена успешно");
    _setStatus(401, "Неправильный API-ключ");
    _setStatus(402, "API-ключ заблокирован");
    _setStatus(404, "Превышено суточное ограничение на объем переведенного текста");
    Object.freeze(translate.responceStatuses);


    //  Object.freeze(translate.models);

    function _request(method, data) {
        return $.ajax({
            url: translate.api + method,
            mthod: "GET",
            dataType: "json",
            data: _.extend({ key: YA._appKey }, data)
        });
    };

    function FlagItem(langFulName, langCode, falgIcon) {
        this.Name = langFulName;
        this.LangCode = langCode;
        this.Icon = falgIcon;
    }
    translate.createFlagItem = function (langFulName, langCode, falgIcon) {
        return new FlagItem(langFulName, langCode, falgIcon);
    }
    function _fillSuportedLangs() {
        var lsKeySuportedLangs = keyPrefix + "suported_langs";
        LS.AddKeyToIgnoreClean(lsKeySuportedLangs);
        var existData = LS.GetFromStorage(lsKeySuportedLangs, true);
        function onSuccess(answer, saveToLocal) {
            translate.suportedLangs = answer;
            Object.freeze(translate.suportedLangs.dirs);
            Object.freeze(translate.suportedLangs.langs);
            Object.freeze(translate.suportedLangs);

            _.forEach(translate.suportedLangs.langs, function (val, key) {
                translate.flagItems.push(new FlagItem(val, key, ""));
            });
            Object.freeze(translate.flagItems);
            if (saveToLocal) {
                LS.SaveInStorage(lsKeySuportedLangs, answer, true);
            }
        }

        if (existData) onSuccess(existData);
        else {
            _request("getLangs", models.getLangs)
             .then(function (answer) {
                 onSuccess(answer, true);
             }, function (errorAnswer) {
                 console.log("errorAnswer", { errorAnswer: errorAnswer });
             });
        }




    }

    _fillSuportedLangs();
    /**
     * 
     * @param {object} translateModel see translate.models.translate
     * @returns {object} $.ajax 
     */
    translate.detect = function (detectModel) {
        return _request(methods.detect, detectModel);
    };

    /**
     * 
     * @param {object} detectModel  see  translate.models.detect
     * @returns {object} $.ajax 
     */
    translate.translate = function (_translate) {
        return _request(methods.translate, _translate);
    };

    /**
     * 
     * @returns {} 
     */
    translate.getLangs = function () {
        return translate.suportedLangs.dirs;
    };
    translate.getDirs = function () {
        return translate.suportedLangs.langs;
    };

    translate.testDetect = function () {
        function _test(val, langKey) {
            translate.detect(models.detect(val)).then(function (answer) {
                if (answer.lang === langKey) {
                    console.log("detect.answer: " + langKey + " -ok", { answer: answer });
                }
                else {
                    console.log("detect.answer: " + langKey + " - fail", { answer: answer });
                }

            }, function (errorAnswer) {
                console.log("detect.errorAnswer", errorAnswer);
            });
        }

        _test("мама мыла раму", "ru");
        _test("Mom was washing the frame", "en");
        _test("Mamá estaba lavando el marco", "es");
        _test("Maman lavait le cadre", "fr");
        _test("ママはフレームを洗っていた", "ja");

    };

    translate.testTranslate = function () {
        function _test(val, targetLang, equalDirection) {
            translate.translate(models.translate(val, targetLang)).then(function (answer) {
                if (answer.lang === equalDirection) {
                    console.log("translate.answer.to:" + targetLang + " - ok", { answer: answer, targetLang: targetLang, equalDirection: equalDirection });
                }
                else {
                    console.log("translate.answer.to:" + targetLang + " - fail", { answer: answe, targetLang: targetLang, equalDirection: equalDirection });
                }


            }, function (errorAnswer) {
                console.log("detect.errorAnswer", errorAnswer);
            });
        }

        _test("Mom was washing the frame", "ru", "en-ru");
        _test("мама мыла раму", "en", "ru-en");
        _test("Mamá estaba lavando el marco", "en", "es-en");
        _test("ママはフレームを洗っていた", "fr", "ja-fr");
        _test("Mom was washing the frame", "ja", "en-ja");


    };



    //  Object.freeze(translate); 
})(Utils.LocalStorage, Utils.Yandex);
Utils.LocalStorage.AddKeyToIgnoreClean(Utils.RepoKeys.LsKeys.FloatVoteParams);
Utils.LocalStorage.AddKeyToIgnoreClean(Utils.RepoKeys.LsKeys.VoteRegistredData);