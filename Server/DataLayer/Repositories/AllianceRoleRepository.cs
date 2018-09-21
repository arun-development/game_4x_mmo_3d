using System.Data;

namespace Server.DataLayer.Repositories
{
    public interface IAllianceRoleRepository : IAdapterDapper<alliance_role, AllianceRoleDataModel, byte>,
        IDeleteAllProcedure
    {
    }

    public class AllianceRoleRepository :
        AdapterDapperRepository<alliance_role, AllianceRoleDataModel, byte>,
        IAllianceRoleRepository
    {
        public AllianceRoleRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }

        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            
            return _deleteAllProcedire(connection, "alliance_role_delete_all",false);
        }


        public override AllianceRoleDataModel ConvertToWorkModel(alliance_role entity)
        {
            return _convertFromEntity(entity);
        }


        protected override void _setUpdatedData(alliance_role oldData, AllianceRoleDataModel newData)
        {
            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.name != newData.RoleName) oldData.name = newData.RoleName;
            if (oldData.editAllianceInfo != newData.EditAllianceInfo)
                oldData.editAllianceInfo = newData.EditAllianceInfo;
            if (oldData.messageRead != newData.MessageRead) oldData.messageRead = newData.MessageRead;
            if (oldData.messageSend != newData.MessageSend) oldData.messageSend = newData.MessageSend;
            if (oldData.showManage != newData.ShowManage) oldData.showManage = newData.ShowManage;
            if (oldData.setTech != newData.SetTech) oldData.setTech = newData.SetTech;
            if (oldData.canManagePermition != newData.CanManagePermition)
                oldData.canManagePermition = newData.CanManagePermition;
            if (oldData.acceptNewMembers != newData.AcceptNewMembers)
                oldData.acceptNewMembers = newData.AcceptNewMembers;
            if (oldData.deleteMembers != newData.DeleteMembers) oldData.deleteMembers = newData.DeleteMembers;
        }

        private static AllianceRoleDataModel _convertFromEntity(IAllianceRoleDbItem data)
        {
            var result = new AllianceRoleDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.RoleName = data.name;
            result.EditAllianceInfo = data.editAllianceInfo;
            result.MessageRead = data.messageRead;
            result.MessageSend = data.messageSend;
            result.ShowManage = data.showManage;
            result.SetTech = data.setTech;
            result.CanManagePermition = data.canManagePermition;
            result.AcceptNewMembers = data.acceptNewMembers;
            result.DeleteMembers = data.deleteMembers;
            return result;
        }
    }
}