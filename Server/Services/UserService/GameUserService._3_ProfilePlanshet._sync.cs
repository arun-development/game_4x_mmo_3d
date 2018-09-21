using System;
using System.Data;
using Microsoft.Extensions.DependencyInjection;
using Server.Core.Interfaces.ForModel;
using Server.Core.Interfaces.UserServices;
using Server.Core.StaticData;
using Server.DataLayer;
using Server.Services.GameObjects.UserProfile;
using Server.Services.HtmlHelpers;
using Server.Services.OutModel;

namespace Server.Services.UserService
{
    public partial class GameUserService
    {
        public IPlanshetViewData GetUserPlanshetProfile(IDbConnection connection, string userName, int currentUserId, bool setAlliance)
        {
            return GetUserPlanshetProfile(connection,GetGameUserByName(connection, userName), currentUserId, setAlliance);
        }

        public IPlanshetViewData GetUserPlanshetProfile(IDbConnection connection, int userId, int currentUserId, bool setAlliance)
        {
            return GetUserPlanshetProfile(connection,GetGameUser(connection, userId), currentUserId, setAlliance);
        }

        public IPlanshetViewData GetUserPlanshetProfile(IDbConnection connection, UserDataModel user, int currentUserId, bool setAlliance)
        {
            return SetUserPlanshetProfile(_getUserProfile(connection,user, currentUserId, setAlliance));
        }


        public IPlanshetViewData GetUserPlanshetProfile(IDbConnection connection, int userId, int allianceId, IPlanshetViewData allianceModel,
            bool isCurrentUser)
        {
            if (!isCurrentUser) return GetUserPlanshetProfile(connection,userId, userId, true);

            var planshetProfile = GetUserPlanshetProfile(connection,userId, userId, false);
            var profile = planshetProfile.Bodys[0].TemplateData as UserProfileOut;
            if (profile == null) throw new NullReferenceException(Error.NoData);


            var r = (AllianceRatingOut) allianceModel.Bodys[1].TemplateData;
            profile.Alliance = new UserProfileAlliance(r) {IsCurrentUser = true};
            //profile.Alliance = new UserProfileAlliance
            //{
            //    Id = r.Id,
            //    Name = r.Name,
            //    AllianceDescription = r.AllianceDescription,
            //    Buttons = r.Buttons,
            //    ComplexButtonView = r.ComplexButtonView,
            //    ControlledPlanet = r.ControlledPlanet,
            //    HasButtons = r.HasButtons,
            //    Label = r.Label,
            //    LeaderImg = r.LeaderImg,
            //    LeaderName = r.LeaderName,
            //    Pilots = r.Pilots,
            //    PvpPoint = r.PvpPoint,
            //    Tax = r.Tax,
            //    IsCurrentUser = true
            //};
            return planshetProfile;
        }


        public IPlanshetViewData SetUserPlanshetProfile(IUserProfileOut profile)
        {
            return PlanshetBodyHelper.SetBody(profile, "tr_Profile", "user_profile_" + profile.UserId,
                UserProfileOut.RootTemplate, UserProfileOut.RootTemplate);
        }


        private UserProfileOut _getUserProfile(IDbConnection connection, UserDataModel user, int currentUserId, bool setAlliance)
        {
            var planets = _planetService.GetUserPlanetIds(connection, user.Id);
            var userProfile = new UserProfileOut
            {
                UserId = user.Id,
                Info = new UserProfileInfo
                {
                    Name = user.Nickname,
                    Avatar = user.Avatar,
                    Loses = 0,
                    PersonalDescription = user.Description,
                    PremiumEndTime = 0,
                    PvpPoint = user.PvpPoint,
                    Planets = planets.Count
                },
                Chest = new UserProfileChest()
            };

            userProfile.Info.TopPosition = GetTopPosition(connection, userProfile.UserId, userProfile.Info.PvpPoint);
            var achievements = new UserProfileMeeds();
            achievements.SetMeeds(user.MeedsQuantity);
            userProfile.Achievements = achievements;

            var isCurrentUser = userProfile.UserId == currentUserId;


            if (setAlliance)
            {
                var allianceUser = _allianceService.GetAllianceUserByUserId(connection, user.Id);
                if (allianceUser != null)
                {
                    var allianceDataModel = _allianceService.GetAllianceById(connection, allianceUser.AllianceId, i => i);
                    var allianceRating = _allianceService.SetAllianceRating(connection,allianceDataModel, false, this);

                    userProfile.Alliance = new UserProfileAlliance((AllianceRatingOut) allianceRating)
                    {
                        IsCurrentUser = isCurrentUser
                    };
                }
            }


            var wins = -1;
            var loses = -1;


            var reportService = _svp.GetService<IUReportService>();
            reportService.SetLoseAndWin(connection, userProfile.UserId, (outWins) => { wins = outWins; },
                (outLoses) => { loses = outLoses; });

            if (wins == -1 || loses == -1) throw new NotImplementedException("DataNotSet wins and  loses");
            userProfile.Info.Wins = wins;
            userProfile.Info.Loses = loses;

            userProfile.SetInitialData(isCurrentUser);
            return userProfile;
        }
    }
}