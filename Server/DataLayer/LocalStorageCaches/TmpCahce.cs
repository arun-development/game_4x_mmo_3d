using System.Collections.Concurrent;
using System.Linq;
using System.Timers;
using Server.Extensions;

namespace Server.DataLayer.LocalStorageCaches
{
    // кратко на тему различиях в таймерах таймеров
    //https://translate.googleusercontent.com/translate_c?act=url&depth=1&hl=ru&ie=UTF8&prev=_t&rurl=translate.google.es&sl=en&sp=nmt4&tl=ru&u=https://stackoverflow.com/questions/1416803/system-timers-timer-vs-system-threading-timer&usg=ALkJrhjhlgx-K-ek9XcALUG6fFN1ek0eQA
    public static class TmpCache
    {
        // ReSharper disable once InconsistentNaming
        private static readonly ConcurrentDictionary<string, object> _storage =
            new ConcurrentDictionary<string, object>();

        private static readonly ConcurrentDictionary<string, Timer> _timers = new ConcurrentDictionary<string, Timer>();


        public static object Get(string guid)
        {
            object val;
            _storage.TryGetValue(guid, out val);
            return val;
        }

        private static void _startCleanTimer(string guid, int maxTimeMsToRemove)
        {
            var timer = new Timer
            {
                Interval = maxTimeMsToRemove,
                AutoReset = false
            };
            timer.Elapsed += (sender, args) => { Remove(guid); };
            timer.Start();
            _timers.AddOrUpdateSimple(guid, timer);
        }

        public static object AddOrUpdate(string guid, object data, int maxTimeSecToRemove)
        {
            var resultData = _storage.AddOrUpdateSimple(guid, data);
            if (resultData != default(object))
                _startCleanTimer(guid, maxTimeSecToRemove * 1000);
            return resultData;
        }

        public static T GetAndRemove<T>(string guid)
        {
            return (T) Remove(guid);
        }

        public static object Remove(string guid)
        {
            Timer timer;
            _timers.TryRemove(guid, out timer);
            timer?.Dispose();
            object val;
            _storage.TryRemove(guid, out val);
            return val;
        }

        public static void ClearStorage()
        {
            var keys = _storage.Select(i => i.Key).ToList();
            if (_storage == null || keys.Count == 0) return;
            foreach (var key in keys)
                Remove(key);
            _storage.Clear();
            _timers.Clear();
        }

        public static int GetCount()
        {
            return _storage.GetCount();
        }
    }
}