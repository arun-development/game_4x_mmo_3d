using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Options;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using TestDbNoDepenceApp.DapperPlus.Infrastructure;
using Z.Dapper.Plus;

namespace TestDbNoDepenceApp.DapperPlus
{
    [TestClass]
    public class TestDapperPlus
    {
        private readonly ITestUserMesasgeDapperPlusRepository _userMessageRepo;

        //[FromServices]
        private readonly ITestUserDapperPlusRepository _userRepo;

        public TestDapperPlus()
        {
        var opts = Options.Create(new TestConnectionOptions
            {
                Test = TestDataConnection.TestConnecttion
            });
            var provider = new TestDbProvider(opts);
            _userRepo = new TestUserDapperPlusRepository(provider);
            _userMessageRepo = new TestUserMesasgeDapperPlusRepository(provider);
        }


        [TestMethod]
        public void Crud()
        {
            var count = _userRepo.GetAll().Count;
            Create();
            Update();
 
            var newItem = _create("must dai");
            _userRepo.Delete(newItem.Id);
            var after = _userRepo.GetAll().Count;
            Assert.IsTrue(count == after);
        }

        [TestMethod]
        public void Create()
        {
            //create
            var item = _create("Create");
            var id = item.Id;
            Assert.AreNotEqual(0, id);
            _userRepo.Delete(id);
        }

        private TestUser _create(string value = "test1")
        {
            var item = new TestUser
            {
                Value = value
            };
            var result = _userRepo.Add(item);
            return result;
        }

        private TestUser _update(TestUser testUser, string value)
        {
            testUser.Value = value;
            return _userRepo.Update(testUser);
        }

        private void _deleteAll()
        {
            _userRepo.DeleteAll();
        }

        [TestMethod]
        public void Update()
        {
            //create
            var startVal = "newItem";
            var item = _create(startVal);
            var val = item.Value;
            var newData = _update(item, "Updated");
            Assert.AreNotEqual(val, newData.Value);
            _userRepo.Delete(newData.Id);
        }
        [TestMethod]
        public void AddOrUpdate()
        {

            var item = new TestUser
            {
                Value = "AddOrUpdate"
            };
            var result = _userRepo.AddOrUpdate(item);
            Assert.IsTrue(result.Id > 0);
            _deleteAll();

        }
        [TestMethod]
        public void AddOrUpdateList()
        {

            var items = new List<TestUser>{new TestUser
            {
                Value = "1"
            },new TestUser
                {
                    Value = "2"
                }};
            List<TestUser> result = null;
            _userRepo.ContextAction(c =>
          {
              result = c.BulkMerge(items).CurrentItem;
          });
            Assert.IsTrue(result.Count == 2);
            Assert.IsTrue(result[0].Value == "1");
            Assert.IsTrue(result[1].Value == "2");
            _deleteAll();

        }


        private List<TestUser> _createList(int count)
        {
            _deleteAll();

            var items = new List<TestUser>();

            for (var i = 0; i < count; i++)
                items.Add(_create(Guid.NewGuid().ToString()));
            return items;
        }

        [TestMethod]
        public void CreateList()
        {
            var lsit = _createList(10);
            var all = _userRepo.GetAll();
            Assert.IsTrue(lsit.Count == all.Count);
            _deleteAll();
        }

        [TestMethod]
        public void DeleteAll()
        {
            var lsit = _createList(10);
            Assert.IsTrue(10 == lsit.Count);
            _deleteAll();
            var after = _userRepo.GetAll();
            Assert.IsTrue(0 == after.Count);
        }

        [TestMethod]
        public void StoreProcedure()
        {
            var lsit = _createList(10);
            var stored = _userRepo.GetAllProcedure();
            Assert.AreEqual(lsit.Count, stored.Count);
            _deleteAll();
        }

        [TestMethod]
        public void CreateTable()
        {
            Assert.Fail();
            //_userMessageRepo.TestDeleteTable();
            //_userRepo.TestDeleteTable();

            //_userRepo.TestCreateTable();
            //_userMessageRepo.TestCreateTable();
            //var data = _create("CreateTable");
            //Assert.IsTrue(data.Value == "CreateTable");
            //DeleteAll();

        }

        [TestMethod]
        public void DropTable()
        {

            Assert.Fail();
            // таблица имеет фк и ее нельзя просто так удалить. нужно запилить скрипт на поиск зависимостей

        }
        [TestMethod]
        public void WhereTest()
        {
            var i1 = _create("1");
            var i2 = _create("1");
            var i3 = _create("1");
            var i4 = _create("1");
            var i5 = _create("2");
            var i6 = _create("2");
            var where1 = _userRepo.Where<TestUser>($@"select * from {_userRepo.SchemeTableName} where value =1");
            var where2 = _userRepo.Where<TestUser>($@"select * from {_userRepo.SchemeTableName} where value =2");
            _deleteAll();
            Assert.IsTrue(where1.Count == 4);
            Assert.IsTrue(where2.Count == 2);

        }
        [TestMethod]
        public void TWhere()
        {
            var i1 = _create("1");
            var i2 = _create("1");
            var where1 = _userRepo.Where<DynamicTest>($@"select id as Test, value As Name from {_userRepo.SchemeTableName} where value =1");
            Assert.AreEqual(where1.Count, 2); ;
            Assert.AreEqual(where1[0].Name, "1"); ;
            _deleteAll();

        }

