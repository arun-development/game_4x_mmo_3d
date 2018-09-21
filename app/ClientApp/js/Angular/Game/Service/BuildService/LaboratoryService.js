Utils.CoreApp.gameApp.service("laboratoryService", ["planshetService", "techTreeHelper",
    function (planshetService, techTreeHelper) {
        var $self = this;

        //#region Members
        //#endregion 

        //#region Require   
        this.getUniqueId = function () {
            return $self._laboratoryUniqueId;
        };
        this.upgradeModel = function () {
            if (planshetService.isCurrentModel($self._laboratoryUniqueId)) {
                planshetService.updatePlanshet(null, $self._laboratoryUniqueId);
            }
        };

        var lockTechItem = false;
        function unlockDialogTech() {
            lockTechItem = false;
        };

        this.setTechViewData = function (statisticHelper, techItem) {
            //StatModel
            if (!techItem.Info.infoStatsModel) {
                var data = techItem.Info.Data;
                var props = data.Properties;
                var stats = [];
               // console.log("setTechViewData", data);
                _.forEach(props, function (val, key) {
       
                    var propVal = val.CurrentValue;
                    if (!propVal) {
                        propVal = val.BaseValue;
                    }
                    if (key !== "Level" && propVal) {
                        propVal = _.round(propVal, 2);
                        propVal += "%";
                        propVal = "+" + propVal;
                    }
     
                    stats.push(statisticHelper.createStatItemModel(val.PropertyName, propVal));
                });
                var img = statisticHelper.createBgImage(techItem.Info.DropImage, techItem.TranslateName);
                img.onClick = function ($event) {
                   
                    //GameServices.techTreeHelper.createTechTreeDialog($event);
                };
                techItem.Info.infoStatsModel = statisticHelper.createStatisticModel(stats, img);
            }

            //clicks
            var col = techItem.ComplexButtonView.Collection;
            var info = col[0];
            var detail = col[1];
            var update = col[2];
            info.$onClick   = function ($event) {
                if (lockTechItem) return;
                lockTechItem = true;
                GameServices.unitDialogService.CreateTechDetailDialog($event, unlockDialogTech, techItem.NativeName);

            };
            detail.$onClick = function ($event) {
                GameServices.techTreeHelper.createTechTreeDialog($event);
            };
            update.$onClick = function ($event) {     
                if (lockTechItem) return;
                lockTechItem = true;
                GameServices.unitDialogService.CreateBuyTechDialog($event, unlockDialogTech, techItem.NativeName);
            };

            
            // css
            //techItem.$mainContainerItemCss  
            if (techItem.AdvancedData.TechOut.Disabled && !techItem.$mainContainerItemCss) {
                Object.defineProperty(techItem, "$mainContainerItemCss", {
                    get: function () {
                        return techItem.AdvancedData.TechOut.Disabled ? " grayScale " : "";
                    }
                });
            }
        };

        this.$planshetIndex = null;
        Object.defineProperty(this, "_laboratoryUniqueId", {
            value: Utils.RepoKeys.DataKeys.BuildIds.GetBuildIdByIdx(3),
            writable: false,
            configurable: false
        });

        Object.defineProperty(this, "$laboratoryModel", {
            get: function () {
                if (!$self.$planshetIndex) {
                    $self.$planshetIndex = planshetService.getModelIndex($self._laboratoryUniqueId);
                    if (!$self.$planshetIndex) {
                        return null;
                    }
                }
                var model = planshetService.$planshetModels[$self.$planshetIndex];
                if (model && model.UniqueId === $self._laboratoryUniqueId) {
                    return model;
                }
                if (!model || model.UniqueId !== $self._laboratoryUniqueId) {
                    $self.$planshetIndex = planshetService.getModelIndex($self._laboratoryUniqueId);
                    model = planshetService.$planshetModels[$self.$planshetIndex];
                    if (!model) {
                        $self.$planshetIndex = null;
                        return null;
                    }
                    return model;
                }
                return null;
            }
        });
        this.getCollection = function () {
            var m = $self.$laboratoryModel;
            if (!m) return null;
            return m.Bodys[0].TemplateData;
        };

        this.getItem = function (techNativeName, invariant) {
            var col = $self.getCollection();
            if (!col) return null;
            if (invariant) {
                var name = techNativeName.toLowerCase();
                return _.find(col, function (o) {
                    return o.NativeName.toLowerCase() === name;
                });
            }
            return _.find(col, function (o) {
                return o.NativeName === techNativeName;
            });
        }

        this.updateBuildProgress = function (techNativeName, newProgress) {
            var item = $self.getItem(techNativeName);
            if (!item) {
                console.log("updateBuildProgress.tech item not exist", {
                    techNativeName: techNativeName,
                    newProgress: newProgress,
                    $self: $self,
                });
            }
            Utils.UpdateObjFromOther(item.Progress, newProgress);
            Utils.UpdateObjFromOther(item.AdvancedData.TechOut.Progress, newProgress);


        };
        //#endregion
    }
]);