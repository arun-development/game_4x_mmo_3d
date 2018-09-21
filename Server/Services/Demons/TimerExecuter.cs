using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Timers;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Server.DataLayer;
using Server.Extensions;

namespace Server.Services.Demons
{
    //https://habrahabr.ru/post/213809/
    //https://docs.microsoft.com/ru-ru/dotnet/csharp/programming-guide/events/how-to-implement-interface-events
    public enum TimerType {
        UserTask = 1
    }

    public enum TimerAdvancedDataKeys {
        TaskId = 1,
        SourceUserId = 2,
        TargetPlanetId = 3
    }

    public class TimerExecutorItem : IDisposableData {
        public readonly TimerType TimerType;
        private bool _created = false;

        private bool _disposed = false;

        private bool _inProgress = false;
        public Dictionary<TimerAdvancedDataKeys, object> AdvancedData = new Dictionary<TimerAdvancedDataKeys, object>();
        public Dictionary<int, Func<object, Dictionary<TimerAdvancedDataKeys, object>, object>> AfterSaveHandlers;
        public Dictionary<int, Func<object, object>> BeforeSaveHandlers;
        public Action Finalize;
        public Func<object> GetData;
        public bool IsSingleActionTimer;
        public Func<object, object> SaveData;
        public Action SingleAction;
        public bool Started;


        public Timer Timer;

        public TimerExecutorItem(TimerType type) {
            TimerType = type;
        }

        public string Id { get; } = Guid.NewGuid().ToString();
        private bool Created => _created;
        public bool InProgress => _inProgress;
        public bool _isValidBase => !Created && !_disposed && Timer != null;
        public bool IsValidNonFinalize => _isValidBase && Finalize == null;
        public bool IsValidComplex => _isValidBase && Finalize != null && GetData != null && SaveData != null;
        public bool IsValidSimple => _isSingleActionTimer && IsSingleActionTimer && _isValidBase && Finalize != null;

        private bool _isSingleActionTimer => SingleAction != null && Finalize != null && SaveData == null &&
                                             AfterSaveHandlers == null && GetData == null;

        public bool IsDisposed => _disposed;

        public int GetNextBeforeSaveId() {
            if (BeforeSaveHandlers == null) {
                BeforeSaveHandlers = new Dictionary<int, Func<object, object>>();
                return 1;
            }
            return BeforeSaveHandlers.Keys.Max(i => i) + 1;
        }

        public int GetNextAfterSaveId() {
            if (AfterSaveHandlers == null) {
                AfterSaveHandlers =
                    new Dictionary<int, Func<object, Dictionary<TimerAdvancedDataKeys, object>, object>>();
                return 1;
            }
            return AfterSaveHandlers.Keys.Max(i => i) + 1;
        }

        public bool Create() {
            var valid = IsSingleActionTimer ? IsValidSimple : IsValidComplex;
            if (valid) {
                _created = true;
                Timer.AutoReset = false;
                Timer.Elapsed += (sender, args) => {
                    _inProgress = true;

                    var t = 0;
                    if (IsSingleActionTimer) {
                        t = 1;
                    }
                    else if (IsValidComplex) { 
                        t = 2;
                    }

                    switch (t) {
                        case 0:
                            Finalize();
                            _inProgress = false;
                            break;
                        case 1:
                            try {
                                SingleAction();
                                goto case 0;
                            }
                            catch (Exception e) {
                                Console.WriteLine(e);
                                goto case 0;
                            }

                        case 2:
                            try {
                                var data = GetData();
                                if (data == null) {
                                    goto case 0;
                                }

                                if (BeforeSaveHandlers != null && BeforeSaveHandlers.Any()) {
                                    var bHandlers = BeforeSaveHandlers.OrderBy(i => i.Key).ToList();
                                    foreach (var handle in bHandlers) {
                                        data = handle.Value(data);
                                    }
                                }
                                if (data != null) {
                                    data = SaveData(data);
                                }

                                if (AfterSaveHandlers != null && AfterSaveHandlers.Any()) {
                                    var aHandlers = AfterSaveHandlers.OrderBy(i => i.Key).ToList();
                                    foreach (var handle in aHandlers) {
                                        handle.Value(data, AdvancedData);
                                    }
                                }
                                goto case 0;
                            }
                            catch (Exception e) {
                                Console.WriteLine(e);
                                goto case 0;
                            }


                        default: goto case 0;
                    }
                };
                
            }
            return valid;
        }

