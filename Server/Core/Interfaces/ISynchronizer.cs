using System;
using System.Collections.Generic;
using System.Data;
using Server.Core.Interfaces.UserServices;
using Server.Core.СompexPrimitive.Products;
using Server.DataLayer;
using Server.Services.Demons;

namespace Server.Core.Interfaces
{
 

    #region  Runners

    public interface IMotherRunner
    {
        UserMothershipDataModel RunUser(IDbConnection connection, UserMothershipDataModel mother, UserPremiumWorkModel userPremium, IMothershipService motherService, IUMotherJumpService motherJump);

        void PushDemon(IDbConnection connection, IMothershipService motherService, IUMotherJumpService motherJumpService, IStoreService storeService);
    }

    public interface IPlanetRunner
    {
        GDetailPlanetDataModel RunSinglePlanet(IDbConnection connection, GDetailPlanetDataModel planet, UserPremiumWorkModel userPremium, IGDetailPlanetService planetService);

        IList<GDetailPlanetDataModel> RunPlanets(IDbConnection connection, IList<GDetailPlanetDataModel> planets, UserPremiumWorkModel userPremium, IGDetailPlanetService planetService);

        void PushDemon(IDbConnection connection, IGDetailPlanetService planetService, IStoreService storeService);
    }

    public interface ITaskRunner
    {
        void RunTaskItem(IDbConnection connection, int taskId);
        void RunUser(IDbConnection connection, int userId);
        void PushDemon(IDbConnection connection);
        TimerExecutorItem OnUserTaskCreated(UserTaskDataModel newTask, int initiativeUserId, Action<IDbConnection> onFinnalyTimerElapsed = null);
    }

    #endregion

    public interface ISynchronizer : ITest {

        bool DemonsStarted { get; }
        void StartDemons();
        void StopDemons();


        #region Mother

        UserMothershipDataModel UserMothership(IDbConnection connection, UserMothershipDataModel mother, UserPremiumWorkModel userPremium, IMothershipService motherService, IUMotherJumpService motherJump);

        #endregion

        #region Planet

        GDetailPlanetDataModel UserPlanet(IDbConnection connection, GDetailPlanetDataModel planet, UserPremiumWorkModel userPremium, IGDetailPlanetService planetService);

        IList<GDetailPlanetDataModel> UserPlanets(IDbConnection connection, IList<GDetailPlanetDataModel> planets, UserPremiumWorkModel userPremium, IGDetailPlanetService planetService);

        #endregion

        #region Tasks

        void RunTaskItem(IDbConnection connection, int taskId);
        void RunUserTasks(IDbConnection connection, int userId);

        ITaskRunner GetTaskRunner();

        #endregion
    }
}