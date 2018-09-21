using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using app.m_GameServise.BuildModel;
using app.m_GameServise.QueuesModel.Fields;
using CommonUtils.Models;
using CommonUtils.Resources;
using Newtonsoft.Json;

namespace app.Api.Tests
{
    public partial class TestController
    {
        [HttpGet]
        public IHttpActionResult Cache()
        {
            var data = DbG.g_detail_planet.Select(i => new
            {
                i.Id,
                i.owner,
                hangar = JsonConvert.DeserializeObject<Dictionary<string, int>>(i.hangar),
                resources = JsonConvert.DeserializeObject<StorageResources>(i.resources),
                unitProgress =
                    (string.IsNullOrWhiteSpace(i.unitProgress))
                        ? new Dictionary<string, TurnedUnit>()
                        : JsonConvert.DeserializeObject<Dictionary<string, TurnedUnit>>(i.unitProgress),
                i.alliance,
                buildStorage = JsonConvert.DeserializeObject<ItemProgress>(i.buildStorage),
                turels = JsonConvert.DeserializeObject<ItemProgress>(i.turels),
                i.name,
                buildEnergyConverter = JsonConvert.DeserializeObject<ItemProgress>(i.buildEnergyConverter),
                buildExtractionModule = JsonConvert.DeserializeObject<ItemProgress>(i.buildExtractionModule),
                buildSpaceShipyard = JsonConvert.DeserializeObject<ItemProgress>(i.buildSpaceShipyard),
                i.dangerLevel,
                i.description,
                i.lastActive
            }).ToList();
            return new TextResult(data, Request);
            //return Json(data);
        }
    }

    public class TextResult : IHttpActionResult
    {
        private readonly HttpRequestMessage _request;
        private readonly object _value;

        public TextResult(object value, HttpRequestMessage request)
        {
            _value = value;
            _request = request;
        }

        public async Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
        {
            var response = new HttpResponseMessage
            {
                Content = new ObjectContent(_value.GetType(), _value, new JsonMediaTypeFormatter()),
                RequestMessage = _request
            };
            response.Headers.CacheControl = new CacheControlHeaderValue
            {
                MaxAge = TimeSpan.FromMinutes(1200)
            };

            return await Task.FromResult(response);
        }
    }
}