namespace TestDbNoDepenceApp
{
    public static class TestDataConnection
    {
        private static string _testConnecttion;
        public static string TestConnecttion = _testConnecttion ?? (_testConnecttion = _creatLocalConnectionString("Test"));
        private static string _creatLocalConnectionString(string dbName)
        {
            return $@"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog={dbName};Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=True";
        }
    }
}