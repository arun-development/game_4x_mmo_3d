using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
 
using Server.Core.HubUserModels;
using Server.Core.Infrastructure;
using Server.Core.Infrastructure.Alliance;
using Server.Core.Infrastructure.UserChannels;
using Server.Core.Interfaces.ForModel;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.DataLayer;
using Server.Services;
using Server.Services.OutModel;

namespace Server.EndPoints.Hubs.GameHub
{
    public partial class MainGameHub
    {
        #region Private

        private void _userChannelsCheckAndFixChannelCoonectionUser(IDbConnection connection, ChannelDataModel channel,
            ChannelConnectionDataModel conn)
        {
            if (!conn.MessageRead || !conn.MessageSend || conn.Password != channel.Password)
            {
                if (!conn.MessageRead)
                {
                    conn.MessageRead = true;
                }
                if (!conn.MessageSend)
                {
                    conn.MessageSend = true;
                }
                if (conn.Password != channel.Password)
                {
                    conn.Password = channel.Password;
                }
                _channelService.UpdateChannelConnection(connection, conn);
            }
        }

        #endregion

        //todo  при добавлении пользователя в альянс в  channel_connection не добавляется новый пользователь


        #region Common

        public async Task<IPlanshetViewData> UserChannelsGetPlanshet()
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                var aRole = AllianceRoleHelper.GetByRoleId(cr.AllianceRoleId);
                // todo  что то  там сделать с ролями после получения планшента
                return _channelService.InitialPlanshetChannels(connection, cr.UserId, cr.AllianceId, aRole);
            });
        }


        public async Task<bool> UserChannelsSendMessage(ChannelMessageTransfer messageModel)
        {
            _tryCatch(() => { messageModel.Validate(); });
            return await _contextActionAsync(async connection =>
            {
                var cr = _getCurrentUser(connection);
                messageModel.DateCreate = UnixTime.UtcNow();
                messageModel.UserId = cr.UserId;
                messageModel.UserName = cr.Name;

                //todo tmp 
                //========
                var newMessage = _channelService.CreateMessage(connection, messageModel);
                messageModel.UpdateByBase(newMessage);
                //========

                switch (messageModel.ChannelType)
                {
                    case ChannelTypes.Private:
                        ConnectionUser targetUser = null;
                        PrivateChannelOut targetChannel = null;
                        var privateGroup = cr.CreatePrivateUserChannelGroupName(messageModel.ChannelId);

                        _channelService.ChekAndRestoreTargetPrivateChannel(connection, cr.UserId, newMessage.ChannelId,
                            targetUserId =>
                            {
                                targetUser = _getOnlineSingleUser(connection, targetUserId);
                                return targetUser != null;
                            }, targetChannelDataModel => { targetChannel = targetChannelDataModel; });

                        if (targetUser != null)
                        {
                            await Clients.Client(cr.ConnectionId).InvokeAsync("onUserChannelsSended", messageModel);

                            if (targetUser == null)
                            {
                                throw new NotImplementedException(nameof(targetUser));
                            }
                            if (targetChannel == null)
                            {
                                throw new NotImplementedException(nameof(targetChannel));
                            }
                            await targetUser.AddOrReplacePrivateChannelGroupNameAsync(Groups, targetChannel.ChannelId);
                            var updTuHubUser = _hubCache.AddOrUpdateLocal(targetUser, true);
                            var iHubGroupItem = updTuHubUser.GetUserChannelGroup(targetChannel.ChannelId);
                            await Clients.Client(updTuHubUser.ConnectionId)
                                .InvokeAsync("onUserChannelsCreatedPrivateChannel", targetChannel, iHubGroupItem);
                        }
                        else
                        {
                            await Clients.Group(privateGroup).InvokeAsync("onUserChannelsSended", messageModel);
                        }
                        return true;
                    case ChannelTypes.Group:
                        var groupChannelroup = cr.CreateGroupChannelGroupName(messageModel.ChannelId);
                        await Clients.Group(groupChannelroup).InvokeAsync("onUserChannelsSended", messageModel);
                        return true;
                    case ChannelTypes.Alliance:
                        var role = AllianceRoleHelper.GetByRoleId(cr.AllianceRoleId);
                        if (!role.MessageSend)
                        {
                            throw new SecurityException(Error.NotPermitted);
                        }

                        var allianceGroup = cr.CreateAllianceGroupName();
                        await Clients.Group(allianceGroup).InvokeAsync("onUserChannelsSended", messageModel);
                        return true;
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            });
        }

        public async Task<Dictionary<long, ChannelMessageDataModel>> UserChannelsGetNextMessagesPage(int channelId,
            ChannelTypes channelType, int skip)
        {
            _tryCatch(() =>
            {
                if (channelId == 0)
                {
                    throw new NotImplementedException(nameof(channelId));
                }
            });
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                if (!cr.HasUserChannel(channelId))
                {
                    throw new SecurityException(Error.NotPermitted);
                }
                var messages = _channelService.GetMessagesNextPege(connection, channelId, channelType, skip);
                return messages;
            });
        }

        #endregion

        #region Private Channel

        public async Task<bool> UserChannelsCreatePrivateChannel(ChannelMessageCreateModel messageModel)
        {
            _tryCatch(() => { messageModel.Validate(); });
            return await _contextActionAsync(async connection =>
            {
                var cr = _getCurrentUser(connection);
                messageModel.DateCreate = UnixTime.UtcNow();
                messageModel.UserId = cr.UserId;
                messageModel.UserName = cr.Name;
                messageModel.ChannelType = ChannelTypes.Private;

                var channel = _channelService.GetPrivateChannel(connection, cr.UserId, messageModel.To.Id);
                if (channel != null && channel.Id != 0)
                {
                    if (channel.ChannelConnections.Count > 2)
                    {
                        throw new NotImplementedException("channel.ChannelConnections.Count > 2");
                    }
                    if (channel.ChannelConnections.Count == 0)
                    {
                        throw new NotImplementedException("channel.ChannelConnections.Count == 0");
                    }
                    if (channel.ChannelConnections.Count == 1)
                    {
                        var conn = channel.ChannelConnections[0];
                        if (conn.UserId == cr.UserId || conn.UserId == messageModel.To.Id)
                        {
                            _userChannelsCheckAndFixChannelCoonectionUser(connection, channel, conn);
                            var addUserConnectionId = conn.UserId == cr.UserId ? messageModel.To.Id : cr.UserId;
                            channel.ChannelConnections.Add(_channelService.AddUserToConnectionChannel(connection,
                                channel, addUserConnectionId, true, true, channel.Password));
                        }
                        else
                        {
                            throw new ArgumentOutOfRangeException(nameof(conn.UserId), conn.UserId, Error.NotPermitted);
                        }
                    }
                    else
                    {
                        foreach (var conn in channel.ChannelConnections)
                        {
                            if (conn.UserId == cr.UserId || conn.UserId == messageModel.To.Id)
                            {
                                _userChannelsCheckAndFixChannelCoonectionUser(connection, channel, conn);
                            }
                            else
                            {
                                throw new SecurityException(Error.NotPermitted);
                            }
                        }
                    }
                }
                else
                {
                    channel = _channelService.CreatePrivateChannel(connection, messageModel);
                }

                messageModel.ChannelId = channel.Id;
                var newMessage = _channelService.CreateMessage(connection, messageModel);
                messageModel.UpdateByBase(newMessage);
                var channelOut = _channelService.GetPrivateChannelOut(connection, channel, cr.UserId);
                var privateGroupName = await cr.AddOrReplacePrivateChannelGroupNameAsync(Groups, channel.Id);
                var crUpdHubUser = _hubCache.AddOrUpdateLocal(cr, true);
                var targetUser = _getOnlineSingleUser(connection, messageModel.To.Id);
                if (targetUser != null)
                {
                    await targetUser.AddOrReplacePrivateChannelGroupNameAsync(Groups, channel.Id);
                    _hubCache.AddOrUpdateLocal(targetUser, true);
                }

                var iHubGroupItem = crUpdHubUser.GetUserChannelGroup(channel.Id);
                await Clients.Group(privateGroupName)
                    .InvokeAsync("onUserChannelsCreatedPrivateChannel", channelOut, iHubGroupItem);
                return true;
            });
        }


        public async Task<bool> UserChannelsClosePrivateChannel(int channelId, int userId)
        {
            return await _contextActionAsync(async connection =>
            {
                var cr = _getCurrentUser(connection);
                if (cr.UserId != userId)
                {
                    throw new SecurityException(Error.NotPermitted);
                }
                var closed = _channelService.ClosePrivateChannelForMember(connection, channelId, userId);
                if (!closed)
                {
                    throw new NotImplementedException();
                }
                await cr.RemovePrivateChannelGroupNameAsync(Groups, channelId);
                var updHubUser = _hubCache.AddOrUpdateLocal(cr, true);
                await Clients.Client(updHubUser.ConnectionId).InvokeAsync("updateConnectionUser", updHubUser);
                return true;
            });
        }

        #endregion


        #region Group channel

        public async Task<bool> UserChannelsIsAvailableChannelName(string hubName)
        {
            hubName.ValidateChannelName();
            return await _makeAsync(() =>
                _dbProvider.ContextAction(c => _channelService.IsAvailableChannelName(c, hubName)));
        }

        public async Task<GroupChannelOut> UserChannelsCreateGroupChannel(ChannelDataModel newChannelData)
        {
            return await _contextActionAsync(async connection =>
            {
                newChannelData.ChannelName.ValidateChannelName();
                newChannelData.ChannelIcon.ValidateIcon();
                var cr = _getCurrentUser(connection);
                newChannelData.DateCreate = UnixTime.UtcNow();
                newChannelData.CreatorId = cr.UserId;
                newChannelData.CreatorName = cr.Name;
                newChannelData.ChannelName = newChannelData.ChannelName.ToUpper();
                newChannelData.ChannelType = ChannelTypes.Group;

                var channelOut = _channelService.CreateGroupChannel(connection, newChannelData);

                await cr.AddOrReplaceGroupChannelGroupNameAsync(Groups, channelOut.ChannelId, channelOut.ChannelName);
                var updHubUser = _hubCache.AddOrUpdateLocal(cr, true);
                await Clients.Client(updHubUser.ConnectionId).InvokeAsync("updateConnectionUser", updHubUser);
                return channelOut;
            });
        }

        public async Task<bool> UserChannelsDeleteGroupChannelByOwner(int channelId)
        {
            return await _contextActionAsync(async connection =>
            {
                var cr = _getCurrentUser(connection);
                var isPublicChannel = false;
                var userIds = _channelService.DeleteGroupChannelByOwner(connection, channelId, cr.UserId,
                    isPublic => { isPublicChannel = isPublic; });
                var groupName = cr.CreateGroupChannelGroupName(channelId);
                await Clients.Group(groupName).InvokeAsync("userChannelsGroupDropChannel", channelId, false, groupName);
                var col = userIds.Select(userId => _getOnlineSingleUser(connection, userId)).ToList();
                var execIds = new List<string>();
                foreach (var aUser in col)
                {
                    await aUser.RemoveGroupChannelNameAsync(Groups, channelId);
                    execIds.Add(aUser.ConnectionId);
                    _hubCache.AddOrUpdateLocal(aUser, false);
                }

                if (isPublicChannel)
                {
                    await Clients.AllExcept(execIds.ToArray())
                        .InvokeAsync("userChannelsRemoveGroupSerchChannelItem", channelId, true);
                }


                return true;
            });
        }

        public async Task<bool> UserChannelsUpdatePassword(int channelId, string newPassword)
        {
            return await _contextActionAsync(async connection =>
            {
                var cr = _getCurrentUser(connection);
                var isUpdated =
                    _channelService.UpdateGroupChannelPassword(connection, newPassword, channelId, cr.UserId);

                if (!isUpdated)
                {
                    return false;
                }
                var newIsPublic = newPassword == "";
                //    data.GroupeName
                var groupData = cr.GetUserChannelGroup(channelId);

                await Clients.All.InvokeAsync("userChannelsAddOrUpdateGroupSerchChannelItem", channelId,
                    groupData.NativeName, newIsPublic);

                try
                {
                    await Groups.RemoveFromGroupAsync(cr.ConnectionId, groupData.GroupeName);

                    await Clients.Group(groupData.GroupeName).InvokeAsync("userChannelsGroupDropChannel", channelId, false,
                        groupData.GroupeName);

                }
                finally
                {
                    await Groups.AddToGroupAsync(cr.ConnectionId, groupData.GroupeName);

                }



                return true;
            });
        }

        public async Task<List<ChannelSerchItem>> UserChannelsSerchGroupChannelNames(string partChannelName)
        {
            return await _contextAction(connection =>
                _channelService.GetGroupSerchItems(connection, partChannelName, ChannelSerchTypes.All));
        }

        public async Task<GroupChannelOut> UserChannelsJoinToGroupChannel(int channelId, string password)
        {
            NameIdInt channelOwner = null;
            try
            {
                return await _contextActionAsync(async connection =>
                {
                    var cr = _getCurrentUser(connection);
                    ChannelConnectionUserOut newConnectionUser = null;
                    var chOut = _channelService.JoinUserToGroupChannel(connection, channelId, password, cr.UserId,
                        (owner, conOut) =>
                        {
                            channelOwner = owner;
                            newConnectionUser = conOut;
                        });
                    await cr.AddOrReplaceGroupChannelGroupNameAsync(Groups, channelId, chOut.ChannelName);
                    var updHubUser = _hubCache.AddOrUpdateLocal(cr, true);
                    await Clients.Client(updHubUser.ConnectionId).InvokeAsync("updateConnectionUser", updHubUser);
                    if (channelOwner == null || newConnectionUser == null)
                    {
                        throw new NotImplementedException(
                            "data correct but target admin or new connection user not exist");
                    }
                    var admin = _getOnlineSingleUser(connection, channelOwner.Id);
                    if (admin != null)
                    {
                        newConnectionUser.UserName = cr.Name;
                        await Clients.Client(admin.ConnectionId).InvokeAsync("onUserChannelsGroupUserSubscribe",
                            admin.UserId, newConnectionUser);
                    }
                    return chOut;
                });
            }
            catch (Exception e)
            {
                e.Data.Add("ChannelOwner", channelOwner);
                throw new HubException(e.Message, e);
            }
        }


        public async Task<bool> UserChannelsUnsubscribeUserFromGroupChannel(int channelId)
        {
            return await _contextActionAsync(async connection =>
            {
                var cr = _getCurrentUser(connection);
                var channelAdminUsrId = 0;
                var removedConnection = _channelService.UnsubscribeUserFromGroupChannel(connection, channelId,
                    cr.UserId, admId => { channelAdminUsrId = admId; });

                await cr.RemoveGroupChannelNameAsync(Groups, channelId);

                if (channelAdminUsrId != 0)
                {
                    var admin = _getOnlineSingleUser(connection, channelAdminUsrId);
                    if (admin != null)
                    {
                        var connOut = new ChannelConnectionUserOut(removedConnection, cr.Name, "");
                        await Clients.Client(admin.ConnectionId).InvokeAsync("onUserChannelsGroupUserUnsubscribe",
                            channelAdminUsrId, connOut);
                    }
                }
                var updHubUser = _hubCache.AddOrUpdateLocal(cr, true);

                await Clients.Client(updHubUser.ConnectionId).InvokeAsync("updateConnectionUser", updHubUser);


                return true;
            });
        }


        public async Task<bool> UserChannelsDeepDeleteOtherGroupChannels()
        {
            return await _contextActionAsync(async connection =>
            {
                var cr = _getCurrentUser(connection);
                var dic = new Dictionary<int, ChannelConnectionDataModel>();
                _channelService.DeepDeleteOtherGroupChannels(connection, cr.UserId,(adminId, item) => { dic.Add(adminId, item); });


                foreach (var item in dic)
                {
                    var admin = _getOnlineSingleUser(connection, item.Key);
                    if (admin != null)
                    {
                        var connOut = new ChannelConnectionUserOut(item.Value, cr.Name, "");
                        await Clients.Client(admin.ConnectionId)
                            .InvokeAsync("onUserChannelsGroupUserUnsubscribe", item.Key, connOut);
                    }
                    await cr.RemoveGroupChannelNameAsync(Groups, item.Value.ChannelId);
                }
                var updHubUser = _hubCache.AddOrUpdateLocal(cr, true);
                await Clients.Client(cr.ConnectionId).InvokeAsync("updateConnectionUser", updHubUser);
                return true;
            });
        }


        public async Task<ChannelConnectionUserOut> UserChannelsGroupUpdateUser(ChannelConnectionUserOut tragetUser,
            bool updatePasswordByChannel, int channelAdminUserId)
        {
            return await _contextActionAsync(async connection =>
            {
                //ChannelConnectionUserOut
                var cr = _getCurrentUser(connection);

                if (cr.UserId != channelAdminUserId)
                {
                    throw new SecurityException(Error.NotPermitted);
                }
                GroupChannelOut targetChannel = null;
                ChannelConnectionDataModel oldModel = null;

                var channelId = tragetUser.ChannelId;
                var hasChange = _channelService.UpdateGroupUser(connection, tragetUser, updatePasswordByChannel,
                    channelAdminUserId,
                    targetUserChat => { targetChannel = targetUserChat; },
                    oldM => { oldModel = oldM; });

                if (!hasChange)
                {
                    return tragetUser;
                }
                var tu = _getOnlineSingleUser(connection, tragetUser.UserId);
                if (tu == null)
                {
                    return tragetUser;
                }
                var iHubGroupItem = cr.GetUserChannelGroup(channelId);
                // changes for target  user
                if (targetChannel != null)
                {
                    await tu.AddOrReplaceGroupChannelGroupNameAsync(Groups, channelId, iHubGroupItem.NativeName);
                    _hubCache.AddOrUpdateLocal(tu, true);
                    await Clients.Client(tu.ConnectionId).InvokeAsync("userChannelsAddOrUpdateGroupChannel",
                        targetChannel, iHubGroupItem);
                    //todo Clients.Client(tu.ConnectionId).
                    return tragetUser;
                }
                if (oldModel.MessageRead && !tragetUser.MessageRead)
                {
                    await tu.RemoveGroupChannelNameAsync(Groups, channelId);
                    _hubCache.AddOrUpdateLocal(tu, true);
                    await Clients.Client(tu.ConnectionId).InvokeAsync("userChannelsGroupDropChannel", channelId, false,
                        iHubGroupItem.GroupeName);
                    return tragetUser;
                }

                await Clients.Client(tu.ConnectionId)
                    .InvokeAsync("onUserChannelsCrUserGroupUpdatedPermition", tragetUser);
                return tragetUser;
            });
        }

        public async Task<bool> UserChannelsGroupUploadIcon(Base64ImageOut newBase64SourceImageModel, int channelId)
        {
            return await _contextActionAsync(async connection =>
            {
                var cr = _getCurrentUser(connection);

                var groupName = cr.CreateGroupChannelGroupName(channelId);


                var newUrl = _channelService.UpdateChannelGroupIcon(connection, newBase64SourceImageModel.Base64File,
                    channelId, cr.UserId,
                    newBase64SourceImageModel.Ext);
                await Clients.Group(groupName).InvokeAsync("onUserChannelsGroupIconUploaded", newUrl, channelId);
                return true;
            });
        }

        #endregion
    }
}