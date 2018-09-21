using System;
using System.Collections.Generic;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.Core.СompexPrimitive.Products;
using Server.DataLayer;
using Server.Modules.Localize.Game.Units;
using Server.Services.GameObjects.BuildModel.BuildItem;
using Server.Services.GameObjects.BuildModel.View;
using Server.Services.HtmlHelpers;

namespace Server.Services.GameObjects.BuildModel.CollectionBuild
{
    public interface ICommandCenter : IBuildCollection
    {
    }

    public class CommandCenter : BuildCollection, ICommandCenter
    {
        private const string CommandCenterId = "command-center";
        private readonly ITurels _turels;

        public CommandCenter(IMothershipService mothershipService, IGDetailPlanetService gDetailPlanetService,
            ISynchronizer synchronizer, IStoreService storeService, IGameUserService gameUserService,
            IUMotherJumpService motherJumpService, ITurels turels) : base(mothershipService, gDetailPlanetService,
            synchronizer, storeService, gameUserService, motherJumpService)
        {
            _turels = turels;
        }

        public override List<BuildItemUnitView> GetPlanetBuildList(GDetailPlanetDataModel planet,
            UserPremiumWorkModel userPremium)
        {
            return new List<BuildItemUnitView>
            {
                _turels.GetViewModel(planet.Turels, userPremium.IsActive)
            };
        }

        protected override PlanshetViewData _getPlanetCollection(List<BuildItemUnitView> buildList)
        {
            return PlanshetBodyHelper.SetBody(buildList,
                Resource.CommandCenter,
                BuildPrefixId + CommandCenterId,
                BuildTemplate, BuildTemplate);
        }

        protected override PlanshetViewData _getMotherCollection(List<BuildItemUnitView> buildList)
        {
            throw new NotImplementedException("ICommandCenter for mother not exist");
        }

        public override List<BuildItemUnitView> GetMotherBuildList(UserMothershipDataModel mother,
            UserPremiumWorkModel userPremium)
        {
            throw new NotImplementedException("ICommandCenter for mother not exist");
        }
    }
}