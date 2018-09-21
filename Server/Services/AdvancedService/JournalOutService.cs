using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Server.Core.Images;
using Server.Core.Infrastructure;
using Server.Core.Infrastructure.ComplexButton;
using Server.Core.Infrastructure.Unit;
using Server.Core.Interfaces;
using Server.Core.Interfaces.ForModel;
using Server.Core.Interfaces.UserServices;
using Server.Core.Interfaces.World;
using Server.Core.Map;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Resources;
using Server.DataLayer;
using Server.DataLayer.LocalStorageCaches;
using Server.Extensions;
using Server.Modules.Localize;
using Server.Services.HtmlHelpers;
using Server.Services.OutModel.JournalOut;
using Server.Utils.Map;

namespace Server.Services.AdvancedService
{
    public interface IJournalOutService {
        IMotherJumpOut AddTaskMotherJump(IDbConnection connection, int currentUserId, string guid);
        bool CancelMotherJump(IDbConnection connection, int currentUserId, int jumpId);
        TabReportOut CreateReportItem(IDbConnection connection, string id);
        TabSpyOut CreateSpyItem(IDbConnection connection, int currentUserId, string planetName);
        TabSpyOut CreateSpyItem(IDbConnection connection, int currentUserId, int planetId);
        int CreateTaskItem(IDbConnection connection, int currentUserId, string currentUserNickname, TaskFleet inputData);
        bool DeleteReportItem(IDbConnection connection, int currentUserId, int reportId);
        bool DeleteSpyItem(IDbConnection connection, int currentUserId, int spyId);
        MapDistance GetMotherJumpTime(IDbConnection connection, int currentUserId, int sourceSystemId, int targetSystemId);
        TabReportOut GetReportItemByTaskId(IDbConnection connection, int currentUserId, int taskId);
        IList<TabReportOut> GetReportItems(IDbConnection connection, int currentUserId, int lastReportId);
        IList<TabSpyOut> GetSpyItems(IDbConnection connection, int currentUserId, int lastSpyId);
        MapDistance GetTaskTime(IDbConnection connection, int currentUserId, int estateId, string planetName, int startSystemId = 0);
        IPlanshetViewData InitialPlanshet(IDbConnection connection, int currentUserId, List<int> userPlanetIds = null);
        EstateAdress InstMotherJump(IDbConnection connection, int currentUserId, int jumpId);
        object IsMotherJumpTimeDone(IDbConnection connection, int currentUserId);
        TaskFleet TaskTimeIsOver(IDbConnection connection, int currentUserId, int taskId);
        TabTaskOut SetTaskItem(UserTaskDataModel newTaskItem);
        Func<UserReportDataModel, TabReportOut> SetReportItem(int userId, List<UserTaskDataModel> tasks);
    }

    public class JournalOutService : IJournalOutService {
        private const int CACHE_TIME_SEC_JUMP = 300;
        private readonly IGameUserService _gameUserService;
        private readonly IGDetailPlanetService _gDetailPlanetService;
        private readonly IGGeometryPlanetService _geometryPlanetService;
        private readonly IMapAdressService _mapAdressService;
        private readonly IUMotherJumpService _motherJumpService;
        private readonly IMothershipService _mothershipService;
        private readonly ISpriteImages _spriteImages;
        private readonly IStoreService _storeService;
        private readonly ISynchronizer _synchronizer;
        private readonly ISystemService _systemService;
        private readonly IUReportService _uReportService;

        private readonly IUSpyService _uSpyService;
        private readonly IUTaskService _uTaskService;
        private readonly ILocalizerService _localizer;


        public JournalOutService(IGDetailPlanetService gDetailPlanetService,
            IGGeometryPlanetService geometryPlanetService,
            ISystemService systemService,
            IUTaskService uTaskService,
            IUReportService uReportService,
            IUSpyService uSpyService,
            IMothershipService mothershipService,
            ISpriteImages spriteImages,
            ISynchronizer synchronizer,
            IMapAdressService mapAdressService,
            IUMotherJumpService motherJumpService,
            IGameUserService gameUserService,
            IStoreService storeService, ILocalizerService localizer) {
            _gDetailPlanetService = gDetailPlanetService;
            _geometryPlanetService = geometryPlanetService;
            _systemService = systemService;
            _uTaskService = uTaskService;
            _uReportService = uReportService;
            _uSpyService = uSpyService;
            _mothershipService = mothershipService;
            _spriteImages = spriteImages;
            _synchronizer = synchronizer;
            _mapAdressService = mapAdressService;
            _motherJumpService = motherJumpService;
            _gameUserService = gameUserService;
            _storeService = storeService;
            _localizer = localizer;
        }

