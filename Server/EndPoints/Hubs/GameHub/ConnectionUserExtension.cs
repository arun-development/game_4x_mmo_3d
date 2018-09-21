using System;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Server.Core.HubUserModels;
using Server.Core.Infrastructure.Hub;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.Core.Npc;
using Server.Core.СompexPrimitive.Products;
using Server.DataLayer;
using Server.Extensions;

namespace Server.EndPoints.Hubs.GameHub
{
    internal static class ConnectionUserExtension
    {
        internal static string CreateGroupName(int groupId, HubGroupTypes type, HubGroupPrefix prefix)
        {
            var name = prefix + "_" + (byte)type + "_" + groupId;
            return name.ToLower();
        }

        private static async Task<string> _addOrReplaceGroupAsync(this ConnectionUser connectionUser,
            IGroupManager groups, int groupId, string groupName, HubGroupTypes groupType, string nativeName)
        {
           
            await groups.AddToGroupAsync(connectionUser.ConnectionId, groupName);
            connectionUser.Groups[groupName] = new HubGroupItem(groupId, (byte)groupType, nativeName, groupName);
            return groupName;
        }

        internal static async Task<string> AddOrReplaceGroupAsync(this ConnectionUser connectionUser,
            IGroupManager grops, int groupId, HubGroupTypes groupType, string nativeName, HubGroupPrefix prefix)
        {
            var name = CreateGroupName(groupId, groupType, prefix);
            return await connectionUser._addOrReplaceGroupAsync(grops, groupId, name, groupType, nativeName);
        }

        internal static bool HasGroup(this ConnectionUser connectionUser, int groupId, HubGroupTypes type,
            HubGroupPrefix prefix)
        {
            return connectionUser.HasGroup(CreateGroupName(groupId, type, prefix));
        }

        internal static bool HasGroup(this ConnectionUser connectionUser, string groupName)
        {
            return connectionUser.Groups.ContainsKey(groupName);
        }


        // ReSharper disable once InconsistentNaming
        /// <summary>
        /// </summary>
        /// <param name="connectionUser"></param>
        /// <param name="new_alliance_user_Id">Id  в таблицы alliance_user</param>
        /// <param name="newAllianceName"></param>
        /// <param name="newAllianceRoleId"></param>
        /// <param name="newAlianceId"></param>
        internal static void SetNewAllianceData(this ConnectionUser connectionUser, int new_alliance_user_Id,
            string newAllianceName, byte newAllianceRoleId, int newAlianceId)
        {
            connectionUser.AllianceUserId = new_alliance_user_Id;
            connectionUser.AllianceName = newAllianceName;
            connectionUser.AllianceRoleId = newAllianceRoleId;
            connectionUser.AllianceId = newAlianceId;
        }


        internal static async Task UpdateAllianceGroupsByPermitionsAsync(this ConnectionUser connectionUser,
            IGroupManager groups, AllianceRoleDataModel oldUserRole, AllianceRoleDataModel newRole)
        {
            if (oldUserRole.AcceptNewMembers != newRole.AcceptNewMembers)
                if (newRole.AcceptNewMembers) await connectionUser.AddOrReplaceAllianceRecrutManagerGroupAsync(groups);
                else await connectionUser.RemoveAllianceRecrutManagerGroupNameAsync(groups);


            //todo удалить если не потребуется
            //не удалять коменты!
            //if (oldUserRole.CanManagePermition !=  newRole.CanManagePermition)
            //{
            //    //todo  если пявится группа  только для менеджеров
            //}
            //if (oldUserRole.DeleteMembers != newRole.DeleteMembers)
            //{
            //    //todo  если пявится группа
            //}
            //if (oldUserRole.EditAllianceInfo != newRole.EditAllianceInfo)
            //{
            //    //todo  если пявится группа

            //}
            //if (oldUserRole.MessageRead != newRole.MessageRead)
            //{
            //    //todo  когда пявится группа
            //}
            //if (oldUserRole.MessageSend != newRole.MessageSend)
            //{
            //    //todo  когда пявится группа

            //}
            //if (oldUserRole.SetTech != newRole.SetTech)
            //{
            //    //todo  если пявится группа
            //}
            //if (oldUserRole.ShowManage != newRole.ShowManage)
            //{
            //    //todo  если пявится группа
            //}
        }


