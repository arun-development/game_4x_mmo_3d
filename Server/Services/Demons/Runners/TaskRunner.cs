using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Server.Core.Battle;
using Server.Core.Infrastructure;
using Server.Core.Infrastructure.Unit;
using Server.Core.Interfaces;
using Server.Core.Interfaces.Confederation;
using Server.Core.Interfaces.UserServices;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Products;
using Server.Core.СompexPrimitive.Resources;
using Server.Core.СompexPrimitive.Units;
using Server.DataLayer;
using Server.Extensions;
using Server.Services.AdvancedService;
using Server.Services.NpcArea;
using Server.ServicesConnected.AzureStorageServices.LogService;
using Server.Utils;

namespace Server.Services.Demons.Runners
{
    public class TaskRunner : ITaskRunner
    {
        private readonly IAllianceService _allianceService;
        private readonly IConfederationService _confederationService;
        private readonly IGameUserService _gameUserService;
        private readonly IGDetailPlanetService _gDetailPlanetService;
        private readonly IUMotherJumpService _motherJumpService;
        private readonly IMotherRunner _motherRunner;
        private readonly IMothershipService _mothershipService;

        private readonly IStoreService _storeService;
        private readonly IUReportService _uReportService;
        private readonly IUTaskService _uTaskService;
        private readonly IPlanetRunner _planetRunner;
        private readonly IDemonAzureLogItem _demonLog;
        private readonly IDbProvider _dbProvider;
        private readonly IServiceProvider _svp;
        private INpcTaskRunner __npcTaskRunner;
        private INpcTaskRunner _npcTaskRunner
        {
            get
            {
                if (__npcTaskRunner != null)
                {
                    return __npcTaskRunner;
                }

                return __npcTaskRunner = _svp.GetService<INpcTaskRunner>();
            }
        }

        public TaskRunner(IServiceProvider svp)
        {
            _svp = svp;
            _uTaskService = _svp.GetService<IUTaskService>();
            _uReportService = _svp.GetService<IUReportService>();

            _gDetailPlanetService = _svp.GetService<IGDetailPlanetService>();
            _gameUserService = _svp.GetService<IGameUserService>();
            _storeService = _svp.GetService<IStoreService>();
            _allianceService = _svp.GetService<IAllianceService>();
            _motherRunner = _svp.GetService<IMotherRunner>();
            _confederationService = _svp.GetService<IConfederationService>();
            _mothershipService = _svp.GetService<IMothershipService>();
            _motherJumpService = _svp.GetService<IUMotherJumpService>();
            _planetRunner = _svp.GetService<IPlanetRunner>();
            _demonLog = _svp.GetService<IDemonAzureLogItem>();
            _dbProvider = _svp.GetService<IDbProvider>();
 
        }


        private static int LAST_DEMON_RUNTIME = 0;
        private const int MIN_DEMON_DELAY_SECOND = UnixTime.OneMinuteInSecond * 2;

        public void PushDemon(IDbConnection connection)
        {

            var curTime = UnixTime.UtcNow();
            if (curTime - LAST_DEMON_RUNTIME < MIN_DEMON_DELAY_SECOND)
            {
                return;
            }
            var userIds = _uTaskService.GetAllUserIdsFromTasks(connection);
            if (!userIds.Any())
            {
                return;
            }

            LAST_DEMON_RUNTIME = curTime;
            //if (userIds.Contains(Npc.SkagryGameUserId))
            //{
            //    userIds.Remove(Npc.SkagryGameUserId);
            //}

            foreach (var userId in userIds)
            {
                RunUser(connection, userId);
            }
            //Console.WriteLine("ITaskRunner userId "+ userId);
        }

