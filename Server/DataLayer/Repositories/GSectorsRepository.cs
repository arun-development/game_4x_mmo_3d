using System;
using System.ComponentModel.DataAnnotations;
using System.Data;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.Extensions;
using Server.Modules.Localize;

namespace Server.DataLayer.Repositories
{
    public interface IGSectorsRepository : IAdapterDapper<g_sectors, GSectorsDataModel, short>,
        IDeleteAllProcedure
    {
    }

    public class GSectorsRepository :
        AdapterDapperRepository<g_sectors, GSectorsDataModel, short>,
        IGSectorsRepository
    {
        public GSectorsRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }


        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            ThrowIfConnectionIsNull(connection);
            var result = _deleteAllProcedire(connection, "g_sectors_delete_all", false, "g_sectors", 0);
            _provider._help_reset_index(connection, "g_system", 0);
            _provider._help_reset_index(connection, "g_geometry_planet", 0);
            _provider._help_reset_index(connection, "g_geometry_moon", 0);
            return result;
        }

        public override GSectorsDataModel ConvertToWorkModel(g_sectors entity)
        {
            return _convertFromEntity(entity);
        }


        protected override void _setUpdatedData(g_sectors oldData, GSectorsDataModel newData)
        {
            if (newData.Translate == null) throw new ArgumentNullException(Error.IsEmpty, nameof(newData.Translate));
            if (newData.Position == null) new ArgumentNullException(Error.IsEmpty, nameof(newData.Position));
            var position = newData.Position.ToSerealizeString();
            if (position.Length > 100) throw new ValidationException(Error.OverMaxLength);

            var description = newData.Translate.ToSerealizeString();
            if (description.Length > L10N.DefaultMaxLength) throw new ValidationException(Error.OverMaxLength);


            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.typeId != newData.TypeId) oldData.typeId = newData.TypeId;
            if (oldData.textureTypeId != newData.TextureTypeId) oldData.textureTypeId = newData.TextureTypeId;
            if (oldData.galaxyId != newData.GalaxyId) oldData.galaxyId = newData.GalaxyId;
            if (oldData.nativeName != newData.NativeName) oldData.nativeName = newData.NativeName;
            if (oldData.translate != description) oldData.translate = description;
            if (oldData.position != position) oldData.position = position;
            if (oldData.opened != newData.Opened) oldData.opened = newData.Opened;
        }

        private static GSectorsDataModel _convertFromEntity(IGSectorsDbItem data)
        {
            var result = new GSectorsDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.TypeId = data.typeId;
            result.TextureTypeId = data.textureTypeId;
            result.GalaxyId = data.galaxyId;
            result.NativeName = data.nativeName;
            result.Translate = data.translate.ToSpecificModel<L10N>();
            result.Position = data.position.ToSpecificModel<Vector3>();
            result.Opened = data.opened;
            return result;
        }
    }
}