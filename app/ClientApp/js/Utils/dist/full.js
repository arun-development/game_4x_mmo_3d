var Utils = {
    CoreApp: {}    
};

//RepoKeys base 
Utils.RepoKeys = {
    LsKeys: {
        FloatVoteParams: "float-vote-params",
        VoteRegistredData: "vote-officer-registrated-data"
    },
    HtmlKeys: {
        ResourceContainerId: "#current-resources",
        BuildContainerId: "#buildContainer",
        MapControlContainerId: "#map-control",
        Value: "value",
        //main
        Itemid: "itemid",
        Data: "data",
        Name: "name",
        Type: "type",
        Search: "search",
        Option: "option",
        Section: "section",
        Slider: ".slider",
        Id: "id",
        CssActive: "active",


        ServerMessage: "server-message",

        //in form
        BuildControl: "build-control",
        Info: "info",
        Action: "action",
        Upgrade: "upgrade",
        DropContainer: "drop-container",


        //upgrade
        Level: "level",
        Property: "property",
        Properties: "properties",
        Price: "price",
        ButtonSubmit: "button-sumbit",
        PriceTimeproduction: "price-timeproduction",
        CurrentValue: "currentvalue",
        NextValue: "nextvalue",
        ForCc: "forcc",
        CssNewItem: "newitem",
        //timer
        Timer: "timer",
        //data-{}
        //Timeproduction: "timeproduction",
        StartTime: "start-time",
        Duration: "duration",
        Progress: "progress",

        //      action storage
        ResourceTransferFormId: "#resource-transfer-form",
        TargetNameTranslate: "targetNameTranslate",
        Losses: "losses",
        TargetTransferOwnList: "#target-transfer-own-list",
        BtnSendAll: "btn-send-all",


        //      action energy converter
        ResourceExchangeFormId: "#resource-exchange-form",

        //      action extraction
        ExtractionFormId: "#extraction-form",


        //res names
        E: "e",
        Ir: "ir",
        Dm: "dm",
        Cc: "cc",

        Current: "current",
        Target: "target",
        Max: "max",
        Range: "range",
        Base: "base",
        Source: "source",

        EstatesList: "estates-list",

        // map controls
        BtnGalaxyInfo: "#btnGalaxyInfo",
        BtnSectorInfo: "#btnSectorInfo",
        BtnPlanetInfo: "#btnPlanetInfo",
        BtnStarInfo: "#btnStarInfo",
        btnJumpToSector: "#btnJumpToSector",
        BtnJumpToPlanetoid: "#btnJumpToPlanetoid",
        BtnJumpToMother: "#btnJumpToMother",
        BtnJumpToUserPlanet: "#btnJumpToUserPlanet",
        BtnJumpToGalaxy: "#btnJumpToGalaxy",
        BtnOpenBookmarks: "#btnOpenBookmarks",


        HangarItemsKeys: function () {
            return [this.Drone, this.Frigate, this.Battlecruiser, this.Battleship, this.Drednout];
        },
        Drone: "drone",
        Frigate: "frigate",
        Battlecruiser: "battlecruiser",
        Battleship: "battleship",
        Drednout: "drednout",
        HangarDataKey: "hangar",
        //hangar group

        //journal
        TotalItems: "total-items",


        //storeKeys
        Toggle: "toggle",

        StoreProductId: "store-product-id",
        ProductName: "product-name",
        ProductTranslateName: "product-translate-name",
        ProductCost: "product-cost",
        ProductCurrencyCode: "product-currency-code",
        ProductTypeId: "product-type-id",
        ProductTypeNativeName: "product-type-native-name",
        ProductTypeTranslateName: "product-type-translate-name",
        StoreItemsListId: "#store-items-list",
        StoreSelectProductCategoryId: "#store-select-product-category"


    },
    DataKeys: {
        //clases name
        Progress: "Progress",
        StorageResources: "StorageResources",
        ResourcesView: "ResourcesView",
        MaterialResource: "MaterialResource",

        //undefinded
        Level: "Level",
        Losses: "Losses",
        Units: "Units",
        Action: "Action",
        Update: "Update",
        Properties: "Properties",
        Price: "Price",
        Data: "Data",

        //propertites
        PropertyName: "PropertyName",
        CurrentValue: "CurrentValue",
        NextValue: "NextValue",

        //status
        IsProgress: "IsProgress",

        //action
        Target: "Target",
        Source: "Source",

        //resourses
        Current: "Current",
        Max: "Max",
        E: "E",
        Ir: "Ir",
        Dm: "Dm",
        Cc: "Cc",

        //build names
        NativeName: "NativeName",
        IndustrialComplex: "IndustrialComplex",
        CommandCenter: "CommandCenter",

        SpaceShipyard: "SpaceShipyard",
        Shipyard: "Shipyard",

        Storage: "Storage",
        Turel: "Turel",
        Laboratory: "Laboratory",
        LaboratoryBuild: "LaboratoryBuild",
        EnergyConverter: "EnergyConverter",
        ExtractionModule: "ExtractionModule",

        //extraction data
        ExtractionPerHour: "ExtractionPerHour",
        Power: "Power",
        Percent: "Percent",
        TimeProduction: "TimeProduction",

        _unitListNames: [],
        UnitListNames: function () {
            if (this._unitListNames.length > 0) {
                return this._unitListNames;
            } else {
                var names = Utils.RepoKeys.HtmlKeys.HangarItemsKeys();
                for (var j = 0; j < names.length; j++) {
                    this._unitListNames.push(_.upperFirst(names[j]));
                }
            }
            return this._unitListNames;
        },

        //Journal
        BattleResults: {
            AtackerWin: "AtackerWin",
            AtackerEscape: "AtackerEscape",
            DefenderWin: "DefenderWin",
            DeadHeat: "DeadHeat"

        },

        //================================_______SITE_______================================
        //Store
        //Chest
        Activated: "Activated",

        //modelNames
        ItemProgress: "ItemProgress"
    },
    EstateListKeys: {
        PlanetId: "PlanetId",
        Name: "Name",
        Type: "Type",
        OwnId: "OwnId",
        Sector: "Sector",
        System: "System",
        Galaxy: "Galaxy",
        TextureTypeId: "TextureTypeId"
    },
    //*estatelist data transform to lower keys
    _estateListKeys: {},
    LowerEstateListKeys: function () {
        if ($.isEmptyObject(this._estateListKeys)) {
            var keys = this.EstateListKeys;
            for (var i in keys) {
                if (!keys.hasOwnProperty(i)) continue;
                this._estateListKeys[i] = keys[i].toLowerCase();
            }
        }

        return this._estateListKeys;
    },

    //build properties
    StorageProperties: function () {
        return ["Energy", "Iridium", "DarkMatter", "TransferLosses"];
    },
    EnergyConverterProperties: function () {
        return ["ConvertLosses"];
    },
    ExtractionModuleProperties: function () {
        return ["Power"];
    },
    TurelProperties: function () {
        return [];
    },
    SpaceShipyardProperties: function () {
        return ["Speed"];
    }
};

