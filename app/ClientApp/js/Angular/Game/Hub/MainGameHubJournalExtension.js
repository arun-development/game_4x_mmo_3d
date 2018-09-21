Utils.CoreApp.gameAppExtensions.HubJournal = function (hubService, client, server, $journalService, $$RootScope) {
    // #region Initial

   /**
    * работает только для текущего пользователя
    * Создает для текущего юзера модель планшета 
    * @returns  {object}  signalR deffered =>   IPlanshetViewData (Journal planshet model)
    */
    hubService.journalInitialPlanshet = function () {
        return server.journalInitialPlanshet();
    };
    // #endregion

 
    // #region Task  
    /**
     * работает только для текущего пользователя
     * создает и активирует новую задачу для пользователя (атака или трансфер) 
     * @param {object} taskFleetInputDataModel   see server TaskFleet
     * @returns  {object}  signalR deffered =>   object see server  newTaskId
     */
    hubService.journalCreateTaskItem = function (taskFleetInputDataModel) {
        return server.journalCreateTaskItem(taskFleetInputDataModel);
    };
           
    client.journalOnTaskCreated = function (newTaskItem) {
        console.log("journalOnTaskCreated", { newTaskItem: newTaskItem });
        try {
            hubService._checkCurrentUser();
            $journalService.onTaskCreated(newTaskItem);
        }
        catch (e) {
            console.log({e:e});
            return;
        }  
    };
    client.journalOnTaskFinished = function(notyfyData) {
        console.log("journalOnTaskFinished", {notyfyData:notyfyData});
        try {
            hubService._checkCurrentUser();
            $journalService.onTaskFinished(notyfyData);
        }
        catch(e) {
            console.log({e:e});
            return;
        }

    };


 
    /**
     * работает только для текущего пользователя
     * считает время выполнения задачи  исходя из занданных параметров  и записывает данные во временное хранилище возвращая  гуид для дальнейшего использования
     * @param {int} estateId 
     * @param {string} planetName 
     * @param {int} startSystemId 
     * @returns  {object}  signalR deffered => object => MapDistance модель координат с посчитанным временем  
     */
    hubService.journalGetTaskTime = function (estateId, planetName, startSystemId) {
        return server.journalGetTaskTime(estateId, planetName, startSystemId);
    };

 
    /**
     * работает только для текущего пользователя
     * проверяет завершилась ли задача если нет возвращает модель  с временем до завершения задачи
     * @param {int} taskId 
     * @returns  {object}  signalR deffered =>  object see server TaskFleet   данные для окончания или продолжения задачи
     */
    hubService.journalTaskTimeIsOver = function (taskId) {
        return server.journalTaskTimeIsOver(taskId);
    };


    // #endregion

    //todo not impl!
    // #region Report

 
    /**
     * работает только для текущего пользователя
     * получает эллемент коллекции вкладки репорт
     * @param {int} taskId 
     * @returns  {object}  signalR deffered =>  object see server TabReportOut 
     */
    hubService.journalGetReportItemByTaskId = function (taskId) {
        return server.journalGetReportItemByTaskId(taskId);
    };

    //todo отключен
    /**  
     * @param {string} id 
     * @returns  {object}  signalR deffered =>     object see server TabReportOut 
     */
    hubService.journalCreateReportItem = function (id) {
        return server.journalCreateReportItem(id);
    };

    //todo на клиенте не все впорядке при пересчете макс имемов
    /**
     * работает только для текущего пользователя
     *  получает коллекцию репортов для вкладки репортов для скроллинга с отсчетом от последего репорт ид, если эллементов нет возвращает пустую коллекцию
     * @param {int} lastReportId 
     * @returns  {object}  signalR deffered => Array see server IList<TabReportOut>  
     */
    hubService.journalGetReportItems = function (lastReportId) {
        return server.journalGetReportItems(lastReportId);
    };

    /**
     * работает только для текущего пользователя
     *  удаляет репорт если все ок возвращает тру иначе фальс 
     * @param {int} reportId 
     * @returns  {object}  signalR deffered =>   bool
     */
    hubService.journalDeleteReportItem = function (reportId) {
        return server.journalDeleteReportItem(reportId);
    };


    // #endregion

 
    // #region Spy
 
    /**
     * работает только для текущего пользователя
     * получает коллекцию эллементов вкладки спай для скролинга с отсчетом от последнего спай ид, если  эллементов больше нет возвращает пустую коллекцию 
     * @param {int} lastSpyId 
     * @returns  {object}  signalR deffered => Array see IList<TabSpyOut>
     */
    hubService.journalGetSpyItems = function (lastSpyId) {
        return server.journalGetSpyItems(lastSpyId);
    };


 
    /**
     * работает только для текущего пользователя
     * создает отчет шпионажа для переданной планеты  по переданному ид планеты 
     *  если совпадение найденно оно уникально и планета не пренаджлежит пользователю создает отчет 
     * @param {int} planetId 
     * @returns  {object}  signalR deffered =>  object see server TabSpyOut
     */
    hubService.journalCreateSpyItemByPlanetId = function (planetId) {
        return server.journalCreateSpyItemByPlanetId(planetId);
    };
 

    /**
     * работает только для текущего пользователя
     * создает отчет шпионажа для переданной планеты  по переданному имени планеты
     * ищет в локальном хранилище связку ид и нейм планеты если совпадение найденно оно уникально и планета не пренаджлежит пользователю создает отчет 
     * @param {string} planetName 
     * @returns  {object}  signalR deffered =>    object see server TabSpyOut
     */
    hubService.journalCreateSpyItemByPlanetName = function (planetName) {
        return server.journalCreateSpyItemByPlanetName(planetName);
    };

 

    /**
     * работает только для текущего пользователя 
     * @param {int} spyId 
     * @returns  {object}  signalR deffered =>     bool
     */
    hubService.journalDeleteSpyItem = function (spyId) {
        return server.journalDeleteSpyItem(spyId);
    };


    // #endregion

    //todo not impl!
    // #region MotherJump

 
    /**
     * работает только для текущего пользователя 
     * @param {int} sourceSystemId 
     * @param {int} targetSystemId 
     * @returns  {object}  signalR deffered =>  object see sever MapDistance
     */
    hubService.journalGetMotherJumpTime = function (sourceSystemId, targetSystemId) {
        return server.journalGetMotherJumpTime(sourceSystemId, targetSystemId);
    };

 
    /**
     * работает только для текущего пользователя
     * @param {string} guid 
     * @returns  {object}  signalR deffered =>  objecct see sever IMotherJumpOut
     */
    hubService.journalAddTaskMotherJump = function (guid) {
        return server.journalAddTaskMotherJump(guid);
    };
 
    /**
     * работает только для текущего пользователя 
     * @param {int} jumpId 
     * @returns  {object}  signalR deffered => bool 
     */
    hubService.journalCancelMotherJump = function (jumpId) {
        return server.journalCancelMotherJump(jumpId);
    };

 
    /**
     * работает только для текущего пользователя 
     * @param {int} jumpId 
     * @returns  {object}  signalR deffered =>    object see EstateAdress
     */
    hubService.journalInstMotherJump = function (jumpId) {
        return server.journalInstMotherJump(jumpId);
    };

 
    /**
     * работает только для текущего пользователя 
     * @returns  {object}  signalR deffered =>  int - timeToDone or  EstateAdress of time not done
     */
    hubService.journalIsMotherJumpTimeDone = function () {
        return server.journalIsMotherJumpTimeDone();
    };
 
    hubService.journalRemoveGuid = function (guidLong) {
        return server.journalRemoveGuid(guidLong);
    }

    // #endregion

                                                                                         
}