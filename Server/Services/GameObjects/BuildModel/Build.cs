using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Extensions.DependencyInjection;
using Server.Core.Images;
using Server.Core.Interfaces;
using Server.Core.Interfaces.GameObjects;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Resources;
using Server.DataLayer;
using Server.Modules.Localize;

namespace Server.Services.GameObjects.BuildModel
{
    public abstract class Build
    {
        public double BonusModPerLevel { get; set; }
        public LangField Text { get; set; }
        public GameResource Cost { get; set; }
        public ItemProgress ItemProgress { get; set; }
        public SpriteImages Images { get; set; }
        public List<BuildPropertyView> BuildUpdatePropertyView { get; set; }

        //    protected int UpgradeForCc(IGDetailPlanetService planetService,IBalanceCcService balanceService,
        //int userId, bool premiumIsActive, BuildUpgrade preResult, int planetId, int calculatedCcPrice)
        protected int UpgradeForCc(IDbConnection connection, GDetailPlanetDataModel planet, int userId, bool premiumIsActive, BuildUpgrade preResult, int calculatedCcPrice, IServiceProvider resolver)
        {
            var storeService = resolver.GetService<IStoreService>();
            var preResultCc = storeService.BalanceCalcResultCc(connection, userId, calculatedCcPrice);
            preResult.Cc = preResultCc.Quantity;
            preResult.Progress = ItemProgress.ProgressUpdateComplite(preResult.Progress);
            BuildUpgrade.TransactionBuildUpdate(connection, planet, preResult, resolver, preResultCc);
            return preResult.Cc;
        }


        protected ItemProgress Upgraded(IDbConnection connection, GDetailPlanetDataModel planet, BuildUpgrade bu, IServiceProvider resolver)
        {
            if (!bu.IsUpgradeComplite(bu.Progress)) return bu.Progress;
            bu.Progress = ItemProgress.ProgressUpdateComplite(bu.Progress);
            BuildUpgrade.TransactionBuildUpdate(connection, planet, bu, resolver);
            return bu.Progress;
        }
    }

    public enum BuildNativeNames : byte
    {
        Storage,
        ExtractionModule,
        EnergyConverter,
        SpaceShipyard,
        LaboratoryBuild,
        Turel,
        MotherExtractionModule,
        MotherStorage,
        MotherEnergyConverter
    }
}