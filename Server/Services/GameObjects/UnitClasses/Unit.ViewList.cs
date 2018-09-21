using System;
using System.Collections.Generic;
using System.Linq;
using Server.Core.Infrastructure.Unit;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Products;
using Server.Core.СompexPrimitive.Units;
using Server.Services.GameObjects.BuildModel.CollectionBuild;
using Server.Services.GameObjects.BuildModel.View;

namespace Server.Services.GameObjects.UnitClasses
{
    public class BuildItemUnitData
    {
        public bool IsUnitDetail { get; set; }
        public UnitStats UnitStats { get; set; }

        public BuildItemUnitData()
        {
        }

        public BuildItemUnitData(bool isUnitDetail, UnitStats unitStats)
        {
            IsUnitDetail = isUnitDetail;
            UnitStats = unitStats;
        }
    }

    public partial class Unit
    {
        public static List<BuildItemUnitView> GetBuildItemUnitViewList(Dictionary<UnitType, int> hangarUnits,
            Dictionary<UnitType, TurnedUnit> unitTurn, ItemProgress spaceShipyard, UserPremiumWorkModel userPremium,
            OwnType ownType)
        {
            var unitTypes = UnitList.UnitsTypesList.ToList();
            // if (ownType == OwnType.Mother && unitTypes.Count == 5) unitTypes.RemoveRange(3, 2);
            var units = unitTypes.Select(i => GetUnitViewInSpaceShipyard(i, hangarUnits[i],
                (unitTurn.ContainsKey(i)) ? unitTurn[i] : null,
                spaceShipyard, userPremium)).ToList();
            return units;
        }

        private static BuildItemUnitView GetUnitViewInSpaceShipyard(UnitType unitType, int hangarCount,
            TurnedUnit upgrade, ItemProgress spaceShipyard, UserPremiumWorkModel userPremium)
        {
            var unit = UnitHelper.GetBaseUnit(unitType);
 
            var baseTime = unit.BasePrice.TimeProduction;

            var buildLevel = 1;
            if (spaceShipyard?.Level != null) buildLevel = (int) spaceShipyard.Level;
            var price = unit.BasePrice.CreateNewFromThis();

            //=================

            price.TimeProduction =
                (int) Math.Ceiling(CalculateTimeProduction(baseTime, userPremium.IsActive, buildLevel));


            var progress = ((upgrade != null)
                ? CalculateUnitProgress(upgrade, baseTime, buildLevel, userPremium, hangarCount)
                : new ItemProgress
                {
                    Level = hangarCount,
                    IsProgress = false
                });


            var unitText = unit.Text;
            var model = new BuildItemUnitView
            {
                Progress = progress,
                TranslateName = unitText.Name,
                NativeName = unit.Key,
                IconSelf = unit.SpriteImages.Icon,
                Info = new BuildDropItemInfo
                {
                    Description = unitText.Description,
                    DropImage = unit.SpriteImages.Detail,
                    Data = new BuildItemUnitData(true, unit.UnitStats)
                },
                //Action = new BuildDropItemAction
                //{
                //    ViewPath = BuildExtractionModuleActions.ViewPath,
                //    Data = new BuildExtractionModuleActions
                //    {
                //        //todo  реализовать
                //        Power = power,
                //        Percent = new MaterialResource().Init(percentE, percentIr, percentDm),
                //        ExtractionPerHour = new MaterialResource().Init(valE, valIr, valDm),
                //    }
                //},
                Update = new BuildDropItemUpdate
                {
                    Price = price,
                    IsUnitUpgrade = true
                },
                IsBuildItem = false
            };
            model.SetComplexButtonView();
            model.Update.SetButtons();
            return model;
        }
    }
}