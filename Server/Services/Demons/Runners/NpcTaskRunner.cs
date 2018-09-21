using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Timers;
using Microsoft.Extensions.DependencyInjection;
using Server.Core.Infrastructure;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.Core.Interfaces.World;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Units;
using Server.DataLayer;
using Server.Extensions;
using Server.ServicesConnected.AzureStorageServices.LogService;
using Server.Core.Infrastructure.Unit;

namespace Server.Services.Demons.Runners
{
    public class NpcTaskRunner : INpcTaskRunner
    {
        #region Declare

        private const int MIN_AGR_LEVEL = 20;
        private const int MAX_TASK_IN_PLANET_LIMIT = 3;
        private const int MAX_USER_TASK_LIMIT = 10;
        private const int DEFAULT_CYCLE_INTERVAL_MS =6* UnixTime.OneHourInSecond;
        private const int SKAGRY_FLY_TYME_SECOND = UnixTime.OneHourInSecond;
        private const int MIN_ATACK_DELTA_TIME_SECOND =  SKAGRY_FLY_TYME_SECOND+ UnixTime.OneDayInSecond;
        private static List<int> _activatedPlanetIds;
        private static bool _inProgress;

        public NpcTaskRunner(IGameRunner gameRunner)
        {
            _gameRunner = gameRunner;
            _provider = _svp.GetService<IDbProvider>();
        }

        #region  Fields

        private readonly IGameRunner _gameRunner;

        private readonly IDbProvider _provider;
        private IGGeometryPlanetService __geometryPlanetService;
        private IGDetailPlanetService __planetService;
        private ISystemService __systemService;
        private ITaskRunner __taskRunner;
        private IUTaskService __taskService;

        private readonly Random _rand = new Random();
        private Timer _timer;
        public static bool Stoped { get; private set; } = true;
        public void RemovePlanetFromActivatedPlanets(int targetPlanetId)
        {
            _activatedPlanetIds.Remove(targetPlanetId);
        }


        public static int SkagryActivatedTaskCount => _activatedPlanetIds?.Count ?? 0;


        private IServiceProvider _svp => _gameRunner.ServiceProvider;

        private IGDetailPlanetService _planetService
        {
            get
            {
                if (__planetService != null)
                {
                    return __planetService;
                }

                return __planetService = _svp.GetService<IGDetailPlanetService>();
            }
        }

        private IUTaskService _taskService
        {
            get
            {
                if (__taskService != null)
                {
                    return __taskService;
                }

                return __taskService = _svp.GetService<IUTaskService>();
            }
        }

        private ITaskRunner _taskRunner
        {
            get
            {
                if (__taskRunner != null)
                {
                    return __taskRunner;
                }

                return __taskRunner = _svp.GetService<ITaskRunner>();
            }
        }


        private IGGeometryPlanetService _geometryPlanetService
        {
            get
            {
                if (__geometryPlanetService != null)
                {
                    return __geometryPlanetService;
                }

                return __geometryPlanetService = _svp.GetService<IGGeometryPlanetService>();
            }
        }

        private ISystemService _systemService
        {
            get
            {
                if (__systemService != null)
                {
                    return __systemService;
                }

                return __systemService = _svp.GetService<ISystemService>();
            }
        }

        bool INpcTaskRunner.Stoped => Stoped;

        #endregion

        #endregion

        #region Interface

        public void Run()
        {
            Stop();
            Stoped = false;
            _activatedPlanetIds = new List<int>();
            
            _timer = new Timer
            {
                Interval = DEFAULT_CYCLE_INTERVAL_MS,
                AutoReset = true
            };
            
            _timer.Elapsed += (sender, args) =>
            {
                if (_inProgress)
                {
                    return;
                }
                _inProgress = true;
                var timer = (Timer)sender;
                var minTime =(int) Math.Floor(DEFAULT_CYCLE_INTERVAL_MS * 0.5);
                var maxTime = DEFAULT_CYCLE_INTERVAL_MS * 2;
                var nextDelay = _rand.Next(minTime, maxTime);
                timer.Interval = nextDelay;
                _provider.ContextAction(connection =>
                {
                    try
                    {
                        connection.OpenIfClosed();
                        _run(connection);
                        return true;
                    }
                    finally
                    {
                        connection.CloseIfOpened();
                    }
                });
            };
            _timer.Start();
        }

