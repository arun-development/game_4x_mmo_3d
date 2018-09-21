using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Infrastructure.Alliance;
using Server.Core.Npc;
using Server.Core.StaticData;
using Server.Extensions;


namespace Server.DataLayer.Repositories
{
    public interface
        IChannelConnectionRepository :
            IAdapterDapper<channel_connection, ChannelConnectionDataModel, long>, IDeleteAllProcedure
    {
        #region sync

        IList<ChannelConnectionDataModel> GetChannelConnectionsByChannelId(IDbConnection connection, int channelId);
        new ChannelConnectionDataModel AddOrUpdateeModel(IDbConnection connection, ChannelConnectionDataModel newDataModel);

        void SetUsersToNpcAlliance(IDbConnection connection, List<AllianceUserDataModel> newAllianceUsers, Action<List<ChannelConnectionDataModel>, ChannelDataModel> oldNewChannelSetValueAction = null);
        IList<UserConnectedChannelResult> GetUserConnectedChannls(IDbConnection connection, int currentUserId, byte channelTypeId);

        IList<channel_connection> GetPrivateChannelConnections(IDbConnection connection, int firstUserId,
            int secodUserId);

        IEnumerable<channel_connection> GetOtherChannlConnecttions(IDbConnection connection, int channelId, int ignoreUserId, byte channelTypeId);
        IEnumerable<channel_connection> GetByChannelId(IDbConnection connection, int channelId);

        IEnumerable<channel_connection> GetReadableUserChannelConnections(IDbConnection connection, int channelId, int userId);
        IEnumerable<int> GetConnectedUserIds(IDbConnection connection, int channelId);
        channel_connection GetCreatorConnectionWhithChannel(IDbConnection connection, int channelId, int creatorUserId);
        int GetCountConectionsForUser(IDbConnection connection, int userId);

        IEnumerable<channel_connection> GetConnectionsWhereUserNotCreator(IDbConnection connection, int userId, byte channelTypeId);

        channel_connection GetUserConnectedChannl(IDbConnection connection, int channelId, int userId,
            byte channelTypeId);

        channel_connection AddOpUpdateChannelConnectionByChannelIdAndUserId(IDbConnection connection, channel_connection model);


        #endregion
    }

    public class ChannelConnectionRepository :
        AdapterDapperRepository<channel_connection, ChannelConnectionDataModel, long>,
        IChannelConnectionRepository
    {
        public ChannelConnectionRepository(IDbProvider dataProvider) : base(dataProvider)
        {

        }

        public new ChannelConnectionDataModel AddOrUpdateeModel(IDbConnection connection, ChannelConnectionDataModel newDataModel)
        {
            ThrowIfConnectionIsNull(connection);
            var data = AddOpUpdateChannelConnectionByChannelIdAndUserId(connection, ConvertToEntity(newDataModel));
            return ConvertToWorkModel(data);
        }


        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            ThrowIfConnectionIsNull(connection);
            return _deleteAllProcedire(connection, "channel_connection_delete_all", false, "channel_connection", 1);

        }


        public override ChannelConnectionDataModel ConvertToWorkModel(channel_connection entity)
        {
            return _convertFromEntity(entity);
        }


        public IList<ChannelConnectionDataModel> GetChannelConnectionsByChannelId(IDbConnection connection, int channelId)
        {

            ThrowIfConnectionIsNull(connection);
            var response = GetByChannelId(connection, channelId);
            var result = response.Select(ConvertToWorkModel).ToList();
            return result;
        }
        public IEnumerable<channel_connection> GetByChannelId(IDbConnection connection, int channelId)
        {
            ThrowIfConnectionIsNull(connection);
            var sql = $"SELECT * FROM {SchemeTableName} WHERE channelId={channelId}";
            return _table(connection, sql);
        }

        public IEnumerable<channel_connection> GetReadableUserChannelConnections(IDbConnection connection, int channelId, int userId)
        {
            ThrowIfConnectionIsNull(connection);
            var sql = $"SELECT * FROM {SchemeTableName}  WHERE channelId={channelId} AND userId={userId}  AND messageRead=1";
            return _table(connection, sql);
        }

        public IEnumerable<int> GetConnectedUserIds(IDbConnection connection, int channelId)
        {
            ThrowIfConnectionIsNull(connection);
            var sql = $"SELECT userId FROM {SchemeTableName}  WHERE channelId={channelId} ";
            return _table<int>(connection, sql);
        }


