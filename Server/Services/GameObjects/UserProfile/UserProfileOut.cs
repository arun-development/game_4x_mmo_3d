using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Server.Core.Images;
using Server.Core.Interfaces.ForModel;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive.Other;
using Server.Extensions;
using Server.Modules.Localize;
using Server.Modules.Localize.Game.Common;
using Server.Services.HtmlHelpers;
using Server.Services.OutModel;

namespace Server.Services.GameObjects.UserProfile
{
    public abstract class UserProfileSection : IUserProfileSection
    {

        public L10NSimple Title { get; protected set; }
        public string Template { get; protected set; }
        public Dictionary<string, IButtonsView> Buttons { get; protected set; }

        public void SetTemplate(string sectionName)
        {
            Template = UserProfileOut.GetTemplate(sectionName);
        }
    }

    public class UserProfileInfo : UserProfileSection, IUserProfileInfo
    {
        public const string AvatarViewKey = "AvatarViewKey";

        public UserProfileInfo()
        {
            Title = new L10NSimple
            {
                En = "Profile",
                Ru = "Профиль",
                Es = "Perfil"
            };
        }

        [MaxLength(14)]
        public string Name { get; set; }

        public int PvpPoint { get; set; }
        public int TopPosition { get; set; }
        public bool IsCurrentUser { get; set; }


        public int Planets { get; set; }
        public int Wins { get; set; }
        public int Loses { get; set; }

        public int PremiumEndTime { get; set; }
        public UserImageModel Avatar { get; set; }
        public string PersonalDescription { get; set; }
        public bool HasPremium { get; set; }

        public void SetButtons()
        {
            if (IsCurrentUser)
            {
                Buttons = new Dictionary<string, IButtonsView>
                {
                    {"edit", ButtonsView.ConstructorSizeBtn(1, true, Resource.Edit)},
                    {"cancel", ButtonsView.ConstructorSizeBtn(2, true, Resource.Cancel)},
                    {"send", ButtonsView.ConstructorSizeBtn(2, true, Resource.Send)}
                };
            }
        }
    }

    public class UserProfileAlliance : AllianceRatingOut, IUserProfileAlliance
    {
        public bool IsCurrentUser { get; set; }
        public string Template { get; } = UserProfileOut.GetTemplate("alliance");

        public L10NSimple Title { get; } = new L10NSimple
        {
            En = "Alliance",
            Ru = "Альянс",
            Es = "Alianza"
        };

        public UserProfileAlliance(AllianceRatingOut baseItem) :base(baseItem)
        {
        }

        public void SetData(IAllianceRatingOut data, bool isCurrentUser)
        {
            data.ShallowConvert(this);
            IsCurrentUser = isCurrentUser;
        }
    }

    public class UserProfileMeeds : UserProfileSection, IUserProfileMeeds
    {
        public UserProfileMeeds()
        {
            Title = new L10NSimple
            {
                En = "Achievements",
                Ru = "Достижения",
                Es = "Logros"
            };
        }


        public Dictionary<int, Meed> Meeds { get; private set; }

        public void SetMeeds(string dbMeeds)
        {
            Meeds = MeedHelper.GetMeedByDbModel(dbMeeds);
        }

        public void SetMeeds(Dictionary<int, MeedDbModel> dbMeeds)
        {
            Meeds = MeedHelper.GetMeedByDbModel(dbMeeds);
        }
    }

    public class UserProfileChest : UserProfileSection, IUserProfileChest
    {
        public UserProfileChest()
        {
            Title = new L10NSimple
            {
                En = "Chest",
                Ru = "Сундук",
                Es = "Arcón"
            };
        }

        public object Chest { get; set; }
    }

    public class UserProfileOut : IUserProfileOut
    {
        public const string Prefix = "user-profile-";
        public const string RootTemplate = "user-profile-planshet-root" + Directories.Tmpl;

        public int UserId { get; set; }


        public IUserProfileInfo Info { get; set; }
        public IUserProfileAlliance Alliance { get; set; }
        public IUserProfileMeeds Achievements { get; set; }

        //only currentUser data set in client client
        public IUserProfileChest Chest { get; set; }

        public void SetInitialData(bool isCurrenUser)
        {
            Info.IsCurrentUser = isCurrenUser;
            Info.SetTemplate("info");
            Achievements.SetTemplate("achievements");
            Chest.SetTemplate("chest");
            Info.SetButtons();
        }

        public static string GetTemplate(string sectopnNmae)
        {
            return Prefix + sectopnNmae + Directories.Tmpl;
        }
    }
}