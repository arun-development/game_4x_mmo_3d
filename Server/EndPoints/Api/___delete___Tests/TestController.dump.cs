using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.Serialization.Json;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Script.Serialization;
using System.Web.UI.WebControls;
using app.Data.OutModel;
using app.Data.UserService;
using app.HtmlHelpers;
using app.HtmlHelpers.ComplexButton;
using app.m_GameServise.Map;
using app.m_GameServise.Map.Distance;
using Microsoft.VisualBasic;
using Newtonsoft.Json;
using System.Windows.Media.Media3D;
using app.Data.Helper;
using CommonUtils;
using CommonUtils.Battle;
using CommonUtils.m_Store.Productrs;
using CommonUtils.Map;
using CommonUtils.Models;
using CommonUtils.Resources;
using DbModels;
using Newtonsoft.Json.Linq;
using Label = app.ImageService.Label;

namespace app.Api.Tests
{
    public partial class TestController
    {

        [HttpGet]
        public IHttpActionResult Init()
        {
            //return "TestController";
            return TestBattle();
        }


        private IHttpActionResult TestBattle()
        {
            var srcUnits = _gDetailPlanetService.GetPlanetAsync(6).hangar;
            var targetUnits = _gDetailPlanetService.GetPlanetAsync(7).hangar;


            var buttle = BattleFleets.SetUnits(JsonConvert.DeserializeObject<Dictionary<string, int>>(srcUnits),
                JsonConvert.DeserializeObject<Dictionary<string, int>>(targetUnits));
            var b = buttle.Battle();

            var allResult = new
            {
                results = b,
                buttle.Source,
                buttle.Target
            };

            return Json(allResult);
        }


        [HttpGet]
        public IHttpActionResult TestPlanetSearch(string id)
        {
            var planetNames = new List<string>
            {
                "qwe",
                "abv",
                "njk",
                "kkk",
                "www",
                "qqq"
            };
            var planetNames2 = new List<string>
            {
                "update"
            };

            if (id == "wwww")
            {
                return Json(planetNames);
            }
            if (id == "wwwww")
            {
                return Json(planetNames2);
            }
            return Json(planetNames);
        }

        [HttpGet]
        public IHttpActionResult TranslateStoreItem()
        {
            var pr = _productItemService.GetById(1, i => i.property).ToSpecificModel<ProductItemProperty>();
            var text = pr.TranslateText;

            var result = new
            {
                baseNames = text,
                nativeName = pr.TranslateText.En.Name,
                translateName = pr.TranslateText.GetTranslateName()
            };
            return Json(result);
        }

        public IHttpActionResult GetStoreData()
        {
            return Json(_storeService.GetAll());
        }

        public IHttpActionResult GetChestList()
        {
            _userChestHelper.SetUserChest(SessionUser.UserId);

            return Json(_userChestHelper.GetChestUser());
        }

        [HttpGet]
        public IHttpActionResult ProductType(byte id)
        {
            return Json(_productTypeService.GetById(id, i => new
            {
                i.Id,
                i.Name,
                i.property
            }));
        }

        [HttpGet]
        public IHttpActionResult Equals()
        {
            var src = new StorageResources();
            src.InitializeField();
            src.Current.E = 10;
            src.Current.Ir = 15;
            src.Current.Dm = 100;
            src.Max.E = 10;
            src.Max.Ir = 15;
            src.Max.Dm = 100;

            var cloneTrue = src.CloneDeep();
            var cloneFalse = src.CloneDeep();
            cloneFalse.Current.E = 6;

            var otherTrue = new StorageResources();
            otherTrue.InitializeField();
            otherTrue.Current.E = 10;
            otherTrue.Current.Ir = 15;
            otherTrue.Current.Dm = 100;
            otherTrue.Max.E = 10;
            otherTrue.Max.Ir = 15;
            otherTrue.Max.Dm = 100;


            var result = new
            {
                srcEqcloneTrue = src.Equals(cloneTrue),
                srcEqcloneFalse = src.Equals(cloneFalse),
                srcEqotherTrue = src.Equals(otherTrue)
            };
            return Json(result);
        }

        [HttpGet]
        public IHttpActionResult ObjectToDics()
        {
            var s = new StorageResources();
            s.InitializeField();
            s.Current.Init(100, 200, 300);
            s.Max.Init(1000, 1500, 1800);
            var names = new List<string> { "E", "Ir", "Dm" };
            var result = names.Select(name => StorageResourceItem.GetItemByName(s, name)).ToList();


            return Json(result);
        }

        [HttpGet]
        public HttpResponseMessage TesCookie(string name, string val)
        {
            var resp = new HttpResponseMessage();

            var cookie = new CookieHeaderValue(name, val)
            {
                Expires = DateTimeOffset.Now.AddDays(1),
                Domain = Request.RequestUri.Host,
                Path = "/"
            };

            resp.Headers.AddCookies(new[] { cookie });
            return resp;
        }


