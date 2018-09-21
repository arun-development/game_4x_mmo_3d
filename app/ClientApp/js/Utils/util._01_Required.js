//LocalStorage
(function () {
    Utils.LocalStorage = {
        TIME_STORAGE_PERIOD: 1,
        _localStorage: {},
        _IsValidKey: function (key) {
            if (key && (typeof key === "string" && key.length > 1)) {
                return true;
            }
            if (SHOW_DEBUG) {
                Utils.Console.Error("LocalStorage key not valid", key);
            }
            return false;
        },
        _getLSKeys: function () {
            return Object.keys(window.localStorage);
        },
        _ignoreCleanKeys: [],
        AddKeyToIgnoreClean: function (key) {
            var contain = _.includes(this._ignoreCleanKeys, key);
            if (!contain) {
                this._ignoreCleanKeys.push(key);
            }

        },
        _getKesToClean: function () {
            return _.xor(this._getLSKeys(), this._ignoreCleanKeys);
        },
        SaveInStorage: function (key, data, notSetCookie, expires) {
            if (!this._IsValidKey(key)) return false;
            this._saveToLocal(key, data);
            if (Modernizr.localstorage) {
                window.localStorage.setItem(key, JSON.stringify(data));
                if (!notSetCookie) $.cookie(key, true, { expires: expires || this.TIME_STORAGE_PERIOD, path: "/" });
                return true;
            }
            if (SHOW_DEBUG) {
                console.log("Local storage not suprted, data  will be saved in memory");
            }
            return false;
        },

        GetFromStorage: function (key, notSaveToLocal) {
            if (!this._IsValidKey(key)) return false;
            if (!notSaveToLocal) {
                var data = this._getFromLocal(key);
                if (data) return data;
            }
            if (Modernizr.localstorage) {
                var localData = JSON.parse(window.localStorage.getItem(key));
                if (notSaveToLocal) return localData;
                if (localData) {
                    this._saveToLocal(key, localData);
                    return localData;
                }
            }

            return false;
        },
        ClearStorageAndCookie: function () {
            var $$Self = this;
            _.forEach($$Self._getKesToClean(), function (val, idx) {
                $$Self.RemoveItem(val);
            });
        },
        RemoveItem: function (key) {
            if (this._IsValidKey(key)) {
                delete this._localStorage[key];
                $.removeCookie(key);
                window.localStorage.removeItem(key);
            }
        },
        _saveToLocal: function (key, data) {
            this._localStorage[key] = _.cloneDeep(data);
        },
        _getFromLocal: function (key) {
            var data = _.find(this._localStorage, function (o) {
                return o[key] === key;
            });
            if (data) return _.cloneDeep(data);
            return false;
        }
    };
})();

//webP Test 
(function () {
    var LS_KEY = "webp_support";
    Utils.LocalStorage.AddKeyToIgnoreClean(LS_KEY);
    function test() {
        if (!Modernizr.canvas) {
            return false;
        }
        var elem = document.createElement('canvas');
        if (!!(elem.getContext && elem.getContext('2d'))) {
            // was able or not to get WebP representation
            var r = elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
            elem.remove();
            return r;
        }
        else {
            return false;
        }
    }
    function canUseWebP() {
        if (window.localStorage) {
            var val = window.localStorage.getItem(LS_KEY);
            if (val === "true") {
                return true;
            } else if (val === "false") {
                return false;
            }
            else {
                val = test();
                window.localStorage.setItem(LS_KEY, val);
                return val;
            }
        }
        else {
            return test();
        }
    }
    Modernizr.webp = canUseWebP();
    if (Modernizr.webp) {
        $("html").addClass("webp");
    }
    Modernizr.addTest("ie", function () {

        var userAgent = window.navigator.userAgent.toLowerCase();
        var result = false;
        if ((/trident/gi).test(userAgent) || (/msie/gi).test(userAgent)) {
            result = true;
            $("html").addClass("ie");
        }
        return result;

    });

})();

//XSRF 
Utils.XSRF = {};
(function (XSRF) {
    var tokenDom = $("body > [name='X-XSRF-TOKEN']").first();
    var token = tokenDom.val() || "";
    tokenDom.remove();
    XSRF.HeadersGetApiTokenObj = function () {
        return {

            "X-XSRF-TOKEN": token
        };
    };
    XSRF.MakeIPostXsrf = function (objectKey, objectValue) {
        var data = {};
        data["X-XSRF-TOKEN"] = token;
        data[objectKey] = objectValue;
        return data;
    };

})(Utils.XSRF);

