using Server.Core.СompexPrimitive.Resources;

namespace Server.Services.GameObjects.BuildModel.View.BuildActionModels
{
    public class BuildExtractionModuleActions : BuildDropItemActionModel
    {
        public const string ViewPath = PrefixTmpl + "extraction-module" + Ext;
        public MaterialResource ExtractionPerHour;
        public MaterialResource Percent;
        public double Power;
    }
}