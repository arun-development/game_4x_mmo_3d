using System;
using System.Collections.Generic;
using System.Data;
using Server.Core.Images;
using Server.Core.СompexPrimitive.Other;
using Server.DataLayer;

namespace Server.Services.UserService
{
    public partial class GameUserService
    {
        public UserDataModel AddOrUpdateUserPersonalInfo(IDbConnection connection, UserDataModel dataModel)
        {
            var updDataModel = _userRepo.AddOrUpdateeModel(connection,dataModel);
            return _userCache.UpdateLocalItem(connection,updDataModel);
        }

        public UserDataModel GetPersonalInfo(IDbConnection connection, int userId, bool checkData)
        {
            var user = _userCache.GetById(connection,userId, true);
            if (checkData && user == null) throw new NullReferenceException();
            return user;
        }

        public Dictionary<int, MeedDbModel> PersonalInfoGetMeeds(IDbConnection connection, int userId)
        {
            var user = GetPersonalInfo(connection, userId, true);
            return user.MeedsQuantity;
        }

        public UserDataModel PersonalInfoSetAndSumbitMeeds(IDbConnection connection, int userId, Dictionary<int, MeedDbModel> model)
        {
            var user = GetPersonalInfo(connection, userId, true);
            user.MeedsQuantity = model;
            return AddOrUpdateUserPersonalInfo(connection, user);
        }

        public UserDataModel PersonalInfoUpdateUserDescription(IDbConnection connection, int userId, string text)
        {
            var user = GetPersonalInfo(connection, userId, true);
            user.Description = text;
            return AddOrUpdateUserPersonalInfo(connection, user);
        }


        public UserImageModel GetUserAvatar(IDbConnection connection, int userId)
        {
            var user = GetPersonalInfo(connection, userId, true);
            return user.Avatar;
        }
    }
}