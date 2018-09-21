using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.Extensions;
using Server.ServicesConnected.Auth.Models;
using Server.ServicesConnected.Auth.Services;
using Server.ServicesConnected.Auth.Static;

namespace Server.Services.InitializeService
{
    //https://translate.googleusercontent.com/translate_c?act=url&depth=1&hl=ru&ie=UTF8&prev=_t&rurl=translate.google.es&sl=en&sp=nmt4&tl=ru&u=http://stackoverflow.com/questions/24373311/dependency-injecting-userstore-in-owin-startup-using-ninject-owin-middleware&usg=ALkJrhgZ9h4jwxK1rxcRwFwBPLzv7TBnuA


    public class AuthAuthUsersInitializer : IAuthUsersInitializer
    {
        private const string FakeUserPrefix = "FakeUser";
        private static readonly Random Rand = new Random();
        private readonly IGameUserService _gameUserService;
        private readonly IAuthDbInitializer _dbInitializer;

        public IAuthDbInitializer DbInitializer => _dbInitializer;



        public AuthAuthUsersInitializer(IGameUserService gameUserService,  IAuthDbInitializer dbInitializer)
        {
            _gameUserService = gameUserService;
 
            _dbInitializer = dbInitializer;
        }


        public void CreateMainRoles(IDbConnection connection, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _dbInitializer.CreateMainUsersAndRolesIfNotExists(userManager, roleManager).MakeSync();
        }


        public void GenerateFakeAuthUsers(IDbConnection connection, UserManager<ApplicationUser> userManager)
        {
            //http://stackoverflow.com/questions/22629936/no-iusertokenprovider-is-registered
            var ignodeEmails = MainUserRepository.GetEmails();
            var users = userManager.Users.Where(u => !ignodeEmails.Contains(u.Email));
            var pass = "J6&fr$5dg?hk";
            if (users.Any()) return;
            else
            {
                var count = 10;
                for (var i = 0; i < count; i++)
                {
                    var username = FakeUserPrefix + i.ToString().PadLeft(5, '0');
                    var mail = username + "@gmail.com";
                    var user = new ApplicationUser { UserName = username, Email = mail };
                    var createdUser = _dbInitializer.CreateAppProgrammUser(userManager,user, pass).MakeSync();
                    if (createdUser == null || createdUser.EmailConfirmed) continue;
                    _dbInitializer.AddUserToRoleIfNotExists(userManager,createdUser, new List<string>{ MainRoles.Test }).MakeSync();
                }
            }
        }

        public void TestAddUserToRole(IDbConnection connection, string userAuthId, string roleName)
        {
            throw new NoNullAllowedException();
            //using (var userMaanager = context.UserMaanager)
            //{
            //    userMaanager.AddToRole(userAuthId, roleName);
            //    context.DbA.SaveChanges();
            //}
        }


        public void UpdateSecurityStamp(IDbConnection connection)
        {
            throw new NoNullAllowedException();
            //using (var dba = context.DbA)
            //{
            //    var ur = dba.Users.Where(u =>
            //        u.UserName != MainUserRepository.GetAdminUser().Email &&
            //        u.UserName != MainUserRepository.GetTextureUser().Email).ToList();

            //    foreach (var t in ur)
            //        context.UserMaanager.UpdateSecurityStamp(t.Id);
            //}
        }


        public void DeleteFakeUsers(IDbConnection connection, UserManager<ApplicationUser> userManager)
        {
            var users = userManager.Users.Where(i => i.UserName.Contains(FakeUserPrefix)).ToList();
            foreach (var user in users)
            {
                userManager.DeleteAsync(user);
            }
        }

        public void UpdateAllUsersRating(IDbConnection connection)
        {
            var users = _gameUserService.GetGameUserList(connection, false);
            foreach (var user in users)
            {
                user.PvpPoint = Rand.Next(0, 10000);
                _gameUserService.AddOrUpdate(connection, user);
            }
        }

        public void GroupInitizlize(IDbConnection connection)
        {
            throw new NotImplementedException();
        }

        public void UpdateAllImg(IDbConnection connection)
        {
            var users = _gameUserService.GetGameUserList(connection, false);
            foreach (var user in users)
            {
                user.PvpPoint = Rand.Next(0, 10000);
                _gameUserService.AddOrUpdate(connection, user);
            }
        }

        public void UpdateUserImg(IDbConnection connection)
        {
            throw new NotImplementedException();
            //var ava = new Avatar().GetAvatar(GameUserService.Id, "test", "test", "test");
            //DbG.user_personal_info.Single(u => u.user_id == GameUserService.Id).img = JsonConvert.SerializeObject(ava);
            //DbG.SubmitChanges();
        }

        public void Init(IDbConnection connection)
        {
            throw new NotImplementedException();
            //DeleteAllGgameTypeAsync();
            //CreateMainRoles();
            ////new AllianceGController().Delete();
            //// new UsersGController().Delete();
            ////new UsersGController().GenerateFakeAuthUsers();
            ////new UsersGController().GameUserService();
            ////new UsersGController().UpdateAllUsersRating();
            ////new AllianceGController().BaseMods();
            ////UpdateAllImg();
            ////new UsersGController().UpdateUserImg();
            ////GenerateFakeAuthUsers();
            ////UpdateSecurityStamp();
            //GroupInitizlize();
        }

        public void DeleteAll(IDbConnection connection)
        {
            throw new NotImplementedException();
            //            db.alliance_user;
            //            db.alliance_rating;
            //            db.alliance_tech;
            //            db.alliance;
            //            db.user_cache;
            //            db.user_rating;
            //            db.user_mothership;
            //            db.user_character;
            //            db.user_personal_info;
            //            db.user_tech;
            //            db.user;
            //DbG.ExecuteCommand("DBCC CHECKIDENT('[dbo].[user_character]', RESEED, 0);");
            //DbG.ExecuteCommand("DBCC CHECKIDENT('[dbo].[user]', RESEED, 0);");
            //          var myEmail = "pashtet44@yandex.ru";
            //          var TextureUser = "textureSkagry@gmai.com";
            //          DbA.AspNetUsers.DeleteAllOnSubmit(
            //                DbA.AspNetUsers.Where(u => u.Email != myEmail && u.Email != TextureUser).Select(u => u));
            //
            //            DbA.SubmitChanges();
        }

        public void CreateAll(IDbConnection connection)
        {
            if (!DataExist(connection))
            {
            }
            else
            {
                throw new Exception("User not deleted");
            }
        }

        public bool DataExist(IDbConnection connection)
        {
            return _gameUserService.HasUsers();
        }

        public string Test(string message = "Ok")
        {
            return message;
        }

        public void Recreate(IDbConnection connection)
        {
            DeleteAll(connection);
            CreateAll(connection);
        }
    }


}