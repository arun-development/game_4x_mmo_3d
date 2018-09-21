using Server.Core.Interfaces;
using Server.Core.СompexPrimitive.Resources;
using Server.Services.GameObjects.BuildModel.View;

namespace Server.Services.GameObjects.BuildModel.BuildItem
{
    public interface IMotherItem : ITest
    {
        BuildItemUnitView GetMotherViewModel(bool premiumIsActive, StorageResources resources = null);
    }
}