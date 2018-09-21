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
(function (module) {
    module.config(["$mdThemingProvider", function ($mdThemingProvider) {
        //disable theme generation
       $mdThemingProvider.generateThemesOnDemand(true);
    }]);


    // #region auth part
    module.service("authUser", ["compileHelper", "$q", "siteChestService", function ($ch, $q, siteChestService) {
        //old 
        //AutorizedUser ={}
        var LS = Utils.LocalStorage;
        var $self = this;
        this.$delay = 10 * 60 * 1000;
        this.$authCookieName = "userAutorized";
        this.isAutorized = Utils.ConvertToBool($.cookie(this.$authCookieName));
        this.$translateLogInLabel = Utils.LangSimple("enter", "entrar", "вход");
        this.loginLabelName = this.$translateLogInLabel.getCurrent();
        this.getHref = function () {
            var accountLink = "/Account/Login";
            var link = Utils.GetUrl(accountLink);
            link += Utils.GetReturnUrl();
            return link;
        };
        this._logInData = null;
        this.getLogInData = function () {
            if ($self._logInData) {
                return $self._logInData;
            }
            $self._logInData = {
                text: $self.loginLabelName,
                href: $self.getHref()
            }
            Object.freeze($self._logInData);
            return $self._logInData;
        };

        this.requestGetStatus = function () {
            $.ajax({
                url: "/api/user/IsAuthenticated/",
                headers: Utils.XSRF.HeadersGetApiTokenObj(),
                dataType: "json"
            }).then(function (answer) {
                $self.setAuthStatus(answer.auth);
            }, function (errorAnswer) {
                $self.$resetAuthData();
                var msg = Errors.GetMessage(errorAnswer);
                console.log("authUser.requestGetStatus", { errorAnswer: errorAnswer, msg: msg });
            });

        };
        this.$$authTimerId = null;
        this.$resetAuthData = function () {
            if ($self.$$authTimerId) {
                clearTimeout($self.$$authTimerId);
                $self.$$authTimerId = null;
            }
            $self.isAutorized = false;   
            $.removeCookie($self.$authCookieName);
            $self.$$UserData = null;
            LS.ClearStorageAndCookie();
            var ctrl = $self.$$getMenuCtrl();
            if (ctrl) {
                ctrl.$setNoAutorized();
            }

            var chest = $("#user-chest");

            var form = $("#logoutForm");
            if (form.length) {
                form.submit();
            }
       
            if (chest.length) {
                var chestScope = chest.scope();
                if (chestScope) {
                    chestScope.$destroy();
                }
                chest.remove();
            }
            var ma = $("#my-account");
            if (ma.length) {
                ma.replaceWith($("<div/>", {
                    id: "menu-personal"
                }));
            }

            siteChestService.cleanChestData();
 


        };
        this.setAuthStatus = function (status) {
            $self.isAutorized = status;
            if (status) {
                $self.$$authTimerId = setTimeout(function () {
                    $self.requestGetStatus();
                }, $self.$delay);
            }
            else {
                $self.$resetAuthData();
            }
        };
        this.initUserDataAndLogInMenu = function () {
            var deferred = $q.defer();
            $.ajax({
                url: "/" + LANG + "/Home/GetMenuLoginView/",
                type: "json",
                data: Utils.XSRF.MakeIPostXsrf(),
                method: "POST",

            }).then(function (answer) {
                if (!answer) {
                    $self.$resetAuthData();
                    deferred.reject();
                }
                else {
                    $self.$$UserData = JSON.parse(answer.Data);
                    siteChestService.$setInitChestData($self.$$UserData);
                    //console.log("loadAuthMenu", {
                    //    answer: answer,
                    //    $$UserData: $self.$$UserData
                    //});
                    $("#link-to-game").removeClass("display-none");
                    $ch.$replaceWith("#menu-personal", answer.Html);
                    deferred.resolve();
                }

            }, function (err) {
                if (err.status === 401) {
                    console.log("unauthorized", err);
                }
                deferred.reject();

            }); 


            return deferred.promise;

        };

        this.$$UserData = null;
        this.$$checkUserdata = function () {
            if (!$self.$$UserData) {
                throw new Error("!$self.$$UserData");
            }
        }
        this.getLogInUserData = function () {
            $self.$$checkUserdata();
            return {
                userName: $self.$$UserData.UserName,
                balanceCc: $self.getCc(),
            };

        };
        this.getGameUserId = function () {
            $self.$$checkUserdata();
            var ccModel = siteChestService.getBalanceCcModel();
            if (!ccModel || !ccModel.Id) {
                return 0;
            }
            return ccModel.Id;
        };
        this.getUserName = function () {
            $self.$$checkUserdata();
            return $self.$$UserData.UserName;
        };

        this.getCc = function () {
            $self.$$checkUserdata();
            var ccModel = siteChestService.getBalanceCcModel();
            if (!ccModel) {
                return 0;
            }
            return ccModel.Quantity;
        };
        this.$$getMenuCtrl = function () {
            var elem = $("#main-menu");
            if (elem.length) {
                var scope = elem.scope();
                if (scope) {
                    return scope.mCtrl;
                }
            }
            return null;
        };
        this.updateUserData = function (onComplete) {
            if (!(onComplete instanceof Function)) {
                onComplete = angular.noop;
            }
            $self.initUserDataAndLogInMenu().then(function () {
                var ctrl = $self.$$getMenuCtrl();
                if (ctrl) {
                    ctrl.$setInitUserData();
                }
                onComplete(true);
            }, function () {
                onComplete(false);
                $self.$defaultError("error.updateUserData");
            });
        };

        this.$defaultError = Errors.$defaultErrorResponce;
    }
    ]);
    // #endregion

    // #region chest core part

    module.factory("siteChestService", ["chestService", "$mdSidenav", "$mdDialog", "$rootScope", function (chestService, $mdSidenav, $mdDialog, $rootScope) {

        chestService.$noActivateIdx = 0;
        chestService.$activateIdx = 1;
        chestService.$setInitChestData = function ($userData) {
            chestService.$rebuildChestData($userData[chestService.CHEST_KEY]);
            delete $userData[chestService.CHEST_KEY];
            $userData.$getChest = function () {
                return chestService.$userChestData;
            };
        };
        chestService.setTabsToCtrl = function (ctrl) {
            function _setData(data) {
                ctrl.tabs = data;
                ctrl.dataLoaded = true;
            }

            if (chestService.$userChestData) {
                _setData(chestService.$userChestData);
            }
            else {
                chestService.updateChestFromServer(_setData);
            }

        };
        chestService.$buildToggler = function (componentId) {
            return function () {
                $mdSidenav(componentId).toggle();
            };
        };
        chestService.$toggNavLeft = chestService.$buildToggler("left");
        chestService.openDialogShowChestItemInfo = function ($event, chestItem, onFinally) {
            $mdDialog.show({
                templateUrl: "dialog-chest-item-info.tmpl",
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: true,
                fullscreen: false,
                locals: {
                    chestItemData: chestItem
                },
                controller: "dialogChestItemInfoCtrl",
                controllerAs: "dchiCtrl"

            }).then(angular.noop, angular.noop).finally(onFinally);
        };
        chestService.activateChestItem = function ($event, chestItem, onFinally) {
            var confirm = $mdDialog.confirm()
                .ariaLabel("activateChestItem")
                .title("Confirm")
                .htmlContent("Активировать продут " + chestItem.ProductItemProperty.TranslateText[appL10n.getL10NCurrentLanguage()].Name)
                .ok("Confirm")
                .cancel("Cancel")
                .targetEvent($event);

            $mdDialog.show(confirm).then(function () {
                var deferred = $q.defer();
                $.ajax({
                    url: "/api/user/activateChestItem/",
                    dataType: "json",
                    method: "GET",
                    headers: Utils.XSRF.HeadersGetApiTokenObj(),
                    data: { chestId: chestItem.Id },
                }).then(deferred.resolve, deferred.reject);
                deferred.promise.then(function (answer) {
                    _.remove(chestService.$userChestData.NoActivate, function (o) {
                        return o.Id === chestItem.Id;
                    });
                    var allItem = _.find(chestService.$userChestData.All, function (o) {
                        return o.Id === chestItem.Id;
                    });
                    //allItem.DateActivate = 0;
                    allItem.Activated = true;

                    if (chestService.ProductTypes.Premium.Name === answer.ProductTypeNativeName) {
                        chestService.$userChestData.ActivatedItemsView[answer.ProductTypeNativeName] = answer;
                    }


                    onFinally(true);
                }, function (errorAnswer) {
                    chestService.$defaultError(errorAnswer);
                    onFinally(false);
                });

            }, onFinally);

        };

        chestService.canBuy = function (balanceCcModel, price) {
            if (!balanceCcModel || !balanceCcModel.Quantity) {
                return false;
            }
            return balanceCcModel.Quantity >= price;
        };
                                                         
        chestService.updateCcQuantity = function (balanceCcModel, price) {
            balanceCcModel.Quantity -= price;
            // todo check other price  on view
            $rootScope.$broadcast("siteChestService:ccUpdated", balanceCcModel);

        };


        return chestService;

    }
    ]);

    module.directive("userChest", [
        function () {
            return {
                templateUrl: "user-chest.tmpl",
                replace: true,
                restrict: "E",
                scope: {},
                link: function ($scope, element, attrs) {
                    // todo  кажется можно удалиьт линковку
                   // console.log("directive.userChest", { $scope: $scope });
                },
                controller: ["$scope", "siteChestService", function ($scope, siteChestService) {
                    var $self = this;
                    this.tabs = {
                        selectedIndex: 0,
                        inactiveLabelName: "Bought items",
                        activatedLabelName: "Activated"
                    };
                    this.chestData = siteChestService.getUserChestData();

                    this.activateChestItemDisabled = false;

                    this.activateChestItem = function ($event, chestItem) {
                        if ($self.activateChestItemDisabled) return;
                        $self.activateChestItemDisabled = true;
                        siteChestService.activateChestItem($event, chestItem, function () {
                            $self.activateChestItemDisabled = false;
                        });
                        console.log("productItem", {
                            chestItem: chestItem,
                            $self: $self
                        });
                    };
                    this.getInfoDisabled = false;
                    this.getChestItemInfo = function ($event, chestItem) {
                        if ($self.getInfoDisabled) return;

                        $self.getInfoDisabled = true;
                        siteChestService.openDialogShowChestItemInfo($event, chestItem, function () {
                            console.log("productItem.finnally", {
                                chestItem: chestItem,
                                $self: $self
                            });
                            $self.getInfoDisabled = false;
                        });
                    };
                    this.LangKey = appL10n.getL10NCurrentLanguage();

                  //  console.log("userChestCtrl", { $scope: $scope });

                }
                ],
                controllerAs: "chestCtrl"
            }
        }
    ]);

    module.controller("dialogChestItemInfoCtrl", ["$scope", "$mdDialog", "chestItemData", "siteChestService", function ($scope, $mdDialog, chestItemData, siteChestService) {
        var langKey = appL10n.getL10NCurrentLanguage();
        var documentWidth = $(document).width();
        function ImgStyle(w) {
            this.backgroundImage = Utils.CssHelper.SetUrl(chestItemData.ProductItemProperty.ImgCollectionImg.Chest);
            if (w > documentWidth) {
                w = documentWidth - 50;
            }
            this.width = w;
            this.height = this.width * (9 / 16);
        };

        this.itemText = chestItemData.ProductItemProperty.TranslateText[langKey];
        this.itemProperties = siteChestService.createChestItemKVPropertiesView(chestItemData);
        this.itemImageStyle = new ImgStyle(700);

        this.cancel = function () {
            $mdDialog.cancel($scope);
        };
    }]);
    // #endregion

    // #region parent chest in site
    module.controller("personalNavMenuCtrl", ["$scope", "siteChestService", "authUser", function ($scope, siteChestService, authUser) { 
        this.toggleLeft = siteChestService.$toggNavLeft;
        this.logOut = function () {   
            authUser.$resetAuthData();   

        };
    }
    ]);
    // #endregion 

    // #site menu
    module.controller("siteMenuCtrl", [
        "$scope", "compileHelper", "authUser", "siteChestService", "pageHelper", function ($scope, compileHelper, authUser, siteChestService, pageHelper) {
            var $self = this;
            this.showPersonalLogin = false;
            this.logInData = authUser.getLogInData();
            this.userData = {};
            this.onUserNameClick = siteChestService.$toggNavLeft;
            this.$setInitUserData = function () {
                $self.userData = authUser.getLogInUserData();
                $self.showPersonalLogin = true;
                //console.log("siteMenuCtrl", {
                //    $self: $self
                //});
            };
            this.$initUserDataAndLogInMenu = function () {   
                authUser.initUserDataAndLogInMenu().then($self.$setInitUserData, authUser.$defaultError);
            };
            this.$setNoAutorized = function () {
                $self.showPersonalLogin = false;
            };


            $scope.$on("siteChestService:ccUpdated", function (event, data) {
                if (e.defaultPrevented) return;
                if (e.stopPropagation) e.stopPropagation();
                else e.preventDefault();
                $self.userData.balanceCc = data.Quantity;
                console.log("siteChestService:ccUpdated", {
                    event: event,
                    data: data
                });
            });

            if (!pageHelper.isOtherPage()) { 
                this.$initUserDataAndLogInMenu();
            }
        }
    ]);

})(Utils.CoreApp.appSite = angular.module("appSite", ["ngMaterial",
    "ngSanitize",
        "ngMessages",
    "svgAssetsCache",
    "lfNgMdFileInput",
        "angularAppCommon"])); 
 







