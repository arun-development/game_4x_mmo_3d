using System;
using System.ComponentModel.DataAnnotations;
using System.Data;
using Server.Core.StaticData;
using Server.Extensions;
using Server.Modules.Localize;

namespace Server.DataLayer.Repositories
{
    public interface IGDetailMoonRepository : IAdapterDapper<g_detail_moon, GDetailMoonDataModel, int>,
        IDeleteAllProcedure
    {
    }

    public class GDetailMoonRepository :
        AdapterDapperRepository<g_detail_moon, GDetailMoonDataModel, int>,
        IGDetailMoonRepository
    {
        public GDetailMoonRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }


 
        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "g_detail_moon_delete_all",false);
        }

        public override GDetailMoonDataModel ConvertToWorkModel(g_detail_moon entity)
        {
            return _convertFromEntity(entity);
        }

        protected override void _setUpdatedData(g_detail_moon oldData, GDetailMoonDataModel newData)
        {
            if (newData.Description == null)
                throw new ArgumentNullException(Error.IsEmpty, nameof(newData.Description));
            var description = newData.Description.ToSerealizeString();
            if (description.Length > L10N.DefaultMaxLength) throw new ValidationException(Error.OverMaxLength);

            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.name != newData.Name) oldData.name = newData.Name;
            if (oldData.description != description) oldData.description = description;
        }

 
        private static GDetailMoonDataModel _convertFromEntity(IGDetailMoonDbItem data)
        {
            var result = new GDetailMoonDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.Name = data.name;
            result.Description = data.description.ToSpecificModel<L10N>();
            return result;
        }
    }
}