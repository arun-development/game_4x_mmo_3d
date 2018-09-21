using System;
using System.Collections.Generic;
using System.Data;
using Server.Core.Tech;
using Server.Core.СompexPrimitive;
using Server.Extensions;

namespace Server.DataLayer.Repositories
{
    public interface IAllianceTechRepository : IAdapterDapper<alliance_tech, AllianceTechDataModel, int>,IDeleteAllProcedure

    {
    }

    public class AllianceTechRepository :
        AdapterDapperRepository<alliance_tech, AllianceTechDataModel, int>,
        IAllianceTechRepository
    {
        public AllianceTechRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }

        public override AllianceTechDataModel ConvertToWorkModel(alliance_tech entity)
        {
            return _convertFromEntity(entity);
        }



        public override  bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "alliance_tech_delete_all",false);

        }
 
        protected override void _setUpdatedData(alliance_tech oldData, AllianceTechDataModel newData)
        {
            if (oldData.Id != newData.Id) oldData.Id = newData.Id;

            if (newData.Teches == null)
                throw new NotImplementedException("_setUpdatedData.newData.Teches == null");
            var techProgress = newData.Teches.ToSerealizeString();

            if (oldData.techProgress != techProgress) oldData.techProgress = techProgress;
        }

 

        private static AllianceTechDataModel _convertFromEntity(IAllianceTechDbItem data)
        {
            var result = new AllianceTechDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.Teches = string.IsNullOrWhiteSpace(data.techProgress)
                ? new Dictionary<TechType, ItemProgress>()
                : data.techProgress.ToSpecificModel<Dictionary<TechType, ItemProgress>>();
            return result;
        }
    }
}