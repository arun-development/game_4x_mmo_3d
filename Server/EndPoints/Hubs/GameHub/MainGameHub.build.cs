using System;
using System.Data;
using System.Threading.Tasks;
using Server.Core.Interfaces;
using Server.Core.Interfaces.ForModel;
using Server.Core.StaticData;
using Server.Core.Tech;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Products;
using Server.Core.СompexPrimitive.Resources;
using Server.Core.СompexPrimitive.Units;
using Server.Services.GameObjects;
using Server.Services.GameObjects.BuildModel;
using Server.Services.GameObjects.BuildModel.CollectionBuild;
using Server.Services.OutModel;
using Server.EndPoints.Hubs.GameHub;

namespace Server.EndPoints.Hubs.GameHub
{
    public partial class MainGameHub
    {
        #region IPlanshetViewData build collections

        /// <summary>
        ///     Возвращает модель планшета для здания
        /// </summary>
        /// <param name="planetId"></param>
        /// <returns>planet IndustrialComplex</returns>
        public async Task<IPlanshetViewData> BuildGetIndustrialComplex(int planetId)
        {
            _tryCatch(() =>
            {
                if (planetId == 0) throw new Exception(Error.InputDataIncorrect);
            });
         
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                var planet = _gDetailPlanetService.GetUserPlanet(connection, planetId, cr.UserId);
                var gameUser = cr.GetGameUser(connection, _gameUserService);
                var pwm = cr.GetPremiumWorkModel(connection, _storeService);
                return _industrialComplex.GetPlanetCollection(connection, gameUser, pwm, planet);
            });
        }

        /// <summary>
        ///     Возвращает модель планшета для здания
        /// </summary>
        /// <param name="planetId"></param>
        /// <returns>planet CommandCenter</returns>
        public async Task<IPlanshetViewData> BuildGetCommandCenter(int planetId)
        {
            _tryCatch(() =>
            {
                if (planetId == 0) throw new Exception(Error.InputDataIncorrect);
            });
            return await _contextAction(connection =>
            {
               
                var cr = _getCurrentUser(connection);
                var planet = _gDetailPlanetService.GetUserPlanet(connection, planetId, cr.UserId);
                var gameUser = cr.GetGameUser(connection, _gameUserService);
                var pwm = cr.GetPremiumWorkModel(connection, _storeService);
                return _commandCenter.GetPlanetCollection(connection, gameUser, pwm, planet);
            });
        }

        /// <summary>
        ///     Возвращает модель планшета для здания
        /// </summary>
        /// <param name="planetId"></param>
        /// <returns>planet SpaceShipyard</returns>
        public async Task<IPlanshetViewData> BuildGetSpaceShipyard(int planetId)
        {
            _tryCatch(() =>
            {
                if (planetId == 0) throw new Exception(Error.InputDataIncorrect);
            });
            return await _contextAction(connection =>
            {
              
                var cr = _getCurrentUser(connection);
                var planet = _gDetailPlanetService.GetUserPlanet(connection, planetId, cr.UserId);
                var gameUser = cr.GetGameUser(connection, _gameUserService);
                var pwm = cr.GetPremiumWorkModel(connection, _storeService);
                return _shipyard.GetPlanetCollection(connection, gameUser, pwm, planet);
            });
        }

        /// <summary>
        ///     Возвращает модель планшета для здания
        /// </summary>
        /// <returns>MotherIndustrialComplex</returns>
        public async Task<IPlanshetViewData> BuildGetMotherIndustrialComplex()
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                var mother = _mothershipService.GetMother(connection, cr.UserId);
                var gameUser = cr.GetGameUser(connection, _gameUserService);
                var pwm = cr.GetPremiumWorkModel(connection, _storeService);
                return _industrialComplex.GetMotherCollection(connection, gameUser, pwm, mother);
            });
        }

        /// <summary>
        ///     Возвращает модель планшета для здания
        /// </summary>
        /// <returns>MotherSpaceShipyard</returns>
        public async Task<IPlanshetViewData> BuildGetMotherSpaceShipyard()
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                var mother = _mothershipService.GetMother(connection, cr.UserId);
                var gameUser = cr.GetGameUser(connection, _gameUserService);
                var pwm = cr.GetPremiumWorkModel(connection, _storeService);
                return _shipyard.GetMotherCollection(connection, gameUser, pwm, mother);
            });
        }

        /// <summary>
        /// </summary>
        /// <returns>MotherLaboratory</returns>
        public async Task<IPlanshetViewData> BuildGetMotherLaboratory()
        {
            return await   _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                var mother = _mothershipService.GetMother(connection, cr.UserId);
                var gameUser = cr.GetGameUser(connection, _gameUserService);
                var pwm = cr.GetPremiumWorkModel(connection, _storeService);
                return _laboratory.GetMotherCollection(connection, gameUser, pwm, mother);
            });
        }

        #endregion

        #region Build Item Common

        /// <summary>
        ///     planet builds only!
        /// </summary>
        /// <param name="data"></param>
        /// <param name="buildItemNativeName"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns> bool (true - upgrade added and data was changed) || int => wen buy for cc retturn new result cc</returns>
        public async Task<object> BuildItemUpgrade(UnitTurnOut data, string buildItemNativeName)
        {
            BuildNativeNames nativeName = default(BuildNativeNames);
            _tryCatch(() =>
            {
                if (data == null) throw new ArgumentNullException(nameof(data), Error.InputDataIncorrect);
                if (data.OwnId == 0) throw new ArgumentException(Error.InputDataIncorrect);

                var suc = Enum.TryParse(buildItemNativeName, out nativeName);
                if (!suc) throw new ArgumentException(Error.InputDataIncorrect);
            });
            
            return await _contextAction<object>(connection =>
            {
                var cr = _getCurrentUser(connection);

                var planet = _gDetailPlanetService.GetUserPlanet(connection, data.OwnId, cr.UserId);
                if (planet == null) throw new ArgumentNullException(Error.PlanetChangeOwner);
                var crPremium = cr.GetPremiumWorkModel(connection, _storeService);
                planet = _synchronizer.UserPlanet(connection, planet, crPremium, _gDetailPlanetService);


                if (nativeName == BuildNativeNames.EnergyConverter)
                {
                    var preResult = new BuildUpgrade(planet.Resources, planet.BuildEnergyConverter,
                        BuildNativeNames.EnergyConverter.ToString());


                    //todo  проверить премиум (непонятно что а коммент)
                    if (data.ForCc)
                        return _energyConverter.UpgradeForCc(connection, planet, cr.UserId, crPremium.IsActive,
                            preResult,
                            _svp);

                    var newResult = BuildUpgrade.SetUpgrade(preResult,
                        _energyConverter.CalcPrice(preResult.GetLevel(), crPremium.IsActive));
                    if (preResult.Equals(newResult)) return false;
                    preResult = newResult;
                    preResult.Progress.StartTime = UnixTime.UtcNow();
                    planet.Resources = preResult.StorageResources;
                    planet.BuildEnergyConverter = preResult.Progress;
                }
                else if (nativeName == BuildNativeNames.ExtractionModule)
                {
                    var preResult = new BuildUpgrade(planet.Resources, planet.BuildExtractionModule,
                        BuildNativeNames.ExtractionModule.ToString());


                    //todo  проверить премиум (непонятно что а коммент)
                    if (data.ForCc)
                        return _extractionModule.UpgradeForCc(connection, planet, cr.UserId, crPremium.IsActive, preResult, _svp);

                    var newResult = BuildUpgrade.SetUpgrade(preResult,
                        _extractionModule.CalcPrice(preResult.GetLevel(), crPremium.IsActive));

                    if (preResult.Equals(newResult)) return false;
                    preResult = newResult;
                    preResult.Progress.StartTime = UnixTime.UtcNow();
                    planet.Resources = preResult.StorageResources;
                    planet.BuildExtractionModule = preResult.Progress;
                }
                else if (nativeName == BuildNativeNames.SpaceShipyard)
                {
                    var preResult = new BuildUpgrade(planet.Resources, planet.BuildSpaceShipyard,
                        BuildNativeNames.SpaceShipyard.ToString());

                    //todo  проверить премиум (непонятно что за коммент)
                    if (data.ForCc)
                        return _spaceShipyard.UpgradeForCc(connection, planet, cr.UserId, crPremium.IsActive, preResult,
                            _svp);

                    var newResult = BuildUpgrade.SetUpgrade(preResult,
                        _spaceShipyard.CalcPrice(preResult.GetLevel(), crPremium.IsActive));

                    if (preResult.Equals(newResult)) return false;
                    preResult = newResult;
                    preResult.Progress.StartTime = UnixTime.UtcNow();
                    planet.Resources = preResult.StorageResources;
                    planet.BuildSpaceShipyard = preResult.Progress;
                }
                else if (nativeName == BuildNativeNames.Storage)
                {
                    var preResult = new BuildUpgrade(planet.Resources, planet.BuildStorage,
                        BuildNativeNames.Storage.ToString());


                    if (data.ForCc)
                        return _storage.UpgradeForCc(connection, planet, cr.UserId, crPremium.IsActive, preResult,
                            _svp);

                    var newResult = BuildUpgrade.SetUpgrade(preResult,
                        _storage.CalcPrice(preResult.GetLevel(), crPremium.IsActive));

                    if (preResult.Equals(newResult)) return false;
                    preResult = newResult;
                    preResult.Progress.StartTime = UnixTime.UtcNow();

                    planet.Resources = preResult.StorageResources;
                    planet.BuildStorage = preResult.Progress;
                }
                else if (nativeName == BuildNativeNames.Turel)
                {
                    var preResult = new BuildUpgrade(planet.Resources, planet.Turels,
                        BuildNativeNames.Turel.ToString());


                    if (data.ForCc)
                        return _turels.UpgradeForCc(connection, planet, cr.UserId, crPremium.IsActive, preResult,
                            _svp);
                    var newResult = BuildUpgrade.SetUpgrade(preResult, _turels.CalcPrice(1, crPremium.IsActive));

                    if (preResult.Equals(newResult)) return false;
                    preResult = newResult;
                    preResult.Progress.StartTime = UnixTime.UtcNow();

                    planet.Resources = preResult.StorageResources;
                    planet.Turels = preResult.Progress;
                }
                else
                {
                    throw new ArgumentException(Error.InputDataIncorrect);
                }
                _gDetailPlanetService.AddOrUpdate(connection,planet);

                return true;
            });
        }

        /// <summary>
        ///     planet builds only!
        /// </summary>
        /// <param name="planetId"></param>
        /// <param name="buildItemNativeName"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns>updated progress for build item </returns>
        public async Task<ItemProgress> BuildItemUpgraded(int planetId, string buildItemNativeName)
        {
            BuildNativeNames nativeName = default(BuildNativeNames);
            _tryCatch(() =>
            {
                if (planetId == 0) throw new Exception(Error.InputDataIncorrect);
             
                var suc = Enum.TryParse(buildItemNativeName, out nativeName);
                if (!suc) throw new Exception(Error.InputDataIncorrect);
            });
            
            
            return await _contextAction(connection =>
            {
       

                var cr = _getCurrentUser(connection);
                var planet = _gDetailPlanetService.GetUserPlanet(connection, planetId, cr.UserId);
                if (planet == null) throw new ArgumentNullException(Error.PlanetChangeOwner);
                var crPremium = cr.GetPremiumWorkModel(connection, _storeService);
                planet = _synchronizer.UserPlanet(connection, planet, crPremium, _gDetailPlanetService);

                switch (nativeName)
                {
                    case BuildNativeNames.EnergyConverter:
                        return _energyConverter.Upgraded(connection, planet, cr.UserId, crPremium.IsActive, _svp);
                    case BuildNativeNames.ExtractionModule:
                        return _extractionModule.Upgraded(connection, planet, cr.UserId, crPremium.IsActive, _svp);
                    case BuildNativeNames.SpaceShipyard:
                        return _spaceShipyard.Upgraded(connection, planet, cr.UserId, crPremium.IsActive, _svp);

                    case BuildNativeNames.Storage:
                        return _storage.Upgraded(connection, planet, cr.UserId, crPremium.IsActive, _svp);
                    case BuildNativeNames.Turel:
                        return _turels.Upgraded(connection, planet, cr.UserId, crPremium.IsActive, _svp);
                    default:
                        throw new ArgumentException(Error.InputDataIncorrect);
                }
            });
        }

        #endregion


        #region EnergyConverter

        /// <summary>
        ///     обменивает ресурс текцщего владения на другой тип ресурса текущего владения, сохраняет изменения в базу
        /// </summary>
        /// <param name="clientData">client name energyConverterChangeOutDataModel</param>
        /// <returns></returns>
        public async Task<bool> BuildEnergyConverterExchangeResource(EnergyConverterChangeOut clientData)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                var crPremium = cr.GetPremiumWorkModel(connection, _storeService);
                clientData.UserId = cr.UserId;
                if (clientData.OwnId == 0)
                {
                    var mother = _mothershipService.GetMother(connection, clientData.UserId);

                    mother = _synchronizer.UserMothership(connection, mother, crPremium, _mothershipService,
                        _motherJumpService);
                    return _energyConverter.CallculateNewResources(connection, _mothershipService, mother, clientData);
                }
                var planet = _gDetailPlanetService.GetUserPlanet(connection, clientData.OwnId, cr.UserId);
                planet = _synchronizer.UserPlanet(connection, planet, crPremium, _gDetailPlanetService);
                return _energyConverter.CallculateNewResources(connection, _gDetailPlanetService, planet, clientData);
            });
        }

        #endregion


        #region ExtractionModule

        /// <summary>
        ///     изменяет % добываемых ресурсов, фиксирует ресурсы так чтобы суммарно получалось 100% добычи
        /// </summary>
        /// <param name="clientData">extractionModuleChangeOutDataModel client name</param>
        /// <returns></returns>
        public async Task<bool> BuildExtractionModuleChangeProportion(ExtractionModuleChangeOut clientData)
        {
            _tryCatch(() =>
            {
                if (clientData == null) throw new ArgumentNullException(nameof(clientData), Error.InputDataIncorrect);
            });
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                _extractionModule.FixProportion(clientData.Proportion);
                clientData.UserId = cr.UserId;
                var crPremium = cr.GetPremiumWorkModel(connection, _storeService);

                if (clientData.OwnId == 0)
                {
                    var mother = _mothershipService.GetMother(connection, cr.UserId);
                    mother = _synchronizer.UserMothership(connection, mother, crPremium, _mothershipService,
                        _motherJumpService);
                    mother.ExtractionProportin = clientData.Proportion;
                    _mothershipService.AddOrUpdate(connection,mother);
                    return true;
                }
                var planet = _gDetailPlanetService.GetUserPlanet(connection, clientData.OwnId, cr.UserId);
                planet = _synchronizer.UserPlanet(connection, planet, crPremium, _gDetailPlanetService);
                planet.ExtractionProportin = clientData.Proportion;
                _gDetailPlanetService.AddOrUpdate(connection,planet);
                return true;
            });

        }

        // TODO NotImplemented - test data!
        public async Task<string> BuildExtractionModuleStopProduction(int ownId)
        {
            return await _makeAsync(() => "StopProduction - " + ownId);
        }

        // TODO NotImplemented - test data!
        public async Task<string> BuildExtractionModuleStartProduction(int ownId)
        {
            return await _makeAsync(() => "StartProduction - " + ownId);
        }

        #endregion

        #region SpaceShipyard

        /// <summary>
        ///     синхронизирует данные клиента и сервера об обновлении  юнита
        /// </summary>
        /// <param name="ownId"></param>
        /// <param name="unitTypeName"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<ItemProgress> BuildSpaceShipyardFixUnitTurn(int ownId, string unitTypeName)
        {
            UnitType unitType = default(UnitType);
            _tryCatch(() =>
            {
                if (!Enum.TryParse(unitTypeName, out unitType)) throw new NotImplementedException();
            });

            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                var crPremium = cr.GetPremiumWorkModel(connection, _storeService);
                if (ownId == 0)
                {
                    var mother = _mothershipService.GetMother(connection, cr.UserId);
                    mother = _synchronizer.UserMothership(connection, mother, crPremium, _mothershipService, _motherJumpService);
                    return _unit.FixItemProgress(unitType, mother, OwnType.Mother, crPremium);
                }

                var planet = _gDetailPlanetService.GetUserPlanet(connection, ownId, cr.UserId);
                planet = _synchronizer.UserPlanet(connection, planet, crPremium, _gDetailPlanetService);
                return _unit.FixItemProgress(unitType, planet, OwnType.Planet, crPremium);
            });
        }

        /// <summary>
        ///     аналог метода BuildItemUpgrade но для юнитов
        /// </summary>
        /// <param name="data"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns>bool || int (new cc)</returns>
        public async Task<object> BuildSpaceShipyardSetUnitTurn(UnitTurnOut data)
        {
            UnitType unitType = default(UnitType);
            _tryCatch(() =>
            {
                if (!Enum.TryParse(data.NativeName, out unitType)) throw new NotImplementedException();
            });

            return await _contextAction<object>(connection =>
            {
                var cr = _getCurrentUser(connection);
                var crPremium = cr.GetPremiumWorkModel(connection, _storeService);
                data.UserId = cr.UserId;
                if (data.ForCc) return _buildSpaceShipyardSetUnitTurnForCc(data, crPremium, cr.UserId);

                if (data.OwnId == 0)
                {
                    var mother = _mothershipService.GetMother(connection, cr.UserId);
                    mother = _synchronizer.UserMothership(connection, mother, crPremium, _mothershipService,
                        _motherJumpService);
                    _unit.SetMotherUnitTurn(connection, unitType, data.Count, mother, crPremium);
                    return true;
                }
                var planet = _gDetailPlanetService.GetUserPlanet(connection, data.OwnId, cr.UserId);
                planet = _synchronizer.UserPlanet(connection, planet, crPremium, _gDetailPlanetService);
                _unit.SetPlanetUnitTurn(connection, unitType, data.Count, planet, crPremium);
                return true;
            });
        }

        private async Task<int> _buildSpaceShipyardSetUnitTurnForCc(UnitTurnOut data, UserPremiumWorkModel userPremium,
            int useId)
        {
            
            UnitType unitType = default(UnitType);
            _tryCatch(() =>
            {
                if (!Enum.TryParse(data.NativeName, out unitType)) throw new NotImplementedException();
            });

            return await _contextAction(connection =>
            {
                if (data.OwnId == 0)
                {
                    var mother = _mothershipService.GetMother(connection, useId);
                    mother = _synchronizer.UserMothership(connection, mother, userPremium, _mothershipService,
                        _motherJumpService);
                    return _unit.CcUpgraded(connection, useId, unitType, data.Count, mother);
                }
                var planet = _gDetailPlanetService.GetUserPlanet(connection, data.OwnId, useId);
                planet = _synchronizer.UserPlanet(connection, planet, userPremium, _gDetailPlanetService);
                return _unit.CcUpgraded(connection, useId, unitType, data.Count, planet);
            });
        }

        #endregion

        #region Storage

        /// <summary>
        ///     получает все ресурсны для текущего владения
        /// </summary>
        /// <param name="ownId">if ownId ==0   получает данные мазера</param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns>ResourcesView</returns>
        public async Task<ResourcesView> BuildStorageGetResourcesView(int ownId = 0)
        {   
            throw new NotImplementedException(Error.NotUsedServerMethod);
            return await _contextAction(connection =>
            {
              
                var cr = _getCurrentUser(connection);
                var crPremium = cr.GetPremiumWorkModel(connection, _storeService);
                var resources = _buildStorageSynchronizedStorageResources(connection, ownId, crPremium, cr.UserId);

                return new ResourcesView
                {
                    StorageResources = resources,
                    Cc = _storeService.BalanceGetCc(connection, cr.UserId),
                };
            });
        }

        /// <summary>
        ///     получает игровые ресурсы переданого владения
        /// </summary>
        /// <param name="targetOwnId">  terget planetId планета или  0 if terget is mother</param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns>StorageResources</returns>
        public async Task<StorageResources> BuildStorageGetStorageResources(int targetOwnId)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                var crPremium = cr.GetPremiumWorkModel(connection, _storeService);
                return _buildStorageSynchronizedStorageResources(connection, targetOwnId, crPremium, cr.UserId);
            });
        }


        private StorageResources _buildStorageSynchronizedStorageResources(IDbConnection connection, int ownId, UserPremiumWorkModel crUserPremium, int crUserId)
        {
            StorageResources resources;
            if (ownId == 0)
            {
                var mother = _mothershipService.GetMother(connection, crUserId);
                mother = _synchronizer.UserMothership(connection, mother, crUserPremium, _mothershipService, _motherJumpService);
                resources = _storageResources.Execute(connection, crUserId, mother.Resources);
            }
            else
            {
                var planet = _gDetailPlanetService.GetUserPlanet(connection, ownId, crUserId);
                planet = _synchronizer.UserPlanet(connection, planet, crUserPremium, _gDetailPlanetService);
                resources = _storageResources.Execute(connection, crUserId, planet.Resources);
            }
            return resources;
        }


        public async Task<bool> BuildStorageDoTransfer(TransferResource data)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                var crPremium = cr.GetPremiumWorkModel(connection, _storeService);
                if (data.SourceType && data.TargetType)

                    _transferResourceService.TransPlanetToPlanet(connection, data.SourceId, data.TargetId, data.Resources,cr.UserId, crPremium);

                else if (data.SourceType && !data.TargetType)

                    _transferResourceService.TransPlanetToMother(connection, data.SourceId, data.Resources, cr.UserId,
                        crPremium);
                else if (!data.SourceType && data.TargetType)

                    _transferResourceService.TransMotherToPlanet(connection, data.TargetId, data.Resources, cr.UserId,
                        crPremium);
                return true;
            });
        }

        #endregion

        #region Turel

        #endregion

        #region Laboratory

        public async Task<ItemProgress> TechItemUpgraded(TechType techType)
        {
            return await _contextAction(connection =>
             {
                 var cr = _getCurrentUser(connection);
                 var mother = _mothershipService.GetMother(connection, cr.UserId);
                 var crPremium = cr.GetPremiumWorkModel(connection, _storeService);
                 mother = _synchronizer.UserMothership(connection, mother, crPremium, _mothershipService, _motherJumpService);

                 return mother.TechProgress[techType];
             });



        }

        public async Task<object> BuildLaboratorySetTechTurn(UnitTurnOut data)
        {
            TechType techType = default(TechType);
            _tryCatch(() =>
            {
                if (data == null) throw new ArgumentNullException(nameof(data), Error.InputDataIncorrect);
                var suc = Enum.TryParse(data.NativeName, out techType);
                if (!suc) throw new ArgumentException(Error.InputDataIncorrect);
            });
 

            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                data.UserId = cr.UserId;
                var crPremium = cr.GetPremiumWorkModel(connection, _storeService);
                var mother = _mothershipService.GetMother(connection, cr.UserId);
                mother = _synchronizer.UserMothership(connection, mother, crPremium, _mothershipService, _motherJumpService);
                return _laboratory.SetTechTurn(connection, techType, data, mother, crPremium);
            });






        }

        #endregion
    }
}