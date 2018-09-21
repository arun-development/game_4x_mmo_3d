using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Server.DataLayer;
using Server.Modules.Localize;


namespace Server.Core.СompexPrimitive.Products
{
    public abstract class BaseStoreItem : IProductStoreIdProperty, IProductTypeIdProperty
    {

        [Required]
        public short ProductStoreId { get; set; }

        [Required]
        public byte ProductTypeId { get; set; }
    }


    public interface IStoreIds
    {
        List<short> StoreIds { get; set; }
    }

    public class UchPremiumData: IStoreIds
    {
        public UserPremiumDataModel Premium;
        public List<short> StoreIds { get; set; }
    }
    public class UchBalanceCcData : IStoreIds
    {
        public UserBalanceCcDataModel BalanceCc;
        public List<short> StoreIds { get; set; }
    }


    public class UchActiveItemView
    {
        public byte ProductTypeId => (byte) ProductType;
        public string ProductTypeNativeName => ProductType.ToString();

        public ProductTypeIds ProductType;
        // Id  внутренней таблицы например PremiumID
        public ProductItemProperty ProductItemProperty;

        public object Data;

        public UchActiveItemView(ProductTypeIds productType)
        {
            ProductType = productType;
        }

    }


    public class UchView
    {
        public const string ViewKey = "UserChest";
        public List<UserChestDataModel> All;
        public List<UchNoActiveField> NoActivate;
        public Dictionary<ProductTypeIds, UchActiveItemView> ActivatedItemsView;
    }


    public class UchNoActiveField : BaseStoreItem, IUniqueIdElement
    {


        // userChestId
        public int Id { get; set; }

        public bool Activated;
        public int? DateActivate;
        public int? DateCreate;
        public int? DateEndTime;
        public ProductItemProperty ProductItemProperty;

        public UchNoActiveField()
        {
        }

        public UchNoActiveField(UserChestDataModel chestItem)
        {
            Id = chestItem.Id;
            Activated = chestItem.Activated;
            DateActivate = chestItem.DateActivate;
            DateCreate = chestItem.DateCreate;
            ProductTypeId = chestItem.ProductTypeId;
            ProductStoreId = chestItem.ProductStoreId;
        }

    }

    public class PaymentMoneyViewModel : BaseStoreItem
    {
        public decimal BaseCost;
        public string CurrencyCode;
        public double CurrencyRate;
        public int PaymentSystem;
    }

    public class PaymentCcViewModel : BaseStoreItem
    {
        public int Cost;

        public decimal TotalCost;


        public int Quantity;
        public byte ProductType;

        [Required]
        public string __RequestVerificationToken { get; set; }

        public string FormName;
    }

    public class StoreView
    {
        public const string ViewKey = "StoreViewKey";

        public List<StoreViewItem> StoreList;
        public List<ProductType> SelectList;
    }

    public class StoreViewItem : BaseStoreItem
    {

        //  public string Img { get; set; }
        public bool Active;

        public DateTime Date;
        public ProductItemProperty ProductItemProperty;
        public double ProductCost;
        public string ProductCurrencyCode;
        public L10N TypeText;
    }


    public enum SourceCcChange : sbyte
    {
        Loot = 1,
        BuyCc = 1,
        BuyStoreItem = -1
    }

    public class TransactionCcField : BaseStoreItem
    {
        public int UserId;
        public sbyte Source;
        public int Cost;
        public int Quantity;
        public string FormToken;
        public DateTime DateCreate;
    }
}
