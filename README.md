## 4X MMO 3D космическая стратегия
> Данное приложение является демо версией многопользовательской игры - клиент серверного приложения на базе фреймворка .Net Core 2.0
с использованием языков: c#, js, sql, tsql, html, css/scss

# немножко графики для представления
![galaxy](game_screenshots/galaxy.png?raw=true "galaxy")
![mother 1](game_screenshots/mother_1.png?raw=true "mother 1")
![mother 2](game_screenshots/mother_2.png?raw=true "mother 2")
![star g type](game_screenshots/star.png?raw=true "star g type")
![particle with animation, saturn ring](game_screenshots/saturn_ring.png?raw=true "particle with animation, saturn ring")
![palnet base earth type 1](game_screenshots/base_1.png?raw=true "palnet base earth type 1")
![palnet base earth type 2](game_screenshots/base_2.png?raw=true "palnet base earth type 2")



## Предыстория публикации
Меня часто спрашивают, где вы учились? С чем вы работали? Какой опыт имеете? Есть ли у вас ссылки на рабочие проекты или части ваших решений...
И мне не так легко ответить, вы ведь понимаете, о чем я, верно? Проекты развиваются, бывают открытыми или закрытым, простыми и сложными.
Когда задают подобные вопросы спрашивающий хочет получить только один ответ - рабочий пример по которому можно судить о разработчике.

Есть и другой тип вопросов, а как это сделать? а много ли нужно знать, есть у меня идея вот не знаю стоит ли начинать...
И мне кажется, что в общих чертах этот репозиторий отвечает на поставленные вопросы, хотя, наверное, не совсем в том формате...


По различным причинам я долго не хотел открывать доступ к этому проекту, а именно
+ Проект достаточно большой для одного человека, у этого есть последствия, которые все трактуют по-разному 
+ За 3 года его создания мне приходилось почти под ноль 5 раз переписывать исходники 
  * от jq mvc ef и спрайтов для основного графического контента (такова была основная идея)
  + он стал полноценной игрой с поддержкой:
    + 3d окружения (babylonjs/canvas/particles/shaders/etc) 
    + ангуляра как центрального узла для всех взаимодействий приложения   
    + непрерывный обмен сообщениями между сервером и клиентом (signalr/ws(webSoket))
    + даппера  (dapper)  и процедурного кода для оптимизации  bd (t-sql/sql) 
    + служб азуры для хранения и использования общего пользовательского  контента,  мониторинга и аналитики, бекапа, работы с демонами (webjobs), непрерывной поставки кода и прочими вкусностями
    + third party authorization
    + множество игровых модулей вроде выбора президента галактики, внутреннего мессенджера, системы перевода пользовательских сообщений yandex.translate
    + всестороннего кэширования:
      +  На клиенте - in memory, indexdb, localstorage. 
      +  На сервере на базе ConcurrentDictionary. (redis проиграл по скорости и гибкости использования).
      +  В базе данных формируются специальные исторические таблицы, таблицы с сформированными значениями на основе данных из других таблиц и прочее...
      +  Поисковые кэши для поиска высокочастотного типа данных
  + Тем не менее проект все еще нужно дорабатывать и окружать дополнительными службами, сервисами и тестами. А также нуждается в дополнительном графическом контенте (во многих местах стоят заглушки)
+ Я долгое время пытался прийти к соглашению с автором идеи и найти компромиссное решение. 
+ Этот проект результат огромных усилий, упорства и времени с моей стороны. Было только 2 состояния сон и работа. Таким не просто поделиться, а если делишься хочется быть уверенным в том, что что оно того стоит. Возможно, у этого проекта есть лучшие решения, подходы, технологии и... будущее. Я показываю, как это получилось сделать у меня. Возможно, именно вы поможете сделать его лучше, или проанализировав проект решите, что вам нужен такой человек в команде, или просто узнаете что-то новое, и когда ни будь так же поделитесь своим опытом.

> Весь исходный код принадлежит его автору, использование кода в проектах без согласования с автором является нарушением авторских прав 
> Данный код предоставляется строго в ознакомительных или исследовательских целях чтобы лучше увидите на живом примере:
+ Использование web gl api Babylon js
+ Angular 1.X приложение и связывание его с другими службами и библиотеками
+ Использование сокеты и библиотеку Signalr
+ Динамичную загрузку данных, постройка и обновление объектов сцены в  canvas

