using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Server.Core.Images;
using Server.Core.Infrastructure;
using Server.Core.Interfaces;
using Server.Core.Interfaces.Confederation;
using Server.Core.Interfaces.UserServices;
using Server.Core.Interfaces.World;
using Server.Core.Npc;
using Server.DataLayer;
using Server.DataLayer.LocalStorageCaches;
using Server.DataLayer.Repositories;
using Server.Infrastructure;
using Server.Modules.Localize;
using Server.Services;
using Server.Services.AdvancedService;
using Server.Services.Confederation;
using Server.Services.Demons;
using Server.Services.Demons.Runners;
using Server.Services.GameObjects.BuildModel;
using Server.Services.GameObjects.BuildModel.BuildItem;
using Server.Services.GameObjects.BuildModel.CollectionBuild;
using Server.Services.GameObjects.UnitClasses;
using Server.Services.InitializeService;
using Server.Services.UserService;
using Server.Services.WorldService;
using Server.ServicesConnected.Auth.Data;
using Server.ServicesConnected.Auth.Extensions;
using Server.ServicesConnected.Auth.Models;
using Server.ServicesConnected.Auth.Services;
using Server.ServicesConnected.AzureStorageServices;
using Server.ServicesConnected.AzureStorageServices.ImageService;
using Server.ServicesConnected.AzureStorageServices.LogService;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Binder;
using Server.Services.NpcArea;

namespace Server
{
    public partial class StartAppRunner
    {
        private void ConfigureStaticClases(IServiceCollection services)
        {
            //main users

            //email test sender method
            if (!_isDevelopment)
            {
                throw new NotImplementedException("ConfigureStaticClases:Check you secrets, configure it and uncommit that row wen all be ready");
            }

            // get user data from your secrets  

            EmailSenderExtensions.EmailForTesting = Configuration.GetSection("EmailSenderEmailForTesting").Value;



            #region Azure storages and  services
            /* throw error because need exist storages, now all storages did removed. that code only for example
               if you create different azure storage name and run client side with use cdn parameters, 
               check cdn name in client side, that name using for building path to model and textures
            */
            var storages = new Dictionary<AzureStorageConnectionType, AzureStorageConnectionConfigurationModel>();
            storages.Add(AzureStorageConnectionType.SkagryUserImages, new AzureStorageConnectionConfigurationModel
            {
                AccountKeyValue = "Oaa3AzRtkI8ecJTiPdMLFY2bKG+lXCSKMf8w7ef6i729vMbu6WbLGKcL9AU4lw2CTirXYnYsVith8ZMw3n6n7g==",
                AccountName = "skagryuserimages",
                Type = AzureStorageConnectionType.SkagryUserImages
            });
            storages.Add(AzureStorageConnectionType.EternPlayPublic, new AzureStorageConnectionConfigurationModel
            {
                AccountKeyValue = "b8CSupsGRgX6f04zr++zZxgPh2zbrODckVh7eIuGne9bB6bjVOcTl9anQ+FN7GZwtDlePc5DYKRI/fQbBOHfHQ==",
                AccountName = "eternplaypublic",
                Type = AzureStorageConnectionType.EternPlayPublic
            });
            storages.Add(AzureStorageConnectionType.SkagryLogErrors, new AzureStorageConnectionConfigurationModel
            {
                AccountKeyValue = "2pf69mSxhrSvk/99msSDrImiQVoOpZzz+uA6fu/iOp8e7TvxqsHhAFDUyr6P4vMeCMV6ZPyJtUnXHhspUOHv7g==",
                AccountName = "skagrylogerrors",
                Type = AzureStorageConnectionType.SkagryLogErrors
            });
            AzureStorageConnectionNames.ConfigureAzureStorageConnections(storages);

            AzureLogCdnData.ConfigureAzureLogCdnData(Configuration.GetSection("AzureLogCdnUrl").Value);

            //falset config to local version
            Label.ConfigureLabel(false);
            Avatar.ConfigureAvatar(false);
            #endregion


            #region Configure MainUserRepository
            // todo if users are not existing, will be generated with that parameters and  be save in databases (auth and game databases)
            // first ids reserved for nps ids, so put game id more than 1000, default 1000,1001,1002 game ids if they are not exist



            var users = Configuration.GetSection("MainUsers").Get<MainUserConfigModel[]>();
            if (users != null && users.Length > 0)
            {
                MainUserRepository.ConfigureMainUserRepository(users);
            }
            else
            {
                //uncomment it
                //throw new NotImplementedException("MainUsers doesnt set in secrets");
            }

 
            #endregion



        }