// RepoKeys buildIds
(function () {
    var buildIds = {};
    buildIds._buildPlanshetIds = null;
    buildIds._buildIds = [
        "industrial-complex",
        "command-center",
        "space-shipyard",
        "laboratory"
    ];
    buildIds._rebuildIds = function () {
        var ids = buildIds._buildIds;
        buildIds._buildPlanshetIds = [];
        for (var i in ids) {
            if (ids.hasOwnProperty(i)) {
                var pref = "build-collection-";
                buildIds._buildPlanshetIds.push(pref + ids[i]);
            }
        }
    };

    buildIds.GetPlanshetIds = function () {
        if (buildIds._buildPlanshetIds === null) buildIds._rebuildIds();
        return buildIds._buildPlanshetIds;
    };
    buildIds.GetBuildIdByIdx = function (idx) {
        if (buildIds._buildPlanshetIds === null) buildIds._rebuildIds();
        return buildIds._buildPlanshetIds[idx];
    };

    Utils.RepoKeys.DataKeys.BuildIds = buildIds;

    Object.freeze(Utils.RepoKeys.HtmlKeys);
    Object.freeze(Utils.RepoKeys.DataKeys);

})();
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
(function (Time) {
 
    // #region Constants

    /**
    * @returns {int}1d  Milisecond 86400000ms
    */
    Time.ONE_DAY = 86400000;

    /**
    * @returns {int} 1d Second  86400s
    */
    Time.ONE_DAY_SECOND = 86400;

    /**
    * @returns {int} 1h Milisecond  3600000ms
    */
    Time.ONE_HOUR = 3600000;

    /**
    * @returns {int}1h Second  3600s
    */
    Time.ONE_HOUR_SECOND = 3600;

    /**
    * @returns {int}  1m in Milisecond 60000ms
    */
    Time.ONE_MINUTE = 60000;
    /**
    * @returns {int} Second  60s
    */
    Time.ONE_MINUTE_SECOND = 60;

    /**
    * @returns {int}  1000ms
    */
    Time.ONE_SECOND = 1000;

    /**
    * @returns {int} 20s Second  20000 ms 
    */
    Time.TIME_CACHE_BUILD = Time.ONE_SECOND * 20;

    /**
    * @returns {int} 1min Milisecond 60000ms
    */
    Time.TIME_CACHE_PLANSHET = Time.ONE_MINUTE;

    /**
     * @returns {int} ms
     */
    Time.TIME_CACHE_PROFILE = Time.ONE_HOUR * 8;

    /*
     * @returns {int} ms      10 min
     */
    Time.TIME_CACHE_MAP_INFO = Time.ONE_MINUTE * 10;

    /*
   * @returns {int} 10 min   in ms
   */
    Time.TIME_CACHE_BOOKMARKS = Time.ONE_MINUTE * 10;

    /**
    * @returns {int} 10Min Milisecond 
    */
    Time.DELAY_SYNCHRONIZE = Time.ONE_MINUTE * 10; //ms

    Time.LOCAL_SERVER_DELTA_TIME = 0;

    /**
     * @returns {int} ms
     */
    Time.TIME_CACHE_ALLIANCE = Time.ONE_DAY * 30;

    /**
    * @returns {int} ms
    */
    Time.TIME_CACHE_USER_CHANNELS = Time.ONE_DAY * 30;

    /**
    * @returns {int} 10min is ms
    */
    Time.TIME_CACHE_JOURNAL = Time.ONE_DAY * 30;

    /**
   * @returns {int} ms
   */
    Time.TIME_CACHE_CONFEDERATION = Time.ONE_DAY * 30;


    /**
    * @returns {int} 200 ms 
    */
    Time.DROP_ELEMENT_ANIMATION = 200;

    // #endregion
 
    // #region Members

    Time.GetUtcDateTimeFromMsUtc = function (utcMsSecond) {
        var offset = Time.GetTimeZone();
        var dateTime = new Date(utcMsSecond);
        dateTime.setHours(dateTime.getHours() - offset);
        return dateTime;
    };
    Time.GetUtcDateTimeFromSecondUtc = function (utcSecond) {
        return Time.GetUtcDateTimeFromMsUtc(utcSecond * 1000);
    };

    /**
   * Возвращает разницу между UTC-временем и местным временем, в часах
   * @returns {int} hour
   */
    Time.GetTimeZone = function () {
        var timeZoneInMimutes = new Date().getTimezoneOffset();
        return -1 * timeZoneInMimutes / 60;
    };
    /**
    * Преобразует UTC  дату(Тип даты который приходит с сервера) В дату на клиенте с учетом часового пояса (смещения времени относительно utc)
     * @param {date}   Принимает Данные в формате DateTime
    * @returns {date} DateTime Дату на в соответствии с временем на клиенте
    */
    Time.DateUTCToLocalDate = function (dateUtc) {
        return dateUtc.setHours(dateUtc.getHours() + Time.GetTimeZone());
    };
    /**
     * Вычисляет разницу между переданными параметрами текущей даты и конечной даты, для типизированного формата дат (к клиенскому или UTC  формату)
     * @param {date} dateStart 
     * @param {date} dateEnd 
     * @returns {string} html tag Данные в часах или днях в зависимости от разницы между мереданными датами 
     */
    Time.CalculateDateByDifferent = function (dateEnd) {
        var currClientDate = new Date();
        var dateDifferent = dateEnd - currClientDate;

        var result = "";

        if (Time.ONE_DAY < dateDifferent) {
            result = Math.floor(dateDifferent / Time.ONE_DAY) + "d";

        }
        else {
            result = "<span class=\"red\"> " + Math.floor(dateDifferent / Time.ONE_HOUR) + "h </span>";
        }

        return result;
    };

    /**
     * 
     * @param {int} secondsIn timestamp second if null default timestamp utcNow in second
     * @returns {string} date   разделенная  сепаратором":"
     */
    Time.Seconds2Time = function (secondsIn, separator) {
        if (!separator) separator = ":";
        if (secondsIn <= 0) {
            return "00" + separator + "00" + separator + "00";
        }
        if (!secondsIn) secondsIn = Time.GetUtcNow();
        var component = [];
        var residual = 0;


        var d = Math.floor(secondsIn / Time.ONE_DAY_SECOND);
        if (0 !== d) component.push(d + "d");
        residual = secondsIn % Time.ONE_DAY_SECOND;

        var h = Math.floor(residual / Time.ONE_HOUR_SECOND);
        if (h < 10) h = "0" + h;
        component.push(h + "h");
        residual = residual % Time.ONE_HOUR_SECOND;

        var m = Math.floor(residual / Time.ONE_MINUTE_SECOND);
        if (m < 10) m = "0" + m;
        component.push(m);
        residual = residual % Time.ONE_MINUTE_SECOND;

        var s = residual;
        if (s < 10) s = "0" + s;
        if (0 === d) component.push(s);
        return component.join(separator);
    };
    Time.GetUtcNow = function (isMilisecond) {
        var d = new Date();
        var ms = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() - Time.GetTimeZone(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()) + Time.LOCAL_SERVER_DELTA_TIME;
        if (isMilisecond) return ms;
        return Math.floor(ms / 1000);
    };

    // #endregion 
})(Utils.Time = {});
(function () {
    function Timer(options) {
        options = $.extend({
            elem: null,
            button: 'button',
            actionMethod: null,
            interval: 5000,
            targetForm: '#timer',
            role: '[role=timer]'
        }, options);

        if (!options.elem || !options.actionMethod) {
            return {
                init: function () { }
            }
        }

        var inProcess = false;

        function getDateStart() {
            if (!Timer.dateStart) {
                Timer.dateStart = Date.now();
            }

            return Timer.dateStart;
        };


        function start() {
            Timer.dateStart = getDateStart();

            if (!inProcess) {
                inProcess = true;

                setTimeout(function () {
                    Timer.dateStart = null;
                    inProcess = false;
                }, options.interval);

            }
        };


        function status() {
            if (Timer.dateStart) {
                return (Timer.dateStart + options.interval) - Date.now();
            }

            return false;
        };

        $(options.elem).find(options.button).click(function () {
            if (!status()) {
                options.actionMethod(this);

            } else {
                $(options.targetForm).modal();
                $(options.targetForm).find(options.role).text(status());
            }

            start();
        });
    }
    Timer.dateStart = null;
    var TimeDelay = {
        BaseDelay: 2000, // ms
        Objects: {},
        Start: function (timerKey, delay) {
            if (this.Objects[timerKey]) {
                return;
            }

            this.Objects[timerKey] = {
                StartTime: Date.now(),
                Delay: delay || TimeDelay.BaseDelay
            };
        },
        IsTimeOver: function (timerKey) {
            if (!this.Objects[timerKey]) {
                return true;
            }

            var timer = this.Objects[timerKey];

            if ((timer.StartTime + timer.Delay) < Date.now()) {
                delete this.Objects[timerKey];
                return true;
            }

            return false;
        },
        UpdateTimer: function (timerKey, delay) {
            if (!this.IsTimeOver(timerKey)) {
                delete this.Objects[timerKey];
                this.Start(timerKey, delay);
            } else {
                this.Start(timerKey, delay);
            }
        },
        Chronometer: {
            SetProgressHtmlData: function (chronometerrDom, progress) {
                chronometerrDom.attr("data-timer", JSON.stringify(progress));
            },
            GetProgressHtmlData: function (chronometerrDom) {
                return Utils.ModelFactory.ItemProgress(chronometerrDom.data("timer"));
            },
            TimeSelectors: {
                //Timer: Utils.GenAttrItem(["timer"], true),
                Timer: "[itemid=timer]",
                StartTime: "[data-start-time]",
                Duration: "[data-duration]",
                Progress: "[data-progress]"
            },
            Timers: {},
            TimerModel: function () {
                return {
                    DomElem: null,
                    StartTime: null,
                    Duration: null,
                    EndTime: null,
                    Progress: null,
                    CallBack: null,
                    IsStop: null,
                    Update: null
                }
            },
            _getNativeName: function (elem, skipParent) {
                var parent = elem;
                for (var i = 0; i < skipParent; i++) {
                    parent = parent.parent();
                }

                var itemid = parent.attr("itemid");

                if (!itemid) {
                    console.log("Error :class Utils.TimeDelay.Chronometer.CreateTimer,  parent name =  не найден  или имя было изменено");
                    return false;
                }

                return itemid;
            },
            CreateTimer: function (dom, domSkipUp, callback, progressData) {

                //===
                //  console.log("qwertyui");
                //===

                var timeData;

                if (progressData) {
                    progressData = Utils.ModelFactory.ItemProgress(progressData);
                    this.SetProgressHtmlData(dom, progressData);
                    timeData = progressData;
                }
                else {
                    timeData = this.GetProgressHtmlData(dom);
                }

                var progress = timeData.IsProgress;
                if (!progress) {
                    return;
                }

                var name = this._getNativeName(dom, domSkipUp);


                //var startTime = dom.attr(s.StartTime);
                //var duration = +dom.attr(s.Duration);
                //var endTime = startTime + duration;

                var startTime = timeData.StartTime;
                var duration = timeData.Duration;
                var endTime = startTime + duration;
                if (!(callback instanceof Function)) {
                    callback = function () { };
                }

                this.Timers[name] = {
                    DomElem: dom,
                    StartTime: startTime,
                    Duration: duration,
                    EndTime: endTime,
                    Progress: progress,
                    CallBack: callback,
                    IsStop: false,
                    Update: function () {
                        var d = Math.floor(Time.GetUtcNow());
                        var timeToLeft = this.EndTime - d;

                        var timeProgress = Math.abs((timeToLeft / this.Duration) * 100 - 100);

                        this.DomElem.prev().css("width", timeProgress + "%");
                        this.DomElem.parent().addClass("opacityPlus");

                        if (timeToLeft <= 0) {
                            this.DomElem.parent().removeClass("opacityPlus");
                            this.CallBack();
                            this.IsStop = true;
                            this.DomElem.attr("data-progress", "false");
                        }

                        var outData = Time.Seconds2Time(timeToLeft);
                        this.DomElem.html(outData);
                    }
                };
            },


            SetCustomTimer: function (timerName, timerModel) {
                if (!(timerModel.CallBack instanceof Function)) {
                    timerModel.CallBack = function () { };
                }
                timerModel.IsStop = false;
                this.Timers[timerName] = timerModel;
            },
            //        ProtoObject: {
            //            StartTime: 0,
            //            Duration: 0,
            //            EndTime: 0,
            //            Progress: false
            //        },
            Objects: {},
            TimerId: null,
            Start: function () {
                var self = this;
                if (this.TimerId) {
                    return;
                }

                this.TimerId = setInterval(function () {
                    var timers = self.Timers;
                    for (var name in timers) {
                        if (!timers.hasOwnProperty(name)) continue;
                        if (timers[name].IsStop) {
                            delete timers[name];
                            continue;
                        }
                        timers[name].Update();
                    }
                }, 1000);
            },
            Clear: function (name) {
                //delete this.Chronometer.Timers[name];
                delete this.Timers[name];
            },
            TimeOver: function (callback) {
                if (callback) {
                    callback();
                }
            }
        }
    };
    Utils.Timer = Timer;
    Utils.TimeDelay = TimeDelay;
})();
//Response
Utils.Response = {
    HomeVideo: null,
    Sizes: null
};
(function (r) {
    var sizes = {
        Small: 412,
        Medium: 768,
        Large: 1200
    };
    function Player(videoId) {
        var p = {};
        var vId = videoId;
        p.getVideo = function () {
            return document.getElementById(vId);
        }
        p.getSize = function () {
            p.size = $(window).width();
            return p.size;
        };
        p.canPlay = function () {
            return (p.getSize() > sizes.Medium);
        };
        p.onResize = function () {
            var canPlay = p.canPlay();
            var vCont = p.getVideo();
            if (canPlay) vCont.play();
            else vCont.pause();

        }
        return p;
    };
    var homeVideo = {
        Player: null,
        Init: function () {
            var dId = "homeVideoBackground";
            var v = document.getElementById(dId);
            if (!v) {
                Utils.Console.Error("VIDEO NOT EXIST");
                return;
            };
            if (!homeVideo.Player) homeVideo.Player = Player(dId);
            // toggle();
            window.addEventListener("resize", function () {
                if (homeVideo.Player && homeVideo.Player.hasOwnProperty("onResize")) {
                    homeVideo.Player.onResize();
                }
            });
            setTimeout(function () {
                homeVideo.Player.onResize();
            }, 50);
        }
    };

    r.HomeVideo = homeVideo;
    r.Sizes = sizes;
})(Utils.Response);
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
//ModelFactory
Utils.ModelFactory = {
    //mainRequest
    KeyVal: function(key, val) {
        function KeyVal() {
            this.Key = key;
            this.Val = val;
        }

        return new KeyVal();
    },
    RequestParams: function() {
        return {
            url: "",
            method: "GET",
            data: {},
            onSuccess: null,
            onError: null
        };
    },
    //for map
    Vector3: function() {
        return {
            X: null,
            Y: null,
            Z: null

        };
    },
    IBattleStats: function(atack, hp) {
        function IBattleStats() {
            this.Attack = atack || 0;
            this.Hp = hp || 0;
        }

        return new IBattleStats();
    },

    FileSaver: function (data, fileName, ext, catalog) {
        return {
            FileData: data,
            FileName: fileName,
            Ext: ext || ".json",
            Catalog: catalog || "log",
            SaveToCdn: false
        };
    },


    //bookmarks
    BookmarkOut: function () {
        function BookmarkOut() {
            //[Required]
            this.Id = 0;
            this.TypeId = 0;
            this.TypeName = "";
            this.SubTypeName = "";
            this.ObjectId = 0;
            this.IsFull = false;
        }

        return new BookmarkOut();
    },

    MapItemGeometry: function (id, nativeName, textureTypeId, gameTypeId, galaxyId, sectorId) {
        function MapItemGeometry() {
            this.Id = id || 0;
            this.NativeName = nativeName || "";
            this.TextureTypeId = textureTypeId || null;
            this.GameTypeId = gameTypeId || null;
            this.GalaxyId = galaxyId || null;
            this.SectorId = sectorId || null;
        }

        return new MapItemGeometry();
    },

    Sector: function () {
        var $self = this;

        function Sector() {
            this.TranslateName = "";
            this.Translate = Utils.TranslateTextField();
            this.Position = $self.Vector3();
        }

        return _.extend(new Sector(), this.MapItemGeometry());
    },
    EstateListData: function (data) {
        if (data) {
            return {
                Name: (data.hasOwnProperty("Name")) ? data.Name : null,
                Type: (data.hasOwnProperty("Type")) ? data.Type : null,
                System: (data.hasOwnProperty("System")) ? data.System : null,
                Sector: (data.hasOwnProperty("Sector")) ? data.Sector : null,
                Galaxy: (data.hasOwnProperty("Galaxy")) ? data.Galaxy : null,
                OwnId: (data.hasOwnProperty("OwnId")) ? data.OwnId : null,
                TextureTypeId: (data.hasOwnProperty("TextureTypeId")) ? data.TextureTypeId : null
            };
        }

        return {
            Name: null,
            Type: null,
            System: null,
            EndSystem: null,
            Sector: null,
            Galaxy: null,
            OwnId: null,
            TextureTypeId: null
        };
    },
    //for translate


    //for builds interface
    ItemProgress: function (data) {
        if (data)
            return {
                Level: (data.hasOwnProperty("Level") ? data.Level : null),
                StartTime: (data.hasOwnProperty("StartTime") ? data.StartTime : null),
                Duration: (data.hasOwnProperty("Duration") ? data.Duration : null),
                IsProgress: (data.hasOwnProperty("IsProgress") ? data.IsProgress : null),
                RemainToComplete: (data.hasOwnProperty("RemainToComplete") ? data.RemainToComplete : null)
            };
        else {
            return {
                Level: null,
                StartTime: null,
                Duration: null,
                IsProgress: null,
                RemainToComplete: null
            };
        }

    },


    MaterialResources: function (e, ir, dm) {
        return {
            E: e || 0,
            Ir: ir || 0,
            Dm: dm || 0
        };
    },
    ConvertToMaterialResourses: function (dataMaterialResource) {
        var result = {};
        var materRes = this.MaterialResources();
        for (var resName in materRes) {
            if (!materRes.hasOwnProperty(resName)) continue;

            if (dataMaterialResource.hasOwnProperty(resName)) {
                result[resName] = Utils.ConvertToInt(dataMaterialResource[resName]);

            }
            else {
                result[resName] = 0;
            }
        }

        return result;
    },
    StorageResources: function () {
        return {
            Current: this.MaterialResources(),
            Max: this.MaterialResources()
        };
    },
    GameResource: function (e, ir, dm, time, cc) {
        var matRes = this.MaterialResources(e, ir, dm);
        return $.extend({
            TimeProduction: time || null,
            Cc: cc || null
        }, matRes);
    },
    ResourcesView: function () {
        return {
            StorageResources: this.StorageResources(),
            Cc: 0
        };
    },
    BuildUpgrade: function () {
        return {
            NativeName: "",
            Progress: this.ItemProgress(),
            StorageResources: this.StorageResources()
        };
    },
    ResourceItemModel: function () {
        return {
            TranslateName: "",
            NativeName: "",
            Max: 0,
            Current: 0,
            Percent: 0.0
        };
    },


    BuildDropItemInfo: function () {
        return {
            Description: null,
            DropImage: null
        };
    },
    BuildDropItemAction: function (data) {
        return {
            ViewPath: "",
            Data: data
        };
    },

    BuildStorageActions: function () {
        return {
            StorageResources: this.StorageResources(),
            Losses: null
        };
    },
    BuildExtractionModuleActions: function () {
        return {
            ExtractionPerHour: this.MaterialResources(),
            Percent: this.MaterialResources(),
            Power: null
        };
    },
    BuildEnergyConverterActions: function () {
        return {
            StorageResources: this.StorageResources(),
            ConvertLoses: null
        };
    },

    BuildDropItemUpdate: function (propertyNativeName) {
        var p = [];
        if (propertyNativeName && propertyNativeName.length > 0) {
            for (var i = 0; i < propertyNativeName.length; i++) {
                var pp = this.BuildPropertyView();
                pp.PropertyNativeName = propertyNativeName[i];

                p.push(pp);
            }
        }
        return {
            Properties: p,
            Price: this.GameResource()
        };
    },
    BuildPropertyView: function () {
        return {
            PropertyName: null,
            PropertyNativeName: null,
            CurrentValue: null,
            NextValue: null
        };
    },

    BuildItemUnitView: function (nativeName) {
        var upgr = this.BuildDropItemUpdate();
        var action = null;
        var dk = Utils.RepoKeys.DataKeys;
        if (nativeName === dk.Storage) {
            upgr = this.BuildDropItemUpdate(Utils.RepoKeys.StorageProperties());
            action = this.BuildDropItemAction(this.BuildStorageActions());
        }
        else if (nativeName === dk.EnergyConverter) {
            upgr = this.BuildDropItemUpdate(Utils.RepoKeys.EnergyConverterProperties());
            action = this.BuildDropItemAction(this.BuildEnergyConverterActions());
        }
        else if (nativeName === dk.ExtractionModule) {
            upgr = this.BuildDropItemUpdate(Utils.RepoKeys.ExtractionModuleProperties());
            action = this.BuildDropItemAction(this.BuildExtractionModuleActions());
        }
        else if (nativeName === dk.Turel) {
            upgr = this.BuildDropItemUpdate(Utils.RepoKeys.TurelProperties());
            action = this.BuildDropItemAction({});
        }
        else if (nativeName === dk.SpaceShipyard) {
            upgr = this.BuildDropItemUpdate(Utils.RepoKeys.SpaceShipyardProperties());
            action = this.BuildDropItemAction({});
        }
        return {
            IconSelf: null,
            TranslateName: null,
            NativeName: nativeName,
            Progress: this.ItemProgress(),
            Type: null,
            Info: this.BuildDropItemInfo(),
            Action: action,
            Update: upgr
        };
    },
    TransferResource: function (data) {
        if (data) {
            return {
                Resources: (data.hasOwnProperty("Resources")) ? this.MaterialResources(data.Resources.E, data.Resources.Ir, data.Resources.Dm) : this.MaterialResources(),
                SourceId: (data.hasOwnProperty("SourceId")) ? this.MaterialResources(data.SourceId) : null,
                SourceType: (data.hasOwnProperty("SourceType")) ? this.MaterialResources(data.SourceType) : null,
                TargetId: (data.hasOwnProperty("TargetId")) ? this.MaterialResources(data.TargetId) : null,
                TargetType: (data.hasOwnProperty("TargetType")) ? this.MaterialResources(data.TargetType) : null
            };
        }

        return {
            Resources: this.MaterialResources(),
            SourceId: null,
            SourceType: null,
            TargetId: null,
            TargetType: null
        };
    },

    //images

    Images: function (data) {
        var model = {
            Source: "",
            Icon: "",
            Detail: ""
        };
        if (!data) {
            return model;
        }

        model.Source = (data.hasOwnProperty("Source") && data.Source !== null) ? data.Source : model.Detail;
        model.Icon = (data.hasOwnProperty("Icon") && data.Icon) ? data.Icon : model.Icon;
        model.Detail = (data.hasOwnProperty("Detail") && data.Detail) ? data.Detail : model.Detail;
        return model;
    },
    Label: function (data) {
        return this.Images(data);
    },
    Avatar: function (data) {
        return this.Images(data);

    },
    SpriteImages: function (data) {
        var model = {};
        if (!data) {
            model = this.Images();
            model.Medium = "";
            return model;
        }
        else {
            model = this.Images(data);
            model.Medium = (data.hasOwnProperty("Medium")) ? data.Medium : "";
            return model;
        }

    },


    //fleets and unit

    HangarUnitsView: function (nativeName) {
        return {
            NativeName: nativeName,
            Name: "",
            SpriteImages: this.SpriteImages(),
            Count: null,
            Progress: this.ItemProgress()
        };
    },
    ListHangarUnitsView: function () {

        return {
            Drone: this.HangarUnitsView("Drone"),
            Frigate: this.HangarUnitsView("Frigate"),
            Battlecruiser: this.HangarUnitsView("Battlecruiser"),
            Battleship: this.HangarUnitsView("Battleship"),
            Drednout: this.HangarUnitsView("Drednout")
        };
    },
    UnitList: function (data, isObj) {
        return {
            Drone: (data && data.hasOwnProperty("Drone") && data.Drone !== null) ? data.Drone : isObj ? {} : 0,
            Frigate: (data && data.hasOwnProperty("Frigate") && data.Frigate !== null) ? data.Frigate : isObj ? {} : 0,
            Battlecruiser: (data && data.hasOwnProperty("Battlecruiser") && data.Battlecruiser !== null) ? data.Battlecruiser : isObj ? {} : 0,
            Battleship: (data && data.hasOwnProperty("Battleship") && data.Battleship !== null) ? data.Battleship : isObj ? {} : 0,
            Drednout: (data && data.hasOwnProperty("Drednout") && data.Drednout !== null) ? data.Drednout : isObj ? {} : 0
        };
    },
    TaskFleet: function (data) {
        if (data) {
            return {
                //for create new task item
                SourceId: data.SourceId,
                TargetName: data.TargetName,
                IsTransfer: data.IsTransfer,
                Units: (data.hasOwnProperty("Units") && data.Units !== null) ? this.UnitList(data.Units) : null,

                //for check timer and update
                TimeOver: data.TimeOver,
                FlyDuration: data.FlyDuration,
                StartTime: data.StartTime,
                IsWin: data.IsWin,
                BattleResult: data.BattleResult,

                EstateItemData: this.EstateListData(data.EstateItemData)
            };
        }

        return {
            //for create new task item
            SourceId: null,
            TargetName: "",
            IsTransfer: false,
            Units: this.UnitList(),

            //for check timer and update
            TimeOver: false,
            FlyDuration: null,
            StartTime: null,
            IsWin: false,
            BattleResult: "",

            EstateItemData: this.EstateListData()
        };
    },


    UnitTurnOut: function () {
        return {
            OwnId: null,
            UserId: 0,
            NativeName: "",
            Count: 1,
            ForCc: false
        };
    },



    //views
    BodyTemplate: function (data) {
        var model = {
            BodyId: "",
            LastId: 1,
            TemplateUrl: "",
            TemplateData: {}

        };
        if (!data) {
            return model;
        }
        model.BodyId = (data.hasOwnProperty("BodyId") && data.BodyId !== null) ? data.BodyId : model.BodyId;
        model.LastId = (data.hasOwnProperty("LastId") && data.LastId !== null) ? data.LastId : model.LastId;
        model.TemplateUrl = (data.hasOwnProperty("TemplateUrl") && data.TemplateUrl !== null) ? data.TemplateUrl : model.TemplateUrl;
        model.TemplateData = (data.hasOwnProperty("TemplateData") && data.TemplateData !== null) ? data.TemplateData : model.TemplateData;

        return model;
    },
    PlanshetHelper: function (data) {
        var model = {
            UniqueId: "",
            HeadTranslateName: "",
            Buttons: [],
            Bodys: [],
            TemplateUrl: "",
            HasTabs: false
        };
        if (!data) {
            return model;
        }
        model.UniqueId = (data.hasOwnProperty("UniqueId") && data.UniqueId !== null) ? data.UniqueId : model.UniqueId;
        model.HeadTranslateName = (data.hasOwnProperty("HeadTranslateName") && data.HeadTranslateName !== null) ? data.HeadTranslateName : model.HeadTranslateName;
        model.Buttons = (data.hasOwnProperty("Buttons") && data.Buttons !== null && data.Buttons.length > 0) ?
            (function () {
                var q = [];
                for (var i = 0; i < data.Buttons.length; i++) {
                    q.push(Utils.ModelFactory.ButtonsView(data.Buttons[i]));
                }
                return q;
            })()
            : model.Buttons;
        model.Bodys = (data.hasOwnProperty("Bodys") && data.Bodys !== null && data.Bodys.length > 0) ?
            (function () {
                var q = [];
                for (var i = 0; i < data.Bodys.length; i++) {
                    q.push(Utils.ModelFactory.BodyTemplate(data.Bodys[i]));
                }
                return q;
            })() : model.Bodys;
        model.TemplateUrl = (data.hasOwnProperty("TemplateUrl") && data.TemplateUrl) ? data.TemplateUrl : model.TemplateUrl;
        model.HasTabs = (data.hasOwnProperty("HasTabs") && data.HasTabs) ? data.HasTabs : model.HasTabs;
        return model;
    },


    SectionItem: function (data) {
        var model = {
            Data: {},
            Path: "",
            IsPath: false,
            Size: "",
            ItemId: "",
            JsFunction: "",
            IsComplexPart: false,
            IsSimpleCentr: false
        };
        if (!data) {
            return model;
        }
        else {
            model.Data = (data.hasOwnProperty("Data") && data.Data !== null) ? data.Data : model.Data;
            model.Path = (data.hasOwnProperty("Path") && data.Path !== null) ? data.Path : model.Path;
            model.IsPath = (data.hasOwnProperty("IsPath") && data.IsPath !== null) ? data.IsPath : model.IsPath;
            model.Size = (data.hasOwnProperty("Size") && data.Size !== null) ? data.Size : model.Size;
            model.ItemId = (data.hasOwnProperty("ItemId") && data.ItemId !== null) ? data.ItemId : model.ItemId;
            model.JsFunction = (data.hasOwnProperty("JsFunction") && data.JsFunction !== null) ? data.JsFunction : model.JsFunction;
            model.IsComplexPart = (data.hasOwnProperty("IsComplexPart") && data.IsComplexPart !== null) ? data.IsComplexPart : model.IsComplexPart;

            return model;
        }


    },
    ComplexButtonList: function (data) {
        var $self = this;
        var col = {
            Collection: (function () {
                var e = [];
                if (data && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        e.push($self.SectionItem(data[i]));
                    }
                }

                return e;
            })()
        };
        return col;
    },
    SectionContentViewData: function (data) {
        var model = {
            Left: this.SectionItem((data.hasOwnProperty("Left") && data.Left !== null) ? data.Left : null),
            Centr: this.SectionItem((data.hasOwnProperty("Centr") && data.Centr !== null) ? data.Centr : null),
            Right: this.SectionItem((data.hasOwnProperty("Right") && data.Right !== null) ? data.Right : null)
        };
        return model;
    },
    ImageView: function (data) {
        var model = {
            ImagePathOrCss: "",
            Alt: "",
            Title: "",
            IsImage: false
        };
        if (!data) {
            return model;
        }
        model.ImagePathOrCss = (data.hasOwnProperty("ImagePathOrCss") && data.ImagePathOrCss !== null) ? data.ImagePathOrCss : model.ImagePathOrCss;
        model.Alt = (data.hasOwnProperty("Alt") && data.Alt !== null) ? data.Alt : model.Alt;
        model.Title = (data.hasOwnProperty("Title") && data.Title !== null) ? data.Title : model.Title;
        model.IsImage = (data.hasOwnProperty("IsImage") && data.IsImage !== null) ? data.IsImage : model.IsImage;

        return model;

    },

    //alliance
    AllianceRoleUpdateOut: function (allianceId, userId, roleId) {
        return {
            AllianceId: allianceId,
            UserId: userId,
            RoleId: roleId
        };
    },

    /**
     * Creates a new IAllianceUserAccept empty if not params
     * @param {bool} userAccepted  userAccepted
     * @param {byte} allianceAccepted   allianceAccepted
     * @returns {object} new IAllianceUserAccept 
     */
    IAllianceUserAccept: function (userAccepted, allianceAccepted) {
        function IAllianceUserAccept() {
            this.UserAccepted = userAccepted || false;
            /**
             * status code 
             * 0 - data not set in instance
             * 1  - NoAction
             * 2 - Accept
             * 3 - Reject
             * @argument 0,1,2,3 
             */
            this.AllianceAccepted = allianceAccepted || 1;
        }

        return new IAllianceUserAccept();
    },

    /**
     * Creates a new AllianceUserRequestItem   empty if not params
     * base: IAllianceUserAccept
     * @param {string} groupName groupName 
     * @param {int} groupId  byte
     * @param {array} messages array<T> where t:AllianceRequestMessageDataModel
     * @param {bool} userAccepted   userAccepted
     * @param {bool} allianceAccepted    allianceAccepted
     * @returns {object} new AllianceUserRequestItem 
     */
    AllianceUserRequestItem: function (groupName, groupId, messages, userAccepted, allianceAccepted) {
        function AllianceUserRequestItem() {
            this.GroupName = groupName || "";
            this.GroupId = groupId || 0;
            this.Messages = messages || [];
        }

        return _.extend(new AllianceUserRequestItem(), this.IAllianceUserAccept(userAccepted, allianceAccepted));
    },

    /**
     * Creates a new AllianceRequestMessageDataModel
     * base: IAllianceUserAccept
     * @param {int} sourceType enum in server MessageSourceType (byte)
     * @param {int} fromId 
     * @param {string} fromName maxLength =14
     * @param {string} creatorIcon maxLeinght =1000
     * @returns {object} new AllianceRequestMessageDataModel 
     */
    AllianceRequestMessageDataModel: function (sourceType, fromId, fromName, creatorIcon) {
        function AllianceRequestMessageDataModel() {
            var $self = this;
            this.Id = 0;
            this.SourceType = sourceType || 0;
            this.FromId = fromId || 0;
            this.FromName = fromName || "";
            this.ToId = 0;
            this.ToName = "";
            this.DateCreate = 0;
            this.Message = "";
            this.CreatorIcon = creatorIcon || null;

            /**
             * 
             * @param {int} _sourceType enum in server MessageSourceType (byte)
             * @param {int} _fromId 
             * @param {string} _fromName maxLength =14
             * @param {string} _creatorIcon maxLeinght =1000
             */
            this._updateFrom = function (_sourceType, _fromId, _fromName, _creatorIcon) {
                this.SourceType = _sourceType;
                this.FromId = _fromId;
                this.FromName = _fromName;
                this.CreatorIcon = _creatorIcon;
            };
            this._setFromData = function (serverData) {
                Utils.UpdateObjData(this, serverData);
            };

            /**
             * 
            * @param {int} _toId   toId
            * @param {string} _toName maxLength =14
             */
            this._setTo = function (_toId, _toName) {
                this.ToId = _toId;
                this.ToName = _toName;
            };


            /** 
             * @param {int} _sourceType enum in server MessageSourceType (byte)
             * @param {int} _fromId 
             * @param {string} _fromName maxLength =14
             * @param {string} _creatorIcon maxLeinght =1000
             * 
             * @param {int} toId 
             * @param {string} toName maxLength =14
             * @param {int} dateCreate timestamp
             * @param {string} message FromName maxLength =1000
             * @param {bool} userAccepted 
             * @param {byte} allianceAccepted 
             * @param {int} id alliance_request_message.Id
             * @returns {} 
             */
            this._setAll = function (_sourceType, _fromId, _fromName, _creatorIcon, toId, toName, dateCreate, message, userAccepted, allianceAccepted, id) {
                this._updateFrom(_sourceType, _fromId, _fromName, _creatorIcon);
                this._setTo(toId, toName);
                this.DateCreate = dateCreate;
                this.Message = message;
                this.UserAccepted = userAccepted;
                this.AllianceAccepted = allianceAccepted;
                this.Id = id;
            };

            this._clone = function () {
                return _.cloneDeep(this);
            };
            this._getCleanData = function () {
                return {
                    Id: this.Id,
                    SourceType: this.SourceType,
                    FromId: this.FromId,
                    FromName: this.FromName,
                    ToId: this.ToId,
                    ToName: this.ToName,
                    DateCreate: this.DateCreate,
                    Message: this.Message,
                    UserAccepted: this.UserAccepted,
                    AllianceAccepted: this.AllianceAccepted,
                    CreatorIcon: this.CreatorIcon
                };
            };

        }

        return _.extend(new AllianceRequestMessageDataModel(), this.IAllianceUserAccept());
    },

    /**
     * 
     * Creates a new AllianceMessageModelExt
     * @param {bool} fromAlliance 
     * @param {int} allianceRoleId 
     * @param {int} allianceUserId 
     * @returns {object} new AllianceMessageModelExt
     */
    AllianceMessageModelExt: function (fromAlliance, allianceRoleId, allianceUserId) {
        var mf = this;

        function AllianceMessageModelExt() {
            this.Model = mf.AllianceRequestMessageDataModel();
            this.FromAlliance = fromAlliance;
            this.AllianceRoleId = allianceRoleId || 0;
            this.AllianceUserId = allianceUserId || 0;

            /**
             * 
             * @param {int} sourceType enum in server MessageSourceType (byte)
             * @param {int} fromId 
             * @param {string} fromName maxLength =14
             * @param {string} creatorIcon maxLeinght =1000
             * @returns {void}  
             */
            this._setModel = function (sourceType, fromId, fromName, creatorIcon) {
                this.Model._updateFrom(sourceType, fromId, fromName, creatorIcon);
            };
            this._setFromData = function (serverData) {
                Utils.UpdateObjData(this, serverData);
            };
            this._clone = function () {
                return _.cloneDeep(this);
            };

            this._getCleanData = function () {
                return {
                    Model: this.Model._getCleanData(),
                    FromAlliance: this.FromAlliance,
                    AllianceRoleId: this.AllianceRoleId,
                    AllianceUserId: this.AllianceUserId
                };
            };
        }

        return new AllianceMessageModelExt();
    },
    /**
     * Creates a new AllianceUserShort
     * @param {int} allianceId       allianceId
     * @param {string} allianceName   allianceName
     * @param {int} userId    userId
     * @param {string} userName     userName
     * @param {int} allianceUserId  allianceUserId
     * @param {int} allianceRoleId    allianceRoleId
     * @param {object} allianceLabel   allianceLabel
     * @param {object} userAvatar    userAvatar
     * @returns {object} new AllianceUserShort
     */
    AllianceUserShort: function (allianceId, allianceName, userId, userName, allianceUserId, allianceRoleId, allianceLabel, userAvatar) {
        function AllianceUserShort() {
            this.allianceId = allianceId;
            this.allianceName = allianceName;
            this.userId = userId;
            this.userName = userName;
            this.allianceUserId = allianceUserId;
            this.allianceRoleId = allianceRoleId;
            this.allianceLabel = allianceLabel;
            this.userAvatar = userAvatar;

        }

        return new AllianceUserShort();

    },
    /**
     * Creates a new PostSimpleModel
     * @param {int} id 
     * @param {string} nativeName 
     * @returns {object}  new PostSimpleModel
     */
    PostSimpleModel: function (id, nativeName) {
        function PostSimpleModel() {
            this.Id = id || 0;
            this.NativeName = nativeName || "";
        }

        return new PostSimpleModel();
    },

    /**
     * Creates a new HubGropItem
     * @param {int} groupId 
     * @param {byte} groupType 
     * @param {string} nativeName 
     * @param {string} groupName 
     * @returns {object} new HubGropItem 
     */
    HubGropItem: function (groupId, groupType, nativeName, groupName) {
        function HubGropItem() {
            var $self = this;
            this.GroupId = groupId || 0;
            this.NativeName = nativeName || "";
            this.GroupeName = groupName || "";
            this.GroupType = groupType || 0;
            this._updateData = function (newData) {
                Utils.UpdateObjData($self, newData);
            };
        }

        return new HubGropItem();
    },

    /**
     * Creates a new ConnectionUser    by  serverInitData if exist  or empty
     * @param {object} serverInitData ConnectionUser 
     * @returns {object} new ConnectionUser
     */
    ConnectionUser: function (serverInitData) {
        function ConnectionUser() {
            var $self = this;
            //    this.AuthId = "";
            this.UserId = 0;
            this.Name = "";
            this.ConnectionId = "";
            this.AllianceId = 0;
            this.AllianceUserId = 0;
            this.AllianceName = "";
            this.AllianceRoleId = 0;
            this.Connected = false;
            this.DateLeft = 0;
            this.DateJoin = 0;
            this.Groups = {};
            this._updateData = function (serverData) {
                if (serverData.Groups) {
                    var oldData = _.cloneDeep($self.Groups);
                    _.forEach(serverData.Groups, function (newVal, key) {
                        if ($self.Groups && $self.Groups.hasOwnProperty(key) && $self.Groups[key]) {
                            $self.Groups[key]._updateData(newVal);
                            oldData[key] = null;
                            delete oldData[key];
                        }
                        else if (!$self.Groups.hasOwnProperty(key) || !$self.Groups.key) {
                            $self.Groups[key] = Utils.ModelFactory.HubGropItem();
                            $self.Groups[key]._updateData(newVal);
                        }

                    });
                    if (oldData && !Utils.CheckObjIsEmpty(oldData)) {
                        _.forEach(oldData, function (val, key) {
                            $self.Groups[key] = null;
                            delete $self.Groups[key];
                        });
                        oldData = null;
                    }
                }
                else this.Groups = null;
                Utils.UpdateObjData($self, serverData);

            };
        }

        var user = new ConnectionUser();
        if (!serverInitData) return user;
        user._updateData(serverInitData);
        return user;


    },
    /**
     * Creates a new IAllianceNameSerchItem    by  serverInitData if exist  or empty
     * @param {object} serverInitData  serverInitData
     * @returns {object} new IAllianceNameSerchItem 
     */
    IAllianceNameSerchItem: function (serverInitData) {
        function IAllianceNameSerchItem() {
            var $self = this;
            this.Id = 0;
            this.Name = "";
            /**
             * bool
             */
            this.Disbandet = null;

            this._updateData = function (serverData) {
                Utils.UpdateObjData($self, serverData);
            };
            /**
             * 
             * @param {int} id 
             * @param {string} name 
             * @param {bool} disbandet 
             * @returns {void} 
             */
            this._setModel = function (id, name, disbandet) {
                this.Id = id;
                this.Name = name;
                this.Disbandet = disbandet;
            };
        }

        var iAllianceNameSerchItem = new IAllianceNameSerchItem();
        if (!serverInitData) return iAllianceNameSerchItem;
        iAllianceNameSerchItem._updateData(serverInitData);
        return iAllianceNameSerchItem;
    },

    /**
    * Creates a new Base64ImageOut  model
    * @param {string} base64File   can't NULL
    * @param {string} ext 
    * @param {bool} notCutPrefix  can be null
    * @returns {object} new  Base64ImageOut
    */
    Base64ImageOut: function (base64File, ext, notCutPrefix) {
        function Base64ImageOut() {
            this.Base64File = notCutPrefix ? base64File : base64File.split("base64,")[1];
            this.Ext = ext;
        }

        return new Base64ImageOut();
    },

    /**
     * создает новый объект IBasePropertyInfo  по заданным параметрам
     * @param {any} oldVal 
     * @param {any} newVal 
     * @param {string} propertyName 
     * @param {any} advancedData 
     * @returns {object} new   IBasePropertyInfo
     */
    IBasePropertyInfo: function (oldVal, newVal, propertyName, advancedData) {
        function IBasePropertyInfo() {
            this.OldValue = oldVal;
            this.NewValue = newVal;
            this.PropertyName = propertyName;
            this.AdvancedData = advancedData;
        }

        return new IBasePropertyInfo(oldVal, newVal, propertyName, advancedData);
    },

    /**
     * 
     * @param {object} iBasePropertyInfo    see  IBasePropertyInfo
     * @param {object} baseObserverable    объект из которого вызван нотиффер
     * @returns {object}  new INotyfyBase
     */
    INotyfyModel: function (iBasePropertyInfo, baseObserverable) {
        function INotyfyBase() {
            this.Observerable = baseObserverable;
            this.PropertyInfo = iBasePropertyInfo;
        }

        return new INotyfyBase();
    },
    IUserImageModel: function (source, icon, detail) {
        function IUserImageModel() {
            this.Source = source || "";
            this.Icon = icon || "";
            this.Detail = detail || "";
        }
        var img = new IUserImageModel();
        Object.defineProperty(img, "DefaultMaxLength", {
            get: function () {
                return 1000;
            }
        });
        return img;

    },
    IChannelMessageDataModel: function (iChatMessageDataModel) {
        function IChannelMessageDataModel() {
            this.Id = 0;
            this.ChannelId = 0;
            this.UserId = 0;
            this.UserName = "";
            this.UserIcon = "";
            this.Message = "";
            this.DateCreate = 0;
        }

        var model = new IChannelMessageDataModel();
        if (iChatMessageDataModel) {
            model.Id = iChatMessageDataModel.Id;
            model.ChannelId = iChatMessageDataModel.ChannelId;
            model.UserId = iChatMessageDataModel.UserId;
            model.UserName = iChatMessageDataModel.UserName;
            model.UserIcon = iChatMessageDataModel.UserIcon;
            model.Message = iChatMessageDataModel.Message;
            model.DateCreate = iChatMessageDataModel.DateCreate;
        }

        return model;
    },

    IChannelMessageTransfer: function (iChannelMessageTransfer) {
        var model = this.IChannelMessageDataModel(iChannelMessageTransfer);
        model.ChannelType = iChannelMessageTransfer ? iChannelMessageTransfer.ChannelType : 0;
        return model;
    },
    /**
     * 
     * @param {int} id 
     * @param {string} name 
     * @returns {} 
     */
    INameIdModel: function (id, name) {
        return {
            Id: id,
            Name: name
        };
    },
    IChannelMessageCreateModel: function (iChannelMessageCreateModel) {
        var model = this.IChannelMessageTransfer(iChannelMessageCreateModel);
        if (iChannelMessageCreateModel) {
            model.To = iChannelMessageCreateModel.To;
        }
        else {
            model.To = this.INameIdModel();
        }
        return model;
    },
    IChannelDataModel: function () {
        function IChannelDataModel() {
            this.Id = 0;
            this.Password = "";
            this.ChannelType = 0;
            this.ChannelName = "";
            this.DateCreate = 0;
            this.CreatorId = 0;
            this.CreatorName = "";
            this.ChannelIcon = "";
            this.ChannelConnections = null;
        }

        return new IChannelDataModel();
    },

    IChannelSerchItem: function (id, name, isPublic) {
        var model = this.INameIdModel(id, name);
        model.IsPublic = isPublic;
        return model;
    }
};
//SiteModelFactory
Utils.SiteModelFactory = {
    /**
     * 
     * @param {object} UchField data 
     * @returns {object} UchField
     */
    UchField: function () {
        return {
            /**
             * {int} chestId
             */
            Id: null,
            /**
            * {int?}
            */
            TabelId: null,

            /**
             * {int}
             */
            ProductStoreId: null,
            /**
             * {int}
             */
            ProductTypeId: null,
            /**
             * {bool}
             */
            Activated: null,
            /*
             * timestamp {int?}
             */
            DateActivate: "",
            /*
            * timestamp {int?}
            */
            DateEndTime: "",
            /*
          * timestamp {int?}
          */
            DateCreate: null,
            ProductItemProperty: this.ProductItemProperty()

        };
    },
    ListUchField: function (data) {
        var dataNotNull = (data) ? true : false; //var isEmpty = true;
        if (dataNotNull) {
            var obj = {};
            _.forEach(data, function (vale, key) {
                if (data.hasOwnProperty(key)) {
                    obj[key] = this.UchField(data[key]);
                }
            });
            return obj;
        }
        return {};

    },
    ConvertListUchField__To__DictUchClientField: function (data, lang) {
        if (!data || !lang) {
            console.log("no data");
            return;
        }
        // this.ListUchField;
        var protoListUchField = data;
        var result = this.DictUchClientField();
        for (var i in protoListUchField) {
            if (protoListUchField.hasOwnProperty(i)) {
                var item = protoListUchField[i];
                //protoUchClientField[item.ProductTypeId] = item.ProductTypeId;
                //var itemId = item.;
                //var prepareItem = protoUchClientField[itemId];
                var productId = item.ProductStoreId;
                if (result[productId]) {
                    result[productId].Count++;
                    result[productId].Ids.push(item.Id);

                } else {
                    result[productId] = {};
                    result[productId].Count = 1;

                    result[productId].Ids = [item.Id];
                    result[productId].ProductTypeId = item.ProductTypeId;
                    result[productId].ProductStoreId = item.ProductStoreId;
                    result[productId].Description = item.ProductItemProperty.TranslateText[lang].Description;
                    result[productId].Name = item.ProductItemProperty.TranslateText[lang].Name;
                    result[productId].Image = item.ProductItemProperty.ImgCollectionImg.Chest;

                }
            }
        }

        return result;
    },
    DictUchClientField: function (data) {
        var dataNotNull = (data) ? true : false;
        if (dataNotNull) {
            var obj = {};
            if (data.hasOwnProperty("Id")) {
                obj[data.Id] = this.UchClientInactiveField();

            }
            return obj;
        }
        return {};
    },

    ProductItemField: function (data) {
        var dataNotNull = (data) ? true : false;
        return {
            Id: (dataNotNull && data.hasOwnProperty("Id") && data.Id !== null) ? data.Id : null,
            ProductTypeId: (dataNotNull && data.hasOwnProperty("ProductTypeId") && data.ProductTypeId !== null) ? data.ProductTypeId : null,
            Property: (dataNotNull && data.hasOwnProperty("Property") && data.Property !== null) ? data.Property : null
        };
    },
    ProductItemProperty: function () {
        return {
            TranslateText: Utils.L10N(),
            ImgCollectionImg: this.ImgCollectionimgField(),
            Property: {}
        };
    },
    ImgCollectionimgField: function (data) {
        var DATA_NOT_NULL = (data) ? true : false;
        return {
            Store: DATA_NOT_NULL && data.hasOwnProperty("Store") && data.Store !== null ? data.Store : "",
            Chest: DATA_NOT_NULL && data.hasOwnProperty("Id") && data.Chest !== null ? data.Chest : ""
        };
    },

    PremiumMods: function () {
        return {
            Duration: 0,
            TimeBuildUpdate: 0.00,
            TimeUnitProduction: 0.00,
            ResourseProduction: 0.00,
            ResourseMaxStorable: 0.00,
            ConvertLoses: 0.00,
            PremiumBookmarkMod: 0.00
        };
    },
};
//angular  helpers
Utils.A = {};
(function ($a) {
    $a.getValFromParent = function ($scope, propName) {
        if (!$scope || !propName) return null;
        if ($scope[propName]) {
            return $scope[propName];
        }
        else {
            return $a.getValFromParent($scope.$parent, propName);
        }
    };
    $a.getParentScopeWithProp = function ($scope, propName) {
        if (!$scope || !propName) return null;

        if ($scope[propName]) {
            return $scope;
        }
        else {
            return $a.getParentScopeWithProp($scope.$parent, propName);
        }
    };
    $a.getParentScopeWithPropAndDepth = function ($scope, propName, maxDepth) {
        if (maxDepth === null || maxDepth === undefined) {
            console.log("Utils.A.getParentScopeWithPropAndDepth : param 'maxDepth' not exist value will be set to default 1");
            maxDepth = 1;
        }
        if (!$scope || !propName || maxDepth < 0) return null;
        if ($scope[propName]) {
            return $scope;
        }
        else {
            return $a.getParentScopeWithProp($scope.$parent, propName, --maxDepth);
        }
    };

})(Utils.A);

