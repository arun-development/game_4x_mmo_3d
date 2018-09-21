using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.StaticData;
using Server.DataLayer;
using Server.DataLayer.Repositories;
using Server.Services.OutModel;
 

namespace Server.Services.UserService
{
    public interface IChannelUiPrivate
    {
        #region sync

        bool UpdatePrivateChannelIcons(IDbConnection connection, UserDataModel userDataModel);
        ChannelDataModel GetPrivateChannel(IDbConnection connection, int firstUser, int secodUser);
        PrivateChannelOut GetPrivateChannelOut(IDbConnection connection, ChannelDataModel data, int currentUserId, int skip = 0);
        ChannelDataModel CreatePrivateChannel(IDbConnection connection, ChannelMessageCreateModel messageModel);
        bool ClosePrivateChannelForMember(IDbConnection connection, int channeId, int userId);

        void ChekAndRestoreTargetPrivateChannel(IDbConnection connection, int activeUserId, int channeId, Func<int, bool> targetUserIsOnline, Action<PrivateChannelOut> notifyOtherUserIfTargetChannelNotExist);

        #endregion
    }

    public partial class ChannelService
    {
        #region Interface

        public bool UpdatePrivateChannelIcons(IDbConnection connection, UserDataModel userDataModel)
        {
            return _channelRepo.UpdatePrivateChannelIcons(connection,userDataModel.Avatar.Icon, userDataModel.Id);
        }


        public ChannelDataModel GetPrivateChannel(IDbConnection connection, int firstUser, int secodUser)
        {
 
            ChannelDataModel result = null;
            var chCon = _channelConnRepo.GetPrivateChannelConnections(connection, firstUser, secodUser)?.ToList();
            if (chCon == null|| !chCon.Any())
            {
                return result;
            }
            var channel = chCon.First(i => i.HasChannel() && i.GetChannel().creatorId == i.userId).GetChannel().ConvertToWorkModel();
            channel.ChannelConnections = new List<ChannelConnectionDataModel>();
            foreach (var con in chCon)
            {
        
                channel.ChannelConnections.Add(_channelConnRepo.ConvertToWorkModel(con));
            }
            result = channel;
            return result;
        }


        public ChannelDataModel CreatePrivateChannel(IDbConnection connection, ChannelMessageCreateModel messageModel)
        {
            var newChannel = CreateChannel(connection,new ChannelDataModel
            {
                ChannelIcon = messageModel.UserIcon,
                ChannelName = messageModel.UserName + " <==> " + messageModel.To.Name,
                CreatorName = messageModel.UserName,
                Password = Guid.NewGuid().ToString(),
                ChannelType = messageModel.ChannelType,
                CreatorId = messageModel.UserId
            }, messageModel.UserId);
            var secondUser =
                AddUserToConnectionChannel(connection,newChannel, messageModel.To.Id, true, true, newChannel.Password);
            newChannel.ChannelConnections.Add(secondUser);
            return newChannel;
        }


        public PrivateChannelOut GetPrivateChannelOut(IDbConnection connection, ChannelDataModel data, int currentUserId, int skip = 0)
        {
            PrivateChannelOut result = null;
            var pChOut = new PrivateChannelOut(data);
            if (data.ChannelConnections != null)
            {
                var count = data.ChannelConnections.Count;
                switch (count)
                {
                    case 2:
                        break;
                    case 1:

                        var ignoreId = data.ChannelConnections[0].UserId;
                        var others = _channelConnRepo.GetOtherChannlConnecttions(connection, data.Id, ignoreId, (byte) ChannelTypes.Private).ToList();
                        if (others.Count != 1)
                        {
                            throw new ArgumentException(nameof(others), @" others.Count!=1 ");
                        }
                        data.ChannelConnections.Add(_channelConnRepo.ConvertToWorkModel(others[0]));
                        break;
                    default:
                        throw new NotImplementedException("channel connection count is wrong");
                }
            }
            else
            {
                data.ChannelConnections = _channelConnRepo
                    .ConvertToWorkModel(_channelConnRepo.GetByChannelId(connection, data.Id).ToList())
                    .ToList();
            }

            var curConn = data.ChannelConnections.Single(i => i.UserId == currentUserId);
            pChOut.SetBtnSend(curConn.MessageSend);
            pChOut.SetMessages(connection, _channelMessageRepo, skip);
            pChOut.SetComplexButtonView();
            result = pChOut;
            return result;
        }


        public bool ClosePrivateChannelForMember(IDbConnection connection, int channeId, int userId)
        {
            var con = _channelConnRepo.GetReadableUserChannelConnections(connection, channeId, userId).FirstOrDefault();
            if (con == null || con.Id == 0)
            {
                return true;

            }
            con.messageRead = false;
            con.messageSend = false;
            _channelConnRepo.Update(connection, con);
            return true;
        }

        public void ChekAndRestoreTargetPrivateChannel(IDbConnection connection, int activeUserId, int channeId, Func<int, bool> targetUserIsOnline, Action<PrivateChannelOut> notifyOtherUserIfTargetChannelNotExist)
        {
            PrivateChannelOut targetPrivateChannel = null;
            var c = connection;
            var channel = _channelRepo.GetById(c, channeId);
            if (channel == null)
            {
                throw new ArgumentNullException(nameof(channel), Error.ChannelNotExist);
            }
            var targetConnection = _channelConnRepo.GetOtherChannlConnecttions(c, channel.Id, activeUserId, (byte)ChannelTypes.Private).SingleOrDefault(i => !i.messageRead);

            if (targetConnection == null)
            {
                return;
            }

            targetConnection.messageRead = true;
            if (!targetConnection.messageSend)
            {
                targetConnection.messageSend = true;
            }
            if (targetConnection.password != channel.password)
            {
                targetConnection.password = channel.password;
            }
            _channelConnRepo.Update(connection, targetConnection);


            var isOnline = targetUserIsOnline(targetConnection.userId);
            if (isOnline)
            {
                var channelOut = channel.ConvertToWorkModel();
                targetPrivateChannel = new PrivateChannelOut(channelOut);
                targetPrivateChannel.SetBtnSend(true);
                targetPrivateChannel.SetMessages(c, _channelMessageRepo);
                targetPrivateChannel.SetComplexButtonView();
            }

            if (targetPrivateChannel != null)
            {
                notifyOtherUserIfTargetChannelNotExist(targetPrivateChannel);
            }
        }

        #endregion
    }
}