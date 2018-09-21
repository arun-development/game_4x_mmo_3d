using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security;
using System.Security.Claims;
 
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Server.Core.HubUserModels;
using Server.Core.Infrastructure.Alliance;
using Server.Core.Map;
using Server.Core.Npc;
using Server.Core.StaticData;
using Server.Extensions;
using Server.Modules.Localize;
using Server.Services.OutModel;

namespace Server.EndPoints.Hubs.GameHub
{
    public partial class MainGameHub
    {
        #region request and context helpers

        private static async Task<T> _makeAsync<T>(Func<T> actionResult)
        {

            return await Task.Factory.StartNew(() => _tryCatch(actionResult));
        }
        private static T _tryCatch<T>(Func<T> actionResult)
        {
            try
            {
                return actionResult();
            }
            catch (Exception e)
            {
                throw new HubException(e.Message, e);
            }
        }
        private static bool _tryCatch(Action actionResult)
        {
            return _tryCatch(() =>
            {
                actionResult();
                return true;
            });
        }

        private static async Task<T> _tryCatchAsync<T>(Func<Task<T>> actionResult)
        {
            try
            {
                return await actionResult();
            }
            catch (Exception e)
            {
                throw new HubException(e.Message, e);
            }
        }
        private async Task<T> _transactionAsync<T>(Func<IDbTransaction, Task<T>> actionResult)
        {
            return await _tryCatchAsync(async () => await _dbProvider.TransactionAsync(async transaction => await actionResult(transaction)));
        }
        private async Task<T> _contextActionAsync<T>(Func<IDbConnection, Task<T>> actionResult)
        {
            return await _tryCatchAsync(async () => await _dbProvider.ContextActionAsync(async connection => await actionResult(connection)));
        }
        private async Task<T> _contextAction<T>(Func<IDbConnection, T> actionResult)
        {
            return await _makeAsync(() => _dbProvider.ContextAction(actionResult));

        }

        #endregion



        private ClaimsPrincipal _getPrincipalUser()
        {
            var u = Context.User;
            if (u.Identity.IsAuthenticated)
            {
                return u;
            }
            Clients.Client(Context.ConnectionId).InvokeAsync("notAutorized");
            throw new SecurityException(Error.NotAutorized);
        }

        private ConnectionUser _getLocalUser(string connectionId) => _hubCache.GetById(connectionId);

        private ConnectionUser _getCurrentUser(IDbConnection connection)
        {
            var u = _getLocalUser(Context.ConnectionId);
            if (u == null)
            {
                throw new ArgumentNullException(Error.ConnectionUserNotExist, nameof(_getLocalUser));
            }
            var currentUser = _getOnlineSingleUser(connection, u.UserId);
            if (currentUser == null)
            {
                throw new ArgumentNullException(Error.ConnectionUserNotConnected, nameof(currentUser));
            }
            return currentUser;
        }

        private IList<ConnectionUser> _getLocalUserList(IDbConnection connection, int userId)
        {
            return _hubCache.LocalFind(connection, (key, val) => val.UserId == userId);
        }

        private IList<ConnectionUser> _getLocalUserListByAuthId(IDbConnection connection, string authId)
        {
            return _hubCache.LocalFind(connection, (key, val) => val.AuthId == authId);
        }


        private ConnectionUser _getOnlineSingleUser(IDbConnection connection, int userId)
        {
            var users = _getLocalUserList(connection, userId);
            if (users == null || users.Count <= 0)
            {
                return null;
            }
            if (users.Count != 1)
            {
                throw new Exception(Error.UserConnectionNotUnic);
            }
            if (!users[0].Connected)
            {
                throw new NotImplementedException("User exist but is not online");
            }
            return users[0];
        }


        private void _removeUserFromStorage(string connectionId)
        {
            _hubCache.DeleteItem(connectionId);
        }


        private async Task<Dictionary<string, object>> _initUserAsync(IDbConnection connection, string curInitConnectionUserId, LangKeys langKey)
        {
            try
            {
                var user = _getPrincipalUser();
                //todo поставил заглушку, сейчас можно извлеч имя или обращатсья в базу
                var authId = user.GetAuthUserId();
                var oldUserConnections = _getLocalUserListByAuthId(connection, authId);
                if (oldUserConnections != null && oldUserConnections.Any())
                {
                    foreach (var conItem in oldUserConnections)
                    {
                        var cId = conItem.ConnectionId;
                        var uId = conItem.UserId;
                        _removeUserFromStorage(cId);
                        await conItem.RemoveUserFromAllHubGroups(Groups);
                        _gameRunner.OnDisonnected(cId, uId);
                        await Clients.Client(conItem.ConnectionId).InvokeAsync("disconnect", true);
                    }
                }
                var data = _estateOwnService.InitUser(connection, user, _svp);
                var cr = (ConnectionUser)data[ConnectionUser.ViewKey];
                if (cr == null)
                {
                    throw new NotImplementedException("MainGameHub.UnitUser");
                }
                cr.Lang = langKey;
                cr.ConnectionId = curInitConnectionUserId;
                var addGroupsTasks = new List<Task> { cr.AddOrReplaceAllianceGroupAsync(Groups) };
                var userAllianceRole = AllianceRoleHelper.GetByRoleId(cr.AllianceRoleId);

                if (cr.AllianceId != (byte)NpcAllianceId.Confederation)
                {
                    if (userAllianceRole.AcceptNewMembers)
                    {
                        addGroupsTasks.Add(cr.AddOrReplaceAllianceRecrutManagerGroupAsync(Groups));
                    }
                }

                var messages = _channelService.InitialPlanshetChannels(connection, cr.UserId, cr.AllianceId, userAllianceRole);
                var privateChannesData = messages.Bodys[0].TemplateData as ChannelTab;

                if (privateChannesData != null && privateChannesData.Collection.Any())
                {
                    addGroupsTasks.AddRange(privateChannesData.Collection.Select(privateChannesl =>
                        cr.AddOrReplacePrivateChannelGroupNameAsync(Groups, privateChannesl.Key)));
                }
                var groupChannesData = messages.Bodys[1].TemplateData as ChannelTab;
                if (groupChannesData != null && groupChannesData.Collection.Any())
                {
                    addGroupsTasks.AddRange(groupChannesData.Collection.Select(groupChannel =>
                        cr.AddOrReplaceGroupChannelGroupNameAsync(Groups, groupChannel.Key,
                            groupChannel.Value.ChannelName)));
                }

                await Task.WhenAll(addGroupsTasks);

                data[messages.UniqueId] = messages;

                data[ConnectionUser.ViewKey] = _hubCache.AddOrUpdateLocal(cr, true);

                var confederationPlanshet = _confederationService.InitialPlanshetConfederation(connection, _gameUserService);
                data[confederationPlanshet.UniqueId] = confederationPlanshet;
                var estates = (IList<EstateItemOut>)data[EstateItemOut.ViewKey];
                var planetIds = estates.Where(i => i.OwnId != 0).Select(i => i.OwnId).ToList();
                var journalPlanshet = _journalOutService.InitialPlanshet(connection, cr.UserId, planetIds);
                data[journalPlanshet.UniqueId] = journalPlanshet;
                return data;
            }
            catch (Exception e)
            {
                throw new HubException(e.Message, e);
            }
        }
    }
}