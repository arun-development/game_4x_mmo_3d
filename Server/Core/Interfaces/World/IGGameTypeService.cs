using System;
using System.Collections.Generic;
using System.Data;
using Server.DataLayer;

namespace Server.Core.Interfaces.World
{
    public interface IGGameTypeService<TPrimaryKeyType, TDataModel> where TPrimaryKeyType : struct
        where TDataModel : class
    {
 

        //sync
        IList<TDataModel> GetGGameTypes(IDbConnection connection, string typeName, string subTypeName = null);
        TDataModel GetGGameType(IDbConnection connection, TPrimaryKeyType typeId);
        IList<TDataModel> GetAllGGameTypes(IDbConnection connection);
    }

    public interface IGTextureTypeService<TPrimaryKeyType, TDataModel> where TPrimaryKeyType : struct
        where TDataModel : class
    {
 
 
        //sync
        IList<TDataModel> GetTextures(IDbConnection connection, string gameTypeName);
        IList<TDataModel> GetTextures(IDbConnection connection, short gameTypeId);
        IList<TDataModel> GetTextures(IDbConnection connection, string baseTypeName, string subTypeName);

        TDataModel AddOrUpdateTextureType(IDbConnection connection, TDataModel dataModel);
     
        TPrimaryKeyType GetRandTextureId(IList<TDataModel> textures, Random rand);
    }


    public interface IGameTypeService : IGGameTypeService<byte, GGameTypeDataModel>, IGTextureTypeService<short, GTextureTypeDataModel>, ITest
    {
    }
}
