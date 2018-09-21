using System;
using System.Collections.Generic;
using System.Data;
using Server.DataLayer;

namespace Server.Core.Interfaces.World
{
    public interface IGGalaxyService<TPrimaryKeyType, TDataModel> : IBaseService<TPrimaryKeyType, TDataModel>
        where TPrimaryKeyType : struct where TDataModel : class
    {

 
        //sync

        TResult GetGalaxyById<TResult>(IDbConnection connection, TPrimaryKeyType galaxyId, Func<TDataModel, TResult> selector);
        IList<byte> GetGalaxyIds(IDbConnection connection);
        IList<TDataModel> GetAllGalxies(IDbConnection connection);
        bool GalaxyDataExist(IDbConnection connection);
     
    }

    public interface IGGalaxyService : IGGalaxyService<byte, GGalaxyDataModel>
    {
    }
}
