using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using Microsoft.Extensions.DependencyInjection;
using Server.Core.Infrastructure;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.Core.StaticData;
using Server.DataLayer;
using Server.DataLayer.LocalStorageCaches;
using Server.DataLayer.Repositories;
using Server.Extensions;
using Server.ServicesConnected.Auth.Models;

namespace Server.Services.UserService
{
    public partial class GameUserService : IGameUserService
    {
        #region Declare


        private readonly IUserAuthToGameCache _userAuthToGameIdCache;
        private readonly IUserLocalStorageCache _userCache;

        private readonly IAllianceService _allianceService;

        private readonly IUserRepository _userRepo;
        private readonly IUserNameSercherPkCache _userNameSercherPkCache;

        //private readonly IGDetailPlanetLocalStorageCache _planetDetailCache;
        private readonly IGDetailPlanetService _planetService;

        private readonly IServiceProvider _svp;

        public GameUserService(IUserRepository userRepo, IAllianceService allianceService, IUserLocalStorageCache userCache,
            IUserAuthToGameCache userAuthToGameIdCache, IUserNameSercherPkCache userNameSercherPkCache,
            IGDetailPlanetService planetService, IServiceProvider svp)
        {
            _userRepo = userRepo;
            _allianceService = allianceService;

            _userCache = userCache;
            _userAuthToGameIdCache = userAuthToGameIdCache;
            _userNameSercherPkCache = userNameSercherPkCache;
            _planetService = planetService;
            _svp = svp;
        }

        #endregion


        #region Core User IBaseService

        public UserDataModel AddOrUpdate(IDbConnection connection, UserDataModel dataModel)
        {
            var m  = _userRepo.AddOrUpdateeModel(connection,dataModel);
            dataModel.Id = m.Id;
            var user = _userCache.UpdateLocalItem(connection,m);
            _userAuthToGameIdCache.AddOrUpdate(connection,user.AuthId, user.Id, _userCache);
            _userNameSercherPkCache.AddOrUpdate(connection,user.Nickname, user.Id, _userCache);
            return user;
        }
 

        //todo user удаление связей
        public bool Delete(IDbConnection connection, int userId)
        {
            throw new NotImplementedException();
            var old =   _userCache.GetById(connection,userId, true);
            if (old == null) return true;
            var sucsess = _userRepo.Delete(connection,userId);
            // _provider.Commit();
            if (sucsess) _userCache.DeleteItem(userId);
            else throw new NotImplementedException(Error.ErrorInUpdateDb);
        }

        public bool DeleteAll(IDbConnection connection)
        {
            var result = false;
            var spy = _svp.GetService<IUSpyService>();
            var tasks = _svp.GetService<IUTaskService>();
            var mother = _svp.GetService<IMothershipService>();
            var motherJump = _svp.GetService<IUMotherJumpService>();
            var channel = _svp.GetService<IChannelService>();


            var premiumRepo = _svp.GetService<IPremiumRepository>();
            var premiumCache = _svp.GetService<IPremiumLocalStorageCache>();
            var balanceCcCache = _svp.GetService<IUserBalanceCcLocalStorageCache>();

            try
            {
                spy.DeleteAll(connection);
                tasks.DeleteAll(connection);
                motherJump.DeleteAll(connection);
                mother.DeleteAll(connection);
                channel.DeleteAll(connection);
                _allianceService.DeleteAll(connection);
                premiumRepo.DeleteAll(connection);
                _userRepo.DeleteAllProcedure(connection);
                result = true;
            }

            finally
            {
                premiumCache.ClearStorage();
                balanceCcCache.ClearStorage();
                _userAuthToGameIdCache.ClearStorage();
                _userNameSercherPkCache.ClearStorage();
                _userCache.ClearStorage();
            }
            return result;
        }

        #endregion

        #region GetGameUser

        public UserDataModel GetCurrentGameUser(IDbConnection connection, ClaimsPrincipal user)
        {
            if (user == null) throw new ArgumentNullException(Error.IsEmpty, nameof(ClaimsPrincipal));
            var authId = user.GetAuthUserId();
            if (string.IsNullOrWhiteSpace(authId)) throw new ArgumentException(Error.IsEmpty, nameof(authId));
            return GetGameUser(connection, authId);
        }

        public UserDataModel GetGameUserByName(IDbConnection connection, string userName)
        {
            var userId = _userNameSercherPkCache.GetOrAdd(connection,userName, _userCache);
            if (userId == 0) throw new NotImplementedException("user id not exist param: userId");
            return GetGameUser(connection, userId);
        }


        public int GetGameUserId(IDbConnection connection, string authId)
        {
            if (string.IsNullOrWhiteSpace(authId)) throw new Exception(Error.NotAutorized);
            return _userAuthToGameIdCache.GetOrAdd(connection,authId, _userCache);
        }

        public UserDataModel GetGameUser(IDbConnection connection, int userId)
        {
            return userId ==0 ? null : _userCache.GetById(connection,userId, true);
        }


        public UserDataModel GetGameUser(IDbConnection connection, string authId)
        {
 
            return GetGameUser(connection, GetGameUserId(connection, authId));
        }

        public TResult GetGameUser<TResult>(IDbConnection connection, int userId, Func<UserDataModel, TResult> selector)
        {
            return new List<UserDataModel> { GetGameUser(connection, userId) }.Select(selector).FirstOrDefault();
        }


        public IList<UserDataModel> GetGameUserList(IDbConnection connection, bool widthReservedId)
        {
            return widthReservedId
                ? _userCache.LocalWhereSelect(connection,i => i.Id > 0, i => i)
                : _userCache.LocalWhereSelect(connection,i => i.Id > Npc.NpcMaxId, i => i);
        }

