using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.StaticData;
using Server.DataLayer;

namespace Server.Services.WorldService
{
    public partial class SystemService
    {
        #region Sync

        public TResult GetDetailSystemBySystemId<TResult>(IDbConnection connection, int systemId, Func<GDetailSystemDataModel, TResult> selector)
        {
            var sys = _detailSystemCache.GetById(connection,systemId, true);
            return sys == null ? default(TResult) : selector(sys);
        }

        public IList<TResult> GetAllDetailSystems<TResult>(IDbConnection connection, Func<GDetailSystemDataModel, TResult> selector)
        {
            var sys = _detailSystemCache.LocalGetAll(connection);
            return sys.Select(selector).ToList();
        }

        public IList<GDetailSystemDataModel> GetAllDetailSystems(IDbConnection connection)
        {
            return _detailSystemCache.LocalGetAll(connection);
        }

        public GDetailSystemDataModel GetDetailSystemBySystemId(IDbConnection connection, int systemId)
        {
            return GetDetailSystemBySystemId(connection, systemId, i => i);
        }

        public GDetailSystemDataModel AddOrUpdateDetailSystem(IDbConnection connection, GDetailSystemDataModel detailSystem)
        {
            var db = _detailSystemRepo.AddOrUpdateeModel(connection,detailSystem);
            var system = _detailSystemCache.UpdateLocalItem(connection,db);
            _systemNameSercherPkCache.AddOrUpdate(connection,system.Name, system.Id, _detailSystemCache);
            return system;
        }

        public IList<GDetailSystemDataModel> AddOrUpdateDetailSystems(IDbConnection connection, IList<GDetailSystemDataModel> dataModel)
        {
            var db = _detailSystemRepo.AddOrUpdateAllModels(connection,dataModel);
            var systems = _detailSystemCache.UpdateLocalItems(connection,db);
            foreach (var system in systems)
                _systemNameSercherPkCache.AddOrUpdate(connection,system.Name, system.Id, _detailSystemCache);
            return systems;
        }

        public void DeleteDetailSystem(IDbConnection connection, int id)
        {
            throw new NotImplementedException();
        }

        public void DeleteAllDetailSystem(IDbConnection connection)
        {
            if (_detailSystemRepo.HasItems(connection))
            {
                var suc = _detailSystemRepo.DeleteAllProcedure(connection);
                if (!suc) throw new NotImplementedException(Error.DbError);
            }
            _detailSystemCache.ClearStorage();
        }

        #endregion
    }
}