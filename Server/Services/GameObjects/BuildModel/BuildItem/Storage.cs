using System;
using System.Collections.Generic;
using System.Data;
using System.Numerics;
using Microsoft.Extensions.DependencyInjection;
using Server.Core.Images;
using Server.Core.Interfaces;
using Server.Core.Interfaces.GameObjects;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Resources;
using Server.DataLayer;
using Server.Modules.Localize;
using Server.Modules.Localize.Game.Units;
using Server.Services.GameObjects.BuildModel.View;
using Server.Services.GameObjects.BuildModel.View.BuildActionModels;
using Server.Services.HtmlHelpers;

namespace Server.Services.GameObjects.BuildModel.BuildItem
{
    public interface IStorage : IBuild, IMotherItem, IShopable
    {
        Storage Init(StorageResources storageResourses, ItemProgress itemProgress, bool premium);

        MaterialResource CalculateTransferedRes(bool sum, MaterialResource current, MaterialResource delta,
            bool premiumIsActive, int? storageLevel = null);
    }

    public class Storage : Build, IStorage
    {
        private const string SendAllBtnKey = "SendAll";
        public static readonly string NativeName = BuildNativeNames.Storage.ToString();
        private static readonly string MotherCssNativename = BuildNativeNames.MotherStorage.ToString();

        private static readonly BasePrice _bp = new BasePrice(100, 100, 50, 55, 600);

        private static readonly SpriteImages _images = new SpriteImages().BuildImages(NativeName);
        private readonly LangField _text = new LangField(Resource.Storage, Resource.StorageDescription);


        public StorageResources StorageResources;
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

        public int CalcCcCurrentPrice(int level)
        {
            return BasePrice.CalcCcBuildUpgradePrice((int)DefaultPrice().Cc, level, GameMathStats.BuildCostUpdateModifer);
        }

        public BasePrice CalcPrice(int level, bool premiumIsActive)
        {
            return BasePrice.CalcBuildPrice(DefaultPrice(), level, premiumIsActive, GameMathStats.BuildCostUpdateModifer);
        }

        public MaterialResource CalculateTransferedRes(bool sum, MaterialResource current, MaterialResource delta, bool premiumIsActive, int? storageLevel = null)
        {
            var operation = (sum) ? 1 : -1;
            double mod = 1;
            var level = storageLevel ?? 1;
            if (level == 0) level = 1;

            if (sum)
            {
                // Math.Pow(GetTransferLossesMod(level, premiumIsActive), (double) 1 / level);
                mod = GetTransferLossesMod(level, premiumIsActive); //1-0.3 30 -1

            }

            var m = (MaterialResource)current.Clone();
            var d = (MaterialResource)delta.Clone();
            d.Multiply(operation * mod);
            m.Sum(d);
           // m.ConvertToInt();
            return m;

        }

        #endregion

        #region Upgrade

        public ItemProgress Upgraded(IDbConnection connection, GDetailPlanetDataModel planet, int userId, bool premiumIsActive, IServiceProvider resolver)
        {
            var progress = planet.BuildStorage;
            var preResult = new BuildUpgrade(planet.Resources, progress, NativeName);


            //todo  не правильно высчитывается время на азуре из за чего вылетает ошибка при ответе от сервера
            if (!preResult.IsUpgradeComplite(preResult.Progress)) return preResult.Progress;

            preResult.Progress = ItemProgress.ProgressUpdateComplite(preResult.Progress);
            preResult.StorageResources.Max = MaxStorable(preResult.Progress.Level ?? 1, premiumIsActive);
            BuildUpgrade.TransactionBuildUpdate(connection, planet, preResult, resolver);
            return preResult.Progress;
        }

        public int UpgradeForCc(IDbConnection connection, GDetailPlanetDataModel planet, int userId, bool premiumIsActive, BuildUpgrade preResult, IServiceProvider resolver)
        {
            var storeService = resolver.GetService<IStoreService>();
            var balanceCc =
                storeService.BalanceCalcResultCc(connection, userId, CalcCcCurrentPrice(preResult.Progress?.Level ?? 1));
            preResult.Cc = balanceCc.Quantity;
            preResult.Progress = ItemProgress.ProgressUpdateComplite(preResult.Progress);
            if (preResult.StorageResources == null) throw new Exception(Error.UserResourceNotSetInInstance);
            preResult.StorageResources.Max = MaxStorable(preResult.Progress?.Level ?? 1, premiumIsActive);
            BuildUpgrade.TransactionBuildUpdate(connection, planet, preResult, resolver, balanceCc);
            return preResult.Cc;
        }

        #endregion

        #region Get ViewModel

        public BuildItemUnitView GetViewModel(ItemProgress buildProgress, bool premiumIsActive,
            StorageResources resources = null)
        {
            //var res = ToModel<StorageResources>(planet.resources);
            var storage = Init(resources, buildProgress, premiumIsActive);

            var model = new BuildItemUnitView
            {
                Progress = storage.ItemProgress,
                TranslateName = storage.Text.Name,
                NativeName = NativeName,
                IconSelf = storage.Images.Icon,
                Info = new BuildDropItemInfo
                {
                    DropImage = storage.Images.Detail,
                    Description = storage.Text.Description
                },
                Action = new BuildDropItemAction
                {
                    ViewPath = BuildStorageActions.ViewPath,
                    Data = new BuildStorageActions
                    {
                        StorageResources = storage.StorageResources,
                        Losses = storage.Properties[3].CurrentValue+1
                    }
                },
                Update = new BuildDropItemUpdate
                {
                    Price = storage.Cost,
                    Properties = storage.Properties
                },
                IsBuildItem = true
            };
            SetRequiredButtons(model);
            model.Update.SetButtons();
            return model;
        }

