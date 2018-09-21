Utils.CoreApp.gameApp.service("confederationDialogHelper", ["baseDialogHelper", "maxLenghtConsts",
    function (baseDialogHelper, maxLenghtConsts) {
        //todo delete after
        GameServices.$cdH = this;      
 
        var supLangs = baseDialogHelper.supportedLangs;
        var cssSelectName = baseDialogHelper.cssSelectName;
        var defaultTheme = baseDialogHelper.defaultTheme;
        var $mdDialog = this.$mdDialog = baseDialogHelper.$$mdDialog;
        var setSpanText = baseDialogHelper.setSpanText;


        // #region OpenDialogTimeVotingIsOver
        var _textOpenDialogTimeVotingIsOver;
        function getTextOpenDialogTimeVotingIsOver() {
            if (!_textOpenDialogTimeVotingIsOver) {
                _textOpenDialogTimeVotingIsOver = Utils.CreateLangSimple("EN Текущий период голосования завершён",
                                                                         "ES Текущий период голосования завершён",
                                                                         "RU Текущий период голосования завершён");
            }
            return _textOpenDialogTimeVotingIsOver.getCurrent();
        }

        this.openDialogTimeVotingIsOver = function ($event) {
            return $mdDialog.show(
                      $mdDialog.alert()
                      .clickOutsideToClose(true)
                      .title("ELECTION: ")
                      .targetEvent($event)
                      .ariaLabel(defaultTheme)
                      .htmlContent(getTextOpenDialogTimeVotingIsOver())
                      .ok("Ok"));
        };
        // #endregion

        // #region OpenDialogTimeVotingIsOver
        var _textOpenDialogTimeRegistrationIsOver;
        function getTextOpenDialogTimeRegistrationIsOver() {
            if (!_textOpenDialogTimeRegistrationIsOver) {
                _textOpenDialogTimeRegistrationIsOver = Utils.CreateLangSimple("EN Текущий период регистрации завершён, регистрация будет открыта после окончания выборов.",
                                                                         "ES Текущий период регистрации завершён, регистрация будет открыта после окончания выборов.",
                                                                         "RU Текущий период регистрации завершён, регистрация будет открыта после окончания выборов.");
            }
            return _textOpenDialogTimeRegistrationIsOver.getCurrent();
        }

        this.openDialogTimeRegistrationIsOver = function ($event) {
            return $mdDialog.show(
                      $mdDialog.alert()
                      .clickOutsideToClose(true)
                      .title("ELECTION: ERROR ")
                      .targetEvent($event)
                      .ariaLabel(defaultTheme)
                      .htmlContent(getTextOpenDialogTimeRegistrationIsOver())
                      .ok("Ok"));
        };
        // #endregion


        // #region OpenDialogTimeVotingIsOver  

        var _openDialogUserHasAlreadyCastVote;
        function getTextOpenDialogUserHasAlreadyCastVote() {
            if (!_openDialogUserHasAlreadyCastVote) {
                _openDialogUserHasAlreadyCastVote = Utils.CreateLangSimple("EN Вы уже голосовали на этой неделе",
                                                                           "ES Вы уже голосовали на этой неделе",
                                                                           "RU Вы уже голосовали на этой неделе");
            }
            return _openDialogUserHasAlreadyCastVote.getCurrent();
        }
        this.openDialogUserHasAlreadyCastVote = function ($event) {
            return $mdDialog.show(
                      $mdDialog.alert() 
                      .clickOutsideToClose(true)
                      .title("ELECTION: ")
                      .targetEvent($event)
                      .ariaLabel(defaultTheme)
                      .htmlContent(getTextOpenDialogUserHasAlreadyCastVote())
                      .ok("Ok"));
        };
        // #endregion

        // #region openDialogConfirmSendVote
        function getTextOpenDialogConfirmSendVote(targetUserName) {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU  Вы действительно хотите отдать свой голос за  " + setSpanText(targetUserName, cssSelectName) + "?");

            } else if (LANG === supLangs.Es) {
                return setSpanText("ES  Вы действительно хотите отдать свой голос за  " + setSpanText(targetUserName, cssSelectName) + "?");
            } else {
                return setSpanText("EN  Вы действительно хотите отдать свой голос за  " + setSpanText(targetUserName, cssSelectName) + "?");
            }
        }


        this.openDialogConfirmSendVote = function ($event, targetUserName) {
            var confirm = $mdDialog.confirm()
                    .ariaLabel(defaultTheme)
                    .title("ELECTION: Send vote")
                    .htmlContent(getTextOpenDialogConfirmSendVote(targetUserName))
                    .targetEvent($event)
                    .ok("Confirm")
                    .cancel("Cancel");
            return $mdDialog.show(confirm);
        };
        // #endregion

        // #region openDialogRegistrationNotEnoughCc
        function getTextopenDialogRegistrationNotEnoughCc(priceCc,currentBalanceCc) {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU На вашем балансе недостаточно СС  для регистрации. "+
                    "<br> Стоимость регистрации составляет :" + setSpanText(priceCc, cssSelectName) + " CC "+
                    "<br> Ваш текущий баланс: " + setSpanText(currentBalanceCc, cssSelectName) + " CC "+
                    "<br> Вам нехватет " + setSpanText(priceCc - currentBalanceCc, cssSelectName) + " CC ");

            } else if (LANG === supLangs.Es) {
                return setSpanText("ES На вашем балансе недостаточно СС  для регистрации. " +
                    "<br> Стоимость регистрации составляет :" + setSpanText(priceCc, cssSelectName) + " CC " +
                    "<br> Ваш текущий баланс: " + setSpanText(currentBalanceCc, cssSelectName) + " CC " +
                    "<br> Вам нехватет " + setSpanText(priceCc - currentBalanceCc, cssSelectName) + " CC ");
            } else {
                return setSpanText("EN На вашем балансе недостаточно СС  для регистрации. " +
                   "<br> Стоимость регистрации составляет :" + setSpanText(priceCc, cssSelectName) + " CC " +
                   "<br> Ваш текущий баланс: " + setSpanText(currentBalanceCc, cssSelectName) + " CC " +
                   "<br> Вам нехватет " + setSpanText(priceCc - currentBalanceCc, cssSelectName) + " CC ");
            }
        }
        this.openDialogRegistrationNotEnoughCc = function ($event,priceCc, currentBalanceCc) {
            return $mdDialog.show(
                  $mdDialog.alert()
                  .clickOutsideToClose(true)
                  .title("ELECTION: Registration - Not enough cc ")
                  .targetEvent($event)
                  .ariaLabel(defaultTheme)
                  .htmlContent(getTextopenDialogRegistrationNotEnoughCc(priceCc,currentBalanceCc))
                  .ok("Ok"));
        };
        // #endregion

        // #region OpenDialogNotPermitted
        this.openDialogNotPermitted = baseDialogHelper.openDialogNotPermitted;
        // #endregion

    }
]);