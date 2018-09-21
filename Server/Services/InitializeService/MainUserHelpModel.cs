using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Server.Core.Interfaces;
using Server.Extensions;
using Server.ServicesConnected.Auth.Models;

namespace Server.Services.InitializeService
{
    public class MainUserHelpModel : ApplicationUser, ICreateNew<MainUserHelpModel>
    {
        private void _default()
        {
            EmailConfirmed = false;
            PhoneNumber = "+00000000000";
        }

        private void _copyBase(ApplicationUser other)
        {
            Id = other.Id;
            UserName = other.UserName;
            Email = other.Email;
            EmailConfirmed = other.EmailConfirmed;
            PhoneNumber = other.PhoneNumber;
            AccessFailedCount = other.AccessFailedCount;
            PasswordHash = other.PasswordHash;
            ConcurrencyStamp = other.ConcurrencyStamp;
            LockoutEnabled = other.LockoutEnabled;
            LockoutEnd = other.LockoutEnd;
            NormalizedEmail = other.NormalizedEmail;
            NormalizedUserName = other.NormalizedUserName;
            PhoneNumberConfirmed = other.PhoneNumberConfirmed;
            SecurityStamp = other.SecurityStamp;
            TwoFactorEnabled = other.TwoFactorEnabled;
        }

        private void _copy(MainUserHelpModel other)
        {
            _copyBase(other);
            //---
            GameId = other.GameId;
            Password = other.Password;

        }


        public MainUserHelpModel()
        {
            _default();
        }

        private MainUserHelpModel(MainUserHelpModel other)
        {
            _copy(other);
        }

        public MainUserHelpModel(string name, string authId, string email, int gameId = 0, string password = null)
        {
            _default();
            Id = authId;
            UserName = name;
            Email = email;
            GameId = gameId;
            if (string.IsNullOrWhiteSpace(password))
            {
                var p = Guid.NewGuid().ToString();
                var first = p.Substring(5);
                var end = p.Substring(5).ToUpper();
                Password = first + end;
            }
            else
            {
                Password = password;
            }
        }

        public string AuthId
        {
            get => Id;
            private set => Id = value;
        }

        public string NikName
        {
            get => UserName;
            private set => UserName = value;
        }

        public int GameId { get; private set; }
        public string Password { get; private set; }


        public ApplicationUser CreeateAsBase()
        {
            return new ApplicationUser
            {
                Id = Id,
                AccessFailedCount = AccessFailedCount,
                ConcurrencyStamp = ConcurrencyStamp,
                Email = Email,
                EmailConfirmed = EmailConfirmed,
                LockoutEnabled = LockoutEnabled,
                LockoutEnd = LockoutEnd,
                NormalizedEmail = NormalizedEmail,
                NormalizedUserName = NormalizedUserName,
                PasswordHash = PasswordHash,
                PhoneNumber = PhoneNumber,
                PhoneNumberConfirmed = PhoneNumberConfirmed,
                SecurityStamp = SecurityStamp,
                TwoFactorEnabled = TwoFactorEnabled,
                UserName = UserName
            };
        }

        public MainUserHelpModel CreateNew(MainUserHelpModel other)
        {
            return new MainUserHelpModel(other);
        }

        public MainUserHelpModel CreateNewFromThis()
        {
            return new MainUserHelpModel(this);
        }

        public MainUserHelpModel Update(ApplicationUser user)
        {
            _copyBase(user);
            return this;

        }
    }


    public class MainUserConfigModel
    {
        public string AuthUserId { get; set; }
        public int? GameUserId { get; set; }
        public string UserName { get; set; }
        public string UserEmail { get; set; }
        public string Password { get; set; }

    }

    public static class MainUserRepository
    {
        public static string AdmName;//"Arun";
        public static string TextureName;//"TextureUser";
        public static string DemoUserName;//"Demo";
        public static IReadOnlyList<string> MainUserNames;
        private static readonly ConcurrentDictionary<string, MainUserHelpModel> _users = new ConcurrentDictionary<string, MainUserHelpModel>();
        private static bool Configured = false;

        //MainUserConfigModel adminUserConfig, MainUserConfigModel textureUserConfig, MainUserConfigModel demoUserConfig
        /// <summary>
        /// 
        /// </summary>
        /// <param name="userConfig">
        /// adminUser, textureUser, demoUser
        /// </param>
        /// <param name=""></param>
        public static void ConfigureMainUserRepository(params MainUserConfigModel[] userConfig)
        {
            if (Configured)
            {
                throw new NotImplementedException("MainUserRepository:ConfigureMainUserRepository :data was configure");
            }
            //todo  убрать пароли и перенсти их в секреты
            AdmName = userConfig[0].UserName;// "Arun";
            TextureName = userConfig[1].UserName;//"TextureUser";
            DemoUserName = userConfig[2].UserName; //"Demo";

            var mainUsers = new List<string> { AdmName, TextureName, DemoUserName };


            var admin = new MainUserHelpModel(AdmName, userConfig[0].AuthUserId,
                userConfig[0].UserEmail,
                userConfig[0].GameUserId ?? 1000,
                userConfig[0].Password);
            var texture = new MainUserHelpModel(TextureName,
                userConfig[1].AuthUserId,
                userConfig[1].UserEmail,
                userConfig[1].GameUserId ?? 1001,
                userConfig[1].Password);
            var demo = new MainUserHelpModel(DemoUserName,
                userConfig[2].AuthUserId,
                userConfig[2].UserEmail,
                userConfig[2].GameUserId ?? 1002,
                userConfig[2].Password);
            _users.TryAdd(admin.NikName, admin);
            _users.TryAdd(texture.NikName, texture);
            _users.TryAdd(demo.NikName, demo);


            var len = userConfig.Length;
            if (len > 3)
            {
                var baseGameId = demo.GameId + 1;
                for (int i = 3; i < len; i++)
                {
                    _users.TryAdd(userConfig[i].UserName, new MainUserHelpModel(
                            userConfig[i].UserName,
                               userConfig[i].AuthUserId,
                               userConfig[i].UserEmail,
                               userConfig[i].GameUserId ?? baseGameId,
                               userConfig[i].Password));

                    baseGameId++;
                }


            }
            MainUserNames = new ReadOnlyCollection<string>(mainUsers);
            Configured = true;
        }





        public static MainUserHelpModel GetUser(int gameUserId)
        {
            var u = _users.Select(i => i.Value).SingleOrDefault(i => i.GameId == gameUserId);
            if (u == null)
                throw new NotImplementedException();
            return GetUser(u.NikName);
        }

        public static MainUserHelpModel GetUser(string name)
        {

            MainUserHelpModel user;
            var suc = _users.TryGetValue(name, out user);
            if (!suc)
                throw new NotImplementedException("MainUserHelpModel GetUser(string name): current value: " + name);
            return user.CreateNewFromThis();
        }


        public static MainUserHelpModel GetAdminUser()
        {
            return GetUser(AdmName);
        }

        public static MainUserHelpModel GetTextureUser()
        {
            return GetUser(TextureName);
        }

        public static ApplicationUser Update(ApplicationUser user)
        {
            var existUser = GetUser(user.UserName);
            existUser.Update(user);
            _users.AddOrUpdateSimple(existUser.NikName, existUser);
            return existUser.CreeateAsBase();

        }

        public static List<string> GetEmails()
        {
            return _users.Select(i => i.Value.Email).ToList();
        }

    }
}