+ Использование Dependency injection в .Net Core 2.0
+ Использование Dapper при работе с базой данных в среде .NET Core
+ Создание своих велосипедов в погоне за скоростью доступа к данным для построения системы кэширования
+ Использование связанных таблицы базы данных, процедур, триггеров, каскадных операций
+ Использование нескольких баз данных в приложении, и связывание данных с учетом ограничений Azure sql
+ Пример реализации локализации для всех узлов приложения 
+ Использование generic Type и как это помогает сделать классы более гибкими с выделенным общим функционалом и как это добавляет головной боли. Самые яркие примеры в  Generic Repository, Generic Cache
+ Использование внешних служб Azure  в приложении .Net Такие как WindowsAzure.Storage, Microsoft.Azure.WebJobs,  app,  (хотя без подключения этих служб это не очевидно)
+ API, MVC, HUB с минимальным повторением кода (используем сервисы)
+ Используем классы Task, Task\<T\>, Lock оператор
+ App авторизация + авторизация через внешние источники (googl,ms, fb, vc etc)
+ Службу демонов для непрерывного обновления динамичных данных, (пересчёт ресурсов, нотификация и обновление, обслуживание онлайн и офлайн пользователей)
+ Пример реализации математического боя.

 
## Внимание!
Данный код зависит от ряда компонентов, и для корректный работы требует наличия и установки соответствующих параметров для них
+ Строка подключения к авторотационной базе данных (обязательно - по умолчанию смотрит в локал)
+ Строка подключения к рабочей базе данных (обязательно - по умолчанию смотрит в локал)
+ Установка рут пользователя, и других системных пользователей. (обязательно -берется из  секретов пользователя)
+ Строка подключения к службе SendGreed (необязательно - не будет работать оповещение и подтверждение по мейлу)
+ Строка подключения к службе WindowsAzure.Storage (необязательно часть сервисов перестанет работать, но основной функционал останется)
+ Для подключения внешних источников авторизации соответствующие данные для приложения из  FB VK  итп (или без них)

