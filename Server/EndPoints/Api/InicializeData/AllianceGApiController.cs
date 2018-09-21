using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Server.Core.Interfaces;
using Server.DataLayer;

namespace Server.EndPoints.Api.InicializeData
{
    [Route("api/AllianceG/[action]")]
    public class AllianceGApiController : InitApiController
    {
        private readonly IAllianceInitializer _allianceInitializer;

        public AllianceGApiController(IServiceProvider serviceProvider) : base(serviceProvider, false)
        {
            _allianceInitializer = _svp.GetService<IAllianceInitializer>();
        }

        [HttpPost]
       // [ApiAntiForgeryValidate]
        public IActionResult Init()
        {
            DeleteAll();
            //            CreateFakeAlliances();
            //            AddUserToAlliance();
            //            AddUserRole();
            //SetUserPlanet();
            //            CreateAllianceRating();

            //            CreateAllianceImgsAsync();
            return Json("Ok");
        }




        [HttpPost]
      //  [ApiAntiForgeryValidate]
        public IActionResult CreateAllianceRating()
        {
            _dbProvider.ContextAction(c =>
            {
                _allianceInitializer.CreateAllianceRating(c);
                return true;

            });
 
            return Json("Ok");
        }



        [HttpPost]
      //  [ApiAntiForgeryValidate]
        private IActionResult AddUserRole()
        {
            _dbProvider.ContextAction(c =>
            {
                _allianceInitializer.AddUserRole(c);
                return true;

            });
 

            return Json("Ok");
        }



        [HttpPost]
       // [ApiAntiForgeryValidate]
        public IActionResult SetUserPlanet()
        {
            _dbProvider.ContextAction(c =>
            {
                _allianceInitializer.SetUserPlanet(c);
                return true;

            });
 
            return Json("Ok");
        }



        [HttpPost]
      //  [ApiAntiForgeryValidate]
        public IActionResult DeleteAll()
        {
            _dbProvider.ContextAction(c =>
            {
                _allianceInitializer.DeleteAll(c);
                return true;
                
            });
 
            return Json("Ok");
        }
    }
}