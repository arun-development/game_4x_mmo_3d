using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Options;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using TestDbNoDepenceApp.DapperCore.Infrastructure;

namespace TestDbNoDepenceApp.DapperCore
{
    [TestClass]
    //todo посмотреть SqlBulkCopy  https://msdn.microsoft.com/en-us/library/system.data.sqlclient.sqlbulkcopy.aspx
    public class TestDapperCore
    {
        #region Declare

        private readonly ITestDbProvider _provider;
        private readonly ITestDapperCoreRepository _repo;

        public TestDapperCore()
        {
            var opts = Options.Create(new TestConnectionOptions
            {
                Test = TestDataConnection.TestConnecttion
            });
            _provider = new TestDbProvider(opts);
            _repo = new TestDapperCoreRepository(_provider);
        }

        #endregion

        private test_dapper_core_item _createItem() => new test_dapper_core_item
        {
            value_1 = Guid.NewGuid().ToString(),
            value_2 = Guid.NewGuid().ToString()
        };

        [TestMethod]
        public void TestAdd()
        {
            var id = 0;
            _provider.ContextAction(c =>
            {
                var item = _repo.AddOrUpdate(c, _createItem());
                id = item.Id;
                _repo.DeleteAll(c);
            });
            Assert.AreNotEqual(0, id);
        }

        [TestMethod]
        public void TestUpdateByUpsert()
        {
            var oldVal = "";
            var newVal = Guid.NewGuid().ToString();
            var getValue = "";

            var onCreateCount = 0;
            var afterUpdateCount = 0;

            _provider.ContextAction(c =>
            {
                _repo.DeleteAll(c);
                var item = _repo.AddOrUpdate(c, _createItem());
                oldVal = item.value_1;
                onCreateCount = _repo.GetAll(c).Count;
                var upd = _createItem();
                upd.Id = item.Id;
                upd.value_1 = newVal;
                _repo.AddOrUpdate(c, upd);
                afterUpdateCount = _repo.GetAll(c).Count;

                var get = _repo.GetById(c, item.Id);
                getValue = get.value_1;

                _repo.DeleteAll(c);
            });

            Assert.IsFalse(onCreateCount == 0);
            Assert.IsFalse(afterUpdateCount == 0);
            Assert.IsTrue(onCreateCount == afterUpdateCount);
            Assert.IsTrue(!string.IsNullOrWhiteSpace(oldVal));

            Assert.AreNotEqual(oldVal, newVal);
            Assert.AreEqual(newVal, getValue);
        }

        /// <summary>
        ///     Вывает AddOpUpdate  для каждого эллемента коллекции,
        ///     Метод медленный  смотреть <see cref="TestInsertManyPerItemTime"/>  но  необходим для   коллекций которые
        ///     возвращают результат  
        /// </summary>
        [TestMethod]
        public void TestInsertManyPerItemByUpsert()
        {
            var createdList = new List<test_dapper_core_item> { _createItem(), _createItem() };
            List<test_dapper_core_item> insertedList = null;


            _provider.ContextAction(c =>
            {
                _repo.DeleteAll(c);
                insertedList = (List<test_dapper_core_item>)_repo.AddOrUpdate(c, createdList);
                _repo.DeleteAll(c);
            });
            Assert.IsNotNull(insertedList);
            Assert.AreEqual(insertedList.Count, createdList.Count);
            Assert.IsTrue(insertedList.TrueForAll(i => i.Id > 0));
        }

        #region Time

