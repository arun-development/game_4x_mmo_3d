namespace Server.EndPoints.Hubs.GameHub
{
    public enum HubGroupPrefix
    {
        Confederation1 = 1,
        Confederation2 = 2,
        Confederation3 = 3,
        Confederation4 = 4,
        Alliance = 1000,
        RecrutManager = 2000,
        Private = 3000,
        Group = 4000
    }

    public enum HubGroupTypes : byte
    {
        System = 1,
        Alliance = 2,
        Chat = 4,
        Channel = 5
    }
}