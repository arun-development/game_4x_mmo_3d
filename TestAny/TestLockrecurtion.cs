using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Timers;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace TestAny
{

    [TestClass]
    public class TestLockrecurtion
    {


        [TestMethod]
        public void Test()
        {
            var counter = new List<string>();
            _recurtionMethod("baseThread", counter);
            foreach (var c in counter)
            {
                Console.WriteLine(c);
            }

        }

        [TestMethod]
        public void TestAsParalel()
        {
            var counter = new List<string>();

            Parallel.Invoke(() => _recurtionMethod("firstThread", counter),
                () => _recurtionMethod("secondThread", counter));


            foreach (var c in counter)
            {
                Console.WriteLine(c);
            }

        }

        [TestMethod]
        public void TestAsThread()
        {
            var counter = new List<string>();
            Task task1 = Task.Factory.StartNew(() => _recurtionMethod("task1", counter));
            Task task2 = Task.Factory.StartNew(() => _recurtionMethod("task2", counter));
            Task.WaitAll(task1, task2);

            foreach (var c in counter)
            {
                Console.WriteLine(c);
            }

        }

        [TestMethod]
        public void TestAsInterval()
        {
            var counter = new List<string>();
            var maxCount = 30;
            
            var count = new List<int>{0};
            var logged = false;

            void Act(System.Timers.Timer timer)
            {
                if (!logged)
                {

                    foreach (var c in counter)
                    {
                        Console.WriteLine(c);
                    }
                    logged = true;
                }
                timer.Stop();
                timer.Dispose();

            }

            var timer1 = _creteTimer(Act, "timer1",1, counter, count, maxCount);
            var timer2 = _creteTimer(Act, "timer2",2, counter, count, maxCount);
            var timer3 = _creteTimer(Act, "timer3",3, counter, count, maxCount);
            
            timer3.Start();
            timer2.Start();
            timer1.Start();

            Task.Delay(1000).GetAwaiter().GetResult();



        }

        private  System.Timers.Timer _creteTimer(Action<System.Timers.Timer> onTimerDone,string timerName,double interval, List<string>counterLog, List<int> count, int maxCount)
        {
            var timer = new System.Timers.Timer();
            timer.Interval = interval;
            timer.Elapsed += (e, t) =>
            {
                _recurtionMethod(timerName, counterLog);
                count[0]++;
                if (count[0] >= maxCount)
                {
                    onTimerDone((System.Timers.Timer)e);
                }
            };
            return timer;
        }


        private static readonly object locker = new object();

        private void _recurtionMethod(string threadName, List<string> counter, int errorCount = 0)
        {

            if (errorCount > 5)
            {
                return;
            }
            lock (locker)
            {
                counter.Add($"start  errorCount:{errorCount} ,threadName :{threadName}");
                errorCount++;
                _recurtionMethod(threadName, counter, errorCount);


            }

        }
    }
}