        /// <summary>
        ///     todo  0,001338252 sec/item   0,00124396922 (10000)
        /// на порядок медленее <see cref="TestInsertAndGetTime"/>   но надежнее
        /// </summary>
        [TestMethod]
        public void TestInsertManyPerItemTime()
        {
            var list = new List<test_dapper_core_item>();
            var insertCount = 10000;
            var setartTime = default(DateTime);
            var endCreateTime = default(DateTime);
            var endDeleteTime = default(DateTime);
            for (var i = 0; i <= insertCount; i++)
            {
                list.Add(_createItem());
            }
            List<test_dapper_core_item> result = null;

            _provider.ContextAction(c =>
            {
                _repo.DeleteAll(c);
                setartTime = DateTime.UtcNow;
                result = (List<test_dapper_core_item>)_repo.AddOrUpdate(c, list);
                endCreateTime = DateTime.UtcNow;
                _repo.DeleteAll(c);
                endDeleteTime = DateTime.UtcNow;
            });

            var deltaCreateTime = endCreateTime - setartTime;

            var deleteEndTime = endDeleteTime - setartTime;
            var deltaDeleteTime = deleteEndTime - deltaCreateTime;
            var totalseconds = deleteEndTime.TotalMilliseconds / 1000;
            var timePerItem = totalseconds / insertCount;


            Console.WriteLine($"deltaCreateTime :{deltaCreateTime}");
            Console.WriteLine($"deltaDeleteTime :{deltaDeleteTime}");
            Console.WriteLine($"totalseconds :{totalseconds}");
            Console.WriteLine($"timePerItem :{timePerItem}");
        }
        /// <summary>
        ///     todo  0,0013024487 sec/item (1000)   0,00124024284(10000)
        ///  Пагинация не имеет смысла
        /// <see cref="TestInsertManyPerItemTime"/>
        /// </summary>
        [TestMethod]
        public void TestInsertManyPerItemPaginationTime()
        {

            var insertCount = 1000;
            var setartTime = default(DateTime);
            var endCreateTime = default(DateTime);
            var endDeleteTime = default(DateTime);
            var paginatedList = new List<List<test_dapper_core_item>> { new List<test_dapper_core_item>() };
            var perPageSize = 100;


            var pageIndex = 0;
            var pages = 0;

            for (var i = 0; i <= insertCount; i++)
            {

                if (pages == perPageSize)
                {
                    pages = 0;
                    pageIndex++;
                }
                if (pages == 0)
                {
                    paginatedList.Add(new List<test_dapper_core_item>());
                }

                paginatedList[pageIndex].Add(_createItem());

            }



            List<test_dapper_core_item> result = new List<test_dapper_core_item>();

            _provider.ContextAction(c =>
            {
                _repo.DeleteAll(c);
                setartTime = DateTime.UtcNow;
                foreach (var i in paginatedList)
                {
                    result.AddRange(_repo.AddOrUpdate(c, i));
                }
                endCreateTime = DateTime.UtcNow;
                _repo.DeleteAll(c);
                endDeleteTime = DateTime.UtcNow;
            });

            var deltaCreateTime = endCreateTime - setartTime;

            var deleteEndTime = endDeleteTime - setartTime;
            var deltaDeleteTime = deleteEndTime - deltaCreateTime;
            var totalseconds = deleteEndTime.TotalMilliseconds / 1000;
            var timePerItem = totalseconds / insertCount;


            Console.WriteLine($"deltaCreateTime :{deltaCreateTime}");
            Console.WriteLine($"deltaDeleteTime :{deltaDeleteTime}");
            Console.WriteLine($"totalseconds :{totalseconds}");
            Console.WriteLine($"timePerItem :{timePerItem}");
        }


        /// <summary>
        ///     todo 0,000235808008008008 sec/item(create - 999 items)  max rows must be lower 1000 other  - error;
        ///     метод в целом не надежен может упасть при конвертации, при количестве,
        ///     лучше исправить код на воид и использовать дапперский инсерт.
        ///     или использвать более продуманное решение например bulk transact sql
        ///     так же можно посмотреть в сторону уменьшения количества строк
        ///     https://www.red-gate.com/simple-talk/sql/performance/comparing-multiple-rows-insert-vs-single-row-insert-with-three-data-load-methods/
        /// </summary>
        [TestMethod]
        public void TestInsertAndGetTime()
        {
            var list = new List<test_dapper_core_item>();
            var insertCount = 999;
            var setartTime = default(DateTime);
            var endCreateTime = default(DateTime);
            var endDeleteTime = default(DateTime);
            for (var i = 0; i <= insertCount; i++)
            {
                list.Add(_createItem());
            }

            _provider.ContextAction(c =>
            {
                _repo.DeleteAll(c);
                setartTime = DateTime.UtcNow;
                _repo.InsertAndGet(c, list);
                endCreateTime = DateTime.UtcNow;
                _repo.DeleteAll(c);
                endDeleteTime = DateTime.UtcNow;
            });

            var deltaCreateTime = endCreateTime - setartTime;

            var deleteEndTime = endDeleteTime - setartTime;
            var deltaDeleteTime = deleteEndTime - deltaCreateTime;
            var totalseconds = deleteEndTime.TotalMilliseconds / 1000;
            var timePerItem = totalseconds / insertCount;


            Console.WriteLine($"deltaCreateTime :{deltaCreateTime}");
            Console.WriteLine($"deltaDeleteTime :{deltaDeleteTime}");
            Console.WriteLine($"timePerItem :{timePerItem}");
        }

