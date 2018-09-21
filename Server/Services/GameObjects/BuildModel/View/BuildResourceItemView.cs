using Server.Core.Interfaces;
using Server.Services.GameObjects.BuildModel.CollectionBuild;

namespace Server.Services.GameObjects.BuildModel.View
{
    public class BuildResourceItemView : INativeName
    {
        public const string ViewPath = BuildCollection.BuildAvVrefix + "resource-item" + BuildCollection.Ext;
        public bool IsTarget;
        public bool ShowMaxInHtml;
        public bool ShowResValueInHtml;

        public int? MaxValue;
        public int? ResValue;
        public string NativeName { get; set; }


        public BuildResourceItemView GetSetting(string nativeName, bool isTarget = false, int? resValue = null,
            int? maxValue = null)
        {
            return new BuildResourceItemView
            {
                NativeName = nativeName,
                IsTarget = isTarget,
                ResValue = resValue,
                MaxValue = maxValue,
                ShowResValueInHtml = true,
                ShowMaxInHtml = false
            };
        }
    }
}