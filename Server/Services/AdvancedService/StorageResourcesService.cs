using System.Data;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.Core.СompexPrimitive.Resources;
using Server.Extensions;
using Server.Services.GameObjects.BuildModel.BuildItem;

namespace Server.Services.AdvancedService
{
    public interface IStorageResourcesService : ITest
    {
        StorageResources Execute(IDbConnection connection, int userId, string res, int id = 0);
        StorageResources Execute(IDbConnection connection, int userId, StorageResources res, int planetId = 0);
    }

    public class StorageResourcesService : IStorageResourcesService
    {
        private readonly IMothershipService _mother;
        private readonly IGDetailPlanetService _planet;
        private readonly IStoreService _storeService;

        public StorageResourcesService(IGDetailPlanetService planet, IMothershipService mother,
            IStoreService storeService)
        {
            _planet = planet;
            _mother = mother;
            _storeService = storeService;
        }


        public StorageResources Execute(IDbConnection connection, int userId, string res, int id = 0)
        {
            return Execute(connection, userId, res.ToSpecificModel<StorageResources>(), id);
        }

        public StorageResources Execute(IDbConnection connection, int userId, StorageResources res, int planetId = 0)
        {
            var pr = _storeService.GetPremiumWorkModel(connection, userId);
            if (pr.IsActive) return _premiumActive(connection, userId, res, planetId);
            if (!res.NeedFix()) return res;


            var fixedRes = FixCurrentResources(res);
            if (planetId == 0)
            {
                var updatedMother = _mother.SetNewResources(connection, userId, fixedRes);
                return updatedMother.Resources;
            }

            var updatedPlanetRes = _planet.SetNewResources(connection, planetId, userId, fixedRes);
            return updatedPlanetRes.Resources;
        }

        public string Test(string message = "Ok")
        {
            return message;
        }

        private StorageResources _premiumActive(IDbConnection connection, int userId, StorageResources res, int planetId)
        {
            var level = 1;
            var newRes = res.CloneDeep();
            if (planetId != 0)
            {
                // todo   создать генератор всех хранишищ
                var p = _planet.GetUserPlanet(connection, planetId, userId);
                if (p.BuildStorage.Level != null) level = (int) p.BuildStorage.Level;
                newRes.Max = Storage.MaxStorable(level, true);
                if (!res.NeedFix()) return newRes;
                var fixedPlanetRes = FixCurrentResources(newRes);
                var updatedPlanetRes = _planet.SetNewResources(connection, planetId, userId, fixedPlanetRes);
                return updatedPlanetRes.Resources;
            }

            newRes.Max = Storage.MaxMotherStorable(true);
            if (!res.NeedFix()) return newRes;
            var fixedMotherRes = FixCurrentResources(newRes);
            var updatedMother = _mother.SetNewResources(connection, userId, fixedMotherRes);
            return updatedMother.Resources;
        }

        public static StorageResources FixCurrentResources(StorageResources currResources)
        {
            currResources.Current = MaterialResource.FixCurrentResources(currResources.Current, currResources.Max);
            return currResources;
        }
    }
}