//common
(function () {
    Utils.FreezeDeep = function (o) {
        var type = typeof o;
        if (type === "object" || type === "function") {
            Object.freeze(o);
            Object.getOwnPropertyNames(o).forEach(function (prop) {
                if (o.hasOwnProperty(prop)
                    && o[prop] !== null
                    && (typeof o[prop] === "object" || typeof o[prop] === "function")
                    && !Object.isFrozen(o[prop])) {
                    Utils.FreezeDeep(o[prop]);
                }
            });
        }
        return o;
    }
    Utils.ConvertToBool = function (value) {
        if ("true" === value) return true;
        else if ("True" === value) return true;
        else if ("false" === value) return false;
        else if ("False" === value) return false;
        else if ("undefined" === value) return false;
        else if ("NaN" === value) return false;
        else if ("0" === value) return false;
        return !!value;
    };
	/**
     * @description  Utils.ConvertToInt() преобразует входящее число из строки или  float  в инт с округлением в меньшую сторону
     * @param {number} value double   
     * @returns {number} int
     */
    Utils.ConvertToInt = function (value) {
        if (value instanceof String) return Math.floor(parseFloat(value.replace(",", ".")));
        else return Math.floor(value);
    };

    Utils.ConvertToFloat = function (value) {
        return parseFloat(value.toString().replace(",", "."));
    };
    Utils.ConvertObjToDictionary = function (obj) {
        var dict = [];
        for (var i in obj) if (obj.hasOwnProperty(i)) dict.push({ key: i, value: obj[i] });
        return dict;
    };
	/**
         * @description   Проверяет объект на пустоту
         * @param {object} obj  Проверяемый обхект
         * @returns {bool} если  true  значит объект пустой
         */
    Utils.CheckObjIsEmpty = function (obj) {
        var isNotEmpty = true;
        if (!obj) return false;

        _.forEach(obj, function (o) {
            isNotEmpty = false;
            return false;
        });
        return isNotEmpty;
    };
    Utils.GetMaxNumberInArr = function (arr) {
        return Math.max.apply(null, arr);
    };
    Utils.GetMinNumberInArr = function (arr) {
        return Math.max.apply(null, arr);
    };
    Utils.GetReturnUrl = function () {
        var path = window.location.pathname;
        if (path === "/") {
            path = "/" + LANG;
        }
        return "?ReturnUrl=" + path;
    };
    Utils.GetUrl = function (actionName) {
        var url = "https://" + window.location.host + "/" + LANG;
        if (!actionName) url += "/";
        else {
            if (!_.startsWith(actionName, "/")) actionName = "/" + actionName;
            if (!_.endsWith(actionName, "/")) actionName = actionName + "/";
            url += actionName;
        }
        return url;
    };
    Utils.IsNumeric = function (value) {
        return /^\d+$/.test(value);
    };

    Utils.RedirectToAction = function (actionName) {
        window.location.href = this.GetUrl(actionName);
    };
    Utils.RandomBool = function () {
        var r = _.random(0, 1, true);
        var val = false;
        if (r > 0.5) val = true;
        return val;
    };
    Utils.UpdateObjData = function (oldData, newData) {
        if (!_.isEqual(oldData, newData)) {
            _.forEach(newData, function (newVal, key) {
                if (typeof newVal === "object" && newVal !== null) {
                    if (!oldData[key]) {
                        if (newVal.pop) {
                            oldData[key] = [];
                        }
                        else {
                            oldData[key] = {};
                        }

                    }
                    Utils.UpdateObjData(oldData[key], newVal);
                }
                else if (oldData[key] !== newVal) {
                    oldData[key] = newVal;
                }
            });
        }
    };

    Utils.UpdateObjFromOther = function (obj, other) {
        if (!other) return;
        var keys = Object.keys(obj);
        _.forEach(keys, function (key, idx) {
            if (!other[key]) return;
            if (typeof obj[key] === "object") {
                Utils.UpdateObjFromOther(obj[key], other[key]);
            }
            else {
                obj[key] = other[key];
            }
        });

    };
    Utils.IsNotEmptyString = function (stringName) {
        return stringName && typeof stringName === "string" && stringName.length > 0;
    };

	/**
     * добавляет BABYLON.Observable  в свойство observerableName объекта  
     * babylonObject  и назнавает geter/setter  для свойства  watchPropertyName
     * @param {object} rootObject required
     * @param {string} watchPropertyName     required
     * @param {string} observerableName    required
     * @returns {void} 
     */
    Utils.IPropertyObserverable = function (rootObject, watchPropertyName, observerableName) {
        var mf = Utils.ModelFactory;
        var data = {
            rootObject: rootObject,
            watchPropertyName: watchPropertyName,
            observerableName: observerableName
        };

        if (!rootObject) {
            throw Errors.ClientNullReferenceException(data, "babylonObject");
        }
        if (typeof rootObject !== "object") {
            throw Errors.ClientTypeErrorException(data, rootObject, "object", "Utils.CreateIPropertyObserverable");
        }
        if (!rootObject.hasOwnProperty(watchPropertyName)) {
            throw Errors.ClientNullReferenceException(data, "watchPropertyName");
        }
        if (typeof watchPropertyName !== "string") {
            throw Errors.ClientTypeErrorException(data, watchPropertyName, "string", "Utils.CreateIPropertyObserverable");
        }
        if (typeof observerableName !== "string") {
            throw Errors.ClientTypeErrorException(data, observerableName, "string", "Utils.CreateIPropertyObserverable");
        }
        if (rootObject[observerableName]) {
            throw Errors.ClientNotImplementedException(data, "обсервер уже существует у переданного меша");
        }

        function IPropertyObserverable() {
            var $self = this;
            this._rootObject = rootObject;

            var _propertyValue = rootObject[watchPropertyName];

            this.WhatchPropertyName = watchPropertyName;
            this.ObserverablePropertyName = observerableName;
            rootObject[observerableName] = new BABYLON.Observable();


            function _getPropInfo(newVal) {
                return mf.IBasePropertyInfo(_propertyValue, newVal, watchPropertyName, rootObject);
            }
            function _notyfy(propInfo) {
                rootObject[observerableName].notifyObservers(mf.INotyfyModel(propInfo, rootObject[observerableName]));
            }

            Object.defineProperty(rootObject, $self.WhatchPropertyName, {
                get: function () {
                    return _propertyValue;
                },
                set: function (value) {
                    _notyfy(_getPropInfo(value));
                    _propertyValue = value;
                }
            });

            return $self;

        }

        return new IPropertyObserverable();

    };
    Utils.StrToRef = function (methodStr, scope) {
        if (!scope) scope = window;
        var method;
        var path = _.split(methodStr, ".");

        _.forEach(path, function (val) {
            if (!method) {
                if (!scope[val]) {
                    return false;
                }
                method = scope[val];
                return;
            }
            if (method[val]) {
                method = method[val];
                return;
            }
            return false;

        });
        return method;

    }

})();

