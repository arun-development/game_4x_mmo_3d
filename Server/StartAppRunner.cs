using System;
using System.IO.Compression;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Serialization;
using Server.DataLayer;
using Server.EndPoints.Hubs.GameHub;
using Server.EndPoints.Hubs.MyTestHub;
using Server.Extensions;
using Server.Services.Demons;
using Server.ServicesConnected.Auth.Services;


namespace Server
{
    public partial class StartAppRunner : IStartAppRunner
    {
        private readonly string _allowAllCorosPolycyName = "AllowCors";
        #region Main

        private readonly bool _isDevelopment;
        private ConnectionNames _authConnectionName;

        public StartAppRunner(IConfiguration configuration, IHostingEnvironment env)
        {
            Configuration = configuration;

            _isDevelopment = env.IsDevelopment();
            _setConnectionNames(true);
        }

        public IConfiguration Configuration { get; }

        private void _setConnectionNames(bool useLocal)
        {
            if (useLocal)
            {

                _authConnectionName = ConnectionNames.HomeAuthTest;
                DbProvider.AppConnectionName = ConnectionNames.HomeDev;
            }
            else
            {
                _authConnectionName = ConnectionNames.AzureAuthDev;
                DbProvider.AppConnectionName = ConnectionNames.AzureGameDev;
            }
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            //confugure static classes inject setting from secrets run it in top level
            ConfigureStaticClases(services);

            //ssl
            services.Configure<MvcOptions>(options =>
            {
                options.Filters.Add(new RequireHttpsAttribute());
            });
            ConfigureGameDataBaseServices(services);
            ConfigureApplicationAuthenticationServices(services);
            ConfigureAppServices(services);
            var jsonContractResolver = new DefaultContractResolver();
            // Add the localization services to the services container
            services.AddLocalization(options => options.ResourcesPath = "Resources");



            // Add application services.
            //services.AddSingleton<ITestLibClass, TestLibClass>();
            //services.TryAddTransient<ITestSrvice, TestSrvice>();

            //lang
            //services.Configure<RouteOptions>(options =>
            //{

            //    options.ConstraintMap.Add("lang", typeof(LanguageRouteConstraint));
            //});


            services.AddCors(o => o.AddPolicy(_allowAllCorosPolycyName, builder =>
            {
                builder
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            //.AllowAnyOrigin()
                            .WithOrigins("https://localhost:44396/");

            }));



            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();


            services.AddAntiforgery(options =>
            {
                var tokernName = "X-XSRF-TOKEN";
                options.HeaderName = tokernName;
                options.Cookie.Name = tokernName;
                options.FormFieldName = tokernName;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                options.Cookie.HttpOnly = true;
                options.Cookie.SameSite = SameSiteMode.Strict;
                //    options.SuppressXFrameOptionsHeader = true;
            });


            ConfigureLocalizerService(services);
            //add signalr
            //services.AddSignalR(jo => 
            //jo.JsonSerializerSettings.ContractResolver = jsonContractResolver
            //);
            services.AddSignalR()
                .AddJsonProtocol(options =>
            {
                options.PayloadSerializerSettings.ContractResolver = jsonContractResolver;
            });

            #region Gzip

            services.AddResponseCompression(options =>
            {
                options.Providers.Add<GzipCompressionProvider>();
                // options.Providers.Add<CustomCompressionProvider>();

                /* defaults MimeTypes:
                 * text/plain
                 * text/css
                 * application/javascript
                 * text/html
                 * application/xml
                 * text/xml
                 * application/json
                 * text/json
                 */
                options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[] { "image/svg+xml", "application/x-ms-manifest", "application/octet-stream", "application/babylonmeshdata", "application/babylon" });
            });

            services.Configure<GzipCompressionProviderOptions>(options =>
            {
                options.Level = CompressionLevel.Fastest;
            });

            services.AddMvc()
                    .AddViewLocalization(LanguageViewLocationExpanderFormat.Suffix)
                    .AddJsonOptions(jo => jo.SerializerSettings.ContractResolver = jsonContractResolver)
                    .AddDataAnnotationsLocalization();

            #endregion






        }


        // 
        /// <summary>
        ///     This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        ///     Oreden in body is imprtant more info
        ///     https://docs.microsoft.com/en-us/aspnet/core/fundamentals/middleware?tabs=aspnetcore2x
        /// </summary>
        /// <param name="app"></param>
        /// <param name="loggerFactory"></param>
        /// <param name="svp"></param>
        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory, IServiceProvider svp)
        {
            if (_isDevelopment)
            {
                app.UseDeveloperExceptionPage();
                app.UseBrowserLink();
                app.UseDatabaseErrorPage();

                loggerFactory.AddConsole(Configuration.GetSection("Logging"));
                loggerFactory.AddDebug();
            }
            else
            {
                app.UseExceptionHandler("/Error/Default");
            }
            // app.UseStaticFiles();
            app.UseStaticFiles(new StaticFileOptions
            {   /* unknown mime types (ie: .fx) files will not be served, otherwise! */
                ServeUnknownFileTypes = true,

            });

            //gzip
            app.UseResponseCompression();

            app.UseAuthentication();
            //ssl

            var options = new RewriteOptions().AddRedirectToHttps();
            app.UseRewriter(options);

            #region My
            var initializer = svp.GetService<IAuthDbInitializer>();
            initializer.Initialize(_authConnectionName == ConnectionNames.HomeAuthTest).MakeSync();

            var locOptions = svp.GetService<IOptions<RequestLocalizationOptions>>();
            app.UseRequestLocalization(locOptions.Value);
            app.AddTimerExecutor(svp);

            #endregion

            app.UseCors(_allowAllCorosPolycyName);


            app.UseSignalR(routes =>
            {
                var hub = "/hub/";
                routes.MapHub<MainGameHub>(hub + nameof(MainGameHub).ToLower());
                routes.MapHub<MyTestHub>(hub + nameof(MyTestHub).ToLower());
                //routes.MapHub<MyTestHub>("hub/MyTestHub".ToLower(), o =>
                //{
                //    //o.AuthorizationData
                //});
            });

            app.UseMvc(routes =>
            {
                // https://github.com/aspnet/Docs/blob/master/aspnetcore/fundamentals/routing.md
                // https://docs.microsoft.com/ru-ru/aspnet/core/fundamentals/url-rewriting?tabs=aspnetcore2x

                routes.MapRoute("api", "api/{controller}/{action}");
                routes.MapRoute("home", "{controller=Home}/{action=Index}");
                routes.MapRoute("default", "{lang=en}/{controller=Home}/{action=Index}/{id?}");


                //https://github.com/aspnet/JavaScriptServices
                //     routes.MapSpaFallbackRoute();
            });






            //app.Map("/map1", HandleMapTest1);
            //app.Map("/map2", HandleMapTest2);
            //app.MapWhen(context => context.Request.Query.ContainsKey("branch"), HandleBranch);
        }


        #endregion
    }


}