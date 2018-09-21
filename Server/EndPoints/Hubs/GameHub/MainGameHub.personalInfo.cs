using System;
using System.Threading.Tasks; 
using Server.Core.Images;
using Server.Core.Infrastructure.Alliance;
using Server.Core.Interfaces.ForModel;
using Server.Core.StaticData;
using Server.Services.OutModel;

namespace Server.EndPoints.Hubs.GameHub
{
    public partial class MainGameHub
    {
        /// <summary>
        /// </summary>
        /// <param name="newBase64SourceImageModel"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<UserImageModel> PersonalInfoUpdateAvatar(Base64ImageOut newBase64SourceImageModel)
        {
            return await _contextActionAsync(async connection =>
            {
                var cr = _getCurrentUser(connection);

                var newUrls = await _gameUserService.ImageServiceLoadAndUpdateAsync(connection,
                    newBase64SourceImageModel.Base64File, cr.UserId, _channelService,
                    newBase64SourceImageModel.Ext);
                var aGroup = cr.CreateAllianceGroupName();
                if (cr.AllianceRoleId == (byte)AllianceRoles.Creator)
                {


                    try
                    {
                        await Groups.RemoveFromGroupAsync(cr.ConnectionId, aGroup);
                        await Clients.Group(aGroup).InvokeAsync("onPersonalInfoUserUpdateAvatar", newUrls, cr.UserId, cr.AllianceId);

                    }
                    finally
                    {
                        await Groups.AddToGroupAsync(cr.ConnectionId, aGroup);

                    }



                }
                return newUrls;
            });

        }

        /// <summary>
        /// </summary>
        /// <param name="newDescriptionText"></param>
        /// <exception cref="ArgumentException">Error.OverMaxLength</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<string> PersonalInfoUpdateUserDescription(string newDescriptionText)
        {
            _tryCatch(() =>
            {
                if (newDescriptionText.Length > (int)MaxLenghtConsts.PersonalInfoDescription)
                {
                    throw new ArgumentException(Error.OverMaxLength);
                }

            });
            
            return await _contextAction(connection =>
            {
                var cu = _getCurrentUser(connection);
                var newPi = _gameUserService.PersonalInfoUpdateUserDescription(connection, cu.UserId, newDescriptionText);
                return newPi.Description;
            });
        }

        /// <summary>
        /// </summary>
        /// <param name="userName"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<IPlanshetViewData> PersonalInfoGetProfileByUserName(string userName)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                if (!userName.Equals(cr.Name, StringComparison.OrdinalIgnoreCase))
                {
                    return _gameUserService.GetUserPlanshetProfile(connection,userName, cr.UserId, true);
                }
                var gu = _gameUserService.GetGameUser(connection, cr.UserId);
                return _gameUserService.GetUserPlanshetProfile(connection,gu, cr.UserId, false);
            });
        }

        /// <summary>
        /// </summary>
        /// <param name="userId"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<IPlanshetViewData> PersonalInfoGetProfileByUserId(int userId)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                if (cr.UserId != userId)
                {
                    return _gameUserService.GetUserPlanshetProfile(connection,userId, cr.UserId, true);
                }
                var gu = _gameUserService.GetGameUser(connection, cr.UserId);
                return _gameUserService.GetUserPlanshetProfile(connection,gu, cr.UserId, false);
            });
        }
    }
}