using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Server.Core.Interfaces;

namespace Server.EndPoints.Api.InicializeData
{
    [Route("api/mapG/[action]")]
 
    public class MapGApiController : InitApiController
    {
        #region Declare

        private readonly IMapGInitializer _mapGInitializer;

        public MapGApiController(IServiceProvider serviceProvider) : base(serviceProvider,false)
        {
            _mapGInitializer = _svp.GetService<IMapGInitializer>();
        }

        #endregion


        [HttpPost]
        public IActionResult Init()
        {
            _dbProvider.ContextAction(c =>
            {
                _mapGInitializer.Init(c);
                return true;
            });

            return Json("ok");
        }


        [HttpPost]
        public IActionResult CreateAll()
        {
            _dbProvider.ContextAction(c =>
            {
                _mapGInitializer.CreateAll(c);
                return true;
            });

            return Json("Sucsess");
        }

        /// <summary>
        ///     todo чистить локальное хранилищие на клиенте в игре после использования этого метода
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IActionResult DeleteAll()
        {
            _dbProvider.ContextAction(c =>
            {
                _mapGInitializer.DeleteAll(c);
                return true;
            });

            return Json("Sucsess");
        }


        [HttpPost]
        public IActionResult CreateMoon()
        {
            _dbProvider.ContextAction(c =>
            {
                _mapGInitializer.CreateMoons(c);
                return true;
            });

            return Json("Sucsess");
        }


        [HttpPost]
        public IActionResult UpdateSectorsToArchForm()
        {
            _dbProvider.ContextAction(c =>
            {
                _mapGInitializer.UpdateSectorsToArchForm(c);
                return true;
            });

            return Json("Sucsess");
        }

        [HttpGet]
        public IActionResult UpdateStarEnergyBonus()
        {
            _dbProvider.ContextAction(c =>
            {
                _mapGInitializer.UpdateStarEnergyBonuses(c);
                return true;
            });

            return Json("Sucsess");
        }


        [HttpPost]
        public IActionResult CreateSectors()
        {
            _dbProvider.ContextAction(c =>
            {
                _mapGInitializer.CreateSectors(c);
                return true;
            });

            return Json("Sucsess");
        }


        [HttpPost]
        public IActionResult CreateSystemGeometry()
        {
            _dbProvider.ContextAction(c =>
            {
                _mapGInitializer.CreateSystemGeometries(c);
                return true;
            });

            return Json("Sucsess");
        }
    }
}