        public void Stop()
        {
            Stoped = true;
            if (_timer != null)
            {
                _timer.Close();
                _timer.Dispose();
                _timer = null;
            }
            _inProgress = false;
        }

        #endregion


        private void _run(IDbConnection connection)
        {
            var currTime = UnixTime.UtcNow();

            var planetIds = _gameRunner.GetPlanetIds(connection);
            foreach (var planeId in planetIds)
            {
                _runPlanet(connection, planeId, currTime);
            }
            _inProgress = false;
        }

        private void _runPlanet(IDbConnection connection, int planetId, int currentTime)
        {
            if (Stoped)
            {
                return;
            }
            if (_activatedPlanetIds.Contains(planetId))
            {
                return;
            }
            var planet = _getPlanet(connection, planetId);
            if (planet == null)
            {
                return;
            }

            if (planet.UserId == Npc.SkagryGameUserId)
            {
                return;
            }
            var lastActive = UnixTime.ToTimestamp(planet.LastActive);
            if (currentTime - lastActive < MIN_ATACK_DELTA_TIME_SECOND)
            {
                return;
            }
            if (planet.DangerLevel < 1)
            {
                return;
            }
            var dangerProportion = 0.5 / planet.DangerLevel;
            var rand = _rand.NextDouble();
            if (rand > dangerProportion)
            {
                return;
            }
            var agrLevel = _getFleetAgrLevel(planet.Hangar);
            if (agrLevel < MIN_AGR_LEVEL)
            {
                return;
            }
            var chance = 0.5;
            if (agrLevel < 100)
            {
                chance = 0.5;
            }
            else if (agrLevel < 500)
            {
                chance = 0.7;
            }
            else if (agrLevel <= 1000)
            {
                chance = 0.8;
            }
            else
            {
                chance = 0.9;
            }
            rand = _rand.NextDouble();
            if (rand > chance)
            {
                return;
            }
            var activePlanetTasks = TimerExecutor.GetTaskTimersByPlanetId(planet.Id);
            if (activePlanetTasks.Count > MAX_TASK_IN_PLANET_LIMIT ||
                activePlanetTasks.GetSkaryTaskCountInPlanet(planet.Id) > 0)
            {
                _delayLockPlanet(planetId, activePlanetTasks);
                return;
            }
            if (activePlanetTasks.Count(i => i.InProgress || i.IsDisposed) > 0)
            {
                return;
            }

            var targetUserId = planet.UserId;
            var userTasks = TimerExecutor.GetUserTaskTimers(targetUserId);
            if (userTasks != null && userTasks.Count > MAX_USER_TASK_LIMIT)
            {
                var maxDelay = userTasks.Where(i => !i.InProgress && !i.IsDisposed).Select(i => i.Timer.Interval).Max();
                var delay = maxDelay * 2;
                foreach (var task in userTasks)
                {
                    var pid = _getPlanetId(task);
                    if (pid != planetId)
                    {
                        _delayLockPlanet(pid, delay);
                    }
                }
 
                if (!_activatedPlanetIds.Contains(planetId))
                {
                    _delayLockPlanet(planetId, delay);
                }

                return;
            }
            _createTaskToUser(connection, planet);
        }

        private int _getPlanetId(TimerExecutorItem task) =>
            (int) task.AdvancedData[TimerAdvancedDataKeys.TargetPlanetId];

        private void _delayLockPlanet(int planetId, List<TimerExecutorItem> activeTimers)
        {
            var maxDelay = activeTimers.Where(i => !i.InProgress && !i.IsDisposed).Select(i => i.Timer.Interval).Max();
            if (maxDelay <= DEFAULT_CYCLE_INTERVAL_MS)
            {
                return;
            }
            _activatedPlanetIds.Add(planetId);
            _delayLockPlanet(planetId, maxDelay);
        }

        private void _delayLockPlanet(int planetId, double delayMs)
        {
            _activatedPlanetIds.Add(planetId);

            var lockLimer = new Timer
            {
                Interval = delayMs,
                AutoReset = false
            };
            lockLimer.Elapsed += (sender, args) =>
            {
                if (!Stoped)
                {
                    _activatedPlanetIds.Remove(planetId);
                }
                lockLimer.Close();
                lockLimer.Dispose();
                lockLimer = null;
            };
            lockLimer.Start();
        }