        #endregion

 

        [TestMethod]
        public void TestExecInsertMany()
        {
            var result = false;

            var list = new List<test_dapper_core_item> { _createItem(), _createItem() };
            var count = 0;

            _provider.ContextAction(c =>
            {
                _repo.DeleteAll(c);
                result = _repo.ExecInsertMany(c, list);
                count = _repo.GetAll(c).Count;
                _repo.DeleteAll(c);
            });
            Assert.IsTrue(result);
            Assert.AreEqual(count, list.Count);
        }


        /// <summary>
        ///     todo 0,000243439649 sec/item (create - 100000 items) 0,00024190164  sec/item(10000)
        /// </summary>
        [TestMethod]
        public void TestTimeExecMany()
        {
            var result = false;

            var list = new List<test_dapper_core_item>();
            var insertCount = 10000;
            for (var i = 0; i <= insertCount; i++)
            {
                list.Add(_createItem());
            }
            var setartTime = default(DateTime);
            var endCreateTime = default(DateTime);
            var endDeleteTime = default(DateTime);


            _provider.ContextAction(c =>
            {
                _repo.DeleteAll(c);
                setartTime = DateTime.UtcNow;
                result = _repo.ExecInsertMany(c, list);
                endCreateTime = DateTime.UtcNow;
                _repo.DeleteAll(c);
                endDeleteTime = DateTime.UtcNow;
            });

            var deltaCreateTime = endCreateTime - setartTime;

            var deleteEndTime = endDeleteTime - setartTime;
            var deltaDeleteTime = deleteEndTime - deltaCreateTime;
            var totalseconds = deleteEndTime.TotalMilliseconds / 1000;
            var timePerItem = totalseconds / insertCount; //0,249s per 10000


            Console.WriteLine($"deltaCreateTime :{deltaCreateTime}");
            Console.WriteLine($"deltaDeleteTime :{deltaDeleteTime}");
            Console.WriteLine($"timePerItem :{timePerItem}");
            Assert.IsTrue(result);
        }

        [TestMethod]
        public void TestUpdateSingleItem()
        {
            var updated = false;
            var oldValue = "";
            var newValue = Guid.NewGuid().ToString();
            var getValue = "";

            _provider.ContextAction(c =>
            {
                _repo.DeleteAll(c);
                var item = _repo.AddOrUpdate(c, _createItem());
                oldValue = item.value_1;
                item.value_1 = newValue;
                updated = _repo.Update(c, item);
                getValue = _repo.GetById(c, item.Id).value_1;

                _repo.DeleteAll(c);
            });
            Assert.IsTrue(updated);
            Assert.IsTrue(string.IsNullOrWhiteSpace(oldValue));
            Assert.AreEqual(getValue, newValue);
        }

        [TestMethod]
        public void TestInsertAndGet()
        {
            var list = new List<test_dapper_core_item> { _createItem(), _createItem() };
            var lisIds = new List<int>();

            _provider.ContextAction(c =>
            {
                _repo.DeleteAll(c);
                var items = _repo.InsertAndGet(c, list);
                lisIds.AddRange(items.Select(item => item.Id));
                _repo.DeleteAll(c);
            });

            Assert.AreEqual(2, lisIds.Count);
            Assert.IsTrue(lisIds.TrueForAll(i => i != 0));
        }

    }
}