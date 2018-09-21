(function (module) {
    "use strict";
    module.controller("adminInitializeCtrl", ["$scope", "adminInitializeService", "$mdSidenav", "$timeout", function ($scope, adminInitializeService, $mdSidenav, $timeout) {
        var $self = this;
        this.actionHistory = [];
        this.toggleLeft = function () {
            $mdSidenav("left").toggle();
        };
        this.tabs = adminInitializeService.getOrCreateTabs();
        this.activateInProgress = false;
        this.activate = function ($event, item) {
            $self.activateInProgress = true;
            var startTime = Date.now();
            adminInitializeService.activate($event, item, function (isError, answer, isCancel) {
                if (isCancel) {
                    $self.activateInProgress = false;
                    return;
                }

                var hasError = isError;
                var time = Date.now();
                var logItem = {
                    name: item.Name,
                    time: time,
                    delay: time - startTime,
                    sucsess: !hasError
                };   
                if (hasError) {
                    console.log(item.Name + "__tId:" + logItem.time, {
                        errorAnswer: answer,
                        logItem: logItem,
                        item: item,
                        " $self.actionHistory": $self.actionHistory
                    });
                }
                $self.actionHistory.unshift(logItem);
                $self.activateInProgress = false;
            });

        };
        this.vars = adminInitializeService.getVars();
        this.refresh = adminInitializeService.refreshAppVars;
        this.goToGame = function() {  
            window.open(Utils.GetUrl("game"), "_blank");
        };
        $scope.$on("appVarsSerivce:update",
                     function (e, t) {
                         $timeout(function () {
                             $self.vars = adminInitializeService.getVars(t.appVars);
                         });       
                     });

    }]);

    module.service("adminInitializeService", ["$mdDialog", "$q", "appVarsSerivce", function ($mdDialog, $q, appVarsSerivce) {
        var $self = this;
        this.$tabs = null;


        this.getVars = function (daraVars) {
            var v = daraVars || appVarsSerivce.getVars();
            var vars = [];
            _.forEach(v, function (value, key) {
                vars.push(Utils.ModelFactory.KeyVal(key, value));
            });
            console.log("vars", { vars: vars, v: v });
            return this._vars = vars;

        };
        //    appVarsSerivce.update(newVars).getVars();

        function ITabItem(tabLabel, bodyData, tabDescription) {
            this.TabId = Utils.Guid.CreateGuid();
            this.LabelData = tabLabel;
            this.BodyData = bodyData;
            this.HasTabDescription = !!tabDescription;
            this.TabDescription = tabDescription;
        };

        function _notifyServerNotPermittedAction(onComplete) {
            //todo  not implemented
            onComplete({ notPermitted: "need add to log" });
        }


        this.refreshAppVars = function () {
            $.ajax({
                url: "/api/MainInitializer/refreshAppData/",
                method: "POST",
                type: "json",
                headers: Utils.XSRF.HeadersGetApiTokenObj()
            }).then(function (answer) {
                appVarsSerivce.update(answer);

            },
                function (errorAnswer) {
                    console.log("refreshAppVars : error",
                        {
                            errorAnswer: errorAnswer
                        });
                });
        };

        this.activate = function ($event, item, onComplete) {
            var deferred = $q.defer();    
 
            if (item.$canBeRunRemoute || window.location.hostname === "localhost") {
                var confirm = $mdDialog.confirm()
                              .ariaLabel("ariaLabel")
                              .title("Confirm")
                              .htmlContent("Вы активируете действие <b class=warn>" + item.Name + "</b> контроллера <b class=warn>" + item.ControllerName + "</b><br> Подтвердить?")
                              .ok("Confirm")
                              .cancel("Cancel")
                              .targetEvent($event);

                $mdDialog.show(confirm).then(function () {
                    //confirm
                    $.ajax({
                        url: item.$url,
                        method: "POST",
                        type: "json",
                        headers: Utils.XSRF.HeadersGetApiTokenObj(),
                        data: item.$params
                    }).then(deferred.resolve, deferred.reject);

                }, function () {
                    deferred.reject("cancel");
                });

            }
            else {
                deferred.reject("!isLocalHost");
            }

            deferred.promise.then(function (answer) {
                if (answer && typeof answer === "object" && answer.hasOwnProperty("CacheInitialized")) {
                    console.log("answer", { answer: answer });
                    appVarsSerivce.update(answer);
                }

                onComplete(false, answer);
            }, function (errorAnswer) {
                if (errorAnswer === "!isLocalHost") {
                    _notifyServerNotPermittedAction(function (otherAnswer) {
                        onComplete(true, otherAnswer);
                    });
                }
                else if (errorAnswer === "cancel") {
                    onComplete(null, null, true);
                    return;
                }
                else {

                    $mdDialog.show(
                      $mdDialog.alert()
                      .title("GG - ERROR")
                      .targetEvent($event)
                      .htmlContent("<h3 class=warn><b>Поздравляю! Вы создали ошибку!</b></h3>" +
                          "<p>Открывайте консоль(F12)  и ищите дополнительную информацию о ошибке<br>" +
                          "Открывайте солюшен, и идите в метод <b class=warn>/app/Api/InicializeData/" + item.ControllerName + "Controller.cs</b><br>" +
                          "найдите там метод <b class=warn>" + item.Name + "</b>, " +
                          "eсли не найдете - посмотрите в базовом классе (<b class=warn>/app/Api/InitApiController.cs</b>).<br> " +
                          "Переходите в глубь сервисов (CTRL+LMC по имени метода или сервиса)<br>" +
                          "чтобы выяснить какие части были затронуты.<br>" +
                          "Определите какие были использованны таблицы данных, и проверьте их содержимое <br>" +
                          "в обозревателе обектов sql server (ВИД=>обозреватель объектов SQL SERVER) <br>" +
                          "=> server=> Базы данных=>  база данных к которой подключенны итп... </p>")
                      .ariaLabel(" ")
                      .clickOutsideToClose(true)
                      .ok("Ok!"));

                    onComplete(true, errorAnswer);
                }

            });
        };



        function IBodyItemData(name, description, controllerName, params,canBeRunRemoute) {
            this.Name = name;
            this.Description = description;
            this.ViewName = _.kebabCase(name);
            this.ControllerName = controllerName;
            this.$url = "/api/" + controllerName + "/" + name + "/";
            this.$params = params;
            this.$canBeRunRemoute = !!canBeRunRemoute;
        }
                      
        function _initApiTest(ctrlName, canBeRunRemoute) {
            return new IBodyItemData("InitApiTest", "Подтверждает что соединиение установленно, зависимости проинициализированны ," +
                " и можно запускать основной метод котроллера в случае успеха вернет <b class=warn>'Ok'</b>",
                ctrlName, null, canBeRunRemoute);
        }


        function createEventRunner(instance) {
            var ctrlName = "MainInitializer";
            instance.push(new ITabItem({ Name: "Event-Runner" }, [_initApiTest(ctrlName,true),
              new IBodyItemData("Start", "Создает и запускает сервис кешей приложения, фоновые задачи наблюдения и  синхронизации", ctrlName,null,true),
             new IBodyItemData("Stop", "Останавливает синхронизаторы и очищает кеши приложения", ctrlName, null, true),
             new IBodyItemData("StartDemons", "Запускает задачи синхронизации на сервере", ctrlName, null, true),
             new IBodyItemData("StopDemons", "Останавливает синхронизацию", ctrlName, null, true),
            ],
                "Методы этого раздела обеспечивают запуск и остановку приложения, перед заходом в раздел гейм необходимо инициализировать службу отсюда"));
        }

        function createMainInitializerTabs(instance) {
            var ctrlName = "MainInitializer";
            instance.push(new ITabItem({ Name: "Main-Initializer" }, [
                  _initApiTest(ctrlName),
                new IBodyItemData("DeleteAll", "Метод полностью удаляет всю информацию связанную c игровым миром и пользователем. <br>" +
                    "Используется для перегенерации мира. <br>" +
                    " Удаляет пользователей - в том числе нпс, все модули альянса, весь игровой мир <br>" +
                    " (галлактики,сектора, звезды, планеты, луны, и соотв весь прогресс пользователя),<br>" +
                    " модуль офицеров,<br>" +
                    " игровых сообшений и вообще всего что связанно с игрой. Очистка производится как в базе данных так и локальных кешах",
                    ctrlName),
               new IBodyItemData("CreateAll", "Метод генерации игрового мира и базового оружения, создает мир, модификаторы, имена игровых объектов, базовые типы планет звезд и пр,  базовые роли, НПС <br>  " +
                   "перед запуском необходим запуск метода  <b>'DeleteAll'</b>",
                    ctrlName),
               new IBodyItemData("CreateMainRoles", "Создает корневые роли для всего приложения, такие как user, admin, guest, и пр. " +
                       "Для верной работы, требует предварительной очистки приложения от связанных данных",
                    ctrlName),
               new IBodyItemData("CreateFakeAuthUsers", "Создает ботов пользователей, боты не являются авторизированными пользователями - только игровыми, из под учетнойзаписи бота войти в игру нельзя.",
                    ctrlName),
               new IBodyItemData("DeleteFakeUsers", "Находит всех созданных ботов среди юзеров и удаляет все связанные с ними данные",
                    ctrlName),
               new IBodyItemData("AddUserToRole", "Назначает переданному пользователю  переданную корневую роль, требуемые аргументы  AuthId, имя создаваемой роли.<br>" +
                         "<b class=warn>Примечание: todo - сделать форму передачи аргументов</b>",
                    ctrlName)
            ], "Это самые основые команды для приложения. Их использование всегда влечет за собой полную перестройку приложения."));
        }
        function createAllianceInitializer(instance) {
            var ctrlName = "AllianceG";
            instance.push(new ITabItem({
                Name: "Alliance-Initializer"
            },
               [
                  _initApiTest(ctrlName),
                   new IBodyItemData("Init", "Действие не имеет четкого определения и  изменяет свое назначение в зависимости от текущих требований, " +
                       "возможные действия необходимо раскоментить в этом методе, перекомпелировать приложение и запустить. Действе по умолчанию <b>DeleteAll</b>",
                       ctrlName),
                   new IBodyItemData("CreateAllianceRating",
                       "Тестовый метод для заполнения поля ПВП в информации о альянсе." +
                       " Делает выбрку по существующим альянсам,  получает всех активных пользователей альянса, и считывает их пвп очки," +
                       "  просумировав ПВП записывает данные в информацию о альянсе.",
                       ctrlName),
                   new IBodyItemData("AddUserRole",
                       "Тестовый метод для базовой генерации ролей. Получает всех пользователей всех альянсов, " +
                       " упорядочивает их по UserId,  первым 10 пользователя назначает роль Creator(1)  остальным Recrut(2).<br>" +
                       "<b class=warn>Не ркомендуется запускать без  явной необходимости.</b><br>" +
                       " В обыном порядке роли создаются сами, при создании альянса или добавлении пользователя к альянсу. То же касается и фейк альянсов.",
                       ctrlName),
                   new IBodyItemData("SetUserPlanet",
                        "Тестовый метод Устанавливает всем планетам какой то альянс для связывания," +
                        " после - планета принаджедит пользователю и альянсу.",
                       ctrlName),
                   new IBodyItemData("DeleteAll",
                        "Удаляет все альянсы, включае нпс, метоед неободим для перегенерации мира. <br>" +
                        "<b class=warn>Ручтоной вызов метода не рекомендуется</b> (за его вызов отвечает отдельный модуль - <b class=warn>'MAIN-INITIALIZER.DeleteAll'</b>, " +
                        "который  осуществляет вызов в нужной последовательности) ",

                       ctrlName)], "Изначально методы этой группы создавались для переинциализации модуля альянса, " +
                       "но с ростом приложения и связей   стала очевидна  невозможность их использования без перинициалтзации  юзера, мира и других модулей." +
                       " Тем не менее в некторых случаях, при определенной подготовке исходного кода, их можно использвоать"));
        }
        function createMapInitializer(instance) {
            var ctrlName = "MapG";
            instance.push(new ITabItem({ Name: "Map-Initializer" }, [
                    _initApiTest(ctrlName),
                new IBodyItemData("Init", "action Description", ctrlName),
                new IBodyItemData("CreateAll", "action Description", ctrlName),
                new IBodyItemData("DeleteAll", "action Description", ctrlName),
                new IBodyItemData("CreateMoon", "action Description", ctrlName),
                new IBodyItemData("UpdateSectorsToArchForm", "action Description", ctrlName),
                new IBodyItemData("UpdateStarEnergyBonus", "action Description", ctrlName),
                new IBodyItemData("CreateSectors", "action Description", ctrlName),
                new IBodyItemData("CreateSystemGeometry", "action Description", ctrlName),
            ],
                "Методы этой группы отсносятся к игровому миру и  являются вспомогательными," +
                " по большей части они предназначены для проверки запуска самой генерации, или фиксации данных после генерации, " +
                "для корректной проверки восновном требуется предварительная очитка всего приложения."));
        }
        function createUserInitializerTabs(instance) {
            var ctrlName = "UsersG";

            instance.push(new ITabItem({ Name: "User-Initializer" }, [
                 _initApiTest(ctrlName),
                new IBodyItemData("Init", "action Description", ctrlName),
                new IBodyItemData("CreateMainRoles", "action Description", ctrlName),
                new IBodyItemData("GenerateFakeAuthUsers", "action Description", ctrlName),
                new IBodyItemData("UpdateSecurityStamp", "action Description", ctrlName),
                new IBodyItemData("UpdateAllUsersRating", "action Description", ctrlName),
                new IBodyItemData("GroupInitizlize", "action Description", ctrlName),
                new IBodyItemData("UpdateUserImg", "action Description", ctrlName),
                new IBodyItemData("DeleteAll", "action Description", ctrlName)
            ], "Базовые методы с данными пользователя"));
        }



        this.getOrCreateTabs = function () {
            if (!$self.$tabs) {
                var data = [];
                createEventRunner(data);
                createMainInitializerTabs(data);
                createAllianceInitializer(data);
                createMapInitializer(data);
                createUserInitializerTabs(data);

                return {
                    selectedIndex: 0,
                    data: data
                };


            }
            return $self.$tabs;
        };
    }]);
})(Utils.CoreApp.adminApp);