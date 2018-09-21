namespace Server.Core.Npc
{

    public enum NpcAllianceId
    {
        Skagry = 1,
        Confederation = 2
    }
    public interface INpc
    {
        string GetSkagryName();
        string GetConfederationName();

        int GetConfederationUserId();
        int GetNpcGameUserId();
    }
}
