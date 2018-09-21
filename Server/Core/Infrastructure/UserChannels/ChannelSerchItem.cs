namespace Server.Core.Infrastructure.UserChannels
{
    public class ChannelSerchItem : INameIdModel<int>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsPublic { get; set; }

    }



    public enum ChannelSerchTypes
    {
        All= 1,
        OnlyPublic=2,
        OnlyPrivate= 3
    }
}