        private static readonly object _runTaskItemLocker = new object();
        public void RunTaskItem(IDbConnection connection, int taskId)
        {
            if (taskId == 0)
            {
                return;
            }
            var taskItem = _uTaskService.GetByTaskId(connection, taskId, true);
            if (taskItem == null)
            {

                _demonLog.CrateAndSave("UserTaskDataModel", "TaskRunner.RunTaskItem.taskItemIsNull", new { TaskId = taskId }, taskId);

                return;
            }

            if (taskItem.TaskEnd)
            {
                return;
            }
            lock (_runTaskItemLocker)
            {
                var currUtcTime = DateTime.UtcNow;
                var curTime = UnixTime.ToTimestamp(currUtcTime);
                var endTime = taskItem.DateActivate + taskItem.Duration;
                var timers = TimerExecutor.GetTaskTimersByTaskId(taskItem.Id);
                if (timers.Count > 1)
                {
                    _demonLog.CrateAndSave("UserTaskDataModel", "TaskRunner.RunTaskItem.multipleTimers_", new { TaskId = taskId }, taskId);
                    return;
                }
                var timer = timers.FirstOrDefault();
                if (timer == null)
                {

                    var delay = endTime - curTime;
                    if (delay > 0)
                    {
                        _onUserTaskCreated(delay, taskItem.Id, taskItem.SourceUserId, taskItem.TargetPlanetId);
                        return;
                    }


                }
                else if (!timer.InProgress || timer.IsDisposed)
                {
                    return;
                }

                taskItem = _uTaskService.SetUpdateInProgress(connection, taskItem);

                #region Body

                try
                {
                    var targetPlanetId = taskItem.TargetPlanetId;
                    var targetPlanetSrc = _gDetailPlanetService.GetPlanet(connection, targetPlanetId);

                    var defenderUser = _gameUserService.GetGameUser(connection, targetPlanetSrc.UserId);
                    var defendorPremium = _storeService.GetPremiumWorkModel(connection, defenderUser.Id);
                    var defendorPlanet = _planetRunner.RunSinglePlanet(connection, targetPlanetSrc, defendorPremium, _gDetailPlanetService);


                    //result.TimeOver = true;
                    //var user = taskItem.user;
                    UserDataModel sourceUser = null;
                    var npc = NpcHelper.GetNpcByName(Npc.SkagyName);
                    if (taskItem.SourceUserId == defenderUser.Id)
                    {
                        taskItem.IsAtack = false;
                        taskItem.IsTransfer = true;
                        sourceUser = defenderUser;
                    }
                    else
                    {
                        taskItem.IsAtack = true;
                        taskItem.IsTransfer = false;
                        if (taskItem.SourceUserId == npc.NpcUser.Id)
                        {
                            sourceUser = npc.NpcUser;
                        }
                        else
                        {
                            sourceUser = _gameUserService.GetGameUser(connection, taskItem.SourceUserId);
                        }
                    }

                    #region IsAtack

                    if (taskItem.IsAtack)
                    {
                        var atackModel = new TmpAtackModel
                        {
                            TaskItem = taskItem,
                            SourceUser = new TmpAtackItem
                            {
                                User = sourceUser
                            },
                            DefendorUser = new TmpAtackItem
                            {
                                User = defenderUser,
                                Premium = defendorPremium
                            },
                            DefendorPlanet = defendorPlanet,
                            Npc = npc,
                            BattleTime = curTime,
                            BattleDtTime = currUtcTime
                        };
                        _atack(connection, atackModel);
                        var ti = atackModel.TaskItem.CloneDeep();
                        var report = atackModel.ReportDataModel.CloneDeep();
                        int? newTotalWinnerUserCc = atackModel.NewTotalWinnerUserCc;
                        
                        Task.Factory.StartNew(() => { _uTaskService.NotyfyTaskFinished(ti, report, newTotalWinnerUserCc); });

                        return;
                    }

                    #endregion

                    #region IsTransfer

                    defendorPlanet.Hangar = UnitList.CalculateNewUnits(taskItem.SourceFleet, defendorPlanet.Hangar, true);
                    _gDetailPlanetService.AddOrUpdate(connection, defendorPlanet);
                    taskItem.TaskEnd = true;
                    _uTaskService.UnlockUpdateInProgress(connection, taskItem.Id);
                    var updatedTask = _uTaskService.AddOrUpdate(connection, taskItem);

                    Task.Factory.StartNew(() => { _uTaskService.NotyfyTaskFinished(updatedTask); });



                    #endregion
                }
                catch (Exception e)
                {
                    _demonLog.CrateAndSave("UserTaskDataModel", "TaskRunner.RunTaskItem.ExceptionTaskItemData", taskItem, taskItem.Id);
                    _demonLog.CrateAndSave("Exception", "TaskRunner.RunTaskItem.ExceptionData", e, taskItem.Id);
                    _uTaskService.UnlockUpdateInProgress(connection, taskItem.Id);
                    throw;
                }


            }

            #endregion
        }