//localize
(function () {
	/**
     * создает модель с методом получения текущей культуры
     * @param {string} en        culturestring
     * @param {string} es     culturestring
     * @param {string} ru   culturestring
     * @returns {object}   Модель с методом доступа к текущему языку
     */
    Utils.LangSimple = function (en, es, ru) {
        function LangSimple() {
            this.En = en;
            this.Es = es;
            this.Ru = ru;
        }

        LangSimple.prototype.getCurrent = function () {
            var key = appL10n.getL10NCurrentLanguage();
            if (!key) key = "En";
            return this[key];
        };
        return new LangSimple();
    };
    Utils.SupportedLangs = function () {
        return Utils.LangSimple("en", "es", "ru");
    };

    Utils.CreateLangSimple = function (en, es, ru) {
        return Utils.LangSimple(en, es, ru);
    };


    Utils.LangField = function (data) {
        function LangField() {
            this.Name = "";
            this.Description = "";
        }
        LangField.prototype.updateFromOther = function (other) {
            if (!other) {
                return;
            }
            if (other.hasOwnProperty("Name") && other.Name) {
                this.Name = other.Name;
            }
            if (data.hasOwnProperty("Description") && other.Description) {
                this.Description = other.Description;
            }
        };
        var model = new LangField();
        model.updateFromOther(data);
        return model;
    };
    Utils.TranslateTextField = function (data) {
        return Utils.L10N(data);
    };
    Utils.L10N = function (data) {
        function L10N() {
            this.En = Utils.LangField();
            this.Es = Utils.LangField();
            this.Ru = Utils.LangField();
        }
        L10N.prototype.getKeys = function () {
            return Object.keys(this);
        }
        L10N.prototype.updateFromOther = function (other) {
            if (!other) return;
            Utils.UpdateObjFromOther(this, other);
        };
        L10N.prototype.getCurrent = function () {
            var key = appL10n.getL10NCurrentLanguage();
            if (!key) key = "En";
            return this[key];
        };


        var model = new L10N();
        if (data) {
            model.updateFromOther(data);
        }
        return model;
    };
})();

