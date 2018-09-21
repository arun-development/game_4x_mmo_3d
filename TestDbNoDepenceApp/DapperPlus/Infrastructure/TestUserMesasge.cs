namespace TestDbNoDepenceApp.DapperPlus.Infrastructure
{
    public class TestUserMesasge : TestBaseDataModel<int>
    {
        public int UserId { get; set; }
        public string Message { get; set; }
        public virtual TestUser TestUser { get; set; }
    }
}