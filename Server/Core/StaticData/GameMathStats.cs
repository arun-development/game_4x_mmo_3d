using System;

namespace Server.Core.StaticData
{
    public static class GameMathStats
    {

        public const double DefaultProgressBonusPerLevel = 1.17;
        public const double ShipyardUpdateModiferPerLevel = 1.05;
        public const double BuildCostUpdateModifer = DefaultProgressBonusPerLevel;

        public const double BaseBuildingTimeMod = 1;
        public const double PremiumBuildingTimeMod = 0.5;

        public const double BaseConvertLosses = 0.3;

        public const double BasePriceMod = 1;
        public const double PremiumPriceMod = 1;


        public const double BaseMaxStorable = 1;
        public const double PremiumMaxStorable = 1.5;

        public const double BaseTransferLoses = 0.3;
        public const double PremiumTransferLosesMod = 1.2;


        public const double BaseProductionPower = 100;
        public const double BaseProductionMod = 1;
        public const double PremiumProductionMod = 1.2;


        public const double BaseProductionUnitMod = 1;
        public const double PremiumProductionUnitMod = 1.5;

        public const double BaseReserchTime = 1;
        public const double PremiumReserchTime = 0.5;


        public const int BaseBookmarkLimit = 100;
        public const double PremiumBookmarkMod = 1.5;
        public static readonly int PremiumBookmarkLimit = (int)Math.Floor(BaseBookmarkLimit * PremiumBookmarkMod);


        public const int BaseNavigationMod = 1;
        public const double PremiumNavigationBonus = 2;
        public const double PremiumNavigationMod = BaseNavigationMod/ PremiumNavigationBonus;


        public static double CalcProgressBonus(int level, double premiumMod, double bonusPerLevel, double offsetBonus)
        {
            if (level ==1)
            {
                return level * premiumMod;
            }
            var multiple = level - (offsetBonus * level);
            return Math.Pow(bonusPerLevel, multiple) * premiumMod;
        }

    }
}
