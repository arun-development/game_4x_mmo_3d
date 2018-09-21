using System.Collections.Generic;
using Server.Core.Images;
using Server.Core.СompexPrimitive.Other;
using Server.Modules.Localize;

namespace Server.Core.Interfaces.ForModel
{
    public interface IUserProfileSection
    {
        L10NSimple Title { get; }
        string Template { get; }
        Dictionary<string, IButtonsView> Buttons { get; }
        void SetTemplate(string sectionName);
    }

    public interface IUserProfileInfo : IUserProfileSection
    {
        string Name { get; set; }

        int PvpPoint { get; set; }
        int TopPosition { get; set; }
        bool IsCurrentUser { get; set; }


        int Planets { get; set; }
        int Wins { get; set; }
        int Loses { get; set; }

        int PremiumEndTime { get; set; }
        UserImageModel Avatar { get; set; }
        string PersonalDescription { get; set; }
        bool HasPremium { get; set; }
        void SetButtons();
    }


    public interface IUserProfileAlliance : IAllianceRatingOut
    {
        bool IsCurrentUser { get; set; }
        string Template { get; }
        L10NSimple Title { get; }
        void SetData(IAllianceRatingOut data, bool isCurrentUser);
    }

    public interface IUserProfileMeeds : IUserProfileSection
    {
        Dictionary<int, Meed> Meeds { get; }
        void SetMeeds(string dbMeeds);
        void SetMeeds(Dictionary<int, MeedDbModel> dbMeeds);
    }

    public interface IUserProfileChest : IUserProfileSection
    {
        object Chest { get; set; }
    }

    public interface IUserProfileOut
    {
        int UserId { get; set; }

        IUserProfileInfo Info { get; set; }
        IUserProfileAlliance Alliance { get; set; }
        IUserProfileMeeds Achievements { get; set; }


        IUserProfileChest Chest { get; set; }
    }
}