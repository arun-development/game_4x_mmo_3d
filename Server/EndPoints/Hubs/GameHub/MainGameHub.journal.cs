using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Server.Core.Infrastructure.Unit;
using Server.Core.Interfaces.ForModel;
using Server.Core.Map;
using Server.DataLayer.LocalStorageCaches;
using Server.Services.OutModel.JournalOut;
using Server.Utils.Map;

namespace Server.EndPoints.Hubs.GameHub
{
    public partial class MainGameHub
    {
        #region Initial

        /// <summary>
        ///     работает только для текущего пользователя
        ///     Создает для текущего юзера модель планшета
        /// </summary>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns>Journal planshet model</returns>
        public async Task<IPlanshetViewData> JournalInitialPlanshet()
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                return _journalOutService.InitialPlanshet(connection, cr.UserId, null);
            });
        }

        #endregion


        #region Task

        /// <summary>
        ///     работает только для текущего пользователя
        ///     создает и активирует новую задачу для пользователя (атака или трансфер)
        /// </summary>
        /// <param name="inputData"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns> new task ID</returns>
        public async Task<int> JournalCreateTaskItem(TaskFleet inputData)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                return _journalOutService.CreateTaskItem(connection, cr.UserId, cr.Name, inputData);
            });
        }

        /// <summary>
        ///     работает только для текущего пользователя
        ///     считает время выполнения задачи  исходя из занданных параметров  и записывает данные во временное хранилище
        ///     возвращая  гуид для дальнейшего использования
        /// </summary>
        /// <param name="estateId"></param>
        /// <param name="planetName"></param>
        /// <param name="startSystemId"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns>модель координат с посчитанным временем</returns>
        public async Task<MapDistance> JournalGetTaskTime(int estateId, string planetName, int startSystemId = 0)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                return _journalOutService.GetTaskTime(connection, cr.UserId, estateId, planetName, startSystemId);
            });
        }

        /// <summary>
        ///     работает только для текущего пользователя
        ///     проверяет завершилась ли задача если нет возвращает модель  с временем до завершения задачи
        /// </summary>
        /// <param name="taskId"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns>данные для окончания или продолжения задачи</returns>
        public async Task<TaskFleet> JournalTaskTimeIsOver(int taskId)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                return _journalOutService.TaskTimeIsOver(connection, cr.UserId, taskId);
            });
        }

        #endregion

        #region Report

        /// <summary>
        ///     работает только для текущего пользователя
        ///     получает эллемент коллекции вкладки репорт
        /// </summary>
        /// <param name="taskId"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<TabReportOut> JournalGetReportItemByTaskId(int taskId)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                return _journalOutService.GetReportItemByTaskId(connection, cr.UserId, taskId);
            });
        }


        /// <summary>
        ///     todo  не работает разобратсья что за метод
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<TabReportOut> JournalCreateReportItem(string id)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                return _journalOutService.CreateReportItem(connection, id);
            });
        }

        /// <summary>
        ///     работает только для текущего пользователя
        ///     получает коллекцию репортов для вкладки репортов для скроллинга с отсчетом от последего репорт ид, если эллементов
        ///     нет возвращает пустую коллекцию
        /// </summary>
        /// <param name="lastReportId"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<IList<TabReportOut>> JournalGetReportItems(int lastReportId)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                return _journalOutService.GetReportItems(connection, cr.UserId, lastReportId);
            });
        }

        /// <summary>
        ///     удаляет репорт если все ок возвращает тру иначе фальс
        /// </summary>
        /// <param name="reportId"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<bool> JournalDeleteReportItem(int reportId)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                return _journalOutService.DeleteReportItem(connection, cr.UserId, reportId);
            });
        }

        #endregion

        #region Spy

        /// <summary>
        ///     работает только для текущего пользователя
        ///     получает коллекцию эллементов вкладки спай для скролинга с отсчетом от последнего спай ид, если  эллементов больше
        ///     нет возвращает пустую коллекцию
        /// </summary>
        /// <param name="lastSpyId"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<IList<TabSpyOut>> JournalGetSpyItems(int lastSpyId)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                return _journalOutService.GetSpyItems(connection, cr.UserId, lastSpyId);
            });
        }


        /// <summary>
        ///     работает только для текущего пользователя
        ///     создает отчет шпионажа для переданной планеты  по переданному ид планеты если совпадение найденно
        ///     оно уникально и планета не пренаджлежит пользователю создает отчет
        /// </summary>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <exception cref="Exception">Error.TargetOwnerIsYou</exception>
        /// <exception cref="Exception">Error.PlanetNotExsist</exception>
        /// <param name="planetId"></param>
        /// <returns></returns>
        public async Task<TabSpyOut> JournalCreateSpyItemByPlanetId(int planetId)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                return _journalOutService.CreateSpyItem(connection, cr.UserId, planetId);
            });
        }

        /// <summary>
        ///     работает только для текущего пользователя
        ///     создает отчет шпионажа для переданной планеты  по переданному имени планеты
        ///     ищет в локальном хранилище связку ид и нейм планеты если совпадение найденно оно уникально и планета не
        ///     пренаджлежит пользователю создает отчет
        /// </summary>
        /// <param name="planetName"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <exception cref="Exception">Error.TargetOwnerIsYou</exception>
        /// <exception cref="Exception">Error.PlanetNotExsist</exception>
        /// <returns></returns>
        public async Task<TabSpyOut> JournalCreateSpyItemByPlanetName(string planetName)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                return _journalOutService.CreateSpyItem(connection, cr.UserId, planetName);
            });
        }

        /// <summary>
        ///     работает только для текущего пользователя
        /// </summary>
        /// <param name="spyId"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<bool> JournalDeleteSpyItem(int spyId)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                return _journalOutService.DeleteSpyItem(connection, cr.UserId, spyId);
            });
        }

        #endregion


        #region MotherJump

        /// <summary>
        ///     работает только для текущего пользователя
        /// </summary>
        /// <param name="sourceSystemId"></param>
        /// <param name="targetSystemId"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <exception cref="Exception">Error.JupmMotherIsCurrentSystem</exception>
        /// <exception cref="Exception">Error.JumpMotherInProgress</exception>
        /// <returns></returns>
        public async Task<MapDistance> JournalGetMotherJumpTime(int sourceSystemId, int targetSystemId)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                return _journalOutService.GetMotherJumpTime(connection, cr.UserId, sourceSystemId, targetSystemId);
            });
        }

        /// <summary>
        ///     работает только для текущего пользователя
        /// </summary>
        /// <param name="guid"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <exception cref="Exception">Error.NoData если не найден кешированный экземпляр задачи</exception>
        /// <exception cref="Exception">Error.JumpMotherInProgress</exception>
        /// <returns></returns>
        public async Task<IMotherJumpOut> JournalAddTaskMotherJump(string guid)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                return _journalOutService.AddTaskMotherJump(connection, cr.UserId, guid);
            });
        }

        /// <summary>
        /// </summary>
        /// <param name="jumpId"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<bool> JournalCancelMotherJump(int jumpId)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                return _journalOutService.CancelMotherJump(connection, cr.UserId, jumpId);
            });
        }

        /// <summary>
        ///     работает только для текущего пользователя
        /// </summary>
        /// <param name="jumpId"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<EstateAdress> JournalInstMotherJump(int jumpId)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                return _journalOutService.InstMotherJump(connection, cr.UserId, jumpId);
            });
        }

        /// <summary>
        ///     работает только для текущего пользователя
        /// </summary>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<object> JournalIsMotherJumpTimeDone()
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                return _journalOutService.IsMotherJumpTimeDone(connection, cr.UserId);
            });
        }

        // todo  нужен таймер отмены на серверу
        public async Task<bool> JournalRemoveGuid(string guid)
        {
            return await _makeAsync(() =>
            {
                TmpCache.Remove(guid);
                return true;
            });
        }

        #endregion
    }
}