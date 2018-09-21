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