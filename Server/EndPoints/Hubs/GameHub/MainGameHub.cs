using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR; 
using Microsoft.Extensions.DependencyInjection;
using Server.Core.HubUserModels;
using Server.Core.Interfaces;
using Server.Core.Interfaces.Confederation;
using Server.Core.Interfaces.UserServices;
using Server.Core.Interfaces.World;
using Server.Core.СompexPrimitive;
using Server.DataLayer;
using Server.DataLayer.LocalStorageCaches;
using Server.Modules.Localize;
using Server.Services;
using Server.Services.AdvancedService;
using Server.Services.GameObjects.BuildModel.BuildItem;
using Server.Services.GameObjects.BuildModel.CollectionBuild;
using Server.Services.GameObjects.UnitClasses;
using Server.Services.UserService;
using Server.ServicesConnected.Auth.Static;

namespace Server.EndPoints.Hubs.GameHub
{
    //  почитать https://habrahabr.ru/company/dnevnik_ru/blog/167307/
    // обзор нового хаба https://habrahabr.ru/post/338490/
    //[HubName("MainGameHub")]
    [Authorize(Roles = MainRoles.User)]
    public partial class MainGameHub : Hub
    {
        #region Declare

        #region Main

        private readonly IServiceProvider _svp;
        private readonly IMainGameHubLocalStorageCache _hubCache;

        #endregion

        #region Main User

        private readonly IGameUserService _gameUserService;
        private readonly IAllianceService _allianceService;
        private readonly ChannelService _channelService;
        private readonly IMothershipService _mothershipService;
        private readonly IUMotherJumpService _motherJumpService;
        private readonly IStoreService _storeService;

        #endregion

        #region World

        private readonly IGameTypeService _gameTypeService;
        private readonly IGGeometryPlanetService _gGeometryPlanetService;
        private readonly IGDetailPlanetService _gDetailPlanetService;
        private readonly IGSectorsService _gSectorsService;
        private readonly IMapInfoService _mapInfoService;
        private readonly ISystemService _systemService;
        private readonly IWorldService _worldService;
        private readonly GUserBookmarkService _gUserBookmarkService;

        #endregion

        #region builds

        //collections

        private readonly ICommandCenter _commandCenter;
        private readonly IIndustrialComplex _industrialComplex;
        private readonly ILaboratory _laboratory;
        private readonly IShipyard _shipyard;

        //items
        private readonly IEnergyConverter _energyConverter;

        private readonly IExtractionModule _extractionModule;
        private readonly ISpaceShipyard _spaceShipyard;
        private readonly IStorage _storage;
        private readonly ITurels _turels;
        private readonly IUnit _unit;


        //common

        private readonly IStorageResourcesService _storageResources;
        private readonly ITransferResourceService _transferResourceService;

        #endregion


        #region Global User

        private readonly IEstateOwnService _estateOwnService;
        private readonly ISynchronizer _synchronizer;
        private readonly IEstateListService _estateListService;
        private readonly IJournalOutService _journalOutService;
        private readonly IGameRunner _gameRunner;
        private readonly IDbProvider _dbProvider;

        #endregion


        #region Confederation

        private readonly IConfederationService _confederationService;

        #endregion

        public MainGameHub(IServiceProvider svp)
        {
            #region Main

            _svp = svp;
            _hubCache = _svp.GetService<IMainGameHubLocalStorageCache>();

            #endregion

            #region Main User

            _gameUserService = _svp.GetService<IGameUserService>();
            _allianceService = _svp.GetService<IAllianceService>();
            _channelService = (ChannelService)_svp.GetService<IChannelService>();

            _mothershipService = _svp.GetService<IMothershipService>();
            _motherJumpService = _svp.GetService<IUMotherJumpService>();
            _storeService = _svp.GetService<IStoreService>();

            #endregion

            #region World

            _gameTypeService = _svp.GetService<IGameTypeService>();
            _gGeometryPlanetService = _svp.GetService<IGGeometryPlanetService>();
            _gDetailPlanetService = _svp.GetService<IGDetailPlanetService>();
            _gSectorsService = _svp.GetService<IGSectorsService>();
            _mapInfoService = _svp.GetService<IMapInfoService>();
            _systemService = _svp.GetService<ISystemService>();
            _worldService = _svp.GetService<IWorldService>();
            _gUserBookmarkService = (GUserBookmarkService)_svp.GetService<IGUserBookmarkService>();

            #endregion

            #region builds

            //collections
            _commandCenter = _svp.GetService<ICommandCenter>();
            _industrialComplex = _svp.GetService<IIndustrialComplex>();
            _laboratory = _svp.GetService<ILaboratory>();
            _shipyard = _svp.GetService<IShipyard>();


            //items
            _energyConverter = _svp.GetService<IEnergyConverter>();
            _extractionModule = _svp.GetService<IExtractionModule>();
            _extractionModule = _svp.GetService<IExtractionModule>();
            _spaceShipyard = _svp.GetService<ISpaceShipyard>();
            _storage = _svp.GetService<IStorage>();
            _turels = _svp.GetService<ITurels>();

            //common
            _unit = _svp.GetService<IUnit>();
            _storageResources = _svp.GetService<IStorageResourcesService>();
            _transferResourceService = _svp.GetService<ITransferResourceService>();

            #endregion

            #region Global User

            _estateOwnService = _svp.GetService<IEstateOwnService>();
            _synchronizer = _svp.GetService<ISynchronizer>();
            _estateListService = _svp.GetService<IEstateListService>();
            _journalOutService = _svp.GetService<IJournalOutService>();
            _gameRunner = _svp.GetService<IGameRunner>();
            _dbProvider = _svp.GetService<IDbProvider>();

            #endregion

            #region Confederation

            _confederationService = _svp.GetService<IConfederationService>();

            #endregion
        }

