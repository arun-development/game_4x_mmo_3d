using Server.Core.Interfaces;
using Server.Core.СompexPrimitive.Resources;

namespace Server.Services.GameObjects.BuildModel.View.BuildActionModels
{
    public class BuildStorageActions : BuildDropItemActionModel
    {
        public const string ViewPath = PrefixTmpl + "storage" + Ext;

        public StorageResources StorageResources;
        public double Losses;

        public class StorableItem : INativeName
        {
            public string TranslateName;

            public int Max;
            public int Current;
            public double Percent;
            public string NativeName { get; set; }
        }
    }
}