//babylon helpers
(function () {
    var colorCoef = Utils.INT_TO_COLOR_PROP = 1 / 255;
    Utils.ObjectToVector3 = function (object) {
        return new BABYLON.Vector3(object.X, object.Y, object.Z);
    };
    Utils.ObjectToColor3 = function (object) {
        if (object.hasOwnProperty("R")) return new BABYLON.Color3(object.R, object.G, object.B);
        else if (object.hasOwnProperty("r")) return new BABYLON.Color3(object.r, object.g, object.b);
        else if (object.hasOwnProperty("X")) return new BABYLON.Color3(object.X, object.Y, object.Z);
        else if (object.hasOwnProperty("x")) return new BABYLON.Color3(object.x, object.y, object.z);
        Utils.Console.Error("ColorTypeError Utils.ObjectToColor3", { object: object, suported: "RGB, rgb, XYZ ,xyz (x=r,y=g,z=b)" });
        return false;
    };
    Utils.ObjectToColor4 = function (object) {
        if (object.hasOwnProperty("R")) return new BABYLON.Color4(object.R, object.G, object.B, object.A);
        else if (object.hasOwnProperty("r")) return new BABYLON.Color4(object.r, object.g, object.b, object.a);
    };

    Utils.Color3IntToDecimal = function (color3, scale) {
        if (!scale) scale = 1;
        return new BABYLON.Color3(color3.r * colorCoef * scale, color3.g * colorCoef * scale, color3.b * colorCoef * scale);
    };
    /**
    * @name CalcDistanceVector3
   * @description  Врзвращает расстояние междудвумя точками по каждой координате
   * @param {BABYLON.Vector3} startPoint  координаты начального меша точки отсчета текущего полоэения камеры
   * @param {BABYLON.Vector3} endPoint  координаты конечного меша относительно стартового положения
   * @returns {object} BABYLON.Vector3
   */
    Utils.CalcDistanceVector3 = function (startPoint, endPoint) {
        var x = endPoint.x - startPoint.x;
        var y = endPoint.y - startPoint.y;
        var z = endPoint.z - startPoint.z;
        return new BABYLON.Vector3(x, y, z);
    };
    Utils.CalcStepDistanceVector3 = function (startPoint, endPoint, steps) {
        var source = this.CalcDistanceVector3(startPoint, endPoint);
        var stepX = source.x / steps;
        var stepY = source.y / steps;
        var stepZ = source.z / steps;

        return new BABYLON.Vector3(stepX, stepY, stepZ);
    };

    /**
* @name Alpha
* @description Расчитывает сферическии координаты Alpha   0-1
* @param {BABYLON.Vector3} startPoint  координаты начального меша точки отсчета текущего полоэения камеры
* @param {BABYLON.Vector3} endPoint  координаты конечного меша относительно стартового положения
* @returns {number} float
*/
    Utils.CalcAlpha = function (startPoint, endPoint) {
        var startPointVector2 = new BABYLON.Vector2(startPoint.x, startPoint.z);
        var endPointVector2 = new BABYLON.Vector2(endPoint.x, endPoint.z); //        return Math.cos(new BABYLON.Angle.BetweenTwoPoints(startPointVector2, endPointVector2).degrees());
        return new BABYLON.Angle.BetweenTwoPoints(startPointVector2, endPointVector2).radians();
    };
    /**
* @name Beta
* @description Расчитывает шферическии кооржинаты Beta   0-1
* @param {BABYLON.Vector3} startPoint  координаты начального меша точки отсчета текущего полоэения камеры
* @param {BABYLON.Vector3} endPoint  координаты конечного меша относительно стартового положения
* @returns {number} float
*/
    Utils.CalcBeta = function (startPoint, endPoint) {
        var startPointVector2 = new BABYLON.Vector2(startPoint.y, startPoint.z);
        var endPointVector2 = new BABYLON.Vector2(endPoint.y, endPoint.z);
        return Math.cos(new BABYLON.Angle.BetweenTwoPoints(startPointVector2, endPointVector2).degrees());
    };

    /**
* @description  Возвращает смещение угла Beta  за  один шаг
* @param {BABYLON.Vector3} startPoint  координаты начального меша точки отсчета текущего полоэения камеры
* @param {BABYLON.Vector3} endPoint  координаты конечного меша относительно стартового положения
* @param {int} steps  количкство шагов до окончания анимации или другого действия
* @returns {float}  угол Beta
*/
    Utils.CalcBetaWhithStep = function (startPoint, endPoint, steps) {
        return this.CalcBeta(startPoint, endPoint) / steps;
    };
    /**
* @description  Возвращает смещение угла Alpha  за  один шаг
* @param {BABYLON.Vector3} startPoint  координаты начального меша точки отсчета текущего полоэения камеры
* @param {BABYLON.Vector3} endPoint  координаты конечного меша относительно стартового положения
* @param {int} steps  количкство шагов до окончания анимации или другого действия
* @returns {float}  угол Alpha
*/
    Utils.CalcAlphaWhithStep = function (startPoint, endPoint, steps) {
        return this.CalcAlpha(startPoint, endPoint) / steps;
    };
    /**
* @description  Растояние между двмя точками BABYLON.Vector3
* @param {object} startPoint BABYLON.Vector3  
* @param {object} endPoint BABYLON.Vector3
* @returns {number} float Расстояние
*/
    Utils.CalcDisntanse = function (startPoint, endPoint) {
        return BABYLON.Vector3.Distance(startPoint, endPoint);
    };
    Utils.CheckNullDistanceVector3 = function (startPoint, endPoint) {
        return 0 === BABYLON.Vector3.Distance(startPoint, endPoint);
    };

    /**
* @name AnomateCameraToTargetMeth
* @description Расчитывает точку приварпа камеры 
* @param {BABYLON.Vector3} cameraPosition координаты камеры до начала действия анимации 
* @param {BABYLON.Vector3} meshPosition координаты целевого меша
* @param {float} endRadius радиус камеры от объекта целевого меша
* @returns {BABYLON.Vector3} Координаты точки
*/
    Utils.CalcEndPoint = function (cameraPosition, meshPosition, endRadius) {
        var c = cameraPosition;
        var m2 = meshPosition;
        var distCm2 = this.CalcDisntanse(c, m2);
        var distCr = distCm2 - endRadius;
        var k = distCr / endRadius;

        if (-1 === k) {
            k = -0.99999;
        }
        var rX = (c.x + (k * m2.x)) / (1 + k);
        var rY = (c.y + (k * m2.y)) / (1 + k);
        var rZ = (c.z + (k * m2.z)) / (1 + k);
        return new BABYLON.Vector3(rX, rY, rZ);
    };
    Utils.GetColor3FromInts = function (baseColor, defaultColor) {
        if (baseColor) return BABYLON.Color3.FromInts(baseColor.r, baseColor.g, baseColor.b);
        if (defaultColor) return defaultColor;
        return new BABYLON.Color3(0, 0, 0);
    };

    Utils.SceneSelectTextureFileNames = function () {
        var items = _.map(EM.Scene.textures, function (o) {
            var q = _.split(o, "/");
            return { fileName: q[q.length - 1] };
        });
        return _.orderBy(items, "fileName", ['asc']);
    };

})();
 
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
//dat.Guid   plugin for babylon js 
Utils.DatGuid = {};
(function ($g) {
    var $GUID;
    $g.getGuid = function () {
        if ($GUID) {
            return $GUID;
        }
        if (!dat.GUI.prototype.removeFolder) {
            dat.GUI.prototype.removeFolder = function (name) {
                var folder = this.__folders[name];
                if (!folder) {
                    return;
                }
                folder.close();
                this.__ul.removeChild(folder.domElement.parentNode);
                delete this.__folders[name];
                this.onResize();
            };
            dat.GUI.prototype.getFolder = function (name) {
                return this.__folders[name];
            }
        }
        $GUID = new dat.GUI();
        $GUID.domElement.style.marginTop = "150px";
        $GUID.domElement.id = "datGUI";
        $GUID.width = 500;
        return $GUID;
    };
    $g.removeMainFolder = function (folderName) {
        var folder = $g.getMainFolder(folderName);
        if (folder) {
            $g.getGuid().removeFolder(folderName);
        }

    };
    $g.getMainFolder = function (folderName) {
        var guid = $g.getGuid();
        return guid.getFolder(folderName);
    };
    $g.addMainFolder = function (folderName) {
        var gui = $g.getGuid();
        var folder = $g.getMainFolder(folderName);
        if (!folder) {
            return gui.addFolder(folderName);
        }
        return folder;
    };

    $g.getFolderFromParent = function (parentFolder, childFolderName) {
        return parentFolder.getFolder(childFolderName);
    }

    $g.getOrAddMaterialFolder = function (materialIdOrMaterial, disposeIfExist) {
        if (!materialIdOrMaterial) {
            throw new Error("material id not exist");
        }
        var materialId;
        var material;
        if (typeof materialIdOrMaterial === "string") {
            materialId = materialIdOrMaterial;
        }
        else {
            material = materialIdOrMaterial;
            materialId = materialIdOrMaterial.id;
        }

        var folderName = "MATERIAL : " + materialId;
        var folder = $g.getMainFolder(folderName);
        if (disposeIfExist && folder) {
            folder.removeFolder();
        }
        if (!folder) {
            folder = $g.addMainFolder(folderName);
        }
        if (!folder.__material) {
            if (!material) {
                material = EM.GetMaterial(materialId);
            }
            if (!material) {
                throw new Error("material not exist");
            }
            folder.__material = material;
        }
        return folder;

    };
    $g.addChildMaterialFolder = function (materialIdOrMaterial, childMaterialPropertyName) {
        var main = $g.getOrAddMaterialFolder(materialIdOrMaterial);
        var child = main.getFolder(childMaterialPropertyName);
        if (child) return child;
        return main.addFolder(childMaterialPropertyName);
    };
    $g.getChildMaterialFolder = function (materialIdOrMaterial, childMaterialPropertyName) {
        var main = $g.getOrAddMaterialFolder(materialIdOrMaterial);
        var child = main.getFolder(childMaterialPropertyName);
        return child;
    };

    $g.createTextureView = function (materialFolder, textureOptions) {
        var props = textureOptions.getPropKeys();
        var textureFolder = $g.getFolderFromParent(materialFolder, textureOptions.propertyName);
        if (textureFolder) return textureFolder;
        var material = materialFolder.__material;
        textureFolder = $g.addChildMaterialFolder(material.id, textureOptions.propertyName);
        _.forEach(props, function (texturePropertyName) {
            if (texturePropertyName === "url") {
                function recreateTexture(value) {
                    if (material[textureOptions.propertyName][texturePropertyName] !== value && value) {
                        textureOptions[texturePropertyName] = value;
                        material[textureOptions.propertyName].dispose();
                        delete material[textureOptions.propertyName];
                        material[textureOptions.propertyName] = new BABYLON.Texture(value, EM.Scene);
                        _.forEach(props, function (propName) {
                            if (propName !== "url") {
                                material[textureOptions.propertyName][propName] = textureOptions[propName];
                            }
                        });
                    }
                }
                recreateTexture(textureOptions[texturePropertyName]);
                textureFolder.add(material[textureOptions.propertyName], texturePropertyName, textureOptions[texturePropertyName]).onChange(function (value) {
                    recreateTexture(value);
                });
            }
            else {
                if (material[textureOptions.propertyName][texturePropertyName] !== textureOptions[texturePropertyName]) {
                    material[textureOptions.propertyName][texturePropertyName] = textureOptions[texturePropertyName];
                }
                if (!textureOptions.min[texturePropertyName]) {
                    textureOptions.min[texturePropertyName] = 0.000;
                }
                if (!textureOptions.max[texturePropertyName]) {
                    var max = 1;
                    if (textureOptions[texturePropertyName] !== 0) {
                        max = textureOptions[texturePropertyName];
                    }
                    max *= 50;
                    textureOptions.max[texturePropertyName] = max;
                }
                textureFolder.add(material[textureOptions.propertyName], texturePropertyName, textureOptions.min[texturePropertyName], textureOptions.max[texturePropertyName]).onChange(function (value) {
                    material[textureOptions.propertyName][texturePropertyName] = value;
                });

            }



        });
        return textureFolder;
    };

    function IBaseOptions() {
        this.min = {};
        this.max = {};
        this.getPropKeys = function () {
            return Object.keys(this);

        };
    }


    $g.createTextureOptions = function (texturePropertyName, url, level) {
        function iTextureOptions() {
            this.url = url;
            this.level = level || 1;
            this.uAng = 0;
            this.vAng = 0;
            this.wAng = 0;
            this.vOffset = 0;
            this.uOffset = 0;
            this.uScale = 1;
            this.vScale = 1;
            this.wrapU = 1;
            this.wrapV = 1;



            this.min.level = 0.0;
            this.min.uAng = 0;
            this.min.vAng = 0;
            this.min.wAng = 0;
            this.min.vOffset = 0;
            this.min.uOffset = 0;
            this.min.uScale = 1;
            this.min.vScale = 1;
            this.min.wrapU = 1;
            this.min.wrapV = 1;

            this.max.level = 50;
            this.max.uAng = 3.14;
            this.max.vAng = 3.14;
            this.max.wAng = 3.14;
            this.max.vOffset = 1;
            this.max.uOffset = 1;
            this.max.uScale = 100;
            this.max.vScale = 100;
            this.max.wrapU = 100;
            this.max.wrapV = 100;
        }

        iTextureOptions.prototype = new IBaseOptions();
        iTextureOptions.prototype.constructor = iTextureOptions;
        iTextureOptions.prototype.propertyName = texturePropertyName;

        return new iTextureOptions();
    };

    $g.createParalaxOptions = function (bumpUrl, paralaxUrl) {
        function IParalaxOptions() {
            this.useParallax = false;
            this.useParallaxOcclusion = false;
            this.parallaxScaleBias = 0;

        }
        IParalaxOptions.prototype = new IBaseOptions();
        IParalaxOptions.prototype.constructor = IParalaxOptions;
        IParalaxOptions.prototype.bumpUrl = bumpUrl;
        IParalaxOptions.prototype.paralaxUrl = paralaxUrl;
        IParalaxOptions.prototype.min.parallaxScaleBias = 0.0001;
        IParalaxOptions.prototype.max.parallaxScaleBias = 0.2000;
        IParalaxOptions.prototype.renderMode = ["Parallax Occlusion", 'Parallax', 'Bump', 'None'];
        IParalaxOptions.prototype.bumpLevel = 1;
        IParalaxOptions.prototype.min.bumpLevel = 0.0;
        IParalaxOptions.prototype.max.bumpLevel = 10.0;

        return new IParalaxOptions();
    };
    $g.createParalaxView = function (materialFolder, paralaxOptions) {
        var props = paralaxOptions.getPropKeys();
        var folderName = "paralaxOptions";
        var paralaxFolder = $g.getFolderFromParent(materialFolder, folderName);
        if (paralaxFolder) return paralaxFolder;
        var material = materialFolder.__material;
        paralaxFolder = $g.addChildMaterialFolder(material, folderName);

        if (!material[$g.SUPORTED_TEXTURES.Bump]) {
            material[$g.SUPORTED_TEXTURES.Bump] = new BABYLON.Texture(paralaxOptions.bumpUrl, EM.Scene);
        }
        _.forEach(props, function (propName) {

            if (propName === "parallaxScaleBias") {
                paralaxFolder.add(material, propName, paralaxOptions.min[propName], paralaxOptions.max[propName]).onChange(function (value) {
                    material[propName] = value;
                });
            } else {
                paralaxFolder.add(material, propName, material[propName]).onChange(function (value) {
                    material[propName] = value;
                });
            }

        });
        paralaxFolder.add(paralaxOptions, "renderMode", paralaxOptions.renderMode).onChange(function (value) {
            function disposeOld(url) {
                if (material.bumpTexture && material.bumpTexture.url !== url) {
                    material.bumpTexture.dispose();
                    delete material.bumpTexture;
                    return true;
                } else if (!material.bumpTexture) {
                    return true;
                }
                return false;
            }
            switch (value) {
                case "Bump":
                    if (disposeOld(paralaxOptions.bumpUrl)) {
                        material.bumpTexture = new BABYLON.Texture(paralaxOptions.bumpUrl, EM.Scene);
                    }
                    material.useParallax = false;
                    material.useParallaxOcclusion = false;
                    break;
                case "Parallax":
                    if (disposeOld(paralaxOptions.paralaxUrl)) {
                        material.bumpTexture = new BABYLON.Texture(paralaxOptions.paralaxUrl, EM.Scene);
                    }
                    material.useParallax = true;
                    material.useParallaxOcclusion = false;
                    break;
                case "Parallax Occlusion":
                    if (disposeOld(paralaxOptions.paralaxUrl)) {
                        material.bumpTexture = new BABYLON.Texture(paralaxOptions.paralaxUrl, EM.Scene);
                    }
                    material.useParallax = true;
                    material.useParallaxOcclusion = true;
                    break;
                case "None":
                    disposeOld();
                    material.useParallax = false;
                    material.useParallaxOcclusion = false;
                    break;

            }
        });

        paralaxFolder.add(material[$g.SUPORTED_TEXTURES.Bump], "level", paralaxOptions.min.bumpLevel, paralaxOptions.max.bumpLevel).onChange(function (value, e) {

            var texture = material[$g.SUPORTED_TEXTURES.Bump];
            if (texture) {
                material[$g.SUPORTED_TEXTURES.Bump].level = value;
            } else {
                console.log("paralaxFolder bump texture not exist");
            }

        });
        console.log("material", material);
        return paralaxFolder;

    };


    $g.createColor3Options = function (currentColor3) {
        function iColor3Option() {
            this.r = currentColor3.r;
            this.g = currentColor3.g;
            this.b = currentColor3.b;

        }
        iColor3Option.prototype = new IBaseOptions();
        iColor3Option.prototype.constructor = iColor3Option;
        iColor3Option.prototype.min.r = 0.0;
        iColor3Option.prototype.min.g = 0.0;
        iColor3Option.prototype.min.b = 0.0;

        iColor3Option.prototype.max.r = 1.0;
        iColor3Option.prototype.max.g = 1.0;
        iColor3Option.prototype.max.b = 1.0;
        return new iColor3Option();

    };

    $g.createColor3View = function (materialFolder, colorPropName) {
        var colorFolder = $g.getFolderFromParent(materialFolder, colorPropName);
        if (colorFolder) return colorFolder;
        var material = materialFolder.__material;
        if (!material[colorPropName]) {
            material[colorPropName] = BABYLON.Color3.Black();
        }
        colorFolder = $g.addChildMaterialFolder(material.id, colorPropName);
        var colorOption = $g.createColor3Options(material[colorPropName]);
        var props = colorOption.getPropKeys();
        _.forEach(props, function (colorSegmentName) {
            colorFolder.add(material[colorPropName], colorSegmentName, colorOption.min[colorSegmentName], colorOption.max[colorSegmentName]).onChange(function (value) {
                material[colorPropName][colorSegmentName] = value;
            });
        });
        return colorFolder;

    };
    $g.createColor3Views = function (materialFolder) {
        _.forEach($g.SUPORTED_COLOR3, function (colorPropName, propKey) {
            $g.createColor3View(materialFolder, colorPropName);
        });
    };

    $g.createFresnelOption = function (leftColor3Option, rightColor3Option) {
        function iFresnelOption() {
            this.isEnabled = false;
            this.bias = 0.0;
            this.power = 0.0;
            this.leftColor = leftColor3Option;
            this.rightColor = rightColor3Option;
        }
        iFresnelOption.prototype = new IBaseOptions();
        iFresnelOption.prototype.constructor = iFresnelOption;

        iFresnelOption.prototype.min.power = 0.0;
        iFresnelOption.prototype.min.bias = 0.00;

        iFresnelOption.prototype.max.power = 100.0;
        iFresnelOption.prototype.max.bias = 10.00;

        return new iFresnelOption();
    };

    $g.createFresnelView = function (materialFolder, fresnelPropName) {
        var fresnelFolder = $g.getFolderFromParent(materialFolder, fresnelPropName);
        if (fresnelFolder) return fresnelFolder;
        var material = materialFolder.__material;
        fresnelFolder = $g.addChildMaterialFolder(material.id, fresnelPropName);

        if (!material[fresnelPropName]) {
            material[fresnelPropName] = new BABYLON.FresnelParameters();
            material[fresnelPropName].isEnabled = false;
        }

        var fresnelOption = $g.createFresnelOption($g.createColor3Options(material[fresnelPropName].leftColor), $g.createColor3Options(material[fresnelPropName].rightColor));
        var leftColorFolder = fresnelFolder.addFolder("leftColor");
        _.forEach(fresnelOption.leftColor.getPropKeys(), function (colorSegmentName) {
            leftColorFolder.add(material[fresnelPropName].leftColor, colorSegmentName, fresnelOption.leftColor.min[colorSegmentName], fresnelOption.leftColor.max[colorSegmentName]).onChange(function (value) {
                material[fresnelPropName].leftColor[colorSegmentName] = value;
            });
        });
        var rightColorFolder = fresnelFolder.addFolder("rightColor");
        _.forEach(fresnelOption.rightColor.getPropKeys(), function (colorSegmentName) {
            rightColorFolder.add(material[fresnelPropName].rightColor, colorSegmentName, fresnelOption.rightColor.min[colorSegmentName], fresnelOption.rightColor.max[colorSegmentName]).onChange(function (value) {
                material[fresnelPropName].rightColor[colorSegmentName] = value;
            });
        });
        fresnelFolder.add(material[fresnelPropName], "isEnabled", material[fresnelPropName].isEnabled).onChange(function (value) {
            material[fresnelPropName].isEnabled = value;
        });
        fresnelFolder.add(material[fresnelPropName], "bias", fresnelOption.min.bias, fresnelOption.max.bias).onChange(function (value) {
            material[fresnelPropName].bias = value;
        });
        fresnelFolder.add(material[fresnelPropName], "power", fresnelOption.min.power, fresnelOption.max.power).onChange(function (value) {
            material[fresnelPropName].power = value;
        });
        return fresnelFolder;

    };
    $g.createFresnelAllViews = function (materialFolder) {
        _.forEach($g.SUPORTED_FRESNEL_PARAMETERS, function (fresnelPropName) {
            $g.createFresnelView(materialFolder, fresnelPropName);
        });
    };

    $g.createAllMaterialViews = function (allMaterialOption) {
        var matFolder = $g.getOrAddMaterialFolder(allMaterialOption.materialIdOrMaterial, true);
        $g.cratePrimitiveMaterialViews(matFolder);
        $g.createColor3Views(matFolder);
        $g.createFresnelAllViews(matFolder);

        if (allMaterialOption.dffuseUrl) {
            $g.createTextureView(matFolder, $g.createTextureOptions($g.SUPORTED_TEXTURES.Dffuse, allMaterialOption.dffuseUrl, 1));
        }
        if (allMaterialOption.bumpUrl) {
            $g.createTextureView(matFolder, $g.createTextureOptions($g.SUPORTED_TEXTURES.Bump, allMaterialOption.bumpUrl, 1));
            if (allMaterialOption.paralaxUrl) {
                var paralaxOpts = $g.createParalaxOptions(allMaterialOption.bumpUrl, allMaterialOption.paralaxUrl);
                $g.createParalaxView(matFolder, paralaxOpts);
            }
        }
        if (allMaterialOption.specularUrl) {
            $g.createTextureView(matFolder, $g.createTextureOptions($g.SUPORTED_TEXTURES.Specular, allMaterialOption.Specular, 1));
        }
        if (allMaterialOption.ambientUrl) {
            $g.createTextureView(matFolder, $g.createTextureOptions($g.SUPORTED_TEXTURES.Ambient, allMaterialOption.ambientUrl, 1));
        }
        if (allMaterialOption.emissiveUrl) {
            $g.createTextureView(matFolder, $g.createTextureOptions($g.SUPORTED_TEXTURES.Emissive, allMaterialOption.emissiveUrl, 1));
        }
        if (allMaterialOption.opacityUrl) {
            $g.createTextureView(matFolder, $g.createTextureOptions($g.SUPORTED_TEXTURES.Opacity, allMaterialOption.emissiveUrl, 1));
        }
        if (allMaterialOption.reflectionUrl) {
            $g.createTextureView(matFolder, $g.createTextureOptions($g.SUPORTED_TEXTURES.Reflection, allMaterialOption.reflectionUrl, 1));
        }
        if (allMaterialOption.lightUrl) {
            $g.createTextureView(matFolder, $g.createTextureOptions($g.SUPORTED_TEXTURES.Light, allMaterialOption.lightUrl, 1));
        }
        if (allMaterialOption.heightUrl) {
            $g.createTextureView(matFolder, $g.createTextureOptions($g.SUPORTED_TEXTURES.Height, allMaterialOption.heightUrl, 1));
        }
        if (allMaterialOption.refractionUrl) {
            $g.createTextureView(matFolder, $g.createTextureOptions($g.SUPORTED_TEXTURES.Refraction, allMaterialOption.refractionUrl, 1));
        }

    };

    $g.cratePrimitiveMaterialViews = function (materialFolder) {
        var material = materialFolder.__material;
        var folderName = "Primetive";
        var primitiveFolder = $g.getFolderFromParent(materialFolder, folderName);
        if (primitiveFolder) {
            return primitiveFolder;
        }
        primitiveFolder = $g.addChildMaterialFolder(material.id, folderName);

        primitiveFolder.add(material, "alpha", 0, 1).onChange(function (value) {
            material.alpha = value;
        });
        primitiveFolder.add(material, "alphaMode", ["ALPHA_DISABLE",
                                                   "ALPHA_COMBINE",
                                                   "ALPHA_ONEONE",
                                                   "ALPHA_ADD",
                                                   "ALPHA_SUBTRACT",
                                                   "ALPHA_MULTIPLY",
                                                   "ALPHA_MAXIMIZED"]).onChange(function (value) {
                                                       switch (value) {
                                                           case "ALPHA_DISABLE":
                                                               material.alphaMode = BABYLON.Engine.ALPHA_DISABLE;
                                                               break;
                                                           case "ALPHA_COMBINE":
                                                               material.alphaMode = BABYLON.Engine.ALPHA_COMBINE;
                                                               break;
                                                           case "ALPHA_ONEONE":
                                                               material.alphaMode = BABYLON.Engine.ALPHA_ONEONE;
                                                               break;
                                                           case "ALPHA_ADD":
                                                               material.alphaMode = BABYLON.Engine.ALPHA_ADD;
                                                               break;
                                                           case "ALPHA_SUBTRACT":
                                                               material.alphaMode = BABYLON.Engine.ALPHA_SUBTRACT;
                                                               break;
                                                           case "ALPHA_MULTIPLY":
                                                               material.alphaMode = BABYLON.Engine.ALPHA_MULTIPLY;
                                                               break;
                                                           case "ALPHA_MAXIMIZED":
                                                               material.alphaMode = BABYLON.Engine.ALPHA_MAXIMIZED;


                                                       }
                                                   });
        primitiveFolder.add(material, "backFaceCulling", material.backFaceCulling).onChange(function (value) {
            material.backFaceCulling = value;
        });
        primitiveFolder.add(material, "wireframe", material.wireframe).onChange(function (value) {
            material.wireframe = value;
        });
        primitiveFolder.add(material, "useAlphaFromDiffuseTexture", material.useAlphaFromDiffuseTexture).onChange(function (value) {
            material.useAlphaFromDiffuseTexture = value;
        });
        primitiveFolder.add(material, "useEmissiveAsIllumination", material.useEmissiveAsIllumination).onChange(function (value) {
            material.useEmissiveAsIllumination = value;
        });
        primitiveFolder.add(material, "useGlossinessFromSpecularMapAlpha", material.useGlossinessFromSpecularMapAlpha).onChange(function (value) {
            material.useGlossinessFromSpecularMapAlpha = value;
        });
        primitiveFolder.add(material, "useLightmapAsShadowmap", material.useLightmapAsShadowmap).onChange(function (value) {
            material.useLightmapAsShadowmap = value;
        });
        primitiveFolder.add(material, "invertNormalMapX", material.invertNormalMapX).onChange(function (value) {
            material.invertNormalMapX = value;
        });
        primitiveFolder.add(material, "invertNormalMapY", material.invertNormalMapY).onChange(function (value) {
            material.invertNormalMapY = value;
        });
        primitiveFolder.add(material, "disableLighting", material.disableLighting).onChange(function (value) {
            material.disableLighting = value;
        });
        primitiveFolder.add(material, "disableDepthWrite", material.disableDepthWrite).onChange(function (value) {
            material.disableDepthWrite = value;
        });
        primitiveFolder.add(material, "specularPower", 0, 1000).onChange(function (value) {
            material.specularPower = value;
        });
    };

    $g.createAllMaterialOption = function (materialIdOrMaterial) {
        return {
            materialIdOrMaterial: materialIdOrMaterial,
            dffuseUrl: null,
            bumpUrl: null,
            paralaxUrl: null,
            specularUrl: null,
            ambientUrl: null,
            emissiveUrl: null,
            opacityUrl: null,
            reflectionUrl: null,
            lightUrl: null,
            heightUrl: null,
            refractionUrl: null

        };
    };

    $g.createMaterialOptionsFromMaterial = function (materialIdOrMaterial, advancedOption) {
        var allMaterialOption = $g.createAllMaterialOption(materialIdOrMaterial);
        if (advancedOption) {
            if (advancedOption.paralaxUrl) {
                allMaterialOption.paralaxUrl = advancedOption.paralaxUrl;
            }
        }
        var material;
        if (typeof materialIdOrMaterial === "string") {
            material = EM.GetMaterial(materialIdOrMaterial);
        }
        else {
            material = materialIdOrMaterial;
        }

        if (!material) {
            console.log("createMaterialOptionsFromMaterial: material not exist", {
                material: material
            });
            return;
        }
        _.forEach($g.SUPORTED_TEXTURES, function (texturePropName, key) {
            if (material[texturePropName] && material[texturePropName].url) {
                var optionName = _.lowerFirst(key) + "Url";
                allMaterialOption[optionName] = material[texturePropName].url;
            }
        });
        $g.createAllMaterialViews(allMaterialOption);

    };



    $g.SUPORTED_TEXTURES = {
        Dffuse: "diffuseTexture",
        Bump: "bumpTexture",
        Specular: "specularTexture",
        Ambient: "ambientTexture",
        Emissive: "emissiveTexture",
        Opacity: "opacityTexture",
        Reflection: "reflectionTexture",
        Light: "lightTexture",
        Height: "heightTexture",
        Refraction: "refractionTexture"
    };
    Object.freeze($g.SUPORTED_TEXTURES);
    $g.SUPORTED_COLOR3 = {
        diffuseColor: "diffuseColor",
        emissiveColor: "emissiveColor",
        ambientColor: "ambientColor",
        specularColor: "specularColor"

        //cameraColorCurves: "cameraColorCurves"
    };
    Object.freeze($g.SUPORTED_COLOR3);
    $g.SUPORTED_FRESNEL_PARAMETERS = {
        diffuseFresnelParameters: "diffuseFresnelParameters",
        opacityFresnelParameters: "opacityFresnelParameters",
        reflectionFresnelParameters: "reflectionFresnelParameters",
        emissiveFresnelParameters: "emissiveFresnelParameters",
        refractionFresnelParameters: "refractionFresnelParameters"
    };
    Object.freeze($g.SUPORTED_FRESNEL_PARAMETERS);

})(Utils.DatGuid);
Utils.Test = {};
(function ($t) {
    $t.SizeLocalalStorage = function () {
        function gen(n) {
            return [(n * 1024) + 1].join("a");
        }

        // Determine size of localStorage if it's not set
        if (!localStorage.getItem("size")) {
            var i = 0;
            try {
                // Test up to 10 MB
                for (i = 0; i <= 10000; i += 250) {
                    localStorage.setItem("test", gen(i));
                }
            } catch (e) {
                localStorage.removeItem("test");
                localStorage.setItem("size", i ? i - 250 : 0);

            }
        }
    };
    // for or lodashForEach - Win
    $t.IterationTest = function (countInItem, repeat) {
        var tCollection = [];
        var count = countInItem || 100000;

        function create() {
            for (var i = 0; i < count; i++) {
                tCollection.push("test" + Math.random());
            }
        }

        create();

        var forinTime = 0;
        var forTime = 0;
        var customForTime = 0;
        var lodashForEach = 0;
        var lodashForIn = 0;

        function testCustomFor(coll, action) {
            var keys = Object.keys(coll);
            var length = keys.length;
            for (var i = 0; i < length; i++) {
                action(keys[i]);
            }
        }


        function _forTime() {
            var startTime = Date.now();
            var l = tCollection.length;
            for (var i = 0; i < l; i++) {
                tCollection[i] = "test" + Math.random();
            }
            return Date.now() - startTime;
        }

        function _forInTime() {
            var startTime = Date.now();
            for (var i in tCollection) {
                if (tCollection.hasOwnProperty(i)) {
                    tCollection[i] = "test" + Math.random();
                }
            }
            return Date.now() - startTime;
        }

        function _customFor() {
            var startTime = Date.now();
            testCustomFor(tCollection,
                function (key) {
                    tCollection[key] = "test" + Math.random();
                });

            return Date.now() - startTime;
        }

        function _lodashForEach() {
            var startTime = Date.now();
            _.forEach(tCollection,
                function (value, key) {
                    tCollection[key] = "test" + Math.random();
                });
            return Date.now() - startTime;
        }

        function _lodashForIn() {
            var startTime = Date.now();
            _.forIn(tCollection,
                function (value, key) {
                    tCollection[key] = "test" + Math.random();
                });
            return Date.now() - startTime;
        }


        function calc() {
            var rep = repeat || 5;
            for (var i = 0; i < rep; i++) {
                customForTime += _customFor();
                forinTime += _forInTime();
                forTime += _forTime();
                lodashForEach += _lodashForEach();
                lodashForIn += _lodashForIn();

            }
        }

        calc();
        console.log("testTime",
            {
                forInTime: forinTime,
                forTime: forTime,
                customForTime: customForTime,
                lodashForEach: lodashForEach,
                lodashForIn: lodashForIn
            });


    };
})(Utils.Test);


(function ($t) {
    /*database libs
        --js stores http:
        jsstore.net/tutorial/or

        --dexie
        http://dexie.org/docs/Tutorial/Getting-started
    --zangodb
     https://github.com/erikolson186/zangodb
     https://erikolson186.github.io/zangodb/

    */


    //PushTest

    $t.JobPushTest = function () {
        var url = "/api/Job/push";
        var r =new  Utils.Request(url, function (data) {
            console.log({ data: data });
        });
       r.getJson();

    };
    
})(Utils.Test);