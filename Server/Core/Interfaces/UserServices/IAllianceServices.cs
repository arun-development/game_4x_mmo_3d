using System;
using System.Collections.Generic;
using System.Data;
using System.Security;
using Server.Core.Images;
using Server.Core.Infrastructure.Alliance;
using Server.Core.Interfaces.ForModel;
using Server.Core.Npc;
using Server.Core.Pager;
using Server.Core.Tech;
using Server.DataLayer;

namespace Server.Core.Interfaces.UserServices
{
    public interface IAllianceNameSerchItem : IUniqueIdElement, INameProperty, IDisbandetProperty
    {
    }


    public interface IAllianceService<in TPrimaryKeyType, TDataModel>   where TPrimaryKeyType : struct where TDataModel : IDataModel<TPrimaryKeyType>
    {
        #region GetAlliance

        TDataModel GetAllianceById(IDbConnection connection, TPrimaryKeyType allianceId, bool deactivated);
        TResult GetAllianceById<TResult>(IDbConnection connection, TPrimaryKeyType allianceId, Func<TDataModel, TResult> selector);
        IList<TDataModel> GetAllAlliances(IDbConnection connection, bool whidthDisbandet);
        IList<TResult> GetAllAlliances<TResult>(IDbConnection connection, Func<TDataModel, TResult> selector, bool whidthDisbandet);

        #endregion

        #region Names and GetByPartNAme

        IList<AllianceDataModel> GetAlliancesByPartAllianeName(IDbConnection connection, string partAllianceName);

        IList<TResult> GetAlliancesByPartAllianeName<TResult>(IDbConnection connection, string partAllianceName, Func<TDataModel, TResult> selector, int takeCount = PagerDefaults.MaxItemInStack);

        IList<IAllianceNameSerchItem> GetAllianceNames(IDbConnection connection, bool selectWidthDisbandet);
        IList<IAllianceNameSerchItem> GetAllianceNamesByPartName(IDbConnection connection, string partAllianceName, bool selectWidthDisbandet);
        IAllianceNameSerchItem GetAllianceNameObj(IDbConnection connection, string allianceName);


        #endregion

        #region Helpers
 

        int GetAllianceCount(IDbConnection connection);

        bool HasAlliances(IDbConnection connection);
        //  int GetNextAllianceId();

        #endregion

        #region Tech

        AllianceTechDataModel GetAllianceTech(IDbConnection connection, int allianceId);
        AllianceTechDataModel AddOrUpdateTech(IDbConnection connection, AllianceTechDataModel tech);
        Dictionary<OldNewAllianceKeys, object> UpdateTech(IDbConnection connection, TechType allianceTechType, int allianceId);

        #endregion
    }


    public interface IAllianceInfo : IUserImageService
    {
        //sync
        AllianceDataModel UpdateDescription(IDbConnection connection, int allianceId, string newDescription);

        AllianceDataModel UpdateTax(IDbConnection connection, int allianceId, byte newTax);
    }


    public interface IAllianceService :
        IAllianceService<int, AllianceDataModel>,
        IAllianceUserAction,
        IAlliancePlanshetService,
        IAllianceRequestMessages,
        IAllianceUserService<int, AllianceUserDataModel>, IAllianceInfo
    {
       bool Delete(IDbConnection connection, AllianceDataModel alliance);
 
        AllianceDataModel AddOrUpdate(IDbConnection connection, AllianceDataModel dataModel);
        bool Delete(IDbConnection connection, int allianceId);
        bool DeleteAll(IDbConnection connection);
    }

    public interface IAllianceUserService<in TPrimaryKeyType, TDataModel> where TPrimaryKeyType : struct where TDataModel : IDataModel<TPrimaryKeyType>
    {
        #region AllianceUser

        //sync
        IList<TDataModel> GetAllAllianceUsers(IDbConnection connection);

        IList<TResult> GetAllAllianceUsers<TResult>(IDbConnection connection, Func<TDataModel, TResult> selector);

