using Server.Core;

namespace Server.Services.TestService
{
 
    public class TestLibClass: ITestLibClass
    {
        public string GetM(string m)
        {
            return m;
        }
        public string GetM2(string m, int qwe)
        {
            return m;
        }
    }
    public class TestSrvice: ITestSrvice
    {
        private readonly ITestLibClass _testLib;
        public TestSrvice(ITestLibClass testLib)
        {
            _testLib = testLib;
        }

        public string GetMessage(string m)
        {
            return _testLib.GetM(m);
        }
    }
}
