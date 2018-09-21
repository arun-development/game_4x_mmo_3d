using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.Core.Npc;
using Server.DataLayer;
using Server.DataLayer.LocalStorageCaches;
using Server.DataLayer.Repositories;
using Server.Services.UserService;
using Server.ServicesConnected.AzureStorageServices.ImageService;

namespace Server.Services.InitializeService
{
    public class MainInitializer : IMainInitializer, IFakeUser<UserDataModel>
    {
        #region Declare

        private readonly MainUserHelpModel _admUser;
        private readonly IAllianceInitializer _allianceInitializer;
        private readonly IAuthUsersInitializer _authUsersInitializer;
        private readonly ChannelService _channelService;
        private readonly MainUserHelpModel _demoUser;


        private readonly IGameUserService _gameUserService;
        private readonly IMapGInitializer _mapGInitializer;
        private readonly INpcInitializer _npcInitializer;
        private readonly IDbProvider _provider;

        private readonly MainUserHelpModel _textUser;


        private readonly IUserInitializer _userInitializer;


        private readonly bool deletAuthUsers = false;

        public MainInitializer(IAllianceInitializer allianceInitializer,
            IMapGInitializer mapGInitializer,
            IAuthUsersInitializer authUsersInitializer,
            IGameUserService gameUserService,
            INpcInitializer npcInitializer,
            IUserInitializer userInitializer,
            IUserNameSercherPkCache userNameSercherPkCache,
            IUserLocalStorageCache userCache,
            IUserRepository userRepo,
            IAllianceService allianceService,
            IChannelService channelService, IDbProvider provider)
        {
            _allianceInitializer = allianceInitializer;
            _mapGInitializer = mapGInitializer;
            _authUsersInitializer = authUsersInitializer;
            _gameUserService = gameUserService;
            _npcInitializer = npcInitializer;
            _userInitializer = userInitializer;

            _userNameSercherPkCache = userNameSercherPkCache;
            _userCache = userCache;
            _userRepo = userRepo;
            _allianceService = allianceService;
            _provider = provider;

            _channelService = (ChannelService) channelService;

            _admUser = MainUserRepository.GetAdminUser();
            _textUser = MainUserRepository.GetTextureUser();
            _demoUser = MainUserRepository.GetUser(MainUserRepository.DemoUserName);
        }

        #endregion

        #region Interface

