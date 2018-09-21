using System;
using System.Data;
using System.Linq;
using System.Security;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
 
using Server.Core.HubUserModels;
using Server.Core.Infrastructure.Alliance;
using Server.Core.Interfaces.ForModel;
using Server.Core.Npc;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.DataLayer;

namespace Server.EndPoints.Hubs.GameHub
{
    public partial class MainGameHub
    {
        /// <summary>
        /// </summary>
        /// <param name="messageModel"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <exception cref="Exception">Error.UserConnectionNotUnic (target user)</exception>
        /// <returns></returns>
        public async Task<AllianceMessageModelExt> RequestAllianceFromAllianceManageAddMessage(
            AllianceMessageModelExt messageModel)
        {
            var cid = Context.ConnectionId;
            return await _contextActionAsync(async connection =>
            {

 
                var data = _requestAllianceFromAllianceManageAddMessage(connection, messageModel);
                var targetUser = _getOnlineSingleUser(connection, data.MessageModel.Model.ToId);
                if (targetUser != null && targetUser.Connected)
                {
                    await Clients.Client(targetUser.ConnectionId).InvokeAsync("requestAllianceAddMessageToMyAlliance", data.MessageModel);
                }


                var sourceUser = _getCurrentUser(connection);
                var groupName = sourceUser.CreateAllianceGroupName();



                try
                {
                    await Groups.RemoveFromGroupAsync(cid, groupName);
                    await Clients.Group(data.GroupName).InvokeAsync("requestAllianceAddMessageToAllianceManage", data);

                }
                finally
                {
                    await Groups.AddToGroupAsync(cid, groupName);
                }




                return data.MessageModel;
            });
        }

        /// <summary>
        /// </summary>
        /// <param name="messageModel"></param>
        /// <exception cref="ArgumentNullException">Error.InputDataIncorrect</exception>
        /// <exception cref="NotImplementedException">messageModel.Model.CreatorIcon not exist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <exception cref="InvalidOperationException">Error.YouInAlliance</exception>
        /// <exception cref="SecurityException">Error.IsNotCurrentUser</exception>
        /// <returns></returns>
        public async Task<AllianceMessageModelExt> RequestAllianceFromMyAllianceAddMessage(
            AllianceMessageModelExt messageModel)
        {
            return await _contextActionAsync(async connection =>
            {
                if (messageModel?.Model == null)
                {
                    throw new ArgumentNullException(Error.InputDataIncorrect);
                }
                if (string.IsNullOrWhiteSpace(messageModel.Model.CreatorIcon))
                {
                    throw new NotImplementedException(nameof(messageModel.Model.CreatorIcon));
                }

                var cr = _getLocalUser(Context.ConnectionId);
                if (cr.AllianceId != (int)NpcAllianceId.Confederation)
                {
                    throw new InvalidOperationException(Error.YouInAlliance);
                }
                if (cr.UserId != messageModel.Model.FromId || cr.Name != messageModel.Model.FromName)
                {
                    throw new SecurityException(Error.IsNotCurrentUser);
                }

                messageModel.Model.SourceType = MessageSourceType.IsUser;
                messageModel.Model.DateCreate = UnixTime.UtcNow();
                messageModel.Model = _allianceService.AddArmItem(connection, messageModel.Model);
                var groupName = ConnectionUserExtension.CreateAllianceRecrutManagerGroupName(messageModel.Model.ToId);
                await Clients.Group(groupName).InvokeAsync("requestAllianceAddMessageToAllianceManage", messageModel);
                return messageModel;
            });
        }