        #endregion


        #region Custom

        public IList<UserDataModel> GetTopPvpUsers(IDbConnection connection, int skip, int take)
        {
            var users = GetGameUserList(connection, false);
            return users.OrderByDescending(i => i.PvpPoint).Skip(skip).Take(take).ToList();
        }

        public UserDataModel AddPvp(IDbConnection connection, int pvp, int userId)
        {
            var user = GetGameUser(connection, userId);
            user.PvpPoint += pvp;
            return AddOrUpdate(connection,user);
        }

        public UserDataModel UpdatePvp(IDbConnection connection, int newPvp, int userId)
        {
            var user = GetGameUser(connection, userId);
            if (user.PvpPoint == newPvp) return user;
            user.PvpPoint = newPvp;
            return AddOrUpdate(connection,user);
        }


        public IList<UserDataModel> GetNpcUserList(IDbConnection connection)
        {
            return _userCache.LocalWhereSelect(connection,i => i.IsNpc, i => i);
        }

        public UserDataModel UpdateStatus(IDbConnection connection, byte newStatus, int userId)
        {
            var user = _userCache.GetById(connection,userId, true);
            if (user.Status == newStatus) return user;
            user.Status = newStatus;
            return AddOrUpdate(connection,user);
        }

        public int GetTopPosition(IDbConnection connection, int userId, int pvpPoint)
        {
            var users = GetGameUserList(connection, false);
            return users.Where(i => i.Status == 0)
                .OrderByDescending(i => i.PvpPoint)
                //.ThenBy(i => i.Id)
                .Select((item, index) => new
                {
                    item.Id,
                    Position = index + 1
                })
                .First(i => i.Id == userId).Position;

            //        return users.Where(i => i.Status == 0)
            //.OrderByDescending(i => i.PvpPoint)
            ////.ThenBy(i => i.Id)
            //.Select(i => new { i.Id, i.PvpPoint }).ToList()
            //.Select((item, index) => new
            //{
            //    item.Id,
            //    Position = index + 1
            //})
            //.First(i => i.Id == userId).Position;
        }

        public IList<NameIdInt> FilterUserName(IDbConnection connection, string partUserName)
        {
            var locals = _userNameSercherPkCache.TryFind(connection,partUserName, _userCache);
            if (locals.Count > 0) return locals.Select(i => new NameIdInt(i.Value, i.Key)).ToList();

            var names = _userRepo.FilterUserName(connection, partUserName);
            if (names.Count <= 0) return new List<NameIdInt>();

            foreach (var un in names)
                _userNameSercherPkCache.AddOrUpdate(connection,un.Name, un.Id, _userCache);

            return names;
        }

        public UserDataModel UpdateUserName(IDbConnection connection, string newName, int userId)
        {
            var user = _userCache.GetById(connection,userId, true);
            var oldName = user.Nickname;
            if (user.Nickname == newName) return user;
            user.Nickname = newName;

            var updatedUser = AddOrUpdate(connection,user);
            _userNameSercherPkCache.TryUpdateKey(connection,userId, oldName, newName, _userCache, false);

            //todo update in alliance
            //todo update in tasks
            //todo update in ....
            //todo auth userName???
            return updatedUser;
        }

        #endregion

        #region Onregistrate

        public bool CreateGameUserIfNotExist(ApplicationUser confirmedUser)
        {
           var game = _svp.GetService<IGameRunner>();
            var provider = _svp.GetService<IDbProvider>();
 
            var initializer =  _svp.GetService<IUserInitializer>();
            var result = false; 
            provider.ContextAction(connection =>
            {
                if (!game.CahceInitialized)
                {
                    game.InitCaches(connection);
                }
                var existBefore = false;
                result = initializer.Run(connection, confirmedUser.Id, confirmedUser.UserName, ref existBefore);
                if (existBefore)
                {
                    return true;
                }
                if (!result)
                {
                    _deleteUserIfCreateNotSucsessed(connection, confirmedUser.Id);
    
                }
                return result;

            });
            
            return result;
        }
 
        private void _deleteUserIfCreateNotSucsessed(IDbConnection connection,string authId)
        {

            var user = GetGameUser(connection, authId);
            if (user == null|| user.Id ==0)
            {
                return;
            }
            var userId = user.Id;
            var userName = user.Nickname;
            //все связанные данные удяляться каскадом
            _userRepo.Delete(connection, userId);
            // необходимо найти и очистить все связанные кеши
            var balacneCache = _svp.GetService<IUserBalanceCcLocalStorageCache>();
            var premiumCache = _svp.GetService<IPremiumLocalStorageCache>();
            var allianceUserCache = _svp.GetService<IAllianceUserLocalStorageCache>();
            //connectedChanne - у коннекшена нет кеша, данные каскадом удалены в бд

            balacneCache.DeleteItem(userId);
            premiumCache.DeleteItem(userId);
            var allianceUserIds = allianceUserCache.LocalOperation(connection, col => col.Where(i => i.UserId == userId).Select(i=> i.UserId))
                .ToList();
            if (allianceUserIds.Any())
            {
                allianceUserCache.DeleteItems(allianceUserIds);
            }
            _userNameSercherPkCache.Delete(userName);
            _userAuthToGameIdCache.Delete(authId);



        }

        #endregion

        #region Helper

        public string Test(string message = "Ok")
        {
            return message;
        }

        public bool HasUsers()
        {
            return _userCache.ContainAny();
        }

        #endregion
    }
}