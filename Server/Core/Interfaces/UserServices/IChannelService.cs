
using System.Collections.Generic;
using System.Data;
using Server.DataLayer;

namespace Server.Core.Interfaces.UserServices
{



    public interface IChannelService<TPrimaryKeyType, TDataModel> where TPrimaryKeyType : struct where TDataModel : class
    {
        #region sync

        TDataModel GetChannel(IDbConnection connection, int channelId, string channelPassword);
        TDataModel GetChannelById(IDbConnection connection, int channelId);

        #region Base ChannelDataModel
        bool DeleteChannel(IDbConnection connection, TPrimaryKeyType channelId);
 

        #endregion
        #endregion


    }

    public interface IChannelConnectionService<TPrimaryKeyType, TDataModel> where TPrimaryKeyType : struct
        where TDataModel : class
    {
 
 
        #region sync
        TDataModel GetChannelConnection(IDbConnection connection, TPrimaryKeyType channelConnectionId);

        #region Base ChannelConnection
 
        bool DeleteChannelConnection(IDbConnection connection, TPrimaryKeyType channelConnectionId);

        ChannelConnectionDataModel UpdateChannelConnection(IDbConnection connection,
            ChannelConnectionDataModel dataModel);

        #endregion


        #endregion

    }

    public interface IChannelMessageService<TPrimaryKeyType, TDataModel> where TPrimaryKeyType : struct where TDataModel : class
    {

 

        #region sync

        TDataModel GetMessage(IDbConnection connection, TPrimaryKeyType channelMessageId);


        #region Base ChannelMessage

        TDataModel AddOrUpdateChannelMessage(IDbConnection connection, TDataModel senderDataModel);
        bool DeletChannelMessage(IDbConnection connection, TPrimaryKeyType channelMessageId);
        bool DeleteAllChannelMessages(IDbConnection connection);


        #endregion

        #endregion

    }






    public interface IChannelService : IChannelService<int, ChannelDataModel>, IChannelConnectionService<long, ChannelConnectionDataModel>, IChannelMessageService<long, ChannelMessageDataModel>

    {

        //sync

 
        IList<ChannelConnectionDataModel> GetChannelConnectionsByChannelId(IDbConnection connection, int channelId);
        bool DeleteAll(IDbConnection c);




    }

}
