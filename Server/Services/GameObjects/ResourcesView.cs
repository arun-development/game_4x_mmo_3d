using System.Collections.Generic;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive.Resources;
using Server.Modules.Localize.Game.Units;
using Server.Services.GameObjects.BuildModel.View.BuildActionModels;

namespace Server.Services.GameObjects
{
    public class ResourcesView
    {
        public const string ViewKey = "ResourcesViewKey";
        private const string ResDir = Directories.ResourceView;
        public const string PartialView = ResDir + "_resourseEstate.cshtml";
        public const string EstateListView = ResDir + "_estateList.cshtml";

        public StorageResources StorageResources { get; set; }
        public int Cc { get; set; }

        public static object GetInitList(int cc)
        {
            return new List<BuildStorageActions.StorableItem>
            {
                new BuildStorageActions.StorableItem
                {
                    TranslateName = Resource.Enegry,
                    NativeName = ResourcesNativeName.E.ToLower(),
                    Max = 0,
                    Current = 0,
                    Percent = 0
                },
                new BuildStorageActions.StorableItem
                {
                    TranslateName = Resource.Iridium,
                    NativeName = ResourcesNativeName.Ir.ToLower(),
                    Max = 0,
                    Current = 0,
                    Percent = 0
                },
                new BuildStorageActions.StorableItem
                {
                    TranslateName = Resource.DarkMatter,
                    NativeName = ResourcesNativeName.Dm.ToLower(),
                    Max = 0,
                    Current = 0,
                    Percent = 0
                },
                new BuildStorageActions.StorableItem
                {
                    TranslateName = Resource.Cc,
                    NativeName = ResourcesNativeName.Cc.ToLower(),
                    Current = cc
                }
            };
        }
    }
}