        #region Open Members

        public IPlanshetViewData InitialPlanshet(IDbConnection connection, int currentUserId, List<int> userPlanetIds = null) {
            if (userPlanetIds == null) {
                var up = _gDetailPlanetService.GetUserPlanets(connection, currentUserId);
                userPlanetIds = up.Select(i => i.Id).ToList();
            }

            #region Task

            var taskTab = new TabTaskOut {
                MotherJump = _motherJumpService.GetJumpTaskModel(connection, currentUserId),
                Collection = _uTaskService.GetActiveTask(connection, currentUserId, SetTaskItem, userPlanetIds)
            };


            taskTab.TaskButtons();
            TabTaskOut.InitComplexBtnCollection(taskTab.Collection);

            #endregion

            #region Report

            var reportTab = new TabReportOut {
                Collection = _getReportItemsList(connection, currentUserId),
                TotalItems = _uReportService.GetTotalUserReports(connection, currentUserId),
            };
            TabReportOut.InitComplexBtnCollection(reportTab.Collection);

            #endregion

            #region Spy

            var spyCollection = _getSpyItemsList(connection, currentUserId);
            var spyTab = new TabSpyOut {
                Collection = spyCollection,
                TotalItems = _uSpyService.GetTotalUserSpyReports(connection, currentUserId),
                Buttons = new List<IButtonsView> {ButtonsView.NewSpyItemFromSerch()}
            };
            TabSpyOut.InitComplexBtnCollection(spyTab.Collection);

            #endregion

            return JournalOut.InitialTabs(taskTab, reportTab, spyTab, _localizer);
        }

        //item

