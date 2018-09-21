using Server.Core.СompexPrimitive.Products;
using Server.Extensions;

namespace Server.Core.StaticData
{


    public class PremiumMods: IDurationProperty
    {
        ///Время активности текущего премиума
        public int Duration { get; set; }

        /// <summary>
        /// модификатор сокращения времени обновления здания
        /// </summary>
        public double TimeBuildUpdate;

        /// <summary>
        /// модификатор сокращения времени  посторойки юнита
        /// </summary>
        public double TimeUnitProduction;

        /// <summary>
        /// Модификатор увелечения добычи ресурсов
        /// </summary>
        public double ResourseProduction;

        /// <summary>
        /// Модификатор  увелечения возможного хранения ресурсов
        /// </summary>
        public double ResourseMaxStorable;

        /// <summary>
        /// Модификатор увелечения хранимых закладок для пользвоателя
        /// </summary>
        public double PremiumBookmarkMod;

        /// <summary>
        /// Модификатор ускоряющий время перемещения
        /// </summary>
        public double PremiumNavigationMod;



        private static PremiumMods _mathMods;
 

        /// <summary>
        /// устанавливает в текущую модель модификаторы для дальнейшего математического расчета
        /// </summary>
        /// <returns></returns>
        public static PremiumMods SetMathMods()
        {
            return _mathMods ?? (_mathMods = new PremiumMods
            {
                TimeBuildUpdate = GameMathStats.PremiumBuildingTimeMod,
                TimeUnitProduction = GameMathStats.PremiumProductionUnitMod,
                ResourseProduction = GameMathStats.PremiumProductionMod,
                ResourseMaxStorable = GameMathStats.PremiumMaxStorable,
                PremiumBookmarkMod = GameMathStats.PremiumBookmarkMod,
                PremiumNavigationMod = GameMathStats.PremiumNavigationMod
            });
        }


        /// <summary>
        /// Сереализует и десереализует объект  создавая новый экземпляр пм
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static PremiumMods ObjToPremiumMods(object obj)
        {
            return obj.ObjectToType<PremiumMods>();
        }

        public PremiumMods()
        {
        }
        protected PremiumMods(PremiumMods other)
        {
            _setFromOther(other);
        }
        protected PremiumMods(PremiumMods other, int duration)
        {
            other.Duration = duration;
            _setFromOther(other);
        }
        protected void _setFromOther(PremiumMods other)
        {
            Duration = other.Duration;
            TimeBuildUpdate = other.TimeBuildUpdate;
            TimeUnitProduction = other.TimeUnitProduction;
            ResourseProduction = other.ResourseProduction;
            ResourseMaxStorable = other.ResourseMaxStorable;
            PremiumBookmarkMod = other.PremiumBookmarkMod;
            PremiumNavigationMod = other.PremiumNavigationMod;
        }

 
    }
}