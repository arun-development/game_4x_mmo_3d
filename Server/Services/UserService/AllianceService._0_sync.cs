using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Infrastructure;
using Server.Core.Infrastructure.Alliance;
using Server.Core.Interfaces.UserServices;
using Server.Core.Npc;
using Server.Core.Pager;
using Server.Core.StaticData;
using Server.Core.Tech;
using Server.DataLayer;
using Server.DataLayer.LocalStorageCaches;
using Server.DataLayer.Repositories;
using Server.Extensions;
using Server.Modules.Localize;
using Server.Services.NpcArea;
using Server.Services.OutModel;

namespace Server.Services.UserService
{
    public partial class AllianceService : IAllianceService
    {
        private readonly IAllianceLocalStorageCache _aCache;

        private readonly IAllianceFleetLocalStorageCache _aFleetCache;

        private readonly IAlianceNameSercherPkCache _aNameSercher;
        private readonly IAllianceRepository _aRepo;

        private readonly IAllianceRequestMessageLocalStorageCache _armCache;
        private readonly IAllianceRequestMessageRepository _armRepo;


        private readonly IAllianceRoleRepository _aRolesRepo;

        private readonly IAllianceTechLocalStorageCache _aTechCahce;
        private readonly IAllianceTechRepository _aTechRepo;
        private readonly ChannelService _channelService;

        private readonly IGDetailPlanetLocalStorageCache _planetDetailCache;
        private readonly ILocalizerService _localizer;



        public AllianceService(
            IAllianceRepository aRepo,
            IAllianceLocalStorageCache aCache,
            IAllianceUserRepository aUserRepo,
            IAllianceUserLocalStorageCache aUserCache,
            IAllianceRequestMessageRepository armRepo,
            IAllianceRequestMessageLocalStorageCache armCache,
            IAllianceRoleRepository aRolesRepo,
            IAllianceRoleLocalStorageCache aRolesCache,
            IAlianceNameSercherPkCache aNameSercher,
            IGDetailPlanetLocalStorageCache planetDetailCache,
            IAllianceTechLocalStorageCache aTechCahce,
            IAllianceFleetLocalStorageCache aFleetCache,
            IAllianceTechRepository aTechRepo,
            IChannelService channelService, ILocalizerService localizer)
        {
            _aRepo = aRepo;
            _aCache = aCache;
            _aUserRepo = aUserRepo;
            _aUserCache = aUserCache;
            _armRepo = armRepo;
            _armCache = armCache;
            _aRolesRepo = aRolesRepo;
            _aRolesCache = aRolesCache;
            _aNameSercher = aNameSercher;
            _planetDetailCache = planetDetailCache;
            _aTechCahce = aTechCahce;
            _aFleetCache = aFleetCache;
            _aTechRepo = aTechRepo;
            _localizer = localizer;
            _channelService = (ChannelService)channelService;
        }


        public string Test(string message = "Ok")
        {
            return message;
        }

        #region base

        private AllianceDataModel _updateAllianceInfo(IDbConnection connection, AllianceDataModel allianceInfo)
        {
            return _aCache.UpdateLocalItem(connection, _aRepo.AddOrUpdateeModel(connection, allianceInfo));
        }

        private AllianceDataModel _addAlliance(IDbConnection connection, AllianceDataModel dataModel)
        {
            AllianceDataModel newAllianceData = null;
            AllianceUserDataModel newCreatorAllianceUser = null;
            AllianceTechDataModel newTeches = null;

            var tech = new BattleTeches();
            tech.CreateStartTeches();
            var newDbTeches = tech.ConvertToDbTeches().ToSerealizeString();

            var al = _aRepo.AddOrUpdate(connection, _aRepo.ConvertToEntity(dataModel));
            newAllianceData = _aRepo.ConvertToWorkModel(al);
            var au = _aUserRepo.AddOrUpdate(connection, new alliance_user
            {
                allianceId = al.Id,
                userId = al.creatorId,
                roleId = (byte)AllianceRoles.Creator,
                dateCreate = al.dateCreate
            });

            newCreatorAllianceUser = _aUserRepo.ConvertToWorkModel(au);

            var teches = _aTechRepo.AddOrUpdate(connection, new alliance_tech
            {
                Id = al.Id,
                techProgress = newDbTeches
            });
            newTeches = _aTechRepo.ConvertToWorkModel(teches);
            if (newAllianceData == null || newCreatorAllianceUser == null || newTeches == null)
            {
                throw new NotImplementedException();
            }

            var lcAllianceData = _aCache.UpdateLocalItem(connection, newAllianceData);
            _aUserCache.UpdateLocalItem(connection, newCreatorAllianceUser);
            _aTechCahce.UpdateLocalItem(connection, newTeches);
            return lcAllianceData;
        }



