using System.Collections.Generic;
using System.Data;

namespace Server.DataLayer.Repositories
{
    public interface IUserChestRepository : IAdapterDapper<user_chest, UserChestDataModel, int>,
        IDeleteAllProcedure

    {
        IEnumerable<user_chest> GetChestItems(IDbConnection connection, int userId);
    }

    public class UserChestRepository :
        AdapterDapperRepository<user_chest, UserChestDataModel, int>,
        IUserChestRepository
    {
        #region Declare

        public UserChestRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }

        #endregion

        #region Interface

        public override UserChestDataModel ConvertToWorkModel(user_chest entity) => _convertFromProcedure(entity);


        public override bool DeleteAllProcedure(IDbConnection connection) =>
            _deleteAllProcedire(connection, "user_chest_delete_all", false, "user_chest", 1);


        public IEnumerable<user_chest> GetChestItems(IDbConnection connection, int userId)
        {
            var items = _provider.Text<user_chest>(connection, $"SELECT * FROM {SchemeTableName} WHERE userId={userId}");
            return items;
        }

        #endregion

        protected override void _setUpdatedData(user_chest oldData, UserChestDataModel newData)
        {
            if (oldData.Id != newData.Id)
            {
                oldData.Id = newData.Id;
            }
            if (oldData.productStoreId != newData.ProductStoreId)
            {
                oldData.productStoreId = newData.ProductStoreId;
            }
            if (oldData.productTypeId != newData.ProductTypeId)
            {
                oldData.productTypeId = newData.ProductTypeId;
            }
            if (oldData.transactionsgId != newData.TransactionsgId)
            {
                oldData.transactionsgId = newData.TransactionsgId;
            }
            if (oldData.userId != newData.UserId)
            {
                oldData.userId = newData.UserId;
            }
            if (oldData.activated != newData.Activated)
            {
                oldData.activated = newData.Activated;
            }
            if (oldData.finished != newData.Finished)
            {
                oldData.finished = newData.Finished;
            }
            if (oldData.dateActivate != newData.DateActivate)
            {
                oldData.dateActivate = newData.DateActivate;
            }
            if (oldData.dateCreate != newData.DateCreate)
            {
                oldData.dateCreate = newData.DateCreate;
            }
        }


        private static UserChestDataModel _convertFromProcedure(IUserChestDbStore data)
        {
            var result = new UserChestDataModel();
            if (data == null)
            {
                return result;
            }
            result.Id = data.Id;
            result.ProductStoreId = data.productStoreId;
            result.ProductTypeId = data.productTypeId;
            result.TransactionsgId = data.transactionsgId;
            result.UserId = data.userId;
            result.Activated = data.activated;
            result.Finished = data.finished;
            result.DateActivate = data.dateActivate;
            result.DateCreate = data.dateCreate;

            return result;
        }
    }
}