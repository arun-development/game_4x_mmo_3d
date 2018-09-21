Utils.CoreApp.gameApp.service("baseDialogHelper", ["$mdDialog",
    function ($mdDialog) {
        var $self = this;
        var supLangs = $self.supportedLangs = Utils.SupportedLangs();
        var cssSelectName = $self.cssSelectName = " unique-name ";
        var defaultTheme = $self.defaultTheme = "default-dialog";   
        this.$$mdDialog = $mdDialog;
        
        var setSpanText = this.setSpanText = function (data, cssClass) {
            return Utils.SetSpanText(data, cssClass);
        };

        // #region OpenDialogNotPermitted
        var _textOpenDialogNotPermitted; 
        function getTextOpenDialogNotPermitted() {
            if (!_textOpenDialogNotPermitted) {
                _textOpenDialogNotPermitted = Utils.CreateLangSimple("EN У вас недостаточно прав для совержения этого действия",
                    "ES У вас недостаточно прав для совержения этого действия",
                    "RU У вас недостаточно прав для совержения этого действия");
            }
            return setSpanText(_textOpenDialogNotPermitted.getCurrent());
        }

        var _titleOpenDialogNotPermitted;

        function getTitleOpenDialogNotPermitted() {
            if (!_titleOpenDialogNotPermitted) {
                _titleOpenDialogNotPermitted = Utils.CreateLangSimple("EN Not permitted",
                    "ES Not permitted",
                    "RU Not permitted");
            }
            return _titleOpenDialogNotPermitted.getCurrent();
        }

        this.openDialogNotPermitted = function($event) {
            return $mdDialog.show(
                $mdDialog.alert()
                .title(getTitleOpenDialogNotPermitted())
                .targetEvent($event)
                .htmlContent(getTextOpenDialogNotPermitted())
                .ariaLabel(defaultTheme)
                .clickOutsideToClose(true)
                .ok("Ok!"));

        };

        function getTextErrorOverMaxLength(currentMessageLenght,maxLenght) {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU Максимальная длинна сообщения не может превышать " + setSpanText(maxLenght, cssSelectName) + " символов. <br> Текущая длинна сообщения составляет " + setSpanText(currentMessageLenght, cssSelectName) + " символов");
            }
            else if (LANG === supLangs.Es) {
                return setSpanText("ES  Максимальная длинна сообщения не может превышать " + setSpanText(maxLenght, cssSelectName) + " символов.<br> Текущая длинна сообщения составляет " + setSpanText(currentMessageLenght, cssSelectName) + " символов");
            }
            else {
                return setSpanText("EN  Максимальная длинна сообщения не может превышать " + setSpanText(maxLenght, cssSelectName) + " символов. <br> Текущая длинна сообщения составляет " + setSpanText(currentMessageLenght, cssSelectName) + " символов");
            }
        }

        this.errorOverMaxLength = function ($event, currentMessageLenght,maxLenght) {
          return $mdDialog.show(
              $mdDialog.alert()
              .title("Error")
              .targetEvent($event)
              .htmlContent(getTextErrorOverMaxLength(currentMessageLenght, maxLenght))
              .ariaLabel(defaultTheme)
              .clickOutsideToClose(true)
              .ok("Ok!"));
        }

        var _titleImportant;
        this.titleImportant = function () {
            if (!_titleImportant) {
                _titleImportant = Utils.CreateLangSimple("Attention : important message!",
                    "¡Atención : mensaje importante!",
                    "Внимание : Важное сообщение!");
            }
            return _titleImportant.getCurrent();
        }

        // #endregion

    }
]);