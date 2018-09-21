using System;
using System.Collections.Generic;
using System.Linq;
using Server.Core.Infrastructure;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Products;
using Server.DataLayer;
using Server.Modules.Localize;

namespace Server.Infrastructure
{
    public class StoreDurationItem : NameIdInt
    {
        public int Days { get; set; }
    }

    public class AdminStoreItem
    {
        public short Id { get; set; }
        public string NativeName { get; set; }
        public NameIdInt ProductType { get; set; }
        public NameIdInt Currency { get; set; }
        public double Price { get; set; }
        public L10N L10N { get; set; }
        public bool Active { get; set; }
        public string DateCreate { get; set; }

        public List<string> Base64Images { get; set; }
        public StoreDurationItem Duration { get; set; }

        public string ImagePath { get; set; }
        public object Properties { get; set; }

        public AdminStoreItem()
        {
        }

        public AdminStoreItem(ProductStoreDataModel dbModel, AdminStoreData parendData)
        {

            Id = dbModel.Id;
            DateCreate = dbModel.Date.ToString("s");
            NativeName = dbModel.Property.TranslateText.En.Name;
            Active = !dbModel.Trash;
            Properties = dbModel.Property.Property;

            ProductTypeIds tType;
            Enum.TryParse(dbModel.ProductTypeId.ToString(), out tType);

            ProductType = new NameIdInt((int)tType, tType.ToString());
         
            ImagePath = dbModel.Property.ImgCollectionImg.Store;
            L10N = dbModel.Property.TranslateText;
            Currency = parendData.CurrencyList[tType == ProductTypeIds.Cc ? 0 : 1];
            Price = (double) dbModel.Cost;

            Duration = parendData.DurationList[0];
            if (tType == ProductTypeIds.Premium)
            {
                var premProps = ProductPropertyHelper.GetPremiumProperties(Properties);
                Duration = _getDaysFromSecond(premProps.Duration, parendData.DurationList);

            }else if (tType == ProductTypeIds.Booster)
            {
                var props = ProductPropertyHelper.GetBooserProperty(Properties);
                Duration = _getDaysFromSecond(props.Duration, parendData.DurationList);
            }


        }

        private StoreDurationItem _getDaysFromSecond(int durationSecond, List<StoreDurationItem> durations)
        {
            var d = durationSecond / UnixTime.OneDayInSecond;
            var days = (int)(Math.Floor((double)d));
            return durations.First(i => i.Days == days);


        }
    }

    public class AdminStoreData
    {
        public List<AdminStoreItem> ProductItems { get; set; }

        public Dictionary<string, NameIdInt> ProductTypes { get; } = new Dictionary<string, NameIdInt>
        {
            {ProductTypeIds.Account.ToString(), new  NameIdInt((int)ProductTypeIds.Account,ProductTypeIds.Account.ToString())},
            {ProductTypeIds.Premium.ToString(), new  NameIdInt((int)ProductTypeIds.Premium,ProductTypeIds.Premium.ToString())},
            {ProductTypeIds.Booster.ToString(), new  NameIdInt((int)ProductTypeIds.Booster,ProductTypeIds.Booster.ToString())},
            {ProductTypeIds.Skins.ToString(), new  NameIdInt((int)ProductTypeIds.Skins,ProductTypeIds.Skins.ToString())},
            {ProductTypeIds.Cc.ToString(), new  NameIdInt((int)ProductTypeIds.Cc,ProductTypeIds.Cc.ToString())}
        };

        private static StoreDurationItem _createDurationItem(int id, int days)
        {
            var item = new StoreDurationItem
            {
                Id = id,
                Days = days
            };
            if (item.Days == 0)
            {
                item.Name = "infiniti";
            }
            else
            {
                item.Name = item.Days + " days";
            }
            return item;
        }

        public List<StoreDurationItem> DurationList { get; } = new List<StoreDurationItem>
        {
           _createDurationItem(1, 0),
           _createDurationItem(2, 7),
           _createDurationItem(3, 30),
           _createDurationItem(4, 90),
           _createDurationItem(5, 182),
           _createDurationItem(6, 365)
        };

        public List<NameIdInt> CurrencyList { get; } = new List<NameIdInt>
        {
            new NameIdInt(1,"CC"),
            new NameIdInt(2,"USD")
        };

        public PremiumProductProperty PremiumBaseProperty = ProductPropertyHelper.GetBasePremiumProps();
    }
}