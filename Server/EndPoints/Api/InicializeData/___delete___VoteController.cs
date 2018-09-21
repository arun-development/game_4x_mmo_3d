using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Server.Core.Interfaces.Confederation;
using Server.Core.СompexPrimitive;
using Server.EndPoints.Api;
using Server.EndPoints.Hubs.GameHub;
using Server.Services.Confederation;

namespace app.Api.InicializeData

{

    public class VoteController : InitApiController
    {
        private readonly ConfederationService _confederationService;
        private readonly IHubContext _hub;
        private readonly IGameDataContextProvider _provider;

        public VoteController(IConfederationService confederationService, IGameDataContextProvider provider, IGameDataContextProvider db) : base(db, false)
        {
            _provider = provider;
            _hub = GlobalHost.ConnectionManager.GetHubContext<MainGameHub>();
            _confederationService = (ConfederationService)confederationService;
        }



        [HttpGet]
        [ApiAntiForgeryValidate]
        public IHttpActionResult TestPush()
        {

            var curTime = UnixTime.UtcNow();
            var currDatetime = UnixTime.GetDateFromTimeStamp(curTime);
            var startRegistrationTime = _confederationService.StartRegistrationTime;
            var startVoteTime = _confederationService.StartVoteTime;
            var endVoteTime = _confederationService.EndVoteTime;

            var candidates = _confederationService.GetCandidates(false);
            var candidatesCount = candidates.Count;

            var isVotePeriod = _confederationService.VotingInProgress;
            var periodName = isVotePeriod ? "IsVotePeriod" : "isRegisterdPeriod";
            //todo  logic toggle
            var timeToNextUpgrage = isVotePeriod ? endVoteTime - curTime : startVoteTime - curTime;
            var activeOfficers = new List<IOfficerOut>();
            try
            {
                activeOfficers = _confederationService.GetOfficers(true);
            }
            catch
            {
                // ignored
            }
            var activeOfficersCount = activeOfficers?.Count ?? 0;

            return Json(new
            {
                periodName,
                timeToNextUpgrage,
                curTime = UnixTime.ConvertSecondToFormat(curTime, UnixTime.Format_dd_hh_mm),
                startRegistrationTime = UnixTime.ConvertSecondToFormat(startRegistrationTime, UnixTime.Format_dd_hh_mm),
                startVoteTime = UnixTime.ConvertSecondToFormat(startVoteTime, UnixTime.Format_dd_hh_mm),
                endVoteTime = UnixTime.ConvertSecondToFormat(endVoteTime, UnixTime.Format_dd_hh_mm),
                candidatesCount,
                activeOfficersCount

            });

        }


        [HttpGet]
        [ApiAntiForgeryValidate]
        public IHttpActionResult TestPushFakeVoice()
        {

            var votePeriod = _confederationService.VotingInProgress;
            if (!votePeriod) return Json(Error.IsNotVotePeriod);

            var candidates = _confederationService.GetCandidates(false);
            var candidateUserIds = candidates.Select(i => i.UserId).ToList();
            if (!candidateUserIds.Any()) return Json("Candidates not exist");

            var candidatUserId = candidateUserIds[Rand.Next(0, candidateUserIds.Count)];
            int voterUserId = 0;
            bool error = false;
            _provider.ContextAction(c =>
            {
                var votedUsers = c.c_vote.Select(i => i.voterUserId).ToList();
                var dbUser = c.user.FirstOrDefault(i => i.Id > 1000 && !votedUsers.Contains(i.Id));
                if (dbUser == null)
                {
                    error = true;
                    return;
                }
                voterUserId = dbUser.Id;

            });

            if (error) return Json("voters is ended");

            var updatedCandidates = _confederationService.AddVote(candidatUserId, voterUserId);

            _hub.Clients.All.onConfederationCandidatesUpdated(updatedCandidates, true);
            return Json(updatedCandidates);

        }
        [HttpGet]
        [ApiAntiForgeryValidate]
        public IHttpActionResult TestFakeRegister()
        {
            var votePeriod = _confederationService.VotingInProgress;
            if (votePeriod) return Json(Error.TimeVotingIsNotOver);
            var candidat = new CandidatOut();
            _provider.ContextAction(c =>
            {
                var registred = c.c_officer_candidat.Select(i => new { i.user.pvpPoint, i.userId }).OrderByDescending(i => i.pvpPoint);
                var existUserIds = registred.Select(i => i.userId).ToList();
                var minPvp = registred.Take(10).Select(i => i.pvpPoint).Min();

                var potentialUsers = c.user.FirstOrDefault(i => i.pvpPoint > minPvp && !existUserIds.Contains(i.Id));

                if (potentialUsers == null)
                {
                    throw new Exception("Users is over need relod");
                }
                candidat.PvpPoint = potentialUsers.pvpPoint;
                candidat.UserName = potentialUsers.nickname;
                candidat.UserId = potentialUsers.Id;

            });

            var newBalaneCc = 0;
            var newCandidates = _confederationService.RegisterCandidate(candidat, (cc) => { newBalaneCc = cc; });
            _hub.Clients.All.onConfederationCandidatesUpdated(newCandidates, true);
            return Json(new
            {
                newCandidates,
                newBalaneCc
            }
        );

        }

        [HttpGet]
        [ApiAntiForgeryValidate]
        public IHttpActionResult TestGetMax()
        {
            int maxDate = 0;
            return Json("Hi");

            _provider.ContextAction(c =>
            {
                var max = c.c_officer_candidat.LastOrDefault(i => i.dateCreate == 1234);
                if (max != null)
                {
                    maxDate = max.dateCreate;
                }
            });

            return Json("max : " + maxDate);
        }

    }


}