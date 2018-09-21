using System.Collections.Generic;

namespace TestDbNoDepenceApp.DapperPlus.Infrastructure
{
    public class TestUser : TestBaseDataModel<int>
    {
        public string Value { get; set; }
        public virtual List<TestUserMesasge> Messages { get; set; }
 
}
}