using System;
using System.IO;

namespace Server.Core.StaticData
{
    public static class Directories
    {
        public const string Ext = ".cshtml";
        public const string HtmlExt = ".min.html";
        public const string Tmpl = ".tmpl";
        public const string UploadGameCatalog = "/Content/images/upload/Game";
        public const string UploadAllianceCatalog = UploadGameCatalog + "/Alliance";
        public const string UploadUserCatalog = UploadGameCatalog + "/Users";


        public const string Content = "/Content/";
        public const string VideoContent = Content + "Video/";
        public const string VideoHomePage = VideoContent + "Home/";


        public const string DirApp = "~/";
        public const string Store = DirApp + "Views/Store/";
        public const string Home = DirApp + "Views/Home/";
        public const string Game = DirApp + "Views/Game/";
        public const string HtmltemplateDir = "/_js/Angular/HtmlTpl/";


        public const string Planset = Game + "Planshet/";
        public const string Buttons = Game + "Buttons/";

        public const string Bookmark = Game + "Bookmark/";
        public const string MapInfo = Game + "MapInfo/";

        public const string Builds = Game + "Builds/";

        public const string Template = Game + "Template/";

        public const string ControlPanel = Game + "ControlPanel/";
        public const string ResourceView = Game + "ResourceView/";
        public const string Profile = Game + "Profile/";
        public const string Journal = Game + "Journal/";

        public const string Materials = Content + "Materiales/";

        //public static string Root = HttpContext.Current.Server.MapPath("~");


        private static string _appRoot;

        public static string AbsoluteAppRoot
        {
            get
            {
                if (_appRoot != null) return _appRoot;
                //"C:\\Users\\Arun\\Source\\Repos\\Site\\app\\app\\"
                var appDomain = PreparePath(AppDomain.CurrentDomain.BaseDirectory);
                if (appDomain.Contains(@"/app/app"))
                {
                    return _appRoot = appDomain;
                }

                var appName = "app";//solutionName
                var curDir = appDomain;
                var start = curDir.IndexOf(appName, StringComparison.InvariantCultureIgnoreCase);
                var end = start + appName.Length;
                _appRoot = curDir.Substring(0, end);
                var separator = Path.DirectorySeparatorChar.ToString();
                _appRoot += separator;
                _appRoot += "app" + separator;//projectName
                _appRoot = PreparePath(_appRoot);
                return _appRoot;
            }
        }
        public static string PreparePath(string path)
        {
            return path.Replace(@"\", @"/").Replace("//", "/");
        }


    }
}