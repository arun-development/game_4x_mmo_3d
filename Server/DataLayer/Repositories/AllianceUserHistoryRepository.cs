using System.Data;

namespace Server.DataLayer.Repositories
{
    public interface IAllianceUserHistoryRepository :
        IAdapterDapper<alliance_user_history, AllianceUserHistoryDataModel, int>
    {
    }

    public class AllianceUserHistoryRepository :
        AdapterDapperRepository<alliance_user_history, AllianceUserHistoryDataModel, int>,
        IAllianceUserHistoryRepository
    {
        public AllianceUserHistoryRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }


        public override AllianceUserHistoryDataModel ConvertToWorkModel(alliance_user_history entity)
        {
            return _convertFromEntity(entity);
        }
        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "alliance_user_history_delete_all",false, "alliance_user_history", 1);

        }
 


        protected override void _setUpdatedData(alliance_user_history oldData, AllianceUserHistoryDataModel newData)
        {
            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.allianceId != newData.AllianceId) oldData.allianceId = newData.AllianceId;
            if (oldData.userId != newData.UserId) oldData.userId = newData.UserId;
            if (oldData.dateCreate != newData.DateCreate) oldData.dateCreate = newData.DateCreate;
            if (oldData.roleId != newData.RoleId) oldData.roleId = newData.RoleId;


            if (oldData.dateLeave != newData.DateLeave) oldData.dateLeave = newData.DateLeave;
            if (oldData.leave != newData.Leave) oldData.leave = newData.Leave;
            if (oldData.disbandet != newData.Disbandet) oldData.disbandet = newData.Disbandet;
        }


        private static AllianceUserHistoryDataModel _convertFromEntity(IAllianceUserHistoryDbItem data)
        {
            var result = new AllianceUserHistoryDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.AllianceId = data.allianceId;
            result.UserId = data.userId;
            result.DateCreate = data.dateCreate;
            result.RoleId = data.roleId;

            result.DateLeave = data.dateLeave;
            result.Leave = data.leave;
            result.Disbandet = data.disbandet;
            return result;
        }
    }
}