using System;
using System.Globalization;

namespace Server.Core.СompexPrimitive
{
    [System.Runtime.InteropServices.ComVisible(true)]
    public struct UnixTime
    {
        // help http://stackoverflow.com/questions/463642/what-is-the-best-way-to-convert-seconds-into-hourminutessecondsmilliseconds
        public static DateTime UnixStart = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
        public const int OneMinuteInSecond = 60;
        public const int OneHourInSecond = 3600;
        public const int OneDayInSecond = OneHourInSecond*24;
        // ReSharper disable once InconsistentNaming
        public  const string  Format_hh_mm_ss = @"hh\:mm\:ss";
        // ReSharper disable once InconsistentNaming
        public  const string  Format_dd_hh_mm = @"dd\:hh\:mm";
        public  const string ShortDatePattern = @"d.MM.yyyy";
 
        public const int OneWeekInSecond = OneDayInSecond*7;

      //   public static string FormatHHMMSS = @"hh\:mm\:ss\:fff";

        /// <summary>
        /// текщее время бтк в Секундах
        /// </summary>
        /// <returns>seconds time</returns>
        public static int UtcNow()
        {
            return (int) (DateTime.UtcNow - UnixStart).TotalSeconds;
        }


//        public static int ToTimestamp(DateTime dateTime)
        public static int ToTimestamp(DateTime dateTime)
        {
            return (int) Math.Floor((dateTime - UnixStart).TotalSeconds);
        }
        public static long UtcNowMs()
        {
            return (long) Math.Floor((DateTime.UtcNow - UnixStart).TotalMilliseconds);
        }

        public static DateTime ToDateTime(int timestamp)
        {
            return UnixStart.AddSeconds(timestamp);
        }

        public static string GetDateFromTimeStamp(int timestamp)
        {
           
            return ToDateTime(timestamp).ToString(ShortDatePattern);
        }

        public static string GetDateFromTimeStamp(DateTime dateTime)
        {
            return dateTime.ToString(ShortDatePattern);
        }

        public static string GetTimeFromTimeStamp(int timestamp)
        {
            return ToDateTime(timestamp).ToString(DateTimeFormatInfo.CurrentInfo.ShortTimePattern);
        }

        public static string GetTimeFromTimeStamp(DateTime dateTime)
        {
            return dateTime.ToString(DateTimeFormatInfo.CurrentInfo.ShortTimePattern);
        }


        public static int GetDayOfWeekFixed(DayOfWeek dayOfWeek)
        {
            var day = (int)dayOfWeek;
            return day == 0 ? 7 : day;
        }



        /// <summary>
        ///  возвращает абсолютное значение в соотв с форматом   прим: если total second больше OneDayInSecond и формат "hh:mm:ss" вернут 24+(рахница часов  в totalsecond большаяя суток):00:00
        /// </summary>
        /// <param name="totalsecond"></param>
        /// <param name="format"></param>
        /// <returns></returns>
        public static string ConvertSecondToFormat(int totalsecond, string format = Format_hh_mm_ss)
        {
            return TimeSpan.FromSeconds(totalsecond).ToString(format);
        }
    }
}