        public void DeleteAll(IDbConnection connection)
        {
            var scheme = @"[dbo].";
            //@createFkOrDeleteFk bit
            //@createFkOrDeleteFk
            var sqlBefore = $"EXEC {scheme}[g_detail_planet_change_fk_userId] 0; " +
                            $"EXEC {scheme}[g_detail_system_fk_allianceId] 0; " +
                            $"EXEC {scheme}[c_officer_delete_all]; " +
                            $"EXEC {scheme}[c_officer_histroy_delete_all]; " +
                            $"EXEC {scheme}[c_vote_delete_all];" +
                            $"EXEC {scheme}[c_vote_history_delete_all]; " +
                            $"EXEC {scheme}[c_officer_candidat_delete_all]; " +
                            $"EXEC {scheme}[c_officer_candidat_histrory_delete_all]; " +
                            $"EXEC {scheme}[help_reset_index] 'c_officer',0; " +
                            $"EXEC {scheme}[help_reset_index] 'c_officer_histroy',0; " +
                            $"EXEC {scheme}[help_reset_index] 'c_officer_candidat',0; " +
                            $"EXEC {scheme}[help_reset_index] 'c_officer_candidat_histrory',0; " +
                            $"EXEC {scheme}[help_reset_index] 'c_vote',0; " +
                            $"EXEC {scheme}[help_reset_index] 'c_vote_history',0; " +
                            $"";

            var sqlAfter = $"EXEC {scheme}[g_detail_planet_change_fk_userId] 1;" +
                           $"EXEC {scheme}[g_detail_system_fk_allianceId] 1;";

            _provider.Exec(connection, sqlBefore);

            //c.g_detail_planet_change_fk_userId(false);
            //c.g_detail_system_fk_allianceId(false);
            //c.c_officer_delete_all();
            //c.c_officer_histroy_delete_all();

            //c.c_officer_candidat_delete_all();
            //c.c_officer_candidat_histrory_delete_all();

            //c.c_vote_delete_all();
            //c.c_vote_history_delete_all();
            _gameUserService.DeleteAll(connection);
            _allianceInitializer.DeleteAll(connection);
            if (deletAuthUsers)
            {
                _authUsersInitializer.DeleteAll(connection);
            }
            _mapGInitializer.DeleteAll(connection);

            _provider.Exec(connection, sqlAfter);

            //c.g_detail_planet_change_fk_userId(true);
            //c.g_detail_system_fk_allianceId(true);
        }

 
        public void CreateAll(IDbConnection connection)
        {
      
            var ai = (AllianceInitializer) _allianceInitializer;
            ai.CreateAllianceRoles(connection);
            if (deletAuthUsers)
            {
                _authUsersInitializer.CreateAll(connection);
            }
            _npcInitializer.Init(connection);
            _mapGInitializer.CreateAll(connection);
            _npcInitializer.CreateMotherNpces(connection);
            var index = 999;
            _provider._help_reset_index(connection, "user", index);
            _provider._help_reset_index(connection, "alliance", index);
            _provider._help_reset_index(connection, "alliance_user", index);
            _provider._help_reset_index(connection, "alliance_user_history", index);


            _userInitializer.InternalRun(connection, _admUser.AuthId, _admUser.NikName, _admUser.GameId, false);

            var baseAlliance = ai.CreateBaseAlliance(connection);
            var password = Guid.NewGuid().ToString();
            _channelService.CreateAllianceChannel(connection, baseAlliance, password);

            _userInitializer.InternalRun(connection, _textUser.AuthId, _textUser.NikName, _textUser.GameId, true);
            _userInitializer.InternalRun(connection, _demoUser.AuthId, _demoUser.NikName, _demoUser.GameId, true);


            SetMainUsersPlanet(connection);
            _createFakeUsers(connection);
        }


        public string Test(string message = "Ok") => message;

        #endregion


        #region FakeVars

        private const string FakeAlliancePrefix = "IFAL_";
        public const string FakeUserPrefix = "IFU_";
        private readonly int _fakeAlliancCount = 50;
        private readonly IUserNameSercherPkCache _userNameSercherPkCache;
        private readonly IUserLocalStorageCache _userCache;
        private readonly IUserRepository _userRepo;
        private readonly IAllianceService _allianceService;

        #endregion

        #region MainUsers

        private void SetMainUsersPlanet(IDbConnection connection)
        {
             _setUserPlanets(connection, 1, 20, _admUser.GameId);
            _setUserPlanets(connection, 21, 30, _textUser.GameId);
            _setUserPlanets(connection, 31, 35, _demoUser.GameId);
        }

        private void _setUserPlanets(IDbConnection connection, int startPlanetId, int endPlanetId, int userId)
        {
            for (var i = startPlanetId; i < endPlanetId; i++)
            {
                _mapGInitializer.UpdatePlanetOwner(connection, i, userId);
            }
        }

        #endregion

        #region FakeUser

        private void _createFakeUsers(IDbConnection connection)
        {
      
            var leaderUsers = CreateFakeUsers(connection, _fakeAlliancCount);
            var allianses = _createFakeAlliances(connection, leaderUsers);
            var members = CreateFakeUsers(connection, 200);
            _addFakeUsersToAlliances(connection, members, allianses);
        }

        public void DeleteFakeUsers(IDbConnection connection)
        {
            DeleteFakeAlliances(connection);
            _deleteFakeUsers(connection);
        }


        public IList<UserDataModel> CreateFakeUsers(IDbConnection connection, int count)
        {
            //.RWhereSelect(i => i.Id > 1000, i => i.Id);
            var userNames = new List<string>();
            var maxId = _userRepo.CreateNextUserId(connection);
            for (var i = 0; i < count; i++)
            {
                var rand = Guid.NewGuid().ToString().Substring(0, Rand.Next(6, 9));
                var fakeUser = FakeUserPrefix + rand;
                _userInitializer.InternalRun(connection, fakeUser, fakeUser, maxId, true);
                maxId++;
                userNames.Add(fakeUser);
            }
            var users = new List<UserDataModel>();
            foreach (var userName in userNames)
            {
                var u = _gameUserService.GetGameUserByName(connection, userName);
                users.Add(u);
            }

            return users;
        }

