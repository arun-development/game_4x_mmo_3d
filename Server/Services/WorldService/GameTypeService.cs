using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Interfaces.World;
using Server.Core.StaticData;
using Server.DataLayer;
using Server.DataLayer.LocalStorageCaches;
using Server.DataLayer.Repositories;

namespace Server.Services.WorldService
{
    public class GameTypeService : IGameTypeService
    {
        #region Declare

        private readonly IGGameTypeLocalStorageCache _gameTypeCache;
        private readonly IGGameTypeRepository _igGameTypeRepository;
 
        private readonly IGTextureTypeLocalStorageCache _textureTypeCahe;

        private readonly IGTextureTypeRepository _textureTypeRepo;


        public GameTypeService(IGGameTypeRepository igGameTypeRepository,
            IGGameTypeLocalStorageCache gameTypeCache,
 
            IGTextureTypeRepository textureTypeRepo,
            IGTextureTypeLocalStorageCache textureTypeCahe)
        {
            _igGameTypeRepository = igGameTypeRepository;
            _gameTypeCache = gameTypeCache;
 
            _textureTypeRepo = textureTypeRepo;
            _textureTypeCahe = textureTypeCahe;
        }

        #endregion


        #region Sync

        #region GGameType

        public IList<GGameTypeDataModel> GetGGameTypes(IDbConnection connection, string typeName, string subTypeName = null)
        {
            var types = _gameTypeCache.LocalGetAll(connection);
            return subTypeName == null
                ? types.Where(i => i.Type == typeName).ToList()
                : types.Where(i => i.Type == typeName && i.SubType == subTypeName).ToList();
        }

        public GGameTypeDataModel GetGGameType(IDbConnection connection, byte typeId)
        {
            return _gameTypeCache.GetById(connection,typeId, true);
        }

        public IList<GGameTypeDataModel> GetAllGGameTypes(IDbConnection connection)
        {
            return _igGameTypeRepository.GetAllModels(connection);
        }


        public string Test(string message = "Ok")
        {
            return message;
        }


        public void DeleteGGameType(IDbConnection connection, byte typeId)
        {
            var old = _gameTypeCache.GetById(connection,typeId, true);
            if (old == null) return;
            var sucsess = _igGameTypeRepository.Delete(connection,typeId);
            //_provider.Commit();
            if (sucsess) _gameTypeCache.DeleteItem(typeId);
            else throw new NotImplementedException(Error.ErrorInUpdateDb);
        }

        public void DeleteAllGgameType(IDbConnection connection)
        {
            if (!_igGameTypeRepository.HasItems(connection))
            {
                var suc = _igGameTypeRepository.DeleteAllProcedure(connection);
                //_provider.Commit();
                if (suc) _gameTypeCache.ClearStorage();
                else throw new NotImplementedException(Error.ErrorInUpdateDb);
            }
        }

        public GGameTypeDataModel AddOrUpdate(IDbConnection connection, GGameTypeDataModel item)
        {
            throw new NotImplementedException();
        }

        #endregion

        #region GTextureType

        public IList<GTextureTypeDataModel> GetTextures(IDbConnection connection, string gameTypeName)
        {
            var types = _gameTypeCache.LocalWhereSelect(connection,i => i.Type == gameTypeName, i => i.Id);
            var textures = _textureTypeCahe.LocalGetAll(connection);
            return textures.Where(i => types.Contains(i.GameTypeId)).ToList();
        }

        public IList<GTextureTypeDataModel> GetTextures(IDbConnection connection, short gameTypeId)
        {
            return _textureTypeCahe.LocalWhereSelect(connection,i => i.GameTypeId == gameTypeId, i => i);
        }

        public IList<GTextureTypeDataModel> GetTextures(IDbConnection connection, string baseTypeName, string subTypeName)
        {
            var gTypes = GetGGameTypes(connection, baseTypeName, subTypeName);
            var gTIds = gTypes.Select(i => i.Id);
            var textures = _textureTypeCahe.LocalGetAll(connection);
            return textures.Where(texture => gTIds.Contains(texture.GameTypeId)).ToList();
        }

        public short GetRandTextureId(IList<GTextureTypeDataModel> textures, Random rand)
        {
            var textureIds = textures.Select(i => i.Id).ToList();
            if (textureIds.Count == 1) return textureIds[0];
            return textureIds[rand.Next(0, textureIds.Count)];
        }

        public GTextureTypeDataModel AddOrUpdateTextureType(IDbConnection connection, GTextureTypeDataModel dataModel)
        {
            throw new NotImplementedException();
        }

        #endregion

        #endregion
    }
}