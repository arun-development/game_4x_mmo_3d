using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using MoreLinq;
using Server.Core.Infrastructure.Alliance;
using Server.Core.Npc;
using Server.Core.StaticData;
using Server.DataLayer;
using Server.DataLayer.LocalStorageCaches;
using Server.DataLayer.Repositories;

namespace Server.Services.UserService
{
    public partial class AllianceService
    {
        private readonly IAllianceRoleLocalStorageCache _aRolesCache;

        private readonly IAllianceUserLocalStorageCache _aUserCache;
        private readonly IAllianceUserRepository _aUserRepo;
        #region AllianceUser

        public IList<AllianceUserDataModel> GetAllAllianceUsers(IDbConnection connection)
        {
            return _aUserCache.LocalGetAll(connection);
        }

        public IList<TResult> GetAllAllianceUsers<TResult>(IDbConnection connection, Func<AllianceUserDataModel, TResult> selector)
        {
            var users = GetAllAllianceUsers(connection);
            return users.Select(selector).ToList();
        }

        public AllianceUserDataModel AddOrUpdateAllianceUser(IDbConnection connection, AllianceUserDataModel newAllianceUser)
        {
            var newUser = _aUserRepo.AddOrUpdateeModel(connection,newAllianceUser);
            return _aUserCache.UpdateLocalItem(connection,newUser);
        }

        public AllianceUserDataModel GetAllianceUserByUserId(IDbConnection connection, int userId)
        {
            var user = _aUserCache.LocalOperation(connection,col => { return col?.FirstOrDefault(i => i.UserId == userId); });
            if (user != null) return user;

            var dbAallianceUsers =  _aUserRepo.GetAllianceUsersByUserId(connection, userId).ToList();
            if (!dbAallianceUsers.Any()) throw new ArgumentNullException(nameof(user), Error.AllianceUserNotExist);
            if (dbAallianceUsers.Count != 1) throw new NotImplementedException();
            var au = _aUserRepo.ConvertToWorkModel(dbAallianceUsers.First());
            user = _aUserCache.UpdateLocalItem(connection,au);
            if (user == null) throw new NotImplementedException();
            return user;
        }

        public AllianceUserDataModel GetAllianceUserByAidUId(IDbConnection connection, int allianceId, int userId)
        {
            var user = GetAllianceUserByUserId(connection, userId);
            if (user.AllianceId != allianceId) throw new NotImplementedException(Error.NotPermitted);
            return user;
        }

        /// <summary>
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="allianceUserId">Id Таблицы allianceUser</param>
        /// <param name="checkForNull"></param>
        /// <returns></returns>
        public AllianceUserDataModel GetAllianceUserById(IDbConnection connection, int allianceUserId, bool checkForNull = true)
        {
            var user = _aUserCache.GetById(connection,allianceUserId, true);
            if (user == null && checkForNull) throw new ArgumentNullException(nameof(user), Error.NoData);
            return user;
        }


        public IList<AllianceUserDataModel> GetAllianceUsers(IDbConnection connection, int allianceId)
        {
            return _aUserCache.LocalWhereList(connection,i => i.AllianceId == allianceId);
        }

        #region AllianceUserRole

        public AllianceUserDataModel UpdateUserRole(IDbConnection connection, int currentUserId, int allianceId, int targetUserId, byte targetRoleId, int? targetAllianceUserId = null)
        {
            // int targetUserId, byte targetRoleId
            if (targetUserId == currentUserId || targetRoleId == (byte) AllianceRoles.Creator)
                throw new ArgumentException(Error.AllianceRoleNotChanged);

            AllianceUserDataModel au;
            if (targetAllianceUserId != null) au = GetAllianceUserById(connection,(int) targetAllianceUserId);

            else au = GetAllianceUserByUserId(connection, targetUserId);

            if (allianceId != au.AllianceId) throw new ArgumentException(Error.NotPermitted);
            if (targetRoleId == au.RoleId) throw new ArgumentException(Error.AllianceRoleNotChanged);
            if (au.RoleId == (byte) AllianceRoles.Creator) throw new ArgumentException(Error.NotPermitted);
            au.RoleId = targetRoleId;
            return AddOrUpdateAllianceUser(connection,au);
        }

        public IList<AllianceRoleDataModel> CreateRoles(IDbConnection connection)
        {
            var roles = AllianceRoleHelper.Roles;
            var localRoles = roles.Select(i => i.Value).ToList();
            var dbRoles = _aRolesRepo.GetAllModels(connection);
            var rolesToSet = localRoles.ExceptBy(dbRoles, i=> i.Id).ToList();
            if (!rolesToSet.Any()) return localRoles;

            foreach (var role in rolesToSet)
                AddOrUpdateAllianceRole(connection, role);
            return localRoles;
        }

        public AllianceRoleDataModel AddOrUpdateAllianceRole(IDbConnection connection, AllianceRoleDataModel dataModel)
        {
            return _aRolesCache.UpdateLocalItem(connection,_aRolesRepo.AddOrUpdateeModel(connection,dataModel));
        }


        public AllianceUserDataModel CreateStartAllianceUser(IDbConnection connection, UserDataModel user, int toAllianceId = (int) NpcAllianceId.Confederation)
        {
            var au = new AllianceUserDataModel
            {
                AllianceId = toAllianceId,
                DateCreate = user.DateCreate,
                RoleId = (byte) AllianceRoles.Recrut,
                UserId = user.Id
            };
            var newAu = AddOrUpdateAllianceUser(connection,au);

            return newAu;
        }

        #endregion

        #endregion
    }
}