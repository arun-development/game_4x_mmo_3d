using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Server.Core.Infrastructure;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive.Other;
using Server.Extensions;
using Server.ServicesConnected.AzureStorageServices.ImageService;
 

namespace Server.DataLayer.Repositories
{
    public interface IUserRepository : IAdapterDapper<user, UserDataModel, int>, IDeleteAllProcedure
    {
        Task<IList<NameIdInt>> FilterUserNameAsync(IDbConnection connection, string partUserName);
        IList<NameIdInt> FilterUserName(IDbConnection connection, string partUserName);
        int CreateNextUserId(IDbConnection connection);

    }



    public class UserRepository :
        AdapterDapperRepository<user, UserDataModel, int>,
        IUserRepository
    {
        public UserRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }

        //tmp
        public override user AddOrUpdate(IDbConnection c, user item, IDbTransaction tran = null)
        {

            var sqlPrimaryType = "int";
            var sqlValuesName = @"authId,isNpc,avatarUrls,dateCreate,dateLastJoin,dateLastLeft,description,isOnline,leaveAllianceTime,meedsQuantity,nickname,pvpPoint,status";
            var sqlValuesVars = "@authId,@isNpc,@avatarUrls,@dateCreate,@dateLastJoin,@dateLastLeft,@description,@isOnline,@leaveAllianceTime,@meedsQuantity,@nickname,@pvpPoint,@status";
            var sqlUpdate = $@"authId=@authId," +
                            $@"isNpc=@isNpc," +
                            $@"avatarUrls=@avatarUrls," +
                            $@"dateCreate=@dateCreate," +
                            $@"dateLastJoin=@dateLastJoin," +
                            $@"dateLastLeft=@dateLastLeft," +
                            $@"description=@description," +
                            $@"isOnline=@isOnline," +
                            $@"leaveAllianceTime=@leaveAllianceTime," +
                            $@"meedsQuantity=@meedsQuantity," +
                            $@"nickname=@nickname," +
                            $@"pvpPoint=@pvpPoint," +
                            $@"status=@status";
            
            var upsertSql =$@"declare @_id {sqlPrimaryType};                            
                                     if (isnull (@Id,0)=0)
                                     	begin
                                     	insert into {SchemeTableName} ({sqlValuesName}) values ({sqlValuesVars}); 
                                     	set @_id = SCOPE_IDENTITY();		 
                                     	end
                                     ELSE 
                                     	BEGIN	
                                     	UPDATE {SchemeTableName} set {sqlUpdate} where Id = @Id   
                                     	
                                     	if (@@ROWCOUNT = 0)
                                     		BEGIN
                                            SET IDENTITY_INSERT  {SchemeTableName} ON
                                     		insert into {SchemeTableName} (Id,{sqlValuesName}) values (@Id,{sqlValuesVars});
                                            SET IDENTITY_INSERT  {SchemeTableName} OFF
                                     		END
                                     	set @_id =@Id;  
                                     	END                            
                                     	
                                     SELECT * FROM {SchemeTableName} where Id=@_id;
                        ";
       

 
            var user = _provider.Text<user>(c, upsertSql, item).FirstOrDefault();
            return user;

        }


        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "user_delete_all", false, "user", 0);
        }



        public override UserDataModel ConvertToWorkModel(user entity)
        {
            return _convertFromProcedure(entity);
        }

        public async Task<IList<NameIdInt>> FilterUserNameAsync(IDbConnection connection, string partUserName)
        {
            return await Task.Factory.StartNew(() => FilterUserName(connection, partUserName));
        }

        public IList<NameIdInt> FilterUserName(IDbConnection connection, string partUserName)
        {
            IList<NameIdInt> result = _provider.Procedure<dynamic>(connection, "user_serch_name_id",new {
                    partUserName = partUserName
            }).Select(i => new NameIdInt(i.Id, i.nickname))
                .ToList();

            return result;
        }

        public int CreateNextUserId(IDbConnection connection)
        {
            var nextId = _provider.Procedure<int>(connection, "user_get_next_game_user_id").FirstOrDefault();
            if (nextId == 0)
                throw new NotImplementedException(nameof(CreateNextUserId));
            return nextId;
        }


        protected override void _setUpdatedData(user oldData, UserDataModel newData)
        {
            if (newData.Avatar == null) throw new ArgumentNullException(Error.IsEmpty, nameof(newData.Avatar));

            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.authId != newData.AuthId) oldData.authId = newData.AuthId;
            if (oldData.nickname != newData.Nickname) oldData.nickname = newData.Nickname;
            if (oldData.dateCreate != newData.DateCreate) oldData.dateCreate = newData.DateCreate;
            if (oldData.status != newData.Status) oldData.status = newData.Status;
            if (oldData.pvpPoint != newData.PvpPoint) oldData.pvpPoint = newData.PvpPoint;
            if (oldData.leaveAllianceTime != newData.LeaveAllianceTime)
                oldData.leaveAllianceTime = newData.LeaveAllianceTime;
            if (oldData.isNpc != newData.IsNpc) oldData.isNpc = newData.IsNpc;
            if (oldData.isOnline != newData.IsOnline) oldData.isOnline = newData.IsOnline;
            if (oldData.dateLastLeft != newData.DateLastLeft) oldData.dateLastLeft = newData.DateLastLeft;
            if (oldData.dateLastJoin != newData.DateLastJoin) oldData.dateLastJoin = newData.DateLastJoin;

            var avatarUrls = newData.Avatar.ToSerealizeString();
            if (oldData.avatarUrls != avatarUrls)
                oldData.avatarUrls = avatarUrls;

            if (oldData.description != newData.Description)
                oldData.description = newData.Description;
            if (newData.MeedsQuantity == null) newData.MeedsQuantity = new Dictionary<int, MeedDbModel>();
            var meeds = newData.MeedsQuantity.ToSerealizeString();
            if (oldData.meedsQuantity != meeds)
                oldData.meedsQuantity = meeds;
        }


        private static UserDataModel _convertFromProcedure(IUserDbItem data)
        {
            var result = new UserDataModel();
            if (data == null) return result;

            result.Id = data.Id;
            result.AuthId = data.authId;
            result.Nickname = data.nickname;
            result.DateCreate = data.dateCreate;
            result.Status = data.status;
            result.PvpPoint = data.pvpPoint;
            result.LeaveAllianceTime = data.leaveAllianceTime;
            result.IsNpc = data.isNpc;
            result.IsOnline = data.isOnline;
            result.DateLastLeft = data.dateLastLeft;
            result.DateLastJoin = data.dateLastJoin;

            result.Avatar = Avatar.GetFileUrls(data.avatarUrls);
            result.Description = data.description;
            result.MeedsQuantity = data.meedsQuantity.ToSpecificModel<Dictionary<int, MeedDbModel>>();

            return result;
        }
    }
}