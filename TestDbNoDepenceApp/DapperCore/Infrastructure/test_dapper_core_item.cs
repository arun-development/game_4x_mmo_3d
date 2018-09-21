using TestDbNoDepenceApp.DapperPlus.Infrastructure;

namespace TestDbNoDepenceApp.DapperCore.Infrastructure
{
    public class test_dapper_core_item : TestBaseDataModel<int>
    {
        #region Declare

        public string value_1 { get; set; }
        public string value_2 { get; set; }

        #endregion
    }
}