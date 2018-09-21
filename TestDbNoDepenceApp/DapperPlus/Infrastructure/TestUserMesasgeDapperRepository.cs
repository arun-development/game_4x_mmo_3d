using System.Collections.Generic;
using System.Data;
using System.Linq;
using Dapper;
using Z.Dapper.Plus;

namespace TestDbNoDepenceApp.DapperPlus.Infrastructure
{
    public interface ITestUserMesasgeDapperPlusRepository : ITestDapperPlusRepository<TestUserMesasge, int>
    {
        List<TestUserCustomMessage> GetUserMessagesProcedure(int userId);
    }
    public class TestUserMesasgeDapperPlusRepository : TestDapperPlusRepository<TestUserMesasge, int>,
        ITestUserMesasgeDapperPlusRepository
    {
        public TestUserMesasgeDapperPlusRepository(ITestDbProvider provider) : base(provider, "userMessage")
        {
            DapperPlusManager.Entity<TestUserMesasge>().Table(_tableName).Identity(x => x.Id);
        }

        protected string _testCreateTable()
        {
            //    public int UserId { get; set; }
            //public string Message { get; set; }
            return $@"CREATE TABLE [dbo].[userMessage](
                    [Id] INT IDENTITY (1, 1) NOT NULL, 
                        [UserId] INT NULL, 
                        [Message] NVARCHAR(MAX) NULL, 
                        CONSTRAINT [PK_userMessage] PRIMARY KEY ([Id]),
                    	CONSTRAINT [FK_userMessage_user] FOREIGN KEY ([UserId]) REFERENCES [dbo].[user] ([Id]) ON DELETE CASCADE
                    )";
        }

 

        public List<TestUserCustomMessage> GetUserMessagesProcedure(int userId)
        {
            var r = default(List<TestUserCustomMessage>);
            var p = new DynamicParameters();
            p.Add("@userId", userId);
            //UserValue
            _povider.ContextAction(c =>
            {
                r = c.Query<TestUserCustomMessage>(_povider.GetProcedureName("get_custom_user_messages"), p,
                    commandType: CommandType.StoredProcedure).ToList();
            });
            return r;
        }
    }
}