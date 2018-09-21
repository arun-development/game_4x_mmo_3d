using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Server.Core.Images;
using Server.Core.Infrastructure.ComplexButton;
using Server.Core.Interfaces;
using Server.Core.Interfaces.ForModel;
using Server.Core.Interfaces.UserServices;
using Server.Core.Interfaces.World;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.DataLayer;
using Server.DataLayer.LocalStorageCaches;
using Server.DataLayer.Repositories;
using Server.Services.OutModel.JournalOut;

namespace Server.Services.UserService {
    public class UMotherJumpService : IUMotherJumpService {
        public int SetCompleteJumpAndGetTimeToEnd(IDbConnection connection, int motherId) {
            var item = GetActive(connection, motherId, i => i);
            if (item == null) {
                throw new ArgumentNullException(nameof(item), Error.NoData);
            }
            var timeToDone = _setCompleteJumpAndGetTimeToEnd(connection, item);
            return timeToDone;
        }


        public int MotherJumpTimeDone(IDbConnection connection, int motherId, Action<int> targetSysten) {
            var item = GetActive(connection, motherId, i => i);
            if (item == null) {
                throw new Exception(Error.NoData);
            }

            var result = _setCompleteJumpAndGetTimeToEnd(connection, item);
            targetSysten(item.TargetSystem);
            return result;
        }

        public void CancelByMotherId(IDbConnection connection, int motherId) {
            _cancel(connection, GetActive(connection, motherId, i => i));
        }

        public void Cancel(IDbConnection connection, int jumpId, int motherId) {
            _cancel(connection, GetById(connection, jumpId, motherId, i => i));
        }

        public void SinchronizeAll(IDbConnection connection) {
            var items = _getCompleted(connection);
            foreach (var item in items) {
                _setCompleteJumpAndGetTimeToEnd(connection, item);
            }
        }

        public void SinchronizeByMotherId(IDbConnection connection, int motherId) {
            var item = GetActive(connection, motherId, i => i);
            if (item == null) {
                return;
            }
            _setCompleteJumpAndGetTimeToEnd(connection, item);
        }

        /// <summary>
        ///     Проверяет состояние задачи и еси она не закончена обновляет и првоеряет баланс, обновляет положение мазера,
        ///     закрывает задачу прыжка, возвращает ид новой ситсемы в которой находится мазер
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="jumpId"></param>
        /// <param name="motherId"></param>
        /// <returns></returns>
        /// targetSystemId
        public int InstMotherJump(IDbConnection connection, int jumpId, int motherId) {
            var mJump = GetById(connection, jumpId, motherId, i => i);
            if (mJump == null) {
                throw new Exception(Error.NoData);
            }
            var price = MotherJumpOut.JumpMotherPrice;

            if (mJump.Completed) {
                throw new Exception(Error.TaskCompleted);
            }
            var balance = _storeService.BalanceCalcResultCc(connection, motherId, price);

            var targetSystem = mJump.TargetSystem;
            mJump.EndTime = 0;
            _setCompleteJumpAndGetTimeToEnd(connection, mJump);
            _storeService.AddOrUpdateBalance(connection, balance);
            return targetSystem;
        }

        public string Test(string message = "Ok") {
            return message;
        }


        private IList<UserMotherJumpDataModel> _getCompleted(IDbConnection connection) {
            var currTime = UnixTime.UtcNow();
            return
                _motherJumpCache.LocalOperation(connection,
                    col => { return col.Where(i => i.EndTime < currTime && !i.Completed).ToList(); });
        }

        #region Declare

        private readonly IUMotherJumpLocalStorageCache _motherJumpCache;
        private readonly IUserMotherJumpRepository _motherJumpRepo;

        private readonly ISpriteImages _spriteImages;
        private readonly IStoreService _storeService;
        private readonly ISystemService _systemService;
        private readonly IGameTypeService _gameTypeService;
        private readonly IMothershipService _mothershipService;

        public UMotherJumpService(IStoreService storeService,
            IUMotherJumpLocalStorageCache motherJumpCache, IUserMotherJumpRepository motherJumpRepo,
            ISpriteImages spriteImages, ISystemService systemService, IGameTypeService gameTypeService,
            IMothershipService mothershipService) {
            _storeService = storeService;
            _motherJumpCache = motherJumpCache;
            _motherJumpRepo = motherJumpRepo;
            _spriteImages = spriteImages;
            _systemService = systemService;
            _gameTypeService = gameTypeService;
            _mothershipService = mothershipService;
        }

        #endregion

        #region Core   IBaseService 
 

        #region Sync

        public UserMotherJumpDataModel AddOrUpdate(IDbConnection connection, UserMotherJumpDataModel dataModel) {
            var db = _motherJumpRepo.AddOrUpdateeModel(connection,dataModel);
            return _motherJumpCache.UpdateLocalItem(connection,db);
        }

