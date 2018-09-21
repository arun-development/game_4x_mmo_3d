using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Infrastructure.Alliance;
using Server.Core.StaticData;
using Server.DataLayer;
using Server.DataLayer.Repositories;
using Server.Services.OutModel;

namespace Server.Services.UserService
{
    public interface IChannelUiAlliance
    {
        #region Sync

        ChannelDataModel GetAllianceChannel(IDbConnection connection, int allianceId);


        void OnUserChangeAlliance(IDbConnection connection, int oldAllianceId, AllianceUserDataModel newAllianceUserDataModel, Action<ChannelConnectionDataModel, ChannelDataModel> setNewChannelData, Action<int> setOldChannelId);


        void SetUsersToNpcAlliance(IDbConnection connection, List<AllianceUserDataModel> newAllianceUsers, Action<List<ChannelConnectionDataModel>, ChannelDataModel> oldNewChannelSetValueAction = null);

        bool DeleteAllianceChannel(IDbConnection connection, int oldAllianceId);
        bool DeleteAllianceChannel(IDbConnection connection, ChannelDataModel oldAllianceChannel);
        ChannelDataModel CreateAllianceChannel(IDbConnection connection, AllianceDataModel newAlliance, string password);

        bool UpdateAllianceChannelIcon(IDbConnection connection, AllianceDataModel updatedAllianceDataModel);

        AllianceChannelOut GetAllianceChannelOut(IDbConnection connection, ChannelDataModel allianceChannel, ChannelConnectionDataModel crUserChannelConnection, int skip = 0);

        #endregion
    }

    public partial class ChannelService
    {
        public ChannelDataModel GetAllianceChannel(IDbConnection connection, int allianceId)
        {

            return _getAllianceChannel(connection, allianceId);

        }

        public void OnUserChangeAlliance(IDbConnection connection, int oldAllianceId, AllianceUserDataModel newAllianceUserDataModel, Action<ChannelConnectionDataModel, ChannelDataModel> setNewChannelData, Action<int> setOldChannelId)
        {
            ChannelConnectionDataModel newChannelConnectionDataModel = null;
            ChannelDataModel newChannelDataModel = null;


            _onUserChangeAlliance(connection, oldAllianceId, newAllianceUserDataModel, (chtConn, channel) =>
            {
                newChannelConnectionDataModel = chtConn;
                newChannelDataModel = channel;
            }, oldChannelId =>
            {
                if (oldChannelId == 0)
                    throw new NullReferenceException(nameof(oldChannelId));
                setOldChannelId(oldChannelId);
            });

            if (newChannelDataModel == null) throw new NullReferenceException(nameof(newChannelDataModel));
            if (newChannelConnectionDataModel == null)
                throw new NullReferenceException(nameof(newChannelConnectionDataModel));
            setNewChannelData(newChannelConnectionDataModel, newChannelDataModel);
        }


        /// <summary>
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="newAllianceUsers"></param>
        /// <param name="oldNewChannelSetValueAction">
        ///     T1 -  new users  List ChannelConnectionDataModel,
        ///     T2 - npcChannel
        /// </param>
        /// <returns></returns>
        public void SetUsersToNpcAlliance(IDbConnection connection, List<AllianceUserDataModel> newAllianceUsers, Action<List<ChannelConnectionDataModel>, ChannelDataModel> oldNewChannelSetValueAction = null)
        {
            if (!newAllianceUsers.Any()) throw new ArgumentNullException(nameof(newAllianceUsers), Error.IsEmpty);
            _channelConnRepo.SetUsersToNpcAlliance(connection, newAllianceUsers, oldNewChannelSetValueAction);
        }

        public bool DeleteAllianceChannel(IDbConnection connection, int oldAllianceId)
        {
            return DeleteAllianceChannel(connection, GetAllianceChannel(connection, oldAllianceId));
        }

        public bool DeleteAllianceChannel(IDbConnection connection, ChannelDataModel oldAllianceChannel)
        {
            if (oldAllianceChannel == null) throw new NullReferenceException(Error.ChannelNotExist);
            return DeleteChannel(connection, oldAllianceChannel.Id);
        }

