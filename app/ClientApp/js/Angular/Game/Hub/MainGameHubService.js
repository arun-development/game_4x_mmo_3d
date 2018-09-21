

 

Utils.CoreApp.gameApp.service("mainGameHubService",
    [
        "hubFactory", "allianceService", "profileService", "userChannelsService", "confederationService", "journalService", function (hubFactory,
            allianceService,
            profileService,
            userChannelsService,
            confederationService,
            journalService) {
            var connectionStates = {
                initial: 2,      // after connect -1 ;
                connecting: 0,
                connected: 1,
                disconnected: 2 // unf it is default value for new connection in prev. versions was initial
            };
            //const enum ConnectionState {
            //    Connecting,    //0
            //    Connected,     //1
            //    Disconnected,  //2
            //}

 

            // var connectionStates = $.signalR.connectionState;
            var showLog = true;

            function _log(key, val) {
                if (!showLog) return;
                if (!val) console.log(key);
                else console.log(key, val);
            }

            // #region Core
            // #region Declare
            var _hubItem = hubFactory("MainGameHub");
            var hub = _hubItem.hub;
            var hbConn = hub.connection;
    
 
            //enable logg hub events
            hbConn.logging = true;
            var mf = Utils.ModelFactory;
            var client = hub.client;
            var server = hub.server;
            var hubService = this;
            var countOnlineUsers = 0;
            // #endregion
            //#region  helpers
            hubService._currentUser = mf.ConnectionUser();
            hubService._checkCurrentUser = function () {
                if (!hubService.isValidUserData(hubService._currentUser)) throw new Error("gameNotLoad");
            }
            hubService.isValidUserData = function (user) {
                return user &&
                    user.hasOwnProperty("UserId") &&
                    user.UserId > 0 &&
                    user.hasOwnProperty("AllianceId") &&
                    user.AllianceId > 0;
            };
            hubService.isCurrentUser = function (userId) {
                return hubService._currentUser.UserId === userId;
            };
            hubService._removeHubGroupForCr = function (hubGroupName) {
                delete hubService._currentUser.Groups[hubGroupName];
            };
            hubService._addHubGroupForCr = function (ihubHroupItem) {
                if (!hubService._currentUser.Groups) hubService._currentUser.Groups = {};
                hubService._currentUser.Groups[ihubHroupItem.GroupeName] = ihubHroupItem;
            };
            //#endregion

            function ping() {
                var time = Date.now();
                var def = server.ping();
                def.then(function () {
                    console.log({ ping: Date.now() - time, connectionState: hbConn.connectionState });
                },
                    function (e) {
                        console.log({
                            e: e
                        });
                    });
                return def;
            }


            var pingDelay = 10000; //1000;// 40000;
            var pingTimeount;

            function connect() {
                hub.start().then(function(e) {
                        //  console.log("connect", { e: e });
                        hubService.onConnected(hbConn.connectionState === connectionStates.connected, function() {
                            if (pingTimeount) clearInterval(pingTimeount);
                            pingTimeount = setInterval(function () {
                                if (hbConn.connectionState === connectionStates.connected) ping();
                                else {
                                    clearInterval(pingTimeount);
                                    //todo  сделать диалог хелпер
                                    var msg ="Внимение!! соединение было потерянно, необходимо перезагрузиьт игру. Сделать это сейчас?";
                                    Utils.Console.Error(msg);
                                    var confirmed = confirm(msg);
                                    if (confirmed) location.reload();
                                }
                            }, pingDelay);
                        });
                        //   console.log("=================END connect.start ==================");
             
                    },
                    function(error) {
                        console.log({ error: error });
                        throw error;

                    });
            }
            //   console.log("===============START connect.start ==================");


            //{
            //    waitForPageLoad: false
            //}


            hubService.reconnect = function () {
                console.log("client reconnected");
            };

            hubService._updateCurrentUser = function (newConnectionUserData) {
                if (newConnectionUserData.UserId === hubService._currentUser.UserId) hubService._currentUser._updateData(newConnectionUserData);
            };
            var leftUsers = {};
            var baseDelay = 5000;
            leftUsers.IDelayUser = function (leftUser) {
                function DelayUser() {
                    var $this = this;
                    this.data = leftUser;
                    this.timer = setTimeout(function () {
                        countOnlineUsers--;
                        _hubItem.$$rootScope.$broadcast("user:left-game", $this.data);
                    },
                        baseDelay);
                }

                return new DelayUser();
            };
            leftUsers.add = function (leftUser) {
                
                leftUsers[leftUser.UserId] = leftUsers.IDelayUser(leftUser);
            };
            leftUsers.tryCancelTimer = function (newUserId) {
                if (leftUsers[newUserId]) {
                    clearTimeout(leftUsers[newUserId].timer);
                    delete leftUsers[newUserId];
                }
            };
            hubService.onConnected = function (success, $onDone) {
 
                if (success) {
                    server.init(LANG).then(function (ok) { $onDone()},
                        function (error) {
                            console.log("onConnected:init:error", { error: error });
                        });
                }
                else throw new Error("client.onConnected - error");
            };
            client.onUserInitialized = function (onlineCount, newUserId, allianceId, initializeData) {
                _log("========== START onUserInitialized ==========");
                countOnlineUsers = onlineCount;
                if (initializeData) {
                    hubService._currentUser._updateData(initializeData.ConnectionUser);
                    EM.GameLoader.Load(initializeData);
                    _log("client.onConnected",
                        {
                            onlineCount: countOnlineUsers,
                            initializeData: initializeData,
                            currentUser: hubService._currentUser
                        });
                }
                else {
                    leftUsers.tryCancelTimer(newUserId);
                    GameServices.allianceService.onOtherUserConnected(newUserId, allianceId);
                }
                _hubItem.$$rootScope.$broadcast("user:join-to-game",
                    {
                        CurrentConnectionUser: _.cloneDeep(hubService._currentUser),
                        ConnectedUserId: newUserId,
                        ConnectedAllianceId: allianceId,
                        OnlineTotalCount: onlineCount
                    });
                _log("========== END onUserInitialized ==========");
            };
            client.onReconnected = function (connectionId) {
                console.log("onReconnected connectionId:" + connectionId);
            };
            client.userLeftGame = function (connectionUser) {
                // _log("userLeftGame", connectionUser);
                console.log("userLeftGame", connectionUser);
                leftUsers.add(connectionUser);
            };
            /**
             * Обновляет данные текущего пользователя
             * @param {object} connectionUser  ConnectionUser Utils.ModelFactory.ConnectionUser
             * @returns {void} 
             */
            client.updateConnectionUser = function (connectionUser) {
                hubService._checkCurrentUser();
                hubService._updateCurrentUser(connectionUser);
            };
            //todo  сделать какое то оповищение или блокировку
            hubService.disconnect = client.disconnect = function (redirect) {
                hbConn.stop();
                //  alert("disconnect");
                if (redirect) {
                 Utils.RedirectToAction();
                }
            };
            hubService.notAutorized = client.notAutorized = function () {
                hbConn.stop();
                Utils.Console.Error("notAutorized");
                Utils.RedirectToAction("/Account/LogOff/");
            };
            hubService.getPing = function () {
                return ping();
            };
            client.test = function (data) { console.log(" client.test", { data: data, hub: hub }); };
            //#region loacal 
            /**
            * 
            * @returns {int} countOnlineUsers
            */
            Object.defineProperty(this,
                "onlineCount",
                {
                    get: function () {
                        return countOnlineUsers;
                    }
                });
            // #endregion
            // #endregion
            //неопределенные
            hubService.sercherGetUserNames = function (partUserName) {
                return server.sercherGetUserNames(partUserName);
            };
            // выделенные
            Utils.CoreApp.gameAppExtensions.HubAlliance(hubService,
                client,
                server,
                allianceService,
                _hubItem.$$rootScope);
            Utils.CoreApp.gameAppExtensions.HubWorld(hubService, client, server);
            Utils.CoreApp.gameAppExtensions.HubPersonalInfo(hubService,
                client,
                server,
                allianceService,
                profileService);
            Utils.CoreApp.gameAppExtensions.HubBookmark(hubService, client, server);
            Utils.CoreApp.gameAppExtensions.HubBuild(hubService, client, server);
            Utils.CoreApp.gameAppExtensions.HubEstate(hubService, client, server);
            Utils.CoreApp.gameAppExtensions.HubJournal(hubService, client, server, journalService);
            Utils.CoreApp.gameAppExtensions.HubUserChannels(hubService,
                client,
                server,
                userChannelsService,
                _hubItem.$$rootScope);
            Utils.CoreApp.gameAppExtensions.HubConfederation(hubService,
                client,
                server,
                confederationService,
                _hubItem.$$rootScope);


            _.forEach(client, function (value, key) {
                //console.log({ key: key, value: value });
                _hubItem.hub.on(key, value);
                //hub.server['TestService'] = function(clientMessage) {
                //     return hub.invoke.apply(hub, $.merge(['TestService'], $.makeArray(arguments)));
                //};

                //hub.on('TestSended', (i) => {
                //    nextIndicator(i);
                //    console.log('received message', { message: i });
                //});
            });

            console.log("hub", hub);
 
            $(window).on("beforeunload", function () {
                hubService.disconnect(false);
                return "";
            });



            // запуск приложения
            //  setInterval(function () { console.log({ 'hbConn.connectionState': hbConn.connectionState }) }, 100);
    
            console.log("hbConn.connectionState on run start", hbConn.connectionState);
            switch (hbConn.connectionState) {
                case connectionStates.initial:
                    _log("hbConn.state : connectionStates.initial");
                    connect();
                    connectionStates.initial = -1;
                    break;
                case connectionStates.connecting:
                    _log("hbConn.state : connectionStates.connecting");
                    break;
                case connectionStates.connected:
                    _log("hbConn.state :  connectionStates.connected");
                    break;
                case connectionStates.disconnected:
                    console.log("hbConn.state : connectionStates.disconnected", currentUser);
                    break;
                default:
                    throw new Error("hbConn.state:connectionStates not exist  - default");
            }

 
        }
    ]);
//_t.connection.start().then(function (e) { console.log({ r: r }) }, function (error) { console.log({ error: error }) });

 