        [HttpGet]
        public IHttpActionResult TestMapTextures()
        {
            return Json(new
            {
                //  SpaceList = new MapCatalog().CreatePlanetSpaceTextures(),
                //GroundList = new MapCatalog().CreatePlanetGroundTextures()
            });
        }

        [HttpGet]
        public IHttpActionResult GetMapDistance(int source = 1, int target = 2)
        {
            var whidthPremium = MapDistanceHelper.CalculateJumpTime(source, target, _mapAdressService, true);
            var noPremium = MapDistanceHelper.CalculateJumpTime(source, target, _mapAdressService, false);
            return Json(new
            {
                whidthPremium,
                noPremium
            });
        }

        [HttpGet]
        public IHttpActionResult Guid()
        {

            return Json(System.Guid.NewGuid().ToString());
        }

        [HttpGet]
        public IHttpActionResult GetUser(int id = 985)
        {
            return Json(_gameUserService.GetUserPlanshetProfileAsync(id, SessionUser.UserId));
            // return Json("hi");
        }
        [HttpGet]
        public IHttpActionResult SaveMeeds(int id = 985)
        {
            var meeds = new Dictionary<int, MeedDbModel>();
            var m1 = new MeedDbModel
            {
                Id = 1,
                Count = 5
            };
            var m2 = new MeedDbModel
            {
                Id = 2,
                Count = 3
            };
            meeds.Add(m1.Id, m1);
            meeds.Add(m2.Id, m2);
            _userPersonalInfoService.AddMeeds(SessionUser.UserId, meeds);
            return Json(_userPersonalInfoService.GetMeeds(SessionUser.UserId));
            // return Json("hi");
        }




        [HttpPost]
        public async Task<IHttpActionResult> UploadFile()
        {


            var path = "/Content/images/upload/test/";
            if (!Request.Content.IsMimeMultipartContent()) return BadRequest();
            var provider = new MultipartMemoryStreamProvider();
            // путь к папке на сервере
            string root = System.Web.HttpContext.Current.Server.MapPath("~" + path);
            await Request.Content.ReadAsMultipartAsync(provider);

            foreach (var file in provider.Contents)
            {
                var filename = file.Headers.ContentDisposition.FileName.Trim('\"');
                byte[] fileArray = await file.ReadAsByteArrayAsync();

                using (System.IO.FileStream fs = new System.IO.FileStream(root + filename, System.IO.FileMode.Create))
                {
                    await fs.WriteAsync(fileArray, 0, fileArray.Length);
                }
            }
            return Ok("файлы загружены");
        }

        [HttpGet]
        public IHttpActionResult UnitializeNpc()
        {
            _npcInitializer.InitAsync();
            return Json("ok");
        }

        [HttpGet]
        public IHttpActionResult GetNextUserId()
        {
            return Json(_gameUserService.GetNextUserId());
        }

        [HttpGet]
        public IHttpActionResult TestChangeOwner(string name)
        {

            _gDetailPlanetService.Update(_gDetailPlanetService.GetPlanetAsync(1), i =>
            {
                i.owner = name;
            });

            return Json("ok");
        }

        [HttpGet]
        public IHttpActionResult Convert(string name)
        {

            var alliance = new AllianceRatingOut
            {
                AllianceDescription = "descr",
                ComplexButtonView = new ComplexButtonView(),
                Id = 1,
                Name = "allianceName",
                Label = Label.DefaultUrls(),
                HasButtons = true,
                Buttons = new List<ButtonsView>
                {
                    ButtonsView.HangarToggle()
                },
                PvpPoint = 1000,
                LeaderImg = Avatar.DefaultUrls(),
                ControlledPlanet = 10,
                Pilots = 5,
                LeaderName = "LeaderName"
            };


            var myAlliance = new TabMyAllianceOut();
            alliance.ShallowConvert(myAlliance);

            var result = new
            {
                parent = alliance,
                result = myAlliance
            };
            return Json(result);
        }




        [HttpPost]
        public async Task<IHttpActionResult> UploadFileB64(Base64ImageOut file)
        {

            //var avatar = await Avatar.CreateImages(file.Base64File, System.Web.HttpContext.Current.Server, SessionUser.UserId);
            //return Json(avatar);
            return Json("");
        }


        [HttpGet]
        public IHttpActionResult AbsPlanets()
        {
            var planets =
                _gDetailPlanetService.GetAllPlanetAsync()
                    .Where(i => i.g_geometry_planet.starId == 1)
                    .Select(i =>
                    new {Id = i.g_geometry_planet.Id,
                        position = i.g_geometry_planet.fantomAbsPosition.ToSpecificModel<Vector3>()}).ToList(); 

            return Json(planets);
        }


        [HttpGet]
        public IHttpActionResult GetUserRequestInAlliance()
        {
            var messages = _allianceService.GetUserArmRequests(1002);

            return Json(messages);
        }

    }
}