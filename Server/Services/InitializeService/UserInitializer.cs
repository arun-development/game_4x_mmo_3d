using System;
using System.Collections.Generic;
using System.Data;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Other;
using Server.DataLayer;
using Server.Services.UserService;
using Server.ServicesConnected.AzureStorageServices.ImageService;

namespace Server.Services.InitializeService
{
    /// <summary>
    ///     Инициализирует пользователя при регистрации
    /// </summary>
    public class UserInitializer : IUserInitializer
    {
        private readonly IGameUserService _gameUserService;
        private readonly IMothershipService _mothershipService;
        private readonly IStoreService _storeService;
        private readonly IAllianceService _allianceService;
        private readonly ChannelService _channelService;

        public UserInitializer(IGameUserService gameUserService, IMothershipService mothershipService,
            IStoreService storeService, IAllianceService allianceService, IChannelService channelService)
        {
            _gameUserService = gameUserService;
            _mothershipService = mothershipService;
            _storeService = storeService;
            _allianceService = allianceService;
            _channelService = (ChannelService)channelService;
        }


        public bool Run(IDbConnection connection, string userAuthId, string userName, ref bool existBefore)
        {
 
            var user = CreateGameUser(connection, userAuthId, userName, ref existBefore);
            return existBefore || _run(connection, user, true);
        }

        private bool _run(IDbConnection connection, UserDataModel user, bool setAllianceChannel)
        {

            try
            {
                _storeService.BalanceGet(connection, user.Id);
                _storeService.GetUserPremium(connection, user.Id);
                CreateMothership(connection, user);
                var allianceUser = _allianceService.CreateStartAllianceUser(connection, user);
                if (setAllianceChannel)
                    _channelService.SetUsersToNpcAlliance(connection, new List<AllianceUserDataModel> { allianceUser });

                return true;
            }
            catch (Exception)
            {
      
                return false;
            }

        }


        public UserDataModel CreateGameUser(IDbConnection connection, string userAuthId, string userName, ref bool existBefore, int? userId = null)
        {
            var user = _gameUserService.GetGameUser(connection, userAuthId);
            if (user != null && user.Id != 0)
            {
                existBefore = true;
                return user;
            }
            var newUser = _gameUserService.AddOrUpdate(connection, _createUserModel(userAuthId, userName));
            if (userId != null) newUser.Id = (int)userId;
            return newUser;
        }

        public void InternalRun(IDbConnection connection, string userAuthId, string userName, int userId, bool setAllianceChannel)
        {
            var user = InternalCreateGameUser(connection, userAuthId, userName, userId);
            _run(connection, user, setAllianceChannel);
        }

        public UserDataModel InternalCreateGameUser(IDbConnection connection, string userAuthId, string userName, int userId)
        {
            var user = _gameUserService.GetGameUser(connection, userId);
            if (user != null && user.Id != 0) return user;
            var userModel = _createUserModel(userAuthId, userName);
            var newUser = _gameUserService.AddOrUpdate(connection, userModel);
            if (newUser.Id != userId)
            {
                throw new NotImplementedException("newUser.Id != userId");
            }
            return newUser;
        }

        private Random _rand = new Random();

        private UserDataModel _createUserModel(string userAuthId, string userName)
        {
            var curTime = UnixTime.UtcNow();
            var curTimeDateTime = UnixTime.ToDateTime(curTime);

            return new UserDataModel
            {
                //todo  deleteAfter
                PvpPoint = _rand.Next(1, 999999),
                Nickname = userName,
                DateCreate = curTimeDateTime,
                IsOnline = true,
                Status = 0,
                AuthId = userAuthId,
                DateLastJoin = curTime,
                IsNpc = false,
                Avatar = Avatar.DefaultUrls(),
                MeedsQuantity = new Dictionary<int, MeedDbModel>(),
                Description = "Enter description heare"
            };
        }


        public UserMothershipDataModel CreateMothership(IDbConnection connection, UserDataModel user)
        {
            // _mothershipService.CreateMother(user.Id, rand.Next(1, 40));
            return _mothershipService.CreateMother(connection, user.Id, 1);
        }
    }
}