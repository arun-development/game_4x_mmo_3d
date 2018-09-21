using Server.Core.Interfaces;

namespace Server.Services.HtmlHelpers
{
    public class GameHtmlAtributes : INativeName
    {
        public const string Action = "action";
        public const string GreenShadowCss = "green-shadow";
        public const string BuildControl = "build-control";
        public const string Info = "info";
        public const string Upgrade = "upgrade";
        public const string Jump = "Jump";
        public const string JsFuncBuildToggle = "PlanshetUi.BuildToggle(this)";

        public string Title { get; set; }
        public string CssClases { get; set; }

        public string TranslateName { get; set; }

        public string NativeName { get; set; }

        public string DataAttrsFull { get; set; }
        public string DataAttrValue { get; set; }
    }
}