        internal static async Task RemoveUserFromAllHubGroups(this ConnectionUser connectionUser, IGroupManager groups)
        {
            var cGroups = connectionUser.Groups.Keys.ToList();
            foreach (var key in cGroups)
            {
                await groups.RemoveFromGroupAsync(connectionUser.ConnectionId, key);
                
                connectionUser.Groups.Remove(key);
            }
            //    connectionUser.Groups = null;
            //  connectionUser.Groups = new Dictionary<string, IHubGroupItem>();
        }

        private static async Task<string> _removeGroupAsync(this ConnectionUser connectionUser, IGroupManager grops,
            Func<int, string> createName, int groupId)
        {
            var groupName = createName(groupId);
            if (!connectionUser.Groups.ContainsKey(groupName)) return groupName;

            connectionUser.Groups.Remove(groupName);
            await grops.RemoveFromGroupAsync(connectionUser.ConnectionId, groupName);
            return groupName;
        }

        #region GetDataAsync

        internal static UserDataModel GetGameUser(this ConnectionUser connectionUser, IDbConnection connection, IGameUserService gameUserService)
        {
            return gameUserService.GetGameUser(connection, connectionUser.UserId);
        }

        internal static UserPremiumWorkModel GetPremiumWorkModel(this ConnectionUser connectionUser, IDbConnection connection, IStoreService storeService)
        {
            return storeService.GetPremiumWorkModel(connection, connectionUser.UserId);
        }

        internal static UserPremiumDataModel GetPremiumDataModel(this ConnectionUser connectionUser, IDbConnection connection, IStoreService storeService)
        {
            return storeService.GetUserPremium(connection, connectionUser.UserId);
        }

        #endregion


        #region ConcreteGroups

        internal static string CreateAllianceGroupName(int allianceId)
        {
            // ReSharper disable once ConvertIfStatementToReturnStatement
            if (allianceId == (byte)NpcAllianceId.Confederation)
                return CreateGroupName(allianceId, HubGroupTypes.Alliance, HubGroupPrefix.Confederation1);
            return CreateGroupName(allianceId, HubGroupTypes.Alliance, HubGroupPrefix.Alliance);
        }

        internal static string CreateAllianceGroupName(this ConnectionUser connectionUser)
        {
            return CreateAllianceGroupName(connectionUser.AllianceId);
        }

        internal static string CreateAllianceRecrutManagerGroupName(int allianceId)
        {
            return CreateGroupName(allianceId, HubGroupTypes.Alliance, HubGroupPrefix.RecrutManager);
        }

        internal static string CreateAllianceRecrutManagerGroupName(this ConnectionUser connectionUser)
        {
            return CreateAllianceRecrutManagerGroupName(connectionUser.AllianceId);
        }


        internal static async Task<string> AddOrReplaceAllianceGroupAsync(this ConnectionUser connectionUser,
            IGroupManager grops)
        {
            return await connectionUser.AddOrReplaceGroupAsync(grops, connectionUser.AllianceId, HubGroupTypes.Alliance,
                connectionUser.AllianceName, HubGroupPrefix.Alliance);
        }

        internal static async Task<string> AddOrReplaceAllianceRecrutManagerGroupAsync(
            this ConnectionUser connectionUser, IGroupManager grops)
        {
            return await connectionUser.AddOrReplaceGroupAsync(grops, connectionUser.AllianceId, HubGroupTypes.Alliance,
                connectionUser.AllianceName, HubGroupPrefix.RecrutManager);
        }

        internal static async Task<string> RemoveAllianceRecrutManagerGroupNameAsync(this ConnectionUser connectionUser,
            IGroupManager grops)
        {
            return
                await connectionUser._removeGroupAsync(grops, CreateAllianceRecrutManagerGroupName,
                    connectionUser.AllianceId);
        }

        /// <summary>
        ///     при удалении конрневой альянсовой группы удаляет все  дочерние группы
        /// </summary>
        /// <param name="connectionUser"></param>
        /// <param name="grops"></param>
        /// <returns></returns>
        internal static async Task<string> RemoveAllianceGroupNameAsync(this ConnectionUser connectionUser,
            IGroupManager grops)
        {
            await connectionUser.RemoveAllianceRecrutManagerGroupNameAsync(grops);
            return await connectionUser._removeGroupAsync(grops, CreateAllianceGroupName, connectionUser.AllianceId);
        }