        public ChannelDataModel CreateAllianceChannel(IDbConnection connection, AllianceDataModel newAlliance, string password)
        {
            return CreateChannel(connection,new ChannelDataModel
            {
                CreatorId = newAlliance.Id,
                ChannelType = ChannelTypes.Alliance,
                CreatorName = newAlliance.Name,
                Password = password,
                ChannelIcon = newAlliance.Images.Icon,
                ChannelName = newAlliance.Name
            }, newAlliance.CreatorId);
        }


        public bool UpdateAllianceChannelIcon(IDbConnection connection, AllianceDataModel updatedAllianceDataModel)
        {
            return _channelRepo.UpdateAllianceChannelIcon(connection,updatedAllianceDataModel.Images.Icon,
                updatedAllianceDataModel.Id);
        }


        public AllianceChannelOut GetAllianceChannelOut(IDbConnection connection, ChannelDataModel allianceChannel, ChannelConnectionDataModel crUserChannelConnection, int skip = 0)
        {
            if (!crUserChannelConnection.MessageRead) return null;
            AllianceChannelOut result = null;
            var allianceChannelOut = new AllianceChannelOut(allianceChannel);
            allianceChannelOut.SetMessages(connection, _channelMessageRepo, skip);
            allianceChannelOut.SetComplexButtonView();
            allianceChannelOut.SetBtnSend(crUserChannelConnection.MessageSend);
            result = allianceChannelOut;
            return result;
        }

        public ChannelDataModel _getAllianceChannel(IDbConnection connection, int allianceId)
        {
            var result = _channelRepo.Provider.GetAllianceChannelWork(connection, allianceId);
            return result;
        }


        private void _onUserChangeAlliance(IDbConnection connection, int oldAllianceId, AllianceUserDataModel newAllianceUserDataModel, Action<ChannelConnectionDataModel, ChannelDataModel> setNewChannelData, Action<int> setOldChannelId)
        {
            var typeChannel = (byte)ChannelTypes.Alliance;
            ChannelConnectionDataModel newChannelConnectionDataModel = null;
            ChannelDataModel newChannelDataModel = null;
            var channels =   _channelRepo.GetChannels(connection, new List<int>{ oldAllianceId, newAllianceUserDataModel.AllianceId}, typeChannel);
            if (!channels.Any())
            {
                throw new NotImplementedException("!channels.Any()");
            }
            //var channels = c.channel.Where(i =>
            //                 i.creatorId == oldAllianceId || i.creatorId == newAllianceUserDataModel.AllianceId &&
            //                 i.channelType == typeChannel).ToList();
            var oldChannel = channels.First(i => i.creatorId == oldAllianceId);
            var newChannel = channels.First(i => i.creatorId == newAllianceUserDataModel.AllianceId);
            setOldChannelId(oldChannel.Id);
            var oldConnection = _channelConnRepo.GetUserConnectedChannl(connection, oldChannel.Id, newAllianceUserDataModel.UserId, typeChannel);
            newChannelDataModel = newChannel.ConvertToWorkModel();
            var newRole = AllianceRoleHelper.GetByRoleId(newAllianceUserDataModel.RoleId);
            if (oldConnection != null)
            {
                oldConnection.password = newChannel.password;
                oldConnection.channelId = newChannel.Id;
                oldConnection.messageRead = newRole.MessageRead;
                oldConnection.messageSend = newRole.MessageSend;
                var updOldConnection = _channelConnRepo.Update(connection, oldConnection);
                if (!updOldConnection)
                {
                    throw new NotImplementedException();
                }
 
                newChannelConnectionDataModel = _channelConnRepo.ConvertToWorkModel(oldConnection);
            }
            else
            {
                var data = _channelConnRepo.AddOrUpdate(connection, new channel_connection
                {
                    userId = newAllianceUserDataModel.UserId,
                    messageRead = newRole.MessageRead,
                    messageSend = newRole.MessageSend,
                    password = newChannel.password,
                    channelType = newChannel.channelType,
                    channelId = newChannel.Id
                });
              
                newChannelConnectionDataModel = _channelConnRepo.ConvertToWorkModel(data);
                setNewChannelData(newChannelConnectionDataModel, newChannelDataModel);
            }

            if (newChannelDataModel.ChannelConnections == null)
            {
                newChannelDataModel.ChannelConnections = new List<ChannelConnectionDataModel> { newChannelConnectionDataModel };
            }
            else
            {
                newChannelDataModel.ChannelConnections.Add(newChannelConnectionDataModel);
            }
            setNewChannelData(newChannelConnectionDataModel, newChannelDataModel);
        }
    }
}