        public AllianceDataModel AddOrUpdate(IDbConnection connection, AllianceDataModel dataModel)
        {

            AllianceDataModel createdOrUpdatedData = null;
            if (dataModel.IsNewDataModel())
            {

                createdOrUpdatedData = _addAlliance(connection, dataModel);
            }
            else
            {
                var existAlliance = _aRepo.GetById(connection, dataModel.Id);
                if (existAlliance == null|| existAlliance.Id == default(int))
                {
                    var savedAllianceId =dataModel.Id;
                    dataModel.Id = 0;
                    createdOrUpdatedData = _addAlliance(connection, dataModel);
                    if (createdOrUpdatedData.Id!= savedAllianceId) {
                        dataModel.Id = savedAllianceId;
                        throw new NotImplementedException($"createdOrUpdatedData.Id!= savedAllianceId expect:{savedAllianceId}, returned:{createdOrUpdatedData.Id}");
                    }
                    dataModel.Id = savedAllianceId;

                }
                else {
                    createdOrUpdatedData = _updateAllianceInfo(connection, dataModel);
                }
             
            }
            if (createdOrUpdatedData == null)
            {
                throw new NotImplementedException();
            }
            _aNameSercher.AddOrUpdate(connection, createdOrUpdatedData.Name, new AllianceNameSerchItem
            {
                Id = createdOrUpdatedData.Id,
                Name = createdOrUpdatedData.Name,
                Disbandet = createdOrUpdatedData.Disbandet
            }, _aCache);
            return createdOrUpdatedData;
        }


        public bool Delete(IDbConnection connection, int allianceId)
        {
            var confederation = NpcHelper.GetNpcByName(Npc.ConfederationName);
            if (allianceId == confederation.NpcAlliance.Id)
            {
                throw new NotImplementedException(nameof(confederation.NpcAlliance.Id));
            }
            var skagry = NpcHelper.GetNpcByName(Npc.SkagyName);
            if (allianceId == skagry.NpcAlliance.Id)
            {
                throw new NotImplementedException(nameof(skagry.NpcAlliance.Id));
            }

            var allaicne = GetAllianceById(connection, allianceId, true);
            return Delete(connection, allaicne);
        }

        public bool Delete(IDbConnection connection, AllianceDataModel alliance)
        {
            if (alliance == null)
            {
                throw new NullReferenceException();
            }
            var confederation = NpcHelper.GetNpcByName(Npc.ConfederationName);
            if (alliance.Id == confederation.NpcAlliance.Id)
            {
                throw new NotImplementedException(nameof(confederation.NpcAlliance.Id));
            }
            var skagry = NpcHelper.GetNpcByName(Npc.SkagyName);
            if (alliance.Id == skagry.NpcAlliance.Id)
            {
                throw new NotImplementedException(nameof(skagry.NpcAlliance.Id));
            }


            var allianceId = alliance.Id;
            DisbandAlliance(connection, alliance.CreatorId, allianceId);
            _aRepo.Delete(connection, allianceId);

            return _channelService.DeleteAllianceChannel(null, allianceId);


        }


        public bool DeleteAll(IDbConnection connection)
        {
            try
            {
                _aRepo.DeleteAllCascadeProcedure(connection);
                _channelService.DeleteAll(connection);
            }
            finally
            {
                _aNameSercher.ClearStorage();
                _aCache.ClearStorage();
                _aUserCache.ClearStorage();
                _armCache.ClearStorage();
                _aFleetCache.ClearStorage();
                _aTechCahce.ClearStorage();
            }
            return true;
        }

        #endregion

        #region GetAlliance

        public AllianceDataModel GetAllianceById(IDbConnection connection, int allianceId, bool deactivated)
        {
            var alliance = _aCache.GetById(connection, allianceId, true);
            if (!deactivated)
            {
                return alliance.Disbandet ? null : alliance;
            }
            if (alliance == null)
            {
                return _aRepo.GetModelById(connection, allianceId);
            }
            return alliance;
        }

        public TResult GetAllianceById<TResult>(IDbConnection connection, int allianceId, Func<AllianceDataModel, TResult> selector)
        {
            var alliance = GetAllianceById(connection, allianceId, false);
            return alliance == null ? default(TResult) : selector(alliance);
        }


        public IList<AllianceDataModel> GetAllAlliances(IDbConnection connection, bool whidthDisbandet)
        {
            if (whidthDisbandet)
            {
                return _aCache.LocalGetAll(connection);
            }
            return _aCache.LocalWhereList(connection, i => !i.Disbandet);
        }

        public IList<TResult> GetAllAlliances<TResult>(IDbConnection connection, Func<AllianceDataModel, TResult> selector, bool whidthDisbandet)
        {
            return _aCache.LocalWhereSelect(connection, i => i.Disbandet == whidthDisbandet, selector);
        }

        public IList<IAllianceNameSerchItem> GetAllianceNames(IDbConnection connection, bool selectWidthDisbandet)
        {
            var items = _aNameSercher.GetAll(connection, _aCache);
            // ReSharper disable once ConvertIfStatementToReturnStatement

            if (selectWidthDisbandet)
            {
                return items.Select(i => i.Value).ToList();
            }
            return items.Where(i => i.Value.Disbandet != true).Select(i => i.Value).ToList();
        }

