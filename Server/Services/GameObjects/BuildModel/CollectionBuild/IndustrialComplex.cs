using System.Collections.Generic;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.Core.СompexPrimitive.Products;
using Server.Core.СompexPrimitive.Resources;
using Server.DataLayer;
using Server.Modules.Localize.Game.Units;
using Server.Services.GameObjects.BuildModel.BuildItem;
using Server.Services.GameObjects.BuildModel.View;
using Server.Services.HtmlHelpers;

namespace Server.Services.GameObjects.BuildModel.CollectionBuild
{
    public interface IIndustrialComplex : IBuildCollection
    {
    }

    public class IndustrialComplex : BuildCollection, IIndustrialComplex
    {
        private const string IndustrialComplexId = "industrial-complex";
        private readonly IEnergyConverter _energyConverter;
        private readonly IExtractionModule _extractionModule;

        private readonly IStorage _storage;

        public IndustrialComplex(IMothershipService mothershipService, IGDetailPlanetService gDetailPlanetService,
            ISynchronizer synchronizer, IStoreService storeService, IGameUserService gameUserService,
            IUMotherJumpService motherJumpService, IStorage storage, IExtractionModule extractionModule,
            IEnergyConverter energyConverter)
            : base(
                mothershipService, gDetailPlanetService, synchronizer, storeService, gameUserService, motherJumpService)
        {
            _storage = storage;
            _extractionModule = extractionModule;
            _energyConverter = energyConverter;
        }


        public override List<BuildItemUnitView> GetPlanetBuildList(GDetailPlanetDataModel planet,
            UserPremiumWorkModel userPremium)
        {
            return new List<BuildItemUnitView>
            {
                _storage.GetViewModel(planet.BuildStorage, userPremium.IsActive, planet.Resources),
                _extractionModule.GetViewModel(planet.BuildExtractionModule, userPremium.IsActive,
                    StorageResources.StorageProportion(planet.ExtractionProportin)),
                _energyConverter.GetViewModel(planet.BuildEnergyConverter, userPremium.IsActive)
            };
        }

        public override List<BuildItemUnitView> GetMotherBuildList(UserMothershipDataModel mother,
            UserPremiumWorkModel userPremium)
        {
            return new List<BuildItemUnitView>
            {
                _storage.GetMotherViewModel(userPremium.IsActive, mother.Resources),
                _extractionModule.GetMotherViewModel(userPremium.IsActive,
                    StorageResources.StorageProportion(mother.ExtractionProportin)),
                _energyConverter.GetMotherViewModel(userPremium.IsActive)
            };
        }

        protected override PlanshetViewData _getPlanetCollection(List<BuildItemUnitView> buildList)
        {
            var result = PlanshetBodyHelper.SetBody(buildList,
                Resource.IndustrialComplex,
                BuildPrefixId + IndustrialComplexId,
                BuildTemplate, BuildTemplate);
            result.IsMother = false;
            return result;
        }

        protected override PlanshetViewData _getMotherCollection(List<BuildItemUnitView> buildList)
        {
            var result = PlanshetBodyHelper.SetBody(buildList,
                Resource.MotherIndustrialComplex,
                BuildPrefixId + IndustrialComplexId,
                BuildTemplate, BuildTemplate);
            result.IsMother = true;
            return result;
        }
    }
}