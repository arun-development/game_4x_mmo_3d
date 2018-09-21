using System.Data;
using Server.Core.СompexPrimitive.Products;
using Server.Extensions;

namespace Server.DataLayer.Repositories
{
    public interface
        IProductStoreRepository : IAdapterDapper<product_store, ProductStoreDataModel, short>,
            IDeleteAllProcedure
    {
    }

    public class ProductStoreRepository :
        AdapterDapperRepository<product_store, ProductStoreDataModel, short>,
        IProductStoreRepository
    {
        public ProductStoreRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }


 
        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "product_store_delete_all", false, "product_store",1);
        }

        public override ProductStoreDataModel ConvertToWorkModel(product_store entity)
        {
            return _convertFromEntity(entity);
        }

        protected override void _setUpdatedData(product_store oldData, ProductStoreDataModel newData)
        {
            if (oldData.Id != newData.Id) oldData.Id = newData.Id;

            if (oldData.currencyCode != newData.CurrencyCode) oldData.currencyCode = newData.CurrencyCode;
            if (oldData.cost != newData.Cost) oldData.cost = newData.Cost;
            if (oldData.productTypeId != newData.ProductTypeId) oldData.productTypeId = newData.ProductTypeId;
            if (oldData.trash != newData.Trash) oldData.trash = newData.Trash;
            if (oldData.date != newData.Date) oldData.date = newData.Date;

            var props = newData.Property.ToSerealizeString();
            if (oldData.property != props) oldData.property = props;
        }

        private static ProductStoreDataModel _convertFromEntity(IProductStoreDbStore data)
        {
            var result = new ProductStoreDataModel();
            if (data == null) return result;
            result.Id = data.Id;

            result.CurrencyCode = data.currencyCode;
            result.Cost = data.cost;
            result.ProductTypeId = data.productTypeId;
            result.Trash = data.trash;
            result.Date = data.date;
            result.Property = data.property.ToSpecificModel<ProductItemProperty>();

            return result;
        }
    }
}