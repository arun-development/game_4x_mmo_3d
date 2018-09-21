using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace Server.DataLayer.Repositories
{
    public interface
        IChannelMessageRepository : IAdapterDapper<channel_message, ChannelMessageDataModel, long>,
            IDeleteAllProcedure
    {
        List<ChannelMessageDataModel> GetMessagesByChannelId(IDbConnection connection, int channelId, int skip, int takePerPage);



    }

    public class ChannelMessageRepository :
        AdapterDapperRepository<channel_message, ChannelMessageDataModel, long>, IChannelMessageRepository
    {
        public ChannelMessageRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }

        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "channel_message_delete_all", false, "channel_message", 1);

        }



        public override ChannelMessageDataModel ConvertToWorkModel(channel_message entity)
        {
            return _convertFromEntity(entity);
        }


        public List<ChannelMessageDataModel> GetMessagesByChannelId(IDbConnection connection, int channelId, int skip, int takePerPage)
        {
            var result = _provider.GetChannelMessages(connection, channelId, skip, takePerPage).Select(ConvertToWorkModel)
                            .ToList();
            return result;
        }


        protected override void _setUpdatedData(channel_message oldData, ChannelMessageDataModel newData)
        {
            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.channelId != newData.ChannelId) oldData.channelId = newData.ChannelId;
            if (oldData.userId != newData.UserId) oldData.userId = newData.UserId;
            if (oldData.userName != newData.UserName) oldData.userName = newData.UserName;
            if (oldData.userIcon != newData.UserIcon) oldData.userIcon = newData.UserIcon;
            if (oldData.message != newData.Message) oldData.message = newData.Message;
            if (oldData.dateCreate != newData.DateCreate) oldData.dateCreate = newData.DateCreate;
        }


        private static ChannelMessageDataModel _convertFromEntity(IChannelMessageDbItem data)
        {
            var result = new ChannelMessageDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.ChannelId = data.channelId;
            result.UserId = data.userId;
            result.UserName = data.userName;
            result.UserIcon = data.userIcon;
            result.Message = data.message;
            result.DateCreate = data.dateCreate;
            return result;
        }
    }


    public static class ChannelMessageExtensions
    {
        public static IEnumerable<channel_message> GetChannelMessages(this IDbProvider provider,
            IDbConnection connection, int channelId, int skip, int perPage)
        {
            var tablebName = provider.GetTableName(nameof(channel_message));
            var channeltableName = provider.GetTableName(nameof(channel));
            var ch = ChannelExtensions.SqlAliaceChannel;
           
            var sql = $"SELECT m.* FROM {tablebName} as m " +
                      $"LEFT JOIN {channeltableName} as {ch} ON {ch}.Id =m.channelId " +
                      $"WHERE m.channelId={channelId} " +
                      $"ORDER BY m.dateCreate DESC, {ch}.creatorId DESC " +
                      $"OFFSET {skip} " +
                      $"ROWS FETCH NEXT {perPage} ROWS ONLY";
            return provider.Text<channel_message>(connection, sql);
        }
    }
}