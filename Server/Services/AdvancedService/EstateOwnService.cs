using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using Microsoft.Extensions.DependencyInjection;
using Server.Core.HubUserModels;
using Server.Core.Interfaces;
using Server.Core.Interfaces.ForModel;
using Server.Core.Interfaces.UserServices;
using Server.Core.Interfaces.World;
using Server.Core.Map;
using Server.Core.Map.Structure;
using Server.Core.СompexPrimitive.Products;
using Server.Core.СompexPrimitive.Units;
using Server.DataLayer;
using Server.Modules.Localize;
using Server.Services.GameObjects;
using Server.Services.GameObjects.BuildModel.CollectionBuild;
using Server.Services.GameObjects.UserProfile;
using Server.Services.HtmlHelpers;
using Server.Services.OutModel;

namespace Server.Services.AdvancedService
{
    public interface IEstateOwnService
    {
        Dictionary<string, IPlanshetViewData> GetEstate(IDbConnection connection, UserDataModel user, int ownId, bool synchronize = true);

        Dictionary<string, IPlanshetViewData> GetEstate(IDbConnection connection, UserDataModel user, UserPremiumWorkModel userPremium, object own, OwnType ownType, bool synchronize = true);

        Dictionary<string, IPlanshetViewData> GetPlanetEstate(IDbConnection connection, UserDataModel user, int ownId, bool synchronize = true);

        Dictionary<string, IPlanshetViewData> GetPlanetEstate(IDbConnection connection, UserDataModel user, UserPremiumWorkModel userPremium, GDetailPlanetDataModel own, bool synchronize = true);


        Dictionary<string, IPlanshetViewData> GetMotherEstate(IDbConnection connection, UserDataModel user, bool synchronize = true);

        Dictionary<string, IPlanshetViewData> GetMotherEstate(IDbConnection connection, UserDataModel user, UserPremiumWorkModel userPremium, UserMothershipDataModel own, bool synchronize = true);

        /// <summary>
        ///     Точка инициализации пользователя
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="pricipalUser"></param>
        /// <param name="resolver"></param>
        /// <exception cref="NullReferenceException">pricipalUser</exception>
        /// >
        /// <exception cref="NullReferenceException">gameUser</exception>
        /// <returns></returns>
        Dictionary<string, object> InitUser(IDbConnection connection, ClaimsPrincipal pricipalUser, IServiceProvider resolver);
    }

    public class EstateOwnService : IEstateOwnService
    {
        public const string EstateViewKey = "EstateViewKey";
        private readonly ICommandCenter _commandCenter;
        private readonly IGDetailPlanetService _detailPlanetService;
        private readonly IGameUserService _gameUserService;
        private readonly IIndustrialComplex _industrialComplex;
        private readonly ILaboratory _laboratory;
        private readonly IUMotherJumpService _motherJumpService;
        private readonly IMothershipService _mothershipService;
        private readonly IShipyard _shipyard;
        private readonly IStoreService _storeService;
        private readonly ISynchronizer _synchronizer;
        private readonly ILocalizerService _localizer;

        public EstateOwnService(IShipyard shipyard,
            ILaboratory laboratory,
            IIndustrialComplex industrialComplex,
            ICommandCenter commandCenter,
            ISynchronizer synchronizer,
            IMothershipService mothershipService,
            IUMotherJumpService motherJumpService,
            IGameUserService gameUserService,
            IStoreService storeService,
            IGDetailPlanetService detailPlanetService, ILocalizerService localizer)
        {
            _shipyard = shipyard;
            _laboratory = laboratory;
            _industrialComplex = industrialComplex;
            _commandCenter = commandCenter;
            _synchronizer = synchronizer;
            _mothershipService = mothershipService;
            _motherJumpService = motherJumpService;
            _gameUserService = gameUserService;
            _storeService = storeService;
            _detailPlanetService = detailPlanetService;
            _localizer = localizer;
        }

