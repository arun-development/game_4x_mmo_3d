using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Server.Core.HubUserModels;
using Server.Core.Infrastructure;
using Server.Core.Infrastructure.Alliance;
using Server.Core.Interfaces;
using Server.Core.Interfaces.ForModel;
using Server.Core.Interfaces.UserServices;
using Server.Core.Npc;
using Server.Core.StaticData;
using Server.Core.Tech;
using Server.DataLayer;
using Server.Services.OutModel;

namespace Server.EndPoints.Hubs.GameHub
{
    public partial class MainGameHub
    {
        /// <summary>
        /// </summary>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<IPlanshetViewData> AllianceLeaveFromUserAlliance()
        {
            return await _transactionAsync(async transaction =>
            {
                var connection = transaction.Connection;
                var leaveUser = _getCurrentUser(connection);
                var npcAllianceId = (byte)NpcAllianceId.Confederation;
                var oldGroupName = await leaveUser.RemoveAllianceGroupNameAsync(Groups);
                var oldAllianceId = leaveUser.AllianceId;
                var newAllianceUser = _allianceService.LeaveFromAlliance(connection, leaveUser.UserId, false);

                //todo обработать чаты
                ChannelConnectionDataModel newChannelConnectionDataModel = null;
                ChannelDataModel newChannelDataModel = null;
                var oldChannelId = 0;
                _channelService.OnUserChangeAlliance(connection, oldAllianceId, newAllianceUser,
                    (chtConn, channel) =>
                    {
                        newChannelConnectionDataModel = chtConn;
                        newChannelDataModel = channel;
                    }, oldChId => { oldChannelId = oldChId; });

                leaveUser.SetNewAllianceData(newAllianceUser.Id, Npc.ConfederationName, newAllianceUser.RoleId,
                    npcAllianceId);
                var newGroupName = await leaveUser.AddOrReplaceAllianceGroupAsync(Groups);
                var updHubUser = _hubCache.AddOrUpdateLocal(leaveUser, true);
                _allianceNotifyOldAllianceUserLeft(leaveUser.UserId, oldAllianceId, oldGroupName);

                var newAlliancePlanshet =
                    _allianceSetNewPlanshetAndNotifyNewGroup(connection, updHubUser, newAllianceUser, newGroupName);

                var newAllianceChannel =
                    _channelService.GetAllianceChannelOut(connection, newChannelDataModel,
                        newChannelConnectionDataModel);
                await Clients.Client(updHubUser.ConnectionId).InvokeAsync("onUserChannelsUserChangeAlliance",
                    oldChannelId, newAllianceChannel, updHubUser);

                return newAlliancePlanshet;
            });

        }

