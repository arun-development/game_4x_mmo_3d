using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Server.Core.Interfaces.ForModel;
using Server.Core.Map;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive.Units;
using Server.Services.GameObjects.BuildModel.CollectionBuild;

namespace Server.EndPoints.Hubs.GameHub
{
    public partial class MainGameHub
    {
        /// <summary>
        ///     получает синхронизированные данные  ангара по текущему владению
        /// </summary>
        /// <param name="ownId">0 mother, else planetId</param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns>calculated units</returns>
        public async Task<Dictionary<UnitType, HangarUnitsOut>> EstateGetHangar(int ownId)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                var userPremium = _storeService.GetPremiumWorkModel(connection, cr.UserId);
                if (ownId == 0)
                {
                    var mother = _mothershipService.GetMother(connection, cr.UserId);
                    mother = _synchronizer.UserMothership(connection, mother, userPremium, _mothershipService, _motherJumpService);
                    return _unit.GetherHangarUnits(mother, userPremium, OwnType.Mother);
                }
                var planet = _gDetailPlanetService.GetUserPlanet(connection, ownId, cr.UserId);
                planet = _synchronizer.UserPlanet(connection, planet, userPremium, _gDetailPlanetService);
                return _unit.GetherHangarUnits(planet, userPremium, OwnType.Planet);
            });
        }


        /// <summary>
        ///     получает весь список доступных владений пользователя на текущший момент
        /// </summary>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<IList<EstateItemOut>> EstateGetEstateList()
        {
            return await _contextAction(connection =>

            {
                var cr = _getCurrentUser(connection);
                return _estateListService.GetList(connection, cr.UserId);
            });
        }


        /// <summary>
        ///     получает  данные для едиственнго эллемента если пользователю принаджеэит плантеа иначе выбрасывает исключение
        /// </summary>
        /// <param name="planetId"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<EstateItemOut> EstateGetEstateItemByPlanetId(int planetId)
        {
            _tryCatch(() =>
            {
                if (planetId == 0) throw new ArgumentException(Error.InputDataIncorrect, nameof(planetId));
            });

            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                return _estateListService.GetPlanetItem(connection, planetId, cr.UserId);
            });
        }


        /// <summary>
        ///     получает синхронизированные данные по переданному владению для всех зданий которые могут принаджать текущему типу
        ///     владения
        /// </summary>
        /// <param name="ownId">0 mother, else planetId</param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<Dictionary<string, IPlanshetViewData>> EstateGetFullEstate(int ownId)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                var gameUser = cr.GetGameUser(connection, _gameUserService);
                return _estateOwnService.GetEstate(connection, gameUser, ownId);
            });
        }
    }
}