        TDataModel AddOrUpdateAllianceUser(IDbConnection connection, TDataModel newAllianceUser);

        TDataModel GetAllianceUserByUserId(IDbConnection connection, int userId);
        TDataModel GetAllianceUserById(IDbConnection connection, TPrimaryKeyType allianceUserId, bool checkForNull = true);
        IList<TDataModel> GetAllianceUsers(IDbConnection connection, TPrimaryKeyType allianceId);
        TDataModel GetAllianceUserByAidUId(IDbConnection connection, int allianceId, int userId);

        string GetTopAllianceInSector(IDbConnection connection, int sectorId);

        AllianceUserDataModel CreateStartAllianceUser(IDbConnection connection, UserDataModel user, int toAllianceId = (int) NpcAllianceId.Confederation);

        #region AllianceUserRole

        //sync
        AllianceUserDataModel UpdateUserRole(IDbConnection connection, int currentUserId, TPrimaryKeyType allianceId, int targetUserId, byte targetRoleId, int? targetAllianceUserId = null);

        #region AllianceRoleTable

        //sync
        IList<AllianceRoleDataModel> CreateRoles(IDbConnection connection);

        AllianceRoleDataModel AddOrUpdateAllianceRole(IDbConnection connection, AllianceRoleDataModel dataModel);

        #endregion

        #endregion

        #endregion
    }


    public interface IAlliancePlanshetService
    {
        //sync

        IPlanshetViewData Initial(IDbConnection connection, AllianceUserDataModel currentAllianceUser, IGameUserService profileService);

        List<TResult> GetAlliancesByRating<TResult>(IDbConnection connection, int pvpPoint, int skip, Func<AllianceDataModel, TResult> selector);

        List<TResult> GetAlliancesByRating<TResult>(IDbConnection connection, Func<AllianceDataModel, TResult> selector);

        IAllianceRatingOut SetAllianceRating(IDbConnection connection, AllianceDataModel allianceDataModel, bool setButtons, IGameUserService gameUserService);

        IAllianceUserRequests GetAllianceUserRequests(IDbConnection connection, AllianceUserDataModel allianceUserManager, AllianceRoleDataModel role = null);
    }

    public interface IAllianceRequestMessages
    {
        #region sync

        AllianceRequestMessageDataModel AddArmItem(IDbConnection connection, AllianceRequestMessageDataModel dataModel);

        /// <summary>
        ///     requests for user in My allianceTab, need call if current user in npc alliance
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="senderUserId"></param>
        /// <returns></returns>
        IAllianceUserRequests GetRequestsAllianceForMyAlliance(IDbConnection connection, int senderUserId);

        bool HasRoleToManageMessage(IDbConnection connection, AllianceUserDataModel currentUser, int outAllianceUserId);
        IList<AllianceRequestMessageDataModel> UpdateAllianceIconInRequests(IDbConnection connection, int allianceId, string newIcon);


        /// <summary>
        ///     clear all requests in db and cache and add to history table (can call from alliance and from user)
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="fromUserId"></param>
        /// <param name="toAllianceId"></param>
        /// <returns>True if alliacne rejected before else false</returns>
        bool DeleteRequestForUserToAlliance(IDbConnection connection, int fromUserId, int toAllianceId);

        /// <summary>
        ///     requests to alliance in alliance manageTab, need call if not has permitions return empty list
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="allianceUserManager"></param>
        /// <param name="role"></param>
        /// currentUserAllianceId
        /// <exception cref="SecurityException">Thrown when role not has permition to AcceptNewMembers</exception>
        /// <returns></returns>
        IList<AllianceUserRequestItem> GetRequestsAllianceForAllianceManage(IDbConnection connection, AllianceUserDataModel allianceUserManager, AllianceRoleDataModel role = null);


