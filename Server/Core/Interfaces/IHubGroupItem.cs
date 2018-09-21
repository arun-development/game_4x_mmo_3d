namespace Server.Core.Interfaces
{
    public interface IHubGroupItem : INativeName
    {
        int GroupId { get; set; }
        string GroupeName { get; set; }
        byte GroupType { get; set; }
    }

    //public interface IMainGameHub: IHub
    //{
    //    //IHubContext 
    //    //resolver.Resolve<IConnectionManager> (). GetHubContext<MessageHub> ()
    //}
}