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
using Server.Services.GameObjects.BuildModel.View.BuildActionModels;

namespace Server.Services.GameObjects.BuildModel.BuildItem
{
    public interface IExtractionModule : IBuild, IMotherItem, IShopable
    {
        ExtractionModule Init(ItemProgress itemProgress, bool premium, MaterialResource extractionProportin);
        void FixProportion(MaterialResource proportion);
    }

    public class ExtractionModule : Build, IExtractionModule
    {
        private static readonly string MotherCssNativename = BuildNativeNames.MotherExtractionModule.ToString();

        private static readonly BasePrice _bp = new BasePrice(200,200, 0, 60,900);

        private static readonly SpriteImages _images = new SpriteImages().BuildImages(NativeName);

        public static readonly MaterialResource BaseProportion = new MaterialResource(1, 2, 5);

        private readonly LangField _text = new LangField(Resource.ExtractionModule,
            Resource.ExtractionModuleDescription);

        public static string NativeName => BuildNativeNames.ExtractionModule.ToString();


        public List<BuildPropertyView> Properties;
        public MaterialResource ExtractionPerHour;
        public MaterialResource ExtractionProportin;
        public double Power;

        public string Test(string message = "Ok")
        {
            return message;
        }

        #region Members

        #region Price and Calculate

        public int CalcCcCurrentPrice(int level)
        {
            return BasePrice.CalcCcBuildUpgradePrice((int) DefaultPrice().Cc, level);
        }

        public BasePrice DefaultPrice()
        {
            return _bp;
        }

        public BasePrice CalcPrice(int level, bool premium)
        {
            return BasePrice.CalcBuildPrice(DefaultPrice(), level, premium);
        }

        #endregion

        #region Upgrade

        //public BuildItemUnitView Upgraded(IGDetailPlanetService planetService, int userId, int planetId,bool premiumIsActive)
        public ItemProgress Upgraded(IDbConnection connection, GDetailPlanetDataModel planet, int userId, bool premiumIsActive, IServiceProvider resolver)
        {
            var bu = new BuildUpgrade();
            bu.SetData(planet.BuildExtractionModule, NativeName);
            return base.Upgraded(connection, planet, bu, resolver);
        }


        public int UpgradeForCc(IDbConnection connection, GDetailPlanetDataModel planet, int userId, bool premiumIsActive, BuildUpgrade preResult, IServiceProvider resolver)
        {
            return base.UpgradeForCc(connection, planet, userId, premiumIsActive, preResult, CalcCcCurrentPrice(preResult.Progress?.Level ?? 1), resolver);
        }

        #endregion

        #region ViewModel

        public BuildItemUnitView GetViewModel(ItemProgress buildProgress, bool premiumIsActive,
            StorageResources resources = null)
        {
            //todo  Временный костыль из за не состыковки типов
            if (resources?.Current == null) throw new Exception(Error.ProportionNotSetInModel);

            var em = Init(buildProgress, premiumIsActive, resources.Current);


            var model = new BuildItemUnitView
            {
                Progress = em.ItemProgress,
                TranslateName = em.Text.Name,
                NativeName = NativeName,
                IconSelf = em.Images.Icon,
                Info = new BuildDropItemInfo
                {
                    DropImage = em.Images.Detail,
                    Description = em.Text.Description
                },
                Action = new BuildDropItemAction
                {
                    ViewPath = BuildExtractionModuleActions.ViewPath,
                    Data = new BuildExtractionModuleActions
                    {
                        Power = em.Power,
                        Percent = em.ExtractionProportin,
                        ExtractionPerHour = em.ExtractionPerHour
                    }
                },
                Update = new BuildDropItemUpdate
                {
                    Price = em.Cost,
                    Properties = em.Properties
                },
                IsBuildItem = true
            };
            model.SetComplexButtonView();
            model.Update.SetButtons(true);
            model.Action.SetButtons(true);
            return model;
        }

        public BuildItemUnitView GetMotherViewModel(bool premiumIsActive, StorageResources resources = null)
        {
            if (resources?.Current == null) throw new Exception(Error.ProportionNotSetInModel);


            var description = new LangField(Resource.MotherExtractionModule, Resource.MotherStorageDescription);

            var images = new SpriteImages().BuildImages(MotherCssNativename);

            //todo  временно
           // var power = GetPower(1, premiumIsActive);
            var power = GetPower(22, premiumIsActive);
            var extraction = new ExtractionResource();
            extraction.SetAndCalcEmpFromProportion(resources.Current, power, BaseProportion.Ir, BaseProportion.Dm);


            var model = new BuildItemUnitView
            {
                TranslateName = description.Name,
                NativeName = NativeName,
                IconSelf = images.Icon,
                Info = new BuildDropItemInfo
                {
                    Description = description.Name,
                    DropImage = images.Detail
                },
                Action = new BuildDropItemAction
                {
                    ViewPath = BuildExtractionModuleActions.ViewPath,
                    Data = new BuildExtractionModuleActions
                    {
                        //todo  реализовать
                        Power = power,
                        Percent = extraction.ExtractionProportin,
                        ExtractionPerHour = extraction.ExtractionPerHour
                    }
                },
                IsBuildItem = true
            };
            model.SetComplexButtonView();
            model.Action.SetButtons();

            return model;
        }

        #endregion

        #region Other

        public ExtractionModule Init(ItemProgress itemProgress, bool premium, MaterialResource extractionProportin)
        {
            if (itemProgress == null)
            {
                itemProgress = new ItemProgress {Level = 1};
            }
            var level = itemProgress.Level ?? 1;
            var property = PropertyList(level, premium);
            var power = property[0].CurrentValue;
            var extraction = new ExtractionResource();
            extraction.SetAndCalcEmpFromProportion(extractionProportin, power, BaseProportion.Ir, BaseProportion.Dm);

            ItemProgress = itemProgress;
            Cost = CalcPrice(level, premium);
            Images = _images;
            Text = _text;
            Properties = property;
            ExtractionPerHour = extraction.ExtractionPerHour;
            ExtractionProportin = extraction.ExtractionProportin;
            Power = power;
            return this;
        }

        public void FixProportion(MaterialResource proportion)
        {
            const int fullPersent = 100;
            var sum = proportion.E + proportion.Ir + proportion.Dm;

            var k = sum/fullPersent;
            proportion.E = proportion.E/k;
            proportion.Ir = proportion.Ir/k;
            proportion.Dm = proportion.Dm/k;
        }

        #endregion

        #region Static

        private static List<BuildPropertyView> PropertyList(int level, bool premium)
        {
            var current = GetPower(level, premium);
            var next = GetPower(level + 1, premium);

            return new List<BuildPropertyView>
            {
                new BuildPropertyView
                {
                    PropertyName = Resource.ProductionPower,
                    PropertyNativeName = "Power",
                    CurrentValue = Math.Ceiling(current),
                    NextValue = Math.Ceiling(next)
                }
            };
        }

        public static double GetPower(int level, bool premium)
        {

            return GameMathStats.CalcProgressBonus(level, GetPowerMod(premium), GameMathStats.DefaultProgressBonusPerLevel,0.01);

        }

        private static double GetPowerMod(bool premium)
        {
            var powerMod = premium ? GameMathStats.PremiumProductionMod : GameMathStats.BaseProductionMod;
            return GameMathStats.BaseProductionPower*powerMod;
        }

        #endregion

        #endregion
    }
}