//CssHelper
Utils.CssHelper = {
    SetUrl: function (url) {
        return "url('" + url + "')";
    }
};

//html helpers
(function () {
    Utils.SetHtmlAttr = function (data) {
        return "[" + data + "]";
    };
    Utils.ClearHtmlAttr = function (key, clearDataPrefix) {
        var out = key.replace(/[\]\[]/g, "");

        if (clearDataPrefix) {
            out = out.substr(5);
        }

        return out;
    };
    Utils.PrepareHtmlAttributeSelector = function (parts, setBracket) {
        var out = parts.join("-");

        if (setBracket) {
            out = "[" + out + "]";
        }

        return out.toLowerCase();
    };
    Utils.GenAttrItem = function (value, setBracket, noTransform) {
        var out = "itemid";

        if (value) {
            out += "=" + value.join("-");
        }

        if (setBracket) {
            out = "[" + out + "]";
        }

        if (!noTransform) {
            out = out.toLowerCase();
        }

        return out;
    };
    Utils.GenAttrName = function (value, setBracket, noTransform) {
        var out = "name";

        if (value) {
            out += "=" + value.join("-");
        }

        if (setBracket) {
            out = "[" + out + "]";
        }

        if (!noTransform) {
            out = out.toLowerCase();
        }

        return out;
    };
    Utils.GenAttrDataVal = function (dataName, value, noTransformDataName, valueToLower) {
        var dataAttr = "data-" + dataName;
        if (!noTransformDataName) {
            dataAttr = dataAttr.toLowerCase();
        }

        var valueAttr = "=" + value;
        if (valueToLower) {
            valueAttr = valueAttr.toLowerCase();
        }

        return "[" + dataAttr + valueAttr + "]";
    };

	/**
* 
* @param {array} dataNames [] составное имя дата атрибута
* @param {string} value  значение дата атрибута
* @param {bool} notSetBracket  Не устанавливать брекеты вокрг дата атрибута  ex ["data-attr"]
* @param {bool} noTransform  не применять модификацию к составному имени
* @returns {string}  data attr ex "data-selector1-selector2"  или если передано значение даты "data-selector1-selector2="value"
*/
    Utils.GenAttrDataName = function (dataNames, value, notSetBracket, noTransform) {
        var out = "data-" + dataNames.join("-");
        if (value) {
            out = out + "=" + value;
        }
        if (!notSetBracket) {
            out = "[" + out + "]";
        }
        if (!noTransform) {
            out = out.toLowerCase();
        }
        return out;
    };
    Utils.SetAttrDataVal = function (jqObj, dataName, value, noTransform) {
        var dataAttr = "data-" + dataName;
        if (!noTransform) {
            dataAttr = dataAttr.toLowerCase();
        }

        jqObj.attr(dataAttr, value);
    };
    Utils.GetParent = function (elem, parentItemId) {
        var hk = Utils.RepoKeys.HtmlKeys;
        var parent = elem.parent();

        while (parentItemId !== parent.attr(hk.Itemid)) {
            parent = parent.parent();
        }

        return parent;
    };
    Utils.GetParentElemByClass = function (elem, parentClass) {
        var parent = elem;

        while (!parent.hasClass(parentClass)) {
            if (parent.is("body")) {
                break;
            }

            parent = parent.parent();
        }

        return parent;
    };

	/**
    * Get parent element data
    * @param {object} elem jQuery Current element
    * @param {int} selectorType (0 - id, 1 - itemid attr, 2 - data attr, 3 - data attr with value, 4 - css class)
    * @param {string} selector 
    * @param {int} skipParent Quantity skip elements to parent
    * @param {any} value Part combine selector (selector + value)
    * @param {any} parentValSelector Type of result (attr name or attr value). See selectorType or "obj", "name"
    * @returns {object||string||int} object, name of attr or value of attr.
    * @defaultvalue {string} selector == "customDataSelector" 
    */
    Utils.GetParentValue = function (elem, selectorType, selector, skipParent, value, parentValSelector) {
        var idSelector = 0;
        var itemSelector = 1;
        var dataValueSelector = 3;
        var empty;


        var parent = elem;


        if (skipParent) {
            for (var j = skipParent; j > 0; j--) {
                parent = parent.parent();
            }

        } else {
            var resultSelector;
            if (selectorType === idSelector) {
                resultSelector = "#" + selector;
            }
            if (selectorType === itemSelector) {
                resultSelector = "[itemid=" + selector + "]";
            }
            var dataSelector = 2;
            if (selectorType === dataSelector) {
                resultSelector = "[data-" + selector + "]";
            }
            if (value !== null) {
                if (selectorType === dataValueSelector) {
                    resultSelector = "[data-" + selector + "=" + value + "]";
                }
            }
            var cssSelector = 4;
            if (selectorType === cssSelector) {
                resultSelector = "." + selector;
            } else {
                resultSelector = selector;
            }
            while (!parent.is($(resultSelector))) {
                parent = parent.parent();

                if (parent.is($("body"))) {
                    console.log("Parent not found");
                    return null;
                }
            }
        }

        //=====================================

        if (parentValSelector === idSelector) {
            return parent.attr("id");
        }

        if (parentValSelector === itemSelector) {
            return parent.attr("itemid");
        }
        if (parentValSelector === dataValueSelector) {
            return parent.data(selector);
        }

        if (typeof parentValSelector === "string") {
            var dataobj = parent.data();
            var count = 0;
            var resultData = null;
            for (var i in dataobj) {
                if (dataobj.hasOwnProperty(i)) {
                    if (count > 0) {
                        console.log("Data variable. Data count > 0");
                        return null;
                    }
                    var obj = "obj";
                    var name = "name";
                    if (parentValSelector === name) {

                        resultData = i;
                    } else if (parentValSelector === obj) {
                        resultData = parent.data();
                    } else {
                        resultData = parent.data(i);
                    }
                }
                count++;
            }
            return resultData;
        }

        if (selector === null) {
            selector = undefined;
        }
        return parent.data(selector);
    };
    Utils.GetKeyFromObject = function (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) return key;
        }

        return null;
    };
    Utils.ObjectToHtmlAttributes = function (obj, filter) {
        var result = "";

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var addValue = true;
                for (var i = 0; i < filter.length; i++) {
                    if (key === filter[i]) {
                        addValue = false;
                        break;
                    }
                }

                if (addValue) {
                    result += key + "=\"" + obj[key] + "\" ";
                }
            }
        }

        return result;
    };
    Utils.SetSpanText = function (data, cssClass) {
        var _class = cssClass ? "class=" + cssClass : "";
        return "<span " + _class + ">" + data + "</span>";
    };
})();