        #endregion


        public override async Task OnConnectedAsync() {
            var qwe = 0;
          await  base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var cid = Context.ConnectionId;
            var user = _getLocalUser(cid);
            if (user == null)
            {
                await base.OnDisconnectedAsync(exception);
                return;
            }
            await _dbProvider.ContextActionAsync(async c =>
             {
                 var userId = user.UserId;
                 var userList = _getLocalUserList(c, userId);
                 if (userList == null || userList.Count == 0)
                 {
                     throw new NullReferenceException(nameof(userList));
                 }


                 if (userList.Count == 1 && cid == userList[0].ConnectionId)
                 {
                     await _cleanDisconnectedUserData(userList[0], exception);
                     _gameUserService.UpdateUserOnlineStatus(c, userId, false);
                     return true;
                 }
                 var orderedUserList = userList.OrderBy(i => i.DateJoin).ToList();
                 var last = orderedUserList.Last();
                 if (last.Connected && last.ConnectionId != cid)
                 {
                     foreach (var u in orderedUserList.Take(orderedUserList.Count - 1))
                     {
                         await _cleanDisconnectedUserData(u, exception);
                     }
                     _gameUserService.UpdateUserOnlineStatus(c, userId, false);
                     return true;
                 }
                 foreach (var u in orderedUserList)
                 {
                     await _cleanDisconnectedUserData(u, exception);
                 }
                 _gameUserService.UpdateUserOnlineStatus(c, userId, false);
                 return true;
             });

        }


        public async Task    OnReconnected() {
            
            throw new NotImplementedException();
        }

        public async Task Init(LangKeys langKey)
        {

            try
            {
                await _dbProvider.ContextActionAsync(async c =>
                 {
                     var cid = Context.ConnectionId;
                     var data = await _initUserAsync(c, cid, langKey);
                     var cu = (ConnectionUser)data[ConnectionUser.ViewKey];
                     _gameRunner.OnConnected(cid, cu.UserId);
                     data.Add("serverTime", UnixTime.UtcNowMs());


                     await Clients.Caller.InvokeAsync("onUserInitialized", _gameRunner.OnlineUserCount, cu.UserId, cu.AllianceId, data);
                     
                    await Clients.Others.InvokeAsync("onUserInitialized", _gameRunner.OnlineUserCount, cu.UserId,
                         cu.AllianceId);
                     return true;
                 });

            }
            catch (Exception e)
            {
                await Clients.Caller.InvokeAsync("disconnect", true);
                throw new HubException(e.Message, e);
            }
        }


        private async Task _cleanDisconnectedUserData(ConnectionUser disconnectedUser, Exception exception)
        {
            _gameRunner.OnDisonnected(disconnectedUser.ConnectionId, disconnectedUser.UserId);
            disconnectedUser.Connected = false;
            await disconnectedUser.RemoveUserFromAllHubGroups(Groups);

            await Clients.Others.InvokeAsync("userLeftGame", disconnectedUser);
            _removeUserFromStorage(disconnectedUser.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        public bool Ping() => true;





        // open url =>>  connect (new connection key) =>> check connection is unic =>> 
        // advanced logic


        // 
        // new page: connect => (new connection key) (1 user has two key)=> game logic error
        // close page:   disconnect
        // reload page: disconnect =>> (timeout not end) reconnect =>> connect (new connection key)
        // open url =>>  connect => (new connection key)
        //Basic logic:


        //steps
        //   await base.OnDisconnected(true);

        // Clients.All.onDisconnected(cid);
        //      unic:init() => create connection user, update onlline status(true) in db, add userTo groups, get Data. client.onConnected(Data). End;
        //      notUnic: 
        //              server: removeUserFromCache,remove user From groups=> client Event =>  (see client) connection.stop() 
        //                                            => (async) create connection user, add user to groups getuserData.  client.onConnected(Data). End;
        //              client: set callback user offline, Redirect to home page => (Event Redirect)=> server.disconnect();
        //              server disconnect: check exist ConnectionUser object => 
        //                                 not exist: base.disconnect() End.        
        //                                 exist: isCurrentConnection?
        //                                        isCurrent:IsUnic?
        //                                                  unic:removeFromCache,remove fromGroups, send client userLeftGame(disconnectedUser)   
        //                                                           update onlline status in db(false) base.Disconnect End.
        //                                                  notUnic: hasOnline?  
        //                                                           hasOnline:find last online connection, other => close=> removeFromCache,remove fromGroups,
        //                                                                     send client userLeftGame(disconnectedUser)  base.Disconnect End.
        //                                                           notHasOnline:close=> removeFromCache,remove fromGroups,
        //                                                                        send client userLeftGame(disconnectedUser)  base.Disconnect update onlline status in db(false) End.
        //                                        isOther:Has
    }
}