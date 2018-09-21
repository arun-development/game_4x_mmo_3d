using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.DataLayer;
using Server.ServicesConnected.Auth.Static;

namespace Server.EndPoints.Api {
    
    [Authorize(Roles = MainRoles.RDD)]
    public class InitApiController : AppApiController
    {
        protected bool _dontCheckDataBase = false;
        protected void _checkDataBase() {
            if (!_dontCheckDataBase)
            {
                if (_dbProvider.ActiveConnection!= ConnectionNames.HomeDev) {
                    throw new Exception("Is main data context. change context to local");
                }
                //if ((byte)_dbProvider.ActiveConnection > (byte)ConnectionNames.MaxHomeConnection)
                //{

                //    throw new Exception("Is main data context. change context to local");
                //    // todo save log to azure storage
                //}

            }
        }

        public InitApiController(IServiceProvider serviceProvider, bool dontCheckDataBase) :base(serviceProvider) {
 
            if (dontCheckDataBase) {
                _dontCheckDataBase = true;
            }
            else {
                _dontCheckDataBase = false;
                _checkDataBase();
            }
            
        }

        [HttpPost]
        public ActionResult InitApiTest() {
            return Ok("Ok");
        }
    }
}