        public int CreateTaskItem(IDbConnection connection, int currentUserId, string currentUserNickname, TaskFleet inputData) {
            var curretnUserPremium = _storeService.GetPremiumWorkModel(connection, currentUserId);
            //todo Check current User fleet

            //todo тип для мазера  byte srcType = 20;

            var isMother = inputData.SourceId == 0;


            var targetPlanet = _gDetailPlanetService.GetPlanet(connection, inputData.TargetName);
            var targetPlanetGeometry = _geometryPlanetService.GetGeometryPlanetById(connection, targetPlanet.Id);
            var targetPlanetSystem = _systemService.GetDetailSystemBySystemId(connection, targetPlanetGeometry.SystemId);

            var newTaskItem = new UserTaskDataModel {
                SourceTypeId = (byte) (isMother ? 20 : 0),
                // canselation = false,
                SourceOwnType = !isMother,
                SourceOwnName = MapTypes.Mother.ToString(),
                SourceUserId = currentUserId,
                SourceOwnId = inputData.SourceId,
                TargetPlanetName = inputData.TargetName,
                DateActivate = UnixTime.UtcNow(),
                Duration = 100,
                //sourceFleet = inputData.FixUnitCount(),
                IsAtack = true,
                IsTransfer = false,
                TargetPlanetId = targetPlanet.Id,
                TargetPlanetTypeId = targetPlanetGeometry.TypeId,
                TargetSystemName = targetPlanetSystem.Name
            };


            //todo  проверить наличие юнитов у пользователя
            if (inputData.IsTransfer) {
                newTaskItem.IsAtack = false;
                newTaskItem.IsTransfer = true;
            }

 

            if (newTaskItem.SourceOwnType) {
                var sourcePlanet = _gDetailPlanetService.GetUserPlanet(connection, inputData.SourceId, currentUserId);
                sourcePlanet = _synchronizer.UserPlanet(connection, sourcePlanet, curretnUserPremium, _gDetailPlanetService);
                var sourcePlanetGeometry = _geometryPlanetService.GetGeometryPlanetById(connection, sourcePlanet.Id);
                var sourcePlanetSystem =
                    _systemService.GetDetailSystemBySystemId(connection, sourcePlanetGeometry.SystemId);
                var duration =
                    MapDistanceHelper.CalculatePlanetTransferFleet(connection, sourcePlanet.Id, newTaskItem.TargetPlanetId,
                        _mapAdressService, curretnUserPremium.IsActive);

                var baseUnits = sourcePlanet.Hangar;
                inputData.FixUnitCount(sourcePlanet.Hangar);
                var planetFixedUnits = inputData.Units;


                newTaskItem.SourceFleet = planetFixedUnits;
                newTaskItem.SourceTypeId = sourcePlanetGeometry.TypeId;
                newTaskItem.SourceOwnName = sourcePlanet.Name;
                newTaskItem.SourceSystemName = sourcePlanetSystem.Name;
                newTaskItem.Duration = duration.Sec;

                var calculatedUnitsToSaveToSource = UnitList.CalculateNewUnits(baseUnits, planetFixedUnits, false);
                sourcePlanet.Hangar = calculatedUnitsToSaveToSource;
                _gDetailPlanetService.AddOrUpdate(connection,sourcePlanet);
            }
            else {
                var mother = _mothershipService.GetMother(connection, currentUserId);
                mother = _synchronizer.UserMothership(connection, mother, curretnUserPremium, _mothershipService,_motherJumpService);
                var motherSystem = _systemService.GetDetailSystemBySystemId(connection, mother.StartSystemId);
                var duration =
                    MapDistanceHelper.CalculateMotherTransferFleet(connection, mother.StartSystemId, newTaskItem.TargetPlanetId,
                        _mapAdressService, curretnUserPremium.IsActive);

                var baseUnits = mother.Hangar;
                inputData.FixUnitCount(mother.Hangar);
                var motherfixedUnits = inputData.Units;

                newTaskItem.SourceFleet = motherfixedUnits;
                newTaskItem.SourceSystemName = motherSystem.Name;
                newTaskItem.Duration = duration.Sec; //25; 


                // почему то небыло указано....
                newTaskItem.SourceTypeId = 20;
                newTaskItem.SourceOwnName = currentUserNickname;

                //todo calc  оставшихся юнитов
                var calculatedUnitsToSaveToSource = UnitList.CalculateNewUnits(baseUnits, motherfixedUnits, false);
                mother.Hangar = calculatedUnitsToSaveToSource;
                _mothershipService.AddOrUpdate(connection,mother);
            }

            newTaskItem = _uTaskService.AddOrUpdate(connection,newTaskItem);

            var clonedTaskItem = newTaskItem.CloneDeep();
            var userId = targetPlanet.UserId;
            _synchronizer.GetTaskRunner().OnUserTaskCreated(newTaskItem.CloneDeep(), userId);
            Task.Delay(50).ContinueWith(t => {
                _uTaskService.NotyfyTaskCreated(clonedTaskItem, userId);
            });
            return newTaskItem.Id;
        }


        public MapDistance GetTaskTime(IDbConnection connection, int currentUserId, int estateId, string planetName, int startSystemId = 0) {
            var premium = _storeService.GetOrUpdatePremium(connection, currentUserId);
            MapDistance distance;
            if (estateId == 0) {
                //_motherJumpService.SinchronizeByMotherId(_currentUser.Id);
                if (startSystemId == 0) {
                    throw new Exception(Error.SystemIdNotSet);
                }

                var systemId = _mothershipService.GetCurrentSystemId(connection, currentUserId);
                distance = MapDistanceHelper.CalculateMotherTransferFleet(connection, systemId, planetName, _mapAdressService,
                    !premium.Finished);
                return distance;
            }
            distance = MapDistanceHelper.CalculatePlanetTransferFleet(connection, estateId, planetName, _mapAdressService,
                !premium.Finished);
            return distance;
        }


        public TabReportOut GetReportItemByTaskId(IDbConnection connection, int currentUserId, int taskId) {
            var userId = currentUserId;
            var task = _uTaskService.GetByTaskId(connection, taskId, true);
            var reportItem = _uReportService.GetUserReportByTaskId(connection, userId, taskId, i => i);
            var reportInfo = SetReportItem(userId, new List<UserTaskDataModel> {task})(reportItem);
            if (reportItem == null) {
                throw new Exception(Error.NoData);
            }
            TabReportOut.InitComplexBtnItem(reportInfo);

            return reportInfo;
        }