        /// <summary>
        /// </summary>
        /// <param name="messageModel"></param>
        /// <exception cref="ArgumentNullException">Error.InputDataIncorrect</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <exception cref="SecurityException">Error.NotPermitted message alliance id is not equal</exception>
        /// <exception cref="SecurityException">Error.NotPermitted not has role to manage</exception>
        /// <exception cref="ArgumentException">target user Error.UserInAlliance</exception>
        /// <returns></returns>
        public async Task<AllianceMessageModelExt> RequestAllianceConfirmAcceptFromAllianceManage(
            AllianceMessageModelExt messageModel)
        {
            _tryCatch(() =>
            {
                if (messageModel == null)
                {
                    throw new ArgumentNullException(Error.InputDataIncorrect, nameof(messageModel));
                }
                if (messageModel.Model.ToId == 0)
                {
                    throw new NotImplementedException(nameof(messageModel.Model.ToId));
                }
            });
            return await _contextActionAsync(async connection =>
            {
                var tergetAllianceUser = _allianceService.GetAllianceUserByUserId(connection, messageModel.Model.ToId);

                if (tergetAllianceUser.AllianceId != (int)NpcAllianceId.Confederation)
                {
                    var curUserManager = _getLocalUser(Context.ConnectionId);
                    if (messageModel.AllianceRoleId == 0 || messageModel.AllianceUserId == 0)
                    {
                        throw new InvalidOperationException(Error.NotPermitted);
                    }
                    if (curUserManager.AllianceId != messageModel.Model.FromId)
                    {
                        throw new SecurityException(Error.NotPermitted);
                    }
                    var role = AllianceRoleHelper.GetByRoleId(curUserManager.AllianceRoleId);
                    if (!role.AcceptNewMembers)
                    {
                        throw new SecurityException(Error.NotPermitted);
                    }
                    var crGroupName = curUserManager.CreateAllianceRecrutManagerGroupName();
                    if (!curUserManager.HasGroup(crGroupName))
                    {
                        throw new NotImplementedException(Error.UserNotHasHubGroup);
                    }

                    _allianceService.DeleteAllianceRequestsByManager(connection, curUserManager.AllianceId,
                        messageModel.Model.ToId, role.AcceptNewMembers);


                    var cid = curUserManager.ConnectionId;
                    try
                    {
                        await Groups.RemoveFromGroupAsync(cid, crGroupName);
                        await Clients.Group(crGroupName).InvokeAsync("onDeleteAllianceRequestsByManager",
                            curUserManager.AllianceId, messageModel.Model.ToId);

                    }
                    finally
                    {
                        await Groups.AddToGroupAsync(cid, crGroupName);
                    }



                    //todo  проверить клиент почему тут исключение
                    throw new ArgumentException(Error.UserInAlliance);
                }

                messageModel.Model.AllianceAccepted = ArmAllianceAcceptedStatus.Accept;
                messageModel.FromAlliance = true;
                messageModel.Model.Message = "tr_ Confirmed";
                var data = _requestAllianceFromAllianceManageAddMessage(connection, messageModel);

                var targetUser = _getOnlineSingleUser(connection, data.MessageModel.Model.ToId);
                if (targetUser != null && targetUser.Connected)
                {
                    await Clients.Client(targetUser.ConnectionId)
                        .InvokeAsync("onRequestAllianceConfirmAcceptFromAllianceManage", data.MessageModel, true);
                }
                // Clients.Group(data.GroupName, data.ConnectionUser.ConnectionId)
                await Clients.Group(data.GroupName)
                    .InvokeAsync("onRequestAllianceConfirmAcceptFromAllianceManage", data.MessageModel);
                return data.MessageModel;
            });
        }


        /// <summary>
        ///     только для вкладки  my alliance для текущего юзера и оповещения менеджеров рассматривающих заявку
        /// </summary>
        /// <param name="toAllianceId"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <returns></returns>
        public async Task<bool> RequestAllianceDeleteRequestForUserToAlliance(int toAllianceId)
        {
            return await _contextActionAsync(async connection =>
            {
                var groupName = ConnectionUserExtension.CreateAllianceRecrutManagerGroupName(toAllianceId);
                var requestUser = _getLocalUser(Context.ConnectionId);
                if (requestUser == null)
                {
                    throw new ArgumentNullException(Error.ConnectionUserNotExist, nameof(requestUser));
                }
                var allianceRejectedBefore =
                    _allianceService.DeleteRequestForUserToAlliance(connection, requestUser.UserId, toAllianceId);
                if (!allianceRejectedBefore)
                {
                    await Clients.Group(groupName).InvokeAsync("onRequestAllianceDeleteRequestForUserToAlliance",
                        requestUser.UserId);
                }
                return true;
            });
        }

