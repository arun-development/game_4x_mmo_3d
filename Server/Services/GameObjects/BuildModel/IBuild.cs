using System;
using System.Data;
using Server.Core.Interfaces;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Resources;
using Server.DataLayer;
using Server.Services.GameObjects.BuildModel.View;

namespace Server.Services.GameObjects.BuildModel
{
    public interface IBuild : ITest
    {
        BasePrice DefaultPrice();

        BasePrice CalcPrice(int level, bool premiumIsActive);

        //BuildItemUnitView Upgraded(int userId, bool premiumIsActive, int ownId);
        ItemProgress Upgraded(IDbConnection connection, GDetailPlanetDataModel planet, int userId, bool premiumIsActive, IServiceProvider resolver);

        BuildItemUnitView GetViewModel(ItemProgress buildProgress, bool premiumIsActive,
            StorageResources resources = null);
    }
}