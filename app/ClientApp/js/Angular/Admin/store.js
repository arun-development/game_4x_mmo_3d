(function (module) {
    "use strict";
    module.controller("storeAdminCtrl", [
        "$scope", "storeRepo",function ($scope, storeRepo) { 
            var $self = this;
            this.products = [];
            this.saveInitData = function(initData) {
                storeRepo.saveInitProducts(initData);
                $self.products = storeRepo.getProductList();
                angular.element("#admin-store-init-data").remove();
            };
            this.createItem = storeRepo.openDialogCreateItem;
            this.deleteItem = function($event, productItem) {
                console.log("deleteItem", {productItem:productItem, $event:$event});
                storeRepo.requestRemoveItem(productItem);
                //$element.remove();
            };
            this.updateItem = function($event, productItem) {
                storeRepo.openDialogUpdateItem($event, productItem);
            };

        }
    ]);
    module.service("storeRepo", [
        "$mdDialog", "$filter", "$q", function($mdDialog, $filter, $q) {
            var $self = this;
            var $mf = Utils.ModelFactory;
            this._durationList = null;
            this._currencyList = null;
            this.$products = null;
            this._premiumMods = null;

            function ProductTypes() {
            }

            ProductTypes.prototype.toArray = function() {
                return [this.Account, this.Premium, this.Booster, this.Skins, this.Cc];
            };
            ProductTypes.prototype.creteNewFromThis = function() {
                return _.cloneDeep(this);
            };
            ProductTypes.prototype.cloneAsArray = function() {
                return _.cloneDeep(this.toArray());
            };
            ProductTypes.prototype.setByServerData = function(serverProductTypes) {
                _.extend(this, serverProductTypes);
                var _self = this;
                _.forEach(this, function(o, key) {
                    Object.freeze(_self[key]);
                });
                Object.freeze(this);
            };

            this.productTypes = new ProductTypes();

            function IProductItem() {
                this.Id = 0;
                this.NativeName = "";
                this.ProductType = null;
                this.Currency = null;
                this.Price = 0;
                this.L10N = Utils.L10N();
                this.Active = false;
                this.DateCreate = "";

                this.$dateCreateView = "";
                this.Base64Images = null;
                this.Duration = null;
                this.Properties = null;
                this.$properties = [];
                this.ImagePath = null;

                this.$setCurrencyList();
                this.$setDurations();
                this.$setProductTypeList();
            }

            IProductItem.prototype.$setDateCreate = function() {
                this.$dateCreateView = $filter("date")(this.DateCreate, "yy.MM.dd HH:mm");
            };


            IProductItem.prototype.$showDuration = false;
            IProductItem.prototype.$durations = null;
            IProductItem.prototype.$setDurations = function() {
                this.__proto__.$durations = _.cloneDeep($self._durationList);
            };
            IProductItem.prototype.$setShowDuration = function() {
                if(this.$showDuration) return;
                if(!this.Duration) return;
                if(!this.ProductType) return;
                if(this.ProductType.Id===2||this.ProductType.Id===3) {
                    this.__proto__.$showDuration = true;
                }

            };

            IProductItem.prototype.$productTypeList = null;
            IProductItem.prototype.$setProductTypeList = function() {
                if(!this.$productTypeList) {
                    this.__proto__.$productTypeList = $self.productTypes.cloneAsArray();
                }
            };
            IProductItem.prototype.$setProductType = function(productTypeId) {
                this.ProductType = _.find(this.$productTypeList, function(o) {
                    return o.Id===productTypeId;
                });
            };

            IProductItem.prototype.$currencyList = null;
            IProductItem.prototype.$setCurrencyList = function() {
                this.__proto__.$currencyList = _.cloneDeep($self._currencyList);
            };

            IProductItem.prototype.$setCurrency = function() {
                if(this.ProductType.Id===5) {
                    this.Currency = this.$currencyList[1];
                }
                else {
                    this.Currency = this.$currencyList[0];
                }
            };

            IProductItem.prototype.$propertyToDic = function() {
                if(this.Properties) {
                    var _s = this;
                    _.forEach(this.Properties, function(val, key) {
                        if(val&&typeof val==="object") {
                            console.log("prop is object cant be set", {
                                val:val,
                                key:key,
                            });
                        }
                        else if(val) {
                            _s.$properties.push(new $mf.KeyVal(key, val));
                        }

                    });

                }
            };

            IProductItem.prototype.$setFromOther = function(other) {
                this.Id = other.Id;
                this.NativeName = other.NativeName;
                this.$setProductType(other.ProductType.Id);
                this.Price = other.Price;
                this.L10N = Utils.L10N();
                this.L10N.updateFromOther(other.L10N);
                this.Active = other.Active;
                this.DateCreate = other.DateCreate;
                this.Base64Images = other.Base64Images;
                this.Duration = other.Duration;
                this.Properties = other.Properties;
                this.ImagePath = other.ImagePath;

                this.$setCurrency();
                this.$setDateCreate();
                this.$propertyToDic();
            };

            this.saveInitProducts = function(productModel) {

                $self._durationList = productModel.DurationList;
                $self._currencyList = productModel.CurrencyList;
                Utils.FreezeDeep($self._durationList);
                Utils.FreezeDeep($self._currencyList);

                $self._premiumMods = productModel.PremiumBaseProperty;
                Utils.FreezeDeep($self._premiumMods);

                if(!$self.$products) {
                    $self.$products = [];
                }
                $self.productTypes.setByServerData(productModel.ProductTypes);
                _.forEach(productModel.ProductItems, function(item, key) {
                    $self.addItemToLocal($self.createLocalItem(item));
                });

                console.log("productModel", {
                    productModel:productModel,
                    $self:$self
                });

            };

            this.getProductList = function() {
                return $self.$products;
            };
            this.removeItemFromLocal = function(item) {
                _.remove($self.$products, function(o) {
                    return o.Id===item.Id;
                });
            };
            this.requestRemoveItem = function(item) {
                var deferred = $q.defer();
                try {
                    $.ajax({
                        url:"/AdminStore/DeleteProductItem/",
                        method:"DELETE",
                        data: Utils.XSRF.MakeIPostXsrf("productStoreId",item.Id),
      
                        type:"json"
                    }).then(deferred.resolve, deferred.reject);
                }
                catch(e) {
                    deferred.reject(e);
                }
                deferred.promise.then(function(answerOk) {
                    if(answerOk) {
                        $self.removeItemFromLocal(item);
                    }
                    else {
                        deferred.reject("not deleted");
                    }
                }, function(errorAnswer) {
                    console.log("errorAnswer", {errorAnswer:errorAnswer});
                });
            };
            this.createLocalItem = function(serverItem) {
                var item = new IProductItem();
                item.$setFromOther(serverItem);
                return item;
            }
            this.addItemToLocal = function(productItemData) {
                $self.$products.push(productItemData);
                return productItemData;
            };
            this.updateLocalItem = function(productItemData) {
                var newItem = $self.createLocalItem(productItemData);
                var localItem = _.find($self.$products, function(val, key) {
                    return val.Id===productItemData.Id;
                });
                if(!_.isEqual(newItem, localItem)) {
                    Utils.UpdateObjFromOther(localItem, newItem);
                }

            };


            var _lockCreateItem = false;
            this.openDialogCreateItem = function($event) {
                $mdDialog.show({
                    templateUrl:"create-store-admin-item-dialog.tmpl",
                    parent:angular.element(document.body),
                    targetEvent:$event,
                    clickOutsideToClose:false,
                    fullscreen:true,
                    controller:"createStoreAdminItemDialogCtrl",
                    controllerAs:"csCtrl"

                }).then(function(ctrlScope) {
                    //create(ed)   
                    ctrlScope.$destroy();
                    _lockCreateItem = false;

                }, function(ctrlScope) {
                    //cancel
                    ctrlScope.$destroy();
                    _lockCreateItem = false;
                });
            };

            this.openDialogUpdateItem = function($event, modelStoreItem) {
                $mdDialog.show({
                    templateUrl:"update-store-admin-item-dialog.tmpl",
                    parent:angular.element(document.body),
                    targetEvent:$event,
                    clickOutsideToClose:false,
                    fullscreen:true,
                    locals:{
                        modelStoreItem:modelStoreItem
                    },
                    controller:"updateStoreAdminItemDialogCtrl",
                    controllerAs:"usCtrl"

                }).then(function(ctrlScope) {
                    //create(ed)   
                    ctrlScope.$destroy();
                    _lockCreateItem = false;

                }, function(ctrlScope) {
                    //cancel
                    ctrlScope.$destroy();
                    _lockCreateItem = false;
                });
            };

            this.setItemProperty = function(productItem, selectedPtoductType) {
                //account
                if(selectedPtoductType.Id===1) {
                    productItem.__proto__.$showDuration = false;
                }
                //premium
                else if(selectedPtoductType.Id===2) {
                    productItem.__proto__.$showDuration = true;
                    productItem.Properties = _.cloneDeep($self._premiumMods);

                }
                // booster
                else if(selectedPtoductType.Id===3) {
                    productItem.__proto__.$showDuration = true;
                    if(!productItem.Properties||!productItem.Properties.hasOwnProperty("Hp")) {
                        var boosterProps = $mf.IBattleStats();
                        boosterProps.Duration = 0;
                        productItem.Properties = boosterProps;
                    }
                }
                //skins
                else if(selectedPtoductType.Id===4) {
                    productItem.__proto__.$showDuration = false;
                }
                //cc
                else if(selectedPtoductType.Id===5) {
                    productItem.__proto__.$showDuration = false;
                }
            };

            this.createProductModel = function() {
                return new IProductItem();
            };

            this.sendNewProductItem = function(newProductItem) {
                console.log("newProductItem", {
                    newProductItem:newProductItem
                });
                var deferred = $q.defer();

                try {
                    $.ajax({
                        url:"/AdminStore/CreateNewProductItem/",
                        method:"POST",
                        data:Utils.XSRF.MakeIPostXsrf("newProductItem",newProductItem),
        
                        type:"json"
                    }).then(deferred.resolve, deferred.reject);
                }
                catch(e) {
                    deferred.reject(e);
                }
                return deferred.promise;

            };

            this.requestUpdateProductItem = function (productItem) {
                console.log("prouctItem", {
                    productItem: productItem
                });
                var deferred = $q.defer();
                try {
                    $.ajax({
                        url:"/AdminStore/UpdateProductItem/",
                        method:"POST",
                        data: Utils.XSRF.MakeIPostXsrf("productItem", productItem),
 
                        type:"json"
                    }).then(deferred.resolve, deferred.reject);
                }
                catch(e) {
                    deferred.reject(e);
                }
                return deferred.promise;
            }


        }
    ]);
    module.controller("createStoreAdminItemDialogCtrl", [
        "$scope", "$mdDialog", "storeRepo", function($scope, $mdDialog, storeRepo) {
            var $self = this;
            this.model = storeRepo.createProductModel();
            this.model.Active = true;
            this.langKeys = this.model.L10N.getKeys();
            //productType
            this.productTypes = storeRepo.productTypes.cloneAsArray();


            this.onProductTypeSelected = function(selectedType) {
                storeRepo.setItemProperty($self.model, selectedType);
                $self.model.$setCurrency();
                console.log({
                    selectedType:selectedType
                });
            };


            this.files = null;
            //actions
            var _sendInProgress = false;
            this.send = function() {
                if(_sendInProgress) return;
                _sendInProgress = true;

                function request() {
                    var newItem = {};
                    Utils.UpdateObjData(newItem, $self.model);
                    newItem.Properties = JSON.stringify(newItem.Properties);
                    storeRepo.sendNewProductItem(newItem)
                        .finally(function() {
                            _sendInProgress = false;
                        })
                        .then(function(answer) {
                            var newItem = storeRepo.addItemToLocal(storeRepo.createLocalItem(answer));
                            console.log("answer", {
                                answer:answer,
                                newItem:newItem
                            });
                            $mdDialog.hide($scope);
                        }, function(errorAnswer) {
                            console.log("errorAnswer", {errorAnswer:errorAnswer});
                            $mdDialog.hide($scope);
                        });
                }

                try {
                    $self.model.Base64Images = [];
                    _.forEach($self.files, function(o) {
                        Utils.File.blobToBase64(o.lfFile, function(base64) {
                            $self.model.Base64Images.push(base64);
                            if($self.model.Base64Images.length===$self.files.length) {
                                request();
                            }
                        });
                    });
                }
                catch(e) {
                    _sendInProgress = false;
                }
            };
            this.cancel = function() {
                console.log("createStoreAdminItemDialogCtrl.$scope", {$scope:$scope});
                $mdDialog.cancel($scope);
            };
        }
    ]);
    module.controller("updateStoreAdminItemDialogCtrl", ["$scope", "$mdDialog", "storeRepo", "modelStoreItem", function ($scope, $mdDialog, storeRepo, modelStoreItem) {
        var $self = this;
        modelStoreItem.$setShowDuration();
        this.model = modelStoreItem;



        console.log("updateStoreItemDialogCtrl", {
            $scope: $scope,
            modelStoreItem: modelStoreItem,
        });

        this.langKeys = this.model.L10N.getKeys();
        this.productTypes = storeRepo.productTypes.cloneAsArray();
        this.updateImage = false;
        this.files = null;

        var _sendInProgress = false;
        this.updateDuration = false;
        this.$properties = _.cloneDeep(modelStoreItem.Properties);
        this.send = function () {
            if (_sendInProgress) return;
            _sendInProgress = true;
            if (!_.isEqual($self.$properties, $self.model.Properties)) {

                $self.model.Properties = $self.$properties;
            }
            $self.model.Properties = JSON.stringify($self.model.Properties);

            function request() {
                var newItem = {};
                Utils.UpdateObjData(newItem, $self.model);
                storeRepo.requestUpdateProductItem(newItem)
                    .finally(function () {
                        _sendInProgress = false;
                    })
                    .then(function (answer) {
                        storeRepo.updateLocalItem(answer);
                        console.log("answer", {
                            answer: answer,
                            newItem: newItem,

                        });
                        $mdDialog.hide($scope);
                    }, function (errorAnswer) {
                        console.log("errorAnswer", { errorAnswer: errorAnswer });
                        $mdDialog.hide($scope);
                    });
            }

            if ($self.updateImage) {
                $self.model.Base64Images = [];
                _.forEach($self.files, function (o) {
                    Utils.File.blobToBase64(o.lfFile, function (base64) {
                        $self.model.Base64Images.push(base64);
                        if ($self.model.Base64Images.length === $self.files.length) {
                            request();
                        }
                    });
                });
            }
            else {
                request();
            }


        };
        this.cancel = function () {
            console.log("updateStoreItemDialogCtrl.$scope", { $scope: $scope });
            $mdDialog.cancel($scope);
        };

    }
    ]);
})(Utils.CoreApp.adminApp);


 