        /// <summary>
        /// </summary>
        /// <param name="targetDropUserId"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<bool> AllianceDropUserFromAlliance(int targetDropUserId)
        {
            return await _transactionAsync(async transaction =>
            {
                var connection = transaction.Connection;
                var cr = _getCurrentUser(connection);
                var role = AllianceRoleHelper.GetByRoleId(cr.AllianceRoleId);
                if (!role.DeleteMembers) throw new SecurityException(Error.NotPermitted);

                var oldTargetAllianceUser = _allianceService.GetAllianceUserByUserId(connection, targetDropUserId);
                var oldAllianceId = oldTargetAllianceUser.AllianceId;
                var newTargetDropAllianceUser =
                    _allianceService.LeaveFromAlliance(connection, oldTargetAllianceUser, false);
                //todo обработать чаты
                ChannelConnectionDataModel newChannelConnectionDataModel = null;
                ChannelDataModel newChannelDataModel = null;
                var oldChannelId = 0;
                _channelService.OnUserChangeAlliance(connection, oldAllianceId, newTargetDropAllianceUser,
                    (chtConn, channel) =>
                    {
                        newChannelConnectionDataModel = chtConn;
                        newChannelDataModel = channel;
                    }, oldChId => { oldChannelId = oldChId; });

                var targetUser = _getOnlineSingleUser(connection, targetDropUserId);
                if (targetUser != null)
                {
                    await targetUser.RemoveAllianceGroupNameAsync(Groups);
                    targetUser.SetNewAllianceData(newTargetDropAllianceUser.Id, Npc.ConfederationName,
                        newTargetDropAllianceUser.RoleId, (byte)NpcAllianceId.Confederation);

                    var newGroupName = await targetUser.AddOrReplaceAllianceGroupAsync(Groups);
                    var updHubUser = _hubCache.AddOrUpdateLocal(targetUser, true);
                    // обновляем данные
                    var newTargetUserPlanshet =
                        _allianceSetNewPlanshetAndNotifyNewGroup(connection, updHubUser, newTargetDropAllianceUser, newGroupName);

                    var newAllianceChannelOutDataModel =
                        _channelService.GetAllianceChannelOut(connection, newChannelDataModel,
                            newChannelConnectionDataModel);
                    await Clients.Client(targetUser.ConnectionId).InvokeAsync("onAllianceUserDroped", cr.AllianceId,
                        updHubUser,
                        newTargetUserPlanshet, oldChannelId, newAllianceChannelOutDataModel);
                }
                var oldGroupName = cr.CreateAllianceGroupName();
                _allianceNotifyOldAllianceUserLeft(targetDropUserId, cr.AllianceId, oldGroupName);

                return true;
            });
        }


        /// <summary>
        /// </summary>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<bool> AllianceDisbandAlliance()
        {
            return await _transactionAsync(async transaction =>
            {
                var connection = transaction.Connection;
                var cr = _getCurrentUser(connection);
                if (cr.AllianceRoleId != (byte)AllianceRoles.Creator)
                    throw new SecurityException(Error.NotPermitted);
                var oldNewAlliance = _allianceService.DisbandAlliance(connection, cr.UserId, cr.AllianceId);

                var keys = new List<OldNewAllianceKeys>
                  {
                    OldNewAllianceKeys.NewAlliacne,
                    OldNewAllianceKeys.OldAlliacne,
                    OldNewAllianceKeys.OldAllianceUsers,
                    OldNewAllianceKeys.NewAllianceUsers,
                    OldNewAllianceKeys.NewChannelConnections,
                    OldNewAllianceKeys.NewChannel
                  };
                foreach (var key in keys)
                {
                    if (!oldNewAlliance.ContainsKey(key)) throw new ArgumentException(Error.NoData, key.ToString());
                    if (oldNewAlliance[key] == null) throw new NullReferenceException(key.ToString());
                }

                var excludeIds = new List<string>();
                var newAlliance = (AllianceDataModel)oldNewAlliance[OldNewAllianceKeys.NewAlliacne];
                var oldAlliance = (AllianceDataModel)oldNewAlliance[OldNewAllianceKeys.OldAlliacne];
                var oldAllianceUses = (List<AllianceUserDataModel>)oldNewAlliance[OldNewAllianceKeys.OldAllianceUsers];
                var newAllianceUses = (List<AllianceUserDataModel>)oldNewAlliance[OldNewAllianceKeys.NewAllianceUsers];
                //todo обработать чаты
                var newChannel = oldNewAlliance[OldNewAllianceKeys.NewChannel];
                var newChannelConnections = oldNewAlliance[OldNewAllianceKeys.NewChannelConnections];

                var oldUserIds = oldAllianceUses.Select(i => i.UserId).ToList();


                AllianceUserDataModel newCurrentAllianceUser = null;
                string newGroupName = null;
                var olnineUsers = new List<ConnectionUser>();
                foreach (var oldAuser in oldAllianceUses)
                {
                    var oldUser = _getOnlineSingleUser(connection, oldAuser.UserId);
                    if (oldUser == null) continue;
                    var newAuser = newAllianceUses.First(au => au.UserId == oldAuser.UserId);
                    excludeIds.Add(oldUser.ConnectionId);
                    await oldUser.RemoveAllianceGroupNameAsync(Groups);
                    oldUser.SetNewAllianceData(newAuser.Id, newAlliance.Name, newAuser.RoleId, newAlliance.Id);
                    if (newGroupName == null) newGroupName = await oldUser.AddOrReplaceAllianceGroupAsync(Groups);
                    else await oldUser.AddOrReplaceAllianceGroupAsync(Groups);

                    var updatedUser = _hubCache.AddOrUpdateLocal(oldUser, true);

                    if (updatedUser.UserId == cr.UserId) newCurrentAllianceUser = newAuser;
                    olnineUsers.Add(updatedUser);
                }

                var exludeIdsAr = excludeIds.ToArray();


                var newUserPlanshetData = _allianceGetNewPlanshet(connection, newCurrentAllianceUser);
                var t2 = (TabMyAllianceOut)newUserPlanshetData.Bodys[1].TemplateData;
                var newMembers = t2.AllianceMembers.Members.Where(member => oldUserIds.Contains(member.UserId))
                   .ToList();
                foreach (var onlineUser in olnineUsers)
                {
                    await Clients.Client(onlineUser.ConnectionId).InvokeAsync("onAllianceDisbanded", oldAlliance.Id, onlineUser, newUserPlanshetData);
                }
                await Clients.AllExcept(exludeIdsAr).InvokeAsync("onAllianceDisbanded", oldAlliance.Id);



                //todo  Clients.Group(newGroupName, exludeIdsAr) метод вызовится повторно для клиента но клиент делает проверку на наличие пользователя в альясне перед добавлением. в любом случае нужно исправить как появится апи

                await Clients.Group(newGroupName).InvokeAsync("allianceAddNewUsersToAlliane", newMembers);
                return true;
            });


        }

