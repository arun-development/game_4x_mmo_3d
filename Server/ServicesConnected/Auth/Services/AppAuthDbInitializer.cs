using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Server.Extensions;
using Server.Services.InitializeService;
using Server.ServicesConnected.Auth.Data;
using Server.ServicesConnected.Auth.Models;
using Server.ServicesConnected.Auth.Static;

namespace Server.ServicesConnected.Auth.Services
{
    public interface IAuthDbInitializer
    {
        Task<bool> Initialize(bool isLocalDevDatabase);
        Task CreateMainUsersAndRolesIfNotExists(UserManager<ApplicationUser> userMamanger, RoleManager<IdentityRole> roleManager);
        Task AddUserToRoleIfNotExists(UserManager<ApplicationUser> userNanager,ApplicationUser importantUser, List<string> roles);
        Task<ApplicationUser> CreateAppProgrammUser(UserManager<ApplicationUser> userNanager,ApplicationUser programmUser, string password);
        UserManager<ApplicationUser> UserManager { get; }
        ApplicationDbContext AuthContext { get; }
        RoleManager<IdentityRole> RoleManager { get; }
    }

    public class AuthDbInitializer : IAuthDbInitializer
    {
        #region Declare


        private readonly ILogger _logger;
        //private readonly ApplicationDbContext _context;
        //private readonly RoleManager<IdentityRole> _roleManager;
        //private readonly UserManager<ApplicationUser> _userManager;
        private readonly IServiceProvider _svp;
        public UserManager<ApplicationUser> UserManager => _svp.GetService<UserManager<ApplicationUser>>();
        public ApplicationDbContext AuthContext => _svp.GetService<ApplicationDbContext>();


        public RoleManager<IdentityRole> RoleManager => _svp.GetService<RoleManager<IdentityRole>>();

        public AuthDbInitializer(IServiceProvider svp)
        {

            _svp = svp;
            _logger = _svp.GetService<ILogger<AuthDbInitializer>>();
            //ApplicationDbContext context, UserManager< ApplicationUser > userManager,
            //RoleManager<IdentityRole> roleManager, ILogger< AuthDbInitializer > logger
 

        }

        #endregion

        #region Interface

        public async Task<bool> Initialize(bool isLocalDevDatabase)
        {
            bool FillCache()
            {
                using (var c = AuthContext)
                {
                    return _fillCache(c);
                }
            }


            if (isLocalDevDatabase)
            {
                using (var rm = RoleManager)
                {

                    async Task<bool> Act()
                    {
                        using (var context = AuthContext)
                        {
                            await context.Database.MigrateAsync();
                            using (var um = UserManager)
                            {
                                await CreateMainUsersAndRolesIfNotExists(um, rm);

                            }

                            return true;
                        }
                    }

 
                    try
                    {

                        if (rm.Roles.Any(r => r.Name == MainRoles.Root))
                        {
                            return FillCache();
                        }
                        return await Act();



                    }
                    catch (SqlException e)
                    {
                        if (e.Number != 4060)
                        {
                            throw;
                        }

                        return await Act();
                    }

                }
            }
            else
            {
                return FillCache();

            }
        }

        private bool _fillCache(ApplicationDbContext context)
        {
            var mu = MainUserRepository.MainUserNames;
            var t = context.Users.Where(i => mu.Contains(i.UserName));
            var mainUsers = t.ToList();
            foreach (var mainUser in mainUsers)
            {
                MainUserRepository.Update(mainUser);
            }
            return true;
        }

        public async Task CreateMainUsersAndRolesIfNotExists(UserManager<ApplicationUser> userMamanger, RoleManager<IdentityRole> roleManager)
        {
            // создаем  роли
            await CreateMainRolesIfNotExists(roleManager);

            //создаем пользователей
            //admin
            var admModel = MainUserRepository.GetAdminUser();
            var adm = await _createMainUserIfNotExist(userMamanger, admModel.CreeateAsBase(), admModel.Password);

            await AddUserToRoleIfNotExists(userMamanger, adm, MainRoles.MainRolesList);


            //texture
            var textureModel = MainUserRepository.GetTextureUser();
            var texture = await _createMainUserIfNotExist(userMamanger, textureModel.CreeateAsBase(), textureModel.Password);
            await AddUserToRoleIfNotExists(userMamanger, texture, new List<string> { MainRoles.Developer, MainRoles.Test, MainRoles.User, MainRoles.Guest });


            //demoUser
            var demoModel = MainUserRepository.GetUser(MainUserRepository.DemoUserName);
            var demo = await _createMainUserIfNotExist(userMamanger, demoModel.CreeateAsBase(), demoModel.Password);
            await AddUserToRoleIfNotExists(userMamanger, demo, new List<string> { MainRoles.User, MainRoles.Guest });
        }


        public async Task<ApplicationUser> CreateAppProgrammUser(UserManager<ApplicationUser> userNanager, ApplicationUser programmUser, string password)
        {
            var user = await userNanager.FindByIdAsync(programmUser.Id);
            if (user != null && user.Id == programmUser.Id)
            {
                return user;
            }

            var useResult = await userNanager.CreateAsync(programmUser, password);
            if (!useResult.Succeeded)
            {
                _logger.LogInformation("!useResult.Succeeded (CreateAsync)",
                    new Exception(programmUser.ToSerealizeString()));
                throw new NotImplementedException("!useResult.Succeeded");
            }
            var token = await userNanager.GenerateEmailConfirmationTokenAsync(programmUser);
            var confirmed = await userNanager.ConfirmEmailAsync(programmUser, token);
            //await _userManager.VerifyUserTokenAsync(createdUser, _userManager.Options.Tokens.EmailConfirmationTokenProvider, "EmailConfirmation", token);

            if (!confirmed.Succeeded)
            {
                _logger.LogInformation("!confirmed.Succeeded (ConfirmEmailAsync)",
                    new Exception(programmUser.ToSerealizeString()));
                throw new NotImplementedException("!confirmed.Succeeded");
            }
            return programmUser;
        }

        public async Task AddUserToRoleIfNotExists(UserManager<ApplicationUser> userNanager ,ApplicationUser importantUser, List<string> roles)
        {
            var result = await userNanager.AddToRolesAsync(importantUser, roles);
            if (!result.Succeeded)
            {
                _logger.LogWarning("!userResult.Succeeded (CreateAsync)",
                    new Exception(importantUser.ToSerealizeString()));
                throw new NotImplementedException("!userResult.Succeeded");
            }
        }
        
        #endregion

        public async Task CreateMainRolesIfNotExists(RoleManager<IdentityRole> roleManager)
        {
            var roles = MainRoles.MainRolesList.Select(i => new IdentityRole { Name = i }).ToList();

            // добавляем роли в бд
            foreach (var i in roles)
            {
                if (!await roleManager.RoleExistsAsync(i.Name))
                {
                    await roleManager.CreateAsync(i);
                }
            }
        }

        private async Task<ApplicationUser> _createMainUserIfNotExist(UserManager<ApplicationUser> userMamanger,ApplicationUser importantUser, string password)
        {
            var before = importantUser.ToSerealizeString();
            var created = await CreateAppProgrammUser(userMamanger, importantUser, password);
            var after = created.ToSerealizeString();
            if (before != after)
            {
                MainUserRepository.Update(created);
            }
            return created;
        }
    }
}