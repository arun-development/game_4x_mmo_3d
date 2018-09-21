using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using MoreLinq;
using Server.Core.Infrastructure.UserChannels;
using Server.Core.StaticData;
using Server.Extensions;

namespace Server.DataLayer.Repositories
{
    public interface IChannelRepository : IAdapterDapper<channel, ChannelDataModel, int>,
        IDeleteAllProcedure
    {
        ChannelDataModel GetById(IDbConnection connection, int channelId, string password);
        bool UpdatePrivateChannelIcons(IDbConnection connection, string newIconUrl, int creatorUserId);
        bool UpdateAllianceChannelIcon(IDbConnection connection, string newIconUrl, int allianceId);


        List<ChannelSerchItem> GetChannelSerchItems(IDbConnection connection, string partChannelName,
            ChannelTypes channelType, ChannelSerchTypes serchType);

        IEnumerable<channel> GetPreCreateChannels(IDbConnection connection, byte channelType, int creatorId,string channelName);

        channel GetChannelWithConnectedUsers(IDbConnection connection, int channelId, List<int> conectedUserIds);
        IList<channel> GetChannels(IDbConnection connection, List<int> chreatorUserIds, byte channelTypeId);
    }

    public class ChannelRepository : AdapterDapperRepository<channel, ChannelDataModel, int>, IChannelRepository
    {
        #region Declare

        public ChannelRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }

        #endregion

        #region Interface

        public ChannelDataModel GetById(IDbConnection connection, int channelId, string password)
        {
            ThrowIfConnectionIsNull(connection);
            var channelDb = _provider.Text<channel>(connection,
                $"SELECT TOP 1 * FROM {SchemeTableName} WHERE channelId=@channelId and password=@password", new
                {
                    channelId,
                    password
                }).FirstOrDefault();

            if (channelDb != null && channelDb.Id != 0)
            {
                return _convertFromEntity(channelDb);
            }
            return null;
        }

        public bool UpdatePrivateChannelIcons(IDbConnection connection, string newIconUrl, int creatorUserId)
        {
            ThrowIfConnectionIsNull(connection);
            //@newIconUrl NVARCHAR(1000), @userId INT, @userChannelType TINYINT
            var suc = _provider.Procedure<bool>(connection, "channel_update_icon_by_user_icon", new
            {
                newIconUrl,
                userId = creatorUserId,
                userChannelType = (byte)ChannelTypes.Alliance
            }).SingleOrDefault();
            return suc;
        }