        /// <summary>
        /// </summary>
        /// <param name="newAllianceName"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<object> AllianceCreateAlliance(string newAllianceName)
        {
            return await _transactionAsync(async transaction =>
          {
              var connection = transaction.Connection;
              var cr = _getLocalUser(Context.ConnectionId);
              var oldAllianceUser = _getAllianceUser(connection, cr);
              var oldAllianceId = cr.AllianceId;

              var storeService = _svp.GetService<IStoreService>();
              var newAllianceData =
                  _allianceService.CreateUserAlliance(connection, newAllianceName, oldAllianceUser, cr.Name, storeService);
              var newChannel = newAllianceData["NewChannel"];
              var newAlliance = (AllianceDataModel)newAllianceData["NewAlliance"];
              var newAllianceUser = _allianceService.GetAllianceUserByUserId(connection, cr.UserId);


              var oldGroupName = await cr.RemoveAllianceGroupNameAsync(Groups);


              cr.SetNewAllianceData(newAlliance.Id, newAlliance.Name, newAllianceUser.RoleId, newAlliance.Id);
              await cr.AddOrReplaceAllianceGroupAsync(Groups);
              await cr.AddOrReplaceAllianceRecrutManagerGroupAsync(Groups);

              var updatedUser = _hubCache.AddOrUpdateLocal(cr, true);


              _allianceNotifyOldAllianceUserLeft(updatedUser.UserId, oldAllianceId, oldGroupName);
              const string nbCckey = "NewBalanceCc";
              var result = new Dictionary<string, object>
              {
                  ["NewAlliancePlanshet"] = _allianceGetNewPlanshet(connection, newAllianceUser),
                  [nbCckey] = newAllianceData[nbCckey],
                  ["ConnectionUser"] = updatedUser,
              };

              await Clients.Others.InvokeAsync("onAllianceCreateAlliance", newAlliance.Id, newAlliance.Name);
              return result;
          });

        }

        /// <summary>
        /// </summary>
        /// <param name="newAllianceName"></param>
        /// <returns></returns>
        public async Task<bool> AllianceCheckAllianceNameIsUnic(string newAllianceName)
        {

            return await _contextAction(connection => _allianceService.CheckNameIsUnic(connection, newAllianceName));
        }


