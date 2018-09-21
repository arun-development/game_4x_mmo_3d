Utils.CoreApp.gameApp.controller("buildCtrl", ["$scope", "industrialComplexService", "spaceShipyardService",
    function ($scope, industrialComplexService, spaceShipyardService) {
        var $self = this;
        var lastModel;
        this.$buildCollection = null;
        function setBuildCollection() {
            lastModel = $scope.planshetModel;
            $self.$buildCollection = lastModel.Bodys[0].TemplateData;
        }

        setBuildCollection();
        this.getBuildCollection = function () {
            if (!$self.$buildCollection) {
                setBuildCollection();
            }
            return $self.$buildCollection;
        };
        //storage
        this.storageStorableContainer = industrialComplexService.createStorageStorableContainer();
        this.getStorageTargetShowStatus = industrialComplexService.getStorageTargetShowStatus;
        this.registerStorageSlider = industrialComplexService.registerStorageSlider;

        //extraction
        this.extractionContainer = industrialComplexService.getExtractionContainer();
        this.registerExtractionSlider = industrialComplexService.registerExtractionSlider;
        this.getExtractionPowerData = industrialComplexService.getExtractionPowerData;

        //EnergyConverter
        this.getExchangeCourceData = industrialComplexService.getExchangeCourceData;
        this.energyConverterContainer = industrialComplexService.getEnergyConverterContainer();
        this.registerEnergyConverterSlider = industrialComplexService.registerEnergyConverterSlider;
        this.exchangeInputModel = 0;
        this.updateExchangeInputModel = industrialComplexService.updateExchangeInputModel;
        this.checkFloatProperty = function(value) {
            if (Number.isInteger(value)) return value;
            return Math.round(value * 1000) / 1000;
        };


        // unit input
        this.updateUnitInputModel = spaceShipyardService.updateUnitInputModel;

        function updateBuildCollection(newVal, oldVal) {
            if (newVal !== oldVal) {
                GameServices.mainHelper.applyTimeout(function () {
                    setBuildCollection();
                });
            }
        }
        $scope.$watch("planshetModel.UniqueId", updateBuildCollection);
        $scope.$watch("planshetModel.IsMother", updateBuildCollection);
        $scope.$on("planshet:update", function (evt) {
            if (lastModel && evt.targetScope && evt.targetScope.planshetModel && evt.targetScope.planshetModel.UniqueId === lastModel.UniqueId) {
                updateBuildCollection(true, false);
            }
        });
    }
]);
 




