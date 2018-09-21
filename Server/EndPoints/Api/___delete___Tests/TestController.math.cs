using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using app.Data.InitializeService;
using app.m_GameServise.Map;
using app.m_GameServise.Map.Distance;
using CommonUtils;
using CommonUtils.Map;

namespace app.Api.Tests
{
    public partial class TestController
    {
        /// <summary>
        /// Todo  результаты ен сходятся
        /// </summary>
        /// <returns></returns>
        [HttpGet]  
        public IHttpActionResult MatSphvector()
        {

            var parent = new Vector3(23799.0, -14011.0, -64257.0);
			 
            var firstPlanet = MapGInitializer.CreateFantomPosition(parent, 0.9435, 13,
                new Vector3(-0.0666, 0, -0.0434));
            var clientFirstAbs = new Vector3(23799.572265625, -14010.974609375, -64256.25);
            var clientFirstRelative = clientFirstAbs.CloneDeep();
            clientFirstRelative.Calc(parent, "-");


            var lastPlanet = MapGInitializer.CreateFantomPosition(parent, 16.9304, 45,
                 new Vector3(-0.1595, 0, 0.12));
            var clientLastAbs = new Vector3(23782.201171875, -14013.0947265625, -64257.26953125);
            var clientLastRelative = clientLastAbs.CloneDeep();
            clientLastRelative.Calc(parent, "-");


            //p7 
            //x:-16.91978845523496
            //y:0  
            //z:-0.5993352902154595

            // relative.Calc(parent, "+");


            var firstResult = new
            {
               clientAbs =  clientFirstAbs,
               clientRel =  clientFirstRelative,
			   calculatedRel = firstPlanet

            };
            var lastResult = new
            {
                clientAbs = clientLastAbs,
                clientRel = clientLastRelative,
                calculatedRel = lastPlanet
            };


            var result = new
            {
                parent,
                firstResult,
                lastResult

            };


            return Json(result);
        }


        [HttpGet]
        public IHttpActionResult CalcFleetTimeInSystem()
        {
            var planetToMinPlanet = MapDistanceHelper.CalculatePlanetTransferFleet(1, "DT-CA-2", _mapAdressService, false);
            var planetToLastPlanet = MapDistanceHelper.CalculatePlanetTransferFleet(1, "DT-CA-7", _mapAdressService, false);

            var motherToFirstPlanet = MapDistanceHelper.CalculateMotherTransferFleet(1, "DT-CA-1", _mapAdressService, false);
            var motherTolastPlanet = MapDistanceHelper.CalculateMotherTransferFleet(1, "DT-CA-7", _mapAdressService, false);


            var premMotherToFirstPlanet = MapDistanceHelper.CalculateMotherTransferFleet(1, "DT-CA-1", _mapAdressService, true);
            var premMotherTolastPlanet = MapDistanceHelper.CalculateMotherTransferFleet(1, "DT-CA-7", _mapAdressService, true);

            var premPlanetToMinPlanet = MapDistanceHelper.CalculatePlanetTransferFleet(1, "DT-CA-2", _mapAdressService, true);
            var premPlanetToLastPlanet = MapDistanceHelper.CalculatePlanetTransferFleet(1, "DT-CA-7", _mapAdressService, true);


            //var planetToPlanetMIn = 
            return Json(new
            {
                planetToMinPlanet = planetToMinPlanet.Sec,
                planetToLastPlanet = planetToLastPlanet.Sec,
                motherToFirstPlanet = motherToFirstPlanet.Sec,
                motherTolastPlanet = motherTolastPlanet.Sec,

                premMotherToFirstPlanet = premMotherToFirstPlanet.Sec,
                premMotherTolastPlanet = premMotherTolastPlanet.Sec,
                premPlanetToMinPlanet = premPlanetToMinPlanet.Sec,
                premPlanetToLastPlanet = premPlanetToLastPlanet.Sec

            });
        }

    }
}