using System;
using System.Collections.Generic;
using System.Linq;

namespace TestDbNoDepenceApp
{
    public class TestUpsertCommandContainer
    {
        private static readonly Dictionary<string, string> NumericKeyTypeNameKeySqlKeyTypeNameValue = new Dictionary<string, string>
        {
            {typeof(byte).Name,"TINYINT"},
            {typeof(short).Name,"SMALLINT"},
            {typeof(int).Name,"INT"},
            {typeof(long).Name,"BIGINT"}
        };
        public Type TypeInfo { get; }
 
        public IList<string> WorkPropertyNames { get; }

 
        public string PrimarySqlKeyTypeName { get; }
 
        public string SqlKeyNames { get; }
 
        public string SqlValueNames { get; }
 
        public string SqlStringUpdateKeyValues { get; }
 
        public string ModelName { get; }

        public TestUpsertCommandContainer(Type modelType)
        {
            TypeInfo = modelType;
            PrimarySqlKeyTypeName = GetSqlKeyTypeName();
            WorkPropertyNames = modelType.GetProperties().Where(i => i.Name != "Id").Select(i => i.Name).ToList();

            SqlKeyNames = "";
            SqlValueNames = "";
            SqlStringUpdateKeyValues = "";
            ModelName = TypeInfo.Name;


            foreach (var i in WorkPropertyNames)
            {
                var nameItem = i;
                var varItem = "@" + nameItem;
                var updateItem = nameItem + "=" + varItem;
                SqlKeyNames += nameItem + ",";
                SqlValueNames += varItem + ",";
                SqlStringUpdateKeyValues += updateItem + ",";
            }

            SqlKeyNames = _removeLastComa(SqlKeyNames);
            SqlValueNames = _removeLastComa(SqlValueNames);
            SqlStringUpdateKeyValues = _removeLastComa(SqlStringUpdateKeyValues);

        }
        private string _removeLastComa(string simbols)
        {
            return simbols.EndsWith(",") ? simbols.Substring(0, simbols.Length - 1) : simbols;
        }
        private string GetSqlKeyTypeName()
        {
            return NumericKeyTypeNameKeySqlKeyTypeNameValue[TypeInfo.GetProperty("Id")?.PropertyType.Name ?? throw new InvalidOperationException()];

        }
    }
}