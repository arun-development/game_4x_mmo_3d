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