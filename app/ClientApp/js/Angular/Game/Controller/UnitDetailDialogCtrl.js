//units
Utils.CoreApp.gameApp.controller("unitDetailDialogCtrl",
    ["$scope", "$mdDialog", "unitDialogService", "unitDetailDialogData",
        function ($scope, $mdDialog, $uds, $ud) {
            var $self = _.extend(this, $uds.CreateUnitDetailUnitView($ud.unit));            
            EM.Audio.GameSounds.dialogOpen.play();
            this.cancel = function () {
                EM.Audio.GameSounds.dialogClose.play();
                $mdDialog.cancel();
            };

        }
    ])
    .controller("unitBuyDialogCtrl", ["$scope", "$mdDialog", "unitDialogService", "unitBuyDialogData", function ($scope, $mdDialog, $uds, $ubdd) {
        var $self = _.extend(this, $uds.CreateBuyUnitViewData($ubdd));
       
        EM.Audio.GameSounds.dialogOpen.play();
        this.updateUnitInputModel = function ($event) { 
            $self.hasError = $self.$hasError();
            GameServices.spaceShipyardService.updateUnitInputModel($ubdd.dataUnit);
 
        };
        this.cancel = function () {
            EM.Audio.GameSounds.dialogClose.play();
            $mdDialog.cancel();
        };
        this.buy = function ($event) {
            if (this.$hasError()) {
                return;
            }
            var submit = this.Update.Buttons.Submit;
            console.log([this, submit]);

            try {
                submit.Method(submit.Params);
                $mdDialog.hide($scope);
            } catch (e) {

            }



        }; 
        $scope.$watch("ubdCtrl.errorModels.count.isError", function (newVal, oldVal) {
            if (newVal !== oldVal) {
                GameServices.mainHelper.applyTimeout(function () {
                    $self.errorModels.count.isError = newVal;
                });
            }
        });
        $scope.$watch("ubdCtrl.hasError", function (newVal, oldVal) {
            if (newVal !== oldVal) {
                GameServices.mainHelper.applyTimeout(function () {
                    $self.hasError = $self.$hasError();                          
                });
            }
        });

    }]);


//tech
Utils.CoreApp.gameApp.controller("techDetailDialogCtrl", ["$scope", "$mdDialog", "unitDialogService", "techDetailDialogData", function ($scope, $mdDialog, $uds, techDetailDialogData) {
    _.extend(this, $uds.CreateTechDetailView(techDetailDialogData));
    EM.Audio.GameSounds.dialogOpen.play();
    this.cancel = function () {
        EM.Audio.GameSounds.dialogClose.play();
        $mdDialog.cancel();
    };
}
]).controller("techBuyDialogCtrl", ["$scope", "$mdDialog", "unitDialogService", "techBuyDialogData", function ($scope, $mdDialog, $uds, techBuyDialogData) {
    var $self = _.extend(this, $uds.CreateBuyTechViewData(techBuyDialogData));   
    EM.Audio.GameSounds.dialogOpen.play();
    this.updateTechInputModel = function ($event) {
        $self.hasError = $self.$hasError(); 
    };
    this.cancel = function () {
        EM.Audio.GameSounds.dialogClose.play();
        $mdDialog.cancel();
    };
    this.buy = function ($event) {
        if (this.$hasError()) {
            return;
        }
        var submit = this.Update.Buttons.Submit;
        try {
            submit.Method(submit.Params);
            $mdDialog.hide($scope);
        } catch (e) {

        }
    };

    $scope.$watch("tbdCtrl.hasError", function (newVal, oldVal) { 
        if (newVal !== oldVal) {
            GameServices.mainHelper.applyTimeout(function () {
                $self.hasError = $self.$hasError();
            });
        }
    });
    }]);
//directive 
Utils.CoreApp.gameApp.directive("unitPriceInDialog", [
    function () {
        function link($scope, element, attrs, ctrl) {
 
        }

        return {
            restrict: "E",
            templateUrl: "unit-price-in-dialog.tmpl",
            scope: {
                priceItem: "=",
                canBuyMultipleItems:"=?",
                onInputDataChange:"="
            },
            link: link
        };
    }
]);
Utils.CoreApp.gameApp.directive("unitErrorsBuyInDialog", [
    function () {
        function link($scope, element, attrs, ctrl) {
            console.log("unitErrorsBuyInDialog", { $scope: $scope });

        }
        return {
            restrict: "E",
            templateUrl: "unit-errors-buy-in-dialog.tmpl",
            scope: {
                priceItem: "="   
            },
            link: link
        };
    }
]);
// service