        /// <summary>
        ///     Меняет статус всех сообщений между альянсом и пользователем на отмененный если таковые имеются.
        ///     После применения для текущего альянса - <paramref name="currentUser.AllianceId" />, пользователь
        ///     <paramref name="rejectUserId" />
        ///     становистя не видимым для условий выборки альянсовых сообщений
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="currentUser">Текуший альянс манеджер с правами на  принятие пользователя</param>
        /// <param name="rejectUserId">Пользователь чей запрос будет отменен</param>
        /// <param name="role">Если не передан получает роль внутри</param>
        /// <exception cref="SecurityException">Thrown when role not has permition to AcceptNewMembers</exception>
        /// <exception cref="NullReferenceException">Thrown when Alliance not exsist or not active</exception>
        /// <returns></returns>
        /// <remarks>
        ///     если нет сообщений для обновления статуса Возвращает Null
        /// </remarks>
        /// <seealso cref="T:Server.Core.Infrastructure.Alliance.ArmAllianceAcceptedStatus"></seealso>
        IList<AllianceRequestMessageDataModel> RejectRequestToAlliance(IDbConnection connection, AllianceUserDataModel currentUser, int rejectUserId, AllianceRoleDataModel role = null);


        /// <summary>
        ///     Удаляет записи  для альянса и для пользователя (перемещает в историю)
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="allianceManagerAllianceId">Current user whith role permition AcceptNewMembers</param>
        /// <param name="targetUserId"></param>
        /// <param name="managerRoleAcceptNewMembers">CurrentUser alliance role property</param>
        /// <exception cref="SecurityException">Thrown when role not has permition to AcceptNewMembers</exception>
        /// <returns></returns>
        bool DeleteAllianceRequestsByManager(IDbConnection connection, int allianceManagerAllianceId, int targetUserId, bool managerRoleAcceptNewMembers);

        #endregion
    }

    public interface IAllianceUserAction
    {
        #region sync

        AllianceUserDataModel LeaveFromAlliance(IDbConnection connection, int userId, bool fromNpc);
        AllianceUserDataModel LeaveFromAlliance(IDbConnection connection, AllianceUserDataModel beforeLeaveAllianceUser, bool fromNpc);
        AllianceUserDataModel LeaveFromNpcAndJoinToUserAlliance(IDbConnection connection, int oldAllianceUserId, int newAllianceId);


        /// <summary>
        ///     по большей создается процедурой при выходе пользователя из  юзер альянса, или удалении альянса, тут находится как
        ///     факт того что такое событие есть
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="userId"></param>
        /// <param name="isCurrentUser"></param>
        /// <exception cref="NotSupportedException"></exception>
        /// <returns></returns>
        void JoinToConfederation(IDbConnection connection, int userId, bool isCurrentUser);


        /// <summary>
        ///     транзакция внтри процедуры
        ///     //todo требуется тестирование
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="userId"></param>
        /// <param name="allianceId"></param>
        /// <exception cref="NullReferenceException"></exception>
        /// <exception cref="SecurityException"></exception>
        /// <returns>Список удаленных пользователей</returns>
        Dictionary<OldNewAllianceKeys, object> DisbandAlliance(IDbConnection connection, int userId, int allianceId);


        /// <summary>
        ///     создает объект альянса и записывает его в базу, если не получается делает октат
        ///     //todo  не делает отката
        ///     //todo требуется тестирование
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="allianceName"></param>
        /// <param name="userId"></param>
        /// <param name="userName"></param>
        /// <returns>new alliance</returns>
        AllianceDataModel CreateAlliance(IDbConnection connection, string allianceName, int userId, string userName);

        AllianceDataModel CreateAlliance(IDbConnection connection, AllianceDataModel allianceData);
        bool CheckNameIsUnic(IDbConnection connection, string allianceName);

        Dictionary<string, object> CreateUserAlliance(IDbConnection connection, string newAllianceName, AllianceUserDataModel oldCurrentAllianceUser, string currentUserName, IStoreService storeService);

        #endregion
    }
}