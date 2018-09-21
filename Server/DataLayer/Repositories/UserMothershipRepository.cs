using System;
using System.Collections.Generic;
using System.Data;
using Server.Core.StaticData;
using Server.Core.Tech;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Resources;
using Server.Core.СompexPrimitive.Units;
using Server.Extensions;

namespace Server.DataLayer.Repositories
{
    public interface
        IUserMothershipRepository : IAdapterDapper<user_mothership, UserMothershipDataModel, int>,
            IDeleteAllProcedure
    {
        bool Update(IDbConnection connection, UserMothershipDataModel mother);
    }

    public class UserMothershipRepository :
        AdapterDapperRepository<user_mothership, UserMothershipDataModel, int>,
        IUserMothershipRepository
    {
        public UserMothershipRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }


        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "user_mothership_delete_all", false);
        }

 

        public bool Update(IDbConnection connection, UserMothershipDataModel mother)
        {
            try
            {

 
                // @Id  int,
                // @startSystemId int,
                // @resources nvarchar(MAX),
                // @hangar nvarchar(MAX),
                // @unitProgress nvarchar(MAX),
                // @laboratoryProgress nvarchar(MAX), 
                // @extractionProportin nvarchar(MAX),
                // @techProgress nvarchar(MAX),
                // @lastUpgradeProductionTime int
                _provider.ExecProcedure(connection, "user_mothership_update", ConvertToEntity(mother));
                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
   ;
        }

        public override UserMothershipDataModel ConvertToWorkModel(user_mothership entity)
        {
            return _convertFromProcedure(entity);
        }


        protected override void _setUpdatedData(user_mothership oldData, UserMothershipDataModel newData)
        {
            if (newData.Resources == null) throw new ArgumentNullException(Error.IsEmpty, nameof(newData.Resources));
            if (newData.Hangar == null) throw new ArgumentNullException(Error.IsEmpty, nameof(newData.Hangar));
            if (newData.TechProgress == null)
                throw new ArgumentNullException(Error.IsEmpty, nameof(newData.TechProgress));
            //todo  временно поставил null ( заменить на нот нул когда будет логика лаборатории)
            if (newData.LaboratoryProgress == null) newData.LaboratoryProgress = new ItemProgress();

            var resources = newData.Resources.ToSerealizeString();
            var hangar = newData.Hangar.ToSerealizeString();
            var unitProgress = newData.UnitProgress == null ? "{}" : newData.UnitProgress.ToSerealizeString();
            var laboratoryProgress = newData.LaboratoryProgress.ToSerealizeString();
            var extractionProportin = newData.ExtractionProportin.ToSerealizeString();
            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.startSystemId != newData.StartSystemId) oldData.startSystemId = newData.StartSystemId;
            if (oldData.resources != resources) oldData.resources = resources;
            if (oldData.hangar != hangar) oldData.hangar = hangar;
            if (oldData.unitProgress != unitProgress) oldData.unitProgress = unitProgress;
            if (oldData.laboratoryProgress != laboratoryProgress) oldData.laboratoryProgress = laboratoryProgress;
            if (oldData.extractionProportin != extractionProportin) oldData.extractionProportin = extractionProportin;

            var techProgress = newData.TechProgress.ToSerealizeString();
            if (oldData.techProgress != techProgress) oldData.techProgress = techProgress;

            if (oldData.lastUpgradeProductionTime != newData.LastUpgradeProductionTime)
                oldData.lastUpgradeProductionTime = newData.LastUpgradeProductionTime;
        }


        private static UserMothershipDataModel _convertFromProcedure(IUserMothershipDbItem data)
        {
            var result = new UserMothershipDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.StartSystemId = data.startSystemId;
            result.Resources = data.resources.ToSpecificModel<StorageResources>();
            result.Hangar = data.hangar.ToSpecificModel<Dictionary<UnitType, int>>();
            result.UnitProgress = data.unitProgress == null
                ? new Dictionary<UnitType, TurnedUnit>()
                : data.unitProgress.ToSpecificModel<Dictionary<UnitType, TurnedUnit>>();

            result.LaboratoryProgress = data.laboratoryProgress == null
                ? new ItemProgress()
                : data.laboratoryProgress.ToSpecificModel<ItemProgress>();

            result.ExtractionProportin = data.extractionProportin.ToSpecificModel<MaterialResource>();
            result.TechProgress = data.techProgress.ToSpecificModel<Dictionary<TechType, ItemProgress>>();
            result.LastUpgradeProductionTime = data.lastUpgradeProductionTime;

            return result;
        }
    }
}