using System;
using System.IO;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Server;

namespace app
{
    public class Program
    {
        //https://docs.microsoft.com/en-us/aspnet/core/security/key-vault-configuration?tabs=aspnetcore2x
        //   https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration?tabs=basicconfiguration
        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args)
        {

            return WebHost.CreateDefaultBuilder(args)
                .UseContentRoot(Directory.GetCurrentDirectory())
                //.UseApplicationInsights()
                .UseStartup<Startup>()
                //.UseKestrel(options =>
                //{//https://github.com/aspnet/KestrelHttpServer/blob/rel/2.0.0/src/Microsoft.AspNetCore.Server.Kestrel.Core/KestrelServerLimits.cs
                //     options.Limits.RequestHeadersTimeout = new TimeSpan(0, 10, 1);
                //    options.Limits.KeepAliveTimeout = new TimeSpan(0,10,0);
                //})
                .Build();
        }
    }
    public class Startup
    {
        private readonly StartAppRunner _appRunner;
        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
 
            _appRunner = new StartAppRunner(configuration, env);
        }

        public void ConfigureServices(IServiceCollection services)
        {
            _appRunner.ConfigureServices(services);
        }

        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory, IServiceProvider svp)
        {
            _appRunner.Configure(app, loggerFactory, svp);
        }


    }
}