        #region ConfigureServicesImpl

        private void ConfigureApplicationAuthenticationServices(IServiceCollection services)
        {

            services.AddDbContext<ApplicationDbContext>(options =>
           {
               options.UseSqlServer(Configuration.GetConnectionString(_authConnectionName));
           });

            var amso = AuthMessageSenderOptions.GetFromConfig(Configuration);
            services.Configure<AuthMessageSenderOptions>(o => o.SetFromOther(amso));



            services
                .AddIdentity<ApplicationUser, IdentityRole>(config =>
                {
                    config.SignIn.RequireConfirmedEmail = true;
                    //config.SignIn.RequireConfirmedPhoneNumber = true;

                    config.User.RequireUniqueEmail = true;


                    // Lockout settings
                    config.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
                    config.Lockout.MaxFailedAccessAttempts = 10;
                    config.Lockout.AllowedForNewUsers = true;
                })
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.TryAddScoped<IAuthDbInitializer, AuthDbInitializer>();

            if (amso != null)
            {
                if (!string.IsNullOrEmpty(amso.FacebookAppId))
                {

                    services.AddAuthentication().AddFacebook(facebookOptions =>
                    {
                        facebookOptions.AppId = amso.FacebookAppId;
                        facebookOptions.AppSecret = amso.FacebookSecret;
                        //facebookOptions.CallbackPath
                    });
                }
                if (!string.IsNullOrEmpty(amso.GoogleClientId))
                {
                    services.AddAuthentication().AddGoogle(googleOptions =>
                    {
                        googleOptions.ClientId = amso.GoogleClientId;
                        googleOptions.ClientSecret = amso.GoogleClientSecret;
                    });
                }
                if (!string.IsNullOrEmpty(amso.MicrosoftClientId))
                {

                    services.AddAuthentication().AddMicrosoftAccount(microsoftOptions =>
                    {
                        microsoftOptions.ClientId = amso.MicrosoftClientId;
                        microsoftOptions.ClientSecret = amso.MicrosoftSecret;
                    });
                }
            }
            else
            {
                //todo error secrets didn't set in instatse, for some services will be error

            }



            services.ConfigureApplicationCookie(options =>
            {
                var lang = Thread.CurrentThread.CurrentUICulture.TwoLetterISOLanguageName.ToLower();

                // Cookie settings
                options.Cookie.HttpOnly = true;
                options.Cookie.Expiration = TimeSpan.FromMinutes(30);
                options.LoginPath =
                    $"/{lang}/Account/Login"; // If the LoginPath is not set here, ASP.NET Core will default to /Account/Login
                options.LogoutPath =
                    $"/{lang}/Account/Logout"; // If the LogoutPath is not set here, ASP.NET Core will default to /Account/Logout
                options.AccessDeniedPath =
                    $"/{lang}/Account/AccessDenied"; // If the AccessDeniedPath is not set here, ASP.NET Core will default to /Account/AccessDenied
                options.SlidingExpiration = true;
            });


            //vk https://vk.com/pages?oid=-17680044&p=Authorizing_Sites
            //https://vknet.github.io/vk/authorize/
            //https://github.com/khrabrovart/Citrina
            //https://vk.com/dev/access_token

            services.TryAddTransient<IEmailSender, EmailSender>();
        }