        /// <summary>
        ///     todo  не  используется
        /// </summary>
        /// <returns></returns>
        public async Task<IList<IAllianceNameSerchItem>> AllianceGetAllActiveAllianceNames()
        {
            return await _contextAction(connection => _allianceService.GetAllianceNames(connection, false));

        }

        public async Task<IList<IAllianceNameSerchItem>> AllianceGetAllianceNamesByPartName(string partAllianceName)
        {
            return await _contextAction(connection => _allianceService.GetAllianceNamesByPartName(connection, partAllianceName, false));
        }

        /// <summary>
        /// </summary>
        /// <param name="allianceId"></param>
        /// <param name="tabIdx"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<IAllianceRatingOut> AllianceGetAllianceItemById(int allianceId, byte tabIdx)
        {
            return await _contextAction(connection =>
            {
                var cr = _getLocalUser(Context.ConnectionId);
                var alliance = _allianceService.GetAllianceById(connection, allianceId, false);
                var alianceRatting = _allianceService.SetAllianceRating(connection, alliance, true, _gameUserService);
                alianceRatting.AddButtons(cr.AllianceId, tabIdx);
                return alianceRatting;
            });
        }

        /// <summary>
        /// </summary>
        /// <param name="pvpPoint"></param>
        /// <param name="skip"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<TabAllianceSerchOut> AllianceGetAllianceItemByMinRating(int pvpPoint, int skip)
        {
            return await _contextAction(connection =>
            {
                var cr = _getLocalUser(Context.ConnectionId);
                var alliances = _allianceService.GetAlliancesByRating(connection, pvpPoint, skip, i => i);
                var allianceRatings = new List<IAllianceRatingOut>();
                foreach (var alliance in alliances)
                    allianceRatings.Add(_allianceService.SetAllianceRating(connection, alliance, true, _gameUserService));

                var allianceTab = new TabAllianceSerchOut
                {
                    Collection = allianceRatings
                };


                allianceTab.AddAlianceButtons(cr.AllianceId);
                return allianceTab;
            });
        }

        /// <summary>
        /// </summary>
        /// <param name="targetAllianceUserId"></param>
        /// <param name="targetUserId"></param>
        /// <param name="targetRoleId"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<object> AllianceUpdateUserRole(int targetAllianceUserId, int targetUserId, byte targetRoleId)
        {
            return await _contextActionAsync(async connection =>
             {
                 var cr = _getCurrentUser(connection);
                 var curUserManagerRole = AllianceRoleHelper.GetByRoleId(cr.AllianceRoleId);
                 if (!curUserManagerRole.CanManagePermition) throw new SecurityException(Error.NotPermitted);

                 var newTarAu = _allianceService.UpdateUserRole(connection, cr.UserId, cr.AllianceId, targetUserId, targetRoleId,
                     targetAllianceUserId);

                 var targetUser = _getOnlineSingleUser(connection, newTarAu.UserId);


                 var aGroup = cr.CreateAllianceGroupName();
                 var exIds = new List<string>();
                 var newTargetUserRole = AllianceRoleHelper.GetByRoleId(targetRoleId);
                 var updateUserRoleModel =
                     new UpdateUserRoleModel(newTarAu.AllianceId, newTarAu.UserId, newTargetUserRole);
                 if (targetUser != null)
                 {
                     exIds.Add(targetUser.ConnectionId);

                     var oldTargetUserRole = AllianceRoleHelper.GetByRoleId(targetUser.AllianceRoleId);
                     await targetUser.UpdateAllianceGroupsByPermitionsAsync(Groups, oldTargetUserRole,
                         newTargetUserRole);
                     targetUser.AllianceRoleId = newTargetUserRole.Id;
                     var updatedTargetUser = _hubCache.AddOrUpdateLocal(targetUser, false);

                     updateUserRoleModel.SetUserData(connection, _allianceService, newTarAu, updatedTargetUser);

                     await Clients.Client(targetUser.ConnectionId).InvokeAsync("onAllianceUpdateUserRole", updateUserRoleModel.GetUserModel());

                 }

                 // todo  не доделано  не верный формат возвращемых данныъ
                 var allianceResponceModel = updateUserRoleModel.GetAllianceModel();


                 try
                 {
                     foreach (var exceptedId in exIds)
                     {
                         await Groups.RemoveFromGroupAsync(exceptedId, aGroup);
                     }

                     await Clients.Group(aGroup).InvokeAsync("onAllianceUpdateUserRole", allianceResponceModel);

                 }
                 finally
                 {
                     foreach (var exceptedId in exIds)
                     {
                         await Groups.AddToGroupAsync(exceptedId, aGroup);
                     }

                 }

                 return allianceResponceModel;
             });

        }

