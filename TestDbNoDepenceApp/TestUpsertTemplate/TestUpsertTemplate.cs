using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace TestDbNoDepenceApp.TestUpsertTemplate
{
    
    [TestClass]
    public class TestUpsertTemplate
    {

        private class UpsertCommandContainer
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

            public UpsertCommandContainer(Type modelType)
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
                    var varItem=  "@"+ nameItem;
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
            private   string GetSqlKeyTypeName()
            {
                return NumericKeyTypeNameKeySqlKeyTypeNameValue[TypeInfo.GetProperty("Id")?.PropertyType.Name ?? throw new InvalidOperationException()];

            }
        }


        #region Declare
        private interface ITestData<T> where T : struct
        {
            T Id { get; set; }
        }

        private class TestData<T> : ITestData<T> where T : struct
        {
            public T Id { get; set; }
        }


        private class TestByteModel : TestData<byte>
        {
            public string TestData { get; set; }
        }

        private class TestShortModel : TestData<short>
        {
            public string TesteData { get; set; }
        }
        private class TestIntModel : TestData<int>
        {
            public string TestData { get; set; }
            public string TestData2 { get; set; }
        }
        private class TestLongModel : TestData<long>
        {
            public string TesteData { get; set; }
        }


        private abstract class TestBuilderParent<T, V> where T : ITestData<V> where V : struct
        {


            public string SchemeTableName { get; }

            protected readonly UpsertCommandContainer UpsertMapper;


            protected TestBuilderParent(string tableName, string schemeName = null)
            {
                SchemeTableName = CreateSchemeTableName(tableName, schemeName);
                UpsertMapper = new UpsertCommandContainer(typeof(T));
            }




            public string CreateSchemeTableName(string tableName, string schemeName= null)
            {
                return $"[{schemeName??"dbo"}].[{tableName}]";
            }

 

            public string CreateUpSertTemplate()
            {

                var upsertSql =
                    $@"DECLARE @_id {UpsertMapper.PrimarySqlKeyTypeName};" +
                    @"IF (ISNULL (@Id,0)=0)" +
                    $"BEGIN INSERT INTO {SchemeTableName} ({UpsertMapper.SqlKeyNames}) values ({UpsertMapper.SqlValueNames});" +
                    @"SET @_id = SCOPE_IDENTITY();" +
                    @"END " +
                    @"ELSE " +
                    @"BEGIN " +
                    $"UPDATE {SchemeTableName} SET {UpsertMapper.SqlStringUpdateKeyValues} WHERE Id = @Id " +
                    @"IF (@@ROWCOUNT = 0) " +
                    @"BEGIN " +
                    $"INSERT INTO {SchemeTableName} (Id,{UpsertMapper.SqlKeyNames}) VALUES (@Id,{UpsertMapper.SqlValueNames});" +
                    @"END " +
                    $"SET @_id =@Id;" +
                    $"END " +
                    $"SELECT * FROM {SchemeTableName} where Id=@_id;";
                return upsertSql;
            }



            public string GetPrimarySqlKeyTypeName()
            {

                return UpsertMapper.PrimarySqlKeyTypeName;
            }
            public string GetSqlKeyNames()
            {

                return UpsertMapper.SqlKeyNames;
            }
            public string GetSqlValueNames()
            {

                return UpsertMapper.SqlValueNames;
            }
            public string GetSqlStringUpdateKeyValues()
            {

                return UpsertMapper.SqlStringUpdateKeyValues;
            }





            public string GetModelTypeName()
            {
                return UpsertMapper.ModelName;
            }

            public IList<string> GetSqlWorkProperties()
            {
                return UpsertMapper.WorkPropertyNames;
            }

        }
        private class TestBuilderByteChild : TestBuilderParent<TestByteModel, byte>
        {
            public TestBuilderByteChild() : base(nameof(TestByteModel))
            {
            }
        }
        private class TestBuilderShortChild : TestBuilderParent<TestShortModel, short>
        {
            public TestBuilderShortChild() : base(nameof(TestShortModel))
            {
            }
        }
        private class TestBuilderIntChild : TestBuilderParent<TestIntModel, int>
        {
            public TestBuilderIntChild() : base(nameof(TestIntModel))
            {
            }
        }
        private class TestBuilderLongChild : TestBuilderParent<TestLongModel, long>
        {
            public TestBuilderLongChild() : base(nameof(TestLongModel))
            {
            }
        }



        #endregion


        [TestMethod]
        public void TestSqlTypeNameByModelTypeCreatingCorect()
        {
            var byteBuilder = new TestBuilderByteChild();
            var shortBuilder = new TestBuilderShortChild();
            var intBuilder = new TestBuilderIntChild();
            var longBuilder = new TestBuilderLongChild();
            Assert.AreEqual("TINYINT", byteBuilder.GetPrimarySqlKeyTypeName());
            Assert.AreEqual("SMALLINT", shortBuilder.GetPrimarySqlKeyTypeName());
            Assert.AreEqual("INT", intBuilder.GetPrimarySqlKeyTypeName());
            Assert.AreEqual("BIGINT", longBuilder.GetPrimarySqlKeyTypeName());
        }
        [TestMethod]
        public void TestModelTypeNameIsCorrect() {
 
            var intBuilder = new TestBuilderIntChild();
            var modelType = typeof(TestIntModel);
            Assert.AreEqual(modelType.Name, intBuilder.GetModelTypeName());

        }
        
        [TestMethod]
        public void TestSqlKeysGenerateCorrectly()
        {
            var intBuilder = new TestBuilderIntChild();
            Assert.AreEqual(@"TestData,TestData2", intBuilder.GetSqlKeyNames());
        }
        [TestMethod]
        public void TestSqlPropVarsGenerateCorrectly()
        {
            var intBuilder = new TestBuilderIntChild();
            Assert.AreEqual(@"@TestData,@TestData2", intBuilder.GetSqlValueNames());
        }

        [TestMethod]
        public void TestSqlUpdateStringGenerateCorrectly()
        {
            var intBuilder = new TestBuilderIntChild();
            var updateString = intBuilder.GetSqlStringUpdateKeyValues();
            Assert.AreEqual(@"TestData=@TestData,TestData2=@TestData2", updateString);
        }

        [TestMethod]
        public void TestUpsertTemplateGenerateCorrectly()
        {
            var intBuilder = new TestBuilderIntChild();
            var upsertTemplate = intBuilder.CreateUpSertTemplate();

            var mustTemplate =
                @"DECLARE @_id INT;IF (ISNULL (@Id,0)=0)BEGIN INSERT INTO [dbo].[TestIntModel] (TestData,TestData2) values (@TestData,@TestData2);SET @_id = SCOPE_IDENTITY();END ELSE BEGIN UPDATE [dbo].[TestIntModel] SET TestData=@TestData,TestData2=@TestData2 WHERE Id = @Id IF (@@ROWCOUNT = 0) BEGIN INSERT INTO [dbo].[TestIntModel] (Id,TestData,TestData2) VALUES (@Id,@TestData,@TestData2);END SET @_id =@Id;END SELECT * FROM [dbo].[TestIntModel] where Id=@_id;";
            Assert.AreEqual(mustTemplate, upsertTemplate);
        }


    }
}
