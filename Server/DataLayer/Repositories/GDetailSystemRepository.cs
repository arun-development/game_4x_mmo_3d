using System;
using System.ComponentModel.DataAnnotations;
using System.Data;
using Server.Core.Infrastructure;
using Server.Core.StaticData;
using Server.Extensions;
using Server.Modules.Localize;

namespace Server.DataLayer.Repositories
{
    public interface
        IGDetailSystemRepository : IAdapterDapper<g_detail_system, GDetailSystemDataModel, int>,
            IDeleteAllProcedure
    {
    }

    public class GDetailSystemRepository :
        AdapterDapperRepository<g_detail_system, GDetailSystemDataModel, int>,
        IGDetailSystemRepository
    {
        public GDetailSystemRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }


 
        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "g_detail_system_delete_all",false);
        }

        public override GDetailSystemDataModel ConvertToWorkModel(g_detail_system entity)
        {
            return _convertFromEntity(entity);
        }


        protected override void _setUpdatedData(g_detail_system oldData, GDetailSystemDataModel newData)
        {
            L10N description;
            if (newData.Description == null)
            {
                description = new L10N();
                description.InitializeField();
                description.En.Name = newData.Name;
                description.Ru.Name = newData.Name;
                description.Es.Name = newData.Name;
            }
            else
            {
                description = newData.Description;
            }
            var rDescription = description.ToSerealizeString();
            if (rDescription.Length > L10N.DefaultMaxLength) throw new ValidationException(Error.OverMaxLength);
            var allianceId = newData.AllianceId == 0 ? Npc.SkagryGameUserId : newData.AllianceId;

            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.typeId != newData.TypeId) oldData.typeId = newData.TypeId;
            if (oldData.name != newData.Name) oldData.name = newData.Name;
            if (oldData.userName != newData.UserName) oldData.userName = newData.UserName;
            if (oldData.allianceId != allianceId) oldData.allianceId = allianceId;
            if (oldData.description != rDescription) oldData.description = rDescription;
            if (Math.Abs(oldData.energyBonus - newData.EnergyBonus) > 0) oldData.energyBonus = newData.EnergyBonus;
        }

        private static GDetailSystemDataModel _convertFromEntity(IGDetailSystemDbItem data)
        {
            var result = new GDetailSystemDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.TypeId = data.typeId;
            result.Name = data.name;
            result.UserName = data.userName;
            result.AllianceId = data.allianceId == 0 ? Npc.SkagryGameUserId : data.allianceId;

            result.Description = data.description.ToSpecificModel<L10N>();
            result.EnergyBonus = data.energyBonus;
            return result;
        }
    }
}