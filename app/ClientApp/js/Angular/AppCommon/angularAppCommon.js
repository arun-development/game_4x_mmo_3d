(function (module) {
    "use strict";
    module.directive("jsonCombiner", [
    function() {
        return {
            restrict:"A",
            scope:{
                saveData:"=",
                jsonCombiner:"@"
            },
            link:function($scope, element, attrs) {
                $scope.saveData(JSON.parse($scope.jsonCombiner));
            }
        }
    }
    ]);

    module.service("compileHelper", [
        "$compile", "$rootScope", function($compile, $rootScope) {
         //   console.log("compileHelper", this);
            this.$compileItem = function(html) {
                return $compile(html)($rootScope.$new());
            };
            this.$appendHtml = function(appendDom, html) {
                $(appendDom).append(this.$compileItem(html));
            };
            /**
         * 
         * @param {string||object} dom  jqueryDom|| element|| or jquery selector
         * @param {string} html string 
         * @returns {void}  none
         */
            this.$replaceWith = function(dom, html) {
                $(dom).replaceWith(this.$compileItem(html));
            };
        }
    ]);

    module.service("chestService", ["$q", function($q) { 
            var $self = this;
            this.CHEST_KEY = "UserChest";
            this.$userChestData = null;

            this.getProductType = function(chestItem) {

            };


            this.$defaultError = function(errorAnswer) {
                var msg = Errors.GetMessage(errorAnswer);
                console.log("errorAnswer", {
                    errorAnswer:errorAnswer,
                    msg:msg
                });
            };

            this.updateChestFromServer = function(onUpdated) {
                var deferred = $q.defer();
                $.ajax({
                    url: "/api/userChest/init/",
                    headers: Utils.XSRF.HeadersGetApiTokenObj(),
                    method:"GET",
                    type:"json"
                }).then(deferred.resolve, deferred.reject);
                deferred.promise.then(function(answer) {
                    $self.$setInitChestData(answer);
                    if(onUpdated instanceof Function) {
                        onUpdated($self.$userChestData);
                    }

                }, $self.$defaultError);
            };

            this.$rebuildChestData = function(chestData) {
                if($self.$userChestData) {
                    Utils.UpdateObjData($self.$userChestData, chestData);
                }
                else {
                    $self.$userChestData = chestData;
                }
                return $self.$userChestData;

            };

            this.cleanChestData = function() {
                $self.$userChestData = null;
            };


            this.getUserChestData = function() {
                if(!$self.$userChestData) {
                    console.log("!$self.$userChestData chest data nit exist", {
                        $self:$self
                    });
                }
                return $self.$userChestData;
            };

            function IProductTypes() {
                this.Account = null;
                this.Premium = null;
                this.Booster = null;
                this.Skins = null;
                this.Cc = null;
            };


            IProductTypes.prototype.getKeys = function() {
                return Object.keys(this);
            };

            this.ProductTypes = (function() {
                function IProductType(id, nativeName, langSimpleProps) {
                    this.LangSimpleProps = langSimpleProps;
                    _.extend(this, Utils.ModelFactory.INameIdModel(id, nativeName));
                }

                IProductType.prototype.convertToKv = function(baseProps) {
                    if(this.LangSimpleProps&&this.LangSimpleProps.convertToKv) {
                        return this.LangSimpleProps.convertToKv(baseProps);
                    }
                    return [];
                };

                function IPropertyes() {
                }

                IPropertyes.prototype.convertToKv = function(properties) {
                    var result = [];
                    if(!properties) {
                        return result;
                    }
                    _.forEach(this, function(val, nativeName) {
                        console.log("IPropertyes", {
                            val:val,
                            nativeName:nativeName,
                            properties:properties,
                            "properties[nativeName]":properties[nativeName],
                            "val.convertToKv":val.convertToKv,
                            "val.convertToKv(properties[nativeName])":val.convertToKv(properties[nativeName]),
                            "typeof properties[nativeName]":typeof properties[nativeName]
                        });
                        if(val.convertToKv&&properties[nativeName]&&typeof properties[nativeName]!=="object") {
                            result.push(val.convertToKv(properties[nativeName]));
                        }
                    });
                    return result;
                };

                function IPropertyItem(nativeName, langSimple, dataViewConverter) {
                    var $$Self = this;
                    this.NativeName = nativeName;
                    this.LangSimple = langSimple;
                    this.setKVConverter(function(itemValue) {
                        var viewVal = dataViewConverter ? dataViewConverter(itemValue) : itemValue;
                        return Utils.ModelFactory.KeyVal($$Self.LangSimple.getCurrent(), viewVal);
                    });
                };


                IPropertyItem.prototype.setKVConverter = function(kvConverter) {
                    this.convertToKv = kvConverter;
                };

                function setTranslateProp(iPropertyItem, nativePropName, langSimple, dataViewConverter) {
                    iPropertyItem[nativePropName] = new IPropertyItem(nativePropName, langSimple, dataViewConverter);
                }

                //en, es, ru
                var ls = Utils.LangSimple;
                var pt = new IProductTypes();
                                                           
                var acTranslate = new IPropertyes();
                //    setTranslateProp(acTranslate, "", lf());     
                pt.Account = new IProductType(1, "Account", acTranslate);

                var pTranslate = new IPropertyes();
                setTranslateProp(pTranslate, "Duration", ls("EN Duration", "ES Duration", "RU Duration"), Utils.Time.Seconds2Time);
                setTranslateProp(pTranslate, "PremiumBookmarkMod", ls("EN PremiumBookmarkMod", "ES PremiumBookmarkMod", "RU PremiumBookmarkMod"), function(val) {
                    return val;
                });
                setTranslateProp(pTranslate, "PremiumNavigationMod", ls("EN PremiumBookmarkMod", "ES PremiumBookmarkMod", "RU PremiumBookmarkMod"), function(val) {
                    return val;
                });
                setTranslateProp(pTranslate, "ResourseMaxStorable", ls("EN ResourseMaxStorable", "ES ResourseMaxStorable", "RU ResourseMaxStorable"), function(val) {
                    return val;
                });
                setTranslateProp(pTranslate, "ResourseProduction", ls("EN ResourseProduction", "ES ResourseProduction", "RU ResourseProduction"), function(val) {
                    return val;
                });
                setTranslateProp(pTranslate, "TimeBuildUpdate", ls("EN TimeBuildUpdate", "ES TimeBuildUpdate", "RU TimeBuildUpdate"), function(val) {
                    return val;
                });
                setTranslateProp(pTranslate, "TimeUnitProduction", ls("EN TimeUnitProduction", "ES TimeUnitProduction", "RU TimeUnitProduction"), function(val) {
                    return val;
                });

                pt.Premium = new IProductType(2, "Premium", pTranslate, function(val) {
                    return val;
                });

                var bTranslate = new IPropertyes();
                setTranslateProp(bTranslate, "Duration", ls("EN Duration", "ES Duration", "RU Duration"), Utils.Time.Seconds2Time);
                setTranslateProp(bTranslate, "Attack", ls("EN Attack", "ES Attack", "RU Attack"), function(val) {
                    return val;
                });
                setTranslateProp(bTranslate, "Hp", ls("EN Hp", "ES Hp", "RU Hp"), function(val) {
                    return val;
                });

                pt.Booster = new IProductType(3, "Booster", bTranslate);
                var sTranslate = new IPropertyes();
                //    setTranslateProp(bTranslate, "", lf());
                pt.Skins = new IProductType(4, "Skins", sTranslate);

                var ccTranslate = new IPropertyes();
                // setTranslateProp(ccTranslate, "", lf());
                pt.Cc = new IProductType(5, "Cc", ccTranslate);
                Utils.FreezeDeep(pt);
                return pt;
            })();

            this.$getTypeByTypeId = function(productTypeId) {
                return _.find($self.ProductTypes, function(typeVal, typeName) {
                    return typeVal.Id===productTypeId;
                });
            };

            this.createChestItemKVPropertiesView = function(chestItem) {
                var pType = $self.$getTypeByTypeId(chestItem.ProductTypeId);
                if(pType&&pType.convertToKv) {
                    return pType.convertToKv(chestItem.ProductItemProperty.Property);
                }
                return [];
            };


            this.getActiveDataByTypeId = function(typeId) {
                var chest = $self.getUserChestData();
                if(!chest||!chest.ActivatedItemsView) return null;
                return _.find(chest.ActivatedItemsView, function(o) {
                    return o.ProductTypeId===typeId;
                });
            }

            this.getBalanceCcModel = function() {
                var item = $self.getActiveDataByTypeId($self.ProductTypes.Cc.Id);
                if(!item||!item.Data) return null;
                return item.Data.BalanceCc;
            };
            this.getPremiumModel = function() {
                var item = $self.getActiveDataByTypeId($self.ProductTypes.Premium.Id);
                if(!item||!item.Data) return null;
                return item.Data.Premium;
            };

        }
    ]);

    module.service("pageHelper", [function () {
        console.log("pageHelper", this);
        this.pageName = $("body").data("page-name");
        this.pageNames = {
            home: "start-page",
            store: "store-page",
            account: "account-page",
            manage: "manage-page",
            adminStore: "admin-store-page"
        };
        this.isPage = function (pageName) {
            if (!this.pageName) {
                return false;
            }
            return this.pageName === pageName;
        };
        this.$homeInitialized = false;
        this.initHome = function () {
            if (!this.$homeInitialized && this.isPage(this.pageNames.home)) {
                HomeScroller.Init();
                HomeResaizer();
                Utils.Response.HomeVideo.Init();
                HomeCarousel();
                $("iframe").youtubeControl();
                this.$homeInitialized = true;
            }
        };
        this.isOtherPage = function () {
            var pages = this.pageNames;
            var pageName = this.pageName;
            if (!pageName) {
                return true;
            }
            var isOtherPage = true;
            _.forEach(pages, function (value, key) {
                if (value === pageName) {
                    isOtherPage = false;
                    return false;
                }
            });
            return isOtherPage;
        };
        if (this.isPage(this.pageNames.home)) {
            this.initHome();
        }

    }]);
    module.service("appVarsSerivce", ["$rootScope", function ($rootScope) {
        this._data = null;
        this.save = function (data) {
            if(this._data!== null) {
                this._data = _.extend(this._data, data);
            }
            else {
                this._data = data;
            }
            return this;
        };
        this.getVars = function () {
            var data = this._data;
            console.log("getVars",
                {
                    data: data
                });
            return this._data;
        };
        this.add = function(key, val) {
            if(!key) return this;
            if(this._data===null) {
                this._data = {};
            }
            this._data[key] = val;
            return this;
        };
        this.remove = function(key) {
            if (!this._data || !this._data[key]) {
                return;
            }
            this._data[key] = null;
            delete this._data[key];
            return this;
        };

        this.update = function(newAppVars) {
            Utils.UpdateObjData(this._data, newAppVars);
        
            $rootScope.$broadcast("appVarsSerivce:update", { appVars: this._data });
 
            return this;
        };


    }]);
    module.directive("appVars",["appVarsSerivce",
            function (appVarsSerivce) {
                return { 
                        restrict:"A",
                        scope:{appVars: "@"},
                        link:function($scope, element, attrs) {  
                            appVarsSerivce.save(JSON.parse($scope.appVars));
                          element.remove();
                            console.log("appVars saved",{
                                $scope: $scope
                            });
                        }
                    }
            }
        ]);

})(angular.module("angularAppCommon", []));