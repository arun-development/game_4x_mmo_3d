using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace TestAny
{
    [TestClass]
    public class TestOverrage
    {
        public TestOverrage()
        {
            Assert.Fail();
        }
        [TestMethod]
        public void TestShowOvverageLogic()
        {
            var test1 = otherMethod(1);
            var test2 = otherMethod(2, null);
            var test3 = otherMethod(2, new { });
            var test4 = _overableMethod(2, null);
            //result
            //перегрзки при указанном параметре не происходит, привязка идет именно по сигнатуре метода.
            //необходимо указывать четкую сигнатуру и не передавтаь дополнительные перегуружаемые параметры
            // при необходимости нужно внутри метода учитывать возможность попадания в нулл  применять соов логику
        }

        private int _overableMethod(int value)
        {
            Console.WriteLine("_overableMethod(int value)");
            return value;
        }

        private int _overableMethod(int value, object nullValue = null)
        {
            Console.WriteLine("_overableMethod(int value, object nullValue = null)");
            return value;
        }

        private int otherMethod(int value, object nullValue = null) => _overableMethod(value, nullValue);
    }
}