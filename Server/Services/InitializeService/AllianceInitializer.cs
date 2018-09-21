using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using MoreLinq;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.Core.StaticData;
using Server.DataLayer;
using Server.ServicesConnected.AzureStorageServices.ImageService;

namespace Server.Services.InitializeService
{
    public class AllianceInitializer : IAllianceInitializer
    {
        private readonly IAllianceService _allianceService;
        private readonly IGameUserService _gameUserService;
        private readonly IGDetailPlanetService _gDetailPlanetService;

        public AllianceInitializer(IAllianceService allianceService, IGameUserService gameUserService,
            IGDetailPlanetService gDetailPlanetService)
        {
            _allianceService = allianceService;
            _gameUserService = gameUserService;
            _gDetailPlanetService = gDetailPlanetService;
        }

        public string Test(string message = "Ok")
        {
            return message;
        }


        public AllianceDataModel CreateBaseAlliance(IDbConnection connection)
        {
            var admin = MainUserRepository.GetAdminUser();
            var allianceName = "Time killer";
            return _allianceService.CreateAlliance(connection, new AllianceDataModel
            {
                Name = allianceName,
                Description = MainInitializer.APref + allianceName + MainInitializer.ADescription,
                DateCreate = DateTime.UtcNow,
                CreatorName = admin.NikName,
                CreatorId = admin.GameId,
                Images = Label.DefaultUrls(),
                Tax = 13,
                Cc = 99999
            });
        }


        public void CreateAllianceRating(IDbConnection connection)
        {
            var aliances = _allianceService.GetAllAlliances(connection,true);
            var users = _gameUserService.GetGameUserList(connection, true);
            foreach (var aliance in aliances)
            {
                var aUsers = _allianceService.GetAllianceUsers(connection,aliance.Id);
                var userIds = aUsers.DistinctBy(i => i.UserId).Select(i => i.UserId);
                aliance.PvpRating = users.Where(i => userIds.Contains(i.Id)).Sum(i => i.PvpPoint);
                _allianceService.AddOrUpdate(connection,aliance);
            }
        }


        public void CreateAllianceRoles(IDbConnection connection)
        {
            _allianceService.CreateRoles(connection);
        }


        public void AddUserRole(IDbConnection connection)
        {
            var idx = 0;
            byte roleId = 1;
            var u = _allianceService.GetAllAllianceUsers(connection);
            var users = u.OrderBy(i => i.UserId).ToList();

            var newUsers = new List<AllianceUserDataModel>();
            foreach (var user in users)
            {
                if (idx >= 10) roleId = 2;
                user.RoleId = roleId;
                newUsers.Add(user);
                idx++;
            }

            foreach (var newUser in newUsers)
                _allianceService.AddOrUpdateAllianceUser(connection, newUser);
        }


        public void SetUserPlanet(IDbConnection connection)
        {
            var au = _allianceService.GetAllAllianceUsers(connection,i => i); //.OrderBy(i => i.user_id).ToList();
            var allianceUsers = au.OrderBy(i => i.UserId).ToList();

            var userIndex = 0;

            var detailPlanets = _gDetailPlanetService.GetAllPlanet(connection);
            var userCount = allianceUsers.Count;
            foreach (var planet in detailPlanets)
            {
                if (userIndex == userCount) userIndex = 0;
                var user = allianceUsers[userIndex];
                planet.AllianceId = user.AllianceId;
                planet.UserId = user.UserId;
                _gDetailPlanetService.AddOrUpdate(connection,planet);
                userIndex++;
            }
        }


        public void DeleteAll(IDbConnection connection)
        {
            _allianceService.DeleteAll(connection);
        }

        public void Init(IDbConnection connection)
        {
            DeleteAll(connection);
            //            CreateFakeAlliances();
            //            AddUserToAlliance();
            //            AddUserRole();
            //SetUserPlanet();
            //            CreateAllianceRating();

            //            CreateAllianceImgsAsync();
        }

        public void CreateAll(IDbConnection connection)
        {
            throw new NotImplementedException(Error.NotUsedServerMethod);
        }

        public bool DataExist(IDbConnection connection)
        {
            return _allianceService.HasAlliances(connection);
        }

        private List<UserDataModel> _getUsers(IDbConnection connection, int? count = null)
        {
            IList<UserDataModel> users;
            if (count == null)
            {
                users = _gameUserService.GetGameUserList(connection, false);
                return users.OrderBy(i => i.Id).ToList();
            }
            users = _gameUserService.GetGameUserList(connection, false);
            return users.OrderBy(i => i.Id).Take((int) count).ToList();
        }
    }
}