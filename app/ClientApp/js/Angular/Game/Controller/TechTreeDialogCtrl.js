Utils.CoreApp.gameApp.controller("techTreeDialogCtrl", [
    "$scope", "$mdDialog", "techTreeData",
    function ($scope, $mdDialog, $ttd) {
        this.$title = "Tech tree";
        this.rows = $ttd.rows;
        EM.Audio.GameSounds.dialogOpen.play();
        this.cancel = function () {
            EM.Audio.GameSounds.dialogClose.play();
            $mdDialog.cancel($scope);
        };

    }
]).directive("techTreeRow", [
    function () {
        var template = "<div class='tech-row' layout='row' layout-align='start center'>" +
                             "<tech-tree-item item='row[0]'></tech-tree-item>" +
                             "<tech-tree-item item='row[1]'></tech-tree-item>" +
                             "<tech-tree-item item='row[2]'></tech-tree-item>" +
                       "</div>";

        return {
            restrict: "E",
            template: template,
            replace: true,
            scope: {
                row: "="
            }
        };
    }
]).directive("techTreeItem", [function () {
    var template = "<div flex='100' layout='column' layout-align='start center'>" +
                         "<div layout='column' layout-align='start center'>" +
                                "<div class='relative'>" +
                                     "<span class='tech-level' ng-bind='item.minLevel' ng-if='item.minLevel'></span>" +
                                     "<border-animation-item border='item.border'></border-animation-item>" +
                                "</div>" +
                                "<div class='tech-name' ng-bind='item.translateTechName'></div>" +
                         "</div>" +
                  "</div>";
    return {
        restrict: "E",
        template: template,
        replace: true,
        scope: {
            item: "="
        }
    };
}]).service("techTreeHelper", ["$mdDialog", "paralaxButtonHelper",
function ($mdDialog, $pbH) {
    var $self = this;

    this.TECH_NAMES = {
        TechWeaponUpgrade: "TechWeaponUpgrade",
        TechDamageControl: "TechDamageControl",
        TechDrone: "TechDrone",
        TechFrigate: "TechFrigate",
        TechBattlecruiser: "TechBattlecruiser",
        TechBattleship: "TechBattleship",
        TechDreadnout: "TechDreadnout"
    };
    Object.freeze(this.TECH_NAMES);

    function ITechConfigItem(nativeName, css, wuMinLevel, dcMinLevel) {
        this.NativeName = nativeName;
        this.CssTechClass = css;
        this.TranslateNames = null;
        this.TechWeaponUpgrade = {
            MinLevel: wuMinLevel
        };
        this.TechDamageControl = {
            MinLevel: dcMinLevel
        };     
    }

    

    function TechConfig() {
        this.TechWeaponUpgrade = new ITechConfigItem($self.TECH_NAMES.TechWeaponUpgrade, "tech-wu", 0, 0);
        this.TechWeaponUpgrade.TranslateNames = Utils.CreateLangSimple("EN WeaponUpgrade", "ES WeaponUpgrade", "RU WeaponUpgrade");

        this.TechDamageControl = new ITechConfigItem($self.TECH_NAMES.TechDamageControl,  "tech-dc", 0, 0);
        this.TechDamageControl.TranslateNames = Utils.CreateLangSimple("EN DamageControl", "ES DamageControl", "RU DamageControl");

        this.TechDrone = new ITechConfigItem($self.TECH_NAMES.TechDrone,  "tech-drone", 0, 0);
        this.TechDrone.TranslateNames = Utils.CreateLangSimple("EN Drone", "ES Drone", "RU Drone");


        this.TechFrigate = new ITechConfigItem($self.TECH_NAMES.TechFrigate,  "tech-frigate", 8, 8);
        this.TechFrigate.TranslateNames = Utils.CreateLangSimple("EN Frigate", "ES Frigate", "RU Frigate");

        this.TechBattlecruiser = new ITechConfigItem($self.TECH_NAMES.TechBattlecruiser,  "tech-battlecruiser", 15, 15);
        this.TechBattlecruiser.TranslateNames = Utils.CreateLangSimple("EN Battlecruiser", "ES Battlecruiser", "RU Battlecruiser");

        this.TechBattleship = new ITechConfigItem($self.TECH_NAMES.TechBattleship,  "tech-battleship", 23, 23);
        this.TechBattleship.TranslateNames = Utils.CreateLangSimple("EN Battleship", "ES Battleship", "RU Battleship");

        this.TechDreadnout = new ITechConfigItem($self.TECH_NAMES.TechDreadnout, "tech-drednout", 35, 35);
        this.TechDreadnout.TranslateNames = Utils.CreateLangSimple("EN Dreadnout", "ES Dreadnout", "RU Dreadnout");
 
    }



    TechConfig.prototype.getUnitTechesArray = function () {
        return [this.TechDrone, this.TechFrigate, this.TechBattlecruiser, this.TechBattleship, this.TechDreadnout];
    };

    TechConfig.prototype.clone = function () {
        return _.cloneDeep(this);
    };

 


    var _techConfig = new TechConfig();
 
    var _unitTechesArr = _techConfig.getUnitTechesArray();
 



    function _createSpriteIcon(cssTechClass,isAlliance) {
        return "sprite_atlas " + (isAlliance ? "alliance" : "user") + "-tech " + cssTechClass + " " + $pbH.BUTTONS_CONSTANTS.M;
    }
    function _createBa(cssTechClass, isAlliance) {
        var data = {
            ImagePathOrCss: _createSpriteIcon(cssTechClass, isAlliance)
        };
        return $pbH.SectionItem().BorderAnimView($pbH.BUTTONS_CONSTANTS.M, false, data);
    }

    function TechItem(border, translateTechName, minLevel) {
        this.border = border;
        this.minLevel = minLevel;
        this.translateTechName = translateTechName;
    }


    function _createRows(sourceIsAlliance) {
        var rows = [];
        for (var i = 0; i < 5; i++) {
               var unit = _unitTechesArr[i];
               var atack = new TechItem(_createBa(_techConfig.TechWeaponUpgrade.CssTechClass, sourceIsAlliance), _techConfig.TechWeaponUpgrade.TranslateNames.getCurrent(), unit.TechWeaponUpgrade.MinLevel);
               var structure = new TechItem(_createBa(_techConfig.TechDamageControl.CssTechClass, sourceIsAlliance), _techConfig.TechDamageControl.TranslateNames.getCurrent(), unit.TechDamageControl.MinLevel);
               var profileUnit = new TechItem(_createBa(unit.CssTechClass, sourceIsAlliance), unit.TranslateNames.getCurrent());
            var row = [atack, structure, profileUnit];
            rows.push(row);
        }
        return rows;
    }
 
    this.createTechTreeDialog = function ($event, sourceIsAlliance) {  
        $mdDialog.show({
            templateUrl: "dialog-tech-tree.tmpl",
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: false,
            fullscreen: false,
            locals: {
                techTreeData: {
                    rows: _createRows(sourceIsAlliance)
                }
            },
            //bindToController: true,
            controller: "techTreeDialogCtrl",
            controllerAs: "ttdCtrl"
        }).then(function (ctrlScope) {
            //confirm       
            ctrlScope.$destroy();
        }, function (ctrlScope) {
            //cancel
            ctrlScope.$destroy();
        });
    };
 

    Object.defineProperty(this, "$techConfig", {
        get: function () {
            return _techConfig.clone();
        }
    });
    this.getNativeNames = _techConfig.getNativeNames;



}
]);

