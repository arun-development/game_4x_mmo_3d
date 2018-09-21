using System;
using System.Collections.Generic;
using System.Data;
using System.Numerics;
using Server.Core.Images;
using Server.Core.Interfaces;
using Server.Core.Interfaces.GameObjects;
using Server.Core.Interfaces.UserServices;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Resources;
using Server.DataLayer;
using Server.Modules.Localize;
using Server.Modules.Localize.Game.Units;
using Server.Services.GameObjects.BuildModel.View;
using Server.Services.GameObjects.BuildModel.View.BuildActionModels;
using Server.Services.OutModel;

namespace Server.Services.GameObjects.BuildModel.BuildItem
{
    public interface IEnergyConverter : IBuild, IMotherItem, IShopable
    {
        EnergyConverter Init(bool premium, ItemProgress progress);
        bool CallculateNewResources(IDbConnection connection, IMothershipService motherService, UserMothershipDataModel mother, EnergyConverterChangeOut clientData);

        bool CallculateNewResources(IDbConnection connection, IGDetailPlanetService service, GDetailPlanetDataModel planet, EnergyConverterChangeOut clientData);
    }

    public class EnergyConverter : Build, IEnergyConverter
    {
        public static readonly string NativeName = BuildNativeNames.EnergyConverter.ToString();
        private static readonly string MotherCssNativename = BuildNativeNames.MotherEnergyConverter.ToString();
        private static readonly BasePrice _bp = new BasePrice(40, 35, 35, 5, 320);
        private static readonly SpriteImages _images = new SpriteImages().BuildImages(NativeName);

        private readonly LangField _text = new LangField(Resource.EnergyConverter, Resource.EnergyConverterDescripton);


        public List<BuildPropertyView> Properties;

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
            return BasePrice.CalcBuildPrice(DefaultPrice(), level, premium);
        }

        public int CalcCcCurrentPrice(int level)
        {
            return BasePrice.CalcCcBuildUpgradePrice((int)DefaultPrice().Cc, level);
        }

        #endregion

        #region Upgrade

        public ItemProgress Upgraded(IDbConnection connection, GDetailPlanetDataModel planet, int userId, bool premiumIsActive, IServiceProvider resolver)
        {

            var bu = new BuildUpgrade(planet.Resources, planet.BuildEnergyConverter, NativeName);
            return base.Upgraded(connection, planet, bu, resolver);
        }


        public int UpgradeForCc(IDbConnection connection, GDetailPlanetDataModel planet, int userId, bool premiumIsActive, BuildUpgrade preResult, IServiceProvider resolver)
        {
            var bu = new BuildUpgrade();
            bu.SetData(planet.BuildEnergyConverter, NativeName);
            return base.UpgradeForCc(connection, planet, userId, premiumIsActive, preResult, CalcCcCurrentPrice(preResult.Progress?.Level ?? 1), resolver);
        }

        #endregion

        #region Get ViewModel

