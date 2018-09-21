using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security;
using Server.Core.Infrastructure;
using Server.Core.Infrastructure.UserChannels;
using Server.Core.StaticData;
using Server.DataLayer;
using Server.DataLayer.Repositories;
using Server.Services.OutModel;
using Server.ServicesConnected.AzureStorageServices.ImageService;


namespace Server.Services.UserService
{
    public interface IChannelUiGroup
    {
        #region Sync

        GroupChannelOut CreateGroupChannel(IDbConnection connection, ChannelDataModel baseData);
        List<int> DeleteGroupChannelByOwner(IDbConnection connection, int channelId, int creatorUserId, Action<bool> setIsPublicChannel);
        bool UpdateGroupChannelPassword(IDbConnection connection, string newPassword, int channelId, int userId);
        List<ChannelSerchItem> GetGroupSerchItems(IDbConnection connection, string partChannelName, ChannelSerchTypes serchType);

        GroupChannelOut JoinUserToGroupChannel(IDbConnection connection, int channelId, string password, int userId, Action<NameIdInt, ChannelConnectionUserOut> setChannelOwnerAndUserOut);

        ChannelConnectionDataModel UnsubscribeUserFromGroupChannel(IDbConnection connection, int channelId, int removeUserId, Action<int> setChannelAdminUserId);

        void DeepDeleteOtherGroupChannels(IDbConnection connection, int currentUserId, Action<int, ChannelConnectionDataModel> addAdminUserIdAndConnectionDataItem);

        bool UpdateGroupUser(IDbConnection connection, ChannelConnectionUserOut tragetUser, bool updatePasswordByChannel, int channelAdminUserId, Action<GroupChannelOut> setChannelToTargetUserIfBeforeCantRead, Action<ChannelConnectionDataModel> setOldModel);

        string UpdateChannelGroupIcon(IDbConnection connection, string newBase64SourceImage, int channelId, int adminUserId, string ext = null);

        #endregion
    }

    public partial class ChannelService
    {
        public GroupChannelOut CreateGroupChannel(IDbConnection connection, ChannelDataModel baseData)
        {
            GroupChannelOut result = null;
            var groupType = (byte)ChannelTypes.Group;
            var maxChannelsFromUser = 1;

            var channels = _channelRepo.GetPreCreateChannels(connection, groupType, baseData.CreatorId, baseData.ChannelName).ToList();

            if (channels.Any())
            {
                var existChannelByName = channels.SingleOrDefault(i => i.channelName == baseData.ChannelName);
                if (existChannelByName != null)
                {
                    throw new Exception(Error.ChannelNameNotValid);
                }
                if (channels.Count > maxChannelsFromUser)
                {
                    throw new Exception(Error.UserGroupChannelLimit);
                }
            }


            var userChannel = CreateChannel(connection, baseData, baseData.CreatorId);
            var startMessage = CreateMessage(connection, new ChannelMessageDataModel
            {
                UserId = userChannel.CreatorId,
                DateCreate = userChannel.DateCreate,
                ChannelId = userChannel.Id,
                UserName = userChannel.CreatorName,
                Message = "Welcome to " + userChannel.ChannelName + "!",
                UserIcon = userChannel.ChannelIcon,
            });


            var userChannelOut = new GroupChannelOut(userChannel, userChannel.CreatorId)
            {
                Messages = new Dictionary<long, ChannelMessageDataModel> {
                    {startMessage.Id, startMessage}
                }
            };
            userChannelOut.SetUsersIfCanMansge(connection, _channelConnRepo);
            userChannelOut.SetBtnSend(true);
            userChannelOut.SetComplexButtonView();

            result = userChannelOut;

            return result;
        }


        public List<int> DeleteGroupChannelByOwner(IDbConnection connection, int channelId, int creatorUserId, Action<bool> setIsPublicChannel)
        {

            var channel = _channelRepo.GetById(connection, channelId);
            if (channel == null)
            {
                throw new Exception(Error.ChannelNotExist);
            }
            if (channel.creatorId != creatorUserId)
            {
                throw new SecurityException(Error.NotPermitted);
            }
            var isPublic = channel.password == "";
            var connectionUserIds = _channelConnRepo.GetConnectedUserIds(connection, channel.Id).ToList();
            var suc = _channelRepo.Delete(connection, channelId);
            if (!suc)
            {
                throw new Exception(Error.ChannelNotDeleted);
            }
            setIsPublicChannel(isPublic);


            return connectionUserIds;
        }

        public List<ChannelSerchItem> GetGroupSerchItems(IDbConnection connection, string partChannelName, ChannelSerchTypes serchType)
        {
            return _channelRepo.GetChannelSerchItems(connection, partChannelName, ChannelTypes.Group, serchType);
        }

