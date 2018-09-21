using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Extensions.DependencyInjection;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.Core.СompexPrimitive.Products;
using Server.DataLayer;

namespace Server.Services.Demons
{
    public class Synchronizer : ISynchronizer
    {
        private readonly IMotherRunner _motherRunner;
        private readonly IPlanetRunner _planetRunner;
        private readonly ITaskRunner _taskRunner;
        public static bool DemonsStarted => DemonRunner.DemonsStarted;
        bool ISynchronizer.DemonsStarted => DemonsStarted;
        private readonly IServiceProvider _svp;
        private static bool _inProgress = false;
        private static bool _demonStoped = false;


        public Synchronizer(ITaskRunner taskRunner, IPlanetRunner planetRunner, IMotherRunner motherRunner, IServiceProvider svp)
        {
            _svp = svp;
            _taskRunner = taskRunner;
            _planetRunner = planetRunner;
            _motherRunner = motherRunner;

        }

        public void StartDemons()
        {
            if (DemonsStarted)
            {
                return;
            }
            _demonStoped = false;

            DemonRunner.Start(() =>
            {
                //действие выполняется по интервалу
                if (_demonStoped || _inProgress)
                {
                    return;
                }
                _inProgress = true;
                try
                {

                    var provider = _svp.GetService<IDbProvider>();
                    var motherService = _svp.GetService<IMothershipService>();
                    var mjs = _svp.GetService<IUMotherJumpService>();
                    var storeSevice = _svp.GetService<IStoreService>();
                    var planetService = _svp.GetService<IGDetailPlanetService>();

                    // todo  можно завернуть в транзакцию но скорее всего пойдут конфликты, 
                    provider.ContextAction(connection =>
                    {
                        connection.OpenIfClosed();
                        try
                        {
                            // Console.WriteLine("_motherFactory");
                            _motherRunner.PushDemon(connection, motherService, mjs, storeSevice);
                            // Console.WriteLine("_planetFactory");
                            _planetRunner.PushDemon(connection, planetService, storeSevice);
                            // Console.WriteLine("_taskFactory");
                            _taskRunner.PushDemon(connection);
                        }
          
                        finally
                        {
                            connection.CloseIfOpened();
                        }

                        return true;
                    });
                    _inProgress = false;

                }
                catch (Exception e)
                {
                    _inProgress = false;
                    Console.WriteLine(e);
                    throw e;
                }


            });


        }

        public void StopDemons()
        {
            _demonStoped = true;
            DemonRunner.Stop();
        }


        public GDetailPlanetDataModel UserPlanet(IDbConnection connection, GDetailPlanetDataModel planet, UserPremiumWorkModel userPremium, IGDetailPlanetService planetService)
        {
            return _planetRunner.RunSinglePlanet(connection, planet, userPremium, planetService);

        }

        public IList<GDetailPlanetDataModel> UserPlanets(IDbConnection connection, IList<GDetailPlanetDataModel> planets, UserPremiumWorkModel userPremium, IGDetailPlanetService planetService)
        {
            return _planetRunner.RunPlanets(connection, planets, userPremium, planetService);
        }

        public void RunTaskItem(IDbConnection connection, int taskItemId)
        {
            _taskRunner.RunTaskItem(connection, taskItemId);
        }

        public void RunUserTasks(IDbConnection connection, int userId)
        {
            _taskRunner.RunUser(connection, userId);
        }

        public ITaskRunner GetTaskRunner()
        {
            return _taskRunner;
        }


        public UserMothershipDataModel UserMothership(IDbConnection connection, UserMothershipDataModel mother, UserPremiumWorkModel userPremium, IMothershipService motherService, IUMotherJumpService motherJump)
        {

            return _motherRunner.RunUser(connection, mother, userPremium, motherService, motherJump);
        }

        public string Test(string message = "Ok")
        {
            return message;
        }
    }
}