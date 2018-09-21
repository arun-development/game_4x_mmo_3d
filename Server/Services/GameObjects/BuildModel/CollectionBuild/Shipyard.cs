using System.Collections.Generic;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.Core.СompexPrimitive.Products;
using Server.DataLayer;
using Server.Modules.Localize.Game.Units;
using Server.Services.GameObjects.BuildModel.BuildItem;
using Server.Services.GameObjects.BuildModel.View;
using Server.Services.GameObjects.UnitClasses;
using Server.Services.HtmlHelpers;

namespace Server.Services.GameObjects.BuildModel.CollectionBuild
{
    public interface IShipyard : IBuildCollection
    {
    }

    public class Shipyard : BuildCollection, IShipyard
    {
        private const string ShipyardId = "space-shipyard";

        private readonly ISpaceShipyard _spaceShipyard;

        public Shipyard(IMothershipService mothershipService,
            IGDetailPlanetService gDetailPlanetService, 
            ISynchronizer synchronizer,
            IStoreService storeService, 
            IGameUserService gameUserService,
            IUMotherJumpService motherJumpService, 
            ISpaceShipyard spaceShipyard)
            : base(mothershipService, gDetailPlanetService, synchronizer, storeService, gameUserService, motherJumpService)
        {
            _spaceShipyard = spaceShipyard;
        }


        public override List<BuildItemUnitView> GetPlanetBuildList(GDetailPlanetDataModel planet,
            UserPremiumWorkModel userPremium)
        {
            var shipyardColletion = new List<BuildItemUnitView>
            {
                _spaceShipyard.GetViewModel(planet.BuildSpaceShipyard, userPremium.IsActive)
            };
            var builds = Unit.GetBuildItemUnitViewList(planet.Hangar, planet.UnitProgress, planet.BuildSpaceShipyard, userPremium, OwnType.Planet);
            shipyardColletion.AddRange(builds);
            return shipyardColletion;
        }

        public override List<BuildItemUnitView> GetMotherBuildList(UserMothershipDataModel mother,UserPremiumWorkModel userPremium)
        {
            return Unit.GetBuildItemUnitViewList(mother.Hangar, mother.UnitProgress, null, userPremium, OwnType.Mother);
        }


        protected override PlanshetViewData _getPlanetCollection(List<BuildItemUnitView> buildList)
        {
            var result = PlanshetBodyHelper.SetBody(buildList,
                Resource.SpaceShipyard,
                BuildPrefixId + ShipyardId,
                BuildTemplate, BuildTemplate);
            result.IsMother = false;
            return result;
        }

        protected override PlanshetViewData _getMotherCollection(List<BuildItemUnitView> buildList)
        {
            var result = PlanshetBodyHelper.SetBody(buildList,
                Resource.MotherSpaceShipyard,
                BuildPrefixId + ShipyardId,
                BuildTemplate, BuildTemplate);
            result.IsMother = true;
            return result;
        }
    }
}