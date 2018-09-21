using System;
using System.Collections.Generic;
using System.Data;
using Server.Core.Map.Structure;
using Server.DataLayer;

namespace Server.Core.Interfaces.World
{
    public interface IGSectorsService<TPrimaryKeyType, TDataModel> : IBaseService<TPrimaryKeyType, TDataModel>
        where TPrimaryKeyType : struct where TDataModel : class
    {
        #region Sync

        IList<TResult> GetActiveSectors<TResult>(IDbConnection connection, Func<TDataModel, TResult> selector);

        /// <summary>
        ///     Возвращает все сктора во всех существующих галактиках
        /// </summary>
        /// <param name="connection"></param>
        /// <returns></returns>
        IList<Sector> GetInitSectors(IDbConnection connection);

        IList<TDataModel> GetAllSectors(IDbConnection connection);
        IList<TResult> GetSectorsByGalaxy<TResult>(IDbConnection connection, byte galaxyId, Func<TDataModel, TResult> selector);
        TResult GetById<TResult>(IDbConnection connection, short sectorId, Func<TDataModel, TResult> selector);
        IList<TDataModel> AddOrUpdateAllSectors(IDbConnection connection, IList<TDataModel> dataModel);

        void ResetSectorCahce();

        #endregion
    }

    public interface IGSectorsService : IGSectorsService<short, GSectorsDataModel>
    {
 
    }
}