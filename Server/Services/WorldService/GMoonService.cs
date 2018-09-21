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
    public class MoonService : IMoonService
    {
        #region Declare

        private readonly IGDetailMoonLocalStorageCache _detailMoonCahce;
        private readonly IGDetailMoonRepository _detailMoonRepo;
        private readonly IGGeometryMoonLocalStorageCache _geometryMoonCahce;

        private readonly IGGeometryMoonRepository _geometryMoonRepo;


        public MoonService(IGDetailMoonRepository detailMoonRepo,
            IGDetailMoonLocalStorageCache detailMoonCahce,
            IGGeometryMoonRepository geometryMoonRepo,
            IGGeometryMoonLocalStorageCache geometryMoonCahce)
        {
            _detailMoonRepo = detailMoonRepo;
            _detailMoonCahce = detailMoonCahce;
            _geometryMoonRepo = geometryMoonRepo;
            _geometryMoonCahce = geometryMoonCahce;
        }

        #endregion


        #region Sync

        public string Test(string message = "Ok")
        {
            return message;
        }

        #region Detail

        public GDetailMoonDataModel GetDetailMoon(IDbConnection connection, int moonId)
        {
            return _detailMoonCahce.GetById(connection,moonId, true);
        }

        public IList<GDetailMoonDataModel> GetAllDetailMoons(IDbConnection connection)
        {
            return _detailMoonCahce.LocalGetAll(connection);
        }

        public TResult GetDetailMoon<TResult>(IDbConnection connection, int moonId, Func<GDetailMoonDataModel, TResult> selector)
        {
            return selector(GetDetailMoon(connection, moonId));
        }

        public GDetailMoonDataModel AddOrUpdateDetailMoon(IDbConnection connection, GDetailMoonDataModel detailMoon)
        {
            var db = _detailMoonRepo.AddOrUpdateeModel(connection,detailMoon);
            return _detailMoonCahce.UpdateLocalItem(connection,db);
        }

        public IList<GDetailMoonDataModel> AddOrUpdateDetailMoonList(IDbConnection connection, IEnumerable<GDetailMoonDataModel> detailMoons)
        {
            var db = _detailMoonRepo.AddOrUpdateAllModels(connection,detailMoons.ToList());
            return _detailMoonCahce.UpdateLocalItems(connection,db);
        }

        #endregion

        #region Geometry

        public IList<TResult> GetGeometryMoonByStarId<TResult>(IDbConnection connection, int starId, Func<GGeometryMoonDataModel, TResult> selector)
        {
            return _geometryMoonCahce.LocalWhereSelect(connection,i => i.SystemId == starId, selector);
        }

        public GGeometryMoonDataModel GetGeometryMoon(IDbConnection connection, int moonId)
        {
            return _geometryMoonCahce.GetById(connection,moonId, true);
        }

        public TResult GetGeometryMoon<TResult>(IDbConnection connection, int moonId, Func<GGeometryMoonDataModel, TResult> selector)
        {
            var moon = GetGeometryMoon(connection, moonId);
            if (moon == null) throw new ArgumentNullException(Error.ErrorInUpdateDb, nameof(GetGeometryMoon));
            return selector(moon);
        }

        public IList<GGeometryMoonDataModel> GetGeometryMoons(IDbConnection connection)
        {
            return _geometryMoonCahce.LocalGetAll(connection);
        }


        public IList<GGeometryMoonDataModel> AddOrUpdateGeometryMoonList(IDbConnection connection, IList<GGeometryMoonDataModel> geometryMoons)
        {
            var db = _geometryMoonRepo.AddOrUpdateAllModels(connection,geometryMoons.ToList());
            return _geometryMoonCahce.UpdateLocalItems(connection,db);
        }

        public GGeometryMoonDataModel AddOrUpdateGeometryMoon(IDbConnection connection, GGeometryMoonDataModel geometryMoon)
        {
            var db = _geometryMoonRepo.AddOrUpdateeModel(connection,geometryMoon);
            return _geometryMoonCahce.UpdateLocalItem(connection,db);
        }

        #endregion

        #endregion
    }
}