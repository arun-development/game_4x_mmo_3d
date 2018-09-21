namespace Server.Core
{
    public interface IPostXsrf{
        string __RequestVerificationToken { get; set; }
    }

    public class BasePostXsrf: IPostXsrf
    {
        public string __RequestVerificationToken { get; set; }
    }
}
