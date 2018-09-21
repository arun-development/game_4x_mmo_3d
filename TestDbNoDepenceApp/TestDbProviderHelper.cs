namespace TestDbNoDepenceApp
{
    public static class TestDbProviderHelper
    {
        public const string DefaultScheme = "dbo";

        public static string SqlDelete(this ITestDbProvider provider, string tableName)
        {
            return $"DELETE FROM {tableName} WHERE Id = @id";
        }
        public static string SqlDeleteAll(this ITestDbProvider provider, string tableName)
        {
            return $"DELETE FROM {tableName}";
        }
        public static string SqlGetById(this ITestDbProvider provider, string tableName)
        {
            return $"SELECT top 1 * FROM {tableName} WHERE Id = @id";
        }
        public static string SqlGetAll(this ITestDbProvider provider, string tableName)
        {
            return $"SELECT * FROM {tableName}";
        }
        public static string GetTableName(this ITestDbProvider provider, string tableName, string scheme = DefaultScheme)
        {
            return $"[{scheme}].[{tableName}]";
        }
        public static string GetProcedureName(this ITestDbProvider provider, string procedureName, string scheme = DefaultScheme)
        {
            return provider.GetTableName(procedureName, scheme);
        }

    }
}