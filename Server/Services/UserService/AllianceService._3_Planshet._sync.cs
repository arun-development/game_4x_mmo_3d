using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Infrastructure.Alliance;
using Server.Core.Interfaces.ForModel;
using Server.Core.Interfaces.UserServices;
using Server.Core.Npc;
using Server.Core.Pager;
using Server.Core.StaticData;
using Server.DataLayer;
using Server.Services.OutModel;

namespace Server.Services.UserService
{
    public partial class AllianceService
    {
        public IPlanshetViewData Initial(IDbConnection connection, AllianceUserDataModel currentAllianceUser, IGameUserService profileService)
        {
            var userId = currentAllianceUser.UserId;
            var allianceId = currentAllianceUser.AllianceId;
            var allianses = GetAlliancesByRating(connection, i => i);
            var allianceRattings = new List<IAllianceRatingOut>();
            foreach (var i in allianses) allianceRattings.Add(SetAllianceRating(connection,i, true, profileService));
            var dataSerch = new TabAllianceSerchOut {Collection = allianceRattings};
            dataSerch.AddAlianceButtons(allianceId);

            var userAlliance = _getMyAllianceFromRattingTab(connection, dataSerch.Collection, userId, allianceId, profileService);
            var role = AllianceRoleHelper.GetByRoleId(currentAllianceUser.RoleId);
            userAlliance.AllianceTechesOut = GetAllianceTechesOut(connection, userAlliance.Id, role);
            var manageAlliance = _getManageTab(connection, currentAllianceUser, role);
            var tabs = AllianceOut.InitialTabs(dataSerch, userAlliance, manageAlliance, _localizer);
            return tabs;
        }

        public List<TResult> GetAlliancesByRating<TResult>(IDbConnection connection, Func<AllianceDataModel, TResult> selector)
        {
            return _aCache.LocalOperation(connection,col =>
            {
                return col
                    .Where(i => i.Id >= 1000)
                    .OrderByDescending(i => i.PvpRating)
                    .Take(PagerDefaults.MaxItemInStack)
                    .Select(selector)
                    .ToList();
            });
        }


        public List<TResult> GetAlliancesByRating<TResult>(IDbConnection connection, int pvpPoint, int skip, Func<AllianceDataModel, TResult> selector)
        {
            return _aCache.LocalOperation(connection,col =>
            {
                return col
                    .Where(i => i.Id >= 1000)
                    .OrderByDescending(i => i.PvpRating)
                    .Skip(skip)
                    .Where(i => i.PvpRating <= pvpPoint)
                    .Take(PagerDefaults.MaxItemInStack)
                    .Select(selector)
                    .ToList();
            });
        }

        public IAllianceRatingOut SetAllianceRating(IDbConnection connection, AllianceDataModel allianceDataModel, bool setButtons, IGameUserService gameUserService)
        {
            var alliance = new AllianceRatingOut(allianceDataModel);
            alliance.Pilots = _aUserCache.LocalOperation(connection,col =>
            {
                return col.Count(i => i.AllianceId == allianceDataModel.Id);
            });

            alliance.ControlledPlanet = _planetDetailCache.LocalOperation(connection,col =>
            {
                return col.Count(i => i.AllianceId == allianceDataModel.Id);
            });
            alliance.LeaderImg = gameUserService.GetUserAvatar(connection, allianceDataModel.CreatorId);

            if (setButtons) alliance.SetComplexButtonView();
            return alliance;
        }

        public IAllianceUserRequests GetAllianceUserRequests(IDbConnection connection, AllianceUserDataModel allianceUserManager, AllianceRoleDataModel role = null)
        {
            if (role == null) role = AllianceRoleHelper.GetByRoleId(allianceUserManager.RoleId);
            if (!role.AcceptNewMembers) return null;
            var aur = new AllianceUserRequests(MessageSourceType.IsAlliance)
            {
                Requests = GetRequestsAllianceForAllianceManage(connection,allianceUserManager, role)
            };
            aur.SetComplexButtonView();
            return aur;
        }


        private TabMyAllianceOut _getMyAllianceFromRattingTab(IDbConnection connection, IEnumerable<IAllianceRatingOut> alliances, int userId, int userAllianceId, IGameUserService gameUserService)
        {
            var ma = alliances.FirstOrDefault(i => i.Id == userAllianceId) ??
                     SetAllianceRating(connection,GetAllianceById(connection,userAllianceId, i => i), true, gameUserService);
            if (ma == null) throw new ArgumentNullException(nameof(ma), Error.AllianceNotExist);

            var myAlliance = new TabMyAllianceOut((AllianceRatingOut) ma);
            //ma.ShallowConvert(myAlliance);
            myAlliance.AddButtons(userAllianceId, 1);
            myAlliance.AllianceMembers = _getAllianceMembers(connection,userId, userAllianceId, gameUserService);
            if (userAllianceId == (int) NpcAllianceId.Confederation)
                myAlliance.AllianceUserRequests = GetRequestsAllianceForMyAlliance(connection,userId);

            return myAlliance;
        }

        private AllianceMembers _getAllianceMembers(IDbConnection connection, int userId, int userAllianceId, IGameUserService gameUserService)
        {
            var allianceMembers = new AllianceMembers();
            var allianceUsers = GetAllianceUsers(connection,userAllianceId);
            var members = new List<AllianceMember>();
            foreach (var a in allianceUsers)
            {
                var user = gameUserService.GetGameUser(connection, a.UserId);
                var member = new AllianceMember
                {
                    AllianceUserId = a.Id,
                    UserId = a.UserId,
                    UserName = user.Nickname,
                    OnlineStatus = user.IsOnline,
                    UserPvp = user.PvpPoint,
                    Role = new AllianceRole(a.RoleId)
                };
                members.Add(member);
            }


            allianceMembers.CurrentUserRoleName =
                members.Where(i => i.UserId == userId).Select(i => i.Role.RoleName).First();
            allianceMembers.Members = members;
            allianceMembers.SetComplexButtonView();
            return allianceMembers;
        }

        private TabAllianceManageOut _getManageTab(IDbConnection connection, AllianceUserDataModel currentUserAllianceMember, AllianceRoleDataModel role)
        {
            var manageAlliance = new TabAllianceManageOut();
            if (role.Id == (byte) AllianceRoles.Creator) manageAlliance.CanDeleteAlliance = true;
            manageAlliance.AllianceUserRequests = GetAllianceUserRequests(connection,currentUserAllianceMember, role);
            return manageAlliance;
        }
    }
}