        public void SetUsersToNpcAlliance(IDbConnection connection, List<AllianceUserDataModel> newAllianceUsers, Action<List<ChannelConnectionDataModel>, ChannelDataModel> oldNewChannelSetValueAction = null)
        {
            ThrowIfConnectionIsNull(connection);
            if (connection == null)
            {
                throw new ArgumentNullException(nameof(connection), Error.TransactionFailed);
            }
            var npcAllianceId = (int)NpcAllianceId.Confederation;


            var channel = _provider.GetAllianceChannelDb(connection, npcAllianceId);
            if (channel == null) throw new NullReferenceException(Error.ChannelNotExist);
            var userList = new List<ChannelConnectionDataModel>();




            var npcChannel = channel.ConvertToWorkModel();
            foreach (var aUser in newAllianceUsers)
            {
                var model = npcChannel.CreateModelByAllianceChannel(aUser);
                var data = AddOpUpdateChannelConnectionByChannelIdAndUserId(connection, ConvertToEntity(model));

                model.Id = data.Id;
                userList.Add(model);

            }
            if (userList == null || !userList.Any() || userList.Any(i => i.Id == 0)) throw new NotImplementedException();
            oldNewChannelSetValueAction?.Invoke(userList, npcChannel);
        }



        public channel_connection AddOpUpdateChannelConnectionByChannelIdAndUserId(IDbConnection connection, channel_connection model)
        {
            var sql = $@"IF EXISTS(SELECT TOP 1 * FROM {SchemeTableName}  WHERE channelId = @channelId and  userId = @userId) " +
                      $@"BEGIN UPDATE {SchemeTableName} SET {UpsertMapper.SqlStringUpdateKeyValues} OUTPUT INSERTED.* WHERE channelId=@channelId and userId=@userId END " +
                      $@"ELSE BEGIN INSERT INTO {SchemeTableName}  ({UpsertMapper.SqlKeyNames}) OUTPUT INSERTED.*  values({UpsertMapper.SqlValueNames}) END";
            var data = _provider.Text<channel_connection>(connection, sql, model).SingleOrDefault();
            if (data == null || data.Id == 0)
            {
                throw new NotImplementedException();
            }
            return data;

        }


        /// <summary>
        /// channel item: channelData => <see cref="channel"/>>   , messageSend => bool
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="currentUserId"></param>
        /// <param name="channelTypeId"></param>
        /// <returns></returns>
        public IList<UserConnectedChannelResult> GetUserConnectedChannls(IDbConnection connection, int currentUserId, byte channelTypeId)
        {
            ThrowIfConnectionIsNull(connection);
            var channelTableName = _provider.GetTableName(nameof(channel));
            var ch = ChannelExtensions.SqlAliaceChannel;
            var chCon = ChannelExtensions.SqlAliaceChannelConnection;
            var sql = $"SELECT {ChannelExtensions.SqlSelectFieldsChannelAndChannelConnection} FROM {SchemeTableName} AS {chCon} " +
                      $"WHERE {chCon}.userId={currentUserId} AND {chCon}.channelType={channelTypeId} AND {chCon}.messageRead=1" +
                      $"JOIN {channelTableName} as {ch} ON chCon.channelId={ch}.Id AND {chCon}.password={chCon}.password";

            var channels = _table<dynamic>(connection, sql).Select(i => new UserConnectedChannelResult(i));
            return channels.ToList();

        }

        public channel_connection GetUserConnectedChannl(IDbConnection connection, int channelId, int userId, byte channelTypeId)
        {
            ThrowIfConnectionIsNull(connection);
            var sql = $"SELECT * FROM {SchemeTableName} " +
                      $"WHERE channelId={channelId} and userId={userId} and channelType={channelTypeId} ";
            return _table<channel_connection>(connection, sql).FirstOrDefault();
        }

        public IEnumerable<channel_connection> GetOtherChannlConnecttions(IDbConnection connection, int channelId, int ignoreUserId, byte channelTypeId)
        {
            ThrowIfConnectionIsNull(connection);
            var sql = $"SELECT * FROM {SchemeTableName} WHERE channelId={channelId} and userId!={ignoreUserId} and channelType={channelTypeId}";

            return _table(connection, sql);


        }

