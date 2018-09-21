using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace TestAny
{
    [TestClass]
    public class TestConverts
    {
        public TestConverts()
        {
            Assert.Fail();
        }

        [TestMethod]
        public void TestAfterConvertParamsToObjectIndexedStructureNotChanged()
        {
            Console.WriteLine("hi");
            Console.WriteLine("======Params======");
            Params(1,2,"string", new{obj="object"});
            Console.WriteLine("======ParamsAsObject======");
            ParamsAsObject(1, 2, "string", new { obj = "object" });
            Console.WriteLine("======ParamsObject======");
            ParamsObject(new object[]{ 1, 2, "string", new { obj = "object" } });
        }


        private void Params(params object[]p)
        {
            var count = 0;
            foreach (var item in p)
            {
                count++;
                Console.WriteLine(item.ToString());
            }
            Assert.IsTrue(count>0);
        }
        private void ParamsAsObject(params object[] p)
        {
            ParamsObject(p);
 
        }
        private void ParamsObject(object[] p)
        {
            var count = 0;
            foreach (var item in p)
            {
                Console.WriteLine(item.ToString());
            }
            Assert.IsTrue(count > 0);
        }

    }
}
