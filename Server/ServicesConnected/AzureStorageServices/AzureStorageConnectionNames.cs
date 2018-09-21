using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace Server.ServicesConnected.AzureStorageServices
{
    internal static class AzureStorageConnectionNames
    {
        static AzureStorageConnectionNames() { }
        private static string _skagryUserImages; //"skagryuserimages";
        private static string _eternPlayPublic;//"eternplaypublic";
        private static string _skagryLogErrors;//"skagrylogerrors";
        public static string SkagryUserImages => _skagryUserImages;

        public static string EternPlayPublic => _eternPlayPublic;
        public static string SkagryLogErrors => _skagryLogErrors;

        private static ReadOnlyDictionary<string, string> _connectionStrings;

        private static string _buildString(string containerName, string containerKey)
        {
            return $"DefaultEndpointsProtocol=https;AccountName={containerName};AccountKey={containerKey};EndpointSuffix=core.windows.net";
        }

        internal static string GetConnectionString(string connectionKey)
        {
            return _connectionStrings[connectionKey];
        }


        public static void ConfigureAzureStorageConnections(Dictionary<AzureStorageConnectionType, AzureStorageConnectionConfigurationModel> storages)
        {
            if (storages.Count != 3)
            {
                throw new InvalidOperationException("Must be 3 storage");
            }
            var dic = new Dictionary<string, string>();
            foreach (var s in storages)
            {
                switch (s.Key)
                {
                    case AzureStorageConnectionType.SkagryUserImages:
                        _skagryUserImages = s.Value.AccountName;
                        break;
                    case AzureStorageConnectionType.EternPlayPublic:
                        _eternPlayPublic = s.Value.AccountName;
                        break;
                    case AzureStorageConnectionType.SkagryLogErrors:
                        _skagryLogErrors = s.Value.AccountName;
                        break;
                    default:
                        throw new KeyNotFoundException();
                };
                dic.Add(s.Value.AccountName, _buildString(s.Value.AccountName, s.Value.AccountKeyValue));
            }

            _connectionStrings = new ReadOnlyDictionary<string, string>(dic);



        }


    }

    public enum AzureStorageConnectionType
    {
        SkagryUserImages = 1,
        EternPlayPublic = 2,
        SkagryLogErrors = 3

    }
    public class AzureStorageConnectionConfigurationModel
    {
        public string AccountName { get; set; }
        public string AccountKeyValue { get; set; }
        public AzureStorageConnectionType Type { get; set; }
        public string StringType => Type.ToString();
    }
}
