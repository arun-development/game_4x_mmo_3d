using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Infrastructure;
using Server.Core.Infrastructure.Unit;
using Server.Core.Interfaces.UserServices;
using Server.Core.StaticData;
using Server.Core.Tech;
using Server.Core.СompexPrimitive.Resources;
using Server.Core.СompexPrimitive.Units;
using Server.DataLayer;
using Server.DataLayer.LocalStorageCaches;
using Server.DataLayer.Repositories;

namespace Server.Services.UserService
{
    public class MothershipService : IMothershipService
    {
        #region Declare

 


        private readonly IUserMothershipLocalStorageCache _uMothershipCache;
        private readonly IUserMothershipRepository _uMothershipRepo;


        public MothershipService(IUserMothershipRepository uMothershipRepo,
            IUserMothershipLocalStorageCache uMothershipCache)
        {
            _uMothershipRepo = uMothershipRepo;
            _uMothershipCache = uMothershipCache;
       
        }

        #endregion

        #region Interface

        public UserMothershipDataModel Update(IDbConnection connection, UserMothershipDataModel updatedData)
        {
            var suc = _uMothershipRepo.Update(connection, updatedData);
            if (suc)
            {
                return _uMothershipCache.UpdateLocalItem(connection, updatedData);
            }
            return _uMothershipCache.GetById(connection, updatedData.Id, true);
        }

        public UserMothershipDataModel GetMother(IDbConnection connection, int userId, bool checkData = true)
        {
            var mother = _uMothershipCache.GetById(connection, userId, true);
            if (checkData && (mother == null || mother.Id == 0))
            {
                throw new ArgumentNullException(nameof(mother), Error.IsEmpty);
            }
            return mother;
        }

        public TResult GetMother<TResult>(IDbConnection connection, int userId,
            Func<UserMothershipDataModel, TResult> selector)
        {
            var mother = GetMother(connection, userId);
            return selector(mother);
        }

        public IList<UserMothershipDataModel> GetAllMothers(IDbConnection connection) =>
            _uMothershipCache.LocalGetAll(connection);


        public StorageResources GetMotherResources(IDbConnection connection, int userId)
        {
            var mother = GetMother(connection, userId);
            return mother.Resources;
        }


        public UserMothershipDataModel CreateMother(IDbConnection connection, int userId, int startSystem = 1)
        {
            var r = StorageResources.InitMotherResources();
            var curMother = GetMother(connection, userId, false);
            if (curMother != null)
            {
                return curMother;
            }

            var teches = new BattleTeches();
            teches.CreateStartTeches();
            var userTeches = teches.ConvertToDbTeches();

            var newMother = new UserMothershipDataModel
            {
                Id = userId,
                StartSystemId = startSystem,
                Resources = r,
                Hangar = UnitList.InitUnitsInOwn(),
                ExtractionProportin = MaterialResource.InitBaseOwnProportion(),
                UnitProgress = new Dictionary<UnitType, TurnedUnit>(),
                TechProgress = userTeches
            };
            return AddOrUpdate(connection, newMother);
        }

        public bool MothersDataExist() => _uMothershipCache.ContainAny();

        public int GetCurrentSystemId(IDbConnection connection, int userId)
        {
            var mother = GetMother(connection, userId);
            return mother.StartSystemId;
        }

        public UserMothershipDataModel SetNewResources(IDbConnection connection, int userId,
            StorageResources newResources)
        {
            var mother = GetMother(connection, userId, true);
            mother.Resources = newResources;
            return Update(connection, mother);
        }

        #region Npc

        public void DeleteNpcMothers(IDbConnection connection)
        {
            var mothers =
                _uMothershipCache.LocalOperation(connection,
                    col => { return col.Where(i => i.Id < Npc.NpcMaxId).Select(i => i.Id).ToList(); });

            _uMothershipRepo.Delete(connection, mothers);
            //  _provider.Commit();
        }

        #endregion

        public string Test(string message = "Ok") => message;

        #endregion

        #region Core IBaseService

        public bool DeleteAll(IDbConnection connection)
        {
  
            _uMothershipRepo.DeleteAllProcedure(connection);
            _uMothershipCache.ClearStorage();

            return true;
        }


        public UserMothershipDataModel AddOrUpdate(IDbConnection connection, UserMothershipDataModel dataModel)
        {
            var db = _uMothershipRepo.AddOrUpdateeModel(connection, dataModel);
            return _uMothershipCache.UpdateLocalItem(connection, db);
        }

        public bool Delete(IDbConnection connection, int userId)
        {
            var old = _uMothershipCache.GetById(connection, userId, true);
            if (old == null)
            {
                return true;
            }
            var sucsess = _uMothershipRepo.Delete(connection, userId);
            //   _provider.Commit();
            if (sucsess)
            {
                _uMothershipCache.DeleteItem(userId);
                return true;
            }
            throw new NotImplementedException(Error.ErrorInUpdateDb);
        }

        public IList<UserMothershipDataModel> AddOrUpdate(IDbConnection connection,
            IList<UserMothershipDataModel> dataModel)
        {
            var db = _uMothershipRepo.AddOrUpdateAllModels(connection, dataModel);
            return _uMothershipCache.UpdateLocalItems(connection, db);
        }

        #endregion
    }
}