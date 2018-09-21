using System;
using System.Collections.Generic;
using System.Data;
using System.Security.Claims;
using System.Security.Principal;
using Server.Core.HubUserModels;
using Server.Core.Images;
using Server.Core.Infrastructure;
using Server.Core.Interfaces.ForModel;
using Server.Core.СompexPrimitive.Other;
using Server.DataLayer;
using Server.ServicesConnected.Auth.Models;

namespace Server.Core.Interfaces.UserServices
{
    public interface IFakeUser<T> where T : class
    {
        #region sync

        IList<T> GetFakeUsers(IDbConnection connection, int count = -1);
        IList<T> CreateFakeUsers(IDbConnection connection, int count);
        void DeleteFakeUsers(IDbConnection connection);

        #endregion
    }

    public interface IGameUserService<TPrimaryKeyType, TDataModel> : IBaseService<TPrimaryKeyType, TDataModel>
        where TPrimaryKeyType : struct where TDataModel : class
    {
 

        #region sync

        #region Helper

        bool HasUsers();

        #endregion

        #region GetGameUser

        TDataModel GetCurrentGameUser(IDbConnection connection, ClaimsPrincipal user);
        TDataModel GetGameUser(IDbConnection connection, TPrimaryKeyType userId);

        TResult GetGameUser<TResult>(IDbConnection connection, TPrimaryKeyType userId, Func<TDataModel, TResult> selector);

        TDataModel GetGameUser(IDbConnection connection, string authId);

        TDataModel GetGameUserByName(IDbConnection connection, string userName);
        int GetGameUserId(IDbConnection connection, string authId);

        IList<TDataModel> GetGameUserList(IDbConnection connection, bool widthReservedId);

        #endregion

        #region Custom

        IList<TDataModel> GetTopPvpUsers(IDbConnection connection, int skip, int take);

        UserDataModel AddPvp(IDbConnection connection, int pvp, TPrimaryKeyType userId);
        UserDataModel UpdatePvp(IDbConnection connection, int newPvp, TPrimaryKeyType userId);


        IList<UserDataModel> GetNpcUserList(IDbConnection connection);
        UserDataModel UpdateStatus(IDbConnection connection, byte newStatus, int userId);
        int GetTopPosition(IDbConnection connection, int userId, int pvpPoint);

        #endregion

        #endregion
    }


    public interface IGameUserService : IGameUserService<int, UserDataModel>, IHubUser, IProfilePlanshetService,
        IUserPersonalInfoService<int, UserDataModel>, IUserImageService
    {
        IList<NameIdInt> FilterUserName(IDbConnection connection, string partUserName);


        bool CreateGameUserIfNotExist(ApplicationUser confirmedUser);
 

    }

    public interface IHubUser
    {
        #region sync

        /// <summary>
        ///     получает юзера и обновляет статус пользователя в базе данных и локальном хранилище(вызывает метод
        ///     UpdateUserOnlineStatusAsync)
        ///     не присваевает ConnectionId
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="authId"></param>
        /// <param name="isOnline"></param>
        /// <returns></returns>
        ConnectionUser GetHubUser(IDbConnection connection, string authId, bool isOnline);

        /// <summary>
        ///     обновляет статус пользователя в базе данных и локальном хранилище по переданным данным (вызывает метод
        ///     UpdateUserOnlineStatusAsync)
        ///     не присваевает ConnectionId
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="user"></param>
        /// <param name="allianceUser"></param>
        /// <param name="allianceName"></param>
        /// <param name="isOnline"></param>
        /// <returns></returns>
        ConnectionUser GetHubUser(IDbConnection connection, UserDataModel user, AllianceUserDataModel allianceUser, string allianceName, bool isOnline);

        /// <summary>
        ///     обновляет статус пользователя в базе данных и локальном хранилище
        ///     не присваевает ConnectionId
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="userId"></param>
        /// <param name="isOnline"></param>
        /// <returns></returns>
        UserDataModel UpdateUserOnlineStatus(IDbConnection connection, int userId, bool isOnline);

        UserDataModel UpdateUserOnlineStatus(IDbConnection connection, UserDataModel user, bool isOnline);
        ConnectionUser SetConnectionUser(IDbConnection connection, UserDataModel user, AllianceUserDataModel allianceUser, string allianceName);

        #endregion
    }


    public interface IUserPersonalInfoService<TPrimaryKeyType, TDataModel>
        where TPrimaryKeyType : struct where TDataModel : class
    {
        #region sync

        TDataModel GetPersonalInfo(IDbConnection connection, TPrimaryKeyType userId, bool checkData);
        Dictionary<int, MeedDbModel> PersonalInfoGetMeeds(IDbConnection connection, TPrimaryKeyType userId);

        TDataModel PersonalInfoSetAndSumbitMeeds(IDbConnection connection, TPrimaryKeyType userId, Dictionary<int, MeedDbModel> model);

        TDataModel PersonalInfoUpdateUserDescription(IDbConnection connection, int userId, string text);

        TDataModel AddOrUpdateUserPersonalInfo(IDbConnection connection, TDataModel personalInfo);

        UserImageModel GetUserAvatar(IDbConnection connection, int userId);

        #endregion
    }

    public interface IProfilePlanshetService
    {
        //profile
        #region sync

        IPlanshetViewData GetUserPlanshetProfile(IDbConnection connection, string userName, int currentUserId, bool setAlliance);
        IPlanshetViewData GetUserPlanshetProfile(IDbConnection connection, int userId, int currentUserId, bool setAlliance);
        IPlanshetViewData GetUserPlanshetProfile(IDbConnection connection, UserDataModel user, int currentUserId, bool setAlliance);

        IPlanshetViewData GetUserPlanshetProfile(IDbConnection connection, int userId, int allianceId, IPlanshetViewData allianceModel, bool isCurrentUser);

        IPlanshetViewData SetUserPlanshetProfile(IUserProfileOut profile);

        #endregion
    }
}