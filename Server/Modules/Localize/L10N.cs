using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading;
using Server.Core.Interfaces;
using Server.Core.StaticData;
using Server.Extensions;

namespace Server.Modules.Localize
{
 
    //[JsonObject]
    public class L10N : ITranslateField<LangField>, ICreateNew<L10N>
    {

        public const short DefaultMaxLength = (int)MaxLenghtConsts.AllianceDescription;

        public const short EmptyObjectLength = 185;
        //if null values - 113 and none space, if width space (standart json object) - 185

        public const string DefaultLang = LocalizerService.DefaultLang;
        public static readonly IReadOnlyList<string> SupportedCulture = LocalizerService.SupportedCultureValues;

        [NonSerialized]
        public readonly string CurrentCulture;

        public L10N()
        {
            CurrentCulture = GetCurrentCulture();
        }


        protected L10N(L10N other) : this()
        {
            En = other.En.CreateNewFromThis();
            Es = other.Es.CreateNewFromThis();
            Ru = other.Ru.CreateNewFromThis();
        }

        public LangField Ru { get; set; }


        public LangField En { get; set; }


        public LangField Es { get; set; }




        private static LangField ExecuteLang(L10N data, string lang = null)
        {
            lang = lang?.ToLower() ?? data.CurrentCulture;

            if (lang == SupportedCulture[(byte)LangKeys.En]) return data.En;
            if (lang == SupportedCulture[(byte)LangKeys.Ru]) return data.Ru;
            return (lang == SupportedCulture[(byte)LangKeys.Es]) ? data.Es : data.En;
        }
        public static LangField ExecuteLang(string data, string lang = null)
        {
            var tmp = new L10N();
            tmp.InitializeField();
            if (string.IsNullOrWhiteSpace(data)) return ExecuteLang(tmp, lang);

            var instance = data.ToSpecificModel<L10N>();

            tmp.En = instance.En ?? tmp.En;
            tmp.Ru = instance.Ru ?? tmp.Ru;
            tmp.Es = instance.Es ?? tmp.Es;
            return ExecuteLang(tmp, lang);
        }

        public static string ExecuteTranslateNameOrDescr(string data, bool isName, string lang = null)
        {
            if (string.IsNullOrWhiteSpace(data)) return "";
            return isName ? ExecuteLang(data, lang).Name ?? "" : ExecuteLang(data, lang).Description ?? "";
        }

        public static string ExecuteTranslateNameOrDescr(L10N data, bool isName, string lang = null)
        {
            if (data == null)
            {
                data = new L10N();
                data.InitializeField();
            }
            return isName ? ExecuteLang(data, lang).Name ?? "" : ExecuteLang(data, lang).Description ?? "";
        }

 
        public static string GetCurrentCulture()
        {
            var result = Thread.CurrentThread.CurrentCulture.ToString();
                //CultureInfo.CurrentCulture.ToString();
            return result.ToLower().Substring(0, 2);
        }


        public L10N CreateNew(L10N other)
        {
            return new L10N(other);
        }

        public L10N CreateNewFromThis()
        {
            return new L10N(this);
        }

        public static void SetCulture(string langKey)
        {
            LocalizerService.SetCulture(langKey);
        }
        public static void SetCulture(LangKeys langKey) {
            LocalizerService.SetCulture(langKey);
        }

 

    }



}