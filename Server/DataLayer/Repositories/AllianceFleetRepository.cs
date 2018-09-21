using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Extensions;

namespace Server.DataLayer.Repositories

{
    public interface IAllianceFleetRepository : IAdapterDapper<alliance_fleet, AllianceFleetDataModel, int>, IDeleteAllProcedure
    {
    }

    public class AllianceFleetRepository :
        AdapterDapperRepository<alliance_fleet, AllianceFleetDataModel, int>, IAllianceFleetRepository
    {
        public AllianceFleetRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }
        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            ThrowIfConnectionIsNull(connection);
            return _deleteAllProcedire(connection, "alliance_fleet_delete_all", false, "alliance_fleet", 0);
        }

        public override AllianceFleetDataModel ConvertToWorkModel(alliance_fleet entity)
        {
            return _convertFromEntity(entity);
        }

        protected override void _setUpdatedData(alliance_fleet oldData, AllianceFleetDataModel newData)
        {
            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.creatorId != newData.CreatorId) oldData.creatorId = newData.CreatorId;
            if (oldData.creatorName != newData.CreatorName) oldData.creatorName = newData.CreatorName;
            if (oldData.fleetIdCreator != newData.FleetIdCreator) oldData.fleetIdCreator = newData.FleetIdCreator;
            var fleetIds = newData.FleetIds.Any()
                ? newData.FleetIds.ToSerealizeString()
                : new List<int>().ToSerealizeString();
            if (oldData.fleetIds != fleetIds) oldData.fleetIds = fleetIds;
        }


        private static AllianceFleetDataModel _convertFromEntity(IAllianceFleetDbItem data)
        {
            var result = new AllianceFleetDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.CreatorId = data.creatorId;
            result.AllianceId = data.allianceId;
            result.CreatorName = data.creatorName;
            result.FleetIdCreator = data.fleetIdCreator;
            result.FleetIds = string.IsNullOrWhiteSpace(data.fleetIds)
                ? new List<int>()
                : data.fleetIds.ToSpecificModel<List<int>>();
            return result;
        }


    }
}