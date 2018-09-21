using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Extensions.DependencyInjection;
using Server.Core.Interfaces;
using Server.Core.Interfaces.Confederation;
using Server.Core.Interfaces.ForModel;
using Server.Core.Interfaces.UserServices;
using Server.DataLayer;
using Server.DataLayer.Repositories;
using Server.Modules.Localize;

namespace Server.Services.Confederation
{
    public partial class ConfederationService : IConfederationService
    {
        private readonly ICOfficerRepository _officerRepository;
        private readonly ICOfficerCandidatRepository _officerCandidatRepository;
        private readonly IStoreService _storeService;
        private readonly IServiceProvider _svp;
        private readonly IDbProvider _provider;
 
 

        public ConfederationService(IStoreService storeService,ICOfficerRepository officerRepository, IServiceProvider svp, IDbProvider provider, ICOfficerCandidatRepository officerCandidatRepository)
        {
            _storeService = storeService;
            _officerRepository = officerRepository;
            _svp = svp;
            _provider = provider;
            _officerCandidatRepository = officerCandidatRepository;
        }

        public IPlanshetViewData InitialPlanshetConfederation(IDbConnection connection, IGameUserService gu)
        {
            _checkAndRunVoteState(connection, 0, false);
            var officerOut = GetOfficers(connection,true);
            TabOfficer tabOficers = null;
            TabElection tabElection = null;
            if (officerOut != null)
            {
                tabOficers = new TabOfficer(officerOut);
                tabElection = GetTabElection(connection, true);
            }
            else
            {
                // нет инициализации нет голосования нет офицеров
                tabOficers = new TabOfficer();
                tabElection = new TabElection(false, new List<CandidatOut>(), 0);
                tabElection.SetTimes(StartRegistrationTime, StartVoteTime, EndVoteTime);
            }

            var users = gu.GetTopPvpUsers(connection, 0, TabUserRating.PER_PAGE);
            var rating = new TabUserRating(users, 0);
            return ConfederationPlanshetOut.InitialTabs(tabOficers, rating, tabElection,
                _svp.GetService<ILocalizerService>());
        }


        public List<UserRattingItem> RatingGetNextPage(IDbConnection connection, IGameUserService gu, int skip)
        {
            var users = gu.GetTopPvpUsers(connection, skip, TabUserRating.PER_PAGE);
            return TabUserRating.CreateUserList(users, skip);
        }

        public UserRattingItem RatingGetUser(IDbConnection connection, IGameUserService gu, int userId)
        {
            var user = gu.GetGameUser(connection, userId);
            var top = gu.GetTopPosition(connection, user.Id, user.PvpPoint);
            return new UserRattingItem(user, top);
        }


        public string Test(string message = "Ok")
        {
            return message;
        }


        public TabElection GetTabElection(IDbConnection connection, bool periodIsCheked = false)
        {
            var votingInProgress = VotingInProgress;
            //var voting = new TabElection(!votingInProgress, await _getFakeCandidates(periodIsCheked), votingInProgress ? 0 : REGISTER_CANDIDATE_CC_PRICE);
            var voting = new TabElection(!votingInProgress, GetCandidates(connection, periodIsCheked),
                votingInProgress ? 0 : REGISTER_CANDIDATE_CC_PRICE);
            voting.SetTimes(StartRegistrationTime, StartVoteTime, EndVoteTime);
            return voting;
        }
    }
}