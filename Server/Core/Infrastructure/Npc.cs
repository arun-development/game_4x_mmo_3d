using Server.Core.Npc;

namespace Server.Core.Infrastructure
{
    public class Npc : INpc
    {
        public const string SkagyName = "SKAGRY";
        public const string ConfederationName = "CONFEDERATION";

        public const int SkagryGameUserId =(int) NpcAllianceId.Skagry;
        public const int ConfederationGameUserId = (int)NpcAllianceId.Confederation;
        public const int NpcMaxId = 2;

        public string GetSkagryName()
        {
            return SkagyName;
        }

        public string GetConfederationName()
        {
            return ConfederationName;
        }

        public int GetConfederationUserId()
        {
            return ConfederationGameUserId;
        }

        public int GetNpcGameUserId()
        {
            return SkagryGameUserId;
        }
    }
}