        public TimerExecutorItem OnUserTaskCreated(UserTaskDataModel newTask, int initiativeUserId, Action<IDbConnection> onFinnalyTimerElapsed = null)
        {

            return _onUserTaskCreated(newTask.Duration, newTask.Id, initiativeUserId, newTask.TargetPlanetId, onFinnalyTimerElapsed);
   
        }

        private TimerExecutorItem _onUserTaskCreated(int durationSec, int taskId, int initiativeUserId, int targetPlanetId, Action<IDbConnection> onFinnalyTimerElapsed = null)
        {
            var timer = TimerExecutor.CreateUserTaskTimer(durationSec, taskId, initiativeUserId, targetPlanetId, () =>
            {
                _dbProvider.ContextAction(connection =>
                {
                    try
                    {
                        connection.OpenIfClosed();
                        RunTaskItem(connection, taskId);
                        onFinnalyTimerElapsed?.Invoke(connection);
                        return true;
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                        throw;
                    }
                    finally
                    {
                        connection.CloseIfOpened();
                    }

                });

            });

            var started = TimerExecutor.SetFinalizeAndStart(timer);
            if (!started)
            {
                timer.Dispose();
                throw new NotImplementedException("OnUserTaskCreated: !started");
            }
            else
            {
                TimerExecutor.AddOrUpdate(timer);
            }
            return timer;
        }




        public void RunUser(IDbConnection connection, int userId)
        {
            var userTaskIds = _uTaskService.GetUserNotFinishedTasks(connection, userId, i => i.Id);
            if (!userTaskIds.Any())
            {
                return;
            }
            foreach (var taskId in userTaskIds)
            {
                RunTaskItem(connection, taskId);
            }
        }


        private void _calcDangerLevel(int timeBeforeAtk, int currentTime, GDetailPlanetDataModel planet)
        {
            var deltaTime = currentTime - timeBeforeAtk;
            if (deltaTime <= UnixTime.OneHourInSecond)
            {
                planet.DangerLevel += 2;
            }
            if (deltaTime <= UnixTime.OneDayInSecond)
            {
                planet.DangerLevel += 1;
            }
            else if (deltaTime >= UnixTime.OneDayInSecond * 7 && planet.DangerLevel - 1 > 1)
            {
                planet.DangerLevel -= 1;
            }
            else if (deltaTime >= UnixTime.OneDayInSecond * 30)
            {
                planet.DangerLevel = 1;
            }
        }

        private int _calcBattlePvp(BattleFleets atakerReport, BattleFleets defendorReport, BattleResult status)
        {
            //  if (status == BattleResult.DeadHeat) return 0;
            //if (status == BattleResult.AtackerEscape) return 0;
            var destroedHp = 0;
            var lostHp = 0;

            if (status == BattleResult.AtackerWin)
            {
                lostHp = FleetStats.SetPowerFleet(atakerReport.Lose).Hp;
                destroedHp = FleetStats.SetPowerFleet(defendorReport.Lose).Hp;
            }
            else if (status == BattleResult.DefenderWin)
            {
                lostHp = FleetStats.SetPowerFleet(defendorReport.Lose).Hp;
                destroedHp = FleetStats.SetPowerFleet(atakerReport.Lose).Hp;
            }
            var pvpMod = 1.1;
            var lost = 0;
            var destroy = 0;

            if (lostHp > 2)
            {
                lost = lostHp / 2;
            }
            if (destroedHp > 0)
            {
                destroy = destroedHp;
            }

            var resultPvp = (int)Math.Floor((lost + destroy) * pvpMod);
            return resultPvp;
        }


        private int _calcCc(BattleFleets skagryFleetReport, bool skagryIsAtacker)
        {
            var mod = skagryIsAtacker ? 2.0 : 1.0;
            var skagryHp = FleetStats.SetPowerFleet(skagryFleetReport.Before).Hp;
            var proportion = 100.0;
            var cc = mod * skagryHp / proportion;
            return (int)Math.Floor(cc);
        }


