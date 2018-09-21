using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using Auth;
using DbModels;
using DomainModels.StaticData;
using DomainModels.СompexPrimitive;
using TestDbModule;

namespace app.Api
{
    //[Authorize(Roles = MainRoles.Root +","+ MainRoles.User)]
    [Authorize(Roles = MainRoles.Root)]
    public class TestDbController : ApiController
    {
        private readonly IGameDataContextProvider _provider;
        private readonly TestDb.ITestDbRelationService _relationService;
        private readonly TestDb.ITestLocalStorageCache _storageCache;
        private readonly TestDb.ITestDbRelationLocalStorageCache _storageRelationCache;
        private readonly TestDb.ITestRepo _testRepo;
        private readonly TestDb.ITestService _testService;

        public TestDbController(TestDb.ITestService service, TestDb.ITestLocalStorageCache storageCache,
            TestDb.ITestDbRelationService relationService, TestDb.ITestRepo testRepo,
            TestDb.ITestDbRelationLocalStorageCache storageRelationCache)
        {
            _testService = service;
            _storageCache = storageCache;
            _relationService = relationService;
            _testRepo = testRepo;
            _storageRelationCache = storageRelationCache;
        }

        #region LocalStorageCache Combine requests

        [HttpGet]
        public async Task<IHttpActionResult> LocalFilterByParentId(int count = 100)
        {
            var listKeys = new List<int>();
            for (var i = 1; i <= count; i++) listKeys.Add(i);
            var startTime = UnixTime.UtcNowMs();
            var result = await _storageRelationCache.LocalWhereAsync(i => listKeys.Contains(i.Id));
            var endTime = UnixTime.UtcNowMs();
            var delta = endTime - startTime;
            return Json(new
            {
                delta,
                //result
            });
        }

        [HttpGet]
        public async Task<IHttpActionResult> AddOrUpdate(int id = -1)
        {
            var startTime = UnixTime.UtcNowMs();
            TestDb.TestDataModel model;
            if (id != -1)
            {
                model = new TestDb.TestDataModel {Id = id, HasChange = true, Value = "qwe"};
            }
            else
            {
                model = new TestDb.TestDataModel {HasChange = true, Value = "qwe"};
            }

            var result = await _testService.AddOrUpdate(model);
            var endTime = UnixTime.UtcNowMs();
            var delta = endTime - startTime;
            return Json(new
            {
                delta,
                result
            });
        }

        [HttpGet]
        public async Task<IHttpActionResult> AddOrUpdateList(int count = 10)
        {
            var startTime = UnixTime.UtcNowMs();
            var result = await _testService.AddOrUpdateList(true, count);
            var endTime = UnixTime.UtcNowMs();
            var delta = endTime - startTime;
            return Json(new
            {
                delta,
                result
            });
        }

        #endregion

        #region Service and Reposutory

        public async Task<IHttpActionResult> Get(int id = 1)
        {
            var startTime = UnixTime.UtcNowMs();
            var result = await _testService.CetComplicatedData(id);
            var endTime = UnixTime.UtcNowMs();
            var delta = endTime - startTime;
            return Json(new
            {
                delta,
                Result = result
            });
        }

        public async Task<IHttpActionResult> GetByCount(int count = 10)
        {
            var startTime = UnixTime.UtcNowMs();
            var result = await _testService.GetByCount(count);
            var endTime = UnixTime.UtcNowMs();
            var delta = endTime - startTime;
            return Json(new
            {
                delta,
                //Result = result
            });
        }

        public async Task<IHttpActionResult> GetAll()
        {
            var startTime = UnixTime.UtcNowMs();
            var result = await _testService.GetAll();
            var endTime = UnixTime.UtcNowMs();
            var delta = endTime - startTime;

            return Json(new
            {
                delta,
                result
            });
        }

        [HttpGet]
        public async Task<IHttpActionResult> Create(int count = 10)
        {
            var startTime = UnixTime.UtcNowMs();

            await _testService.Create(count);
            var endCreateTime = UnixTime.UtcNowMs();

            var result = await _testService.GetAll();

            var endFull = UnixTime.UtcNowMs();

            var deltaCreateTime = endCreateTime - startTime;
            var deltaFullTime = endFull - startTime;
            var deltaAfterCreateToGet = endFull - endCreateTime;

            return Json(new {result, deltaCreateTime, deltaFullTime, deltaAfterCreateToGet});
        }