        public IList<IAllianceNameSerchItem> GetAllianceNamesByPartName(IDbConnection connection, string partAllianceName, bool selectWidthDisbandet)
        {
            var items = _aNameSercher.TryFind(connection, partAllianceName, _aCache);
            // ReSharper disable once ConvertIfStatementToReturnStatement
            if (selectWidthDisbandet)
            {
                return items.Select(i => i.Value).ToList();
            }
            return items.Where(i => i.Value.Disbandet != true).Select(i => i.Value).ToList();
        }

        #endregion

        #region Names and GetByPartName

        public IList<AllianceDataModel> GetAlliancesByPartAllianeName(IDbConnection connection, string partAllianceName)
        {
            var aliances = _aNameSercher.TryFind(connection, partAllianceName, _aCache);
            var aIds = aliances.Select(i => i.Value.Id).ToList();
            return _aCache.GetDataModelItems(connection, aIds);
        }

        public IList<TResult> GetAlliancesByPartAllianeName<TResult>(IDbConnection connection, string partAllianceName, Func<AllianceDataModel, TResult> selector, int takeCount = PagerDefaults.MaxItemInStack)
        {
            var aliances = GetAlliancesByPartAllianeName(connection, partAllianceName);
            var aCount = aliances.Count;
            if (takeCount > aCount)
            {
                takeCount = aCount;
            }
            return aliances
                .Take(takeCount)
                .Select(selector).ToList();
        }

        public IAllianceNameSerchItem GetAllianceNameObj(IDbConnection connection, string allianceName)
        {
            var name = allianceName.ToUpper();
            var allianceSerchItem = _aNameSercher.TryGetValue(connection, name, _aCache);
            if (allianceSerchItem != null)
            {
                return allianceSerchItem;
            }
            var tmp = _aRepo.GetAllianceNameObj(connection, name);
            if (tmp == null) return null;
            return _aNameSercher.AddOrUpdate(connection, name, tmp, _aCache);
        }


        public string GetTopAllianceInSector(IDbConnection connection, int sectorId)
        {
            //sectorInfo.AllianceName = i.g_system.OrderByDescending(j => j.g_detail_system.alliance.pvpRating).FirstOrDefault().g_detail_system.alliance.name ?? Npc.SkagyName;
            var topName = Npc.SkagyName;
            var topAlliance = _aRepo.GetTopAllianceInSector(connection, sectorId);
            if (topAlliance != null)
            {
                topName = topAlliance.name;
            }
            return topName;
        }

        #endregion


        #region Alliance tech

        public AllianceTechDataModel GetAllianceTech(IDbConnection connection, int allianceId)
        {
            return _aTechCahce.GetById(connection, allianceId, false);
        }

        public AllianceTechDataModel AddOrUpdateTech(IDbConnection connection, AllianceTechDataModel tech)
        {
            var dbTech = _aTechRepo.AddOrUpdateeModel(connection, tech);
            var updTech = _aTechCahce.UpdateLocalItem(connection, dbTech);
            return updTech;
        }

        public AllianceTechesOut GetAllianceTechesOut(IDbConnection connection, int allianceId, AllianceRoleDataModel currentUserRole)
        {
            var techProgress = GetAllianceTech(connection, allianceId);
            return new AllianceTechesOut(currentUserRole, techProgress.Teches);
        }

        /// <summary>
        ///     Обновляет уровень технологии и баланс алььянса, не делает проверки на разрешение пользователю совершать действие
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="allianceTechType"></param>
        /// <param name="allianceId"></param>
        /// <returns></returns>
        public Dictionary<OldNewAllianceKeys, object> UpdateTech(IDbConnection connection, TechType allianceTechType, int allianceId)
        {
            var result = new Dictionary<OldNewAllianceKeys, object>();

            var allianceTech = GetAllianceTech(connection, allianceId);
            var tech = new BattleTeches(allianceTech.Teches).GetTech(allianceTechType);
            if (tech == null)
            {
                throw new NotImplementedException();
            }
            var outTech = tech.ConvertToOutModel(true);
            outTech.CalcResultPrice(false);
            var price = outTech.BasePrice.Cc;

            var alliance = GetAllianceById(connection, allianceId, false);
            if (price > alliance.Cc)
            {
                throw new Exception(Error.NotEnoughCc);
            }
            allianceTech.Teches[allianceTechType].Level += 1;

            var updatedTech = AddOrUpdateTech(connection, allianceTech);
            alliance.Cc -= (int)Math.Floor(price);
            AddOrUpdate(connection, alliance);

            var newTech = new BattleTeches(updatedTech.Teches).GetTech(allianceTechType);
            newTech.Progress.Advanced = newTech.GetPropertiesView(true);
            var techOut = newTech.ConvertToOutModel(true);
            techOut.CalcResultPrice(false);

            result.Add(OldNewAllianceKeys.NewBalanceCc, alliance.Cc);
            result.Add(OldNewAllianceKeys.NewTech, techOut);


            return result;
        }

        #endregion

        #region Helpers

        public int GetAllianceCount(IDbConnection connection)
        {

            return _aCache.GetCount(connection, true);
        }

        public bool HasAlliances(IDbConnection connection)
        {
            if (_aCache.IsInitialized())
            {
                return _aCache.ContainAny();
            }
            _aCache.Init(connection);
            return _aCache.ContainAny();

        }

        #endregion
    }
}