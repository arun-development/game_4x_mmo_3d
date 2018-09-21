using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security;
using Server.Core.Infrastructure.Alliance;
using Server.Core.Interfaces;
using Server.Core.Npc;
using Server.Core.StaticData;
using Server.DataLayer;
using Server.ServicesConnected.AzureStorageServices.ImageService;

namespace Server.Services.UserService
{
    public partial class AllianceService
    {
        public AllianceUserDataModel LeaveFromAlliance(IDbConnection connection, int userId, bool fromNpc)
        {
            var allianceUser = GetAllianceUserByUserId(connection, userId);
            return _leaveFromAlliance(connection, allianceUser, fromNpc);
        }

        public AllianceUserDataModel LeaveFromAlliance(IDbConnection connection, AllianceUserDataModel beforeLeaveAllianceUser, bool fromNpc)
        {
            return _leaveFromAlliance(connection, beforeLeaveAllianceUser, fromNpc);
        }

        public void JoinToConfederation(IDbConnection connection, int userId, bool isCurrentUser)
        {
            throw new NotSupportedException(Error.NotUsedServerMethod);
        }


        public Dictionary<OldNewAllianceKeys, object> DisbandAlliance(IDbConnection connection, int userId, int allianceId)
        {
       
            var oldAlliance = GetAllianceById(connection, allianceId, false);
            if (oldAlliance == null) throw new NullReferenceException(Error.AllianceNotExist);
            if (oldAlliance.CreatorId != userId) throw new SecurityException(Error.NotPermitted);
            var oldUsers = GetAllianceUsers(connection, allianceId);
            var oldNew = new Dictionary<OldNewAllianceKeys, object>();
            var armIds = _armRepo.GetRequestMessages(connection, allianceId, (byte)MessageSourceType.IsAlliance, (byte)MessageSourceType.IsUser).Select(i => i.Id).ToList();
            _aRepo.DisbandAllianceProcedure(connection, allianceId);
            _aCache.DeleteItem(allianceId);
            _aTechCahce.DeleteItem(allianceId);
            _channelService.DeleteAllianceChannel(connection, allianceId);

            var oldFleetIds = _aFleetCache.LocalOperation(connection, col =>
            {
                return col.Where(i => i.AllianceId == allianceId).Select(i => i.Id).ToList();
            });
            if (oldFleetIds.Any()) _aFleetCache.DeleteItems(oldFleetIds);

            _aNameSercher.RemoveItem(connection, oldAlliance.Name, _aCache);


            if (armIds.Any()) _armCache.DeleteItems(armIds);
            var oldAuIds = oldUsers.Select(i => i.Id).ToList();
            _aUserCache.DeleteItems(oldAuIds);

            var aUserIds = oldUsers.Select(i => i.UserId);
            var newAllianceUsers = aUserIds.Select(aUserId => GetAllianceUserByUserId(connection, aUserId)).ToList();

            var newAlliance = GetAllianceById(connection, (int)NpcAllianceId.Confederation, false);

            oldNew.Add(OldNewAllianceKeys.OldAlliacne, oldAlliance);
            oldNew.Add(OldNewAllianceKeys.OldAllianceUsers, oldUsers);
            oldNew.Add(OldNewAllianceKeys.NewAlliacne, newAlliance);
            oldNew.Add(OldNewAllianceKeys.NewAllianceUsers, newAllianceUsers);

            _channelService.SetUsersToNpcAlliance(connection, newAllianceUsers, (connections, channel) =>
            {
                oldNew.Add(OldNewAllianceKeys.NewChannelConnections, connections);
                oldNew.Add(OldNewAllianceKeys.NewChannel, channel);
            });

            return oldNew;
        }

        public AllianceDataModel CreateAlliance(IDbConnection connection, string allianceName, int userId, string userName)
        {
            return CreateAlliance(connection, _createAllianceModel(allianceName, userId, userName));
        }

        public AllianceDataModel CreateAlliance(IDbConnection connection, AllianceDataModel allianceData)
        {
            var oldUser = GetAllianceUserByUserId(connection, allianceData.CreatorId);
            return _createAlliance(connection, allianceData, oldUser);
        }


        public AllianceUserDataModel LeaveFromNpcAndJoinToUserAlliance(IDbConnection connection, int oldAllianceUserId, int newAllianceId)
        {
            var oldAllianceUser = GetAllianceUserById(connection,oldAllianceUserId);
            DeleteRequestForUserToAlliance(connection,oldAllianceUser.UserId, newAllianceId);
            if (oldAllianceUser.AllianceId != (int) NpcAllianceId.Confederation)
                throw new NotImplementedException(nameof(oldAllianceUser.AllianceId));
            var userId = oldAllianceUser.UserId;
            _leaveFromAlliance(connection, oldAllianceUser, true);
            var newAllianceUser = _joinToUserAlliance(connection, userId, newAllianceId);
            return newAllianceUser;
        }

