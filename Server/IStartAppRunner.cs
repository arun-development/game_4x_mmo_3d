using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Server
{
    public interface IStartAppRunner
    {
        IConfiguration Configuration { get; }

        void Configure(IApplicationBuilder app,   ILoggerFactory loggerFactory, IServiceProvider svp);
        void ConfigureServices(IServiceCollection services);
    }
}