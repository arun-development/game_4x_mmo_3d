using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;

namespace Server.Infrastructure
{
    public abstract class AppConfigSectionReader
    {
        protected readonly string SectionNmame;
        protected AppConfigSectionReader(string sectionNmame)
        {
            SectionNmame = sectionNmame;
        }
        protected string _getValue(IConfiguration configuration, string propKey)
        {
            return configuration.GetSection($"{SectionNmame}:{propKey}").Value;
        }

        public abstract void Create(IConfiguration configuration);


    }
}
