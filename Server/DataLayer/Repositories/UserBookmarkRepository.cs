using System.Data;

namespace Server.DataLayer.Repositories
{
    public interface IUserBookmarkRepository : IAdapterDapper<user_bookmark, UserBookmarkDataModel, int>,
        IDeleteAllProcedure
    {
    }

    public class UserBookmarkRepository :
        AdapterDapperRepository<user_bookmark, UserBookmarkDataModel, int>,
        IUserBookmarkRepository
    {
        public UserBookmarkRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }

        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "user_bookmark_delete_all", false, "user_bookmark",1);
        }
 

        public override UserBookmarkDataModel ConvertToWorkModel(user_bookmark entity)
        {
            return _convertFromProcedure(entity);
        }


        protected override void _setUpdatedData(user_bookmark oldData, UserBookmarkDataModel newData)
        {
            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.userId != newData.UserId) oldData.userId = newData.UserId;
            if (oldData.objectId != newData.ObjectId) oldData.objectId = newData.ObjectId;
            if (oldData.typeId != newData.TypeId) oldData.typeId = newData.TypeId;
        }

        private static UserBookmarkDataModel _convertFromProcedure(IGUserBookmarkDbItem data)
        {
            var result = new UserBookmarkDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.UserId = data.userId;
            result.ObjectId = data.objectId;
            result.TypeId = data.typeId;

            return result;
        }
    }
}