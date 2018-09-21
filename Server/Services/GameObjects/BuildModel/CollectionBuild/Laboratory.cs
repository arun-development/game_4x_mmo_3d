using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using MoreLinq;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.Core.StaticData;
using Server.Core.Tech;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Products;
using Server.DataLayer;
using Server.Services.GameObjects.BuildModel.BuildItem;
using Server.Services.GameObjects.BuildModel.View;
using Server.Services.HtmlHelpers;
using Server.Services.OutModel;

namespace Server.Services.GameObjects.BuildModel.CollectionBuild
{
    public interface ILaboratory : IBuildCollection
    {
        object SetTechTurn(IDbConnection connection, TechType techType, UnitTurnOut input, UserMothershipDataModel mother, UserPremiumWorkModel premium);
    }


    public class Laboratory : BuildCollection, ILaboratory
    {
        private const string LaboratoryId = "laboratory";
        private readonly ILaboratoryBuild _laboratoryBuild;

        public Laboratory(IMothershipService mothershipService,
            IGDetailPlanetService gDetailPlanetService,
            ISynchronizer synchronizer,
            IStoreService storeService,
            IGameUserService gameUserService,
            IUMotherJumpService motherJumpService,
            ILaboratoryBuild laboratoryBuild) : base(mothershipService, gDetailPlanetService, synchronizer,
            storeService, gameUserService, motherJumpService)
        {
            _laboratoryBuild = laboratoryBuild;
        }

        protected override PlanshetViewData _getMotherCollection(List<BuildItemUnitView> buildList)
        {
            var result = PlanshetBodyHelper.SetBody(buildList,
                "tr_Laboratory",
                BuildPrefixId + LaboratoryId,
                BuildTemplate, BuildTemplate);
            result.IsMother = true;
            return result;
        }


        public override List<BuildItemUnitView> GetMotherBuildList(UserMothershipDataModel mother,
            UserPremiumWorkModel userPremium)
        {
            var teches = new BattleTeches(mother.TechProgress);
            var techesOut = teches.ConvertToTechesOut(false);


            var propertiesView = teches.CreateBuildItemTechData(false);
            var result = new List<BuildItemUnitView>();
            techesOut.ForEach(i =>
            {
                var techOut = techesOut[i.Value.TechType];
                techOut.CalcResultPrice(userPremium.IsActive);
                var model = new BuildItemUnitView
                {
                    Progress = i.Value.Progress,
                    TranslateName = i.Value.Text.Name,
                    NativeName = i.Value.TechType.ToString(),
                    IconSelf = i.Value.SpriteImages.Icon,
                    Info = new BuildDropItemInfo
                    {
                        Description = i.Value.Text.Description,
                        DropImage = i.Value.SpriteImages.Detail,
                        Data = propertiesView[i.Value.TechType]
                    },
                    Update = new BuildDropItemUpdate
                    {
                        Properties = propertiesView[i.Value.TechType].Properties.Select(p => p.Value).ToList(),
                        Price = i.Value.BasePrice,
                        IsUnitUpgrade = false
                    },
                    IsBuildItem = false,
                    AdvancedData = new Dictionary<string, object>
                    {
                        {"TechOut", techOut}
                    }
                };
                model.SetComplexButtonView();
                if (!techOut.Disabled)
                    model.Update.SetButtons(true);


                result.Add(model);
            });
            return result;
        }


        public override List<BuildItemUnitView> GetPlanetBuildList(GDetailPlanetDataModel planet,
            UserPremiumWorkModel userPremium)
        {
            throw new NotImplementedException("laboratory not exist in planet");
        }

        protected override PlanshetViewData _getPlanetCollection(List<BuildItemUnitView> buildList)
        {
            throw new NotImplementedException("laboratory not exist in planet");
        }

        public object SetTechTurn(IDbConnection connection, TechType techType, UnitTurnOut input, UserMothershipDataModel mother, UserPremiumWorkModel premium)
        {
            var teches = new BattleTeches(mother.TechProgress);
            var techesOut = teches.ConvertToTechesOut(false);
            var tech = techesOut[techType];
            if (tech.Disabled) throw new NotImplementedException(Error.TechDisabled);
            tech.CalcResultPrice(premium.IsActive);
            var price = tech.BasePrice;
            if (input.ForCc)
            {
                var cc = (int) price.Cc;
                var preResultCc = _storeService.BalanceCalcResultCc(connection, input.UserId, cc);
                ItemProgress.ProgressUpdateComplite(tech.Progress);
                mother.TechProgress = teches.ConvertToDbTeches();
                _mothershipService.AddOrUpdate(connection,mother);
                _storeService.AddOrUpdateBalance(connection, preResultCc);
                return preResultCc.Quantity;
            }
            if (tech.Progress.IsProgress == true)
                throw new Exception(Error.TechInProgress);

            var bu = new BuildUpgrade(mother.Resources, tech.Progress, techType.ToString());

            var newBu = BuildUpgrade.SetUpgrade(bu, price);
            newBu.Progress.StartTime = UnixTime.UtcNow();
            mother.Resources = newBu.StorageResources;
            tech.Progress.SetFromOther(newBu.Progress);
            mother.TechProgress = teches.ConvertToDbTeches();
            _mothershipService.AddOrUpdate(connection,mother);
            return true;
        }
    }
}