        public IList<UserDataModel> GetFakeUsers(IDbConnection connection, int count = -1)
        {
            var fakeNames = _userNameSercherPkCache.TryFind(connection, FakeUserPrefix, _userCache);
            var fnCount = fakeNames.Count;
            if (count == -1)
            {
                count = fnCount;
            }
            if (count > fnCount)
            {
                count = fnCount;
            }
            var ids = fakeNames.Select(i => i.Value).OrderBy(i => i).Take(count).ToList();
            return _userCache.GetDataModelItems(connection, ids);
        }


        private void _deleteFakeUsers(IDbConnection connection)
        {
            var users = GetFakeUsers(connection);
            if (users != null && users.Any())
            {
                var userIds = users.Select(i => i.Id).ToList();
                _userRepo.Delete(connection, userIds);
                _userCache.DeleteItems(userIds);
            }
        }

        #endregion

        #region FakeAlliances

        public const string ADescription =
            " Lorem Ipsum is simply dummy text of the printing and " +
            "typesetting industry. Lorem Ipsum has been the industry's standard dummy" +
            " text ever since the 1500s, when an unknown printer took a galley of type" +
            " and scrambled it to make a type specimen book. It has survived not only " +
            "five centuries, but also the leap into electronic typesetting, remaining essentially " +
            "unchanged. It was popularised in the 1960s with the release of Letraset sheets containing" +
            " Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker " +
            "including versions of Lorem Ipsum.";

        public const string APref = "Alliance description: ";

        protected static readonly Random Rand = new Random();

        public void CreateFakeAlliances(IDbConnection connection)
        {
            _createFakeAlliances(connection, GetFakeUsers(connection, _fakeAlliancCount));
        }

        private IList<AllianceDataModel> _createFakeAlliances(IDbConnection connection, IList<UserDataModel> users)
        {
            var alliances = new List<AllianceDataModel>();
            var startCount = 1;
            foreach (var user in users)
            {
                // var id = _allianceService.GetNextAllianceId();
                var allianceName = FakeAlliancePrefix + startCount;
                var alliance = _allianceService.CreateAlliance(connection, new AllianceDataModel
                {
                    Name = allianceName,
                    Description = APref + allianceName + ADescription,
                    DateCreate = DateTime.UtcNow,
                    CreatorName = user.Nickname,
                    CreatorId = user.Id,
                    Tax = (byte) Rand.Next(5, 31),
                    Images = Label.DefaultUrls()
                });
                var password = Guid.NewGuid().ToString();
                _channelService.CreateAllianceChannel(connection, alliance, password);
                alliances.Add(alliance);
                startCount++;
            }
            return alliances;
        }

        public void AddFakeUsersToAlliances(IDbConnection connection)
        {
            var alliancesAll = _getAlliances(connection);
            var fakeUsers = GetFakeUsers(connection);
            var allianceUsers = _allianceService.GetAllAllianceUsers(connection);
            if (!alliancesAll.Any() || !fakeUsers.Any())
            {
                return;
            }
            var fakeAlliances = alliancesAll.Where(i => i.Name.Contains(FakeAlliancePrefix)).OrderBy(i => i.Id)
                .ToList();
            if (!fakeAlliances.Any())
            {
                return;
            }
            var confId = (int) NpcAllianceId.Confederation;
            var fakeUserIds = fakeUsers.Select(i => i.Id).OrderBy(i => i).ToList();
            var freeUserIds = allianceUsers.Where(i => i.AllianceId == confId && fakeUserIds.Contains(i.UserId))
                .Select(i => i.UserId).ToList();
            if (!freeUserIds.Any())
            {
                return;
            }
            var freeFakeUsers = fakeUsers.Where(i => freeUserIds.Contains(i.Id)).ToList();

            _addFakeUsersToAlliances(connection, freeFakeUsers, fakeAlliances);
        }