        private void _atack(IDbConnection connection, TmpAtackModel atackModel)
        {
            //todo  нет проверок на  null будует блокировка если будет любое исключение


            if (atackModel.SourceUser.User.IsNpc)
            {
                atackModel.AtackerIsSkagry = true;
                _atackNpcVsUser(connection, atackModel);
                _npcTaskRunner.RemovePlanetFromActivatedPlanets(atackModel.TaskItem.TargetPlanetId);
            }
            else if (atackModel.DefendorUser.User.IsNpc)
            {
                _atackUserVsNpc(connection, atackModel);
            }
            else if (!atackModel.SourceUser.User.IsNpc && !atackModel.DefendorUser.User.IsNpc)
            {
                _atackUserVsUser(connection, atackModel);
            }
            else
            {
                throw new NotImplementedException();
            }
        }

        private void _atackNpcVsUser(IDbConnection connection, TmpAtackModel am)
        {
            //todo  можно ввести зеркало с атки по деф планете для кол ва юнитов
            am.SourceUser.Fleet = am.TaskItem.SourceFleet.CloneDeep();
            am.SourceUser.Mother = am.Npc.NpcMother;
            am.SourceUser.Alliance = am.Npc.NpcAlliance;
            am.SourceUser.UnitMods = BattleStatCalculationService.CreateSkagryMods(am.Npc);

            am.DefendorUser.Fleet = am.DefendorPlanet.Hangar;
            am.DefendorUser.Mother = _motherRunner.RunUser(connection, _mothershipService.GetMother(connection, am.DefendorUser.User.Id),
                am.DefendorUser.Premium, _mothershipService, _motherJumpService);
            am.DefendorUser.AllianceTech = _allianceService.GetAllianceTech(connection, am.DefendorPlanet.AllianceId);
            am.DefendorUser.UnitMods = BattleStatCalculationService.GetUnitStatsAndMods(connection, am.DefendorUser.Mother,
                am.DefendorUser.AllianceTech, _confederationService, _storeService);

            _atackReport(connection, am);

            //atacker npc  win
            if (am.ReportDataModel.AtackerWin)
            {
                am.OnAtackerWin(connection, _gDetailPlanetService, _allianceService);
            }
            //defendor user win
            else
            {
                am.DefendorUser.Alliance = _allianceService.GetAllianceById(connection, am.DefendorUser.AllianceTech.Id, false);

                //calc  cc by damage
                am.NewTotalWinnerUserCc = _updateCc(connection, _calcCc(am.SourceUser.Report, true), am.DefendorUser);
                am.FinalizeDefendorWin(connection, _gDetailPlanetService);
            }


            am.FinalizeAtack(connection, _uTaskService);
        }

        private void _atackUserVsNpc(IDbConnection connection, TmpAtackModel am)
        {
            am.SourceUser.Fleet = am.TaskItem.SourceFleet;
            am.SourceUser.Premium = _storeService.GetPremiumWorkModel(connection, am.SourceUser.User.Id);
            am.SourceUser.Mother = _motherRunner.RunUser(connection, _mothershipService.GetMother(connection, am.SourceUser.User.Id),
                am.SourceUser.Premium, _mothershipService, _motherJumpService);
            var allianceUser = _allianceService.GetAllianceUserByUserId(connection, am.SourceUser.User.Id);
            am.SourceUser.AllianceTech = _allianceService.GetAllianceTech(connection, allianceUser.AllianceId);
            am.SourceUser.UnitMods = BattleStatCalculationService.GetUnitStatsAndMods(connection, am.SourceUser.Mother,
                am.SourceUser.AllianceTech, _confederationService, _storeService);


            am.DefendorUser.Fleet = am.DefendorPlanet.Hangar;
            am.DefendorUser.Mother = am.Npc.NpcMother;
            am.DefendorUser.UnitMods = BattleStatCalculationService.CreateSkagryMods(am.Npc);

            _atackReport(connection, am);

            //atacker user  win
            if (am.ReportDataModel.AtackerWin)
            {
                am.OnAtackerWin(connection, _gDetailPlanetService, _allianceService);
                //calc  cc by damage
                am.SourceUser.Alliance = _allianceService.GetAllianceById(connection, allianceUser.AllianceId, false);
                am.NewTotalWinnerUserCc = _updateCc(connection, _calcCc(am.DefendorUser.Report, false), am.SourceUser);

            }
            //defendor npc win
            else
            {
                am.FinalizeDefendorWin(connection, _gDetailPlanetService);

            }

            am.FinalizeAtack(connection, _uTaskService);
        }