//console Helper end Styles
Utils.Console = {
    H1: function (mes, elem) {
        console.info("%c" + mes, this.ConsoleStyles.h1, elem);
    },
    H2: function (mes, elem) {
        console.info("%c" + mes, this.ConsoleStyles.h2, elem);
    },
    H3: function (mes, elem) {
        console.info("%c" + mes, this.ConsoleStyles.h3, elem);
    },
    Bold: function (mes, elem) {
        console.log("%c" + mes, this.ConsoleStyles.bold, elem);
    },
    Warn: function (mes, elem) {
        console.warn("%c" + mes, this.ConsoleStyles.warn, elem);
    },
    Error: function (mes, elem) {
        console.error("%c" + mes, this.ConsoleStyles.warn, elem);
    },
    Table: function (elem) {
        console.table(elem);
    },

    ConsoleStyles: {
        h1: "font: 2.5em/1 Arial; color: crimson;",
        h2: "font: 2em/1 Arial; color: orangered;",
        h3: "font: 1.5em/1 Arial; color: olivedrab;",
        bold: "font: bold 1.3em/1 Arial; color: midnightblue;",
        warn: "padding: 0 .5rem; background: crimson; font: 1.6em/1 Arial; color: white;"
    }
};

//Request
(function () {

	/**  
     * @param {string} url 
     * @param {function} onSuccess 
     * @param {any} data 
     * @param {function} method 
     * @param {function} onError 
     * @param {bool} showError 
     * @returns {void} 
     */
    Utils.Request = function (url, onSuccess, data, method, onError, showError) {
        if (!(data instanceof Object)) {
            data = {
                id: data
            };
        }

        var ajaxSetting = {
            url: url,
            method: method ? method : "GET",
            data: data,
            success: function (answer) {
                if (onSuccess instanceof Function) onSuccess(answer);
            },
            error: function (answer) {
                if (onError instanceof Function && (SHOW_DEBUG || showError)) onError(answer);
            }
        };

        this.getJson = function () {
            // ajaxSetting.type="json";
            $.ajax(ajaxSetting);
        };

        this.getHtml = function () {
            ajaxSetting.type = "html";
            $.ajax(ajaxSetting);
        };
    };

    Utils.SaveLogToFile = function (data, fileName, catalog, saveToCdn, ext) {
        if (!data) return;
        if (saveToCdn) return;
        //data: JSON.stringify(planets)

        var sendData = {
            FileData: JSON.stringify(data),// data, //JSON.stringify(data),
            FileName: fileName,
            Ext: ext || ".json",
            Catalog: catalog || "wwwroot/log",
            SaveToCdn: false
        };
        return $.ajax({
            url: "/api/AppApi/PostSaveDataToFile/",
            method: "POST",
            data: sendData,//{ model: sendData},
            headers: Utils.XSRF.HeadersGetApiTokenObj()
            // если раскоментить работать не будет
            // contentType: "multipart/*", 
            //type: "json"
        });
    };
})();