        /// <summary>
        ///     ConfigureSupportedCulturesAndLocalizationOptions
        ///     https://github.com/aspnet/Entropy/blob/dev/samples/Localization.StarterWeb/Startup.cs
        ///     https://joonasw.net/view/aspnet-core-localization-deep-dive
        /// </summary>
        private static void ConfigureLocalizerService(IServiceCollection services)
        {
            var localizer = new LocalizerService();
            if (localizer.Configured)
            {
                return;
            }
            services.AddSingleton<ILocalizerService, LocalizerService>(c => localizer);
            services.Configure<RequestLocalizationOptions>(localizer.Configure);
        }


        // or test other http://gunnarpeipman.com/2017/03/aspnet-core-simple-localization/
        private void ConfigureGameDataBaseServices(IServiceCollection services)
        {

            services.Configure<DbConnectionOptions>(Configuration.GetSection(nameof(DbConnectionOptions)));

            services.TryAddSingleton<IDbProvider, DbProvider>();

            #region Alliance datas

            #region Alliance data

            services.TryAddSingleton<IAllianceRepository, AllianceRepository>();
            services.TryAddSingleton<IAllianceLocalStorageCache, AllianceLocalStorageCache>();

            #endregion

            #region AllianceFleet data

            services.TryAddSingleton<IAllianceFleetRepository, AllianceFleetRepository>();
            services.TryAddSingleton<IAllianceFleetLocalStorageCache, AllianceFleetLocalStorageCache>();

            #endregion

            #region AllianceRequestMessage data

            services.TryAddSingleton<IAllianceRequestMessageRepository, AllianceRequestMessageRepository>();
            services
                .TryAddSingleton<IAllianceRequestMessageLocalStorageCache, AllianceRequestMessageLocalStorageCache>();

            #region AllianceRequestMessageHistory data

            services.TryAddSingleton<IAllianceRequestMessageHistoryRepository, AllianceRequestMessageHistoryRepository>();

            #endregion

            #region  AllianceRole data

            services.TryAddSingleton<IAllianceRoleRepository, AllianceRoleRepository>();
            services.TryAddSingleton<IAllianceRoleLocalStorageCache, AllianceRoleLocalStorageCache>();

            #endregion

            #region  AllianceTech data

            services.TryAddSingleton<IAllianceTechRepository, AllianceTechRepository>();
            services.TryAddSingleton<IAllianceTechLocalStorageCache, AllianceTechLocalStorageCache>();

            #endregion

            #region  AllianceUser data

            services.TryAddSingleton<IAllianceUserRepository, AllianceUserRepository>();
            services.TryAddSingleton<IAllianceUserLocalStorageCache, AllianceUserLocalStorageCache>();

            #region  AllianceUserHistory data

            services.TryAddSingleton<IAllianceUserHistoryRepository, AllianceUserHistoryRepository>();

            #endregion

            #endregion

            //channels

            #region  Channel data (main) data

            services.TryAddSingleton<IChannelRepository, ChannelRepository>();
            services.TryAddSingleton<IChannelConnectionRepository, ChannelConnectionRepository>();
            services.TryAddSingleton<IChannelMessageRepository, ChannelMessageRepository>();
            //not used

            //not used
            //_kernel.Bind<IChannelLocalStorageCache>().To<ChannelLocalStorageCache>().InThreadScope();
            //_kernel.Bind<IChannelConnectionLocalStorageCache>().To<ChannelConnectionLocalStorageCache>().InThreadScope();
            //_kernel.Bind<IChannelMessageLocalStorageCache>().To<ChannelMessageLocalStorageCache>().InThreadScope();

            #endregion

            #region Confederation data

            services.TryAddSingleton<ICOfficerRepository, COfficerRepository>();
            services.TryAddSingleton<ICOfficerCandidatRepository, COfficerCandidatRepository>();

            #endregion

            #endregion

            #endregion

            #region World datas

            #region  GDetailMoon data

            services.TryAddSingleton<IGDetailMoonRepository, GDetailMoonRepository>();
            services.TryAddSingleton<IGDetailMoonLocalStorageCache, GDetailMoonLocalStorageCache>();

            #endregion

            #region  GDetailPlanet data

            services.TryAddSingleton<IGDetailPlanetRepository, GDetailPlanetRepository>();
            services.TryAddSingleton<IGDetailPlanetLocalStorageCache, GDetailPlanetLocalStorageCache>();

            #endregion

            #region  GDetailSystem data

            services.TryAddSingleton<IGDetailSystemRepository, GDetailSystemRepository>();
            services.TryAddSingleton<IGDetailSystemLocalStorageCache, GDetailSystemLocalStorageCache>();

            #endregion

            #region  GGalaxy data

            services.TryAddSingleton<IGGalaxyRepository, GGalaxyRepository>();
            services.TryAddSingleton<IGGalaxyLocalStorageCache, GGalaxyLocalStorageCache>();

            #endregion

            #region  GGameType data

            services.TryAddSingleton<IGGameTypeRepository, GGameTypeRepository>();
            services.TryAddSingleton<IGGameTypeLocalStorageCache, GGameTypeLocalStorageCache>();

            #endregion

            #region  GGeometryMoon data

            services.TryAddSingleton<IGGeometryMoonRepository, GGeometryMoonRepository>();
            services.TryAddSingleton<IGGeometryMoonLocalStorageCache, GGeometryMoonLocalStorageCache>();

            #endregion

            #region  GGeometryPlanet data

            services.TryAddSingleton<IGGeometryPlanetRepository, GGeometryPlanetRepository>();
            services.TryAddSingleton<IGGeometryPlanetLocalStorageCache, GGeometryPlanetLocalStorageCache>();

            #endregion

            #region  GGeometryStar data

            services.TryAddSingleton<IGGeometryStarRepository, GGeometryStarRepository>();
            services.TryAddSingleton<IGGeometryStarLocalStorageCache, GGeometryStarLocalStorageCache>();

            #endregion

            #region  GGeometrySystem data

            services.TryAddSingleton<IGGeometrySystemRepository, GGeometrySystemRepository>();
            services.TryAddSingleton<IGGeometrySystemLocalStorageCache, GGeometrySystemLocalStorageCache>();

            #endregion

            #region  GSectors data

            services.TryAddSingleton<IGSectorsRepository, GSectorsRepository>();
            services.TryAddSingleton<IGSectorsLocalStorageCache, GSectorsLocalStorageCache>();

            #endregion

            #region  GSystem data

            services.TryAddSingleton<IGSystemRepository, GSystemRepository>();
            services.TryAddSingleton<IGSystemLocalStorageCache, GSystemLocalStorageCache>();

            #endregion

            #region  GTextureType data

            services.TryAddSingleton<IGTextureTypeRepository, GTextureTypeRepository>();
            services.TryAddSingleton<IGTextureTypeLocalStorageCache, GTextureTypeLocalStorageCache>();

            #endregion

            #region  SysHelper data

            services.TryAddSingleton<ISysHelperRepository, SysHelperRepository>();

            #endregion

            #endregion

            #region Store datas

            #region Currency datas

            services.TryAddSingleton<ICurrencyRepository, CurrencyRepository>();
            services.TryAddSingleton<ICurrencyLocalStorageCache, CurrencyLocalStorageCache>();

            #endregion

            #region ProductStore datas

            services.TryAddSingleton<IProductStoreRepository, ProductStoreRepository>();
            services.TryAddSingleton<IProductStoreLocalStorageCache, ProductStoreLocalStorageCache>();

            #endregion


            #region ProductType datas

            services.TryAddSingleton<IProductTypeRepository, ProductTypeRepository>();
            services.TryAddSingleton<IProductTypeLocalStorageCache, ProductTypeLocalStorageCache>();

            #endregion

            #endregion

            #region User datas

            #region BalanceCc datas

            services.TryAddSingleton<IUserBalanceCcRepository, UserBalanceCcRepository>();
            services.TryAddSingleton<IUserBalanceCcLocalStorageCache, UserBalanceCcLocalStorageCache>();

            #endregion

            #region GUserBookmark datas

            services.TryAddSingleton<IUserBookmarkRepository, UserBookmarkRepository>();
            services.TryAddSingleton<IUserBookmarkLocalStorageCache, UserBookmarkLocalStorageCache>();

            #endregion

            #region JournalBuy datas

            services.TryAddSingleton<IJournalBuyRepository, JournalBuyRepository>();
            services.TryAddSingleton<IJournalBuyLocalStorageCache, JournalBuyLocalStorageCache>();

            #endregion

            #region Premium datas

            services.TryAddSingleton<IPremiumRepository, UserPremiumRepository>();
            services
                .AddSingleton<IPremiumLocalStorageCache, PremiumLocalStorageCache>();

            #endregion

            #region TransicationCc datas

            services.TryAddSingleton<ITransacationCcRepository, TransacationCcRepository>();
            services.TryAddSingleton<ITransicationCcLocalStorageCache, TransicationCcLocalStorageCache>();

            #endregion

            #region UMotherJump datas

            services.TryAddSingleton<IUserMotherJumpRepository, UserMotherJumpRepository>();
            services.TryAddSingleton<IUMotherJumpLocalStorageCache, UMotherJumpLocalStorageCache>();

            #endregion

            #region UReport datas

            services.TryAddSingleton<IUserReportRepository, UserReportRepository>();
            services.TryAddSingleton<IUReportLocalStorageCache, UReportLocalStorageCache>();

            #endregion

            #region UserChest datas

            services.TryAddSingleton<IUserChestRepository, UserChestRepository>();
            services.TryAddSingleton<IUserChestLocalStorageCache, UserChestLocalStorageCache>();

            #endregion

            #region User datas

            services.TryAddSingleton<IUserRepository, UserRepository>();
            services.TryAddSingleton<IUserLocalStorageCache, UserLocalStorageCache>();

            #endregion

            #region UserMothership datas

            services.TryAddSingleton<IUserMothershipRepository, UserMothershipRepository>();
            services.TryAddSingleton<IUserMothershipLocalStorageCache, UserMothershipLocalStorageCache>();

            #endregion


            #region USpy datas

            services.TryAddSingleton<IUserSpyRepository, UserSpyRepository>();
            services.TryAddSingleton<IUSpyLocalStorageCache, USpyLocalStorageCache>();

            #endregion

            #region UTask datas

            services.TryAddSingleton<IUserTaskRepository, UserTaskRepository>();
            services.TryAddSingleton<IUTaskLocalStorageCache, UTaskLocalStorageCache>();

            #endregion

            #endregion

            #region SerchCache

            services.TryAddSingleton<IUserAuthToGameCache, AuthToGameCache>();
            services.TryAddSingleton<IPlanetNameToPlanetIdPkCache, PlanetNameSercherPkCache>();
            services.TryAddSingleton<IUserNameSercherPkCache, UserNameSercherPkCache>();
            services.TryAddSingleton<IAlianceNameSercherPkCache, AlianceNameSercherPkCache>();
            services.TryAddSingleton<ISystemNameSercherPkCache, SystemNameSercherPkCache>();

            #endregion


            #region MainGameHubLocalStorageCache

            services.TryAddSingleton<IMainGameHubLocalStorageCache, MainGameHubLocalStorageCache>();

            #endregion
        }

