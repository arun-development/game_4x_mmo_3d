using System;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using Dapper;
using Server.Core.StaticData;
using Server.Extensions;
using Server.Modules.Localize;

namespace Server.DataLayer.Repositories
{
    public interface IGGameTypeRepository : IAdapterDapper<g_game_type, GGameTypeDataModel, byte>,
        IDeleteAllProcedure
    {
 
    }

    public class GGameTypeRepository :
        AdapterDapperRepository<g_game_type, GGameTypeDataModel, byte>, IGGameTypeRepository
    {
        public GGameTypeRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }

        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "g_game_type_delete_all",false);
        }

  


        public override GGameTypeDataModel ConvertToWorkModel(g_game_type entity)
        {
            return _convertFromEntity(entity);
        }


        protected override void _setUpdatedData(g_game_type oldData, GGameTypeDataModel newData)
        {
            if (newData.Description == null)
                throw new ArgumentNullException(Error.IsEmpty, nameof(newData.Description));

            var rDescription = newData.Description.ToSerealizeString();
            if (rDescription.Length > L10N.DefaultMaxLength) throw new ValidationException(Error.OverMaxLength);

            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.type != newData.Type) oldData.type = newData.Type;
            if (oldData.subType != newData.SubType) oldData.subType = newData.SubType;
            if (oldData.description != rDescription) oldData.description = rDescription;
        }


        private static GGameTypeDataModel _convertFromEntity(IGGameTypeDbItem data)
        {
            var result = new GGameTypeDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.Type = data.type;
            result.SubType = data.subType;
            result.Description = data.description.ToSpecificModel<L10N>();
            return result;
        }
    }
}