        /// <summary>
        /// </summary>
        /// <param name="rejectUserId"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="SecurityException">Error.NotPermitted</exception>
        /// <exception cref="NotImplementedException">Error.UserNotHasHubGroup</exception>
        /// <returns></returns>
        public async Task<bool> RequestAllianceRejectRequestToAlliance(int rejectUserId)
        {
            return await _contextActionAsync(async connection =>
            {
                var cr = _getLocalUser(Context.ConnectionId);
                if (cr == null)
                {
                    throw new ArgumentNullException(Error.ConnectionUserNotExist, nameof(cr));
                }

                var role = AllianceRoleHelper.GetByRoleId(cr.AllianceRoleId);
                if (!role.AcceptNewMembers)
                {
                    throw new SecurityException(Error.NotPermitted);
                }
                var groupName = cr.CreateAllianceRecrutManagerGroupName();
                if (!cr.HasGroup(groupName))
                {
                    throw new NotImplementedException(Error.UserNotHasHubGroup);
                }
                var curAu = _getAllianceUser(connection, cr);
                var oldRequests = _allianceService.RejectRequestToAlliance(connection, curAu, rejectUserId, role);
                var targetUser = _getOnlineSingleUser(connection, rejectUserId);
                if (targetUser != null && targetUser.Connected && oldRequests != null && oldRequests.Count > 0)
                {
                    var messageForUser = oldRequests.Last();
                    await Clients.Client(targetUser.ConnectionId).InvokeAsync("onRequestAllianceRejectRequestToAlliance",
                           rejectUserId, true, messageForUser);
                }
                await Clients.Group(groupName).InvokeAsync("onRequestAllianceRejectRequestToAlliance", rejectUserId);
                return true;
            });
        }


