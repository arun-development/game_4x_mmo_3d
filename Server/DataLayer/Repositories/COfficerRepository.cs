using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Interfaces.Confederation;

namespace Server.DataLayer.Repositories
{
    public interface ICOfficerRepository : IAdapterDapper<c_officer, OfficerDataModel, int>,
        IDeleteAllProcedure
    {
        c_officer GetTopOfficerByUserId(IDbConnection connection, int userId);

    }

    public class COfficerRepository : AdapterDapperRepository<c_officer, OfficerDataModel, int>,
        ICOfficerRepository
    {
        public COfficerRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }


        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "c_officer_delete_all", false, "c_officer", 1);
        }

        public c_officer GetTopOfficerByUserId(IDbConnection connection, int userId)
        {
 
            var checkSql = $"SELECT TOP 1 FROM {SchemeTableName} WHERE userId ={userId}";
            return _provider.Text<c_officer>(connection, checkSql).FirstOrDefault();
        }


        public List<IUserOfficerOut> GetUserOfficerOutFromDb(IDbConnection connection)
        {
            throw new NotImplementedException();
        }

        public override OfficerDataModel ConvertToWorkModel(c_officer entity)
        {
            return _convertFromEntity(entity);
        }


        protected override void _setUpdatedData(c_officer oldData, OfficerDataModel newData)
        {
            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.officerType != (byte) newData.Type)
                oldData.officerType = (byte) newData.Type;
            if (oldData.userId != newData.UserId)
                oldData.userId = newData.UserId;
            if (oldData.allianceId != newData.AllianceId)
                oldData.allianceId = newData.AllianceId;
            if (oldData.elected != newData.Elected)
                oldData.elected = newData.Elected;
            if (oldData.appointedUserId != newData.AppointedUserId)
                oldData.appointedUserId = newData.AppointedUserId;
            if (oldData.dateStart != newData.DateStart)
                oldData.dateStart = newData.DateStart;
            if (oldData.dateEnd != newData.DateEnd)
                oldData.dateEnd = newData.DateEnd;
        }


        public static OfficerDataModel _convertFromEntity(IOfficerDbItem data)
        {
            var result = new OfficerDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            OfficerTypes type;
            Enum.TryParse(data.officerType.ToString(), out type);
            result.Type = type;
            result.UserId = data.userId;
            result.AllianceId = data.allianceId;
            result.Elected = data.elected;
            result.AppointedUserId = data.appointedUserId;
            result.DateStart = data.dateStart;
            result.DateEnd = data.dateEnd;
            return result;
        }
    }
}