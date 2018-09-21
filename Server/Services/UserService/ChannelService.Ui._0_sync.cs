using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security;
using Server.Core.Interfaces.ForModel;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.DataLayer;
using Server.DataLayer.Repositories;
using Server.Extensions;
using Server.Services.OutModel;

namespace Server.Services.UserService
{
    public interface IChannelUi : IChannelUiAlliance, IChannelUiPrivate, IChannelUiGroup
    {
        #region Sync

        IPlanshetViewData InitialPlanshetChannels(IDbConnection connection, int currentUserId, int allianceId, AllianceRoleDataModel allianceUserRole);

        ChannelDataModel CreateChannel(IDbConnection connection, ChannelDataModel newChannelModel, int creatorUserId);

        ChannelConnectionDataModel AddUserToConnectionChannel(IDbConnection connection, ChannelDataModel channel, int userId, bool messageRead, bool messageSend, string channelPassword);

        Dictionary<int, PrivateChannelOut> GetPrivateChannelsOut(IDbConnection connection, int currentUserId, int skipMessages = 0);
        Dictionary<int, GroupChannelOut> GetGroupChannelsOut(IDbConnection connection, int currentUserId, int skipMessages = 0);

        AllianceChannelOut GetAllianceChannelOut(IDbConnection connection, int allianceId, int currentUserId, AllianceRoleDataModel allianceUserRole, int skip = 0);

        ChannelMessageDataModel CreateMessage(IDbConnection connection, ChannelMessageDataModel messageModel);

        Dictionary<long, ChannelMessageDataModel> GetMessagesNextPege(IDbConnection connection, int channelId, ChannelTypes channelType, int skip);

        bool IsAvailableChannelName(IDbConnection connection, string validatedChannelName);

        #endregion
    }

    public partial class ChannelService : IChannelUi
    {
        public IPlanshetViewData InitialPlanshetChannels(IDbConnection connection, int currentUserId, int allianceId, AllianceRoleDataModel allianceUserRole)
        {
            var data = new ChannelsTabsData();
            data.SetChannelsTabsData( connection, _channelRepo, _channelMessageRepo, _channelConnRepo, currentUserId, allianceId, allianceUserRole.MessageSend);
            return data.GetPlanshet();
        }


        public Dictionary<int, PrivateChannelOut> GetPrivateChannelsOut(IDbConnection connection, int currentUserId, int skipMessages = 0)
        {
            var privateChannelType = (byte)ChannelTypes.Private;
            var privateChannels = new Dictionary<int, PrivateChannelOut>();
         
            var channels = _channelConnRepo.GetUserConnectedChannls(connection, currentUserId, privateChannelType);
            foreach (var channel in channels)
            {
                var pChOut = new PrivateChannelOut(channel.ChannelData.ConvertToWorkModel());
                pChOut.SetMessages(connection, _channelMessageRepo, skipMessages);
                pChOut.SetComplexButtonView();
                pChOut.SetBtnSend(channel.MessageSend);
                privateChannels.Add(pChOut.ChannelId, pChOut);
                //break;
            }

            return privateChannels;
        }

        public Dictionary<int, GroupChannelOut> GetGroupChannelsOut(IDbConnection connection, int currentUserId, int skipMessages = 0)
        {
            var groupChannelType = (byte)ChannelTypes.Group;
            var groupChannels = new Dictionary<int, GroupChannelOut>();
            var channels = _channelConnRepo.GetUserConnectedChannls(connection, currentUserId, groupChannelType);
            foreach (var channel in channels)
            {
                var pChOut = new GroupChannelOut(channel.ChannelData.ConvertToWorkModel(), currentUserId);
                pChOut.SetMessages(connection, _channelMessageRepo, skipMessages);
                pChOut.SetComplexButtonView();
                pChOut.SetBtnSend(channel.MessageSend);
                pChOut.SetUsersIfCanMansge(connection, _channelConnRepo);
                groupChannels.Add(pChOut.ChannelId, pChOut);
                // break;
            }

            return groupChannels;
        }
 
