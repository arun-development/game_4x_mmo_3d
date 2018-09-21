using System.Collections.Generic;

namespace Server.ServicesConnected.Auth.Static
{
    public static class MainRoles
    {
        public const string Root = "Root";
        public const string Developer = "Developer";
        public const string User = "User";
        public const string Test = "Test";
        public const string Demon = "Demon";
        public const string Guest = "Guest";

        public const string RDD = Root + "," + Developer + "," + Demon;


        public static List<string> MainRolesList = new List<string>
        {
            Root,
            Developer,
            User,
            Test,
            Demon,
            Guest
        };
    }
}
