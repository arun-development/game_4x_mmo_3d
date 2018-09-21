using System;
using Server.Core.Images;
using Server.Core.Interfaces;
using Server.Core.StaticData;
using Server.Extensions;
using Server.Modules.Localize;


namespace Server.Core.СompexPrimitive.Products
{
    public interface IDurationProperty
    {
        int Duration { get; set; }
    };
    [Serializable]
    public class ProductItemProperty
    {
        public L10N TranslateText;
        public ImgCollectionField ImgCollectionImg;

        public object Property { get; set; }

        public ProductItemProperty()
        {
        }
        public ProductItemProperty(ProductItemProperty other)
        {
            var pi = other.CloneDeep();
            TranslateText = pi.TranslateText;
            ImgCollectionImg = pi.ImgCollectionImg;
            Property = pi.Property;
        }

 
    }


    public static class ProductPropertyHelper
    {

        /// <summary>
        /// 
        /// </summary>
        /// <param name="duration">second</param>
        /// <returns></returns>
        public static PremiumProductProperty CreatePremuiumProperties(int duration)
        {
            return new PremiumProductProperty(duration);
        }
        public static PremiumProductProperty CreatePremuiumProperties(this ProductItemProperty productItemProperty)
        {
            return productItemProperty == null ? new PremiumProductProperty() : CreatePremuiumProperties(productItemProperty.Property);
        }
        public static PremiumProductProperty CreatePremuiumProperties(this object premiumProperties)
        {
            return new PremiumProductProperty(premiumProperties);
        }

        public static PremiumProductProperty GetPremiumProperties(object property)
        {
            return property.ObjectToType<PremiumProductProperty>();

        }
        public static PremiumProductProperty GetPremiumProperties(this ProductItemProperty productItemProperty)
        {
            return GetPremiumProperties(productItemProperty.Property);
        }




        /// <summary>
        /// 
        /// </summary>
        /// <param name="productItemProperty"></param>
        /// <param name="duration">sencond</param>
        /// <returns></returns>
        public static void SetPremimDurationFromPi(this ProductItemProperty productItemProperty, int duration)
        {
            productItemProperty.Property = new PremiumProductProperty(productItemProperty.Property)
            {
                Duration = duration
            };

        }



        public static PremiumProductProperty GetBasePremiumProps()
        {
            return new PremiumProductProperty(PremiumMods.SetMathMods());
        }

        public static BoosterProductProperty GetBooserProperty(this ProductItemProperty productItemProperty)
        {
            return GetBooserProperty(productItemProperty.Property);
        }
        public static BoosterProductProperty GetBooserProperty(object props)
        {
            return BoosterProductProperty.ObjToBooserMods(props);
        }



    }

    public class PremiumProductProperty : PremiumMods
    {

        public PremiumProductProperty()
        {
        }

        public PremiumProductProperty(int duration) : base(PremiumMods.SetMathMods(), duration)
        {
        }

        public PremiumProductProperty(object property) : base(PremiumMods.ObjToPremiumMods(property))
        {

        }

        public PremiumProductProperty(PremiumMods mods)
        {
            _setFromOther(mods);
        }

    }


    public class BoosterProductProperty : BattleStatsDouble, IDurationProperty
    {
        public int Duration { get; set; }

        public BoosterProductProperty()
        {

        }

        public BoosterProductProperty(object obj)
        {
            _setFromOther(ObjToBooserMods(obj));
        }

        private void _setFromOther(BoosterProductProperty other)
        {
            Duration = other.Duration;
            Attack = other.Attack;
            Hp = other.Hp;
        }

        public static BoosterProductProperty ObjToBooserMods(object obj)
        {
            return obj.ObjectToType<BoosterProductProperty>();
        }
    }
}