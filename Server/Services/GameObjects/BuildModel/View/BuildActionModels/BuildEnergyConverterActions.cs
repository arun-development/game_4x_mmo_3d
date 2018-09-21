using Server.Core.СompexPrimitive.Resources;

namespace Server.Services.GameObjects.BuildModel.View.BuildActionModels
{
    public class BuildEnergyConverterActions : BuildDropItemActionModel
    {
        public const string ViewPath = PrefixTmpl + "energy-converter" + Ext;
        public StorageResources StorageResources;
        public double ConvertLoses;
    }
}