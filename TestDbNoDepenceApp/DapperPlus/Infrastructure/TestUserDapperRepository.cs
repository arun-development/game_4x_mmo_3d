using System.Collections.Generic;
using System.Data;
using System.Linq;
using Dapper;

namespace TestDbNoDepenceApp.DapperPlus.Infrastructure
{

    public interface ITestUserDapperPlusRepository : ITestDapperPlusRepository<TestUser, int>
    {
        List<TestUser> GetAllProcedure();
    }
    public class TestUserDapperPlusRepository : TestDapperPlusRepository<TestUser, int>, ITestUserDapperPlusRepository
    {
        public TestUserDapperPlusRepository(ITestDbProvider povider) : base(povider, "user")
        {
 
        }


        protected string _testCreateTable()
        {
            return $@"CREATE TABLE [dbo].[user] ([Id] INT IDENTITY (1, 1) NOT NULL,[value] NVARCHAR (MAX) NULL,PRIMARY KEY CLUSTERED ([Id] ASC))";
        }

 

        //get_all_users

        public List<TestUser> GetAllProcedure()
        {
            //var queryParameters = new DynamicParameters();
            //queryParameters.Add("@parameter1", valueOfparameter1);
            //queryParameters.Add("@parameter2", valueOfparameter2);

            //await db.QueryAsync<YourReturnType>(
            //    "{NameOfStoredProcedure}",
            //    queryParameters,
            //    commandType: CommandType.StoredProcedure)


            var result = default(List<TestUser>);
            _povider.ContextAction(c =>
            {
                result = c.Query<TestUser>(_povider.GetProcedureName("get_all_users"),
                    commandType: CommandType.StoredProcedure).ToList();
            });
            return result;
        }
    }
}