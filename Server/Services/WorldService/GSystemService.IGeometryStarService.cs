using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.DataLayer;

namespace Server.Services.WorldService
{
    public partial class SystemService
    {
        #region Sync

        public TResult GetGeometryStarById<TResult>(IDbConnection connection, int systemId, Func<GGeometryStarDataModel, TResult> selector)
        {
            var star = _geometryStarCache.GetById(connection,systemId, true);
            return star == null ? default(TResult) : selector(star);
        }

        public IList<TResult> GetAllGeometryStars<TResult>(IDbConnection connection, Func<GGeometryStarDataModel, TResult> selector)
        {
            var stars = _geometryStarCache.LocalGetAll(connection);
            return stars.Select(selector).ToList();
        }

        public GGeometryStarDataModel AddOrUpdateGeometryStar(IDbConnection connection, GGeometryStarDataModel dataModel)
        {
            var db = _geometryStarRepo.AddOrUpdateeModel(connection,dataModel);
            return _geometryStarCache.UpdateLocalItem(connection,db);
        }

        public IList<GGeometryStarDataModel> AddOrUpdateGeometryStars(IDbConnection connection, IList<GGeometryStarDataModel> dataModel)
        {
            //GGeometryStarDataModel
            var db = _geometryStarRepo.AddOrUpdateAllModels(connection,dataModel);
            return _geometryStarCache.UpdateLocalItems(connection,db);
        }

        public void DeleteGeometryStar(IDbConnection connection, int id)
        {
            throw new NotImplementedException();
        }

        public void DeleteAllGeometryStar(IDbConnection connection)
        {
            throw new NotImplementedException();
        }

        #endregion
    }
}