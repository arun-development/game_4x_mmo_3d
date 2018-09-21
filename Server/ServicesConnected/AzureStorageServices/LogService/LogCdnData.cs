namespace Server.ServicesConnected.AzureStorageServices.LogService
{
    public static class AzureLogCdnData
    {
        private static string _cdnUrl;
        public const string DemonContainer = "demon";
        public static string _demonCdn;
        public static string DemonCdn => _demonCdn ?? throw new System.NotImplementedException("Not Configured");

        static AzureLogCdnData() { }

        /// <summary>
        /// use  only in runtime
        /// </summary>
        /// <param name="cdnUrl"> https://MyAzureStorageAccountName.blob.core.windows.net/ </param>
        public static void ConfigureAzureLogCdnData(string cdnUrl)
        {
            _cdnUrl = cdnUrl;
            _demonCdn = _cdnUrl + DemonContainer + "/";
        }
    }
}
