using System.Collections.Generic;
using System.Data;
using Microsoft.Extensions.DependencyInjection;
using Server.DataLayer;
using Server.DataLayer.LocalStorageCaches;
using Server.DataLayer.Repositories;
using Server.Services;
using Server.Services.Demons;
using Server.Services.Demons.Runners;

namespace Server.Infrastructure
{

    public interface IAppVarsReader
    {
        Dictionary<string, object> Create(IDbConnection connection);
 
    }

    public class AppVarsReader: IAppVarsReader
    {
 
        private readonly IGameRunner _gameRunner;
        public bool CacheInitialized => _gameRunner.CahceInitialized;
        public bool NpcTaskRunnerRunned => !NpcTaskRunner.Stoped;
        public int OnlineGameUsers => _gameRunner.OnlineUserCount;
        public int SkagryActivatedTaskCount => NpcTaskRunner.SkagryActivatedTaskCount;
        public int CachedPlanetCount;

        public AppVarsReader(IGameRunner gameRunner)
        {
            _gameRunner = gameRunner;
        }

        public Dictionary<string, object> Create(IDbConnection connection)
        {
            CachedPlanetCount = _gameRunner.GetPlanetIds(connection).Count;
            var resolver = _gameRunner.ServiceProvider;
            var hasWorld = resolver.GetService<IGGalaxyRepository>().HasItems(connection);
 
            var dic = new Dictionary<string,object>();
            
            dic.Add("GameConnectionName", DbProvider.AppConnectionName.ToString());
            dic.Add("WorldExists", hasWorld);
            dic.Add(nameof(CacheInitialized), CacheInitialized);
            dic.Add(nameof(NpcTaskRunnerRunned), NpcTaskRunnerRunned);
            dic.Add("SynchronizerDemonsStarted", Synchronizer.DemonsStarted);
            dic.Add(nameof(OnlineGameUsers), OnlineGameUsers);
            dic.Add(nameof(SkagryActivatedTaskCount), SkagryActivatedTaskCount);
            dic.Add(nameof(CachedPlanetCount), CachedPlanetCount);
            //demons

            dic.Add("________", "________");


       
            dic.Add(nameof(IAllianceLocalStorageCache), resolver.GetService<IAllianceLocalStorageCache>().GetCount());
            dic.Add(nameof(IAllianceFleetLocalStorageCache), resolver.GetService<IAllianceFleetLocalStorageCache>().GetCount());
            dic.Add(nameof(IAllianceRequestMessageLocalStorageCache), resolver.GetService<IAllianceRequestMessageLocalStorageCache>().GetCount());
            dic.Add(nameof(IAllianceRoleLocalStorageCache), resolver.GetService<IAllianceRoleLocalStorageCache>().GetCount());
            dic.Add(nameof(IAllianceTechLocalStorageCache), resolver.GetService<IAllianceTechLocalStorageCache>().GetCount());
            dic.Add(nameof(IAllianceUserLocalStorageCache), resolver.GetService<IAllianceUserLocalStorageCache>().GetCount());
 
            dic.Add(nameof(IGDetailMoonLocalStorageCache), resolver.GetService<IGDetailMoonLocalStorageCache>().GetCount());
            dic.Add(nameof(IGDetailPlanetLocalStorageCache), resolver.GetService<IGDetailPlanetLocalStorageCache>().GetCount());
            dic.Add(nameof(IGDetailSystemLocalStorageCache), resolver.GetService<IGDetailSystemLocalStorageCache>().GetCount());
            dic.Add(nameof(IGGalaxyLocalStorageCache), resolver.GetService<IGGalaxyLocalStorageCache>().GetCount());
            dic.Add(nameof(IGGameTypeLocalStorageCache), resolver.GetService<IGGameTypeLocalStorageCache>().GetCount());
            dic.Add(nameof(IGGeometryMoonLocalStorageCache), resolver.GetService<IGGeometryMoonLocalStorageCache>().GetCount());

            dic.Add(nameof(IGGeometryPlanetLocalStorageCache), resolver.GetService<IGGeometryPlanetLocalStorageCache>().GetCount());
            dic.Add(nameof(IGGeometryStarLocalStorageCache), resolver.GetService<IGGeometryStarLocalStorageCache>().GetCount());
            dic.Add(nameof(IGGeometrySystemLocalStorageCache), resolver.GetService<IGGeometrySystemLocalStorageCache>().GetCount());
            dic.Add(nameof(IGSectorsLocalStorageCache), resolver.GetService<IGSectorsLocalStorageCache>().GetCount());

            dic.Add(nameof(IGTextureTypeLocalStorageCache), resolver.GetService<IGTextureTypeLocalStorageCache>().GetCount());
            dic.Add(nameof(ICurrencyLocalStorageCache), resolver.GetService<ICurrencyLocalStorageCache>().GetCount());
            dic.Add(nameof(IProductStoreLocalStorageCache), resolver.GetService<IProductStoreLocalStorageCache>().GetCount());
            dic.Add(nameof(IProductTypeLocalStorageCache), resolver.GetService<IProductTypeLocalStorageCache>().GetCount());



            dic.Add(nameof(IUserBalanceCcLocalStorageCache), resolver.GetService<IUserBalanceCcLocalStorageCache>().GetCount());
            dic.Add(nameof(IUserBookmarkLocalStorageCache), resolver.GetService<IUserBookmarkLocalStorageCache>().GetCount());
            dic.Add(nameof(IJournalBuyLocalStorageCache), resolver.GetService<IJournalBuyLocalStorageCache>().GetCount());
            dic.Add(nameof(IPremiumLocalStorageCache), resolver.GetService<IPremiumLocalStorageCache>().GetCount());
            dic.Add(nameof(ITransicationCcLocalStorageCache), resolver.GetService<ITransicationCcLocalStorageCache>().GetCount());
            dic.Add(nameof(IUMotherJumpLocalStorageCache), resolver.GetService<IUMotherJumpLocalStorageCache>().GetCount());
            dic.Add(nameof(IUReportLocalStorageCache), resolver.GetService<IUReportLocalStorageCache>().GetCount());
            dic.Add(nameof(IUserChestLocalStorageCache), resolver.GetService<IUserChestLocalStorageCache>().GetCount());
            dic.Add(nameof(IUserLocalStorageCache), resolver.GetService<IUserLocalStorageCache>().GetCount());
            dic.Add(nameof(IUserMothershipLocalStorageCache), resolver.GetService<IUserMothershipLocalStorageCache>().GetCount());
            dic.Add(nameof(IUSpyLocalStorageCache), resolver.GetService<IUSpyLocalStorageCache>().GetCount());
            dic.Add(nameof(IUTaskLocalStorageCache), resolver.GetService<IUTaskLocalStorageCache>().GetCount());

            //advanced
            dic.Add("_________", "_________");
            dic.Add(nameof(TmpCache), TmpCache.GetCount());
            dic.Add(nameof(TimerExecutor), TimerExecutor.GetCount());
            dic.Add(nameof(IMainGameHubLocalStorageCache), resolver.GetService<IMainGameHubLocalStorageCache>().GetCount());
            dic.Add(nameof(IUserAuthToGameCache), resolver.GetService<IUserAuthToGameCache>().GetCount());
            dic.Add(nameof(IUserNameSercherPkCache), resolver.GetService<IUserNameSercherPkCache>().GetCount());
            dic.Add(nameof(IAlianceNameSercherPkCache), resolver.GetService<IAlianceNameSercherPkCache>().GetCount());
            dic.Add(nameof(IPlanetNameToPlanetIdPkCache), resolver.GetService<IPlanetNameToPlanetIdPkCache>().GetCount());
            dic.Add(nameof(ISystemNameSercherPkCache), resolver.GetService<ISystemNameSercherPkCache>().GetCount());
       



            return dic;



        }
    }
}