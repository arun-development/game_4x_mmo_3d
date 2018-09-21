Utils.CoreApp.gameApp.service("userChannelsDialogHelper", ["baseDialogHelper", "maxLenghtConsts",
    function (baseDialogHelper, maxLenghtConsts) {
        var $self = this;
        var supLangs = baseDialogHelper.supportedLangs;
        var cssSelectName = baseDialogHelper.cssSelectName;
        var defaultTheme = baseDialogHelper.defaultTheme;
        var $mdDialog = baseDialogHelper.$$mdDialog;

        var setSpanText = baseDialogHelper.setSpanText;

        this.$mdDialog = baseDialogHelper.$$mdDialog;
        this.maxLenghtConsts = maxLenghtConsts;
        // #region openDialogConfirmDeletePrivateChannel
        function getTextOpenDialogConfirmDeletePrivateChannel(targetUserName) {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU  Вы действительно хотите удалить переписку с пользователем  " + setSpanText(targetUserName, cssSelectName) + "?");

            } else if (LANG === supLangs.Es) {
                return setSpanText("ES  Вы действительно хотите удалить переписку с пользователем  " + setSpanText(targetUserName, cssSelectName) + "?");
            } else {
                return setSpanText("EN  Вы действительно хотите удалить переписку с пользователем  " + setSpanText(targetUserName, cssSelectName) + "?");
            }
        }

        this.openDialogConfirmDeletePrivateChannel = function ($event, targetUserName) {
            var confirm = $mdDialog.confirm()
                .ariaLabel(defaultTheme)
                .title("WARN: Delete private channel!")
                .htmlContent(getTextOpenDialogConfirmDeletePrivateChannel(targetUserName))
                .targetEvent($event)
                .ok("Confirm")
                .cancel("Cancel");
            return $mdDialog.show(confirm);
        };
        // #endregion

        // #region openDialogUserHasChannel

        function getTextOpenDialogUserHasChannel(existChannelName) {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU  У вас уже существует канал " + setSpanText(existChannelName, cssSelectName) + "  что то там еще");

            } else if (LANG === supLangs.Es) {
                return setSpanText("ES У вас уже существует канал " + setSpanText(existChannelName, cssSelectName) + "  что то там еще");
            } else {
                return setSpanText("EN  У вас уже существует канал " + setSpanText(existChannelName, cssSelectName) + "  что то там еще");
            }
        }

        this.openDialogUserHasChannel = function ($event, existChannelName) {
            return $mdDialog.show(
                $mdDialog.alert()
                .clickOutsideToClose(true)
                .title("Create channel: Warn!")
                .targetEvent($event)
                .ariaLabel(defaultTheme)
                .htmlContent(getTextOpenDialogUserHasChannel(existChannelName))
                .ok("Ok"));
        };
        // #endregion

        // #region openDialogConfirmDeleteGroupChannel
        function getTextOpenDialogConfirmDeleteGroupChannel(targetUserName) {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU  Канал" + setSpanText(targetUserName, cssSelectName) + " будет удален  без возможности восстановления  со всей историей, <br> вы действительно хотите удлать канал?");

            } else if (LANG === supLangs.Es) {
                return setSpanText("ES   Канал" + setSpanText(targetUserName, cssSelectName) + " будет удален  без возможности восстановления  со всей историей, <br> вы действительно хотите удлать канал?");
            } else {
                return setSpanText("EN   Канал" + setSpanText(targetUserName, cssSelectName) + " будет удален  без возможности восстановления  со всей историей, <br> вы действительно хотите удлать канал?");
            }
        };

        this.openDialogConfirmDeleteGroupChannel = function ($event, targetChannelName) {
            var confirm = $mdDialog.confirm()
                .ariaLabel(defaultTheme)
                .title("WARN: Delete group channel!")
                .htmlContent(getTextOpenDialogConfirmDeleteGroupChannel(targetChannelName))
                .targetEvent($event)
                .ok("Confirm")
                .cancel("Cancel");
            return $mdDialog.show(confirm);
        };
        // #endregion

        // #region openDialogUnsubscribeFromGroupChannel

        function getTextOpenDialogUnsubscribeFromGroupChannel(targetChannelName) {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU  Вы отписываетесь от канала " + setSpanText(targetChannelName, cssSelectName) + "  и больше не сможете получать сообщения, подтвердить действие?");

            } else if (LANG === supLangs.Es) {
                return setSpanText("ES  Вы отписываетесь от канала " + setSpanText(targetChannelName, cssSelectName) + "  и больше не сможете получать сообщения, подтвердить действие?");
            } else {
                return setSpanText("EN  Вы отписываетесь от канала " + setSpanText(targetChannelName, cssSelectName) + "  и больше не сможете получать сообщения, подтвердить действие?");
            }
        };

        this.openDialogUnsubscribeFromGroupChannel = function ($event, targetChannelName) {
            var confirm = $mdDialog.confirm()
                 .ariaLabel(defaultTheme)
                 .title("Unsubscribe from group channel")
                 .htmlContent(getTextOpenDialogUnsubscribeFromGroupChannel(targetChannelName))
                 .targetEvent($event)
                 .ok("Confirm")
                 .cancel("Cancel");
            return $mdDialog.show(confirm);
        };
        // #endregion

        // #region openDialogChannelMaxLimit
        function getTextOpenDialogChannelMaxLimit(targetChannelTranslateType, maxLimit) {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU  У вас слишком много каналов  в разделе " + setSpanText(targetChannelTranslateType, cssSelectName) + " (" + setSpanText(maxLimit + "/" + maxLimit, cssSelectName) + ") " +
                    "<br> Удалите не используемые каналы и повторите попытку ");

            } else if (LANG === supLangs.Es) {
                return setSpanText("ES  У вас слишком много каналов  в разделе" + setSpanText(targetChannelTranslateType, cssSelectName) + " (" + setSpanText(maxLimit + "/" + maxLimit, cssSelectName) + ") " +
                    "<br> Удалите не используемые каналы и повторите попытку ");
            } else {
                return setSpanText("EN  У вас слишком много каналов в разделе " + setSpanText(targetChannelTranslateType, cssSelectName) + " (" + setSpanText(maxLimit + "/" + maxLimit, cssSelectName) + ") " +
                     "<br> Удалите не используемые каналы и повторите попытку ");
            }
        };

        this.getTextOpenDialogChannelMaxLimit = getTextOpenDialogChannelMaxLimit;
        this.openDialogChannelMaxLimit = function ($event, targetChannelTranslateType, maxLimit) {
            return $mdDialog.show(
                $mdDialog.alert()
                .clickOutsideToClose(true)
                .title("WARN: Channel max limit")
                .targetEvent($event)
                .ariaLabel(defaultTheme)
                .htmlContent(getTextOpenDialogChannelMaxLimit(targetChannelTranslateType, maxLimit))
                .ok("Ok"));
        };
        // #endregion


        // #region openDialogDeepDeleteOtherGroupChannels
        var _textOpenDialogDeepDeleteOtherGroupChannels;
        function getTextOpenDialogDeepDeleteOtherGroupChannels() {
            if (!_textOpenDialogDeepDeleteOtherGroupChannels) {
                _textOpenDialogDeepDeleteOtherGroupChannels = Utils.CreateLangSimple("EN Вы дейстительно хотите провести глубокую очистку и  удалить все подключенные каналы  и связанную с вами информацию?",
                    "ES Вы дейстительно хотите провести глубокую очистку и  удалить все подключенные каналы  и связанную с вами информацию?",
                    "RU Вы дейстительно хотите провести глубокую очистку и  удалить все подключенные каналы  и связанную с вами информацию?");
            }
            return _textOpenDialogDeepDeleteOtherGroupChannels.getCurrent();
        }

        this.openDialogDeepDeleteOtherGroupChannels = function ($event) {
            var confirm = $mdDialog.confirm()
                .ariaLabel(defaultTheme)
                .title("WARN: Deep delete all group channels!")
                .htmlContent(getTextOpenDialogDeepDeleteOtherGroupChannels())
                .targetEvent($event)
                .ok("Confirm")
                .cancel("Cancel");
            return $mdDialog.show(confirm);

        };
        // #endregion

        // #region OpenDialogNotPermitted
        this.openDialogNotPermitted = baseDialogHelper.openDialogNotPermitted;
        // #endregion

    }
]);