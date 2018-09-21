using System;
using System.Data;
using Server.Core.HubUserModels;
using Server.Core.СompexPrimitive;
using Server.DataLayer;

namespace Server.Services.UserService
{
    public partial class GameUserService
    {
        public ConnectionUser GetHubUser(IDbConnection connection, string authId, bool isOnline)
        {
            var user = GetGameUser(connection, authId);
            if (user == null) throw new ArgumentNullException();
            var allianceUser = _allianceService.GetAllianceUserByUserId(connection, user.Id);
            var alliance = _allianceService.GetAllianceById(connection,allianceUser.AllianceId, false);
            return GetHubUser(connection, user, allianceUser, alliance.Name, isOnline);
        }


        public ConnectionUser GetHubUser(IDbConnection connection, UserDataModel user, AllianceUserDataModel allianceUser, string allianceName, bool isOnline)
        {
            if (user.IsOnline == isOnline) return _setConnectionUser(user, allianceUser, allianceName);
            user = UpdateUserOnlineStatus(connection, user, isOnline);
            return _setConnectionUser(user, allianceUser, allianceName);
        }

        public ConnectionUser SetConnectionUser(IDbConnection connection, UserDataModel user, AllianceUserDataModel allianceUser, string allianceName)
        {
            return _setConnectionUser(user, allianceUser, allianceName);
        }

        public UserDataModel UpdateUserOnlineStatus(IDbConnection connection, int userId, bool isOnline)
        {
            return UpdateUserOnlineStatus(connection, GetGameUser(connection, userId), isOnline);
        }

        public UserDataModel UpdateUserOnlineStatus(IDbConnection connection, UserDataModel user, bool isOnline)
        {
            var time = UnixTime.UtcNow();
            if (user.IsOnline == isOnline) return user;
            user.IsOnline = isOnline;
            if (isOnline) user.DateLastJoin = time;
            else user.DateLastLeft = time;
            return AddOrUpdate(connection,user);
        }

        private static ConnectionUser _setConnectionUser(UserDataModel user, AllianceUserDataModel allianceUser,string allianceName)
        {
            return new ConnectionUser
            {
                AuthId = user.AuthId,
                UserId = user.Id,

                Name = user.Nickname,
                DateLeft = user.DateLastLeft,
                DateJoin = user.DateLastJoin,
                Connected = user.IsOnline,

                AllianceId = allianceUser.AllianceId,
                AllianceUserId = allianceUser.Id,
                AllianceRoleId = allianceUser.RoleId,
                AllianceName = allianceName
            };
        }
    }
}