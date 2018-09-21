using System.Collections.Generic;
using Server.Core.Images;
using Server.Core.Infrastructure.ComplexButton;
using Server.Core.Interfaces;
using Server.Core.Interfaces.ForModel;
using Server.Core.Interfaces.GameObjects;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Resources;
using Server.Modules.Localize.Game.Common;
using Server.Services.GameObjects.BuildModel.CollectionBuild;
using Server.Services.HtmlHelpers;

namespace Server.Services.GameObjects.BuildModel.View
{
    public class BuildItemUnitView : IComplexButtonView, INativeName
    {
        private const string Prefix = BuildCollection.BuildPrefixTmpl;
        private const string Ext = BuildCollection.Ext;
        private const string BuildCentrTmpl = Prefix + "control-centr" + Ext;
        private const string BuildRightTmpl = Prefix + "control-right" + Ext;
        public BuildDropItemAction Action;
        public Dictionary<string, object> AdvancedData;
        public string IconSelf;
        public BuildDropItemInfo Info;
        public ItemProgress Progress;
        public string TranslateName;
        public BuildDropItemUpdate Update;
        public ComplexButtonView ComplexButtonView { get; set; }

        public string NativeName { get; set; }

        /// <summary>
        ///     true is build, false is unit
        /// </summary>
        public bool IsBuildItem;

        public void SetComplexButtonView()
        {
            var cb = new ComplexButtonView();
            cb.Full(BuildItem());
            ComplexButtonView = cb;
        }


        private SectionContentViewData BuildItem()
        {
            return new SectionContentViewData
            {
                Left = new SectionItem
                {
                    Data = ImageView.Img(IconSelf, NativeName),
                    IsComplexPart = true,
                    IsPath = false,
                    ItemId = GameHtmlAtributes.Info
                },
                Centr = new SectionItem
                {
                    Data = new
                    {
                        TranslateName,
                        NativeName
                    },
                    Path = BuildCentrTmpl,
                    IsPath = true,
                    ItemId = GameHtmlAtributes.Action,
                    IsComplexPart = true
                },
                Right = new SectionItem
                {
                    Data = new
                    {
                        Icon =
                        ImageView.Img(
                            new SpriteImages().InterfaseBaseControlIcons(" interface-complex-btn-icon-upgrade")
                                .Medium, "Upgrade"),
                        NativeName
                    },
                    Path = BuildRightTmpl,
                    IsPath = true,
                    ItemId = GameHtmlAtributes.Upgrade,
                    IsComplexPart = true
                }
            };
        }
    }

    public abstract class BuildDropItem
    {
        public Dictionary<string, IButtonsView> Buttons { get; set; }
        public bool HasButtons { get; set; }

        protected void SetButtons(bool containSubmit)
        {
            HasButtons = true;
            Buttons = new Dictionary<string, IButtonsView>();
            if (containSubmit)
                Buttons.Add("Submit", ButtonsView.ConstructorSizeBtn(1, true, Resource.Submit));
        }
    }


    public class BuildDropItemInfo : BuildDropItem
    {
        public string Description { get; set; }

        public string DropImage { get; set; }
 
        public object Data { get; set; }

        public new void SetButtons(bool containSubmit = true)
        {
            base.SetButtons(containSubmit);
        }
    }

    public class BuildDropItemAction : BuildDropItem
    {
        public string ViewPath { get; set; }
        public BuildDropItemActionModel Data { get; set; }

        public new void SetButtons(bool containSubmit = true)
        {
            base.SetButtons(containSubmit);
        }
    }

    public class BuildDropItemUpdate : BuildDropItem
    {
        public List<BuildPropertyView> Properties { get; set; }
        public GameResource Price { get; set; }
        public bool IsUnitUpgrade { get; set; }

        public new void SetButtons(bool containSubmit = true)
        {
            base.SetButtons(containSubmit);
        }
    }
}