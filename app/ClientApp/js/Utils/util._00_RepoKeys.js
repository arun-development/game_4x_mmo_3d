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