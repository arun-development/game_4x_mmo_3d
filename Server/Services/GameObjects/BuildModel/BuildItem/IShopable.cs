using System;
using System.Data;
using Server.Core.Interfaces;
using Server.DataLayer;

namespace Server.Services.GameObjects.BuildModel.BuildItem
{
    public interface IShopable : ITest
    {
        int UpgradeForCc(IDbConnection connection, GDetailPlanetDataModel planet, int userId, bool premiumIsActive, BuildUpgrade preResult, IServiceProvider resolver);

        int CalcCcCurrentPrice(int level);
    }
}