        // todo  не работает
        public TabReportOut CreateReportItem(IDbConnection connection, string id) {
            throw new NotImplementedException("ReportItem(string id) метод не работает проверить место вызова");
            var random = new Random();
            var randPlanetId = random.Next(300, 500);
            var tmpSorce = false;

            var tPlanet = _gDetailPlanetService.GetPlanet(connection, randPlanetId, i => i);
            var systemName = _geometryPlanetService.GetPlanetSystemName(connection, randPlanetId);

            var tUser = _gameUserService.GetGameUser(connection, tPlanet.UserId);

            var j = new TabReportOut {
                Id = 300,
                TargetUserName = tUser.Nickname,
                TargetSystemName = systemName,
                TargetPlanetName = tPlanet.Name,
                TargetResource = tPlanet.Resources.Current.ConvertToInt(),
                SourceOwnType = false,
                SourceUserName = "", //get user

                //TargetHangar = HangarUnitsOut.EmptyHangar(),
                //todo  временно назначен
                LeftImage =
                    (!tmpSorce)
                        ? ImageView.Img(_spriteImages.MapControlIcons("jumptomother").Icon)
                        : ImageView.Img(_spriteImages.MapControlIcons("jumptoplanetoid").Icon),
                RightImage = ImageView.Img(_spriteImages.MapControlIcons("jumptoplanetoid").Icon),
                // RightImage = ImageView.Img("r-RightImage"),

                Date = UnixTime.GetDateFromTimeStamp(DateTime.UtcNow),
                TimeNow = UnixTime.GetTimeFromTimeStamp(DateTime.UtcNow)
            };
            if (tmpSorce) { }
            return j;
        }


        public IList<TabReportOut> GetReportItems(IDbConnection connection, int currentUserId, int lastReportId) {
            var collection = _getReportItemsList(connection, currentUserId, lastReportId);
            TabReportOut.InitComplexBtnCollection(collection);
            return collection;
        }


        public IList<TabSpyOut> GetSpyItems(IDbConnection connection, int currentUserId, int lastSpyId) {
            var collection = _getSpyItemsList(connection, currentUserId, lastSpyId);
            TabSpyOut.InitComplexBtnCollection(collection);
            return collection;
        }


        public TabSpyOut CreateSpyItem(IDbConnection connection, int currentUserId, int planetId) {
            var p = _gDetailPlanetService.GetPlanet(connection, planetId);
            if (p == null) {
                throw new Exception(Error.PlanetNotExsist);
            }
            if (p.UserId == currentUserId) {
                throw new Exception(Error.TargetOwnerIsYou);
            }
            return _writeAndReturnSpyItem(connection, currentUserId, p);
        }


        public TabSpyOut CreateSpyItem(IDbConnection connection, int currentUserId, string planetName) {
            var p = _gDetailPlanetService.GetPlanet(connection, planetName);
            if (p == null) {
                throw new Exception(Error.PlanetNotExsist);
            }
            if (p.UserId == currentUserId) {
                throw new Exception(Error.TargetOwnerIsYou);
            }
            return _writeAndReturnSpyItem(connection, currentUserId, p);
        }


        public TabTaskOut SetTaskItem(UserTaskDataModel newTaskItem) {
            if (newTaskItem.Id == 0) {
                throw new Exception(Error.TaskNotExist);
            }
            var si = new SpriteImages();
            var ti = new TabTaskOut {
                Id = newTaskItem.Id,
                StartTime = newTaskItem.DateActivate,
                SourceOwnType = newTaskItem.SourceOwnType,
                SourceOwnName = newTaskItem.SourceOwnName,
                SourceSystemName = newTaskItem.SourceSystemName,
                TargetPlanetName = newTaskItem.TargetPlanetName,

                //TargetSystemName = targetPlanetName.Substring(0, 5),
                TargetSystemName = newTaskItem.TargetSystemName,
                FlyDuration = newTaskItem.Duration,
                HangarInTask = UnitList.ConvertToHangar(newTaskItem.SourceFleet.CloneDeep()),
                IsAtack = newTaskItem.IsAtack,
                IsTransfer = newTaskItem.IsTransfer
            };
            if (ti.SourceOwnType) {
                ti.LeftImage = ImageView.Img("t-LeftImage");
            }
            else {
                ti.LeftImage = ImageView.Img(si.MapControlIcons("jumptomother").Icon);
            }
            ti.RightImage = ImageView.Img(si.MapControlIcons("jumptoplanetoid").Icon);
            TabTaskOut.InitComplexBtnItem(ti);
            return ti;
        }

