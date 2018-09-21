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
 






