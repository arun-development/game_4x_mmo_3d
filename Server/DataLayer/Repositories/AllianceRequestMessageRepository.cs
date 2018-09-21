using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Infrastructure.Alliance;

namespace Server.DataLayer.Repositories
{
    public interface IAllianceRequestMessageRepository :
        IAdapterDapper<alliance_request_message, AllianceRequestMessageDataModel, int>, IDeleteAllProcedure
    {
        IList<AllianceRequestMessageDataModel> UpdateAllianceIconInRequests(IDbConnection connection, int allianceId, string newIcon);
        bool AllianceRequestMessageDeleteUserRequestsAndSaveToHistory(IDbConnection connection, int fromUserId, int toAllianceId);

        IEnumerable<alliance_request_message> GetFromToRequestMessages(IDbConnection connection, int fromId,
            int toId, byte fromSourceType, byte toSourceType);
        IEnumerable<alliance_request_message> GetRequestMessages(IDbConnection connection, int fromId, byte fromSourceType, byte toSourceType);
    }

    public class AllianceRequestMessageRepository :
        AdapterDapperRepository<alliance_request_message, AllianceRequestMessageDataModel, int>,
        IAllianceRequestMessageRepository
    {
        public AllianceRequestMessageRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }


        public override bool DeleteAllProcedure(IDbConnection connection)
        {
 
            return _deleteAllProcedire(connection, "alliance_request_message_delete_all",false,"alliance_request_message_history", 1);
        }


        public override AllianceRequestMessageDataModel ConvertToWorkModel(alliance_request_message entity)
        {
            return _convertFromEntity(entity);
        }


        protected override void _setUpdatedData(alliance_request_message oldData,
            AllianceRequestMessageDataModel newData)
        {
            if (oldData.Id != newData.Id && newData.Id != default(int)) oldData.Id = newData.Id;
            var st = (byte) newData.SourceType;
            if (oldData.sourceType != st) oldData.sourceType = st;
            if (oldData.dateCreate != newData.DateCreate) oldData.dateCreate = newData.DateCreate;
            if (oldData.fromId != newData.FromId) oldData.fromId = newData.FromId;
            if (oldData.fromName != newData.FromName) oldData.fromName = newData.FromName;
            if (oldData.toId != newData.ToId) oldData.toId = newData.ToId;
            if (oldData.toName != newData.ToName) oldData.toName = newData.ToName;
            if (oldData.message != newData.Message) oldData.message = newData.Message;
            if (oldData.userAccepted != newData.UserAccepted) oldData.userAccepted = newData.UserAccepted;

            var acStatus = (byte) newData.AllianceAccepted;
            if (oldData.allianceAccepted != acStatus) oldData.allianceAccepted = acStatus;
            if (oldData.creatorIcon != newData.CreatorIcon) oldData.creatorIcon = newData.CreatorIcon;
        }


        private static AllianceRequestMessageDataModel _convertFromEntity(IAllianceRequestMessageDbItem data)
        {
            var result = new AllianceRequestMessageDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            MessageSourceType type;
            Enum.TryParse(data.sourceType.ToString(), out type);
            result.SourceType = type;
            result.DateCreate = data.dateCreate;
            result.FromId = data.fromId;
            result.FromName = data.fromName;
            result.ToId = data.toId;
            result.ToName = data.toName;
            result.Message = data.message;
            result.UserAccepted = data.userAccepted;

            var acStatus = Enum.Parse(typeof(ArmAllianceAcceptedStatus), data.allianceAccepted.ToString());
            result.AllianceAccepted = (ArmAllianceAcceptedStatus) acStatus;
            result.CreatorIcon = data.creatorIcon;
            return result;
        }

        #region Advanced

        public IList<AllianceRequestMessageDataModel> UpdateAllianceIconInRequests(IDbConnection connection, int allianceId, string newIcon)
        {
            if (allianceId == 0 || string.IsNullOrWhiteSpace(newIcon))
                return default(IList<AllianceRequestMessageDataModel>);
            return _provider.Procedure<alliance_request_message>(connection,
                "alliance_request_message_update_alliance_icon", new
                {
                    allianceId,
                    newIcon,
                    armAllianceSourceType = (byte) MessageSourceType.IsAlliance
                }).Select(_convertFromEntity).ToList();
        }

        public bool AllianceRequestMessageDeleteUserRequestsAndSaveToHistory(IDbConnection connection, int fromUserId, int toAllianceId)
        {
            ThrowIfConnectionIsNull(connection);
            return _provider.Procedure<bool>(connection,
                "alliance_request_message_delete_user_requests_and_save_to_history", new
                {
                    fromUserId,
                    toAllianceId,
                    armAllianceSourceType = (byte) MessageSourceType.IsAlliance,
                    armUserSourceType = (byte) MessageSourceType.IsUser
                }).FirstOrDefault();
        }

 

        public IEnumerable<alliance_request_message> GetFromToRequestMessages(IDbConnection connection, int fromId,int toId, byte fromSourceType, byte toSourceType)
        {
            ThrowIfConnectionIsNull(connection);
            var sql = $"SELECT * FROM {SchemeTableName} " +
                      $"WHERE (fromId={fromId} AND toId={toId} AND sourceType={fromSourceType}) " +
                      $"OR (fromId={toId} AND toId={fromId} AND sourceType={toSourceType})   ";
            return _provider.Text<alliance_request_message>(connection, sql);
        }

        public IEnumerable<alliance_request_message> GetRequestMessages(IDbConnection connection, int fromId, byte fromSourceType, byte toSourceType)
        {
            ThrowIfConnectionIsNull(connection);
            var sql = $"SELECT * FROM {SchemeTableName} " +
                      $"WHERE (fromId={fromId}  AND sourceType={fromSourceType}) " +
                      $"OR (toId={fromId} AND sourceType={toSourceType})   ";
            return _provider.Text<alliance_request_message>(connection, sql);
        }

   




        #endregion
    }
}