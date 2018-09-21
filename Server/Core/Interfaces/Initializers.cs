using System.Data;
using Microsoft.AspNetCore.Identity;
using Server.Core.Interfaces.AuthModule;
using Server.DataLayer;
using Server.ServicesConnected.Auth.Models;
using Server.ServicesConnected.Auth.Services;

namespace Server.Core.Interfaces
{
    public interface IBaseInitializer : ITest
    {
        void Init(IDbConnection connection);
        void DeleteAll(IDbConnection connection);
        void CreateAll(IDbConnection connection);
        bool DataExist(IDbConnection connection);
    }

    public interface IMainInitializer : ITest
    {
        void CreateAll(IDbConnection connection);
        void CreateFakeAlliances(IDbConnection connection);
        void AddFakeUsersToAlliances(IDbConnection connection);
        void DeleteFakeAlliances(IDbConnection connection);

        void DeleteAll(IDbConnection connection);
    }

    public interface IAllianceInitializer : IBaseInitializer
    {
        void CreateAllianceRating(IDbConnection connection);
        void AddUserRole(IDbConnection connection);
        void SetUserPlanet(IDbConnection connection);

        void CreateAllianceRoles(IDbConnection connection);
    }

    public interface IAuthUsersInitializer : IBaseInitializer
    {
        void CreateMainRoles(IDbConnection connection, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager);
        void UpdateSecurityStamp(IDbConnection connection);
        void UpdateAllUsersRating(IDbConnection connection);
        void GroupInitizlize(IDbConnection connection);
        void UpdateAllImg(IDbConnection connection);
        void UpdateUserImg(IDbConnection connection);
        void DeleteFakeUsers(IDbConnection connection, UserManager<ApplicationUser> userManager);
        void GenerateFakeAuthUsers(IDbConnection connection, UserManager<ApplicationUser> userManager);
        void TestAddUserToRole(IDbConnection connection, string userAuthId, string roleName);
        IAuthDbInitializer DbInitializer { get; }

    }

    public interface IMapGInitializer : IBaseInitializer
    {
        // void DeleteSystemGeometry();
        bool CreateSystemGeometries(IDbConnection connection);

        bool CreateSectors(IDbConnection connection);
        bool UpdateStarEnergyBonuses(IDbConnection connection);

        bool UpdateSectorsToArchForm(IDbConnection connection);

        //  void DeleteMoonDetail();
        bool CreateMoons(IDbConnection connection);

        void ResetAllPlanetsToNpc(IDbConnection connection);
        void UpdatePlanetOwner(IDbConnection connection, int planetId, int userId);
    }


    public interface INpcInitializer
    {
        void CreateMotherNpces(IDbConnection connection);
        void CreateMotherNpc(IDbConnection connection, UserMothershipDataModel npc);
        void DeleteNpcMothers(IDbConnection connection);
        void Init(IDbConnection connection);
    }

    public interface IOwnProgressInitializer
    {
        void IntAllPlanetBuilds(IDbConnection connection);
        void SetAllInitialPlanetBuilds(IDbConnection connection, UserDataModel user, int planetId);
        void ResetStorageBuild(IDbConnection connection);
        void ResetAllTurels(IDbConnection connection);

        void ResetAllEnergyConverters(IDbConnection connection);

        // resource
        void ResetAdminPlanets(IDbConnection connection);

        void ResetAllMotherResources(IDbConnection connection);

        void ResetMotherResourceById(IDbConnection connection, int userId);

        // hangar
        void ResetPlanetHangarAndResource(IDbConnection connection);

        GDetailPlanetDataModel SetInitialHangarAndResource(IDbConnection connection, GDetailPlanetDataModel planet, bool premium = false);
        void ResetMotherHangar(IDbConnection connection);
        GDetailPlanetDataModel SetInitialPlanetBuilds(GDetailPlanetDataModel planet, int userId = 1);
    }

    public interface IUserInitializer
    {
        bool Run(IDbConnection connection, string userAuthId, string userName, ref bool existBefore);
        void InternalRun(IDbConnection connection, string userAuthId, string userName, int userId, bool setAllianceChannel);
        UserMothershipDataModel CreateMothership(IDbConnection connection, UserDataModel user);
        UserDataModel CreateGameUser(IDbConnection connection, string userAuthId, string userName, ref bool existBefore, int? userId = null);
        UserDataModel InternalCreateGameUser(IDbConnection connection, string userAuthId, string userName, int userId);
    }
}