using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.Core.Interfaces.Confederation;

namespace Server.DataLayer.Repositories
{
    public interface ICOfficerCandidatRepository : IAdapterDapper<c_officer_candidat, OfficerCandidatDataModel, int>
    {
        List<CandidatOut> GetRegistredOfficerCandidatesByTopPvp(IDbConnection connection,int take);
        
    }

    public class COfficerCandidatRepository :
        AdapterDapperRepository<c_officer_candidat, OfficerCandidatDataModel, int>,
        ICOfficerCandidatRepository
    {
        #region Declare

        public COfficerCandidatRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }

        #endregion

        #region Interface

        public override OfficerCandidatDataModel ConvertToWorkModel(c_officer_candidat entity) =>
            _convertFromEntity(entity);

        public List<CandidatOut> GetRegistredOfficerCandidatesByTopPvp(IDbConnection connection, int take)
        {
            ThrowIfConnectionIsNull(connection);
            return Provider.Procedure<CandidatOut>(connection, "c_officer_candidat_get_top_candidates", new { take })
                .ToList();
        }

        #endregion

        public override bool DeleteAllProcedure(IDbConnection connection) => _deleteAllProcedire(connection,
            "c_officer_candidat_delete_all", false, "c_officer_candidat", 1);


        protected override void _setUpdatedData(c_officer_candidat oldData, OfficerCandidatDataModel newData)
        {
            oldData.Id = newData.Id;
            oldData.userId = newData.UserId;
            oldData.dateCreate = newData.DateCreate;
            oldData.voices = newData.Voices;
            oldData.isFinalizer = newData.IsFinalizer;
        }


        public static OfficerCandidatDataModel _convertFromEntity(IOfficerCandidatDbItem data)
        {
            var result = new OfficerCandidatDataModel();
            if (data == null)
            {
                return result;
            }
            result.Id = data.Id;

            result.UserId = data.userId;
            result.DateCreate = data.dateCreate;
            result.Voices = data.voices;
            result.IsFinalizer = data.isFinalizer;
            return result;
        }
    }
}