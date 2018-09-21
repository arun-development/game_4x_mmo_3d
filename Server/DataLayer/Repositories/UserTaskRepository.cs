using System;
using System.Collections.Generic;
using System.Data;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive.Units;
using Server.Extensions;

namespace Server.DataLayer.Repositories
{
    public interface IUserTaskRepository : IAdapterDapper<user_task, UserTaskDataModel, int>,
        IDeleteAllProcedure
    {
    }

    public class UserTaskRepository :AdapterDapperRepository<user_task, UserTaskDataModel, int>,IUserTaskRepository
    {
        public UserTaskRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }
 
        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            ThrowIfConnectionIsNull(connection);
            var result = false;
            var sucsess = _deleteAllProcedire(connection, "user_report_delete_all", true, "user_report", 1);

            // ReSharper disable once InvertIf
            if (sucsess)
            {
                result = _deleteAllProcedire(connection, "user_task_delete_all", true, "user_task", 1);
                return result;
            }
            throw new NotImplementedException();  
 
        }

        public override UserTaskDataModel ConvertToWorkModel(user_task entity)
        {
            return _convertFromProcedure(entity);
        }


        protected override void _setUpdatedData(user_task oldData, UserTaskDataModel newData)
        {
            if (newData.SourceFleet == null)
                throw new ArgumentNullException(Error.IsEmpty, nameof(newData.SourceFleet));

            var sourceFleet = newData.SourceFleet.ToSerealizeString();

            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.sourceSystemName != newData.SourceSystemName)
                oldData.sourceSystemName = newData.SourceSystemName;
            if (oldData.sourceUserId != newData.SourceUserId) oldData.sourceUserId = newData.SourceUserId;
            if (oldData.sourceOwnId != newData.SourceOwnId) oldData.sourceOwnId = newData.SourceOwnId;
            if (oldData.sourceOwnType != newData.SourceOwnType) oldData.sourceOwnType = newData.SourceOwnType;
            if (oldData.sourceOwnName != newData.SourceOwnName) oldData.sourceOwnName = newData.SourceOwnName;
            if (oldData.sourceTypeId != newData.SourceTypeId) oldData.sourceTypeId = newData.SourceTypeId;
            if (oldData.sourceFleet != sourceFleet) oldData.sourceFleet = sourceFleet;
            if (oldData.isTransfer != newData.IsTransfer) oldData.isTransfer = newData.IsTransfer;
            if (oldData.isAtack != newData.IsAtack) oldData.isAtack = newData.IsAtack;
            if (oldData.dateActivate != newData.DateActivate) oldData.dateActivate = newData.DateActivate;
            if (oldData.duration != newData.Duration) oldData.duration = newData.Duration;
            if (oldData.canselation != newData.Canselation) oldData.canselation = newData.Canselation;
            if (oldData.targetSystemName != newData.TargetSystemName)
                oldData.targetSystemName = newData.TargetSystemName;
            if (oldData.targetPlanetId != newData.TargetPlanetId) oldData.targetPlanetId = newData.TargetPlanetId;
            if (oldData.targetPlanetTypeId != newData.TargetPlanetTypeId)
                oldData.targetPlanetTypeId = newData.TargetPlanetTypeId;
            if (oldData.targetPlanetName != newData.TargetPlanetName)
                oldData.targetPlanetName = newData.TargetPlanetName;
            if (oldData.taskEnd != newData.TaskEnd) oldData.taskEnd = newData.TaskEnd;
        }

        private static UserTaskDataModel _convertFromProcedure(IUTaskDbItem data)
        {
            var result = new UserTaskDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.SourceSystemName = data.sourceSystemName;
            result.SourceUserId = data.sourceUserId;
            result.SourceOwnId = data.sourceOwnId;
            result.SourceOwnType = data.sourceOwnType;
            result.SourceOwnName = data.sourceOwnName;
            result.SourceTypeId = data.sourceTypeId;
            result.SourceFleet = data.sourceFleet.ToSpecificModel<Dictionary<UnitType, int>>();
            result.IsTransfer = data.isTransfer ?? false;
            result.IsAtack = data.isAtack ?? false;
            result.DateActivate = data.dateActivate;
            result.Duration = data.duration;
            result.Canselation = data.canselation ?? false;
            result.TargetSystemName = data.targetSystemName;
            result.TargetPlanetId = data.targetPlanetId;
            result.TargetPlanetTypeId = data.targetPlanetTypeId;
            result.TargetPlanetName = data.targetPlanetName;
            result.TaskEnd = data.taskEnd;

            return result;
        }
    }
}