        private void _addFakeUsersToAlliances(IDbConnection connection, IList<UserDataModel> fakeUsersInNpcAlliance, IList<AllianceDataModel> fakeAllianses)
        {
            var fa = fakeAllianses.OrderBy(i => i.Id).ToList();
            var fu = fakeUsersInNpcAlliance.OrderBy(i => i.Id).ToList();
            var freeuserCount = fakeUsersInNpcAlliance.Count;
            var userPosition = 0;
            while (true)
            {
                if (freeuserCount == 0)
                {
                    break;
                }
                foreach (var alliance in fa)
                {
                    if (freeuserCount == 0)
                    {
                        break;
                    }
                    var userInStak = Rand.Next(1, 5);

                    for (var i = 0; i < userInStak; i++)
                    {
                        if (freeuserCount == 0)
                        {
                            break;
                        }
                        var user = fu[userPosition];
                        if (user == null)
                        {
                            break;
                        }
                        var oldAllianceUser = _allianceService.GetAllianceUserByUserId(connection, user.Id);
                        if (oldAllianceUser == null ||
                            oldAllianceUser.AllianceId != (int) NpcAllianceId.Confederation)
                        {
                            userPosition++;
                            freeuserCount--;
                            continue;
                        }
                        var au = _allianceService.LeaveFromNpcAndJoinToUserAlliance(connection, oldAllianceUser.Id,
                            alliance.Id);

                        _channelService.OnUserChangeAlliance(connection, (int) NpcAllianceId.Confederation, au,
                            (ch, ch2) => { },
                            d => { });

                        userPosition++;
                        freeuserCount--;
                    }
                }
            }

            //var alliancesAll = _getAlliances();
            //var fakeUsers = GetFakeUsers();
            //var allianceUsers = _allianceService.GetAllAllianceUsers();
            //if (!alliancesAll.Any() || !fakeUsers.Any()) return;


            //var alliances = alliancesAll.Where(i => i.Name.Contains(FakeAlliancePrefix)).OrderBy(i => i.Id).ToList();
            //if (!alliances.Any()) return;
            //var fakeUserIds = fakeUsers.Select(i => i.Id).OrderBy(i => i).ToList();
            //var confId = (int)NpcAllianceId.Confederation;
            //var freeUserIds = allianceUsers.Where(i => i.AllianceId == confId && fakeUserIds.Contains(i.UserId)).Select(i => i.UserId).ToList();
            //if (!freeUserIds.Any()) return;


            //var freeUsersUsersCount = freeUserIds.Count;
            //var userPosition = 0;
            //while (freeUsersUsersCount > 0)
            //{
            //    foreach (var alliance in alliances)
            //    {
            //        var userInStak = Rand.Next(1, 5);

            //        for (var i = 0; i < userInStak; i++)
            //        {
            //            if (freeUsersUsersCount == 0) break;
            //            var userId = freeUserIds[userPosition];
            //            //var au =  await _allianceService.JoinToUserAllianceAsync(userId, alliance.Id);
            //            var oldAllianceUser = _allianceService.GetAllianceUserByUserId(userId);
            //            var au = _allianceService.LeaveFromNpcAndJoinToUserAlliance(oldAllianceUser.Id, alliance.Id);

            //            _channelService
            //                .OnUserChangeAlliance((int)NpcAllianceId.Confederation, au,
            //                    (ch, ch2) => { },
            //                    (d) => { });

            //            userPosition++;
            //            freeUsersUsersCount--;
            //        }
            //    }
            //}
        }


        public void DeleteFakeAlliances(IDbConnection connection)
        {
            var alliances = _allianceService.GetAlliancesByPartAllianeName(connection, FakeAlliancePrefix);
            foreach (var alliance in alliances)
            {
                _allianceService.Delete(connection, alliance.Id);
            }
        }


        private IList<AllianceDataModel> _getAlliances(IDbConnection connection, int? allianceId = null)
        {
            if (allianceId != null)
            {
                return new List<AllianceDataModel>
                {
                    _allianceService.GetAllianceById(connection, (int) allianceId, false)
                };
            }

            var aliances = _allianceService.GetAllAlliances(connection, true);
            return aliances.OrderBy(i => i.Id).ToList();
        }

        #endregion
    }
}