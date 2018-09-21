using System.Data;

namespace Server.DataLayer.Repositories
{
    public interface
        IUserMotherJumpRepository : IAdapterDapper<user_mother_jump, UserMotherJumpDataModel, int>,
            IDeleteAllProcedure
    {
    }

    public class UserMotherJumpRepository :
        AdapterDapperRepository<user_mother_jump, UserMotherJumpDataModel, int>,
        IUserMotherJumpRepository
    {
        public UserMotherJumpRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }

 
        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "user_mother_jump_delete_all", false);
        }

        public override UserMotherJumpDataModel ConvertToWorkModel(user_mother_jump entity)
        {
            return _convertFromProcedure(entity);
        }

        protected override void _setUpdatedData(user_mother_jump oldData, UserMotherJumpDataModel newData)
        {
            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.motherId != newData.MotherId) oldData.motherId = newData.MotherId;
            if (oldData.startTime != newData.StartTime) oldData.startTime = newData.StartTime;
            if (oldData.endTime != newData.EndTime) oldData.endTime = newData.EndTime;
            if (oldData.cancelJump != newData.CancelJump) oldData.cancelJump = newData.CancelJump;
            if (oldData.completed != newData.Completed) oldData.completed = newData.Completed;
            if (oldData.startSystem != newData.StartSystem) oldData.startSystem = newData.StartSystem;
            if (oldData.targetSystem != newData.TargetSystem) oldData.targetSystem = newData.TargetSystem;
        }

        private static UserMotherJumpDataModel _convertFromProcedure(IUMmotherJumpDbItem data)
        {
            var result = new UserMotherJumpDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.MotherId = data.motherId;
            result.StartTime = data.startTime;
            result.EndTime = data.endTime;
            result.CancelJump = data.cancelJump;
            result.Completed = data.completed;
            result.StartSystem = data.startSystem;
            result.TargetSystem = data.targetSystem;
            return result;
        }
    }
}