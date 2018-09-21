(function (Time) {
 
    // #region Constants

    /**
    * @returns {int}1d  Milisecond 86400000ms
    */
    Time.ONE_DAY = 86400000;

    /**
    * @returns {int} 1d Second  86400s
    */
    Time.ONE_DAY_SECOND = 86400;

    /**
    * @returns {int} 1h Milisecond  3600000ms
    */
    Time.ONE_HOUR = 3600000;

    /**
    * @returns {int}1h Second  3600s
    */
    Time.ONE_HOUR_SECOND = 3600;

    /**
    * @returns {int}  1m in Milisecond 60000ms
    */
    Time.ONE_MINUTE = 60000;
    /**
    * @returns {int} Second  60s
    */
    Time.ONE_MINUTE_SECOND = 60;

    /**
    * @returns {int}  1000ms
    */
    Time.ONE_SECOND = 1000;

    /**
    * @returns {int} 20s Second  20000 ms 
    */
    Time.TIME_CACHE_BUILD = Time.ONE_SECOND * 20;

    /**
    * @returns {int} 1min Milisecond 60000ms
    */
    Time.TIME_CACHE_PLANSHET = Time.ONE_MINUTE;

    /**
     * @returns {int} ms
     */
    Time.TIME_CACHE_PROFILE = Time.ONE_HOUR * 8;

    /*
     * @returns {int} ms      10 min
     */
    Time.TIME_CACHE_MAP_INFO = Time.ONE_MINUTE * 10;

    /*
   * @returns {int} 10 min   in ms
   */
    Time.TIME_CACHE_BOOKMARKS = Time.ONE_MINUTE * 10;

    /**
    * @returns {int} 10Min Milisecond 
    */
    Time.DELAY_SYNCHRONIZE = Time.ONE_MINUTE * 10; //ms

    Time.LOCAL_SERVER_DELTA_TIME = 0;

    /**
     * @returns {int} ms
     */
    Time.TIME_CACHE_ALLIANCE = Time.ONE_DAY * 30;

    /**
    * @returns {int} ms
    */
    Time.TIME_CACHE_USER_CHANNELS = Time.ONE_DAY * 30;

    /**
    * @returns {int} 10min is ms
    */
    Time.TIME_CACHE_JOURNAL = Time.ONE_DAY * 30;

    /**
   * @returns {int} ms
   */
    Time.TIME_CACHE_CONFEDERATION = Time.ONE_DAY * 30;


    /**
    * @returns {int} 200 ms 
    */
    Time.DROP_ELEMENT_ANIMATION = 200;

    // #endregion
 
    // #region Members

    Time.GetUtcDateTimeFromMsUtc = function (utcMsSecond) {
        var offset = Time.GetTimeZone();
        var dateTime = new Date(utcMsSecond);
        dateTime.setHours(dateTime.getHours() - offset);
        return dateTime;
    };
    Time.GetUtcDateTimeFromSecondUtc = function (utcSecond) {
        return Time.GetUtcDateTimeFromMsUtc(utcSecond * 1000);
    };

    /**
   * Возвращает разницу между UTC-временем и местным временем, в часах
   * @returns {int} hour
   */
    Time.GetTimeZone = function () {
        var timeZoneInMimutes = new Date().getTimezoneOffset();
        return -1 * timeZoneInMimutes / 60;
    };
    /**
    * Преобразует UTC  дату(Тип даты который приходит с сервера) В дату на клиенте с учетом часового пояса (смещения времени относительно utc)
     * @param {date}   Принимает Данные в формате DateTime
    * @returns {date} DateTime Дату на в соответствии с временем на клиенте
    */
    Time.DateUTCToLocalDate = function (dateUtc) {
        return dateUtc.setHours(dateUtc.getHours() + Time.GetTimeZone());
    };
    /**
     * Вычисляет разницу между переданными параметрами текущей даты и конечной даты, для типизированного формата дат (к клиенскому или UTC  формату)
     * @param {date} dateStart 
     * @param {date} dateEnd 
     * @returns {string} html tag Данные в часах или днях в зависимости от разницы между мереданными датами 
     */
    Time.CalculateDateByDifferent = function (dateEnd) {
        var currClientDate = new Date();
        var dateDifferent = dateEnd - currClientDate;

        var result = "";

        if (Time.ONE_DAY < dateDifferent) {
            result = Math.floor(dateDifferent / Time.ONE_DAY) + "d";

        }
        else {
            result = "<span class=\"red\"> " + Math.floor(dateDifferent / Time.ONE_HOUR) + "h </span>";
        }

        return result;
    };

    /**
     * 
     * @param {int} secondsIn timestamp second if null default timestamp utcNow in second
     * @returns {string} date   разделенная  сепаратором":"
     */
    Time.Seconds2Time = function (secondsIn, separator) {
        if (!separator) separator = ":";
        if (secondsIn <= 0) {
            return "00" + separator + "00" + separator + "00";
        }
        if (!secondsIn) secondsIn = Time.GetUtcNow();
        var component = [];
        var residual = 0;


        var d = Math.floor(secondsIn / Time.ONE_DAY_SECOND);
        if (0 !== d) component.push(d + "d");
        residual = secondsIn % Time.ONE_DAY_SECOND;

        var h = Math.floor(residual / Time.ONE_HOUR_SECOND);
        if (h < 10) h = "0" + h;
        component.push(h + "h");
        residual = residual % Time.ONE_HOUR_SECOND;

        var m = Math.floor(residual / Time.ONE_MINUTE_SECOND);
        if (m < 10) m = "0" + m;
        component.push(m);
        residual = residual % Time.ONE_MINUTE_SECOND;

        var s = residual;
        if (s < 10) s = "0" + s;
        if (0 === d) component.push(s);
        return component.join(separator);
    };
    Time.GetUtcNow = function (isMilisecond) {
        var d = new Date();
        var ms = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() - Time.GetTimeZone(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()) + Time.LOCAL_SERVER_DELTA_TIME;
        if (isMilisecond) return ms;
        return Math.floor(ms / 1000);
    };

    // #endregion 
})(Utils.Time = {});