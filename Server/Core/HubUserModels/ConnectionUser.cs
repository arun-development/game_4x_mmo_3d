
using System.Collections.Generic;

using System.Runtime.Serialization;

using Server.Core.Interfaces;
using Server.Modules.Localize;

namespace Server.Core.HubUserModels
{
    public enum CuAdvancedDataKeys
    {
        VoteSended = 1,
        RegistratedInVote = 2
    }
    public class ConnectionUser
    {
        public const string ViewKey = "ConnectionUser";
        public int UserId;
        public string Name;
        public string ConnectionId;
        public int AllianceId;
        public int AllianceUserId;
        public byte AllianceRoleId;
        public string AllianceName;
        public bool Connected;
        public int DateLeft;
        public int DateJoin;
        public LangKeys Lang;
        public Dictionary<string, IHubGroupItem> Groups   = new Dictionary<string, IHubGroupItem>();

        public Dictionary<CuAdvancedDataKeys, object> AdvancedData = new Dictionary<CuAdvancedDataKeys, object>();



        //[XmlIgnore]
        //[ScriptIgnore]
        //[Browsable(false)]
        [IgnoreDataMember]
        public string AuthId { get; set; } 

    }
}