        #region Channel with channel connection 


        public channel_connection GetCreatorConnectionWhithChannel(IDbConnection connection, int channelId, int creatorUserId)
        {
            ThrowIfConnectionIsNull(connection);
            var chTableName = _provider.GetTableName(nameof(channel));
            var ch = ChannelExtensions.SqlAliaceChannel;
            var chCon = ChannelExtensions.SqlAliaceChannelConnection;
            var sql = $"SELECT {ChannelExtensions.SqlSelectFieldsChannelAndChannelConnection} " +
                      $"FROM {chTableName} as {ch}  WHERE {ch}.Id={channelId} and {ch}.creatorId={creatorUserId} " +
                      $"JOIN {SchemeTableName} as {chCon} ON {chCon}.channelId={ch}.Id" +
                      $"WHERE userId={creatorUserId}";
            var data = _provider.Text<dynamic>(connection, sql).FirstOrDefault();
            if (data == null || !data.Any())
            {
                return null;
            }
            var chConnection = (channel)ChannelExtensions.ConvertRowChannelWhithConnectedChannel(data);
            return chConnection.GetConnections().First();
        }

        public int GetCountConectionsForUser(IDbConnection connection, int userId)
        {
            ThrowIfConnectionIsNull(connection);
            var sql = $"SELECT COUNT(Id) FROM {SchemeTableName} WHERE userId={userId}";
            return _provider.Text<int>(connection, sql).SingleOrDefault();
        }

        public IEnumerable<channel_connection> GetConnectionsWhereUserNotCreator(IDbConnection connection, int userId, byte channelTypeId)
        {
            ThrowIfConnectionIsNull(connection);
            var channelTableName = _provider.GetTableName(nameof(channel));
            var ch = ChannelExtensions.SqlAliaceChannel;
            var chCon = ChannelExtensions.SqlAliaceChannelConnection;
            var sql = $"SELECT {ChannelExtensions.SqlSelectFieldsChannelAndChannelConnection} " +
                      $"FROM  {SchemeTableName} as {chCon} " +
                      $"JOIN {channelTableName} as {ch} ON {ch}.Id={chCon}.channelId AND {ch}.creatorId!={userId} " +
                      $"WHERE {chCon}.userId={userId} AND {chCon}.channelType={channelTypeId}";


            var converted = ChannelExtensions.ConvertRowsChannelWhithConnectedChannel(_provider.Text<dynamic>(connection, sql));
            if (!converted.Any())
            {
                return null;
            }
            var combinded = ChannelExtensions.CombineChannelConnections(converted);
            if (!combinded.Any())
            {
                return null;
            }
            if (combinded.Count == 1)
            {
                var channel = combinded[0];
                return channel.HasConnections() ? channel.GetConnections() : null;
            }
            else
            {
                throw new NotImplementedException("combinded.Count !=1");
            }
        }

        /// <summary>
        /// в данных содерждится информация о канале
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="firstUserId"></param>
        /// <param name="secodUserId"></param>
        /// <returns></returns>
        public IList<channel_connection> GetPrivateChannelConnections(IDbConnection connection, int firstUserId, int secodUserId)
        {
            ThrowIfConnectionIsNull(connection);
            const byte ptivateType = (byte)ChannelTypes.Private;
            var channelTableName = _provider.GetTableName(nameof(channel));

            //todo что то тут не так
            //var connections = c.channel_connection
            //    .Where(i => i.channelType == ptivateType
            //                && ((i.userId == firstUser && i.channel.creatorId == firstUser)
            //                    || (i.userId == firstUser && i.channel.creatorId == secodUser)
            //                    || (i.userId == secodUser && i.channel.creatorId == secodUser)
            //                    || (i.userId == secodUser && i.channel.creatorId == firstUser)
            //                )).ToList();

            var ch = ChannelExtensions.SqlAliaceChannel;
            var chCon = ChannelExtensions.SqlAliaceChannelConnection;
            var sql = $"SELECT {ChannelExtensions.SqlSelectFieldsChannelAndChannelConnection} " +
                     $"FROM {channelTableName} as {ch} " +
                     $"JOIN {SchemeTableName} as {chCon} ON {chCon}.channelId={ch}.Id " +
                     $"WHERE {ch}.channelType={ptivateType} " +
                     $"AND ({ch}.creatorId={firstUserId} OR {ch}.creatorId={secodUserId}) ";

            var responce = _table<dynamic>(connection, sql).ToList();
            var result = (IList<channel_connection>)null;
            if (responce.Any())
            {
                result = new List<channel_connection>();
                foreach (var item in responce)
                {
                    var channel = (channel)ChannelExtensions.ConvertRowChannelWhithConnectedChannel(item);
                    var conn = channel.GetConnections().First();
                    result.Add(conn);

                }
                // result = tmpList.Select(i => i.GetConnections().First()).ToList();

            }
            return result;
        }

