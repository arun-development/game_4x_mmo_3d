using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using Server.Core.Images;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive.Resources;
using Server.Core.СompexPrimitive.Units;
using Server.Extensions;
using Server.ServicesConnected.AzureStorageServices.ImageService;

namespace Server.DataLayer.Repositories
{
    public interface IUserSpyRepository : IAdapterDapper<user_spy, UserSpyDataModel, int>,
        IDeleteAllProcedure
    {
        
    }

    public class UserSpyRepository :
        AdapterDapperRepository<user_spy, UserSpyDataModel, int>,
        IUserSpyRepository
    {
        public UserSpyRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }


        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "user_spy_delete_all", false, "user_spy", 1);
        }
 

        public override UserSpyDataModel ConvertToWorkModel(user_spy entity)
        {
            return _convertFromProcedure(entity);
        }


        protected override void _setUpdatedData(user_spy oldData, UserSpyDataModel newData)
        {
            if (newData.TargetPlanetHangar == null)
                throw new ArgumentNullException(Error.IsEmpty, nameof(newData.TargetPlanetHangar));
            if (newData.TargetResource == null)
                throw new ArgumentNullException(Error.IsEmpty, nameof(newData.TargetResource));
            if (newData.TargetUserImage == null)
                throw new ArgumentNullException(Error.IsEmpty, nameof(newData.TargetUserImage));
            var targetUserImage = newData.TargetUserImage.ToSerealizeString();
            if (targetUserImage.Length > UserImageModel.DefaultMaxLength)
                throw new ValidationException(Error.OverMaxLength);

            var targetPlanetHangar = newData.TargetPlanetHangar.ToSerealizeString();
            var targetResource = newData.TargetResource.ToSerealizeString();


            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.sourceUserId != newData.SourceUserId) oldData.sourceUserId = newData.SourceUserId;
            if (oldData.targetPlanetId != newData.TargetPlanetId) oldData.targetPlanetId = newData.TargetPlanetId;
            if (oldData.targetPlanetTypeId != newData.TargetPlanetTypeId)
                oldData.targetPlanetTypeId = newData.TargetPlanetTypeId;
            if (oldData.targetPlanetName != newData.TargetPlanetName)
                oldData.targetPlanetName = newData.TargetPlanetName;
            if (oldData.targetPlanetHangar != targetPlanetHangar) oldData.targetPlanetHangar = targetPlanetHangar;
            if (oldData.targetResource != targetResource) oldData.targetResource = targetResource;
            if (oldData.targetUserImage != targetUserImage) oldData.targetUserImage = targetUserImage;
            if (oldData.targetUserName != newData.TargetUserName) oldData.targetUserName = newData.TargetUserName;
            if (oldData.dateActivate != newData.DateActivate) oldData.dateActivate = newData.DateActivate;
        }


        private static UserSpyDataModel _convertFromProcedure(IUSpyDbItem data)
        {
            var result = new UserSpyDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.SourceUserId = data.sourceUserId;
            result.TargetPlanetId = data.targetPlanetId;
            result.TargetPlanetTypeId = data.targetPlanetTypeId;
            result.TargetPlanetName = data.targetPlanetName;
            result.TargetPlanetHangar = data.targetPlanetHangar.ToSpecificModel<Dictionary<UnitType, int>>();
            result.TargetResource = data.targetResource.ToSpecificModel<MaterialResource>();
            result.TargetUserImage = Avatar.GetFileUrls(data.targetUserImage);
            result.TargetUserName = data.targetUserName;
            result.DateActivate = data.dateActivate;

            return result;
        }
    }
}