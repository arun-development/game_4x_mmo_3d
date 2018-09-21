using Server.Core.Interfaces;

namespace Server.Core.Infrastructure.Hub
{
    public class HubGroupItem: IHubGroupItem
    {
        public int GroupId { get; set; }
        public string NativeName { get; set; }
        public string GroupeName { get; set; }
        public byte GroupType { get; set; }
        public HubGroupItem() { }

        public HubGroupItem(int groupId, byte groupType, string nativeName, string gropeName)
        {
            GroupId = groupId;
            NativeName = nativeName;
            GroupeName = gropeName;
            GroupType = groupType;
        }

    }
}