        private void _atackUserVsUser(IDbConnection connection, TmpAtackModel am)
        {
            am.SourceUser.Fleet = am.TaskItem.SourceFleet;

            am.SourceUser.Premium = _storeService.GetPremiumWorkModel(connection, am.SourceUser.User.Id);
            am.SourceUser.Mother = _motherRunner.RunUser(connection, _mothershipService.GetMother(connection, am.SourceUser.User.Id),
                am.SourceUser.Premium, _mothershipService, _motherJumpService);
            var sourceAllianceUser = _allianceService.GetAllianceUserByUserId(connection, am.SourceUser.User.Id);
            am.SourceUser.AllianceTech = _allianceService.GetAllianceTech(connection, sourceAllianceUser.AllianceId);
            am.SourceUser.UnitMods = BattleStatCalculationService.GetUnitStatsAndMods(connection, am.SourceUser.Mother,
                am.SourceUser.AllianceTech, _confederationService, _storeService);

            am.DefendorUser.Fleet = am.DefendorPlanet.Hangar;
            am.DefendorUser.Mother = _motherRunner.RunUser(connection, _mothershipService.GetMother(connection, am.DefendorUser.User.Id),
                am.DefendorUser.Premium, _mothershipService, _motherJumpService);
            am.DefendorUser.AllianceTech = _allianceService.GetAllianceTech(connection, am.DefendorPlanet.AllianceId);
            am.DefendorUser.UnitMods = BattleStatCalculationService.GetUnitStatsAndMods(connection, am.DefendorUser.Mother,
                am.DefendorUser.AllianceTech, _confederationService, _storeService);

            _atackReport(connection, am);

            //atacker   win
            if (am.ReportDataModel.AtackerWin)
            {
                am.OnAtackerWin(connection, _gDetailPlanetService, _allianceService);
                am.SourceUser.Alliance = _allianceService.GetAllianceById(connection, sourceAllianceUser.AllianceId, false);
                var battlePvp = _calcBattlePvp(am.SourceUser.Report, am.DefendorUser.Report,
                    am.ReportDataModel.AtackerResultStatus);
                am.SourceUser.Alliance.PvpRating += battlePvp;
                am.SourceUser.Alliance = _allianceService.AddOrUpdate(connection, am.SourceUser.Alliance);
                am.SourceUser.User.PvpPoint += battlePvp;
                am.SourceUser.User = _gameUserService.AddOrUpdate(connection, am.SourceUser.User);
            }
            //defendor win
            else
            {
                am.FinalizeDefendorWin(connection, _gDetailPlanetService);
            }

            am.FinalizeAtack(connection, _uTaskService);

        }


        private void _atackReport(IDbConnection connection, TmpAtackModel am)
        {
            _calcDangerLevel(UnixTime.ToTimestamp(am.DefendorPlanet.LastActive), am.BattleTime, am.DefendorPlanet);
            am.Battle = new BattleFleetsCalculator(am.SourceUser.Fleet, am.DefendorUser.Fleet);
            am.Battle.SetUnitMods(am.SourceUser.UnitMods, am.DefendorUser.UnitMods);
            am.BattleLog = am.Battle.Battle(am.DefendorPlanet.Turels.Level ?? 0);


            var status = am.BattleLog.Last().BattleResult;
            var isWin = status == BattleResult.AtackerWin;
            am.SourceUser.Report = am.Battle.Source;
            am.DefendorUser.Report = am.Battle.Target;

            am.ReportDataModel = _uReportService.AddOrUpdate(connection, new UserReportDataModel
            {
                TaskId = am.TaskItem.Id,
                BattleTime = am.BattleTime,
                //todo Сбрасывать ресурсы?
                Resources = MaterialResource.ConvertStorageToMaterial(am.DefendorPlanet.Resources).ConvertToInt(),
                RoundsLog = am.BattleLog,
                DefenderUserId = am.DefendorUser.User.Id,
                DefenderUserName = am.DefendorUser.User.Nickname,
                DefenderDeleteReport = !am.AtackerIsSkagry,
                DefenderSummaryReport = am.DefendorUser.Report,

                AtackerResultStatus = status,
                AtackerWin = isWin,
                AtackerUserId = am.SourceUser.User.Id,
                AtackerUserName = am.SourceUser.User.Nickname,
                AtackerSummaryReport = am.SourceUser.Report,
                AtackerIsSkagry = am.AtackerIsSkagry,
                AtackerDeleteReport = am.AtackerIsSkagry
            });
        }


