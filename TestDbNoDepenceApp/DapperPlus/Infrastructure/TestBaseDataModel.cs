using System.ComponentModel.DataAnnotations;

namespace TestDbNoDepenceApp.DapperPlus.Infrastructure
{
    public interface ITestDataModel<TKeyType> where TKeyType : struct
    {
        TKeyType Id { get; set; }
        bool IsNewDataModel();
    }
    public abstract class TestBaseDataModel<TKeyType> : ITestDataModel<TKeyType> where TKeyType : struct
    {
        [Required]
 
        public virtual TKeyType Id { get; set; }

        public virtual bool IsNewDataModel()
        {
            return Id.Equals(default(TKeyType));
        }
    }
}