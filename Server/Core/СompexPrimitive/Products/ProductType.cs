using Server.Core.Interfaces;
using Server.Modules.Localize;

namespace Server.Core.СompexPrimitive.Products
{
    public enum ProductTypeIds : byte
    {
        Account = 1,
        Premium = 2,
        Booster = 3,
        Skins = 4,
        Cc =5
    }

    public class ProductType : INativeName
    {
        //public const int AccountTypeId = 1;
        //public const int PremiumTypeId = 2;
        //public const int BoosterTypeId = 3;
        //public const int SkinTypeId = 4;

        //public const string AccountTypeNativeName = "Account";
        //public const string PremiumTypeNativeName = "Premium";
        //public const string BoosterTypeNativeName = "Booster";
        //public const string SkinTypeNativeName = "Skins";

        public ProductTypeIds Id;

        public L10N TranslateText;
     //   public ImgCollectionField ImgCollection { get; set; }
        public string NativeName { get; set; }
       // public object Property { get; set; }
    }
}