using System;
using System.Collections.Generic;
using System.Data;
using Server.Core.Interfaces.UserServices;
using Server.Core.StaticData;
using Server.DataLayer;
using Server.DataLayer.Repositories;

namespace Server.Services.UserService
{
    public partial class ChannelService : IChannelService
    {
        public string Test(string message = "Ok")
        {
            return message;
        }

        #region Declare

        private readonly IChannelConnectionRepository _channelConnRepo;
        private readonly IChannelMessageRepository _channelMessageRepo;
        private readonly IChannelRepository _channelRepo;
 

        public ChannelService(IChannelConnectionRepository channelConnRepo,
            IChannelMessageRepository channelMessageRepo,
            IChannelRepository channelRepo)
        {
            _channelConnRepo = (ChannelConnectionRepository) channelConnRepo;

            _channelMessageRepo = channelMessageRepo;

            _channelRepo = channelRepo;
        }

        #endregion


        #region Channel

        public ChannelDataModel GetChannel(IDbConnection connection, int channelId, string channelPassword)
        {
            var channel = _channelRepo.GetById(connection,channelId, channelPassword);
            if (channel == null) throw new NullReferenceException(Error.ChannelNotExist);
            return channel;
        }

        public ChannelDataModel GetChannelById(IDbConnection connection, int channelId)
        {
            return _channelRepo.GetModelById(connection,channelId);
        }
   

        public bool DeleteChannel(IDbConnection connection, int channelId)
        {
            return _channelRepo.Delete(connection, channelId);
        }
 

        #endregion

        #region ChannelConnection

        public ChannelConnectionDataModel GetChannelConnection(IDbConnection connection, long channelConnectionId)
        {
            return _channelConnRepo.GetModelById(connection,channelConnectionId);
        }


        public ChannelConnectionDataModel UpdateChannelConnection(IDbConnection connection, ChannelConnectionDataModel dataModel)
        {
            var ent = _channelConnRepo.ConvertToEntity(dataModel);
            var suc = _channelConnRepo.Update(connection, ent);
            if (!suc)
            {
                throw new NotImplementedException();
            }
            return dataModel;
 
        }
 


        public IList<ChannelConnectionDataModel> GetChannelConnectionsByChannelId(IDbConnection connection, int channelId)
        {
            return _channelConnRepo.GetChannelConnectionsByChannelId(connection,channelId);
        }


        public bool DeleteChannelConnection(IDbConnection connection, long channelConnectionId)
        {
            return _channelConnRepo.Delete(connection,channelConnectionId);
        }


        #endregion

        #region ChannelMessage

        public ChannelMessageDataModel GetMessage(IDbConnection connection, long messageId)
        {
            return _channelMessageRepo.GetModelById(connection,messageId);
        }

        public ChannelMessageDataModel AddOrUpdateChannelMessage(IDbConnection connection, ChannelMessageDataModel senderDataModel)
        {
            return _channelMessageRepo.AddOrUpdateeModel(connection,senderDataModel);
        }


        public bool DeletChannelMessage(IDbConnection connection, long channelMessageId)
        {
            return _channelMessageRepo.Delete(connection,channelMessageId);
        }

        public bool DeleteAllChannelMessages(IDbConnection connection)
        {
            return _channelMessageRepo.DeleteAllProcedure(connection);
        }

 
        public bool DeleteAll(IDbConnection connection)
        {
            return _channelRepo.DeleteAllProcedure(connection);
        }

        #endregion
    }
}