        public AllianceChannelOut GetAllianceChannelOut(IDbConnection connection, int allianceId, int currentUserId, AllianceRoleDataModel allianceUserRole, int skip = 0)
        {
            if (!allianceUserRole.MessageRead)
            {
                return null;
            }
            AllianceChannelOut result =(AllianceChannelOut) null;
            var allianceChannelType = (byte)ChannelTypes.Alliance;
            //todo передалать на процедуру
            var channelData = _channelConnRepo.Provider.GetAllianceChannelDb(connection, allianceId);
            if (channelData == null)
            {
                throw new NullReferenceException(Error.ChannelNotExist);
            }
            var connectedData = _channelConnRepo.GetUserConnectedChannls(connection, currentUserId, allianceChannelType);
            var filtredConnectedData = connectedData.Where(i => i.ChannelData.Id == channelData.Id && i.ChannelData.password == channelData.password).ToList();
            if (!filtredConnectedData.Any())
            {
                throw new SecurityException(Error.NotPermitted);
            }
            if (filtredConnectedData.Count != 1)
            {
                throw new NotImplementedException("GetAllianceChannelOut: filtredConnectedData.Count!= 1");
            }
            
            var conn = filtredConnectedData[0];
            if (!conn.MessageRead) return null;
            if (allianceUserRole.MessageSend != conn.MessageSend)
            {
                throw new NotImplementedException(Error.NotEquals);
            }

            var allianceChannel = channelData.ConvertToWorkModel();
            var allianceChannelOut = new AllianceChannelOut(allianceChannel);
            allianceChannelOut.SetMessages(connection, _channelMessageRepo, skip);

            allianceChannelOut.SetBtnSend(allianceUserRole.MessageSend);
            result = allianceChannelOut;
            return result;
        }


        public ChannelConnectionDataModel AddUserToConnectionChannel(IDbConnection connection, ChannelDataModel channel, int userId, bool messageRead, bool messageSend, string channelPassword)
        {
            if (channel == null)
            {
                throw new NullReferenceException(Error.ChannelNotExist);
            }
            if (channel.Password != channelPassword)
            {
                throw new SecurityException(Error.PasswordIncorrect);
            }
            var model = channel.CreateModelByChannel(userId, messageRead, messageSend);
            var ent = _channelConnRepo.ConvertToEntity(model);
            var data = _channelConnRepo.AddOpUpdateChannelConnectionByChannelIdAndUserId(connection, ent);
            return _channelConnRepo.ConvertToWorkModel(data);
        }


        public ChannelMessageDataModel CreateMessage(IDbConnection connection, ChannelMessageDataModel messageModel)
        {
            return _channelMessageRepo.AddOrUpdateeModel(connection,messageModel);
        }

        /// <summary>
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="channelId"></param>
        /// <param name="channelType"></param>
        /// <param name="skip"></param>
        /// <exception cref="ArgumentOutOfRangeException">channelType not equal with exists channel groups</exception>
        /// <returns></returns>
        public Dictionary<long, ChannelMessageDataModel> GetMessagesNextPege(IDbConnection connection, int channelId, ChannelTypes channelType, int skip)
        {
            var perPage = BaseChannelOut.GetPerPage(channelType);
            var data = _channelMessageRepo.GetMessagesByChannelId(connection, channelId, skip, perPage);
            return data.ToDictionary(i => i.Id, i => i);
        }


        public ChannelDataModel CreateChannel(IDbConnection connection, ChannelDataModel newChannelModel, int creatorUserId)
        {
            if (newChannelModel.DateCreate == 0)
            {
                newChannelModel.DateCreate = UnixTime.UtcNow();
            }
            var channel = _channelRepo.AddOrUpdateeModel(connection,newChannelModel);
            if (channel == null)
            {
                throw new NullReferenceException(Error.ChannelNotExist);
            }
            channel.ChannelConnections = new List<ChannelConnectionDataModel> {
                AddUserToConnectionChannel(connection,channel, creatorUserId, true, true, channel.Password)
            };
            return channel;
        }


        public bool IsAvailableChannelName(IDbConnection connection, string validatedChannelName)
        {
            var result = !_channelConnRepo.Provider
                .Procedure<channel_connection>(connection, "channel_get_by_invariant_name", new { channelName = validatedChannelName })
                .Any();
 
            return result;
        }
    }
}