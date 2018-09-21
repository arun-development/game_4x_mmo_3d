using System;
using System.Collections.Generic;
using System.Data;
using Server.Core.Interfaces.World;
using Server.Core.StaticData;
using Server.DataLayer;
using Server.DataLayer.LocalStorageCaches;
using Server.DataLayer.Repositories;

namespace Server.Services.WorldService
{
    public class GGalaxyService : IGGalaxyService
    {
        #region Declare

        private readonly IGGalaxyLocalStorageCache _gGalaxyCache;
        private readonly IGGalaxyRepository _igGalaxyRepository;


        public GGalaxyService(IGGalaxyRepository igGalaxyRepository,
            IGGalaxyLocalStorageCache gGalaxyCache)
        {
            _igGalaxyRepository = igGalaxyRepository;
            _gGalaxyCache = gGalaxyCache;
        }

        #endregion

        #region Interface

        public string Test(string message = "Ok")
        {
            return message;
        }

        #endregion


        #region Sync

        public TResult GetGalaxyById<TResult>(IDbConnection connection, byte galaxyId, Func<GGalaxyDataModel, TResult> selector)
        {
            return selector(_gGalaxyCache.GetById(connection,galaxyId, true));
        }

        public IList<byte> GetGalaxyIds(IDbConnection connection)
        {
            return _gGalaxyCache.GetLocalStorageKeys(connection);
        }

        public IList<GGalaxyDataModel> GetAllGalxies(IDbConnection connection)
        {
            return _gGalaxyCache.LocalGetAll(connection);
        }


        public GGalaxyDataModel AddOrUpdate(IDbConnection connection, GGalaxyDataModel dataModel)
        {
            var db = _igGalaxyRepository.AddOrUpdateeModel(connection,dataModel);
            return _gGalaxyCache.UpdateLocalItem(connection,db);
        }

        public bool Delete(IDbConnection connection, byte galaxyId)
        {
            var old = _gGalaxyCache.GetById(connection,galaxyId, true);
            if (old == null)
            {
                return true;
            }
            var sucsess = _igGalaxyRepository.Delete(connection,galaxyId);
            //_provider.Commit();
            if (sucsess)
            {
                 _gGalaxyCache.DeleteItem(galaxyId);
            }
            else
            {
                throw new NotImplementedException(Error.ErrorInUpdateDb);
            }
            return sucsess;
        }


 
        public bool DeleteAll(IDbConnection connection)
        {
            var result = false;
            try
            {
                result =  _igGalaxyRepository.DeleteAllProcedure(connection);
            }
            finally
            {
                _gGalaxyCache.ClearStorage();
            }
            return result;
        }

        public bool GalaxyDataExist(IDbConnection connection)
        {
            return _gGalaxyCache.ContainAny();
        }

        #endregion
    }
}