        #region Delete And Check

        public TaskFleet TaskTimeIsOver(IDbConnection connection, int currentUserId, int taskId) {
            throw new Exception(Error.Deprecated);
            var taskItem = _uTaskService.GetByTaskId(connection, taskId, true);
            if (taskItem == null) {
                throw new Exception(Error.TaskNotExist);
            }

            if (taskItem.SourceUserId != currentUserId) {
                throw new Exception(Error.TaskNotForThisUser);
            }

            var curTime = UnixTime.UtcNow();
            var endTime = taskItem.DateActivate + taskItem.Duration;
            var timeOver = endTime <= curTime;
            var result = new TaskFleet();
            if (timeOver) {
                //var updatedTask = _synchronizer.RunTaskItem(taskItem.Id);
                //result.IsTransfer = updatedTask.IsTransfer;
                //result.TimeOver = true;
                //result.TargetName = updatedTask.TargetPlanetName;

                return result;
            }

            result.TimeOver = false;
            result.StartTime = taskItem.DateActivate;
            result.FlyDuration = taskItem.Duration;
            return result;
        }


        public bool DeleteReportItem(IDbConnection connection, int currentUserId, int reportId) {
            var report = _uReportService.GetReportById(connection, reportId);

            if (currentUserId == report.AtackerUserId) {
                report.AtackerDeleteReport = true;
            }
            else if (currentUserId == report.DefenderUserId) {
                report.DefenderDeleteReport = true;
            }
            else if (string.Equals(Npc.SkagyName, report.AtackerUserName, StringComparison.OrdinalIgnoreCase)) {
                report.AtackerDeleteReport = true;
            }
            else if (string.Equals(Npc.SkagyName, report.DefenderUserName, StringComparison.OrdinalIgnoreCase)) {
                report.DefenderDeleteReport = true;
            }

            if (report.AtackerDeleteReport && report.DefenderDeleteReport) {
                var taskId = report.TaskId;
                _uReportService.Delete(connection,reportId);
                _uTaskService.Delete(connection,taskId);
            }
            else if (!report.AtackerDeleteReport || !report.DefenderDeleteReport) {
                _uReportService.AddOrUpdate(connection,report);
            }
            return true;
        }


        public bool DeleteSpyItem(IDbConnection connection, int currentUserId, int spyId) {
            var spyItem = _uSpyService.GetUserSpyItem(connection, currentUserId, spyId);
            if (spyItem != null) {
                _uSpyService.Delete(connection,spyItem.Id);
            }
            return true;
        }

        #endregion

        #region MotherJump

        public MapDistance GetMotherJumpTime(IDbConnection connection, int currentUserId, int sourceSystemId, int targetSystemId) {
            var premium = _storeService.GetOrUpdatePremium(connection, currentUserId);
            if (sourceSystemId == targetSystemId) {
                throw new Exception(Error.JupmMotherIsCurrentSystem);
            }
            var curTask = _motherJumpService.GetActive(connection, currentUserId, i => i.Id);
            if (curTask != 0) {
                throw new Exception(Error.JumpMotherInProgress);
            }

            var dm = MapDistanceHelper.CalculateJumpTime(connection, sourceSystemId, targetSystemId, _mapAdressService,
                !premium.Finished);

            dm.Guid = Guid.NewGuid().ToString();
            dm.StartCacheTime = UnixTime.UtcNow();
            return (MapDistance) TmpCache.AddOrUpdate(dm.Guid, dm, CACHE_TIME_SEC_JUMP);
        }


        public IMotherJumpOut AddTaskMotherJump(IDbConnection connection, int currentUserId, string guid) {
            var data = TmpCache.GetAndRemove<MapDistance>(guid);
            if (data == null) {
                throw new Exception(Error.NoData);
            }
            var curTime = UnixTime.UtcNow();
            if (data.StartCacheTime + CACHE_TIME_SEC_JUMP < curTime) {
                throw new Exception(Error.DataIsOldRepeatRequest);
            }
            var inserted = _motherJumpService.AddOrUpdate(connection,new UserMotherJumpDataModel {
                CancelJump = false,
                Completed = false,
                EndTime = curTime + data.Sec,
                MotherId = currentUserId,
                StartSystem = data.Source.System,
                StartTime = curTime,
                TargetSystem = data.Target.System
            });


            var result = _motherJumpService.GetJumpTaskModel(connection, inserted);
            return result;
        }