        public bool CheckNameIsUnic(IDbConnection connection, string allianceName)
        {
            if (allianceName == null) throw new Exception(Error.AllianceNameNotValid);
            allianceName.ValidateAllianceName();

            var alliance = GetAllianceNameObj(connection,allianceName);
            return alliance == null;
        }


        public Dictionary<string, object> CreateUserAlliance(IDbConnection connection, string newAllianceName, AllianceUserDataModel oldCurrentAllianceUser, string currentUserName, IStoreService storeService)
        {
            if (oldCurrentAllianceUser.AllianceId != (int) NpcAllianceId.Confederation)
                throw new Exception(Error.YouInAlliance);
 
            var name = newAllianceName.ToUpper();
            name.ValidateAllianceName();
            var currentUserId = oldCurrentAllianceUser.UserId;

            var balance = storeService.BalanceCalcResultCc(connection, currentUserId, AllianceHelper.CreatePrice);
            AllianceDataModel newAlliance;

            try
            {
                var existAlliance = GetAllianceNameObj(connection, name);
                if (existAlliance != null) throw new Exception(Error.AllianceNameNotUnic);
                var am = _createAllianceModel(name, currentUserId, currentUserName);
                newAlliance = _createAlliance(connection, am, oldCurrentAllianceUser);
                if (newAlliance.Id == 0) throw new NotImplementedException("unknown");
            }
            catch (Exception e)
            {
                storeService.BalanceGetCc(connection, currentUserId);
                throw new Exception(e.Message, e);
            }
            var newBalance = storeService.AddOrUpdateBalance(connection, balance);
            var result = new Dictionary<string, object>();
            result["NewBalanceCc"] = newBalance.Quantity;
            result["NewAlliance"] = newAlliance;
            var password = Guid.NewGuid().ToString();
            result["NewChannel"] = _channelService.CreateAllianceChannel(connection, newAlliance, password);

            return result;
        }

        private AllianceUserDataModel _joinToUserAlliance(IDbConnection connection, int newUserId, int allianceId, byte roleId = (byte) AllianceRoles.Recrut)
        {
            var user = new AllianceUserDataModel
            {
                AllianceId = allianceId,
                DateCreate = DateTime.UtcNow,
                RoleId = roleId,
                UserId = newUserId
            };

            return AddOrUpdateAllianceUser(connection,user);
        }

        private AllianceUserDataModel _leaveFromAlliance(IDbConnection connection, AllianceUserDataModel allianceUser, bool fromNpc)
        {
            if (allianceUser == null) throw new NullReferenceException(Error.AllianceUserNotExist);
            var npcId = (int) NpcAllianceId.Confederation;
            if (fromNpc && allianceUser.AllianceId == npcId)
            {
                //пользователь верменно не находистя ни в каком альянсе для создания своего альянса
                _aUserRepo.LeaveUserFromAlliance(connection,allianceUser.AllianceId, allianceUser.UserId, false);

                //todo  проверить на наличие флотов у пользователя и отменить 

                _aUserCache.DeleteItem(allianceUser.Id);

                return null;
            }
            else if (!fromNpc && allianceUser.AllianceId != npcId)
            {
                _aUserCache.DeleteItem(allianceUser.Id);
                var updatedUser = _aUserRepo.LeaveUserFromAlliance(connection,allianceUser.AllianceId, allianceUser.UserId, true);
                return AddOrUpdateAllianceUser(connection,updatedUser);
            }
            throw new NotImplementedException(Error.NotPermitted);
        }

        private AllianceDataModel _createAllianceModel(string allianceName, int userId, string userName)
        {
            var aNAme = allianceName.ToUpper();
            return new AllianceDataModel
            {
                CreatorId = userId,
                DateCreate = DateTime.UtcNow,
                CreatorName = userName,
                Images = Label.DefaultUrls(),
                Name = allianceName.ToUpper(),
                PvpRating = 0,
                Tax = 15,
                Description = aNAme + " is..."
            };
        }

        private AllianceDataModel _createAlliance(IDbConnection connection, AllianceDataModel allianceData, AllianceUserDataModel oldUser)
        {
            try
            {
                _leaveFromAlliance(connection, oldUser, true);
                return AddOrUpdate(connection, allianceData);
            }
            catch (Exception)
            {
                // todo  если не получилось возвращаем пользователя в нпц альянс
                throw;
            }
        }
    }
}