        public bool UpdateAllianceChannelIcon(IDbConnection connection, string newIconUrl, int allianceId)
        {
            ThrowIfConnectionIsNull(connection);
            //@newIconUrl NVARCHAR(1000), @creatorId INT,@allianceChannelType TINYINT
            var suc = _provider.Procedure<bool>(connection, "channel_update_icon_by_alliance_icon", new
            {
                newIconUrl,
                creatorId = allianceId,
                allianceChannelType = (byte)ChannelTypes.Alliance
            }).SingleOrDefault();
            return suc;
        }


        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            ThrowIfConnectionIsNull(connection);
            var result = _deleteAllProcedire(connection, "channel_delete_all", false, "channel", 1);
            if (!result)
            {
                return result;
            }
            _provider._help_reset_index(connection, "channel_message", 0);
            _provider._help_reset_index(connection, "channel_connection", 0);
            return result;
        }


        public List<ChannelSerchItem> GetChannelSerchItems(IDbConnection connection, string partChannelName,
            ChannelTypes channelType, ChannelSerchTypes serchType)
        {
            ThrowIfConnectionIsNull(connection);
            var bChannelType = (byte)channelType;
            var bSerchType = (byte)serchType;

            //@partChannelName  NVARCHAR(14), @channelType TINYINT, @serchType TINYINT
            var result = _provider.Procedure<dynamic>(connection, "channel_get_serch_items", new
            {
                partChannelName,
                channelType = bChannelType,
                serchType = bSerchType
            }).Select(i => new ChannelSerchItem
            {
                Id = i.Id,
                Name = i.channelName,
                IsPublic = i.password == ""
            }).ToList();
            return result;
        }

        public IEnumerable<channel> GetPreCreateChannels(IDbConnection connection, byte channelType, int creatorId,
            string channelName)
        {
            ThrowIfConnectionIsNull(connection);
            var sql = $"SELECT * FROM {SchemeTableName} " +
                      $"WHERE channelType={channelType} " +
                      $"AND (creatorId={creatorId} OR channelName='{channelName}')";
            return _provider.Text<channel>(connection, sql);
        }

        public channel GetChannelWithConnectedUsers(IDbConnection connection, int channelId, List<int> conectedUserIds)
        {

            var channelConnectedTableName = _provider.GetTableName(nameof(channel_connection));
            var ch = ChannelExtensions.SqlAliaceChannel;
            var chCon = ChannelExtensions.SqlAliaceChannelConnection;
            var sql =
                $"SELECT {ChannelExtensions.SqlSelectFieldsChannelAndChannelConnection} FROM {SchemeTableName} as {ch} " +
                $"JOIN {channelConnectedTableName} AS {chCon} ON {chCon}.channelId={ch}.Id  " +
                $"WHERE {ch}.Id={channelId} ";

            var whereConected = "";
            if (conectedUserIds.Any())
            {
                whereConected =$" AND {chCon}.userId IN(" + conectedUserIds.Aggregate(whereConected, (current, uId) => current + (uId + ","));
                whereConected = whereConected.RemoveLastSimbol() + ") ";
                sql += whereConected;
            }

            var data =(IList<dynamic>) _provider.Text<dynamic>(connection, sql);
            if (!data.Any())
            {
                return null;
            }
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
                return channel;
            }
            else
            {
                throw new NotImplementedException("combinded.Count !=1");
            }
       
        }

        public IList<channel> GetChannels(IDbConnection connection, List<int> chreatorUserIds, byte channelTypeId)
        {

            if (!chreatorUserIds.Any())
            {
                return null;
            }
            var filter = chreatorUserIds.Aggregate("", (current, channelId) => current + (channelId + ","));
            filter = filter.Substring(0, filter.Length - 1);
            
            var sql = $"SELECT * FROM {SchemeTableName} WHERE channelType={channelTypeId} AND creatorId IN({filter})";
            return (IList<channel>) _provider.Text<channel>(connection, sql);
        }

        public override ChannelDataModel ConvertToWorkModel(channel entity) => _convertFromEntity(entity);

        #endregion


        protected override void _setUpdatedData(channel oldData, ChannelDataModel newData)
        {
            if (oldData.Id != newData.Id)
            {
                oldData.Id = newData.Id;
            }


            var channelType = (byte)newData.ChannelType;
            if (oldData.channelType != channelType)
            {
                oldData.channelType = channelType;
            }

            if (oldData.channelName != newData.ChannelName)
            {
                oldData.channelName = newData.ChannelName;
            }
            if (oldData.password != newData.Password)
            {
                oldData.password = newData.Password;
            }
            if (oldData.dateCreate != newData.DateCreate)
            {
                oldData.dateCreate = newData.DateCreate;
            }
            if (oldData.creatorId != newData.CreatorId)
            {
                oldData.creatorId = newData.CreatorId;
            }
            if (oldData.creatorName != newData.CreatorName)
            {
                oldData.creatorName = newData.CreatorName;
            }
            if (oldData.channelIcon != newData.ChannelIcon)
            {
                oldData.channelIcon = newData.ChannelIcon;
            }
        }


        public static ChannelDataModel _convertFromEntity(IChannelDbItem data)
        {
            var result = new ChannelDataModel();
            if (data == null)
            {
                return result;
            }
            result.Id = data.Id;
            ChannelTypes channelType;
            Enum.TryParse(data.channelType.ToString(), out channelType);
            result.ChannelType = channelType;
            result.ChannelName = data.channelName;
            result.Password = data.password;
            result.DateCreate = data.dateCreate;
            result.CreatorId = data.creatorId;
            result.CreatorName = data.creatorName;
            result.ChannelIcon = data.channelIcon;
            return result;
        }
    }


    public static class ChannelExtensions
    {
        #region Declare

        public const string SqlSelectFieldsChannelAndChannelConnection = " chCon.Id as channel_connection__Id, " +
                                                                         "chCon.channelId as channel_connection__channelId, " +
                                                                         "chCon.channelType as channel_connection__channelType, " +
                                                                         "chCon.userId as channel_connection__userId, " +
                                                                         "chCon.password as channel_connection__password, " +
                                                                         "chCon.messageRead as channel_connection__messageRead, " +
                                                                         "chCon.messageSend as channel_connection__messageSend, " +
                                                                         "ch.Id as channel__channelId, " +
                                                                         "ch.channelType as channel__channelType, "  +
                                                                         "ch.channelName as channel__channelName, " +
                                                                         "ch.password as channel__password, " +
                                                                         "ch.dateCreate as channel__dateCreate, " +
                                                                         "ch.creatorId as channel__creatorId, " +
                                                                         "ch.creatorName as channel__creatorName, " +
                                                                         "ch.channelIcon as channel__channelIcon ";
        public const string SqlAliaceChannel = "ch";
        public const string SqlAliaceChannelConnection = "chCon";

        #endregion

        public static channel GetAllianceChannelDb(this IDbProvider provider, IDbConnection c, int allianceId)
        {
            provider.ThrowIfConnectionIsNull(c);
            var allianceChannelType = (byte)ChannelTypes.Alliance;
            var tableName = provider.GetTableName(nameof(channel));
            return provider.Text<channel>(c,
                $"SELECT TOP 1 *  FROM {tableName} WHERE creatorId=@creatorId and channelType = @channelType", new
                {
                    creatorId = allianceId,
                    channelType = allianceChannelType
                }).FirstOrDefault();
        }

        public static ChannelDataModel GetAllianceChannelWork(this IDbProvider provider, IDbConnection c,
            int allianceId)
        {
            provider.ThrowIfConnectionIsNull(c);
            var channelItem = provider.GetAllianceChannelDb(c, allianceId);
            return channelItem?.ConvertToWorkModel();
        }

        public static ChannelDataModel ConvertToWorkModel(this channel channel) =>
            ChannelRepository._convertFromEntity(channel);

        public static List<channel> ConvertRowsChannelWhithConnectedChannel(IEnumerable<dynamic> inputRows)
        {
            var rows = inputRows as IList<dynamic> ?? inputRows.ToList();
            if (!rows.Any())
            {
                return null;
            }
            var outRows = rows.Select(r => (channel)ConvertRowChannelWhithConnectedChannel(r)).ToList();
            return outRows;
        }

        public static channel ConvertRowChannelWhithConnectedChannel(dynamic sqlResponceChannelWithConnectedChannel)
        {
            var item = sqlResponceChannelWithConnectedChannel;

            var hasChannel = item.channel_connection__Id != null && item.channel_connection__Id != 0;
            if (!hasChannel)
            {
                throw new ArgumentNullException(Error.ChannelNotExist);
            }
            var channel = new channel
            {
                Id = (int)item.channel__channelId,
                channelType = (byte)item.channel__channelType,
                channelName = (string)item.channel__channelName,
                password = (string)item.channel__password,
                dateCreate = (int)item.channel__dateCreate,
                creatorId = (int)item.channel__creatorId,
                creatorName = (string)item.channel__creatorName,
                channelIcon = (string)item.channel__channelIcon
            };


            var hasChk = item.channel_connection__Id != null && item.channel_connection__Id != 0;
            channel_connection chCon = null;
            if (hasChk)
            {
                chCon = new channel_connection
                {
                    Id = (long)item.channel_connection__Id,
                    channelId = (int)item.channel_connection__channelId,
                    channelType = (byte)item.channel_connection__channelType,
                    userId = (int)item.channel_connection__userId,
                    password = (string)item.channel_connection__password,
                    messageRead = (bool)item.channel_connection__messageRead,
                    messageSend = (bool)item.channel_connection__messageSend
                };
            }

            if (!hasChk)
            {
                return channel;
            }
            chCon.SetChannel(channel);
            channel.SetConnections(new List<channel_connection>(1) { chCon });
            return channel;
        }

        public static List<channel> CombineChannelConnections(List<channel> rowChannels)
        {
            if (!rowChannels.Any())
            {
                return null;
            }
            var result = new List<channel>();
            var channelIds = rowChannels.Select(i => i.Id).Distinct().ToList();
            foreach (var channelId in channelIds)
            {
                var channelCollections = rowChannels.Where(i => i.Id == channelId).ToList();
                if (!channelCollections.Any())
                {
                    continue;
                }

                var inputChannel = channelCollections[0];
                var outChannel = new channel
                {
                    Id = inputChannel.Id,
                    creatorId = inputChannel.creatorId,
                    password = inputChannel.password,
                    channelIcon = inputChannel.channelIcon,
                    channelType = inputChannel.channelType,
                    channelName = inputChannel.channelName,
                    creatorName = inputChannel.creatorName,
                    dateCreate = inputChannel.dateCreate
                };


                var connectedChannels = channelCollections.Where(i => i.HasConnections()).Select(i => i.GetConnections()).ToList();
                if (connectedChannels.Any())
                {
                    var tmp = (from i in connectedChannels
                               from j in i
                               select
                                   new channel_connection
                                   {
                                       Id = j.Id,
                                       channelId = j.channelId,
                                       channelType = j.channelType,
                                       userId = j.userId,
                                       password = j.password,
                                       messageRead = j.messageRead,
                                       messageSend = j.messageSend
                                   }).ToList();

                    var cons = tmp.DistinctBy(i => i.channelId).ToList();
                    foreach (var i in cons)
                    {
                        i.SetChannel(outChannel);
                    }
                    outChannel.SetConnections(cons);
                }


                result.Add(outChannel);
            }


            return result;
        }
    }
}