        /// <summary>
        /// </summary>
        /// <param name="toAllianceId"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <exception cref="Exception">Error.AllianceActionInBlockedState</exception>
        /// <returns></returns>
        public async Task<IPlanshetViewData> RequestAllianceAcceptJoinUserToAlliance(int toAllianceId)
        {
            var timeToDone = 0;
            try
            {
                return await _dbProvider.TransactionAsync(async transaction =>
                 {
                     var connection = transaction.Connection;
                     var joinedUser = _getCurrentUser(connection); //cr
                    var gameUser = _gameUserService.GetGameUser(connection, joinedUser.UserId);
                     var curTime = UnixTime.UtcNow();
                     var leftTime = curTime - gameUser.LeaveAllianceTime;
                     if (leftTime < UserDataModel.JoinJoAlllianceBlockedTime)
                     {
                         timeToDone = UserDataModel.JoinJoAlllianceBlockedTime - leftTime;
                         throw new Exception(Error.AllianceActionInBlockedState);
                     }

                     var oldAllianceUserId = joinedUser.AllianceUserId;
                     var oldAllianceId = joinedUser.AllianceId;
                     var newAllianceUser =
                         _allianceService.LeaveFromNpcAndJoinToUserAlliance(connection, oldAllianceUserId,
                             toAllianceId);
                     var newAlliance = _allianceService.GetAllianceById(connection, toAllianceId, false);

                    //todo обработать чаты
                    ChannelConnectionDataModel newChannelConnectionDataModel = null;
                     ChannelDataModel newChannelDataModel = null;
                     var oldChannelId = 0;
                     _channelService.OnUserChangeAlliance(connection, oldAllianceId, newAllianceUser, (chtConn, channel) =>
                     {
                         newChannelConnectionDataModel = chtConn;
                         newChannelDataModel = channel;
                     }, oldChId => { oldChannelId = oldChId; });

                     var npcAllianceId = (int)NpcAllianceId.Confederation;
                     var oldGroupName = await joinedUser.RemoveAllianceGroupNameAsync(Groups);
                     joinedUser.SetNewAllianceData(newAllianceUser.Id, newAlliance.Name, newAllianceUser.RoleId,
                         newAllianceUser.AllianceId);
                     var newGroupName = await joinedUser.AddOrReplaceAllianceGroupAsync(Groups);
                     var updHubUser = _hubCache.AddOrUpdateLocal(joinedUser, true);
                     _allianceNotifyOldAllianceUserLeft(joinedUser.UserId, npcAllianceId, oldGroupName);

                     var newAlliancePlanshet = _allianceSetNewPlanshetAndNotifyNewGroup(connection, updHubUser, newAllianceUser, newGroupName);

                    //todo  какое то оповещение менеджеров для обновления информации о юзерах в чатах
                    if (newChannelConnectionDataModel.MessageRead)
                     {
                         var newAllianceChannel = _channelService.GetAllianceChannelOut(transaction.Connection,
                             newChannelDataModel, newChannelConnectionDataModel);
                         await Clients.Client(updHubUser.ConnectionId).InvokeAsync("onUserChannelsUserChangeAlliance",
                             oldChannelId, newAllianceChannel, updHubUser);
                     }
                     else
                     {
                         throw new NotImplementedException();
                     }
                     return newAlliancePlanshet;
                 });
            }
            catch (Exception e)
            {
                if (timeToDone != 0)
                {
                    e.Data.Add("TimeToDone", timeToDone);
                    throw new HubException(e.Message, e);
                }
                throw new HubException(e.Message, e);
            }
        }

        #region Private

        private class UserRequestModel
        {
            #region Declare

            public AllianceMessageModelExt MessageModel { get; set; }
            public ConnectionUser ConnectionUser { get; set; }
            public string GroupName { get; set; }

            #endregion
        }

        private UserRequestModel _requestAllianceFromAllianceManageAddMessage(IDbConnection connection, AllianceMessageModelExt messageModel)
        {
            if (!messageModel.FromAlliance)
            {
                throw new NotImplementedException(nameof(messageModel.FromAlliance));
            }
            var curUserManager = _getLocalUser(Context.ConnectionId);
            if (string.IsNullOrWhiteSpace(messageModel.Model.CreatorIcon))
            {
                throw new NotImplementedException(nameof(messageModel.Model.CreatorIcon));
            }
            if (messageModel.AllianceRoleId == 0 || messageModel.AllianceUserId == 0)
            {
                throw new InvalidOperationException(Error.NotPermitted);
            }
            if (curUserManager.AllianceId != messageModel.Model.FromId)
            {
                throw new SecurityException(Error.NotPermitted);
            }
            var role = AllianceRoleHelper.GetByRoleId(curUserManager.AllianceRoleId);
            if (!role.AcceptNewMembers)
            {
                throw new SecurityException(Error.NotPermitted);
            }
            if (messageModel.Model.AllianceAccepted == 0)
            {
                messageModel.Model.AllianceAccepted = ArmAllianceAcceptedStatus.NoAction;
            }
            messageModel.Model.SourceType = MessageSourceType.IsAlliance;
            messageModel.Model.DateCreate = UnixTime.UtcNow();
            messageModel.Model = _allianceService.AddArmItem(connection,messageModel.Model);

            var groupName = curUserManager.CreateAllianceRecrutManagerGroupName();
            if (!curUserManager.HasGroup(groupName))
            {
                throw new NotImplementedException(Error.UserNotHasHubGroup);
            }
            return new UserRequestModel
            {
                ConnectionUser = curUserManager,
                MessageModel = messageModel,
                GroupName = groupName
            };
        }

        #endregion
    }
}