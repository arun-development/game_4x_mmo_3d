using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Server.Core.Interfaces.ForModel;
using Server.DataLayer;

namespace Server.Core.Infrastructure.Alliance
{
    public enum ArmAllianceAcceptedStatus : byte
    {
        NoAction = 1,
        Accept = 2,
        Reject =3
    }
    public enum MessageSourceType : byte
    {
        IsAlliance = 1,
        IsUser = 2
    }

    public interface IAllianceUserAccept
    {
        bool UserAccepted { get; set; }
        ArmAllianceAcceptedStatus AllianceAccepted { get; set; }
    }

    public class AllianceMessageModelExt
    {
        public AllianceRequestMessageDataModel Model { get; set; }
        public bool FromAlliance { get; set; }
        public byte AllianceRoleId { get; set; }
        public int  AllianceUserId { get; set; }
    }


    public class AllianceUserRequestItem : IAllianceUserAccept
    {
        /// <summary>
        ///     if in alliance manage tab  is requester user name
        ///     else if is in my alliance tab is request target alliance name
        /// </summary>
        [MaxLength(14)]
        public string GroupName { get; set; }

        /// <summary>
        ///     see GroupName equal GroupName but for Id
        /// </summary>
        public int GroupId { get; set; }

        public List<AllianceRequestMessageDataModel> Messages { get; set; }
        public bool UserAccepted { get; set; } = false;
        public ArmAllianceAcceptedStatus AllianceAccepted { get; set; } = ArmAllianceAcceptedStatus.NoAction;
    }


    public interface IAllianceUserRequests : IComplexButtonView
    {
        IList<AllianceUserRequestItem> Requests { get; set; }
        int LastUpdateTime { get;}
        
    }
    public interface IAllianceUserRequestInst 
    {
        IAllianceUserRequests AllianceUserRequests { get; set; }
    }

    
}