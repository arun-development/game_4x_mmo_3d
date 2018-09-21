using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Infrastructure.Alliance;
using Server.Core.Npc;
using Server.Core.StaticData;

namespace Server.DataLayer.Repositories
{
    public interface IAllianceUserRepository : IAdapterDapper<alliance_user, AllianceUserDataModel, int>,
        IDeleteAllProcedure
    {
        AllianceUserDataModel LeaveUserFromAlliance(IDbConnection connection, int allianceId, int userId, bool setToNpc);
        IEnumerable<alliance_user> GetAllianceUsersByUserId(IDbConnection connection, int userId);
    }

    public class AllianceUserRepository :
        AdapterDapperRepository<alliance_user, AllianceUserDataModel, int>, IAllianceUserRepository
    {
        public AllianceUserRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }


        public override AllianceUserDataModel ConvertToWorkModel(alliance_user entity)
        {
            return _convertFromEntity(entity);
        }

        /// <summary>
        ///     транзакция в процедуре, удаляет пользователя из альянса и перемещает данные в историческую таблицу в случае успеха
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="allianceId"></param>
        /// <param name="userId"></param>
        /// <param name="setToNpc"></param>
        /// <returns></returns>
        public AllianceUserDataModel LeaveUserFromAlliance(IDbConnection connection, int allianceId, int userId, bool setToNpc)
        {
            ThrowIfConnectionIsNull(connection);
            if (allianceId == 0 || userId == 0) throw new ArgumentException(Error.InputDataIncorrect);
            var user = (alliance_user)null;
            _provider.ExecProcedure(connection, "alliance_user_leave_user_from_alliance", new
            {
                allianceId,
                userId,
                setToNpc,
                confederationAllianceId = (int)NpcAllianceId.Confederation,
                recrutRoleId = (byte)AllianceRoles.Recrut
            });
            if (setToNpc)
            {
                var sql = $"SELECT TOP 1 * FROM {SchemeTableName} where userId=@userId and allianceId=@allianceId";
                user = _provider.Text<alliance_user>(connection, sql, new
                {
                    userId,
                    allianceId = (int)NpcAllianceId.Confederation
                }).FirstOrDefault();
            }
            if (!setToNpc) return null;
            if (user == null) throw new NullReferenceException(Error.AllianceUserNotExist);
            return _convertFromEntity(user);
        }

        public IEnumerable<alliance_user> GetAllianceUsersByUserId(IDbConnection connection, int userId)
        {
            ThrowIfConnectionIsNull(connection);
            var sql = $"SELECT * FROM {SchemeTableName} WHERE userId=userId";
            return _provider.Text<alliance_user>(connection, sql);

        }


        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "alliance_user_delete_all", false, "alliance_user",0);

        }


        protected override void _setUpdatedData(alliance_user oldData, AllianceUserDataModel newData)
        {
            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.allianceId != newData.AllianceId) oldData.allianceId = newData.AllianceId;
            if (oldData.userId != newData.UserId) oldData.userId = newData.UserId;
            if (oldData.dateCreate != newData.DateCreate) oldData.dateCreate = newData.DateCreate;
            if (oldData.roleId != newData.RoleId) oldData.roleId = newData.RoleId;
        }

        private static AllianceUserDataModel _convertFromEntity(IAllianceUserDbItem data)
        {
            var result = new AllianceUserDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.AllianceId = data.allianceId;
            result.UserId = data.userId;
            result.DateCreate = data.dateCreate;
            result.RoleId = data.roleId;
            return result;
        }
    }
}