        public BuildItemUnitView GetMotherViewModel(bool premiumIsActive, StorageResources resources = null)
        {
            if (resources == null)
            {
                resources = new StorageResources();
                resources.InitializeField();
            }
            var description = new LangField(Resource.MotherStorage, Resource.MotherStorageDescription);
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
                    ViewPath = BuildStorageActions.ViewPath,
                    Data = new BuildStorageActions
                    {
                        StorageResources = resources,
                        Losses = GetTransferLossesMod(1, premiumIsActive)
                    }
                },
                IsBuildItem = true
            };


            SetRequiredButtons(model);

            return model;
        }

        #endregion

        #region Other

        public Storage Init(StorageResources storageResourses, ItemProgress itemProgress, bool premiumIsActive)
        {
            if (itemProgress == null)
                itemProgress = new ItemProgress { Level = 1 };
            StorageResources = storageResourses;
            ItemProgress = itemProgress;
            Cost = CalcPrice((int)itemProgress.Level, premiumIsActive);
            Images = _images;
            Text = _text;
            Properties = PropertyList((int)itemProgress.Level, premiumIsActive);
            return this;
        }

        private void SetRequiredButtons(BuildItemUnitView model)
        {
            model.SetComplexButtonView();
            model.Action.SetButtons();
            model.Action.Buttons.Add(SendAllBtnKey, ButtonsView.StorageActionSendAll());
        }

        #endregion

        #region Static

        public static MaterialResource MaxStorable(int level, bool premium)
        {
            var multiple = level;
            var maxMod = MaxStorableMod(premium);
            var m = MaterialResource.StoreDefaultMaxStorable();
            if (level == 1)
            {
                if (!premium)
                {
                    return m;
                }
                m.Multiply(maxMod);//.ConvertToInt();
                return m;
            }
            var x = Math.Pow(GameMathStats.DefaultProgressBonusPerLevel, multiple) * maxMod;
            m.Multiply(x);//.ConvertToInt();
            return m;

        }
        public static MaterialResource MaxMotherStorable(bool hasPremium)
        {

            var maxMod = MaxStorableMod(hasPremium);
            var m = MaterialResource.MaxMotherResourses().Multiply(maxMod);//.ConvertToInt();
            return m;
        }

        private static List<BuildPropertyView> PropertyList(int level, bool premium)
        {
            var current = MaxStorable(level, premium);
            var next = MaxStorable(level + 1, premium);
            return new List<BuildPropertyView>
            {
                new BuildPropertyView
                {
                    PropertyNativeName = "Energy",
                    PropertyName = Resource.MaxStorableEnegy,
                    CurrentValue = Math.Ceiling(current.E),
                    NextValue = Math.Ceiling(next.E)
                },
                new BuildPropertyView
                {
                    PropertyNativeName = "Iridium",
                    PropertyName = Resource.MaxStorableIridium,
                    CurrentValue = Math.Ceiling(current.Ir),
                    NextValue = Math.Ceiling(next.Ir)
                },
                new BuildPropertyView
                {
                    PropertyNativeName = "DarkMatter",
                    PropertyName = Resource.MaxStorableDarkMatter,
                    CurrentValue = Math.Ceiling(current.Dm),
                    NextValue = Math.Ceiling(next.Dm)
                },
                new BuildPropertyView
                {
                    PropertyNativeName = "TransferLosses",
                    PropertyName = Resource.TransferLosses,
                    CurrentValue =1- GetTransferLossesMod(level, premium),
                    NextValue =1- GetTransferLossesMod(level + 1, premium)
                }
            };
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="level"></param>
        /// <param name="hasPremium"></param>
        /// <returns>Значение модификатора при 1 м левел  0.3  при макс 1</returns>
        private static double GetTransferLossesMod(int level, bool hasPremium)
        {
            var maxLevel = (float)30.0;
            var baseTransferLoses = (float)GameMathStats.BaseTransferLoses;
            var premiumMod = (float)GameMathStats.PremiumTransferLosesMod;
            if (level == 1)
            {
                if (hasPremium)
                {
                    return baseTransferLoses * premiumMod;
                }
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
            var startPointvector = Vector2.Multiply(startPoint, (float)Math.Pow(1 - lvl, 2));
            var shoulderPointVector = Vector2.Multiply(shoulderPoint, 2 * lvl * (1 - lvl));
            var endPointVector = Vector2.Multiply(endPoint, (float)Math.Pow(lvl, 2));
            var point = startPointvector + shoulderPointVector + endPointVector;
            
            var losesMod = point.Y;
            if (hasPremium)
            {
                losesMod *= premiumMod;
            }
            if (losesMod > 1)
            {
                losesMod = 1;
            }
            return losesMod;

        }

        private static double MaxStorableMod(bool premium)
        {
            return premium ? GameMathStats.PremiumMaxStorable : GameMathStats.BaseMaxStorable;
        }

        #endregion

        #endregion
    }
}