        private static void ConfigureAppServices(IServiceCollection services)
        {
            /*
             В Ninject можно задать несколько способов инициализации получения объекта из класса
            .Если мы работаем в различных контекстах (например, в разных потоках (Thread)), то объекты должны быть использованы разные.
            Тем самым, поддерживается масштабируемость и гибкость приложения. 
            | ======================================================================================================================================== |
            | --- Область -------- | --- Метод связывания ------- | --- комментарий ------------------------------------------------------------------ |
            | ________________________________________________________________________________________________________________________________________ |
            | --- Временный -------- | --- InTransientScope() --- | --- Объект класса будет создаваться по каждому требованию(метод по умолчанию). --- |
            | --- Одиночка --------- | --- InSingletonScope() --- | --- Объект класса будет создан один раз и будет использоваться повторно. --------- |
            | --- Поток ------------ | --- InThreadScope() ------ | --- Один объект на поток. -------------------------------------------------------- |
            | --- Запрос ----------- | --- InRequestScope() ------- | --- Один объект будет на каждый web-запрос ------------------------------------- |
            | ======================================================================================================================================== |
          */
            /* базовая ди устроена немного иначе
             * InTransientScope() => AddTransient<,>()
             * InSingletonScope() => AddSingleton<,>()
             * InRequestScope()   =>   AddScoped<,>()
             * InThreadScope()    => ????
             * в .net di  3 типа синглитон  AddTransient,AddSingleton, AddScoped https://docs.microsoft.com/ru-ru/aspnet/core/fundamentals/dependency-injection */


            #region AppHelpers

            services.TryAddSingleton<IGameRunner, GameRunner>();
            services.TryAddSingleton<IAppVarsReader, AppVarsReader>();

            #endregion

            #region GameServce

            services.TryAddSingleton<IGameUserService, GameUserService>();
            services.TryAddSingleton<IAllianceService, AllianceService>();
            services.TryAddSingleton<IMothershipService, MothershipService>();
            services.TryAddSingleton<IUMotherJumpService, UMotherJumpService>();
            services.TryAddSingleton<IUTaskService, UTaskService>();
            services.TryAddSingleton<IUReportService, UReportService>();
            services.TryAddSingleton<IUSpyService, USpyService>();
            services.TryAddSingleton<IJournalOutService, JournalOutService>();
            services.TryAddSingleton<IChannelService, ChannelService>();
            services.TryAddSingleton<IGUserBookmarkService, GUserBookmarkService>();


            //map
            services.TryAddSingleton<IGGalaxyService, GGalaxyService>();
            services.TryAddSingleton<IGameTypeService, GameTypeService>();
            services.TryAddSingleton<IGGeometryPlanetService, GGeometryPlanetService>();
            services.TryAddSingleton<IMoonService, MoonService>();
            services.TryAddSingleton<IGSectorsService, GSectorsService>();
            services.TryAddSingleton<ISystemService, SystemService>();
            services.TryAddSingleton<IGDetailPlanetService, GDetailPlanetService>();
            services.TryAddSingleton<IWorldService, WorldService>();

            //ConfederationService
            services.TryAddSingleton<IConfederationService, ConfederationService>();


            #region Synchronizer

            services.TryAddSingleton<ISynchronizer, Synchronizer>();
            services.TryAddSingleton<IMotherRunner, MotherRunner>();
            services.TryAddSingleton<IPlanetRunner, PlanetRunner>();
            services.TryAddSingleton<ITaskRunner, TaskRunner>();
            services.TryAddSingleton<INpcTaskRunner, NpcTaskRunner>();

            #endregion


            #region Helpers

            //game
            services.TryAddSingleton<IStorageResourcesService, StorageResourcesService>();
            services.TryAddSingleton<IEstateListService, EstateListService>();
            services.TryAddSingleton<IEstateOwnService, EstateOwnService>();
            services.TryAddSingleton<ITransferResourceService, TransferResourceService>();
            services.TryAddSingleton<IMapInfoService, MapInfoService>();
            services.TryAddSingleton<IOwnProgressInitializer, OwnProgressInitializer>();

            ////////////////////////////////////////////
            //common

            services.TryAddSingleton<IUserInitializer, UserInitializer>();

            #endregion

            #region HtmlHelper

            services.TryAddSingleton<ISpriteImages, SpriteImages>();

            #endregion

            #region Npc

            services.TryAddSingleton<INpc, Npc>();
            services.TryAddSingleton<INpcInitializer, NpcInitializer>();

            #endregion

            #region Initializers

            services.TryAddSingleton<IAllianceInitializer, AllianceInitializer>();
            services.TryAddSingleton<IMapGInitializer, MapGInitializer>();
            services.TryAddScoped<IMainInitializer, MainInitializer>();
            services.TryAddScoped<IAuthUsersInitializer, AuthAuthUsersInitializer>();

            #endregion

            #region Modules

            #region Other

            services.TryAddTransient<IBuildUpgrade, BuildUpgrade>();
            services.TryAddTransient<IMapAdressService, MapAdressService>();

            #endregion

            #region Builds Items

            services.TryAddTransient<ITurels, Turels>();
            services.TryAddTransient<IStorage, Storage>();
            services.TryAddTransient<ISpaceShipyard, SpaceShipyard>();
            services.TryAddTransient<ILaboratoryBuild, LaboratoryBuild>();
            services.TryAddTransient<IExtractionModule, ExtractionModule>();
            services.TryAddTransient<IEnergyConverter, EnergyConverter>();

            #endregion

            #region Builds Collection

            services.TryAddTransient<ICommandCenter, CommandCenter>();
            services.TryAddTransient<IIndustrialComplex, IndustrialComplex>();
            services.TryAddTransient<IShipyard, Shipyard>();
            services.TryAddTransient<ILaboratory, Laboratory>();

            #endregion

            #region Unit

            services.TryAddSingleton<IUnit, Unit>();

            #endregion

            #endregion

            #region TestDb

            //_kernel.Bind<TestDb.ITestService>().To<TestDb.TestService>().InThreadScope();
            //_kernel.Bind<TestDb.ITestLogicClass>().To<TestDb.TestLogicClass>().InThreadScope();
            //_kernel.Bind<TestDb.ITestRepo>().To<TestDb.TestRepo>().InThreadScope();
            //_kernel.Bind<TestDb.ITestLocalStorageCache>().To<TestDb.TestLocalStorageCache>().InThreadScope();

            //_kernel.Bind<TestDb.ITestDbRelationService>().To<TestDb.TestDbRelationService>().InThreadScope();
            //_kernel.Bind<TestDb.ITestDbRelationLogicClass>().To<TestDb.TestDbRelationLogicClass>().InThreadScope();
            //_kernel.Bind<TestDb.ITestDbRelationRepo>().To<TestDb.TestDbRelationRepo>().InThreadScope();
            //_kernel.Bind<TestDb.ITestDbRelationLocalStorageCache>()
            //    .To<TestDb.TestDbRelationLocalStorageCache>()
            //    .InThreadScope();

            #endregion

            #endregion

            #region StoreService

            services.TryAddTransient<IStoreService, StoreService>();

            #endregion

            #region AzureStorgae

            services.TryAddSingleton<IUserImageLoader, UserImageLoader>();
            services.TryAddSingleton<IAzureLogProvider, AzureLogProvider>();
            services.TryAddSingleton<IFileStorage, FileStorage>();
            services.TryAddTransient<IDemonAzureLogItem, DemonAzureLogItem>();

            #endregion
        }

        #endregion


        #region OtherTest and tmp

        private static void HandleMapTest1(IApplicationBuilder app)
        {
            app.Run(async context => { await context.Response.WriteAsync("Map Test 1"); });
        }

        private static void HandleMapTest2(IApplicationBuilder app)
        {
            app.Run(async context => { await context.Response.WriteAsync("Map Test 2"); });
        }

        private static void HandleBranch(IApplicationBuilder app)
        {
            app.Run(async context =>
            {
                var branchVer = context.Request.Query["branch"];
                await context.Response.WriteAsync($"Branch used = {branchVer}");
            });
        }

        #endregion
    }


    public class MyMiddleware
    {
        #region Declare

        private readonly RequestDelegate _next;

        public MyMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        #endregion

        public async Task Invoke(HttpContext httpContext, object iMyScopedService)
        {
            //  svc.MyProperty = 1000;
            // some with service IMyScopedService
            await _next(httpContext);
        }
    }

    public class AppSecrets
    {
        public string EmailSenderEmailForTesting { get; set; }
    }
}