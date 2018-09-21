using System;
using System.ComponentModel.DataAnnotations;
using System.Data;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.Extensions;
using Server.Modules.Localize;

namespace Server.DataLayer.Repositories
{
    public interface IGGalaxyRepository : IAdapterDapper<g_galaxy, GGalaxyDataModel, byte>,
        IDeleteAllProcedure
    {
    }

    public class GGalaxyRepository :
        AdapterDapperRepository<g_galaxy, GGalaxyDataModel, byte>,
        IGGalaxyRepository
    {
        public GGalaxyRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }


        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            var result = false;
            var sucsess = _deleteAllProcedire(connection, "g_galaxy_delete_all", false);

            // ReSharper disable once InvertIf
            if (sucsess)
            {
                //_provider._help_reset_index(connection, "g_sectors", 0);// нет  авто инкремента
                _provider._help_reset_index(connection, "g_system", 0);
                _provider._help_reset_index(connection, "g_geometry_planet", 0);
                _provider._help_reset_index(connection, "g_geometry_moon", 0);
                result = true;
            }
            return result;
        }

 
        public override GGalaxyDataModel ConvertToWorkModel(g_galaxy entity)
        {
            return _convertFromEntity(entity);
        }


        protected override void _setUpdatedData(g_galaxy oldData, GGalaxyDataModel newData)
        {
            var rDescription = newData.Translate.ToSerealizeString();
            if (rDescription.Length > L10N.DefaultMaxLength) throw new ValidationException(Error.OverMaxLength);
            if (newData.Position == null) throw new ArgumentException(Error.IsEmpty, nameof(newData.Position));
            var position = newData.Position.ToSerealizeString();

            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.typeId != newData.TypeId) oldData.typeId = newData.TypeId;
            if (oldData.textureTypeId != newData.TextureTypeId) oldData.textureTypeId = newData.TextureTypeId;

            if (oldData.nativeName != newData.NativeName) oldData.nativeName = newData.NativeName;
            if (oldData.translate != rDescription) oldData.translate = rDescription;
            if (oldData.position != position) oldData.position = position;
            if (oldData.opened != newData.Opened) oldData.opened = newData.Opened;
        }

        private static GGalaxyDataModel _convertFromEntity(IGGalaxyDbItem data)
        {
            //logic heare
            var result = new GGalaxyDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.TypeId = data.typeId;
            result.TextureTypeId = data.textureTypeId;

            result.NativeName = data.nativeName;
            result.Translate = data.translate.ToSpecificModel<L10N>();
            result.Position = data.position.ToSpecificModel<Vector3>();
            result.Opened = data.opened;

            return result;
        }
    }
}