        public Dictionary<string, IPlanshetViewData> GetEstate(IDbConnection connection, UserDataModel user, UserPremiumWorkModel userPremium, object own, OwnType ownType, bool synchronize = true)
        {
            switch (ownType)
            {
                case OwnType.Mother:
                    return GetMotherEstate(connection, user, userPremium, (UserMothershipDataModel) own, synchronize);
                case OwnType.Planet:
                    return GetPlanetEstate(connection, user, userPremium, (GDetailPlanetDataModel) own, synchronize);
                default:
                    throw new ArgumentOutOfRangeException(nameof(ownType), ownType, null);
            }
        }

        public Dictionary<string, IPlanshetViewData> GetEstate(IDbConnection connection, UserDataModel user, int ownId, bool synchronize = true)
        {
            return ownId == 0 ? GetMotherEstate(connection, user, synchronize) : GetPlanetEstate(connection, user, ownId, synchronize);
        }


        public Dictionary<string, IPlanshetViewData> GetPlanetEstate(IDbConnection connection, UserDataModel user, int ownId, bool synchronize = true)
        {
            var userPremium = _storeService.GetPremiumWorkModel(connection, user.Id);
            var planet = _detailPlanetService.GetUserPlanet(connection, ownId, user.Id);
            return GetPlanetEstate(connection, user, userPremium, planet, synchronize);
        }


        public Dictionary<string, IPlanshetViewData> GetPlanetEstate(IDbConnection connection, UserDataModel user, UserPremiumWorkModel userPremium, GDetailPlanetDataModel own, bool synchronize = true)
        {
            var planet = own;
            if (synchronize) planet = _synchronizer.UserPlanet(connection, own, userPremium, _detailPlanetService);

            var ic = _industrialComplex.GetPlanetCollection(connection, user, userPremium, planet, false);
            var shipyard = _shipyard.GetPlanetCollection(connection, user, userPremium, planet, false);
            var commandCentr = _commandCenter.GetPlanetCollection(connection, user, userPremium, planet, false);
            return new Dictionary<string, IPlanshetViewData>
            {
                {ic.UniqueId, ic},
                {shipyard.UniqueId, shipyard},
                {commandCentr.UniqueId, commandCentr}
            };
        }

        public Dictionary<string, IPlanshetViewData> GetMotherEstate(IDbConnection connection, UserDataModel user, bool synchronize = true)
        {
            var userPremium = _storeService.GetPremiumWorkModel(connection, user.Id);
            var mother = _mothershipService.GetMother(connection, user.Id);
            return GetMotherEstate(connection, user, userPremium, mother);
        }

        public Dictionary<string, IPlanshetViewData> GetMotherEstate(IDbConnection connection, UserDataModel user, UserPremiumWorkModel userPremium, UserMothershipDataModel own, bool synchronize = true)
        {
            var mother = own;
            if (synchronize)
                mother = _synchronizer.UserMothership(connection, own, userPremium, _mothershipService, _motherJumpService);
            var ic = _industrialComplex.GetMotherCollection(connection, user, userPremium, mother, false);
            var shipyard = _shipyard.GetMotherCollection(connection, user, userPremium, mother, false);
            var laboratory = _laboratory.GetMotherCollection(connection, user, userPremium, mother, false);
            return new Dictionary<string, IPlanshetViewData>
            {
                {ic.UniqueId, ic},
                {shipyard.UniqueId, shipyard},
                {laboratory.UniqueId, laboratory}
            };
        }

