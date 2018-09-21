using System;
using System.Data;
using Server.Core.Images;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Resources;
using Server.DataLayer;
using Server.Modules.Localize;
using Server.Modules.Localize.Game.Units;
using Server.Services.GameObjects.BuildModel.View;

namespace Server.Services.GameObjects.BuildModel.BuildItem
{
    public interface ITurels : IBuild, IShopable
    {
    }

    public class Turels : Build, ITurels
    {
        public static readonly string NativeName = BuildNativeNames.Turel.ToString();
        private static readonly BasePrice _bp = new BasePrice(50, 20, 10, 3, 10);
        private static readonly SpriteImages _images = new SpriteImages().BuildImages(NativeName);

        private readonly LangField _text = new LangField(Resource.Turel,
            Resource.TurelDescription);

        public string Test(string message = "Ok")
        {
            return message;
        }

        private BuildDropItemInfo GetInfo()
        {
            return new BuildDropItemInfo
            {
                Description = _text.Description,
                DropImage = _images.Detail
            };
        }

        #region Members

        #region Price and Calculate

        public int CalcCcCurrentPrice(int turelCount)
        {
            return BasePrice.CalcCcBuildUpgradePrice((int) DefaultPrice().Cc, turelCount);
        }


        public BasePrice DefaultPrice()
        {
            return _bp;
        }

        public BasePrice CalcPrice(int turelCount, bool premiumIsActive)
        {
            return CalcPrice(premiumIsActive);
        }

        #endregion

        #region Upgrade

        //BuildItemUnitView
        public ItemProgress Upgraded(IDbConnection connection, GDetailPlanetDataModel planet, int userId, bool premiumIsActive, IServiceProvider resolver)
        {
            var bu = new BuildUpgrade();
            bu.SetData(planet.Turels, NativeName);
            if (!bu.IsUpgradeComplite(bu.Progress)) return bu.Progress;
            //planetService.SavePlanet();
            bu.Progress = ItemProgress.ProgressUpdateComplite(bu.Progress);
            BuildUpgrade.TransactionBuildUpdate(connection, planet, bu, resolver);
            return bu.Progress;
        }

        public int UpgradeForCc(IDbConnection connection, GDetailPlanetDataModel planet, int unserId, bool premiumIsActive, BuildUpgrade preResult, IServiceProvider resolver)
        {
            return base.UpgradeForCc(connection, planet, unserId, premiumIsActive, preResult, CalcCcCurrentPrice(1), resolver);
        }

        #endregion

        #region Get ViewModel

        public BuildItemUnitView GetViewModel(ItemProgress buildProgress, bool premiumIsActive,
            StorageResources resources = null)
        {
            var model = new BuildItemUnitView
            {
                Progress = buildProgress,
                TranslateName = _text.Name,
                NativeName = NativeName,
                IconSelf = _images.Icon,
                Info = GetInfo(),
                Update = new BuildDropItemUpdate
                {
                    Price = CalcPrice(premiumIsActive)
                },
                IsBuildItem = true
            };
            model.SetComplexButtonView();
            model.Update.SetButtons();
            return model;
        }

        #endregion

        #region Static

        public static BasePrice CalcPrice(bool premium)
        {
            return BasePrice.CalcBuildPrice(_bp, 1, premium);
        }

        #endregion

        #endregion
    }
}