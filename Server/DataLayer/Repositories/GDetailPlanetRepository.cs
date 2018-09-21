using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Resources;
using Server.Core.СompexPrimitive.Units;
using Server.Extensions;
using Server.Modules.Localize;

namespace Server.DataLayer.Repositories
{
    public interface
        IGDetailPlanetRepository : IAdapterDapper<g_detail_planet, GDetailPlanetDataModel, int>,
            IDeleteAllProcedure
    {
    }

    public class GDetailPlanetRepository :
        AdapterDapperRepository<g_detail_planet, GDetailPlanetDataModel, int>, IGDetailPlanetRepository
    {
        public GDetailPlanetRepository(IDbProvider dataProvider) : base(dataProvider)
        {
            UpsertSingleItemTemplate = _createUpSertTemplateWithSelect();
        }

        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "g_detail_planet_delete_all",false);
        }
 

        public override GDetailPlanetDataModel ConvertToWorkModel(g_detail_planet entity)
        {
            return _convertFromEntity(entity);
        }


        protected override void _setUpdatedData(g_detail_planet oldData, GDetailPlanetDataModel newData)
        {
            if (newData.Description == null)
                throw new ArgumentNullException(Error.IsEmpty, nameof(newData.Description));
            if (newData.Resources == null) throw new ArgumentNullException(Error.IsEmpty, nameof(newData.Resources));
            if (newData.Hangar == null) throw new ArgumentNullException(Error.IsEmpty, nameof(newData.Hangar));
            if (newData.BuildSpaceShipyard == null)
                throw new ArgumentNullException(Error.IsEmpty, nameof(newData.BuildSpaceShipyard));
            if (newData.BuildExtractionModule == null)
                throw new ArgumentNullException(Error.IsEmpty, nameof(newData.BuildExtractionModule));
            if (newData.BuildEnergyConverter == null)
                throw new ArgumentNullException(Error.IsEmpty, nameof(newData.BuildEnergyConverter));
            if (newData.BuildStorage == null)
                throw new ArgumentNullException(Error.IsEmpty, nameof(newData.BuildStorage));
            if (newData.Turels == null) throw new ArgumentNullException(Error.IsEmpty, nameof(newData.Turels));
            if (newData.ExtractionProportin == null)
                throw new ArgumentNullException(Error.IsEmpty, nameof(newData.ExtractionProportin));

            var description = newData.Description.ToSerealizeString();
            if (description.Length > L10N.DefaultMaxLength) throw new ValidationException(Error.OverMaxLength);

            var resources = newData.Resources.ToSerealizeString();
            var hangar = newData.Hangar.ToSerealizeString();
            var buildSpaceShipyard = newData.BuildSpaceShipyard.ToSerealizeString();
            var buildExtractionModule = newData.BuildExtractionModule.ToSerealizeString();
            var buildEnergyConverter = newData.BuildEnergyConverter.ToSerealizeString();
            var buildStorage = newData.BuildStorage.ToSerealizeString();
            var turels = newData.Turels.ToSerealizeString();
            var unitProgress = newData.UnitProgress?.ToSerealizeString();


            if (newData.ExtractionProportin == null)
                newData.ExtractionProportin = MaterialResource.InitBaseOwnProportion();

            var extractionProportin = newData.ExtractionProportin.ToSerealizeString();

            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.name != newData.Name) oldData.name = newData.Name;
            if (oldData.description != description) oldData.description = description;
            if (oldData.moonCount != newData.MoonCount) oldData.moonCount = newData.MoonCount;
            if (oldData.userId != newData.UserId) oldData.userId = newData.UserId;
            if (oldData.allianceId != newData.AllianceId) oldData.allianceId = newData.AllianceId;
            if (oldData.lastActive != newData.LastActive) oldData.lastActive = newData.LastActive;
            if (oldData.dangerLevel != newData.DangerLevel) oldData.dangerLevel = newData.DangerLevel;
            if (oldData.resources != resources) oldData.resources = resources;
            if (oldData.hangar != hangar) oldData.hangar = hangar;
            if (oldData.buildSpaceShipyard != buildSpaceShipyard) oldData.buildSpaceShipyard = buildSpaceShipyard;
            if (oldData.buildExtractionModule != buildExtractionModule)
                oldData.buildExtractionModule = buildExtractionModule;
            if (oldData.buildEnergyConverter != buildEnergyConverter)
                oldData.buildEnergyConverter = buildEnergyConverter;
            if (oldData.buildStorage != buildStorage) oldData.buildStorage = buildStorage;
            if (oldData.turels != turels) oldData.turels = turels;
            if (oldData.unitProgress != unitProgress) oldData.unitProgress = unitProgress;
            if (oldData.extractionProportin != extractionProportin) oldData.extractionProportin = extractionProportin;
            if (oldData.lastUpgradeProductionTime != newData.LastUpgradeProductionTime)
                oldData.lastUpgradeProductionTime = newData.LastUpgradeProductionTime;
        }


        private static GDetailPlanetDataModel _convertFromEntity(IGDetailPlanetDbItem data)
        {
            var result = new GDetailPlanetDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.Name = data.name;
            result.Description = data.description.ToSpecificModel<L10N>();
            result.MoonCount = data.moonCount;
            result.UserId = data.userId;
            result.AllianceId = data.allianceId;
            result.LastActive = data.lastActive;
            result.DangerLevel = data.dangerLevel;
            result.Resources = data.resources.ToSpecificModel<StorageResources>();
            result.Hangar = data.hangar.ToSpecificModel<Dictionary<UnitType, int>>();
            result.BuildSpaceShipyard = data.buildSpaceShipyard.ToSpecificModel<ItemProgress>();
            result.BuildExtractionModule = data.buildExtractionModule.ToSpecificModel<ItemProgress>();
            result.BuildEnergyConverter = data.buildEnergyConverter.ToSpecificModel<ItemProgress>();
            result.BuildStorage = data.buildStorage.ToSpecificModel<ItemProgress>();
            result.Turels = data.turels.ToSpecificModel<ItemProgress>();

            result.UnitProgress = data.unitProgress == null
                ? new Dictionary<UnitType, TurnedUnit>()
                : data.unitProgress.ToSpecificModel<Dictionary<UnitType, TurnedUnit>>();
            result.ExtractionProportin = data.extractionProportin == null
                ? MaterialResource.InitBaseOwnProportion()
                : data.extractionProportin.ToSpecificModel<MaterialResource>();

            result.LastUpgradeProductionTime = data.lastUpgradeProductionTime;
            return result;
        }
    }
}