//  events
Utils.Event = {};
(function () {
    function hasEvent(dom, eventType) {

        if (!eventType) return false;
        var has = false;
        var events = $._data(dom[0] ? dom[0] : dom, "events");
        if (events) {
            $.each(events, function (event) {
                if (event === eventType) {
                    has = true;
                }
            });
        }
        return has;
    }

    
    Utils.Event.HasEvent = hasEvent;
    Utils.Event.HasScroll = function (dom) {
        return hasEvent(dom, "DOMMouseScroll") || hasEvent(dom, "mousewheel") || hasEvent(dom, "onmousewheel");
    };
    Utils.Event.HasClick = function (dom) {
        return hasEvent(dom, "click");
    };
    Utils.Event.HasResize = function (dom) {
        return hasEvent(dom, "resize");
    };
    Utils.Event.HasHover = function (dom) {
        return hasEvent(dom, "mouseenter");

    };
})();

// Patterns
Utils.PatternFactory = {};
(function () {
    function Observer(nativeName) {
        var observer = {};

        var defaultNotifyName = nativeName;

        var observers = [];
        var observerUniqueIdFieldKey = "_observerUniqueId";
        var observerUniqueIdPrefix = "_observer_";

        function notifyAll(overageName, advancedData) {
            for (var i in observers) {
                if (observers.hasOwnProperty(i)) observers[i].Update(overageName || defaultNotifyName, advancedData);
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

        }
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
        }

        function push(command) {
            if (count() >= MAX_CAPACITY) {
                _.remove(stacks, 0);
            }
            stacks.push(command);
        }

        function pop() {
            return stacks.pop();
        }

        function clear() {
            stacks = [];
        }

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

Utils.Guid = {};
(function ($guid) {

    $guid.CreateQuickGuid = function () {
        return Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
    };
    $guid.CreateGuid = function () {
        var d = new Date().getTime();
        var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

    function IGuidDom() {
        this.Add = null;
        this.Get = null;
        this.Clean = null;
        this.Update = null;
        this.GetFromElem = null;
    }


    var dataDom = new IGuidDom();
    dataDom.Add = function (domElemOrUniqueSelector, guid, jqDom) {
        var dom = jqDom || $(domElemOrUniqueSelector);
        if (dom) dom.attr("data-guid", guid);
        return dom;

    };
    dataDom.Get = function (guid) {
        return $("[data-guid=" + guid + "]");
    };
    dataDom.Clean = function (guid, jqDom) {
        var dom = jqDom || Utils.Guid.Data.Get(guid);
        if (dom) dom.removeAttr("data-guid");
        return dom;
    };
    dataDom.Update = function (oldGuid, newGuid, jqDom) {
        var dom = jqDom || Utils.Guid.Data(oldGuid);
        if (dom) {
            dom.removeAttr("data-guid");
            dom.attr("data-guid", newGuid);
        }

        return dom;
    };
    dataDom.GetFromElem = function (jqDom) {
        return jqDom.data("guid");
    };

    $guid.Data = dataDom;

    var idDom = new IGuidDom();

    idDom.Add = function (domElemOrUniqueSelector, guid, jqDom) {
        var dom = jqDom || $(domElemOrUniqueSelector);
        if (dom) dom.attr("id", guid);
        return dom;
    };
    idDom.Get = function (guid) {
        return $("#" + guid);
    };
    idDom.Clean = function (guid, jqDom) {
        var dom = jqDom || idDom.Get(guid);
        if (dom) dom.removeAttr("id");
        return dom;
    };
    idDom.Update = function (oldGuid, newGuid, jqDom) {
        var dom = jqDom || idDom.Get(oldGuid);
        if (dom) dom.attr("id", newGuid);
        return dom;
    };
    idDom.GetFromElem = function (jqDom) {
        return jqDom.attr("id");
    };
    $guid.Id = idDom;


})(Utils.Guid);

//Parce
Utils.Parce = {};
(function ($p) {
    $p.FixSection = function (section) {
        if (typeof section === "object") throw Utils.Console.Error("Utils.FixSection section is object", { section: section });
        if (!section) section = "";
        if (typeof section !== "string") section += "";
        return section;
    };
    $p.EndsWithSeparatorAndReplace = function (section, setOrRemoveSeparator, _separator) {
        if (!_separator) throw new Error("Not set Separator");
        section = Utils.Parce.FixSection(section);
        var endW = _.endsWith(section, _separator);
        if (setOrRemoveSeparator && !endW) section = section + _separator;
        else if (!setOrRemoveSeparator && endW) section = section.substring(0, section.length - 1);
        return section;
    };
    $p.StartsWithSeparatorAndReplace = function (section, setOrRemoveSeparator, _separator) {
        if (!_separator) throw new Error("Not set Separator");
        section = Utils.Parce.FixSection(section);
        var startw = _.startsWith(section, _separator);
        if (setOrRemoveSeparator && !startw) section = _separator + section;
        else if (!setOrRemoveSeparator && startw) section = _separator + section.substring(1);
        return section;
    };
    $p.GetUrlInfo = function (srcUrl, checkSchemaInfo) {
        function UrlInfo() {
            var _url = srcUrl ? Utils.Parce.EndsWithSeparatorAndReplace(srcUrl, false, "/") : "";
            this._srcUrl = srcUrl;
            this.Catalog = "";
            this.Sections = _.split(_url, "/");
            var length = this.Sections.length - 1;
            this.FileName = this.Sections[length];
            this.Catalog = _.take(this.Sections, length);
            this.Catalog = _.join(this.Catalog, "/");
            this.Catalog += "/";
            this.Ext = null;
            this._isFile = null;
            this.IsFile = function () {
                if (this._isFile || typeof this._isFile === "boolean") return this._isFile;
                if (this.FileName.length <= 4) this._isFile = false;
                else {
                    this.Ext = this.FileName.substr(this.FileName.length - 4);
                    if (_.startsWith(this.Ext, ".")) this._isFile = true;
                    else this._isFile = false;
                }
                return this._isFile;
            };
            this.Url = _url;
            this.IsRelative = null;
            this.HasSsl = null;
            this.HasSchema = null;
            if (checkSchemaInfo) {
                this.IsRelative = this.Sections[0] === "/";
                if (!this.IsRelative) {
                    this.HasSsl = false;
                    this.HasSchema = this.Sections[0] === "https" || this.Sections[0] === "http";
                    if (this.HasSchema) this.HasSsl = this.Sections[0] === "https";
                }

            }
            return this;

        }

        return new UrlInfo();
    };
})(Utils.Parce);

//File
Utils.File = {
    B64toBlob: null,
    blobToBase64: null
};
(function ($f) {
    $f.B64toBlob = function (b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    };
    $f.blobToBase64 = function (blob, callback) {
        var reader = new FileReader();
        reader.onload = function () {
            var dataUrl = reader.result;
            var base64 = dataUrl.split(',')[1];
            callback(base64);
        };
        reader.readAsDataURL(blob);
    };
    //blob:https://localhost:44328/65d4cf4d-7aa2-42a9-ba90-45395efdf3a1
})(Utils.File);