using System;
using System.Data;
using Server.Core.Infrastructure.Alliance;


namespace Server.DataLayer.Repositories
{
    public interface IAllianceRequestMessageHistoryRepository : IAdapterDapper<alliance_request_message_history, AllianceRequestMessageHistoryDataModel, int>, IDeleteAllProcedure
    {
 
    }

    public class AllianceRequestMessageHistoryRepository : AdapterDapperRepository<alliance_request_message_history, AllianceRequestMessageHistoryDataModel, int>,
        IAllianceRequestMessageHistoryRepository
    {
        public AllianceRequestMessageHistoryRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }
        public override bool DeleteAllProcedure(IDbConnection connection)
        {
 
            return _deleteAllProcedire(connection, "alliance_request_message_history_delete_all",false, "alliance_request_message", 1);
        }
 
        protected override void _setUpdatedData(alliance_request_message_history oldData,
            AllianceRequestMessageHistoryDataModel newData)
        {

            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.oldArmId != newData.OldArmId) oldData.oldArmId = newData.OldArmId;
            if (oldData.dateDelete != newData.DateDelete) oldData.dateDelete = newData.DateDelete;


            if (oldData.sourceType != newData.Id) oldData.sourceType = (byte)newData.SourceType;
            if (oldData.dateCreate != newData.DateCreate) oldData.dateCreate = newData.DateCreate;
            if (oldData.fromId != newData.FromId) oldData.fromId = newData.FromId;
            if (oldData.fromName != newData.FromName) oldData.fromName = newData.FromName;
            if (oldData.toId != newData.ToId) oldData.toId = newData.ToId;
            if (oldData.toName != newData.ToName) oldData.toName = newData.ToName;
            if (oldData.message != newData.Message) oldData.message = newData.Message;
            if (oldData.userAccepted != newData.UserAccepted) oldData.userAccepted = newData.UserAccepted;
            var acStatus = (byte)newData.AllianceAccepted;
            if (oldData.allianceAccepted != acStatus) oldData.allianceAccepted = acStatus;
            if (oldData.creatorIcon != newData.CreatorIcon) oldData.creatorIcon = newData.CreatorIcon;
        }


        public override AllianceRequestMessageHistoryDataModel ConvertToWorkModel(
            alliance_request_message_history entity)
        {
            return _convertFromEntity(entity);
        }



        private static AllianceRequestMessageHistoryDataModel _convertFromEntity(
            IAllianceRequestMessageHistoryDbItem data)
        {
            var result = new AllianceRequestMessageHistoryDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.OldArmId = data.oldArmId;
            result.DateDelete = data.dateDelete;

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
            result.AllianceAccepted = (ArmAllianceAcceptedStatus)acStatus;
            result.CreatorIcon = data.creatorIcon;
            return result;
        }
    }
}