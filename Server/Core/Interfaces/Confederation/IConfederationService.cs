using System;
using System.Collections.Generic;
using System.Data;
using Server.Core.Images;
using Server.Core.Interfaces.ForModel;
using Server.Core.Interfaces.UserServices;
using Server.Core.StaticData;
using Server.DataLayer;
using Server.Modules.Localize;

namespace Server.Core.Interfaces.Confederation {
    public enum OfficerTypes : byte {
        President = 1,
        Atacker = 2,
        Protector = 3,
        Supporter = 4
    }

    public interface IOfficerDataModel : IUniqueIdElement, IUserIdProperty {
        OfficerTypes Type { get; set; }
        int? AllianceId { get; set; }
        bool Elected { get; set; }
        int? AppointedUserId { get; set; }
        int DateStart { get; set; }
        int DateEnd { get; set; }
    }

    public interface IUserOfficerOut : IOfficerDataModel, IUserNameProperty {
        UserImageModel AllianceLabel { get; set; }
        string AllianceName { get; set; }
        UserImageModel UserAvatar { get; set; }
    }


    public interface IOfficerBase : ITranslateL10NProperty {
        OfficerStats Stats { get; set; }
        OfficerTypes Type { get; set; }
    }

    public interface IOfficerOut : IOfficerBase {
        IUserOfficerOut Appointed { get; set; }
        IUserOfficerOut Elected { get; set; }
    }

    public class OfficerBase : IOfficerBase {
        public OfficerBase() { }

        public OfficerBase(IOfficerBase other) {
            Type = other.Type;
            Translate = other.Translate;
            Stats = other.Stats;
        }

        public OfficerTypes Type { get; set; }
        public L10N Translate { get; set; }
        public OfficerStats Stats { get; set; }
    }


    public class OfficerStatsBase : BattleStatsInt {
        public bool CastAlliance { get; set; }

        /// <summary>
        ///     Сконвертированые % в значения (поделенные на 100)
        /// </summary>
        public override IBattleStatsDouble DoubleStats =>
            _doubleStats ?? (_doubleStats = new BattleStatsDouble(Attack * 0.01, Hp * 0.01));
    }

    public class OfficerStats : OfficerStatsBase {
        public string AttackView => Attack + "%";
        public string HpView => Hp + "%";
    }


    public class CandidatOut : IUniqueIdElement, IPvpPointroperty, IUserIdProperty, IUserNameProperty {
        public int Voices { get; set; }
        public int TotalVoices { get; set; }
        public int Persent { get; private set; }
        public int PvpPoint { get; set; }
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }

        public void SetPersent() {
            if (Voices == 0) {
                return;
            }
            if (TotalVoices == 0) {
                return;
            }
            // ReSharper disable once PossibleLossOfFraction
            Persent = (int) Math.Floor((decimal) (TotalVoices / Voices));
        }

        public void ValidateRegistrate() {
            if (UserId == 0) {
                throw new Exception(Error.UserIdNotSetInInstance);
            }
            if (string.IsNullOrWhiteSpace(UserName)) {
                throw new Exception(Error.UserNameNotExsist);
            }
        }
    }

    public class UserRattingItem : IUserIdProperty, IUserNameProperty, IPvpPointroperty {
        public UserRattingItem() { }

        public UserRattingItem(UserDataModel um, int top) {
            UserId = um.Id;
            UserName = um.Nickname;
            PvpPoint = um.PvpPoint;

            Top = top;
        }

        public int Top { get; set; }
        public int PvpPoint { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
    }


    public interface IOfficerService {
        List<IOfficerOut> GetOfficers(IDbConnection connection, bool periodIsCheked);

        IUserOfficerOut SetNewOfficerByPresident(IDbConnection connection, IUserOfficerOut newOfficer, int presidentOfficerId, int presidentUserId);

        IBattleStatsDouble GetOfficerBonus(IDbConnection connection, int allianceId);
    }


    public interface IVotingService {
        List<CandidatOut> RegisterCandidate(IDbConnection connection, CandidatOut candidat, Action<int> setCcToData);
        List<CandidatOut> AddVote(IDbConnection connection, int candidateId, int voterUserId);
        List<CandidatOut> GetCandidates(IDbConnection connection, bool periodIsCheked);
    }

    public interface IConfederationService : IOfficerService, IVotingService, ITest {
        List<UserRattingItem> RatingGetNextPage(IDbConnection connection, IGameUserService gu, int skip);
        UserRattingItem RatingGetUser(IDbConnection connection, IGameUserService gu, int userId);


        IPlanshetViewData InitialPlanshetConfederation(IDbConnection connection, IGameUserService gu);
        void OnAppStart(IDbConnection connection);
        void OnAppStop();
    }
}