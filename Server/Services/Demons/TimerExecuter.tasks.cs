using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Timers;
using Server.Core.Infrastructure;
using Server.Core.Interfaces.UserServices;
using Server.DataLayer;

namespace Server.Services.Demons
{

    public static partial class TimerExecutor
    {


        #region Private

        private static IEnumerable<KeyValuePair<string, TimerExecutorItem>> _getTaskTimerByIntKeyData(this ConcurrentDictionary<string, TimerExecutorItem> store,
            TimerAdvancedDataKeys keyType,
            int dataKey,  Func<TimerExecutorItem, bool> predicateWhere = null)
        {
            return store._getByAdvancedIntDataKey(TimerType.UserTask, keyType, dataKey, predicateWhere);
        }
        private static IEnumerable<KeyValuePair<string, TimerExecutorItem>> _getUserTaskTimers(this ConcurrentDictionary<string, TimerExecutorItem> store, 
            int userId, Func<TimerExecutorItem, bool> predicateWhere = null)
        {
            return store._getTaskTimerByIntKeyData(TimerAdvancedDataKeys.SourceUserId, userId, predicateWhere);
        }


        private static IEnumerable<KeyValuePair<string, TimerExecutorItem>> _getTaskTimersByTaskId(this ConcurrentDictionary<string, TimerExecutorItem> store, int taskId, Func<TimerExecutorItem, bool> predicateWhere = null)
        {
            return store._getTaskTimerByIntKeyData(TimerAdvancedDataKeys.TaskId, taskId, predicateWhere);
        }
        private static IEnumerable<KeyValuePair<string, TimerExecutorItem>> _getTaskTimersByPlanetId(this ConcurrentDictionary<string, TimerExecutorItem> store, int targetPlanetId, Func<TimerExecutorItem, bool> predicateWhere = null)
        {
            return store._getTaskTimerByIntKeyData(TimerAdvancedDataKeys.TargetPlanetId, targetPlanetId, predicateWhere);
        }
        private static TimerExecutorItem _createUserTaskTimerBase(double delaySecond, int taskId, int sourceUserId, int targetPlanetId)
        {
            var timer = new TimerExecutorItem(TimerType.UserTask);
            timer.AdvancedData.Add(TimerAdvancedDataKeys.TaskId, taskId);
            timer.AdvancedData.Add(TimerAdvancedDataKeys.SourceUserId, sourceUserId);
            timer.AdvancedData.Add(TimerAdvancedDataKeys.TargetPlanetId, targetPlanetId);

            timer.Timer = new Timer(delaySecond * 1000)
            {
                AutoReset = false
            };
            return timer;

        }

        private static int _getTaskCountInPlanet(this List<TimerExecutorItem> tasks, int targetPlanetId, int sourceUserId)
        {
            if (tasks == null || !tasks.Any())
                return 0;
            return tasks.Count(i => _isEqualsKV(i, TimerAdvancedDataKeys.TargetPlanetId, targetPlanetId)
                                    && _isEqualsKV(i, TimerAdvancedDataKeys.SourceUserId, sourceUserId));

        }

        #endregion


        [Obsolete]
        public static TimerExecutorItem CreateUserTaskTimerTest(IDbConnection connection, double delaySecond, int taskId, int sourceUserId, int targetPlanetId)
        {
            throw new NotImplementedException();
            var timer = _createUserTaskTimerBase(delaySecond, taskId, sourceUserId, targetPlanetId);
            var ut = GetService<IUTaskService>();
            timer.GetData =   () =>  ut.GetByTaskId(connection, taskId, true);
            timer.SaveData =  newTaskData =>
            {
                if (newTaskData != null)
                {
                    return   ut.AddOrUpdate(connection,(UserTaskDataModel) newTaskData);
                }
                return null;

            };
            return timer;
        }
        
        
        public static TimerExecutorItem CreateUserTaskTimer(double delaySecond, int taskId, int sourceUserId, int targetPlanetId, Action onTimerEnd) {
            var timer = _createUserTaskTimerBase(delaySecond, taskId, sourceUserId, targetPlanetId);
            timer.SingleAction = onTimerEnd;
            timer.IsSingleActionTimer = true;
            return timer;
        }


        public static List<TimerExecutorItem> GetUserTaskTimers(int userId, Func<TimerExecutorItem, bool> predicateWhere = null)
        {
            return _timers._getUserTaskTimers(userId, predicateWhere).Select(i => i.Key).Select(Get).ToList();
        }


        private static Func<TimerExecutorItem, bool> _userTaskIdPredicate(int taskId)
        {
            return i => _isEqualsKV(i, TimerAdvancedDataKeys.TaskId, taskId);
        }

        public static List<TimerExecutorItem> GetUserTaskTimers(int userId,int taskId, Func<TimerExecutorItem, bool> predicateWhere = null)
        {
            var data = predicateWhere == null ? 
                _timers._getUserTaskTimers(userId, i => _userTaskIdPredicate(taskId)(i)) 
                : _timers._getUserTaskTimers(userId, i => _userTaskIdPredicate(taskId)(i) && predicateWhere(i));
            return data.Select(i => i.Key).Select(Get).ToList();
        }

        public static List<TimerExecutorItem> GetTaskTimersByTaskId(int taskId, Func<TimerExecutorItem, bool> predicateWhere = null)
        {
            return _timers._getTaskTimersByTaskId(taskId, predicateWhere).Select(i => i.Key).Select(Get).ToList();
        }
        public static List<TimerExecutorItem> GetTaskTimersByPlanetId(int targetPlanetId, Func<TimerExecutorItem, bool> predicateWhere = null)
        {
            return _timers._getTaskTimersByPlanetId(targetPlanetId, predicateWhere).Select(i => i.Key).Select(Get).ToList();
        }

        public static int GetSkaryTaskCountInPlanet(this List<TimerExecutorItem> tasks, int targetPlanetId)
        {
            return _getTaskCountInPlanet(tasks, targetPlanetId, Npc.SkagryGameUserId);

        }

        public static bool FillFromDb()
        {
            return false;
        }


    }
}