        public bool UpdateGroupChannelPassword(IDbConnection connection, string newPassword, int channelId, int creatorUserId)
        {

            var chConn = _channelConnRepo.GetCreatorConnectionWhithChannel(connection, channelId, creatorUserId);
            if (chConn == null)
            {
                throw new NotImplementedException(Error.ChannelNotExist);
            }
            var channel = chConn.GetChannel();
            if (channel == null)
            {
                throw new NotImplementedException(Error.ChannelNotExist);
            }


            if (channel.password == newPassword)
            {
                return false;
            }
            channel.password = newPassword;
            chConn.password = newPassword;
            _channelConnRepo.Update(connection, chConn);
            _channelRepo.Update(connection, channel);
            return true;
        }

        public GroupChannelOut JoinUserToGroupChannel(IDbConnection connection, int channelId, string password, int userId, Action<NameIdInt, ChannelConnectionUserOut> setChannelOwnerAndUserOut)
        {
            GroupChannelOut result = null;
            var groupType = (byte)ChannelTypes.Group;

            var channel = _channelRepo.GetChannelWithConnectedUsers(connection, channelId,new List<int>());
            if (channel == null)
            {
                throw new Exception(Error.ChannelNotExist);
            }
            if (channel.creatorId == userId)
            {
                throw new NotImplementedException("is creator user channel must be exist before");
            }

            var admin = new NameIdInt(channel.creatorId, channel.creatorName);
            if (channel.password != password)
            {
                setChannelOwnerAndUserOut(admin, null);
                throw new SecurityException(Error.NotPermitted);
            }
            var maxLimit = (int)MaxLenghtConsts.GroupChannelsLimit;
            var channelConnection = channel.GetConnections().SingleOrDefault(i => i.userId == userId && i.channelType == groupType);

            ChannelConnectionDataModel targetChannelConnectionData;
            if (channelConnection == null)
            {
                var chConnCount = _channelConnRepo.GetCountConectionsForUser(connection, userId);
                var canAdd = chConnCount <= maxLimit - 1;
                if (!canAdd)
                {
                    throw new Exception(Error.MaxChannelsLimit);
                }
                targetChannelConnectionData = new ChannelConnectionDataModel
                {
                    UserId = userId,
                    Password = password,
                    MessageRead = true,
                    MessageSend = true,
                    ChannelType = ChannelTypes.Group,
                    ChannelId = channel.Id
                };
                var entyty = _channelConnRepo.ConvertToEntity(targetChannelConnectionData);
                entyty = _channelConnRepo.AddOrUpdate(connection, entyty);
                targetChannelConnectionData.Id = entyty.Id;
            }
            else
            {
                if (!channelConnection.messageRead)
                {
                    setChannelOwnerAndUserOut(admin, null);
                    throw new SecurityException(Error.YouAreBlockedInThisChannel);
                }
                // ReSharper disable once InvertIf
                if (channelConnection.password != password)
                {
                    channelConnection.password = password;
                    var updated = _channelConnRepo.Update(connection, channelConnection);
                    if (!updated)
                    {
                        throw new NotImplementedException();

                    }

                }

                targetChannelConnectionData = _channelConnRepo.ConvertToWorkModel(channelConnection);
            }

            var channelData = channel.ConvertToWorkModel();
            setChannelOwnerAndUserOut(admin, new ChannelConnectionUserOut(targetChannelConnectionData, "", password));
            var channelOut = new GroupChannelOut(channelData, userId);
            channelOut.SetMessages(connection, _channelMessageRepo);
            channelOut.SetBtnSend(targetChannelConnectionData.MessageSend);
            channelOut.SetComplexButtonView();
            result = channelOut;
            return result;
        }


        public ChannelConnectionDataModel UnsubscribeUserFromGroupChannel(IDbConnection connection, int channelId, int removeUserId, Action<int> setChannelAdminUserId)
        {
            ChannelConnectionDataModel result = null;
            var groupType = (byte)ChannelTypes.Group;
            var channel = _channelRepo.GetChannelWithConnectedUsers(connection, channelId, new List<int>(removeUserId));
            if (channel == null)
            {
                throw new Exception(Error.ChannelNotExist);
            }
            setChannelAdminUserId(channel.creatorId);
            var channelConnection = channel.GetConnections().SingleOrDefault(i => i.userId == removeUserId && i.channelType == groupType);
            if (channelConnection == null)
            {
                throw new NullReferenceException(Error.IsEmpty);
            }
            var data = _channelConnRepo.ConvertToWorkModel(channelConnection);
            var suc = _channelConnRepo.Delete(connection, data.Id);
            if (!suc)
            {
                throw new NotImplementedException();
            }
            result = data;
            return result;
        }


