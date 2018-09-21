using System;
using System.Data;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive.Products;
using Server.Extensions;

namespace Server.DataLayer.Repositories
{
    public interface IProductTypeRepository : IAdapterDapper<product_type, ProductTypeDataModel, byte>,
        IDeleteAllProcedure
    {
    }

    public class ProductTypeRepository :
        AdapterDapperRepository<product_type, ProductTypeDataModel, byte>,
        IProductTypeRepository
    {
        public ProductTypeRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }


        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "product_type_delete_all", false, "product_type", 1);
        }
 

        public override ProductTypeDataModel ConvertToWorkModel(product_type entity)
        {
            return _convertFromEntity(entity);
        }


        protected override void _setUpdatedData(product_type oldData, ProductTypeDataModel newData)
        {
            if (newData.Property == null) throw new ArgumentNullException(Error.IsEmpty, nameof(newData.Property));

            var property = newData.Property.ToSerealizeString();
            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.name != newData.Name) oldData.name = newData.Name;
            if (oldData.property != property) oldData.property = property;
        }

        private static ProductTypeDataModel _convertFromEntity(IProductTypeDbItem data)
        {
            var result = new ProductTypeDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.Name = data.name;
            result.Property = data.property.ToSpecificModel<ProductItemProperty>();
            return result;
        }
    }
}