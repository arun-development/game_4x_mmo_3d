namespace Server.Core.StaticData
{
    public enum MaxLenghtConsts
    {
        DefaultDescription = 3000,
        AllianceDescription = 3000,
        PersonalInfoDescription = 3000,
        DbDescriptionMax = 4000,
        DescriptionLangDescriptionMax = 1000,
        DescriptionLangNameMax = 50,
        ChannelMessage = 3000,
        ChannelPassword = 14,
        UniqueName = 14,
        AllianceName = UniqueName,
        PlanetName = UniqueName,
        UserName = UniqueName,
        ChannelName = UniqueName,
        ChannelNameDbMax = 50,
        ChannelNamePrivate = ChannelNameDbMax,

        UserImagesDbMax = 1000,
        PropertyName = 50,
        PasswordDbMax = 50,
        Vector3Double = 100,
        GroupChannelsLimit = 20,
        MaxOfficerCandidates =10


    }
    public enum MinLenghtConsts
    {
        UserImageUrlsMin = 203,
        UserImagesIcon = 42,//60-cdn
        GameUserName = 4,
        UserPassword = 6,
        AllianceName = GameUserName,
        ChannelName = GameUserName,
        PlaneetName = 3,
        SerchChannelName = 3
    }
}