        public bool Delete(IDbConnection connection, int motherJumpId) {
            var old = _motherJumpCache.GetById(connection,motherJumpId, true);
            if (old == null) {
                return true;
            }
            var sucsess = _motherJumpRepo.Delete(connection,motherJumpId);
            //_provider.Commit();
            if (sucsess) {
                _motherJumpCache.DeleteItem(motherJumpId);
            }
            else {
                throw new NotImplementedException(Error.ErrorInUpdateDb);
            }
            return sucsess;
        }

 
        public bool DeleteAll(IDbConnection connection)
        {
            var result = false;
            try
            {
                result = _motherJumpRepo.DeleteAllProcedure(connection);
            }
            catch (Exception)
            {
                result = false;
                throw;
            }
            finally
            {
                _motherJumpCache.ClearStorage();
            }
            return result;
        }
 


        #endregion

        #endregion

        #region Get

        public TResult GetActive<TResult>(IDbConnection connection, int motherId, Func<UserMotherJumpDataModel, TResult> selector) {
            return _motherJumpCache.LocalOperation(connection,col => {
                return col
                    .Where(i => i.MotherId == motherId && !i.Completed)
                    .Select(selector)
                    .FirstOrDefault();
            });
        }

        public TResult GetById<TResult>(IDbConnection connection, int jumpId, int motherId, Func<UserMotherJumpDataModel, TResult> selector) {
            var jumpMoter = _motherJumpCache.GetById(connection,jumpId, true);
            if (jumpMoter == null || jumpMoter.MotherId != motherId) {
                throw new NotImplementedException(nameof(jumpMoter));
            }
            return selector(jumpMoter);
        }

        public TResult GetById<TResult>(IDbConnection connection, int jumpId, Func<UserMotherJumpDataModel, TResult> selector) {
            var jumpMoter = _motherJumpCache.GetById(connection,jumpId, true);
            if (jumpMoter == null) {
                throw new NotImplementedException(nameof(jumpMoter));
            }
            return selector(jumpMoter);
        }

        public IMotherJumpOut GetJumpTaskModel(IDbConnection connection, int userId) {
            return GetJumpTaskModel(connection, GetActive(connection, userId, i => i));
        }

        public IMotherJumpOut GetJumpTaskModel(IDbConnection connection, UserMotherJumpDataModel task) {
            if (task == null) {
                return null;
            }
            var activeJump = new MotherJumpOut {
                Id = task.Id,
                StartTime = task.StartTime,
                EndTime = task.EndTime,
                SourceSystemId = task.StartSystem,
                TargetSystemId = task.TargetSystem,
                FlyDuration = task.EndTime - task.StartTime,
                LeftImage = ImageView.Img(_spriteImages.MapControlIcons("jumptomother").Icon, null, false, null),
                SourceOwnType = false,
            };


            var startSystem = _systemService.GetDetailSystemBySystemId(connection, activeJump.SourceSystemId);
            var targetSystem = _systemService.GetDetailSystemBySystemId(connection, activeJump.TargetSystemId);

            activeJump.SourceSystemName = startSystem.Name;
            activeJump.TargetSystemName = targetSystem.Name;

            //  var startSystemType = await _gameTypeService.GetGGameTypeAsync(startSystem.TypeId);
            var targetSystemType = _gameTypeService.GetGGameType(connection, targetSystem.TypeId);
            var targetSystemTextureType = _systemService.GetGeometrySystem(connection, activeJump.TargetSystemId);
            activeJump.RightImage =
                ImageView.Img(_spriteImages.StarImages(targetSystemType.SubType, targetSystemTextureType.Id).Icon,
                    activeJump.SourceSystemName, false, activeJump.SourceSystemName);

            activeJump.TaskButtons();
            return activeJump;
        }

        #endregion

        #region Private Helpers

        private int _setCompleteJumpAndGetTimeToEnd(IDbConnection connection, UserMotherJumpDataModel mJump) {
            var currTime = UnixTime.UtcNow();
            if (mJump.EndTime > currTime) {
                return currTime - mJump.EndTime;
            }

            mJump.Completed = true;
            mJump = AddOrUpdate(connection,mJump);

            var mother = _mothershipService.GetMother(connection, mJump.MotherId);
            mother.StartSystemId = mJump.TargetSystem;
            _mothershipService.AddOrUpdate(connection,mother);
            return 0;
        }

        private UserMotherJumpDataModel _cancel(IDbConnection connection, UserMotherJumpDataModel model) {
            if (model == null) {
                throw new ArgumentNullException(nameof(model), Error.NoData);
            }
            if (model.Completed) {
                throw new Exception(Error.TaskCompleted);
            }

            model.CancelJump = true;
            model.Completed = true;
            return AddOrUpdate(connection,model);
        }

        #endregion
    }
}