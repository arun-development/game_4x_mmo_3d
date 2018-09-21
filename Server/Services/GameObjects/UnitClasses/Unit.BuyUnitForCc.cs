using System;
using System.Data;
using Server.Core.Interfaces;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive.Units;
using Server.DataLayer;

namespace Server.Services.GameObjects.UnitClasses
{
    public partial class Unit
    {
        public int CcUpgraded(IDbConnection connection, int userId, UnitType unitType, int count, object ownData)
        {
            var baseUnit = UnitHelper.GetBaseUnit(unitType);
            var unitBaseCCprice = baseUnit.BasePrice.Cc;
            var ccPrice = unitBaseCCprice * count;
            var userBalance = _storeService.BalanceGet(connection, userId);
            if (ccPrice > userBalance.Quantity)
            {
                if (userBalance.Quantity < unitBaseCCprice) throw new Exception(Error.NotEnoughCc);
                var newUnitCount = (int) Math.Floor(userBalance.Quantity / unitBaseCCprice);
                count = newUnitCount;
                ccPrice = unitBaseCCprice * count;
            }
            userBalance = _storeService.BalanceCalcResultCc(connection, userBalance, (int) ccPrice);
            var ccToSave = userBalance.Quantity;
            var type = ownData.GetType();
            if (type == typeof(UserMothershipDataModel))
            {
                var mother = (UserMothershipDataModel) ownData;
                mother.Hangar[unitType] += count;
                _mother.AddOrUpdate(connection, mother);
            }
            else if (type == typeof(GDetailPlanetDataModel))
            {
                var planet = (GDetailPlanetDataModel) ownData;
                planet.Hangar[unitType] += count;
                _planet.AddOrUpdate(connection,planet);
            }
            else
            {
                throw new NotImplementedException();
            }

            _storeService.AddOrUpdateBalance(connection, userBalance);
            return ccToSave;
        }
    }
}