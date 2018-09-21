using System;
using System.Collections.Generic;
using System.Security;
using System.Threading.Tasks;
using Server.Core.Interfaces.Confederation;
using Server.Core.Interfaces.ForModel;
using Server.Core.StaticData;
using Server.Services.Confederation;

namespace Server.EndPoints.Hubs.GameHub
{

    public partial class MainGameHub
    {
        #region Common  
        public async Task<IPlanshetViewData> ConfederationGetPlanshet()
        {

            return await _contextAction(connection => _confederationService.InitialPlanshetConfederation(connection, _gameUserService));

        }

        #endregion


        #region Officers

        public async Task<bool> ConfederationAddNewOfficer(UserOfficerOut newOfficer, int presidentOfficerId, int presidentUserId)
        {
            return await _contextAction(connection =>
            {

                var cr = _getCurrentUser(connection);
                if (cr.UserId != presidentUserId) throw new SecurityException(Error.NotPermitted);
                var updOfficer = _confederationService.SetNewOfficerByPresident(connection, newOfficer, presidentOfficerId, presidentUserId);
                Clients.All.InvokeAsync("confederationAddOrUpdateOfficer", updOfficer);
                return true;
            });

        }

        #endregion

        #region Rating
        public async Task<List<UserRattingItem>> ConfederationRatingGetNextPage(int skip)
        {

            return await _contextAction(connection => _confederationService.RatingGetNextPage(connection, _gameUserService, skip));

        }

        public async Task<UserRattingItem> ConfederationRatingGetUser(int userId)
        {

            return await _contextAction(connection => _confederationService.RatingGetUser(connection, _gameUserService, userId));

        }

        #endregion

        #region Elections Voting and registrate
        public async Task<bool> ConfederationAddVote(int candidateUserId)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                var voteSended = cr.GetVoteSended();
                if (voteSended) throw new Exception(Error.UserHasAlreadyCastVote);
                var newCandidates = _confederationService.AddVote(connection, candidateUserId,cr.UserId);
                if (newCandidates == null) throw new NotImplementedException();
                cr.SetVoteSended();
                var updHubUser = _hubCache.AddOrUpdateLocal(cr, true);

                Clients.Caller.InvokeAsync("updateConnectionUser", updHubUser);

                Clients.All.InvokeAsync("onConfederationCandidatesUpdated", newCandidates, true);

                return true;
            });

        }

        public async Task<int> ConfederationRegistrateCandidate()
        {
            return await _contextActionAsync(async connection =>
            {
                var cr = _getCurrentUser(connection);
                if (cr.GetVoteRegistred()) throw new NotImplementedException(Error.CantRegisterCandidatAlreadyExist);
                var userData = _gameUserService.GetGameUser(connection, cr.UserId);
                var candidat = new CandidatOut
                {
                    UserId = cr.UserId,
                    UserName = cr.Name,
                    PvpPoint = userData.PvpPoint,
                };
                int? newUserCc = null;
                var newCandidates = _confederationService.RegisterCandidate(connection, candidat, (newCc) =>
                {
                    newUserCc = newCc;
                });
                if (newUserCc == null) throw new NotImplementedException("newUserCc == null");

                cr.SetVoteRegistred();
                var updHubUser = _hubCache.AddOrUpdateLocal(cr, true);

                await Clients.Client(cr.ConnectionId).InvokeAsync("updateConnectionUser", updHubUser);
                await Clients.All.InvokeAsync("onConfederationCandidatesUpdated", newCandidates, false);
                return (int)newUserCc;
            });
        }

        #endregion


    }
}