(function (module) {
    "use strict";
    module.controller("storeCtrl", [
        "$scope", "storeService", function ($scope, storeService) {
            var $self = this;
            this.tabs = null;
            this.langKey = appL10n.getL10NCurrentLanguage();
            this.showContent = false;
            this.saveInitData = function (saveInitData) {
                console.log("setIntiData", {
                    saveInitData: saveInitData
                });
                storeService.saveInitData(saveInitData);
                angular.element("#store-init-data").remove();

                $self.tabs = storeService.createStoreTabs();
                $self.showContent = true;
            };

            this.buyProduct = storeService.buyProduct;


        }
    ]);

    module.controller("buyProductItemForCcDialogCtrl", ["$scope", "$mdDialog", "productItem", "balanceCcModel", "siteChestService", function ($scope, $mdDialog, productItem, balanceCcModel, siteChestService) {
        console.log("buyProductItemForCcDialogCtrl", {
            $scope: $scope,
            balanceCcModel: balanceCcModel,
            productItem: productItem,
            siteChestService: siteChestService,
        });
        this.cancel = function () {
            $mdDialog.cancel($scope);
        };
        this.send = function () {
            // todo send request and local update
            siteChestService.updateCcQuantity(balanceCcModel, productItem.ProductCost);
            $mdDialog.hide($scope);
        };
    }]);

    module.service("storeService", ["$q", "$mdDialog", "siteChestService", function ($q, $mdDialog, siteChestService) {
        var $self = this;
        this.$storeProducts = null;
        this.updateProductsFromServer = function () {
            //todo  данная функция пока не нужна
        };

        function ITabItem(tabLabel, bodyData) {
            this.TabId = Utils.Guid.CreateGuid();
            this.LabelData = tabLabel;
            this.BodyData = bodyData;
        };


        this.$filterProducts = function (storeAllList, productTypeId) {
            return _.filter(storeAllList, function (o) {
                return o.ProductTypeId === productTypeId;
            });
        };

        this.$createTabItem = function (typeId) {
            var selectItem = _.find($self.$storeProducts.SelectList, function (o) {
                return o.Id === typeId;
            });
            if (!selectItem) {
                return null;
            }

            return new ITabItem(selectItem, $self.$filterProducts($self.$storeProducts.StoreList, typeId));
        };

        this.createStoreTabs = function () {
            var allTr = Utils.L10N();
            allTr.En.Name = "all";
            allTr.Es.Name = "all";
            allTr.Ru.Name = "all";
            var pt = siteChestService.ProductTypes;
            var order = [pt.Account.Id, pt.Premium.Id, pt.Booster.Id, pt.Skins.Id, pt.Cc.Id];
            var data = [
                new ITabItem({
                    Id: 0,
                    NativeName: "All",
                    TranslateText: allTr
                }, $self.$storeProducts.StoreList)
            ];
            _.forEach(order, function (typeId) {
                var item = $self.$createTabItem(typeId);
                if (item && item.BodyData && item.BodyData.length) {
                    data.push(item);
                }
            });
            console.log("createStoreTabs", { data: data });
            return {
                selectedIndex: 0,
                data: data
            };

        };


        this.buyProduct = function ($event, productItem) {
            console.log("$buyProduct", {
                $self: $self,
                productItem: productItem,
                siteChestService: siteChestService
            });

            if (productItem.ProductCurrencyCode === "CC") {
                $self.$openDialogBuyProductForCc($event, productItem);
            } else if (productItem.ProductCurrencyCode === "USD") {
                $self.$openDialogBuyProductForMoney($event, productItem);
            }
            else {
                siteChestService.$defaultError({
                    Method: "buyProduct",
                    Message: "Incorrect currency",
                    productItem: productItem,
                });
            }

        };

        this.saveInitData = function (allStoreProducts) {
            $self.$storeProducts = allStoreProducts;
        };

        this.$openDialogBuyProductForCc = function ($event, productItem) {
            $mdDialog.show({
                templateUrl: "buy-product-for-cc-dialog.tmpl",
                parent:angular.element(document.body),
                targetEvent:$event,
                clickOutsideToClose:false,
                fullscreen:false,
                locals:{
                    productItem:productItem,
                    balanceCcModel:siteChestService.getBalanceCcModel()
                },
                controller:"buyProductItemForCcDialogCtrl",
                controllerAs:"ctrl"
            }).then(function(ctrlScope) {
                //sumbit
                ctrlScope.$destroy(); 
            }, function(ctrlScope) {
                ctrlScope.$destroy();
            });

        };
        this.$openDialogBuyProductForMoney = function ($event, productItem) {
            Errors.ClientNotImplementedException({
                productItem: productItem
            }, "$openDialogBuyProductForMoney");

        };
    }
    ]);
})(Utils.CoreApp.appSite);