        #region Update alliance info

        /// <summary>
        /// </summary>
        /// <param name="newBase64SourceImageModel"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<bool> AllianceInfoUpdateLabel(Base64ImageOut newBase64SourceImageModel)
        {
            return await _contextActionAsync(async connection =>
             {
                 var cr = _getCurrentUser(connection);
                 var role = AllianceRoleHelper.GetByRoleId(cr.AllianceRoleId);
                 if (!role.EditAllianceInfo) throw new SecurityException(Error.NotPermitted);
                 var newUrls = await _allianceService.ImageServiceLoadAndUpdateAsync(connection,
                     newBase64SourceImageModel.Base64File, cr.AllianceId, _channelService,
                     newBase64SourceImageModel.Ext);
                 var aGroup = cr.CreateAllianceGroupName();
                 await Clients.Group(aGroup).InvokeAsync("onAllianceInfoUpdateLabel", newUrls, cr.AllianceId);
                 return true;
             });
        }

        /// <summary>
        /// </summary>
        /// <param name="newDescription"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<object> AllianceInfoUpdateDescription(string newDescription)
        {
            return await _contextActionAsync(async connection =>
            {
                if (newDescription.Length > (int)MaxLenghtConsts.AllianceDescription)
                    throw new ArgumentException(Error.OverMaxLength);
                var cr = _getCurrentUser(connection);
                var role = AllianceRoleHelper.GetByRoleId(cr.AllianceRoleId);
                if (!role.EditAllianceInfo) throw new SecurityException(Error.NotPermitted);

                var newAllianceData = _allianceService.UpdateDescription(connection, cr.AllianceId, newDescription);
                var aGroup = cr.CreateAllianceGroupName();


                try
                {
                    await Groups.RemoveFromGroupAsync(cr.ConnectionId, aGroup);
                    await Clients.Group(aGroup).InvokeAsync("onAllianceInfoUpdateDescription", newAllianceData.Description, cr.AllianceId);

                }
                finally
                {
                    await Groups.AddToGroupAsync(cr.ConnectionId, aGroup);

                }

                return new { Id = cr.AllianceId, newAllianceData.Description };
            });
        }

        /// <summary>
        /// </summary>
        /// <param name="newTax"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<bool> AllianceInfoUpdateTax(byte newTax)
        {
            return await _contextActionAsync(async connection =>
            {
                var cr = _getCurrentUser(connection);
                var role = AllianceRoleHelper.GetByRoleId(cr.AllianceRoleId);
                if (!role.EditAllianceInfo) throw new SecurityException(Error.NotPermitted);
                if (newTax > 100) newTax = 100;
                var newAllianceData = _allianceService.UpdateTax(connection, cr.AllianceId, newTax);
                var aGroup = cr.CreateAllianceGroupName();
                await Clients.Group(aGroup).InvokeAsync("onAllianceInfoUpdateTax", newAllianceData.Tax, cr.AllianceId);
                return true;
            });
        }

        #endregion

        #region Alliance Tech