Utils.CoreApp.gameApp.service("unitDialogService", ["techTreeHelper", "$mdDialog", "baseDialogHelper", function ($ttH, $mdDialog, baseDialogHelper) {
        "use strict";
        var $mf = Utils.ModelFactory;
        function AtackProps(count, unitStat, baseTech, profileTech, allianceBaseTech, allianceProfileTech, officer, boosers) {
            var stat = unitStat.Attack || 0;

            var baseTechPercent = baseTech.Info.Data.Properties.Atack.CurrentValue || 0;
            if (!baseTech.Info.Data.Properties.Level.CurrentValue) {
                baseTechPercent = 0;
            }

            var profilePercent = profileTech.Info.Data.Properties.Atack.CurrentValue || 0;
            if (!profileTech.Info.Data.Properties.Level.CurrentValue) {
                profilePercent = 0;
            }
            var allianceBaseTechPercent = allianceBaseTech.Progress.Advanced.Atack.CurrentValue || 0;
            if (!allianceBaseTech.Progress.Advanced.Level.CurrentValue) {
                allianceBaseTechPercent = 0;
            }

            var allianceProfileTechPercent = allianceProfileTech.Progress.Advanced.Atack.CurrentValue || 0;
            if (!allianceProfileTech.Progress.Advanced.Level.CurrentValue) {
                allianceProfileTechPercent = 0;
            }

            var officerPercent = officer.Attack || 0;
            var booserPercent = boosers.Attack || 0;

            var sumMod = (baseTechPercent + profilePercent + allianceBaseTechPercent + allianceProfileTechPercent + officerPercent + booserPercent) * 0.01;
            var total = stat + (stat * sumMod);
            var stakSum = count * total;

            return [
                $mf.KeyVal(unitStat.AttackName, stat),
                $mf.KeyVal(baseTech.TranslateName, baseTechPercent + "%"),
                $mf.KeyVal(profileTech.TranslateName, profilePercent + "%"),
                $mf.KeyVal(allianceBaseTech.Text.Name, allianceBaseTechPercent + "%"),
                $mf.KeyVal(allianceProfileTech.Text.Name, allianceProfileTechPercent + "%"),
                $mf.KeyVal("AtackBooser", 0 + "%"),
                $mf.KeyVal("Officer (" + unitStat.AttackName + ")", officerPercent + "%"),
                $mf.KeyVal("Sum " + unitStat.AttackName, _.round(total, 2)),
                $mf.KeyVal("Total stack", _.round(stakSum, 2))
            ];
        }

        function StructureProps(count, unitStat, baseTech, profileTech, allianceBaseTech, allianceProfileTech, officer, boosers) {
            var stat = unitStat.Hp || 0;
            var baseTechPercent = baseTech.Info.Data.Properties.Hp.CurrentValue || 0;
            if (!baseTech.Info.Data.Properties.Level.CurrentValue) {
                baseTechPercent = 0;
            }
            var profilePercent = profileTech.Info.Data.Properties.Hp.CurrentValue || 0;
            if (!profileTech.Info.Data.Properties.Level.CurrentValue) {
                profilePercent = 0;
            }

            var allianceBaseTechPercent = allianceBaseTech.Progress.Advanced.Hp.CurrentValue || 0;
            if (!allianceBaseTech.Progress.Advanced.Level.CurrentValue) {
                allianceBaseTechPercent = 0;
            }
            var allianceProfileTechPercent = allianceProfileTech.Progress.Advanced.Hp.CurrentValue || 0;
            if (!allianceProfileTech.Progress.Advanced.Level.CurrentValue) {
                allianceProfileTechPercent = 0;
            }

            var officerPercent = officer.Hp || 0;
            var booserPercent = boosers.Hp || 0;


            var sumMod = (baseTechPercent + profilePercent + allianceBaseTechPercent + allianceProfileTechPercent + officerPercent + booserPercent) * 0.01;
            var total = stat + (stat * sumMod);
            var stakSum = count * total;
            return [
                $mf.KeyVal(unitStat.HpName, stat),
                $mf.KeyVal(baseTech.TranslateName, baseTechPercent + "%"),
                $mf.KeyVal(profileTech.TranslateName, profilePercent + "%"),
                $mf.KeyVal(allianceBaseTech.Text.Name, allianceBaseTechPercent + "%"),
                $mf.KeyVal(allianceProfileTech.Text.Name, 0 + "%"),
                $mf.KeyVal("StructureBooser", booserPercent + "%"),
                $mf.KeyVal("Officer (" + unitStat.HpName + ")", officerPercent + "%"),
                $mf.KeyVal("Sum " + unitStat.HpName, _.round(total, 2)),
                $mf.KeyVal("Total stack", _.round(stakSum, 2))
            ];
        }

        var TECH_NAMES = $ttH.TECH_NAMES;

        var UNIT_NAMES = {
            Drone: "Drone",
            Frigate: "Frigate",
            Battlecruiser: "Battlecruiser",
            Battleship: "Battleship",
            Drednout: "Drednout"
        };
        Object.freeze(UNIT_NAMES);

        function _createUnitTechName(unitNativeName) {
            return "Tech" + unitNativeName;
        }

        function RefUnitToTech() {
            this.Drone = _createUnitTechName(UNIT_NAMES.Drone);
            this.Frigate = _createUnitTechName(UNIT_NAMES.Frigate);
            this.Battlecruiser = _createUnitTechName(UNIT_NAMES.Battlecruiser);
            this.Battleship = _createUnitTechName(UNIT_NAMES.Battleship);
            this.Drednout = _createUnitTechName(UNIT_NAMES.Drednout);
        }
        RefUnitToTech.prototype.getTechName = function (unitNativeName) {
            return this[unitNativeName];
        }

        var refUnitToTechName = new RefUnitToTech();
        Object.freeze(refUnitToTechName);

        function getTechFromTechCollection(techCollection, techNativeName) {
            return _.find(techCollection, function (o) { return o.NativeName === techNativeName; });
        }


        function _getDescriptionTranslateKey(unitNativeName) {
            if (unitNativeName === UNIT_NAMES.Battlecruiser) {
                return "battleCruiserDescription";
            }
            else if (unitNativeName === UNIT_NAMES.Battleship) {
                return "battleShipDescription";
            }
            else {
                return _.lowerFirst(unitNativeName) + "Description";
            }

        }

        function _getUnitStat(shipyandUnits, unitNativeName) {
            var unit = _.find(shipyandUnits, function (o) {
                return o.NativeName === unitNativeName;
            });
            return unit.Info.Data.UnitStats;
        }

        function _getBooserMod() {
            var result = $mf.IBattleStats();
            //todo code heare
            return result;
        }

        function BaseViewItem(title, icon, description) {
            this.Title = title;
            this.Icon = icon;
            this.Description = description;
     
        }

        function UnitView(unitData) {
            console.log("UnitView", { unitData: unitData });
            //unit
            var shipyardUnits = GameServices.spaceShipyardService.getBuildCollection();
            var translateKey = _getDescriptionTranslateKey(unitData.NativeName);
            var translate = GameServices.translateService.getUnit();
            var unitStats = _getUnitStat(shipyardUnits, unitData.NativeName);
            var count = unitData.Progress.Level || 0;

            var profileTechName = refUnitToTechName.getTechName(unitData.NativeName);
            //personal tech
            var teches = GameServices.laboratoryService.getCollection();
            var profileTech = getTechFromTechCollection(teches, profileTechName);
            var atackTech = getTechFromTechCollection(teches, TECH_NAMES.TechWeaponUpgrade);
            var structTech = getTechFromTechCollection(teches, TECH_NAMES.TechDamageControl);

            //allianceTech
            var allianceTechModel = GameServices.allianceService.getAllianceTechModel();
            var allianceTeches = allianceTechModel.Teches;
            var allianceBaseAtakTech = allianceTeches[TECH_NAMES.TechWeaponUpgrade];
            var allianceBaseStructureTech = allianceTeches[TECH_NAMES.TechDamageControl];
            var allianceProfileTech = allianceTeches[profileTechName];

            var officerBonus = GameServices.confederationService.getOfficerBonusForCurrentUser();
            var boosterMods = _getBooserMod();

            //console.log("UnitView", {
            //    teches: teches,
            //    profileTech: profileTech,
            //    atackTech: atackTech,
            //    structTech: structTech,
            //    unitStats: unitStats,
            //    unitData: unitData,
            //});

            _.extend(this, new BaseViewItem(unitData.Name + " (" + count + ")", unitData.SpriteImages.Detail, translate[translateKey]) );
            this.Atack = new AtackProps(count, unitStats, atackTech, profileTech, allianceBaseAtakTech, allianceProfileTech, officerBonus, boosterMods);
            this.Structure = new StructureProps(count, unitStats, structTech, profileTech, allianceBaseStructureTech, allianceProfileTech, officerBonus, boosterMods);
        }

        function _createUnitTechError(minlevel, currentLevel, translateName, errorDescription) {
            function TechError() {
                this.MinLevel = minlevel;
                this.CurrentLevel = currentLevel;
                this.TranslateName = translateName;
                this.Description = errorDescription;
            };
            return new TechError();
        }

        function createUnitTechErrorDescription(techErrorModel) {
            var spt = baseDialogHelper.setSpanText;
            var selectCss = baseDialogHelper.cssSelectName;
            var template = Utils.LangSimple(
                spt("EN: недостаточный уровень технологии " +
                    spt(techErrorModel.TranslateName, selectCss) +
                    " <br> необходимый уровень: " +
                    spt(techErrorModel.MinLevel, selectCss) +
                    " <br> текущий уровень: " +
                    spt(techErrorModel.CurrentLevel, selectCss)),
                spt("ES: недостаточный уровень технологии " +
                    spt(techErrorModel.TranslateName, selectCss) +
                    " <br> необходимый уровень: " +
                    spt(techErrorModel.MinLevel, selectCss) +
                    " <br> текущий уровень: " +
                    spt(techErrorModel.CurrentLevel, selectCss)),
                spt("RU: недостаточный уровень технологии " +
                    spt(techErrorModel.TranslateName, selectCss) +
                    " <br> необходимый уровень: " +
                    spt(techErrorModel.MinLevel, selectCss) +
                    " <br> текущий уровень: " +
                    spt(techErrorModel.CurrentLevel, selectCss)));
            return template.getCurrent();
        }

        function createUnitTechProfileErrorDescription(techErrorModel) {
            var spt = baseDialogHelper.setSpanText;
            var selectCss = baseDialogHelper.cssSelectName;
            var template = Utils.LangSimple(
                spt("EN: технология " + spt(techErrorModel.TranslateName, selectCss) + " не изучена"),
                spt("ES: технология " + spt(techErrorModel.TranslateName, selectCss) + " не изучена"),
                spt("RU: технология " + spt(techErrorModel.TranslateName, selectCss) + " не изучена"));
            return template.getCurrent();
        }

        function _extendDialogBuyErrors(inst, teches, techCondition, profileTech) {
            var weaponKey = TECH_NAMES.TechWeaponUpgrade;
            var dcKey = TECH_NAMES.TechDamageControl;

            inst.errorModels = {
                count: {
                    isError: false
                },
                resource: {
                    e: {
                        isError: false,
                        message:"недостаточно e"
                    },
                    ir: {
                        isError: false,
                        message: "недостаточно ir"
                    },
                    dm: {
                        isError: false,
                        message: "недостаточно dm"
                    },
                    cc: {
                        isError: false,
                        message: "недостаточно cc"
                    }

                }

            };
            inst.errorModels.resource.$resetCcError = function () {
                inst.errorModels.resource.cc.isError = false;
            };
            inst.errorModels.resource.$resetMaterialresourcesErrors = function () {
                var r = inst.errorModels.resource;
                r.e.isError = r.ir.isError = r.dm.isError = false;
            };

            var weaponUpgrade = getTechFromTechCollection(teches, weaponKey);
            var damageControl = getTechFromTechCollection(teches, dcKey);
            var dcLevel = damageControl.Update.Properties[0].CurrentValue;
            var wuLevel = weaponUpgrade.Update.Properties[0].CurrentValue;

            if (techCondition) {
                if (techCondition[dcKey] && techCondition[dcKey] > dcLevel) {
                    var dcError = _createUnitTechError(techCondition[dcKey], dcLevel, damageControl.TranslateName);
                    dcError.Description = createUnitTechErrorDescription(dcError);
                    inst.errorModels[dcKey] = dcError;
                }

                if (techCondition[weaponKey] && techCondition[weaponKey] > wuLevel) {
                    var wuError = _createUnitTechError(techCondition[dcKey], dcLevel, damageControl.TranslateName);
                    wuError.Description = createUnitTechErrorDescription(wuError);
                    inst.errorModels[weaponKey] = wuError;
                }


            }

            if (profileTech) {
                var profileTechLevel = profileTech.Update.Properties[0].CurrentValue; 
                if (profileTechLevel <= 0) {
                    var profileError = _createUnitTechError(1, 0, profileTech.TranslateName);
                    profileError.Description = createUnitTechProfileErrorDescription(profileError);
                    inst.errorModels.ProfileTech = profileError;
                }
            }


            inst.$calcPrice = function (count) {
                var materialResource = Utils.ModelFactory.MaterialResources();
                materialResource.E = inst.Price.E * count;
                materialResource.Ir = inst.Price.Ir * count;
                materialResource.Dm = inst.Price.Dm * count;
                return materialResource;

            };
            inst.hasError = false;
            inst.$hasResources = function () {
                var count = inst.Update.upgradeCount;
                var forCc = inst.Price.forCc;
                if (forCc) {
                    inst.errorModels.resource.$resetMaterialresourcesErrors();
                    var ccPrice = inst.Price.Cc * count;
                    var hasCc = GameServices.resourceService.isEnoughCc(ccPrice);
                    inst.errorModels.resource.cc.isError = !hasCc;
 
                    return hasCc;
                }
                else {
             
                    inst.errorModels.resource.$resetCcError();
                    var calculatedPrice = inst.$calcPrice(count);    
                    var r = inst.errorModels.resource; 
                    var currentResource = GameServices.resourceService.getStorageResources().Current;
                    r.e.isError = currentResource.E < calculatedPrice.E;
                    r.ir.isError = currentResource.Ir < calculatedPrice.Ir;
                    r.dm.isError = currentResource.Dm < calculatedPrice.Dm;
 
                    return !r.e.isError && !r.ir.isError && !r.dm.isError;

                }

            }
            inst.$hasError = function () {
                inst.errorModels.count.isError = inst.Update.upgradeCount < 1;
                var hasError = !inst.$hasResources() ||
                    inst.errorModels.count.isError ||
                    inst.errorModels.ProfileTech ||
                    inst.errorModels[weaponKey] ||
                    inst.errorModels[dcKey];

                inst.hasError = !!hasError; 
                return inst.hasError;
            };
            inst.$hasError();
        }

        function _extendBuyItem(inst,update, translate) {
            inst.Update = update;
            inst.Update.upgradeCount = 1; 
            inst.Price = inst.Update.Price;
            inst.Translate = translate;

        }


        function BuyUnitViewData(data) {
            var dataUnit = data.dataUnit;
            var unitName = dataUnit.NativeName;
            var hangarUnit = data.hangarUnit;
            var $$self = _.extend(this, new BaseViewItem(dataUnit.TranslateName, hangarUnit.SpriteImages.Icon));             
            _extendBuyItem(this, dataUnit.Update, dataUnit.unitTranslate);
            var teches = data.teches;
            var profileTechName = refUnitToTechName.getTechName(unitName);
            var profileTech = getTechFromTechCollection(teches, profileTechName);
            var techCondition = profileTech.AdvancedData.TechOut.Conditions;
            _extendDialogBuyErrors(this, teches, techCondition, profileTech);
        }

        this.CreateBuyUnitViewData = function (data) {
            return new BuyUnitViewData(data);
        };

        this.CreateUnitDetailUnitView = function (unitData) {
            return new UnitView(unitData);
        };

        this.CreateUnitDetailDialog = function ($event, unlock, unitNativeName) {
            var promise = $mdDialog.show({
                templateUrl: "unit-detail-dialog.tmpl",
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: true,
                fullscreen: true,
                locals: {
                    unitDetailDialogData: {
                        unit: GameServices.hangarService.getPanelUnitData(unitNativeName),
                        tech: {}
                    }
                },
                controller: "unitDetailDialogCtrl",
                controllerAs: "uddCtrl"

            });
            promise.then(unlock, unlock);
            return promise;
        };

        this.CreateBuyUnitDialog = function ($event, unlock, spaceShipyardUnitUtemData) {
            var unitName = spaceShipyardUnitUtemData.NativeName;
            var hangarUnit = GameServices.hangarService.getPanelUnitData(unitName);
            var teches = GameServices.laboratoryService.getCollection();
            if (!unitName || !hangarUnit || !teches) {
                unlock();
                console.log("CreateBuyUnitDialog: no data");
                return;
            }

            var promise = $mdDialog.show({
                templateUrl: "unit-buy-dialog.tmpl",
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                fullscreen: true,
                locals: {
                    unitBuyDialogData: {
                        dataUnit: spaceShipyardUnitUtemData,
                        hangarUnit: hangarUnit,
                        teches: teches
                    }
                },
                controller: "unitBuyDialogCtrl",
                controllerAs: "ubdCtrl"

            });
            promise.then(unlock, unlock);
            return promise;
        };


        //tech
        function TechView(tech, teches) {
           
            var $$self = _.extend(this, new BaseViewItem(tech.TranslateName + " (" + tech.Progress.Level + ")", tech.Info.DropImage, tech.Info.Description));

            this.Stats = [];
            _.forEach(tech.Info.infoStatsModel.stats, function (i, idx) {
                $$self.Stats.push($mf.KeyVal(i.key, i.val));
            }); 
            this.HasConditions = false; 
            this.Conditions = [];
            var conditions = tech.AdvancedData.TechOut.Conditions;
            if (conditions) {
                
                _.forEach(conditions, function (val, techNativeName) {
                    var targetTech = getTechFromTechCollection(teches, techNativeName);
                    var item = $mf.KeyVal(targetTech.TranslateName, val);
                    item.$css = "";  
                    if (targetTech.Progress.Level < val) {
                        item.$css = "red";
                        item.Val = targetTech.Progress.Level + "/" + val
                    }
                    $$self.Conditions.push(item);
                });
                if (this.Conditions.length){
                    this.HasConditions = true;
                }
            }
        }

        function TechBuyViewData(techDetailDialogData) {
            var tech = techDetailDialogData.tech;
            var techCondition = tech.AdvancedData.TechOut.Conditions;

            var $$self = _.extend(this, new BaseViewItem(tech.TranslateName, tech.IconSelf));             
            _extendBuyItem(this, tech.Update, tech.unitTranslate);
            _extendDialogBuyErrors(this, techDetailDialogData.teches, techCondition, null);
        }

        this.CreateTechDetailView = function (techItemData) {
            return new TechView(techItemData.tech, techItemData.teches);
        };

        this.CreateTechDetailDialog = function ($event, unlock, techNativeName) {
            var teches = GameServices.laboratoryService.getCollection();
            var tech = getTechFromTechCollection(teches, techNativeName);
            if (!tech) {
                unlock();
                console.log("CreateTechDetailDialog: no data");
                return;
            } 
            var promise = $mdDialog.show({
                templateUrl: "tech-detail-dialog.tmpl",
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: true,
                fullscreen: true,
                locals: {
                    techDetailDialogData: { 
                        tech: tech,
                        teches: teches
                    }
                },
                controller: "techDetailDialogCtrl",
                controllerAs: "tddCtrl"

            });
            promise.then(unlock, unlock);
            return promise;
        };


        this.CreateBuyTechViewData = function (techBuyDialogData) {
            return new TechBuyViewData(techBuyDialogData);
        };
        this.CreateBuyTechDialog = function ($event, unlock, techNativeName) {
            var teches = GameServices.laboratoryService.getCollection();
            var tech = getTechFromTechCollection(teches, techNativeName);
            if (!tech) {
                unlock();
                console.log("CreateTechDetailDialog: no data");
                return;
            } 

            var promise = $mdDialog.show({
                templateUrl: "tech-buy-dialog.tmpl",
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: true,
                fullscreen: true,
                locals: {
                    techBuyDialogData: {
                        tech: tech,
                        teches: teches
                    }
                },
                controller: "techBuyDialogCtrl",
                controllerAs: "tbdCtrl"

            });
            promise.then(unlock, unlock);
            return promise;
        };

    }]);
