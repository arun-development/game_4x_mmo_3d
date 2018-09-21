Utils.CoreApp.gameApp.service("bookmarkDialogHelper", ["baseDialogHelper",
    function (baseDialogHelper) {
        var $self = this;
        var supLangs = baseDialogHelper.supportedLangs;
        var cssSelectName = baseDialogHelper.cssSelectName;
        var defaultTheme = baseDialogHelper.defaultTheme;
        var setSpanText = baseDialogHelper.setSpanText;
        var $mdDialog = this.$mdDialog =baseDialogHelper.$$mdDialog;
    
 
        // #region openDialogDeepDeleteOtherGroupChannels
        var _textOpenDialogBookmarkIsExist;
        function getTextOpenDialogBookmarkIsExist() {
            if (!_textOpenDialogBookmarkIsExist) {
                _textOpenDialogBookmarkIsExist = Utils.CreateLangSimple("EN _textOpenDialogBookmarkIsExist",
                    "ES _textOpenDialogBookmarkIsExist",
                    "RU _textOpenDialogBookmarkIsExist");
            }
            return _textOpenDialogBookmarkIsExist.getCurrent();
        }

        this.openDialogBookmarkIsExist = function () {     
            return $mdDialog.show(
                  $mdDialog.alert()
                  .title("Bookmark: error")      
                  .htmlContent(getTextOpenDialogBookmarkIsExist())
                  .ariaLabel(defaultTheme)
                  .clickOutsideToClose(true)
                  .ok("Ok"));

        };


 
        function getTextOpenDialogBookMarkLimitDone() {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU getTextOpenDialogBookMarkLimitDone");

            } else if (LANG === supLangs.Es) {
                return setSpanText("ES  getTextOpenDialogBookMarkLimitDone");
            } else {
                return setSpanText("EN  getTextOpenDialogBookMarkLimitDone");
            }
        }

        this.openDialogBookMarkLimitDone = function () {
            return $mdDialog.show(
                  $mdDialog.alert()
                  .title("Bookmark: error")
                  .htmlContent(getTextOpenDialogBookMarkLimitDone())
                  .ariaLabel(defaultTheme)
                  .clickOutsideToClose(true)
                  .ok("Ok"));

        };


        
        // #endregion 
 

    }
]);