## Перед началом работы
+ Установите Visual Studio 2017+ c поддержкой  sql  express 
+ Перейдите на ветку "dev"
+ выгрузите проект "app"  найдите и закомментируйте строку "\<UserSecretsId>655b1111-2b8b-42c8-b4d3-262b36c14fa8</UserSecretsId\>" если такая есть 
+ перегрузите проект "app" и в контекстном меню  "app"  выберите "Управление секретами пользователя" откроется файл секрета
+ Зайдите в app/appsettings.json там находятся примеры необходимых секретов и строки подключения к локальным базам
+ Заполните свои секреты в соответствии с [форматом](#Secrets) своими данными
+ Для начала необходимо установить секцию "MainUsers" данные из нее будут использованы при генерации базы данных авторизации
> когда будите заполнять данные устанавливайте сложные пароли 8 символов 1 цифра верхний и нижний регистр, 1 специальный символ

> По меньшей мере нужно указать 3 пользователя для ролей admin, dev, user в этом порядке, 
остальные пользователи из секретов будут сохранены в приложение, но в базу записаны не будут

+ Запустите приложение и убедитесь в том, что оно работает. В обозревателе sql у вас появится новая база данных HomeAuthTest с установленными пользователями и ролями. 

> Значение имени базы данных берется исходя из типа установленного подключения
для изменения ключа к строке подключения обратите внимание на метод _setConnectionNames(bool useLocal) класса StartAppRunner.cs

> Не запускайте методов, на которые вы не установили секретов, например не используйте гугл авторизацию если не установлены данные Гугл апи, 
или восстановление пароля если не добавлены данные SendGreed (вы можете использовать другую службу изменив параметры конфигурации)

 

+ Для базы данных игры разверните базу из бек апа, используйте файл Server/DataLayer/Infrastructure/PrGame.V.0.8.5.cleaned.ready_to_init.dacpac
> Откройте обозреватель объектов SQL Server => узел "SQL Server" => "(localdb)\MSSQLLocalDb... 
=> Базы данных, контекстное меню выбрать => "Публикация приложения уровня данных..." Выберите путь к файлу "PrGame.V.0.8.5.cleaned.ready_to_init.dacpac"  
назовите базу - "PrGame.V.0.8.5" => "опубликовать" (в строке подключения по ключу "HomeDev" в качестве имени будет указанно именно "PrGame.V.0.8.5")
 
+ Не переписывайте файл PrGame.V.0.8.5.cleaned.ready_to_init.dacpac, это основная точка возврата. Не используйте другие бек апы, их схемы и структуры данных могут не соответствовать логике приложения.
+ Шаблон изменений для вeрсий файлов дабма bd {release}.{change_shema}.{?change proc/securyty/index etc}.{?note}

+ Перейдите в браузере по пути (вы можете изменить порт)  https://localhost:44396/game 
+ Вы получите редирект на авторизацию https://localhost:44396/ru/Account/Login?ReturnUrl=%2Fgame
+ Залогиньтесь под админской учётной записью которую вы добавили первой в секретах
+ Поскольку это первый запуск приложения, у вас роль админа, а данные мира еще не сгенерированы вас должно перенаправить сюда https://localhost:44396/AdminInitialize/Index
+ Пересоздайте мир
+ Перейдите на вкладку "Main-Initializer" и запустите метод   "Run (create-all)», затем перейдите в раздел "EVENT-RUNNER"  и запустите "Run (start)" 
> + вы можете изменить количество секторов, а как следствие систем в Server/Services/InitializeService/MapGInitializer.Create.cs в методе CreateSectors переменная sectorCounts

> После каждой генерации не забывайте очищать localstorage иначе при клике на систему из сектора вы приварпаете в пустоту
+ После генерации базы данных, при повторном запуске приложения в VS кэши будут пустыми, вас так же редиректнет на эту страницу
+ Перейдите во вкладку "EVENT-RUNNER"  и запустите "Run (start)" 
> На пограничных условиях в пятницу начинается голосование и в воскресение оканчивается, 
 при имеющейся инициализации данных по модулю голосования, но при простое приложения до следующей недели может возникнуть ошибка на которой стоит throw приложение крэшнется до разрешения конфликта.

> Вы можете отключить обработку оффлайн пользователей  "EVENT-RUNNER" => "Run (StopDemons)", или включить StartDemons,  для ресета кэша используйте методы Stop/Start
> Все остальные методы в админке стоит использовать с осторожностью, читайте их описание и проверяйте какой код они вызывают
> В случае непонятной ошибки самый быстрый способ восстановить работоспособность пересоздать мир (MainInitializer => DeleteAll=> CreateAll)

+ После Успешной проверки закомитьте все изменения в ветке dev. сделайте свою почку от dev  и делайте там все что угодно. (стандартный git workflow  подход)

## <a name="Secrets"> Секреты
```
/*use user secrets for that section
example format in secrets*/
secrets.json => {
  /*that section with your data
  order: admin, developer, user
  admin -full access
  dev - full  except few pages
  user - only for game and shop access */
  all users start from 1000 id, lower values reserved for npc*/
    "MainUsers": [
    //admin
    {
        "UserName": "Arun", // max len =14
        "AuthUserId": "dd21f598-8b59-4342-983a-c438f57e9877", // GUID for example                     
        "Password": "MakeMeStrong@12", //real strong password
        "UserEmail": "pashtet44@yandex.ru", //real email
        "GameUserId": 1000
    },
    // it is second user with role developer
    {
        "UserName": "TextureUser",
        "AuthUserId": "",//GUID
        "Password": "MakeMeStrong@1", //strong password
        "UserEmail": "textureSkagry@gmai.com", //any email
        "GameUserId": 1001
    },
    // it is third user with role user
    {
        "UserName": "Demo",
        "AuthUserId": "",//GUID
        "Password": "MakeMeStrong@1234", //strong password
        "UserEmail": "demo@yandex.ru", //any email
        "GameUserId": 1002
    }
    ],
    // for using third party services use that format use it in secrets section
    "AuthMessageSenderOptions": {
    "TwilioSMSAccountIdentification": "",
    "TwilioSMSAccountPassword": "",
    "TwilioSMSAccountFromPhoneNumber": "",
    "SendGridKey": "SG.-jEH.....",
    "FacebookSecret": "",
    "FacebookAppId": "",//number
    "GoogleClientId": ".......apps.googleusercontent.com",
    "GoogleClientSecret": "",
    "MicrosoftClientId": "",//GUID
    "MicrosoftSecret": "",
    "VKAppId": "",//number
    "VKSecret": ""
    },
    /* for more information about azure storage section 
    see example code in 
    server/StartAppRunner.impl.cs      private void ConfigureStaticClases(IServiceCollection services)*/ 
   "AzureLogCdnUrl": "https://skagrylogerrors.blob.core.windows.net/"
}
```

# Создатели проекта
#### Автор идеи, организатор, спонсор
+ Nick: "Wolfas"

#### Программист, архитектор, продюсер и автор всех частей исходного кода - клиент, сервер, db (js/css/html,c#, sql)
+ Nick: "Arun"
+ Name: "Lezhenin Pavel 1987 Moscow, Russia"
+ Mail: <pashtrt44@yandex.ru>
+ SkypeId: "lirusss1"
+ [moikrug](https://moikrug.ru/plezhenin)
+ [VK](https://vk.com/id16020545)
+ [github](https://github.com/arun-development)

#### Текстурирование, моделинг, векторная графика
+ Name: "Шеногин Олег Алексеевич"
+ SkypeId: "oleg_sportsmen"
+ [sketchfab](https://sketchfab.com/oleg.3001)

#### Первая модель мазера и базы
+ Name: "Ярослав Соколов"
+ SkypeId: "sokolovyara"
 
#### Помощь и поддержка
+ Nick: "rvasiliy"
+ Name: "Репкин Василий Григорьевич"
+ Mail: <vasiliy-mobile@yandex.ru>
+ [github](https://github.com/rvasiliy)
 
#### Композитор
+ Name: "Влад Витвицкий"
+ [VK](https://vk.com/ludvighcomposer)
+ [soundcloud](https://soundcloud.com/ludvigh2009)
+ Треки проекта так же доступны [тут](https://soundcloud.com/ludvigh2009/sets/universe-of-skagry)
+ ---бэкграунд завис в неопределенном состоянии поэтому просто лежит тут в wwwroot\content\audio\game\background\
+ ---системные звуки были собраны мной в интернете, и будут удалены мной из репозитория по первому требованию правообладателя

#### космичесикй скайбокс и галактика
+ Имя утеряно, свяжитесь со мной для добавления