        private GDetailPlanetDataModel _getPlanet(IDbConnection connection, int planetId) =>
            _planetService.GetPlanet(connection, planetId, false);

        private double _getFleetAgrLevel(IReadOnlyDictionary<UnitType, int> hangar)
        {
            var agrLevel = 0.0;
            if (hangar.ContainsKey(UnitType.Drone))
            {
                agrLevel += hangar[UnitType.Drone] * 1;
            }
            if (hangar.ContainsKey(UnitType.Frigate))
            {
                agrLevel += hangar[UnitType.Frigate] * 2;
            }

            if (hangar.ContainsKey(UnitType.Battlecruiser))
            {
                agrLevel += hangar[UnitType.Battlecruiser] * 4;
            }
            if (hangar.ContainsKey(UnitType.Battleship))
            {
                agrLevel += hangar[UnitType.Battleship] * 8;
            }

            if (hangar.ContainsKey(UnitType.Drednout))
            {
                agrLevel += hangar[UnitType.Drednout] * 16;
            }
            return agrLevel;
        }

        private UserTaskDataModel _createTaskModelToUser(IDbConnection connection, GDetailPlanetDataModel targetPlanet)
        {
            //return new UserTaskDataModel();

            //tmp
            var targeFleet = _createSkagryFleet(targetPlanet.Hangar, 0.3);
 
 


            var targetPlanetGeometry = _geometryPlanetService.GetGeometryPlanetById(connection, targetPlanet.Id);
            var targetPlanetSystem =
                _systemService.GetDetailSystemBySystemId(connection, targetPlanetGeometry.SystemId);
            var minTime = SKAGRY_FLY_TYME_SECOND;
            var maxTime = minTime * 2;
            var duration = _rand.Next(minTime, maxTime);
            var newTaskItem = new UserTaskDataModel
            {
                SourceTypeId = 20,
                SourceOwnType = false,
                SourceOwnName = Npc.SkagyName,
                SourceUserId = Npc.SkagryGameUserId,
                SourceOwnId = 0,
                TargetPlanetName = targetPlanet.Name,
                DateActivate = UnixTime.UtcNow(),
                Duration = duration,
                SourceFleet = targeFleet, // targeFleet, // targetPlanet.Hangar.CloneDeep(),
                IsAtack = true,
                IsTransfer = false,
                TargetPlanetId = targetPlanet.Id,
                TargetPlanetTypeId = targetPlanetGeometry.TypeId,
                TargetSystemName = targetPlanetSystem.Name,
                SourceSystemName = "Unknown",
                Canselation = false,
                TaskEnd = false
            };
            // todo save to db new Task Item
            var dataTask = _taskService.AddOrUpdate(connection, newTaskItem);
            return dataTask;
        }

        private Dictionary<UnitType, int> _createSkagryFleet(Dictionary<UnitType, int> planetFleet, double power) {

            Dictionary<UnitType, int> skagryFleet;
            if (planetFleet == null || !planetFleet.Any() || planetFleet.All(i=> i.Value == 0))
            {
                skagryFleet = UnitList.ProtoUnits.ToDictionary(i=> i.Key, i=> i.Value);
                skagryFleet[UnitType.Drone] = 1;
                return skagryFleet;
            }
            skagryFleet = planetFleet.CloneDeep();
            foreach (var i in skagryFleet) {
                int val = (int)Math.Floor(i.Value * power);
                skagryFleet[i.Key] = val;
            }

            if (planetFleet.All(i => i.Value == 0))
            {
                skagryFleet[UnitType.Drone] = 1;
            }

            return skagryFleet;
        }

        private void _createTaskToUser(IDbConnection connection, GDetailPlanetDataModel targetPlanet)
        {
            var taskModel = _createTaskModelToUser(connection, targetPlanet);
            _activatedPlanetIds.Add(taskModel.TargetPlanetId);
            var targetUserId = targetPlanet.UserId;

            var timer = _taskRunner.OnUserTaskCreated(taskModel, taskModel.SourceUserId);
            if (!timer.Started)
            {
                var logger = _svp.GetService<IDemonAzureLogItem>();
                logger.CrateAndSave("UserTaskDataModel", "NpcTaskRunner._createTaskToUser", taskModel, taskModel.Id);
                timer.Dispose();
                return;
            }
            _taskService.NotyfyTaskCreated(taskModel, targetUserId);
        }
    }
}