        public void DeepDeleteOtherGroupChannels(IDbConnection connection, int currentUserId, Action<int, ChannelConnectionDataModel> addAdminUserIdAndConnectionDataItem)
        {
            var groupType = (byte)ChannelTypes.Group;

            var connections = (IList<channel_connection>)_channelConnRepo.GetConnectionsWhereUserNotCreator(connection, currentUserId, groupType);

            if (!connections.Any())
            {
                return;
            }
            foreach (var channelConnection in connections)
            {
                if (!channelConnection.HasChannel())
                {
                    throw new NotImplementedException("!channelConnection.HasChannel()");
                }
                addAdminUserIdAndConnectionDataItem(channelConnection.GetChannel().creatorId, _channelConnRepo.ConvertToWorkModel(channelConnection));

            }
            _channelConnRepo.Delete(connection, connections.Select(i => i.Id).ToList());

        }

        public bool UpdateGroupUser(IDbConnection connection, ChannelConnectionUserOut tragetUser, bool updatePasswordByChannel, int channelAdminUserId, Action<GroupChannelOut> setChannelToTargetUserIfBeforeCantRead, Action<ChannelConnectionDataModel> setOldModel)
        {

            var channelData = _channelRepo.GetChannelWithConnectedUsers(connection, tragetUser.ChannelId, new List<int>(tragetUser.UserId));

            if (channelData == null)
            {
                throw new ArgumentNullException(nameof(channelData), Error.NoData);
            }
            if (channelData.creatorId != channelAdminUserId)
            {
                throw new SecurityException(Error.NotPermitted);
            }
            if (!channelData.HasConnections())
            {
                throw new SecurityException(Error.ChannelNotExist);
            }
            var channelConnections = channelData.GetConnections();
            if (channelConnections.Count > 1)
            {
                throw new NotImplementedException("channelConnections.Count >1");
            }
            var channelConnection = channelConnections[0];

            // ReSharper disable ConditionIsAlwaysTrueOrFalse
            // ReSharper disable InvertIf

            setOldModel(_channelConnRepo.ConvertToWorkModel(channelConnection));
            if (!tragetUser.MessageRead && channelConnection.messageRead)
            {
                tragetUser.MessageSend = false;
                channelConnection.messageRead = tragetUser.MessageRead;
                channelConnection.messageSend = tragetUser.MessageSend;

                return _channelConnRepo.Update(connection, channelConnection);
            }

            if (tragetUser.MessageRead && !channelConnection.messageRead)
            {
                channelConnection.messageRead = true;
                channelConnection.messageSend = tragetUser.MessageSend;
                if (updatePasswordByChannel)
                {
                    channelConnection.password = channelData.password;
                    tragetUser.HasCorrectPassword = true;
                }
                if (_channelConnRepo.Update(connection, channelConnection))
                {
                    var targetChat = new GroupChannelOut(channelData.ConvertToWorkModel(), tragetUser.UserId);
                    targetChat.SetMessages(connection, _channelMessageRepo);
                    targetChat.SetComplexButtonView();
                    targetChat.SetBtnSend(tragetUser.MessageSend);
                    setChannelToTargetUserIfBeforeCantRead(targetChat);
                    return true;
                }
                return false;
            }

            if (!channelConnection.messageRead)
            {
                return false;
            }
            var hasChange = false;

            if (updatePasswordByChannel && channelConnection.password != channelData.password)
            {
                channelConnection.password = channelData.password;
                tragetUser.HasCorrectPassword = true;

                var targetChat = new GroupChannelOut(channelData.ConvertToWorkModel(), tragetUser.UserId);
                targetChat.SetMessages(connection, _channelMessageRepo);
                targetChat.SetComplexButtonView();
                targetChat.SetBtnSend(channelConnection.messageSend);
                setChannelToTargetUserIfBeforeCantRead(targetChat);
                hasChange = true;
            }
            if (channelConnection.messageSend != tragetUser.MessageSend)
            {
                channelConnection.messageSend = tragetUser.MessageSend;
                hasChange = true;
            }
            if (hasChange)
            {
                var suc = _channelConnRepo.Update(connection, channelConnection);
                if (!suc)
                {
                    throw new NotImplementedException();
                }
            }
            return hasChange;
        }

        public string UpdateChannelGroupIcon(IDbConnection connection, string newBase64SourceImage, int channelId, int adminUserId, string ext = null)
        {
            var channel = _channelRepo.GetById(connection, channelId);
            if (channel.creatorId != adminUserId)
            {
                throw new SecurityException(Error.NotPermitted);
            }
            var newUrl = ChannelIcon.CreateFromB64(newBase64SourceImage, channelId, ext);
            channel.channelIcon = newUrl;
            _channelRepo.Update(connection, channel);
            return newUrl;
        }
    }
}