        private int? _updateCc(IDbConnection connection, int battleCc, TmpAtackItem userItem)
        {
            if (battleCc > 0)
            {
                if (userItem.Alliance != null && userItem.Alliance.Id != 0)
                {
                    var tax = userItem.Alliance.Tax;
                    if (tax > 0)
                    {
                        var allianceCc = battleCc * ((double)tax / 100);
                        var intAcc = (int)Math.Floor(allianceCc);
                        if (intAcc == 0)
                        {
                            intAcc = 1;
                        }
                        userItem.Alliance.Cc += intAcc;
                        battleCc -= intAcc;
                        if (battleCc <= 0)
                        {
                            battleCc = 1;
                        }
                        userItem.Alliance = _allianceService.AddOrUpdate(connection, userItem.Alliance);
                    }
                }

                // todo  что то там про премиум у пользователя и сс ревард
                var newUserCc = _storeService.BalanceUpdate(connection, userItem.User.Id, battleCc, 1);
                return newUserCc.Quantity;
            }
            return null;
        }

        private class TmpAtackItem
        {
            public UserDataModel User { get; set; }
            public UserPremiumWorkModel Premium { get; set; }
            public UserMothershipDataModel Mother { get; set; }
            public AllianceDataModel Alliance { get; set; }
            public AllianceTechDataModel AllianceTech { get; set; }
            public Dictionary<UnitType, int> Fleet { get; set; }
            public Dictionary<UnitType, Dictionary<BattleStatTypes, IBattleStatsDouble>> UnitMods { get; set; }
            public BattleFleets Report { get; set; }
        }


        private class TmpAtackModel
        {
            public UserTaskDataModel TaskItem { get; set; }
            public GDetailPlanetDataModel DefendorPlanet { get; set; }

            public TmpAtackItem SourceUser { get; set; }
            public TmpAtackItem DefendorUser { get; set; }
            public NpcModel Npc { get; set; }
            public List<Round> BattleLog { get; set; }
            public BattleFleetsCalculator Battle { get; set; }
            public int BattleTime { get; set; }
            public DateTime BattleDtTime { get; set; }
            public UserReportDataModel ReportDataModel { get; set; }
            public bool AtackerIsSkagry { get; set; }
            public int? NewTotalWinnerUserCc { get; set; }


            public void OnAtackerWin(IDbConnection connection, IGDetailPlanetService detailPlanetService, IAllianceService allianceService)
            {
                DefendorPlanet.UserId = SourceUser.User.Id;
                DefendorPlanet.Hangar = UnitList.PrepareHangarUnits(SourceUser.Report.After);
                DefendorPlanet.LastActive = BattleDtTime;

                //рушим здания  от юзера
                var defendorPlanet = DefendorPlanet;

                detailPlanetService.ResetProgress(ref defendorPlanet);
                DefendorPlanet = defendorPlanet;
                //обновлени планеты внутри
                detailPlanetService.UpdatePlanetOwner(connection, DefendorPlanet, SourceUser.User.Id, allianceService);
            }
            public void FinalizeDefendorWin(IDbConnection connection, IGDetailPlanetService detailPlanetService)
            {
                DefendorPlanet.Hangar = UnitList.PrepareHangarUnits(DefendorUser.Report.After);
                DefendorPlanet.DangerLevel += 1;
                DefendorPlanet = detailPlanetService.AddOrUpdate(connection, DefendorPlanet);
                //todo  сколько осталось турелей
            }
            public void FinalizeAtack(IDbConnection connection, IUTaskService uTaskService)
            {
                TaskItem.TaskEnd = true;
                uTaskService.UnlockUpdateInProgress(connection, TaskItem.Id);
                TaskItem = uTaskService.AddOrUpdate(connection, TaskItem);
            }
        }
    }
}