        public bool CancelMotherJump(IDbConnection connection, int currentUserId, int jumpId) {
            _motherJumpService.Cancel(connection, jumpId, currentUserId);
            return true;
        }


        public EstateAdress InstMotherJump(IDbConnection connection, int currentUserId, int jumpId) {
            var targetSystem = _motherJumpService.InstMotherJump(connection, jumpId, currentUserId);
            var adress = _mapAdressService.GetSystemAdressIds(connection, targetSystem);
            return adress;
        }


        public object IsMotherJumpTimeDone(IDbConnection connection, int currentUserId) {
            var targetSystemId = 0;
            var timeToDone =
                _motherJumpService.MotherJumpTimeDone(connection, currentUserId, (tSystem) => { targetSystemId = tSystem; });
            if (targetSystemId == 0) {
                throw new NotImplementedException();
            }

            if (timeToDone == 0) {
                return _mapAdressService.GetSystemAdressIds(connection, targetSystemId);
            }
            return timeToDone;
        }

        #endregion

        #endregion

        #region Private

        private TabTaskOut _setTaskItem(UserTaskDataModel newTaskItem) {
            if (newTaskItem.Id == 0) {
                throw new Exception(Error.TaskNotExist);
            }
            var ti = _uTaskService.SetTaskItem(newTaskItem);
            return (TabTaskOut) ti;
        }

        private IList<TabReportOut> _getReportItemsList(IDbConnection connection, int userId, int lastReportId = 0) {
            var reports = _uReportService.GetUserReports(connection, userId, i => i, lastReportId);
            var taskIds = reports.Select(i => i.TaskId).ToList();
            var tasks = new List<UserTaskDataModel>();
            foreach (var i in taskIds) {
                tasks.Add(_uTaskService.GetDoneTaskById(connection, i));
            }
            var outReports = reports.Select(SetReportItem(userId, tasks));
            var b = outReports.ToList();
  
            
            return b;
        }

        public Func<UserReportDataModel, TabReportOut> SetReportItem(int userId, List<UserTaskDataModel> tasks) {
            return i => {
                var doneTask = tasks.Single(t => t.Id == i.TaskId);
                if (doneTask == null) {
                    throw new NullReferenceException(Error.NoData);
                }
                var jumpToPlanetoid = ImageView.Img(_spriteImages.MapControlIcons("jumptoplanetoid").Icon,
                    doneTask.TargetPlanetName, false, doneTask.TargetPlanetName);
                var isLose =!(i.AtackerWin && userId == i.AtackerUserId || !i.AtackerWin && userId == i.DefenderUserId);
                var report = new TabReportOut {
                    Id = i.Id,
                    CurrentUserIsAtacker = i.AtackerUserId == userId,
                    SourceUserName= i.AtackerUserName,
                    SourceReportHangar = ReportFleetOut.ConvertBattleFleetsToReportFleetView(i.AtackerSummaryReport),
                    TargetUserName = i.DefenderUserName,
                    TargetReportHangar = ReportFleetOut.ConvertBattleFleetsToReportFleetView(i.DefenderSummaryReport),

                    AtackerIsSkagry = i.AtackerIsSkagry,


                    TargetPlanetId = doneTask.TargetPlanetId,
                    TargetPlanetName = doneTask.TargetPlanetName,
                    TargetSystemName = doneTask.TargetPlanetName.Substring(0, 5),
                    Date = UnixTime.GetDateFromTimeStamp(i.BattleTime),
                    TimeNow = UnixTime.GetTimeFromTimeStamp(i.BattleTime),
                    TargetResource = i.Resources.ConvertToInt(),
                    //todo  временно назначен
 
                    LeftImage = doneTask.SourceOwnType
                        ? jumpToPlanetoid
                        : ImageView.Img(_spriteImages.MapControlIcons("jumptomother").Icon, null, false, null),
                    RightImage = jumpToPlanetoid,
                    // RightImage = ImageView.Img("r-RightImage"),
                    //todo  сделать аву для скагрей
                    IsLose = isLose
                };
                return report;
            };
        }


