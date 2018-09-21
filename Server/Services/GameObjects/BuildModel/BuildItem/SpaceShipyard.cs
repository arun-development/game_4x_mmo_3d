using System;
using System.Collections.Generic;
using System.Data;
using Server.Core.Images;
using Server.Core.Interfaces.GameObjects;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Resources;
using Server.DataLayer;
using Server.Modules.Localize;
using Server.Modules.Localize.Game.Units;
using Server.Services.GameObjects.BuildModel.View;

namespace Server.Services.GameObjects.BuildModel.BuildItem
{
    public interface ISpaceShipyard : IBuild, IShopable
    {
    }

    public class SpaceShipyard : Build, ISpaceShipyard
    {
        public static readonly string NativeName = BuildNativeNames.SpaceShipyard.ToString();
        private static readonly BasePrice _bp = new BasePrice(1000, 5000, 3000, 2600, 14400);
        private static readonly SpriteImages _images = new SpriteImages().BuildImages(NativeName);
        private const   double _buildCostUpdateModifer = GameMathStats.ShipyardUpdateModiferPerLevel;

        private readonly LangField _text = new LangField(Resource.SpaceShipyard, Resource.SpaceShipyardDescription);

        public string Test(string message = "Ok")
        {
            return message;
        }

        #region Members

        #region Price and Calculate

        public BasePrice DefaultPrice()
        {
            return _bp;
        }

        public BasePrice CalcPrice(int level, bool premium)
        {
            return BasePrice.CalcBuildPrice(DefaultPrice(), level, premium, _buildCostUpdateModifer);
        }

        public int CalcCcCurrentPrice(int level)
        {
            return BasePrice.CalcCcBuildUpgradePrice((int)DefaultPrice().Cc, level, _buildCostUpdateModifer);
        }

        #endregion

        #region Upgrade

        public int UpgradeForCc(IDbConnection connection, GDetailPlanetDataModel planet, int userId, bool premiumIsActive, BuildUpgrade preResult, IServiceProvider resolver)
        {
            return base.UpgradeForCc(connection, planet, userId, premiumIsActive, preResult,
                CalcCcCurrentPrice(preResult.Progress?.Level ?? 1), resolver);
        }


        //public BuildItemUnitView Upgraded(IGDetailPlanetService planetService, int userId, int planetId,bool premiumIsActive)
        public ItemProgress Upgraded(IDbConnection connection, GDetailPlanetDataModel planet, int userId, bool premiumIsActive, IServiceProvider resolver)
        {
            var bu = new BuildUpgrade();
            bu.SetData(planet.BuildSpaceShipyard, NativeName);
            return base.Upgraded(connection, planet, bu, resolver);
        }

        #endregion

        #region Get ViewModel

        public BuildItemUnitView GetViewModel(ItemProgress buildProgress, bool premiumIsActive,
            StorageResources resources = null)
        {
            var text = _text;

            var images = _images;
            var level = buildProgress?.Level ?? 1;

            var model = new BuildItemUnitView
            {
                TranslateName = text.Name,
                NativeName = NativeName,
                IconSelf = images.Icon,
                Progress = buildProgress,
                Info = new BuildDropItemInfo
                {
                    Description = text.Name,
                    DropImage = images.Detail
                },
                Update = new BuildDropItemUpdate
                {
                    Price = CalcPrice(level, premiumIsActive),
                    Properties = PropertyList(level, premiumIsActive)
                },
                IsBuildItem = true
            };
            model.SetComplexButtonView();
            model.Update.SetButtons();
            //model.Action.SetButtons();
            return model;
        }

        #endregion

        #region Static

        private static double UnitProductionMod(bool premium)
        {
            return premium ? GameMathStats.PremiumProductionUnitMod : GameMathStats.BaseProductionUnitMod;
        }

        public static double UnitProductionResultMod(int level, bool premium)
        {
            var premiumMod = UnitProductionMod(premium); 
            var speedRate = GameMathStats.CalcProgressBonus(level, premiumMod, _buildCostUpdateModifer,0.02);
            return speedRate;
        }

        private static List<BuildPropertyView> PropertyList(int level, bool premium)
        {
            return new List<BuildPropertyView>
            {
                new BuildPropertyView
                {
                    PropertyName = "translate UnitProduction speed",
                    PropertyNativeName = "Speed",
                    CurrentValue = UnitProductionResultMod(level, premium),
                    NextValue = UnitProductionResultMod(level + 1, premium)
                }
            };
        }

        #endregion

        #endregion
    }
}