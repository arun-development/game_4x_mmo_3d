using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using FileBuilder.sql;
using Server.EndPoints.Hubs;

namespace FileBuilder
{
    class Program
    {
 
        //replase that string for your path
        private const string _root = "C:/Users/Arun/Source/Repos/skagry_pull/skagry_public";
 
            //@"C:/Users/Arun/Source/Repos/skagry_pull/skagry";
        private static bool _open = true;

        static void Main(string[] args)
        {
 

            Console.WriteLine("enter command! :\n   sql - generate sql scripts\n   testHub - generate test client hub scripts\n    mainHub generate mainHub scripts\n  all - all builds\n  q -quit");
            while (_open)
            {

                var command = Console.ReadLine();
                switch (command)
                {
                    case "q":
                        _open = false;
                        goto case "finnaly";
                    case "all":
                        SqlBuilder();
                        BuildTestHub();
                        BuildMainGameHub();
                        goto case "finnaly";
                    case "sql":
                        SqlBuilder();
                        goto case "finnaly";
                    case "testHub":
                        BuildTestHub();
                        goto case "finnaly";
                    case "mainHub":
                        BuildMainGameHub();
                        goto case "finnaly";
                    case "finnaly":
                        break;
                }
            }
            Console.WriteLine("by-by!");

            //    ClientHubFileBuilder.CreateTestCient();
        }

        private static void SqlBuilder()
        {

            var generator = new SqlPrBuilder($@"{_root}/Server/DataLayer/Infrastructure/scripts/");
            generator.InitAll();
            Console.WriteLine("SqlBuilder finished");
        }
        private static void BuildTestHub()
        {
            ClientHubFileBuilder.CreateTestCient();
            Console.WriteLine("BuildTestHub finished");
        }
        private static void BuildMainGameHub()
        {
            ClientHubFileBuilder.CreateMainGameHubCient();
            Console.WriteLine("CreateMainGameHubCient finished");
        }
    }
}
