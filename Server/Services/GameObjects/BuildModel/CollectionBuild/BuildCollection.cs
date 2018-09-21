using System;
using System.Collections.Generic;
using System.Data;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive.Products;
using Server.DataLayer;
using Server.Services.GameObjects.BuildModel.View;
using Server.Services.HtmlHelpers;

namespace Server.Services.GameObjects.BuildModel.CollectionBuild
{
    public interface IBuildCollection : ITest {
        PlanshetViewData GetCollection(IDbConnection connection, int userId, int ownId, bool synchronize = true);

        PlanshetViewData GetCollection(IDbConnection connection, UserDataModel user, UserPremiumWorkModel currentUserPremium, object dataModel, OwnType ownType, bool synchronize = true);


        PlanshetViewData GetMotherCollection(IDbConnection connection, UserDataModel user, UserPremiumWorkModel userPremium, UserMothershipDataModel own, bool synchronize = true);

        PlanshetViewData GetPlanetCollection(IDbConnection connection, UserDataModel user, UserPremiumWorkModel userPremium, GDetailPlanetDataModel own, bool synchronize = true);


        List<BuildItemUnitView> GetMotherBuildList(UserMothershipDataModel mother, UserPremiumWorkModel userPremium);

        List<BuildItemUnitView> GetPlanetBuildList(GDetailPlanetDataModel planet, UserPremiumWorkModel userPremium);
    }


    public enum OwnType : byte {
        Mother = 0,
        Planet = 1
    }

    public abstract class BuildCollection : IBuildCollection {
        protected const string BuildPrefixId = "build-collection-";
        public const string BuildPrefixTmpl = "build-";
        public const string BuildAvVrefix = BuildPrefixTmpl + "av-";
        public const string Ext = Directories.Tmpl;

        protected const string BuildTemplate = BuildPrefixTmpl + "planshet-root" + Ext;

        protected BuildCollection(IMothershipService mothershipService,
            IGDetailPlanetService gDetailPlanetService,
            ISynchronizer synchronizer, IStoreService storeService,
            IGameUserService gameUserService, IUMotherJumpService motherJumpService) {
            _mothershipService = mothershipService;
            _gDetailPlanetService = gDetailPlanetService;
            _synchronizer = synchronizer;
            _storeService = storeService;
            _gameUserService = gameUserService;
            _motherJumpService = motherJumpService;
        }

        public PlanshetViewData GetCollection(IDbConnection connection, int userId, int ownId, bool synchronize = true) {
            var user = _gameUserService.GetGameUser(connection, userId);
            var premium = _storeService.GetPremiumWorkModel(connection, userId);
            if (ownId == 0) {
                return GetCollection(connection, user, premium, _mothershipService.GetMother(connection, userId), OwnType.Mother, synchronize);
            }
            return GetCollection(connection, user, premium, _gDetailPlanetService.GetUserPlanet(connection, ownId, userId), OwnType.Planet,
                synchronize);
        }

        public PlanshetViewData GetCollection(IDbConnection connection, UserDataModel user, UserPremiumWorkModel currentUserPremium, object dataModel, OwnType ownType, bool synchronize = true) {
            switch (ownType) {
                case OwnType.Mother:
                    return GetMotherCollection(connection, user, currentUserPremium, (UserMothershipDataModel) dataModel,
                        synchronize);
                case OwnType.Planet:
                    return GetPlanetCollection(connection, user, currentUserPremium, (GDetailPlanetDataModel) dataModel,
                        synchronize);
                default:
                    throw new ArgumentOutOfRangeException(nameof(ownType), ownType, null);
            }
        }


        public PlanshetViewData GetMotherCollection(IDbConnection connection, UserDataModel user, UserPremiumWorkModel userPremium, UserMothershipDataModel own, bool synchronize = true) {
            var mother = own;
            if (synchronize) {
                mother = _synchronizer.UserMothership(connection, mother, userPremium, _mothershipService, _motherJumpService);
            }
            var motherPlanshet = _getMotherCollection(GetMotherBuildList(mother, userPremium));
            motherPlanshet.IsMother = true;
            return motherPlanshet;
        }

        public PlanshetViewData GetPlanetCollection(IDbConnection connection, UserDataModel user, UserPremiumWorkModel userPremium, GDetailPlanetDataModel own, bool synchronize = true) {
            var planet = own;
            if (synchronize) {
                planet = _synchronizer.UserPlanet(connection, own, userPremium, _gDetailPlanetService);
            }
            var planetPlanshet = _getPlanetCollection(GetPlanetBuildList(planet, userPremium));
            planetPlanshet.IsMother = false;
            return planetPlanshet;
        }


        public abstract List<BuildItemUnitView> GetPlanetBuildList(GDetailPlanetDataModel planet,
            UserPremiumWorkModel userPremium);

        public abstract List<BuildItemUnitView> GetMotherBuildList(UserMothershipDataModel mother,
            UserPremiumWorkModel userPremium);


        public string Test(string message = "Ok") {
            return message;
        }


        protected abstract PlanshetViewData _getPlanetCollection(List<BuildItemUnitView> buildList);
        protected abstract PlanshetViewData _getMotherCollection(List<BuildItemUnitView> buildList);

        // ReSharper disable InconsistentNaming
        protected readonly IGDetailPlanetService _gDetailPlanetService;

        protected readonly IMothershipService _mothershipService;
        protected readonly IUMotherJumpService _motherJumpService;
        protected readonly IStoreService _storeService;
        protected readonly IGameUserService _gameUserService;

        protected readonly ISynchronizer _synchronizer;
        // ReSharper restore InconsistentNaming
    }
}