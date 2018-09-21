using System;
using System.Collections.Generic;
using System.Data;
using Server.Core.Interfaces;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Products;
using Server.Core.СompexPrimitive.Resources;
using Server.Core.СompexPrimitive.Units;
using Server.DataLayer;
using Server.Services.GameObjects.BuildModel.CollectionBuild;

namespace Server.Services.GameObjects.UnitClasses
{
    public partial class Unit
    {
        //===============================Set Unit Turn===================================
        public ItemProgress SetUnitTurn(IDbConnection connection, UnitType unitType, int count, int userId, int ownId)
        {
            var userPremium =   _storeService.GetPremiumWorkModel(connection, userId);

            if (ownId == 0)
            {
                var mother =   _mother.GetMother(connection, userId);
                if (mother == null) throw new ArgumentNullException(nameof(mother), Error.IsEmpty);
                return   SetUnitTurn(connection, unitType, count, mother, OwnType.Mother, userPremium);
            }
            var planet =   _planet.GetUserPlanet(connection, ownId, userId);
            if (planet == null) throw new ArgumentNullException(nameof(planet), Error.IsEmpty);
            return   SetUnitTurn(connection, unitType, count, planet, OwnType.Mother, userPremium);
        }

        public ItemProgress SetUnitTurn(IDbConnection connection, UnitType unitType, int count, object dataModel, OwnType ownType, UserPremiumWorkModel userPremium)
        {
            switch (ownType)
            {
                case OwnType.Mother:
                    return SetMotherUnitTurn(connection, unitType, count, (UserMothershipDataModel) dataModel, userPremium);
                case OwnType.Planet:
                    return SetPlanetUnitTurn(connection, unitType, count, (GDetailPlanetDataModel) dataModel, userPremium);
                default:
                    throw new ArgumentOutOfRangeException(nameof(ownType), ownType, null);
            }
        }

        public ItemProgress SetMotherUnitTurn(IDbConnection connection, UnitType unitType, int count, UserMothershipDataModel mother, UserPremiumWorkModel userPremium)
        {
            var hangarCount = mother.Hangar[unitType];
            UnitModel unit = null;
             
                GetTurnResultData(connection, unitType, count, userPremium.UserId, 0, mother.Resources, mother.UnitProgress,
                    (newUnitModel, newRes) =>
                    {
                        unit = newUnitModel;
                        mother.Resources = newRes;
                    });

            _mother.AddOrUpdate(connection, mother);
            return CalculateUnitProgress(mother.UnitProgress[unitType], unit.BasePrice.TimeProduction, 1, userPremium,
                hangarCount);
        }

        public ItemProgress SetPlanetUnitTurn(IDbConnection connection, UnitType unitType, int count, GDetailPlanetDataModel planet, UserPremiumWorkModel userPremium)
        {
            var hangarCount = planet.Hangar[unitType];

            UnitModel unit = null;
             
                GetTurnResultData(connection, unitType, count, userPremium.UserId, planet.Id, planet.Resources, planet.UnitProgress,
                    (newUnit, newRes) =>
                    {
                        unit = newUnit;
                        planet.Resources = newRes;
                    });
              _planet.AddOrUpdate(connection,planet);
            return CalculateUnitProgress(planet.UnitProgress[unitType], unit.BasePrice.TimeProduction, 1, userPremium,
                hangarCount);
        }


        private static void AddUnitToCurrenUnitTurn(ref Dictionary<UnitType, TurnedUnit> collection, TurnedUnit newItem)
        {
            if (collection.ContainsKey(newItem.UnitType)) collection[newItem.UnitType].TotalCount += newItem.TotalCount;
            else collection.Add(newItem.UnitType, newItem);
        }


        /// <summary>
        ///     Вычисляет данные для записи нового эллемента очереди юнита на мезере ил планете
        /// </summary>
        /// <param name="unitType">Native name Unit</param>
        /// <param name="count">Желаемое количество для покупки</param>
        /// <param name="resource">текушие ресурсы пользователя</param>
        /// <param name="unit">тип юнита который мы покупаем</param>
        /// <param name="resultPrice">Итоговая стоимость пачки с учетом проверки на нехватку ресурсов</param>
        /// <param name="unitTurnModel">новый эллемент очереди (еще не просумированный с основной очередью)</param>
        private static void InitializeUnitTurn(UnitType unitType, int count, StorageResources resource, UnitModel unit,out MaterialResource resultPrice, out TurnedUnit unitTurnModel)
        {
            var basePrice = unit.BasePrice;

            //вычисляем стоимость пачки
            var price = MaterialResource.CalcUnitsPrice(basePrice, count);
            int resultCount;

            //проверяем хватает ли ресурсов
            if (MaterialResource.EnoughResourses(resource.Current, price))
            {
                resultCount = count;
                resultPrice = price;
            }
            else
            {
                var newCount = CalculateMaxCount(basePrice, resource.Current);
                if (newCount == 0) throw new Exception(Error.NotEnoughResources);
                resultCount = newCount;
                resultPrice = MaterialResource.CalcUnitsPrice(basePrice, newCount);
            }

            //устанавливаем модель
            var time = UnixTime.UtcNow();
            unitTurnModel = new TurnedUnit
            {
                TotalCount = resultCount,
                DateCreate = time,
                UnitType = unitType,
                DateLastUpgrade = time
            };
        }

        /// <summary>
        ///     Основной метод работы между  запросом к бд и записью в бд для новой очереди.
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="unitType"></param>
        /// <param name="count"></param>
        /// <param name="userId"></param>
        /// <param name="ownId"></param>
        /// <param name="dbResource"></param>
        /// <param name="dbTurns"></param>
        /// <param name="setData"></param>
        private void GetTurnResultData(IDbConnection connection, UnitType unitType, int count, int userId, int ownId, StorageResources dbResource, Dictionary<UnitType, TurnedUnit> dbTurns, Action<UnitModel, StorageResources> setData)
        {
            var resource =   _storageResourcesService.Execute(connection, userId, dbResource, ownId);
            var unit = UnitHelper.GetBaseUnit(unitType);
            MaterialResource resultPrice;
            TurnedUnit unitTurnModel;

            InitializeUnitTurn(unitType, count, resource, unit, out resultPrice, out unitTurnModel);

            AddUnitToCurrenUnitTurn(ref dbTurns, unitTurnModel);
            // подсчитываем новые ресурсы
            var newResources = resource;
            newResources.Current = MaterialResource.CalcNewResoursesFromBuy(resource.Current, resultPrice);
            setData(unit, newResources);
        }
    }
}