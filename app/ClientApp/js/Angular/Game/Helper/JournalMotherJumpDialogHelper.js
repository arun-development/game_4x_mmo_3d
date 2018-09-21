Utils.CoreApp.gameApp.service("journalMotherJumpDialogHelper", ["baseDialogHelper", "maxLenghtConsts",
    function (baseDialogHelper) {
        //todo delete after
        GameServices.$mjdH = this;

        var supLangs = baseDialogHelper.supportedLangs;
        var cssSelectName = baseDialogHelper.cssSelectName;
        var defaultTheme = baseDialogHelper.defaultTheme;
        var $mdDialog = baseDialogHelper.$$mdDialog;
        var setSpanText = baseDialogHelper.setSpanText;

        var motherTitle = "Mothership:";

        // #region MaxLimitSpyItems 

        var jumpErrors = {
            JumpMotherInProgress: "JumpMotherInProgress",
            DataIsOldRepeatRequest: "DataIsOldRepeatRequest",
            NoData: "No data",
            InputDataIncorrect: "Input data incorrect",
            JupmMotherIsCurrentSystem: "JupmMotherIsCurrentSystem"
        };

        var _textJumpMessageIsCurrentSystem;
        function getTextJumpMessageIsCurrentSystem() {
            if (!_textJumpMessageIsCurrentSystem) {
                _textJumpMessageIsCurrentSystem = Utils.CreateLangSimple("You are already in the system", "Ya se encuentra en el sistema", "Вы уже находитесь в этой системе");
            }
            return setSpanText(_textJumpMessageIsCurrentSystem.getCurrent());
        }

        function getTextJumpMotherInProgress(systemName, formatedDelay) {
            if (LANG === supLangs.Ru) {
                return setSpanText("Мазер уже перемещается в систему: " + setSpanText(systemName, cssSelectName) + ". <br/> " +
                    "До завершения прыжка осталось  " + setSpanText(formatedDelay, cssSelectName) + ". <br/>" +
                    "Отмените текущее задание для нового прыжка.");

            } else if (LANG === supLangs.Es) {
                return setSpanText("Mothership se mudó a: " + setSpanText(systemName, cssSelectName) + ". <br/> " +
                    "Tiempo para completar los " + setSpanText(formatedDelay, cssSelectName) + " restantes. <br/>" +
                    "Cancele el salto actual para el nuevo salto.");
            } else {
                return setSpanText("Mothership has moved in: " + setSpanText(systemName, cssSelectName) + " <br/> " +
                    "Remaining to complete the jump  " + setSpanText(formatedDelay, cssSelectName) + ". <br/>" +
                    "Cancel the current jump for the new jump");
            }

        }

        this.openDialogMotherJumpEnter = function (targetSystemName, timeToJump) {
            var msg;
            var confirm = $mdDialog.confirm()
                .ariaLabel(defaultTheme)
                .closeTo({ left: 0 });

            if (LANG === supLangs.Ru) {
                msg = "Целевая система " + targetSystemName;
                confirm
                    .title(msg)
                    .htmlContent(setSpanText("Время до прыжка: " + setSpanText(timeToJump, cssSelectName)))
                    .ok("Прыжок")
                    .cancel("Отмена");

            }
            else if (LANG === supLangs.Es) {
                msg = "Sistema de destino " + targetSystemName;
                confirm
                    .title(msg)
                    .htmlContent(setSpanText("Tiempo para saltar: " + setSpanText(timeToJump, cssSelectName)))
                    .ok("Saltar")
                    .cancel("Cancelar");

            }
            else {
                msg = "Target system " + targetSystemName;
                confirm
                    .title(msg)
                    .htmlContent(setSpanText("Time to jump: " + setSpanText(timeToJump, cssSelectName)))
                    .ok("Jump")
                    .cancel("Cancel");

            }
            return $mdDialog.show(confirm);
        }

        this.openDialogErrorJumpMotherRequest = function (errMessage) {
            return $mdDialog.show(
                   $mdDialog.alert()
                   .title(motherTitle)
                   .ariaLabel(defaultTheme)
                   .clickOutsideToClose(true)
                   .textContent(errMessage)
                   .ok("Ok"));

        }

        this.openDialogErrorJumpMotherInProgress = function (systemName) {
            //todo  посчитать оставшейся время
            var curreentDelay = "00:00:05";
            return $mdDialog.show(
                    $mdDialog.alert()
                    .ariaLabel(defaultTheme)
                     .title(motherTitle)
                    .clickOutsideToClose(true)
                    .htmlContent(getTextJumpMotherInProgress(systemName, curreentDelay))
                    .ok("Ok")
                    //  .targetEvent(ev)
                );
        }

        this.openDialogErrorJupmMotherIsCurrentSystem = function () {
            return $mdDialog.show(
                 $mdDialog.alert()
                 .title(motherTitle)
                .ariaLabel(defaultTheme)
                .clickOutsideToClose(true)
                .htmlContent(getTextJumpMessageIsCurrentSystem())
                .ok("Ok")
            );

        };

        this.openDialogErrorJupmMother = function (msg, systemName) {
            if (msg === jumpErrors.JumpMotherInProgress) return this.openDialogErrorJumpMotherInProgress(systemName);
            else if (msg === jumpErrors.JupmMotherIsCurrentSystem) return this.openDialogErrorJupmMotherIsCurrentSystem();
            else return this.openDialogErrorJumpMotherRequest(msg);
        };

        this.jumpErrors = jumpErrors;


        function getTextOpenDialogMotherJumped(fromSystem, toSystem) {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU Мазер выполнил прыжок из системы : " + setSpanText(fromSystem, cssSelectName) + " в систему " + setSpanText(toSystem, cssSelectName));

            } else if (LANG === supLangs.Es) {
                return setSpanText("ES Мазер выполнил прыжок из системы : " + setSpanText(fromSystem, cssSelectName) + " в систему " + setSpanText(toSystem, cssSelectName));
            } else {
                return setSpanText("EN Мазер выполнил прыжок из системы : " + setSpanText(fromSystem, cssSelectName) + " в систему " + setSpanText(toSystem, cssSelectName));
            }
        }
        this.openDialogMotherJumped = function (fromSystem, toSystem) {
            return $mdDialog.show(
                 $mdDialog.alert()
                .title(motherTitle)
                .ariaLabel(defaultTheme)
                .clickOutsideToClose(true)
                .htmlContent(getTextOpenDialogMotherJumped(fromSystem, toSystem))
                .ok("Ok"));
        }

        function getTextOpenDialogErrorMoterJumpTaskCompleted(targetSystemName) {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU мазер уже выполнил прыжок в систему " + setSpanText(targetSystemName, cssSelectName) + "  и находится в ней");

            } else if (LANG === supLangs.Es) {
                return setSpanText("ES мазер уже выполнил прыжок в систему " + setSpanText(targetSystemName, cssSelectName) + "  и находится в ней");
            } else {
                return setSpanText("EN мазер уже выполнил прыжок в систему " + setSpanText(targetSystemName, cssSelectName) + "  и находится в ней");
            }
        }

        this.openDialogErrorMoterJumpTaskCompleted = function (targetSystemName) {
            return $mdDialog.show(
                $mdDialog.alert()
                .title(motherTitle)
                .ariaLabel(defaultTheme)
                .clickOutsideToClose(true)
                .htmlContent(getTextOpenDialogErrorMoterJumpTaskCompleted(targetSystemName))
                .ok("Ok"));
        };

        function getTextOpenDialogBuyInstMotherJump(fromSystem, toSystem, ccPrice) {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU Запросить у конфедерации  моментальное перемещение из системы " + setSpanText(fromSystem, cssSelectName) + " в систему " + setSpanText(toSystem, cssSelectName) + " за " + setSpanText(ccPrice, cssSelectName) + "CC ");

            } else if (LANG === supLangs.Es) {
                return setSpanText("ES Запросить у конфедерации  моментальное перемещение из системы " + setSpanText(fromSystem, cssSelectName) + " в систему " + setSpanText(toSystem, cssSelectName) + " за " + setSpanText(ccPrice, cssSelectName) + "CC ?");
            } else {
                return setSpanText("EN Запросить у конфедерации  моментальное перемещение из системы " + setSpanText(fromSystem, cssSelectName) + " в систему " + setSpanText(toSystem, cssSelectName) + " за " + setSpanText(ccPrice, cssSelectName) + "CC ?");
            }
        }

        this.openDialogBuyInstMotherJump = function (fromSystem, toSystem, ccPrice, $event) {
            var confirm = $mdDialog.confirm()
               .ariaLabel(defaultTheme)
               .title(motherTitle)
               .htmlContent(getTextOpenDialogBuyInstMotherJump(fromSystem, toSystem, ccPrice))
               .targetEvent($event)
               .ok("Confirm")
              .cancel("Cancel");
            return $mdDialog.show(confirm);
        }


        // #endregion


    }
]);