        #region UserChannel

        internal static IHubGroupItem GetUserChannelGroup(this ConnectionUser connectionUser, int channelId)
        {
            var channelGroup = (byte)HubGroupTypes.Channel;
            var item = connectionUser.Groups.Values.FirstOrDefault(i =>
                i.GroupId == channelId && i.GroupType == channelGroup);
            return item;
        }

        internal static bool HasUserChannel(this ConnectionUser connectionUser, int channelId)
        {
            var item = connectionUser.GetUserChannelGroup(channelId);
            return item?.GroupId == channelId;
        }

        #endregion

        #region Private channel groups

        internal static string CreatePrivateUserChannelGroupName(int channelId)
        {
            return CreateGroupName(channelId, HubGroupTypes.Channel, HubGroupPrefix.Private);
        }

        internal static string CreatePrivateUserChannelGroupName(this ConnectionUser connectionUser, int channelId)
        {
            return CreatePrivateUserChannelGroupName(channelId);
        }

        internal static async Task<string> AddOrReplacePrivateChannelGroupNameAsync(this ConnectionUser connectionUser,
            IGroupManager grops, int channelId)
        {
            return
                await
                    connectionUser.AddOrReplaceGroupAsync(grops, channelId, HubGroupTypes.Channel, "",
                        HubGroupPrefix.Private);
        }

        internal static async Task<string> RemovePrivateChannelGroupNameAsync(this ConnectionUser connectionUser,
            IGroupManager grops, int channelId)
        {
            return
                await connectionUser._removeGroupAsync(grops, CreatePrivateUserChannelGroupName, channelId);
        }

        #endregion


        #region Group channels groups

        internal static string CreateGroupChannelGroupName(int channelId)
        {
            return CreateGroupName(channelId, HubGroupTypes.Channel, HubGroupPrefix.Group);
        }

        internal static string CreateGroupChannelGroupName(this ConnectionUser connectionUser, int channelId)
        {
            return CreateGroupChannelGroupName(channelId);
        }

        internal static async Task<string> AddOrReplaceGroupChannelGroupNameAsync(this ConnectionUser connectionUser,
            IGroupManager grops, int channelId, string channelNativeName)
        {
            return
                await
                    connectionUser.AddOrReplaceGroupAsync(grops, channelId, HubGroupTypes.Channel, channelNativeName,
                        HubGroupPrefix.Group);
        }

        internal static async Task<string> RemoveGroupChannelNameAsync(this ConnectionUser connectionUser,
            IGroupManager grops, int channelId)
        {
            return await connectionUser._removeGroupAsync(grops, CreateGroupChannelGroupName, channelId);
        }

        #endregion


        #region Vote

        internal static bool GetVoteRegistred(this ConnectionUser connectionUser)
        {
            if (!connectionUser.AdvancedData.ContainsKey(CuAdvancedDataKeys.RegistratedInVote)) return false;
            var registred = connectionUser.AdvancedData[CuAdvancedDataKeys.RegistratedInVote];
            if (registred == null) return false;
            if (registred is bool) return (bool)registred;
            throw new NotImplementedException();
        }

        internal static void SetVoteRegistred(this ConnectionUser connectionUser)
        {
            connectionUser.AdvancedData[CuAdvancedDataKeys.RegistratedInVote] = true;
        }

        internal static bool GetVoteSended(this ConnectionUser connectionUser)
        {
            if (!connectionUser.AdvancedData.ContainsKey(CuAdvancedDataKeys.VoteSended)) return false;
            var vote = connectionUser.AdvancedData[CuAdvancedDataKeys.VoteSended];
            if (vote == null) return false;
            if (vote is bool) return (bool)vote;
            throw new NotImplementedException();
        }

        internal static void SetVoteSended(this ConnectionUser connectionUser)
        {
            connectionUser.AdvancedData[CuAdvancedDataKeys.VoteSended] = true;
        }

        #endregion

        #endregion
    }
}