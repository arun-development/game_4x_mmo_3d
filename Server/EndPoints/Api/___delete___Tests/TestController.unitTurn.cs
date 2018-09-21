using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using app.m_GameServise.Demons;
using app.m_GameServise.Demons.Factory;
using app.m_GameServise.Demons.Runners;
using app.m_GameServise.QueuesModel.Fields;
using app.m_Utilites;
using CommonUtils.m_Store.Premium;
using CommonUtils.Models;
using CommonUtils.Unit;
using Newtonsoft.Json;

namespace app.Api.Tests
{
    public partial class TestController
    {
        [HttpGet]
        public IHttpActionResult UnitTurn()
        {
            SetNewPremiumData();

            var units = SetUnitProgress();
            DbG.user_mothership.Single(m => m.user_id == GameUserService.Id).unitProgress = JsonConvert.SerializeObject(units);
            DbG.SubmitChanges();

            var unitBefore = DbG.user_mothership.Single(m => m.user_id == GameUserService.Id).unitProgress;

            new Synchronizer().UserMothership(GameUserService, true);


            var result = new
            {
                UnitsBefore = JsonConvert.DeserializeObject<Dictionary<string, TurnedUnit>>(unitBefore),
                Unitsafter = GetUnitsAfter()
            };
            return Json(result);
        }

        private void ClearPremium()
        {
            var prem = DbG.premium.Single(p => p.user_id == GameUserService.Id);
            prem.endTime = UnixTime.UtcNow();
            prem.data = "{}";
            prem.finished = true;
            DbG.SubmitChanges();
        }

        private void SetNewPremiumData()
        {
            var prem = DbG.premium.Single(p => p.user_id == GameUserService.Id);
            var data = EmulatePremiumData();


            var time = UnixTime.UtcNow();
            var lastItem = data.Last().Value;

            prem.data = JsonConvert.SerializeObject(data);
            prem.finished = !(time < lastItem.DateEndTime);
            prem.endTime = lastItem.DateEndTime;
            DbG.SubmitChanges();
        }

        private Dictionary<string, TurnedUnit> GetUnitsAfter()
        {
            return
                JsonConvert.DeserializeObject<Dictionary<string, TurnedUnit>>(
                    DbG.user_mothership.Single(m => m.user_id == GameUserService.Id).unitProgress);
        }

        private Dictionary<string, TurnedUnit> SetUnitProgress()
        {
            var time = UnixTime.UtcNow();
            var delay = 11000;
            var units = new Dictionary<string, TurnedUnit>();

            var turFrig = new TurnedUnit
            {
                DateLastUpgrade = time - delay,
                DateCreate = time - delay,
                ReadyUnits = 0,
                TotalCount = 100,
                UnitName = Frigate.NativeName
            };
            units.Add(Frigate.NativeName, turFrig);
            return units;
        }

        private Dictionary<int, UserPremiumtHistory> EmulatePremiumData()
        {
            var time = UnixTime.UtcNow();
            var duration = 1000;
            var time1 = time - 10000;

            var time2 = time - 5000;
            var time3 = time;

            var data = new Dictionary<int, UserPremiumtHistory>
            {
                {0, new UserPremiumtHistory {Duration = duration, DateEndTime = time1 + duration, DateActivate = time1}},
                {1, new UserPremiumtHistory {Duration = duration, DateEndTime = time2 + duration, DateActivate = time2}},
                {2, new UserPremiumtHistory {Duration = duration, DateEndTime = time3 + duration, DateActivate = time3}}
            };
            return data;
        }


        [HttpGet]
        public IHttpActionResult PlanetSinch()
        {
            //new Synchronizer().UserPlanet(GameUserService, true);

            return Json("ok");
        }



        [HttpGet]
        public IHttpActionResult MotherSinch()
        {
            //new Synchronizer().UserPlanet(GameUserService, true);
            //new Synchronizer().Start(new PlanetFactory());
            new MotherRunner();

            return Json("ok");
        }
    }
}