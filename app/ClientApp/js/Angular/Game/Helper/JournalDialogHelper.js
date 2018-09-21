Utils.CoreApp.gameApp.service("journalDialogHelper", ["baseDialogHelper", "maxLenghtConsts",
    function (baseDialogHelper) {
        //todo delete after
        GameServices.$jdH = this;
        var supLangs = baseDialogHelper.supportedLangs;
        var cssSelectName = baseDialogHelper.cssSelectName;
        var defaultTheme = baseDialogHelper.defaultTheme;
        var $mdDialog = baseDialogHelper.$$mdDialog;
        var setSpanText = baseDialogHelper.setSpanText;



        // #region MaxLimitSpyItems

        var _titleOpenDialogDialogMaxLimitSpyItems;         
        function getTitleOpenDialogDialogMaxLimitSpyItems() {
            if (!_titleOpenDialogDialogMaxLimitSpyItems) {
                _titleOpenDialogDialogMaxLimitSpyItems = Utils.CreateLangSimple("EN Spy", "ES Spy", "RU Spy");
            }
            return _titleOpenDialogDialogMaxLimitSpyItems.getCurrent();
        }
        function getTextopenDialogMaxLimitSpyItems(maxLimitTotalCount) {
            if (LANG === supLangs.Ru) return setSpanText("RU У вас " + setSpanText(maxLimitTotalCount, cssSelectName) + " отчетов ,  ваше хранилише переполненно <br> удалите лишние отчеты и пвторите попытку");
            else if (LANG === supLangs.Es) return setSpanText("ES У вас " + setSpanText(maxLimitTotalCount, cssSelectName) + " отчетов,  ваше хранилише переполненно  <br>  удалите лишние отчеты и пвторите попытку");
            else return setSpanText("EN У вас " + setSpanText(maxLimitTotalCount, cssSelectName) + " отчетов,  ваше хранилише переполненно  <br>  удалите лишние отчеты и пвторите попытку");

        }

        /**
         * Deprecated
         * @param {} maxLimitTotalCount 
         * @param {} $event 
         * @returns {} 
         */
        this.openDialogMaxLimitSpyItems = function (maxLimitTotalCount, $event) {
            return $mdDialog.show(
                 $mdDialog.alert()
                 .title(getTitleOpenDialogDialogMaxLimitSpyItems())
                 .targetEvent($event)
                 .htmlContent(getTextopenDialogMaxLimitSpyItems(maxLimitTotalCount))
                 .ariaLabel(defaultTheme)
                 .clickOutsideToClose(true)
                 .ok("Ok"));
        }
        // #endregion

        // #region TransferComplete
        var _titleOpenDialogTransferComplete;
        function getTitleOpenDialogTransferComplete() {
            if (!_titleOpenDialogTransferComplete) {
                _titleOpenDialogTransferComplete = Utils.CreateLangSimple("RU Transfer", "ES Transfer", "RU Transfer");
            }
            return _titleOpenDialogTransferComplete.getCurrent();
        }

        function getTextopenDialogTransferComplete(targetPlanetName) {
            if (LANG === supLangs.Ru) return setSpanText("RU флот прибыл на планету  " + setSpanText(targetPlanetName, cssSelectName));
            else if (LANG === supLangs.Es) return setSpanText("ES флот прибыл на планету  " + setSpanText(targetPlanetName, cssSelectName));
            else return setSpanText("EN  флот прибыл на планету  " + setSpanText(targetPlanetName, cssSelectName));

        }

        this.openDialogTransferComplete = function (targetPlanetName) {
            return $mdDialog.show(
                   $mdDialog.alert()
                   .title(getTitleOpenDialogTransferComplete())
                   .targetEvent()
                   .htmlContent(getTextopenDialogTransferComplete(targetPlanetName))
                   .ariaLabel(defaultTheme)
                   .clickOutsideToClose(true)
                   .ok("Ok"));
        }

        // #endregion



    }
]);