        //http://dapper-tutorial.net/bulk-insert
        [TestMethod]
        public void InsertMany()
        {

            var r = _userRepo.Add(new List<TestUser>
            {
                new TestUser {Value = "t1"},
                new TestUser {Value = "t2"}
            });
            Assert.AreEqual(2, r.Count);
            Assert.AreEqual("t1", r[0].Value);
            Assert.AreEqual("t2", r[1].Value);
            _deleteAll();

        }
        [TestMethod]
 
        public void InsertVeryMany()
        {
            Assert.Fail();

            var count = 1000000;
            var items = new List<TestUser>();
            for (int i = 0; i < count; i++)
            {
                items.Add(new TestUser { Value = "multy:" + i });
            }
            var startTime = DateTime.UtcNow;

            var r = _userRepo.Add(items);
            var deltaTime = DateTime.UtcNow - startTime;
            Console.WriteLine("time work: {0}", deltaTime);
            _deleteAll();
            var endDeltaTime = DateTime.UtcNow - startTime;
            var maxAllowDeltaTime = new TimeSpan(0, 0, 0, 40);
            Assert.IsTrue(maxAllowDeltaTime > endDeltaTime);
            Console.WriteLine("with delete k: {0}", DateTime.UtcNow - startTime);
            Assert.AreEqual(count, r.Count);

        }

        [TestMethod]
        public void InsertManyWithChildTable()
        {
            _deleteAll();
            var users = new List<TestUser>();
            for (int i = 0; i < 10; i++)
            {
                var messages = new List<TestUserMesasge>();
                for (int j = 0; j < 5; j++)
                {
                    messages.Add(new TestUserMesasge
                    {
                        Message = "message " + i + "_" + j

                    });
                }
                users.Add(new TestUser { Value = "multy:connected" + i, Messages = messages });
            }

            _userRepo.ContextAction(c =>
            {
                var r = c.BulkInsert(users).ThenBulkInsert(u =>
                {
                    foreach (var i in u.Messages)
                    {
                        i.UserId = u.Id;
                        i.TestUser = u;
                    }
                    return u.Messages;
                });

            });
        }



        public class DynamicTest
        {
            public string Test { get; set; }
            public string Name { get; set; }
        }

        [TestMethod]
        public void ComplicatedStoredProcedure()
        {
            _createComplecatedData(3, 5);
            var user = _userRepo.GetAll().First();
            var data = _userMessageRepo.GetUserMessagesProcedure(user.Id);
            Assert.AreEqual(5, data.Count);
            Assert.IsTrue(data.TrueForAll(i => i.Message.Length > 0));
            Assert.IsTrue(data.TrueForAll(i => i.UserId == user.Id));
            Assert.IsTrue(data.TrueForAll(i => i.UserValue.Length > 0));
            Assert.IsTrue(data.TrueForAll(i => i.MessageId > 0));

            _deleteAll();
        }

        private void _createComplecatedData(int usersCount, int messagesPerUser)
        {
            var users = _createList(usersCount);

            foreach (var user in users)
                for (var i = 0; i < messagesPerUser; i++)
                {
                    var item = new TestUserMesasge
                    {
                        Message = "message: " + Guid.NewGuid(),
                        UserId = user.Id
                    };
                    _userMessageRepo.Add(item);
                }
        }




        //tmp
        private enum TestEnum : int
        {
            T1 = 2
        }

        private IEnumerable<dynamic> _testDynamic = new List<dynamic>
        {
            new
            {
                Id = 1,
                Val1 = "val1",
                Obj = new { Inner = 2 }
            }
        };

        public class TestObj
        {
            public int Inner { get; set; }
        }
        [TestMethod]
        public void DynamicBaseTest()
        {

            foreach (var i in _testDynamic)
            {
                var intVal = i.Id;
                var strVal = i.Val1;
                var objVal = i.Obj.Inner;
                var testEnumType = typeof(TestEnum);
                var enumTypeVal = (TestEnum)Enum.Parse(testEnumType, i.Obj.Inner.ToString());


                var deserObj = JsonConvert.DeserializeObject<TestObj>(JsonConvert.SerializeObject(i.Obj));
                var typedObj = (TestObj)deserObj;


                Assert.AreEqual(1, intVal);
                Assert.AreEqual("val1", strVal);
                Assert.AreEqual(2, objVal);
                Assert.AreEqual(TestEnum.T1, enumTypeVal);
                Assert.AreEqual(2, deserObj.Inner);
                Assert.AreEqual(2, typedObj.Inner);



            }


        }
    }
}