        #endregion




        protected override void _setUpdatedData(channel_connection oldData, ChannelConnectionDataModel newData)
        {
            if (oldData.Id != newData.Id)
                oldData.Id = newData.Id;
            if (oldData.channelId != newData.ChannelId)
                oldData.channelId = newData.ChannelId;


            var channelType = (byte)newData.ChannelType;

            if (oldData.channelType != channelType)
                oldData.channelType = channelType;
            if (oldData.userId != newData.UserId)
                oldData.userId = newData.UserId;
            if (oldData.password != newData.Password)
                oldData.password = newData.Password;

            if (oldData.messageRead != newData.MessageRead)
                oldData.messageRead = newData.MessageRead;
            if (oldData.messageSend != newData.MessageSend)
                oldData.messageSend = newData.MessageSend;
        }

        private static ChannelConnectionDataModel _convertFromEntity(IChannelConnectionDbItem data)
        {
            var result = new ChannelConnectionDataModel();
            if (data == null)
                return result;
            result.Id = data.Id;
            result.ChannelId = data.channelId;
            ChannelTypes channelType;
            Enum.TryParse(data.channelType.ToString(), out channelType);
            result.ChannelType = channelType;
            result.UserId = data.userId;
            result.Password = data.password;
            result.MessageRead = data.messageRead;
            result.MessageSend = data.messageSend;
            return result;
        }

        private IEnumerable<channel_connection> _table(IDbConnection connection, string fullSql)
        {
            return _table<channel_connection>(connection, fullSql);
        }
        private IEnumerable<T> _table<T>(IDbConnection connection, string fullSql)
        {
            return _provider.Text<T>(connection, fullSql);
        }
    }

    #region Helpers

    public class UserConnectedChannelResult
    {

        public channel ChannelData;
        public long ChannelConnectionId;
        public bool MessageSend;
        public bool MessageRead;
        public int ConnectedUserId;
        public string ConnectedUserPassword;

        public UserConnectedChannelResult(channel channelWhithSingleConnected)
        {

            var connect = channelWhithSingleConnected.GetConnections().First();
            ChannelData = channelWhithSingleConnected;
            ChannelConnectionId = connect.Id;
            MessageSend = connect.messageSend;
            MessageRead = connect.messageRead;
            ConnectedUserId = connect.userId;
            ConnectedUserPassword = connect.password;

        }


    }

    public static class ChannelConnectionDataModelExtension
    {
        public static ChannelConnectionDataModel CreateModelByAllianceChannel(this ChannelDataModel allianceChannel, AllianceUserDataModel allianceUser)
        {
            return allianceChannel.CreateModelByAllianceChannel(allianceUser, AllianceRoleHelper.GetByRoleId(allianceUser.RoleId));
        }

        public static ChannelConnectionDataModel CreateModelByAllianceChannel(this ChannelDataModel allianceChannel, AllianceUserDataModel allianceUser, AllianceRoleDataModel role)
        {
            return new ChannelConnectionDataModel
            {
                UserId = allianceUser.UserId,
                ChannelId = allianceChannel.Id,
                Password = allianceChannel.Password,
                MessageRead = role.MessageRead,
                MessageSend = role.MessageSend,
                ChannelType = allianceChannel.ChannelType
            };
        }

        public static ChannelConnectionDataModel CreateModelByChannel(this ChannelDataModel channel, int userId, bool messageRead, bool messageSend)
        {
            return new ChannelConnectionDataModel
            {
                UserId = userId,
                ChannelId = channel.Id,
                Password = channel.Password,
                MessageRead = messageRead,
                MessageSend = messageSend,
                ChannelType = channel.ChannelType
            };
        }

    }

    #endregion

}