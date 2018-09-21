using System.Data;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.Core.СompexPrimitive.Products;
using Server.Core.СompexPrimitive.Resources;
using Server.Extensions;
using Server.Services.GameObjects.BuildModel.BuildItem;

namespace Server.Services.AdvancedService
{
    public interface ITransferResourceService
    {
        void TransPlanetToPlanet(IDbConnection connection, int sourseId, int targetId, MaterialResource deltaResourses, int userId, UserPremiumWorkModel userPremium);

        void TransPlanetToMother(IDbConnection connection, int sourseId, MaterialResource deltaResourses, int userId, UserPremiumWorkModel userPremium);

        void TransMotherToPlanet(IDbConnection connection, int targetId, MaterialResource deltaResourses, int userId, UserPremiumWorkModel userPremium);
    }

    public class TransferResourceService : ITransferResourceService
    {
        private readonly IMothershipService _mother;
        private readonly IUMotherJumpService _motherJumpService;
        private readonly IGDetailPlanetService _planetService;


        private readonly IStorage _storage;
        private readonly IStorageResourcesService _storageResourcesService;
        private readonly ISynchronizer _synchronizer;

        public TransferResourceService(IStorage storage, IGDetailPlanetService planetService, IMothershipService mother,
            ISynchronizer synchronizer, IStorageResourcesService storageResourcesService,
            IUMotherJumpService motherJumpService)
        {
            _storage = storage;
            _planetService = planetService;
            _mother = mother;
            _synchronizer = synchronizer;
            _storageResourcesService = storageResourcesService;
            _motherJumpService = motherJumpService;
        }


        public void TransPlanetToPlanet(IDbConnection connection, int sourseId, int targetId, MaterialResource deltaResourses, int userId, UserPremiumWorkModel userPremium)
        {
            var soursePlanet = _planetService.GetUserPlanet(connection, sourseId, userId);
            var targetPlanet = _planetService.GetUserPlanet(connection, targetId, userId);

            soursePlanet = _synchronizer.UserPlanet(connection, soursePlanet, userPremium, _planetService);
            targetPlanet = _synchronizer.UserPlanet(connection, targetPlanet, userPremium, _planetService);

            //var curRes = _storageResourcesService.Execute(connection, userId, soursePlanet.Resources, sourseId);
            //var targetRes = _storageResourcesService.Execute(connection, userId, targetPlanet.Resources, targetId);
            var curRes = soursePlanet.Resources;
            var targetRes = targetPlanet.Resources;

            CalcNewRes(_storage, ref curRes, ref targetRes, deltaResourses, userPremium.IsActive,soursePlanet.BuildStorage.Level);

            soursePlanet.Resources = curRes;
            _planetService.AddOrUpdate(connection,soursePlanet);

            targetPlanet.Resources = _storageResourcesService.Execute(connection, userId, targetRes, targetId);
            _planetService.AddOrUpdate(connection,targetPlanet);
        }

        public void TransPlanetToMother(IDbConnection connection, int sourseId, MaterialResource deltaResourses, int userId, UserPremiumWorkModel userPremium)
        {
            var soursePlanet = _planetService.GetUserPlanet(connection, sourseId, userId);
            var targetMother = _mother.GetMother(connection, userId);

            soursePlanet = _synchronizer.UserPlanet(connection, soursePlanet, userPremium, _planetService);
            targetMother = _synchronizer.UserMothership(connection, targetMother, userPremium, _mother, _motherJumpService);


            var curRes = soursePlanet.Resources; //_storageResourcesService.Execute(connection, userId, soursePlanet.Resources, sourseId);
            var targetRes = targetMother.Resources;//_storageResourcesService.Execute(connection, userId, targetMother.Resources);
            CalcNewRes(_storage, ref curRes, ref targetRes, deltaResourses, userPremium.IsActive,
                soursePlanet.BuildStorage.Level);

            soursePlanet.Resources = curRes;
            _planetService.AddOrUpdate(connection,soursePlanet);

            targetMother.Resources = _storageResourcesService.Execute(connection, userId, targetRes);
            _mother.AddOrUpdate(connection,targetMother);
        }

        public void TransMotherToPlanet(IDbConnection connection, int targetId, MaterialResource deltaResourses, int userId, UserPremiumWorkModel userPremium)
        {
            var sourseMother = _mother.GetMother(connection, userId);
            var targetPlanet = _planetService.GetUserPlanet(connection, targetId, userId);

            sourseMother = _synchronizer.UserMothership(connection, sourseMother, userPremium, _mother, _motherJumpService);
            targetPlanet = _synchronizer.UserPlanet(connection, targetPlanet, userPremium, _planetService);


            var curRes = sourseMother.Resources;// _storageResourcesService.Execute(connection, userId, sourseMother.Resources);
            var targetRes = targetPlanet.Resources; //_storageResourcesService.Execute(connection, userId, targetPlanet.Resources, targetId);

            CalcNewRes(_storage, ref curRes, ref targetRes, deltaResourses, userPremium.IsActive);


            sourseMother.Resources = curRes;
             _mother.AddOrUpdate(connection,sourseMother);

            targetPlanet.Resources = _storageResourcesService.Execute(connection, userId, targetRes, targetId);
            _planetService.AddOrUpdate(connection,targetPlanet);
        }

        private static void CalcNewRes(IStorage storage, ref StorageResources sourceRes, ref StorageResources targetRes,MaterialResource delta, bool premium, int? storageLevel = null)
        {
            var compareTarget = targetRes.CloneDeep();
            sourceRes.Current = storage.CalculateTransferedRes(false, sourceRes.Current, delta, premium, storageLevel);
            targetRes.Current = storage.CalculateTransferedRes(true, targetRes.Current, delta, premium, storageLevel);

            if (!sourceRes.IsFull()) return;
            if (targetRes.Current.E - (compareTarget.Current.E + delta.E) > 0)
            {
                var overMax = targetRes.Current.E - targetRes.Max.E;
                sourceRes.Current.E += overMax;
                targetRes.Current.E -= overMax;
            }
            if (targetRes.Current.Ir - (compareTarget.Current.Ir + delta.Ir) > 0)
            {
                var overMax = targetRes.Current.Ir - targetRes.Max.Ir;
                sourceRes.Current.Ir += overMax;
                targetRes.Current.Ir -= overMax;
            }
            if (targetRes.Current.Dm - (compareTarget.Current.Dm + delta.Dm) > 0)
            {
                var overMax = targetRes.Current.Dm - targetRes.Max.Dm;
                sourceRes.Current.Dm += overMax;
                targetRes.Current.Dm -= overMax;
            }
        }
    }
}