        [HttpGet]
        public async Task<IHttpActionResult> DeleteAll()
        {
            var startTime = UnixTime.UtcNowMs();
            await _testService.DeleteAll();
            var endTime = UnixTime.UtcNowMs();
            var delta = endTime - startTime;
            return Json(new
            {
                delta
            });
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAllProcedure()
        {
            var startTime = UnixTime.UtcNowMs();
            var result = await _testService.GetAllProcedure();
            var endTime = UnixTime.UtcNowMs();
            var delta = endTime - startTime;
            var r = new {delta, result};
            return Json(r);
        }

        [HttpGet]
        public async Task<IHttpActionResult> DeleteAllProcedure()
        {
            var startTime = UnixTime.UtcNowMs();

            await _testService.DeleteAllProcedure();
            var endCreateTime = UnixTime.UtcNowMs();

            // var result = await _testService.GetAll();

            var endFull = UnixTime.UtcNowMs();

            var deltaCreateTime = endCreateTime - startTime;
            var deltaFullTime = endFull - startTime;
            var deltaAfterCreateToGet = endFull - endCreateTime;


            //return Json(new { deltaCreateTime, deltaFullTime, deltaAfterCreateToGet, result });
            return Json("ok");
        }

        [HttpGet]
        public async Task<IHttpActionResult> CycleCreate(int count, int repeat)
        {
            var result = new Dictionary<string, object>();

            long totalTime = 0;

            for (var i = 0; i <= repeat; i++)
            {
                if (i == 0)
                {
                    await _testService.DeleteAllProcedure();
                    continue;
                }

                var startTime = UnixTime.UtcNowMs();
                await _testService.Create(count);
                var endCreateTime = UnixTime.UtcNowMs();

                await _testService.GetAllProcedure();
                var endGet = UnixTime.UtcNowMs();

                await _testService.DeleteAllProcedure();
                var endDeleteTime = UnixTime.UtcNowMs();


                var deltaCreateTime = endCreateTime - startTime;
                var deltaGet = endGet - endCreateTime;
                var deltaDeleteTime = endDeleteTime - endGet;
                var fullTime = endDeleteTime - startTime;
                totalTime += fullTime;
                result.Add("iteration_" + i, new
                {
                    Iteration = i,
                    deltaCreateTime,
                    deltaGet,
                    deltaDeleteTime,
                    fullTime
                });
            }
            result.Add("___________TOTAL_TIME__________", totalTime);

            return Json(result);
        }


        [HttpGet]
        public async Task<IHttpActionResult> UpdateWidhtCheck()
        {
            var startTime = UnixTime.UtcNowMs();

            await _testService.UpdateWidhtCheck();
            var endCreateTime = UnixTime.UtcNowMs();

            var result = _testService.GetAll();

            var endFull = UnixTime.UtcNowMs();

            var deltaUpdateTime = endCreateTime - startTime;
            var deltaFullTime = endFull - startTime;
            var deltaAfterCreateToGet = endFull - endCreateTime;


            return Json(new {deltaUpdateTime, deltaFullTime, deltaAfterCreateToGet, result});
        }

        [HttpGet]
        public async Task<IHttpActionResult> UpdateWrite(bool val = true)
        {
            var startTime = UnixTime.UtcNowMs();

            await _testService.UpdateWidhtCheck();
            var endCreateTime = UnixTime.UtcNowMs();

            var result = _testService.GetAll();

            var endFull = UnixTime.UtcNowMs();

            var deltaUpdateTime = endCreateTime - startTime;
            var deltaFullTime = endFull - startTime;
            var deltaAfterCreateToGet = endFull - endCreateTime;

            return Json(new {deltaUpdateTime, deltaFullTime, deltaAfterCreateToGet, result});
        }

        [HttpGet]
        public async Task<IHttpActionResult> GenerateBigData(int? count = null)
        {
            await _testService.GenerateBigData(count);
            return Json("ok");
        }

        #endregion

        #region LocalStorageCache Base

        [HttpGet]
        public async Task<IHttpActionResult> LocalGetById(int id = 1)
        {
            var startTime = UnixTime.UtcNowMs();
            var result = await _storageCache.GetByIdAsync(id, true);
            if (result == null) throw new NullReferenceException(Error.NoData);
            var endTime = UnixTime.UtcNowMs();
            var delta = endTime - startTime;
            return Json(new
            {
                delta,
                //result
            });
        }

        //todo  какая  ошибка с логикой  при смене запроса следующий запрос выполняется очень долго предположительно из за кэша (убрал ограничитель все сзапросы стали на 200.000=>{"delta":157})
        /// <summary>
        ///     1000=>{"delta":1}
        ///     10000=>{"delta":10828}
        ///     10000=>{"delta":16}
        ///     100000=>{"delta":109346}
        ///     100000=>{"delta":150}
        /// </summary>
        /// <param name="count"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IHttpActionResult> LocalGetDataModelItems(int count)
        {
            var listKeys = new List<int>();
            for (var i = 1; i <= count; i++) listKeys.Add(i);
            var startTime = UnixTime.UtcNowMs();
            var result = await _storageCache.GetDataModelItemsAsync(listKeys);
            var endTime = UnixTime.UtcNowMs();
            var delta = endTime - startTime;
            return Json(new
            {
                delta,
                result
            });
        }

        /// <summary>
        ///     deviated usually 2-3 time to time ~15
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IHttpActionResult> LocalGetFromDbByIdAndSetToLocal(int id = 1)
        {
            var startTime = UnixTime.UtcNowMs();
            var result = await _storageCache.GetFromDbByIdAndSetToLocalAsync(id);
            var endTime = UnixTime.UtcNowMs();
            var delta = endTime - startTime;
            return Json(new
            {
                delta,
                result
            });
        }

        [HttpGet]
        public Task<IHttpActionResult> LocalSaveToLocal(int id = 1)
        {
            throw new NotImplementedException();
            //var item = await _storageCache.SaveToLocal(id);
            //return Json(item);
        }

        /// <summary>
        ///     medium =21ms*200.000elems
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IHttpActionResult> LocalGetLocalStorageKeys(int id = 1)
        {
            var startTime = UnixTime.UtcNowMs();
            var result = await _storageCache.GetLocalStorageKeysAsync();
            var endTime = UnixTime.UtcNowMs();
            var delta = endTime - startTime;
            return Json(new
            {
                delta,
                //result
            });
        }


        [HttpGet]
        public async Task<IHttpActionResult> Insert(int id = -1)
        {
            ////__provider
            //var item = new TestDb.TestDataModel();
            //var dbItem = new test_db();
            //dbItem.hasChange = true;
            //dbItem.

            //return Json(new
            //{

            //    result
            //});
            return Json("ok");
        }

        #endregion

        #region LocalStorageCache Relation

        [HttpGet]
        public async Task<IHttpActionResult> LocalRelationGetById(int id = 1)
        {
            var startTime = UnixTime.UtcNowMs();
            var result = await _storageRelationCache.GetByIdAsync(id, true);
            if (result == null) throw new NullReferenceException(Error.NoData);
            var endTime = UnixTime.UtcNowMs();
            var delta = endTime - startTime;
            return Json(new
            {
                delta,
                //result
            });
        }

        //todo  какая  ошибка с логикой  при смене запроса следующий запрос выполняется очень долго предположительно из за кэша (убрал ограничитель все сзапросы стали на 200.000=>{"delta":157})
        /// <summary>
        ///     1000=>{"delta":1}
        ///     10000=>{"delta":10828}
        ///     10000=>{"delta":16}
        ///     100000=>{"delta":109346}
        ///     100000=>{"delta":150}
        /// </summary>
        /// <param name="count"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IHttpActionResult> LocalRelationGetDataModelItems(int count)
        {
            var listKeys = new List<int>();
            for (var i = 1; i <= count; i++) listKeys.Add(i);
            var startTime = UnixTime.UtcNowMs();
            var result = await _storageRelationCache.GetDataModelItemsAsync(listKeys);
            var endTime = UnixTime.UtcNowMs();
            var delta = endTime - startTime;
            return Json(new
            {
                delta,
                //result
            });
        }

        /// <summary>
        ///     deviated usually 2-3 time to time ~15
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IHttpActionResult> LocalRelationGetFromDbByIdAndSetToLocal(int id = 1)
        {
            var startTime = UnixTime.UtcNowMs();
            var result = await _storageRelationCache.GetFromDbByIdAndSetToLocalAsync(id);
            var endTime = UnixTime.UtcNowMs();
            var delta = endTime - startTime;
            return Json(new
            {
                delta,
                result
            });
        }

        [HttpGet]
        public Task<IHttpActionResult> LocalRelationSaveToLocal(int id = 1)
        {
            throw new NotImplementedException();
            //var item = await _storageCache.SaveToLocal(id);
            //return Json(item);
        }

        /// <summary>
        ///     medium =21ms*200.000elems
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IHttpActionResult> LocalRelationGetLocalStorageKeys(int id = 1)
        {
            var startTime = UnixTime.UtcNowMs();
            var result = await _storageRelationCache.GetLocalStorageKeysAsync();
            var endTime = UnixTime.UtcNowMs();
            var delta = endTime - startTime;
            return Json(new
            {
                delta,
                //result
            });
        }

        #endregion

        #region relationService

        [HttpGet]
        public async Task<IHttpActionResult> GetRelation(int id = 1)
        {
            var startTime = UnixTime.UtcNowMs();
            var result = await _relationService.CetComplicatedData(_testService, id);
            var endTime = UnixTime.UtcNowMs();
            var delta = endTime - startTime;

            return Json(new
            {
                delta,
                //result
            });
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetRelationByCount(int count = 10)
        {
            var startTime = UnixTime.UtcNowMs();
            var result = await _relationService.GetByCount(count);
            var endTime = UnixTime.UtcNowMs();
            var delta = endTime - startTime;

            return Json(new
            {
                delta,
                result
            });
        }

        [HttpGet]
        public async Task<IHttpActionResult> CreateRelation(int count = 10)
        {
            var startTime = UnixTime.UtcNowMs();

            await _relationService.Create(_testService, count);
            var endTime = UnixTime.UtcNowMs();
            var delta = endTime - startTime;

            return Json(new
            {
                delta,
                //result
            });
        }

        [HttpGet]
        public async Task<IHttpActionResult> DeleteAllRelation()
        {
            var startTime = UnixTime.UtcNowMs();

            await _relationService.DeleteAllProcedure();
            var result = await _relationService.GetAll();
            var endTime = UnixTime.UtcNowMs();
            var delta = endTime - startTime;

            return Json(new
            {
                delta,
                result
            });
        }

        [HttpGet]
        public async Task<IHttpActionResult> GenerateRelationBigData(int? count = null)
        {
            await _relationService.GenerateBigData(_testRepo);
            return Json("ok");
        }

        #endregion
    }
}