        public BuildItemUnitView GetViewModel(ItemProgress buildProgress, bool premiumIsActive,
            StorageResources resources = null)
        {
            var ec = Init(premiumIsActive, buildProgress);

            var model = new BuildItemUnitView
            {
                Progress = ec.ItemProgress,
                TranslateName = ec.Text.Name,
                NativeName = NativeName,
                IconSelf = ec.Images.Icon,
                Info = new BuildDropItemInfo
                {
                    Description = ec.Text.Description,
                    DropImage = ec.Images.Detail
                },
                Update = new BuildDropItemUpdate
                {
                    Properties = ec.Properties,
                    Price = ec.Cost
                },
                Action = new BuildDropItemAction
                {
                    ViewPath = BuildEnergyConverterActions.ViewPath,
                    Data = new BuildEnergyConverterActions
                    {
                        StorageResources = null,
                        ConvertLoses = ec.Properties[0].CurrentValue
                    }
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
            //if (resources == null) throw new Exception(Error.UserResourceNotSetInInstance);

            var description = new LangField(Resource.MotherEnergyConverter, Resource.MotherEnergyConverterDescription);

            var images = new SpriteImages().BuildImages(MotherCssNativename);

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
                    ViewPath = BuildEnergyConverterActions.ViewPath,
                    Data = new BuildEnergyConverterActions
                    {
                        StorageResources = null,
                        ConvertLoses = GameMathStats.BaseConvertLosses
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

        public EnergyConverter Init(bool premium, ItemProgress progress)
        {
            return new EnergyConverter
            {
                Cost = CalcPrice((int)progress.Level, premium),
                Images = _images,
                Text = _text,
                ItemProgress = progress,
                Properties = EnergyConverterProperty((int)progress.Level)
            };
        }

        public bool CallculateNewResources(IDbConnection connection, IMothershipService motherService, UserMothershipDataModel mother, EnergyConverterChangeOut clientData)
        {
            var dbRes = mother.Resources;
            var calculatedRes = _callculateNewResources(dbRes, clientData, 1);
            if (dbRes.Equals(calculatedRes)) return false;
            mother.Resources = calculatedRes;
            mother= motherService.AddOrUpdate(connection,mother);
            return true;
        }

        public bool CallculateNewResources(IDbConnection connection, IGDetailPlanetService service, GDetailPlanetDataModel planet, EnergyConverterChangeOut clientData)
        {
            var dbRes = planet.Resources;
            var level = planet.BuildEnergyConverter.GetLevel(1);
            var calculatedRes = _callculateNewResources(dbRes, clientData, level);
            if (dbRes.Equals(calculatedRes)) return false;
            planet.Resources = calculatedRes;
            service.AddOrUpdate(connection,planet);
            return true;
        }

        private static StorageResources _callculateNewResources(StorageResources dbRes,EnergyConverterChangeOut clientData, int level)
        {
            var toConvert = clientData.ToConvert;
            var resources = dbRes.ToDictionary();
            var current = StorageResources.GetCurrent(resources);
            var max = StorageResources.GetMax(resources);
            var srcName = clientData.From;
            var targetName = clientData.To;
            var srcCount = current[srcName];
            var targetCount = current[targetName];
            var targetMax = max[targetName];
            if (srcCount < 1) throw new Exception(Error.NotEnoughResources);
            if (targetMax - targetCount < 1) throw new Exception(Error.TargetResourceIsFull);

            var bp = ExtractionModule.BaseProportion.ToDictionary();


            double realCount = toConvert;
            if ((srcCount - toConvert) < 1) realCount = srcCount;
            var loses =1- GetEnergyConverterMod(level);
            var rate = (bp[srcName] / bp[targetName]) * loses;
            if (rate<=0)
            {
                rate = 1;
            }
            var freeTargetRes = targetMax - targetCount;

            var potentialSourceMax = freeTargetRes / rate;
            if (potentialSourceMax - realCount < 1) realCount = potentialSourceMax;
            var raealAdedResource = realCount * rate;
            if (raealAdedResource < 1) throw new Exception(Error.NotEnoughResources);

            var targetSum = targetCount + raealAdedResource;
            if (targetMax < targetSum) throw new Exception(Error.MathError);


            resources[StorageResources.CurrentKey][srcName] = srcCount - realCount;
            resources[StorageResources.CurrentKey][targetName] = targetCount + raealAdedResource;

            return StorageResources.DictionaryToStorageResources(resources);
        }

        #endregion

        #region Static

        private static List<BuildPropertyView> EnergyConverterProperty(int level)
        {
            var current = GetEnergyConverterMod(level);
            var next = GetEnergyConverterMod(level + 1);

            return new List<BuildPropertyView>
            {
                new BuildPropertyView
                {
                    CurrentValue =1- current,
                    NextValue =1- next,
                    PropertyName = Resource.ExchangeCourse,
                    PropertyNativeName = "ConvertLosses"
                }
            };
        }

        public static double GetEnergyConverterMod(int level)
        {
            var maxLevel = (float)50.0;
            var baseTransferLoses = (float)GameMathStats.BaseConvertLosses;
            if (level == 1)
            {
                return baseTransferLoses;
            }
            if (level >= maxLevel)
            {
                return 1;
            }
            var lvl = level / maxLevel;
            var startPoint = new Vector2(1, baseTransferLoses);
            var shoulderPoint = new Vector2(maxLevel, baseTransferLoses);
            var endPoint = new Vector2(maxLevel, 1);
            var startPointVector = Vector2.Multiply(startPoint, (float)Math.Pow(1 - lvl, 2));
            var shoulderPointVector = Vector2.Multiply(shoulderPoint, 2 * lvl * (1 - lvl));
            var endPointVector = Vector2.Multiply(endPoint, (float)Math.Pow(lvl, 2));
            var point = startPointVector + shoulderPointVector + endPointVector;
            var losesMod = point.Y;
            if (losesMod>1)
            {
                losesMod = 1;
            }
            return losesMod;
        }

        #endregion

        #endregion
    }
}