        public Dictionary<string, object> InitUser(IDbConnection connection, ClaimsPrincipal pricipalUser, IServiceProvider resolver)
        {
            if (pricipalUser == null) throw new NullReferenceException(nameof(pricipalUser));
            var allianceService = resolver.GetService<IAllianceService>();
            var sectorService = resolver.GetService<IGSectorsService>();
            var estateListService = resolver.GetService<IEstateListService>();
            var systemService = resolver.GetService<ISystemService>();
            var localizer = resolver.GetService<ILocalizerService>();

            var tmpUser = _gameUserService.GetCurrentGameUser(connection, pricipalUser);
            if (tmpUser == null) throw new NullReferenceException(nameof(tmpUser));
            var gameUser = _gameUserService.UpdateUserOnlineStatus(connection, tmpUser, true);
            var userChest = _storeService.GetChestUser(connection, gameUser.Id);
            var balanceData = (UchBalanceCcData) userChest.ActivatedItemsView[ProductTypeIds.Cc].Data;
            var up = (UchPremiumData) userChest.ActivatedItemsView[ProductTypeIds.Premium].Data;
            var userPremiumWm = new UserPremiumWorkModel(up.Premium);

            var motherData = _mothershipService.GetMother(connection, gameUser.Id);
            var mother =
                _synchronizer.UserMothership(connection, motherData, userPremiumWm, _mothershipService, _motherJumpService);

            var planetsData = _detailPlanetService.GetUserPlanets(connection, gameUser.Id);
            if (planetsData != null && planetsData.Any())
                planetsData = _synchronizer.UserPlanets(connection, planetsData, userPremiumWm, _detailPlanetService);
            _synchronizer.RunUserTasks(connection, gameUser.Id);

            var sectors = sectorService.GetInitSectors(connection);
            var allianceUser = allianceService.GetAllianceUserByUserId(connection, gameUser.Id);
            var alliance = allianceService.Initial(connection, allianceUser, _gameUserService);
            var personalInfo =
                _gameUserService.GetUserPlanshetProfile(connection,allianceUser.UserId, allianceUser.AllianceId, alliance, true);
            // обновляет пользователя в дб обект юзер обновляет по ссылке
            var myAlliance = (TabMyAllianceOut) alliance.Bodys[1].TemplateData;
            var connectionUser = _gameUserService.SetConnectionUser(connection, gameUser, allianceUser, myAlliance.Name);
            //btns
            var units = HangarUnitsOut.EmptyHangar();
            var keys = units.Keys.ToList();

            var systemGeometry = systemService.GetSystemGeometryViewData(connection, mother.StartSystemId);
            var motherEstates = GetMotherEstate(connection, gameUser, userPremiumWm, mother, false);

            var toggleBtns = new List<IButtonsView>
            {
                ButtonsView.HangarToggle()
            };

            var leftNavBtns = new List<IButtonsView>
            {
                ButtonsView.LefMenuNavAlliance(),
                ButtonsView.LefMenuNavConfederation(),
                ButtonsView.LefMenuNavJournal(),
                ButtonsView.LefMenuNavChannels()
            };
            var mapControllBtns = MapInfoService.MapControllButtons(_localizer);
            var hangarBtns = keys.Select(key => units[key]).Select(ButtonsView.HangarListBtns).ToList();
            //var storageModel = new StorageResources();
            //storageModel.InitializeField();

            var btns = new Dictionary<string, IReadOnlyList<IButtonsView>>
            {
                {"toggleBtns", toggleBtns},
                {"leftNavBtns", leftNavBtns},
                {"mapControllBtns", mapControllBtns},
                {"hangarBtns", hangarBtns}
            };
            var alianceNames = allianceService.GetAllianceNames(connection,false);


            var result = new Dictionary<string, object>
            {
                {localizer.TranslationKey, localizer.GetGameTranslate()},
                {ResourcesView.ViewKey, ResourcesView.GetInitList(balanceData.BalanceCc.Quantity)},
                {MapTypes.Sector.ToString(), sectors},
                {ButtonsView.BaseBtnsKey, btns},
                //todo data incorrect

                {UchView.ViewKey, userChest},
                {EstateItemOut.ViewKey, estateListService.GetList(connection, gameUser.Id)},
                {ConnectionUser.ViewKey, connectionUser},

                {alliance.UniqueId, alliance},
                {UserProfileInfo.AvatarViewKey, personalInfo},
                {EstateViewKey, motherEstates},
                {AllianceOut.AllianceNamesKey, alianceNames},
                {Planetoids.ViewKey, systemGeometry}
            };
            return result;
        }
    }
}