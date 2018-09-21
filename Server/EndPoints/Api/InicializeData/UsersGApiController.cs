using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Server.Core.Interfaces;

namespace Server.EndPoints.Api.InicializeData
{
    [Route("api/usersG/[action]")]
    public class UsersGApiController : InitApiController
    {
        #region Declare

        private readonly IAuthUsersInitializer _authUsersInitializer;

        public UsersGApiController(IServiceProvider serviceProvider) : base(serviceProvider,false)
        {
            _authUsersInitializer = serviceProvider.GetService<IAuthUsersInitializer>();
        }

        #endregion


        [HttpPost]
        // [ApiAntiForgeryValidate]
        public IActionResult Init()
        {
            DeleteAll();
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
            return Json("Sucsess");
        }


        [HttpPost]
        //  [ApiAntiForgeryValidate]
        public string CreateMainRoles()
        {
            _dbProvider.ContextAction(c =>
            {
                using (var um = _authUsersInitializer.DbInitializer.UserManager)
                {
                    using (var rm= _authUsersInitializer.DbInitializer.RoleManager)
                    {
                        _authUsersInitializer.CreateMainRoles(c, um, rm);
                    }
                    
                }
                
                return true;
            });

            return "Ok";
        }


        [HttpPost]
        // [ApiAntiForgeryValidate]
        public string GenerateFakeAuthUsers()
        {
            _dbProvider.ContextAction(c =>
            {
                using (var um =_authUsersInitializer.DbInitializer.UserManager)
                {
                    _authUsersInitializer.GenerateFakeAuthUsers(c, um);
                }
 
                return true;
            });

            return "Ok";
        }


        [HttpPost]
        //  [ApiAntiForgeryValidate]
        public string UpdateSecurityStamp()
        {
            _dbProvider.ContextAction(c =>
            {
                _authUsersInitializer.UpdateSecurityStamp(c);
                return true;
            });

            return "Ok";
        }


        [HttpPost]
        //    [ApiAntiForgeryValidate]
        public string UpdateAllUsersRating()
        {
            _dbProvider.ContextAction(c =>
            {
                _authUsersInitializer.UpdateAllUsersRating(c);
                return true;
            });
            return "Ok";
        }


        [HttpPost]
        // [ApiAntiForgeryValidate]
        public string GroupInitizlize()
        {
            _dbProvider.ContextAction(c =>
            {
                _authUsersInitializer.GroupInitizlize(c);
                return true;
            });

            return "Ok";
        }

        [HttpPost]
        //  [ApiAntiForgeryValidate]
        public string UpdateAllImg()
        {
            _dbProvider.ContextAction(c =>
            {
                _authUsersInitializer.UpdateAllImg(c);
                return true;
            });
            return "Ok";
        }


        [HttpPost]
        // [ApiAntiForgeryValidate]
        public string UpdateUserImg()
        {
            _dbProvider.ContextAction(c =>
            {
                _authUsersInitializer.UpdateUserImg(c);
                return true;
            });

            return "Ok";
        }


        [HttpPost]
        // [ApiAntiForgeryValidate]
        public string DeleteAll()
        {
            _dbProvider.ContextAction(c =>
            {
                _authUsersInitializer.DeleteAll(c);
                return true;
            });
            return "Ok";
        }
    }
}