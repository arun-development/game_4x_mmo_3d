using System;
using System.Threading.Tasks;
using System.Timers;
using Server.Core.СompexPrimitive;
using Server.DataLayer;

namespace Server.Services.Demons
{
    internal static class DemonRunner
    {
        private static Timer _timer;
        public static bool DemonsStarted => _timer != null;
        private const int _intervalSecond = UnixTime.OneMinuteInSecond*10;
        private const int _intervalMs = _intervalSecond * 1000;
        private static bool _inProgress = false;

        internal static void Start(Action action)
        {
            Stop();
            _timer = new Timer();
            _timer.AutoReset = true;
            _timer.Interval = _intervalMs;
            _timer.Elapsed += (s, d) =>
            {
                if (_inProgress)
                {
                    return;
                }
                Task.Factory.StartNew(() =>
                {
                    try
                    {
                        
                        _inProgress = true;
                        action();
                        _inProgress = false;
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e); 
                        Stop();
                        _inProgress = false;
                        return;
                    }
                });


            };
            _timer.Start();
        }

        internal static void Stop()
        {
            if (!DemonsStarted)
            {
                return;
            }
            _timer.Stop();
            _timer.Dispose();
            _timer = null;

        }


    }
}
