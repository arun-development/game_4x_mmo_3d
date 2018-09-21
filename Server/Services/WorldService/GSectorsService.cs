using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Interfaces.World;
using Server.Core.Map.Structure;
using Server.Core.StaticData;
using Server.DataLayer;
using Server.DataLayer.LocalStorageCaches;
using Server.DataLayer.Repositories;
using Server.Modules.Localize;

namespace Server.Services.WorldService
{
    public class GSectorsService : IGSectorsService
    {
        #region Declare

        private readonly IGSectorsRepository _sectorsRepo;

        private readonly IGSectorsLocalStorageCache _sectorsCache;


        public GSectorsService(IGSectorsRepository sectorsRepo,
            IGSectorsLocalStorageCache sectorsCache)
        {
            _sectorsRepo = sectorsRepo;
            _sectorsCache = sectorsCache;
        }

        #endregion


        #region Sync

        public IList<TResult> GetActiveSectors<TResult>(IDbConnection connection, Func<GSectorsDataModel, TResult> selector)
        {
            var sectors = _sectorsCache.LocalWhereSelect(connection,i => i.Opened, selector);
            if (!sectors.Any())
            {
            }
            return sectors;
            //return _sectorsCache.RWhere(i => i.opened, selector);
        }

        public IList<Sector> GetInitSectors(IDbConnection connection)
        {
            var sectors = GetActiveSectors(connection, s => new Sector
            {
                Id = s.Id,
                NativeName = s.NativeName,
                Translate = s.Translate,
                TranslateName = L10N.ExecuteTranslateNameOrDescr(s.Translate, true, null),
                Position = s.Position,
                GalaxyId = s.GalaxyId,
                GameTypeId = s.TypeId,
                TextureTypeId = s.TextureTypeId,
                SectorId = s.Id
            });

            return sectors.OrderBy(s => s.GalaxyId).ToList();
        }


        /// <summary>
        ///     sorted by Id ask
        /// </summary>
        /// <param name="connection"></param>
        /// <returns></returns>
        public IList<GSectorsDataModel> GetAllSectors(IDbConnection connection)
        {
            var sectors = _sectorsCache.LocalGetAll(connection);
            return sectors.Where(i => i.Opened).OrderBy(i => i.Id).ToList();
        }

        public IList<TResult> GetSectorsByGalaxy<TResult>(IDbConnection connection, byte galaxyId, Func<GSectorsDataModel, TResult> selector)
        {
            return _sectorsCache.LocalWhereSelect(connection,i => i.GalaxyId == galaxyId, selector);
        }

        public TResult GetById<TResult>(IDbConnection connection, short sectorId, Func<GSectorsDataModel, TResult> selector)
        {
            return selector(_sectorsCache.GetById(connection,sectorId, true));
        }


        //public void DeleteAll()
        //{
        //    var sectors = _sectorsBaseDapperRepo.RWhere(i => i.Id > 0);
        //    if (sectors.Any()) _sectorsBaseDapperRepo.DeleteAllOnSubmit(sectors);
        //    _sectorsBaseDapperRepo.ResetIndex("g_sectors");
        //    _sectorsBaseDapperRepo.ResetIndex("g_system");
        //    _sectorsBaseDapperRepo.ResetIndex("g_geometry_moon");
        //    _sectorsBaseDapperRepo.ResetIndex("g_geometry_planet");
        //}


        public GSectorsDataModel AddOrUpdate(IDbConnection connection, GSectorsDataModel dataModel)
        {
            var db = _sectorsRepo.AddOrUpdateeModel(connection,dataModel);
            return _sectorsCache.UpdateLocalItem(connection,db);
        }

        public IList<GSectorsDataModel> AddOrUpdateAllSectors(IDbConnection connection, IList<GSectorsDataModel> dataModel)
        {
            var db = _sectorsRepo.AddOrUpdateAllModels(connection,dataModel);
            return _sectorsCache.UpdateLocalItems(connection,db);
        }

        public void ResetSectorCahce()
        {
            _sectorsCache.ClearStorage();
        }


        public bool Delete(IDbConnection connection, short sectorId)
        {
            var data = _sectorsCache.GetById(connection,sectorId, true);
            if (data == null)
            {
                return true;
            }
            var sucsess = _sectorsRepo.Delete(connection,sectorId);
            if (sucsess)
            {
                _sectorsCache.DeleteItem(sectorId);
            }
            else
            {
                throw new NotImplementedException(Error.ErrorInUpdateDb);
            }
            return sucsess;
        }


 

        public bool DeleteAll(IDbConnection connection)
        {
            var suc = _sectorsRepo.DeleteAllProcedure(connection);
            if (!suc)
            {
                throw new NotImplementedException(Error.DbError);
            }
            ResetSectorCahce();
            return suc;
        }

        public string Test(string message = "Ok")
        {
            return message;
        }

        #endregion
    }
}