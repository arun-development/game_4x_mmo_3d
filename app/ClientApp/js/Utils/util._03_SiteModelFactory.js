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