        public async Task<bool> AllianceUpdateAllianceTech(TechType allianceTechType)
        {
            return await _contextActionAsync(async connection =>
            {
                var cr = _getCurrentUser(connection);
                var role = AllianceRoleHelper.GetByRoleId(cr.AllianceRoleId);
                if (!role.SetTech) throw new SecurityException(Error.NotPermitted);


                var newAllianceData = _allianceService.UpdateTech(connection, allianceTechType, cr.AllianceId);
                var aGroup = cr.CreateAllianceGroupName();


                await Clients.Group(aGroup).InvokeAsync("onAllianceTechUpdated", newAllianceData[OldNewAllianceKeys.NewTech],
                      newAllianceData[OldNewAllianceKeys.NewBalanceCc]);
                return true;
            });
        }

        #endregion


        #region Private

        private class UpdateUserRoleModel
        {
            public UpdateUserRoleModel(int allianceId, int targetUserId, AllianceRoleDataModel newRole)
            {
                AllianceId = allianceId;
                TargetUserId = targetUserId;
                NewRole = newRole;
            }

            private int AllianceId { get; }
            private AllianceRoleDataModel NewRole { get; }
            private bool IsCurrentUser { get; set; }
            private ConnectionUser NewCurrentConnectionUser { get; set; }
            private IAllianceUserRequests AllianceUserRequests { get; set; }
            private int TargetUserId { get; }

            // ReSharper disable once SuggestBaseTypeForParameter
            public void SetUserData(IDbConnection connection, IAllianceService allianceService, AllianceUserDataModel adm, ConnectionUser newCurrentConnectionUser)
            {
                NewCurrentConnectionUser = newCurrentConnectionUser;
                IsCurrentUser = true;
                if (NewRole.AcceptNewMembers)
                    AllianceUserRequests = allianceService.GetAllianceUserRequests(connection, adm, NewRole);
            }


            public object GetAllianceModel()
            {
                return new
                {
                    AllianceId,
                    NewRole,
                    TargetUserId,
                    IsCurrentUser = false
                };
            }

            public object GetUserModel()
            {
                return new
                {
                    AllianceId,
                    NewRole,
                    IsCurrentUser,
                    NewCurrentConnectionUser,
                    TargetUserId,
                    AllianceUserRequests
                };
            }
        }


        private AllianceUserDataModel _getAllianceUser(IDbConnection connection, ConnectionUser user)
        {
            var au = _allianceService.GetAllianceUserById(connection, user.AllianceUserId);
            if (au.UserId == user.UserId) return au;
            throw new HubException(Error.NotPermitted);
        }


        private void _allianceNotifyOldAllianceUserLeft(int leftUserId, int leftAllianceId, string oldGroupName)
        {
            Clients.Group(oldGroupName).InvokeAsync("onAllianceUserLeftAlliance", leftUserId, leftAllianceId);
        }

        private IPlanshetViewData _allianceGetNewPlanshet(IDbConnection connection, AllianceUserDataModel allianceUser)
        {
            return _allianceService.Initial(connection, allianceUser, _gameUserService);
            //todo  нет метода очиски планшетов от старых данных для всех остальных пользователей
        }

        private IPlanshetViewData _allianceSetNewPlanshetAndNotifyNewGroup(IDbConnection connection, ConnectionUser cnnectionUser, AllianceUserDataModel newAllianceUser, string newGroupName)
        {
            var newUserPlanshetData = _allianceGetNewPlanshet(connection, newAllianceUser);
            var t2 = (TabMyAllianceOut)newUserPlanshetData.Bodys[1].TemplateData;
            var newMebmer = t2.AllianceMembers.Members.FirstOrDefault(i => i.UserId == cnnectionUser.UserId);

            // todo  метод асинхронный, на  клиенте для текущего пользователя не будет добавлен
            Clients.Group(newGroupName).InvokeAsync("allianceAddNewUserToAlliane", newMebmer);
            return newUserPlanshetData;
        }

        #endregion
    }
}