        public bool CreateAndStart() {
            var valid = Create();
            if (valid) {
                Timer.Start();
                Started = true;

            }
            return valid;
        }
 
        protected void Dispose(bool disposing) {
            if (_disposed || !disposing) {
                return;
            }
            _disposed = true;
            AdvancedData.Clear();
            AdvancedData = null;
            _inProgress = false;
            if (Timer != null) {
                Timer.Stop();
                Timer.Close();
                Timer.Dispose();
            }

            Timer = null;
            SingleAction = null;
            GetData = null;
            SaveData = null;
            Finalize = null;

            if (BeforeSaveHandlers != null) {
                BeforeSaveHandlers.Clear();
                BeforeSaveHandlers = null;
            }
            if (AfterSaveHandlers == null) {
                return;
            }
            AfterSaveHandlers.Clear();
            AfterSaveHandlers = null;
        }

        public void Dispose() {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }

    public static partial class TimerExecutor {
        private static readonly ConcurrentDictionary<string, TimerExecutorItem> _timers =new ConcurrentDictionary<string, TimerExecutorItem>();

        private static IGameRunner _gameRunner;

        public static IApplicationBuilder AddTimerExecutor(this IApplicationBuilder builder, IServiceProvider svp)
        {
            if (_gameRunner== null)
            {
                _svp = svp;
                _gameRunner = _svp.GetService<IGameRunner>();
            }
            return builder;


        }

        private static IServiceProvider _svp { get;   set; }

        public static TimerExecutorItem Get(string key) {
            TimerExecutorItem val;
            _timers.TryGetValue(key, out val);
            return val;
        }


        public static bool Delete(string key) {
            return _timers.TryRemoveSimple(key);
        }

        public static TimerExecutorItem AddOrUpdate(TimerExecutorItem item) {
            return _timers.AddOrUpdateSimple(item.Id, item);
        }

        public static T GetService<T>() {
            return _svp.GetService<T>();
        }

        public static void DestoyAndDelete(TimerExecutorItem item) {
            if (item != null) {
                if (!string.IsNullOrWhiteSpace(item.Id) && _timers.Select(i => i.Key).Contains(item.Id)) {
                    Delete(item.Id);
                }
                item.Dispose();
            }
        }


        public static bool SetFinalizeAndStart(TimerExecutorItem timerItem) {
            if (!timerItem.IsValidNonFinalize) {
                return false;
            }
            timerItem.Finalize = () => { DestoyAndDelete(timerItem); };

            return timerItem.CreateAndStart();
        }

        private static IEnumerable<KeyValuePair<string, TimerExecutorItem>> _where(
            this ConcurrentDictionary<string, TimerExecutorItem> store, Func<TimerExecutorItem, bool> predicateWhere) {
            return store?.Where(i => predicateWhere(i.Value));
        }

        private static IEnumerable<KeyValuePair<string, TimerExecutorItem>> _getByTymerType(
            this ConcurrentDictionary<string, TimerExecutorItem> store, TimerType timerType,
            Func<TimerExecutorItem, bool> predicateWhere) {
            return store?._where(i => i.TimerType == timerType && predicateWhere(i));
        }

        private static bool _isEqualsKV<T>(TimerExecutorItem item, TimerAdvancedDataKeys keyType, T keyValue) {
            return item.AdvancedData.ContainsKey(keyType) && Equals(item.AdvancedData[keyType], keyValue);
        }

        private static bool _isEqualsKV(TimerExecutorItem item, TimerAdvancedDataKeys keyType, int keyValue) {
            return _isEqualsKV<int>(item, keyType, keyValue);
        }

        private static IEnumerable<KeyValuePair<string, TimerExecutorItem>> _getByAdvancedIntDataKey(
            this ConcurrentDictionary<string, TimerExecutorItem> store,
            TimerType timerType, TimerAdvancedDataKeys keyType, int dataKeyValue,
            Func<TimerExecutorItem, bool> predicateWhere = null) {
            if (dataKeyValue == 0) {
                return default(IEnumerable<KeyValuePair<string, TimerExecutorItem>>);
            }
            if (predicateWhere == null) {
                return store._getByTymerType(timerType,
                    i => _isEqualsKV(i, keyType, dataKeyValue));
            }
            return store._getByTymerType(timerType,
                i => _isEqualsKV(i, keyType, dataKeyValue) && predicateWhere(i));
        }


        public static int GetCount() {
            if (_timers == null) {
                return 0;
            }
            return _timers.GetCount();
        }
    }
}