        private TabSpyOut _writeAndReturnSpyItem(IDbConnection connection, int currentUserId, GDetailPlanetDataModel tPlanet) {
            var resource = MaterialResource.ConvertStorageToMaterial(tPlanet.Resources).ConvertToInt();
            var planetType = _geometryPlanetService.GetGeometryPlanetById(connection, tPlanet.Id);

            var spyItem = new UserSpyDataModel {
                DateActivate = UnixTime.UtcNow(),
                TargetPlanetTypeId = planetType.TypeId,
                TargetPlanetName = tPlanet.Name,
                TargetPlanetId = tPlanet.Id,
                TargetPlanetHangar = tPlanet.Hangar,
                TargetResource = resource,
                SourceUserId = currentUserId,
            };

            var isSkagry = false;
            if (tPlanet.UserId == Npc.SkagryGameUserId) {
                spyItem.TargetUserName = Npc.SkagyName;
                //todo  сделать стиль скагрей
                spyItem.TargetUserImage = _spriteImages.MapControlIcons("interface-skagry-icon");
  
                isSkagry = true;
            }
            else {
                var targetUser = _gameUserService.GetGameUser(connection, tPlanet.UserId);
                spyItem.TargetUserName = targetUser.Nickname;
                spyItem.TargetUserImage = targetUser.Avatar;
            }

            var newSpyItem = _uSpyService.AddOrUpdate(connection,spyItem);
            if (newSpyItem.Id == 0) {
                throw new Exception(Error.NoData);
            }


            var leftSprite = new SpriteImages();
            leftSprite.MapControlIcons("jumptoplanetoid");
            var j = new TabSpyOut {
                // SourceOwnType = false,

                Id = newSpyItem.Id,
                TargetUserName = newSpyItem.TargetUserName,
                TargetResource = newSpyItem.TargetResource,
                TargetHangar = UnitList.ConvertToHangar(tPlanet.Hangar),
                TargetPlanetId = newSpyItem.TargetPlanetId,
                TargetPlanetName = newSpyItem.TargetPlanetName,
                TargetSystemName = newSpyItem.TargetPlanetName.Substring(0, 5),
                LeftImage = ImageView.Img(leftSprite.Icon),
                RightImage =
                    (isSkagry)
                        ? ImageView.Img(spyItem.TargetUserImage.Icon)
                        : ImageView.Img(spyItem.TargetUserImage.Icon, null, true),
                Date = UnixTime.GetDateFromTimeStamp(newSpyItem.DateActivate),
                TimeNow = UnixTime.GetTimeFromTimeStamp(newSpyItem.DateActivate)
            };
            j.RightImage.Title = j.RightImage.Alt = j.TargetUserName;

            TabSpyOut.InitComplexBtnItem(j);
            return j;
        }

        private List<TabSpyOut> _getSpyItemsList(IDbConnection connection, int userId, int lastId = 0) {
            var reports = _uSpyService.GetSpyReports(connection, userId, s => new TabSpyOut
            {
                Id = s.Id,

                TargetPlanetId = s.TargetPlanetId,

                TargetUserName = s.TargetUserName,
                TargetSystemName = s.TargetPlanetName.Substring(0, 5),
                TargetPlanetName = s.TargetPlanetName,
                TargetResource = s.TargetResource,
                //SourceOwnType = false,
                TargetHangar = UnitList.ConvertToHangar(s.TargetPlanetHangar),

                //todo  временно назначен
                LeftImage = ImageView.Img(_spriteImages.MapControlIcons("jumptoplanetoid").Icon),
                RightImage =
                    (s.TargetUserName == Npc.SkagyName)
                        ? ImageView.Img(_spriteImages.MapControlIcons("interface-skagry-icon").Icon, Npc.SkagyName,
                            false, Npc.SkagyName)
                        : ImageView.Img(s.TargetUserImage.Icon, s.TargetUserName, true, s.TargetUserName),
                Date = UnixTime.GetDateFromTimeStamp(s.DateActivate),
                TimeNow = UnixTime.GetTimeFromTimeStamp(s.DateActivate),
            }, lastId);
            return reports;
        }

        #endregion
    }
}